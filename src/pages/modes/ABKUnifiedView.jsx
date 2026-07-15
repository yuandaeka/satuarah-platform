import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

// ============================================================
// TOPIC DATA (Curriculum-aligned from KKA_BS_KLS_5.pdf)
// ============================================================
const TOPICS = {
  koka: {
    name: "Algoritma & Misi Koka 🚶",
    badge: "Bab 1: Komputasional",
    slides: [
      { title: "1. Koding adalah Perintah 🚶", text: "Koding adalah menyusun langkah-langkah perintah untuk komputer. Seperti menyuruh robot Koka berjalan lurus ke bendera tanpa menabrak dinding!", emoji: "🤖" },
      { title: "2. Masalah Sehari-hari 🧩", text: "Berpikir komputasional membantu kita memecahkan masalah sehari-hari dengan menyusun langkah satu-demi-satu seperti resep masakan.", emoji: "🍳" },
      { title: "3. Kuis Misi Koka 🏆", text: "Pertanyaan: Apakah koding diatur dengan urutan langkah yang benar?", quiz: true, answers: [{ text: "Ya, Betul! 👍", correct: true }, { text: "Tidak 👎", correct: false }] }
    ],
    teori: [
      { title: "Apa itu Koding?", text: "Koding adalah memberi perintah tertulis ke komputer atau robot agar bergerak mengikuti keinginan kita." },
      { title: "Apa itu Algoritma?", text: "Algoritma adalah urutan langkah-langkah yang logis dan teratur untuk menyelesaikan suatu masalah." },
      { title: "Pertanyaan Cepat:", text: "Apakah urutan koding boleh acak-acakan?", quiz: true }
    ],
    teatrikal: "Di sebuah planet bernama Koka, hiduplah sebuah robot kecil berkilau. Bunyi klik, bip, dan dengung menyertai setiap gerakannya. Robot ini tidak bisa berpikir sendiri, ia menunggu bisikan instruksi berurutan darimu. Bisikanmu adalah koding, langkah berurutanmu adalah algoritma yang menuntunnya melewati labirin bintang."
  },
  privasi: {
    name: "Detektif Privasi & Sandi 🛡️",
    badge: "Bab 2: Keamanan Data",
    slides: [
      { title: "1. Rahasiakan Kata Sandi 🔑", text: "Kata sandi adalah kunci rahasia akunmu. Jangan pernah beritahukan password-mu kepada orang lain di internet agar aman!", emoji: "🔒" },
      { title: "2. Jaga Info Rumahmu 🏠", text: "Nama sekolah, alamat rumah lengkap, dan nomor handphone adalah data pribadi sensitif yang tidak boleh dibagikan sembarangan.", emoji: "📍" },
      { title: "3. Kuis Detektif Cilik 🏆", text: "Pertanyaan: Bolehkah kita membagikan password kepada orang asing yang menjanjikan diamond gratis?", quiz: true, answers: [{ text: "TIDAK BOLEH! 🛡️", correct: true }, { text: "Boleh 💎", correct: false }] }
    ],
    teori: [
      { title: "Pentingnya Privasi", text: "Informasi pribadi seperti password dan alamat rumah wajib dijaga kerahasiaannya agar tidak disalahgunakan orang jahat." },
      { title: "Mr. Shadow Penipu", text: "Di internet, ada penipu (seperti Mr. Shadow) yang pura-pura baik memberi hadiah gratis padahal ingin mencuri password-mu." },
      { title: "Pertanyaan Cepat:", text: "Apakah password boleh dibagikan kepada orang asing?", quiz: true }
    ],
    teatrikal: "Malam sunyi menyelimuti kota digital. Terdengar derap langkah kaki misterius. Mr. Shadow mengendap-endap di balik bayangan, menawarkan permata berkilauan gratis. 'Cukup beritahu kata sandimu,' bisiknya dengan suara serak bergema. Ingat detektif cilik, kuncimu adalah rahasiamu, lindungi ia dengan perisai keberanianmu."
  },
  ai: {
    name: "Klasifikasi Buah & Hewan 🧠",
    badge: "Bab 3 & 4: AI & Pola",
    slides: [
      { title: "1. Cara AI Mengenali Benda 📸", text: "AI adalah program pintar yang belajar dari contoh data. AI melihat banyak contoh buah 🍎 dan hewan 🐱 agar pintar membedakan benda baru!", emoji: "🧠" },
      { title: "2. Pengaruh Data Input ⚠️", text: "Jika kita memberi AI contoh gambar yang salah (data kotor), maka tebakan AI juga akan ikutan salah dan akurasinya menurun!", emoji: "📢" },
      { title: "3. Kuis AI & Klasifikasi 🏆", text: "Pertanyaan: Apakah data yang salah dapat membuat tebakan AI menjadi keliru?", quiz: true, answers: [{ text: "Ya, Betul! ⚠️", correct: true }, { text: "Tidak ❌", correct: false }] }
    ],
    teori: [
      { title: "Belajar Pola", text: "AI melatih otaknya dengan mencocokkan pola kemiripan gambar, suara, atau teks yang diberikan sebagai contoh." },
      { title: "Pengaruh Data Kotor", text: "Agar AI sangat pintar, data input yang dilatih harus bersih dari kesalahan agar hasil tebakannya akurat." },
      { title: "Pertanyaan Cepat:", text: "Apakah model AI perlu dilatih dengan data yang benar?", quiz: true }
    ],
    teatrikal: "Suara dengungan mesin raksasa terdengar dari laboratorium AI. Lampu-lampu indikator berkedip biru dan merah. Kamera sensor mulai memindai sebuah apel merah segar. Di dalam otaknya yang elektronik, jutaan data gambar apel dan jeruk saling mencocokkan diri, membentuk jaring ingatan cerdas kecerdasan buatan."
  }
};

export default function ABKUnifiedView({
  speakText,
  triggerBadgeMinting,
  setSelectedMode,
  adhdScore, adhdGameState, adhdCamReady, adhdCamError, adhdControlMode, setAdhdControlMode,
  adhdTimeLeft, adhdFailReason, feedbackToast, adhdFocusSound, toggleFocusSound,
  stopAdhdCamera, startAdhdCamera, adhdVideoRef, adhdOverlayCanvasRef, adhdGameCanvasRef,
  startGame, handleAdhdBoardMouseMove, handleAdhdBoardMouseDown, handleAdhdBoardMouseUp,
  handleAdhdBoardTouchMove, handleAdhdBoardTouchStart, handleAdhdBoardTouchEnd,
}) {
  const [activeTab, setActiveTab] = useState('visual');
  const [activeTopicKey, setActiveTopicKey] = useState('koka');

  const [visualMode, setVisualMode] = useState('kompleks');
  const [audioMode, setAudioMode] = useState('bimodal');
  const [useOpenDyslexic, setUseOpenDyslexic] = useState(false);
  const [letterSpacing, setLetterSpacing] = useState('normal');
  const [bgColor, setBgColor] = useState('white');

  const [visualSlide, setVisualSlide] = useState(0);
  const [teoriStage, setTeoriStage] = useState(0);
  const [audioSpeed, setAudioSpeed] = useState(1.0);
  const [isNarrating, setIsNarrating] = useState(false);

  const [activeWordIdx, setActiveWordIdx] = useState(-1);

  const [praktikGame, setPraktikGame] = useState(null);

  const [wordCount, setWordCount] = useState(36);
  const [sukuWord, setSukuWord] = useState({ prefix: '', suffix: 'ju', options: ['ba', 'bi', 'bu', 'be', 'bo'], correct: 'ba', target: 'baju', completed: false });
  const [bangunWord, setBangunWord] = useState({ target: 'kucing', letters: ['u', 'c', 'g', 'k', 'n', 'i'], currentLetters: [], completed: false });
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [storyReading, setStoryReading] = useState(false);
  const storyText = "Riko punya kelinci. Kelinci itu lucu. Riko memberi makan kelincinya setiap hari.";
  const storyWords = storyText.split(" ");
  const [magicBookWord, setMagicBookWord] = useState('pohon');
  const [rightPageUnlocked, setRightPageUnlocked] = useState(false);

  const [hardwareItems, setHardwareItems] = useState([
    { id: 'kbd', name: 'Keyboard ⌨️', category: 'input' },
    { id: 'mse', name: 'Mouse 🖱️', category: 'input' },
    { id: 'mon', name: 'Monitor 🖥️', category: 'output' },
    { id: 'prn', name: 'Printer 🖨️', category: 'output' },
  ]);
  const [hardwareSlots, setHardwareSlots] = useState({ input: [], output: [] });
  const [selectedHardware, setSelectedHardware] = useState(null);

  const [modulView, setModulView] = useState(null);
  const [focusTime, setFocusTime] = useState(300);
  const [focusRunning, setFocusRunning] = useState(false);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const spaceFacts = [
    "Di luar angkasa sangat sunyi karena tidak ada udara untuk merambatkan suara! 🧑‍🚀",
    "Satu hari di planet Venus lebih lama daripada satu tahun di Bumi! 🌟",
    "Matahari kita sangat besar sehingga 1,3 juta planet Bumi bisa muat di dalamnya! ☀️",
    "Gunung tertinggi di tata surya adalah Olympus Mons yang terletak di planet Mars! 🔴",
    "Jejak kaki para astronot di Bulan tidak akan hilang karena tidak ada angin di sana! 🌕"
  ];

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoIntervalRef = useRef(null);

  const activeTopic = TOPICS[activeTopicKey];

  const playSound = (freq = 400, duration = 0.15) => {
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(); osc.stop(ctx.currentTime + duration);
    }
  };

  useEffect(() => {
    if (activeTab === 'audio') {
      const textToSpeak = audioMode === 'bimodal' ? activeTopic.slides[visualSlide].text : activeTopic.teatrikal;
      setIsNarrating(true);
      speakText(textToSpeak, true, audioSpeed);
      if (audioMode === 'bimodal') {
        const words = textToSpeak.split(' ');
        let curWordIdx = 0;
        const intervalTime = (60 / (150 * audioSpeed)) * 1000;
        const highlightTimer = setInterval(() => {
          if (curWordIdx < words.length) { setActiveWordIdx(curWordIdx); curWordIdx++; }
          else { clearInterval(highlightTimer); setIsNarrating(false); setActiveWordIdx(-1); }
        }, intervalTime);
        return () => { clearInterval(highlightTimer); setIsNarrating(false); setActiveWordIdx(-1); };
      } else {
        const dur = (textToSpeak.split(' ').length / (130 * audioSpeed / 60)) * 1000 + 1000;
        const timer = setTimeout(() => setIsNarrating(false), dur);
        return () => clearTimeout(timer);
      }
    } else { setIsNarrating(false); setActiveWordIdx(-1); }
  }, [activeTab, visualSlide, audioSpeed, activeTopicKey, audioMode]);

  useEffect(() => {
    let timer = null;
    if (focusRunning && modulView === 'fokus') {
      timer = setInterval(() => {
        setFocusTime(prev => {
          if (prev <= 1) { clearInterval(timer); setFocusRunning(false); playSound(600, 0.4); confetti({ particleCount: 30, spread: 60 }); return 300; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [focusRunning, modulView]);

  useEffect(() => {
    if (isVideoPlaying && modulView === 'video') {
      videoIntervalRef.current = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) { setIsVideoPlaying(false); clearInterval(videoIntervalRef.current); confetti({ particleCount: 20, spread: 40 }); return 0; }
          return prev + 2;
        });
      }, 300);
    } else { if (videoIntervalRef.current) clearInterval(videoIntervalRef.current); }
    return () => { if (videoIntervalRef.current) clearInterval(videoIntervalRef.current); };
  }, [isVideoPlaying, modulView]);

  const handleQuizAnswer = (isCorrect) => {
    if (isCorrect) {
      playSound(523.25, 0.15); setTimeout(() => playSound(659.25, 0.25), 150);
      confetti(); speakText("Luar biasa! Jawabanmu benar sekali!", true, audioSpeed);
      triggerBadgeMinting('abk');
    } else { playSound(220, 0.3); speakText("Kurang tepat, ayo coba lagi ya!", true, audioSpeed); }
  };

  const handleAudioReplay = () => {
    playSound(600, 0.1);
    const textToSpeak = audioMode === 'bimodal' ? activeTopic.slides[visualSlide].text : activeTopic.teatrikal;
    setIsNarrating(true); speakText(textToSpeak, true, audioSpeed);
    if (audioMode === 'bimodal') {
      const words = textToSpeak.split(' ');
      let curWordIdx = 0;
      const intervalTime = (60 / (150 * audioSpeed)) * 1000;
      const highlightTimer = setInterval(() => {
        if (curWordIdx < words.length) { setActiveWordIdx(curWordIdx); curWordIdx++; }
        else { clearInterval(highlightTimer); setIsNarrating(false); setActiveWordIdx(-1); }
      }, intervalTime);
    } else {
      const dur = (textToSpeak.split(' ').length / (130 * audioSpeed / 60)) * 1000 + 1000;
      setTimeout(() => setIsNarrating(false), dur);
    }
  };

  const handleSukuClick = (opt) => {
    if (sukuWord.completed) return;
    playSound(580, 0.12);
    if (opt === sukuWord.correct) {
      setSukuWord(prev => ({ ...prev, prefix: opt, completed: true }));
      setWordCount(prev => Math.min(100, prev + 5));
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
      speakText("Hebat! Baju!");
    } else { speakText("Coba lagi ya."); }
  };

  const handleLetterClick = (letter) => {
    if (bangunWord.completed) return;
    playSound(580, 0.12);
    const nextIdx = bangunWord.currentLetters.length;
    const expected = bangunWord.target[nextIdx];
    if (letter === expected) {
      const newLetters = [...bangunWord.currentLetters, letter];
      const done = newLetters.length === bangunWord.target.length;
      setBangunWord(prev => ({ ...prev, currentLetters: newLetters, completed: done }));
      if (done) {
        setWordCount(prev => Math.min(100, prev + 8));
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
        speakText("Hebat! Kucing!");
      }
    } else { speakText("Huruf belum tepat, coba lagi."); }
  };

  const readEntireStory = () => {
    if (storyReading) { setStoryReading(false); setActiveWordIndex(-1); return; }
    setStoryReading(true);
    let currentWord = 0;
    const interval = setInterval(() => {
      if (currentWord >= storyWords.length) { clearInterval(interval); setStoryReading(false); setActiveWordIndex(-1); }
      else { setActiveWordIndex(currentWord); speakText(storyWords[currentWord].replace(/[.,]/g, '')); currentWord++; }
    }, 450);
  };

  const handleWordClick = (word, index) => { playSound(580, 0.12); setActiveWordIndex(index); speakText(word.replace(/[.,]/g, '')); };
  const handleMagicBookUnlock = () => {
    if (rightPageUnlocked) return;
    playSound(580, 0.12); setRightPageUnlocked(true);
    setWordCount(prev => Math.min(100, prev + 15));
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } }); speakText("Halaman buku terbuka!");
  };
  const resetSukuGame = () => setSukuWord({ prefix: '', suffix: 'ju', options: ['ba', 'bi', 'bu', 'be', 'bo'], correct: 'ba', target: 'baju', completed: false });
  const resetBangunGame = () => setBangunWord({ target: 'kucing', letters: ['u', 'c', 'g', 'k', 'n', 'i'], currentLetters: [], completed: false });

  const handleHardwareSelect = (item) => { playSound(480, 0.1); setSelectedHardware(item); };
  const handleSlotDrop = (slotType) => {
    if (!selectedHardware) return;
    playSound(520, 0.15);
    if (selectedHardware.category === slotType) {
      setHardwareSlots(prev => ({ ...prev, [slotType]: [...prev[slotType], selectedHardware] }));
      setHardwareItems(prev => prev.filter(it => it.id !== selectedHardware.id));
      confetti({ particleCount: 15, spread: 45 });
      speakText("Bagus! Penempatan tepat.");
    } else { speakText("Coba lagi ya, kategori perangkat belum sesuai."); }
    setSelectedHardware(null);
  };
  const resetHardwareGame = () => {
    playSound(440, 0.1);
    setHardwareItems([{ id: 'kbd', name: 'Keyboard ⌨️', category: 'input' }, { id: 'mse', name: 'Mouse 🖱️', category: 'input' }, { id: 'mon', name: 'Monitor 🖥️', category: 'output' }, { id: 'prn', name: 'Printer 🖨️', category: 'output' }]);
    setHardwareSlots({ input: [], output: [] }); setSelectedHardware(null);
  };

  const handleLaunchGame = (mode = 'mouse') => {
    playSound(520, 0.2);
    if (setAdhdControlMode) setAdhdControlMode(mode);
    if (mode === 'camera' && typeof startAdhdCamera === 'function') startAdhdCamera();
    else if (typeof stopAdhdCamera === 'function') stopAdhdCamera();
    setTimeout(() => { if (typeof startGame === 'function') startGame(); }, 150);
  };

  const getModulTextStyles = () => {
    let styles = {};
    if (useOpenDyslexic) { styles.fontFamily = '"Comic Sans MS", "Chalkboard SE", sans-serif'; styles.fontWeight = 'bold'; }
    if (letterSpacing === 'wide') styles.letterSpacing = '0.08em';
    if (letterSpacing === 'extra-wide') styles.letterSpacing = '0.15em';
    return styles;
  };
  const getModulBgClass = () => {
    if (bgColor === 'warm-cream') return 'bg-[#fffbeb] border-amber-200 text-amber-900';
    if (bgColor === 'cool-blue') return 'bg-[#f0f9ff] border-sky-200 text-sky-900';
    return 'bg-white border-slate-200 text-slate-800';
  };

  return (
    <div className="space-y-4 text-slate-800 p-1.5">
      <div className="flex justify-between items-center bg-white/90 backdrop-blur border border-slate-100 px-3.5 py-3 rounded-2.5xl shadow-sm">
        <button onClick={() => { playSound(440, 0.1); setSelectedMode(null); }} className="w-8 h-8 bg-white hover:bg-slate-100 !text-slate-600 border border-slate-200/80 rounded-full flex items-center justify-center text-xs font-black shadow-sm active:scale-95 transition-all cursor-pointer">&larr;</button>
        <span className="border bg-purple-100 border-purple-200 !text-purple-700 text-[8.5px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">🧩 Kelas Inspirasi ABK</span>
      </div>
      <div className="bg-white px-3.5 py-2.5 rounded-2.5xl border border-slate-100 shadow-sm flex items-center justify-between gap-3">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider flex-shrink-0">Materi:</span>
        <select value={activeTopicKey} onChange={(e) => { playSound(600, 0.05); setActiveTopicKey(e.target.value); setVisualSlide(0); setTeoriStage(0); }} className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[9px] font-black !text-slate-700 outline-none cursor-pointer">
          {Object.keys(TOPICS).map(key => <option key={key} value={key}>{TOPICS[key].name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-5 gap-1.5 bg-slate-200/60 p-1.5 rounded-3xl border border-slate-300/40 shadow-inner">
        {[
          { id: 'visual', label: '🎨 Visual', color: 'bg-emerald-500 text-white shadow-emerald-500/30' },
          { id: 'audio', label: '🔊 Audio', color: 'bg-indigo-500 text-white shadow-indigo-500/30' },
          { id: 'teori', label: '📖 Teori', color: 'bg-purple-500 text-white shadow-purple-500/30' },
          { id: 'praktik', label: '🕹️ Praktik', color: 'bg-pink-500 text-white shadow-pink-500/30' },
          { id: 'modul', label: '📚 Modul', color: 'bg-amber-500 text-white shadow-amber-500/30' }
        ].map(tab => (
          <button key={tab.id} onClick={() => { playSound(600, 0.08); setActiveTab(tab.id); setPraktikGame(null); setModulView(null); }} className={`py-3 rounded-2xl text-[8px] font-black transition-all cursor-pointer ${activeTab === tab.id ? `${tab.color} text-white shadow-lg scale-102` : 'bg-white hover:bg-slate-50 !text-slate-600 border border-slate-200 shadow-sm active:scale-95'}`}>{tab.label}</button>
        ))}
      </div>
      <div className="bg-slate-50/50 rounded-3.5xl border border-slate-200/50 p-1">
        {activeTab === 'visual' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex gap-2 justify-center bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
              {[ { id: 'kompleks', label: '📊 Visual Kompleks' }, { id: 'sederhana', label: '🌸 Kontras Lembut' }, { id: 'singkat', label: '📝 Singkat Padat' } ].map(opt => (
                <button key={opt.id} onClick={() => { playSound(480, 0.05); setVisualMode(opt.id); }} className={`px-3 py-1.5 rounded-xl text-[8px] font-black border transition-all ${visualMode === opt.id ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm' : 'bg-slate-50 border-slate-200 !text-slate-500'}`}>{opt.label}</button>
              ))}
            </div>
            <div className="bubbly-card p-5 rounded-3xl bg-white border-2 text-center space-y-4 shadow-md">
              {visualMode === 'kompleks' && (
                <div className="w-full h-36 bg-slate-900 rounded-2.5xl flex flex-col items-center justify-center p-3 shadow-inner border border-slate-800 space-y-2 animate-fadeIn">
                  {visualSlide === 2 ? (<><span className="text-4xl animate-bounce">🏆⭐</span><span className="text-[8.5px] font-black text-amber-400 uppercase tracking-wider">Tantangan Kuis</span></>) : (<><span className="text-4xl animate-float">{activeTopic.slides[visualSlide].emoji}</span><span className="text-[7.5px] text-emerald-400 font-black uppercase tracking-wider">{activeTopic.badge}</span><div className="flex gap-1 items-center mt-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="w-6 h-0.5 bg-slate-700"></span><span className="w-2 h-2 rounded-full bg-indigo-500"></span></div></>)}
                </div>
              )}
              {visualMode === 'sederhana' && (
                <div className="w-full h-36 bg-pink-50/50 rounded-2.5xl flex flex-col items-center justify-center p-3 border border-pink-100 space-y-2 animate-fadeIn"><span className="text-5xl opacity-80">{activeTopic.slides[visualSlide].emoji}</span><span className="text-[8.5px] text-pink-500 font-black uppercase tracking-wider">Tema Lembut</span></div>
              )}
              {visualMode === 'singkat' && (
                <div className="w-full min-h-[9rem] bg-amber-50/40 rounded-2.5xl flex flex-col justify-center p-4 border border-amber-200/60 text-left space-y-2 animate-fadeIn"><span className="text-xs font-black text-amber-700 border-b border-amber-200 pb-1 flex items-center gap-1.5"><span>💡 Inti Materi:</span></span><ul className="space-y-1.5 text-[9px] font-extrabold text-amber-900/90 list-disc list-inside"><li>Fokus materi: {activeTopic.slides[visualSlide].title}</li><li>{activeTopic.slides[visualSlide].text.substring(0, 70)}...</li><li>Selesaikan kuis untuk klaim badge.</li></ul></div>
              )}
              {visualMode !== 'singkat' && (<div className="space-y-1.5"><h4 className="font-black text-xs text-slate-800 leading-tight">{activeTopic.slides[visualSlide].title}</h4><p className="text-[9.5px] text-slate-500 font-extrabold leading-relaxed px-2">{activeTopic.slides[visualSlide].text}</p></div>)}
              {activeTopic.slides[visualSlide].quiz && (<div className="grid grid-cols-2 gap-3 pt-2">{activeTopic.slides[visualSlide].answers.map((ans, idx) => (<button key={idx} onClick={() => handleQuizAnswer(ans.correct)} className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[9.5px] py-3.5 px-4 rounded-xl cursor-pointer active:scale-95 transition-all shadow-md">{ans.text}</button>))}</div>)}
            </div>
            <div className="flex justify-between items-center bg-white p-2 rounded-2.5xl border border-slate-100 shadow-sm"><button onClick={() => { playSound(580, 0.05); setVisualSlide(p => Math.max(0, p - 1)); }} disabled={visualSlide === 0} className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-[9px] font-black border border-slate-200 disabled:opacity-40">Sebelumnya</button><span className="text-[9.5px] font-black text-slate-400">{visualSlide + 1} / 3</span><button onClick={() => { playSound(580, 0.05); setVisualSlide(p => Math.min(2, p + 1)); }} disabled={visualSlide === 2} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-[9px] font-black border-b-3 border-emerald-700 disabled:opacity-40">Berikutnya</button></div>
          </div>
        )}
        {activeTab === 'audio' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex gap-2 justify-center bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
              {[ { id: 'bimodal', label: '🔊 Audio + Visual (Disleksia)' }, { id: 'teatrikal', label: '🎭 Audio Teatrikal (Tunanetra)' } ].map(opt => (<button key={opt.id} onClick={() => { playSound(480, 0.05); setAudioMode(opt.id); }} className={`px-3.5 py-1.5 rounded-xl text-[8px] font-black border transition-all ${audioMode === opt.id ? 'bg-indigo-500 text-white border-indigo-600' : 'bg-slate-50 border-slate-200 !text-slate-500'}`}>{opt.label}</button>))}
            </div>
            <div className="bubbly-card p-5 rounded-3xl bg-white border-2 text-center space-y-4 shadow-md">
              <div className="w-full h-36 bg-slate-950 rounded-2.5xl flex flex-col items-center justify-center p-3 relative overflow-hidden border border-slate-800">
                <div className="flex items-center gap-1.5 h-12 justify-center">{[1,2,3,4,5,6,7,8,7,6,5,4,3,2,1].map((h, i) => (<div key={i} style={{ height: isNarrating ? `${h*4.5}px` : '4px', animationDelay: `${i*0.08}s` }} className={`w-1 rounded-full bg-gradient-to-t from-indigo-500 to-purple-400 transition-all duration-300 ${isNarrating ? 'animate-pulse' : ''}`}></div>))}</div>
                <span className="text-[7.5px] text-indigo-300 font-black uppercase tracking-widest mt-2 animate-pulse">{isNarrating ? '🔊 Sedang Membaca...' : '⏸️ Narasi Siap'}</span>
              </div>
              {audioMode === 'bimodal' ? (
                <div className="text-[10px] text-slate-600 font-extrabold leading-relaxed px-4 text-left border border-slate-100 p-3 rounded-2xl bg-slate-50">{activeTopic.slides[visualSlide].text.split(' ').map((word, index) => (<span key={index} className={`px-0.5 rounded transition-colors ${index === activeWordIdx ? 'bg-yellow-300 text-black' : ''}`}>{word}{' '}</span>))}</div>
              ) : (<p className="text-[10px] text-slate-600 font-extrabold leading-relaxed px-4 italic text-left border border-slate-100 p-3 rounded-2xl bg-indigo-50/40">"{activeTopic.teatrikal}"</p>)}
              <button onClick={handleAudioReplay} className="bg-indigo-600 hover:bg-indigo-700 text-white border-b-4 border-indigo-800 font-black text-[9.5px] py-3.5 px-6 rounded-2xl cursor-pointer transition-all shadow-md w-full max-w-[200px] mx-auto">🔊 Ulangi Suara</button>
              <div className="space-y-2 w-full"><span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Kecepatan:</span><div className="flex gap-2 justify-center">{[{ val: 0.75, label: '🐢 0.75x' }, { val: 1.0, label: '🚶 1.0x' }, { val: 1.25, label: '⚡ 1.25x' }].map(s => (<button key={s.val} onClick={() => { playSound(600, 0.05); setAudioSpeed(s.val); }} className={`px-3.5 py-2 rounded-xl text-[7.5px] font-black border transition-all cursor-pointer ${audioSpeed === s.val ? 'bg-indigo-50 border-indigo-300 !text-indigo-700' : 'bg-white border-slate-200 !text-slate-500'}`}>{s.label}</button>))}</div></div>
            </div>
            <div className="flex justify-between items-center bg-white p-2 rounded-2.5xl border border-slate-100 shadow-sm"><button onClick={() => { playSound(580, 0.05); setVisualSlide(p => Math.max(0, p - 1)); }} disabled={visualSlide === 0} className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-[9px] font-black border border-slate-200 disabled:opacity-40">Sebelumnya</button><span className="text-[9.5px] font-black text-slate-400">{visualSlide + 1} / 3</span><button onClick={() => { playSound(580, 0.05); setVisualSlide(p => Math.min(2, p + 1)); }} disabled={visualSlide === 2} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-[9px] font-black border-b-3 border-indigo-700 disabled:opacity-40">Berikutnya</button></div>
          </div>
        )}
        {activeTab === 'teori' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bubbly-card p-5 rounded-3xl bg-white border-2 text-center space-y-4 shadow-md">
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden"><div style={{ width: `${((teoriStage + 1) / 3) * 100}%` }} className="bg-purple-500 h-full transition-all duration-300"></div></div>
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2.5xl flex items-center justify-center text-3xl mx-auto shadow-inner border border-purple-100">📖</div>
              <div className="space-y-2 animate-fadeIn"><span className="bg-purple-100 !text-purple-800 text-[7px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">{activeTopic.badge}</span><h4 className="font-black text-xs text-slate-800 leading-tight">{activeTopic.teori[teoriStage].title}</h4><p className="text-[10px] text-slate-500 font-extrabold leading-relaxed px-2">{activeTopic.teori[teoriStage].text}</p>{activeTopic.teori[teoriStage].quiz && (<div className="grid grid-cols-2 gap-3 pt-2"><button onClick={() => handleQuizAnswer(activeTopicKey !== 'privasi')} className="bg-purple-500 hover:bg-purple-600 text-white font-black text-[9px] py-3 px-4 rounded-xl cursor-pointer shadow-md active:scale-95">Benar 👍</button><button onClick={() => handleQuizAnswer(activeTopicKey === 'privasi')} className="bg-slate-100 hover:bg-slate-200 !text-slate-600 font-black text-[9px] py-3 px-4 rounded-xl cursor-pointer active:scale-95">Tidak 👎</button></div>)}</div>
            </div>
            <div className="flex justify-between items-center bg-white p-2 rounded-2.5xl border border-slate-100 shadow-sm"><button onClick={() => { playSound(580, 0.05); setTeoriStage(p => Math.max(0, p - 1)); }} disabled={teoriStage === 0} className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-[9px] font-black border border-slate-200 disabled:opacity-40">Sebelumnya</button><span className="text-[9.5px] font-black text-slate-400">{teoriStage + 1} / 3</span><button onClick={() => { playSound(580, 0.05); setTeoriStage(p => Math.min(2, p + 1)); }} disabled={teoriStage === 2} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2.5 rounded-xl text-[9px] font-black border-b-3 border-purple-700 disabled:opacity-40">Berikutnya</button></div>
          </div>
        )}
        {activeTab === 'praktik' && (
          <div className="space-y-4 animate-fadeIn">
            {!praktikGame ? (
              <div className="bubbly-card p-5 rounded-3xl bg-white border-2 space-y-4 shadow-md">
                <div className="text-center space-y-1"><h4 className="font-black text-xs text-slate-800">🕹️ Pilih Aktivitas Praktik</h4><p className="text-[8px] text-slate-400 font-extrabold">Semua game ini dirancang inklusif untuk semua kebutuhan belajar.</p></div>
                <div className="grid grid-cols-2 gap-3">
                  {[ { id: 'adhd', icon: '🎮', name: 'Planet Fokus', desc: 'Sorting Planet AI', color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400' }, { id: 'hardware-match', icon: '⚡', name: 'Hardware Match', desc: 'Pinch & Drop Perangkat', color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400' }, { id: 'disleksia-suku', icon: '🧩', name: 'Suku Kata', desc: 'Gabungkan suku kata', color: 'bg-purple-50 border-purple-200 hover:border-purple-400' }, { id: 'disleksia-bangun', icon: '🔠', name: 'Huruf Fun', desc: 'Susun huruf jadi kata', color: 'bg-pink-50 border-pink-200 hover:border-pink-400' } ].map(g => (<button key={g.id} onClick={() => { playSound(520, 0.15); setPraktikGame(g.id); }} className={`p-4 rounded-2.5xl border-2 text-center space-y-1.5 cursor-pointer active:scale-95 transition-all ${g.color}`}><span className="text-2xl block">{g.icon}</span><h5 className="font-black text-[9px] text-slate-800">{g.name}</h5><p className="text-[7px] text-slate-500 font-bold">{g.desc}</p></button>))}
                </div>
              </div>
            ) : praktikGame === 'adhd' ? (
              <div className="bg-slate-900 rounded-3xl p-3 border-2 border-emerald-500/30 shadow-xl space-y-3">
                <div className="flex justify-between items-center"><h4 className="font-black text-[10px] text-amber-400 uppercase">🪐 Sorting Planet</h4><button onClick={() => { if (stopAdhdCamera) stopAdhdCamera(); setPraktikGame(null); }} className="px-3 py-1 bg-rose-600 text-white font-black text-[8px] rounded-full">Kembali</button></div>
                <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-xl border border-emerald-500/20"><span className="text-[9px] font-black text-white">🚀 Jarak: <span className="text-emerald-400">{adhdScore * 10}m</span></span><span className="text-[9px] font-black text-white">⏱️ Waktu: <span className="text-emerald-400">{adhdTimeLeft}s</span></span></div>
                <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-2xl overflow-hidden border-2 border-emerald-500/40" id="game_bounds">
                  {adhdControlMode === 'camera' && (<div className="absolute top-1.5 right-1.5 w-20 aspect-[4/3] bg-black rounded-lg overflow-hidden border border-white z-50"><video ref={adhdVideoRef} className="hidden" playsInline muted /><canvas ref={adhdOverlayCanvasRef} width={320} height={240} className="w-full h-full transform scale-x-[-1] object-cover" /></div>)}
                  {feedbackToast && (<div className={`absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-white text-[8px] font-black z-50 shadow ${feedbackToast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}>{feedbackToast.text}</div>)}
                  <canvas ref={adhdGameCanvasRef} onMouseMove={handleAdhdBoardMouseMove} onMouseDown={handleAdhdBoardMouseDown} onMouseUp={handleAdhdBoardMouseUp} onMouseLeave={handleAdhdBoardMouseUp} onTouchMove={handleAdhdBoardTouchMove} onTouchStart={handleAdhdBoardTouchStart} onTouchEnd={handleAdhdBoardTouchEnd} className="w-full h-full block" />
                  {adhdGameState === 'start' && (<div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center text-center p-4 z-40"><h5 className="font-extrabold text-xs text-white">Misi Planet Bumi</h5><p className="text-[7.5px] text-slate-400 mt-1 max-w-[180px]">Cubit (Pinch) gelembung BUMI dan tempatkan tepat di orbit ketiga!</p><button className="px-4 py-1.5 bg-emerald-500 text-slate-950 text-[8.5px] font-black rounded-full mt-3 animate-bounce" onClick={startGame}>Mulai</button></div>)}
                  {adhdGameState === 'lost' && (<div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center text-center p-4 z-40"><h5 className="font-extrabold text-xs text-rose-500">Misi Gagal</h5><p className="text-[7.5px] text-slate-400 mt-1">{adhdFailReason}</p><button className="px-4 py-1.5 bg-blue-500 text-white text-[8.5px] font-black rounded-full mt-3" onClick={startGame}>Coba Lagi</button></div>)}
                  {adhdGameState === 'won' && (<div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center text-center p-4 z-40"><h5 className="font-extrabold text-xs text-emerald-500">Misi Selesai!</h5><button className="px-4 py-1.5 bg-emerald-500 text-slate-950 text-[8.5px] font-black rounded-full mt-3" onClick={() => setPraktikGame(null)}>Selesai ✓</button></div>)}
                </div>
                <div className="flex gap-2"><button onClick={() => handleLaunchGame('camera')} className={`flex-1 py-2 rounded-xl text-[8px] font-black border transition-all ${adhdControlMode === 'camera' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>📷 Kamera</button><button onClick={() => handleLaunchGame('mouse')} className={`flex-1 py-2 rounded-xl text-[8px] font-black border transition-all ${adhdControlMode === 'mouse' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>🖱️ Mouse</button></div>
              </div>
            ) : praktikGame === 'hardware-match' ? (
              <div className="bubbly-card p-5 rounded-3xl bg-white border-2 space-y-4 shadow-md">
                <div className="flex justify-between items-center border-b pb-2"><h4 className="font-black text-[10px] text-indigo-700">⚡ Pinch & Drop Perangkat Keras</h4><button onClick={() => setPraktikGame(null)} className="px-3 py-1 bg-rose-500 text-white font-black text-[8px] rounded-full">Kembali</button></div>
                <p className="text-[8px] font-bold text-slate-500 text-center">Ketuk perangkat di bawah, lalu ketuk box kategori penampungan yang tepat!</p>
                <div className="flex justify-center gap-2">{hardwareItems.map(item => (<button key={item.id} onClick={() => handleHardwareSelect(item)} className={`px-3 py-2 rounded-xl text-[9px] font-black border-2 border-b-4 transition-all cursor-pointer ${selectedHardware?.id === item.id ? 'bg-indigo-100 border-indigo-500' : 'bg-slate-50 border-slate-200'}`}>{item.name}</button>))} {hardwareItems.length === 0 && (<div className="text-center py-2 text-emerald-600 font-extrabold text-[10px]">🎉 Luar biasa! Semua perangkat telah dikelompokkan dengan benar.</div>)}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div onClick={() => handleSlotDrop('input')} className="border-2 border-dashed border-indigo-300 rounded-2xl p-4 bg-indigo-50/20 text-center cursor-pointer min-h-[90px] flex flex-col justify-center space-y-1.5"><span className="text-[10px] font-black text-indigo-700">📥 INPUT DEVICE</span><div className="flex flex-wrap gap-1 justify-center">{hardwareSlots.input.map(it => (<span key={it.id} className="bg-indigo-500 text-white px-2 py-0.5 rounded text-[8px] font-bold">{it.name}</span>))}</div></div>
                  <div onClick={() => handleSlotDrop('output')} className="border-2 border-dashed border-emerald-300 rounded-2xl p-4 bg-emerald-50/20 text-center cursor-pointer min-h-[90px] flex flex-col justify-center space-y-1.5"><span className="text-[10px] font-black text-emerald-700">📤 OUTPUT DEVICE</span><div className="flex flex-wrap gap-1 justify-center">{hardwareSlots.output.map(it => (<span key={it.id} className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[8px] font-bold">{it.name}</span>))}</div></div>
                </div>
                <button onClick={resetHardwareGame} className="w-full py-2 bg-slate-100 text-slate-600 font-black text-[9px] rounded-xl">Reset Game</button>
              </div>
            ) : praktikGame === 'disleksia-suku' ? (
              <div className="bubbly-card p-5 rounded-3xl bg-white border-2 space-y-4 shadow-md">
                <div className="flex justify-between items-center"><h4 className="font-black text-[10px] text-purple-700">🧩 Misi Suku Kata</h4><button onClick={() => setPraktikGame(null)} className="px-3 py-1 bg-rose-500 text-white font-black text-[8px] rounded-full">Kembali</button></div>
                <p className="text-[9px] font-bold text-slate-600 text-center">Gabungkan suku kata awal agar membentuk kata <b>"baju"</b>!</p>
                <div className="flex items-center justify-center gap-3 bg-purple-900 p-3 rounded-2xl"><span className={`text-xl font-black px-4 py-1.5 rounded-xl border-2 ${sukuWord.completed ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-purple-800/50 border-dashed border-purple-400 text-amber-400'}`}>{sukuWord.prefix || '?'}</span><span className="text-white font-black">-</span><span className="text-xl font-black px-4 py-1.5 rounded-xl bg-emerald-500 border-2 border-emerald-600 text-white">{sukuWord.suffix}</span><span className="text-xl">🚀</span></div>
                <div className="flex justify-center gap-2">{sukuWord.options.map((opt, i) => (<button key={i} onClick={() => handleSukuClick(opt)} className={`px-3 py-2 rounded-xl text-sm font-black border-2 border-b-4 cursor-pointer active:translate-y-0.5 transition-all ${sukuWord.completed && opt === sukuWord.correct ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-white border-purple-300 text-purple-700 hover:bg-purple-50'}`}>{opt}</button>))}</div>
                {sukuWord.completed && (<div className="text-center"><p className="text-[10px] text-emerald-600 font-extrabold mb-1">✓ Berhasil menyusun Baju!</p><button onClick={resetSukuGame} className="px-4 py-1 bg-purple-600 text-white font-bold text-[9px] rounded-lg">Main Lagi</button></div>)}
              </div>
            ) : praktikGame === 'disleksia-bangun' ? (
              <div className="bubbly-card p-5 rounded-3xl bg-white border-2 space-y-4 shadow-md">
                <div className="flex justify-between items-center"><h4 className="font-black text-[10px] text-pink-700">🔠 Misi Huruf Fun</h4><button onClick={() => setPraktikGame(null)} className="px-3 py-1 bg-rose-500 text-white font-black text-[8px] rounded-full">Kembali</button></div>
                <div className="flex items-center justify-center gap-2"><span className="text-3xl">🐱</span><span className="text-[9px] font-bold text-slate-500">Susun huruf: kucing!</span></div>
                <div className="flex justify-center gap-1.5">{Array.from({ length: bangunWord.target.length }).map((_, i) => (<div key={i} className="w-8 h-8 border-2 border-pink-300 bg-white rounded-lg flex items-center justify-center text-lg font-black text-slate-800" style={{ borderColor: bangunWord.completed ? '#10b981' : '#f9a8d4' }}>{bangunWord.currentLetters[i] || ''}</div>))}</div>
                <div className="flex justify-center gap-1.5 flex-wrap">{bangunWord.letters.map((letter, i) => (<button key={i} onClick={() => handleLetterClick(letter)} className="w-8 h-8 bg-white border-2 border-pink-400 border-b-4 rounded-lg flex items-center justify-center text-base font-black text-pink-600 cursor-pointer active:translate-y-0.5">{letter}</button>))}</div>
                {bangunWord.completed && (<div className="text-center"><p className="text-[9px] text-emerald-600 font-extrabold mb-1">✓ Selesai mengeja Kucing!</p><button onClick={resetBangunGame} className="px-4 py-1 bg-pink-600 text-white font-bold text-[9px] rounded-lg">Main Lagi</button></div>)}
              </div>
            ) : null}
          </div>
        )}
        {activeTab === 'modul' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white p-3.5 rounded-2.5xl border border-slate-100 shadow-sm space-y-2 text-left">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Pengaturan Adaptasi Bacaan (Disleksia & ADHD)</span>
              <div className="flex gap-2">
                <button onClick={() => setUseOpenDyslexic(!useOpenDyslexic)} className={`flex-1 py-1.5 rounded-xl text-[7.5px] font-black border transition-all cursor-pointer ${useOpenDyslexic ? 'bg-amber-500 text-white border-amber-600 shadow-sm' : 'bg-slate-50 border-slate-200 !text-slate-500'}`}>✍️ Font Dyslexic: {useOpenDyslexic ? 'AKTIF' : 'NON-AKTIF'}</button>
                <select value={letterSpacing} onChange={(e) => setLetterSpacing(e.target.value)} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[7.5px] font-black !text-slate-500 outline-none cursor-pointer"><option value="normal">↔️ Spasi Normal</option><option value="wide">↔️ Spasi Renggang</option><option value="extra-wide">↔️ Spasi Sangat Renggang</option></select>
                <select value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[7.5px] font-black !text-slate-500 outline-none cursor-pointer"><option value="white">🎨 Bg Putih</option><option value="warm-cream">🎨 Bg Warm Cream</option><option value="cool-blue">🎨 Bg Cool Blue</option></select>
              </div>
            </div>
            {!modulView ? (
              <div className="bubbly-card p-5 rounded-3xl bg-white border-2 space-y-4 shadow-md">
                <div className="text-center space-y-1"><h4 className="font-black text-xs text-slate-800">📚 Pilih Modul Belajar</h4><p className="text-[8px] text-slate-400 font-extrabold">Konten multimedia dan bacaan interaktif.</p></div>
                <div className="grid grid-cols-2 gap-3">{[ { id: 'video', icon: '🎬', name: 'Video Pendek', desc: 'Animasi tata surya 2-3 menit', color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400' }, { id: 'fokus', icon: '⏱️', name: 'Misi Fokus 5 Menit', desc: 'Timer belajar + fakta seru', color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400' }, { id: 'baca', icon: '🎧', name: 'Audio Land', desc: 'Baca cerita interaktif', color: 'bg-purple-50 border-purple-200 hover:border-purple-400' }, { id: 'buku', icon: '🏰', name: 'Buku Ajaib', desc: 'Buka kunci halaman rahasia', color: 'bg-amber-50 border-amber-200 hover:border-amber-400' } ].map(m => (<button key={m.id} onClick={() => { playSound(520, 0.15); setModulView(m.id); }} className={`p-4 rounded-2.5xl border-2 text-center space-y-1.5 cursor-pointer active:scale-95 transition-all ${m.color}`}><span className="text-2xl block">{m.icon}</span><h5 className="font-black text-[9px] text-slate-800">{m.name}</h5><p className="text-[7px] text-slate-500 font-bold">{m.desc}</p></button>))}</div>
              </div>
            ) : modulView === 'video' ? (
              <div className="bubbly-card p-5 rounded-3xl bg-white border-2 space-y-4 shadow-md"><div className="flex justify-between items-center"><h4 className="font-black text-[10px] text-indigo-700">🎬 Video Pendek: Tata Surya</h4><button onClick={() => { setIsVideoPlaying(false); setModulView(null); }} className="px-3 py-1 bg-rose-500 text-white font-black text-[8px] rounded-full">Kembali</button></div><div className="w-full aspect-video bg-slate-900 rounded-2xl relative flex items-center justify-center overflow-hidden border border-slate-700"><div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40"><div className="w-16 h-16 border border-dashed border-emerald-500/30 rounded-full animate-spin" style={{ animationDuration: '6s' }}></div><span className="absolute text-yellow-500 text-lg">☀️</span></div>{!isVideoPlaying && videoProgress === 0 && (<button onClick={() => { playSound(600, 0.25); setIsVideoPlaying(true); }} className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-lg font-black shadow-lg z-10 cursor-pointer active:scale-90">▶️</button>)}{isVideoPlaying && (<div className="absolute bottom-2 left-2 right-2 bg-slate-950/70 p-1.5 rounded-lg"><p className="text-[8px] font-black text-amber-400 text-center">{videoProgress < 30 && "Merkurius & Venus berada paling dekat dengan Matahari..."}{videoProgress >= 30 && videoProgress < 60 && "Bumi adalah satu-satunya planet yang memiliki kehidupan..."}{videoProgress >= 60 && videoProgress < 90 && "Mars berwarna merah karena tanahnya banyak besi..."}{videoProgress >= 90 && "Jupiter adalah raksasa gas terbesar!"}</p></div>)}</div><div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${videoProgress}%` }}></div></div><button onClick={() => setIsVideoPlaying(!isVideoPlaying)} className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-black text-[9px] rounded-xl cursor-pointer">{isVideoPlaying ? '⏸️ Jeda' : '▶️ Putar Video'}</button></div>
            ) : modulView === 'fokus' ? (
              <div className="bubbly-card p-5 rounded-3xl bg-white border-2 space-y-4 shadow-md"><div className="flex justify-between items-center"><h4 className="font-black text-[10px] text-emerald-700">⏱️ Misi Fokus 5 Menit</h4><button onClick={() => { setFocusRunning(false); setModulView(null); }} className="px-3 py-1 bg-rose-500 text-white font-black text-[8px] rounded-full">Kembali</button></div><p className="text-[8px] text-slate-500 font-bold text-center">Nyalakan timer dan baca fakta seru sambil berkonsentrasi!</p><div className="flex items-center justify-center"><div className="w-28 h-28 rounded-full border-4 border-dashed border-emerald-400 flex items-center justify-center" style={{ animation: focusRunning ? 'spin 20s linear infinite' : 'none' }}><div className="text-center" style={{ animation: focusRunning ? 'spin 20s linear infinite reverse' : 'none' }}><h3 className="text-2xl font-black text-slate-800">{Math.floor(focusTime / 60)}:{(focusTime % 60).toString().padStart(2, '0')}</h3><span className="text-[7px] uppercase tracking-widest text-emerald-600 font-black">Fokus</span></div></div></div><div className="flex gap-2"><button onClick={() => { playSound(520, 0.2); setFocusRunning(!focusRunning); }} className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[9px] rounded-xl cursor-pointer">{focusRunning ? '⏸️ Pause' : '▶️ Mulai Timer'}</button><button onClick={() => { playSound(440, 0.1); setFocusTime(300); setFocusRunning(false); }} className="px-4 py-2.5 bg-slate-100 text-slate-600 font-black text-[9px] rounded-xl">Reset</button></div><div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center"><span className="text-[7px] text-emerald-600 font-bold uppercase tracking-wider">Fakta #{currentFactIndex + 1}</span><p className="text-[9px] font-bold text-slate-700 mt-1">{spaceFacts[currentFactIndex]}</p><button onClick={() => { playSound(480, 0.1); setCurrentFactIndex(p => (p + 1) % spaceFacts.length); }} className="mt-2 text-[7px] font-black text-emerald-600 hover:underline cursor-pointer">Fakta Selanjutnya ➡️</button></div></div>
            ) : modulView === 'baca' ? (
              <div className={`bubbly-card p-5 rounded-3xl border-2 space-y-4 shadow-md ${getModulBgClass()}`}><div className="flex justify-between items-center border-b pb-2"><h4 className="font-black text-[10px] text-purple-700">🎧 Audio Land</h4><button onClick={() => setModulView(null)} className="px-3 py-1 bg-rose-500 text-white font-black text-[8px] rounded-full">Kembali</button></div><p className="text-[8px] font-bold text-blue-700 bg-blue-50 p-2 rounded-xl">🐰 Ketuk kata di bawah untuk mendengarkan suaranya!</p><div style={getModulTextStyles()} className="border-2 border-purple-200 rounded-2xl p-3 text-base leading-[2.2] font-extrabold min-h-[80px] text-left transition-all">{storyWords.map((word, i) => (<span key={i} onClick={() => handleWordClick(word, i)} className={`cursor-pointer px-0.5 rounded ${i === activeWordIndex ? 'bg-yellow-200 text-black' : ''}`}>{word}{' '}</span>))}</div><button onClick={readEntireStory} className="w-full py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-black text-[9px] rounded-xl cursor-pointer border-b-3 border-purple-700">{storyReading ? '⏹️ Stop' : '🔊 Dengarkan Cerita'}</button></div>
            ) : modulView === 'buku' ? (
              <div className={`bubbly-card p-5 rounded-3xl border-2 space-y-4 shadow-md ${getModulBgClass()}`}><div className="flex justify-between items-center border-b pb-2"><h4 className="font-black text-[10px] text-amber-700">🏰 Buku Ajaib</h4><button onClick={() => setModulView(null)} className="px-3 py-1 bg-rose-500 text-white font-black text-[8px] rounded-full">Kembali</button></div><div className="grid grid-cols-2 gap-2 bg-amber-100/25 border-2 border-amber-300/60 rounded-2xl p-3 h-28"><div className="flex flex-col items-center justify-center border-r border-dashed border-amber-300"><span style={getModulTextStyles()} className="text-sm font-black capitalize">{magicBookWord}</span><span className="text-3xl">{magicBookWord === 'kucing' && '🐱'}{magicBookWord === 'buku' && '📚'}{magicBookWord === 'pohon' && '🌳'}{magicBookWord === 'makan' && '🍛'}{magicBookWord === 'bola' && '⚽'}{magicBookWord === 'susu' && '🥛'}{magicBookWord === 'rumah' && '🏠'}{magicBookWord === 'ikan' && '🐟'}</span><span className="text-emerald-500 font-extrabold text-[8px]">✓ Terdaftar</span></div><div className="flex flex-col items-center justify-center bg-amber-100/40 rounded-xl">{rightPageUnlocked ? (<><span style={getModulTextStyles()} className="text-sm font-black text-purple-700 capitalize">{magicBookWord}</span><span className="text-2xl animate-float">✨</span><span className="text-[7px] text-purple-500 font-black">Terbuka!</span></>) : (<><span className="text-xl">🔒</span><button onClick={handleMagicBookUnlock} className="mt-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[8px] rounded-full active:scale-95">Buka Kunci</button></>)}</div></div>{rightPageUnlocked ? (<div className="bg-purple-900 rounded-2xl p-3 text-center text-white"><h4 className="font-extrabold text-[9px] text-yellow-300">Selamat!</h4><p className="text-[8px] text-purple-100">Buku Ajaibmu telah meluas: {wordCount} halaman!</p><button onClick={() => { confetti({ particleCount: 30, spread: 50 }); setWordCount(p => Math.min(100, p + 10)); setRightPageUnlocked(false); speakText("Kerja bagus!"); }} className="mt-1 px-4 py-1 bg-amber-400 text-slate-900 font-black text-[8px] rounded-full">Lanjut Halaman Baru</button></div>) : (<div className="p-2 bg-purple-50/50 rounded-xl border border-purple-100/60 flex items-center gap-2"><span className="text-base">💡</span><p className="text-[7px] text-purple-800 font-semibold">Pilih kata baru di Kata Quest (tab Praktik) terlebih dahulu!</p></div>)}<div className="flex justify-between items-center bg-slate-50/55 p-2 rounded-xl border border-slate-100"><span className="text-[8px] font-black text-amber-600">Buku Ajaib: {wordCount} / 100</span><div className="w-1/2 h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${wordCount}%` }}></div></div></div></div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
