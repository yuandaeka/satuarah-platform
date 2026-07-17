// Play a celebratory fanfare melody for badge achievements
export const playCelebrationFanfare = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    // A joyful ascending melody: C5 → E5 → G5 → C6 (major chord arpeggio)
    const notes = [
      { freq: 523.25, time: 0,    dur: 0.15 },  // C5
      { freq: 659.25, time: 0.12, dur: 0.15 },  // E5
      { freq: 783.99, time: 0.24, dur: 0.15 },  // G5
      { freq: 1046.5, time: 0.38, dur: 0.35 },  // C6 (held longer)
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

      gain.gain.setValueAtTime(0.12, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + dur);
    });
  } catch (e) {
    console.warn("Web Audio API not supported or blocked:", e);
  }
};

// Play custom synthesizer audio cues using Web Audio API
export const playTone = (freq, type = 'sine', duration = 0.1) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime); // Gentle volume
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn("Web Audio API not supported or blocked:", e);
  }
};
