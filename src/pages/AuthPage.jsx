import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.jpeg';
import { playTone } from '../utils/audio';

export default function AuthPage({ onLogin }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isGuru, setIsGuru] = useState(false);

  // Simulated user database stored in localStorage
  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('satuarah_users') || '{}');
    } catch {
      return {};
    }
  };

  const saveUser = (userEmail, userData) => {
    const users = getUsers();
    users[userEmail.toLowerCase()] = userData;
    localStorage.setItem('satuarah_users', JSON.stringify(users));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!displayName.trim()) {
      setError('Nama tampilan wajib diisi');
      return;
    }
    if (!email.trim()) {
      setError('Email wajib diisi');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Format email tidak valid');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return;
    }

    const users = getUsers();
    if (users[email.toLowerCase()]) {
      setError('Email sudah terdaftar, silakan login');
      return;
    }

    setIsLoading(true);
    playTone(523.25, 'sine', 0.1);

    setTimeout(() => {
      saveUser(email, {
        displayName: displayName.trim(),
        email: email.toLowerCase(),
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString(),
        role: isGuru ? 'guru' : 'siswa',
      });

      setIsLoading(false);
      setSuccessMessage('Akun berhasil dibuat! Silakan login.');
      playTone(659.25, 'sine', 0.15);

      // Auto-switch to login after short delay
      setTimeout(() => {
        setAuthMode('login');
        setSuccessMessage('');
        setPassword('');
        setConfirmPassword('');
      }, 1500);
    }, 1000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email wajib diisi');
      return;
    }
    if (!password.trim()) {
      setError('Password wajib diisi');
      return;
    }

    const users = getUsers();
    const user = users[email.toLowerCase()];

    if (!user) {
      setError('Akun tidak ditemukan. Silakan daftar terlebih dahulu.');
      return;
    }

    if (user.password !== password) {
      setError('Password salah. Coba lagi.');
      return;
    }

    setIsLoading(true);
    playTone(580, 'sine', 0.1);

    setTimeout(() => {
      setIsLoading(false);
      playTone(660, 'sine', 0.15);
      onLogin(user.displayName, user.role || 'siswa', user.email);
    }, 800);
  };

  const handleGoogleLogin = () => {
    setError('');
    setIsLoading(true);
    playTone(580, 'sine', 0.1);

    // Simulate Google OAuth login
    setTimeout(() => {
      const googleUser = {
        displayName: 'Google User',
        email: 'googleuser@gmail.com',
        password: '',
        createdAt: new Date().toISOString(),
        isGoogleAuth: true,
      };

      // Save or update google user
      saveUser(googleUser.email, googleUser);
      
      setIsLoading(false);
      playTone(660, 'sine', 0.15);
      onLogin(googleUser.displayName, googleUser.role || 'siswa', googleUser.email);
    }, 1200);
  };

  const toggleAuthMode = () => {
    playTone(500, 'sine', 0.08);
    setAuthMode(prev => prev === 'login' ? 'register' : 'login');
    setError('');
    setSuccessMessage('');
    setPassword('');
    setConfirmPassword('');
    setIsGuru(false);
  };

  return (
    <div className="auth-page">
      {/* Background decorations */}
      <div className="auth-bg-decoration">
        <div className="auth-bg-circle auth-bg-circle-1" />
        <div className="auth-bg-circle auth-bg-circle-2" />
        <div className="auth-bg-circle auth-bg-circle-3" />
        <div className="auth-bg-pattern" />
      </div>

      <div className="auth-container">
        {/* Header / Logo */}
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-icon overflow-hidden p-0 bg-white">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          <h2 className="auth-brand">
            <span className="auth-brand-satu">Satu</span>
            <span className="auth-brand-arah">Arah</span>
          </h2>
          <p className="auth-brand-tagline">Inklusi EduTech Platform</p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="auth-toggle-container">
          <div className="auth-toggle">
            <button
              type="button"
              className={`auth-toggle-btn ${authMode === 'login' ? 'auth-toggle-active' : ''}`}
              onClick={() => { if (authMode !== 'login') toggleAuthMode(); }}
            >
              Masuk
            </button>
            <button
              type="button"
              className={`auth-toggle-btn ${authMode === 'register' ? 'auth-toggle-active' : ''}`}
              onClick={() => { if (authMode !== 'register') toggleAuthMode(); }}
            >
              Daftar
            </button>
            <div className={`auth-toggle-slider ${authMode === 'register' ? 'auth-toggle-slider-right' : ''}`} />
          </div>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="auth-success-message">
            <span>✅</span> {successMessage}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="auth-error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Auth Form */}
        <form
          onSubmit={authMode === 'login' ? handleLogin : handleRegister}
          className="auth-form"
        >
          {/* Name field (Register only) */}
          {authMode === 'register' && (
            <div className="auth-field auth-field-animate">
              <label className="auth-label">
                <span className="auth-label-icon">👤</span>
                Nama Tampilan
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="auth-input"
                placeholder="Nama keren kamu..."
                required
                autoComplete="name"
              />
            </div>
          )}

          {/* Email field */}
          <div className="auth-field auth-field-animate">
            <label className="auth-label">
              <span className="auth-label-icon">✉️</span>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              placeholder="email@contoh.com"
              required
              autoComplete="email"
            />
          </div>

          {/* Password field */}
          <div className="auth-field auth-field-animate">
            <label className="auth-label">
              <span className="auth-label-icon">🔒</span>
              Password
            </label>
            <div className="auth-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input auth-input-password"
                placeholder={authMode === 'register' ? 'Minimal 6 karakter' : 'Masukkan password'}
                required
                autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Confirm Password (Register only) */}
          {authMode === 'register' && (
            <div className="auth-field auth-field-animate">
              <label className="auth-label">
                <span className="auth-label-icon">🔐</span>
                Konfirmasi Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
                placeholder="Ulangi password"
                required
                autoComplete="new-password"
              />
            </div>
          )}

          {/* Guru Toggle (Register only) */}
          {authMode === 'register' && (
            <div className="auth-field auth-field-animate">
              <button
                type="button"
                onClick={() => setIsGuru(!isGuru)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${
                  isGuru
                    ? 'bg-indigo-50 border-indigo-400 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{isGuru ? '👩‍🏫' : '👤'}</span>
                  <div className="text-left">
                    <span className={`text-[11px] font-black block ${
                      isGuru ? 'text-indigo-700' : 'text-slate-600'
                    }`}>
                      Saya adalah Guru
                    </span>
                    <span className="text-[8px] font-semibold text-slate-400 block mt-0.5">
                      Aktifkan untuk akses Dashboard Monitoring Siswa
                    </span>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-all duration-300 ${
                  isGuru ? 'bg-indigo-500' : 'bg-slate-300'
                }`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${
                    isGuru ? 'left-5' : 'left-0.5'
                  }`} />
                </div>
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="auth-spinner-container">
                <div className="auth-spinner" />
                <span>{authMode === 'login' ? 'Masuk...' : 'Mendaftar...'}</span>
              </div>
            ) : (
              <>
                {authMode === 'login' ? '🚀 Masuk ke SatuArah' : '✨ Buat Akun Baru'}
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">atau</span>
          <div className="auth-divider-line" />
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          className="auth-google-btn"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <svg className="auth-google-icon" viewBox="0 0 24 24" width="18" height="18">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Lanjutkan dengan Google
        </button>

        {/* Switch mode link */}
        <div className="auth-switch">
          {authMode === 'login' ? (
            <p>
              Belum punya akun?{' '}
              <button type="button" className="auth-switch-link" onClick={toggleAuthMode}>
                Daftar sekarang
              </button>
            </p>
          ) : (
            <p>
              Sudah punya akun?{' '}
              <button type="button" className="auth-switch-link" onClick={toggleAuthMode}>
                Masuk di sini
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
