import React from 'react';

export default function Profile({
  username,
  selectedAvatar,
  setIsLoggedIn,
  setSelectedMode,
  stopSpeaking,
  unlockedBadges,
  blockchainLogs,
}) {
  return (
    <div className="space-y-4">
      {/* Profile header */}
      <div className="bubbly-card p-5 rounded-3xl text-center relative overflow-hidden bg-gradient-to-b from-white to-emerald-50/10">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-4xl mx-auto flex items-center justify-center shadow-md mb-3 border-2 border-white animate-float">
          {selectedAvatar}
        </div>
        <h3 className="font-extrabold text-sm text-slate-800">{username}</h3>
        <p className="text-[9px] text-slate-400 font-bold mt-0.5">ID: 0x9e8abee3fcd12</p>

        <button
          onClick={() => { setIsLoggedIn(false); setSelectedMode(null); stopSpeaking(); }}
          className="mt-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-[9px] py-1.5 px-4 rounded-xl border border-rose-200 transition-colors"
        >
          Keluar Akun
        </button>
      </div>

      {/* Soulbound Token Badges Grid */}
      <div className="bubbly-card p-4 rounded-3xl space-y-3">
        <h4 className="font-black text-[10px] text-slate-700 uppercase tracking-wider flex items-center gap-1">
          🪙 Lencana Soulbound Token (SBT) Terverifikasi
        </h4>
        
        <div className="grid grid-cols-5 gap-2">
          {/* Badge 1 */}
          <div className={`p-2 rounded-xl border text-center transition-all ${
            unlockedBadges.reguler ? 'bg-emerald-50 border-emerald-300 text-emerald-600' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-50'
          }`}>
            <span className="text-xl block">🎓</span>
            <span className="text-[7px] font-black block mt-1 truncate">Reguler</span>
          </div>

          {/* Badge 2 */}
          <div className={`p-2 rounded-xl border text-center transition-all ${
            unlockedBadges.adhd ? 'bg-emerald-50 border-emerald-300 text-emerald-600' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-50'
          }`}>
            <span className="text-xl block">🎯</span>
            <span className="text-[7px] font-black block mt-1 truncate">ADHD</span>
          </div>

          {/* Badge 3 */}
          <div className={`p-2 rounded-xl border text-center transition-all ${
            unlockedBadges.tunarungu ? 'bg-emerald-50 border-emerald-300 text-emerald-600' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-50'
          }`}>
            <span className="text-xl block">🤟</span>
            <span className="text-[7px] font-black block mt-1 truncate">Rungu</span>
          </div>

          {/* Badge 4 */}
          <div className={`p-2 rounded-xl border text-center transition-all ${
            unlockedBadges.tunanetra ? 'bg-emerald-50 border-emerald-300 text-emerald-600' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-50'
          }`}>
            <span className="text-xl block">🎧</span>
            <span className="text-[7px] font-black block mt-1 truncate">Netra</span>
          </div>

          {/* Badge 5 */}
          <div className={`p-2 rounded-xl border text-center transition-all ${
            unlockedBadges.disleksia ? 'bg-emerald-50 border-emerald-300 text-emerald-600' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-50'
          }`}>
            <span className="text-xl block">✏️</span>
            <span className="text-[7px] font-black block mt-1 truncate">Disleksia</span>
          </div>
        </div>
      </div>

      {/* Blockchain Trust Ledger Console */}
      <div className="bubbly-card p-4 rounded-3xl bg-slate-900 border-slate-800 text-slate-300">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
          <span className="text-[9px] font-black text-slate-400 flex items-center gap-1">
            🖥️ Blockchain Ledger Audit Logs
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
        </div>

        <div className="space-y-1.5 max-h-[90px] overflow-y-auto font-mono text-[8px] leading-tight text-emerald-300">
          {blockchainLogs.map((log, index) => (
            <p key={index}>
              [{log.timestamp}] {log.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
