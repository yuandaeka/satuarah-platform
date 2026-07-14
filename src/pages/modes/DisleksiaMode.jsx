import React from 'react';

export default function DisleksiaMode({
  rulerActive,
  setRulerActive,
  rulerTop,
  setRulerTop,
  disleksiaChallenge,
  setDisleksiaChallenge,
  isDyslexiaTracing,
  dyslexiaTraceComplete,
  dyslexiaCanvasRef,
  handleTraceMouseDown,
  handleTraceMouseMove,
  handleTraceMouseUp,
  setupTraceCanvas,
  verifyDyslexiaTrace,
  dyslexiaMouthShape,
  isReadingMicActive,
  startDyslexiaReadingMic,
  readingResultText,
  dyslexiaPronounceCorrect
}) {
  return (
    <div className="space-y-4 relative">
                
                {/* DYSLEXIA READING RULER */}
                {rulerActive && (
                  <div
                    id="reading-ruler"
                    style={{ top: `${rulerTop}px` }}
                  />
                )}

                <div className="border-b border-teal-100 pb-3 flex justify-between items-center">
                  <h3 className="font-black text-xs text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                    ✏️ Mode Disleksia - Pembelajaran Multisensori
                  </h3>
                </div>

                <div className="bubbly-card p-4 rounded-3xl bg-cream-50 border-teal-200 border-2 space-y-4">
                  {/* Reading Ruler position control panel */}
                  <div className="flex justify-between items-center bg-white/70 p-2.5 rounded-2xl border border-teal-100">
                    <span className="text-[9px] font-black text-teal-800 flex items-center gap-1">
                      📖 Penggaris Fokus Aktif
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setRulerTop(prev => Math.max(100, prev - 35))}
                        className="bg-teal-100 text-teal-700 w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center active:scale-90"
                        title="Geser Penggaris Naik"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => setRulerTop(prev => Math.min(500, prev + 35))}
                        className="bg-teal-100 text-teal-700 w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center active:scale-90"
                        title="Geser Penggaris Turun"
                      >
                        ▼
                      </button>
                      <button
                        onClick={() => setRulerActive(!rulerActive)}
                        className="bg-teal-600 text-white px-2.5 py-0.5 rounded-lg text-[8px] font-bold"
                      >
                        {rulerActive ? 'Matikan' : 'Aktifkan'}
                      </button>
                    </div>
                  </div>

                  {/* Challenge Selection */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDisleksiaChallenge('trace')}
                      className={`py-2 px-3 rounded-2xl text-[9px] font-black border-2 transition-all ${
                        disleksiaChallenge === 'trace'
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-slate-200 bg-white text-slate-500'
                      }`}
                    >
                      ✏️ 1. Sensor Tracing Kamera
                    </button>
                    <button
                      onClick={() => setDisleksiaChallenge('read')}
                      className={`py-2 px-3 rounded-2xl text-[9px] font-black border-2 transition-all ${
                        disleksiaChallenge === 'read'
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-slate-200 bg-white text-slate-500'
                      }`}
                    >
                      👄 2. Karakter Mulut & Suara
                    </button>
                  </div>

                  {/* Challenge 1: Letter Tracing */}
                  {disleksiaChallenge === 'trace' && (
                    <div className="space-y-3">
                      <p className="text-[9px] text-slate-600 font-semibold leading-relaxed">
                        Tantangan Motorik: Gunakan jari/mouse Anda untuk melacak kata <strong className="text-teal-700">MARS</strong> di papan tulis digital di bawah.
                      </p>

                      <div className="border-3 border-dashed border-teal-200 rounded-2xl overflow-hidden bg-white">
                        <canvas
                          ref={dyslexiaCanvasRef}
                          width={320}
                          height={140}
                          onMouseDown={handleTraceMouseDown}
                          onMouseMove={handleTraceMouseMove}
                          onMouseUp={handleTraceMouseUp}
                          onTouchStart={handleTraceMouseDown}
                          onTouchMove={handleTraceMouseMove}
                          onTouchEnd={handleTraceMouseUp}
                          className="w-full bg-white block cursor-crosshair"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={setupTraceCanvas}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-[9px] py-2 px-3 rounded-xl"
                        >
                          Bersihkan Papan
                        </button>
                        <button
                          onClick={verifyDyslexiaTrace}
                          className="bg-teal-500 hover:bg-teal-600 text-white font-black text-[9px] py-2 px-4 rounded-xl flex-1 border-b-3 border-teal-700"
                        >
                          Kirim & Verifikasi Tracing ✓
                        </button>
                      </div>

                      {dyslexiaTraceComplete && (
                        <p className="text-[9px] font-black text-emerald-600 text-center animate-bounce">
                          Hebat! Tracing huruf terekam dengan sukses di memori otot Anda.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Challenge 2: Pronunciation & Mouth Shape character guide */}
                  {disleksiaChallenge === 'read' && (
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-2xl border border-teal-100 flex items-center gap-4">
                        
                        {/* Interactive mouth mascot */}
                        <div className="w-16 h-16 rounded-2xl bg-teal-100 border border-teal-200 flex flex-col items-center justify-center text-3xl shadow-inner relative overflow-hidden">
                          {dyslexiaMouthShape === 'neutral' && '🤖'}
                          {dyslexiaMouthShape === 'a' && '😮'}
                          {dyslexiaMouthShape === 'u' && '👄'}
                          {dyslexiaMouthShape === 'i' && '😬'}
                          <span className="absolute bottom-1 text-[8px] bg-teal-600 text-white px-1 rounded font-bold uppercase">AI Mascot</span>
                        </div>

                        <div>
                          <h5 className="font-extrabold text-[10px] text-teal-800">Panduan Syllable Phonetics</h5>
                          <p className="text-[8px] text-slate-500 mt-0.5 leading-relaxed">
                            Ikuti gerakan ejaan mulut robot di samping untuk melafalkan kata <strong className="text-teal-700 font-black">"Satu Arah"</strong> secara terstruktur.
                          </p>
                        </div>
                      </div>

                      <div className="border border-dashed border-teal-300 rounded-2xl p-4 bg-teal-50/50 text-center space-y-3">
                        <p className="text-xs font-black text-teal-900 tracking-wider">
                          Sa - tu &nbsp; A - rah
                        </p>

                        <button
                          onClick={startDyslexiaReadingMic}
                          disabled={isReadingMicActive}
                          className="w-full bg-teal-500 text-white font-black py-3 px-4 rounded-xl text-[9px] flex items-center justify-center gap-1.5 border-b-3 border-teal-700"
                        >
                          🎤 {isReadingMicActive ? 'Mendengarkan Suara...' : 'Mulai Membaca Sekarang'}
                        </button>

                        {readingResultText && (
                          <p className="text-[9px] font-bold text-slate-500 mt-1">
                            {readingResultText}
                          </p>
                        )}
                        {dyslexiaPronounceCorrect && (
                          <p className="text-[9px] font-black text-emerald-600 animate-pulse mt-0.5">
                            Pengucapan Valid! Anda menyelesaikan modul membaca Disleksia.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
  );
}
