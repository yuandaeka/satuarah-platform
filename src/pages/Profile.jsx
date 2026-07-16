import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function Profile({
  username,
  selectedAvatar,
  setIsLoggedIn,
  setSelectedMode,
  stopSpeaking,
  unlockedBadges,
  blockchainLogs,
  sparks = 50,
  setSparks,
}) {
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [buyFeedback, setBuyFeedback] = useState('');

  const STORE_ITEMS = [
    { id: 'char_koka', icon: '🤖✨', name: 'Robot Koka Emas', type: 'Karakter', cost: 30 },
    { id: 'acc_hat', icon: '🤠', name: 'Topi Koboi Robot', type: 'Aksesori', cost: 20 },
    { id: 'theme_galaxy', icon: '🌌', name: 'Tema Galaxy Space', type: 'Tema', cost: 40 },
    { id: 'bonus_game', icon: '🚀👾', name: 'Tantangan Bonus', type: 'Bonus', cost: 50 },
  ];

  const handleBuy = (item) => {
    if (purchasedItems.includes(item.id)) {
      setBuyFeedback('Kamu sudah memiliki item ini! 🎉');
      return;
    }
    if (sparks < item.cost) {
      setBuyFeedback('Sparks tidak cukup. Ayo selesaikan misi lagi! 💪');
      setTimeout(() => setBuyFeedback(''), 3000);
      return;
    }
    // Deduct sparks
    setSparks(prev => {
      const next = prev - item.cost;
      localStorage.setItem('satuarah_sparks', next.toString());
      return next;
    });
    setPurchasedItems(prev => [...prev, item.id]);
    confetti({ particleCount: 30, spread: 50 });
    setBuyFeedback(`Berhasil membuka ${item.name}! 🎉`);
    setTimeout(() => setBuyFeedback(''), 3500);
  };

  return (
    <div className="space-y-4">
      {/* Profile header with Sparks Counter */}
      <div className="bubbly-card p-5 rounded-3xl text-center relative overflow-hidden bg-gradient-to-b from-white to-emerald-50/10">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-4xl mx-auto flex items-center justify-center shadow-md mb-3 border-2 border-white animate-float">
          {selectedAvatar}
        </div>
        <h3 className="font-extrabold text-sm text-slate-800">{username}</h3>
        <p className="text-[9px] text-slate-400 font-bold mt-0.5">ID Siswa: SA-2026-9832</p>

        {/* Sparks Indicator Counter */}
        <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-500 text-white font-black text-[10px] px-4 py-1.5 rounded-full shadow-md border-b-3 border-amber-700">
          <span>✨</span> {sparks} Spark SatuArah
        </div>

        <div className="block mt-3">
          <button
            onClick={() => { setIsLoggedIn(false); setSelectedMode(null); stopSpeaking(); }}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-[9px] py-1.5 px-4 rounded-xl border border-rose-200 transition-colors"
          >
            Keluar Akun
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="bubbly-card p-4 rounded-3xl space-y-3">
        <h4 className="font-black text-[10px] text-slate-700 uppercase tracking-wider flex items-center gap-1">
          🏆 Lencana Prestasi Koding Cilik
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

      {/* Spark SatuArah Redirection Store */}
      <div className="bubbly-card p-4 rounded-3xl bg-amber-50/20 border-4 border-amber-300 space-y-3 shadow-md">
        <div className="text-center">
          <h4 className="font-black text-[11px] text-amber-900 uppercase tracking-widest flex items-center justify-center gap-1">
            ✨ TOKO REWARD SPARK SATUARAH
          </h4>
          <p className="text-[8px] text-amber-800 font-extrabold mt-0.5">Tukarkan Spark belajarmu untuk membuka bonus seru!</p>
        </div>

        {buyFeedback && (
          <div className="p-2 bg-amber-500 text-white font-black text-[9px] text-center rounded-xl border-2 border-amber-700 animate-pulse">
            {buyFeedback}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-1">
          {STORE_ITEMS.map(item => {
            const owned = purchasedItems.includes(item.id);
            return (
              <div key={item.id} className="bg-white border-2 border-amber-300 p-2.5 rounded-2xl text-center space-y-1 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-2xl block">{item.icon}</span>
                  <h5 className="font-black text-[9px] text-slate-800 uppercase tracking-wide leading-tight mt-1">{item.name}</h5>
                  <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider block">{item.type}</span>
                </div>
                <button
                  onClick={() => handleBuy(item)}
                  className={`w-full py-1.5 rounded-xl text-[8px] font-black border-2 border-b-4 mt-2 transition-all ${
                    owned
                      ? 'bg-emerald-500 border-emerald-700 text-white shadow-none translate-y-0.5'
                      : 'bg-amber-500 border-amber-700 hover:bg-amber-600 text-white active:translate-y-0.5'
                  }`}
                >
                  {owned ? 'DIBUKA ✓' : `💰 ${item.cost} Spark`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
