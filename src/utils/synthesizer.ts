/**
 * Melodic Web Audio Synthesizer & Audio Controller
 * Emulates the sweet, gentle melody of the uploaded birthday song "Pori Aay"
 * with music box & acoustic plucked tones, seamlessly falling back or playing MP3.
 */

// Notes for "Pori Aay tar dui hath dhore niye ja shopner khela ghore..."
// Frequency mappings in Hz
const NOTES: Record<string, number> = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.00,
  REST: 0
};

// Gentle acoustic melody sequence (note, duration in seconds)
const MELODY: Array<{ note: string; dur: number }> = [
  // Intro gentle arpeggio
  { note: "C4", dur: 0.6 },
  { note: "E4", dur: 0.6 },
  { note: "G4", dur: 0.6 },
  { note: "C5", dur: 1.0 },

  // "Pori aay..."
  { note: "C5", dur: 0.8 },
  { note: "B4", dur: 0.4 },
  { note: "A4", dur: 0.6 },
  { note: "G4", dur: 1.0 },

  // "tar dui haath dhore niye ja..."
  { note: "E4", dur: 0.5 },
  { note: "F4", dur: 0.5 },
  { note: "G4", dur: 0.6 },
  { note: "A4", dur: 0.6 },
  { note: "G4", dur: 0.6 },
  { note: "F4", dur: 0.6 },
  { note: "E4", dur: 1.0 },

  // "shopner khela ghore..."
  { note: "D4", dur: 0.5 },
  { note: "E4", dur: 0.5 },
  { note: "F4", dur: 0.6 },
  { note: "G4", dur: 0.6 },
  { note: "F4", dur: 0.6 },
  { note: "E4", dur: 0.6 },
  { note: "D4", dur: 1.0 },

  // "jetha milbe tar shukher thikana..."
  { note: "C4", dur: 0.5 },
  { note: "D4", dur: 0.5 },
  { note: "E4", dur: 0.6 },
  { note: "D4", dur: 0.6 },
  { note: "C4", dur: 1.2 },

  // Gentle intermission
  { note: "REST", dur: 0.5 },
  { note: "G4", dur: 0.6 },
  { note: "C5", dur: 0.6 },
  { note: "E5", dur: 0.8 },
  { note: "D5", dur: 0.6 },
  { note: "C5", dur: 1.2 },
  { note: "REST", dur: 0.8 }
];

class BirthdaySynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private currentTimeout: number | null = null;
  private noteIndex = 0;
  private masterGain: GainNode | null = null;

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
  }

  public play() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.noteIndex = 0;
    this.playNextNote();
  }

  public pause() {
    this.isPlaying = false;
    if (this.currentTimeout !== null) {
      window.clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  private playNextNote() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const { note, dur } = MELODY[this.noteIndex];
    const freq = NOTES[note] || 0;

    if (freq > 0 && !this.isMuted) {
      this.triggerTone(freq, dur * 0.85);
    }

    this.noteIndex = (this.noteIndex + 1) % MELODY.length;
    this.currentTimeout = window.setTimeout(() => {
      this.playNextNote();
    }, dur * 1000);
  }

  private triggerTone(freq: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    
    // Main warm oscillator (sine)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Subtle harmonic overtone (triangle for acoustic chime effect)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    // Amplitude envelope for bell/music box pluck
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.4, now + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Overtone gain
    const overtoneGain = this.ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.08, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.6);

    osc1.connect(noteGain);
    osc2.connect(overtoneGain);
    overtoneGain.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
  }
}

export const birthdaySynth = new BirthdaySynthesizer();
