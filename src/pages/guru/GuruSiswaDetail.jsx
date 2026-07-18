import React, { useState, useEffect } from 'react';
import { getStudentActivity, getRelativeTime } from '../../utils/studentTracker';

const MODES = [
  { key: 'reguler', name: 'Reguler', emoji: '🎓', gradient: 'from-emerald-400 to-teal-500' },
  { key: 'adhd', name: 'ADHD', emoji: '🎯', gradient: 'from-amber-400 to-orange-500' },
  { key: 'tunarungu', name: 'Tunarungu', emoji: '🤟', gradient: 'from-blue-400 to-indigo-500' },
  { key: 'tunanetra', name: 'Tunanetra', emoji: '🎧', gradient: 'from-purple-400 to-violet-500' },
  { key: 'disleksia', name: 'Disleksia', emoji: '✏️', gradient: 'from-rose-400 to-pink-500' },
];

export default function GuruSiswaDetail({ studentEmail, onBack }) {
  const [studentInfo, setStudentInfo] = useState(null);
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    // Get student info from users storage
    try {
      const raw = localStorage.getItem('satuarah_users');
      if (raw) {
        const usersObj = JSON.parse(raw);
        const user = usersObj[studentEmail.toLowerCase()];
        if (user) setStudentInfo(user);
      }
    } catch (e) {
      console.warn('Failed to read user:', e);
    }

    // Get activity
    const act = getStudentActivity(studentEmail);
    setActivity(act);
  }, [studentEmail]);

  if (!studentInfo || !activity) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <span className="text-4xl mb-3">⏳</span>
        <p className="text-[10px] font-bold text-slate-400">Memuat data siswa...</p>
      </div>
    );
  }

  // Derived statistics
  const totalDuration = activity.totalDuration || 0;
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);
  const totalSessions = activity.loginHistory ? activity.loginHistory.length : 0;
  const scores = activity.scores || [];
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
    : 0;

  // Find favorite mode
  let favoriteMode = '-';
  let maxCompleted = 0;
  Object.entries(activity.modeProgress || {}).forEach(([key, val]) => {
    if (val && val.completed > maxCompleted) {
      maxCompleted = val.completed;
      const m = MODES.find(mo => mo.key === key);
      favoriteMode = m ? `${m.emoji} ${m.name}` : key;
    }
  });

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (score >= 60) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-rose-100 text-rose-700 border-rose-200';
  };

  const formatDate = (iso) => {
    if (!iso) return '-';
    try {
      return new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch { return '-'; }
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-indigo-600 font-black text-[10px] uppercase tracking-wider hover:text-indigo-800 active:scale-95 transition-all py-1"
      >
        <span className="text-sm">←</span> Kembali ke Daftar Siswa
      </button>

      {/* Student Profile Card */}
      <div className="guru-gradient-card rounded-3xl p-5 text-white relative overflow-hidden">
        <div className="absolute -right-4 -top-4 text-[100px] opacity-[0.06] select-none font-black">SISWA</div>
        <div className="relative z-10">
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl border border-white/20 shadow-inner backdrop-blur-sm">
              🚀
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-black leading-tight truncate">{studentInfo.displayName}</h2>
              <p className="text-[9px] text-indigo-100 font-semibold truncate">{studentInfo.email}</p>
              <p className="text-[8px] text-indigo-200 font-semibold mt-0.5">
                Bergabung {formatDate(studentInfo.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-1.5 border border-white/15">
              <span className="text-sm">✨</span>
              <span className="text-[9px] font-black">{(activity.streak || 0) * 10} Spark</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-1.5 border border-white/15">
              <span className="text-sm">🔥</span>
              <span className="text-[9px] font-black">{activity.streak || 0} Hari Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary — 2x2 */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bubbly-card rounded-2xl p-3.5 text-center">
          <span className="text-xl block mb-0.5">⏱️</span>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Waktu Belajar</span>
          <span className="text-sm font-black text-indigo-700 block mt-0.5">{hours}j {minutes}m</span>
        </div>
        <div className="bubbly-card rounded-2xl p-3.5 text-center">
          <span className="text-xl block mb-0.5">📅</span>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Total Sesi</span>
          <span className="text-sm font-black text-indigo-700 block mt-0.5">{totalSessions} Sesi</span>
        </div>
        <div className="bubbly-card rounded-2xl p-3.5 text-center">
          <span className="text-xl block mb-0.5">📈</span>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Rata-rata Skor</span>
          <span className="text-sm font-black text-indigo-700 block mt-0.5">{avgScore}</span>
        </div>
        <div className="bubbly-card rounded-2xl p-3.5 text-center">
          <span className="text-xl block mb-0.5">⭐</span>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Mode Favorit</span>
          <span className="text-[10px] font-black text-indigo-700 block mt-0.5 truncate">{favoriteMode}</span>
        </div>
      </div>

      {/* Progress Per Mode */}
      <div className="bubbly-card rounded-3xl p-4 space-y-3">
        <h4 className="font-black text-[10px] text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          📊 Progress Pembelajaran
        </h4>
        <div className="space-y-3">
          {MODES.map(mode => {
            const prog = activity.modeProgress[mode.key] || { completed: 0, total: 10, lastAccess: null };
            const total = prog.total > 0 ? prog.total : 10;
            const pct = Math.round((prog.completed / total) * 100);

            return (
              <div key={mode.key}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-black text-slate-600 flex items-center gap-1.5">
                    <span className="text-base">{mode.emoji}</span> {mode.name}
                  </span>
                  <span className="text-[8px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full border border-indigo-200">
                    {pct}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${mode.gradient}`}
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-0.5">
                  <span className="text-[7px] text-slate-400 font-bold">{prog.completed}/{total} Aktivitas</span>
                  <span className="text-[7px] text-slate-400 font-bold">
                    {prog.lastAccess ? `Terakhir: ${getRelativeTime(prog.lastAccess)}` : 'Belum dimulai'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Riwayat Skor */}
      <div className="bubbly-card rounded-3xl p-4 space-y-3">
        <h4 className="font-black text-[10px] text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          📝 Riwayat Skor
        </h4>

        {scores.length === 0 ? (
          <div className="text-center py-5">
            <span className="text-3xl block mb-2 opacity-50">📭</span>
            <p className="text-[9px] font-bold text-slate-400">Belum ada riwayat skor</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {[...scores].reverse().slice(0, 10).map((s, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black text-slate-700 truncate">{s.activity}</p>
                  <p className="text-[7px] text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                    <span className="bg-white px-1 py-0.5 rounded border border-slate-100 capitalize">{s.mode}</span>
                    <span>•</span>
                    <span>{formatDate(s.date)}</span>
                  </p>
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg border ${getScoreColor(s.score)}`}>
                  {s.score}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Riwayat Login */}
      <div className="bubbly-card rounded-3xl p-4 space-y-3">
        <h4 className="font-black text-[10px] text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          📱 Riwayat Login Terakhir
        </h4>

        {activity.loginHistory && activity.loginHistory.length > 0 ? (
          <div className="space-y-1">
            {[...activity.loginHistory].reverse().slice(0, 10).map((ts, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-2 border-b border-slate-50 last:border-0">
                <span className="text-sm flex-shrink-0">✅</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black text-slate-600">Berhasil Login</p>
                  <p className="text-[7px] text-slate-400 font-bold">
                    {getRelativeTime(ts)} • {formatDate(ts)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <span className="text-3xl block mb-2 opacity-50">😴</span>
            <p className="text-[9px] font-bold text-slate-400">Belum ada aktivitas login</p>
          </div>
        )}
      </div>
    </div>
  );
}
