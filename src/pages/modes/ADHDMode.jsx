import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function ADHDMode({
  adhdScore,
  adhdGameState,
  adhdCamReady,
  adhdCamError,
  adhdControlMode,
  setAdhdControlMode,
  adhdTimeLeft,
  adhdFailReason,
  feedbackToast,
  adhdFocusSound,
  toggleFocusSound,
  stopAdhdCamera,
  startAdhdCamera,
  setSelectedMode,
  adhdVideoRef,
  adhdOverlayCanvasRef,
  adhdGameCanvasRef,
  startGame,
  handleAdhdBoardMouseMove,
  handleAdhdBoardMouseDown,
  handleAdhdBoardMouseUp,
  handleAdhdBoardTouchMove,
  handleAdhdBoardTouchStart,
  handleAdhdBoardTouchEnd
}) {
  // --- Navigation & Content States ---
  const [activeTab, setActiveTab] = useState('main'); // 'main' | 'gameplay' | 'video' | 'misi' | 'energi'
  const [rocketEnergy, setRocketEnergy] = useState(75);
  const [selectedMathAns, setSelectedMathAns] = useState(null);
  const [mathCompleted, setMathCompleted] = useState(false);

  // --- 1. Misi 5 Menit States ---
  const [focusTime, setFocusTime] = useState(300); // 5 minutes in seconds
  const [focusRunning, setFocusRunning] = useState(false);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const spaceFacts = [
    "Di luar angkasa sangat sunyi karena tidak ada udara untuk merambatkan suara! 🧑‍🚀",
    "Satu hari di planet Venus lebih lama daripada satu tahun di Bumi! 🌟",
    "Matahari kita sangat besar sehingga 1,3 juta planet Bumi bisa muat di dalamnya! ☀️",
    "Gunung tertinggi di tata surya adalah Olympus Mons yang terletak di planet Mars! 🔴",
    "Jejak kaki para astronot di Bulan tidak akan hilang karena tidak ada angin di sana! 🌕"
  ];

  // --- 2. Video Pendek States ---
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoIntervalRef = useRef(null);

  // --- 4. Energi Roket States ---
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState('');

  // Audio tone feedback helper
  const playSound = (freq = 400, duration = 0.15) => {
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    }
  };

  // --- Focus Timer Effect ---
  useEffect(() => {
    let timer = null;
    if (focusRunning && activeTab === 'misi') {
      timer = setInterval(() => {
        setFocusTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setFocusRunning(false);
            playSound(600, 0.4);
            confetti({ particleCount: 30, spread: 60 });
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [focusRunning, activeTab]);

  // --- Video Progress Effect ---
  useEffect(() => {
    if (isVideoPlaying && activeTab === 'video') {
      videoIntervalRef.current = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setIsVideoPlaying(false);
            clearInterval(videoIntervalRef.current);
            setRocketEnergy(e => Math.min(100, e + 10));
            confetti({ particleCount: 20, spread: 40 });
            return 0;
          }
          return prev + 2;
        });
      }, 300);
    } else {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    }
    return () => {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    };
  }, [isVideoPlaying, activeTab]);

  // Launch Mini Game
  const handleLaunchGame = (mode = 'mouse') => {
    playSound(520, 0.2);
    setAdhdControlMode(mode);
    setActiveTab('gameplay');
    if (mode === 'camera') {
      if (typeof startAdhdCamera === 'function') startAdhdCamera();
    } else {
      stopAdhdCamera();
    }
    setTimeout(() => {
      if (typeof startGame === 'function') startGame();
    }, 150);
  };

  // Math Quiz handler on Dashboard
  const handleMathSelect = (val) => {
    if (mathCompleted) return;
    playSound(val === 5 ? 580 : 180, 0.2);
    setSelectedMathAns(val);
    if (val === 5) {
      setMathCompleted(true);
      setRocketEnergy(prev => Math.min(100, prev + 15));
      confetti({ particleCount: 20, spread: 50, origin: { y: 0.85 } });
    }
  };

  // Energy quiz answer
  const handleQuizSubmit = (isCorrect) => {
    if (quizAnswered) return;
    playSound(isCorrect ? 580 : 180, 0.25);
    setQuizAnswered(true);
    if (isCorrect) {
      setQuizFeedback('Hebat! Jawabanmu benar! Energi roket bertambah +20 ⚡');
      setRocketEnergy(prev => Math.min(100, prev + 20));
      confetti({ particleCount: 30, spread: 60 });
    } else {
      setQuizFeedback('Oops, kurang tepat. Coba baca alur misi lagi ya!');
    }
  };

  return (
    <div className="planet-fokus-dashboard">
      <style dangerouslySetInnerHTML={{ __html: `
        .planet-fokus-dashboard {
          --pf-bg: #06041a;
          --pf-primary: #10b981;
          --pf-secondary: #3b82f6;
          --pf-accent: #fbbf24;
          --pf-card: rgba(22, 28, 66, 0.95);
          
          font-family: 'Poppins', sans-serif;
          background: radial-gradient(circle at center, #181145 0%, #040210 100%);
          color: white;
          border-radius: 28px;
          padding: 14px;
          border: 3.5px solid var(--pf-primary);
          box-shadow: inset 0 0 35px rgba(0,0,0,0.8), 0 10px 25px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow-y: auto;
          max-height: 800px;
          position: relative;
          width: 100%;
        }

        .planet-fokus-dashboard::-webkit-scrollbar {
          width: 4px;
        }
        .planet-fokus-dashboard::-webkit-scrollbar-thumb {
          background: var(--pf-primary);
          border-radius: 10px;
        }

        /* Header styling */
        .pf-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 3px;
        }
        .pf-title-text {
          font-size: 1.5rem;
          font-weight: 900;
          line-height: 1.1;
        }
        .pf-title-planet { color: white; }
        .pf-title-fokus { color: var(--pf-accent); }
        .pf-badge {
          background: #fbbf24;
          color: #78350f;
          font-size: 7.5px;
          font-weight: 900;
          padding: 2px 10px;
          border-radius: 50px;
          text-transform: uppercase;
        }

        /* Speech bubble */
        .pf-speech-bubble {
          background: rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 8px 12px;
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
        }
        .pf-speech-avatar { font-size: 1.8rem; }
        .pf-speech-msg { font-size: 7.5px; font-weight: 700; color: #e2e8f0; line-height: 1.3; }

        /* Fitur Utama */
        .pf-fitur-grid {
          display: grid;
          grid-template-cols: 1fr;
          gap: 8px;
          width: 100%;
        }
        .pf-fitur-card {
          background: var(--pf-card);
          border: 1.5px solid rgba(16, 185, 129, 0.25);
          border-radius: 16px;
          padding: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: transform 0.15s, border-color 0.2s;
        }
        .pf-fitur-card:hover { border-color: var(--pf-accent); }
        .pf-fitur-card:active { transform: scale(0.98); }
        
        .pf-fitur-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #10b981, #047857);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .pf-fitur-txt h4 { font-size: 10px; font-weight: 900; color: white; margin: 0; }
        .pf-fitur-txt p { font-size: 8px; color: #a7f3d0; margin: 0; }

        /* Orbit map navigation */
        .pf-map-card {
          background: rgba(6, 3, 23, 0.7);
          border: 2px solid rgba(16, 185, 129, 0.2);
          border-radius: 20px;
          height: 190px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          overflow: hidden;
        }
        .pf-center-globe {
          width: 90px;
          height: 90px;
          background: radial-gradient(circle at 30% 30%, #a7f3d0 0%, #10b981 50%, #064e3b 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pf-rocket-glow {
          font-size: 2rem;
          animation: float 4s ease-in-out infinite;
        }
        
        .pf-map-loc {
          position: absolute;
          background: rgba(10, 15, 45, 0.9);
          border: 1.5px solid var(--pf-primary);
          border-radius: 10px;
          padding: 3px 5px;
          width: 85px;
          text-align: center;
          z-index: 10;
          cursor: pointer;
        }
        .pf-map-loc h5 { font-size: 6.5px; font-weight: 900; }
        .pf-map-loc p { font-size: 5px; color: #a7f3d0; }
        
        .pf-loc-hutan { top: 8px; left: 8px; }
        .pf-loc-gurun { top: 8px; right: 8px; }
        .pf-loc-dingin { bottom: 8px; left: 8px; }
        .pf-loc-gunung { bottom: 8px; right: 8px; }

        /* Energy & stats box */
        .pf-energy-box {
          background: var(--pf-card);
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 18px;
          padding: 10px;
        }
        .pf-energy-row { display: flex; justify-content: space-between; align-items: center; font-size: 8px; font-weight: 900; color: var(--pf-accent); }
        .pf-progress-bg { width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; margin-top: 4px; }
        .pf-progress-fill { height: 100%; background: var(--pf-primary); transition: width 0.3s; }

        /* Scrollable flow */
        .pf-scroll-flow {
          background: rgba(255,255,255,0.02);
          border: 1.5px solid rgba(16, 185, 129, 0.15);
          border-radius: 20px;
          padding: 10px;
        }
        .pf-flow-cards { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
        .pf-flow-card {
          flex: 0 0 120px;
          background: white;
          color: #1e293b;
          border-radius: 12px;
          padding: 8px;
          font-size: 7px;
          position: relative;
        }
        .pf-flow-num {
          position: absolute;
          top: -6px;
          left: 8px;
          width: 14px;
          height: 14px;
          background: var(--pf-accent);
          color: #78350f;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 900;
        }

        /* Activity blocks */
        .pf-stacked-panels { display: flex; flex-direction: column; gap: 10px; }
        .pf-activity-panel { background: var(--pf-card); border-radius: 18px; padding: 12px; border: 1.5px solid rgba(16, 185, 129, 0.15); }
        .pf-panel-title { font-size: 8.5px; font-weight: 900; color: var(--pf-accent); border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 4px; margin-bottom: 8px; }
        
        .pf-math-box { display: flex; gap: 4px; justify-content: center; margin-top: 6px; }
        .pf-math-btn { background: #1a163a; border: 1.5px solid var(--pf-primary); color: white; font-size: 9px; font-weight: 800; padding: 4px 10px; border-radius: 6px; }
        .pf-math-btn.correct { background: var(--pf-primary); }

        /* Navigation footer */
        .pf-footer-nav {
          background: #0b0a21 !important;
          border-top: 2px solid rgba(16, 185, 129, 0.2) !important;
          border-radius: 16px !important;
          display: flex !important;
          flex-direction: row !important;
          justify-content: space-around !important;
          align-items: center !important;
          padding: 8px 6px !important;
          margin-top: 8px !important;
          width: 100% !important;
        }
        .pf-nav-item {
          background: none !important;
          border: none !important;
          color: #94a3b8 !important;
          font-size: 8px !important;
          font-weight: 800 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 2px !important;
          cursor: pointer !important;
          flex: 1 !important;
          text-decoration: none !important;
        }
        .pf-nav-item.active {
          color: var(--pf-accent) !important;
        }
        body.mode-adhd .pf-nav-item.active span {
          color: var(--pf-accent) !important;
        }
        body.mode-adhd .pf-nav-item span {
          text-transform: none !important;
        }

        /* Module Panels */
        .pf-module-card {
          background: var(--pf-card);
          border: 2px solid var(--pf-primary);
          border-radius: 24px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: zoomIn 0.25s ease-out;
        }

        /* Video simulator styles */
        .pf-video-player {
          background: black;
          border-radius: 14px;
          width: 100%;
          aspect-ratio: 16/9;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1.5px solid rgba(255,255,255,0.1);
        }
        .pf-video-thumbnail {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 12px;
        }

        /* Focus timer animation */
        .pf-focus-timer-ring {
          position: relative;
          width: 110px;
          height: 110px;
          border-radius: 50%;
          border: 6px dashed var(--pf-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: rotateRing 20s linear infinite;
          margin: 0 auto;
        }
        .pf-focus-timer-ring.paused {
          animation-play-state: paused;
          border-color: #4b5563;
        }

        @keyframes rotateRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotateRingOpposite {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        /* Active Gameplay Arena */
        .pf-gameplay-arena {
          background: var(--pf-card);
          border: 2px solid var(--pf-primary);
          border-radius: 24px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: zoomIn 0.25s ease-out;
        }
        .pf-arena-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1.5px dashed rgba(255,255,255,0.1);
          padding-bottom: 8px;
          margin-bottom: 8px;
        }
        .pf-arena-canvas-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          background: radial-gradient(circle at center, #1e293b 0%, #03010b 100%);
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid var(--pf-primary);
        }
        .pf-game-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }
        .pf-pip-overlay {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 80px;
          aspect-ratio: 4/3;
          background: black;
          border-radius: 8px;
          overflow: hidden;
          border: 1.5px solid white;
          z-index: 50;
        }
        
        .adhd-instructions {
          padding: 12px;
          border-radius: 12px;
          font-size: 8.5px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 10px;
        }
        .adhd-control-btn {
          flex: 1;
          padding: 8px 12px;
          border-radius: 10px;
          font-weight: 800;
          font-size: 10px;
          cursor: pointer;
          border: 1.5px solid rgba(255,255,255,0.15);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
        .adhd-control-btn.active {
          background: var(--pf-primary);
          color: white;
          border-color: var(--pf-primary);
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
        }
        .adhd-control-btn.inactive {
          background: rgba(255,255,255,0.05);
          color: #94a3b8;
          border-color: rgba(255,255,255,0.05);
        }
      ` }} />

      {/* ================= VIEW 1: MISI 5 MENIT (FOCUS TIMER) ================= */}
      {activeTab === 'misi' && (
        <div className="pf-module-card relative z-20">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h4 className="font-extrabold text-[10px] text-[#fbbf24]">⏱️ MISI 5 MENIT: FOKUS BELAJAR</h4>
            <button onClick={() => { setFocusRunning(false); setActiveTab('main'); }} className="px-2 py-0.5 bg-rose-600 text-white font-extrabold text-[8px] rounded-full">Tutup</button>
          </div>

          <p className="text-[7.5px] text-slate-300 text-center leading-relaxed">
            Nyalakan timer dan dengarkan dengung binaural untuk meningkatkan konsentrasimu saat membaca fakta luar angkasa berikut!
          </p>

          {/* Interactive Countdown Clock */}
          <div className="py-2">
            <div className={`pf-focus-timer-ring ${!focusRunning ? 'paused' : ''}`}>
              <div className="absolute text-center" style={{ animation: 'rotateRingOpposite 20s linear infinite', animationPlayState: !focusRunning ? 'paused' : 'running' }}>
                <h3 className="text-xl font-black text-white tracking-wider">
                  {Math.floor(focusTime / 60)}:{(focusTime % 60).toString().padStart(2, '0')}
                </h3>
                <span className="text-[6px] uppercase tracking-widest text-[#fbbf24]">Fokus</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                playSound(520, 0.2);
                setFocusRunning(!focusRunning);
                if (!adhdFocusSound) toggleFocusSound();
              }}
              className="flex-1 py-1.5 bg-emerald-500 text-slate-900 font-extrabold text-[9px] rounded-lg active:scale-95 transition-transform"
            >
              {focusRunning ? '⏸️ PAUSE BELAJAR' : '▶️ MULAI TIMBER FOKUS'}
            </button>
            <button
              onClick={() => {
                playSound(440, 0.1);
                setFocusTime(300);
                setFocusRunning(false);
              }}
              className="px-3 py-1.5 bg-slate-800 text-white font-extrabold text-[9px] rounded-lg"
            >
              Reset
            </button>
          </div>

          {/* Fact card */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-emerald-500/20 text-center">
            <span className="text-[7px] text-emerald-400 font-bold uppercase tracking-wider">Misi Pengetahuan #{currentFactIndex + 1}</span>
            <p className="text-[8px] font-medium text-slate-100 mt-1.5 min-h-[30px] leading-relaxed">
              {spaceFacts[currentFactIndex]}
            </p>
            <button
              onClick={() => {
                playSound(480, 0.1);
                setCurrentFactIndex(prev => (prev + 1) % spaceFacts.length);
              }}
              className="mt-2 text-[7px] font-black text-[#fbbf24] hover:underline"
            >
              Fakta Selanjutnya ➡️
            </button>
          </div>
        </div>
      )}

      {/* ================= VIEW 2: VIDEO PENDEK (LEARNING PLAYER) ================= */}
      {activeTab === 'video' && (
        <div className="pf-module-card relative z-20">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h4 className="font-extrabold text-[10px] text-[#fbbf24]">📹 VIDEO PENDEK: TATA SURYA KITA</h4>
            <button onClick={() => { setIsVideoPlaying(false); setActiveTab('main'); }} className="px-2 py-0.5 bg-rose-600 text-white font-extrabold text-[8px] rounded-full">Tutup</button>
          </div>

          <p className="text-[7.5px] text-slate-300 text-center leading-relaxed">
            Tonton animasi perjalanan planet mini di bawah ini untuk menambah Energi Roketmu!
          </p>

          {/* Interactive Media Player Simulator */}
          <div className="pf-video-player">
            {/* Solar system simulator inside video area */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <div className="w-16 h-16 border border-dashed border-emerald-500/30 rounded-full animate-spin" style={{ animationDuration: '6s' }}></div>
              <div className="w-8 h-8 border border-dashed border-emerald-500/30 rounded-full animate-spin absolute" style={{ animationDuration: '3s' }}></div>
              <span className="absolute text-yellow-500 text-lg">☀️</span>
            </div>

            {/* Video overlay overlay controls */}
            <div className="pf-video-thumbnail">
              {!isVideoPlaying && videoProgress === 0 && (
                <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center">
                  <button
                    onClick={() => { playSound(600, 0.25); setIsVideoPlaying(true); }}
                    className="w-10 h-10 bg-emerald-500 text-slate-900 rounded-full flex items-center justify-center font-extrabold text-base shadow-lg hover:scale-105 active:scale-95 transition-transform"
                  >
                    ▶️
                  </button>
                  <span className="text-[7.5px] text-slate-300 mt-2 font-bold">Mulai Putar Animasi</span>
                </div>
              )}

              {/* Learning subtitle captions */}
              {isVideoPlaying && (
                <div className="w-full text-center pb-2 bg-slate-950/70 p-1.5 rounded-lg border border-white/5">
                  <p className="text-[8px] font-black text-[#fbbf24]">
                    {videoProgress < 30 && "Merkurius & Venus berada paling dekat dengan Matahari..."}
                    {videoProgress >= 30 && videoProgress < 60 && "Bumi adalah satu-satunya planet yang memiliki kehidupan..."}
                    {videoProgress >= 60 && videoProgress < 90 && "Mars berwarna merah karena tanahnya mengandung banyak besi..."}
                    {videoProgress >= 90 && "Jupiter adalah raksasa gas terbesar di tata surya!"}
                  </p>
                </div>
              )}

              {/* ProgressBar */}
              <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-emerald-500" style={{ width: `${videoProgress}%` }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-1">
                <span className="text-[6px] text-slate-400">
                  {isVideoPlaying ? '▶️ MEMUTAR' : '⏸️ JEDA'} | {Math.floor(videoProgress * 0.15)}s / 15s
                </span>
                <button
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="text-[6.5px] font-black text-white hover:text-emerald-400"
                >
                  {isVideoPlaying ? 'Jeda ⏸️' : 'Putar ▶️'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 p-2 rounded-xl text-center">
            <p className="text-[7px] text-[#fbbf24] font-medium">
              💡 Selesaikan menonton video (sampai 100%) untuk mengisi **+10 Energi Roket** secara otomatis!
            </p>
          </div>
        </div>
      )}

      {/* ================= VIEW 3: MINI GAME (AI) [ORIGINAL SORTING GAME] ================= */}
      {activeTab === 'gameplay' && (
        <div className="pf-gameplay-arena relative z-20">
          <div className="pf-arena-header">
            <h4 className="font-extrabold text-[10px] text-[#fbbf24] uppercase">
              🪐 AKTIVITAS GAMEPLAY: SORTING PLANET
            </h4>
            <button
              onClick={() => {
                stopAdhdCamera();
                setActiveTab('main');
              }}
              className="px-3 py-1 bg-rose-600 border-b-3 border-rose-800 text-white font-extrabold text-[8px] rounded-full active:translate-y-0.5"
            >
              Keluar Misi
            </button>
          </div>

          {/* Telemetry Stats */}
          <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-xl border border-emerald-500/20">
            <div className="text-[9px] font-black text-white">🚀 Jarak: <span className="text-emerald-400">{adhdScore * 10}m</span></div>
            <div className="text-[9px] font-black text-white">⏱️ Waktu: <span className="text-emerald-400">{adhdTimeLeft}s</span></div>
          </div>

          {/* Interactive Game Frame */}
          <div className="pf-arena-canvas-frame" id="game_bounds">
            {/* Webcam PIP Overlay */}
            {adhdControlMode === 'camera' && (
              <div className="pf-pip-overlay">
                <video ref={adhdVideoRef} className="hidden" playsInline muted />
                <canvas ref={adhdOverlayCanvasRef} width={320} height={240} className="w-full h-full transform scale-x-[-1] object-cover" />
              </div>
            )}

            {/* Feedback Toast */}
            {feedbackToast && (
              <div className={`absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-white text-[8px] font-black z-50 shadow ${
                feedbackToast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}>
                {feedbackToast.text}
              </div>
            )}

            {/* Core Game Canvas */}
            <canvas
              ref={adhdGameCanvasRef}
              onMouseMove={handleAdhdBoardMouseMove}
              onMouseDown={handleAdhdBoardMouseDown}
              onMouseUp={handleAdhdBoardMouseUp}
              onMouseLeave={handleAdhdBoardMouseUp}
              onTouchMove={handleAdhdBoardTouchMove}
              onTouchStart={handleAdhdBoardTouchStart}
              onTouchEnd={handleAdhdBoardTouchEnd}
              className="pf-game-canvas w-full h-full block"
            />

            {/* Loading */}
            {adhdGameState === 'loading' && adhdControlMode === 'camera' && (
              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-center p-3 z-40">
                <h5 className="font-extrabold text-[10px] text-white">Scanning Webcam...</h5>
                <p className="text-[7.5px] text-slate-400 mt-1">Mengaktifkan sensor deteksi cubit tangan.</p>
                {adhdCamError && (
                  <div className="bg-rose-500/20 border border-rose-500/20 p-2 rounded-lg max-w-[200px] mt-2">
                    <p className="text-rose-400 text-[6.5px] leading-tight mb-2">{adhdCamError}</p>
                    <button onClick={() => setAdhdControlMode('mouse')} className="px-2 py-0.5 bg-blue-500 text-white text-[6.5px] font-bold rounded">
                      Ganti Mode Mouse
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Start Screen */}
            {adhdGameState === 'start' && (
              <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center text-center p-4 z-40">
                <h5 className="font-extrabold text-xs text-white">Misi Planet Bumi</h5>
                <p className="text-[7.5px] text-slate-400 mt-1 max-w-[180px] leading-relaxed">
                  Cubit (Pinch) gelembung BUMI dan tempatkan tepat di orbit ketiga dari Matahari!
                </p>
                <button className="px-4 py-1.5 bg-emerald-500 text-slate-950 text-[8.5px] font-black rounded-full mt-3 shadow active:scale-95 animate-bounce" onClick={startGame}>
                  Mulai Permainan
                </button>
              </div>
            )}

            {/* Lose Screen */}
            {adhdGameState === 'lost' && (
              <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center text-center p-4 z-40">
                <h5 className="font-extrabold text-xs text-rose-500">Misi Gagal</h5>
                <p className="text-[7.5px] text-slate-400 mt-1">{adhdFailReason}</p>
                <button className="px-4 py-1.5 bg-blue-500 text-white text-[8.5px] font-black rounded-full mt-3" onClick={startGame}>
                  Coba Lagi
                </button>
              </div>
            )}

            {/* Win Screen */}
            {adhdGameState === 'won' && (
              <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center text-center p-4 z-40">
                <h5 className="font-extrabold text-xs text-emerald-500">Misi Selesai</h5>
                <p className="text-[7.5px] text-slate-400 mt-1">Luar biasa! Orbit bumi disusun dengan sukses.</p>
                <button
                  className="px-4 py-1.5 bg-emerald-500 text-slate-950 text-[8.5px] font-black rounded-full mt-3"
                  onClick={() => {
                    setAdhdGameState('start');
                    setActiveTab('main');
                  }}
                >
                  Selesai ✓
                </button>
              </div>
            )}
          </div>

          {/* Interactive control settings */}
          <div className="adhd-instructions">
            <h5 className="font-bold text-[8.5px] text-white">Panduan Kontrol Sensor:</h5>
            <ul className="text-[7.5px] text-slate-300 list-disc list-inside space-y-0.5">
              <li>Pinch (cubit) gelembung <b>BUMI</b>.</li>
              <li>Tarik ke <b>orbit ke-3</b> yang berwarna hijau putus-putus.</li>
            </ul>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  setAdhdControlMode('camera');
                  if (typeof startAdhdCamera === 'function') startAdhdCamera();
                }}
                className={`adhd-control-btn ${adhdControlMode === 'camera' ? 'active' : 'inactive'}`}
              >
                📷 Kamera AI
              </button>
              <button
                onClick={() => {
                  setAdhdControlMode('mouse');
                  stopAdhdCamera();
                }}
                className={`adhd-control-btn ${adhdControlMode === 'mouse' ? 'active' : 'inactive'}`}
              >
                🖱️ Mouse/Sentuh
              </button>
            </div>

            <button
              onClick={toggleFocusSound}
              className={`adhd-control-btn w-full mt-1 ${adhdFocusSound ? 'active' : 'inactive'}`}
              style={{ background: adhdFocusSound ? '#6366f1' : '' }}
            >
              🎵 Hum Fokus: {adhdFocusSound ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}

      {/* ================= VIEW 4: ENERGI ROKET (ENERGY CHARGER CHALLENGE) ================= */}
      {activeTab === 'energi' && (
        <div className="pf-module-card relative z-20">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h4 className="font-extrabold text-[10px] text-[#fbbf24]">⚡ STASIUN ENERGI ROKET</h4>
            <button onClick={() => { setQuizAnswered(false); setQuizFeedback(''); setActiveTab('main'); }} className="px-2 py-0.5 bg-rose-600 text-white font-extrabold text-[8px] rounded-full">Tutup</button>
          </div>

          <p className="text-[7.5px] text-slate-300 text-center leading-relaxed">
            Isi daya baterai roketmu dengan menjawab teka-teki luar angkasa di bawah ini!
          </p>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-emerald-500/20 text-center">
            <h5 className="font-extrabold text-[9px] text-[#fbbf24]">Kuis Cepat Energi:</h5>
            <p className="text-[8.5px] text-slate-100 mt-2 font-medium">
              "Berapakah jumlah planet utama yang mengitari Matahari kita?"
            </p>

            <div className="grid grid-cols-3 gap-2 mt-3">
              <button
                onClick={() => handleQuizSubmit(false)}
                className={`py-2 rounded-lg font-bold text-[9px] ${
                  quizAnswered ? 'bg-slate-800 text-slate-500' : 'bg-slate-800 text-white active:bg-slate-700'
                }`}
              >
                7 Planet
              </button>
              <button
                onClick={() => handleQuizSubmit(true)}
                className={`py-2 rounded-lg font-bold text-[9px] ${
                  quizAnswered ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-white active:bg-slate-700'
                }`}
              >
                8 Planet ✓
              </button>
              <button
                onClick={() => handleQuizSubmit(false)}
                className={`py-2 rounded-lg font-bold text-[9px] ${
                  quizAnswered ? 'bg-slate-800 text-slate-500' : 'bg-slate-800 text-white active:bg-slate-700'
                }`}
              >
                9 Planet
              </button>
            </div>

            {quizFeedback && (
              <p className={`text-[7.5px] font-black mt-3 leading-snug ${
                quizFeedback.includes('benar') ? 'text-emerald-400 animate-bounce' : 'text-rose-400'
              }`}>
                {quizFeedback}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg">
            <span className="text-[7.5px] text-slate-400">Status Energi Saat Ini:</span>
            <span className="text-[9px] font-black text-[#fbbf24]">{rocketEnergy}% (Penuh pada 100%)</span>
          </div>
        </div>
      )}

      {/* ================= VIEW 5: BEAUTIFUL PLANET FOKUS DASHBOARD ================= */}
      {activeTab === 'main' && (
        <>
          {/* Header */}
          <header className="pf-header">
            <div className="pf-title-row">
              <span className="pf-title-text">
                <span className="pf-title-planet">PLANET </span>
                <span className="pf-title-fokus">FOKUS</span>
              </span>
            </div>
            <span className="pf-badge">MODE ADHD</span>
            <p className="pf-tagline">
              Belajar jadi petualangan seru! Selesaikan misi 5 menit, isi energi roket, dan jelajahi area baru!
            </p>
          </header>

          {/* Speech bubble */}
          <div className="pf-speech-bubble">
            <span className="pf-speech-avatar">🧑‍🚀</span>
            <p className="pf-speech-msg">
              "Hai Explorer! Selesaikan setiap misi untuk mengisi energi roket dan menjelajahi planet Fokus!"
            </p>
          </div>

          {/* Fitur Utama */}
          <div className="pf-fitur-grid">
            {/* 1. Misi 5 Menit */}
            <div onClick={() => { playSound(480); setActiveTab('misi'); }} className="pf-fitur-card">
              <span className="pf-fitur-icon">⏱️</span>
              <div className="pf-fitur-txt">
                <h4>Misi 5 Menit</h4>
                <p>Belajar singkat & fokus</p>
              </div>
            </div>

            {/* 2. Video Pendek */}
            <div onClick={() => { playSound(520); setActiveTab('video'); }} className="pf-fitur-card">
              <span className="pf-fitur-icon">📹</span>
              <div className="pf-fitur-txt">
                <h4>Video Pendek</h4>
                <p>Materi visual 2-3 menit</p>
              </div>
            </div>

            {/* 3. Mini Game */}
            <div onClick={() => handleLaunchGame('camera')} className="pf-fitur-card">
              <span className="pf-fitur-icon">🎮</span>
              <div className="pf-fitur-txt">
                <h4>Mini Game (AI)</h4>
                <p>Main sambil belajar</p>
              </div>
            </div>

            {/* 4. Energi Roket */}
            <div onClick={() => { playSound(560); setActiveTab('energi'); }} className="pf-fitur-card">
              <span className="pf-fitur-icon">⚡</span>
              <div className="pf-fitur-txt">
                <h4>Energi Roket</h4>
                <p>Mulai misi belajar</p>
              </div>
            </div>
          </div>

          {/* Orbit map (Mini Navigation) */}
          <div className="pf-map-card">
            <div className="pf-center-globe">
              <span className="pf-rocket-glow">🚀</span>
            </div>
            <div onClick={() => { playSound(480); setActiveTab('misi'); }} className="pf-map-loc pf-loc-hutan">
              <h5>1. Hutan Fokus</h5>
              <p>Fakta (⭐ 3/3)</p>
            </div>
            <div onClick={() => handleLaunchGame('camera')} className="pf-map-loc pf-loc-gurun">
              <h5>2. Gurun AI</h5>
              <p>Cubit Bumi (⭐ 2/3)</p>
            </div>
            <div onClick={() => { playSound(520); setActiveTab('video'); }} className="pf-map-loc pf-loc-dingin">
              <h5>3. Dingin Video</h5>
              <p>Materi (⭐ 1/3)</p>
            </div>
            <div onClick={() => { playSound(560); setActiveTab('energi'); }} className="pf-map-loc pf-loc-gunung">
              <h5>4. Gunung Energi</h5>
              <p>Kuis (⭐ 0/3)</p>
            </div>
          </div>

          {/* Rocket energy stats */}
          <div className="pf-energy-box">
            <div className="pf-energy-row">
              <span>⚡ ENERGI ROKET</span>
              <span>{rocketEnergy} / 100</span>
            </div>
            <div className="pf-progress-bg">
              <div className="pf-progress-fill" style={{ width: `${rocketEnergy}%` }}></div>
            </div>
          </div>

          {/* Mission flow */}
          <section className="pf-scroll-flow">
            <h4 className="font-extrabold text-[8.5px] text-center text-slate-400 mb-2">ALUR PENYELESAIAN MISI</h4>
            <div className="pf-flow-cards">
              <div className="pf-flow-card">
                <span className="pf-flow-num">1</span>
                <h5 className="font-extrabold text-blue-500">PILIH MISI</h5>
                <p className="text-[6px] text-slate-500 mt-1">Cari misi 5 menit di peta.</p>
              </div>
              <div className="pf-flow-card">
                <span className="pf-flow-num">2</span>
                <h5 className="font-extrabold text-blue-500">ATUR SENSOR</h5>
                <p className="text-[6px] text-slate-500 mt-1">Pilih Kamera AI atau Mouse.</p>
              </div>
              <div className="pf-flow-card">
                <span className="pf-flow-num">3</span>
                <h5 className="font-extrabold text-blue-500">SORTIR BUMI</h5>
                <p className="text-[6px] text-slate-500 mt-1">Cubit planet ke orbit 3.</p>
              </div>
              <div className="pf-flow-card">
                <span className="pf-flow-num">4</span>
                <h5 className="font-extrabold text-blue-500">ROKET MAJU</h5>
                <p className="text-[6px] text-slate-500 mt-1">Jarak roket & energi bertambah!</p>
              </div>
            </div>
          </section>

          {/* Secondary activities */}
          <div className="pf-stacked-panels">
            {/* Panel 2: Mini Game Edukatif */}
            <div className="pf-activity-panel">
              <h4 className="pf-panel-title">MINI GAME EDUKATIF</h4>
              <div className="pf-math-game">
                <p className="pf-math-equation">3 + 2 = ?</p>
                <div className="pf-math-box">
                  <button onClick={() => handleMathSelect(3)} className={`pf-math-btn ${selectedMathAns === 3 ? 'border-rose-500 bg-rose-50/20' : ''}`}>3</button>
                  <button onClick={() => handleMathSelect(4)} className={`pf-math-btn ${selectedMathAns === 4 ? 'border-rose-500 bg-rose-50/20' : ''}`}>4</button>
                  <button onClick={() => handleMathSelect(5)} className={`pf-math-btn ${mathCompleted ? 'correct' : ''}`}>5 {mathCompleted && '✓'}</button>
                </div>
              </div>
            </div>

            {/* Panel 3: Papan Progres */}
            <div className="pf-activity-panel">
              <h4 className="pf-panel-title">PAPAN PROGRES MISI</h4>
              <div className="space-y-1">
                <div className="pf-checklist-row"><span>✅</span> <span>Misi 1: Mengenal Hewan Hutan</span></div>
                <div className="pf-checklist-row"><span>✅</span> <span>Misi 2: Kuis Berhitung Gurun</span></div>
                <div className="pf-checklist-row"><span>⬜</span> <span>Misi 3: Eksperimen Es Dingin</span></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
