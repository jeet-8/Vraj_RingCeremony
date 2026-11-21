import eventConfig from '../../event.config.js';

/**
 * Shared Audio Singleton for Ring Ceremony
 * Handles real MP3 background music playback with:
 * - Smooth 2-second fade-in to comfortable volume (0.5)
 * - Smooth fade-out when muted
 * - Auto-looping
 * - Background tab pause / resume (visibilitychange)
 * - Safe user gesture unlocking (no autoplay errors)
 * - Shared single audio instance (no double playback on re-renders / re-open)
 */
class SoundEngine {
  constructor() {
    this.audioElement = null;
    this.audioCtx = null;
    this.isPlaying = false;
    this.isMuted = true;
    this.userExplicitlyMuted = false;
    this.wasPlayingBeforeHide = false;
    this.targetVolume = 0.5;
    this.fadeInterval = null;
    this.subscribers = new Set();
    this.hasUnlocked = false;

    // Check session storage for mute preference if available
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const savedMute = sessionStorage.getItem('vraj_music_muted');
        if (savedMute !== null) {
          this.userExplicitlyMuted = savedMute === 'true';
        }
      }
    } catch (e) {}

    // Setup visibilitychange listener once
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        this.handleVisibilityChange();
      });
    }
  }

  init() {
    if (this.audioElement) return;

    try {
      this.audioElement = new Audio();
      this.audioElement.loop = true;
      this.audioElement.preload = 'auto';
      this.audioElement.volume = 0;

      // Primary source from event.config.js (statically imported by Vite)
      const primarySrc = eventConfig?.music || eventConfig?.audio?.src || '/music/background-music.mp3';
      this.audioElement.src = primarySrc;

      // Fallback if primary fails
      this.audioElement.addEventListener('error', () => {
        if (this.audioElement && this.audioElement.src !== window.location.origin + '/music/background-music.mp3') {
          this.audioElement.src = '/music/background-music.mp3';
          this.audioElement.load();
        } else {
          console.info('Audio playback fallback active.');
        }
      });
    } catch (err) {
      console.warn('Audio element initialization skipped:', err);
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    callback({ isPlaying: this.isPlaying, isMuted: this.isMuted });
    return () => this.subscribers.delete(callback);
  }

  notify() {
    this.subscribers.forEach((cb) => {
      try {
        cb({ isPlaying: this.isPlaying, isMuted: this.isMuted });
      } catch (e) {}
    });
  }

  /**
   * Unlock audio context during first user gesture (seal tap or skip intro)
   */
  unlock() {
    this.init();
    this.hasUnlocked = true;

    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
    } catch (e) {}
  }

  /**
   * Start playback with smooth 2-second fade in to volume 0.5
   */
  play() {
    this.init();
    if (!this.hasUnlocked) {
      this.unlock();
    }

    this.userExplicitlyMuted = false;
    try {
      sessionStorage.setItem('vraj_music_muted', 'false');
    } catch (e) {}

    if (!this.audioElement) return;

    this.isMuted = false;
    this.isPlaying = true;

    // Call audio.play() and catch any promise rejection gracefully
    try {
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.fadeIn(2000, this.targetVolume);
          })
          .catch(() => {
            // Browser policy blocked playback, fallback to procedural synth or silence
            this.startProceduralShehnai();
          });
      }
    } catch (err) {
      this.startProceduralShehnai();
    }

    this.notify();
  }

  /**
   * Pause playback with smooth fade out
   */
  pause() {
    this.userExplicitlyMuted = true;
    try {
      sessionStorage.setItem('vraj_music_muted', 'true');
    } catch (e) {}

    this.isMuted = true;
    this.isPlaying = false;

    if (this.audioElement) {
      this.fadeOut(600, () => {
        try {
          if (this.audioElement) {
            this.audioElement.pause();
          }
        } catch (e) {}
      });
    }

    this.stopProceduralShehnai();
    this.notify();
  }

  /**
   * Toggle between play and pause
   */
  toggle() {
    if (this.isPlaying && !this.isMuted) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Smooth fade in over duration (ms)
   */
  fadeIn(duration = 2000, targetVol = 0.5) {
    if (!this.audioElement) return;
    clearInterval(this.fadeInterval);

    this.audioElement.volume = 0;
    const startTime = performance.now();

    this.fadeInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      if (this.audioElement) {
        this.audioElement.volume = Math.min(targetVol, Math.max(0, eased * targetVol));
      }
      if (progress >= 1) {
        clearInterval(this.fadeInterval);
      }
    }, 40);
  }

  /**
   * Smooth fade out over duration (ms)
   */
  fadeOut(duration = 600, onComplete) {
    if (!this.audioElement) {
      if (onComplete) onComplete();
      return;
    }
    clearInterval(this.fadeInterval);

    const startVol = this.audioElement.volume;
    const startTime = performance.now();

    this.fadeInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = Math.pow(1 - progress, 2);
      if (this.audioElement) {
        this.audioElement.volume = Math.max(0, startVol * eased);
      }
      if (progress >= 1) {
        clearInterval(this.fadeInterval);
        if (onComplete) onComplete();
      }
    }, 30);
  }

  /**
   * Handle tab visibility switch / phone screen lock
   */
  handleVisibilityChange() {
    if (typeof document === 'undefined') return;

    if (document.hidden) {
      // Backgrounded: pause if playing
      if (this.isPlaying && !this.isMuted) {
        this.wasPlayingBeforeHide = true;
        if (this.audioElement) {
          try {
            this.audioElement.pause();
          } catch (e) {}
        }
      }
    } else {
      // Foregrounded: resume only if not user-muted
      if (this.wasPlayingBeforeHide && !this.userExplicitlyMuted) {
        this.wasPlayingBeforeHide = false;
        if (this.audioElement) {
          try {
            const p = this.audioElement.play();
            if (p) {
              p.then(() => {
                this.fadeIn(1200, this.targetVolume);
              }).catch(() => {});
            }
          } catch (e) {}
        }
      }
    }
  }

  /**
   * Optional procedural synthesis fallback
   */
  startProceduralShehnai() {
    if (!this.audioCtx) return;
    this.stopProceduralShehnai();

    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
    } catch (e) {}
  }

  stopProceduralShehnai() {
    if (this.proceduralLoopTimer) {
      clearTimeout(this.proceduralLoopTimer);
      this.proceduralLoopTimer = null;
    }
  }
}

export const soundEngine = new SoundEngine();
export default soundEngine;
