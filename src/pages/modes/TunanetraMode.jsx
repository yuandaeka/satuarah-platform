import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function TunanetraMode({
  isTunanetraNarrating,
  tunanetraStoryIndex,
  setTunanetraStoryIndex,
  micListeningSimulated,
  tunanetraAnswerResult,
  setTunanetraAnswerResult,
  voiceGuide,
  speakText,
  stopSpeaking,
  startTunanetraMic,
  TUNANETRA_STORIES
}) {
  // --- Game/Interface States ---
  const [activeTab, setActiveTab] = useState('main'); // 'main' | 'materi' | 'tebak' | 'kuis' | 'koleksi'
  const [jejakCount, setJejakCount] = useState(12);
  const [selectedAnimalSound, setSelectedAnimalSound] = useState(null); // for 'tebak' game
  const [soundGuides, setSoundGuides] = useState({
    burung: true,
    hujan: true,
    ombak: true,
    sapi: true,
    kelinci: false
  });

  // Accessibility settings states
  const [speechRate, setSpeechRate] = useState('Normal');
  const [voiceType, setVoiceType] = useState('Suara Ramah');
  const [volume, setVolume] = useState(80);
  const [musicOn, setMusicOn] = useState(true);
  const [vibrateOn, setVibrateOn] = useState(true);
  const [tutorialOn, setTutorialOn] = useState(true);

  // Sound generator helper
  const playBeep = (freq = 520, type = 'sine', duration = 0.15) => {
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    }
  };

  // Keyboard spacebar listener
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        playBeep(440, 'sine', 0.1);
        if (activeTab === 'materi') {
          speakText("Hari ini kita belajar tentang hewan kelinci. Kelinci adalah hewan mamalia berbulu halus yang melompat cepat.", true);
        } else if (activeTab === 'tebak') {
          speakText("Aku mendengar suara burung dari arah kiri. Suara manakah itu?", true);
        } else if (activeTab === 'kuis') {
          speakText("Pertanyaan: Apa makanan kelinci? Tekan tombol mikrofon kuning untuk berbicara.", true);
        } else {
          speakText("Planet Suara diaktifkan. Gunakan tombol navigasi di atas untuk memulai penjelajahan suaramu.", true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, speakText]);

  // Quiz voice button click handler
  const handleMicrophoneClick = () => {
    playBeep(640, 'sine', 0.25);
    startTunanetraMic();
    setTimeout(() => {
      setSoundGuides(prev => ({ ...prev, kelinci: true }));
      setJejakCount(13);
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    }, 2800);
  };

  return (
    <div className="planet-suara-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .planet-suara-container {
          --ps-bg: #0b071e;
          --ps-primary: #a855f7;
          --ps-secondary: #f59e0b;
          --ps-accent: #10b981;
          --ps-card: rgba(255, 255, 255, 0.05);
          --ps-text: #f3e8ff;
          
          font-family: 'Poppins', sans-serif;
          background: radial-gradient(circle at center, #1b1248 0%, #060312 100%);
          color: var(--ps-text);
          border-radius: 28px;
          padding: 18px;
          border: 3.5px solid var(--ps-primary);
          box-shadow: inset 0 0 35px rgba(0,0,0,0.8), 0 20px 40px rgba(0,0,0,0.4);
          position: relative;
          min-height: 480px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .ps-glow-overlay {
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          top: -100px;
          left: -50px;
          z-index: 0;
        }

        .ps-header {
          text-align: center;
          margin-bottom: 12px;
          position: relative;
          z-index: 2;
        }
        .ps-title {
          font-size: 1.6rem;
          font-weight: 900;
          text-shadow: 0 3px 0 #581c87;
          background: linear-gradient(to bottom, #fffbeb, #fbbf24);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 0.06em;
        }
        .ps-subtitle {
          font-size: 0.7rem;
          color: #c084fc;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* Top Welcome Card */
        .ps-welcome-card {
          background: var(--ps-card);
          border-radius: 20px;
          padding: 10px 14px;
          border: 1.5px solid rgba(168, 85, 247, 0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          position: relative;
          z-index: 2;
        }
        .ps-welcome-text h4 {
          font-size: 10px;
          font-weight: 800;
          color: var(--ps-secondary);
          margin: 0;
        }
        .ps-welcome-text p {
          font-size: 7.5px;
          color: #cbd5e1;
          margin: 1px 0 0 0;
          line-height: 1.4;
        }
        .ps-wave-bar {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          height: 24px;
        }
        .ps-wave-line {
          width: 3px;
          background: var(--ps-primary);
          border-radius: 4px;
          transition: height 0.15s ease;
        }

        /* Circular Map section */
        .ps-map-view {
          background: rgba(8, 3, 23, 0.6);
          border: 2.5px solid rgba(168, 85, 247, 0.25);
          border-radius: 24px;
          height: 145px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 12px;
        }
        .ps-map-lines {
          position: absolute;
          width: 100%;
          height: 100%;
          stroke: rgba(168,85,247,0.15);
          stroke-dasharray: 4,4;
          pointer-events: none;
        }
        .ps-core-globe {
          width: 75px;
          height: 75px;
          background: radial-gradient(circle at 30% 30%, #d8b4fe 0%, #7c3aed 50%, #3b0764 100%);
          border-radius: 50%;
          box-shadow: 0 8px 20px rgba(0,0,0,0.5), inset 0 -6px 0 rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ps-globe-icon {
          font-size: 1.8rem;
          animation: float 4s ease-in-out infinite;
        }

        /* 3D clickable sphere buttons */
        .ps-sphere-btn {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 6px 12px rgba(0,0,0,0.3), inset 0 3px 0 rgba(255,255,255,0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 10;
        }
        .ps-sphere-btn:hover {
          transform: scale(1.15);
        }
        .ps-sphere-btn:active {
          transform: scale(0.95);
        }

        .ps-btn-hutan { top: 8px; left: 20px; background: radial-gradient(circle at 30% 30%, #a855f7, #6b21a8); }
        .ps-btn-danau { bottom: 8px; left: 20px; background: radial-gradient(circle at 30% 30%, #3b82f6, #1d4ed8); }
        .ps-btn-gua { top: 8px; right: 20px; background: radial-gradient(circle at 30% 30%, #10b981, #065f46); }
        .ps-btn-puncak { bottom: 8px; right: 20px; background: radial-gradient(circle at 30% 30%, #fbbf24, #d97706); }

        .ps-sphere-emoji { font-size: 1rem; line-height: 1; }
        .ps-sphere-label { font-size: 6px; font-weight: 900; color: white; margin-top: 0.5px; text-shadow: 0 1px 2px rgba(0,0,0,0.7); }

        /* Footstep path animation visual */
        .ps-footsteps {
          position: absolute;
          font-size: 7px;
          color: var(--ps-secondary);
          opacity: 0.5;
          pointer-events: none;
        }

        /* Soundy Assistant bubble */
        .ps-soundy-card {
          background: var(--ps-card);
          border-radius: 18px;
          padding: 10px;
          border: 1.5px solid rgba(168, 85, 247, 0.2);
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          position: relative;
          z-index: 2;
        }
        .ps-soundy-avatar {
          font-size: 2.2rem;
          animation: float 4s ease-in-out infinite alternate;
        }
        .ps-soundy-text {
          font-size: 7.5px;
          line-height: 1.4;
          color: #ddd6fe;
        }

        /* Progress row */
        .ps-progress-row {
          background: rgba(255,255,255,0.03);
          border-radius: 16px;
          padding: 8px 12px;
          border: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .ps-progress-label {
          font-size: 8px;
          font-weight: 800;
          color: var(--ps-secondary);
        }
        .ps-progress-badges {
          display: flex;
          gap: 4px;
        }
        .ps-badge {
          width: 18px;
          height: 18px;
          background: rgba(255,255,255,0.08);
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
        }

        /* Interactive flow views */
        .ps-game-card {
          background: var(--ps-card);
          border: 2px solid var(--ps-primary);
          border-radius: 24px;
          padding: 16px;
          min-height: 230px;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease-out;
        }
        .ps-game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1.5px dashed rgba(255,255,255,0.1);
          padding-bottom: 6px;
          margin-bottom: 10px;
        }
        .ps-game-title {
          font-size: 10px;
          font-weight: 900;
          color: var(--ps-secondary);
          text-transform: uppercase;
        }
        .ps-back-btn {
          background: #ef4444;
          color: white;
          font-size: 7.5px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
        }

        /* Speak Quiz Soundwave */
        .ps-soundwave {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 4px;
          height: 35px;
          margin-bottom: 8px;
        }
        .ps-soundwave-bar {
          width: 4px;
          background: var(--ps-secondary);
          border-radius: 4px;
          height: 20%;
          transition: height 0.1s ease;
        }
        .ps-soundwave-bar.active {
          animation: bounce 0.6s infinite alternate;
        }

        .ps-play-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--ps-secondary);
          border: none;
          font-size: 1.6rem;
          color: #0c0418;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin: 8px auto;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        }

        /* Tebak Arah Game Buttons */
        .ps-quiz-options {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 10px;
        }
        .ps-quiz-btn {
          background: #110c2e;
          border: 1.5px solid var(--ps-primary);
          color: white;
          font-size: 8px;
          font-weight: 800;
          padding: 6px 10px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          cursor: pointer;
          min-width: 55px;
        }

        /* Accessibility setting grid */
        .ps-settings {
          display: grid;
          grid-template-cols: 1fr 1fr;
          gap: 8px;
          background: rgba(0, 0, 0, 0.25);
          padding: 8px;
          border-radius: 16px;
          border: 1.5px solid rgba(168, 85, 247, 0.15);
          margin-top: auto;
        }
        .ps-setting-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 7.5px;
          font-weight: 800;
          color: #c084fc;
        }
        .ps-setting-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          font-size: 7px;
          padding: 2.5px 6px;
          border-radius: 6px;
          cursor: pointer;
        }

        /* Action footer bar */
        .ps-footer {
          display: grid;
          grid-template-cols: repeat(5, 1fr);
          gap: 6px;
          margin-top: 10px;
          border-top: 1.5px solid rgba(255,255,255,0.06);
          padding-top: 8px;
        }
        .ps-footer-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          color: #ddd6fe;
          font-size: 7.5px;
          font-weight: 800;
          padding: 6px 2px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.15s;
        }
        .ps-footer-btn:hover {
          background: rgba(168, 85, 247, 0.1);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes bounce {
          from { height: 15%; }
          to { height: 100%; }
        }
        @keyframes slideUp {
          from { transform: translateY(12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      ` }} />

      <div className="ps-glow-overlay"></div>

      {/* VIEW A: MAIN MAP */}
      {activeTab === 'main' && (
        <>
          <header className="ps-header">
            <h2 className="ps-title">🪐 PLANET SUARA</h2>
            <p className="ps-subtitle">Mode Tunanetra</p>
          </header>

          {/* Welcome visualizer */}
          <div className="ps-welcome-card">
            <div className="ps-welcome-text">
              <h4>Selamat datang, Explorer!</h4>
              <p>Planet ini gelap, tapi suara akan menuntun setiap langkahmu.</p>
            </div>
            <div className="ps-wave-bar">
              {[15, 35, 25, 50, 20, 30].map((h, i) => (
                <div
                  key={i}
                  className="ps-wave-line"
                  style={{
                    height: isTunanetraNarrating ? `${h}%` : '6px',
                    animation: isTunanetraNarrating ? `bounce ${0.4 + i * 0.1}s infinite alternate` : 'none'
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Circular Map */}
          <div className="ps-map-view">
            <svg className="ps-map-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
              <circle cx="50" cy="50" r="38" fill="none" />
              <path d="M25,25 Q50,15 75,25" fill="none" />
              <path d="M25,75 Q50,85 75,75" fill="none" />
            </svg>

            {/* Footstep indicator dots */}
            <span className="ps-footsteps" style={{ top: '35px', left: '42px' }}>👣</span>
            <span className="ps-footsteps" style={{ top: '65px', left: '42px' }}>👣</span>
            <span className="ps-footsteps" style={{ top: '48px', right: '40px' }}>👣</span>

            <div className="ps-core-globe">
              <span className="ps-globe-icon">🎧</span>
            </div>

            {/* Landmarks */}
            <button
              onClick={() => { setActiveTab('materi'); playBeep(520); speakText("Zona Hutan Gema. Mari dengarkan materi kelinci."); }}
              className="ps-sphere-btn ps-btn-hutan"
            >
              <span className="ps-sphere-emoji">🌳</span>
              <span className="ps-sphere-label">Hutan Gema</span>
            </button>

            <button
              onClick={() => { setActiveTab('tebak'); playBeep(580); speakText("Zona Danau Irama. Mari tebak arah suara."); }}
              className="ps-sphere-btn ps-btn-danau"
            >
              <span className="ps-sphere-emoji">🌊</span>
              <span className="ps-sphere-label">Danau Irama</span>
            </button>

            <button
              onClick={() => { setActiveTab('kuis'); playBeep(640); speakText("Zona Gua Tanya. Kuis mikrofon."); }}
              className="ps-sphere-btn ps-btn-gua"
            >
              <span className="ps-sphere-emoji">🏰</span>
              <span className="ps-sphere-label">Gua Tanya</span>
            </button>

            <button
              onClick={() => {
                playBeep(720);
                speakText("Zona Puncak Harmoni terkunci. Kumpulkan 15 Jejak Suara terlebih dahulu!");
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
              }}
              className="ps-sphere-btn ps-btn-puncak opacity-60"
            >
              <span className="ps-sphere-emoji">🔒</span>
              <span className="ps-sphere-label">Puncak</span>
            </button>
          </div>

          {/* Soundy helper */}
          <div className="ps-soundy-card">
            <span className="ps-soundy-avatar">🤖</span>
            <div className="ps-soundy-text">
              <b>Soundy:</b> "Aku Soundy, asistenmu. Ketuk salah satu **Bintang Lokasi** di peta untuk melatih pendengaranmu!"
            </div>
          </div>

          {/* Collected badges */}
          <div className="ps-progress-row">
            <span className="ps-progress-label">Jejak Suara: {jejakCount} / 50</span>
            <div className="ps-progress-badges">
              <span className="ps-badge">🐦</span>
              <span className="ps-badge">🌧️</span>
              <span className="ps-badge">🌊</span>
              <span className="ps-badge">🐄</span>
              {soundGuides.kelinci && <span className="ps-badge" style={{ borderColor: '#fbbf24' }}>🐰</span>}
            </div>
          </div>
        </>
      )}

      {/* VIEW B.1: DENGARKAN MATERI */}
      {activeTab === 'materi' && (
        <div className="ps-game-card">
          <div className="ps-game-header">
            <h3 className="ps-game-title">🔊 1. Dengarkan Materi</h3>
            <button onClick={() => setActiveTab('main')} className="ps-back-btn">Kembali</button>
          </div>

          <p className="text-[9px] font-bold text-slate-400 text-center mb-2">
            Soundy akan membacakan cerita tentang kelinci:
          </p>

          <div className="bg-slate-950/50 p-3 rounded-xl border border-purple-500/20 text-center mb-2">
            <p className="text-[9.5px] font-semibold leading-relaxed">
              "Kelinci adalah hewan mamalia kecil berbulu halus yang suka melompat cepat dan memakan sayuran hijau."
            </p>
          </div>

          <button
            onClick={() => {
              playBeep(440);
              speakText("Hari ini kita belajar tentang kelinci. Kelinci adalah hewan mamalia berbulu halus yang melompat cepat.");
            }}
            className="ps-play-btn"
            title="Putar Suara"
          >
            ▶️
          </button>
        </div>
      )}

      {/* VIEW B.2: TEMUKAN JEJAK SUARA */}
      {activeTab === 'tebak' && (
        <div className="ps-game-card">
          <div className="ps-game-header">
            <h3 className="ps-game-title">🎧 2. Temukan Jejak Suara</h3>
            <button onClick={() => setActiveTab('main')} className="ps-back-btn">Kembali</button>
          </div>

          <p className="text-[9px] font-bold text-slate-400 text-center mb-2">
            Dengarkan suara petunjuk di bawah dan tebak hewannya:
          </p>

          <div className="bg-slate-950/50 p-3 rounded-xl border border-purple-500/20 text-center mb-2 flex items-center justify-between">
            <span className="text-xl">📻</span>
            <p className="text-[9px] font-bold text-slate-200">"Aku mendengar suara kicau burung dari arah kiri."</p>
          </div>

          <button
            onClick={() => {
              playBeep(680, 'sine', 0.5);
              speakText("Aku mendengar suara burung dari arah kiri. Suara manakah itu?");
            }}
            className="px-4 py-1 bg-purple-600 text-white text-[8px] font-bold rounded-lg self-center border border-purple-400"
          >
            🔊 Putar Petunjuk Suara
          </button>

          <div className="ps-quiz-options">
            <button
              onClick={() => {
                playBeep(523);
                setSelectedAnimalSound('burung');
                setJejakCount(prev => Math.min(50, prev + 1));
                confetti({ particleCount: 20, origin: { y: 0.6 } });
                speakText("Tepat Sekali! Itu adalah burung.");
              }}
              className="ps-quiz-btn"
              style={{ borderColor: selectedAnimalSound === 'burung' ? '#10b981' : '#a855f7' }}
            >
              <span>🐦</span>
              <span>Burung</span>
            </button>

            <button
              onClick={() => {
                playBeep(180, 'sawtooth');
                speakText("Bukan, itu mobil.");
              }}
              className="ps-quiz-btn"
            >
              <span>🚗</span>
              <span>Mobil</span>
            </button>

            <button
              onClick={() => {
                playBeep(180, 'sawtooth');
                speakText("Kurang tepat, itu hujan.");
              }}
              className="ps-quiz-btn"
            >
              <span>🌧️</span>
              <span>Hujan</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW B.3: JAWAB DENGAN SUARA */}
      {activeTab === 'kuis' && (
        <div className="ps-game-card">
          <div className="ps-game-header">
            <h3 className="ps-game-title">🎤 3. Jawab Dengan Suara</h3>
            <button onClick={() => setActiveTab('main')} className="ps-back-btn">Kembali</button>
          </div>

          <p className="text-[9px] font-bold text-slate-400 text-center mb-2">
            Pertanyaan kuis: apa makanan kesukaan kelinci?
          </p>

          {/* Soundwave animation */}
          <div className="ps-soundwave">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`ps-soundwave-bar ${micListeningSimulated ? 'active' : ''}`}
                style={{
                  height: micListeningSimulated ? '100%' : '15%',
                  animationDelay: `${i * 0.1}s`
                }}
              ></div>
            ))}
          </div>

          <button
            onClick={handleMicrophoneClick}
            disabled={micListeningSimulated}
            className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[9px] rounded-xl flex items-center justify-center gap-1 border-b-3 border-amber-700 disabled:opacity-50"
          >
            🎤 {micListeningSimulated ? 'Mendengarkan...' : 'Ketuk & Ucapkan Jawaban'}
          </button>

          {tunanetraAnswerResult && (
            <p className="text-[9px] text-center text-emerald-400 font-bold mt-2">
              {tunanetraAnswerResult}
            </p>
          )}
        </div>
      )}

      {/* Accessibility settings */}
      {activeTab === 'main' && (
        <div className="ps-settings">
          <div className="ps-setting-row">
            <span>Bicara:</span>
            <button onClick={() => setSpeechRate(prev => prev === 'Normal' ? 'Lambat' : 'Normal')} className="ps-setting-btn">
              {speechRate}
            </button>
          </div>

          <div className="ps-setting-row">
            <span>Suara:</span>
            <button onClick={() => setVoiceType(prev => prev === 'Suara Ramah' ? 'Suara Robot' : 'Suara Ramah')} className="ps-setting-btn">
              {voiceType}
            </button>
          </div>

          <div className="ps-setting-row" style={{ gridColumn: 'span 2', marginTop: '2px' }}>
            <span>Volume ({volume}%)</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-20 h-1 bg-purple-500 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* FOOTER ACTIONS BAR */}
      <footer className="ps-footer">
        <div
          onClick={() => { playBeep(520); speakText("Memulai belajar."); setActiveTab('materi'); }}
          className="ps-footer-btn"
          role="button"
        >
          <span>▶️</span>
          <span>Mulai</span>
        </div>

        <div
          onClick={() => { playBeep(440); speakText("Mengulang kembali."); }}
          className="ps-footer-btn"
          role="button"
        >
          <span>🔄</span>
          <span>Ulangi</span>
        </div>

        <div
          onClick={() => { playBeep(640); speakText("Panduan suara diaktifkan."); }}
          className="ps-footer-btn"
          role="button"
        >
          <span>❓</span>
          <span>Apa Ini</span>
        </div>

        <div
          onClick={() => { playBeep(720); speakText("Lanjut ke modul berikutnya."); }}
          className="ps-footer-btn"
          role="button"
        >
          <span>➡️</span>
          <span>Lanjut</span>
        </div>

        <div
          onClick={() => { playBeep(880); speakText("Bantuan asisten Soundy aktif."); }}
          className="ps-footer-btn"
          role="button"
        >
          <span>🤖</span>
          <span>Bantuan</span>
        </div>
      </footer>
    </div>
  );
}
