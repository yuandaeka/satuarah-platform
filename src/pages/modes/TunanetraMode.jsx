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
  // Add spacebar listener
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        speakText(TUNANETRA_STORIES[0].audioText, true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [speakText, TUNANETRA_STORIES]);

  return (
    <div className="space-y-4" style={{ backgroundColor: '#000000', color: '#FFFF00' }}>
      <div className="border-b pb-3 flex justify-between items-center" style={{ borderColor: '#FFFF00' }}>
        <h3 className="font-black text-xs uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#FFFF00' }}>
          🎧 Mode Tunanetra
        </h3>
      </div>

      <div className="bubbly-card p-5 rounded-3xl space-y-4" style={{ backgroundColor: '#000000', borderColor: '#FFFF00', borderWidth: '4px' }}>
        <div className="text-center">
          <div className="flex justify-center items-end gap-1 h-12 mb-2">
            {/* Audio Wave Visualizer */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i}
                className="w-2 rounded-t-sm"
                style={{ 
                  backgroundColor: '#FFFF00', 
                  height: isTunanetraNarrating ? `${Math.random() * 80 + 20}%` : '20%',
                  transition: 'height 0.1s ease',
                  animation: isTunanetraNarrating ? `bounce ${0.5 + i * 0.1}s infinite alternate` : 'none'
                }}
              ></div>
            ))}
          </div>
          <h4 className="font-black text-sm mt-2" style={{ color: '#FFFF00' }}>
            {isTunanetraNarrating ? 'Sedang Membaca Cerita...' : 'Mendengarkan Cerita Edukatif'}
          </h4>
          <p className="text-[8px] font-bold mt-1" style={{ color: '#FFFF00' }}>Tekan tombol spasi panjang untuk mengulangi cerita ini.</p>
        </div>

        <div className="border rounded-2xl p-4 space-y-2" style={{ backgroundColor: '#000000', borderColor: '#FFFF00' }}>
          <p className="text-[10px] font-black" style={{ color: '#FFFF00' }}>
            {TUNANETRA_STORIES[0].title}
          </p>
          <p className="text-[9px] font-medium leading-relaxed" style={{ color: '#FFFF00' }}>
            {TUNANETRA_STORIES[0].audioText}
          </p>

          {/* Audio narrative controllers */}
          <div className="flex gap-2 pt-2">
            <button
              onMouseEnter={() => voiceGuide("Tombol Putar Audio Cerita")}
              onClick={() => speakText(TUNANETRA_STORIES[0].audioText, true)}
              className="font-black text-[9px] py-2 px-3 rounded-lg border-2 flex-1 hover:scale-105 transition-transform"
              style={{ backgroundColor: '#FFFF00', color: '#000000', borderColor: '#FFFF00' }}
            >
              🔊 Putar Narasi (Atau Tekan Spasi)
            </button>
            <button
              onMouseEnter={() => voiceGuide("Tombol Hentikan Audio")}
              onClick={stopSpeaking}
              className="font-bold text-[9px] py-2 px-3 rounded-lg border-2 hover:scale-105 transition-transform"
              style={{ backgroundColor: '#000000', color: '#FFFF00', borderColor: '#FFFF00' }}
            >
              Stop
            </button>
          </div>
        </div>

        {/* Interactive Voice Quiz */}
        <div className="border border-dashed rounded-2xl p-4 space-y-3" style={{ backgroundColor: '#000000', borderColor: '#FFFF00' }}>
          <p className="text-[9px] font-bold" style={{ color: '#FFFF00' }}>
            Kuis Pemahaman: "{TUNANETRA_STORIES[0].question}"
          </p>

          <button
            onMouseEnter={() => voiceGuide("Tombol tahan untuk menjawab dengan mikrofon")}
            onClick={startTunanetraMic}
            disabled={micListeningSimulated}
            className="w-full font-black py-3 px-4 rounded-xl text-[9px] flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            style={{ backgroundColor: '#FFFF00', color: '#000000' }}
          >
            🎤 {micListeningSimulated ? 'Mendengarkan Suara...' : 'Ketuk & Ucapkan Jawaban'}
          </button>

          {tunanetraAnswerResult && (
            <p className="text-[9px] font-black text-center mt-1" style={{ color: '#FFFF00' }}>
              {tunanetraAnswerResult}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
