import eventConfig from '../../event.config.js';

/**
 * Shared Audio Singleton for Ring Ceremony
 * Handles real MP3 background music playback with:
 * - Immediate muted autoplay attempt on page load
 * - Unmute attempt on page load with 2-second fade-in to comfortable volume (0.5)
 * - First-gesture fallback (pointerdown, touchend, click, keydown) anywhere on page
 * - Non-intrusive subtle hint ("Tap anywhere for music") near mute button while blocked
 * - Persistent mute preference honoring user choice
 * - Single shared Audio instance avoiding restarts on skip, reopen, or language changes
 * - Pause on tab backgrounding/phone lock, resume on foregrounding if not muted
 * - Silent error resilience if audio is blocked or unsupported
 */
class SoundEngine {
  constructor() {
    this.audioElement = null;
    this.audioCtx = null;
    this.isPlaying = false;
    this.isMuted = true;
    this.isBlocked = false;
    this.userExplicitlyMuted = false;
    this.wasPlayingBeforeHide = false;
    this.targetVolume = 0.5;
    this.fadeInterval = null;
    this.subscribers = new Set();
    this.hasUnlocked = false;
    this.hasInit = false;
    this.gestureListenerRemover = null;

    // Check session storage for mute preference
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
    if (this.hasInit && this.audioElement) return;
    this.hasInit = true;

    try {
      this.audioElement = new Audio();
      this.audioElement.loop = true;
      this.audioElement.preload = 'auto';
      this.audioElement.volume = 0;

      // Primary source from event.config.js (statically imported by Vite)
      const primarySrc = eventConfig?.music || eventConfig?.audio?.src || '/music/background-music.mp3';
      this.audioElement.src = primarySrc;

      // Fallback if primary src fails
      this.audioElement.addEventListener('error', () => {
        if (this.audioElement && this.audioElement.src !== window.location.origin + '/music/background-music.mp3') {
          this.audioElement.src = '/music/background-music.mp3';
          this.audioElement.load();
        } else {
          console.info('[Audio] Audio file failed or not supported, hiding hint gracefully.');
          this.isBlocked = false;
          this.isPlaying = false;
          this.notify();
        }
      });
    } catch (err) {
      console.warn('[Audio] Initialization skipped:', err);
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    callback({
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      isBlocked: this.isBlocked,
    });
    return () => this.subscribers.delete(callback);
  }

  notify() {
    this.subscribers.forEach((cb) => {
      try {
        cb({
          isPlaying: this.isPlaying,
          isMuted: this.isMuted,
          isBlocked: this.isBlocked,
        });
      } catch (e) {}
    });
  }

  /**
   * Browser Autoplay Flow:
   * 1. Start muted immediately on load (muted autoplay is universally permitted).
   * 2. Try unmuting right away with 2-second fade-in.
   * 3. If browser blocks unmuted playback, keep playing muted and show subtle hint.
   * 4. Listen for first user gesture anywhere (pointerdown, touchend, click, keydown) to unmute.
   */
  startAutoplayFlow() {
    if (typeof window === 'undefined') return;
    this.init();

    if (this.userExplicitlyMuted) {
      this.isBlocked = false;
      this.isMuted = true;
      this.notify();
      return;
    }

    if (!this.audioElement) return;

    // Attach listeners for first user gesture anywhere on page
    this.attachGestureListeners();

    // Start muted first
    this.audioElement.muted = true;
    this.audioElement.volume = 0;

    try {
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Muted playback is active. Now test unmuting.
            this.isPlaying = true;
            try {
              this.audioElement.muted = false;
              if (!this.audioElement.paused && this.audioElement.volume !== undefined) {
                // Browser allowed unmuted playback
                this.isBlocked = false;
                this.isMuted = false;
                this.fadeIn(2000, this.targetVolume);
                this.detachGestureListeners();
                this.notify();
              } else {
                // Browser paused upon unmuting: re-mute and await gesture
                this.audioElement.muted = true;
                this.audioElement.play().catch(() => {});
                this.isBlocked = true;
                this.isMuted = true;
                this.notify();
              }
            } catch (err) {
              this.audioElement.muted = true;
              this.isBlocked = true;
              this.isMuted = true;
              this.notify();
            }
          })
          .catch(() => {
            // Autoplay completely blocked: wait for gesture
            this.isBlocked = true;
            this.isMuted = true;
            this.isPlaying = false;
            this.notify();
          });
      }
    } catch (err) {
      this.isBlocked = true;
      this.notify();
    }
  }

  attachGestureListeners() {
    if (typeof document === 'undefined' || this.gestureListenerRemover) return;

    const events = ['pointerdown', 'touchend', 'click', 'keydown'];
    const onGesture = () => {
      this.detachGestureListeners();
      if (!this.userExplicitlyMuted) {
        this.unlockAndPlay();
      }
    };

    events.forEach((evt) => {
      document.addEventListener(evt, onGesture, { once: true, passive: true });
    });

    this.gestureListenerRemover = () => {
      events.forEach((evt) => {
        document.removeEventListener(evt, onGesture);
      });
      this.gestureListenerRemover = null;
    };
  }

  detachGestureListeners() {
    if (this.gestureListenerRemover) {
      this.gestureListenerRemover();
    }
  }

  /**
   * Unlock audio context and start playback smoothly
   */
  unlock() {
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
   * Unmute or start audio playback with smooth fade-in
   */
  unlockAndPlay() {
    this.init();
    this.unlock();
    this.detachGestureListeners();

    if (!this.audioElement) return;

    this.isBlocked = false;
    this.isMuted = false;
    this.isPlaying = true;
    this.audioElement.muted = false;

    try {
      if (this.audioElement.paused) {
        const playPromise = this.audioElement.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.fadeIn(2000, this.targetVolume);
              this.notify();
            })
            .catch(() => {
              this.notify();
            });
        }
      } else {
        // Already playing (was muted): simply fade in
        this.fadeIn(2000, this.targetVolume);
        this.notify();
      }
    } catch (err) {
      this.notify();
    }

    this.notify();
  }

  /**
   * Explicit play called by user
   */
  play() {
    this.userExplicitlyMuted = false;
    try {
      sessionStorage.setItem('vraj_music_muted', 'false');
    } catch (e) {}

    this.unlockAndPlay();
  }

  /**
   * Explicit pause / mute called by user
   */
  pause() {
    this.userExplicitlyMuted = true;
    try {
      sessionStorage.setItem('vraj_music_muted', 'true');
    } catch (e) {}

    this.detachGestureListeners();
    this.isBlocked = false;
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
   * Smooth fade in over duration (ms) to targetVol (default 0.5)
   */
  fadeIn(duration = 2000, targetVol = 0.5) {
    if (!this.audioElement) return;
    clearInterval(this.fadeInterval);

    const startVol = this.audioElement.volume || 0;
    const startTime = performance.now();

    this.fadeInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentVol = startVol + (targetVol - startVol) * eased;
      if (this.audioElement) {
        this.audioElement.volume = Math.min(targetVol, Math.max(0, currentVol));
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
            this.audioElement.muted = false;
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
}

export const soundEngine = new SoundEngine();
export default soundEngine;
