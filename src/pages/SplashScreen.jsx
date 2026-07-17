import React, { useState, useEffect } from 'react';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Non-linear progress: fast start, slow middle, fast finish
        const increment = prev < 30 ? 4 : prev < 70 ? 2 : prev < 90 ? 3 : 5;
        return Math.min(prev + increment, 100);
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      // Start fade out after a small delay
      const timeout = setTimeout(() => {
        setFadeOut(true);
        // Call onFinish after fade animation completes
        setTimeout(() => onFinish(), 600);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [progress, onFinish]);

  return (
    <div className={`splash-screen ${fadeOut ? 'splash-fade-out' : ''}`}>
      {/* Animated background particles */}
      <div className="splash-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="splash-particle"
            style={{
              '--delay': `${Math.random() * 5}s`,
              '--duration': `${3 + Math.random() * 4}s`,
              '--x-start': `${Math.random() * 100}%`,
              '--y-start': `${Math.random() * 100}%`,
              '--size': `${4 + Math.random() * 8}px`,
              '--opacity': `${0.15 + Math.random() * 0.35}`,
            }}
          />
        ))}
      </div>

      {/* Ambient glow rings */}
      <div className="splash-glow-ring splash-glow-ring-1" />
      <div className="splash-glow-ring splash-glow-ring-2" />
      <div className="splash-glow-ring splash-glow-ring-3" />

      {/* Main content */}
      <div className="splash-content">
        {/* Animated Logo */}
        <div className="splash-logo-container">
          <div className="splash-logo-ring" />
          <div className="splash-logo overflow-hidden p-0 bg-white border-4 border-white">
            <img src="/logohijaufiks.jpeg" alt="Logo" className="w-full h-full object-cover rounded-3xl" />
          </div>
        </div>

        {/* Brand Name with staggered reveal */}
        <div className="splash-brand">
          <h1 className="splash-title">
            <span className="splash-title-satu">Satu</span>
            <span className="splash-title-arah">Arah</span>
          </h1>
          <p className="splash-subtitle">Inklusi EduTech Platform</p>
        </div>

        {/* Tagline */}
        <div className="splash-tagline">
          <span className="splash-tagline-icon">🌟</span>
          <span>Belajar Koding & AI untuk Semua Anak</span>
        </div>

        {/* Progress bar */}
        <div className="splash-progress-container">
          <div className="splash-progress-track">
            <div
              className="splash-progress-bar"
              style={{ width: `${progress}%` }}
            />
            <div
              className="splash-progress-glow"
              style={{ left: `${progress}%` }}
            />
          </div>
          <div className="splash-progress-text">
            <span className="splash-loading-dots">
              {progress < 100 ? 'Memuat' : 'Siap!'}
              {progress < 100 && <span className="splash-dots-animated">...</span>}
            </span>
            <span className="splash-progress-percent">{progress}%</span>
          </div>
        </div>

        {/* Feature chips cycling */}
        <div className="splash-features">
          <div className={`splash-feature-chip ${progress > 15 ? 'splash-chip-visible' : ''}`}>
            <span>🎮</span> Interaktif
          </div>
          <div className={`splash-feature-chip ${progress > 35 ? 'splash-chip-visible' : ''}`}>
            <span>♿</span> Inklusif
          </div>
          <div className={`splash-feature-chip ${progress > 55 ? 'splash-chip-visible' : ''}`}>
            <span>🤖</span> AI-Powered
          </div>
          <div className={`splash-feature-chip ${progress > 75 ? 'splash-chip-visible' : ''}`}>
            <span>🏆</span> Gamifikasi
          </div>
        </div>
      </div>
    </div>
  );
}
