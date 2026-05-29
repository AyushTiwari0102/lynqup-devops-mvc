
class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 44100
      });
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(console.error);
    }
  }

  setEnabled(val: boolean) {
    this.enabled = val;
    if (val) this.init();
  }

  isEnabled() {
    return this.enabled;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number) {
    if (!this.enabled) return;
    this.init();
    
    if (!this.ctx || this.ctx.state === 'suspended') return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // Quick tactile feedback for buttons
  tick() {
    this.playTone(800, 'sine', 0.1, 0.05);
  }

  // Adding something to the roster
  success() {
    this.playTone(400, 'sine', 0.3, 0.1);
    setTimeout(() => this.playTone(600, 'sine', 0.4, 0.08), 50);
  }

  // AI Typing "chatter"
  chatter() {
    const freqs = [1200, 1500, 1800, 2000];
    const freq = freqs[Math.floor(Math.random() * freqs.length)];
    this.playTone(freq, 'sine', 0.05, 0.01);
  }

  // GPS scanning pulse
  ping(pitchShift: number = 0) {
    this.playTone(200 + pitchShift, 'sine', 0.2, 0.05);
  }

  // Error/Alert
  error() {
    this.playTone(150, 'square', 0.3, 0.05);
  }
}

export const sound = new SoundEngine();
