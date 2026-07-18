import React, { useState, useEffect, useMemo } from 'react';
import { getAllStudents, getStudentActivity, getRelativeTime } from '../../utils/studentTracker';

const MODE_META = [
  { key: 'reguler', emoji: '🎓', color: 'bg-emerald-400' },
  { key: 'adhd', emoji: '🎯', color: 'bg-amber-400' },
  { key: 'tunarungu', emoji: '🤟', color: 'bg-blue-400' },
  { key: 'tunanetra', emoji: '🎧', color: 'bg-purple-400' },
  { key: 'disleksia', emoji: '✏️', color: 'bg-rose-400' },
];

const FILTER_OPTIONS = [
  { key: 'all', label: 'Semua', emoji: '📋' },
  { key: 'active', label: 'Aktif Hari Ini', emoji: '🟢' },
  { key: 'reguler', label: 'Reguler', emoji: '🎓' },
  { key: 'adhd', label: 'ADHD', emoji: '🎯' },
  { key: 'tunarungu', label: 'Tunarungu', emoji: '🤟' },
  { key: 'tunanetra', label: 'Tunanetra', emoji: '🎧' },
  { key: 'disleksia', label: 'Disleksia', emoji: '✏️' },
];

export default function GuruSiswaList({ onSelectStudent }) {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const allStudents = getAllStudents();
    // Enrich with activity data
    const enriched = allStudents.map(s => ({
      ...s,
      activity: getStudentActivity(s.email),
    }));
    setStudents(enriched);
  }, []);

  const todayStart = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  }, []);

  const filteredStudents = useMemo(() => {
    let result = students;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.displayName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (activeFilter === 'active') {
      result = result.filter(s => {
        const history = s.activity.loginHistory;
        if (history.length === 0) return false;
        const lastLogin = new Date(history[history.length - 1]).getTime();
        return lastLogin >= todayStart;
      });
    } else if (['reguler', 'adhd', 'tunarungu', 'tunanetra', 'disleksia'].includes(activeFilter)) {
      result = result.filter(s => {
        const mp = s.activity.modeProgress[activeFilter];
        return mp && mp.lastAccess !== null;
      });
    }

    return result;
  }, [students, searchQuery, activeFilter, todayStart]);

  const getLastLogin = (activity) => {
    if (!activity.loginHistory || activity.loginHistory.length === 0) return null;
    return activity.loginHistory[activity.loginHistory.length - 1];
  };

  const getSparks = (activity) => {
    try {
      // Try reading from localStorage directly
      return parseInt(localStorage.getItem('satuarah_sparks') || '0', 10);
    } catch {
      return 0;
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-1">
        <h2 className="text-lg font-black text-slate-800 leading-tight">👥 Daftar Siswa</h2>
        <p className="text-[9px] text-slate-500 font-semibold mt-0.5">
          {students.length} siswa terdaftar di platform
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama atau email siswa..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-indigo-400 outline-none text-[10px] font-bold text-slate-700 bg-white/80 backdrop-blur-sm transition-colors shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-black"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
        {FILTER_OPTIONS.map(filter => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[8px] font-black border-2 transition-all duration-200 active:scale-95 ${
              activeFilter === filter.key
                ? 'bg-indigo-500 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
            }`}
          >
            {filter.emoji} {filter.label}
          </button>
        ))}
      </div>

      {/* Student Cards */}
      {filteredStudents.length === 0 ? (
        <div className="bubbly-card rounded-3xl p-8 text-center">
          <span className="text-5xl block mb-3 opacity-60">📚</span>
          <h4 className="font-black text-xs text-slate-600">
            {searchQuery ? 'Siswa tidak ditemukan' : 'Belum ada siswa yang terdaftar'}
          </h4>
          <p className="text-[9px] text-slate-400 font-semibold mt-1">
            {searchQuery
              ? `Tidak ada hasil untuk "${searchQuery}"`
              : 'Siswa akan muncul di sini setelah mereka mendaftar di platform.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredStudents.map((student, idx) => {
            const lastLogin = getLastLogin(student.activity);
            const isActiveToday = lastLogin && new Date(lastLogin).getTime() >= todayStart;

            return (
              <div
                key={student.email}
                onClick={() => onSelectStudent(student.email)}
                className="bubbly-card rounded-2xl p-3.5 cursor-pointer group hover:border-indigo-300 transition-all duration-200"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center text-xl border border-indigo-200 flex-shrink-0 group-hover:scale-105 transition-transform">
                    {student.avatar || '🚀'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h5 className="font-black text-[11px] text-slate-800 truncate">{student.displayName}</h5>
                      {isActiveToday && (
                        <span className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0 animate-pulse" title="Aktif hari ini" />
                      )}
                    </div>
                    <p className="text-[8px] text-slate-400 font-semibold truncate">{student.email}</p>
                    <p className="text-[8px] text-slate-400 font-semibold mt-0.5">
                      {lastLogin ? `Terakhir aktif: ${getRelativeTime(lastLogin)}` : 'Belum pernah login'}
                    </p>
                  </div>

                  {/* Mini Progress Bars */}
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    {MODE_META.map(mode => {
                      const prog = student.activity.modeProgress[mode.key];
                      const total = prog?.total || 10;
                      const completed = prog?.completed || 0;
                      const pct = Math.round((completed / total) * 100);
                      return (
                        <div key={mode.key} className="flex items-center gap-1" title={`${mode.key}: ${pct}%`}>
                          <span className="text-[7px]">{mode.emoji}</span>
                          <div className="w-10 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${mode.color} transition-all duration-700`}
                              style={{ width: `${Math.max(pct, 2)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Arrow */}
                  <span className="text-slate-300 text-xs group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all flex-shrink-0">›</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
