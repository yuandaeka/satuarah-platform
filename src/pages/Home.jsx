import React from 'react';
import confetti from 'canvas-confetti';

export default function Home({
  username,
  selectedAvatar,
  renderedStreakDays,
  renderedDuration,
  walletTokens,
  speakText,
}) {
  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800 leading-tight">Halo, {username}!</h2>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Mari temukan modul sains luar angkasamu!</p>
        </div>
        <span className="text-2xl animate-float">👋</span>
      </div>

      {/* Interactive Avatar Card */}
      <div className="bubbly-card rounded-3xl p-5 flex items-center gap-4 bg-gradient-to-tr from-white to-emerald-50/20 border-2 relative overflow-hidden">
        <div className="absolute right-0 top-0 text-[100px] opacity-5 select-none font-bold">AVATAR</div>
        <div
          onClick={() => { confetti(); speakText("Halo penjelajah cerdas! Aku senang menemanimu."); }}
          className="w-16 h-16 bg-emerald-100 rounded-2.5xl flex items-center justify-center text-4xl shadow-inner border border-emerald-200 cursor-pointer animate-float transform hover:rotate-12 transition-transform duration-300"
          title="Klik aku!"
        >
          {selectedAvatar}
        </div>
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-200">Level 4 Penjelajah</span>
          <h3 className="font-extrabold text-slate-800 mt-1 leading-tight">{username}</h3>
          <p className="text-[9px] text-slate-500 font-medium leading-relaxed">Spesialis Astrofisika Junior</p>
        </div>
      </div>

      {/* Dashboard Stats Under Avatar */}
      <div className="grid grid-cols-2 gap-3.5">
        <div className="bubbly-card rounded-2.5xl p-4 flex flex-col justify-between min-h-[90px]">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Harian</span>
            <span className="text-sm">🔥</span>
          </div>
          <div>
            <p className="text-xl font-black text-slate-800">{renderedStreakDays}</p>
            <p className="text-[8px] text-slate-400 font-medium">Streak belajar berturut-turut</p>
          </div>
        </div>

        <div className="bubbly-card rounded-2.5xl p-4 flex flex-col justify-between min-h-[90px]">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Waktu</span>
            <span className="text-sm">⏱️</span>
          </div>
          <div>
            <p className="text-xl font-black text-slate-800">{renderedDuration}</p>
            <p className="text-[8px] text-slate-400 font-medium">Total waktu belajar sains</p>
          </div>
        </div>

        <div className="bubbly-card rounded-2.5xl p-4 flex flex-col justify-between min-h-[90px]">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Kompetensi</span>
            <span className="text-sm">🪙</span>
          </div>
          <div>
            <p className="text-xl font-black text-emerald-600">{walletTokens} SBT</p>
            <p className="text-[8px] text-slate-400 font-medium">Token pembuktian blockchain</p>
          </div>
        </div>

        <div className="bubbly-card rounded-2.5xl p-4 flex flex-col justify-between min-h-[90px]">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Progres</span>
            <span className="text-sm">📈</span>
          </div>
          <div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-1 mb-1">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-xs font-black text-slate-800">60% Selesai</p>
          </div>
        </div>
      </div>

      {/* AI advisor insight card */}
      <div className="bubbly-card rounded-3xl p-4 bg-emerald-50/40 border border-emerald-100 flex items-start gap-3">
        <span className="text-xl">🤖</span>
        <div className="space-y-0.5">
          <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">AI Diagnostic Insight:</h4>
          <p className="text-[10px] text-slate-600 font-semibold leading-relaxed">
            "Perkembangan fokus belajar Anda optimal pada mode visual kemarin. Kami merekomendasikan untuk mencoba tantangan isyarat atau visual komik hari ini."
          </p>
        </div>
      </div>
    </div>
  );
}
