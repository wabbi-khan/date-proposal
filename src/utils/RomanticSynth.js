// Custom Audio Synth to play soft, romantic chime melodies
export default class RomanticSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.seqId = null;
  }

  start() {
    if (this.isPlaying) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.isPlaying = true;

      // Melody: Canon in D / Romantic chords sequence
      const notes = [
        293.66, 369.99, 440.0, 587.33, 554.37, 440.0, 493.88, 587.33, 440.0,
        369.99, 392.0, 493.88, 440.0, 349.23, 392.0, 440.0,
      ];

      let step = 0;
      const playNote = () => {
        if (!this.isPlaying) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Soft triangle wave for a cozy chime sound
        osc.type = "triangle";
        osc.frequency.setValueAtTime(notes[step % notes.length], now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 1.3);

        step++;
        this.seqId = setTimeout(playNote, 600);
      };

      playNote();
    } catch (e) {
      console.warn("Audio Context failed to start:", e);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.seqId) clearTimeout(this.seqId);
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
