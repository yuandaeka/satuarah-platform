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
    const text = "Bumi adalah planet ketiga dari Matahari dalam Tata Surya. Bumi adalah satu-satunya planet yang memiliki kehidupan karena memiliki air dan oksigen. Bumi bergerak mengelilingi Matahari bersama planet lainnya.";
    const words = text.split(" ");
    const [currentWordIndex, setCurrentWordIndex] = React.useState(-1);
    const [isPlaying, setIsPlaying] = React.useState(false);

    React.useEffect(() => {
      let interval;
      if (isPlaying) {
        interval = setInterval(() => {
          setCurrentWordIndex((prev) => {
            if (prev + 1 >= words.length) {
              setIsPlaying(false);
              return -1;
            }
            return prev + 1;
          });
        }, 400); // simulated timing 400ms per word
      } else {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }, [isPlaying, words.length]);

    const handlePlay = () => {
      setIsPlaying(true);
      setCurrentWordIndex(0);
      if (typeof speakText === 'function') {
        speakText(text, true);
      }
    };

    const handleStop = () => {
      setIsPlaying(false);
      setCurrentWordIndex(-1);
      if (typeof stopSpeaking === 'function') {
        stopSpeaking();
      }
    };

    return (
      <div className="space-y-4 relative">
        <div className="border-b border-orange-200 pb-3 flex justify-between items-center">
          <h3 className="font-black text-xs text-orange-800 uppercase tracking-wider flex items-center gap-1.5">
            ✏️ Mode Disleksia - Bimodal Presentation
          </h3>
        </div>

        <div className="bubbly-card p-6 rounded-3xl bg-orange-50 border-orange-200 border-2 space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-extrabold text-xs text-orange-900">Teks Ramah Baca</h4>
            <div className="flex gap-2">
              <button 
                onClick={handlePlay}
                disabled={isPlaying}
                className="bg-orange-400 text-white font-bold px-3 py-1.5 rounded-lg text-[9px] disabled:opacity-50"
              >
                ▶️ Putar Audio
              </button>
              <button 
                onClick={handleStop}
                disabled={!isPlaying}
                className="bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-[9px] disabled:opacity-50"
              >
                ⏹️ Stop
              </button>
            </div>
          </div>

          <div className="bg-orange-100/50 p-6 rounded-2xl border border-orange-200 min-h-[150px]">
            <p className="font-sans font-bold tracking-widest text-lg leading-loose text-slate-800">
              {words.map((word, index) => (
                <React.Fragment key={index}>
                  <span 
                    className={`transition-colors duration-200 p-1 rounded ${index === currentWordIndex ? 'bg-yellow-300 text-black' : ''}`}
                  >
                    {word}
                  </span>
                  {' '}
                </React.Fragment>
              ))}
            </p>
          </div>
          
          <div className="bg-white p-3 rounded-xl border border-orange-100 flex items-center gap-3">
             <span className="text-2xl">💡</span>
             <p className="text-[9px] text-slate-500 font-semibold leading-relaxed">
               Latar belakang berwarna Warm Cream (orange) ini membantu mengurangi pantulan cahaya (visual stress), sementara huruf yang tebal dan renggang memudahkan pemrosesan kata bagi mata.
             </p>
          </div>
        </div>
      </div>
  );
}
