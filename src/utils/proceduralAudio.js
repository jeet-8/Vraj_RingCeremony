/**
 * Sound Engine for Ring Ceremony
 * Handles real MP3 playback (/client/src/assets/music.mp3 or /src/assets/music/music.mp3)
 * with automatic fallback to Web Audio procedural Shehnai Raga synthesis!
 */

class SoundEngine {
  constructor() {
    this.audioElement = null;
    this.audioCtx = null;
    this.isPlaying = false;
    this.isMuted = true;
    this.hasUnlocked = false;
    this.proceduralLoopTimer = null;
    this.currentGain = null;
    this.subscribers = new Set();
  }

  init() {
    if (this.audioElement) return;

    // Check for MP3 audio element
    this.audioElement = new Audio();
    this.audioElement.loop = true;
    this.audioElement.volume = 0.55;
    this.audioElement.src = '/src/assets/music/music.mp3';

    this.audioElement.addEventListener('error', () => {
      // If local file fails or 404, we will use procedural synth
      console.info('Custom music.mp3 not found, will use procedural Indian classical Shehnai synth.');
    });
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    this.subscribers.forEach(cb => cb({ isPlaying: this.isPlaying, isMuted: this.isMuted }));
  }

  /**
   * Must be called during or after a user interaction (e.g. tapping the wax seal)
   */
  async unlock() {
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
        await this.audioCtx.resume();
      }
    } catch (e) {
      console.warn('AudioContext resume error:', e);
    }
  }

  async play() {
    if (!this.hasUnlocked) {
      await this.unlock();
    }
    this.isMuted = false;
    this.isPlaying = true;

    // Try playing MP3 first
    let playedMp3 = false;
    if (this.audioElement && this.audioElement.src) {
      try {
        await this.audioElement.play();
        playedMp3 = true;
      } catch (err) {
        playedMp3 = false;
      }
    }

    if (!playedMp3) {
      // Start procedural Indian Shehnai Raga
      this.startProceduralShehnai();
    }

    this.notify();
  }

  pause() {
    this.isPlaying = false;
    this.isMuted = true;

    if (this.audioElement) {
      try {
        this.audioElement.pause();
      } catch (e) {}
    }

    this.stopProceduralShehnai();
    this.notify();
  }

  toggle() {
    if (this.isPlaying && !this.isMuted) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Procedural Shehnai & Tanpura Classical Raag Synthesis
   */
  startProceduralShehnai() {
    if (!this.audioCtx) return;
    this.stopProceduralShehnai();

    const ctx = this.audioCtx;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 2.0);
    masterGain.connect(ctx.destination);
    this.currentGain = masterGain;

    // Tanpura Drone (Sa: C3 ~130.81Hz, Pa: G3 ~196.00Hz, Sa: C4 ~261.63Hz)
    const droneFreqs = [130.81, 196.00, 261.63];
    droneFreqs.forEach((freq, idx) => {
      const droneOsc = ctx.createOscillator();
      const droneGain = ctx.createGain();
      droneOsc.type = 'sawtooth';
      droneOsc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Low pass filter for warm organic warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + idx * 80, ctx.currentTime);

      droneGain.gain.setValueAtTime(0.02, ctx.currentTime);
      droneOsc.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(masterGain);
      droneOsc.start();
    });

    // Auspicious Raag Yaman/Bhupali Scale Frequencies (Hz)
    // Sa, Re, Ga, Pa, Dha, Sa'
    const raagNotes = [
      261.63, // Sa (C4)
      293.66, // Re (D4)
      329.63, // Ga (E4)
      392.00, // Pa (G4)
      440.00, // Dha (A4)
      523.25, // Sa' (C5)
      440.00,
      392.00,
      329.63,
      293.66,
    ];

    let noteIdx = 0;
    const playNextNote = () => {
      if (!this.isPlaying) return;

      const freq = raagNotes[noteIdx % raagNotes.length];
      noteIdx++;

      const now = ctx.currentTime;
      const duration = 1.6 + Math.random() * 0.8;

      // Shehnai dual oscillator for rich reedy nasal overtone
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      // Pitch glide (Meend)
      const targetFreq = freq;
      osc1.frequency.setValueAtTime(targetFreq * 0.98, now);
      osc1.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.15);
      osc2.frequency.setValueAtTime(targetFreq, now);

      // Shehnai vibrato (LFO)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(5.5, now); // 5.5 Hz vibrato
      lfoGain.gain.setValueAtTime(4.0, now);
      lfo.connect(osc1.frequency);
      lfo.start(now);

      // Bandpass filter for authentic reedy acoustic quality
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1200, now);
      bandpass.Q.setValueAtTime(2.5, now);

      // Envelope
      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(0.08, now + 0.2);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(bandpass);
      osc2.connect(bandpass);
      bandpass.connect(noteGain);
      noteGain.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
      lfo.stop(now + duration);

      this.proceduralLoopTimer = setTimeout(playNextNote, duration * 850);
    };

    playNextNote();
  }

  stopProceduralShehnai() {
    if (this.proceduralLoopTimer) {
      clearTimeout(this.proceduralLoopTimer);
      this.proceduralLoopTimer = null;
    }
    if (this.currentGain && this.audioCtx) {
      try {
        const now = this.audioCtx.currentTime;
        this.currentGain.gain.setValueAtTime(this.currentGain.gain.value, now);
        this.currentGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      } catch (e) {}
    }
  }
}

export const soundEngine = new SoundEngine();
export default soundEngine;
