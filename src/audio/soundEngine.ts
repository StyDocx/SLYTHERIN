// Pure procedural Web Audio API Sound Engine
// Zero external network dependencies, zero copyright issues, instant playback & fully controllable

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  
  private ambientSourceNodes: {
    windNode?: AudioNode;
    droneOsc1?: OscillatorNode;
    droneOsc2?: OscillatorNode;
    droneOsc3?: OscillatorNode;
    waterFilter?: BiquadFilterNode;
  } = {};

  private isMuted: boolean = false;
  private musicEnabled: boolean = true;
  private sfxEnabled: boolean = true;
  private volume: number = 0.6;
  private initialized: boolean = false;
  private isAmbiencePlaying: boolean = false;
  private currentAmbienceType: 'castle' | 'underwater' | 'hall' = 'castle';

  constructor() {
    // Load persisted preferences if in browser
    if (typeof window !== 'undefined') {
      try {
        const savedMute = localStorage.getItem('slytherin_mute');
        const savedVol = localStorage.getItem('slytherin_volume');
        const savedMusic = localStorage.getItem('slytherin_music');
        const savedSfx = localStorage.getItem('slytherin_sfx');
        if (savedMute !== null) this.isMuted = savedMute === 'true';
        if (savedVol !== null) this.volume = parseFloat(savedVol);
        if (savedMusic !== null) this.musicEnabled = savedMusic === 'true';
        if (savedSfx !== null) this.sfxEnabled = savedSfx === 'true';
      } catch (e) {
        // LocalStorage fallback
      }
    }
  }

  public init() {
    if (this.initialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Music / Ambience Gain
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicEnabled ? 0.35 : 0, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // SFX Gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? 0.5 : 0, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.initialized = true;
    } catch (err) {
      console.warn('AudioContext initialization failed or blocked:', err);
    }
  }

  // --- AMBIENCE GENERATORS ---
  public startCastleAmbience(type: 'castle' | 'underwater' | 'hall' = 'castle') {
    this.init();
    if (!this.ctx || !this.musicGain) return;
    this.stopAmbience();

    this.currentAmbienceType = type;
    const now = this.ctx.currentTime;

    // 1. Procedural Low Resonant Mystical Drone (Dark harmonic triad)
    const baseFreq = type === 'underwater' ? 45 : 55; // A1 or F1 deep rumble
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    osc3.type = 'sine';

    osc1.frequency.setValueAtTime(baseFreq, now);
    osc2.frequency.setValueAtTime(baseFreq * 1.5, now); // Fifth
    osc3.frequency.setValueAtTime(baseFreq * 2.02, now); // Octave with slight detune

    // Lowpass filter for dark Gothic cathedral rumble
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(type === 'underwater' ? 180 : 320, now);
    filter.Q.setValueAtTime(3.5, now);

    // Subtle LFO modulation to give breathing living castle feel
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.15, now); // slow breathing
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(80, now);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(now);

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.001, now);
    droneGain.gain.exponentialRampToValueAtTime(0.18, now + 3);

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(this.musicGain);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    // 2. Procedural Wind / Mist Noise Generator
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02; // Pink-brown filter
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(type === 'underwater' ? 220 : 450, now);
    noiseFilter.Q.setValueAtTime(1.8, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.07, now + 4);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.musicGain);
    noise.start(now);

    this.ambientSourceNodes = {
      droneOsc1: osc1,
      droneOsc2: osc2,
      droneOsc3: osc3,
      windNode: noise,
      waterFilter: filter
    };

    this.isAmbiencePlaying = true;
  }

  public stopAmbience() {
    if (!this.ctx) return;
    try {
      if (this.ambientSourceNodes.droneOsc1) this.ambientSourceNodes.droneOsc1.stop();
      if (this.ambientSourceNodes.droneOsc2) this.ambientSourceNodes.droneOsc2.stop();
      if (this.ambientSourceNodes.droneOsc3) this.ambientSourceNodes.droneOsc3.stop();
      if (this.ambientSourceNodes.windNode) {
        (this.ambientSourceNodes.windNode as AudioBufferSourceNode).stop();
      }
    } catch (e) {
      // Ignore already stopped
    }
    this.ambientSourceNodes = {};
    this.isAmbiencePlaying = false;
  }

  // --- SOUND EFFECTS ---

  // Magical wand sparkle chime (ascending arpeggiated ethereal bells)
  public playWandSparkle() {
    if (!this.sfxEnabled || this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.7);
    });
  }

  // Spell Cast / Green Burst Sound
  public playSpellCast() {
    if (!this.sfxEnabled || this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.6);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(8, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.75);
  }

  // Ancient heavy castle door thud / rumble
  public playDoorOpen() {
    if (!this.sfxEnabled || this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.9);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 1.2);
  }

  // Parchment rustle / Page turn
  public playPageTurn() {
    if (!this.sfxEnabled || this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.25;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(3, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
    noise.stop(now + 0.26);
  }

  // Distant magical thunder
  public playThunder() {
    if (!this.sfxEnabled || this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 1.5;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
    noise.stop(now + 1.5);
  }

  // Antique golden button click
  public playGoldClick() {
    if (!this.sfxEnabled || this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Acceptance Letter wax seal stamp thump
  public playSealStamp() {
    if (!this.sfxEnabled || this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.35);

    // Followed by golden sparkle
    setTimeout(() => {
      this.playWandSparkle();
    }, 150);
  }

  // --- CONTROLS ---

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    try {
      localStorage.setItem('slytherin_volume', this.volume.toString());
    } catch (e) {}
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    try {
      localStorage.setItem('slytherin_mute', this.isMuted.toString());
    } catch (e) {}
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicEnabled ? 0.35 : 0, this.ctx.currentTime);
    }
    try {
      localStorage.setItem('slytherin_music', this.musicEnabled.toString());
    } catch (e) {}
    return this.musicEnabled;
  }

  public getMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  public toggleSfx(): boolean {
    this.sfxEnabled = !this.sfxEnabled;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? 0.5 : 0, this.ctx.currentTime);
    }
    try {
      localStorage.setItem('slytherin_sfx', this.sfxEnabled.toString());
    } catch (e) {}
    return this.sfxEnabled;
  }

  public getSfxEnabled(): boolean {
    return this.sfxEnabled;
  }
}

export const sound = new SoundEngine();
