import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function Belajar({ setSelectedMode, voiceGuide, speakText }) {
  // Local state to choose between Classroom types: null (classroom selection) | 'abk' (list of ABK modes)
  const [selectedClassType, setSelectedClassType] = useState(null);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* 1. CLASSROOM SELECTION SCREEN (NULL STATE) */}
      {!selectedClassType ? (
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

            {/* Kelas ABK Card */}
            <div 
              onClick={() => {
                confetti();
                speakText("Membuka pilihan mode belajar khusus untuk anak berkebutuhan khusus.");
                setSelectedClassType('abk');
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
                    Pembelajaran koding & AI adaptif yang disesuaikan khusus untuk penyandang disleksia, ADHD, tunarungu, dan tunanetra.
                  </p>
                  <div className="pt-1.5 flex items-center gap-1 text-[8.5px] font-black text-yellow-300 group-hover:translate-x-1 transition-transform">
                    <span>Pilih Mode Belajar</span> <span>&rarr;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 2. ADAPTIVE ABK MODES SELECTION (ABK STATE) */
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { speakText(""); setSelectedClassType(null); }}
              className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-xs font-black text-slate-500 border border-slate-200 active:scale-90"
            >
              &larr;
            </button>
            <div>
              <h2 className="text-base font-black text-slate-800 leading-tight">Pilih Adaptasi Belajar:</h2>
              <p className="text-[8px] text-slate-500 font-semibold mt-0.5">Pilih mode yang disesuaikan dengan kebutuhan belajarmu.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* ADHD Mode */}
            <button
              onClick={() => { setSelectedMode('adhd'); voiceGuide("Mode ADHD Aktif."); }}
              className="bubbly-card hover:border-pink-300 w-full text-left p-4 rounded-3xl flex items-center justify-between border-2 transition-all group cursor-pointer bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                  🎯
                </div>
                <div>
                  <h3 className="font-extrabold text-xs text-slate-800 leading-tight">1. Mode ADHD</h3>
                  <p className="text-[9px] text-slate-400 font-medium mt-0.5">Game Fokus "Pitch and Drop"</p>
                </div>
              </div>
              <span className="text-slate-400 font-black text-xs">&rarr;</span>
            </button>

            {/* Tunarungu Mode */}
            <button
              onClick={() => { setSelectedMode('tunarungu'); voiceGuide("Mode Tunarungu Aktif."); }}
              className="bubbly-card hover:border-sky-300 w-full text-left p-4 rounded-3xl flex items-center justify-between border-2 transition-all group cursor-pointer bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                  🤟
                </div>
                <div>
                  <h3 className="font-extrabold text-xs text-slate-800 leading-tight">2. Mode Tunarungu</h3>
                  <p className="text-[9px] text-slate-400 font-medium mt-0.5">Media Komik & Isyarat BISINDO</p>
                </div>
              </div>
              <span className="text-slate-400 font-black text-xs">&rarr;</span>
            </button>

            {/* Tunanetra Mode */}
            <button
              onClick={() => {
                setSelectedMode('tunanetra');
                speakText("Mode Tunanetra diaktifkan. Layar kontras tinggi aktif. Pembelajaran berbasis storytelling audio dimulai. Gerakkan kursor ke tombol untuk mendengarkan panduan suara.", true);
              }}
              className="bubbly-card hover:border-yellow-400 w-full text-left p-4 rounded-3xl flex items-center justify-between border-2 transition-all group cursor-pointer bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                  🎧
                </div>
                <div>
                  <h3 className="font-extrabold text-xs text-slate-800 leading-tight">3. Mode Tunanetra</h3>
                  <p className="text-[9px] text-slate-400 font-medium mt-0.5">Audio Storytelling & Voice Control</p>
                </div>
              </div>
              <span className="text-slate-400 font-black text-xs">&rarr;</span>
            </button>

            {/* Disleksia Mode */}
            <button
              onClick={() => { setSelectedMode('disleksia'); voiceGuide("Mode Disleksia Aktif."); }}
              className="bubbly-card hover:border-teal-300 w-full text-left p-4 rounded-3xl flex items-center justify-between border-2 transition-all group cursor-pointer bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                  ✏️
                </div>
                <div>
                  <h3 className="font-extrabold text-xs text-slate-800 leading-tight">4. Mode Disleksia</h3>
                  <p className="text-[9px] text-slate-400 font-medium mt-0.5">Sensor Tracing & Deteksi Membaca</p>
                </div>
              </div>
              <span className="text-slate-400 font-black text-xs">&rarr;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
