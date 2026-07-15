import React from 'react';

export default function Belajar({ setSelectedMode, voiceGuide, speakText }) {
  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h2 className="text-lg font-black text-slate-800 leading-tight">Pilih Adaptasi Belajar:</h2>
        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Pilih mode yang disesuaikan dengan kebutuhan belajarmu.</p>
      </div>

      {/* GRID OF 4 ADAPTATION OPTIONS FOR ABK */}
      <div className="flex flex-col gap-3">
        {/* ADHD Mode */}
        <button
          onClick={() => { setSelectedMode('adhd'); voiceGuide("Mode ADHD Aktif."); }}
          className="bubbly-card hover:border-pink-300 w-full text-left p-4 rounded-3xl flex items-center justify-between border-2 transition-all group"
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
          className="bubbly-card hover:border-sky-300 w-full text-left p-4 rounded-3xl flex items-center justify-between border-2 transition-all group"
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
          className="bubbly-card hover:border-yellow-400 w-full text-left p-4 rounded-3xl flex items-center justify-between border-2 transition-all group"
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
          className="bubbly-card hover:border-teal-300 w-full text-left p-4 rounded-3xl flex items-center justify-between border-2 transition-all group"
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
  );
}
