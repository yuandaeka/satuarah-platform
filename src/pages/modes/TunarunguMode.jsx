import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import ABKAdaptiveView from './ABKAdaptiveView';

export default function TunarunguMode({
  tunarunguComicPage,
  setTunarunguComicPage,
  activeSignWord,
  setActiveSignWord,
  playTone,
  confetti: globalConfetti,
  triggerBadgeMinting,
  setSelectedMode,
  speakText
}) {
  // --- States for the interactive Dashboard ---
  const [crystalCount, setCrystalCount] = useState(12);
  const [activeZone, setActiveZone] = useState('main'); // 'main' | 'kampung' | 'perpustakaan' | 'studio' | 'arena'
  
  // Video Sign Guide States
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(35);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [videoSubtitle, setVideoSubtitle] = useState("Ini adalah rumah.");

  // Card 3: Quiz State
  const [quizAnswer, setQuizAnswer] = useState(null); // 'anjing' | 'kucing' | 'kelinci'
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Panel 2: Interactive Line Matcher
  const [selectedImage, setSelectedImage] = useState(null); // 'daun' | 'akar' | 'bunga'
  const [selectedName, setSelectedName] = useState(null); // 'Akar' | 'Bunga' | 'Daun'
  const [pairings, setPairings] = useState({
    daun: null,
    akar: null,
    bunga: null
  });
  const [pairingFeedback, setPairingFeedback] = useState({}); // { daun: 'correct'/'wrong' }

  // Modal Kamus Isyarat state
  const [isKamusOpen, setIsKamusOpen] = useState(false);
  const [searchKamus, setSearchKamus] = useState('');

  // Audio helper
  const playClickSound = (freq = 480) => {
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  };

  // Video progress simulation
  useEffect(() => {
    let interval;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setIsVideoPlaying(false);
            return 0;
          }
          const next = prev + 5;
          if (next < 30) setVideoSubtitle("Ini adalah rumah.");
          else if (next < 70) setVideoSubtitle("Rumah ini sangat bersih.");
          else setVideoSubtitle("Saya tinggal bersama keluarga.");
          return next;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  // Quiz handler
  const handleQuizSelect = (ans) => {
    if (quizCompleted) return;
    playClickSound(ans === 'kucing' ? 600 : 200);
    setQuizAnswer(ans);
    if (ans === 'kucing') {
      setQuizCompleted(true);
      setCrystalCount(prev => Math.min(50, prev + 1));
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
      if (typeof triggerBadgeMinting === 'function') {
        triggerBadgeMinting('tunarungu');
      }
    }
  };

  // Line Matcher verification
  const handleImageSelect = (img) => {
    if (pairings[img]) return; // already paired
    playClickSound(520);
    setSelectedImage(img);
    if (selectedName) verifyPairing(img, selectedName);
  };

  const handleNameSelect = (name) => {
    if (Object.values(pairings).includes(name)) return; // already paired
    playClickSound(520);
    setSelectedName(name);
    if (selectedImage) verifyPairing(selectedImage, name);
  };

  const verifyPairing = (img, name) => {
    const isCorrect = (img === 'daun' && name === 'Daun') ||
                      (img === 'akar' && name === 'Akar') ||
                      (img === 'bunga' && name === 'Bunga');

    if (isCorrect) {
      setPairings(prev => ({ ...prev, [img]: name }));
      setPairingFeedback(prev => ({ ...prev, [img]: 'correct' }));
      playClickSound(650);
      confetti({ particleCount: 15, origin: { y: 0.8 } });
      setCrystalCount(prev => Math.min(50, prev + 2));
    } else {
      setPairingFeedback(prev => ({ ...prev, [img]: 'wrong' }));
      playClickSound(180);
      setTimeout(() => {
        setPairingFeedback(prev => ({ ...prev, [img]: null }));
      }, 1000);
    }
    
    setSelectedImage(null);
    setSelectedName(null);
  };

  const resetPairings = () => {
    playClickSound(300);
    setPairings({ daun: null, akar: null, bunga: null });
    setPairingFeedback({});
    setSelectedImage(null);
    setSelectedName(null);
  };

  return (
    <ABKAdaptiveView
      modeName="Tunarungu"
      speakText={speakText}
      triggerBadgeMinting={triggerBadgeMinting}
      setSelectedMode={setSelectedMode}
      renderPraktik={() => (
        <div className="planet-isyarat-dashboard">
      <style dangerouslySetInnerHTML={{ __html: `
        .planet-isyarat-dashboard {
          --space-bg: #07091e;
          --panel-blue: rgba(22, 28, 66, 0.95);
          --accent-yellow: #fbbf24;
          --accent-blue: #3b82f6;
          --accent-green: #10b981;
          
          font-family: 'Poppins', sans-serif;
          background: radial-gradient(circle at center, #161a3f 0%, #050614 100%);
          color: white;
          border-radius: 28px;
          padding: 14px;
          border: 3.5px solid #3b82f6;
          box-shadow: inset 0 0 30px rgba(0,0,0,0.8);
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow-y: auto;
          max-height: 800px;
        }

        /* Scrolled wrapper scrollbar */
        .planet-isyarat-dashboard::-webkit-scrollbar {
          width: 4px;
        }
        .planet-isyarat-dashboard::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 10px;
        }

        /* Header Layout (Stacked for Mobile) */
        .pi-header-stacked {
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-align: center;
          align-items: center;
        }
        .pi-title-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .pi-logo-anim {
          font-size: 2rem;
          animation: float 4s ease-in-out infinite;
        }
        .pi-title-text {
          font-size: 1.4rem;
          font-weight: 900;
          line-height: 1.1;
        }
        .pi-title-planet { color: white; }
        .pi-title-isyarat { color: var(--accent-yellow); }
        
        .pi-badge-pill {
          background: var(--accent-blue);
          color: white;
          font-size: 7.5px;
          font-weight: 900;
          padding: 3px 10px;
          border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.2);
          display: inline-block;
          margin-top: 2px;
        }
        .pi-subtitle-desc {
          font-size: 8.5px;
          color: #93c5fd;
          max-width: 320px;
          font-weight: 600;
          line-height: 1.3;
          margin: 4px auto 0 auto;
        }

        /* Speech bubble */
        .pi-speech-bubble-mobile {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 8px 12px;
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
        }
        .pi-bubble-avatar { font-size: 1.8rem; }
        .pi-bubble-msg { font-size: 7.5px; font-weight: 700; color: #e2e8f0; line-height: 1.3; }

        /* Fitur utama block */
        .pi-fitur-list {
          display: grid;
          grid-template-cols: 1fr;
          gap: 8px;
          width: 100%;
        }
        .pi-fitur-card {
          background: var(--panel-blue);
          border: 1.5px solid rgba(59, 130, 246, 0.25);
          border-radius: 18px;
          padding: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .pi-fitur-card:active { transform: scale(0.97); }
        .pi-fitur-icon-circle {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .pi-fitur-content h4 { font-size: 10px; font-weight: 900; color: white; margin: 0; }
        .pi-fitur-content p { font-size: 8px; color: #93c5fd; margin: 0; }

        /* Planet Map Container (Optimized Mobile height) */
        .pi-map-wrapper {
          background: rgba(8, 6, 27, 0.65);
          border: 2px solid rgba(59, 130, 246, 0.3);
          border-radius: 24px;
          height: 210px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          width: 100%;
        }
        .pi-island-sphere {
          width: 110px;
          height: 110px;
          background: radial-gradient(circle at 30% 30%, #93c5fd 0%, #3b82f6 50%, #1e3a8a 100%);
          border-radius: 50%;
          box-shadow: 0 8px 20px rgba(0,0,0,0.5), inset 0 -6px 0 rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .pi-core-gem {
          font-size: 2.2rem;
          cursor: pointer;
          animation: float 4s infinite alternate;
        }

        /* Marker layouts spaced for mobile screen */
        .pi-map-loc {
          position: absolute;
          background: rgba(10, 15, 45, 0.95);
          border: 1.5px solid var(--accent-blue);
          border-radius: 12px;
          padding: 4px 8px;
          cursor: pointer;
          width: 90px;
          text-align: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.4);
        }
        .pi-map-loc h5 { font-size: 7px; font-weight: 900; color: white; margin: 0; }
        .pi-map-loc p { font-size: 5.5px; color: #93c5fd; margin: 0; }
        
        .pi-loc-kampung { top: 8px; left: 8px; }
        .pi-loc-perpustakaan { top: 8px; right: 8px; }
        .pi-loc-studio { bottom: 8px; left: 8px; }
        .pi-loc-arena { bottom: 8px; right: 8px; }

        /* Sign Guide Card stack */
        .pi-guide-box {
          background: var(--panel-blue);
          border: 2px solid rgba(59, 130, 246, 0.2);
          border-radius: 20px;
          padding: 12px;
          width: 100%;
        }
        .pi-guide-header {
          font-size: 9px;
          font-weight: 900;
          color: white;
          letter-spacing: 1px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 4px;
        }
        .pi-video-window {
          background: #020617;
          border-radius: 14px;
          aspect-ratio: 16/9;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid rgba(255,255,255,0.1);
        }
        .pi-video-avatar { font-size: 3rem; animation: signGesture 2s infinite alternate; }
        
        /* Video progress and bottom */
        .pi-video-sub-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0,0,0,0.85);
          color: white;
          font-size: 8px;
          font-weight: 800;
          text-align: center;
          padding: 4px;
        }
        .pi-controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 6px;
        }
        .pi-bar-bg {
          flex: 1;
          background: rgba(255,255,255,0.15);
          height: 3px;
          border-radius: 3px;
          margin: 0 8px;
          overflow: hidden;
        }
        .pi-bar-fill { height: 100%; background: var(--accent-blue); }

        .pi-kamus-block {
          background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 14px;
          padding: 8px 12px;
          font-size: 9px;
          font-weight: 900;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          border: none;
          width: 100%;
          margin-top: 8px;
        }

        .pi-status-bar {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 6px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
        }
        .pi-status-title { font-size: 7.5px; font-weight: 900; color: var(--accent-yellow); display: flex; align-items: center; gap: 4px; }
        .pi-status-val { font-size: 7px; font-weight: 800; color: #93c5fd; }

        /* Progress utility */
        .pi-progress-bar-bg { width: 100%; height: 5px; background: rgba(255,255,255,0.1); border-radius: 10px; margin-top: 4px; overflow: hidden; }
        .pi-progress-bar-fill { height: 100%; background: var(--accent-blue); transition: width 0.3s; }

        /* Learning flow: Horizontal scrollable card container */
        .pi-scroll-container {
          background: rgba(255, 255, 255, 0.02);
          border: 1.5px solid rgba(59, 130, 246, 0.15);
          border-radius: 20px;
          padding: 12px;
          width: 100%;
        }
        .pi-scroll-header {
          font-size: 9.5px;
          font-weight: 900;
          color: var(--accent-yellow);
          text-align: center;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .pi-scroll-cards {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
          scrollbar-width: thin;
        }
        .pi-scroll-cards::-webkit-scrollbar { height: 4px; }
        .pi-scroll-cards::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 10px; }
        
        .pi-scroll-card {
          flex: 0 0 145px;
          background: white;
          color: #1e293b;
          border-radius: 16px;
          padding: 10px;
          border: 1.5px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          position: relative;
          gap: 4px;
        }
        .pi-alur-num {
          position: absolute;
          top: -6px;
          left: 10px;
          width: 15px;
          height: 15px;
          background: var(--accent-yellow);
          color: #78350f;
          font-weight: 900;
          font-size: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pi-alur-title { font-size: 8.5px; font-weight: 900; color: #1e40af; margin-top: 4px; }
        .pi-alur-desc { font-size: 7px; color: #64748b; line-height: 1.2; }
        
        .pi-preview-mini {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 4px;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pi-preview-sub { font-size: 6.5px; font-weight: bold; color: #475569; }

        .pi-preview-plant {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 10px;
          padding: 4px;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pi-plant-tags { display: flex; flex-direction: column; gap: 1px; }
        .pi-plant-tag { font-size: 5.5px; background: #dcfce7; color: #15803d; padding: 0.5px 3px; border-radius: 3px; font-weight: bold; }

        .pi-preview-quiz {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 10px;
          padding: 4px;
          margin-top: 4px;
        }
        .pi-quiz-options-box { display: flex; gap: 3px; justify-content: center; }
        .pi-quiz-opt { background: white; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 10px; width: 22px; height: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .pi-quiz-opt.correct { background: #d1fae5; border-color: #34d399; }

        .pi-preview-gift {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 10px;
          padding: 6px;
          margin-top: 4px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .pi-gift-img { font-size: 12px; }
        .pi-gift-txt { font-size: 6.5px; font-weight: bold; color: #1d4ed8; }

        .pi-preview-lock {
          border-radius: 10px;
          padding: 6px;
          margin-top: 4px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .pi-lock-img { font-size: 12px; }
        .pi-lock-txt { font-size: 6.5px; font-weight: bold; color: #475569; }

        /* 3-card grid (Vertically Stacked for Mobile) */
        .pi-vertical-panels {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }
        .pi-panel-mobile {
          background: var(--panel-blue);
          border: 2.5px solid rgba(59, 130, 246, 0.25);
          border-radius: 22px;
          padding: 14px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.25);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pi-bottom-card-title { font-size: 9.5px; font-weight: 900; color: var(--accent-yellow); border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 4px; margin-bottom: 4px; }
        .pi-materi-theme { font-size: 8.5px; font-weight: 800; color: #93c5fd; }

        /* Visual plant diagram mockup */
        .pi-plant-diagram-box {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 6px;
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .pi-diagram-img {
          width: 45px;
          height: 65px;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
        }
        .pi-diagram-labels {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }
        .pi-diagram-lbl-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 7.5px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 1px;
        }
        .pi-diagram-lbl-name { font-weight: 800; color: white; }
        .pi-diagram-lbl-desc { color: #93c5fd; font-size: 6.5px; }

        .pi-ringkasan-box {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 12px;
          padding: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pi-ringkasan-icon { font-size: 1.2rem; }
        .pi-ringkasan-txt { font-size: 7.5px; color: #a7f3d0; leading-height: 1.3; }

        /* Matching lines canvas layout */
        .pi-matcher-container {
          position: relative;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-top: 4px;
          min-height: 120px;
        }
        .pi-matcher-col {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          gap: 8px;
          z-index: 10;
        }
        .pi-lines-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 5;
        }
        .pi-match-item {
          width: 32px;
          height: 32px;
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pi-match-item:hover { border-color: var(--accent-blue); background: rgba(59,130,246,0.1); }
        .pi-match-item.selected { border-color: var(--accent-yellow); background: rgba(251,191,36,0.15); }
        .pi-match-item.correct { border-color: var(--accent-green); background: rgba(16,185,129,0.15); }
        .pi-match-item.wrong { border-color: #ef4444; background: rgba(239,68,68,0.15); }

        .pi-match-name {
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.15);
          color: white;
          font-size: 8px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 60px;
          text-align: center;
        }
        .pi-match-name:hover { border-color: var(--accent-blue); background: rgba(59,130,246,0.1); }
        .pi-match-name.selected { border-color: var(--accent-yellow); background: rgba(251,191,36,0.15); }
        .pi-match-name.correct { border-color: var(--accent-green); background: rgba(16,185,129,0.15); color: #a7f3d0; }

        .pi-kristal-grid {
          display: grid;
          grid-template-cols: repeat(3, 1fr);
          gap: 6px;
        }
        .pi-kristal-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .pi-kristal-name { font-size: 6.5px; font-weight: bold; color: #94a3b8; }

        /* Footer Nav bar mobile */
        .pi-mobile-nav {
          background: #0f122c !important;
          border-top: 2px solid rgba(59,130,246,0.2) !important;
          border-radius: 16px !important;
          display: flex !important;
          flex-direction: row !important;
          justify-content: space-around !important;
          align-items: center !important;
          padding: 8px 4px !important;
          width: 100% !important;
          margin-top: 8px !important;
        }
        .pi-nav-icon-btn {
          background: none !important;
          border: none !important;
          color: #94a3b8 !important;
          font-size: 8px !important;
          font-weight: 800 !important;
          cursor: pointer !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 2px !important;
          flex: 1 !important;
          text-decoration: none !important;
        }
        .pi-nav-icon-btn.active {
          color: var(--accent-yellow) !important;
        }
        body.mode-tunanetra .pi-nav-icon-btn span {
          color: inherit !important;
        }
        body.mode-tunanetra .pi-nav-icon-btn.active span {
          color: var(--accent-yellow) !important;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes signGesture {
          0% { transform: scale(1) rotate(-3deg); }
          100% { transform: scale(1.05) rotate(3deg); }
        }
      ` }} />

      <div className="pi-stars"></div>

      {/* VIEW A: MAIN ZONE */}
      {activeZone === 'main' && (
        <>
          {/* Header */}
          <header className="pi-header-stacked">
            <div className="pi-title-row">
              <span className="pi-logo-anim">🤟</span>
              <div>
                <h2 className="pi-title-text">
                  <span className="pi-title-planet">PLANET </span>
                  <span className="pi-title-isyarat">ISYARAT</span>
                </h2>
                <span className="pi-badge-pill">MODE TUNARUNGU</span>
              </div>
            </div>
            <p className="pi-subtitle-desc">
              Planet yang seluruh penduduknya berkomunikasi dengan bahasa isyarat.
            </p>
          </header>

          {/* Welcome bubble */}
          <div className="pi-speech-bubble-mobile">
            <span className="pi-bubble-avatar">🧑‍🚀</span>
            <p className="pi-bubble-msg">
              "Halo Explorer! Di planet ini, kamu akan belajar dengan bahasa isyarat."
            </p>
          </div>

          {/* Fitur Utama List */}
          <div className="pi-fitur-list">
            <div onClick={() => { playClickSound(480); setActiveZone('kampung'); }} className="pi-fitur-card">
              <span className="pi-fitur-icon-circle">📹</span>
              <div className="pi-fitur-content">
                <h4>Video Bahasa Isyarat</h4>
                <p>Belajar dengan bahasa isyarat (BISINDO)</p>
              </div>
            </div>

            <div onClick={() => { playClickSound(520); setActiveZone('perpustakaan'); }} className="pi-fitur-card">
              <span className="pi-fitur-icon-circle">Aa</span>
              <div className="pi-fitur-content">
                <h4>Subtitle Otomatis</h4>
                <p>Semua video dilengkapi subtitle</p>
              </div>
            </div>

            <div onClick={() => { playClickSound(560); setActiveZone('studio'); }} className="pi-fitur-card">
              <span className="pi-fitur-icon-circle">🖼️</span>
              <div className="pi-fitur-content">
                <h4>Ilustrasi & Infografis</h4>
                <p>Materi mudah dipahami dengan gambar</p>
              </div>
            </div>

            <div onClick={() => { playClickSound(600); setActiveZone('arena'); }} className="pi-fitur-card">
              <span className="pi-fitur-icon-circle">💎</span>
              <div className="pi-fitur-content">
                <h4>Koleksi Kristal Isyarat</h4>
                <p>Kumpulkan kristal untuk membuka materi baru</p>
              </div>
            </div>
          </div>

          {/* Interactive Floating Map (Mobile Spaced) */}
          <div className="pi-map-wrapper">
            <div className="pi-island-sphere">
              <span onClick={() => { playClickSound(640); confetti({ particleCount: 20 }); }} className="pi-core-gem">💎</span>
            </div>

            <div onClick={() => { setActiveZone('kampung'); playClickSound(520); }} className="pi-map-loc pi-loc-kampung">
              <h5>Kampung Isyarat</h5>
              <p>Belajar video BISINDO</p>
            </div>

            <div onClick={() => { setActiveZone('perpustakaan'); playClickSound(580); }} className="pi-map-loc pi-loc-perpustakaan">
              <h5>Perpustakaan Visual</h5>
              <p>Materi bergambar & teks</p>
            </div>

            <div onClick={() => { setActiveZone('studio'); playClickSound(620); }} className="pi-map-loc pi-loc-studio">
              <h5>Studio Ilustrasi</h5>
              <p>Pahami materi lewat gambar</p>
            </div>

            <div onClick={() => { setActiveZone('arena'); playClickSound(700); }} className="pi-map-loc pi-loc-arena">
              <h5>Arena Tantangan</h5>
              <p>Kuis & kristal baru</p>
            </div>
          </div>

          {/* Sign Guide Video Stack */}
          <div className="pi-guide-box space-y-2">
            <h4 className="pi-guide-header">SIGN GUIDE</h4>
            <div className="pi-video-window">
              <span className="pi-video-avatar">👩‍🏫</span>
              <span className="pi-video-sub-bar">{videoSubtitle}</span>
            </div>
            
            <div className="pi-controls-row">
              <button onClick={() => { playClickSound(400); setIsVideoPlaying(!isVideoPlaying); }} className="text-white text-xs">
                {isVideoPlaying ? '⏸️' : '▶️'}
              </button>
              <div className="pi-bar-bg">
                <div className="pi-bar-fill" style={{ width: `${videoProgress}%` }}></div>
              </div>
              <button onClick={() => setIsVideoMuted(!isVideoMuted)} className="text-white text-xs">
                {isVideoMuted ? '🔇' : '🔊'}
              </button>
            </div>

            <button onClick={() => { playClickSound(500); setIsKamusOpen(true); }} className="pi-kamus-block">
              <span>🤟 KAMUS ISYARAT BISINDO</span>
              <span>&rarr;</span>
            </button>

            <div className="pi-status-bar">
              <span className="pi-status-title">💎 KRISTAL ISYARAT</span>
              <span className="pi-status-val">{crystalCount} / 50</span>
            </div>
            <div className="pi-progress-bar-bg">
              <div className="pi-progress-bar-fill" style={{ width: `${(crystalCount / 50) * 100}%` }}></div>
            </div>
          </div>
        </>
      )}

      {/* VIEW B: ACTIVE LANDMARK SUB-ZONE */}
      {activeZone !== 'main' && (
        <div className="bg-[#1b163e] rounded-2xl p-4 border border-[#3b82f6] relative z-20">
          <div className="flex justify-between items-center border-b border-blue-500/20 pb-2 mb-3">
            <h4 className="font-extrabold text-[10px] text-[#fbbf24] uppercase">
              🪐 ZONA: {activeZone === 'kampung' ? 'Kampung Isyarat' : activeZone === 'perpustakaan' ? 'Perpustakaan Visual' : activeZone === 'studio' ? 'Studio Ilustrasi' : 'Arena Tantangan'}
            </h4>
            <button onClick={() => setActiveZone('main')} className="px-3 py-1 bg-rose-600 text-white font-extrabold text-[7.5px] rounded-full">
              Kembali
            </button>
          </div>

          {activeZone === 'kampung' && (
            <div className="space-y-3">
              <p className="text-[9px] text-sky-200">Belajar bahasa isyarat (BISINDO) langsung dari video interaktif!</p>
              <div className="pi-video-window">
                <span className="pi-video-avatar">👩‍🏫</span>
                <span className="pi-video-sub-bar">Selamat pagi teman-teman!</span>
              </div>
              <p className="text-[8.5px] text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg">
                "Untuk isyarat **Bumi**, satukan ujung jari kedua tangan membentuk lingkaran, lalu putar pelan ke depan seperti bola dunia."
              </p>
            </div>
          )}

          {activeZone === 'perpustakaan' && (
            <div className="space-y-2">
              <p className="text-[9px] text-sky-200">Perpustakaan Visual: Baca kisah interaktif dengan bahasa isyarat.</p>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-blue-500/20">
                <h5 className="font-bold text-[9px] text-amber-400 mb-1">Mengenal Bagian Bunga</h5>
                <p className="text-[8.5px] text-slate-300 leading-relaxed">
                  "Bunga memiliki bagian yang sangat indah seperti mahkota bunga yang harum, putik, benang sari, dan tangkai bunga sebagai penyokong."
                </p>
              </div>
            </div>
          )}

          {activeZone === 'studio' && (
            <div className="space-y-2">
              <p className="text-[9px] text-sky-200">Studio Ilustrasi: Memahami bagian tanaman secara visual.</p>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-blue-500/20 flex gap-3 items-center">
                <span className="text-4xl bg-white p-2 rounded-lg">🌻</span>
                <div className="text-[8.5px] text-slate-300 space-y-1">
                  <div>🍃 <b>Daun:</b> Melakukan fotosintesis.</div>
                  <div>🌸 <b>Bunga:</b> Membantu reproduksi biji.</div>
                  <div>🪵 <b>Akar:</b> Menyerap nutrisi tanah.</div>
                </div>
              </div>
            </div>
          )}

          {activeZone === 'arena' && (
            <div className="text-center py-2 space-y-2">
              <span className="text-3xl">🏆</span>
              <h5 className="font-extrabold text-[9px] text-blue-300">Arena Tantangan Aktif!</h5>
              <p className="text-[8px] text-slate-300 max-w-[240px] mx-auto leading-relaxed">
                Pilih jawaban benar pada kuis kartu nomor 3 di bawah untuk menguji kemampuanmu dan mendapatkan kristal!
              </p>
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: ALUR BELAJAR (Horizontal scroll on mobile) */}
      <section className="pi-scroll-container">
        <h3 className="pi-scroll-header">ALUR BELAJAR DI PLANET ISYARAT</h3>
        <div className="pi-scroll-cards">
          {/* Card 1: Tonton Video */}
          <div className="pi-scroll-card">
            <span className="pi-alur-num">1</span>
            <h4 className="pi-alur-title">TONTON VIDEO ISYARAT</h4>
            <p className="pi-alur-desc">Tonton video bahasa isyarat tentang materi.</p>
            <div className="pi-preview-mini">
              <span>👩‍🏫</span>
              <span className="pi-preview-sub">BISINDO Guide</span>
            </div>
          </div>

          {/* Card 2: Pahami melalui Ilustrasi */}
          <div className="pi-scroll-card">
            <span className="pi-alur-num">2</span>
            <h4 className="pi-alur-title">PAHAMI MATERI</h4>
            <p className="pi-alur-desc">Pahami bagian melalui gambar tumbuhan.</p>
            <div className="pi-preview-plant">
              <span className="pi-plant-img">🌱</span>
              <div className="pi-plant-tags">
                <span className="pi-plant-tag">Daun</span>
                <span className="pi-plant-tag">Bunga</span>
                <span className="pi-plant-tag">Akar</span>
              </div>
            </div>
          </div>

          {/* Card 3: Kerjakan Tantangan */}
          <div className="pi-scroll-card">
            <span className="pi-alur-num">3</span>
            <h4 className="pi-alur-title">KERJAKAN TANTANGAN</h4>
            <p className="pi-alur-desc">Manakah gambar kucing?</p>
            <div className="pi-preview-quiz">
              <div className="pi-quiz-options-box">
                <button onClick={() => handleQuizSelect('anjing')} className={`pi-quiz-opt ${quizAnswer === 'anjing' ? 'border-red-500 bg-red-50' : ''}`}>🐶</button>
                <button onClick={() => handleQuizSelect('kucing')} className={`pi-quiz-opt ${quizCompleted ? 'correct' : ''}`}>🐱 {quizCompleted && '✓'}</button>
                <button onClick={() => handleQuizSelect('kelinci')} className={`pi-quiz-opt ${quizAnswer === 'kelinci' ? 'border-red-500 bg-red-50' : ''}`}>🐰</button>
              </div>
            </div>
          </div>

          {/* Card 4: Dapatkan Kristal */}
          <div className="pi-scroll-card">
            <span className="pi-alur-num">4</span>
            <h4 className="pi-alur-title">DAPATKAN KRISTAL</h4>
            <p className="pi-alur-desc">Jawaban benar! Kamu mendapat Kristal.</p>
            <div className="pi-preview-gift">
              <span className="pi-gift-img">💎</span>
              <span className="pi-gift-txt">{quizCompleted ? '+1 Kristal!' : 'Belum Kuis'}</span>
            </div>
          </div>

          {/* Card 5: Buka Materi Baru */}
          <div className="pi-scroll-card">
            <span className="pi-alur-num">5</span>
            <h4 className="pi-alur-title">BUKA MATERI BARU</h4>
            <p className="pi-alur-desc">Butuh 20 Kristal untuk membuka materi rahasia.</p>
            <div className="pi-preview-lock" style={{ background: crystalCount >= 20 ? '#d1fae5' : '#f1f5f9' }}>
              <span className="pi-lock-img">{crystalCount >= 20 ? '🔓' : '🔒'}</span>
              <span className="pi-lock-txt">{crystalCount >= 20 ? 'Terbuka' : '20 Kristal'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: BAGIAN KONTEN BAWAH (Vertically Stacked for Mobile) */}
      <div className="pi-vertical-panels">
        {/* Column 1: Contoh Materi */}
        <div className="pi-panel-mobile">
          <h4 className="pi-bottom-card-title">CONTOH MATERI</h4>
          <span className="pi-materi-theme">TEMA: TUMBUHAN</span>
          
          <div className="pi-plant-diagram-box">
            <div className="pi-diagram-img">🌻</div>
            <div className="pi-diagram-labels">
              <div className="pi-diagram-lbl-row">
                <span className="pi-diagram-lbl-name">🍃 daun</span>
                <span className="pi-diagram-lbl-desc">fotosintesis</span>
              </div>
              <div className="pi-diagram-lbl-row">
                <span className="pi-diagram-lbl-name">🌸 bunga</span>
                <span className="pi-diagram-lbl-desc">reproduksi</span>
              </div>
              <div className="pi-diagram-lbl-row">
                <span className="pi-diagram-lbl-name">🪵 batang</span>
                <span className="pi-diagram-lbl-desc">saluran nutrisi</span>
              </div>
              <div className="pi-diagram-lbl-row">
                <span className="pi-diagram-lbl-name">🌱 akar</span>
                <span className="pi-diagram-lbl-desc">penyerap air</span>
              </div>
            </div>
          </div>

          <div className="pi-ringkasan-box">
            <span className="pi-ringkasan-icon">💡</span>
            <p className="pi-ringkasan-txt">
              <b>Ringkasan:</b> Tumbuhan memiliki bagian-bagian penting yang membantu mereka tumbuh dengan baik.
            </p>
          </div>
        </div>

        {/* Column 2: Tantangan Visual */}
        <div className="pi-panel-mobile relative">
          <h4 className="pi-bottom-card-title">TANTANGAN VISUAL</h4>
          <p className="text-[7.5px] font-bold text-slate-400 mb-2">Pasangkan gambar dengan namanya!</p>
          
          <div className="pi-matcher-container">
            <svg className="pi-lines-svg">
              {pairings.daun && <line x1="16%" y1="20%" x2="84%" y2="80%" stroke="#10b981" strokeWidth="2.5" />}
              {pairings.akar && <line x1="16%" y1="50%" x2="84%" y2="20%" stroke="#10b981" strokeWidth="2.5" />}
              {pairings.bunga && <line x1="16%" y1="80%" x2="84%" y2="50%" stroke="#10b981" strokeWidth="2.5" />}
            </svg>

            {/* Left elements (Images) */}
            <div className="pi-matcher-col items-start">
              <div onClick={() => handleImageSelect('daun')} className={`pi-match-item ${selectedImage === 'daun' ? 'selected' : ''} ${pairings.daun ? 'correct' : ''}`}>
                <span className="text-xl">🍃</span>
              </div>
              <div onClick={() => handleImageSelect('akar')} className={`pi-match-item ${selectedImage === 'akar' ? 'selected' : ''} ${pairings.akar ? 'correct' : ''}`}>
                <span className="text-xl">🪵</span>
              </div>
              <div onClick={() => handleImageSelect('bunga')} className={`pi-match-item ${selectedImage === 'bunga' ? 'selected' : ''} ${pairings.bunga ? 'correct' : ''}`}>
                <span className="text-xl">🌸</span>
              </div>
            </div>

            {/* Right elements (Names) */}
            <div className="pi-matcher-col items-end">
              <button onClick={() => handleNameSelect('Akar')} className={`pi-match-name ${selectedName === 'Akar' ? 'selected' : ''} ${Object.values(pairings).includes('Akar') ? 'correct' : ''}`}>Akar</button>
              <button onClick={() => handleNameSelect('Bunga')} className={`pi-match-name ${selectedName === 'Bunga' ? 'selected' : ''} ${Object.values(pairings).includes('Bunga') ? 'correct' : ''}`}>Bunga</button>
              <button onClick={() => handleNameSelect('Daun')} className={`pi-match-name ${selectedName === 'Daun' ? 'selected' : ''} ${Object.values(pairings).includes('Daun') ? 'correct' : ''}`}>Daun</button>
            </div>
          </div>

          <button onClick={resetPairings} className="py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-[8px] rounded-lg mt-2 transition-colors">
            Reset Pasangan
          </button>
        </div>

        {/* Column 3: Koleksi Kristal */}
        <div className="pi-panel-mobile">
          <h4 className="pi-bottom-card-title">KOLEKSI KRISTAL ISYARAT</h4>
          <div className="pi-kristal-grid">
            <div className="pi-kristal-card"><span>💎</span><span className="pi-kristal-name">Tumbuhan</span></div>
            <div className="pi-kristal-card"><span>💎</span><span className="pi-kristal-name">Hewan</span></div>
            <div className="pi-kristal-card"><span>💎</span><span className="pi-kristal-name">Keluarga</span></div>
            <div className="pi-kristal-card"><span>💎</span><span className="pi-kristal-name">Sekolah</span></div>
            <div className="pi-kristal-card"><span>💎</span><span className="pi-kristal-name">Makanan</span></div>
            <div className="pi-kristal-card"><span>🔒</span><span className="pi-kristal-name">Rahasia</span></div>
          </div>
          <div className="mt-2 text-center">
            <p className="text-[7.5px] text-slate-300 font-semibold mb-1">
              {crystalCount >= 20 ? 'Materi rahasia terbuka!' : `Kumpulkan ${20 - crystalCount} Kristal lagi untuk membuka materi rahasia!`}
            </p>
            <div className="pi-progress-bar-bg">
              <div className="pi-progress-bar-fill" style={{ width: `${(crystalCount / 50) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER & GUIDE BUBBLE */}
      <div className="pi-speech-bubble-mobile mt-2">
        <span className="text-2xl">🧑‍🚀</span>
        <p className="pi-bubble-msg">
          "Terus belajar dan kumpulkan Kristal Isyarat sebanyak-banyaknya ya!"
        </p>
      </div>

      <footer className="pi-mobile-nav">
        <div onClick={() => setActiveZone('main')} className={`pi-nav-icon-btn ${activeZone === 'main' ? 'active' : ''}`} role="button">
          <span>🏠</span><span>Beranda</span>
        </div>
        <div onClick={() => setActiveZone('kampung')} className={`pi-nav-icon-btn ${activeZone === 'kampung' ? 'active' : ''}`} role="button">
          <span>🤟</span><span>Kampung Isyarat</span>
        </div>
        <div onClick={() => setActiveZone('perpustakaan')} className={`pi-nav-icon-btn ${activeZone === 'perpustakaan' ? 'active' : ''}`} role="button">
          <span>📖</span><span>Perpustakaan</span>
        </div>
        <div onClick={() => setActiveZone('studio')} className={`pi-nav-icon-btn ${activeZone === 'studio' ? 'active' : ''}`} role="button">
          <span>🎨</span><span>Studio</span>
        </div>
        <div onClick={() => setActiveZone('arena')} className={`pi-nav-icon-btn ${activeZone === 'arena' ? 'active' : ''}`} role="button">
          <span>🏆</span><span>Arena</span>
        </div>
        <div onClick={() => { stopAdhdCamera(); setSelectedMode(null); }} className="pi-nav-icon-btn" role="button">
          <span>⚙️</span><span>Keluar</span>
        </div>
      </footer>

      <p className="pi-slogan">
        ★ BELAJAR DENGAN ISYARAT, MEMAHAMI DENGAN VISUAL, MERAIH PRESTASI! ★
      </p>

      {/* KAMUS ISYARAT MODAL */}
      {isKamusOpen && (
        <div className="absolute inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-sky-500 rounded-2xl p-4 w-full max-w-[260px] text-center space-y-3">
            <h4 className="font-extrabold text-[10px] text-white">📖 Kamus Isyarat BISINDO</h4>
            <input 
              type="text" 
              placeholder="Cari (Bumi, Kucing)..."
              value={searchKamus}
              onChange={(e) => setSearchKamus(e.target.value)}
              className="w-full px-2 py-1.5 bg-slate-800 text-white rounded-lg text-[9px] outline-none border border-slate-700"
            />
            <div className="bg-slate-950 p-2 rounded-lg text-left text-[8.5px] text-slate-300 min-h-[50px]">
              {searchKamus.toLowerCase().includes('kucing') ? (
                'Kucing: Dekatkan jempol & telunjuk di dekat pipi lalu gerakkan keluar (kumis).'
              ) : searchKamus.toLowerCase().includes('bumi') ? (
                'Bumi: Kedua tangan membentuk lingkaran memutar menyerupai bola dunia.'
              ) : (
                'Ketik "Bumi" atau "Kucing" untuk mencoba.'
              )}
            </div>
            <button onClick={() => setIsKamusOpen(false)} className="w-full py-1.5 bg-rose-600 text-white font-bold text-[8.5px] rounded-lg">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
      )}
    />
  );
}
