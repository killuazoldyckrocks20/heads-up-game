/**
 * Heads Up! Master App Controller
 * Ties together UI, Game Engine, Deck Manager, Audio, Motion, and Camera.
 */

import { sounds } from './audio.js';
import { deckManager } from './decks.js';
import { GameEngine, GAME_STATES } from './game.js';
import { confetti } from './confetti.js';

class HeadsUpApp {
  constructor() {
    this.currentCategoryFilter = 'all';
    this.editingDeckId = null;

    // Elements
    this.views = {
      home: document.getElementById('view-home'),
      countdown: document.getElementById('view-countdown'),
      game: document.getElementById('view-game'),
      summary: document.getElementById('view-summary')
    };

    // Modals
    this.modals = {
      settings: document.getElementById('modal-settings'),
      createDeck: document.getElementById('modal-create-deck'),
      instructions: document.getElementById('modal-instructions')
    };

    // HUD Elements
    this.hudTimer = document.getElementById('hud-timer');
    this.hudScore = document.getElementById('hud-score');
    this.hudDeckName = document.getElementById('hud-deck-name');
    this.cardText = document.getElementById('active-card-text');
    this.cardSub = document.getElementById('active-card-sub');
    this.countdownNumber = document.getElementById('countdown-number');
    this.flashCorrect = document.getElementById('flash-correct');
    this.flashPass = document.getElementById('flash-pass');

    // Summary Elements
    this.summaryTitle = document.getElementById('summary-headline');
    this.summaryDeckBadge = document.getElementById('summary-deck-badge');
    this.summaryHighScoreBanner = document.getElementById('summary-high-score-banner');
    this.statScore = document.getElementById('stat-score');
    this.statPassed = document.getElementById('stat-passed');
    this.statAccuracy = document.getElementById('stat-accuracy');
    this.statTotal = document.getElementById('stat-total');
    this.summaryHistoryList = document.getElementById('summary-history-list');
    this.reactionVideoBox = document.getElementById('reaction-video-box');
    this.reactionVideoPlayer = document.getElementById('reaction-video-player');
    this.btnDownloadVideo = document.getElementById('btn-download-video');

    // Settings elements
    this.settingTimerBtns = document.querySelectorAll('#setting-timer .segmented-btn');
    this.settingMotion = document.getElementById('setting-motion');
    this.settingCamera = document.getElementById('setting-camera');
    this.settingVolume = document.getElementById('setting-volume');
    this.btnSoundToggle = document.getElementById('btn-sound-toggle');
    this.btnFullscreen = document.getElementById('btn-fullscreen');

    // Decks grid & category chips
    this.decksGrid = document.getElementById('decks-grid');
    this.categoryFilter = document.getElementById('category-filter');

    // Custom Deck Form Elements
    this.customTitle = document.getElementById('custom-deck-title');
    this.customEmoji = document.getElementById('custom-deck-emoji');
    this.customColor = document.getElementById('custom-deck-color');
    this.customDesc = document.getElementById('custom-deck-description');
    this.customWords = document.getElementById('custom-deck-words');
    this.customWordsCount = document.getElementById('custom-words-count');
    this.btnSaveCustom = document.getElementById('btn-save-custom-deck');

    // Initialize Game Engine
    this.game = new GameEngine({
      onStateChange: (state, payload) => this.handleStateChange(state, payload),
      onCountdownTick: (num) => this.handleCountdownTick(num),
      onTick: (timeLeft, totalTime) => this.handleTimerTick(timeLeft, totalTime),
      onCardChange: (card, deck) => this.handleCardChange(card, deck),
      onFlash: (type, onDone) => this.handleFlash(type, onDone),
      onNeutral: () => this.handleNeutral(),
      onGameOver: (results) => this.handleGameOver(results)
    });

    this.initEventListeners();
    this.loadSavedSettings();
    this.renderDecks();
  }

  // View Navigation
  showView(viewName) {
    Object.keys(this.views).forEach(key => {
      if (this.views[key]) {
        this.views[key].classList.toggle('active', key === viewName);
      }
    });

    // Cleanup confetti if leaving summary
    if (viewName !== 'summary') {
      confetti.clear();
    }
  }

  // Modal Management
  openModal(modalKey) {
    sounds.ensureReady();
    if (this.modals[modalKey]) {
      this.modals[modalKey].classList.add('active');
    }
  }

  closeAllModals() {
    Object.values(this.modals).forEach(m => m.classList.remove('active'));
  }

  // Toast alerts
  showToast(message, durationMs = 2400) {
    const toast = document.getElementById('toast-message');
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, durationMs);
  }

  // Settings sync
  loadSavedSettings() {
    const savedTimer = localStorage.getItem('heads_up_timer');
    if (savedTimer) {
      const duration = parseInt(savedTimer, 10);
      this.game.roundDurationSec = duration;
      this.settingTimerBtns.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.time, 10) === duration);
      });
    }

    const savedMotion = localStorage.getItem('heads_up_motion');
    if (savedMotion !== null) {
      const enabled = savedMotion === 'true';
      this.game.isMotionControlEnabled = enabled;
      this.settingMotion.checked = enabled;
    }

    const savedCamera = localStorage.getItem('heads_up_camera');
    if (savedCamera !== null) {
      const enabled = savedCamera === 'true';
      this.game.isReactionCamEnabled = enabled;
      this.settingCamera.checked = enabled;
    }
  }

  // Render Decks in Grid
  renderDecks() {
    this.decksGrid.innerHTML = '';
    const allDecks = deckManager.getAllDecks();

    const filtered = allDecks.filter(deck => {
      if (this.currentCategoryFilter === 'all') return true;
      if (this.currentCategoryFilter === 'Custom') return !!deck.isCustom;
      return deck.category === this.currentCategoryFilter;
    });

    if (filtered.length === 0) {
      this.decksGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding: 48px 20px; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 12px;">📦</div>
          <h3>No decks in this category yet!</h3>
          <p style="margin-top: 6px;">Tap "+ Create Deck" to build your own custom deck in seconds.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(deck => {
      const highScore = deckManager.getHighScore(deck.id);
      const card = document.createElement('div');
      card.className = 'deck-card';
      card.style.setProperty('--deck-color', deck.color);
      card.style.setProperty('--deck-glow', `${deck.color}40`);

      card.innerHTML = `
        <div class="deck-header">
          <div class="deck-emoji">${deck.emoji}</div>
          <span class="deck-badge">${deck.category}</span>
        </div>
        <div class="deck-body">
          <h3>${deck.title}</h3>
          <p>${deck.description}</p>
        </div>
        <div class="deck-footer">
          <div class="deck-stats">
            <span>🃏 ${deck.cards.length} cards</span>
            ${highScore > 0 ? `<span>🏆 Best: ${highScore}</span>` : ''}
          </div>
          <button class="deck-play-btn" data-deck-id="${deck.id}">PLAY ▶</button>
        </div>
      `;

      card.addEventListener('click', (e) => {
        // Play deck
        this.startRoundWithDeck(deck.id);
      });

      this.decksGrid.appendChild(card);
    });
  }

  startRoundWithDeck(deckId) {
    sounds.ensureReady();
    this.game.startCountdown(deckId);
  }

  // Game Engine Callbacks
  handleStateChange(state, payload) {
    switch (state) {
      case GAME_STATES.HOME:
        this.showView('home');
        this.renderDecks();
        break;
      case GAME_STATES.COUNTDOWN:
        this.showView('countdown');
        break;
      case GAME_STATES.PLAYING:
        this.showView('game');
        this.hudScore.textContent = 'Score: 0';
        break;
      case GAME_STATES.SUMMARY:
        this.showView('summary');
        break;
    }
  }

  handleCountdownTick(num) {
    this.countdownNumber.textContent = num;
  }

  handleTimerTick(timeLeft, totalTime) {
    this.hudTimer.textContent = timeLeft;
    this.hudTimer.classList.toggle('urgent', timeLeft <= 10);
  }

  handleCardChange(card, deck) {
    this.cardText.textContent = card;
    this.cardSub.textContent = deck.title;
    this.hudDeckName.textContent = deck.emoji + ' ' + deck.title;

    // Dynamically adjust font size for very long titles
    if (card.length > 25) {
      this.cardText.style.fontSize = 'clamp(1.8rem, 6vw, 3.2rem)';
    } else if (card.length > 15) {
      this.cardText.style.fontSize = 'clamp(2.4rem, 7.5vw, 4.5rem)';
    } else {
      this.cardText.style.fontSize = 'clamp(2.8rem, 8.5vw, 6rem)';
    }

    // Update live score tally
    const currentScore = this.game.history.filter(h => h.outcome === 'correct').length;
    this.hudScore.textContent = `Score: ${currentScore}`;
  }

  handleFlash(type, onDone) {
    const flashEl = type === 'correct' ? this.flashCorrect : this.flashPass;
    flashEl.classList.add('active');

    setTimeout(() => {
      flashEl.classList.remove('active');
      if (onDone) onDone();
    }, 280);
  }

  handleNeutral() {
    // Player returned to upright forehead angle
  }

  handleGameOver(results) {
    this.summaryTitle.textContent = results.score >= 10 ? 'Unstoppable!' :
                                    results.score >= 5 ? 'Great Round!' : 'Good Effort!';
    this.summaryDeckBadge.textContent = `${results.deck.emoji} ${results.deck.title}`;

    this.statScore.textContent = results.score;
    this.statPassed.textContent = results.passed;
    this.statAccuracy.textContent = `${results.accuracy}%`;
    this.statTotal.textContent = results.total;

    this.summaryHighScoreBanner.classList.toggle('show', results.isNewHighScore && results.score > 0);

    // Burst confetti for celebratory score
    if (results.score >= 4) {
      setTimeout(() => confetti.burst(results.score > 8 ? 160 : 90), 300);
    }

    // Populate History List
    this.summaryHistoryList.innerHTML = '';
    if (results.history.length === 0) {
      this.summaryHistoryList.innerHTML = `<div style="text-align:center; padding:16px; color:var(--text-muted);">No words were guessed.</div>`;
    } else {
      results.history.forEach(item => {
        const row = document.createElement('div');
        row.className = `history-item outcome-${item.outcome}`;
        row.innerHTML = `
          <span>${item.card}</span>
          <span class="history-tag">${item.outcome === 'correct' ? '✓ CORRECT' : '⏭ PASSED'}</span>
        `;
        this.summaryHistoryList.appendChild(row);
      });
    }

    // Reaction Video Replay
    if (results.videoUrl) {
      this.reactionVideoBox.classList.add('active');
      this.reactionVideoPlayer.src = results.videoUrl;
      this.btnDownloadVideo.href = results.videoUrl;
      this.reactionVideoPlayer.load();
    } else {
      this.reactionVideoBox.classList.remove('active');
      this.reactionVideoPlayer.src = '';
    }
  }

  // Event Listeners Setup
  initEventListeners() {
    // Header Buttons
    document.getElementById('btn-create-deck-top').addEventListener('click', () => {
      this.openCreateDeckModal();
    });

    document.getElementById('btn-how-to-play').addEventListener('click', () => {
      this.openModal('instructions');
    });

    document.getElementById('btn-settings').addEventListener('click', () => {
      this.openModal('settings');
    });

    // Sound Mute Toggle
    this.btnSoundToggle.addEventListener('click', () => {
      const isMuted = sounds.toggleMute();
      this.btnSoundToggle.textContent = isMuted ? '🔇' : '🔊';
      this.showToast(isMuted ? 'Sound Muted' : 'Sound Enabled');
    });

    // Fullscreen Toggle
    this.btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        this.btnFullscreen.textContent = '🗗';
      } else {
        document.exitFullscreen().catch(() => {});
        this.btnFullscreen.textContent = '⛶';
      }
    });

    // Quick Play Hero button
    document.getElementById('btn-quick-play').addEventListener('click', () => {
      this.startRoundWithDeck('movies');
    });

    // Category Filter Chips
    this.categoryFilter.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-chip')) {
        this.categoryFilter.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        this.currentCategoryFilter = e.target.dataset.category;
        this.renderDecks();
      }
    });

    // Cancel Countdown
    document.getElementById('btn-cancel-countdown').addEventListener('click', () => {
      this.game.cancelRound();
    });

    // Touch Zones during Gameplay
    document.getElementById('touch-correct').addEventListener('click', () => {
      this.game.markCorrect();
    });

    document.getElementById('touch-pass').addEventListener('click', () => {
      this.game.markPass();
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (this.game.state === GAME_STATES.PLAYING) {
        if (e.code === 'ArrowDown' || e.code === 'KeyC' || e.code === 'Space') {
          e.preventDefault();
          this.game.markCorrect();
        } else if (e.code === 'ArrowUp' || e.code === 'KeyP') {
          e.preventDefault();
          this.game.markPass();
        } else if (e.code === 'Escape') {
          this.game.cancelRound();
        }
      } else if (this.game.state === GAME_STATES.COUNTDOWN && e.code === 'Escape') {
        this.game.cancelRound();
      }
    });

    // Summary View Buttons
    document.getElementById('btn-play-again').addEventListener('click', () => {
      if (this.game.currentDeck) {
        this.startRoundWithDeck(this.game.currentDeck.id);
      } else {
        this.showView('home');
      }
    });

    document.getElementById('btn-home-from-summary').addEventListener('click', () => {
      this.showView('home');
    });

    // Share Score
    document.getElementById('btn-share-score').addEventListener('click', async () => {
      const score = this.statScore.textContent;
      const deckName = this.game.currentDeck ? this.game.currentDeck.title : 'Heads Up';
      const shareText = `👑 I scored ${score} points in "${deckName}" on Heads Up! Can you beat my score? 🎉`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Heads Up! Score',
            text: shareText,
            url: window.location.href
          });
          return;
        } catch (e) {}
      }

      // Fallback: Copy to Clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        this.showToast('Score copied to clipboard! Paste anywhere to share.');
      } else {
        this.showToast(`Your score: ${score}!`);
      }
    });

    // Close Modal buttons
    document.querySelectorAll('.btn-close-modal').forEach(btn => {
      btn.addEventListener('click', () => this.closeAllModals());
    });

    // Close on backdrop click
    Object.values(this.modals).forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeAllModals();
      });
    });

    // Settings: Timer
    this.settingTimerBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.settingTimerBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const sec = parseInt(btn.dataset.time, 10);
        this.game.roundDurationSec = sec;
        localStorage.setItem('heads_up_timer', sec.toString());
      });
    });

    // Settings: Motion Toggle
    this.settingMotion.addEventListener('change', (e) => {
      this.game.isMotionControlEnabled = e.target.checked;
      localStorage.setItem('heads_up_motion', e.target.checked.toString());
      if (e.target.checked) {
        this.showToast('Motion tilt enabled (Forehead mode)');
      } else {
        this.showToast('Motion tilt disabled (Touch mode)');
      }
    });

    // Settings: Camera Toggle
    this.settingCamera.addEventListener('change', (e) => {
      this.game.isReactionCamEnabled = e.target.checked;
      localStorage.setItem('heads_up_camera', e.target.checked.toString());
      if (e.target.checked) {
        this.showToast('Reaction Camera Enabled!');
      } else {
        this.showToast('Reaction Camera Disabled');
      }
    });

    // Settings: Volume
    this.settingVolume.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      sounds.setVolume(val);
    });

    // Custom Deck: Word count live update
    this.customWords.addEventListener('input', () => {
      const words = this.parseWordsText(this.customWords.value);
      this.customWordsCount.textContent = `${words.length} card${words.length === 1 ? '' : 's'}`;
    });

    // Custom Deck: Save
    this.btnSaveCustom.addEventListener('click', () => {
      this.saveCustomDeckForm();
    });

    // Custom Deck: Export JSON
    document.getElementById('btn-export-decks').addEventListener('click', () => {
      const jsonStr = deckManager.exportCustomDecksJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `heads-up-custom-decks-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      this.showToast('Custom decks exported!');
    });

    // Custom Deck: Import JSON
    const fileImportInput = document.getElementById('file-import-decks');
    document.getElementById('btn-import-decks').addEventListener('click', () => {
      fileImportInput.click();
    });

    fileImportInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const ok = deckManager.importCustomDecksJson(evt.target.result);
        if (ok) {
          this.renderDecks();
          this.showToast('Decks imported successfully!');
          this.closeAllModals();
        } else {
          this.showToast('Failed to parse deck file.');
        }
      };
      reader.readAsText(file);
    });
  }

  // Custom Deck Form Handling
  openCreateDeckModal() {
    this.customTitle.value = '';
    this.customEmoji.value = '✨';
    this.customColor.value = '#ec4899';
    this.customDesc.value = '';
    this.customWords.value = '';
    this.customWordsCount.textContent = '0 cards';
    document.getElementById('custom-deck-modal-title').textContent = 'Create Custom Deck';
    this.editingDeckId = null;
    this.openModal('createDeck');
  }

  parseWordsText(text) {
    return text
      .split(/[\n,]+/)
      .map(w => w.trim())
      .filter(w => w.length > 0);
  }

  saveCustomDeckForm() {
    const title = this.customTitle.value.trim();
    const emoji = this.customEmoji.value.trim() || '✨';
    const color = this.customColor.value;
    const desc = this.customDesc.value.trim();
    const words = this.parseWordsText(this.customWords.value);

    if (!title) {
      this.showToast('Please enter a deck title!');
      this.customTitle.focus();
      return;
    }

    if (words.length < 3) {
      this.showToast('Please add at least 3 cards/words!');
      this.customWords.focus();
      return;
    }

    const newDeck = deckManager.addCustomDeck({
      title,
      description: desc || `${words.length} custom cards created by you`,
      emoji,
      color,
      cards: words
    });

    this.closeAllModals();
    this.renderDecks();
    this.showToast(`"${title}" deck created!`);

    // Prompt to play immediately
    this.startRoundWithDeck(newDeck.id);
  }
}

// Instantiate App when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.headsUpApp = new HeadsUpApp();

  // Register PWA Service Worker for offline play
  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    navigator.serviceWorker.register('sw.js').catch((err) => {
      console.warn('SW registration skipped:', err);
    });
  }
});
