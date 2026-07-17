import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';

import Home from './pages/Home';
import Belajar from './pages/Belajar';
import Profile from './pages/Profile';
import SplashScreen from './pages/SplashScreen';
import AuthPage from './pages/AuthPage';
import RegulerMode from './pages/modes/RegulerMode';
import ADHDMode from './pages/modes/ADHDMode';
import TunarunguMode from './pages/modes/TunarunguMode';
import TunanetraMode from './pages/modes/TunanetraMode';
import DisleksiaMode from './pages/modes/DisleksiaMode';
import ABKUnifiedView from './pages/modes/ABKUnifiedView';
import { REGULER_LYRICS, TUNANETRA_STORIES, INITIAL_PLANET_CARDS } from './constants';
import { playTone, playCelebrationFanfare } from './utils/audio';
import { setRelaxationMusic, setRelaxationVolume } from './utils/relaxationAudio';


export default function App() {
  // --- Global Navigation & Auth States ---
  // --- Splash & Auth Flow ---
  const [showSplash, setShowSplash] = useState(true);
  const [showAuth, setShowAuth] = useState(false); // shows after splash finishes

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Yuanda Eka');
  const [selectedAvatar, setSelectedAvatar] = useState('🚀'); // default avatar emoji
  const [currentTab, setCurrentTab] = useState('home'); // 'home' | 'belajar' | 'profile'

  // Callback when splash finishes loading
  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
    setShowAuth(true);
  }, []);

  // Callback when auth (login/register) succeeds
  const handleAuthLogin = useCallback((displayName) => {
    setUsername(displayName || 'Explorer');
    setShowAuth(false);
    setIsLoggedIn(true);
  }, []);

  // --- Relaxation Music States ---
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [musicType, setMusicType] = useState('none'); // 'none' | 'rain' | 'instrumental' | 'nature'
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [musicPanelOpen, setMusicPanelOpen] = useState(false);

  // States to keep track of speech / video playing to dynamically mute/duck the background music
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isStoryReading, setIsStoryReading] = useState(false);
  
  // --- Active Learning Mode (null means selection grid) ---
  const [selectedMode, setSelectedMode] = useState(null); // 'reguler' | 'adhd' | 'tunarungu' | 'tunanetra' | 'disleksia' | 'abk'
  
  // --- Reguler Mode Sub-sections ---
  const [regulerSubMode, setRegulerSubMode] = useState(null); // 'visual' | 'audio'
  const [regulerSlide, setRegulerSlide] = useState(0);
  const [karaokePlaying, setKaraokePlaying] = useState(false);
  const [karaokeLyricIndex, setKaraokeLyricIndex] = useState(-1);
  const karaokeIntervalRef = useRef(null);

  // --- ADHD Mode states (Pinch & Drop Hand-Tracking Game) ---
  const [adhdScore, setAdhdScore] = useState(0);
  const [adhdGameState, setAdhdGameState] = useState('loading'); // 'loading' | 'start' | 'playing' | 'won' | 'lost'
  const [adhdCamReady, setAdhdCamReady] = useState(false);
  const [adhdCamError, setAdhdCamError] = useState('');
  const [adhdControlMode, setAdhdControlMode] = useState('camera'); // 'camera' | 'mouse'
  const [adhdTimeLeft, setAdhdTimeLeft] = useState(60);
  const [adhdFailReason, setAdhdFailReason] = useState('');
  const [feedbackToast, setFeedbackToast] = useState(null); // { text, type }
  const [adhdFocusSound, setAdhdFocusSound] = useState(false);
  

  
  const adhdVideoRef = useRef(null);
  const adhdOverlayCanvasRef = useRef(null);
  const adhdHandsRef = useRef(null);
  const adhdCameraRef = useRef(null);
  const adhdStreamRef = useRef(null);
  const adhdAnimRef = useRef(null);
  
  const adhdGameCanvasRef = useRef(null);
  const adhdGameLoopRef = useRef(null);
  const loopInstanceIdRef = useRef(0);
  const focusNodesRef = useRef([]);
  const toastTimeoutRef = useRef(null);

  const gameStateRef = useRef({
    active: false,
    score: 0,
    controlMode: 'camera',
    handStates: [
      { active: false, x: 0.5, y: 0.5, pinching: false, heldCardId: null, color: '#3498db' },
      { active: false, x: 0.5, y: 0.5, pinching: false, heldCardId: null, color: '#2ecc71' }
    ],
    wrongFlashCardId: null,
    cards: [],
    timeLeft: 60,
    particles: [],
    sortedCards: []
  });

  const ADHD_PLANET_CARDS = useMemo(() => INITIAL_PLANET_CARDS, []);

  // --- Tunarungu Mode States ---
  const [tunarunguComicPage, setTunarunguComicPage] = useState(0);
  const [activeSignWord, setActiveSignWord] = useState(null); // word to show sign popup

  // --- Tunanetra Mode States ---
  const [isTunanetraNarrating, setIsTunanetraNarrating] = useState(false);
  const [tunanetraStoryIndex, setTunanetraStoryIndex] = useState(0);
  const [micListeningSimulated, setMicListeningSimulated] = useState(false);
  const [tunanetraAnswerResult, setTunanetraAnswerResult] = useState('');

  // --- Disleksia Mode States ---
  const [rulerActive, setRulerActive] = useState(true);
  const [rulerTop, setRulerTop] = useState(250);
  const [disleksiaChallenge, setDisleksiaChallenge] = useState('trace'); // 'trace' | 'read'
  const [isDyslexiaTracing, setIsDyslexiaTracing] = useState(false);
  const [dyslexiaTraceComplete, setDyslexiaTraceComplete] = useState(false);
  const dyslexiaCanvasRef = useRef(null);
  
  // Reading & Speech Recognition States for Dyslexia
  const [isReadingMicActive, setIsReadingMicActive] = useState(false);
  const [readingResultText, setReadingResultText] = useState('');
  const [dyslexiaPronounceCorrect, setDyslexiaPronounceCorrect] = useState(false);
  const [dyslexiaMouthShape, setDyslexiaMouthShape] = useState('neutral'); // 'neutral' | 'a' | 'u' | 'i'

  // --- Profile, statistics, and Badges ---
  const [walletTokens, setWalletTokens] = useState(3);
  const [sparks, setSparks] = useState(() => {
    const saved = localStorage.getItem('satuarah_sparks');
    return saved ? parseInt(saved, 10) : 50; // starts with 50 sparks
  });
  const [sparkToast, setSparkToast] = useState({ show: false, amount: 0, reason: '' });
  
  // Speech Synthesizer reference with Google TTS fallback
  const speakText = useCallback((text, forceMode = false, rate = 1.0) => {
    const playTtsFallback = (txt) => {
      try {
        if (window.activeFallbackAudio) {
          window.activeFallbackAudio.pause();
        }
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=id&client=tw-ob&q=${encodeURIComponent(txt)}`;
        const audio = new Audio(url);
        window.activeFallbackAudio = audio;
        
        // Apply playbackRate to fallback audio if supported
        if (audio) {
          audio.playbackRate = rate;
        }
        
        audio.onplay = () => {
          if (selectedMode === 'tunanetra' || forceMode) {
            setIsTunanetraNarrating(true);
          }
        };
        audio.onended = () => {
          setIsTunanetraNarrating(false);
        };
        audio.onerror = () => {
          setIsTunanetraNarrating(false);
        };
        audio.play().catch(err => {
          console.warn("Fallback audio play failed (blocked by autoplay):", err);
          setIsTunanetraNarrating(false);
        });
      } catch (e) {
        console.error("Fallback audio failed entirely:", e);
        setIsTunanetraNarrating(false);
      }
    };

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel(); // Stop any ongoing speech
        
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'id-ID';
          utterance.rate = rate;
          
          const voices = window.speechSynthesis.getVoices();
          const idVoice = voices.find(v => v.lang.includes('id-ID') || v.name.toLowerCase().includes('indonesian') || v.lang.startsWith('id'));
          if (idVoice) utterance.voice = idVoice;

          utterance.onstart = () => {
            if (selectedMode === 'tunanetra' || forceMode) {
              setIsTunanetraNarrating(true);
            }
          };
          utterance.onend = () => {
            setIsTunanetraNarrating(false);
          };
          utterance.onerror = (err) => {
            console.warn("speechSynthesis error, falling back to Google TTS:", err);
            setIsTunanetraNarrating(false);
            playTtsFallback(text);
          };
          window.speechSynthesis.speak(utterance);

          setTimeout(() => {
            if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending && (selectedMode === 'tunanetra' || forceMode)) {
              console.warn("speechSynthesis did not start, playing fallback...");
              playTtsFallback(text);
            }
          }, 600);

        }, 150); // Increased timeout to 150ms to ensure cancel completes
      } catch (err) {
        console.warn("speechSynthesis exception, playing fallback:", err);
        playTtsFallback(text);
      }
    } else {
      playTtsFallback(text);
    }
  }, [selectedMode]);

  // Stop Speech
  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (window.activeFallbackAudio) {
      window.activeFallbackAudio.pause();
    }
    setIsTunanetraNarrating(false);
  }, []);

  // Spark Awarding System with Motivational Audio & Confetti
  const earnSparks = useCallback((amount, type) => {
    // Save to State & LocalStorage
    setSparks(prev => {
      const nextSparks = prev + amount;
      localStorage.setItem('satuarah_sparks', nextSparks.toString());
      return nextSparks;
    });

    // Fireworks confetti effect
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });

    let motivationText = "";
    let reasonText = "";
    
    switch(type) {
      case 'complete_slide':
        motivationText = "Hebat! Kamu berhasil menyelesaikan tantangan.";
        reasonText = "Menyelesaikan Materi";
        break;
      case 'retry_quiz':
        motivationText = "Tidak apa-apa jika belum benar. Ayo coba sekali lagi.";
        reasonText = "Mencoba Kembali";
        break;
      case 'complete_challenge':
        motivationText = "Hebat! Kamu berhasil menyelesaikan tantangan.";
        reasonText = "Menyelesaikan Tantangan";
        break;
      case 'listen_full':
        motivationText = "Bagus sekali, kamu sudah mencoba.";
        reasonText = "Mendengarkan Seluruh Materi";
        break;
      case 'follow_instruction':
        motivationText = "Bagus sekali, kamu sudah mencoba.";
        reasonText = "Berhasil Mengikuti Instruksi";
        break;
      case 'consistent':
        motivationText = "Kamu semakin pintar menyusun perintah.";
        reasonText = "Belajar Secara Konsisten";
        break;
      default:
        motivationText = "Bagus sekali! Pertahankan belajarmu.";
        reasonText = "Usaha Belajar";
    }

    // Play motivational voice
    speakText(motivationText, true);

    // Show Sparks Reward Toast
    setSparkToast({ show: true, amount, reason: reasonText });
    setTimeout(() => {
      setSparkToast(prev => ({ ...prev, show: false }));
    }, 3500);

  }, [speakText]);

  const streakDays = 5;
  const learningDuration = 45; // in minutes
  const [unlockedBadges, setUnlockedBadges] = useState({
    reguler: true,
    adhd: false,
    tunarungu: false,
    tunanetra: false,
    disleksia: false
  });
  const [blockchainLogs, setBlockchainLogs] = useState([
    { timestamp: '10:04', text: 'Sistem Belajar SatuArah Siap' },
    { timestamp: '10:15', text: 'Berhasil Mendapatkan Lencana: Lencana Reguler' }
  ]);
  const [activeBadgeToMint, setActiveBadgeToMint] = useState(null);
  const [mintingStatusText, setMintingStatusText] = useState('');
  const [badgeClaimComplete, setBadgeClaimComplete] = useState(false);

  // --- Chatbot floating state ---
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Halo! Saya adalah AI Advisor SatuArah. Tanyakan apa saja seputar tips belajar adaptif, kurikulum inklusif, atau cara menangani anak berkebutuhan khusus.' }
  ]);
  const [chatbotTyping, setChatbotTyping] = useState(false);



  // Badge Achievement Trigger — auto-processes and shows navigation buttons
  const triggerBadgeMinting = useCallback((modeKey) => {
    if (unlockedBadges[modeKey]) return; // already unlocked
    setActiveBadgeToMint(modeKey);
    setBadgeClaimComplete(false);
    playCelebrationFanfare();

    const motivation = [
      'Keren banget! Terus semangat belajar ya! 💪',
      'Hebat! Kamu sudah selangkah lebih maju! 🌟',
      'Luar biasa! Prestasi yang membanggakan! 🏅',
      'Mantap! Terus raih lencana berikutnya ya! 🚀',
      'Wow, kamu juara! Jangan pernah berhenti belajar! ✨',
    ][Math.floor(Math.random() * 5)];

    // Auto-process badge after short celebration
    setTimeout(() => {
      setUnlockedBadges(prev => ({ ...prev, [modeKey]: true }));
      setWalletTokens(prev => prev + 1);

      const now = new Date();
      const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setBlockchainLogs(prev => [
        ...prev,
        { timestamp, text: `Berhasil Memperoleh Lencana: Lencana ${modeKey.toUpperCase()}` }
      ]);

      setMintingStatusText(`🏆 ${motivation}`);
      setBadgeClaimComplete(true);
      playCelebrationFanfare();
      speakText(`Selamat! Kamu berhasil mendapatkan lencana ${modeKey}. ${motivation}`, true);
      confetti();
    }, 2000);
  }, [unlockedBadges, speakText]);

  // Effect to manage body class adaptations for accessibility modes
  useEffect(() => {
    document.body.className = ''; // clear
    if (!isLoggedIn) return;

    if (selectedMode === 'tunanetra') {
      document.body.classList.add('mode-tunanetra');
    } else if (selectedMode === 'adhd') {
      document.body.classList.add('mode-adhd');
    } else if (selectedMode === 'disleksia') {
      document.body.classList.add('mode-dyslexia');
    }
    
    // Cleanup
    return () => {
      stopSpeaking();
    };
  }, [selectedMode, isLoggedIn, stopSpeaking]);

  // Relaxation Music State Manager Effect
  useEffect(() => {
    setRelaxationMusic(musicType, musicEnabled, musicVolume);
    return () => {
      setRelaxationMusic('none', false, 0);
    };
  }, [musicType, musicEnabled, musicVolume]);

  // Dynamic Music Volume Ducking Effect
  // Lowers or pauses music when: TTS narrating (isTunanetraNarrating), chatbot typing/speaking (chatbotTyping),
  // video playing (isVideoPlaying), or karaoke / story reading (karaokePlaying / isStoryReading) is active.
  useEffect(() => {
    const shouldDuck = isTunanetraNarrating || chatbotTyping || isVideoPlaying || isStoryReading || karaokePlaying;
    if (shouldDuck) {
      // Duck to 5% of current volume
      setRelaxationVolume(musicVolume * 0.05);
    } else {
      // Restore normal volume
      setRelaxationVolume(musicVolume);
    }
  }, [isTunanetraNarrating, chatbotTyping, isVideoPlaying, isStoryReading, karaokePlaying, musicVolume]);

  // Start / stop simulated audio player karaoke
  useEffect(() => {
    if (karaokePlaying) {
      setKaraokeLyricIndex(0);
      let count = 0;
      karaokeIntervalRef.current = setInterval(() => {
        count += 1;
        const matchingIndex = REGULER_LYRICS.findIndex(lyric => count >= lyric.time && (lyric.time === 11 || count < REGULER_LYRICS[REGULER_LYRICS.indexOf(lyric) + 1].time));
        if (matchingIndex !== -1) {
          setKaraokeLyricIndex(matchingIndex);
        }
        if (count >= 15) {
          clearInterval(karaokeIntervalRef.current);
          setKaraokePlaying(false);
          setKaraokeLyricIndex(-1);
          confetti();
        }
      }, 1000);
      // Play TTS voice of the lyrics
      speakText("Koding itu asyik, susun blok satu per satu. Robot pun berjalan, ikuti instruksimu. Kecerdasan Artifisial, belajar dari data. Belajar koding cilik, kita cerdas bersama!");
    } else {
      clearInterval(karaokeIntervalRef.current);
      setKaraokeLyricIndex(-1);
      stopSpeaking();
    }
    return () => clearInterval(karaokeIntervalRef.current);
  }, [karaokePlaying, speakText, stopSpeaking]);

  // Speech Recognition fallback
  // Real Speech Recognition with Graceful Fallback (Mode Tunanetra Quiz)
  const startTunanetraMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'id-ID';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setMicListeningSimulated(true);
        setTunanetraAnswerResult('Mendengarkan suara Anda...');
        speakText("Silakan ucapkan jawaban Anda sekarang.", true);
        playTone(440, 'sine', 0.15);

        recognition.onresult = (event) => {
          const speechResult = event.results[0][0].transcript.toLowerCase();
          console.log("Speech recognized:", speechResult);
          
          const correctAnswer = tunanetraStoryIndex === 0 ? "merah" : "olympus mons";
          const alternativeAnswer = tunanetraStoryIndex === 0 ? "mars" : "olympus";
          
          const isCorrect = speechResult.includes(correctAnswer) || speechResult.includes(alternativeAnswer);
          
          setMicListeningSimulated(false);
          if (isCorrect) {
            setTunanetraAnswerResult(`Terdeteksi: "${event.results[0][0].transcript}" ✓`);
            playTone(523.25, 'sine', 0.15);
            setTimeout(() => playTone(659.25, 'sine', 0.25), 150);
            speakText(`Hebat! Jawabanmu benar. Jawabanmu adalah ${event.results[0][0].transcript}. Kamu mendapatkan 1 Token Soulbound!`, true);
            confetti();
            triggerBadgeMinting('tunanetra');
          } else {
            setTunanetraAnswerResult(`Terdeteksi: "${event.results[0][0].transcript}" (Kurang Tepat)`);
            playTone(180, 'sawtooth', 0.25);
            speakText(`Jawaban terdeteksi: "${event.results[0][0].transcript}". Jawaban kurang tepat, coba ucapkan ${correctAnswer === "merah" ? "Merah" : "Olympus Mons"} ya.`, true);
          }
        };

        recognition.onerror = (e) => {
          console.warn("Speech recognition error:", e);
          runTunanetraMicFallback();
        };

        recognition.onend = () => {
          setMicListeningSimulated(false);
        };

        recognition.start();
      } catch (err) {
        console.warn("Failed speech recognition init, using fallback:", err);
        runTunanetraMicFallback();
      }
    } else {
      runTunanetraMicFallback();
    }
  };

  const runTunanetraMicFallback = () => {
    setMicListeningSimulated(true);
    setTunanetraAnswerResult('Mendengarkan (Simulasi)...');
    playTone(440, 'sine', 0.15);
    
    setTimeout(() => {
      setMicListeningSimulated(false);
      const correctAnswer = tunanetraStoryIndex === 0 ? "Merah" : "Olympus Mons";
      setTunanetraAnswerResult(`Jawaban Anda terdeteksi: "${correctAnswer}" ✓`);
      playTone(523.25, 'sine', 0.15);
      setTimeout(() => playTone(659.25, 'sine', 0.25), 150);
      speakText(`Hebat! Jawabanmu benar. Jawabanmu adalah ${correctAnswer}. Kamu mendapatkan 1 Token Soulbound!`, true);
      confetti();
      triggerBadgeMinting('tunanetra');
    }, 2500);
  };

  // ADHD Hand-Tracking Camera Setup + Pinch Detection via MediaPipe Hands
  const startAdhdCamera = useCallback(async () => {
    try {
      setAdhdCamError('');
      
      const HandsClass = window.Hands;
      const CameraClass = window.Camera;
      
      if (!HandsClass || !CameraClass) {
        setAdhdCamError('Modul deteksi gestur MediaPipe tidak terdeteksi di window. Hubungkan internet.');
        return;
      }

      const video = adhdVideoRef.current;
      if (!video) {
        setAdhdCamError('Elemen video kamera belum terpasang di layar.');
        return;
      }

      // Setup MediaPipe Hands to track up to 2 hands (Dual-Hand)
      const hands = new HandsClass({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 0, // Lower complexity for better performance
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      hands.onResults((results) => {
        const overlayCanvas = adhdOverlayCanvasRef.current;
        if (!overlayCanvas) return;
        const ctx = overlayCanvas.getContext('2d');
        ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        // Draw webcam image directly to output canvas (like in index.html)
        ctx.drawImage(results.image, 0, 0, overlayCanvas.width, overlayCanvas.height);

        // Reset active state for ref handStates
        gameStateRef.current.handStates.forEach(h => {
          h.active = false;
        });

        if (results.multiHandLandmarks) {
          results.multiHandLandmarks.forEach((landmarks, index) => {
            if (index >= 2) return;
            
            const thumbTip = landmarks[4];
            const indexTip = landmarks[8];
            const dist = Math.sqrt(Math.pow(indexTip.x - thumbTip.x, 2) + Math.pow(indexTip.y - thumbTip.y, 2));
            const isPinching = dist < 0.055;

            const handCenterX = 1 - ((thumbTip.x + indexTip.x) / 2);
            const handCenterY = (thumbTip.y + indexTip.y) / 2;

            const hState = gameStateRef.current.handStates[index];
            hState.active = true;
            hState.x = handCenterX;
            hState.y = handCenterY;
            hState.pinching = isPinching;

            const w = overlayCanvas.width;
            const hCanvas = overlayCanvas.height;
            const drawColor = hState.color;

            // Draw skeleton lines (un-flipped in JS, CSS transform scaleX(-1) mirrors it)
            const connections = [
              [0,1],[1,2],[2,3],[3,4],
              [0,5],[5,6],[6,7],[7,8],
              [0,9],[9,10],[10,11],[11,12],
              [0,13],[13,14],[14,15],[15,16],
              [0,17],[17,18],[18,19],[19,20],
              [5,9],[9,13],[13,17]
            ];
            ctx.strokeStyle = drawColor;
            ctx.lineWidth = 1.5;
            connections.forEach(([a, b]) => {
              ctx.beginPath();
              ctx.moveTo(landmarks[a].x * w, landmarks[a].y * hCanvas);
              ctx.lineTo(landmarks[b].x * w, landmarks[b].y * hCanvas);
              ctx.stroke();
            });

            // Draw finger joints (un-flipped in JS)
            ctx.fillStyle = '#ffffff';
            landmarks.forEach((lm) => {
              ctx.beginPath();
              ctx.arc(lm.x * w, lm.y * hCanvas, 2.5, 0, 2 * Math.PI);
              ctx.fill();
            });
          });
        }
      });

      adhdHandsRef.current = hands;

      // Start Camera (with ideal constraints for high browser compatibility)
      const camera = new CameraClass(video, {
        onFrame: async () => {
          if (adhdHandsRef.current) {
            await adhdHandsRef.current.send({ image: video });
          }
        },
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      });

      await camera.start();
      try {
        await video.play();
      } catch (playErr) {
        console.log('Video autoplay blocked or handled', playErr);
      }
      
      adhdCameraRef.current = camera;
      setAdhdCamReady(true);
      setAdhdGameState('start'); // Camera ready, transition to start screen
      console.log('ADHD Camera started successfully with hand tracking!');
    } catch (err) {
      console.error('ADHD camera error:', err);
      setAdhdCamError(`Gagal mengakses kamera: ${err.message || err}`);
    }
  }, []);

  const stopAdhdCamera = useCallback(() => {
    if (adhdCameraRef.current) {
      try { adhdCameraRef.current.stop(); } catch(e) {}
      adhdCameraRef.current = null;
    }
    if (adhdAnimRef.current) {
      cancelAnimationFrame(adhdAnimRef.current);
      adhdAnimRef.current = null;
    }
    if (adhdHandsRef.current) {
      try { adhdHandsRef.current.close(); } catch(e) {}
      adhdHandsRef.current = null;
    }
    if (adhdStreamRef.current) {
      adhdStreamRef.current.getTracks().forEach(t => t.stop());
      adhdStreamRef.current = null;
    }
    setAdhdCamReady(false);
  }, []);

  // Cleanup camera when leaving ADHD/ABK mode
  useEffect(() => {
    if (selectedMode !== 'adhd' && selectedMode !== 'abk') {
      stopAdhdCamera();
    }
  }, [selectedMode, stopAdhdCamera]);

  // Sync controlMode to ref
  useEffect(() => {
    gameStateRef.current.controlMode = adhdControlMode;
  }, [adhdControlMode]);

  // Clean up focus sound and toast timeouts
  useEffect(() => {
    return () => {
      focusNodesRef.current.forEach(node => {
        try { node.stop(); } catch(e) {}
        try { node.disconnect(); } catch(e) {}
      });
      focusNodesRef.current = [];
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // ADHD Start Game Helper
  const startGame = () => {
    setAdhdGameState('playing');
    setAdhdScore(0);
    setAdhdTimeLeft(60);
  };

  // ADHD Focus Hum Synthesizer
  const toggleFocusSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      if (adhdFocusSound) {
        focusNodesRef.current.forEach(node => {
          try { node.stop(); } catch(e) {}
          try { node.disconnect(); } catch(e) {}
        });
        focusNodesRef.current = [];
        setAdhdFocusSound(false);
      } else {
        const audioCtx = new AudioContext();
        
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const lfo = audioCtx.createOscillator();
        const filter = audioCtx.createBiquadFilter();
        const gainNode = audioCtx.createGain();
        const lfoGain = audioCtx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.value = 55; // Low hum (A1)
        
        osc2.type = 'sine';
        osc2.frequency.value = 110; // First harmonic (A2)
        
        lfo.type = 'sine';
        lfo.frequency.value = 0.15; // Modulating frequency
        
        lfoGain.gain.value = 12; // Modulating filter frequency range
        
        filter.type = 'lowpass';
        filter.frequency.value = 110; // Deep low pass spaceship cabin drone
        
        gainNode.gain.value = 0.05; // Soft focus volume

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc1.start();
        osc2.start();
        lfo.start();

        focusNodesRef.current = [osc1, osc2, lfo, audioCtx];
        setAdhdFocusSound(true);
      }
    } catch(e) {
      console.warn("Could not toggle focus sound:", e);
    }
  };

  // Educational Toast Trigger
  const showToast = (text, type) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setAdhdToast({ text, type });
    toastTimeoutRef.current = setTimeout(() => {
      setAdhdToast(null);
    }, 3200);
  };

  // Timer Effect
  // ADHD Mode countdown timer
  useEffect(() => {
    let timer = null;
    if (adhdGameState === 'playing') {
      timer = setInterval(() => {
        setAdhdTimeLeft(prev => {
          const next = prev - 1;
          gameStateRef.current.timeLeft = next;
          if (next <= 0) {
            clearInterval(timer);
            gameStateRef.current.active = false;
            setAdhdGameState('lost');
            setAdhdFailReason('Waktu habis!');
            playTone(150, 'sawtooth', 0.5);
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [adhdGameState]);

  // Sync selectedMode and controlMode to start/stop camera
  useEffect(() => {
    if ((selectedMode === 'adhd' || selectedMode === 'abk') && adhdGameState !== 'won' && adhdGameState !== 'lost') {
      if (adhdControlMode === 'camera' && !adhdCamReady) {
        startAdhdCamera();
      }
    } else {
      stopAdhdCamera();
    }
  }, [selectedMode, adhdControlMode, adhdCamReady, adhdGameState, startAdhdCamera, stopAdhdCamera]);
  useEffect(() => {
    const currentGameState = gameStateRef.current;
    if (adhdGameState !== 'playing') {
      if (currentGameState.frameId) {
        cancelAnimationFrame(currentGameState.frameId);
        currentGameState.frameId = null;
      }
      return;
    }

    loopInstanceIdRef.current += 1;
    const currentLoopId = loopInstanceIdRef.current;

    const canvas = adhdGameCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Reset game state ref and shuffle cards
    gameStateRef.current.active = true;
    gameStateRef.current.score = 0;
    gameStateRef.current.wrongFlashCardId = null;
    gameStateRef.current.timeLeft = 60;
    gameStateRef.current.particles = [];
    gameStateRef.current.sortedCards = [];

    // Reset hand states
    gameStateRef.current.handStates = [
      { active: false, x: 0.5, y: 0.5, pinching: false, heldCardId: null, color: '#3498db' },
      { active: false, x: 0.5, y: 0.5, pinching: false, heldCardId: null, color: '#2ecc71' }
    ];

    const PLANET_BUBBLES = [
      { name: 'Bumi', emoji: '🌍', isEarth: true },
      { name: 'Mars', emoji: '🔴', isEarth: false },
      { name: 'Venus', emoji: '🌟', isEarth: false },
      { name: 'Jupiter', emoji: '🪐', isEarth: false }
    ];

    // Spawn items using ratios (bx, by)
    const spawned = [];
    
    PLANET_BUBBLES.forEach((it, idx) => {
      // Place cards at fixed vertical offsets so they never overlap and hide Earth
      const bx = 0.12;
      const by = 0.22 + (idx * 0.18); 
      spawned.push({
        ...it,
        bx,
        by,
        id: Math.random().toString(36).substr(2, 9)
      });
    });
    gameStateRef.current.cards = spawned;

    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height || rect.width * 0.75;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle generator inside loop scope
    const spawnParticles = (x, y, color, count = 10) => {
      if (!gameStateRef.current.particles) gameStateRef.current.particles = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 0.8;
        gameStateRef.current.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.5 + 1.5,
          color: color,
          alpha: 1.0,
          life: Math.random() * 15 + 15
        });
      }
    };

    const showFeedback = (text, isCorrect) => {
      setFeedbackToast({ text, type: isCorrect ? 'success' : 'error' });
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => setFeedbackToast(null), 3000);
    };

    const loop = () => {
      if (!gameStateRef.current.active || loopInstanceIdRef.current !== currentLoopId) return;

      const w = canvas.width;
      const h = canvas.height;

      // Clear with dark space background
      ctx.clearRect(0, 0, w, h);

      // Draw Sun and Orbits
      const centerX = w / 2;
      const centerY = h / 2;
      
      // Draw Orbits
      const maxRadius = Math.min(w, h) * 0.45;
      const orbitRadii = [maxRadius * 0.2, maxRadius * 0.45, maxRadius * 0.7, maxRadius * 0.95];
      orbitRadii.forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 2 ? 'rgba(46, 204, 113, 0.4)' : 'rgba(255, 255, 255, 0.1)';
        ctx.setLineDash(idx === 2 ? [8, 8] : []);
        ctx.lineWidth = idx === 2 ? 4 : 2;
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Draw Sun
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = '#f1c40f'; // Sun yellow
      ctx.shadowBlur = 30;
      ctx.shadowColor = '#f39c12';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Responsive Item Size (identical to index.html)
      const baseSize = Math.min(w, h);
      const itemSize = Math.max(65, baseSize * 0.12);

      // Dual Hand Grab & Drop Logic based on Pinch status
      gameStateRef.current.handStates.forEach(hand => {
        const isActive = hand.active || (gameStateRef.current.controlMode === 'mouse' && hand.color === '#3498db');
        if (!isActive) return;

        const isPinching = hand.pinching;
        const wasPinching = hand.wasPinching || false;

        // Grab Action
        if (isPinching && !wasPinching && hand.heldCardId === null) {
          for (let i = gameStateRef.current.cards.length - 1; i >= 0; i--) {
            const card = gameStateRef.current.cards[i];
            if (gameStateRef.current.sortedCards.includes(card.id)) continue;
            
            // Check if held by other hand
            const isHeldByOther = gameStateRef.current.handStates.some(other => other.color !== hand.color && other.heldCardId === card.id);
            if (isHeldByOther) continue;

            const cx = card.bx * w;
            const cy = card.by * h;
            const dist = Math.sqrt(Math.pow(hand.x * w - cx, 2) + Math.pow(hand.y * h - cy, 2));
            
            if (dist < itemSize / 2 + 10) {
              hand.heldCardId = card.id;
              playTone(440, 'sine', 0.08);
              break;
            }
          }
        }

        // Drag Action
        if (isPinching && hand.heldCardId !== null) {
          const card = gameStateRef.current.cards.find(c => c.id === hand.heldCardId);
          if (card) {
            card.bx = hand.x;
            card.by = hand.y;
          }
        }

        // Drop Action
        if (!isPinching && wasPinching && hand.heldCardId !== null) {
          const cardId = hand.heldCardId;
          const card = gameStateRef.current.cards.find(c => c.id === cardId);
          
          if (card) {
            const centerX = w / 2;
            const centerY = h / 2;
            const maxRadius = Math.min(w, h) * 0.45;
            const targetRadius = maxRadius * 0.7; // orbit 3
            
            const distFromSun = Math.sqrt(Math.pow(hand.x * w - centerX, 2) + Math.pow(hand.y * h - centerY, 2));
            const isOrbit3 = Math.abs(distFromSun - targetRadius) < 40;

            if (isOrbit3) {
              if (!card.isEarth) {
                gameStateRef.current.active = false;
                setAdhdGameState('lost');
                setAdhdFailReason(`Gagal! ${card.name} bukan planet ketiga dari Matahari.`);
                playTone(150, 'sawtooth', 0.5);
              } else {
                gameStateRef.current.sortedCards.push(cardId);
                const score = gameStateRef.current.score + 1;
                gameStateRef.current.score = score;
                setAdhdScore(score);

                // Haptic feedback
                if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

                // Reward tone
                playTone(587.33, 'sine', 0.15);
                spawnParticles(hand.x * w, hand.y * h, hand.color, 30);
                confetti({ particleCount: 50, origin: { x: hand.x, y: hand.y } });

                showFeedback("Pop! 🎉 Tepat Sekali!", true);

                setTimeout(() => {
                  gameStateRef.current.active = false;
                  setAdhdGameState('won');
                  triggerBadgeMinting('adhd');
                }, 1000);
              }
            } else {
              // Not in target orbit
              card.bx = hand.x;
              card.by = hand.y;
            }
          }
          hand.heldCardId = null;
        }

        hand.wasPinching = isPinching;
      });

      // Helper to draw item (identical design to index.html)
      const drawItem = (it, size, held = false, color = '#eee') => {
        ctx.save();
        if (held) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = color;
        }
        
        ctx.beginPath();
        ctx.arc(it.bx * w, it.by * h, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = held ? color : '#eee';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = `${size * 0.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(it.emoji, it.bx * w, it.by * h - 2);

        // Name underneath
        ctx.fillStyle = '#64748b';
        ctx.font = `bold ${size * 0.16}px Arial`;
        ctx.fillText(it.name, it.bx * w, it.by * h + size * 0.42);
        
        ctx.restore();
      };

      // Draw Items
      gameStateRef.current.cards.forEach(card => {
        const isSorted = gameStateRef.current.sortedCards.includes(card.id);
        const heldByHand = gameStateRef.current.handStates.find(hState => hState.heldCardId === card.id);
        const isHeld = !!heldByHand;

        if (isSorted || isHeld) return; // sorted or held handled separately

        drawItem(card, itemSize, false, '#eee');
      });

      // Draw Hands and Held Items (with cursors)
      gameStateRef.current.handStates.forEach(hand => {
        const isActive = hand.active || (gameStateRef.current.controlMode === 'mouse' && hand.color === '#3498db');
        if (!isActive) return;

        if (hand.heldCardId !== null) {
          const card = gameStateRef.current.cards.find(c => c.id === hand.heldCardId);
          if (card) {
            card.bx = hand.x;
            card.by = hand.y;
            drawItem(card, itemSize, true, hand.color);
          }
        }
        
        // Draw Cursor (identical to index.html)
        ctx.save();
        const r = hand.pinching ? 10 : 20;
        ctx.beginPath();
        ctx.arc(hand.x * w, hand.y * h, r, 0, Math.PI * 2);
        ctx.fillStyle = hand.color + '33';
        ctx.fill();
        ctx.strokeStyle = hand.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Inner dot
        ctx.beginPath();
        ctx.arc(hand.x * w, hand.y * h, 4, 0, Math.PI * 2);
        ctx.fillStyle = hand.color;
        ctx.fill();
        ctx.restore();
      });

      gameStateRef.current.frameId = requestAnimationFrame(loop);
    };

    gameStateRef.current.frameId = requestAnimationFrame(loop);

    return () => {
      currentGameState.active = false;
      window.removeEventListener('resize', resizeCanvas);
      if (currentGameState.frameId) {
        cancelAnimationFrame(currentGameState.frameId);
      }
    };
  }, [adhdGameState, adhdCamReady, triggerBadgeMinting]);

  const handleAdhdBoardMouseMove = (e) => {
    if (gameStateRef.current.controlMode !== 'mouse' || !gameStateRef.current.active) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    gameStateRef.current.handStates[0].active = true;
    gameStateRef.current.handStates[0].x = Math.max(0, Math.min(1, x));
    gameStateRef.current.handStates[0].y = Math.max(0, Math.min(1, y));
  };

  const handleAdhdBoardMouseDown = (e) => {
    if (gameStateRef.current.controlMode !== 'mouse' || !gameStateRef.current.active) return;
    gameStateRef.current.handStates[0].pinching = true;
    
    // Update position instantly on click
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    gameStateRef.current.handStates[0].active = true;
    gameStateRef.current.handStates[0].x = Math.max(0, Math.min(1, x));
    gameStateRef.current.handStates[0].y = Math.max(0, Math.min(1, y));
  };

  const handleAdhdBoardMouseUp = (_e) => {
    if (gameStateRef.current.controlMode !== 'mouse' || !gameStateRef.current.active) return;
    gameStateRef.current.handStates[0].pinching = false;
  };

  const handleAdhdBoardTouchMove = (e) => {
    if (gameStateRef.current.controlMode !== 'mouse' || !gameStateRef.current.active) return;
    if (e.touches.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;
    
    gameStateRef.current.handStates[0].active = true;
    gameStateRef.current.handStates[0].x = Math.max(0, Math.min(1, x));
    gameStateRef.current.handStates[0].y = Math.max(0, Math.min(1, y));
  };

  const handleAdhdBoardTouchStart = (e) => {
    if (gameStateRef.current.controlMode !== 'mouse' || !gameStateRef.current.active) return;
    gameStateRef.current.handStates[0].pinching = true;
    if (e.touches.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.touches[0];
      const x = (touch.clientX - rect.left) / rect.width;
      const y = (touch.clientY - rect.top) / rect.height;
      
      gameStateRef.current.handStates[0].active = true;
      gameStateRef.current.handStates[0].x = Math.max(0, Math.min(1, x));
      gameStateRef.current.handStates[0].y = Math.max(0, Math.min(1, y));
    }
  };

  const handleAdhdBoardTouchEnd = (_e) => {
    if (gameStateRef.current.controlMode !== 'mouse' || !gameStateRef.current.active) return;
    gameStateRef.current.handStates[0].pinching = false;
  };

  // Tracing Canvas logic (Disleksia)
  const setupTraceCanvas = () => {
    const canvas = dyslexiaCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw guide letters "M A R S"
    ctx.font = 'bold 50px OpenDyslexic, Poppins';
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'center';
    ctx.fillText('M  A  R  S', canvas.width / 2, canvas.height / 2 + 15);

    // Draw outline instruction text
    ctx.font = 'bold 10px Poppins';
    ctx.fillStyle = '#059669';
    ctx.fillText('IKUTI GARIS UNTUK MENULIS', canvas.width / 2, 20);
  };

  useEffect(() => {
    if (selectedMode === 'disleksia' && disleksiaChallenge === 'trace') {
      setTimeout(setupTraceCanvas, 100);
    }
  }, [selectedMode, disleksiaChallenge]);

  const handleTraceMouseDown = (e) => {
    const canvas = dyslexiaCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (!clientX || !clientY) return;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#10b981';
    ctx.lineCap = 'round';
    setIsDyslexiaTracing(true);
  };

  const handleTraceMouseMove = (e) => {
    if (!isDyslexiaTracing) return;
    const canvas = dyslexiaCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (!clientX || !clientY) return;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleTraceMouseUp = () => {
    setIsDyslexiaTracing(false);
  };

  const verifyDyslexiaTrace = () => {
    setDyslexiaTraceComplete(true);
    playTone(523.25, 'sine', 0.15);
    setTimeout(() => playTone(659.25, 'sine', 0.25), 150);
    confetti();
    triggerBadgeMinting('disleksia');
  };

  // Dyslexia Reading and Speech Recognition Simulation
  const startDyslexiaReadingMic = () => {
    setIsReadingMicActive(true);
    setReadingResultText('Mendengarkan suara Anda...');
    playTone(440, 'sine', 0.15);
    
    // Simulate phonetic analysis of reading syllables "Sa-tu A-rah"
    let mouthSequence = ['a', 'u', 'i', 'neutral'];
    let idx = 0;
    
    // Mouth shapes animation interval
    const mouthInterval = setInterval(() => {
      setDyslexiaMouthShape(mouthSequence[idx]);
      idx = (idx + 1) % mouthSequence.length;
    }, 400);

    setTimeout(() => {
      clearInterval(mouthInterval);
      setDyslexiaMouthShape('neutral');
      setIsReadingMicActive(false);
      setReadingResultText('Pengucapan terdeteksi: "Satu Arah" ✓');
      setDyslexiaPronounceCorrect(true);
      playTone(523.25, 'sine', 0.15);
      setTimeout(() => playTone(659.25, 'sine', 0.25), 150);
      speakText("Luar biasa! Pengucapan kata Satu Arah sangat tepat dan sesuai ejaan.");
      confetti();
    }, 2800);
  };

  // Badge modal navigation handlers
  const handleBadgeBelajarLagi = () => {
    const modeToRestart = activeBadgeToMint;
    setActiveBadgeToMint(null);
    setBadgeClaimComplete(false);
    // Re-enter the same learning mode fresh
    setSelectedMode(modeToRestart);
    setRegulerSubMode(null);
    setCurrentTab('belajar');
  };

  const handleBadgeBackToMenu = () => {
    setActiveBadgeToMint(null);
    setBadgeClaimComplete(false);
    setSelectedMode(null);
    setRegulerSubMode(null);
    setCurrentTab('home');
    stopSpeaking();
  };

  // Chatbot Advisor Logic
  const handleChatbotMessageSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setChatInput('');
    setChatbotTyping(true);

    setTimeout(() => {
      setChatbotTyping(false);
      let reply = 'Maaf, saya tidak mengerti pertanyaan tersebut. Coba tanyakan seputar tips mengajar disleksia, ADHD, tunanetra, atau Lencana Belajar.';
      
      const query = userMessage.toLowerCase();
      if (query.includes('adhd') || query.includes('fokus')) {
        reply = `Tips Mengajar ADHD:
1. Berikan tugas kecil-kecil dengan jeda istirahat (brain breaks) setiap 15 menit.
2. Minimalkan visual latar belakang agar anak tidak terdistraksi.
3. Berikan penghargaan cepat (instant rewards) agar dopamin anak terjaga.`;
      } else if (query.includes('disleksia') || query.includes('membaca') || query.includes('tulis')) {
        reply = `Tips Mengajar Disleksia:
1. Gunakan media multi-sensori (menggambar huruf di pasir, clay huruf).
2. Gunakan font khusus seperti OpenDyslexic.
3. Pasang penggaris pemandu baris (reading ruler) untuk memfokuskan baris kalimat yang sedang dibaca.`;
      } else if (query.includes('tunanetra') || query.includes('suara')) {
        reply = `Tips Mengajar Tunanetra:
1. Berbasis media audio storytelling yang interaktif.
2. Maksimalkan umpan balik taktil dan petunjuk verbal yang detail.
3. Gunakan screen reader dan voice user interface (VUI).`;
      } else if (query.includes('lencana') || query.includes('sertifikat') || query.includes('sbt') || query.includes('token') || query.includes('blockchain')) {
        reply = 'Lencana Belajar SatuArah adalah penghargaan digital aman yang mencatat setiap modul koding dan AI yang berhasil diselesaikan oleh putra-putri Anda sebagai bukti nyata kompetensi logika anak.';
      } else if (query.includes('halo') || query.includes('siapa')) {
        reply = 'Halo! Saya adalah AI Advisor SatuArah. Saya siap memberikan rekomendasi kurikulum dan metode belajar inklusif untuk putra-putri Anda.';
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      playTone(880, 'sine', 0.12);
    }, 1200);
  };

  // Legacy login submit handler kept for compatibility — now handled by AuthPage
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  // Speak descriptions for blind mode on focus
  const voiceGuide = useCallback((text) => {
    if (selectedMode === 'tunanetra') {
      playTone(600, 'sine', 0.08); // soft hover guide tone
      speakText(text);
    }
  }, [selectedMode, speakText]);

  // Memoise static UI values to prevent lint issues
  const renderedStreakDays = useMemo(() => `${streakDays} Hari`, [streakDays]);
  const renderedDuration = useMemo(() => `${learningDuration} Min`, [learningDuration]);

  // --- RENDERING ---
  return (
    <div className="min-h-screen bg-emerald-50/40 p-0 sm:py-6 flex items-center justify-center">
      {/* SPLASH SCREEN OVERLAY */}
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      {/* PHONE WRAPPER FOR MOBILE-FIRST FEEL */}
      <div className="phone-container flex flex-col justify-between bubbly-card bg-white relative overflow-hidden">
        
        {/* APP HEADER */}
        <header className="px-5 py-4 flex items-center justify-between border-b border-emerald-100 bg-white sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl shadow-sm animate-float overflow-hidden bg-white border border-emerald-100 flex-shrink-0">
              <img src="/logohijaufiks.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-emerald-800">
                Satu<span className="text-amber-500">Arah</span>
              </h1>
              <p className="text-[9px] text-emerald-600/70 font-bold uppercase tracking-wider leading-none">Inklusi EduTech</p>
            </div>
          </div>

          {/* Active Mode Badge indicator */}
          <div className="flex items-center gap-1.5">
            {isLoggedIn && (
              <button
                onClick={() => setMusicPanelOpen(true)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm shadow-sm transition-all duration-200 ${
                  musicEnabled && musicType !== 'none'
                    ? 'bg-amber-100 border-amber-300 text-amber-600 animate-pulse'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
                title="Atur Musik Relaksasi"
              >
                🎵
              </button>
            )}

            {selectedMode && (
              <button
                onClick={() => { setSelectedMode(null); setRegulerSubMode(null); stopSpeaking(); }}
                className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 text-[9px] font-black uppercase flex items-center gap-1.5 active:scale-95 transition-transform"
              >
                <i className="fa-solid fa-arrow-left text-[8px]"></i> {selectedMode}
              </button>
            )}
          </div>
        </header>

        {/* RELAXATION MUSIC CONTROL DIALOG MODAL */}
        {musicPanelOpen && (
          <div className="absolute inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-5 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white border-4 border-amber-400 rounded-3xl p-5 w-full max-w-[280px] space-y-4 shadow-2xl relative">
              <button 
                onClick={() => setMusicPanelOpen(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 text-base font-black"
              >
                ✕
              </button>
              
              <div className="text-center">
                <span className="text-3xl filter drop-shadow">🍃</span>
                <h4 className="font-black text-xs text-slate-800 uppercase mt-1">Musik Relaksasi</h4>
                <p className="text-[8px] text-slate-400 font-bold leading-relaxed">
                  Membantu ketenangan sensorik anak berkebutuhan khusus selama belajar koding.
                </p>
              </div>

              {/* Toggle switch */}
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[9px] font-black text-slate-600">Aktifkan Musik</span>
                <button
                  onClick={() => {
                    playTone(600, 'sine', 0.05);
                    const newEnabled = !musicEnabled;
                    setMusicEnabled(newEnabled);
                    if (newEnabled && musicType === 'none') {
                      setMusicType('instrumental');
                    }
                  }}
                  className={`px-3 py-1 rounded-lg text-[8px] font-black border transition-all ${
                    musicEnabled
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-slate-200 text-slate-500 border-slate-350'
                  }`}
                >
                  {musicEnabled ? 'AKTIF' : 'MATI'}
                </button>
              </div>

              {/* Sound Options List */}
              <div className="space-y-1.5">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Pilihan Jenis Suara:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'none', label: '🔇 Tanpa Musik', emoji: 'Mute' },
                    { id: 'rain', label: '🌧️ Suara Hujan', emoji: 'Rain' },
                    { id: 'nature', label: '🌲 Suara Alam', emoji: 'Nature' },
                    { id: 'instrumental', label: '🎹 Instrumental', emoji: 'Soft' }
                  ].map(sound => (
                    <button
                      key={sound.id}
                      onClick={() => {
                        playTone(550, 'sine', 0.05);
                        setMusicType(sound.id);
                        if (sound.id === 'none') {
                          setMusicEnabled(false);
                        } else {
                          setMusicEnabled(true);
                        }
                      }}
                      className={`py-2 rounded-xl text-[8.5px] font-black border-2 transition-all ${
                        musicType === sound.id && musicEnabled
                          ? 'bg-amber-100 border-amber-400 text-amber-800 shadow-sm scale-[1.02]'
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      {sound.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[8.5px] font-black text-slate-500">
                  <span>🔊 KEKUATAN VOLUME</span>
                  <span>{Math.round(musicVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <button
                onClick={() => setMusicPanelOpen(false)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-2.5 rounded-2xl text-[9px] uppercase shadow-md active:scale-95 transition-all cursor-pointer border-b-3 border-amber-700"
              >
                Selesai Pengaturan
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 1: AUTH (LOGIN / REGISTER) PAGE */}
        {/* ============================================================== */}
        {!isLoggedIn ? (
          <AuthPage onLogin={handleAuthLogin} />
        ) : (
          /* ============================================================== */
          /* MAIN LOGGED IN APP CONTENTS */
          /* ============================================================== */
          <main className="flex-1 flex flex-col overflow-y-auto bg-slate-50 relative p-4 scrollbar-none">
            
            {/* -------------------------------------------------------- */}
            {/* TAB A: HOME SCREEN */}
            {currentTab === 'home' && !selectedMode && (
              <Home
                username={username}
                selectedAvatar={selectedAvatar}
                renderedStreakDays={renderedStreakDays}
                renderedDuration={renderedDuration}
                walletTokens={walletTokens}
                sparks={sparks}
                speakText={speakText}
                setSelectedMode={setSelectedMode}
                setCurrentTab={setCurrentTab}
              />
            )}
            {/* -------------------------------------------------------- */}
            {/* -------------------------------------------------------- */}
            {/* TAB B: BELAJAR (LEARNING OPTIONS GRID) */}
            {currentTab === 'belajar' && !selectedMode && (
              <Belajar
                setSelectedMode={setSelectedMode}
                voiceGuide={voiceGuide}
                speakText={speakText}
              />
            )}
            {/* -------------------------------------------------------- */}
            {/* -------------------------------------------------------- */}
            {/* SUB-VIEW B.1: MODE REGULER */}
            {selectedMode === 'reguler' && (
              <RegulerMode
                regulerSubMode={regulerSubMode}
                setRegulerSubMode={setRegulerSubMode}
                regulerSlide={regulerSlide}
                setRegulerSlide={setRegulerSlide}
                karaokePlaying={karaokePlaying}
                setKaraokePlaying={setKaraokePlaying}
                karaokeLyricIndex={karaokeLyricIndex}
                triggerBadgeMinting={triggerBadgeMinting}
                speakText={speakText}
                setSelectedMode={setSelectedMode}
                earnSparks={earnSparks}
              />
            )}
            {/* SUB-VIEW B.2: MODE ADHD */}
            {selectedMode === 'adhd' && (
              <ADHDMode
                adhdScore={adhdScore}
                adhdGameState={adhdGameState}
                adhdCamReady={adhdCamReady}
                adhdCamError={adhdCamError}
                adhdControlMode={adhdControlMode}
                setAdhdControlMode={setAdhdControlMode}
                startAdhdCamera={startAdhdCamera}
                adhdTimeLeft={adhdTimeLeft}
                adhdFailReason={adhdFailReason}
                feedbackToast={feedbackToast}
                adhdFocusSound={adhdFocusSound}
                toggleFocusSound={toggleFocusSound}
                stopAdhdCamera={stopAdhdCamera}
                setSelectedMode={setSelectedMode}
                adhdVideoRef={adhdVideoRef}
                adhdOverlayCanvasRef={adhdOverlayCanvasRef}
                adhdGameCanvasRef={adhdGameCanvasRef}
                startGame={startGame}
                handleAdhdBoardMouseMove={handleAdhdBoardMouseMove}
                handleAdhdBoardMouseDown={handleAdhdBoardMouseDown}
                handleAdhdBoardMouseUp={handleAdhdBoardMouseUp}
                handleAdhdBoardTouchMove={handleAdhdBoardTouchMove}
                handleAdhdBoardTouchStart={handleAdhdBoardTouchStart}
                handleAdhdBoardTouchEnd={handleAdhdBoardTouchEnd}
                speakText={speakText}
                triggerBadgeMinting={triggerBadgeMinting}
              />
            )}
            
            {/* SUB-VIEW B.3: MODE TUNARUNGU */}
            {selectedMode === 'tunarungu' && (
              <TunarunguMode
                tunarunguComicPage={tunarunguComicPage}
                setTunarunguComicPage={setTunarunguComicPage}
                activeSignWord={activeSignWord}
                setActiveSignWord={setActiveSignWord}
                playTone={playTone}
                confetti={confetti}
                triggerBadgeMinting={triggerBadgeMinting}
                speakText={speakText}
                setSelectedMode={setSelectedMode}
              />
            )}
            
            {/* SUB-VIEW B.4: MODE TUNANETRA */}
            {selectedMode === 'tunanetra' && (
              <TunanetraMode
                isTunanetraNarrating={isTunanetraNarrating}
                tunanetraStoryIndex={tunanetraStoryIndex}
                setTunanetraStoryIndex={setTunanetraStoryIndex}
                micListeningSimulated={micListeningSimulated}
                tunanetraAnswerResult={tunanetraAnswerResult}
                setTunanetraAnswerResult={setTunanetraAnswerResult}
                voiceGuide={voiceGuide}
                speakText={speakText}
                stopSpeaking={stopSpeaking}
                startTunanetraMic={startTunanetraMic}
                TUNANETRA_STORIES={TUNANETRA_STORIES}
                setSelectedMode={setSelectedMode}
                triggerBadgeMinting={triggerBadgeMinting}
              />
            )}
            
            {/* SUB-VIEW B.5: MODE DISLEKSIA */}
            {selectedMode === 'disleksia' && (
              <DisleksiaMode
                rulerActive={rulerActive}
                setRulerActive={setRulerActive}
                rulerTop={rulerTop}
                setRulerTop={setRulerTop}
                disleksiaChallenge={disleksiaChallenge}
                setDisleksiaChallenge={setDisleksiaChallenge}
                isDyslexiaTracing={isDyslexiaTracing}
                dyslexiaTraceComplete={dyslexiaTraceComplete}
                dyslexiaCanvasRef={dyslexiaCanvasRef}
                handleTraceMouseDown={handleTraceMouseDown}
                handleTraceMouseMove={handleTraceMouseMove}
                handleTraceMouseUp={handleTraceMouseUp}
                setupTraceCanvas={setupTraceCanvas}
                verifyDyslexiaTrace={verifyDyslexiaTrace}
                dyslexiaMouthShape={dyslexiaMouthShape}
                isReadingMicActive={isReadingMicActive}
                startDyslexiaReadingMic={startDyslexiaReadingMic}
                readingResultText={readingResultText}
                dyslexiaPronounceCorrect={dyslexiaPronounceCorrect}
                speakText={speakText}
                stopSpeaking={stopSpeaking}
                triggerBadgeMinting={triggerBadgeMinting}
                setSelectedMode={setSelectedMode}
              />
            )}
            
            {/* SUB-VIEW B.6: MODE ABK UNIFIED */}
            {selectedMode === 'abk' && (
              <ABKUnifiedView
                speakText={speakText}
                triggerBadgeMinting={triggerBadgeMinting}
                setSelectedMode={setSelectedMode}
                adhdScore={adhdScore}
                adhdGameState={adhdGameState}
                adhdCamReady={adhdCamReady}
                adhdCamError={adhdCamError}
                adhdControlMode={adhdControlMode}
                setAdhdControlMode={setAdhdControlMode}
                adhdTimeLeft={adhdTimeLeft}
                adhdFailReason={adhdFailReason}
                feedbackToast={feedbackToast}
                adhdFocusSound={adhdFocusSound}
                toggleFocusSound={toggleFocusSound}
                stopAdhdCamera={stopAdhdCamera}
                startAdhdCamera={startAdhdCamera}
                adhdVideoRef={adhdVideoRef}
                adhdOverlayCanvasRef={adhdOverlayCanvasRef}
                adhdGameCanvasRef={adhdGameCanvasRef}
                startGame={startGame}
                handleAdhdBoardMouseMove={handleAdhdBoardMouseMove}
                handleAdhdBoardMouseDown={handleAdhdBoardMouseDown}
                handleAdhdBoardMouseUp={handleAdhdBoardMouseUp}
                handleAdhdBoardTouchMove={handleAdhdBoardTouchMove}
                handleAdhdBoardTouchStart={handleAdhdBoardTouchStart}
                handleAdhdBoardTouchEnd={handleAdhdBoardTouchEnd}
                earnSparks={earnSparks}
                sparks={sparks}
                isVideoPlaying={isVideoPlaying}
                setIsVideoPlaying={setIsVideoPlaying}
                isStoryReading={isStoryReading}
                setIsStoryReading={setIsStoryReading}
              />
            )}
            
            {/* TAB C: PROFILE VIEW */}
            {currentTab === 'profile' && !selectedMode && (
              <Profile
                username={username}
                selectedAvatar={selectedAvatar}
                setIsLoggedIn={setIsLoggedIn}
                setSelectedMode={setSelectedMode}
                stopSpeaking={stopSpeaking}
                unlockedBadges={unlockedBadges}
                blockchainLogs={blockchainLogs}
                sparks={sparks}
                setSparks={setSparks}
              />
            )}
            </main>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: CHATBOT OVERLAY DIALOG */}
        {/* ============================================================== */}
        {chatOpen && isLoggedIn && (
          <div className="absolute bottom-20 right-4 left-4 z-40 bg-white border-3 border-emerald-200 rounded-3xl shadow-xl flex flex-col h-[350px] overflow-hidden">
            {/* Chatbot Header */}
            <div className="bg-emerald-500 text-white px-4 py-3 flex items-center justify-between border-b border-emerald-600">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <div>
                  <h4 className="text-[10px] font-black leading-none">SatuArah AI Advisor</h4>
                  <p className="text-[8px] text-emerald-100 font-semibold mt-0.5 leading-none">Inklusi & Kurikulum Spesifik</p>
                </div>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="text-white hover:text-emerald-100 text-base font-black"
              >
                ✕
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50 flex flex-col">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index}
                  className={`max-w-[85%] rounded-2xl p-2.5 text-[9px] font-semibold leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500 text-white self-end rounded-tr-none'
                      : 'bg-white border border-emerald-100 text-slate-700 self-start rounded-tl-none'
                  }`}
                >
                  {msg.text.split('\n').map((line, idx) => (
                    <p key={idx} className={line.startsWith('-') || line.match(/^\d+\./) ? 'pl-2 list-item list-inside' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              ))}

              {chatbotTyping && (
                <div className="bg-white border border-emerald-100 text-slate-400 self-start rounded-2xl rounded-tl-none p-2.5 text-[9px] font-bold flex gap-1">
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}
            </div>

            {/* Chat Preset Shortcuts */}
            <div className="p-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
              <button
                onClick={() => { setChatInput('Tips anak ADHD'); }}
                className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[8px] font-black inline-block"
              >
                💡 ADHD
              </button>
              <button
                onClick={() => { setChatInput('Tips anak Disleksia'); }}
                className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[8px] font-black inline-block"
              >
                💡 Disleksia
              </button>
              <button
                onClick={() => { setChatInput('Apa itu Lencana Belajar?'); }}
                className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[8px] font-black inline-block"
              >
                🏆 Lencana Belajar
              </button>
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleChatbotMessageSubmit} className="p-2 border-t border-slate-100 bg-white flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Tulis pesan..."
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none rounded-xl py-2 px-3 text-[9px] font-bold text-slate-800"
              />
              <button
                type="submit"
                className="bg-emerald-500 text-white font-black px-3.5 py-2 rounded-xl text-[9px] uppercase hover:bg-emerald-600 active:scale-95"
              >
                Kirim
              </button>
            </form>
          </div>
        )}

        {/* FLOATING CHAT BUBBLE */}
        {isLoggedIn && !chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="absolute bottom-20 right-4 z-40 w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white text-2xl rounded-full shadow-lg flex items-center justify-center border-b-3 border-emerald-700 active:translate-y-0.5 active:border-b-0 cursor-pointer"
            style={{ bottom: '76px' }}
            title="Tanya AI Advisor"
          >
            💬
          </button>
        )}

        {/* ============================================================== */}
        {/* PERSISTENT FOOTER NAVIGATION */}
        {/* ============================================================== */}
        {isLoggedIn && (
          <footer className="bg-white border-t border-emerald-100 grid grid-cols-3 py-2 sticky bottom-0 z-30">
            {/* Tab 1: Home */}
            <button
              onClick={() => { setCurrentTab('home'); setSelectedMode(null); stopSpeaking(); }}
              className={`flex flex-col items-center gap-0.5 py-1 text-slate-500 hover:text-emerald-600 transition-colors ${
                currentTab === 'home' ? 'text-emerald-500 font-black' : 'font-bold'
              }`}
            >
              <span className="text-lg">🏠</span>
              <span className="text-[9px]">Home</span>
            </button>

            {/* Tab 2: Belajar */}
            <button
              onClick={() => { setCurrentTab('belajar'); }}
              className={`flex flex-col items-center gap-0.5 py-1 text-slate-500 hover:text-emerald-600 transition-colors ${
                currentTab === 'belajar' || selectedMode ? 'text-emerald-500 font-black' : 'font-bold'
              }`}
            >
              <span className="text-lg">📖</span>
              <span className="text-[9px]">Belajar</span>
            </button>

            {/* Tab 3: Profile */}
            <button
              onClick={() => { setCurrentTab('profile'); setSelectedMode(null); stopSpeaking(); }}
              className={`flex flex-col items-center gap-0.5 py-1 text-slate-500 hover:text-emerald-600 transition-colors ${
                currentTab === 'profile' ? 'text-emerald-500 font-black' : 'font-bold'
              }`}
            >
              <span className="text-lg">👤</span>
              <span className="text-[9px]">Profile</span>
            </button>
          </footer>
        )}

        {/* LENCANA ACHIEVEMENT MODAL (UNLOCKED BADGE REWARD) */}
        {activeBadgeToMint && (
          <div className="absolute inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 w-full max-w-[280px] text-center border-3 border-emerald-400 space-y-4 shadow-2xl animate-float">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-inner border border-emerald-200">
                {activeBadgeToMint === 'reguler' ? '🎓' : activeBadgeToMint === 'adhd' ? '🎯' : activeBadgeToMint === 'tunarungu' ? '🤟' : activeBadgeToMint === 'tunanetra' ? '🎧' : '✏️'}
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-slate-800 text-sm uppercase">
                  {badgeClaimComplete ? '🌟 Lencana Berhasil Diklaim!' : '🏆 Selamat! Lencana Baru!'}
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                  {badgeClaimComplete 
                    ? mintingStatusText 
                    : `Kamu luar biasa! Berhasil menyelesaikan modul pembelajaran ${activeBadgeToMint.toUpperCase()} cilik.`
                  }
                </p>
              </div>
              {badgeClaimComplete ? (
                <div className="space-y-2.5">
                  <button
                    onClick={handleBadgeBelajarLagi}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black py-3 rounded-2xl text-xs uppercase shadow-md active:scale-95 transition-all cursor-pointer border-b-4 border-teal-800"
                  >
                    📚 Belajar Lagi
                  </button>
                  <button
                    onClick={handleBadgeBackToMenu}
                    className="w-full bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 font-black py-3 rounded-2xl text-xs uppercase shadow-md active:scale-95 transition-all cursor-pointer border-b-4 border-slate-400"
                  >
                    🏠 Kembali ke Menu Utama
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col items-center justify-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                  <span className="text-[10px] font-black text-emerald-700">✨ Menyimpan Lencana ke Koleksimu...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FLOATING SPARK SATUARAH TOAST (SUPER CELEBRATORY & NEON NGEJRENG) */}
        {sparkToast.show && (
          <div className="absolute top-20 left-4 right-4 z-50 animate-bounce">
            <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border-4 border-amber-800 rounded-3xl p-4 shadow-[0_8px_0_#9a3412] text-center flex flex-col items-center justify-center space-y-1">
              <span className="text-3xl animate-pulse">✨ Sparks! ✨</span>
              <h4 className="text-[12px] font-black text-amber-950 uppercase tracking-widest leading-none">
                +{sparkToast.amount} SPARK SATUARAH
              </h4>
              <p className="text-[9px] text-amber-900 font-extrabold bg-white/40 px-3 py-0.5 rounded-full">
                🎯 {sparkToast.reason}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
