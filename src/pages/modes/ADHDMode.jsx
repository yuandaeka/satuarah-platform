import React from 'react';

export default function ADHDMode({
  adhdScore,
  adhdGameState,
  adhdCamReady,
  adhdCamError,
  adhdControlMode,
  setAdhdControlMode,
  adhdTimeLeft,
  adhdFailReason,
  feedbackToast,
  adhdFocusSound,
  toggleFocusSound,
  stopAdhdCamera,
  setSelectedMode,
  adhdVideoRef,
  adhdOverlayCanvasRef,
  adhdGameCanvasRef,
  startGame,
  handleAdhdBoardMouseMove,
  handleAdhdBoardMouseDown,
  handleAdhdBoardMouseUp,
  handleAdhdBoardTouchMove,
  handleAdhdBoardTouchStart,
  handleAdhdBoardTouchEnd
}) {
  return (
    <div className="adhd-container">
                <style dangerouslySetInnerHTML={{ __html: `
                  .adhd-container {
                    --primary: #2ecc71;
                    --secondary: #3498db;
                    --danger: #e74c3c;
                    --dark: #0f172a;
                    --light: #ecf0f1;
                    --accent: #f1c40f;
                    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    background-color: #020617; /* calm dark space */
                    color: white;
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    display: block;
                    overflow-y: auto;
                    overflow-x: hidden;
                  }
                  
                  /* Glassmorphism Utility */
                  .adhd-glass {
                    background: rgba(30, 41, 59, 0.6);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
                  }

                  .adhd-header {
                    width: calc(100% - 40px);
                    max-width: 1200px;
                    margin: 20px auto 0 auto;
                    padding: 1rem 1.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-radius: 20px;
                    z-index: 20;
                  }
                  .adhd-header-title {
                    font-size: 1.3rem;
                    font-weight: 800;
                    color: var(--dark);
                    margin: 0;
                    text-shadow: 0 1px 2px rgba(255,255,255,0.8);
                  }
                  .adhd-stats {
                    display: flex;
                    gap: 1.5rem;
                    font-weight: 800;
                    font-size: 1.1rem;
                    color: var(--dark);
                  }
                  .adhd-main-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px;
                    gap: 20px;
                  }
                  .adhd-game-wrapper {
                    position: relative;
                    width: 100%;
                    max-width: 1200px;
                    height: 70vh;
                    min-height: 500px;
                    background: radial-gradient(circle at center, #1e293b 0%, #020617 100%);
                    border-radius: 24px;
                    box-shadow: 0 12px 40px rgba(0,0,0,0.5);
                    overflow: hidden;
                    z-index: 1;
                  }
                  .adhd-video-container {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 250px;
                    aspect-ratio: 4/3;
                    background: #000;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 12px 32px rgba(0,0,0,0.3);
                    border: 3px solid rgba(255,255,255,0.6);
                    z-index: 45;
                    transition: all 0.3s ease;
                  }
                  .adhd-sidebar {
                    width: 100%;
                    max-width: 800px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    z-index: 20;
                    margin-bottom: 40px;
                  }
                  .adhd-output-canvas {
                    width: 100%;
                    height: 100%;
                    transform: scaleX(-1);
                    object-fit: cover;
                  }
                  .adhd-instructions {
                    padding: 20px;
                    border-radius: 20px;
                    font-size: 0.95rem;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    color: var(--dark);
                  }
                  .adhd-instructions h3 { margin-top: 0; color: var(--dark); font-size: 1.2rem; font-weight: 800; margin-bottom: 5px; text-align: center; }
                  .adhd-instructions ul { padding-left: 1.2rem; margin-bottom: 0; font-weight: 500; }
                  .adhd-instructions li { margin-bottom: 6px; }
                  
                  .adhd-game-canvas {
                    width: 100%;
                    height: 100%;
                    touch-action: none;
                    display: block;
                  }
                  .adhd-feedback {
                    position: absolute;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 12px 24px;
                    border-radius: 50px;
                    color: white;
                    font-weight: bold;
                    opacity: 0;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    pointer-events: none;
                    z-index: 101;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
                    text-align: center;
                    width: 80%;
                    max-width: 400px;
                    font-size: 1rem;
                  }
                  .adhd-feedback-correct { background: var(--primary); opacity: 1 !important; top: 40px !important; }
                  .adhd-feedback-wrong { background: var(--danger); opacity: 1 !important; top: 40px !important; }
                  .adhd-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    z-index: 100;
                    text-align: center;
                    padding: 20px;
                  }
                  .adhd-overlay h1 { font-size: 2rem; font-weight: 900; color: var(--dark); margin-bottom: 12px; }
                  .adhd-overlay p { font-size: 1.1rem; color: #475569; margin-bottom: 20px; font-weight: 500; max-width: 500px; line-height: 1.5; }
                  .adhd-btn {
                    padding: 14px 40px;
                    font-size: 1.1rem;
                    background: var(--secondary);
                    color: white;
                    border: none;
                    border-radius: 50px;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-top: 15px;
                    font-weight: bold;
                    box-shadow: 0 6px 15px rgba(52, 152, 219, 0.4);
                  }
                  .adhd-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(52, 152, 219, 0.5); }
                  .adhd-btn:active { transform: scale(0.95); }
                  .adhd-loading-screen { background: rgba(44, 62, 80, 0.9); color: white; }
                  .adhd-loading-screen h1 { color: white; }
                  .adhd-loading-screen p { color: #cbd5e1; }
                  
                  /* Control Buttons inside Glass Panel */
                  .adhd-control-btn {
                    flex: 1;
                    padding: 12px 10px;
                    border-radius: 12px;
                    font-weight: 800;
                    font-size: 1rem;
                    transition: all 0.2s;
                    border: none;
                    cursor: pointer;
                  }
                  .adhd-control-btn.active {
                    background: var(--secondary);
                    color: white;
                    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
                  }
                  .adhd-control-btn.inactive {
                    background: rgba(255,255,255,0.5);
                    color: #64748b;
                  }
                  .adhd-control-btn.inactive:hover {
                    background: rgba(255,255,255,0.8);
                  }

                  @media (max-width: 768px) {
                    .adhd-header { width: calc(100% - 20px); margin: 10px auto 0 auto; padding: 0.8rem 1rem; border-radius: 15px; }
                    .adhd-header-title { font-size: 1rem; }
                    .adhd-stats { font-size: 0.9rem; gap: 1rem; }
                    .adhd-game-wrapper { height: 60vh; min-height: 400px; border-radius: 16px; }
                    .adhd-video-container { width: 140px; top: 15px; right: 15px; border-radius: 12px; }
                    .adhd-instructions { padding: 15px; font-size: 0.85rem; }
                    .adhd-instructions h3 { font-size: 1.05rem; }
                    .adhd-overlay h1 { font-size: 1.5rem; }
                    .adhd-overlay p { font-size: 0.9rem; }
                    .adhd-control-btn { padding: 10px 5px; font-size: 0.85rem; }
                  }
                ` }} />

                <header className="adhd-header adhd-glass">
                  <div className="adhd-header-title text-white">🪐 Misi Kosmik SatuArah</div>
                  <div className="adhd-stats text-white">
                    <div>🚀 Roket Maju: <span>{adhdScore * 10}</span> m</div>
                    <div>⏱️ <span>{adhdTimeLeft}</span>s</div>
                  </div>
                </header>

                <div className="adhd-main-container">

                  <div className="adhd-game-wrapper" id="game_bounds">
                    {/* Zoom-style Camera PIP overlay */}
                    {adhdControlMode === 'camera' && (
                      <div className="adhd-video-container">
                        <video
                          ref={adhdVideoRef}
                          style={{ display: 'none' }}
                          playsInline
                          muted
                        />
                        <canvas
                          ref={adhdOverlayCanvasRef}
                          width={320}
                          height={240}
                          className="adhd-output-canvas"
                        />
                      </div>
                    )}
                    {/* Feedback Toast */}
                    <div
                      id="feedback"
                      className={`adhd-feedback ${
                        feedbackToast
                          ? feedbackToast.type === 'success'
                            ? 'adhd-feedback-correct'
                            : 'adhd-feedback-wrong'
                          : ''
                      }`}
                    >
                      {feedbackToast?.text}
                    </div>

                    <canvas
                      ref={adhdGameCanvasRef}
                      onMouseMove={handleAdhdBoardMouseMove}
                      onMouseDown={handleAdhdBoardMouseDown}
                      onMouseUp={handleAdhdBoardMouseUp}
                      onMouseLeave={handleAdhdBoardMouseUp}
                      onTouchMove={handleAdhdBoardTouchMove}
                      onTouchStart={handleAdhdBoardTouchStart}
                      onTouchEnd={handleAdhdBoardTouchEnd}
                      className="adhd-game-canvas"
                    />

                    {/* Loading Screen */}
                    {adhdGameState === 'loading' && adhdControlMode === 'camera' && (
                      <div className="adhd-overlay adhd-loading-screen">
                        <h1>Scanning Environment...</h1>
                        <p>Initializing dual-hand AI tracking</p>
                        {adhdCamError && (
                          <div className="bg-rose-500/20 border border-rose-500/30 p-2.5 rounded-xl max-w-xs mt-3">
                            <p className="text-rose-400 text-[10px] font-semibold mb-2 leading-tight">{adhdCamError}</p>
                            <button
                              onClick={() => {
                                setAdhdControlMode('mouse');
                                setAdhdGameState('start');
                              }}
                              className="px-3 py-1 bg-blue-500 text-white text-[9px] font-bold rounded-lg cursor-pointer"
                            >
                              Ganti ke Mode Mouse
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Start Screen */}
                    {adhdGameState === 'start' && (
                      <div className="adhd-overlay" style={{background: 'rgba(15, 23, 42, 0.85)'}}>
                        <h1 style={{color: 'white'}}>Apakah Anda siap?</h1>
                        <p style={{color: '#94a3b8'}}>
                          Pinch (cubit) gelembung BUMI dan lepaskan di orbit ketiga dari Matahari!<br />
                          Roket akan meluncur maju jika kamu berhasil.
                        </p>
                        <button className="adhd-btn" onClick={startGame}>Mulai Game</button>
                      </div>
                    )}

                    {/* Lose Screen */}
                    {adhdGameState === 'lost' && (
                      <div className="adhd-overlay">
                        <h1 style={{ color: 'var(--danger)' }}>MISI GAGAL</h1>
                        <p style={{ fontWeight: 500 }}>{adhdFailReason}</p>
                        <button className="adhd-btn" onClick={startGame}>Coba Lagi</button>
                      </div>
                    )}

                    {/* Win Screen */}
                    {adhdGameState === 'won' && (
                      <div className="adhd-overlay">
                        <h1 style={{ color: 'var(--primary)' }}>MISI SELESAI</h1>
                        <p>Kerja bagus! Anda berhasil menyortir semua planet dengan sempurna.</p>
                        <button
                          className="adhd-btn"
                          onClick={() => {
                            setAdhdGameState('start');
                          }}
                        >
                          Lanjut
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="adhd-sidebar">
                    <div className="adhd-instructions adhd-glass">
                      <h3 style={{color: 'white'}}>Mission</h3>
                      <ul style={{color: '#cbd5e1'}}>
                        <li>Pinch (cubit) gelembung <b>BUMI</b>.</li>
                        <li>Tempatkan di <b>orbit ke-3</b> dari Matahari.</li>
                        <li>Jangan sampai salah tempat!</li>
                      </ul>
                      
                      {/* Controls inside instructions panel */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button
                          onClick={() => {
                            setAdhdControlMode('camera');
                            setAdhdGameState('loading');
                            startAdhdCamera();
                          }}
                          className={`adhd-control-btn ${adhdControlMode === 'camera' ? 'active' : 'inactive'}`}
                        >
                          📷 Kamera
                        </button>
                        <button
                          onClick={() => {
                            setAdhdControlMode('mouse');
                            stopAdhdCamera();
                            setAdhdGameState('start');
                          }}
                          className={`adhd-control-btn ${adhdControlMode === 'mouse' ? 'active' : 'inactive'}`}
                        >
                          🖱️ Mouse
                        </button>
                      </div>

                      {/* Sound Hum button */}
                      <button
                        onClick={toggleFocusSound}
                        className={`adhd-control-btn ${adhdFocusSound ? 'active' : 'inactive'}`}
                        style={{ marginTop: '8px' }}
                      >
                        🎵 Hum Fokus: {adhdFocusSound ? 'ON' : 'OFF'}
                      </button>

                      {/* Exit mode button */}
                      <button
                        onClick={() => {
                          stopAdhdCamera();
                          setSelectedMode(null);
                        }}
                        style={{ marginTop: '8px', background: 'rgba(231, 76, 60, 0.9)', color: 'white', boxShadow: '0 4px 12px rgba(231, 76, 60, 0.4)' }}
                        className="adhd-control-btn hover:scale-[0.98] active:scale-[0.95]"
                      >
                        🚪 Keluar Mode ADHD
                      </button>
                    </div>
                  </div>
                </div>
              </div>
  );
}
