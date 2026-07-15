import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { playTone } from '../utils/audio';

export default function Home({
  username,
  selectedAvatar,
  renderedStreakDays,
  renderedDuration,
  walletTokens,
  speakText,
  setSelectedMode,
  setCurrentTab,
}) {
  // Toggle between 'reguler' and 'abk' stats
  const [statsCategory, setStatsCategory] = useState('reguler');

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800 leading-tight">Halo, {username}!</h2>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Mari asah logika koding dan kecerdasan artifisialmu! 🚀</p>
        </div>
        <span className="text-2xl animate-float">💻</span>
      </div>

      {/* Interactive Avatar Card */}
      <div className="bubbly-card rounded-3xl p-5 flex items-center gap-4 bg-gradient-to-tr from-white to-emerald-50/20 border-2 relative overflow-hidden">
        <div className="absolute right-0 top-0 text-[100px] opacity-5 select-none font-bold">CODER</div>
        <div
          onClick={() => { 
            confetti(); 
            speakText("Halo coder hebat! Mari kita belajar koding dan kecerdasan buatan hari ini."); 
          }}
          className="w-16 h-16 bg-emerald-100 rounded-2.5xl flex items-center justify-center text-4xl shadow-inner border border-emerald-200 cursor-pointer animate-float transform hover:rotate-12 transition-transform duration-300"
          title="Klik aku!"
        >
          {selectedAvatar}
        </div>
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-200">Level 4 AI Explorer</span>
          <h3 className="font-extrabold text-slate-800 mt-1 leading-tight">{username}</h3>
          <p className="text-[9px] text-slate-500 font-medium leading-relaxed">Junior Coding & AI Specialist</p>
        </div>
      </div>

      {/* STATS CATEGORY MENU/TOGGLE */}
      <div className="space-y-2">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Kategori Menu Statistik:</span>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            onClick={() => { playTone(600, 'sine', 0.05); setStatsCategory('reguler'); }}
            className={`flex-1 py-2 text-[9px] font-black rounded-xl transition-all cursor-pointer ${
              statsCategory === 'reguler'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            🎓 Kelas Reguler
          </button>
          <button
            onClick={() => { playTone(600, 'sine', 0.05); setStatsCategory('abk'); }}
            className={`flex-1 py-2 text-[9px] font-black rounded-xl transition-all cursor-pointer ${
              statsCategory === 'abk'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            🧩 Kelas Inspirasi ABK
          </button>
        </div>
      </div>

      {/* SECTION 1: DASHBOARD STATS (DYNAMIC BASED ON SELECTION) */}
      {statsCategory === 'reguler' ? (
        <div className="grid grid-cols-2 gap-3.5 animate-fadeIn">
          <div className="bubbly-card rounded-2.5xl p-4 flex flex-col justify-between min-h-[90px] bg-white border-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[9px] font-black uppercase tracking-wider">Harian</span>
              <span className="text-sm">🔥</span>
            </div>
            <div>
              <p className="text-xl font-black text-slate-800">{renderedStreakDays}</p>
              <p className="text-[8px] text-slate-400 font-bold">Streak belajar beruntung</p>
            </div>
          </div>

          <div className="bubbly-card rounded-2.5xl p-4 flex flex-col justify-between min-h-[90px] bg-white border-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[9px] font-black uppercase tracking-wider">Waktu</span>
              <span className="text-sm">⏱️</span>
            </div>
            <div>
              <p className="text-xl font-black text-slate-800">{renderedDuration}</p>
              <p className="text-[8px] text-slate-400 font-bold">Total belajar Koding & AI</p>
            </div>
          </div>

          <div className="bubbly-card rounded-2.5xl p-4 flex flex-col justify-between min-h-[90px] bg-white border-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[9px] font-black uppercase tracking-wider">Kompetensi</span>
              <span className="text-sm">🪙</span>
            </div>
            <div>
              <p className="text-xl font-black text-emerald-600">{walletTokens} SBT</p>
              <p className="text-[8px] text-slate-400 font-bold">Lencana koding reguler</p>
            </div>
          </div>

          <div className="bubbly-card rounded-2.5xl p-4 flex flex-col justify-between min-h-[90px] bg-white border-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[9px] font-black uppercase tracking-wider">Algoritma</span>
              <span className="text-sm">📈</span>
            </div>
            <div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-1 mb-1">
                <div className="bg-emerald-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <p className="text-xs font-black text-slate-800">60% Selesai</p>
            </div>
          </div>
        </div>
      ) : (
        /* ABK ADAPTIVE STATISTICS */
        <div className="grid grid-cols-2 gap-3.5 animate-fadeIn">
          <div className="bubbly-card rounded-2.5xl p-4 flex flex-col justify-between min-h-[90px] bg-white border-2 border-purple-100">
            <div className="flex justify-between items-center text-purple-400">
              <span className="text-[9px] font-black uppercase tracking-wider text-purple-600">Streak ABK</span>
              <span className="text-sm">⚡</span>
            </div>
            <div>
              <p className="text-xl font-black text-purple-800">3 Hari</p>
              <p className="text-[8px] text-slate-400 font-bold">Streak belajar inklusi</p>
            </div>
          </div>

          <div className="bubbly-card rounded-2.5xl p-4 flex flex-col justify-between min-h-[90px] bg-white border-2 border-purple-100">
            <div className="flex justify-between items-center text-purple-400">
              <span className="text-[9px] font-black uppercase tracking-wider text-purple-600">Waktu Adaptif</span>
              <span className="text-sm">🎵</span>
            </div>
            <div>
              <p className="text-xl font-black text-purple-800">20 Menit</p>
              <p className="text-[8px] text-slate-400 font-bold">Fokus belajar sensorik</p>
            </div>
          </div>

          <div className="bubbly-card rounded-2.5xl p-4 flex flex-col justify-between min-h-[90px] bg-white border-2 border-purple-100">
            <div className="flex justify-between items-center text-purple-400">
              <span className="text-[9px] font-black uppercase tracking-wider text-purple-600">Lencana Inklusi</span>
              <span className="text-sm">🏆</span>
            </div>
            <div>
              <p className="text-xl font-black text-purple-600">1 Lencana</p>
              <p className="text-[8px] text-slate-400 font-bold">Sertifikat belajar adaptif</p>
            </div>
          </div>

          <div className="bubbly-card rounded-2.5xl p-4 flex flex-col justify-between min-h-[90px] bg-white border-2 border-purple-100">
            <div className="flex justify-between items-center text-purple-400">
              <span className="text-[9px] font-black uppercase tracking-wider text-purple-600">Modul Adaptif</span>
              <span className="text-sm">🌟</span>
            </div>
            <div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-1 mb-1">
                <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{ width: '35%' }}></div>
              </div>
              <p className="text-xs font-black text-slate-800">35% Selesai</p>
            </div>
          </div>
        </div>
      )}

      {/* AI advisor insight card */}
      <div className={`bubbly-card rounded-3xl p-4 border flex items-start gap-3 transition-colors duration-300 ${
        statsCategory === 'reguler' 
          ? 'bg-emerald-50/40 border-emerald-100' 
          : 'bg-purple-50/40 border-purple-100'
      }`}>
        <span className="text-xl animate-float">🤖</span>
        <div className="space-y-0.5">
          <h4 className={`text-[9px] font-black uppercase tracking-wider ${
            statsCategory === 'reguler' ? 'text-emerald-800' : 'text-purple-800'
          }`}>
            AI Diagnostic Insight:
          </h4>
          <p className="text-[10px] text-slate-600 font-semibold leading-relaxed">
            {statsCategory === 'reguler' 
              ? '"Logika berpikir sekuensial Anda meningkat pesat! Kami merekomendasikan untuk mencoba tantangan logika blok koding pada kelas reguler hari ini."'
              : '"AI Adaptif mendeteksi anak sangat nyaman belajar menggunakan Gaya Visual & Audio. Kami menyarankan untuk melatih kreativitas dengan puzzle balok praktis berikutnya."'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
