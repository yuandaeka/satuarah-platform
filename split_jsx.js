const fs = require('fs');

const appContent = fs.readFileSync('src/App.jsx', 'utf8');
const returnIndex = appContent.indexOf('return (');
if (returnIndex === -1) {
  console.error('Could not find return statement');
  process.exit(1);
}

const beforeReturn = appContent.slice(0, returnIndex);

const newReturn = `return (
    <div className="w-full h-full min-h-screen bg-slate-50 relative overflow-hidden font-sans select-none flex justify-center">
      <div className="w-full max-w-[430px] h-full min-h-screen bg-slate-50 relative shadow-2xl flex flex-col mx-auto overflow-hidden border-x border-slate-200">
        {!isLoggedIn ? (
          <div className="flex-1 flex flex-col p-6 items-center justify-center relative bg-gradient-to-br from-emerald-400 to-teal-600 overflow-hidden text-white">
            <h1 className="text-4xl font-black mb-2 animate-bounce drop-shadow-md tracking-tight">SatuArah</h1>
            <p className="text-[10px] font-bold opacity-90 mb-8 max-w-[240px] text-center drop-shadow-sm leading-relaxed">
              Platform Edukasi Inklusif dengan Dukungan Adaptif & Blockchain SBT.
            </p>
            <form onSubmit={handleLoginSubmit} className="w-full max-w-[280px] bubbly-card p-6 rounded-3xl bg-white text-slate-800 shadow-xl space-y-4">
              <h2 className="font-extrabold text-xs text-slate-800 text-center uppercase tracking-wider mb-2">Login Pelajar</h2>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 px-1 uppercase tracking-wider">Nama Kamu</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-xs font-bold text-slate-700"
                  placeholder="Misal: Budi"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-500 text-white font-black py-3 rounded-xl hover:bg-emerald-600 active:scale-95 transition-all shadow-md shadow-emerald-500/30 text-[10px] uppercase tracking-wider"
              >
                Mulai Petualangan 🚀
              </button>
            </form>
          </div>
        ) : (
          <main className="flex-1 overflow-y-auto p-4 pb-24 scrollbar-none relative">
            {currentTab === 'home' && !selectedMode && (
              <Home
                username={username}
                selectedAvatar={selectedAvatar}
                renderedStreakDays={renderedStreakDays}
                renderedDuration={renderedDuration}
                walletTokens={walletTokens}
                speakText={speakText}
              />
            )}
            
            {currentTab === 'belajar' && !selectedMode && (
              <Belajar
                setSelectedMode={setSelectedMode}
                voiceGuide={voiceGuide}
                speakText={speakText}
              />
            )}

            {currentTab === 'profile' && !selectedMode && (
              <Profile
                username={username}
                selectedAvatar={selectedAvatar}
                setIsLoggedIn={setIsLoggedIn}
                setSelectedMode={setSelectedMode}
                stopSpeaking={stopSpeaking}
                unlockedBadges={unlockedBadges}
                blockchainLogs={blockchainLogs}
              />
            )}

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
              />
            )}

            {/* KEEP EXISTING CODE FOR OTHER MODES FOR NOW */}
          </main>
        )}
      </div>
    </div>
  );
}
`;

// wait, the problem is I still have to keep ADHD, Tunarungu, Tunanetra, Disleksia JSX in the return if I don't extract them.
// Let's just create a script to extract them mechanically!
