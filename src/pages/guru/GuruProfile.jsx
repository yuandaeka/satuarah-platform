import React from 'react';

export default function GuruProfile({ username, email, onLogout }) {
  const getMemberSince = () => {
    try {
      const raw = localStorage.getItem('satuarah_users');
      if (raw) {
        const usersObj = JSON.parse(raw);
        const user = usersObj[email?.toLowerCase()];
        if (user?.createdAt) {
          return new Date(user.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
          });
        }
      }
    } catch { /* ignore */ }
    return '-';
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Profile Header Card */}
      <div className="bubbly-card p-5 rounded-3xl text-center relative overflow-hidden bg-gradient-to-b from-white to-indigo-50/30">
        <div className="absolute -right-4 -top-4 text-[80px] opacity-[0.04] select-none font-black">GURU</div>
        
        <div className="w-16 h-16 rounded-full bg-indigo-100 text-4xl mx-auto flex items-center justify-center shadow-md mb-3 border-2 border-white animate-float">
          👩‍🏫
        </div>
        
        <h3 className="font-extrabold text-sm text-slate-800">{username}</h3>
        
        <div className="mt-1.5 inline-flex items-center gap-1 bg-indigo-500 text-white font-black text-[8px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border-b-2 border-indigo-700">
          <span>🎓</span> GURU
        </div>
        
        {email && (
          <p className="text-[8px] text-slate-400 font-bold mt-2">{email}</p>
        )}
        
        <p className="text-[8px] text-slate-400 font-bold mt-0.5">
          Bergabung sejak {getMemberSince()}
        </p>

        <div className="block mt-4">
          <button
            onClick={onLogout}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-[9px] py-2 px-5 rounded-xl border border-rose-200 transition-colors active:scale-95"
          >
            🚪 Keluar Akun
          </button>
        </div>
      </div>

      {/* Platform Info Card */}
      <div className="bubbly-card p-4 rounded-3xl space-y-2">
        <h4 className="font-black text-[10px] text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          ℹ️ Informasi Platform
        </h4>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[9px] font-bold text-slate-500">Nama Aplikasi</span>
            <span className="text-[9px] font-black text-slate-700">SatuArah</span>
          </div>
          <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[9px] font-bold text-slate-500">Versi</span>
            <span className="text-[9px] font-black text-indigo-600">v1.0.0</span>
          </div>
          <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[9px] font-bold text-slate-500">Tagline</span>
            <span className="text-[9px] font-black text-slate-700">Inklusi EduTech Platform</span>
          </div>
          <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[9px] font-bold text-slate-500">Role Anda</span>
            <span className="text-[9px] font-black bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">Guru</span>
          </div>
        </div>
      </div>

      {/* Credits */}
      <div className="text-center py-2">
        <p className="text-[8px] text-slate-300 font-bold">
          © 2026 SatuArah — Inklusi EduTech Platform
        </p>
      </div>
    </div>
  );
}
