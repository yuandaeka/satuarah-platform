import React from 'react';
import confetti from 'canvas-confetti';
import { REGULER_LYRICS } from '../../constants';
import { playTone } from '../../utils/audio';

export default function RegulerMode({
  regulerSubMode,
  setRegulerSubMode,
  regulerSlide,
  setRegulerSlide,
  karaokePlaying,
  setKaraokePlaying,
  karaokeLyricIndex,
  triggerBadgeMinting,
}) {
  return (
    <div className="space-y-4">
      <div className="border-b border-emerald-100 pb-3 flex justify-between items-center">
        <h3 className="font-black text-xs text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
          🎓 Mode Reguler
        </h3>
      </div>

      {/* Sub mode selector */}
      {!regulerSubMode ? (
        <div className="space-y-3 py-6">
          <h4 className="text-xs font-black text-slate-700 text-center">Pilih media pembelajaran favoritmu:</h4>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => setRegulerSubMode('visual')}
              className="bubbly-card p-5 rounded-3xl text-center border-2 border-emerald-100 hover:border-emerald-400 active:scale-98 transition-all"
            >
              <span className="text-3xl block mb-2">🎨</span>
              <p className="font-extrabold text-xs text-slate-800">Media Visual (Kartun)</p>
              <p className="text-[8px] text-slate-400 mt-1">Pembelajaran menggunakan slide ilustrasi bergambar ciamik</p>
            </button>

            <button
              onClick={() => setRegulerSubMode('audio')}
              className="bubbly-card p-5 rounded-3xl text-center border-2 border-emerald-100 hover:border-emerald-400 active:scale-98 transition-all"
            >
              <span className="text-3xl block mb-2">🎵</span>
              <p className="font-extrabold text-xs text-slate-800">Media Audio (Ubah ke Lagu)</p>
              <p className="text-[8px] text-slate-400 mt-1">Mengubah materi teks menjadi ejaan lagu berima yang asyik</p>
            </button>
          </div>
        </div>
      ) : regulerSubMode === 'visual' ? (
        /* Visual Sub mode slides */
        <div className="space-y-4">
          <div className="bubbly-card p-4 rounded-3xl text-center bg-white border-2">
            <div className="w-full h-36 bg-emerald-50 rounded-2xl flex items-center justify-center text-6xl shadow-inner mb-4 animate-float">
              {regulerSlide === 0 ? '🪐' : regulerSlide === 1 ? '🔴' : '🌞'}
            </div>
            
            {regulerSlide === 0 && (
              <div>
                <h4 className="font-black text-sm text-slate-800 leading-tight">Mengenal Planet Mars</h4>
                <p className="text-[10px] text-slate-500 font-semibold mt-2 leading-relaxed">
                  Mars adalah planet keempat dari Matahari. Permukaan Mars dipenuhi besi karat yang membuatnya tampak kemerahan di langit malam!
                </p>
              </div>
            )}

            {regulerSlide === 1 && (
              <div>
                <h4 className="font-black text-sm text-slate-800 leading-tight">Atmosfer yang Tipis</h4>
                <p className="text-[10px] text-slate-500 font-semibold mt-2 leading-relaxed">
                  Tidak seperti Bumi, Mars memiliki atmosfer yang sangat tipis dan sebagian besar terbuat dari karbon dioksida. Di sana sangat dingin!
                </p>
              </div>
            )}

            {regulerSlide === 2 && (
              <div>
                <h4 className="font-black text-sm text-slate-800 leading-tight">Kuis Cepat: Lencana Menunggumu!</h4>
                <p className="text-[10px] text-slate-600 font-bold mt-2 leading-relaxed">
                  Planet apa yang memiliki warna merah menyala karena debu besi berkarat?
                </p>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={() => {
                      playTone(523.25, 'sine', 0.15);
                      setTimeout(() => playTone(659.25, 'sine', 0.25), 150);
                      confetti();
                      triggerBadgeMinting('reguler');
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[9px] py-2 px-3 rounded-xl cursor-pointer"
                  >
                    Mars
                  </button>
                  <button
                    onClick={() => {
                      playTone(220, 'triangle', 0.35);
                      alert("Kurang tepat, dibaca lagi ya!");
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-[9px] py-2 px-3 rounded-xl cursor-pointer"
                  >
                    Jupiter
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Slides controller */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setRegulerSlide(prev => Math.max(0, prev - 1))}
              disabled={regulerSlide === 0}
              className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-[9px] font-black border border-slate-200 disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <span className="text-[9px] font-bold text-slate-400">{regulerSlide + 1} / 3</span>
            <button
              onClick={() => setRegulerSlide(prev => Math.min(2, prev + 1))}
              disabled={regulerSlide === 2}
              className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-[9px] font-black border-b-3 border-emerald-700 disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>

          <button
            onClick={() => { setRegulerSubMode(null); setRegulerSlide(0); }}
            className="w-full bg-slate-100 text-slate-600 text-[9px] font-black py-2.5 rounded-xl uppercase tracking-wider mt-4"
          >
            Kembali Pilih Media
          </button>
        </div>
      ) : (
        /* Audio (Lagu) Sub mode */
        <div className="space-y-4">
          <div className="bubbly-card p-5 rounded-3xl text-center bg-white border-2">
            <h4 className="font-black text-xs text-slate-700 mb-1">Mnemonic Audio Player</h4>
            <p className="text-[9px] text-slate-400 font-semibold mb-4">Mengubah teks "Astrofisika Mars" menjadi lagu berima</p>
            
            {/* Player panel visualizer */}
            <div className="w-full bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[120px] mb-4">
              {karaokePlaying ? (
                <div className="flex items-center gap-1.5 justify-center mb-4">
                  <span className="w-1.5 bg-emerald-400 h-8 rounded-full animate-bounce"></span>
                  <span className="w-1.5 bg-emerald-300 h-12 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 bg-emerald-500 h-6 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                  <span className="w-1.5 bg-emerald-300 h-10 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                  <span className="w-1.5 bg-emerald-400 h-8 rounded-full animate-bounce"></span>
                </div>
              ) : (
                <div className="text-3xl mb-3 text-slate-500 animate-pulse">🎵</div>
              )}
              
              {/* Synchronous Karaoke lyrics display */}
              <div className="min-h-[30px] flex items-center justify-center px-2">
                {karaokeLyricIndex !== -1 ? (
                  <p className="text-[10px] text-emerald-400 font-black tracking-wide text-center leading-snug animate-pulse">
                    {REGULER_LYRICS[karaokeLyricIndex].text}
                  </p>
                ) : (
                  <p className="text-[9px] text-slate-500 font-bold text-center">
                    Klik Putar Lagu di bawah untuk mulai memutar lagu mnemonic
                  </p>
                )}
              </div>
            </div>

            {/* Music actions */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  playTone(600, 'sine', 0.05);
                  setKaraokePlaying(!karaokePlaying);
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[9px] py-2 px-4 rounded-xl flex items-center gap-1.5"
              >
                {karaokePlaying ? '🛑 Hentikan Lagu' : '▶️ Putar Lagu Mnemonic'}
              </button>
            </div>
          </div>

          <button
            onClick={() => { setRegulerSubMode(null); setKaraokePlaying(false); }}
            className="w-full bg-slate-100 text-slate-600 text-[9px] font-black py-2.5 rounded-xl uppercase tracking-wider mt-4"
          >
            Kembali Pilih Media
          </button>
        </div>
      )}
    </div>
  );
}
