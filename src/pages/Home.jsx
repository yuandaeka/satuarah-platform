import React from 'react';
import confetti from 'canvas-confetti';

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
  return (
    <div className="space-y-5">
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
          onClick={() => { confetti(); speakText("Halo coder hebat! Mari kita belajar koding dan kecerdasan buatan hari ini."); }}
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

      {/* SECTION 1: DASHBOARD STATS */}
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
            <p className="text-[8px] text-slate-400 font-medium">Total belajar Koding & AI</p>
          </div>
        </div>

        <div className="bubbly-card rounded-2.5xl p-4 flex flex-col justify-between min-h-[90px]">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Kompetensi</span>
            <span className="text-sm">🪙</span>
          </div>
          <div>
            <p className="text-xl font-black text-emerald-600">{walletTokens} SBT</p>
            <p className="text-[8px] text-slate-400 font-medium">Lencana koding di blockchain</p>
          </div>
        </div>

        <div className="bubbly-card rounded-2.5xl p-4 flex flex-col justify-between min-h-[90px]">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Algoritma</span>
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

      {/* SECTION 2: PILIH KELAS BELAJAR (REGULER vs ABK) */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pilih Kelas Pembelajaran:</h4>
        
        {/* Kelas Reguler Card */}
        <div 
          onClick={() => {
            confetti();
            speakText("Memasuki Kelas Reguler Koding.");
            setSelectedMode('reguler');
          }}
          className="bubbly-card rounded-3xl p-5 border-2 hover:border-emerald-400 bg-gradient-to-r from-emerald-500 to-teal-600 text-white cursor-pointer transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group shadow-md"
        >
          <div className="absolute right-4 top-2 text-7xl opacity-10 select-none font-bold group-hover:scale-110 transition-transform">🎓</div>
          <div className="flex items-start gap-3.5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl border border-white/20 flex-shrink-0">
              🎓
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h5 className="font-black text-sm uppercase tracking-wide">Kelas Reguler</h5>
                <span className="bg-white/25 text-white text-[7px] font-extrabold px-2 py-0.5 rounded-full uppercase">Siswa Umum</span>
              </div>
              <p className="text-[9.5px] text-emerald-50/90 leading-relaxed font-semibold">
                Belajar logika algoritma koding melalui visual game blok interaktif dan kuis kecerdasan buatan (AI) yang menyenangkan.
              </p>
              <div className="pt-1.5 flex items-center gap-1 text-[8.5px] font-black text-yellow-300 group-hover:translate-x-1 transition-transform">
                <span>Masuk Kelas Sekarang</span> <span>&rarr;</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kelas ABK Card */}
        <div 
          onClick={() => {
            confetti();
            speakText("Membuka pilihan mode belajar khusus untuk anak berkebutuhan khusus.");
            setCurrentTab('belajar');
          }}
          className="bubbly-card rounded-3xl p-5 border-2 hover:border-purple-400 bg-gradient-to-r from-purple-500 to-indigo-600 text-white cursor-pointer transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group shadow-md"
        >
          <div className="absolute right-4 top-2 text-7xl opacity-10 select-none font-bold group-hover:scale-110 transition-transform">🧩</div>
          <div className="flex items-start gap-3.5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl border border-white/20 flex-shrink-0">
              🧩
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h5 className="font-black text-sm uppercase tracking-wide">Kelas Inspirasi ABK</h5>
                <span className="bg-white/25 text-white text-[7px] font-extrabold px-2 py-0.5 rounded-full uppercase">Kebutuhan Khusus</span>
              </div>
              <p className="text-[9.5px] text-purple-50/90 leading-relaxed font-semibold">
                Pembelajaran koding & AI adaptif yang disesuaikan khusus untuk penyandang disleksia, ADHD, tunarungu, dan tunanetra.
              </p>
              <div className="pt-1.5 flex items-center gap-1 text-[8.5px] font-black text-yellow-300 group-hover:translate-x-1 transition-transform">
                <span>Pilih Mode Belajar</span> <span>&rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI advisor insight card */}
      <div className="bubbly-card rounded-3xl p-4 bg-emerald-50/40 border border-emerald-100 flex items-start gap-3">
        <span className="text-xl">🤖</span>
        <div className="space-y-0.5">
          <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">AI Diagnostic Insight:</h4>
          <p className="text-[10px] text-slate-600 font-semibold leading-relaxed">
            "Logika berpikir sekuensial Anda meningkat pesat! Kami merekomendasikan untuk mencoba tantangan logika blok koding pada adaptasi belajar hari ini."
          </p>
        </div>
      </div>
    </div>
  );
}
