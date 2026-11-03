/**
 * Heads Up! Motion & Gyroscope Controller
 * Handles DeviceOrientationEvent with adaptive calibration, hysteresis state-machine,
 * iOS 13+ permission gating, and haptic feedback.
 */

export class MotionController {
  constructor(onCorrect, onPass, onNeutral) {
    this.onCorrect = onCorrect;
    this.onPass = onPass;
    this.onNeutral = onNeutral;

    this.isListening = false;
    this.hasPermission = false;
    this.isSupported = false;

    // Hysteresis states: 'neutral', 'down', 'up'
    this.state = 'neutral';
    this.cooldownUntil = 0;
    this.cooldownMs = 450; // Prevent spamming cards

    // Calibrated thresholds
    // When held against the forehead:
    // Beta/Gamma depends on landscape orientation:
    // We compute effective pitch angle from beta & gamma
    this.neutralMin = 60;
    this.neutralMax = 120;
    this.tiltDownThreshold = 40;  // Node down towards floor (< 40°)
    this.tiltUpThreshold = 140;   // Tilt head back towards ceiling (> 140°)

    this.lastPitch = 90;
    this.handleOrientation = this.handleOrientation.bind(this);
  }

  static isAvailable() {
    return 'DeviceOrientationEvent' in window;
  }

  static requiresPermission() {
    return typeof DeviceOrientationEvent !== 'undefined' &&
           typeof DeviceOrientationEvent.requestPermission === 'function';
  }

  async requestPermission() {
    if (!MotionController.isAvailable()) {
      return false;
    }

    if (MotionController.requiresPermission()) {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        this.hasPermission = response === 'granted';
        return this.hasPermission;
      } catch (err) {
        console.warn('DeviceOrientation permission request rejected:', err);
        this.hasPermission = false;
        return false;
      }
    } else {
      // Android and older iOS grant automatically
      this.hasPermission = true;
      return true;
    }
  }

  start() {
    if (this.isListening) return;
    this.state = 'neutral';
    this.cooldownUntil = Date.now() + 600; // brief warmup

    window.addEventListener('deviceorientation', this.handleOrientation, true);
    this.isListening = true;
  }

  stop() {
    if (!this.isListening) return;
    window.removeEventListener('deviceorientation', this.handleOrientation, true);
    this.isListening = false;
    this.state = 'neutral';
  }

  vibrate(pattern = [50]) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }

  handleOrientation(e) {
    if (!this.isListening) return;

    // e.beta: [-180, 180] (pitch)
    // e.gamma: [-90, 90] (roll)
    let beta = e.beta;
    let gamma = e.gamma;

    if (beta === null || gamma === null) return;

    // Detect screen orientation (landscape primary/secondary or portrait)
    let orientation = 0;
    if (screen.orientation && typeof screen.orientation.angle === 'number') {
      orientation = screen.orientation.angle;
    } else if (typeof window.orientation === 'number') {
      orientation = window.orientation;
    }

    // Compute effective pitch based on holding phone in landscape on forehead
    let pitch = 90;

    if (orientation === 90) {
      // Landscape rotated left: gamma represents pitch
      pitch = 90 - gamma;
    } else if (orientation === -90 || orientation === 270) {
      // Landscape rotated right: gamma inverted represents pitch
      pitch = 90 + gamma;
    } else {
      // Portrait or default: beta is pitch
      pitch = beta;
    }

    // Normalize pitch into 0..180 range
    if (pitch < 0) pitch += 180;
    this.lastPitch = pitch;

    const now = Date.now();
    if (now < this.cooldownUntil) return;

    // State Machine with Hysteresis
    if (this.state === 'neutral') {
      // 1. Tilt DOWN -> CORRECT!
      if (pitch < this.tiltDownThreshold) {
        this.state = 'down';
        this.cooldownUntil = now + this.cooldownMs;
        this.vibrate([60, 40, 80]);
        if (this.onCorrect) this.onCorrect();
      }
      // 2. Tilt UP -> PASS!
      else if (pitch > this.tiltUpThreshold) {
        this.state = 'up';
        this.cooldownUntil = now + this.cooldownMs;
        this.vibrate([40]);
        if (this.onPass) this.onPass();
      }
    } else {
      // Waiting for player to return to neutral (forehead upright)
      if (pitch >= this.neutralMin && pitch <= this.neutralMax) {
        this.state = 'neutral';
        if (this.onNeutral) this.onNeutral();
      }
    }
  }
}
