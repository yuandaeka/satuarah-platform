import React, { useState, useEffect } from 'react';
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
  TUNANETRA_STORIES,
  setSelectedMode
}) {
  // --- Game/Interface States ---
  const [activeTab, setActiveTab] = useState('main'); // 'main' | 'materi' | 'tebak' | 'kuis'
  const [jejakCount, setJejakCount] = useState(12);
  const [selectedAnimalSound, setSelectedAnimalSound] = useState(null); // for 'tebak' game
  const [soundGuides, setSoundGuides] = useState({
    burung: true,
    hujan: true,
    ombak: true,
    sapi: true,
    kelinci: false
  });

  // Tap-to-read selections for screen reader logic
  const [focusedId, setFocusedId] = useState(null);

  // Accessibility settings states
  const [speechRate, setSpeechRate] = useState('Normal');
  const [voiceType, setVoiceType] = useState('Suara Ramah');
  const [volume, setVolume] = useState(80);

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

  // Speak helper that adds beeps and manages speech
  const announce = (text, freq = 520) => {
    playBeep(freq, 'sine', 0.12);
    speakText(text, true);
  };

  // Keyboard spacebar listener for repeating instructions
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        announce("Mengulang petunjuk saat ini.");
        triggerCurrentContextGuide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  const triggerCurrentContextGuide = () => {
    if (activeTab === 'main') {
      speakText("Kamu berada di Beranda Planet Suara. Ketuk salah satu dari empat Zona Belajar di layar untuk menjelajah. Setiap zona akan membacakan namanya saat diketuk sekali. Ketuk dua kali untuk membukanya.", true);
    } else if (activeTab === 'materi') {
      speakText("Hari ini kita belajar tentang kelinci. Kelinci adalah hewan mamalia berbulu halus yang melompat cepat. Ketuk tombol putar suara untuk mendengar penjelasan lengkap.", true);
    } else if (activeTab === 'tebak') {
      speakText("Pertanyaan tebak suara: Dengarkan suara burung dari arah kiri. Pilih satu dari tiga pilihan jawaban di layar. Ketuk sekali untuk mendengarkan, ketuk dua kali untuk menjawab.", true);
    } else if (activeTab === 'kuis') {
      speakText("Pertanyaan kuis: apa makanan kesukaan kelinci? Ketuk tombol mikrofon besar lalu ucapkan jawabanmu, atau pilih dari daftar opsi di bawah.", true);
    }
  };

  // Accessibility selection helper for tap-to-read & double-tap to activate
  const handleItemInteraction = (id, readText, actionCallback) => {
    if (focusedId === id) {
      // Double click -> Activate
      playBeep(640, 'sine', 0.2);
      setFocusedId(null);
      actionCallback();
    } else {
      // Single click -> Highlight and Read
      setFocusedId(id);
      announce(readText, 480);
    }
  };

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

  const handleManualQuizOption = (ans) => {
    if (ans === 'wortel') {
      setJejakCount(prev => Math.min(50, prev + 2));
      setSoundGuides(prev => ({ ...prev, kelinci: true }));
      setTunanetraAnswerResult("Jawaban Benar! Kelinci sangat menyukai wortel.");
      announce("Luar biasa! Jawabanmu benar, kelinci menyukai wortel. Kamu mendapatkan dua Jejak Suara baru.");
      confetti({ particleCount: 40, origin: { y: 0.7 } });
    } else {
      setTunanetraAnswerResult("Belum Tepat. Coba pikirkan sayuran berwarna oranye.");
      announce("Kurang tepat. Coba tebak lagi, sayuran berwarna oranye kesukaan kelinci.");
    }
  };

  return (
    <div className="planet-suara-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .planet-suara-container {
          --ps-bg: #0b071e;
          --ps-primary: #a855f7;
          --ps-secondary: #fbbf24;
          --ps-accent: #10b981;
          --ps-card: rgba(255, 255, 255, 0.05);
          --ps-text: #f3e8ff;
          
          font-family: 'Poppins', sans-serif;
          background: radial-gradient(circle at center, #1b1248 0%, #060312 100%);
          color: var(--ps-text);
          border-radius: 28px;
          padding: 16px;
          border: 3.5px solid var(--ps-primary);
          box-shadow: inset 0 0 35px rgba(0,0,0,0.8), 0 20px 40px rgba(0,0,0,0.4);
          position: relative;
          width: 100%;
          min-height: 480px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow-y: auto;
          max-height: 800px;
        }

        /* Large Tap Targets for Blind Accessibility */
        .ps-accessible-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        .ps-accessible-card {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 2px solid rgba(168, 85, 247, 0.2);
          border-radius: 20px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .ps-accessible-card:hover {
          background: rgba(168, 85, 247, 0.08);
          border-color: rgba(168, 85, 247, 0.5);
        }
        .ps-accessible-card.focused {
          background: rgba(251, 191, 36, 0.15) !important;
          border-color: var(--ps-secondary) !important;
          box-shadow: 0 0 15px rgba(251, 191, 36, 0.3);
        }
        .ps-accessible-emoji {
          font-size: 2.2rem;
          background: rgba(255,255,255,0.06);
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ps-accessible-content {
          flex: 1;
        }
        .ps-accessible-title {
          font-size: 11px;
          font-weight: 900;
          color: white;
        }
        .ps-accessible-desc {
          font-size: 8px;
          color: #c084fc;
          margin-top: 1px;
        }

        .ps-header {
          text-align: center;
          margin-bottom: 4px;
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

        /* Helper speech card */
        .ps-helper-card {
          background: rgba(255,255,255,0.02);
          border: 1.5px dashed rgba(168,85,247,0.3);
          border-radius: 16px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ps-helper-avatar { font-size: 2rem; }
        .ps-helper-msg { font-size: 8px; font-weight: 700; color: #ddd6fe; line-height: 1.4; }

        /* collected count progress bar */
        .ps-progress-bar {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ps-progress-txt { font-size: 8px; font-weight: 900; color: var(--ps-secondary); }
        .ps-progress-icons { display: flex; gap: 4px; }
        .ps-progress-icon { font-size: 10px; opacity: 0.8; }

        /* Huge layout for settings */
        .ps-huge-settings {
          background: rgba(0,0,0,0.3);
          border: 1.5px solid rgba(168,85,247,0.2);
          border-radius: 20px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ps-settings-header { font-size: 8.5px; font-weight: 900; color: var(--ps-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
        .ps-settings-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 8px; }
        .ps-settings-btn {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.1);
          color: white;
          font-size: 8px;
          font-weight: 800;
          padding: 8px;
          border-radius: 10px;
          cursor: pointer;
          text-align: center;
        }
        .ps-settings-btn.active { border-color: var(--ps-primary); background: rgba(168,85,247,0.15); }

        /* Vertical Action Stack at bottom */
        .ps-action-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
          border-top: 1.5px solid rgba(255,255,255,0.1);
          padding-top: 12px;
        }
        .ps-giant-btn {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 2px solid rgba(255,255,255,0.1);
          color: white;
          font-size: 10px;
          font-weight: 800;
          padding: 14px;
          border-radius: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .ps-giant-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.25);
        }
        .ps-giant-btn.focused {
          background: rgba(251,191,36,0.15) !important;
          border-color: var(--ps-secondary) !important;
          box-shadow: 0 0 10px rgba(251,191,36,0.25);
        }

        .ps-wave-bar { display: flex; gap: 3px; height: 16px; align-items: flex-end; }
        .ps-wave-line { width: 3px; background: var(--ps-primary); border-radius: 4px; }

        .ps-game-card {
          background: rgba(255,255,255,0.02);
          border: 2.5px solid var(--ps-primary);
          border-radius: 24px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .ps-game-title-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px dashed rgba(255,255,255,0.1); padding-bottom: 6px; }
        .ps-game-title-txt { font-size: 11px; font-weight: 900; color: var(--ps-secondary); }

        .ps-play-speaker-btn {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          background: var(--ps-primary);
          border: none;
          font-size: 2rem;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin: 10px auto;
          box-shadow: 0 6px 15px rgba(168, 85, 247, 0.4);
        }

        .ps-soundwave { display: flex; justify-content: center; gap: 4px; height: 30px; }
        .ps-soundwave-bar { width: 4px; background: var(--ps-secondary); border-radius: 4px; height: 20%; transition: height 0.1s ease; }
        .ps-soundwave-bar.active { animation: bounce 0.6s infinite alternate; }

        @keyframes bounce {
          0% { height: 20%; }
          100% { height: 100%; }
        }
        @keyframes float {
          0% { transform: translateY(0); }
          100% { transform: translateY(-4px); }
        }
      ` }} />

      {/* Header */}
      <header className="ps-header">
        <h2 className="ps-title">PLANET SUARA</h2>
        <span className="ps-subtitle">MODE TUNANETRA</span>
      </header>

      {/* VIEW 1: MAIN ZONE SELECTIONS */}
      {activeTab === 'main' && (
        <>
          {/* Helper assistant card */}
          <div className="ps-helper-card">
            <span className="ps-helper-avatar">🤖</span>
            <div className="ps-helper-msg">
              "Ketuk satu kali untuk mendengar petunjuk zona. Ketuk dua kali untuk masuk belajar!"
            </div>
            <div className="ps-wave-bar">
              {[30, 80, 50, 90, 40].map((h, i) => (
                <div
                  key={i}
                  className="ps-wave-line"
                  style={{
                    height: isTunanetraNarrating ? `${h}%` : '4px',
                    animation: isTunanetraNarrating ? `bounce ${0.4 + i * 0.1}s infinite alternate` : 'none'
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Accessible 4 Zones stacked vertically */}
          <div className="ps-accessible-list">
            <div
              onClick={() => handleItemInteraction(
                'hutan',
                "Hutan Gema. Kuis mengenal materi hewan kelinci. Ketuk dua kali untuk masuk.",
                () => { setActiveTab('materi'); announce("Memasuki Hutan Gema. Dengarkan materi kelinci."); }
              )}
              className={`ps-accessible-card ${focusedId === 'hutan' ? 'focused' : ''}`}
            >
              <span className="ps-accessible-emoji">🌳</span>
              <div className="ps-accessible-content">
                <h4 className="ps-accessible-title">ZONA 1: HUTAN GEMA</h4>
                <p className="ps-accessible-desc">Dengarkan Materi Kelinci</p>
              </div>
            </div>

            <div
              onClick={() => handleItemInteraction(
                'danau',
                "Danau Irama. Permainan menebak arah suara hewan burung. Ketuk dua kali untuk masuk.",
                () => { setActiveTab('tebak'); announce("Memasuki Danau Irama. Mari menebak arah suara burung."); }
              )}
              className={`ps-accessible-card ${focusedId === 'danau' ? 'focused' : ''}`}
            >
              <span className="ps-accessible-emoji">🔊</span>
              <div className="ps-accessible-content">
                <h4 className="ps-accessible-title">ZONA 2: DANAU IRAMA</h4>
                <p className="ps-accessible-desc">Permainan Tebak Arah Suara</p>
              </div>
            </div>

            <div
              onClick={() => handleItemInteraction(
                'gua',
                "Gua Tanya. Kuis interaktif menjawab dengan mikrofon suara. Ketuk dua kali untuk masuk.",
                () => { setActiveTab('kuis'); announce("Memasuki Gua Tanya. Kuis interaktif mikrofon."); }
              )}
              className={`ps-accessible-card ${focusedId === 'gua' ? 'focused' : ''}`}
            >
              <span className="ps-accessible-emoji">🏰</span>
              <div className="ps-accessible-content">
                <h4 className="ps-accessible-title">ZONA 3: GUA TANYA</h4>
                <p className="ps-accessible-desc">Kuis Suara Kelinci</p>
              </div>
            </div>

            <div
              onClick={() => handleItemInteraction(
                'puncak',
                "Puncak Harmoni. Zona terkunci. Kumpulkan 13 Jejak Suara terlebih dahulu untuk membukanya.",
                () => {
                  if (jejakCount >= 15) {
                    announce("Memasuki Puncak Harmoni.");
                  } else {
                    announce("Zona Puncak Harmoni terkunci. Kamu membutuhkan " + (15 - jejakCount) + " Jejak Suara lagi.");
                  }
                }
              )}
              className={`ps-accessible-card opacity-60 ${focusedId === 'puncak' ? 'focused' : ''}`}
            >
              <span className="ps-accessible-emoji">🔒</span>
              <div className="ps-accessible-content">
                <h4 className="ps-accessible-title">ZONA 4: PUNCAK HARMONI</h4>
                <p className="ps-accessible-desc">Terkunci (Butuh 15 Jejak)</p>
              </div>
            </div>
          </div>

          {/* Progress row */}
          <div className="ps-progress-bar">
            <span className="ps-progress-txt">Jejak Suara Terkumpul: {jejakCount} / 50</span>
            <div className="ps-progress-icons">
              <span className="ps-progress-icon">🐦</span>
              <span className="ps-progress-icon">🌧️</span>
              <span className="ps-progress-icon">🌊</span>
              <span className="ps-progress-icon">🐄</span>
              {soundGuides.kelinci && <span className="ps-progress-icon">🐰</span>}
            </div>
          </div>

          {/* Large Speech Controls */}
          <div className="ps-huge-settings">
            <h5 className="ps-settings-header">PENGATURAN SUARA ASISTEN</h5>
            <div className="ps-settings-grid">
              <button
                onClick={() => {
                  playBeep(440);
                  const nextRate = speechRate === 'Normal' ? 'Lambat' : speechRate === 'Lambat' ? 'Cepat' : 'Normal';
                  setSpeechRate(nextRate);
                  announce("Kecepatan bicara diubah menjadi " + nextRate);
                }}
                className="ps-settings-btn"
              >
                Kecepatan: {speechRate}
              </button>
              
              <button
                onClick={() => {
                  playBeep(480);
                  const nextVoice = voiceType === 'Suara Ramah' ? 'Suara Robot' : 'Suara Ramah';
                  setVoiceType(nextVoice);
                  announce("Jenis suara diubah menjadi " + nextVoice);
                }}
                className="ps-settings-btn"
              >
                Suara: {voiceType}
              </button>
            </div>
          </div>
        </>
      )}

      {/* VIEW 2: DENGARKAN MATERI */}
      {activeTab === 'materi' && (
        <div className="ps-game-card">
          <div className="ps-game-title-row">
            <h3 className="ps-game-title-txt">🔊 ZONA 1: DENGAR MATERI</h3>
            <button
              onClick={() => handleItemInteraction('kembali', "Kembali ke Beranda.", () => setActiveTab('main'))}
              className={`px-3 py-1 bg-red-600 text-white font-extrabold text-[8.5px] rounded-full ${focusedId === 'kembali' ? 'border-2 border-yellow-400' : ''}`}
            >
              Kembali
            </button>
          </div>

          <p className="text-[8px] text-center text-purple-200">
            Ketuk tombol bulat ungu di bawah untuk mendengar penjelasan kelinci.
          </p>

          <button
            onClick={() => {
              playBeep(440);
              speakText("Hari ini kita belajar tentang kelinci. Kelinci adalah hewan mamalia kecil berbulu halus yang suka melompat cepat dan memakan sayuran hijau.", true);
            }}
            className="ps-play-speaker-btn"
          >
            📻
          </button>

          <p className="text-[8.5px] leading-relaxed bg-slate-900/60 p-3 rounded-lg text-center font-semibold">
            "Kelinci adalah hewan mamalia kecil berbulu halus yang suka melompat cepat dan memakan sayuran hijau."
          </p>

          <button
            onClick={() => handleItemInteraction('materi-lanjut', "Lanjut ke tebak suara.", () => setActiveTab('tebak'))}
            className={`w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] rounded-xl text-center ${focusedId === 'materi-lanjut' ? 'border-2 border-yellow-400' : ''}`}
          >
            ➡️ Lanjut ke Tebak Suara
          </button>
        </div>
      )}

      {/* VIEW 3: TEMUKAN JEJAK SUARA */}
      {activeTab === 'tebak' && (
        <div className="ps-game-card">
          <div className="ps-game-title-row">
            <h3 className="ps-game-title-txt">🎧 ZONA 2: TEBAK SUARA</h3>
            <button
              onClick={() => handleItemInteraction('kembali', "Kembali ke Beranda.", () => setActiveTab('main'))}
              className={`px-3 py-1 bg-red-600 text-white font-extrabold text-[8.5px] rounded-full ${focusedId === 'kembali' ? 'border-2 border-yellow-400' : ''}`}
            >
              Kembali
            </button>
          </div>

          <p className="text-[8px] text-center text-purple-200">
            Dengarkan suara di bawah dan tebak hewannya.
          </p>

          <button
            onClick={() => {
              playBeep(680, 'sine', 0.5);
              speakText("Petunjuk suara: Kicauan merdu di pagi hari. Siapakah aku?", true);
            }}
            className="w-full py-2 bg-purple-950 hover:bg-purple-900 border border-purple-500 rounded-xl text-[8.5px] font-bold text-center"
          >
            🔊 Putar Petunjuk Suara
          </button>

          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={() => handleItemInteraction(
                'opt-burung',
                "Pilihan 1: Burung. Ketuk dua kali untuk memilih.",
                () => {
                  setSelectedAnimalSound('burung');
                  setJejakCount(prev => Math.min(50, prev + 1));
                  confetti({ particleCount: 20, origin: { y: 0.6 } });
                  announce("Tepat sekali! Jawabanmu benar, suara itu adalah Burung.");
                }
              )}
              className={`w-full py-3 bg-slate-900/80 border text-[9px] font-bold rounded-xl flex items-center justify-center gap-2 ${focusedId === 'opt-burung' ? 'border-yellow-400 bg-yellow-950/20' : 'border-purple-500'}`}
            >
              <span>🐦</span> Burung {selectedAnimalSound === 'burung' && '✓'}
            </button>

            <button
              onClick={() => handleItemInteraction(
                'opt-sapi',
                "Pilihan 2: Sapi. Ketuk dua kali untuk memilih.",
                () => {
                  announce("Kurang tepat. Suara sapi adalah lenguhan, sedangkan ini suara kicau merdu.");
                }
              )}
              className={`w-full py-3 bg-slate-900/80 border text-[9px] font-bold rounded-xl flex items-center justify-center gap-2 ${focusedId === 'opt-sapi' ? 'border-yellow-400 bg-yellow-950/20' : 'border-purple-500'}`}
            >
              <span>🐄</span> Sapi
            </button>

            <button
              onClick={() => handleItemInteraction(
                'opt-hujan',
                "Pilihan 3: Hujan. Ketuk dua kali untuk memilih.",
                () => {
                  announce("Kurang tepat. Suara hujan adalah gemercik air, sedangkan ini suara kicau burung.");
                }
              )}
              className={`w-full py-3 bg-slate-900/80 border text-[9px] font-bold rounded-xl flex items-center justify-center gap-2 ${focusedId === 'opt-hujan' ? 'border-yellow-400 bg-yellow-950/20' : 'border-purple-500'}`}
            >
              <span>🌧️</span> Hujan
            </button>
          </div>
        </div>
      )}

      {/* VIEW 4: JAWAB DENGAN SUARA */}
      {activeTab === 'kuis' && (
        <div className="ps-game-card">
          <div className="ps-game-title-row">
            <h3 className="ps-game-title-txt">🎤 ZONA 3: KUIS SUARA</h3>
            <button
              onClick={() => handleItemInteraction('kembali', "Kembali ke Beranda.", () => setActiveTab('main'))}
              className={`px-3 py-1 bg-red-600 text-white font-extrabold text-[8.5px] rounded-full ${focusedId === 'kembali' ? 'border-2 border-yellow-400' : ''}`}
            >
              Kembali
            </button>
          </div>

          <p className="text-[8.5px] text-center text-purple-200">
            Pertanyaan: Apa makanan kesukaan kelinci?
          </p>

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
            className="w-full py-3 bg-amber-500 text-slate-950 font-black text-[10px] rounded-xl flex items-center justify-center gap-2"
          >
            🎤 {micListeningSimulated ? 'Mendengarkan...' : 'Ketuk & Ucapkan Jawaban'}
          </button>

          {tunanetraAnswerResult && (
            <p className="text-[9px] text-center text-emerald-400 font-bold bg-emerald-950/20 py-1.5 rounded-lg border border-emerald-500/20">
              {tunanetraAnswerResult}
            </p>
          )}

          {/* Accessible Fallback Buttons */}
          <div className="mt-2 space-y-1.5">
            <p className="text-[7.5px] font-bold text-slate-400 text-center">Atau ketuk dua kali jawaban di bawah:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleItemInteraction('ans-wortel', "Pilih Wortel.", () => handleManualQuizOption('wortel'))}
                className={`py-2 bg-slate-900 border text-[8px] font-bold rounded-lg ${focusedId === 'ans-wortel' ? 'border-yellow-400 bg-yellow-950/20' : 'border-slate-700'}`}
              >
                🥕 Wortel
              </button>
              <button
                onClick={() => handleItemInteraction('ans-daging', "Pilih Daging.", () => handleManualQuizOption('daging'))}
                className={`py-2 bg-slate-900 border text-[8px] font-bold rounded-lg ${focusedId === 'ans-daging' ? 'border-yellow-400 bg-yellow-950/20' : 'border-slate-700'}`}
              >
                🥩 Daging
              </button>
              <button
                onClick={() => handleItemInteraction('ans-roti', "Pilih Roti.", () => handleManualQuizOption('roti'))}
                className={`py-2 bg-slate-900 border text-[8px] font-bold rounded-lg ${focusedId === 'ans-roti' ? 'border-yellow-400 bg-yellow-950/20' : 'border-slate-700'}`}
              >
                🍞 Roti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER ACTIONS BAR */}
      <footer className="ps-action-stack">
        <button
          onClick={() => handleItemInteraction(
            'foot-mulai',
            "Mulai belajar dan dengar petunjuk.",
            () => triggerCurrentContextGuide()
          )}
          className={`ps-giant-btn ${focusedId === 'foot-mulai' ? 'focused' : ''}`}
        >
          <span>▶️</span>
          <span>Mulai / Petunjuk</span>
        </button>

        <button
          onClick={() => handleItemInteraction(
            'foot-ulangi',
            "Ulangi suara asisten.",
            () => { announce("Mengulang suara asisten terakhir."); triggerCurrentContextGuide(); }
          )}
          className={`ps-giant-btn ${focusedId === 'foot-ulangi' ? 'focused' : ''}`}
        >
          <span>🔄</span>
          <span>Ulangi Suara</span>
        </button>

        <button
          onClick={() => handleItemInteraction(
            'foot-apaini',
            "Panduan tata letak halaman ini.",
            () => {
              if (activeTab === 'main') {
                announce("Halaman Beranda. Terdapat empat tombol zona petualangan di tengah layar, dan tombol pengaturan suara di bagian bawah.");
              } else {
                announce("Halaman permainan aktif. Terdapat tombol kembali di sudut kanan atas, petunjuk di tengah layar, dan tombol navigasi di bagian bawah.");
              }
            }
          )}
          className={`ps-giant-btn ${focusedId === 'foot-apaini' ? 'focused' : ''}`}
        >
          <span>❓</span>
          <span>Apa Ini</span>
        </button>

        <button
          onClick={() => handleItemInteraction(
            'foot-lanjut',
            "Lanjut ke zona berikutnya.",
            () => {
              if (activeTab === 'main') {
                setActiveTab('materi');
                announce("Masuk ke Zona 1: Dengarkan Materi.");
              } else if (activeTab === 'materi') {
                setActiveTab('tebak');
                announce("Masuk ke Zona 2: Tebak Suara.");
              } else if (activeTab === 'tebak') {
                setActiveTab('kuis');
                announce("Masuk ke Zona 3: Kuis Suara.");
              } else {
                setActiveTab('main');
                announce("Kembali ke Beranda.");
              }
            }
          )}
          className={`ps-giant-btn ${focusedId === 'foot-lanjut' ? 'focused' : ''}`}
        >
          <span>➡️</span>
          <span>Lanjut</span>
        </button>

        <button
          onClick={() => handleItemInteraction(
            'foot-bantuan',
            "Minta bantuan asisten suara Soundy.",
            () => announce("Soundy siap membantu. Jika kamu kesulitan, ketuk tombol mana saja sekali untuk mendengar penjelasannya, lalu ketuk lagi untuk memilih.")
          )}
          className={`ps-giant-btn ${focusedId === 'foot-bantuan' ? 'focused' : ''}`}
        >
          <span>🤖</span>
          <span>Bantuan Soundy</span>
        </button>

        <button
          onClick={() => handleItemInteraction(
            'foot-keluar',
            "Keluar dari Mode Tunanetra.",
            () => { stopSpeaking(); setSelectedMode(null); }
          )}
          className={`ps-giant-btn bg-red-950/20 border-red-500/30 text-red-200 ${focusedId === 'foot-keluar' ? 'focused' : ''}`}
        >
          <span>🚪</span>
          <span>Keluar Planet</span>
        </button>
      </footer>
    </div>
  );
}
