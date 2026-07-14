import React from 'react';

export default function TunanetraMode({
  isTunanetraNarrating,
  tunanetraStoryIndex,
  setTunanetraStoryIndex,
  micListeningSimulated,
  tunanetraAnswerResult,
  setTunanetraAnswerResult,
  voiceGuide,
  speakText,
  stopSpeaking,
  startTunanetraMic,
  TUNANETRA_STORIES
}) {
  return (
    <div className="space-y-4">
                <div className="border-b border-yellow-400 pb-3 flex justify-between items-center">
                  <h3 className="font-black text-xs text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                    🎧 Mode Tunanetra
                  </h3>
                </div>

                <div className="bubbly-card p-5 rounded-3xl bg-black border-yellow-400 border-4 text-yellow-400 space-y-4">
                  <div className="text-center">
                    <span className={`text-4xl block ${isTunanetraNarrating ? 'animate-bounce' : 'animate-pulse'}`}>🔊</span>
                    <h4 className="font-black text-sm text-yellow-400 mt-2">
                      {isTunanetraNarrating ? 'Sedang Membaca Cerita...' : 'Mendengarkan Cerita Edukatif'}
                    </h4>
                    <p className="text-[8px] text-yellow-300/80 font-bold mt-1">Audio Storytelling & Komando Suara</p>
                  </div>

                  <div className="border border-yellow-400 rounded-2xl p-4 space-y-2 bg-neutral-900">
                    <p className="text-[10px] font-black text-yellow-300">
                      {TUNANETRA_STORIES[tunanetraStoryIndex].title}
                    </p>
                    <p className="text-[9px] text-yellow-400/90 font-medium leading-relaxed">
                      {TUNANETRA_STORIES[tunanetraStoryIndex].audioText}
                    </p>

                    {/* Audio narrative controllers */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onMouseEnter={() => voiceGuide("Tombol Putar Audio Cerita")}
                        onClick={() => speakText(TUNANETRA_STORIES[tunanetraStoryIndex].audioText, true)}
                        className="bg-yellow-400 text-black font-black text-[9px] py-2 px-3 rounded-lg border-2 border-yellow-500 flex-1"
                      >
                        🔊 Putar Narasi
                      </button>
                      <button
                        onMouseEnter={() => voiceGuide("Tombol Hentikan Audio")}
                        onClick={stopSpeaking}
                        className="bg-black text-yellow-400 font-bold text-[9px] py-2 px-3 rounded-lg border-2 border-yellow-400"
                      >
                        Stop
                      </button>
                    </div>
                  </div>

                  {/* Interactive Voice Quiz */}
                  <div className="border border-dashed border-yellow-400 rounded-2xl p-4 space-y-3 bg-neutral-950">
                    <p className="text-[9px] font-bold text-yellow-300">
                      Kuis Pemahaman: "{TUNANETRA_STORIES[tunanetraStoryIndex].question}"
                    </p>

                    <button
                      onMouseEnter={() => voiceGuide("Tombol tahan untuk menjawab dengan mikrofon")}
                      onClick={startTunanetraMic}
                      disabled={micListeningSimulated}
                      className="w-full bg-yellow-400 text-black font-black py-3 px-4 rounded-xl text-[9px] flex items-center justify-center gap-2"
                    >
                      🎤 {micListeningSimulated ? 'Mendengarkan Suara...' : 'Ketuk & Ucapkan Jawaban'}
                    </button>

                    {tunanetraAnswerResult && (
                      <p className="text-[9px] font-black text-center text-emerald-400 mt-1">
                        {tunanetraAnswerResult}
                      </p>
                    )}
                  </div>

                  {/* Story chapter switcher */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onMouseEnter={() => voiceGuide("Tombol Bab Sebelumnya")}
                      onClick={() => { setTunanetraStoryIndex(0); setTunanetraAnswerResult(''); stopSpeaking(); }}
                      disabled={tunanetraStoryIndex === 0}
                      className="bg-neutral-900 border border-yellow-400 text-yellow-400 px-3 py-1.5 rounded-xl text-[9px] font-bold disabled:opacity-30"
                    >
                      Sebelumnya
                    </button>
                    <button
                      onMouseEnter={() => voiceGuide("Tombol Bab Selanjutnya")}
                      onClick={() => { setTunanetraStoryIndex(1); setTunanetraAnswerResult(''); stopSpeaking(); }}
                      disabled={tunanetraStoryIndex === 1}
                      className="bg-yellow-400 text-black px-3 py-1.5 rounded-xl text-[9px] font-black flex-1 text-center"
                    >
                      Lanjut Bab 2
                    </button>
                  </div>
                </div>
              </div>
  );
}
