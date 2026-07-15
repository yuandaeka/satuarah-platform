import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playTone } from '../../utils/audio';

const TOPICS = {
  koka: {
    name: "Algoritma & Misi Koka 🚶",
    badge: "Bab 1: Komputasional",
    badgeColor: "bg-emerald-100 border-emerald-200 !text-emerald-700",
    slides: [
      {
        title: "1. Koding adalah Perintah 🚶",
        text: "Koding adalah menyusun langkah-langkah perintah untuk komputer. Seperti menyuruh robot Koka berjalan lurus ke bendera tanpa menabrak dinding!",
        emoji: "🤖",
        type: "flowchart"
      },
      {
        title: "2. Masalah Sehari-hari 🧩",
        text: "Berpikir komputasional membantu kita memecahkan masalah sehari-hari dengan menyusun langkah satu-demi-satu seperti resep masakan.",
        emoji: "🍳",
        type: "cooking"
      },
      {
        title: "3. Kuis Misi Koka 🏆",
        text: "Pertanyaan: Apakah koding diatur dengan urutan langkah yang benar?",
        quiz: true,
        answers: [
          { text: "Ya, Betul! 👍", correct: true },
          { text: "Tidak 👎", correct: false }
        ]
      }
    ],
    teori: [
      {
        title: "Apa itu Koding?",
        text: "Koding adalah memberi perintah tertulis ke komputer atau robot agar bergerak mengikuti keinginan kita."
      },
      {
        title: "Apa itu Algoritma?",
        text: "Algoritma adalah urutan langkah-langkah yang logis dan teratur untuk menyelesaikan suatu masalah."
      },
      {
        title: "Pertanyaan Cepat:",
        text: "Apakah urutan koding boleh acak-acakan?",
        quiz: true
      }
    ]
  },
  privasi: {
    name: "Detektif Privasi & Sandi 🛡️",
    badge: "Bab 2: Keamanan Data",
    badgeColor: "bg-indigo-100 border-indigo-200 !text-indigo-700",
    slides: [
      {
        title: "1. Rahasiakan Kata Sandi 🔑",
        text: "Kata sandi adalah kunci rahasia akunmu. Jangan pernah beritahukan password-mu kepada orang lain di internet agar aman!",
        emoji: "🔒",
        type: "password"
      },
      {
        title: "2. Jaga Info Rumahmu 🏠",
        text: "Nama sekolah, alamat rumah lengkap, dan nomor handphone adalah data pribadi sensitif yang tidak boleh dibagikan sembarangan.",
        emoji: "📍",
        type: "address"
      },
      {
        title: "3. Kuis Detektif Cilik 🏆",
        text: "Pertanyaan: Bolehkah kita membagikan password kepada orang asing yang menjanjikan diamond gratis?",
        quiz: true,
        answers: [
          { text: "TIDAK BOLEH! 🛡️", correct: true },
          { text: "Boleh 💎", correct: false }
        ]
      }
    ],
    teori: [
      {
        title: "Pentingnya Privasi",
        text: "Informasi pribadi seperti password dan alamat rumah wajib dijaga kerahasiaannya agar tidak disalahgunakan orang jahat."
      },
      {
        title: "Mr. Shadow Penipu",
        text: "Di internet, ada penipu (seperti Mr. Shadow) yang pura-pura baik memberi hadiah gratis padahal ingin mencuri password-mu."
      },
      {
        title: "Pertanyaan Cepat:",
        text: "Apakah password boleh dibagikan kepada orang asing?",
        quiz: true
      }
    ]
  },
  ai: {
    name: "Klasifikasi Buah & Hewan 🧠",
    badge: "Bab 3 & 4: AI & Pola",
    badgeColor: "bg-purple-100 border-purple-200 !text-purple-700",
    slides: [
      {
        title: "1. Cara AI Mengenali Benda 📸",
        text: "AI adalah program pintar yang belajar dari contoh data. AI melihat banyak contoh buah 🍎 dan hewan 🐱 agar pintar membedakan benda baru!",
        emoji: "🧠",
        type: "classification"
      },
      {
        title: "2. Pengaruh Data Input ⚠️",
        text: "Jika kita memberi AI contoh gambar yang salah (data kotor), maka tebakan AI juga akan ikutan salah dan akurasinya menurun!",
        emoji: "📢",
        type: "noisy"
      },
      {
        title: "3. Kuis AI & Klasifikasi 🏆",
        text: "Pertanyaan: Apakah data yang salah dapat membuat tebakan AI menjadi keliru?",
        quiz: true,
        answers: [
          { text: "Ya, Betul! ⚠️", correct: true },
          { text: "Tidak ❌", correct: false }
        ]
      }
    ],
    teori: [
      {
        title: "Belajar Pola",
        text: "AI melatih otaknya dengan mencocokkan pola kemiripan gambar, suara, atau teks yang diberikan sebagai contoh."
      },
      {
        title: "Pengaruh Data Kotor",
        text: "Agar AI sangat pintar, data input yang dilatih harus bersih dari kesalahan agar hasil tebakannya akurat."
      },
      {
        title: "Pertanyaan Cepat:",
        text: "Apakah model AI perlu dilatih dengan data yang benar?",
        quiz: true
      }
    ]
  }
};

export default function ABKAdaptiveView({
  modeName,
  speakText,
  triggerBadgeMinting,
  setSelectedMode,
  renderPraktik,
}) {
  // Determine default recommended tab by AI based on adaptive needs
  const getAIRecommendation = () => {
    switch (modeName.toLowerCase()) {
      case 'adhd':
        return {
          tab: 'praktik',
          msg: '🤖 AI Adaptif: Berdasarkan profil belajar ADHD-mu, aku merekomendasikan Gaya Praktik (Game sensorik fokus) atau Gaya Teori bertahap untuk menjaga fokus belajarmu!'
        };
      case 'tunarungu':
        return {
          tab: 'visual',
          msg: '🤖 AI Adaptif: Berdasarkan profil belajar Tunarungu-mu, aku merekomendasikan Gaya Visual dengan ilustrasi gambar komik & subtitle teks yang sangat jelas!'
        };
      case 'tunanetra':
        return {
          tab: 'audio',
          msg: '🤖 AI Adaptif: Berdasarkan profil belajar Tunanetra-mu, aku menyarankan Gaya Audio dengan narasi suara otomatis, tombol ulangi besar, dan speed control.'
        };
      case 'disleksia':
        return {
          tab: 'teori',
          msg: '🤖 AI Adaptif: Berdasarkan profil belajar Disleksia-mu, aku menyarankan Gaya Teori bertahap dengan font khusus OpenDyslexic yang mudah dibaca!'
        };
      default:
        return { tab: 'teori', msg: '🤖 AI Adaptif menyarankan kamu mencoba gaya belajar di bawah ini!' };
    }
  };

  const recommendation = getAIRecommendation();
  const [activeTab, setActiveTab] = useState(recommendation.tab);
  
  // Topic state: 'koka' | 'privasi' | 'ai'
  const [activeTopicKey, setActiveTopicKey] = useState('koka');

  // Audio Speed Rate (0.75, 1.0, 1.25)
  const [audioSpeed, setAudioSpeed] = useState(1.0);
  const [visualSlide, setVisualSlide] = useState(0);
  const [teoriStage, setTeoriStage] = useState(0);
  const [isNarrating, setIsNarrating] = useState(false);

  const activeTopic = TOPICS[activeTopicKey];

  // Auto narrate on Audio mode select or change slide
  useEffect(() => {
    if (activeTab === 'audio') {
      const textToSpeak = getAudioTextForStage(visualSlide);
      setIsNarrating(true);
      speakText(textToSpeak, true, audioSpeed);
      
      const wordCount = textToSpeak.split(' ').length;
      const durationMs = (wordCount / (150 * audioSpeed / 60)) * 1000 + 1000;
      const timer = setTimeout(() => setIsNarrating(false), durationMs);
      return () => clearTimeout(timer);
    } else {
      setIsNarrating(false);
    }
  }, [activeTab, visualSlide, audioSpeed, activeTopicKey]);

  const getAudioTextForStage = (slideIdx) => {
    const slide = activeTopic.slides[slideIdx];
    if (slide.quiz) {
      return `${slide.title}. ${slide.text}. Jawab pertanyaan dengan mengklik tombol di layar.`;
    }
    return `${slide.title}. ${slide.text}. Klik tombol berikutnya untuk melanjutkan.`;
  };

  const handleAudioReplay = () => {
    playTone(600, 'sine', 0.1);
    const textToSpeak = getAudioTextForStage(visualSlide);
    setIsNarrating(true);
    speakText(textToSpeak, true, audioSpeed);
    
    const wordCount = textToSpeak.split(' ').length;
    const durationMs = (wordCount / (150 * audioSpeed / 60)) * 1000 + 1000;
    setTimeout(() => setIsNarrating(false), durationMs);
  };

  const handleQuizAnswer = (isCorrect) => {
    if (isCorrect) {
      playTone(523.25, 'sine', 0.15);
      setTimeout(() => playTone(659.25, 'sine', 0.25), 150);
      confetti();
      speakText("Luar biasa! Jawabanmu benar sekali!", true, audioSpeed);
      triggerBadgeMinting(modeName.toLowerCase());
    } else {
      playTone(220, 'triangle', 0.3);
      speakText("Kurang tepat, ayo coba lagi ya!", true, audioSpeed);
    }
  };

  // Helper colors for headers
  const getBadgeStyles = () => {
    switch (modeName.toLowerCase()) {
      case 'adhd':
        return 'bg-pink-100 border-pink-200 !text-pink-700';
      case 'tunarungu':
        return 'bg-sky-100 border-sky-200 !text-sky-700';
      case 'tunanetra':
        return 'bg-yellow-100 border-yellow-200 !text-yellow-700';
      case 'disleksia':
        return 'bg-teal-100 border-teal-200 !text-teal-700';
      default:
        return 'bg-slate-100 border-slate-200 !text-slate-700';
    }
  };

  return (
    <div className="space-y-4 text-slate-800 p-1.5">
      {/* 1. PREMIUM HEADER WITH GLASS DESIGN */}
      <div className="flex justify-between items-center bg-white/90 backdrop-blur border border-slate-100 px-3.5 py-3 rounded-2.5xl shadow-sm">
        <button 
          onClick={() => { playTone(440, 'sine', 0.1); setSelectedMode(null); }}
          className="w-8 h-8 bg-white hover:bg-slate-100 !text-slate-600 border border-slate-200/80 rounded-full flex items-center justify-center text-xs font-black shadow-sm active:scale-90 transition-all cursor-pointer"
        >
          &larr;
        </button>
        <span className={`border text-[8.5px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm ${getBadgeStyles()}`}>
          🏫 {modeName} Classroom
        </span>
      </div>

      {/* TOPIC SELECTOR DROPDOWN */}
      <div className="bg-white px-3.5 py-2.5 rounded-2.5xl border border-slate-100 shadow-sm flex items-center justify-between gap-3">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider flex-shrink-0">Materi Belajar:</span>
        <select
          value={activeTopicKey}
          onChange={(e) => { 
            playTone(600, 'sine', 0.05); 
            setActiveTopicKey(e.target.value); 
            setVisualSlide(0);
            setTeoriStage(0);
          }}
          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[9px] font-black !text-slate-700 outline-none cursor-pointer"
        >
          {Object.keys(TOPICS).map(key => (
            <option key={key} value={key}>{TOPICS[key].name}</option>
          ))}
        </select>
      </div>

      {/* 2. GLASSMORPHIC AI ADAPTIVE ADVISOR BANNER */}
      <div className="bg-white/95 backdrop-blur border-2 border-purple-200/70 rounded-3xl p-4 flex items-start gap-3 shadow-md relative overflow-hidden group">
        <div className="absolute right-0 bottom-0 text-7xl opacity-5 select-none font-bold">AI</div>
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-2xl shadow-md animate-float flex-shrink-0">
          🤖
        </div>
        <div className="space-y-1">
          <span className="text-[8px] font-black !text-purple-700 uppercase tracking-widest block">AI Adaptif Advisor</span>
          <p className="text-[10px] !text-slate-700 font-extrabold leading-relaxed">{recommendation.msg}</p>
        </div>
      </div>

      {/* 3. PREMIUM TABS SELECTOR */}
      <div className="grid grid-cols-4 gap-2 bg-slate-200/60 p-1.5 rounded-3xl border border-slate-300/40 shadow-inner">
        {[
          { id: 'visual', label: '🎨 Visual', color: 'bg-emerald-500 text-white shadow-emerald-500/30' },
          { id: 'audio', label: '🔊 Audio', color: 'bg-indigo-500 text-white shadow-indigo-500/30' },
          { id: 'teori', label: '📖 Teori', color: 'bg-purple-500 text-white shadow-purple-500/30' },
          { id: 'praktik', label: '🕹️ Praktik', color: 'bg-pink-500 text-white shadow-pink-500/30' }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { 
                playTone(600, 'sine', 0.08); 
                setActiveTab(tab.id); 
                if (tab.id !== 'audio') speakText(""); 
              }}
              className={`py-3.5 rounded-2xl text-[9px] font-black transition-all cursor-pointer ${
                isActive 
                  ? `${tab.color} text-white shadow-lg scale-102 scale-y-102` 
                  : 'bg-white hover:bg-slate-50 !text-slate-600 border border-slate-200 shadow-sm active:scale-95'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. MODAL CONTENT CONTAINER */}
      <div className="bg-slate-50/50 rounded-3.5xl border border-slate-200/50 p-1">
        {/* ============================================================== */}
        {/* 1. VISUAL MODALITY */}
        {/* ============================================================== */}
        {activeTab === 'visual' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bubbly-card p-5 rounded-3xl bg-white border-2 text-center space-y-4 shadow-md">
              {/* Visual illustration diagrams */}
              {activeTopicKey === 'koka' && visualSlide === 0 && (
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

              {activeTopicKey === 'koka' && visualSlide === 1 && (
                <div className="w-full h-36 bg-slate-900 rounded-2.5xl flex flex-col items-center justify-center p-3 shadow-inner border border-slate-800 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-3xl">🧩🍳</span>
                    <span className="text-xs text-indigo-400 font-black">➔</span>
                    <span className="text-3xl">🍲🍱</span>
                  </div>
                  <span className="text-[7.5px] text-slate-400 font-black uppercase tracking-wider">Langkah Sistematis Membuat Makanan</span>
                </div>
              )}

              {activeTopicKey === 'privasi' && visualSlide === 0 && (
                <div className="w-full h-36 bg-slate-900 rounded-2.5xl flex flex-col items-center justify-center p-3 shadow-inner border border-slate-800 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl animate-float">🔑</span>
                    <span className="text-3xl text-rose-500 font-black">❌</span>
                    <span className="text-4xl">👤</span>
                  </div>
                  <span className="text-[7.5px] text-slate-400 font-black uppercase tracking-wider">Sandi Rahasia: Dilarang Membagi Sandi!</span>
                </div>
              )}

              {activeTopicKey === 'privasi' && visualSlide === 1 && (
                <div className="w-full h-36 bg-slate-900 rounded-2.5xl flex flex-col items-center justify-center p-3 shadow-inner border border-slate-800 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <div className="p-1 border border-rose-500/30 rounded bg-rose-500/10 text-[8px] text-rose-400 font-bold">Rahasia: Rumah/HP 🏠</div>
                    <div className="p-1 border border-emerald-500/30 rounded bg-emerald-500/10 text-[8px] text-emerald-400 font-bold">Umum: Warna Kesukaan 🎨</div>
                  </div>
                  <span className="text-[7.5px] text-slate-400 font-black uppercase tracking-wider">Memilah Data Pribadi vs Data Umum</span>
                </div>
              )}

              {activeTopicKey === 'ai' && visualSlide === 0 && (
                <div className="w-full h-36 bg-slate-900 rounded-2.5xl flex flex-col items-center justify-center p-3 shadow-inner border border-slate-800 space-y-2 animate-fadeIn">
                  <div className="flex justify-between items-center gap-3 w-full max-w-[280px]">
                    <div className="flex flex-col items-center p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex-1">
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-wide text-[7px] leading-none mb-1">🍎 Buah</span>
                      <span className="text-sm tracking-widest">🍎🍌🍊</span>
                    </div>
                    <span className="text-xs text-indigo-400 font-black">➔</span>
                    <div className="flex flex-col items-center justify-center p-2 bg-indigo-500/20 border border-indigo-400/40 rounded-xl relative">
                      <span className="text-xl animate-float">🧠✨</span>
                      <span className="text-[7px] font-black text-indigo-300 uppercase mt-1">AI Model</span>
                    </div>
                    <span className="text-xs text-indigo-400 font-black">➔</span>
                    <div className="flex flex-col items-center p-1.5 bg-purple-500/10 border border-purple-500/30 rounded-xl flex-1">
                      <span className="text-xs font-black text-purple-400 uppercase tracking-wide text-[7px] leading-none mb-1">🐱 Hewan</span>
                      <span className="text-sm tracking-widest">🐱🐶🦊</span>
                    </div>
                  </div>
                  <span className="text-[7.5px] text-slate-400 font-black uppercase tracking-wider">Cara AI Memilah Data & Pola</span>
                </div>
              )}

              {activeTopicKey === 'ai' && visualSlide === 1 && (
                <div className="w-full h-36 bg-slate-900 rounded-2.5xl flex flex-col items-center justify-center p-3 shadow-inner border border-slate-800 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-3 text-center">
                    <span className="text-2xl text-rose-400 font-bold">Kotor (Noisy) ❌ ➔</span>
                    <span className="text-4xl animate-float">🧠🥴</span>
                    <span className="text-2xl text-rose-400 font-bold">➔ Salah Tebak!</span>
                  </div>
                  <span className="text-[7.5px] text-slate-400 font-black uppercase tracking-wider">Pengaruh Data Kotor terhadap Hasil AI</span>
                </div>
              )}

              {visualSlide === 2 && (
                <div className="w-full h-36 bg-gradient-to-tr from-amber-500/20 to-yellow-600/10 rounded-2.5xl flex flex-col items-center justify-center p-3 shadow-inner border border-amber-300/40 space-y-1.5 animate-fadeIn">
                  <span className="text-4xl animate-bounce">🏆⭐</span>
                  <span className="text-[8.5px] font-black text-amber-600 uppercase tracking-wider">Tantangan Kuis Lencana Cilik</span>
                </div>
              )}

              <div className="space-y-1.5">
                <h4 className="font-black text-xs text-slate-800 leading-tight">{activeTopic.slides[visualSlide].title}</h4>
                <p className="text-[9.5px] text-slate-500 font-extrabold leading-relaxed px-2">
                  {activeTopic.slides[visualSlide].text}
                </p>
              </div>

              {/* Quiz buttons */}
              {activeTopic.slides[visualSlide].quiz && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {activeTopic.slides[visualSlide].answers.map((ans, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(ans.correct)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[9.5px] py-3.5 px-4 rounded-xl cursor-pointer active:scale-95 transition-all shadow-md shadow-emerald-500/20"
                    >
                      {ans.text}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Slide Navigation */}
            <div className="flex justify-between items-center bg-white p-2 rounded-2.5xl border border-slate-100 shadow-sm">
              <button
                onClick={() => { playTone(580, 'sine', 0.05); setVisualSlide(prev => Math.max(0, prev - 1)); }}
                disabled={visualSlide === 0}
                className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-[9px] font-black border border-slate-200 disabled:opacity-40"
              >
                Sebelumnya
              </button>
              <span className="text-[9.5px] font-black text-slate-400">{visualSlide + 1} / 3</span>
              <button
                onClick={() => { playTone(580, 'sine', 0.05); setVisualSlide(prev => Math.min(2, prev + 1)); }}
                disabled={visualSlide === 2}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-[9px] font-black border-b-3 border-emerald-700 disabled:opacity-40"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. AUDIO MODALITY */}
        {/* ============================================================== */}
        {activeTab === 'audio' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bubbly-card p-5 rounded-3xl bg-white border-2 text-center space-y-4 shadow-md">
              {/* Soundwave visualizer */}
              <div className="w-full h-36 bg-slate-950 rounded-2.5xl flex flex-col items-center justify-center p-3 relative overflow-hidden border border-slate-800">
                <div className="flex items-center gap-1.5 h-12 justify-center">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1].map((h, i) => (
                    <div
                      key={i}
                      style={{ 
                        height: isNarrating ? `${h * 4.5}px` : '4px',
                        animationDelay: `${i * 0.08}s`
                      }}
                      className={`w-1 rounded-full bg-gradient-to-t from-indigo-500 to-purple-400 transition-all duration-300 ${
                        isNarrating ? 'animate-pulse' : ''
                      }`}
                    ></div>
                  ))}
                </div>
                <span className="text-[7.5px] text-indigo-300 font-black uppercase tracking-widest mt-2 animate-pulse">
                  {isNarrating ? '🔊 Sedang Membaca...' : '⏸️ Narasi Siap Diputar'}
                </span>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-black text-xs text-indigo-900 uppercase tracking-wide">Audio Narator Koding</h4>
                <p className="text-[10px] text-slate-600 font-extrabold leading-relaxed px-4">
                  "{activeTopic.slides[visualSlide].text}"
                </p>
              </div>

              <div className="flex flex-col gap-3.5 items-center justify-center pt-2">
                <button
                  onClick={handleAudioReplay}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white border-b-4 border-indigo-800 active:border-b-0 active:translate-y-0.5 font-black text-[9.5px] py-3.5 px-6 rounded-2xl flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-indigo-500/20 w-full max-w-[200px] justify-center"
                >
                  🔊 Ulangi Suara
                </button>

                {/* Speed controls */}
                <div className="space-y-2 w-full">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Kecepatan Narasi:</span>
                  <div className="flex gap-2 justify-center">
                    {[
                      { val: 0.75, label: '🐢 Lambat (0.75x)' },
                      { val: 1.0, label: '🚶 Normal (1.0x)' },
                      { val: 1.25, label: '⚡ Cepat (1.25x)' }
                    ].map(speed => (
                      <button
                        key={speed.val}
                        onClick={() => { playTone(600, 'sine', 0.05); setAudioSpeed(speed.val); }}
                        className={`px-3.5 py-2 rounded-xl text-[7.5px] font-black border transition-all cursor-pointer ${
                          audioSpeed === speed.val
                            ? 'bg-indigo-50 border-indigo-300 !text-indigo-700 shadow-inner'
                            : 'bg-white border-slate-200 !text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {speed.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Navigation */}
            <div className="flex justify-between items-center bg-white p-2 rounded-2.5xl border border-slate-100 shadow-sm">
              <button
                onClick={() => { playTone(580, 'sine', 0.05); setVisualSlide(prev => Math.max(0, prev - 1)); }}
                disabled={visualSlide === 0}
                className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-[9px] font-black border border-slate-200 disabled:opacity-40"
              >
                Sebelumnya
              </button>
              <span className="text-[9.5px] font-black text-slate-400">{visualSlide + 1} / 3</span>
              <button
                onClick={() => { playTone(580, 'sine', 0.05); setVisualSlide(prev => Math.min(2, prev + 1)); }}
                disabled={visualSlide === 2}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-[9px] font-black border-b-3 border-indigo-700 disabled:opacity-40"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. TEORI MODALITY */}
        {/* ============================================================== */}
        {activeTab === 'teori' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bubbly-card p-5 rounded-3xl bg-white border-2 text-center space-y-4 shadow-md">
              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  style={{ width: `${((teoriStage + 1) / 3) * 100}%` }}
                  className="bg-purple-500 h-full transition-all duration-300"
                ></div>
              </div>

              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2.5xl flex items-center justify-center text-3xl mx-auto shadow-inner border border-purple-100">
                📖
              </div>

              {teoriStage === 0 && (
                <div className="space-y-2 animate-fadeIn">
                  <span className="bg-purple-100 !text-purple-800 text-[7px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    {activeTopic.badge}
                  </span>
                  <h4 className="font-black text-xs text-slate-800 leading-tight">
                    {activeTopic.teori[0].title}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-extrabold leading-relaxed px-2">
                    {activeTopic.teori[0].text}
                  </p>
                </div>
              )}

              {teoriStage === 1 && (
                <div className="space-y-2 animate-fadeIn">
                  <span className="bg-purple-100 !text-purple-800 text-[7px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    {activeTopic.badge}
                  </span>
                  <h4 className="font-black text-xs text-slate-800 leading-tight">
                    {activeTopic.teori[1].title}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-extrabold leading-relaxed px-2">
                    {activeTopic.teori[1].text}
                  </p>
                </div>
              )}

              {teoriStage === 2 && (
                <div className="space-y-2 animate-fadeIn">
                  <span className="bg-purple-100 !text-purple-800 text-[7px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    Konsep Tahap 3
                  </span>
                  <h4 className="font-black text-xs text-slate-800 leading-tight">
                    {activeTopic.teori[2].title}
                  </h4>
                  <p className="text-[9.5px] text-slate-600 font-extrabold px-1">
                    {activeTopic.teori[2].text}
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => handleQuizAnswer(activeTopicKey !== 'privasi')}
                      className="bg-purple-500 hover:bg-purple-600 text-white font-black text-[9px] py-3 px-4 rounded-xl cursor-pointer shadow-md shadow-purple-500/20 active:scale-95"
                    >
                      Boleh / Benar 👍
                    </button>
                    <button
                      onClick={() => handleQuizAnswer(activeTopicKey === 'privasi')}
                      className="bg-slate-100 hover:bg-slate-200 !text-slate-600 font-black text-[9px] py-3 px-4 rounded-xl cursor-pointer active:scale-95"
                    >
                      Tidak Boleh / Salah 👎
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Teori controls */}
            <div className="flex justify-between items-center bg-white p-2 rounded-2.5xl border border-slate-100 shadow-sm">
              <button
                onClick={() => { playTone(580, 'sine', 0.05); setTeoriStage(prev => Math.max(0, prev - 1)); }}
                disabled={teoriStage === 0}
                className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-[9px] font-black border border-slate-200 disabled:opacity-40"
              >
                Sebelumnya
              </button>
              <span className="text-[9.5px] font-black text-slate-400">{teoriStage + 1} / 3</span>
              <button
                onClick={() => { playTone(580, 'sine', 0.05); setTeoriStage(prev => Math.min(2, prev + 1)); }}
                disabled={teoriStage === 2}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2.5 rounded-xl text-[9px] font-black border-b-3 border-purple-700 disabled:opacity-40"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. PRACTICAL MODALITY (RENDERS MODE'S CUSTOM GAME WORKPLACE) */}
        {/* ============================================================== */}
        {activeTab === 'praktik' && (
          <div className="animate-fadeIn bg-slate-900 rounded-3.5xl p-2.5 border border-slate-800 shadow-xl">
            {renderPraktik()}
          </div>
        )}
      </div>
    </div>
  );
}
