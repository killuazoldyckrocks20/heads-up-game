/**
 * Heads Up! Audio Engine
 * Uses Web Audio API for 100% self-contained, low-latency synthesized sound effects.
 * No external sound files or network requests required.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.volume = 0.7;
    this.muted = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized && this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;

      // Handle suspended context (browser autoplay policies)
      if (this.ctx.state === 'suspended') {
        const resume = () => {
          this.ctx.resume();
          window.removeEventListener('click', resume);
          window.removeEventListener('touchstart', resume);
        };
        window.addEventListener('click', resume, { once: true });
        window.addEventListener('touchstart', resume, { once: true });
      }
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  ensureReady() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.muted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.muted;
  }

  // 1. Countdown Tick (for 3, 2, 1)
  playCountdownBeep(frequency = 523.25) { // C5
    if (this.muted) return;
    this.ensureReady();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // 2. Countdown "GO!"
  playGoSound() {
    if (this.muted) return;
    this.ensureReady();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + (i * 0.04);

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + 0.35);
    });
  }

  // 3. CORRECT Sound: Bright, cheerful, rewarding arpeggio chime
  playCorrectSound() {
    if (this.muted) return;
    this.ensureReady();
    if (!this.ctx) return;

    const notes = [
      { f: 587.33, d: 0.12, t: 0.00 }, // D5
      { f: 739.99, d: 0.14, t: 0.07 }, // F#5
      { f: 880.00, d: 0.18, t: 0.14 }, // A5
      { f: 1174.66, d: 0.40, t: 0.21 } // D6
    ];

    const now = this.ctx.currentTime;

    notes.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + note.t;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, start);

      gain.gain.setValueAtTime(0.35, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + note.d);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + note.d);
    });
  }

  // 4. PASS Sound: Whoosh / descending soft glide
  playPassSound() {
    if (this.muted) return;
    this.ensureReady();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.22);

    // Filter to make it warm, not harsh
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  // 5. Urgent Clock Tick (last 10 seconds of round)
  playTickSound(isUrgent = false) {
    if (this.muted) return;
    this.ensureReady();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isUrgent ? 880 : 660, now);

    gain.gain.setValueAtTime(isUrgent ? 0.35 : 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // 6. Time's Up Buzzer: Authentic party game buzzer
  playBuzzerSound() {
    if (this.muted) return;
    this.ensureReady();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Two detuned sawtooth oscillators create a rich, buzzy tone
    [130.81, 138.59].forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.setValueAtTime(0.28, now + 0.55);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.75);
    });
  }

  // 7. Victory / High Score Fanfare
  playFanfare() {
    if (this.muted) return;
    this.ensureReady();
    if (!this.ctx) return;

    const chords = [
      { f: 523.25, t: 0.00, d: 0.15 }, // C5
      { f: 523.25, t: 0.15, d: 0.15 }, // C5
      { f: 523.25, t: 0.30, d: 0.15 }, // C5
      { f: 659.25, t: 0.45, d: 0.30 }, // E5
      { f: 783.99, t: 0.75, d: 0.20 }, // G5
      { f: 1046.50, t: 0.95, d: 0.60 } // C6
    ];

    const now = this.ctx.currentTime;
    chords.forEach(c => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + c.t;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(c.f, start);

      gain.gain.setValueAtTime(0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + c.d);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + c.d);
    });
  }
}

export const sounds = new SoundEngine();
