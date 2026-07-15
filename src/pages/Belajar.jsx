import React from 'react';
import confetti from 'canvas-confetti';

export default function Belajar({ setSelectedMode, voiceGuide, speakText }) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="space-y-4">
        <div className="mb-2 text-center">
          <h2 className="text-lg font-black text-slate-800 leading-tight">Pilih Kelas Belajar:</h2>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Mulai petualangan koding & kecerdasan artifisialmu!</p>
        </div>

        <div className="space-y-4">
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
                  <h5 className="font-black text-xs uppercase tracking-wide">Kelas Reguler</h5>
                  <span className="bg-white/25 text-white text-[7px] font-extrabold px-2 py-0.5 rounded-full uppercase">Siswa Umum</span>
                </div>
                <p className="text-[9px] text-emerald-50/90 leading-relaxed font-semibold">
                  Belajar logika koding lewat game robot dan melatih kecerdasan buatan sendiri secara menyenangkan.
                </p>
                <div className="pt-1.5 flex items-center gap-1 text-[8.5px] font-black text-yellow-300 group-hover:translate-x-1 transition-transform">
                  <span>Masuk Kelas Sekarang</span> <span>&rarr;</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kelas ABK Card — now directly enters ABK unified mode */}
          <div 
            onClick={() => {
              confetti();
              speakText("Membuka Kelas Inspirasi ABK dengan mode belajar adaptif.");
              setSelectedMode('abk');
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
                  <h5 className="font-black text-xs uppercase tracking-wide">Kelas Inspirasi ABK</h5>
                  <span className="bg-white/25 text-white text-[7px] font-extrabold px-2 py-0.5 rounded-full uppercase">Kebutuhan Khusus</span>
                </div>
                <p className="text-[9px] text-purple-50/90 leading-relaxed font-semibold">
                  Pembelajaran koding & AI adaptif dengan 5 gaya belajar: Visual, Audio, Teori, Praktik & Modul interaktif.
                </p>
                <div className="pt-1.5 flex items-center gap-1 text-[8.5px] font-black text-yellow-300 group-hover:translate-x-1 transition-transform">
                  <span>Masuk Kelas Sekarang</span> <span>&rarr;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
