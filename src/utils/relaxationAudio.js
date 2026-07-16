// Web Audio API Relaxation Audio Synthesizer
// Generates realistic rain noise, nature forest sounds, and soft instrumental melodies synthetically
// to prevent any static file download/asset loading errors.

let audioCtx = null;
let rainNode = null;
let natureNode = null;
let melodyInterval = null;
let masterGainNode = null;

// Initialize Master Audio Context
const initContext = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    masterGainNode = audioCtx.createGain();
    masterGainNode.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

// --- Rain Sound Synthesizer (White noise with low-pass filters) ---
const startRain = (targetGain) => {
  stopRain();
  initContext();

  const bufferSize = 2 * audioCtx.sampleRate;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const whiteNoise = audioCtx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  // Filter out high frequencies to make it sound like rain
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(450, audioCtx.currentTime);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(targetGain, audioCtx.currentTime);

  whiteNoise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGainNode);

  whiteNoise.start();
  rainNode = { source: whiteNoise, gainNode: gain, filterNode: filter };
};

const stopRain = () => {
  if (rainNode) {
    try {
      rainNode.source.stop();
      rainNode.source.disconnect();
      rainNode.gainNode.disconnect();
      rainNode.filterNode.disconnect();
    } catch (e) {}
    rainNode = null;
  }
};

// --- Nature Sound Synthesizer (Wind rumble + periodic synthetic birds) ---
const startNature = (targetGain) => {
  stopNature();
  initContext();

  // 1. Wind Rumble (Pink noise)
  const bufferSize = 2 * audioCtx.sampleRate;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    output[i] *= 0.11; // rescue clipping
    b6 = white * 0.115926;
  }

  const pinkNoise = audioCtx.createBufferSource();
  pinkNoise.buffer = noiseBuffer;
  pinkNoise.loop = true;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(250, audioCtx.currentTime);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(targetGain * 0.8, audioCtx.currentTime);

  pinkNoise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGainNode);
  pinkNoise.start();

  // LFO to simulate wind blowing gusting
  const lfo = audioCtx.createOscillator();
  lfo.frequency.setValueAtTime(0.08, audioCtx.currentTime); // very slow
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.setValueAtTime(120, audioCtx.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  // 2. Synthetic periodic bird chirps
  const playBirdChirp = () => {
    if (!natureNode) return;
    try {
      const startTime = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const chirpGain = audioCtx.createGain();
      osc.type = 'sine';
      
      osc.frequency.setValueAtTime(800 + Math.random() * 400, startTime);
      osc.frequency.exponentialRampToValueAtTime(2000 + Math.random() * 600, startTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(1000 + Math.random() * 200, startTime + 0.18);
      
      chirpGain.gain.setValueAtTime(0, startTime);
      chirpGain.gain.linearRampToValueAtTime(targetGain * 0.4, startTime + 0.02);
      chirpGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);
      
      osc.connect(chirpGain);
      chirpGain.connect(masterGainNode);
      osc.start(startTime);
      osc.stop(startTime + 0.25);
    } catch (e) {}
    
    // schedule next chirp
    if (natureNode) {
      natureNode.birdTimer = setTimeout(playBirdChirp, 4000 + Math.random() * 4000);
    }
  };

  natureNode = { 
    source: pinkNoise, 
    gainNode: gain, 
    filterNode: filter, 
    lfo, 
    lfoGain,
    birdTimer: setTimeout(playBirdChirp, 3000)
  };
};

const stopNature = () => {
  if (natureNode) {
    try {
      clearTimeout(natureNode.birdTimer);
      natureNode.source.stop();
      natureNode.source.disconnect();
      natureNode.gainNode.disconnect();
      natureNode.filterNode.disconnect();
      natureNode.lfo.stop();
      natureNode.lfo.disconnect();
      natureNode.lfoGain.disconnect();
    } catch (e) {}
    natureNode = null;
  }
};

// --- Pentatonic Ambient Arpeggiator (Soft instrumentals) ---
const startInstrumental = (targetGain) => {
  stopInstrumental();
  initContext();

  const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // Pentatonic scale (C, D, E, G, A)
  let idx = 0;

  const playNextNote = () => {
    if (!melodyInterval) return;
    try {
      const noteFreq = notes[Math.floor(Math.random() * notes.length)];
      const startTime = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();
      
      osc.type = 'triangle'; // Soft flute/marimba-like tone
      osc.frequency.setValueAtTime(noteFreq, startTime);
      
      noteGain.gain.setValueAtTime(0, startTime);
      noteGain.gain.linearRampToValueAtTime(targetGain * 0.5, startTime + 0.1); // Slow attack
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + 2.0); // Long decay/release
      
      osc.connect(noteGain);
      noteGain.connect(masterGainNode);
      osc.start(startTime);
      osc.stop(startTime + 2.5);
    } catch (e) {}
  };

  melodyInterval = setInterval(playNextNote, 1500); // play note every 1.5 seconds
  playNextNote();
};

const stopInstrumental = () => {
  if (melodyInterval) {
    clearInterval(melodyInterval);
    melodyInterval = null;
  }
};

// --- Master Interface ---
export const setRelaxationMusic = (type, enabled, volume) => {
  try {
    if (!enabled || type === 'none') {
      stopRain();
      stopNature();
      stopInstrumental();
      return;
    }

    initContext();
    
    // Set Master Gain immediately
    if (masterGainNode) {
      masterGainNode.gain.setTargetAtTime(volume, audioCtx.currentTime, 0.1);
    }

    if (type === 'rain') {
      stopNature();
      stopInstrumental();
      if (!rainNode) startRain(0.3);
    } else if (type === 'nature') {
      stopRain();
      stopInstrumental();
      if (!natureNode) startNature(0.3);
    } else if (type === 'instrumental') {
      stopRain();
      stopNature();
      if (!melodyInterval) startInstrumental(0.3);
    }
  } catch (e) {
    console.warn("Error managing relaxation music:", e);
  }
};

// Set dynamic volume ducking
export const setRelaxationVolume = (volume) => {
  if (masterGainNode && audioCtx) {
    masterGainNode.gain.setTargetAtTime(volume, audioCtx.currentTime, 0.15);
  }
};
