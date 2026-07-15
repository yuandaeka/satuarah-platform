import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playTone } from '../../utils/audio';

const VISUAL_SLIDES = [
  {
    title: "1. Koding adalah Perintah 🚶",
    text: "Koding adalah menyusun langkah-langkah perintah untuk komputer. Seperti menyuruh robot berjalan lurus ke bendera tanpa menabrak dinding!",
    emoji: "🤖"
  },
  {
    title: "2. Kecerdasan Buatan (AI) 🧠",
    text: "AI adalah program pintar yang belajar dari data contoh. AI melihat foto buah 🍎 dan hewan 🐱 agar pintar membedakan benda baru!",
    emoji: "📸"
  },
  {
    title: "3. Kuis Koding & AI 🏆",
    text: "Pertanyaan: Apakah koding diatur dengan urutan langkah yang benar?",
    quiz: true,
    answers: [
      { text: "Ya, Betul! 👍", correct: true },
      { text: "Tidak 👎", correct: false }
    ]
  }
];

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
  
  // Audio Speed Rate (0.75, 1.0, 1.25)
  const [audioSpeed, setAudioSpeed] = useState(1.0);
  const [visualSlide, setVisualSlide] = useState(0);
  const [teoriStage, setTeoriStage] = useState(0);

  // Auto narrate on Audio mode select or change slide
  useEffect(() => {
    if (activeTab === 'audio') {
      const textToSpeak = getAudioTextForStage(visualSlide);
      speakText(textToSpeak, true, audioSpeed);
    }
  }, [activeTab, visualSlide, audioSpeed]);

  const getAudioTextForStage = (slideIdx) => {
    const slide = VISUAL_SLIDES[slideIdx];
    if (slide.quiz) {
      return `${slide.title}. ${slide.text}. Jawab pertanyaan dengan mengklik tombol di layar.`;
    }
    return `${slide.title}. ${slide.text}. Klik tombol berikutnya untuk melanjutkan.`;
  };

  const handleAudioReplay = () => {
    playTone(600, 'sine', 0.1);
    const textToSpeak = getAudioTextForStage(visualSlide);
    speakText(textToSpeak, true, audioSpeed);
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

  return (
    <div className="space-y-4 text-slate-800">
      {/* HEADER WITH BACK BUTTON */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <button 
          onClick={() => { playTone(440, 'sine', 0.1); setSelectedMode(null); }}
          className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-xs font-black text-slate-500 border border-slate-200 active:scale-90 transition-all cursor-pointer"
        >
          &larr;
        </button>
        <span className="bg-slate-100 border border-slate-200 text-slate-600 text-[8.5px] font-black px-3 py-1 rounded-full uppercase">
          {modeName} Classroom
        </span>
      </div>

      {/* AI ADAPTIVE RECOMMENDATION ENGINE BANNER */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2.5xl p-3 flex items-start gap-2.5 shadow-sm">
        <span className="text-2xl animate-float">🤖</span>
        <div className="space-y-0.5">
          <span className="text-[7.5px] font-black text-amber-700 uppercase tracking-wider">AI Adaptif Advisor</span>
          <p className="text-[9px] text-slate-700 font-bold leading-relaxed">{recommendation.msg}</p>
        </div>
      </div>

      {/* LARGE COMFORTABLE TABS */}
      <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-2.5xl border border-slate-200">
        {[
          { id: 'visual', label: '🎨 Visual', color: 'bg-emerald-500' },
          { id: 'audio', label: '🔊 Audio', color: 'bg-indigo-500' },
          { id: 'teori', label: '📖 Teori', color: 'bg-purple-500' },
          { id: 'praktik', label: '🕹️ Praktik', color: 'bg-pink-500' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { 
              playTone(600, 'sine', 0.08); 
              setActiveTab(tab.id); 
              if (tab.id !== 'audio') speakText(""); // stop audio
            }}
            className={`py-3 rounded-xl text-[8.5px] font-black transition-all cursor-pointer ${
              activeTab === tab.id 
                ? `${tab.color} text-white shadow-md scale-102` 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 1. VISUAL MODALITY */}
      {/* ============================================================== */}
      {activeTab === 'visual' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bubbly-card p-4 rounded-3xl bg-white border-2 text-center space-y-4 shadow-sm">
            {/* Simple visual illustrations */}
            <div className="w-full h-36 bg-emerald-50 rounded-2.5xl flex items-center justify-center text-6.5xl shadow-inner border border-emerald-100 animate-float">
              {VISUAL_SLIDES[visualSlide].emoji}
            </div>

            <div className="space-y-1">
              <h4 className="font-black text-xs text-slate-800">{VISUAL_SLIDES[visualSlide].title}</h4>
              <p className="text-[10px] text-slate-500 font-extrabold leading-relaxed px-3">
                {VISUAL_SLIDES[visualSlide].text}
              </p>
            </div>

            {/* If quiz slide */}
            {VISUAL_SLIDES[visualSlide].quiz && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                {VISUAL_SLIDES[visualSlide].answers.map((ans, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuizAnswer(ans.correct)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[9.5px] py-3 px-4 rounded-xl cursor-pointer active:scale-95 transition-all shadow-sm"
                  >
                    {ans.text}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Simple controls */}
          <div className="flex justify-between items-center bg-white p-2 rounded-2.5xl border border-slate-100 shadow-sm">
            <button
              onClick={() => { playTone(580, 'sine', 0.05); setVisualSlide(prev => Math.max(0, prev - 1)); }}
              disabled={visualSlide === 0}
              className="bg-slate-50 text-slate-600 px-4 py-2.5 rounded-xl text-[9px] font-black border border-slate-200 disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <span className="text-[9.5px] font-black text-slate-400">{visualSlide + 1} / 3</span>
            <button
              onClick={() => { playTone(580, 'sine', 0.05); setVisualSlide(prev => Math.min(2, prev + 1)); }}
              disabled={visualSlide === 2}
              className="bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-[9px] font-black border-b-3 border-emerald-700 disabled:opacity-40"
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
          <div className="bubbly-card p-5 rounded-3xl bg-white border-2 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2.5xl flex items-center justify-center text-3xl mx-auto shadow-inner border border-indigo-100">
              🔊
            </div>

            <div className="space-y-1">
              <h4 className="font-black text-xs text-indigo-900 uppercase tracking-wide">Audio Narasi Koding & AI</h4>
              <p className="text-[10px] text-slate-600 font-extrabold leading-relaxed px-4">
                "{VISUAL_SLIDES[visualSlide].text}"
              </p>
            </div>

            {/* Audio action controls */}
            <div className="flex flex-col gap-3 items-center justify-center pt-2">
              <button
                onClick={handleAudioReplay}
                className="bg-indigo-600 hover:bg-indigo-700 text-white border-b-4 border-indigo-800 active:border-b-0 active:translate-y-0.5 font-black text-[9.5px] py-3 px-6 rounded-2xl flex items-center gap-2 cursor-pointer transition-all shadow-sm w-full max-w-[200px] justify-center"
              >
                🔊 Ulangi Suara
              </button>

              {/* Speed rate selection */}
              <div className="space-y-1.5 w-full">
                <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-wider block">Pengaturan Kecepatan:</span>
                <div className="flex gap-1.5 justify-center">
                  {[
                    { val: 0.75, label: '🐢 Lambat (0.75x)' },
                    { val: 1.0, label: '🚶 Normal (1.0x)' },
                    { val: 1.25, label: '⚡ Cepat (1.25x)' }
                  ].map(speed => (
                    <button
                      key={speed.val}
                      onClick={() => { playTone(600, 'sine', 0.05); setAudioSpeed(speed.val); }}
                      className={`px-3 py-1.5 rounded-xl text-[7.5px] font-black border transition-all cursor-pointer ${
                        audioSpeed === speed.val
                          ? 'bg-indigo-100 border-indigo-300 text-indigo-700 shadow-inner'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {speed.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Simple controls */}
          <div className="flex justify-between items-center bg-white p-2 rounded-2.5xl border border-slate-100 shadow-sm">
            <button
              onClick={() => { playTone(580, 'sine', 0.05); setVisualSlide(prev => Math.max(0, prev - 1)); }}
              disabled={visualSlide === 0}
              className="bg-slate-50 text-slate-600 px-4 py-2.5 rounded-xl text-[9px] font-black border border-slate-200 disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <span className="text-[9.5px] font-black text-slate-400">{visualSlide + 1} / 3</span>
            <button
              onClick={() => { playTone(580, 'sine', 0.05); setVisualSlide(prev => Math.min(2, prev + 1)); }}
              disabled={visualSlide === 2}
              className="bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-[9px] font-black border-b-3 border-indigo-700 disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. TEORI MODALITY (ONE CONCEPT AT A TIME) */}
      {/* ============================================================== */}
      {activeTab === 'teori' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bubbly-card p-5 rounded-3xl bg-white border-2 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2.5xl flex items-center justify-center text-3xl mx-auto shadow-inner border border-purple-100">
              📖
            </div>

            {teoriStage === 0 && (
              <div className="space-y-1.5 animate-fadeIn">
                <span className="bg-purple-100 text-purple-800 text-[7px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">Konsep Tahap 1</span>
                <h4 className="font-black text-xs text-slate-800 leading-tight">Apa itu Koding?</h4>
                <p className="text-[10px] text-slate-500 font-extrabold leading-relaxed px-2">
                  Koding adalah memberi perintah tertulis ke komputer atau robot agar bergerak mengikuti keinginan kita.
                </p>
              </div>
            )}

            {teoriStage === 1 && (
              <div className="space-y-1.5 animate-fadeIn">
                <span className="bg-purple-100 text-purple-800 text-[7px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">Konsep Tahap 2</span>
                <h4 className="font-black text-xs text-slate-800 leading-tight">Apa itu AI?</h4>
                <p className="text-[10px] text-slate-500 font-extrabold leading-relaxed px-2">
                  AI adalah mesin pintar yang bisa belajar mencocokkan kemiripan data seperti gambar buah atau hewan.
                </p>
              </div>
            )}

            {teoriStage === 2 && (
              <div className="space-y-2 animate-fadeIn">
                <span className="bg-purple-100 text-purple-800 text-[7px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">Konsep Tahap 3</span>
                <h4 className="font-black text-xs text-slate-800 leading-tight">Mari Uji Pemahaman:</h4>
                <p className="text-[9.5px] text-slate-600 font-extrabold">
                  Siapakah yang bertugas memberikan perintah tertulis agar robot bergerak?
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleQuizAnswer(true)}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-black text-[9px] py-2.5 px-4 rounded-xl cursor-pointer"
                  >
                    Koding Anak 👍
                  </button>
                  <button
                    onClick={() => handleQuizAnswer(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-[9px] py-2.5 px-4 rounded-xl cursor-pointer"
                  >
                    Dinding Kayu 👎
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Simple controls */}
          <div className="flex justify-between items-center bg-white p-2 rounded-2.5xl border border-slate-100 shadow-sm">
            <button
              onClick={() => { playTone(580, 'sine', 0.05); setTeoriStage(prev => Math.max(0, prev - 1)); }}
              disabled={teoriStage === 0}
              className="bg-slate-50 text-slate-600 px-4 py-2.5 rounded-xl text-[9px] font-black border border-slate-200 disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <span className="text-[9.5px] font-black text-slate-400">{teoriStage + 1} / 3</span>
            <button
              onClick={() => { playTone(580, 'sine', 0.05); setTeoriStage(prev => Math.min(2, prev + 1)); }}
              disabled={teoriStage === 2}
              className="bg-purple-500 text-white px-4 py-2.5 rounded-xl text-[9px] font-black border-b-3 border-purple-700 disabled:opacity-40"
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
        <div className="animate-fadeIn">
          {renderPraktik()}
        </div>
      )}
    </div>
  );
}
