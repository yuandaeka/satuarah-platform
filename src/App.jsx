import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function App() {
  // Global States
  const [currentMode, setCurrentMode] = useState('regular');
  const [walletTokens, setWalletTokens] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState({
    regular: false,
    deaf: false,
    blind: false,
    adhd: false,
    dyslexia: false
  });
  
  // Clock State
  const [liveTime, setLiveTime] = useState('23:41 WIB');

  // Page Routing State (Simulates Page Transitions)
  const [isChatpageActive, setIsChatpageActive] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Halo! Saya adalah AI Advisor SatuArah. Tanyakan apa saja seputar tips belajar inklusif atau klik tombol pintasan di bawah untuk melihat tips mengedukasi anak disleksia!' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Webcam & Audio Stream Refs
  const webcamVideoRef = useRef(null);
  const webcamCanvasRef = useRef(null);
  const audioCanvasRef = useRef(null);
  
  // Stream states to close them on unmount / mode switch
  const [webcamStream, setWebcamStream] = useState(null);
  const [micStream, setMicStream] = useState(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  
  // Real Hand Detection State (Computer Vision Results)
  const [isHandDetectedReal, setIsHandDetectedReal] = useState(false);

  // Audio Context Ref
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);

  // Animation Frame IDs
  const webcamAnimationRef = useRef(null);
  const audioAnimationRef = useRef(null);

  // Active MediaPipe instances
  const activeCameraRef = useRef(null);
  const activeHandsModelRef = useRef(null);

  // Reading Ruler States (Dyslexia)
  const [rulerActive, setRulerActive] = useState(false);
  const [rulerTop, setRulerTop] = useState(0);

  // ADHD Game States
  const [rocketProgress, setRocketProgress] = useState(0);

  // Speech Narration State
  const [isNarrating, setIsNarrating] = useState(false);

  // Blockchain Minting Modal States
  const [mintingModalOpen, setMintingModalOpen] = useState(false);
  const [mintingLogs, setMintingLogs] = useState([]);
  const [mintingComplete, setMintingComplete] = useState(false);
  const [activeBadgeToMint, setActiveBadgeToMint] = useState('');
  const [currentTxHash, setCurrentTxHash] = useState('');
  const [blockchainHistory, setBlockchainHistory] = useState([]);
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);

  // Sidebar Log History
  const [sidebarLogs, setSidebarLogs] = useState([
    { time: '23:41', text: '[System] Node Init' },
    { time: '23:41', text: '[SBT Passport] Wallet: 0x8458...be4b' }
  ]);

  // Refs for tracking active timeouts and intervals to prevent state-leak race conditions
  const signTimeoutRef = useRef(null);
  const voiceTimeoutRef1 = useRef(null);
  const voiceTimeoutRef2 = useRef(null);
  const mintingIntervalRef = useRef(null);
  const utteranceRef = useRef(null);
  const speakTimeoutRef = useRef(null);

  // Mode Reference to prevent stale closures in async timeout speech synthese
  const modeRef = useRef(currentMode);

  // Sync mode reference on change
  useEffect(() => {
    modeRef.current = currentMode;
  }, [currentMode]);

  // Update Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setLiveTime(`${hours}:${minutes} WIB`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat box when new messages arrive
  useEffect(() => {
    const chatContainer = document.getElementById('chat-messages-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatMessages, isTyping, isChatpageActive]);

  // Helper to clear all scheduled animations and timeouts
  const clearAllTimeoutsAndIntervals = () => {
    if (signTimeoutRef.current) clearTimeout(signTimeoutRef.current);
    if (voiceTimeoutRef1.current) clearTimeout(voiceTimeoutRef1.current);
    if (voiceTimeoutRef2.current) clearTimeout(voiceTimeoutRef2.current);
    if (mintingIntervalRef.current) clearInterval(mintingIntervalRef.current);
    if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
  };

  // Update body tag classes to reflect mode adaptation dynamically
  useEffect(() => {
    // If chatbot page is active, do not apply accessibility background colors
    if (isChatpageActive) {
      document.body.className = "bg-indigo-50/50 text-slate-800 min-h-screen flex flex-col antialiased";
      stopWebcamStream();
      stopMicStream();
      if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    // Reset body classes
    document.body.className = "bg-indigo-50/50 text-slate-800 min-h-screen flex flex-col antialiased";
    
    // Explicitly cancel any speaking immediately
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    if (currentMode === 'blind') {
      document.body.classList.add('mode-blind');
    } else if (currentMode === 'adhd') {
      document.body.classList.add('mode-adhd');
    } else if (currentMode === 'dyslexia') {
      document.body.classList.add('mode-dyslexia');
    }

    // Clean up media streams and speech synthesizer
    stopWebcamStream();
    stopMicStream();

    // Trigger Speech synthesis welcome message if blind mode
    if (currentMode === 'blind') {
      speakText("Mode Tunanetra aktif. Modul suara dan perintah suara dinyalakan. Klik tombol kuning di tengah untuk memutar penjelasan materi, atau tekan tombol mik di bawah untuk mengucapkan jawaban.", 'blind');
      startMicFeed();
    } else if (currentMode === 'deaf') {
      startWebcamFeed();
    }

    // Reset ADHD rocket progress
    if (currentMode === 'adhd') {
      setRocketProgress(0);
    }

    // Cleanup when mode transitions
    return () => {
      if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      clearAllTimeoutsAndIntervals();
    };
  }, [currentMode, isChatpageActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebcamStream();
      stopMicStream();
      clearAllTimeoutsAndIntervals();
      if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle Mousemove for Dyslexia Reading Ruler
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (rulerActive) {
        setRulerTop(e.clientY - 22);
      }
    };
    if (rulerActive) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [rulerActive]);

  // -------------------------------------------------------------
  // ACCESSIBILITY LOGIC: Webcam & Microphone (Real MediaPipe)
  // -------------------------------------------------------------

  const startWebcamFeed = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
      setWebcamStream(stream);
      setIsWebcamActive(true);
      
      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = stream;
        webcamVideoRef.current.play();
      }

      // Check if MediaPipe scripts loaded in index.html
      const hasMediaPipe = typeof window.Hands !== 'undefined' && typeof window.Camera !== 'undefined';
      
      if (hasMediaPipe) {
        const hands = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        hands.onResults((results) => {
          drawHandsLandmarks(results);
        });

        activeHandsModelRef.current = hands;

        const camera = new window.Camera(webcamVideoRef.current, {
          onFrame: async () => {
            if (webcamVideoRef.current && activeHandsModelRef.current) {
              await activeHandsModelRef.current.send({ image: webcamVideoRef.current });
            }
          },
          width: 320,
          height: 240
        });
        
        camera.start();
        activeCameraRef.current = camera;
      } else {
        console.log("MediaPipe scripts not found, falling back to simulated hand skeleton");
        requestAnimationFrame(drawWebcamSkeletonSimulation);
      }
    } catch (err) {
      console.log("Webcam access denied or unavailable. Fallback to simulated hand skeleton.");
      setIsWebcamActive(false);
      requestAnimationFrame(drawWebcamSkeletonSimulation); // Run simulated joints
    }
  };

  // Draw real MediaPipe hands landmarks on the canvas
  const drawHandsLandmarks = (results) => {
    const canvas = webcamCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw simulated YOLO-style face box overlay
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(width / 2 - 50, height / 2 - 100, 100, 90);
    ctx.fillStyle = '#3B82F6';
    ctx.font = 'bold 9px Poppins';
    ctx.fillText("AI: WAJAH (99%)", width / 2 - 50, height / 2 - 105);

    // If hands are detected by MediaPipe
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setIsHandDetectedReal(true);
      
      results.multiHandLandmarks.forEach((landmarks, index) => {
        ctx.strokeStyle = '#10B981'; // AI Emerald Green lines
        ctx.lineWidth = 3;
        
        // Helper connection drawer
        const drawLine = (p1, p2) => {
          ctx.beginPath();
          ctx.moveTo(landmarks[p1].x * width, landmarks[p1].y * height);
          ctx.lineTo(landmarks[p2].x * width, landmarks[p2].y * height);
          ctx.stroke();
        };

        // Wrist to fingers connection maps
        drawLine(0, 1); drawLine(1, 2); drawLine(2, 3); drawLine(3, 4);
        drawLine(0, 5); drawLine(5, 6); drawLine(6, 7); drawLine(7, 8);
        drawLine(9, 10); drawLine(10, 11); drawLine(11, 12);
        drawLine(5, 9);
        drawLine(13, 14); drawLine(14, 15); drawLine(15, 16);
        drawLine(9, 13);
        drawLine(0, 17); drawLine(17, 18); drawLine(18, 19); drawLine(19, 20);
        drawLine(13, 17);

        // Draw glowing circles on key joints
        ctx.fillStyle = '#34D399';
        landmarks.forEach((landmark) => {
          ctx.beginPath();
          ctx.arc(landmark.x * width, landmark.y * height, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1;
          ctx.stroke();
        });

        // AI confidence tag on hand
        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 8px Poppins';
        ctx.fillText(`AI: TANGAN TERDETEKSI (97%)`, landmarks[0].x * width - 15, landmarks[0].y * height + 15);
      });
    } else {
      setIsHandDetectedReal(false);
    }
  };

  // Fallback visual drawer (Simulated skeleton hand bouncing on canvas)
  const drawWebcamSkeletonSimulation = () => {
    const canvas = webcamCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const time = Date.now() * 0.003;
    const centerX = width / 2 + Math.sin(time) * 35;
    const centerY = height / 2 + Math.cos(time * 1.4) * 20;

    // Toggle hand detection simulated state
    setIsHandDetectedReal(true);

    ctx.strokeStyle = '#10B981'; // Green tracking line
    ctx.fillStyle = '#34D399';
    ctx.lineWidth = 3;

    const wrist = { x: centerX, y: centerY + 65 };
    const knuckles = [
      { x: centerX - 45, y: centerY + 5 },
      { x: centerX - 20, y: centerY - 10 },
      { x: centerX + 5, y: centerY - 15 },
      { x: centerX + 30, y: centerY - 10 },
      { x: centerX + 55, y: centerY + 5 }
    ];

    knuckles.forEach(k => {
      ctx.beginPath();
      ctx.moveTo(wrist.x, wrist.y);
      ctx.lineTo(k.x, k.y);
      ctx.stroke();
    });

    knuckles.forEach((k, i) => {
      ctx.beginPath();
      ctx.moveTo(k.x, k.y);
      const tipY = k.y - 35 - Math.sin(time + i * 0.8) * 12;
      const tipX = k.x + Math.cos(time + i * 0.5) * 6;
      ctx.lineTo(tipX, tipY);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(k.x, k.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(tipX, tipY, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.strokeRect(width / 2 - 60, centerY - 110, 120, 100);

    ctx.fillStyle = '#3B82F6';
    ctx.font = 'bold 9px Poppins';
    ctx.fillText("AI: WAJAH (98%)", width / 2 - 60, centerY - 115);
    ctx.fillStyle = '#10B981';
    ctx.fillText("AI: GESTURE TRACKING (97%) (SIMULATED)", centerX - 45, centerY + 85);

    webcamAnimationRef.current = requestAnimationFrame(drawWebcamSkeletonSimulation);
  };

  const stopWebcamStream = () => {
    if (activeCameraRef.current) {
      activeCameraRef.current.stop();
      activeCameraRef.current = null;
    }
    if (activeHandsModelRef.current) {
      activeHandsModelRef.current.close();
      activeHandsModelRef.current = null;
    }
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
      setWebcamStream(null);
    }
    setIsWebcamActive(false);
    setIsHandDetectedReal(false);
    if (webcamAnimationRef.current) {
      cancelAnimationFrame(webcamAnimationRef.current);
    }
  };

  const startMicFeed = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);
      setIsMicActive(true);

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;
      
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      requestAnimationFrame(drawAudioWaveform);
    } catch (err) {
      console.log("Mic access denied or unavailable. Running simulated sound wave.");
      setIsMicActive(false);
      requestAnimationFrame(drawAudioWaveform); // Run fake wave
    }
  };

  const stopMicStream = () => {
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
      setMicStream(null);
    }
    setIsMicActive(false);
    if (audioAnimationRef.current) {
      cancelAnimationFrame(audioAnimationRef.current);
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  };

  const drawAudioWaveform = () => {
    const canvas = audioCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    let dataArray = null;
    if (analyserRef.current) {
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }

    const time = Date.now() * 0.005;
    ctx.lineWidth = 4;

    // Draw layers of waving paths
    for (let w = 0; w < 3; w++) {
      ctx.strokeStyle = w === 0 ? 'rgba(255, 255, 0, 0.9)' : w === 1 ? 'rgba(255, 255, 0, 0.5)' : 'rgba(255, 255, 0, 0.25)';
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        let amplitude = 25 + Math.sin(time * 0.5) * 12;

        let voiceBoost = 1;
        if (analyserRef.current && dataArray) {
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          voiceBoost = 1 + (sum / dataArray.length) * 0.15; // Reactive amplitude based on audio volume
        }

        const y = height / 2 + Math.sin(x * 0.025 + time + w) * amplitude * Math.sin(x / width * Math.PI) * voiceBoost;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    audioAnimationRef.current = requestAnimationFrame(drawAudioWaveform);
  };

  // Narrate text to speech using Web Speech API with structural guards
  const speakText = (text, allowedMode) => {
    // Guard: Prevent speech if the current active mode doesn't match the permitted layout
    if (allowedMode && modeRef.current !== allowedMode) {
      if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if ('speechSynthesis' in window) {
      // Only cancel if speaking to avoid thread lockups
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);

      // Delay speaking by 50ms to allow cancel to complete and prevent locks
      speakTimeoutRef.current = setTimeout(() => {
        // Double check mode after timeout
        if (allowedMode && modeRef.current !== allowedMode) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance; // Keep persistent ref to prevent GC

        utterance.lang = 'id-ID';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        const voices = window.speechSynthesis.getVoices();
        const idVoice = voices.find(v => v.lang.includes('id') || v.name.toLowerCase().includes('indonesian'));
        if (idVoice) utterance.voice = idVoice;

        utterance.onstart = () => setIsNarrating(true);
        utterance.onend = () => {
          setIsNarrating(false);
          utteranceRef.current = null;
        };
        utterance.onerror = (e) => {
          console.error("SpeechSynthesis error:", e);
          setIsNarrating(false);
          utteranceRef.current = null;
        };

        window.speechSynthesis.speak(utterance);
      }, 50);
    }
  };

  // -------------------------------------------------------------
  // DYSLEXIA TEXT HIGHLIGHTING RULER
  // -------------------------------------------------------------
  const toggleReadingRuler = () => {
    setRulerActive(!rulerActive);
  };

  // -------------------------------------------------------------
  // ADHD TARGET GAMEPLAY MECHANICS
  // -------------------------------------------------------------
  const handleShootAsteroid = (isCorrect) => {
    if (isCorrect) {
      const nextProgress = Math.min(100, rocketProgress + 34);
      setRocketProgress(nextProgress);
      
      if (nextProgress >= 100) {
        setTimeout(() => {
          // Double check that we are still in ADHD mode before triggering
          if (modeRef.current === 'adhd') {
            triggerMintingModal('adhd');
          }
        }, 500);
      }
    } else {
      alert("Asteroid salah! Target meleset, coba lagi.");
    }
  };

  // -------------------------------------------------------------
  // BLOCKCHAIN SBT MINTING SYSTEMS
  // -------------------------------------------------------------
  const triggerMintingModal = (badgeKey) => {
    // Generate random mock transaction hash
    const generatedHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setCurrentTxHash(generatedHash);
    setActiveBadgeToMint(badgeKey);
    setMintingComplete(false);
    setMintingLogs([]);
    setMintingModalOpen(true);

    const logs = [
      `> [System] Membuka saluran aman ke Inclusion Trust Node...`,
      `> [System] Wallet Terdeteksi: 0x8458ee3fd78a4d91b0d9c25e5beb4bbe`,
      `> [Ledger] Mengevaluasi metadata kompetensi siswa...`,
      `> [AI Oracle] Status: Bukti Belajar Valid (Suku Materi: Tata Surya, Mode: ${badgeKey.toUpperCase()})`,
      `> [Contract] Memanggil Smart Contract: SatuArahSBT.sol ...`,
      `> [Network] Menyiapkan gas fee (L2 Subsidized - Free for Education)...`,
      `> [Ledger] Memancarkan blok transaksi ke 12 validator...`,
      `> [Network] Transaksi terkonfirmasi pada Block #${Math.floor(Math.random() * 10000000 + 4000000)}!`,
      `> [Contract] Minting Soulbound Token ID: sbt_${badgeKey}_${Math.floor(Math.random() * 9000 + 1000)} sukses!`,
      `> [System] Transaksi Hash: ${generatedHash}`,
      `> [System] SBT berhasil diamankan secara permanen.`
    ];

    if (mintingIntervalRef.current) clearInterval(mintingIntervalRef.current);

    let i = 0;
    mintingIntervalRef.current = setInterval(() => {
      if (i < logs.length) {
        setMintingLogs(prev => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(mintingIntervalRef.current);
        setMintingComplete(true);
      }
    }, 250);
  };

  const handleClaimSBT = () => {
    // Trigger local confetti effect
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    // Update tokens & badge triggers
    setWalletTokens(prev => prev + 1);
    setUnlockedBadges(prev => ({
      ...prev,
      [activeBadgeToMint]: true
    }));

    // Update sidebar audits
    const now = new Date();
    const timestampStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setSidebarLogs(prev => [
      ...prev,
      { time: timestampStr, text: `Minted: ${activeBadgeToMint.toUpperCase()} SBT` }
    ]);

    // Push details to audit logs
    setBlockchainHistory(prev => [
      ...prev,
      {
        mode: activeBadgeToMint,
        timestamp: now.toLocaleString(),
        txHash: currentTxHash
      }
    ]);

    // Close Modal
    setMintingModalOpen(false);

    // Audio congrats feedback
    if (currentMode === 'blind') {
      speakText("Selamat! Token kompetensi baru berhasil dicetak ke dompet digital anda.", 'blind');
    }
  };

  // Switch selector modes
  const handleModeChange = (mode) => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    clearAllTimeoutsAndIntervals();
    setCurrentMode(mode);
  };

  // Quick Sign Language Simulation Match
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationSuccess, setCalibrationSuccess] = useState(false);

  const startSignCalibration = () => {
    setIsCalibrating(true);
    setCalibrationSuccess(false);
    
    if (signTimeoutRef.current) clearTimeout(signTimeoutRef.current);
    
    signTimeoutRef.current = setTimeout(() => {
      // Double check active mode ref before triggering modal
      if (modeRef.current === 'deaf') {
        setIsCalibrating(false);
        setCalibrationSuccess(true);
        triggerMintingModal('deaf');
      }
    }, 2000);
  };

  // Tunanetra voice simulator trigger
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceInputReceived, setVoiceInputReceived] = useState(false);

  const simulateVoiceResponse = () => {
    setIsVoiceListening(true);
    setVoiceInputReceived(false);
    speakText("Mendengarkan jawaban.", 'blind');
    
    if (voiceTimeoutRef1.current) clearTimeout(voiceTimeoutRef1.current);
    if (voiceTimeoutRef2.current) clearTimeout(voiceTimeoutRef2.current);

    voiceTimeoutRef1.current = setTimeout(() => {
      if (modeRef.current === 'blind') {
        setIsVoiceListening(false);
        setVoiceInputReceived(true);
        speakText("Suara diterima: Satu. Jawaban Anda benar.", 'blind');
        
        voiceTimeoutRef2.current = setTimeout(() => {
          if (modeRef.current === 'blind') {
            triggerMintingModal('blind');
          }
        }, 1200);
      }
    }, 2000);
  };

  // -------------------------------------------------------------
  // AI ADVISOR CHATBOT SERVICES (Parents & Teachers Consultation)
  // -------------------------------------------------------------

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsTyping(true);

    if (voiceTimeoutRef1.current) clearTimeout(voiceTimeoutRef1.current);

    voiceTimeoutRef1.current = setTimeout(() => {
      setIsTyping(false);
      let aiText = "Terima kasih atas pertanyaannya. Sebagai AI Advisor SatuArah, saya menyarankan pendekatan multisensori yang dipersonalisasi sesuai profil belajar anak. Apakah Anda ingin mempelajari tips khusus untuk Disleksia, ADHD, atau Autisme?";
      
      const lowerText = userText.toLowerCase();
      if (lowerText.includes('disleksia') || lowerText.includes('baca') || lowerText.includes('eja')) {
        aiText = "Untuk mendidik anak disleksia, disarankan menggunakan metode multisensori (belajar dengan visual, suara, dan gerakan rabaan), memakai font ramah disleksia (seperti OpenDyslexic), serta memandu baris baca kalimat menggunakan reading ruler agar tidak melompat-lompat.";
      } else if (lowerText.includes('adhd') || lowerText.includes('fokus') || lowerText.includes('konsentrasi')) {
        aiText = "Untuk mendidik anak ADHD, fokuslah meminimalkan distraksi visual dengan layar tenang, membagi instruksi menjadi langkah kecil bertahap, serta memberi jeda singkat (brain breaks) secara teratur untuk menjaga motivasi dopamin mereka.";
      } else if (lowerText.includes('rungu') || lowerText.includes('tuli') || lowerText.includes('isyarat')) {
        aiText = "Untuk anak tunarungu, optimalkan media pembelajaran visual terstruktur, gunakan peragaan bahasa isyarat BISINDO yang konsisten, dan latih motorik isyarat mereka menggunakan asisten deteksi webcam AI.";
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
    }, 1500);
  };

  const triggerDyslexiaTipsChat = () => {
    setChatMessages(prev => [...prev, { sender: 'user', text: 'Tolong berikan tips mengedukasi anak disleksia.' }]);
    setIsTyping(true);

    if (voiceTimeoutRef1.current) clearTimeout(voiceTimeoutRef1.current);

    voiceTimeoutRef1.current = setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [...prev, {
        sender: 'ai',
        text: `Berikut adalah 5 Tips Utama Mengedukasi Anak Disleksia:\n\n1. Metode Pembelajaran Multisensori\nMenggabungkan indra penglihatan (visual), pendengaran (auditori), perabaan (taktil), dan gerakan (kinestetik). Contoh: mengeja kata sambil menulis huruf di pasir, menggunakan cetakan huruf 3D, atau merangkai huruf lilin (clay).\n\n2. Pembelajaran Phonics (Fonik) Berstruktur\nAjarkan hubungan antara bunyi (fonem) dan lambang huruf (grafem) secara sistematis dan berulang. Mulailah dari bunyi huruf tunggal sebelum merangkai suku kata menjadi kata yang lebih kompleks.\n\n3. Gunakan Buku & Font Ramah Disleksia\nPilihlah buku dengan gambar visual menarik dan menggunakan font khusus disleksia seperti OpenDyslexic atau Comic Neue. Font ini memiliki bagian bawah yang lebih tebal untuk mencegah anak melihat huruf terbalik atau berputar.\n\n4. Manfaatkan Alat Bantu Baca (Reading Ruler)\nGunakan penggaris atau strip pembatas transparan berwarna kuning untuk menutupi baris kalimat lain. Hal ini membantu memusatkan pandangan anak hanya pada satu baris teks saja agar tidak melompat-lompat.\n\n5. Berikan Apresiasi dan Dukungan Emosional\nAnak disleksia sering merasa frustrasi dan minder di sekolah. Fokuslah pada usaha keras mereka, berikan waktu tambahan untuk tugas membaca, dan bangun rasa percaya diri anak dengan mengapresiasi kelebihan mereka di bidang lain seperti seni atau olahraga.`
      }]);
    }, 1500);
  };

  const triggerADHDTipsChat = () => {
    setChatMessages(prev => [...prev, { sender: 'user', text: 'Bagaimana panduan komunikasi untuk anak ADHD?' }]);
    setIsTyping(true);

    if (voiceTimeoutRef2.current) clearTimeout(voiceTimeoutRef2.current);

    voiceTimeoutRef2.current = setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [...prev, {
        sender: 'ai',
        text: `Berikut adalah Panduan Komunikasi Efektif dengan Anak ADHD:\n\n1. Berikan Instruksi Pendek & Jelas\nHindari memberikan instruksi majemuk (misal: "Rapikan buku, matikan lampu, cuci kaki"). Berikan instruksi satu per satu secara terpisah.\n\n2. Lakukan Kontak Mata yang Intim\nHampiri anak, samakan tinggi tubuh Anda, lalu tatap matanya dengan lembut sebelum memberikan instruksi guna memastikan perhatian mereka terfokus.\n\n3. Gunakan Dukungan Visual (Visual Aids)\nGunakan jadwal bergambar atau daftar ceklis misi harian. Anak ADHD merespons penanda visual terstruktur jauh lebih baik daripada sekadar verbal.\n\n4. Hindari Frustrasi Berlebih & Berikan Jeda (Brain Breaks)\nBiarkan anak bergerak atau istirahat sejenak 5 menit setelah belajar selama 15-20 menit untuk menjaga stabilitas dopamin mereka.\n\n5. Berikan Umpan Balik Positif Instan\nBerikan pujian yang spesifik dan langsung begitu mereka menyelesaikan langkah kecil (misal: "Hebat sekali kamu langsung menaruh pensil di kotak").`
      }]);
    }, 1500);
  };

  // -------------------------------------------------------------
  // CONDITIONAL RENDERING FOR CHATBOT PAGE (SPA Router simulation)
  // -------------------------------------------------------------
  if (isChatpageActive) {
    return (
      <div className="flex-grow flex flex-col w-full bg-slate-50 min-h-screen">
        {/* Header Bento Card */}
        <header className="max-w-4xl w-full mx-auto px-4 pt-6">
          <div className="bg-white bubbly-card rounded-4xl px-4 md:px-6 py-4 flex justify-between items-center gap-4">
            <button
              onClick={() => setIsChatpageActive(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-2.5 px-5 rounded-3xl border-b-4 border-slate-300 active:border-b-2 active:translate-y-0.5 text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left"></i> Kembali ke Dashboard
            </button>
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-600 text-white p-2 rounded-2xl animate-float">
                <i className="fa-solid fa-robot text-base"></i>
              </div>
              <span className="text-xs md:text-sm font-black text-slate-800">SatuArah AI Advisor</span>
            </div>
          </div>
        </header>

        {/* Main Chat Interface page */}
        <main className="flex-grow max-w-4xl w-full mx-auto p-4 flex flex-col gap-6">
          <div className="bg-white bubbly-card rounded-4xl p-4 md:p-6 flex flex-col h-[550px] relative overflow-hidden flex-grow">
            
            {/* Chat header */}
            <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm md:text-base">Asisten Inklusi Pintar</h3>
                <p className="text-[10px] text-green-500 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block animate-ping"></span>
                  Online • Konsultan Orang Tua & Guru
                </p>
              </div>
              <button
                onClick={() => setChatMessages([
                  { sender: 'ai', text: 'Halo! Saya adalah AI Advisor SatuArah. Tanyakan apa saja seputar tips belajar inklusif atau klik tombol pintasan di bawah untuk melihat tips mengedukasi anak disleksia!' }
                ])}
                className="text-[9px] md:text-[10px] text-slate-400 font-bold hover:text-indigo-600 cursor-pointer"
              >
                Reset Riwayat Chat
              </button>
            </div>

            {/* Chat bubbles */}
            <div
              id="chat-messages-container"
              className="flex-grow overflow-y-auto space-y-4 pr-1 md:pr-2 scrollbar-thin scrollbar-thumb-slate-200"
            >
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2.5`}>
                  {msg.sender === 'ai' && (
                    <div className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-inner shrink-0">
                      🤖
                    </div>
                  )}
                  <div className={`p-4 rounded-3xl max-w-[80%] text-xs md:text-sm font-semibold leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-50 border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text.split('\n').map((line, lIdx) => (
                      <p key={lIdx} className={line.startsWith('-') || line.match(/^\d+\./) ? 'mt-1.5 pl-2 list-item list-inside' : 'mt-0.5'}>
                        {line}
                      </p>
                    ))}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="bg-gradient-to-tr from-amber-400 to-indigo-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md shrink-0">
                      🧑‍🚀
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing loader */}
              {isTyping && (
                <div className="flex justify-start items-end gap-2.5">
                  <div className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0">
                    🤖
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-3xl rounded-bl-none text-slate-400 text-xs md:text-sm font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Template Buttons Stack */}
            <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={triggerDyslexiaTipsChat}
                className="bg-teal-50 hover:bg-teal-100 text-teal-700 font-extrabold py-2 px-3 rounded-full border border-teal-200 text-[10px] md:text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm animate-pulse-glow"
              >
                💡 Tips Mengedukasi Anak Disleksia
              </button>
              <button
                onClick={triggerADHDTipsChat}
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold py-2 px-3 rounded-full border border-purple-200 text-[10px] md:text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                💡 Panduan Komunikasi ADHD
              </button>
            </div>

            {/* Input message form */}
            <form onSubmit={handleSendMessage} className="mt-3.5 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Tulis pertanyaan Anda untuk AI Advisor..."
                className="flex-1 bg-slate-50 border-2 border-slate-200 focus:border-indigo-400 outline-none rounded-2xl py-3 px-4 text-xs md:text-sm font-semibold transition-all"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-5 py-3 rounded-2xl border-b-4 border-indigo-800 active:border-b-0 active:translate-y-0.5 transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                Kirim <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Reading Ruler overlay for Dyslexia */}
      {rulerActive && currentMode === 'dyslexia' && (
        <div
          id="reading-ruler"
          className="hidden md:block"
          style={{ top: `${rulerTop}px` }}
        />
      )}

      {/* Header Bento Card */}
      <header className="max-w-7xl w-full mx-auto px-4 md:px-6 pt-6">
        <div id="header-bento" className="bg-white bubbly-card rounded-4xl px-4 md:px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-600 text-white p-3 rounded-3xl shadow-[0_6px_0_#3730A3] animate-float">
              <i className="fa-solid fa-compass-navigation text-2xl md:text-3xl"></i>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-indigo-600 flex items-center flex-wrap gap-1">
                Satu<span className="text-amber-500">Arah</span>
                <span className="text-[10px] md:text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ml-2 border border-indigo-200">
                  Vite React
                </span>
              </h1>
              <p className="text-[10px] md:text-xs text-slate-500 font-semibold tracking-wide mt-0.5">
                Edukasi Inklusif Dinamis Adaptif AI • Mobile & Web Friendly
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <div className="bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-full border-2 border-emerald-200 text-[10px] md:text-xs font-bold flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <i className="fa-solid fa-cubes text-emerald-500"></i>
              <span>Trust Ledger: Connected</span>
            </div>
            <div className="bg-slate-100 text-slate-700 px-3.5 py-2 rounded-full border-2 border-slate-200 text-[10px] md:text-xs font-bold flex items-center gap-1.5">
              <i className="fa-regular fa-clock text-indigo-500"></i>
              <span>{liveTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SIDEBAR BENTO PANEL (Left 4 Columns) */}
        <section className="lg:col-span-4 flex flex-col gap-6 w-full">
          
          {/* Student Profile Card */}
          <div id="profile-card" className="bg-white bubbly-card rounded-4xl p-5 md:p-6 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 text-slate-100 text-9xl font-black select-none pointer-events-none opacity-20">AI</div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-tr from-amber-400 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-2xl md:text-3xl shadow-lg border-2 border-white transform hover:rotate-12 transition-transform duration-300">
                  🚀
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 bg-green-500 border-2 border-white w-4 h-4 rounded-full" title="Online"></span>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-base md:text-lg leading-tight">Danendra Rasyid</h3>
                <p className="text-[10px] md:text-xs text-indigo-600 font-bold tracking-wide">Penjelajah Kosmik • Kelas 4</p>
              </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-3.5 space-y-1.5 text-[11px] md:text-xs">
              <div className="flex items-center gap-2 text-indigo-900 font-bold">
                <i className="fa-solid fa-robot text-sm animate-pulse text-indigo-500"></i>
                <span>AI Diagnostic Feedback:</span>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                {currentMode === 'regular' && "Siswa memiliki konsentrasi tinggi. Merekomendasikan visual interaktif bintang dan planet."}
                {currentMode === 'deaf' && "Mode Isyarat Aktif. Pelacakan motorik wajah dan tangan siap menangkap gerakan non-verbal."}
                {currentMode === 'blind' && "Aksesibilitas Kontras Tinggi Murni diaktifkan. Instruksi audio siap diputar ulang."}
                {currentMode === 'adhd' && "Pengurangan kontras cahaya aktif. Misi interaktif siap menstimulasi fokus."}
                {currentMode === 'dyslexia' && "Skema visual krem aktif dengan spasi huruf lebar dan alat bantu penggaris garis baca."}
              </p>
            </div>
          </div>

          {/* Mode Selection Control Card */}
          <div id="mode-selection-card" className="bg-white bubbly-card rounded-4xl p-5 md:p-6 flex flex-col gap-3">
            <h2 className="text-xs md:text-sm font-extrabold text-slate-800 mb-1 flex items-center gap-2">
              <i className="fa-solid fa-sliders text-indigo-600"></i> Pilih Mode Belajar (Adaptasi AI):
            </h2>
            
            {/* REGULER BUTTON */}
            <button
              onClick={() => handleModeChange('regular')}
              className={`btn-3d w-full text-left px-4 py-3 md:py-3.5 rounded-3xl font-extrabold border-2 flex items-center transition-all duration-200 ${
                currentMode === 'regular'
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-400'
              }`}
            >
              <span className={`p-2 rounded-2xl mr-3.5 ${currentMode === 'regular' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-500'}`}>
                <i className="fa-solid fa-graduation-cap text-base w-5 text-center"></i>
              </span>
              <div>
                <p className="text-xs md:text-sm font-black">Mode Reguler</p>
                <p className={`text-[9px] md:text-[10px] font-medium ${currentMode === 'regular' ? 'opacity-90' : 'text-slate-500'}`}>Tampilan Clean Putih-Indigo</p>
              </div>
            </button>

            {/* TUNARUNGU BUTTON */}
            <button
              onClick={() => handleModeChange('deaf')}
              className={`btn-3d w-full text-left px-4 py-3 md:py-3.5 rounded-3xl font-extrabold border-2 flex items-center transition-all duration-200 ${
                currentMode === 'deaf'
                  ? 'border-sky-600 bg-sky-600 text-white shadow-lg'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-sky-400'
              }`}
            >
              <span className={`p-2 rounded-2xl mr-3.5 ${currentMode === 'deaf' ? 'bg-white/20 text-white' : 'bg-sky-50 text-sky-500'}`}>
                <i className="fa-solid fa-hands-sign text-base w-5 text-center"></i>
              </span>
              <div>
                <p className="text-xs md:text-sm font-black">Mode Tunarungu</p>
                <p className={`text-[9px] md:text-[10px] font-medium ${currentMode === 'deaf' ? 'opacity-90' : 'text-slate-500'}`}>Kamera Isyarat & BISINDO</p>
              </div>
            </button>

            {/* TUNANETRA BUTTON */}
            <button
              onClick={() => handleModeChange('blind')}
              className={`btn-3d w-full text-left px-4 py-3 md:py-3.5 rounded-3xl font-extrabold border-2 flex items-center transition-all duration-200 ${
                currentMode === 'blind'
                  ? 'border-yellow-500 bg-yellow-500 text-black shadow-lg font-black'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-yellow-500'
              }`}
            >
              <span className={`p-2 rounded-2xl mr-3.5 ${currentMode === 'blind' ? 'bg-black/20 text-black' : 'bg-yellow-50 text-yellow-600'}`}>
                <i className="fa-solid fa-ear-listen text-base w-5 text-center"></i>
              </span>
              <div>
                <p className="text-xs md:text-sm font-black">Mode Tunanetra</p>
                <p className={`text-[9px] md:text-[10px] font-medium ${currentMode === 'blind' ? 'text-black/80 font-bold' : 'text-slate-500'}`}>Layar Kuning Kontras & Audio</p>
              </div>
            </button>

            {/* ADHD BUTTON */}
            <button
              onClick={() => handleModeChange('adhd')}
              className={`btn-3d w-full text-left px-4 py-3 md:py-3.5 rounded-3xl font-extrabold border-2 flex items-center transition-all duration-200 ${
                currentMode === 'adhd'
                  ? 'border-rose-500 bg-rose-500 text-white shadow-lg'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-rose-400'
              }`}
            >
              <span className={`p-2 rounded-2xl mr-3.5 ${currentMode === 'adhd' ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-500'}`}>
                <i className="fa-solid fa-gamepad text-base w-5 text-center"></i>
              </span>
              <div>
                <p className="text-xs md:text-sm font-black">Mode ADHD / Fokus</p>
                <p className={`text-[9px] md:text-[10px] font-medium ${currentMode === 'adhd' ? 'opacity-90' : 'text-slate-500'}`}>Minimalis & Misi Gamifikasi</p>
              </div>
            </button>

            {/* DISLEKSIA BUTTON */}
            <button
              onClick={() => handleModeChange('dyslexia')}
              className={`btn-3d w-full text-left px-4 py-3 md:py-3.5 rounded-3xl font-extrabold border-2 flex items-center transition-all duration-200 ${
                currentMode === 'dyslexia'
                  ? 'border-teal-600 bg-teal-600 text-white shadow-lg'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-teal-500'
              }`}
            >
              <span className={`p-2 rounded-2xl mr-3.5 ${currentMode === 'dyslexia' ? 'bg-white/20 text-white' : 'bg-teal-50 text-teal-600'}`}>
                <i className="fa-solid fa-book-open-reader text-base w-5 text-center"></i>
              </span>
              <div>
                <p className="text-xs md:text-sm font-black">Mode Disleksia</p>
                <p className={`text-[9px] md:text-[10px] font-medium ${currentMode === 'dyslexia' ? 'opacity-90' : 'text-slate-500'}`}>Huruf Renggang & Penggaris</p>
              </div>
            </button>
          </div>
        </section>

        {/* MAIN MODULE BENTO PANEL (Right 8 Columns) */}
        <section className="lg:col-span-8 flex flex-col gap-6 w-full">
          
          {/* Main Course Content Card */}
          <div id="main-content-card" className="bg-white bubbly-card rounded-4xl p-5 md:p-8 relative overflow-hidden flex flex-col min-h-[500px]">
            
            {/* Header tags */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
              <div id="learning-track-label" className={`text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                currentMode === 'blind' 
                  ? 'bg-black border-yellow-400 text-yellow-400' 
                  : currentMode === 'adhd' 
                  ? 'bg-rose-950 border-rose-900 text-rose-400' 
                  : 'bg-indigo-50 border-indigo-200 text-indigo-600'
              }`}>
                Materi: Tata Surya & Astrofisika
              </div>
              <div id="ai-badge" className={`text-[10px] md:text-xs px-3 py-1.5 rounded-full font-bold flex items-center space-x-1.5 shadow-sm border ${
                currentMode === 'blind' 
                  ? 'bg-yellow-400 text-black border-black' 
                  : currentMode === 'adhd' 
                  ? 'bg-rose-950 text-rose-300 border-rose-800' 
                  : 'bg-purple-100 text-purple-700 border-purple-200'
              }`}>
                <i className="fa-solid fa-brain animate-pulse"></i>
                <span id="ai-status">
                  {currentMode === 'regular' && "AI: Mengatur Skema Representasi"}
                  {currentMode === 'deaf' && "AI: Kamera Gesture Aktif"}
                  {currentMode === 'blind' && "AI: Gelombang Suara & Narasi Aktif"}
                  {currentMode === 'adhd' && "AI: Menghilangkan Distraksi"}
                  {currentMode === 'dyslexia' && "AI: Penataan Font & Spasi"}
                </span>
              </div>
            </div>

            {/* Lesson Container */}
            <div className="flex-1 flex flex-col justify-between gap-6">
              
              <div>
                <h2 id="content-title" className={`text-xl md:text-3xl font-black leading-tight mb-4 ${
                  currentMode === 'blind' ? 'text-yellow-400' : 'text-indigo-900'
                }`}>
                  {currentMode === 'blind' ? 'AUDIO BELAJAR - Bab 1: Tata Surya & Mars' : 'Mengenal Tata Surya & Planet Kita 🌌'}
                </h2>
                
                {/* Lesson Narrative */}
                <div id="content-text-box" className="mb-4">
                  {currentMode === 'dyslexia' ? (
                    <p id="content-text" className="text-slate-600 font-medium text-sm md:text-lg leading-relaxed">
                      Halo Penjelajah Cilik! Hari ini kita akan terbang ke luar angkasa untuk melihat rumah kita, yaitu Planet <span className="keyword-highlight">Bumi</span>, dan tetangga-tetangganya yang bergerak mengelilingi <span className="keyword-highlight">Matahari</span> yang sangat besar! Planet terdekat keempat dari matahari dinamakan Planet <span className="keyword-highlight">Mars</span> yang sering dijuluki Planet Merah.
                    </p>
                  ) : currentMode === 'deaf' ? (
                    <p id="content-text" className="text-slate-600 font-medium text-sm md:text-lg leading-relaxed">
                      [Sistem menampilkan teks narasi visual tingkat tinggi]. Matahari memancarkan radiasi gravitasi yang menahan orbit Planet <span className='text-sky-600 font-extrabold'>Bumi</span> dan <span className='text-sky-600 font-extrabold'>Mars</span> agar berputar dalam lintasan berbentuk elips secara harmonis.
                    </p>
                  ) : currentMode === 'blind' ? (
                    <p id="content-text" className="text-yellow-400 font-bold text-sm md:text-lg leading-relaxed">
                      [MODE TUNANETRA LAYAR KONTRAS TINGGI AKTIF]. Audio otomatis membacakan materi ini menggunakan Text-To-Speech berstruktur tinggi. Tekan tombol audio di bawah untuk memutar ulang audio narasi.
                    </p>
                  ) : currentMode === 'adhd' ? (
                    <p id="content-text" className="text-slate-400 font-medium text-sm md:text-lg leading-relaxed">
                      Navigasi roket luar angkasa melintasi orbit. Jawab tantangan tembak asteroid di bawah untuk mengisi bahan bakar dan meluncurkan roket menuju orbit planet merah Mars!
                    </p>
                  ) : (
                    <p id="content-text" className="text-slate-600 font-medium text-sm md:text-lg leading-relaxed">
                      Halo Penjelajah Cilik! Hari ini kita akan terbang ke luar angkasa untuk melihat rumah kita, yaitu Planet Bumi, dan tetangga-tetangganya yang bergerak mengelilingi Matahari yang sangat besar!
                    </p>
                  )}
                </div>
              </div>

              {/* Dynamic Interactive Media Box */}
              <div id="media-container" className={`w-full rounded-3xl p-4 md:p-6 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden transition-all duration-300 border-3 border-dashed ${
                currentMode === 'blind'
                  ? 'bg-black border-yellow-400'
                  : currentMode === 'deaf'
                  ? 'bg-slate-50 border-sky-200'
                  : currentMode === 'adhd'
                  ? 'bg-slate-950 border-rose-900'
                  : currentMode === 'dyslexia'
                  ? 'bg-cream-50 border-teal-300'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                
                {/* 1. REGULER MEDIA (Twinkling stars orbiting) */}
                {currentMode === 'regular' && (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center">
                    <div className="relative w-44 h-44 md:w-48 md:h-48 flex items-center justify-center">
                      <div className="absolute inset-0 bg-slate-900 rounded-full border-4 border-indigo-200 overflow-hidden shadow-inner flex items-center justify-center">
                        <div className="absolute top-4 left-6 text-white text-[8px] opacity-70 animate-ping">★</div>
                        <div className="absolute bottom-6 right-8 text-white text-[6px] opacity-40 animate-ping">★</div>
                        <div className="absolute top-12 right-6 text-white text-[9px] opacity-80 animate-ping">★</div>
                        
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-400 rounded-full shadow-[0_0_20px_#f59e0b] border-2 border-amber-300 animate-pulse"></div>
                        
                        <div className="absolute w-24 h-24 md:w-28 md:h-28 border border-slate-700/50 rounded-full animate-[spin_10s_linear_infinite] flex items-center justify-start">
                          <div className="w-3 h-3 md:w-3.5 md:h-3.5 bg-blue-500 rounded-full border border-blue-300 shadow-[0_0_8px_#3b82f6] -ml-1.5"></div>
                        </div>
                        
                        <div className="absolute w-36 h-36 md:w-40 md:h-40 border border-slate-700/30 rounded-full animate-[spin_16s_linear_infinite] flex items-center justify-end">
                          <div className="w-2.5 h-2.5 bg-rose-500 rounded-full border border-rose-300 shadow-[0_0_8px_#f43f5e] -mr-1.25"></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-black text-slate-700">Simulasi Orbit Tata Surya Aktif</p>
                      <p className="text-[10px] md:text-xs text-slate-500 font-semibold mt-0.5">Representasi visual interaktif model heliosentris</p>
                    </div>
                    <button
                      onClick={() => speakText("Halo Penjelajah Cilik! Hari ini kita akan terbang ke luar angkasa untuk melihat planet bumi dan matahari.", 'regular')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full text-xs font-bold border-b-4 border-indigo-800 hover:border-b-2 active:translate-y-0.5 flex items-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <i className="fa-solid fa-volume-high"></i> Baca Penjelasan (AI TTS)
                    </button>
                  </div>
                )}

                {/* 2. TUNARUNGU MEDIA (Webcam skeleton + BISINDO sign hand guide) */}
                {currentMode === 'deaf' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
                    {/* Left box BISINDO simulator */}
                    <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-4 min-h-[160px]">
                      <span className="absolute top-2 left-2 bg-sky-500/85 text-white font-bold text-[8px] md:text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Kamus BISINDO AI (Kamus Visual)
                      </span>
                      <div className="flex items-center gap-6 mt-4">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-sky-100 rounded-full flex items-center justify-center text-3xl md:text-4xl border-2 border-white shadow-md animate-bounce">
                          👋
                        </div>
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl md:text-4xl border-2 border-white shadow-md animate-bounce-slow">
                          🤟
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-xs text-white font-black">Isyarat Kata: "MARS"</p>
                        <p className="text-[9px] md:text-[10px] text-sky-300 font-semibold mt-0.5">Memutar representasi isyarat 3D...</p>
                      </div>
                    </div>

                    {/* Right webcam track simulation */}
                    <div className="bg-slate-950 border-3 border-emerald-400 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[180px] p-2">
                      <span className="absolute top-2 left-2 bg-emerald-500/85 text-white font-bold text-[8px] md:text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider z-20">
                        Webcam Anda: AI Gesture Recognition
                      </span>

                      {/* Video element representing live camera input */}
                      <video
                        ref={webcamVideoRef}
                        className="absolute inset-0 w-full h-full object-cover opacity-75 rounded-2xl"
                        autoPlay
                        muted
                        playsInline
                      />
                      
                      {/* Bounding box canvas layered on top of video */}
                      <canvas
                        ref={webcamCanvasRef}
                        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                        width="320"
                        height="240"
                      />

                      {/* Display warning or green badge indicating detection state */}
                      <div className="absolute bottom-2 right-2 z-20 flex gap-2">
                        {isWebcamActive && (
                          isHandDetectedReal ? (
                            <span className="bg-green-500/85 text-white font-extrabold text-[8px] md:text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md animate-pulse">
                              Tangan Terdeteksi ✓
                            </span>
                          ) : (
                            <span className="bg-amber-500/85 text-white font-extrabold text-[8px] md:text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md animate-pulse">
                              Posisikan Tangan Anda ✋
                            </span>
                          )
                        )}
                      </div>

                      {!isWebcamActive && (
                        <div className="z-0 flex flex-col items-center justify-center gap-2 text-center text-slate-400 p-4">
                          <i className="fa-solid fa-camera text-3xl text-emerald-400 animate-pulse"></i>
                          <p className="text-xs text-slate-300 font-bold">Kamera Terdeteksi...</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. TUNANETRA MEDIA (Yellow on black sound visualizer waves) */}
                {currentMode === 'blind' && (
                  <div className="w-full flex flex-col items-center justify-center gap-4 text-center">
                    <canvas
                      ref={audioCanvasRef}
                      className="w-full h-24 bg-black rounded-xl border border-yellow-400/30"
                      width="500"
                      height="96"
                    />
                    <div>
                      <p className="text-xs md:text-sm font-black text-yellow-400" id="tts-status-indicator">
                        {isNarrating ? "🔊 Suara AI sedang membacakan materi..." : "🎧 Gelombang Akustik Siap"}
                      </p>
                      <p className="text-[10px] md:text-xs text-yellow-400/80 font-semibold mt-1">
                        Tekan tombol putar atau gunakan mic untuk menjawab.
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => speakText("Matahari adalah pusat tata surya. Planet Mars adalah planet terdekat keempat dari matahari dan dikenal sebagai planet merah.", 'blind')}
                        className="bg-yellow-400 hover:bg-white text-black font-extrabold px-5 py-2.5 rounded-2xl text-[10px] md:text-xs uppercase flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <i className="fa-solid fa-play"></i> Putar Materi Suara
                      </button>
                      <button
                        onClick={() => {
                          if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
                            window.speechSynthesis.cancel();
                          }
                        }}
                        className="bg-black hover:bg-neutral-900 text-yellow-400 font-extrabold px-4 py-2.5 rounded-2xl text-[10px] md:text-xs border border-yellow-400 uppercase transition-all cursor-pointer"
                      >
                        Stop
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. ADHD GAMIFIED SPACE ROCKET RUNWAY */}
                {currentMode === 'adhd' && (
                  <div className="w-full flex flex-col justify-between gap-6">
                    {/* Launch Track */}
                    <div className="relative bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 h-28 flex items-center overflow-hidden">
                      <div className="absolute left-6 right-6 h-1 bg-slate-800 rounded"></div>
                      <div
                        id="adhd-rocket-progress"
                        className="absolute left-6 h-1 bg-gradient-to-r from-violet-600 to-rose-500 rounded transition-all duration-300"
                        style={{ width: `${rocketProgress}%` }}
                      />
                      
                      {/* Earth */}
                      <div className="absolute left-6 flex flex-col items-center gap-1">
                        <div className="text-2xl z-10 bg-slate-950 p-1.5 rounded-full border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]">🌍</div>
                        <span className="text-[8px] text-slate-500 font-mono">Bumi</span>
                      </div>

                      {/* Asteroids */}
                      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10 opacity-70">
                        <div className="text-xl">🪨</div>
                        <span className="text-[8px] text-slate-500 font-mono">Asteroid</span>
                      </div>

                      {/* Mars target */}
                      <div className="absolute right-6 flex flex-col items-center gap-1">
                        <div className="text-2xl z-10 bg-slate-950 p-1.5 rounded-full border border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse">🪐</div>
                        <span className="text-[8px] text-rose-400 font-mono font-bold">Mars</span>
                      </div>

                      {/* Moving rocket */}
                      <div
                        id="adhd-rocket"
                        className="absolute left-16 z-20 text-3xl transition-all duration-300 transform rotate-90"
                        style={{
                          transform: `translateX(${(rocketProgress / 100) * 160}px) rotate(90deg)`
                        }}
                      >
                        🚀
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] md:text-xs">
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <i className="fa-solid fa-gamepad animate-bounce"></i> Status Fokus Siswa: Optimal
                      </span>
                      <span className="text-slate-400 font-mono">Bahan Bakar Misi: <strong className="text-rose-500">{rocketProgress}%</strong></span>
                    </div>
                  </div>
                )}

                {/* 5. DISLEKSIA ASSISTIVE TEXT RULER PREVIEW */}
                {currentMode === 'dyslexia' && (
                  <div className="w-full flex flex-col items-center justify-center gap-4 text-center">
                    <i className="fa-solid fa-book-open-reader text-5xl md:text-6xl text-teal-600 animate-bounce"></i>
                    <div>
                      <p className="text-xs md:text-sm font-black text-teal-900">Alat Bantu Baca Disleksia Aktif</p>
                      <p className="text-[10px] md:text-xs text-teal-700 font-semibold mt-0.5">Kata kunci disorot secara visual. Penggaris fokus memandu pandangan baris baca.</p>
                    </div>
                    <button
                      onClick={toggleReadingRuler}
                      className={`font-extrabold py-2.5 px-5 rounded-2xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                        rulerActive
                          ? 'bg-teal-600 text-white border-b-4 border-teal-800 active:border-b-2 active:translate-y-0.5'
                          : 'bg-white text-teal-700 border-2 border-teal-300 border-b-6 hover:border-teal-400 active:border-b-2 active:translate-y-0.5'
                      }`}
                    >
                      <i className={rulerActive ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                      {rulerActive ? 'Matikan Penggaris Fokus' : 'Aktifkan Penggaris Fokus Baca'}
                    </button>
                  </div>
                )}

              </div>

              {/* Dynamic Interaction Box */}
              <div id="interaction-box" className={`rounded-3xl p-4 md:p-6 transition-all duration-300 border-3 ${
                currentMode === 'blind'
                  ? 'bg-black border-yellow-400'
                  : currentMode === 'deaf'
                  ? 'bg-sky-50 border-sky-200'
                  : currentMode === 'adhd'
                  ? 'bg-rose-950/20 border-rose-900'
                  : currentMode === 'dyslexia'
                  ? 'bg-cream-100 border-cream-300'
                  : 'bg-amber-50 border-amber-200'
              }`}>
                
                {/* 1. REGULER INTERACTION (Normal Quiz Ganda) */}
                {currentMode === 'regular' && (
                  <>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-extrabold text-amber-900 text-xs md:text-sm flex items-center gap-1.5">
                        <i className="fa-solid fa-circle-question text-amber-500 animate-bounce"></i> Kuis Interaktif AI:
                      </h3>
                      <span className="text-[9px] md:text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold uppercase">SBT Reward</span>
                    </div>
                    <p className="text-xs md:text-sm text-amber-800 font-semibold mb-4">
                      Planet apa yang dikenal sebagai Planet Merah karena kandungan besi oksida di permukaannya?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => triggerMintingModal('regular')}
                        className="bg-white hover:bg-amber-100 text-slate-700 font-extrabold py-3 px-4 rounded-2xl border-2 border-amber-300 text-left text-xs transition-all duration-150 btn-3d shadow-sm active:translate-y-0.5 hover:border-amber-400"
                      >
                        A. Planet Mars
                      </button>
                      <button
                        onClick={() => alert("Jawaban kurang tepat! Coba pelajari lagi.")}
                        className="bg-white hover:bg-amber-100 text-slate-700 font-extrabold py-3 px-4 rounded-2xl border-2 border-amber-300 text-left text-xs transition-all duration-150 btn-3d shadow-sm active:translate-y-0.5 hover:border-amber-400"
                      >
                        B. Planet Venus
                      </button>
                    </div>
                  </>
                )}

                {/* 2. TUNARUNGU INTERACTION (Gesture trigger calibration button) */}
                {currentMode === 'deaf' && (
                  <>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-extrabold text-sky-950 text-xs md:text-sm flex items-center gap-1.5">
                        <i className="fa-solid fa-camera-retro text-sky-500"></i> Kamera Interaksi AI:
                      </h3>
                      <span className="text-[9px] md:text-[10px] bg-sky-200 text-sky-900 px-2 py-0.5 rounded-full font-bold uppercase">SBT Reward</span>
                    </div>
                    <p className="text-xs md:text-sm text-sky-900 font-semibold mb-4">
                      Tantangan: Peragakan isyarat tangan untuk Planet "MARS" di depan kamera Anda untuk memicu ledger verifikasi.
                    </p>
                    <button
                      onClick={startSignCalibration}
                      disabled={isCalibrating || calibrationSuccess}
                      className={`w-full font-black py-3.5 px-6 rounded-2xl border-b-6 active:border-b-2 active:translate-y-0.5 text-center text-xs md:text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                        calibrationSuccess
                          ? 'bg-emerald-500 border-emerald-700 text-white'
                          : isCalibrating
                          ? 'bg-slate-300 border-slate-400 text-slate-700'
                          : isHandDetectedReal
                          ? 'bg-emerald-600 border-emerald-800 text-white hover:bg-emerald-700 shadow-emerald-500/20'
                          : 'bg-sky-600 border-sky-800 text-white hover:bg-sky-700'
                      }`}
                    >
                      <i className={calibrationSuccess ? "fa-solid fa-circle-check" : isCalibrating ? "fa-solid fa-spinner animate-spin" : "fa-solid fa-hand"}></i>
                      {calibrationSuccess ? 'Gestur Terdeteksi Benar!' : isCalibrating ? 'Mengevaluasi Gestur Kamera...' : isHandDetectedReal ? 'Kunci & Kirim Gestur Tangan "MARS"' : 'Simulasikan Pose Tangan "MARS"'}
                    </button>
                  </>
                )}

                {/* 3. TUNANETRA INTERACTION (Microphone Speak trigger) */}
                {currentMode === 'blind' && (
                  <>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-extrabold text-yellow-400 text-xs md:text-sm flex items-center gap-1.5">
                        <i className="fa-solid fa-microphone text-yellow-400 animate-pulse"></i> Voice Command Aktif:
                      </h3>
                      <span className="text-[9px] md:text-[10px] border border-yellow-400 text-yellow-400 px-2 py-0.5 rounded-full font-bold uppercase">SBT Reward</span>
                    </div>
                    <p className="text-xs md:text-sm text-yellow-400 font-semibold mb-4">
                      Kuis Suara: Ucapkan secara lantang "SATU" untuk memilih Mars, atau "DUA" untuk memilih Venus.
                    </p>
                    <button
                      onClick={simulateVoiceResponse}
                      disabled={isVoiceListening}
                      className="w-full bg-yellow-400 text-black font-black py-4 px-6 rounded-2xl text-center text-xs md:text-sm border-b-6 border-yellow-600 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <i className={`fa-solid ${isVoiceListening ? "fa-microphone-lines animate-pulse text-red-600" : "fa-microphone-lines"}`}></i>
                      {isVoiceListening ? 'Mendengarkan Suara Siswa...' : voiceInputReceived ? 'Ucapkan Jawaban Lagi: "SATU"' : 'Tahan & Ucapkan "SATU"'}
                    </button>
                  </>
                )}

                {/* 4. ADHD INTERACTION (Asteroid targets shoot layout) */}
                {currentMode === 'adhd' && (
                  <>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-extrabold text-rose-300 text-xs md:text-sm flex items-center gap-1.5">
                        <i className="fa-solid fa-crosshairs text-rose-500"></i> Hancurkan Asteroid Jawaban Benar:
                      </h3>
                      <span className="text-[9px] md:text-[10px] bg-rose-900 text-rose-300 px-2 py-0.5 rounded-full font-bold uppercase">SBT Reward</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-300 font-semibold mb-4">
                      Target Misi: Tembak asteroid yang bertuliskan nama "Planet Merah" di tata surya!
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center py-2">
                      <button
                        onClick={() => handleShootAsteroid(true)}
                        className="asteroid bg-slate-900 hover:bg-rose-950 text-rose-400 font-black py-3 px-5 rounded-full border-2 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] text-xs md:text-sm transition-all duration-150 active:scale-95 cursor-pointer"
                      >
                        ☄️ MARS (TEMBAK!)
                      </button>
                      <button
                        onClick={() => handleShootAsteroid(false)}
                        className="asteroid bg-slate-900 hover:bg-slate-800 text-slate-400 font-black py-3 px-5 rounded-full border-2 border-slate-700 text-xs md:text-sm transition-all duration-150 active:scale-95 cursor-pointer opacity-75"
                      >
                        ☄️ VENUS
                      </button>
                    </div>
                  </>
                )}

                {/* 5. DISLEKSIA INTERACTION (Spaced spelling quiz) */}
                {currentMode === 'dyslexia' && (
                  <>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-extrabold text-teal-950 text-xs md:text-sm flex items-center gap-1.5">
                        <i className="fa-solid fa-circle-question text-teal-600"></i> Tantangan Pemahaman Membaca:
                      </h3>
                      <span className="text-[9px] md:text-[10px] bg-teal-200 text-teal-950 px-2 py-0.5 rounded-full font-bold uppercase">SBT Reward</span>
                    </div>
                    <p className="text-xs md:text-sm text-teal-900 font-semibold mb-4">
                      Pelajaran di atas menyebutkan bahwa planet terdekat keempat dari Matahari adalah...
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => triggerMintingModal('dyslexia')}
                        className="bg-white hover:bg-cream-200 text-slate-800 font-extrabold py-3 px-4 rounded-2xl border-2 border-cream-300 text-left text-xs transition-all duration-150 btn-3d shadow-sm active:translate-y-0.5"
                      >
                        A. Planet Mars
                      </button>
                      <button
                        onClick={() => alert("Coba baca sekali lagi paragraf di atas pelan-pelan ya, kamu pasti bisa!")}
                        className="bg-white hover:bg-cream-200 text-slate-800 font-extrabold py-3 px-4 rounded-2xl border-2 border-cream-300 text-left text-xs transition-all duration-150 btn-3d shadow-sm active:translate-y-0.5"
                      >
                        B. Planet Venus
                      </button>
                    </div>
                  </>
                )}

              </div>

            </div>

          </div>

          {/* Blockchain Passport Soulbound Token (SBT) Card */}
          <div id="blockchain-card" className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-5 md:p-8 rounded-4xl text-white shadow-xl flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            
            {/* SBT Passport Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/20 pb-5 z-10">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="bg-white/10 p-2.5 md:p-3 rounded-2xl text-3xl md:text-4xl glass-passport border border-white/20">
                  <i className="fa-solid fa-passport text-yellow-300"></i>
                </div>
                <div>
                  <h3 className="font-black text-sm md:text-lg tracking-tight text-white flex items-center gap-1.5 flex-wrap">
                    Blockchain Learning Passport
                    <span className="text-[8px] md:text-[9px] bg-yellow-400/20 text-yellow-300 border border-yellow-300/30 px-2 py-0.5 rounded-full font-bold uppercase">
                      SOULBOUND TOKEN (SBT)
                    </span>
                  </h3>
                  <p className="text-[10px] md:text-xs text-emerald-100 font-semibold tracking-wide">
                    Sertifikasi kompetensi kriptografik siswa yang permanen dan terverifikasi.
                  </p>
                </div>
              </div>
              
              {/* Token Display Counter */}
              <div id="wallet-status" className="bg-white/10 glass-passport border border-white/20 px-4 py-2.5 rounded-3xl text-xs font-extrabold flex items-center gap-3 w-full md:w-auto transform hover:scale-102 transition-transform duration-300">
                <div className="bg-yellow-400 text-slate-900 rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-md">
                  🪙
                </div>
                <div>
                  <p className="text-[8px] text-emerald-200 uppercase font-bold tracking-widest leading-none">SBT Terverifikasi</p>
                  <span id="token-count" className="text-xs md:text-sm text-white font-black">{walletTokens} Token</span>
                </div>
              </div>
            </div>

            {/* SBT Grid Detail */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 z-10">
              
              {/* Badges container */}
              <div className="col-span-1 md:col-span-2 space-y-3">
                <h4 className="text-[10px] md:text-xs uppercase font-extrabold text-emerald-200 tracking-wider flex items-center gap-1.5">
                  <i className="fa-solid fa-award"></i> Lencana Kompetensi Terenkripsi:
                </h4>
                
                <div className="grid grid-cols-5 gap-2 md:gap-2.5">
                  
                  {/* Badge 1: Reguler */}
                  <div
                    onClick={() => unlockedBadges.regular && alert("Lencana Kosmis Terverifikasi di Blockchain!")}
                    className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all duration-300 select-none ${
                      unlockedBadges.regular
                        ? 'opacity-100 border-emerald-400 bg-emerald-400/20 scale-105 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                        : 'opacity-40 grayscale bg-white/5 border-white/10 glass-passport cursor-not-allowed'
                    }`}
                    title="Navigasi Kosmik (Mode Reguler)"
                  >
                    <i className="fa-solid fa-globe text-lg md:text-xl text-indigo-300 mb-1"></i>
                    <span className="text-[8px] md:text-[9px] font-bold block truncate max-w-full">Kosmis</span>
                    {unlockedBadges.regular && (
                      <span className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center text-[8px] border border-white font-black">✓</span>
                    )}
                  </div>
                  
                  {/* Badge 2: Tunarungu */}
                  <div
                    onClick={() => unlockedBadges.deaf && alert("Lencana Isyarat Terverifikasi di Blockchain!")}
                    className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all duration-300 select-none ${
                      unlockedBadges.deaf
                        ? 'opacity-100 border-emerald-400 bg-emerald-400/20 scale-105 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                        : 'opacity-40 grayscale bg-white/5 border-white/10 glass-passport cursor-not-allowed'
                    }`}
                    title="Bahasa Isyarat AI (Mode Tunarungu)"
                  >
                    <i className="fa-solid fa-hands text-lg md:text-xl text-sky-300 mb-1"></i>
                    <span className="text-[8px] md:text-[9px] font-bold block truncate max-w-full">Isyarat</span>
                    {unlockedBadges.deaf && (
                      <span className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center text-[8px] border border-white font-black">✓</span>
                    )}
                  </div>
                  
                  {/* Badge 3: Tunanetra */}
                  <div
                    onClick={() => unlockedBadges.blind && alert("Lencana Akustik Terverifikasi di Blockchain!")}
                    className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all duration-300 select-none ${
                      unlockedBadges.blind
                        ? 'opacity-100 border-emerald-400 bg-emerald-400/20 scale-105 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                        : 'opacity-40 grayscale bg-white/5 border-white/10 glass-passport cursor-not-allowed'
                    }`}
                    title="Interaksi Akustik (Mode Tunanetra)"
                  >
                    <i className="fa-solid fa-wave-square text-lg md:text-xl text-yellow-300 mb-1"></i>
                    <span className="text-[8px] md:text-[9px] font-bold block truncate max-w-full">Akustik</span>
                    {unlockedBadges.blind && (
                      <span className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center text-[8px] border border-white font-black">✓</span>
                    )}
                  </div>
                  
                  {/* Badge 4: ADHD */}
                  <div
                    onClick={() => unlockedBadges.adhd && alert("Lencana Fokus Terverifikasi di Blockchain!")}
                    className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all duration-300 select-none ${
                      unlockedBadges.adhd
                        ? 'opacity-100 border-emerald-400 bg-emerald-400/20 scale-105 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                        : 'opacity-40 grayscale bg-white/5 border-white/10 glass-passport cursor-not-allowed'
                    }`}
                    title="Fokus Hiperaktif (Mode ADHD)"
                  >
                    <i className="fa-solid fa-rocket text-lg md:text-xl text-rose-300 mb-1"></i>
                    <span className="text-[8px] md:text-[9px] font-bold block truncate max-w-full">Fokus</span>
                    {unlockedBadges.adhd && (
                      <span className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center text-[8px] border border-white font-black">✓</span>
                    )}
                  </div>
                  
                  {/* Badge 5: Disleksia */}
                  <div
                    onClick={() => unlockedBadges.dyslexia && alert("Lencana Literasi Terverifikasi di Blockchain!")}
                    className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all duration-300 select-none ${
                      unlockedBadges.dyslexia
                        ? 'opacity-100 border-emerald-400 bg-emerald-400/20 scale-105 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                        : 'opacity-40 grayscale bg-white/5 border-white/10 glass-passport cursor-not-allowed'
                    }`}
                    title="Kognisi Alternatif (Mode Disleksia)"
                  >
                    <i className="fa-solid fa-book-open-reader text-lg md:text-xl text-teal-300 mb-1"></i>
                    <span className="text-[8px] md:text-[9px] font-bold block truncate max-w-full">Literasi</span>
                    {unlockedBadges.dyslexia && (
                      <span className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center text-[8px] border border-white font-black">✓</span>
                    )}
                  </div>

                </div>
              </div>

              {/* Console log ledger */}
              <div className="col-span-1 bg-black/30 border border-white/10 rounded-3xl p-3.5 flex flex-col justify-between text-[9px] md:text-[10px] font-mono text-emerald-300 min-h-[96px]">
                <div>
                  <div className="flex justify-between items-center text-white border-b border-white/10 pb-1.5 mb-2 font-sans font-bold">
                    <span>Ledger Logs</span>
                    <i className="fa-solid fa-terminal text-[8px] animate-pulse"></i>
                  </div>
                  <div className="space-y-1 overflow-y-auto max-h-20 pr-1 leading-tight">
                    {sidebarLogs.map((log, index) => (
                      <p key={index} className={log.text.includes('Minted') ? 'text-yellow-300' : 'text-white/60'}>
                        [{log.time}] {log.text}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <button
                    onClick={() => setLedgerModalOpen(true)}
                    className="text-[9px] font-bold text-yellow-300 underline hover:text-yellow-100 font-sans cursor-pointer"
                  >
                    Audit Ledger &rarr;
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* AI Inclusive Advisor Chatbot Bento Box - Placed below the Ledger Card */}
          <div id="chatbot-bento-card" className="bg-white bubbly-card rounded-4xl p-5 md:p-6 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 text-slate-100 text-8xl font-black select-none pointer-events-none opacity-25">CHAT</div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10 relative">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-2">
                  <i className="fa-solid fa-comments text-indigo-500 animate-bounce"></i> AI Inclusive Advisor & Chatbot
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-1">
                  Konsultasi tips mengajar adaptif & kurikulum inklusi khusus ABK bagi pendidik dan orang tua.
                </p>
              </div>
              <button
                onClick={() => setIsChatpageActive(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 px-5 rounded-3xl border-b-6 border-indigo-800 active:border-b-2 active:translate-y-0.5 transition-all text-xs flex items-center gap-2 shadow-md shrink-0 cursor-pointer w-full sm:w-auto justify-center"
              >
                <i className="fa-solid fa-paper-plane animate-pulse"></i> Buka Chatbot &rarr;
              </button>
            </div>
          </div>

        </section>
      </main>

      {/* Footer bento panel */}
      <footer className="max-w-7xl w-full mx-auto px-4 md:px-6 pb-6 mt-6">
        <div className="bg-slate-900 border-2 border-slate-800 rounded-4xl py-6 text-center text-xs text-slate-500 font-semibold relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/20 via-transparent to-rose-950/20 pointer-events-none"></div>
          <p className="z-10 relative">&copy; 2026 SatuArah Inklusi Tech - Tim LIDM ITDP Universitas Muhammadiyah Surakarta.</p>
          <p className="z-10 relative mt-1 text-[9px] md:text-[10px] text-slate-600 uppercase tracking-widest font-bold">Edukasi Tanpa Sekat, Fleksibel Penuh Berkat AI</p>
        </div>
      </footer>

      {/* ============================================== */}
      {/* MODAL SYSTEMS */}
      {/* ============================================== */}

      {/* BLOCKCHAIN MINTING STATION MODAL */}
      {mintingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300">
          <div className="bg-slate-900 border-3 border-emerald-500/80 text-white rounded-5xl w-full max-w-lg p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-float">
            
            {/* Coin Animation */}
            <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-emerald-400 animate-spin-slow"></div>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-3xl md:text-4xl shadow-[0_0_30px_#f59e0b] border-2 border-white select-none relative animate-bounce-slow">
                🪙
                <div className="absolute inset-1.5 border border-dashed border-white/40 rounded-full"></div>
              </div>
            </div>

            <h3 className="text-lg md:text-2xl font-black text-white mb-1.5">
              Blockchain Minting Station
            </h3>
            <p className="text-[10px] md:text-xs text-slate-400 font-semibold mb-5 max-w-sm">
              Mengamankan capaian belajar siswa pada ledger terdistribusi (Inclusion Trust Network).
            </p>

            {/* Smart contract logs console */}
            <div className="w-full bg-black/60 rounded-3xl p-4 text-left font-mono text-[9px] md:text-[10px] text-emerald-400 border border-slate-800 space-y-1 shadow-inner h-32 md:h-36 overflow-y-auto mb-6 scrollbar-thin scrollbar-thumb-emerald-800">
              {mintingLogs.map((log, index) => (
                <p
                  key={index}
                  className={
                    log.includes('sukses') ? 'text-yellow-300 font-bold' : log.includes('Hash') ? 'text-cyan-300' : ''
                  }
                >
                  {log}
                </p>
              ))}
            </div>

            {/* Action buttons */}
            <button
              onClick={handleClaimSBT}
              disabled={!mintingComplete}
              className={`w-full font-extrabold py-3.5 px-6 rounded-3xl border-b-6 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mintingComplete
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700 active:border-b-2 active:translate-y-0.5'
                  : 'bg-emerald-500/35 text-white/50 border-emerald-800/20 opacity-50 cursor-not-allowed'
              }`}
            >
              <i className="fa-solid fa-shield-halved"></i>
              <span>{mintingComplete ? 'Klaim Lencana Kompetensi (SBT)' : 'Memproses Transaksi...'}</span>
            </button>
          </div>
        </div>
      )}

      {/* LEDGER AUDIT TRAILS MODAL */}
      {ledgerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300">
          <div className="bg-slate-900 border-3 border-indigo-500/80 text-white rounded-5xl w-full max-w-xl p-5 md:p-8 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
              <h3 className="text-base md:text-lg font-black text-white flex items-center gap-2">
                <i className="fa-solid fa-cube text-indigo-400"></i> Audit Ledger Blockchain SBT
              </h3>
              <button onClick={() => setLedgerModalOpen(false)} className="text-slate-400 hover:text-white text-xl cursor-pointer">
                <i className="fa-solid fa-circle-xmark"></i>
              </button>
            </div>
            
            <div className="space-y-4 text-[11px] md:text-xs font-mono flex-1 overflow-y-auto max-h-80 pr-2">
              <div className="p-3 bg-black/40 rounded-2xl border border-slate-800">
                <p className="text-indigo-300 font-bold font-sans">Informasi Wallet Siswa:</p>
                <p className="text-slate-400 mt-1">Address: 0x8458ee3fd78a4d91b0d9c25e5beb4bbe</p>
                <p className="text-slate-400">SBT Contract Standard: ERC-5114 (Soulbound Token)</p>
                <p className="text-slate-400">Status: Verifikasi Sinkron (12 Nodes Online)</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-indigo-300 font-bold font-sans">Riwayat Blok Emiten (Competency Records):</p>
                <div className="space-y-2">
                  {blockchainHistory.length > 0 ? (
                    blockchainHistory.map((item, idx) => (
                      <div key={idx} className="p-3 bg-black/60 rounded-2xl border border-emerald-500/30 text-emerald-400">
                        <p className="font-bold font-sans text-white text-xs uppercase">Lencana: {item.mode.toUpperCase()}</p>
                        <p className="mt-0.5">Waktu: {item.timestamp}</p>
                        <p className="text-cyan-400">Tx: {item.txHash}</p>
                        <p className="text-[9px] text-slate-500">Secured via Proof of Competency (PoC) consensus.</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500 text-center py-6 font-sans">
                      Belum ada riwayat cetak token. Selesaikan kuis atau misi pada tiap mode untuk mengumpulkan token SBT!
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setLedgerModalOpen(false)}
              className="mt-6 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-2xl text-center cursor-pointer text-xs md:text-sm"
            >
              Tutup Audit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
