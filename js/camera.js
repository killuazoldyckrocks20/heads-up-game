/**
 * Heads Up! Reaction Camera
 * Records front-facing video of your friends giving clues during the round,
 * providing instant video replay and MP4/WebM download at the end of the round!
 */

export class ReactionCamera {
  constructor() {
    this.stream = null;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.videoUrl = null;
    this.isRecording = false;
    this.isEnabled = false;
  }

  static isSupported() {
    return !!(navigator.mediaDevices &&
              navigator.mediaDevices.getUserMedia &&
              window.MediaRecorder);
  }

  async initStream() {
    if (this.stream) return true;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 24 }
        },
        audio: true
      });
      return true;
    } catch (err) {
      console.warn('Reaction camera permission denied or unavailable:', err);
      this.stream = null;
      return false;
    }
  }

  startRecording() {
    if (!this.stream) return;
    this.recordedChunks = [];
    if (this.videoUrl) {
      URL.revokeObjectURL(this.videoUrl);
      this.videoUrl = null;
    }

    // Determine supported mime type
    let mimeType = 'video/webm;codecs=vp8,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        mimeType = 'video/webm';
      } else {
        mimeType = '';
      }
    }

    try {
      const options = mimeType ? { mimeType } : undefined;
      this.mediaRecorder = new MediaRecorder(this.stream, options);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(500); // 500ms time slice
      this.isRecording = true;
    } catch (e) {
      console.warn('Failed to start MediaRecorder:', e);
      this.isRecording = false;
    }
  }

  async stopRecording() {
    if (!this.mediaRecorder || !this.isRecording) {
      return null;
    }

    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        this.isRecording = false;
        if (this.recordedChunks.length > 0) {
          const type = this.mediaRecorder.mimeType || 'video/webm';
          const blob = new Blob(this.recordedChunks, { type });
          this.videoUrl = URL.createObjectURL(blob);
          resolve(this.videoUrl);
        } else {
          resolve(null);
        }
      };
      this.mediaRecorder.stop();
    });
  }

  stopStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isRecording = false;
  }
}

export const reactionCamera = new ReactionCamera();
