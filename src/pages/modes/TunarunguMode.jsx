import React from 'react';

export default function TunarunguMode({
  tunarunguComicPage,
  setTunarunguComicPage,
  activeSignWord,
  setActiveSignWord,
  playTone,
  confetti,
  triggerBadgeMinting
}) {
  return (
    <div className="space-y-4">
                <div className="border-b border-sky-100 pb-3 flex justify-between items-center">
                  <h3 className="font-black text-xs text-sky-800 uppercase tracking-wider flex items-center gap-1.5">
                    🤟 Mode Tunarungu - Pembelajaran Visual
                  </h3>
                </div>

                <div className="bubbly-card p-4 rounded-3xl bg-white border-2">
                  <h4 className="font-extrabold text-[11px] text-slate-700 mb-2">Komik Edukasi: Mengenal Planet Bumi</h4>
                  
                  {/* Comic panel container */}
                  <div className="border border-sky-100 rounded-2xl p-3 bg-sky-50/20">
                    {tunarunguComicPage === 0 ? (
                      <div className="space-y-3 relative">
                        {/* Jembatan Bahasa GIF Placeholder (Top Left) */}
                        <div className="absolute -top-2 -left-2 bg-white rounded-lg shadow-sm border border-sky-100 p-1 flex items-center justify-center animate-bounce z-10 w-12 h-12">
                           <span className="text-2xl" title="Avatar BISINDO">🧑‍🏫</span>
                        </div>
                        <div className="w-full h-32 bg-sky-100 rounded-xl flex flex-col items-center justify-center border text-6xl shadow-inner relative overflow-hidden">
                          <span className="animate-float">🌍😊</span>
                          <div className="absolute top-2 right-2 bg-sky-500 text-white text-[8px] px-1.5 py-0.5 rounded font-extrabold">Panel 1</div>
                        </div>
                        <div className="bg-white p-3 rounded-xl border-2 border-slate-100 shadow-sm relative">
                           {/* Comic dialogue bubble tail */}
                           <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l-2 border-t-2 border-slate-100 transform rotate-45"></div>
                           <p className="text-[10px] text-slate-700 font-bold leading-relaxed text-center relative z-10">
                            "Halo! Aku <span onClick={() => setActiveSignWord('Bumi')} className="underline text-sky-600 font-black cursor-pointer bg-sky-100/50 px-1 py-0.5 rounded">BUMI (Isyarat)</span>, planet ketiga dari Matahari. Aku punya banyak <span onClick={() => setActiveSignWord('Air')} className="underline text-sky-600 font-black cursor-pointer bg-sky-100/50 px-1 py-0.5 rounded">AIR (Isyarat)</span> segar!"
                           </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 relative">
                        {/* Jembatan Bahasa GIF Placeholder (Top Left) */}
                        <div className="absolute -top-2 -left-2 bg-white rounded-lg shadow-sm border border-sky-100 p-1 flex items-center justify-center animate-bounce z-10 w-12 h-12">
                           <span className="text-2xl" title="Avatar BISINDO">🧑‍🏫</span>
                        </div>
                        <div className="w-full h-32 bg-green-50 rounded-xl flex flex-col items-center justify-center border text-6xl shadow-inner relative overflow-hidden">
                          <span className="animate-float">🌳🦌</span>
                          <div className="absolute top-2 right-2 bg-sky-500 text-white text-[8px] px-1.5 py-0.5 rounded font-extrabold">Panel 2</div>
                        </div>
                        <div className="bg-white p-3 rounded-xl border-2 border-slate-100 shadow-sm relative">
                           {/* Comic dialogue bubble tail */}
                           <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l-2 border-t-2 border-slate-100 transform rotate-45"></div>
                           <p className="text-[10px] text-slate-700 font-bold leading-relaxed text-center relative z-10">
                            "Karena aku punya air dan oksigen, banyak makhluk <span onClick={() => setActiveSignWord('Hidup')} className="underline text-sky-600 font-black cursor-pointer bg-sky-100/50 px-1 py-0.5 rounded">HIDUP (Isyarat)</span> tinggal bersamaku!"
                           </p>
                        </div>
                      </div>
                    )}

                    {/* Sign Language dictionary overlay modal */}
                    {activeSignWord && (
                      <div className="mt-3 p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-start gap-3 animate-float relative overflow-hidden">
                        {/* Simulate 3D Avatar GIF container */}
                        <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm border border-sky-100">
                           <span className="text-2xl animate-pulse">🧑‍🏫</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-sky-800">Kamus Isyarat BISINDO: "{activeSignWord}"</p>
                          <p className="text-[8px] text-slate-500 mt-0.5 leading-relaxed">
                            {activeSignWord === 'Bumi' 
                              ? 'Kedua tangan membentuk lingkaran besar di depan dada yang berputar perlahan menyerupai bola dunia.' 
                              : activeSignWord === 'Air'
                              ? 'Tangan meniru gerakan air mengalir bergelombang dari atas ke bawah.'
                              : 'Kedua tangan dikepalkan di depan dada lalu digerakkan ke atas, melambangkan kehidupan yang tumbuh.'
                            }
                          </p>
                          <button
                            onClick={() => setActiveSignWord(null)}
                            className="text-[8px] font-black text-sky-600 underline mt-1 block"
                          >
                            Tutup Kamus
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Comic Pagination */}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => setTunarunguComicPage(0)}
                      disabled={tunarunguComicPage === 0}
                      className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl text-[9px] font-black disabled:opacity-40"
                    >
                      Kembali
                    </button>
                    <span className="text-[9px] font-bold text-slate-400">{tunarunguComicPage + 1} / 2</span>
                    <button
                      onClick={() => {
                        if (tunarunguComicPage === 0) {
                          setTunarunguComicPage(1);
                          playTone(440, 'sine', 0.1);
                        } else {
                          playTone(523.25, 'sine', 0.15);
                          setTimeout(() => playTone(659.25, 'sine', 0.25), 150);
                          confetti();
                          triggerBadgeMinting('tunarungu');
                        }
                      }}
                      className="bg-sky-500 text-white px-3 py-1.5 rounded-xl text-[9px] font-black border-b-3 border-sky-700"
                    >
                      {tunarunguComicPage === 0 ? 'Selanjutnya' : 'Selesaikan Pembelajaran ✓'}
                    </button>
                  </div>
                </div>
              </div>
  );
}
