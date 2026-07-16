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
  earnSparks,
}) {
  // Tabs for 'praktik' submode: 'coding', 'ai', 'tantangan', 'tutor'
  const [activeTab, setActiveTab] = useState('coding');
  const [modulPage, setModulPage] = useState(1);
  
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
  // --- Cybersecurity Detective States ---
  const [detectiveStage, setDetectiveStage] = useState(0); 
  const [detectiveLogs, setDetectiveLogs] = useState([]);
  const [noisyDataEnabled, setNoisyDataEnabled] = useState(false);

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
          if (typeof earnSparks === 'function') earnSparks(15, 'complete_challenge');
          setTutorMessage('Robo-Tutor: "HEBAT! Robot sampai ke piala 🏆. Kamu dapat +50 Bintang! Lencana reguler siap diklaim!"');
          triggerBadgeMinting('reguler');
        } else {
          setMazeStatus('Failed');
          playTone(220, 'sawtooth', 0.35);
          if (typeof earnSparks === 'function') earnSparks(5, 'retry_quiz');
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
    setTutorMessage(
      noisyDataEnabled 
        ? 'Robo-Tutor: "Model AI kebingungan karena ada data latih palsu yang kotor... 🍊🐶"' 
        : 'Robo-Tutor: "Model AI sedang mencocokkan kemiripan data jeruk... 🍊"'
    );
    playTone(noisyDataEnabled ? 220 : 480, 'triangle', 0.25);

    setTimeout(() => {
      setIsClassifying(false);
      if (noisyDataEnabled) {
        setAiPrediction('Hewan');
        setPredictionConfidence(38);
        speakText("Oh tidak, AI-mu salah menebak jeruk sebagai hewan karena data kotor!");
        setTutorMessage('Robo-Tutor: "OH TIDAK! AI mendeteksi Jeruk 🍊 adalah HEWAN dengan akurasi rendah 38%! Ini karena Pengaruh Data Input yang salah (Noisy Data)!"');
      } else {
        setAiPrediction('Buah');
        setPredictionConfidence(96);
        setStars(prev => Math.min(1000, prev + 30));
        playTone(523.25, 'sine', 0.15);
        setTimeout(() => playTone(659.25, 'sine', 0.25), 150);
        confetti();
        speakText("Keren! AI-mu berhasil mendeteksi jeruk sebagai buah!");
        setTutorMessage('Robo-Tutor: "Hebat! Model AI mendeteksi Jeruk 🍊 adalah BUAH dengan akurasi 96%! Kamu dapat +30 Bintang!"');
      }
    }, 1800);
  };

  // Cybersecurity Detective Game logic
  const startDetectiveGame = () => {
    playTone(523.25, 'sine', 0.15);
    setDetectiveStage(1);
    setDetectiveLogs([
      { sender: 'shadow', text: 'Hai! Aku Mr. Shadow. Aku bisa memberi kamu 1000 Diamond Game gratis 💎! Tapi, tolong beri tahu aku apa password akun SatuArah kamu ya?' }
    ]);
  };

  const handleDetectiveOption = (optionKey, text, isCorrect) => {
    if (isCorrect) {
      playTone(580, 'sine', 0.15);
      if (detectiveStage === 1) {
        setDetectiveStage(2);
        setDetectiveLogs(prev => [
          ...prev,
          { sender: 'user', text },
          { sender: 'shadow', text: 'Wah kamu pintar sekali. Bagaimana kalau nama asli sekolahmu dan alamat rumah lengkapmu? Aku mau mengirimkan mainan robot Koka raksasa ke rumahmu!' }
        ]);
      } else if (detectiveStage === 2) {
        setDetectiveStage(3);
        setStars(prev => Math.min(1000, prev + 50));
        confetti();
        speakText("Luar biasa! Kamu lulus ujian Detektif Digital Cilik!");
        setDetectiveLogs(prev => [
          ...prev,
          { sender: 'user', text },
          { sender: 'shadow', text: 'Selamat! Kamu lulus ujian Detektif Keamanan Informasi Cilik! Keamanan privasimu terjaga dengan baik. Kamu mendapatkan Lencana Detektif & +50 Bintang! 🏆' }
        ]);
        triggerBadgeMinting('reguler');
      }
    } else {
      playTone(180, 'sawtooth', 0.35);
      setDetectiveStage(4);
      setDetectiveLogs(prev => [
        ...prev,
        { sender: 'user', text },
        { sender: 'shadow', text: 'Aha! Data pribadimu berhasil aku dapatkan! Jangan sembarangan memberikan kata sandi atau alamat kepada orang asing di internet ya! Klik tombol Coba Lagi untuk belajar melindungi privasimu.' }
      ]);
    }
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

            {/* 4. Modul Mode (Digital Book) */}
            <button
              onClick={() => {
                playTone(520, 'sine', 0.12);
                setRegulerSubMode('modul');
                setModulPage(1);
                speakText("Gaya Modul diaktifkan. Bacalah buku digital interaktif berikut ini!");
              }}
              className="bubbly-card p-4 rounded-3xl text-left border-2 border-amber-100 hover:border-amber-400 active:scale-98 transition-all flex items-center gap-3.5 group cursor-pointer bg-white"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform flex-shrink-0">
                📖
              </div>
              <div className="space-y-0.5">
                <h5 className="font-black text-xs text-slate-800">📖 GAYA MODUL (Buku Digital)</h5>
                <p className="text-[8.5px] text-slate-400 font-semibold leading-relaxed">
                  E-book interaktif flip-page yang bersih, berisi teks materi standar, glosarium, dan rangkuman Bab.
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
            {/* Visual illustration diagrams */}
            {regulerSlide === 0 && (
              <div className="w-full h-36 bg-slate-900 rounded-2.5xl flex flex-col items-center justify-center p-3 shadow-inner border border-slate-800 space-y-2 animate-fadeIn">
                <div className="flex gap-1 items-center justify-center bg-slate-950 p-2 rounded-xl border border-slate-800 w-full max-w-[280px]">
                  <span className="text-xl">🤖</span>
                  <span className="text-xs text-emerald-400 font-black animate-pulse">➔</span>
                  <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-lg px-2 py-0.5 text-[8px] font-black uppercase">🚶 Maju</div>
                  <span className="text-xs text-emerald-400 font-black">➔</span>
                  <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-lg px-2 py-0.5 text-[8px] font-black uppercase">🚶 Maju</div>
                  <span className="text-xs text-indigo-400 font-black">➔</span>
                  <div className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 rounded-lg px-2 py-0.5 text-[8px] font-black uppercase">↩️ Kanan</div>
                  <span className="text-xs text-amber-400 font-black">➔</span>
                  <span className="text-xl">🏆</span>
                </div>
                <span className="text-[7.5px] text-slate-400 font-black uppercase tracking-wider">Visualisasi Jalur Sekuensial Koding</span>
              </div>
            )}

            {regulerSlide === 1 && (
              <div className="w-full h-36 bg-slate-900 rounded-2.5xl flex flex-col items-center justify-center p-3 shadow-inner border border-slate-800 space-y-2 animate-fadeIn">
                <div className="flex justify-between items-center gap-3 w-full max-w-[280px]">
                  {/* Kategori Buah */}
                  <div className="flex flex-col items-center p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex-1">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wide text-[7px] leading-none mb-1">🍎 Buah</span>
                    <span className="text-sm tracking-widest">🍎🍌🍊</span>
                  </div>
                  <span className="text-xs text-indigo-400 font-black">➔</span>
                  {/* Model AI Otak */}
                  <div className="flex flex-col items-center justify-center p-2 bg-indigo-500/20 border border-indigo-400/40 rounded-xl relative">
                    <span className="text-xl animate-float">🧠✨</span>
                    <span className="text-[7px] font-black text-indigo-300 uppercase mt-1">AI Model</span>
                  </div>
                  <span className="text-xs text-indigo-400 font-black">➔</span>
                  {/* Kategori Hewan */}
                  <div className="flex flex-col items-center p-1.5 bg-purple-500/10 border border-purple-500/30 rounded-xl flex-1">
                    <span className="text-xs font-black text-purple-400 uppercase tracking-wide text-[7px] leading-none mb-1">🐱 Hewan</span>
                    <span className="text-sm tracking-widest">🐱🐶🦊</span>
                  </div>
                </div>
                <span className="text-[7.5px] text-slate-400 font-black uppercase tracking-wider">Cara AI Memilah Data & Pola</span>
              </div>
            )}

            {regulerSlide === 2 && (
              <div className="w-full h-36 bg-gradient-to-tr from-amber-500/20 to-yellow-600/10 rounded-2.5xl flex flex-col items-center justify-center p-3 shadow-inner border border-amber-300/40 space-y-1.5 animate-fadeIn">
                <span className="text-4xl animate-bounce">🏆⭐</span>
                <span className="text-[8.5px] font-black text-amber-600 uppercase tracking-wider">Tantangan Kuis Lencana Cilik</span>
              </div>
            )}
            
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
                      if (typeof earnSparks === 'function') earnSparks(15, 'complete_challenge');
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
                      if (typeof earnSparks === 'function') earnSparks(5, 'retry_quiz');
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
              onClick={() => { playTone(580, 'sine', 0.05); setRegulerSlide(prev => Math.min(2, prev + 1)); if (typeof earnSparks === 'function') earnSparks(10, 'complete_slide'); }}
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
      ) : regulerSubMode === 'praktik' ? (
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

              {/* Noisy Data simulation controls (Bab 4-D) */}
              <div className="bg-slate-50 p-3 rounded-2.5xl border border-slate-200/60 flex items-center justify-between">
                <div className="space-y-0.5 text-left">
                  <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-wider block">Simulasi Input Data Kotor (Bab 4-D):</span>
                  <p className="text-[8px] text-slate-500 font-extrabold leading-normal">
                    {noisyDataEnabled 
                      ? "⚠️ Aktif: Gambar apel bertelinga kucing dimasukkan!" 
                      : "✔️ Bersih: Data masukan murni tanpa gangguan."}
                  </p>
                </div>
                <button
                  onClick={() => { playTone(600, 'sine', 0.05); setNoisyDataEnabled(!noisyDataEnabled); }}
                  className={`px-3 py-1.5 rounded-xl text-[7.5px] font-black border transition-all cursor-pointer ${
                    noisyDataEnabled
                      ? 'bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-500/20'
                      : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {noisyDataEnabled ? "🔴 Matikan Noisy" : "⚠️ Tambah Noisy Data"}
                </button>
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
                <h4 className="font-black text-xs text-slate-800 flex items-center justify-center gap-1">🛡️ Lab Keamanan: Detektif Digital Cilik</h4>
                <p className="text-[8px] text-slate-400 font-extrabold leading-relaxed px-2">
                  Bab 2: Lindungi keamanan informasi pribadi dan kata sandimu dari ancaman internet!
                </p>
              </div>

              {detectiveStage === 0 ? (
                /* START SCREEN */
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-3xl text-center space-y-3">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2.5xl flex items-center justify-center text-3xl mx-auto shadow-inner">
                    🛡️
                  </div>
                  <h5 className="font-black text-[10px] text-slate-800">Ujian Detektif Keamanan Informasi</h5>
                  <p className="text-[8.5px] text-slate-500 font-semibold leading-relaxed">
                    Seseorang bernama "Mr. Shadow" mencoba menyamar untuk meminta sandi dan privasimu. Mampukah kamu melawannya?
                  </p>
                  <button
                    onClick={startDetectiveGame}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[9px] py-2 px-5 rounded-xl cursor-pointer active:scale-95 transition-all shadow-md shadow-indigo-500/20"
                  >
                    Mulai Misi Detektif 🚀
                  </button>
                </div>
              ) : (
                /* CHAT WINDOW INTERFACE */
                <div className="space-y-3">
                  <div className="h-44 bg-slate-900 rounded-2.5xl p-3 overflow-y-auto space-y-2 flex flex-col border border-slate-950 shadow-inner">
                    {detectiveLogs.map((log, i) => {
                      const isUser = log.sender === 'user';
                      return (
                        <div
                          key={i}
                          className={`max-w-[75%] p-2 rounded-2xl text-[8.5px] leading-relaxed font-bold ${
                            isUser
                              ? 'bg-emerald-500 text-white align-self-end self-end ml-auto rounded-tr-none'
                              : log.sender === 'shadow' && detectiveStage === 4
                              ? 'bg-rose-950/80 text-rose-200 border border-rose-800 self-start mr-auto rounded-tl-none'
                              : 'bg-slate-800 text-slate-200 self-start mr-auto rounded-tl-none'
                          }`}
                        >
                          <span className="text-[6.5px] opacity-60 block uppercase font-black mb-0.5">
                            {isUser ? 'Kamu' : 'Mr. Shadow 👤'}
                          </span>
                          {log.text}
                        </div>
                      );
                    })}
                  </div>

                  {/* ACTIVE CONTROLS PER STAGE */}
                  {detectiveStage === 1 && (
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => handleDetectiveOption(1, "Sandi saya 'bintang123'. Kasih tahu saja biar dapat Diamond gratis!", false)}
                        className="bg-slate-50 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-black text-[8.5px] p-2.5 rounded-xl border border-slate-200 text-left active:scale-98 transition-all"
                      >
                        🔴 A. Berikan kata sandi demi 1000 Diamond gratis 💎
                      </button>
                      <button
                        onClick={() => handleDetectiveOption(1, "Tolak! Saya tahu kata sandi adalah rahasia pribadi yang tidak boleh dibagikan!", true)}
                        className="bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-black text-[8.5px] p-2.5 rounded-xl border border-slate-200 text-left active:scale-98 transition-all"
                      >
                        🟢 B. Tolak dan jaga kerahasiaan kata sandi! 🛡️
                      </button>
                    </div>
                  )}

                  {detectiveStage === 2 && (
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => handleDetectiveOption(2, "Tolak! Alamat rumah dan nama sekolah adalah privasi sensitif. Saya tidak mau membagikannya!", true)}
                        className="bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-black text-[8.5px] p-2.5 rounded-xl border border-slate-200 text-left active:scale-98 transition-all"
                      >
                        🟢 A. Tolak! Alamat rumah dan sekolah adalah data pribadi rahasia 🏠
                      </button>
                      <button
                        onClick={() => handleDetectiveOption(2, "Nama sekolahku SD Harapan dan rumahku di Jalan Merpati Nomor 5. Tolong kirim robotnya ya!", false)}
                        className="bg-slate-50 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-black text-[8.5px] p-2.5 rounded-xl border border-slate-200 text-left active:scale-98 transition-all"
                      >
                        🔴 B. Berikan alamat lengkap agar dikirimkan mainan robot gratis 📍
                      </button>
                    </div>
                  )}

                  {detectiveStage === 3 && (
                    <div className="text-center p-2 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-2">
                      <span className="text-xl">🏆🥇</span>
                      <p className="text-[8.5px] text-emerald-800 font-black">Luar biasa! Kamu bersikap bijak dan berhasil mengamankan informasimu!</p>
                      <button
                        onClick={() => setDetectiveStage(0)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[8.5px] py-1.5 px-4 rounded-xl cursor-pointer"
                      >
                        Ulangi Ujian 🔄
                      </button>
                    </div>
                  )}

                  {detectiveStage === 4 && (
                    <div className="text-center p-2 bg-rose-50 border border-rose-100 rounded-2xl space-y-2 animate-pulse">
                      <span className="text-xl">⚠️🚨</span>
                      <p className="text-[8.5px] text-rose-800 font-black">Hati-hati! Penipu berhasil mencuri datamu. Ayo pelajari lagi.</p>
                      <button
                        onClick={startDetectiveGame}
                        className="bg-rose-500 hover:bg-rose-600 text-white font-black text-[8.5px] py-1.5 px-4 rounded-xl cursor-pointer"
                      >
                        Coba Lagi 🔄
                      </button>
                    </div>
                  )}
                </div>
              )}
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
      ) : (
        /* ============================================================== */
        /* SUB-MODE D: GAYA MODUL (DIGITAL BOOK) */
        /* ============================================================== */
        <div className="space-y-4 animate-fadeIn">
          <div className="bubbly-card p-5 rounded-3xl bg-[#fffbeb] border-2 border-amber-200 text-slate-800 space-y-4 shadow-md min-h-[320px] flex flex-col">
            <div className="flex justify-between items-center border-b border-amber-200 pb-2">
              <h4 className="font-black text-xs text-amber-800">📖 E-Book Interaktif Koding & AI</h4>
              <span className="text-[8.5px] font-black text-amber-600">Halaman {modulPage} dari 4</span>
            </div>

            {/* Book Pages */}
            <div className="flex-1 space-y-2.5 py-2">
              {modulPage === 1 && (
                <div className="space-y-2 animate-fadeIn text-left">
                  <h5 className="font-black text-xs text-slate-800">Bab 1: Mengenal Algoritma Koding</h5>
                  <p className="text-[9.5px] font-semibold text-slate-600 leading-relaxed">
                    Algoritma adalah urutan langkah-langkah logis untuk menyelesaikan suatu masalah. Saat menulis koding, kita memberi instruksi teratur agar komputer bergerak sesuai keinginan kita, seperti menuntun robot melewati labirin rintangan.
                  </p>
                  <div className="bg-amber-100/50 p-2.5 rounded-xl border border-amber-200 mt-2">
                    <span className="text-[8px] font-black text-amber-700 block uppercase">💡 Tips Robot Maze:</span>
                    <p className="text-[8px] font-bold text-slate-500">Urutan langkah (Maju, Kanan, Kiri) sangat penting. Salah satu langkah saja bisa membuat robot menabrak tembok rintangan!</p>
                  </div>
                </div>
              )}

              {modulPage === 2 && (
                <div className="space-y-2 animate-fadeIn text-left">
                  <h5 className="font-black text-xs text-slate-800">Bab 2: Menjaga Keamanan Data</h5>
                  <p className="text-[9.5px] font-semibold text-slate-600 leading-relaxed">
                    Keamanan data cilik berpusat pada perlindungan kata sandi (password) dan data pribadi sensitif seperti alamat rumah, nama sekolah, dan nomor telepon. Jangan pernah membagikan kunci rahasia ini demi iming-iming diamond game gratis!
                  </p>
                  <div className="bg-amber-100/50 p-2.5 rounded-xl border border-amber-200 mt-2">
                    <span className="text-[8px] font-black text-amber-700 block uppercase">🔑 Ingat Selalu:</span>
                    <p className="text-[8px] font-bold text-slate-500">Mr. Shadow di internet sering menyamar menjadi orang baik untuk membujukmu membocorkan kata sandimu.</p>
                  </div>
                </div>
              )}

              {modulPage === 3 && (
                <div className="space-y-2 animate-fadeIn text-left">
                  <h5 className="font-black text-xs text-slate-800">Bab 3: Klasifikasi & Pola AI</h5>
                  <p className="text-[9.5px] font-semibold text-slate-600 leading-relaxed">
                    Kecerdasan Buatan (AI) dilatih menggunakan kumpulan contoh data (Data Training). Model AI mencocokkan kemiripan pola gambar apel 🍎 atau jeruk 🍊 untuk bisa memilah jenis buah baru secara otomatis.
                  </p>
                  <div className="bg-amber-100/50 p-2.5 rounded-xl border border-amber-200 mt-2">
                    <span className="text-[8px] font-black text-amber-700 block uppercase">⚠️ Data Kotor:</span>
                    <p className="text-[8px] font-bold text-slate-500">Jika data latih yang dimasukkan salah atau kotor, tebakan model AI akan menurun akurasinya!</p>
                  </div>
                </div>
              )}

              {modulPage === 4 && (
                <div className="space-y-2 animate-fadeIn text-left">
                  <h5 className="font-black text-xs text-slate-800">📖 Glosarium & Istilah Penting</h5>
                  <div className="grid grid-cols-1 gap-2 text-[8.5px] font-bold text-slate-600">
                    <div><b>1. Algoritma:</b> Urutan instruksi logis untuk memecahkan masalah.</div>
                    <div><b>2. Data Training:</b> Contoh data (gambar/teks) untuk melatih kecerdasan AI.</div>
                    <div><b>3. Privasi:</b> Hak pribadi untuk menjaga data sensitif dari orang asing.</div>
                    <div><b>4. Debugging:</b> Proses mencari dan memperbaiki kesalahan pada baris kode.</div>
                  </div>
                </div>
              )}
            </div>

            {/* E-Book Navigation */}
            <div className="flex justify-between items-center bg-white/70 p-2 rounded-2xl border border-amber-200/60 shadow-sm">
              <button 
                onClick={() => { playTone(580, 'sine', 0.05); setModulPage(prev => Math.max(1, prev - 1)); }}
                disabled={modulPage === 1}
                className="bg-white hover:bg-slate-50 text-slate-600 px-3.5 py-1.5 rounded-xl text-[9px] font-black border border-slate-200 disabled:opacity-40"
              >
                &larr; Halaman Kiri
              </button>
              <button 
                onClick={() => { playTone(580, 'sine', 0.05); setModulPage(prev => Math.min(4, prev + 1)); }}
                disabled={modulPage === 4}
                className="bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-1.5 rounded-xl text-[9px] font-black border-b-3 border-amber-700 disabled:opacity-40"
              >
                Halaman Kanan &rarr;
              </button>
            </div>
          </div>

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
