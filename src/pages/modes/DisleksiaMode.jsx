import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function DisleksiaMode({
  speakText,
  stopSpeaking,
  triggerBadgeMinting,
}) {
  // --- Game States ---
  const [wordCount, setWordCount] = useState(36);
  const [activeZone, setActiveZone] = useState('main'); // 'main' | 'audio' | 'suku' | 'bangun' | 'koleksi' | 'buku'
  
  // 1. Suku Kata Game State
  const [sukuWord, setSukuWord] = useState({
    prefix: '', 
    suffix: 'ju',
    options: ['ba', 'bi', 'bu', 'be', 'bo'],
    correct: 'ba',
    target: 'baju',
    completed: false
  });

  // 2. Bangun Kata Game State
  const [bangunWord, setBangunWord] = useState({
    target: 'kucing',
    letters: ['u', 'c', 'g', 'k', 'n', 'i'],
    currentLetters: [],
    completed: false
  });

  // 3. Baca dan Pahami State
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [storyReading, setStoryReading] = useState(false);
  const storyText = "Riko punya kelinci. Kelinci itu lucu. Riko memberi makan kelincinya setiap hari.";
  const storyWords = storyText.split(" ");

  // 4. Susun Buku Ajaib State
  const [magicBookWord, setMagicBookWord] = useState('pohon'); 
  const [rightPageUnlocked, setRightPageUnlocked] = useState(false);

  // Sound helper
  const playPopSound = () => {
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    }
  };

  // Handlers
  const handleSukuClick = (opt) => {
    if (sukuWord.completed) return;
    playPopSound();
    if (opt === sukuWord.correct) {
      setSukuWord(prev => ({ ...prev, prefix: opt, completed: true }));
      setWordCount(prev => Math.min(100, prev + 5));
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
      speakText("Hebat! Baju!");
    } else {
      speakText("Coba lagi ya.");
    }
  };

  const handleLetterClick = (letter, idx) => {
    if (bangunWord.completed) return;
    playPopSound();
    
    const nextIndex = bangunWord.currentLetters.length;
    const expectedLetter = bangunWord.target[nextIndex];
    
    if (letter === expectedLetter) {
      const updatedBuilt = [...bangunWord.currentLetters, letter];
      setBangunWord(prev => ({
        ...prev,
        currentLetters: updatedBuilt,
        letters: prev.letters.filter((_, i) => i !== idx),
        completed: updatedBuilt.join('') === prev.target
      }));

      speakText(letter);

      if (updatedBuilt.join('') === bangunWord.target) {
        setWordCount(prev => Math.min(100, prev + 10));
        confetti({ particleCount: 40, spread: 80, origin: { y: 0.6 } });
        speakText("Luar biasa! Kucing!");
        triggerBadgeMinting('disleksia');
      }
    } else {
      speakText("Coba cari huruf yang benar.");
    }
  };

  const readEntireStory = () => {
    if (storyReading) {
      stopSpeaking();
      setStoryReading(false);
      setActiveWordIndex(-1);
    } else {
      setStoryReading(true);
      speakText(storyText);
      
      let currentWord = 0;
      setActiveWordIndex(0);
      const interval = setInterval(() => {
        currentWord += 1;
        if (currentWord >= storyWords.length) {
          clearInterval(interval);
          setStoryReading(false);
          setActiveWordIndex(-1);
        } else {
          setActiveWordIndex(currentWord);
        }
      }, 450);
    }
  };
  
  const resetSukuGame = () => {
    setSukuWord({
      prefix: '',
      suffix: 'ju',
      options: ['ba', 'bi', 'bu', 'be', 'bo'],
      correct: 'ba',
      target: 'baju',
      completed: false
    });
  };

  const resetBangunGame = () => {
    setBangunWord({
      target: 'kucing',
      letters: ['u', 'c', 'g', 'k', 'n', 'i'],
      currentLetters: [],
      completed: false
    });
  };

  const handleWordClick = (word, index) => {
    playPopSound();
    setActiveWordIndex(index);
    const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    speakText(cleanWord);
  };

  const handleMagicBookUnlock = () => {
    if (rightPageUnlocked) return;
    playPopSound();
    setRightPageUnlocked(true);
    setWordCount(prev => Math.min(100, prev + 15));
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    speakText("Halaman buku terbuka!");
  };

  return (
    <div className="planet-kata-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .planet-kata-container {
          --theme-bg: #1e1b4b;
          --theme-primary: #a855f7;
          --theme-secondary: #fbbf24;
          --card-cream: #faf5ff;
          
          font-family: 'Poppins', sans-serif;
          background: radial-gradient(circle at top, #2e1065 0%, #0c0418 100%);
          color: white;
          border-radius: 28px;
          padding: 18px;
          box-shadow: inset 0 0 30px rgba(0,0,0,0.7);
          border: 3px solid #4c1d95;
          position: relative;
          min-height: 480px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .pk-header {
          text-align: center;
          margin-bottom: 12px;
        }
        .pk-title {
          font-size: 1.6rem;
          font-weight: 900;
          text-shadow: 0 3px 0 #581c87;
          background: linear-gradient(to bottom, #fffbeb, #fbbf24);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .pk-subtitle {
          font-size: 0.7rem;
          color: #c084fc;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Mode Selection Grid */
        .pk-menu-grid {
          display: grid;
          grid-template-cols: 1fr 1fr;
          gap: 10px;
          margin-bottom: 14px;
        }
        .pk-menu-btn {
          background: rgba(255, 255, 255, 0.07);
          border: 2px solid rgba(168, 85, 247, 0.3);
          border-radius: 20px;
          padding: 10px 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .pk-menu-btn:hover {
          background: rgba(168, 85, 247, 0.15);
          transform: translateY(-2px);
          border-color: #c084fc;
        }
        .pk-menu-btn:active {
          transform: scale(0.97);
        }
        .pk-menu-icon {
          font-size: 1.4rem;
        }
        .pk-menu-text h4 {
          font-size: 10px;
          font-weight: 800;
          color: white;
          margin: 0;
        }
        .pk-menu-text p {
          font-size: 7px;
          color: #d8b4fe;
          margin: 1px 0 0 0;
          font-weight: 600;
        }

        /* Book progress bar */
        .pk-progress-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 18px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid rgba(255,255,255,0.08);
          margin-top: auto;
        }
        .pk-progress-label {
          font-size: 8px;
          font-weight: 800;
          color: #fbbf24;
        }
        .pk-progress-bar-bg {
          width: 50%;
          background: rgba(255,255,255,0.1);
          height: 6px;
          border-radius: 10px;
          overflow: hidden;
        }
        .pk-progress-bar-fill {
          height: 100%;
          background: #10b981;
          border-radius: 10px;
          transition: width 0.4s ease;
        }

        /* Subview Game Card */
        .pk-game-card {
          background: var(--card-cream);
          border-radius: 24px;
          padding: 16px;
          color: #1e1b4b;
          border: 3px solid #c084fc;
          box-shadow: 0 8px 0 #c084fc, 0 10px 20px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 280px;
          position: relative;
        }
        .pk-game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px dashed #e2e8f0;
          padding-bottom: 8px;
          margin-bottom: 12px;
        }
        .pk-game-title {
          font-size: 10px;
          font-weight: 900;
          color: #5b21b6;
          text-transform: uppercase;
        }
        .pk-back-btn {
          background: #ef4444;
          color: white;
          font-size: 8px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 50px;
          border: none;
          border-bottom: 2.5px solid #b91c1c;
          cursor: pointer;
        }
        .pk-back-btn:active {
          transform: translateY(1.5px);
          border-bottom-width: 1px;
        }

        /* 1. Suku Kata game layout */
        .pk-suku-rocket {
          background: #1e1b4b;
          border-radius: 20px;
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 10px 0;
        }
        .pk-suku-slot {
          font-size: 1.5rem;
          font-weight: 900;
          color: #fbbf24;
          background: rgba(255,255,255,0.06);
          padding: 6px 16px;
          border-radius: 12px;
          min-width: 60px;
          text-align: center;
          border: 2px dashed rgba(255,255,255,0.2);
        }
        .pk-suku-slot.filled {
          background: #10b981;
          border-color: #10b981;
          color: white;
        }
        .pk-suku-options {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 10px;
        }
        .pk-suku-btn {
          background: white;
          border: 2px solid #a855f7;
          border-bottom: 4px solid #7c3aed;
          border-radius: 12px;
          padding: 6px 12px;
          font-size: 0.9rem;
          font-weight: 900;
          color: #5b21b6;
          cursor: pointer;
        }
        .pk-suku-btn:active {
          transform: translateY(2px);
          border-bottom-width: 2px;
        }

        /* 2. Bangun Kata layout */
        .pk-bangun-slots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin: 12px 0;
        }
        .pk-bangun-slot {
          width: 32px;
          height: 32px;
          border: 2px solid #ddd;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          font-weight: 900;
          color: #1e1b4b;
        }
        .pk-letter-btn {
          width: 32px;
          height: 32px;
          background: white;
          border: 2px solid #db2777;
          border-bottom: 4px solid #be185d;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 900;
          color: #db2777;
          cursor: pointer;
        }

        /* 3. Audio Land story box */
        .pk-audio-story {
          background: white;
          border: 2px solid #e9d5ff;
          border-radius: 16px;
          padding: 12px;
          font-size: 0.8rem;
          line-height: 2;
          font-weight: 800;
          color: #1e1b4b;
          min-height: 100px;
          margin-bottom: 10px;
        }
        .pk-audio-word {
          cursor: pointer;
          padding: 1px 3px;
          border-radius: 4px;
        }
        .pk-audio-word.active {
          background: #fef08a;
          color: black;
        }
        .pk-audio-play-btn {
          background: #8b5cf6;
          border-bottom: 4px solid #6d28d9;
          color: white;
          border-radius: 12px;
          padding: 8px 12px;
          font-weight: 800;
          font-size: 9px;
          cursor: pointer;
          width: 100%;
        }

        /* 4. Kata Quest */
        .pk-quest-grid {
          display: grid;
          grid-template-cols: repeat(4, 1fr);
          gap: 6px;
        }
        .pk-quest-card {
          background: white;
          border: 1.5px solid #cbd5e1;
          border-bottom: 3.5px solid #94a3b8;
          border-radius: 12px;
          padding: 8px 2px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .pk-quest-card:active {
          transform: translateY(2px);
        }

        /* 5. Kota Cerita (Buku) */
        .pk-book-visual {
          background: #fffbeb;
          border: 3px solid #d97706;
          border-radius: 16px;
          display: grid;
          grid-template-cols: 1fr 1fr;
          gap: 10px;
          padding: 10px;
          height: 110px;
          position: relative;
        }
        .pk-book-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .pk-book-page.left {
          border-right: 1.5px dashed rgba(217, 119, 6, 0.3);
        }
        .pk-book-word { font-size: 0.8rem; font-weight: 900; }
        .pk-book-img { font-size: 2.2rem; }

        .pk-congrats-card {
          background: linear-gradient(135deg, #4c1d95, #1e1b4b);
          border-radius: 20px;
          padding: 12px;
          color: white;
          text-align: center;
          margin-top: 10px;
          border: 2px solid #fbbf24;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
      ` }} />

      {/* VIEW A: MAIN MENU SELECT */}
      {activeZone === 'main' && (
        <>
          <header className="pk-header">
            <h2 className="pk-title">🪐 PLANET KATA</h2>
            <p className="pk-subtitle">Belajar Membaca Adaptif</p>
          </header>

          {/* Small astronaut bubble */}
          <div className="pk-astro-bar">
            <span className="pk-astro-avatar">🧑‍🚀</span>
            <p className="pk-astro-bubble">
              "Hai Explorer! Ketuk salah satu game membaca di bawah untuk melatih kata baru!"
            </p>
          </div>

          {/* Compact 5 menu buttons */}
          <div className="pk-menu-grid">
            <button onClick={() => { setActiveZone('suku'); speakText("Gabungkan Suku Kata"); }} className="pk-menu-btn">
              <span className="pk-menu-icon">🧩</span>
              <div className="pk-menu-text">
                <h4>1. Suku Kata</h4>
                <p>Gabungkan kata roket</p>
              </div>
            </button>

            <button onClick={() => { setActiveZone('bangun'); speakText("Huruf Fun"); }} className="pk-menu-btn">
              <span className="pk-menu-icon">🔠</span>
              <div className="pk-menu-text">
                <h4>2. Huruf Fun</h4>
                <p>Susun huruf meong</p>
              </div>
            </button>

            <button onClick={() => { setActiveZone('audio'); speakText("Audio Land"); }} className="pk-menu-btn">
              <span className="pk-menu-icon">🎧</span>
              <div className="pk-menu-text">
                <h4>3. Audio Land</h4>
                <p>Dengarkan baca cerita</p>
              </div>
            </button>

            <button onClick={() => { setActiveZone('koleksi'); speakText("Kata Quest"); }} className="pk-menu-btn">
              <span className="pk-menu-icon">📖</span>
              <div className="pk-menu-text">
                <h4>4. Kata Quest</h4>
                <p>Koleksi kosakata</p>
              </div>
            </button>

            <button onClick={() => { setActiveZone('buku'); speakText("Kota Cerita"); }} className="pk-menu-btn" style={{ gridColumn: 'span 2' }}>
              <span className="pk-menu-icon">🏰</span>
              <div className="pk-menu-text">
                <h4>5. Kota Cerita (Buku Ajaib)</h4>
                <p>Buka halaman rahasia buku ajaibmu</p>
              </div>
            </button>
          </div>

          {/* Progress bar at the bottom */}
          <div className="pk-progress-card">
            <span className="pk-progress-label">Buku Ajaib: {wordCount} / 100</span>
            <div className="pk-progress-bar-bg">
              <div className="pk-progress-bar-fill" style={{ width: `${wordCount}%` }}></div>
            </div>
          </div>
        </>
      )}

      {/* VIEW B.1: SUKU KATA GAME */}
      {activeZone === 'suku' && (
        <div className="pk-game-card">
          <div className="pk-game-header">
            <h3 className="pk-game-title">🧩 Misi Suku Kata</h3>
            <button onClick={() => setActiveZone('main')} className="pk-back-btn">Kembali</button>
          </div>

          <p className="text-[10px] font-bold text-slate-600 text-center">
            Gabungkan suku kata awal agar roket membentuk kata <b>"baju"</b>!
          </p>

          <div className="pk-suku-rocket">
            <span className={`pk-suku-slot ${sukuWord.completed ? 'filled' : ''}`}>
              {sukuWord.prefix || '?'}
            </span>
            <span className="text-white font-black">-</span>
            <span className="pk-suku-slot filled">{sukuWord.suffix}</span>
            <span className="text-xl">🚀</span>
          </div>

          <div className="pk-suku-options">
            {sukuWord.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSukuClick(opt)}
                className="pk-suku-btn"
                style={{
                  background: sukuWord.completed && opt === sukuWord.correct ? '#10b981' : 'white',
                  color: sukuWord.completed && opt === sukuWord.correct ? 'white' : '#5b21b6'
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          {sukuWord.completed && (
            <div className="text-center mt-3">
              <p className="text-[10px] text-emerald-600 font-extrabold mb-1">✓ Berhasil menyusun Baju!</p>
              <button onClick={resetSukuGame} className="px-4 py-1 bg-purple-600 text-white font-bold text-[9px] rounded-lg">
                Main Lagi
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW B.2: HURUF FUN (BANGUN KATA) */}
      {activeZone === 'bangun' && (
        <div className="pk-game-card">
          <div className="pk-game-header">
            <h3 className="pk-game-title">🔠 Misi Huruf Fun</h3>
            <button onClick={() => setActiveZone('main')} className="pk-back-btn">Kembali</button>
          </div>

          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-3xl">🐱</span>
            <span className="text-[9px] font-bold text-slate-500">Susun huruf untuk ejaan: kucing!</span>
          </div>

          <div className="pk-bangun-slots">
            {Array.from({ length: bangunWord.target.length }).map((_, i) => (
              <div key={i} className="pk-bangun-slot" style={{ borderColor: bangunWord.completed ? '#10b981' : '#c084fc' }}>
                {bangunWord.currentLetters[i] || ''}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-1.5 flex-wrap">
            {bangunWord.letters.map((letter, i) => (
              <button
                key={i}
                onClick={() => handleLetterClick(letter, i)}
                className="pk-letter-btn"
              >
                {letter}
              </button>
            ))}
          </div>

          {bangunWord.completed && (
            <div className="text-center mt-2">
              <p className="text-[9px] text-emerald-600 font-extrabold mb-1">✓ Selesai mengeja Kucing!</p>
              <button onClick={resetBangunGame} className="px-4 py-1 bg-pink-600 text-white font-bold text-[9px] rounded-lg">
                Main Lagi
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW B.3: AUDIO LAND */}
      {activeZone === 'audio' && (
        <div className="pk-game-card">
          <div className="pk-game-header">
            <h3 className="pk-game-title">🎧 Misi Audio Land</h3>
            <button onClick={() => setActiveZone('main')} className="pk-back-btn">Kembali</button>
          </div>

          <p className="text-[9px] text-blue-900 font-bold bg-blue-50 p-2 rounded-xl mb-2">
            🐰 Ketuk kata di bawah untuk mendengarkan suaranya!
          </p>

          <div className="pk-audio-story">
            {storyWords.map((word, i) => (
              <span
                key={i}
                onClick={() => handleWordClick(word, i)}
                className={`pk-audio-word ${i === activeWordIndex ? 'active' : ''}`}
              >
                {word}{' '}
              </span>
            ))}
          </div>

          <button onClick={readEntireStory} className="pk-audio-play-btn">
            {storyReading ? '⏹️ Stop' : '🔊 Dengarkan Cerita'}
          </button>
        </div>
      )}

      {/* VIEW B.4: KATA QUEST */}
      {activeZone === 'koleksi' && (
        <div className="pk-game-card">
          <div className="pk-game-header">
            <h3 className="pk-game-title">📖 Misi Kata Quest</h3>
            <button onClick={() => setActiveZone('main')} className="pk-back-btn">Kembali</button>
          </div>

          <p className="text-[8px] font-bold text-slate-500 mb-2">Ketuk kartu kata bergambar di bawah untuk mendengarkan lafalnya!</p>

          <div className="pk-quest-grid">
            {[
              { w: 'kucing', e: '🐱', bg: '#fdf2f8' },
              { w: 'buku', e: '📚', bg: '#eff6ff' },
              { w: 'pohon', e: '🌳', bg: '#f0fdf4' },
              { w: 'makan', e: '🍛', bg: '#fffbeb' },
              { w: 'bola', e: '⚽', bg: '#f8fafc' },
              { w: 'susu', e: '🥛', bg: '#f0f9ff' },
              { w: 'rumah', e: '🏠', bg: '#faf5ff' },
              { w: 'ikan', e: '🐟', bg: '#ecfeff' }
            ].map((it, i) => (
              <button
                key={i}
                onClick={() => {
                  playPopSound();
                  speakText(it.w);
                  setMagicBookWord(it.w);
                  setRightPageUnlocked(false);
                }}
                className="pk-quest-card"
                style={{ background: it.bg }}
              >
                <span className="text-2xl">{it.e}</span>
                <span className="text-[8px] font-bold mt-1 text-slate-700 capitalize">{it.w}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* VIEW B.5: KOTA CERITA (BUKU AJAIB) */}
      {activeZone === 'buku' && (
        <div className="pk-game-card">
          <div className="pk-game-header">
            <h3 className="pk-game-title">🏰 Misi Kota Cerita</h3>
            <button onClick={() => setActiveZone('main')} className="pk-back-btn">Kembali</button>
          </div>

          <div className="pk-book-visual">
            <div className="pk-book-page left">
              <span className="pk-book-word capitalize">{magicBookWord}</span>
              <span className="pk-book-img">
                {magicBookWord === 'kucing' && '🐱'}
                {magicBookWord === 'buku' && '📚'}
                {magicBookWord === 'pohon' && '🌳'}
                {magicBookWord === 'makan' && '🍛'}
                {magicBookWord === 'bola' && '⚽'}
                {magicBookWord === 'susu' && '🥛'}
                {magicBookWord === 'rumah' && '🏠'}
                {magicBookWord === 'ikan' && '🐟'}
              </span>
              <span className="text-emerald-500 font-extrabold text-[8px]">✓ Terdaftar</span>
            </div>
            
            <div className="pk-book-page right bg-orange-100/40 rounded-xl">
              {rightPageUnlocked ? (
                <>
                  <span className="pk-book-word text-purple-700 capitalize">{magicBookWord}</span>
                  <span className="text-2xl animate-float">✨</span>
                  <span className="text-[7px] text-purple-500 font-black">Terbuka!</span>
                </>
              ) : (
                <>
                  <span className="text-xl">🔒</span>
                  <button
                    onClick={handleMagicBookUnlock}
                    className="mt-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[8px] rounded-full border border-amber-600 active:scale-95"
                  >
                    Buka Kunci
                  </button>
                </>
              )}
            </div>
          </div>

          {rightPageUnlocked ? (
            <div className="pk-congrats-card">
              <h4 className="font-extrabold text-[9px] text-yellow-300">Selamat!</h4>
              <p className="text-[8px] text-purple-100">Buku Ajaibmu telah meluas menjadi {wordCount} halaman!</p>
              <button
                onClick={() => {
                  confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
                  setWordCount(prev => Math.min(100, prev + 10));
                  setRightPageUnlocked(false);
                  speakText("Kerja bagus!");
                }}
                className="mt-1 px-4 py-1 bg-amber-400 text-slate-900 font-black text-[8px] rounded-full"
              >
                Lanjut Halaman Baru
              </button>
            </div>
          ) : (
            <div className="mt-auto p-2 bg-purple-50 rounded-xl border border-purple-100 flex items-center gap-2">
              <span className="text-base">💡</span>
              <p className="text-[7px] text-purple-800 font-semibold leading-relaxed">
                Pilih kata baru di Kata Quest terlebih dahulu, lalu buka halamannya di sini!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
