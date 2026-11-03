/**
 * Heads Up! Core Game Engine
 * Manages game state, card progression, round timer, scoring, wake lock,
 * and audio/haptic dispatch.
 */

import { sounds } from './audio.js';
import { MotionController } from './motion.js';
import { reactionCamera } from './camera.js';
import { deckManager } from './decks.js';

export const GAME_STATES = {
  HOME: 'home',
  COUNTDOWN: 'countdown',
  PLAYING: 'playing',
  FLASH: 'flash',
  SUMMARY: 'summary'
};

export class GameEngine {
  constructor(callbacks = {}) {
    this.callbacks = {
      onStateChange: () => {},
      onTick: () => {},
      onCardChange: () => {},
      onFlash: () => {},
      onGameOver: () => {},
      ...callbacks
    };

    this.state = GAME_STATES.HOME;
    this.currentDeck = null;
    this.cardsQueue = [];
    this.currentCard = '';
    this.cardIndex = 0;

    // Settings
    this.roundDurationSec = 60;
    this.isReactionCamEnabled = false;
    this.isMotionControlEnabled = true;

    // Round stats
    this.timeRemaining = 60;
    this.timerInterval = null;
    this.roundStartTime = 0;
    this.history = []; // { word: string, outcome: 'correct' | 'pass', timestamp: number }

    // Wake lock to keep screen awake during play
    this.wakeLock = null;

    // Motion Controller
    this.motion = new MotionController(
      () => this.markCorrect(),
      () => this.markPass(),
      () => this.onReturnToNeutral()
    );

    this.isCardTransitioning = false;
  }

  // Shuffle array using Fisher-Yates
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  async acquireWakeLock() {
    if ('wakeLock' in navigator) {
      try {
        this.wakeLock = await navigator.wakeLock.request('screen');
      } catch (err) {
        console.warn('Wake lock not granted:', err);
      }
    }
  }

  releaseWakeLock() {
    if (this.wakeLock) {
      this.wakeLock.release().catch(() => {});
      this.wakeLock = null;
    }
  }

  setState(newState, payload = {}) {
    this.state = newState;
    this.callbacks.onStateChange(newState, payload);
  }

  async startCountdown(deckId) {
    this.currentDeck = deckManager.getDeckById(deckId);
    this.cardsQueue = this.shuffle(this.currentDeck.cards);
    this.cardIndex = 0;
    this.history = [];
    this.timeRemaining = this.roundDurationSec;

    // Check motion permission if enabled
    if (this.isMotionControlEnabled) {
      await this.motion.requestPermission();
    }

    // Check camera if enabled
    if (this.isReactionCamEnabled) {
      await reactionCamera.initStream();
    }

    this.setState(GAME_STATES.COUNTDOWN, { deck: this.currentDeck });
    await this.acquireWakeLock();

    let count = 3;
    sounds.playCountdownBeep(523.25);
    this.callbacks.onCountdownTick(count);

    const countdownTimer = setInterval(() => {
      count--;
      if (count > 0) {
        sounds.playCountdownBeep(523.25 + (3 - count) * 60);
        this.callbacks.onCountdownTick(count);
      } else {
        clearInterval(countdownTimer);
        sounds.playGoSound();
        this.callbacks.onCountdownTick('GO!');
        setTimeout(() => {
          this.beginRound();
        }, 500);
      }
    }, 1000);
  }

  beginRound() {
    this.setState(GAME_STATES.PLAYING);
    this.roundStartTime = Date.now();
    this.nextCard();

    if (this.isMotionControlEnabled) {
      this.motion.start();
    }

    if (this.isReactionCamEnabled) {
      reactionCamera.startRecording();
    }

    // Game loop timer
    const targetEnd = Date.now() + (this.roundDurationSec * 1000);

    this.timerInterval = setInterval(() => {
      const msLeft = targetEnd - Date.now();
      const secLeft = Math.max(0, Math.ceil(msLeft / 1000));
      this.timeRemaining = secLeft;

      this.callbacks.onTick(secLeft, this.roundDurationSec);

      if (secLeft <= 10 && secLeft > 0) {
        sounds.playTickSound(secLeft <= 5);
      }

      if (secLeft <= 0) {
        this.endRound();
      }
    }, 250);
  }

  nextCard() {
    if (this.cardIndex >= this.cardsQueue.length) {
      // Re-shuffle to never run out of cards
      this.cardsQueue = this.cardsQueue.concat(this.shuffle(this.currentDeck.cards));
    }
    this.currentCard = this.cardsQueue[this.cardIndex];
    this.cardIndex++;
    this.callbacks.onCardChange(this.currentCard, this.currentDeck);
  }

  markCorrect() {
    if (this.state !== GAME_STATES.PLAYING || this.isCardTransitioning) return;

    this.isCardTransitioning = true;
    sounds.playCorrectSound();

    this.history.push({
      card: this.currentCard,
      outcome: 'correct',
      timestamp: Date.now()
    });

    this.callbacks.onFlash('correct', () => {
      this.nextCard();
      this.isCardTransitioning = false;
    });
  }

  markPass() {
    if (this.state !== GAME_STATES.PLAYING || this.isCardTransitioning) return;

    this.isCardTransitioning = true;
    sounds.playPassSound();

    this.history.push({
      card: this.currentCard,
      outcome: 'pass',
      timestamp: Date.now()
    });

    this.callbacks.onFlash('pass', () => {
      this.nextCard();
      this.isCardTransitioning = false;
    });
  }

  onReturnToNeutral() {
    this.callbacks.onNeutral();
  }

  async endRound() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;

    sounds.playBuzzerSound();
    this.motion.stop();
    this.releaseWakeLock();

    let videoUrl = null;
    if (this.isReactionCamEnabled) {
      videoUrl = await reactionCamera.stopRecording();
    }

    const correctCount = this.history.filter(h => h.outcome === 'correct').length;
    const passCount = this.history.filter(h => h.outcome === 'pass').length;
    const totalCount = this.history.length;
    const isNewHighScore = deckManager.setHighScore(this.currentDeck.id, correctCount);

    if (correctCount >= 5) {
      setTimeout(() => sounds.playFanfare(), 600);
    }

    const results = {
      deck: this.currentDeck,
      score: correctCount,
      passed: passCount,
      total: totalCount,
      accuracy: totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0,
      isNewHighScore,
      history: this.history,
      videoUrl
    };

    this.setState(GAME_STATES.SUMMARY, results);
    this.callbacks.onGameOver(results);
  }

  cancelRound() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.motion.stop();
    this.releaseWakeLock();
    if (this.isReactionCamEnabled) {
      reactionCamera.stopRecording();
    }
    this.setState(GAME_STATES.HOME);
  }
}
