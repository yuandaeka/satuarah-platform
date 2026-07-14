import React, { useState } from 'react';
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
  // --- Dashboard States ---
  const [activeTab, setActiveTab] = useState('main'); // 'main' | 'gameplay' | 'misi' | 'roket' | 'reward'
  const [rocketEnergy, setRocketEnergy] = useState(75);
  const [selectedMathAns, setSelectedMathAns] = useState(null); // for '3+2' mini-game
  const [mathCompleted, setMathCompleted] = useState(false);

  // Sound feedback helper
  const playSound = (freq = 400, duration = 0.15) => {
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    }
  };

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

  return (
    <div className="planet-fokus-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .planet-fokus-container {
          --pf-bg: #07031e;
          --pf-primary: #10b981; /* emerald Green */
          --pf-secondary: #3b82f6; /* blue */
          --pf-accent: #fbbf24; /* yellow */
          --pf-card: rgba(20, 24, 53, 0.95);
          
          font-family: 'Poppins', sans-serif;
          background: radial-gradient(circle at center, #1b0e3b 0%, #060212 100%);
          color: white;
          border-radius: 28px;
          padding: 14px;
          border: 3.5px solid var(--pf-primary);
          box-shadow: inset 0 0 35px rgba(0,0,0,0.8);
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow-y: auto;
          max-height: 800px;
          position: relative;
        }

        .planet-fokus-container::-webkit-scrollbar {
          width: 4px;
        }
        .planet-fokus-container::-webkit-scrollbar-thumb {
          background: var(--pf-primary);
          border-radius: 10px;
        }

        /* Title Area */
        .pf-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 4px;
        }
        .pf-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
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
        .pf-tagline {
          font-size: 8.5px;
          color: #93c5fd;
          max-width: 300px;
          line-height: 1.3;
          margin-top: 4px;
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
          grid-template-cols: 1fr 1fr;
          gap: 8px;
          width: 100%;
        }
        .pf-fitur-card {
          background: var(--pf-card);
          border: 1.5px solid rgba(16, 185, 129, 0.25);
          border-radius: 16px;
          padding: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .pf-fitur-icon {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #10b981, #047857);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .pf-fitur-txt h4 { font-size: 8px; font-weight: 900; color: white; margin: 0; }
        .pf-fitur-txt p { font-size: 6px; color: #a7f3d0; margin: 0; }

        /* Orbit map (Spaced for mobile phone wrapper) */
        .pf-map-card {
          background: rgba(6, 3, 23, 0.7);
          border: 2px solid rgba(16, 185, 129, 0.3);
          border-radius: 24px;
          height: 220px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          overflow: hidden;
        }
        .pf-center-globe {
          width: 110px;
          height: 110px;
          background: radial-gradient(circle at 30% 30%, #a7f3d0 0%, #10b981 50%, #064e3b 100%);
          border-radius: 50%;
          box-shadow: 0 8px 22px rgba(0,0,0,0.6), inset 0 -6px 0 rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .pf-rocket-ship {
          font-size: 2.2rem;
          animation: float 4s ease-in-out infinite;
          cursor: pointer;
        }

        /* Orbit Map Location tags */
        .pf-map-loc {
          position: absolute;
          background: rgba(10, 15, 45, 0.95);
          border: 1.5px solid var(--pf-primary);
          border-radius: 12px;
          padding: 4px 6px;
          cursor: pointer;
          width: 95px;
          text-align: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.4);
          z-index: 10;
        }
        .pf-map-loc h5 { font-size: 7px; font-weight: 900; color: white; margin: 0; }
        .pf-map-loc p { font-size: 5.5px; color: #a7f3d0; margin: 0; }

        .pf-loc-hutan { top: 10px; left: 10px; }
        .pf-loc-gurun { top: 10px; right: 10px; }
        .pf-loc-dingin { bottom: 10px; left: 10px; }
        .pf-loc-gunung { bottom: 10px; right: 10px; }

        /* Stats sidebar wrapper */
        .pf-status-box {
          background: var(--pf-card);
          border: 1.5px solid rgba(16, 185, 129, 0.2);
          border-radius: 20px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .pf-stat-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pf-stat-title { font-size: 8px; font-weight: 900; color: var(--pf-accent); display: flex; align-items: center; gap: 4px; }
        .pf-stat-val { font-size: 7.5px; font-weight: 800; color: #93c5fd; }
        
        .pf-progress-bg { width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; margin-top: 2px; }
        .pf-progress-fill { height: 100%; background: var(--pf-primary); transition: width 0.3s; }

        /* Daily Companion */
        .pf-companion {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pf-companion-avatar { font-size: 1.8rem; }
        .pf-companion-bubble { font-size: 7px; color: #cbd5e1; line-height: 1.3; }

        /* Horisontal Mission flow */
        .pf-flow-container {
          background: rgba(255, 255, 255, 0.02);
          border: 1.5px solid rgba(16, 185, 129, 0.15);
          border-radius: 20px;
          padding: 10px;
          width: 100%;
        }
        .pf-flow-header {
          font-size: 9px;
          font-weight: 900;
          color: var(--pf-accent);
          text-align: center;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .pf-flow-cards {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 6px;
        }
        .pf-flow-cards::-webkit-scrollbar { height: 4px; }
        .pf-flow-cards::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.3); border-radius: 10px; }
        
        .pf-flow-card {
          flex: 0 0 135px;
          background: white;
          color: #1e293b;
          border-radius: 16px;
          padding: 10px;
          border: 1.5px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .pf-flow-num {
          position: absolute;
          top: -8px;
          left: 10px;
          width: 18px;
          height: 18px;
          background: var(--pf-accent);
          color: #78350f;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 900;
        }
        .pf-flow-title { font-size: 7.5px; font-weight: 900; color: var(--pf-secondary); text-transform: uppercase; margin-top: 4px; }
        .pf-flow-desc { font-size: 6.5px; color: #64748b; margin-top: 2px; line-height: 1.3; }

        /* Contoh Aktivitas Stack */
        .pf-vertical-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }
        .pf-activity-panel {
          background: var(--pf-card);
          border: 2px solid rgba(16, 185, 129, 0.2);
          border-radius: 22px;
          padding: 14px;
        }
        .pf-panel-title {
          font-size: 9px;
          font-weight: 900;
          color: var(--pf-accent);
          text-transform: uppercase;
          border-bottom: 1.5px dashed rgba(255,255,255,0.1);
          padding-bottom: 6px;
          margin-bottom: 10px;
        }

        /* Math drag game layout */
        .pf-math-game {
          background: rgba(255,255,255,0.03);
          border-radius: 16px;
          padding: 10px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .pf-math-equation { font-size: 1.2rem; font-weight: 900; color: white; margin-bottom: 8px; }
        .pf-math-options { display: flex; justify-content: center; gap: 8px; }
        .pf-math-btn {
          background: #241c48;
          border: 1.5px solid var(--pf-primary);
          color: white;
          font-size: 10px;
          font-weight: 900;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
        }
        .pf-math-btn.correct { background: var(--pf-primary); border-color: #10b981; }

        /* Progressive Checklist */
        .pf-checklist-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 8px;
          font-weight: 700;
          color: #cbd5e1;
          margin-bottom: 6px;
        }

        /* Sticky Footer Nav */
        .pf-mobile-nav {
          background: #0d0c26;
          border-top: 2.5px solid rgba(16, 185, 129, 0.25);
          border-radius: 16px;
          display: grid;
          grid-template-cols: repeat(5, 1fr);
          padding: 6px;
          width: 100%;
        }
        .pf-nav-item {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 7.5px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .pf-nav-item.active { color: var(--pf-accent); }

        .pf-slogan {
          text-align: center;
          font-size: 7px;
          font-weight: 900;
          color: var(--pf-primary);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-top: 4px;
        }

        /* Native sorting game styles */
        .pf-native-game-box {
          background: #020617;
          border: 2px solid var(--pf-primary);
          border-radius: 20px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
      ` }} />

      {/* VIEW A: ACTIVE SORTING GAME MODE OVERLAY */}
      {activeTab === 'gameplay' && (
        <div className="pf-native-game-box relative z-20">
          <div className="flex justify-between items-center border-b border-emerald-500/20 pb-2 mb-2">
            <h4 className="font-extrabold text-[9px] text-[#fbbf24] uppercase">
              🪐 AKTIVITAS GAMEPLAY: SORTING PLANET
            </h4>
            <button
              onClick={() => {
                stopAdhdCamera();
                setActiveTab('main');
              }}
              className="px-3 py-1 bg-rose-600 text-white font-extrabold text-[7.5px] rounded-full"
            >
              Keluar Game
            </button>
          </div>

          {/* Core Game Wrapper from ADHDMode */}
          <div className="relative w-full aspect-video bg-slate-950 rounded-xl overflow-hidden border border-emerald-500/20" id="game_bounds">
            {adhdControlMode === 'camera' && (
              <div className="absolute top-2 right-2 w-28 aspect-video bg-black rounded-lg border border-white/50 overflow-hidden z-50">
                <video ref={adhdVideoRef} style={{ display: 'none' }} playsInline muted />
                <canvas ref={adhdOverlayCanvasRef} width={320} height={240} className="w-full h-full transform scale-x-[-1]" />
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

            <canvas
              ref={adhdGameCanvasRef}
              onMouseMove={handleAdhdBoardMouseMove}
              onMouseDown={handleAdhdBoardMouseDown}
              onMouseUp={handleAdhdBoardMouseUp}
              onMouseLeave={handleAdhdBoardMouseUp}
              onTouchMove={handleAdhdBoardTouchMove}
              onTouchStart={handleAdhdBoardTouchStart}
              onTouchEnd={handleAdhdBoardTouchEnd}
              className="w-full h-full touch-none"
            />

            {/* Loading */}
            {adhdGameState === 'loading' && adhdControlMode === 'camera' && (
              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-center p-3">
                <h5 className="font-extrabold text-[10px] text-white">Scanning Kamera...</h5>
                <p className="text-[7.5px] text-slate-400 mt-1">Mengaktifkan sensor deteksi cubit</p>
                {adhdCamError && (
                  <div className="bg-rose-500/20 border border-rose-500/20 p-2 rounded-lg max-w-[200px] mt-2">
                    <p className="text-rose-400 text-[6.5px] leading-tight mb-2">{adhdCamError}</p>
                    <button onClick={() => setAdhdControlMode('mouse')} className="px-2 py-0.5 bg-blue-500 text-white text-[6.5px] font-bold rounded">
                      Ganti Mouse
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Start Overlay */}
            {adhdGameState === 'start' && (
              <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center text-center p-4">
                <h5 className="font-extrabold text-xs text-white">Sortir Planet Bumi</h5>
                <p className="text-[7.5px] text-slate-400 mt-1 max-w-[180px] leading-relaxed">
                  Cubit (Pinch) gelembung BUMI lalu arahkan dan lepaskan di orbit ketiga dari Matahari!
                </p>
                <button className="px-4 py-1.5 bg-emerald-500 text-slate-950 text-[8.5px] font-black rounded-full mt-3 shadow active:scale-95" onClick={startGame}>
                  Mulai Permainan
                </button>
              </div>
            )}

            {/* Lose */}
            {adhdGameState === 'lost' && (
              <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center text-center p-4">
                <h5 className="font-extrabold text-xs text-rose-500">Misi Gagal</h5>
                <p className="text-[7.5px] text-slate-400 mt-1">{adhdFailReason}</p>
                <button className="px-4 py-1.5 bg-blue-500 text-white text-[8.5px] font-black rounded-full mt-3 active:scale-95" onClick={startGame}>
                  Coba Lagi
                </button>
              </div>
            )}

            {/* Win */}
            {adhdGameState === 'won' && (
              <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center text-center p-4">
                <h5 className="font-extrabold text-xs text-emerald-500">Misi Selesai</h5>
                <p className="text-[7.5px] text-slate-400 mt-1">Luar biasa! Planet Bumi berhasil ditempatkan.</p>
                <button
                  className="px-4 py-1.5 bg-emerald-500 text-slate-950 text-[8.5px] font-black rounded-full mt-3 active:scale-95"
                  onClick={() => {
                    setAdhdGameState('start');
                    setActiveTab('main');
                  }}
                >
                  Lanjut Ke Misi Berikutnya
                </button>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-emerald-500/20 space-y-2">
            <h5 className="font-extrabold text-[8px] text-emerald-400">Kontrol Alat Deteksi:</h5>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setAdhdControlMode('camera');
                  startGame();
                }}
                className={`flex-1 py-1.5 text-[7.5px] font-black rounded-lg ${adhdControlMode === 'camera' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
              >
                📷 Kamera AI
              </button>
              <button
                onClick={() => {
                  setAdhdControlMode('mouse');
                  stopAdhdCamera();
                }}
                className={`flex-1 py-1.5 text-[7.5px] font-black rounded-lg ${adhdControlMode === 'mouse' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
              >
                🖱️ Mouse/Sentuh
              </button>
            </div>
            
            <button
              onClick={toggleFocusSound}
              className={`w-full py-1.5 text-[7.5px] font-black rounded-lg ${adhdFocusSound ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              🎵 Hum Fokus: {adhdFocusSound ? 'AKTIF' : 'OFF'}
            </button>
          </div>
        </div>
      )}

      {/* VIEW B: MAIN ZONE */}
      {activeTab === 'main' && (
        <>
          {/* Header stacked */}
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
            <div onClick={() => setActiveTab('gameplay')} className="pf-fitur-card">
              <span className="pf-fitur-icon">⏱️</span>
              <div className="pf-fitur-txt">
                <h4>Misi 5 Menit</h4>
                <p>Belajar singkat & fokus</p>
              </div>
            </div>

            <div onClick={() => setActiveTab('gameplay')} className="pf-fitur-card">
              <span className="pf-fitur-icon">📹</span>
              <div className="pf-fitur-txt">
                <h4>Video Pendek</h4>
                <p>Materi visual 2-3 menit</p>
              </div>
            </div>

            <div onClick={() => setActiveTab('gameplay')} className="pf-fitur-card">
              <span className="pf-fitur-icon">🎮</span>
              <div className="pf-fitur-txt">
                <h4>Mini Game</h4>
                <p>Main sambil belajar</p>
              </div>
            </div>

            <div onClick={() => setActiveTab('main')} className="pf-fitur-card">
              <span className="pf-fitur-icon">⚡</span>
              <div className="pf-fitur-txt">
                <h4>Energi Roket</h4>
                <p>Selesaikan tantangan</p>
              </div>
            </div>
          </div>

          {/* Map layout (Spaced for phone wrapper) */}
          <div className="pf-map-card">
            <div className="pf-center-globe">
              <span onClick={() => { playSound(640); confetti({ particleCount: 20 }); }} className="pf-rocket-ship">🚀</span>
            </div>

            <div onClick={() => { setActiveTab('gameplay'); playSound(520); }} className="pf-map-loc pf-loc-hutan">
              <h5>1. Hutan Fokus</h5>
              <p>Belajar Hewan (⭐ 3/3)</p>
            </div>

            <div onClick={() => { setActiveTab('gameplay'); playSound(580); }} className="pf-map-loc pf-loc-gurun">
              <h5>2. Gurun Tantangan</h5>
              <p>Misi Matematika (⭐ 2/3)</p>
            </div>

            <div onClick={() => { setActiveTab('gameplay'); playSound(620); }} className="pf-map-loc pf-loc-dingin">
              <h5>3. Dingin Kreatif</h5>
              <p>Belajar Sains (⭐ 1/3)</p>
            </div>

            <div onClick={() => { setActiveTab('gameplay'); playSound(700); }} className="pf-map-loc pf-loc-gunung">
              <h5>4. Gunung Game</h5>
              <p>Mini Game Seru (⭐ 0/3)</p>
            </div>
          </div>

          {/* Rocket energy stats panel */}
          <div className="pf-status-box">
            <div className="pf-stat-item">
              <span className="pf-stat-title">⚡ ENERGI ROKET</span>
              <span className="pf-stat-val">{rocketEnergy} / 100</span>
            </div>
            <div className="pf-progress-bg">
              <div className="pf-progress-fill" style={{ width: `${rocketEnergy}%` }}></div>
            </div>

            <div className="pf-companion">
              <span className="pf-companion-avatar">🤖</span>
              <p className="pf-companion-bubble">
                <b>Fokus Bot:</b> "Aku akan membantumu tetap fokus dan menyelesaikan misi hari ini!"
              </p>
            </div>
          </div>

          {/* Horizontal scroll mission flow */}
          <section className="pf-flow-container">
            <h3 className="pf-flow-header">ALUR MISI PLANET FOKUS</h3>
            <div className="pf-flow-cards">
              <div className="pf-flow-card">
                <span className="pf-flow-num">1</span>
                <h4 className="pf-flow-title">PILIH MISI</h4>
                <p className="pf-flow-desc">Pilih misi singkat 5 menit.</p>
                <div className="bg-slate-100 p-1.5 rounded-lg text-center text-xl mt-auto">🐘🦁</div>
              </div>

              <div className="pf-flow-card">
                <span className="pf-flow-num">2</span>
                <h4 className="pf-flow-title">TONTON VIDEO</h4>
                <p className="pf-flow-desc">Tonton video durasi 2-3 menit.</p>
                <div className="bg-slate-150 p-1.5 rounded-lg text-center text-xl mt-auto">🦁🎥</div>
              </div>

              <div className="pf-flow-card">
                <span className="pf-flow-num">3</span>
                <h4 className="pf-flow-title">MINI GAME</h4>
                <p className="pf-flow-desc">Kerjakan mini game edukatif.</p>
                <div className="bg-slate-100 p-1.5 rounded-lg text-center text-lg mt-auto">🍎🥕</div>
              </div>

              <div className="pf-flow-card">
                <span className="pf-flow-num">4</span>
                <h4 className="pf-flow-title">ISI ENERGI</h4>
                <p className="pf-flow-desc">Energi roket bertambah +20.</p>
                <div className="bg-emerald-50 p-1.5 rounded-lg text-center text-lg font-bold text-emerald-700 mt-auto">⚡ +20</div>
              </div>

              <div className="pf-flow-card">
                <span className="pf-flow-num">5</span>
                <h4 className="pf-flow-title">JELAJAHI AREA</h4>
                <p className="pf-flow-desc">Buka gerbang planet baru.</p>
                <div className="bg-amber-50 p-1 rounded-lg text-center text-lg mt-auto">🚀🌌</div>
              </div>
            </div>
          </section>

          {/* Contoh Aktivitas Stack Panels */}
          <div className="pf-vertical-stack">
            {/* Panel 1: Video Pendek */}
            <div className="pf-activity-panel">
              <h4 className="pf-panel-title">VIDEO PENDEK</h4>
              <div className="bg-slate-950 p-3 rounded-xl border flex items-center justify-between gap-4 mb-2">
                <span className="text-3xl">🐢</span>
                <div className="text-[7.5px] text-slate-300">
                  <b>Belajar Hewan: Kura-Kura</b>
                  <p className="text-[6.5px] text-slate-400 mt-0.5">Durasi singkat, visual kaya warna & fokus tinggi.</p>
                </div>
              </div>
            </div>

            {/* Panel 2: Mini Game Edukatif */}
            <div className="pf-activity-panel">
              <h4 className="pf-panel-title">MINI GAME EDUKATIF</h4>
              <div className="pf-math-game">
                <p className="pf-math-equation">3 + 2 = ?</p>
                <div className="pf-math-options">
                  <button onClick={() => handleMathSelect(3)} className={`pf-math-btn ${selectedMathAns === 3 ? 'border-rose-500 bg-rose-50/20' : ''}`}>3</button>
                  <button onClick={() => handleMathSelect(4)} className={`pf-math-btn ${selectedMathAns === 4 ? 'border-rose-500 bg-rose-50/20' : ''}`}>4</button>
                  <button onClick={() => handleMathSelect(5)} className={`pf-math-btn ${mathCompleted ? 'correct' : ''}`}>5 {mathCompleted && '✓'}</button>
                </div>
              </div>
            </div>

            {/* Panel 3: Papan Progres */}
            <div className="pf-activity-panel">
              <h4 className="pf-panel-title">PAPAN PROGRES MISI</h4>
              <div className="space-y-1.5">
                <div className="pf-checklist-row">
                  <span>✅</span> <span>Misi 1: Mengenal Hewan Hutan</span>
                </div>
                <div className="pf-checklist-row">
                  <span>✅</span> <span>Misi 2: Kuis Berhitung Gurun</span>
                </div>
                <div className="pf-checklist-row">
                  <span>⬜</span> <span>Misi 3: Eksperimen Es Dingin</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center mt-3 border-t border-slate-700/50 pt-3">
                <div className="text-center"><span className="text-xl">🎯</span><p className="text-[5.5px] font-black text-slate-300">Fokus</p></div>
                <div className="text-center"><span className="text-xl">🚀</span><p className="text-[5.5px] font-black text-slate-300">Pemberani</p></div>
                <div className="text-center"><span className="text-xl">📖</span><p className="text-[5.5px] font-black text-slate-300">Pintar</p></div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Navigasi Bawah */}
      <div className="pf-speech-bubble mt-2">
        <span className="text-2xl">🧑‍🚀</span>
        <p className="pf-speech-msg">
          "Kamu hebat! Terus selesaikan misi dan jadilah Explorer Terbaik!"
        </p>
      </div>

      <footer className="pf-mobile-nav">
        <div onClick={() => setActiveTab('main')} className={`pf-nav-item ${activeTab === 'main' ? 'active' : ''}`} role="button">
          <span>🏠</span><span>Beranda</span>
        </div>
        <div onClick={() => setActiveTab('gameplay')} className={`pf-nav-item ${activeTab === 'gameplay' ? 'active' : ''}`} role="button">
          <span>🎯</span><span>Misi</span>
        </div>
        <div onClick={() => setActiveTab('main')} className="pf-nav-item" role="button">
          <span>🚀</span><span>Roket</span>
        </div>
        <div onClick={() => setActiveTab('main')} className="pf-nav-item" role="button">
          <span>🎁</span><span>Reward</span>
        </div>
        <div onClick={() => setSelectedMode(null)} className="pf-nav-item" role="button">
          <span>🚪</span><span>Keluar</span>
        </div>
      </footer>

      <p className="pf-slogan">
        ⚡ BELAJAR SINGKAT, SERU, DAN FOKUS! ⚡
      </p>
    </div>
  );
}
