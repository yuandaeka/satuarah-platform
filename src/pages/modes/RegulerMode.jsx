import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { playTone } from '../../utils/audio';
import { REGULER_LYRICS } from '../../constants';

// Constants for Maze Robot Game
const MAZE_GRID = [
  ['R', ' ', ' ', ' '],
  ['#', '#', ' ', ' '],
  [' ', ' ', ' ', ' '],
  [' ', '#', ' ', '🏆']
];

const AI_TRAINING_ITEMS = [
  { id: 1, emoji: '🐱', name: 'Kucing', defaultType: 'Hewan' },
  { id: 2, emoji: '🍎', name: 'Apel', defaultType: 'Buah' },
  { id: 3, emoji: '🐶', name: 'Anjing', defaultType: 'Hewan' },
  { id: 4, emoji: '🍌', name: 'Pisang', defaultType: 'Buah' }
];

export default function RegulerMode({
  regulerSubMode,
  setRegulerSubMode,
  regulerSlide,
  setRegulerSlide,
  karaokePlaying,
  setKaraokePlaying,
  karaokeLyricIndex,
  triggerBadgeMinting,
  speakText,
  setSelectedMode,
}) {
  // Tabs for 'praktik' submode: 'coding', 'ai', 'tantangan', 'tutor'
  const [activeTab, setActiveTab] = useState('coding');
  
  // Game & Progress state
  const [stars, setStars] = useState(200);
  const [currentLevel, setCurrentLevel] = useState(1);

  // --- Dunia Coding States (Praktik) ---
  const [robotPos, setRobotPos] = useState({ x: 0, y: 0 });
  const [robotAngle, setRobotAngle] = useState(0); // 0: right, 90: down, 180: left, 270: up
  const [commands, setCommands] = useState([]);
  const [isMazeRunning, setIsMazeRunning] = useState(false);
  const [mazeStatus, setMazeStatus] = useState('Standby'); // 'Standby' | 'Running' | 'Success' | 'Failed'
  const [activeInstructionIndex, setActiveInstructionIndex] = useState(-1);

  // --- Dunia AI States (Praktik) ---
  const [trainedCount, setTrainedCount] = useState(0);
  const [trainedItems, setTrainedItems] = useState({}); // { 1: 'Hewan', 2: 'Buah' }
  const [isTrained, setIsTrained] = useState(false);
  const [testItem, setTestItem] = useState({ emoji: '🍊', name: 'Jeruk' });
  const [aiPrediction, setAiPrediction] = useState(null);
  const [predictionConfidence, setPredictionConfidence] = useState(0);
  const [isClassifying, setIsClassifying] = useState(false);

  // --- AI Tutor States ---
  const [tutorMessage, setTutorMessage] = useState('Halo penjelajah cilik! Aku Robo-Tutor 🤖. Klik tab di atas untuk memulai petualangan koding dan AI bersamaku!');
  const [chatbotInput, setChatbotInput] = useState('');
  const [chatbotLogs, setChatbotLogs] = useState([
    { sender: 'tutor', text: 'Halo! Aku Robo-Tutor 🤖. Tanyakan apa saja tentang logika koding, maze robot, atau bagaimana AI mengenali gambar buah!' }
  ]);

  // Reset Maze
  const resetMaze = () => {
    playTone(300, 'sine', 0.1);
    setRobotPos({ x: 0, y: 0 });
    setRobotAngle(0);
    setCommands([]);
    setIsMazeRunning(false);
    setMazeStatus('Standby');
    setActiveInstructionIndex(-1);
  };

  // Add Maze command
  const addCommand = (cmd) => {
    if (isMazeRunning) return;
    if (commands.length >= 8) {
      playTone(220, 'triangle', 0.2);
      setTutorMessage('Robo-Tutor: "Wah, antrean perintah penuh! Gunakan maksimal 8 perintah dulu agar robot tidak bingung."');
      return;
    }
    playTone(580, 'sine', 0.1);
    setCommands([...commands, cmd]);
  };

  // Run Maze step-by-step
  const runMaze = () => {
    if (isMazeRunning) return;
    if (commands.length === 0) {
      playTone(330, 'triangle', 0.25);
      setTutorMessage('Robo-Tutor: "Susun dahulu blok perintahmu dengan mengklik tombol di bawah!"');
      return;
    }
    
    setIsMazeRunning(true);
    setMazeStatus('Running');
    setTutorMessage('Robo-Tutor: "Robot sedang menyalakan mesin... Mari kita lihat hasil kodenya!"');

    let currentPos = { x: 0, y: 0 };
    let currentAngle = 0; // 0: right, 90: down, 180: left, 270: up
    let step = 0;

    const interval = setInterval(() => {
      if (step >= commands.length) {
        clearInterval(interval);
        setActiveInstructionIndex(-1);
        
        if (currentPos.x === 3 && currentPos.y === 3) {
          setMazeStatus('Success');
          setStars(prev => prev + 50);
          playTone(523.25, 'sine', 0.15);
          setTimeout(() => playTone(659.25, 'sine', 0.25), 150);
          confetti();
          speakText("Luar biasa! Robot kodingmu berhasil mencapai piala emas!");
          setTutorMessage('Robo-Tutor: "HEBAT! Robot sampai ke piala 🏆. Kamu dapat +50 Bintang! Lencana reguler siap diklaim!"');
          triggerBadgeMinting('reguler');
        } else {
          setMazeStatus('Failed');
          playTone(220, 'sawtooth', 0.35);
          setTutorMessage('Robo-Tutor: "Yah, robot berhenti sebelum piala. Yuk klik Bersihkan untuk menulis kode baru (debugging)!"');
        }
        setIsMazeRunning(false);
        return;
      }

      setActiveInstructionIndex(step);
      const cmd = commands[step];

      if (cmd === 'maju') {
        let nextX = currentPos.x;
        let nextY = currentPos.y;
        if (currentAngle === 0) nextX += 1;
        else if (currentAngle === 90) nextY += 1;
        else if (currentAngle === 180) nextX -= 1;
        else if (currentAngle === 270) nextY -= 1;

        if (nextX < 0 || nextX > 3 || nextY < 0 || nextY > 3 || MAZE_GRID[nextY][nextX] === '#') {
          clearInterval(interval);
          setActiveInstructionIndex(-1);
          setMazeStatus('Failed');
          playTone(180, 'sawtooth', 0.4);
          setTutorMessage('Robo-Tutor: "Aduh! Robot menabrak rintangan tembok atau keluar batas. Ayo atur ulang langkah kodenya!"');
          setIsMazeRunning(false);
          return;
        } else {
          currentPos = { x: nextX, y: nextY };
          setRobotPos(currentPos);
          playTone(400, 'sine', 0.1);
        }
      } else if (cmd === 'kanan') {
        currentAngle = (currentAngle + 90) % 360;
        setRobotAngle(currentAngle);
        playTone(450, 'sine', 0.1);
      } else if (cmd === 'kiri') {
        currentAngle = (currentAngle - 90 + 360) % 360;
        setRobotAngle(currentAngle);
        playTone(450, 'sine', 0.1);
      }

      step++;
    }, 700);
  };

  // Train AI
  const handleTrainAI = (itemId, type) => {
    playTone(660, 'sine', 0.1);
    const updated = { ...trainedItems, [itemId]: type };
    setTrainedItems(updated);
    
    const count = Object.keys(updated).length;
    setTrainedCount(count);

    if (count === 4) {
      setIsTrained(true);
      setTutorMessage('Robo-Tutor: "Model AI telah selesai mengumpulkan data pola buah dan hewan! Klik tombol Uji AI."');
    } else {
      setTutorMessage(`Robo-Tutor: "Kerja bagus! Data ke-${count} berhasil dilatih. Latih sisanya ya!"`);
    }
  };

  // Uji AI
  const testAIPrediction = () => {
    if (!isTrained || isClassifying) return;
    setIsClassifying(true);
    setAiPrediction(null);
    setTutorMessage('Robo-Tutor: "Model AI sedang mencocokkan kemiripan data jeruk... 🍊"');
    playTone(480, 'triangle', 0.25);

    setTimeout(() => {
      setIsClassifying(false);
      setAiPrediction('Buah');
      setPredictionConfidence(96);
      setStars(prev => prev + 30);
      playTone(523.25, 'sine', 0.15);
      setTimeout(() => playTone(659.25, 'sine', 0.25), 150);
      confetti();
      speakText("Keren! AI-mu berhasil mendeteksi jeruk sebagai buah!");
      setTutorMessage('Robo-Tutor: "Hebat! Model AI mendeteksi Jeruk 🍊 adalah BUAH dengan akurasi 96%! Kamu dapat +30 Bintang!"');
    }, 1800);
  };

  // AI Tutor Ask questions
  const askTutorPreset = (text, replyText) => {
    playTone(580, 'sine', 0.05);
    setChatbotLogs(prev => [
      ...prev,
      { sender: 'user', text },
      { sender: 'tutor', text: replyText }
    ]);
    playTone(660, 'sine', 0.1);
  };

  const handleTutorChatSubmit = (e) => {
    e.preventDefault();
    if (!chatbotInput.trim()) return;

    const userText = chatbotInput.trim();
    setChatbotLogs(prev => [...prev, { sender: 'user', text: userText }]);
    setChatbotInput('');
    playTone(580, 'sine', 0.05);

    setTimeout(() => {
      let reply = 'Robo-Tutor: "Pertanyaan menarik! Cobalah jalankan robot dengan perintah Maju, Kiri, atau Kanan dan perhatikan jalurnya ya."';
      const q = userText.toLowerCase();

      if (q.includes('maze') || q.includes('robot') || q.includes('koding')) {
        reply = 'Robo-Tutor: "Untuk memandu robot ke piala, hitung langkah lurus lalu belokkan robot sebelum menabrak tembok!"';
      } else if (q.includes('ai') || q.includes('data')) {
        reply = 'Robo-Tutor: "AI bekerja dengan mengenali pola! Pola Apel 🍎 dan Pisang 🍌 memiliki kemiripan manis, sehingga Jeruk 🍊 diuji sebagai Buah."';
      } else if (q.includes('bintang') || q.includes('skor')) {
        reply = 'Robo-Tutor: "Bintang membuktikan seberapa rajin kamu mencoba tantangan. Semakin banyak mencoba, semakin cepat levelmu naik!"';
      } else if (q.includes('halo') || q.includes('hai')) {
        reply = 'Robo-Tutor: "Halo kawan cilik! Aku siap membantumu mempelajari logika koding dan model kecerdasan buatan!"';
      }

      setChatbotLogs(prev => [...prev, { sender: 'tutor', text: reply }]);
      playTone(660, 'sine', 0.1);
    }, 800);
  };

  return (
    <div className="space-y-4">
      {/* HEADER WITH PROGRESS METRICS & BACK BUTTON */}
      <div className="flex justify-between items-center border-b border-emerald-100 pb-3">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => { 
              playTone(440, 'sine', 0.1); 
              if (regulerSubMode) {
                setRegulerSubMode(null);
                setRegulerSlide(0);
                setKaraokePlaying(false);
              } else {
                setSelectedMode(null); 
              }
            }}
            className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-xs font-black text-slate-500 border border-slate-200 active:scale-90 transition-all cursor-pointer"
          >
            &larr;
          </button>
          <div>
            <h3 className="font-black text-xs text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 leading-none">
              🎓 Kelas Reguler
            </h3>
            <p className="text-[8px] text-slate-400 font-extrabold mt-0.5">
              {regulerSubMode ? `Gaya Belajar: ${regulerSubMode.toUpperCase()}` : 'Koding & Kecerdasan Buatan'}
            </p>
          </div>
        </div>

        {/* PROGRESS SYSTEM */}
        <div className="flex items-center gap-1.5">
          <div className="bg-amber-50 border border-amber-200 text-amber-600 rounded-full px-3 py-1 flex items-center gap-1 text-[8.5px] font-black shadow-sm">
            <span>⭐</span>
            <span>{stars} Bintang</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full px-3 py-1 flex items-center gap-1 text-[8.5px] font-black shadow-sm">
            <span>🎯</span>
            <span>Lvl {currentLevel}</span>
          </div>
        </div>
      </div>

      {/* STYLE SELECTOR (WHEN REGULERSUBMODE IS NULL) */}
      {!regulerSubMode ? (
        <div className="space-y-4 py-2 animate-fadeIn">
          <div className="bg-emerald-50 rounded-2.5xl p-4 border border-emerald-100/60 text-center space-y-1">
            <span className="text-3xl animate-float block">🎓</span>
            <h4 className="font-black text-xs text-slate-800">Pilih Gaya Belajar Favoritmu:</h4>
            <p className="text-[8px] text-slate-400 font-extrabold leading-relaxed">
              Materi Koding & AI dirancang khusus menyesuaikan cara belajar ternyamanmu!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* 1. Visual Mode */}
            <button
              onClick={() => {
                playTone(520, 'sine', 0.12);
                setRegulerSubMode('visual');
                setRegulerSlide(0);
                speakText("Gaya Visual diaktifkan. Ayo belajar logika koding lewat slide gambar kartun!");
              }}
              className="bubbly-card p-4 rounded-3xl text-left border-2 border-emerald-100 hover:border-emerald-400 active:scale-98 transition-all flex items-center gap-3.5 group cursor-pointer bg-white"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform flex-shrink-0">
                🎨
              </div>
              <div className="space-y-0.5">
                <h5 className="font-black text-xs text-slate-800">🎨 GAYA VISUAL (Gambar & Slide)</h5>
                <p className="text-[8.5px] text-slate-400 font-semibold leading-relaxed">
                  Belajar konsep algoritma & AI melalui petualangan slide cerita bergambar yang menyenangkan.
                </p>
              </div>
            </button>

            {/* 2. Audio Mode */}
            <button
              onClick={() => {
                playTone(520, 'sine', 0.12);
                setRegulerSubMode('audio');
                speakText("Gaya Audio diaktifkan. Putar lagu mnemonik koding dan bernyanyilah bersama!");
              }}
              className="bubbly-card p-4 rounded-3xl text-left border-2 border-indigo-100 hover:border-indigo-400 active:scale-98 transition-all flex items-center gap-3.5 group cursor-pointer bg-white"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform flex-shrink-0">
                🎵
              </div>
              <div className="space-y-0.5">
                <h5 className="font-black text-xs text-slate-800">🎵 GAYA AUDIO (Lagu & Cerita)</h5>
                <p className="text-[8.5px] text-slate-400 font-semibold leading-relaxed">
                  Dengarkan dan ikuti lagu koding cilik untuk menghafal materi dengan rima nada ceria.
                </p>
              </div>
            </button>

            {/* 3. Practical Mode */}
            <button
              onClick={() => {
                playTone(520, 'sine', 0.12);
                setRegulerSubMode('praktik');
                speakText("Gaya Praktik diaktifkan. Selesaikan tantangan robot maze dan latih model kecerdasan buatan!");
              }}
              className="bubbly-card p-4 rounded-3xl text-left border-2 border-pink-100 hover:border-pink-400 active:scale-98 transition-all flex items-center gap-3.5 group cursor-pointer bg-white"
            >
              <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform flex-shrink-0">
                🕹️
              </div>
              <div className="space-y-0.5">
                <h5 className="font-black text-xs text-slate-800">🕹️ GAYA PRAKTIK (Game Robot & AI)</h5>
                <p className="text-[8.5px] text-slate-400 font-semibold leading-relaxed">
                  Susun blok kode robot, latih pola data kecerdasan buatan, dan pecahkan kuis interaktif.
                </p>
              </div>
            </button>
          </div>
        </div>
      ) : regulerSubMode === 'visual' ? (
        /* ============================================================== */
        /* SUB-MODE A: GAYA VISUAL SLIDES */
        /* ============================================================== */
        <div className="space-y-4 animate-fadeIn">
          <div className="bubbly-card p-4 rounded-3xl text-center bg-white border-2 space-y-4 shadow-sm">
            {/* Visual cartoon container */}
            <div className="w-full h-36 bg-emerald-50 rounded-2.5xl flex items-center justify-center text-6.5xl shadow-inner animate-float border border-emerald-100">
              {regulerSlide === 0 ? '🚶🤖' : regulerSlide === 1 ? '🧠💡' : '🏆🎁'}
            </div>
            
            {regulerSlide === 0 && (
              <div className="space-y-1">
                <span className="bg-emerald-100 text-emerald-800 text-[7px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">Slide 1: Koding</span>
                <h4 className="font-black text-sm text-slate-800 leading-tight">Langkah Robot Sekuensial</h4>
                <p className="text-[9.5px] text-slate-500 font-semibold mt-2 leading-relaxed px-2">
                  Komputer bekerja mengikuti perintah koding yang ditulis berurutan! Kita menyuruh robot melangkah Maju 🚶, Belok Kanan ↩️, atau Belok Kiri ↪️ untuk menghindari dinding pembatas.
                </p>
              </div>
            )}

            {regulerSlide === 1 && (
              <div className="space-y-1">
                <span className="bg-emerald-100 text-emerald-800 text-[7px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">Slide 2: Kecerdasan Buatan</span>
                <h4 className="font-black text-sm text-slate-800 leading-tight">Bagaimana AI Belajar Pola?</h4>
                <p className="text-[9.5px] text-slate-500 font-semibold mt-2 leading-relaxed px-2">
                  Kecerdasan Artifisial (AI) belajar mengenali benda dengan melihat ribuan gambar contoh data. Semakin banyak buah 🍎 atau hewan 🐶 yang kita tunjukkan, AI akan semakin pintar menebak benda baru!
                </p>
              </div>
            )}

            {regulerSlide === 2 && (
              <div className="space-y-2">
                <span className="bg-emerald-100 text-emerald-800 text-[7px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">Slide 3: Kuis Menangkan Lencana</span>
                <h4 className="font-black text-sm text-slate-800 leading-tight">Pertanyaan Pemula Cilik:</h4>
                <p className="text-[10px] text-slate-600 font-extrabold mt-2 leading-relaxed">
                  Apakah istilah perintah terurut yang kita susun agar komputer/robot bergerak?
                </p>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={() => {
                      playTone(523.25, 'sine', 0.15);
                      setTimeout(() => playTone(659.25, 'sine', 0.25), 150);
                      confetti();
                      speakText("Luar biasa! Jawabanmu benar, itu dinamakan koding!");
                      setStars(prev => prev + 40);
                      triggerBadgeMinting('reguler');
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[9.5px] py-2.5 px-3 rounded-xl cursor-pointer shadow-sm active:scale-95 transition-all"
                  >
                    Koding (Algoritma)
                  </button>
                  <button
                    onClick={() => {
                      playTone(220, 'triangle', 0.35);
                      speakText("Kurang tepat, coba baca lagi slide pertama!");
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-[9.5px] py-2.5 px-3 rounded-xl cursor-pointer active:scale-95 transition-all"
                  >
                    Membaca Kertas
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Slides navigation controller */}
          <div className="flex justify-between items-center bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <button
              onClick={() => { playTone(580, 'sine', 0.05); setRegulerSlide(prev => Math.max(0, prev - 1)); }}
              disabled={regulerSlide === 0}
              className="bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-[9px] font-black border border-slate-200 disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <span className="text-[9.5px] font-black text-slate-400">{regulerSlide + 1} / 3</span>
            <button
              onClick={() => { playTone(580, 'sine', 0.05); setRegulerSlide(prev => Math.min(2, prev + 1)); }}
              disabled={regulerSlide === 2}
              className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-[9px] font-black border-b-3 border-emerald-700 disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>

          <button
            onClick={() => { setRegulerSubMode(null); setRegulerSlide(0); }}
            className="w-full bg-slate-100 text-slate-600 text-[9px] font-black py-2.5 rounded-xl uppercase tracking-wider mt-4 border border-slate-200"
          >
            Pilih Gaya Belajar Lain &larr;
          </button>
        </div>
      ) : regulerSubMode === 'audio' ? (
        /* ============================================================== */
        /* SUB-MODE B: GAYA AUDIO MNEMONICS & CERITA */
        /* ============================================================== */
        <div className="space-y-4 animate-fadeIn">
          <div className="bubbly-card p-5 rounded-3xl text-center bg-white border-2 space-y-4 shadow-sm">
            <h4 className="font-black text-xs text-slate-700">🎵 Pemutar Lagu Koding Cilik</h4>
            <p className="text-[8.5px] text-slate-400 font-extrabold leading-relaxed px-2">
              Dengarkan lagu ceria di bawah untuk mempermudah menghafal logika koding & AI!
            </p>
            
            {/* Visualizer and Lyrics display */}
            <div className="w-full bg-slate-900 rounded-2.5xl p-4 flex flex-col items-center justify-center min-h-[130px] shadow-lg border border-slate-950">
              {karaokePlaying ? (
                <div className="flex items-center gap-1.5 justify-center mb-4">
                  <span className="w-1.5 bg-emerald-400 h-8 rounded-full animate-bounce"></span>
                  <span className="w-1.5 bg-emerald-300 h-12 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 bg-emerald-500 h-6 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                  <span className="w-1.5 bg-emerald-300 h-10 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                  <span className="w-1.5 bg-emerald-400 h-8 rounded-full animate-bounce"></span>
                </div>
              ) : (
                <div className="text-3.5xl mb-3 text-slate-600 animate-pulse">🎵</div>
              )}
              
              <div className="min-h-[35px] flex items-center justify-center px-2">
                {karaokeLyricIndex !== -1 ? (
                  <p className="text-[10px] text-emerald-400 font-black tracking-wide text-center leading-relaxed animate-pulse">
                    {REGULER_LYRICS[karaokeLyricIndex].text}
                  </p>
                ) : (
                  <p className="text-[8.5px] text-slate-500 font-bold text-center leading-relaxed px-4">
                    Klik tombol di bawah untuk mendengarkan lagu dan cerita koding cilik.
                  </p>
                )}
              </div>
            </div>

            {/* Audio action trigger */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  playTone(600, 'sine', 0.05);
                  setKaraokePlaying(!karaokePlaying);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white border-b-4 border-indigo-800 active:border-b-0 active:translate-y-0.5 font-black text-[9.5px] py-2.5 px-5 rounded-xl flex items-center gap-2 cursor-pointer transition-all"
              >
                {karaokePlaying ? '🛑 Hentikan Pemutaran' : '▶️ Putar Lagu Mnemonic'}
              </button>
            </div>
          </div>

          <button
            onClick={() => { setRegulerSubMode(null); setKaraokePlaying(false); }}
            className="w-full bg-slate-100 text-slate-600 text-[9px] font-black py-2.5 rounded-xl uppercase tracking-wider mt-4 border border-slate-200"
          >
            Pilih Gaya Belajar Lain &larr;
          </button>
        </div>
      ) : (
        /* ============================================================== */
        /* SUB-MODE C: GAYA PRAKTIK (GAME LABIRIN & LATIH MODEL AI) */
        /* ============================================================== */
        <div className="space-y-4 animate-fadeIn">
          {/* ROBO-TUTOR LIVE PANDUAN */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 rounded-2.5xl p-3 border border-emerald-100/60 flex items-start gap-3 shadow-sm relative overflow-hidden">
            <div className="absolute right-2 top-1 text-4xl opacity-10 select-none">🤖</div>
            <span className="text-2xl animate-float">🤖</span>
            <div className="space-y-0.5">
              <span className="text-[8px] font-black text-emerald-700 uppercase tracking-wider">Robo-Tutor Pendamping</span>
              <p className="text-[9.5px] text-slate-700 font-bold leading-relaxed">{tutorMessage}</p>
            </div>
          </div>

          {/* INNER TABS FOR PRACTICE MODULE */}
          <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-2.5xl border border-slate-200">
            {[
              { id: 'coding', label: '💻 Coding', color: 'bg-emerald-500' },
              { id: 'ai', label: '🧠 Dunia AI', color: 'bg-indigo-500' },
              { id: 'tantangan', label: '⚡ Tantangan', color: 'bg-pink-500' },
              { id: 'tutor', label: '🤖 AI Tutor', color: 'bg-amber-500' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { playTone(600, 'sine', 0.08); setActiveTab(tab.id); }}
                className={`py-2.5 rounded-xl text-[8.5px] font-black transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? `${tab.color} text-white shadow-md scale-102` 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* PRACTICE CONTENTS */}
          {activeTab === 'coding' && (
            <div className="bubbly-card p-4 rounded-3xl bg-white border-2 space-y-4 shadow-sm animate-fadeIn">
              <div className="text-center space-y-1">
                <h4 className="font-black text-xs text-slate-800 flex items-center justify-center gap-1">🕹️ Petualangan Maze Robot</h4>
                <p className="text-[8px] text-slate-400 font-extrabold leading-relaxed px-2">
                  Susun blok agar robot berjalan menghindari tembok bata (🧱) menuju piala emas (🏆) secara sekuensial!
                </p>
              </div>

              {/* Grid board */}
              <div className="flex justify-center py-1">
                <div className="grid grid-cols-4 gap-1.5 p-2.5 bg-slate-900 rounded-3xl border-4 border-slate-800 shadow-xl relative">
                  {MAZE_GRID.map((row, y) =>
                    row.map((cell, x) => {
                      const isRobot = robotPos.x === x && robotPos.y === y;
                      const isTarget = cell === '🏆';
                      const isObstacle = cell === '#';
                      return (
                        <div 
                          key={`${x}-${y}`} 
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center relative text-lg font-black border transition-all duration-300 ${
                            isObstacle 
                              ? 'bg-slate-950 border-slate-950 text-slate-700 shadow-inner' 
                              : isTarget
                              ? 'bg-amber-100/10 border-amber-400/40 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)] animate-pulse'
                              : 'bg-slate-800 border-slate-700/60'
                          }`}
                        >
                          {isRobot && (
                            <div 
                              className="text-2xl transition-all duration-300 ease-in-out drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                              style={{ transform: `rotate(${robotAngle}deg)` }}
                            >
                              🤖
                            </div>
                          )}
                          {!isRobot && isTarget && '🏆'}
                          {!isRobot && isObstacle && '🧱'}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Commands Queue */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Antrean Blok Kode:</span>
                  <span className="text-[7.5px] font-bold text-slate-400">{commands.length}/8 Blok</span>
                </div>
                
                <div className="min-h-[46px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2.5xl p-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  {commands.length === 0 ? (
                    <span className="text-[8.5px] text-slate-400 font-semibold italic mx-auto">Klik tombol kuning di bawah untuk memasukkan blok</span>
                  ) : (
                    commands.map((cmd, idx) => {
                      const isActive = idx === activeInstructionIndex;
                      return (
                        <div 
                          key={idx} 
                          className={`px-3 py-2 rounded-xl text-[8.5px] font-black text-white flex items-center gap-1 border-b-4 transition-all duration-200 ${
                            isActive ? 'scale-110 shadow-lg ring-2 ring-yellow-400' : ''
                          } ${
                            cmd === 'maju' 
                              ? 'bg-emerald-500 border-emerald-700' 
                              : cmd === 'kanan'
                              ? 'bg-indigo-500 border-indigo-700'
                              : 'bg-purple-500 border-purple-700'
                          }`}
                        >
                          <span>{cmd === 'maju' ? '🚶 Maju' : cmd === 'kanan' ? '↩️ Kanan' : '↪️ Kiri'}</span>
                          <span className="text-[7px] opacity-75">➔</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Blocks Palette */}
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => addCommand('maju')}
                  disabled={isMazeRunning}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-900 border-b-4 border-amber-600 hover:border-b-2 active:translate-y-0.5 font-black py-2.5 rounded-2xl text-[9px] uppercase cursor-pointer transition-all disabled:opacity-40"
                >
                  + 🚶 Maju
                </button>
                <button 
                  onClick={() => addCommand('kanan')}
                  disabled={isMazeRunning}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-900 border-b-4 border-amber-600 hover:border-b-2 active:translate-y-0.5 font-black py-2.5 rounded-2xl text-[9px] uppercase cursor-pointer transition-all disabled:opacity-40"
                >
                  + ↩️ Belok Kanan
                </button>
                <button 
                  onClick={() => addCommand('kiri')}
                  disabled={isMazeRunning}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-900 border-b-4 border-amber-600 hover:border-b-2 active:translate-y-0.5 font-black py-2.5 rounded-2xl text-[9px] uppercase cursor-pointer transition-all disabled:opacity-40"
                >
                  + ↪️ Belok Kiri
                </button>
              </div>

              {/* Controls */}
              <div className="flex gap-2.5 pt-2.5 border-t border-slate-100">
                <button 
                  onClick={resetMaze}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 hover:border-slate-400 text-slate-600 font-black py-3 rounded-2xl text-[9.5px] uppercase tracking-wider transition-all cursor-pointer"
                >
                  🗑️ Bersihkan
                </button>
                <button 
                  onClick={runMaze}
                  disabled={isMazeRunning}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-b-4 border-teal-800 active:border-b-0 active:translate-y-0.5 font-black py-3 rounded-2xl text-[9.5px] uppercase tracking-wider cursor-pointer transition-all disabled:opacity-50"
                >
                  {mazeStatus === 'Running' ? '⚡ Menjalankan...' : '▶️ Jalankan Robot'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="bubbly-card p-4 rounded-3xl bg-white border-2 space-y-4 shadow-sm animate-fadeIn">
              <div className="text-center space-y-1">
                <h4 className="font-black text-xs text-slate-800">🧠 Portal Pelatihan Model AI</h4>
                <p className="text-[8px] text-slate-400 font-extrabold leading-relaxed px-2">
                  Klasifikasikan data contoh di bawah. Model AI membutuhkan latihan agar dapat mengenali gambar baru!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {AI_TRAINING_ITEMS.map((item) => {
                  const choice = trainedItems[item.id];
                  return (
                    <div key={item.id} className="p-3 bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-3xl flex flex-col items-center gap-2 transition-all">
                      <span className="text-3.5xl animate-float">{item.emoji}</span>
                      <span className="text-[9.5px] font-black text-slate-800 leading-none">{item.name}</span>
                      
                      <div className="flex gap-1.5 mt-1.5 w-full">
                        <button
                          onClick={() => handleTrainAI(item.id, 'Hewan')}
                          className={`flex-1 py-1.5 rounded-xl text-[8.5px] font-black border transition-all cursor-pointer ${
                            choice === 'Hewan'
                              ? 'bg-indigo-500 border-indigo-600 text-white shadow-md'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100 hover:scale-103'
                          }`}
                        >
                          🐾 Hewan
                        </button>
                        <button
                          onClick={() => handleTrainAI(item.id, 'Buah')}
                          className={`flex-1 py-1.5 rounded-xl text-[8.5px] font-black border transition-all cursor-pointer ${
                            choice === 'Buah'
                              ? 'bg-indigo-500 border-indigo-600 text-white shadow-md'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100 hover:scale-103'
                          }`}
                        >
                          🍒 Buah
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-3xl space-y-3 shadow-inner">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="text-[9.5px] font-black text-indigo-900 uppercase tracking-wide">Fase 2: Uji Kemampuan AI</h5>
                    <p className="text-[8px] text-indigo-600 font-semibold">Tebak kategori buah jeruk berikut:</p>
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 text-[7px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Testing</span>
                </div>

                <div className="flex items-center justify-around gap-2">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-md border border-indigo-200 mb-1.5">
                      {testItem.emoji}
                    </div>
                    <span className="text-[9.5px] font-black text-slate-700">{testItem.name}</span>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-1 text-center">
                    {aiPrediction ? (
                      <div className="space-y-1">
                        <span className="bg-emerald-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm animate-bounce">
                          Prediksi: {aiPrediction} 🍒
                        </span>
                        <p className="text-[8px] text-slate-500 font-semibold">Akurasi Kemiripan: {predictionConfidence}%</p>
                      </div>
                    ) : isClassifying ? (
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
                        <span className="text-[8.5px] font-bold text-slate-500">Memindai Pola...</span>
                      </div>
                    ) : (
                      <span className="text-[8px] text-slate-400 font-semibold italic">Latih model lalu klik Uji AI</span>
                    )}
                  </div>

                  <div>
                    <button
                      onClick={testAIPrediction}
                      disabled={!isTrained || isClassifying}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white border-b-4 border-indigo-800 active:border-b-0 active:translate-y-0.5 font-black py-2.5 px-4 rounded-xl text-[9px] uppercase tracking-wide disabled:opacity-40 cursor-pointer shadow-md transition-all"
                    >
                      🔍 Uji AI
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tantangan' && (
            <div className="bubbly-card p-4 rounded-3xl bg-white border-2 space-y-4 shadow-sm animate-fadeIn">
              <div className="text-center space-y-1">
                <h4 className="font-black text-xs text-slate-800">⚡ Arena Tantangan Berlevel</h4>
                <p className="text-[8px] text-slate-400 font-extrabold leading-relaxed px-2">
                  Mainkan tantangan tambahan di bawah ini untuk menaikkan skor bintang kodingmu!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => {
                    playTone(523.25, 'sine', 0.15);
                    setTutorMessage('Robo-Tutor: "Selesaikan maze robot di tab Koding dengan aman!"');
                    setActiveTab('coding');
                  }}
                  className="p-3.5 bg-emerald-50 border-2 border-emerald-300 rounded-3xl cursor-pointer hover:scale-103 active:scale-98 transition-all text-center space-y-2 shadow-sm"
                >
                  <span className="text-3xl">🤖</span>
                  <div>
                    <h5 className="font-black text-[9px] text-slate-800 leading-none">Level 1: Robot Maze</h5>
                    <p className="text-[7.5px] text-emerald-600 font-black mt-1.5 uppercase">Status: Aktif</p>
                  </div>
                </div>

                <div 
                  onClick={() => {
                    playTone(523.25, 'sine', 0.15);
                    setTutorMessage('Robo-Tutor: "Kumpulkan 4 data latih di tab Dunia AI terlebih dahulu!"');
                    setActiveTab('ai');
                  }}
                  className="p-3.5 bg-indigo-50 border-2 border-indigo-200 rounded-3xl cursor-pointer hover:scale-103 active:scale-98 transition-all text-center space-y-2 shadow-sm"
                >
                  <span className="text-3xl">🧠</span>
                  <div>
                    <h5 className="font-black text-[9px] text-slate-800 leading-none">Level 2: AI Klasifikasi</h5>
                    <p className="text-[7.5px] text-indigo-600 font-black mt-1.5 uppercase">Status: Terbuka</p>
                  </div>
                </div>

                <div 
                  onClick={() => {
                    playTone(660, 'sine', 0.15);
                    setStars(prev => prev + 25);
                    confetti();
                    speakText("Hebat! Kode perulangan berhasil kamu perbaiki!");
                    setTutorMessage('Robo-Tutor: "Keren! Perulangan loop kodingmu berhasil lolos uji debugging. +25 Bintang!"');
                  }}
                  className="p-3.5 bg-pink-50 border-2 border-pink-200 rounded-3xl cursor-pointer hover:scale-103 active:scale-98 transition-all text-center space-y-2 shadow-sm"
                >
                  <span className="text-3xl">🐞</span>
                  <div>
                    <h5 className="font-black text-[9px] text-slate-800 leading-none">Level 3: Debugging</h5>
                    <p className="text-[7.5px] text-pink-600 font-black mt-1.5 uppercase">Klaim +25 ⭐</p>
                  </div>
                </div>

                <div 
                  onClick={() => {
                    playTone(660, 'sine', 0.15);
                    setStars(prev => prev + 30);
                    confetti();
                    speakText("Hebat! Gunakan AI secara aman dan etis!");
                    setTutorMessage('Robo-Tutor: "Jawaban Tepat! Gunakan AI untuk belajar memecahkan masalah, bukan untuk menyontek! +30 Bintang!"');
                  }}
                  className="p-3.5 bg-purple-50 border-2 border-purple-200 rounded-3xl cursor-pointer hover:scale-103 active:scale-98 transition-all text-center space-y-2 shadow-sm"
                >
                  <span className="text-3xl">🔒</span>
                  <div>
                    <h5 className="font-black text-[9px] text-slate-800 leading-none">Level 4: Etika AI</h5>
                    <p className="text-[7.5px] text-purple-600 font-black mt-1.5 uppercase">Klaim +30 ⭐</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tutor' && (
            <div className="bubbly-card p-4 rounded-3xl bg-white border-2 space-y-3 flex flex-col h-[290px] shadow-sm animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2 flex-shrink-0">
                <span className="text-2xl animate-float">🤖</span>
                <div>
                  <h4 className="font-black text-xs text-slate-800 leading-none">Robo-Tutor Koding Cilik</h4>
                  <p className="text-[8px] text-slate-400 font-bold mt-0.5">Pendamping Koding & AI Inklusi</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 bg-slate-50 p-2.5 rounded-2xl shadow-inner">
                {chatbotLogs.map((msg, index) => (
                  <div 
                    key={index}
                    className={`max-w-[85%] rounded-2xl p-2.5 text-[9px] font-semibold leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-500 text-white self-end ml-auto rounded-tr-none shadow-sm'
                        : 'bg-white border border-slate-200/60 text-slate-700 mr-auto rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              <div className="flex gap-1.5 overflow-x-auto whitespace-nowrap py-1 scrollbar-none flex-shrink-0">
                <button
                  type="button"
                  onClick={() => askTutorPreset("Bagaimana cara menang?", "Robo-Tutor: Untuk memenangkan maze robot, susun perintah: Maju -> Maju -> Belok Kanan -> Maju -> Maju -> Belok Kanan -> Maju -> Maju.")}
                  className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[7.5px] font-black inline-block cursor-pointer hover:bg-emerald-100"
                >
                  🎮 Tips Menang Maze
                </button>
                <button
                  type="button"
                  onClick={() => askTutorPreset("Apa itu Data & Pola AI?", "Robo-Tutor: Data adalah sekumpulan contoh (seperti foto apel dan pisang). AI mencocokkan kemiripan jeruk dengan buah manis lainnya.")}
                  className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[7.5px] font-black inline-block cursor-pointer hover:bg-emerald-100"
                >
                  🧠 Apa itu Pola AI?
                </button>
              </div>

              <form onSubmit={handleTutorChatSubmit} className="flex gap-2 flex-shrink-0">
                <input
                  type="text"
                  value={chatbotInput}
                  onChange={(e) => setChatbotInput(e.target.value)}
                  placeholder="Tulis pertanyaanmu di sini..."
                  className="flex-1 bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none rounded-xl py-2 px-3 text-[9px] font-bold text-slate-800 shadow-inner"
                />
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-4 py-2 rounded-xl text-[9px] uppercase active:scale-95 transition-all shadow-sm cursor-pointer"
                >
                  Tanya
                </button>
              </form>
            </div>
          )}

          <button
            onClick={() => { setRegulerSubMode(null); }}
            className="w-full bg-slate-100 text-slate-600 text-[9px] font-black py-2.5 rounded-xl uppercase tracking-wider mt-4 border border-slate-200"
          >
            Pilih Gaya Belajar Lain &larr;
          </button>
        </div>
      )}
    </div>
  );
}
