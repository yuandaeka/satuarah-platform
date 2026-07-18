import React, { useState, useEffect, useMemo } from 'react';
import { getAllStudents, getStudentActivity, getDashboardStats, getRelativeTime } from '../../utils/studentTracker';

const MODE_COLORS = {
  reguler: { bg: 'from-emerald-400 to-teal-500', bar: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  adhd: { bg: 'from-amber-400 to-orange-500', bar: 'bg-amber-500', light: 'bg-amber-50 text-amber-700 border-amber-200' },
  tunarungu: { bg: 'from-blue-400 to-indigo-500', bar: 'bg-blue-500', light: 'bg-blue-50 text-blue-700 border-blue-200' },
  tunanetra: { bg: 'from-purple-400 to-violet-500', bar: 'bg-purple-500', light: 'bg-purple-50 text-purple-700 border-purple-200' },
  disleksia: { bg: 'from-rose-400 to-pink-500', bar: 'bg-rose-500', light: 'bg-rose-50 text-rose-700 border-rose-200' },
};

const MODE_EMOJIS = {
  reguler: '🎓',
  adhd: '🎯',
  tunarungu: '🤟',
  tunanetra: '🎧',
  disleksia: '✏️',
};

const MODE_LABELS = {
  reguler: 'Reguler',
  adhd: 'ADHD',
  tunarungu: 'Tunarungu',
  tunanetra: 'Tunanetra',
  disleksia: 'Disleksia',
};

const ACTIVITY_ICONS = {
  login: '🟢',
  score: '🏆',
  mode_access: '📖',
};

export default function GuruDashboard({ username, onNavigateToSiswa }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const data = getDashboardStats();
    setStats(data);
  }, []);

  // Compute max mode completion for bar widths
  const maxModeCount = useMemo(() => {
    if (!stats) return 1;
    const vals = Object.values(stats.modeCompletionCounts);
    return Math.max(...vals, 1);
  }, [stats]);

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <span className="text-4xl mb-3">⏳</span>
        <p className="text-[10px] font-bold text-slate-400">Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Greeting Header */}
      <div className="guru-gradient-card rounded-3xl p-5 text-white relative overflow-hidden">
        <div className="absolute -right-6 -top-6 text-[120px] opacity-[0.07] select-none font-black leading-none">GURU</div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl border border-white/20 shadow-inner backdrop-blur-sm">
              👩‍🏫
            </div>
            <div>
              <h2 className="text-base font-black leading-tight">Halo, Guru {username}!</h2>
              <p className="text-[9px] text-indigo-100 font-semibold mt-0.5">Pantau perkembangan belajar siswa Anda 📊</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats Cards — 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Siswa */}
        <div className="bubbly-card guru-stat-card rounded-2xl p-4 text-center relative overflow-hidden group cursor-pointer" onClick={onNavigateToSiswa}>
          <div className="absolute -right-2 -bottom-2 text-[50px] opacity-[0.06] group-hover:opacity-[0.12] transition-opacity select-none">👥</div>
          <span className="text-3xl block mb-1 filter drop-shadow">👥</span>
          <span className="text-2xl font-black text-indigo-700 block">{stats.totalStudents}</span>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Total Siswa</span>
        </div>

        {/* Aktif Hari Ini */}
        <div className="bubbly-card guru-stat-card rounded-2xl p-4 text-center relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 text-[50px] opacity-[0.06] select-none">🟢</div>
          <span className="text-3xl block mb-1 filter drop-shadow">🟢</span>
          <span className="text-2xl font-black text-emerald-600 block">{stats.activeToday}</span>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Aktif Hari Ini</span>
        </div>

        {/* Rata-rata Skor */}
        <div className="bubbly-card guru-stat-card rounded-2xl p-4 text-center relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 text-[50px] opacity-[0.06] select-none">📈</div>
          <span className="text-3xl block mb-1 filter drop-shadow">📈</span>
          <span className="text-2xl font-black text-amber-600 block">{stats.averageScore}</span>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Rata-rata Skor</span>
        </div>

        {/* Rata-rata Streak */}
        <div className="bubbly-card guru-stat-card rounded-2xl p-4 text-center relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 text-[50px] opacity-[0.06] select-none">🔥</div>
          <span className="text-3xl block mb-1 filter drop-shadow">🔥</span>
          <span className="text-2xl font-black text-rose-500 block">{stats.averageStreak}</span>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Rata-rata Streak</span>
        </div>
      </div>

      {/* Progress Per Mode */}
      <div className="bubbly-card rounded-3xl p-4 space-y-3">
        <h4 className="font-black text-[10px] text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          📊 Progress Siswa Per Mode Belajar
        </h4>
        <div className="space-y-2.5">
          {Object.keys(MODE_LABELS).map(mode => {
            const count = stats.modeCompletionCounts[mode] || 0;
            const widthPercent = Math.max((count / maxModeCount) * 100, 4);
            return (
              <div key={mode} className="flex items-center gap-2.5">
                <span className="text-lg w-6 text-center flex-shrink-0">{MODE_EMOJIS[mode]}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-black text-slate-600">{MODE_LABELS[mode]}</span>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border ${MODE_COLORS[mode].light}`}>
                      {count} selesai
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${MODE_COLORS[mode].bg}`}
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Aktivitas Terbaru */}
      <div className="bubbly-card rounded-3xl p-4 space-y-3">
        <h4 className="font-black text-[10px] text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          🕐 Aktivitas Terbaru Siswa
        </h4>

        {stats.recentActivities.length === 0 ? (
          <div className="text-center py-6">
            <span className="text-4xl block mb-2 opacity-50">📭</span>
            <p className="text-[10px] font-bold text-slate-400">Belum ada aktivitas siswa</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {stats.recentActivities.slice(0, 5).map((act, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-indigo-200 transition-colors"
              >
                <span className="text-sm mt-0.5 flex-shrink-0">{ACTIVITY_ICONS[act.type] || '📌'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black text-slate-800 truncate">{act.studentName}</span>
                    {act.mode && (
                      <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full border ${MODE_COLORS[act.mode]?.light || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {MODE_LABELS[act.mode] || act.mode}
                      </span>
                    )}
                  </div>
                  <p className="text-[8px] text-slate-500 font-semibold mt-0.5 truncate">{act.detail}</p>
                </div>
                <span className="text-[7px] text-slate-400 font-bold flex-shrink-0 mt-0.5">
                  {getRelativeTime(act.date)}
                </span>
              </div>
            ))}
          </div>
        )}

        {stats.recentActivities.length > 0 && (
          <button
            onClick={onNavigateToSiswa}
            className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-[9px] uppercase tracking-wider rounded-xl border border-indigo-200 transition-colors active:scale-[0.98]"
          >
            Lihat Semua Siswa →
          </button>
        )}
      </div>
    </div>
  );
}
