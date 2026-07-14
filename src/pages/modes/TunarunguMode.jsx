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
                  <h4 className="font-extrabold text-[11px] text-slate-700 mb-2">Komik Edukasi: Kunjungan Ke Planet Mars</h4>
                  
                  {/* Comic panel container */}
                  <div className="border border-sky-100 rounded-2xl p-3 bg-sky-50/20">
                    {tunarunguComicPage === 0 ? (
                      <div className="space-y-3">
                        <div className="w-full h-32 bg-white rounded-xl flex items-center justify-center border text-6xl shadow-inner relative">
                          🚀👨‍🚀
                          <div className="absolute top-2 right-2 bg-sky-500 text-white text-[8px] px-1.5 py-0.5 rounded font-extrabold">Panel 1</div>
                        </div>
                        <p className="text-[10px] text-slate-600 font-bold leading-relaxed">
                          "Kancil memakai helm luar angkasa. Ia bersiap meluncur ke <span onClick={() => setActiveSignWord('Mars')} className="underline text-sky-600 font-black cursor-pointer bg-sky-100/50 px-1 py-0.5 rounded">Mars (Isyarat)</span> untuk mencari air es!"
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-full h-32 bg-white rounded-xl flex items-center justify-center border text-6xl shadow-inner relative">
                          🪐🧊
                          <div className="absolute top-2 right-2 bg-sky-500 text-white text-[8px] px-1.5 py-0.5 rounded font-extrabold">Panel 2</div>
                        </div>
                        <p className="text-[10px] text-slate-600 font-bold leading-relaxed">
                          "Wow! Mars dingin sekali. Di kutubnya terdapat es tebal. Mari bantu Kancil melacak <span onClick={() => setActiveSignWord('Orbit')} className="underline text-sky-600 font-black cursor-pointer bg-sky-100/50 px-1 py-0.5 rounded">Orbit (Isyarat)</span> matahari."
                        </p>
                      </div>
                    )}

                    {/* Sign Language dictionary overlay modal */}
                    {activeSignWord && (
                      <div className="mt-3 p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-center gap-3 animate-float">
                        <span className="text-3xl">🤟</span>
                        <div>
                          <p className="text-[10px] font-black text-sky-800">Kamus Isyarat BISINDO: "{activeSignWord}"</p>
                          <p className="text-[8px] text-slate-500 mt-0.5 leading-relaxed">
                            {activeSignWord === 'Mars' 
                              ? 'Gerakkan tangan membentuk lingkaran merah di depan dada, lalu kuncupkan jari menandakan debu oksida.' 
                              : 'Putar tangan kanan mengitari tangan kiri yang mengepal diam, mewakili revolusi planet melingkari matahari.'
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
