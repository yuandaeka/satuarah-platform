/**
 * SatuArah Student Activity Tracker
 * Utility for tracking and retrieving student learning data from localStorage.
 */

const USERS_KEY = 'satuarah_users';
const ACTIVITY_PREFIX = 'satuarah_activity_';

// --- Internal Helpers ---

function getActivityKey(email) {
  return `${ACTIVITY_PREFIX}${email.toLowerCase()}`;
}

function getDefaultActivity() {
  return {
    loginHistory: [],
    modeProgress: {
      reguler: { completed: 0, total: 10, lastAccess: null },
      adhd: { completed: 0, total: 5, lastAccess: null },
      tunarungu: { completed: 0, total: 8, lastAccess: null },
      tunanetra: { completed: 0, total: 6, lastAccess: null },
      disleksia: { completed: 0, total: 7, lastAccess: null },
    },
    scores: [],
    totalDuration: 0,
    streak: 0,
  };
}

function loadActivity(email) {
  try {
    const raw = localStorage.getItem(getActivityKey(email));
    if (!raw) return getDefaultActivity();
    const parsed = JSON.parse(raw);
    // Merge with defaults to fill missing fields
    const defaults = getDefaultActivity();
    return {
      loginHistory: parsed.loginHistory || defaults.loginHistory,
      modeProgress: { ...defaults.modeProgress, ...(parsed.modeProgress || {}) },
      scores: parsed.scores || defaults.scores,
      totalDuration: parsed.totalDuration || defaults.totalDuration,
      streak: parsed.streak || defaults.streak,
    };
  } catch {
    return getDefaultActivity();
  }
}

function saveActivity(email, data) {
  try {
    localStorage.setItem(getActivityKey(email), JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save activity:', e);
  }
}

// --- Streak Calculation ---

export function calculateStreak(loginHistory) {
  if (!loginHistory || loginHistory.length === 0) return 0;

  const uniqueDays = [...new Set(
    loginHistory.map(ts => {
      const d = new Date(ts);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  )].sort().reverse();

  if (uniqueDays.length === 0) return 0;

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

  // Streak must include today or yesterday
  if (uniqueDays[0] !== todayKey && uniqueDays[0] !== yesterdayKey) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const parts = uniqueDays[i - 1].split('-').map(Number);
    const prevDate = new Date(parts[0], parts[1], parts[2]);
    const currParts = uniqueDays[i].split('-').map(Number);
    const currDate = new Date(currParts[0], currParts[1], currParts[2]);
    const diff = (prevDate - currDate) / (1000 * 60 * 60 * 24);
    if (Math.abs(diff - 1) < 0.5) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// --- Tracking Functions ---

export function trackLogin(email) {
  if (!email) return;
  const data = loadActivity(email);
  data.loginHistory.push(new Date().toISOString());
  data.streak = calculateStreak(data.loginHistory);
  saveActivity(email, data);
}

export function trackModeAccess(email, mode) {
  if (!email || !mode) return;
  const data = loadActivity(email);
  if (!data.modeProgress[mode]) {
    data.modeProgress[mode] = { completed: 0, total: 10, lastAccess: null };
  }
  data.modeProgress[mode].lastAccess = new Date().toISOString();
  saveActivity(email, data);
}

export function trackModeComplete(email, mode) {
  if (!email || !mode) return;
  const data = loadActivity(email);
  if (!data.modeProgress[mode]) {
    data.modeProgress[mode] = { completed: 0, total: 10, lastAccess: null };
  }
  data.modeProgress[mode].completed += 1;
  data.modeProgress[mode].lastAccess = new Date().toISOString();
  saveActivity(email, data);
}

export function trackScore(email, mode, score, activity) {
  if (!email) return;
  const data = loadActivity(email);
  data.scores.push({
    mode: mode || 'unknown',
    score: score || 0,
    date: new Date().toISOString(),
    activity: activity || 'Aktivitas Belajar',
  });
  saveActivity(email, data);
}

export function trackDuration(email, seconds) {
  if (!email || !seconds) return;
  const data = loadActivity(email);
  data.totalDuration = (data.totalDuration || 0) + seconds;
  saveActivity(email, data);
}

// --- Reading Functions ---

export function getStudentActivity(email) {
  return loadActivity(email);
}

export function getAllStudents() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const usersObj = JSON.parse(raw);
    // usersObj is { email: userData } map
    return Object.values(usersObj)
      .filter(u => (u.role || 'siswa') === 'siswa')
      .map(u => ({
        displayName: u.displayName || 'Siswa',
        email: u.email || '',
        createdAt: u.createdAt || '',
        avatar: u.avatar || '🚀',
      }));
  } catch {
    return [];
  }
}

export function getDashboardStats() {
  const students = getAllStudents();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  let totalScoreSum = 0;
  let totalScoreCount = 0;
  let totalStreak = 0;
  let activeToday = 0;
  const allActivities = [];
  const modeCompletionCounts = {
    reguler: 0,
    adhd: 0,
    tunarungu: 0,
    tunanetra: 0,
    disleksia: 0,
  };

  students.forEach(student => {
    const act = loadActivity(student.email);

    // Check if active today
    const lastLogin = act.loginHistory.length > 0
      ? new Date(act.loginHistory[act.loginHistory.length - 1]).getTime()
      : 0;
    if (lastLogin >= todayStart) {
      activeToday++;
    }

    // Accumulate scores
    if (act.scores && act.scores.length > 0) {
      act.scores.forEach(s => {
        totalScoreSum += s.score;
        totalScoreCount++;
      });
    }

    // Accumulate streak
    totalStreak += act.streak || 0;

    // Mode completion counts
    Object.keys(modeCompletionCounts).forEach(mode => {
      if (act.modeProgress[mode]) {
        modeCompletionCounts[mode] += act.modeProgress[mode].completed;
      }
    });

    // Collect recent activities for timeline
    act.loginHistory.forEach(ts => {
      allActivities.push({
        type: 'login',
        studentName: student.displayName,
        email: student.email,
        date: ts,
        detail: 'Login ke platform',
      });
    });
    if (act.scores) {
      act.scores.forEach(s => {
        allActivities.push({
          type: 'score',
          studentName: student.displayName,
          email: student.email,
          date: s.date,
          detail: `${s.activity} — Skor: ${s.score}`,
          mode: s.mode,
        });
      });
    }
    Object.keys(act.modeProgress).forEach(mode => {
      if (act.modeProgress[mode] && act.modeProgress[mode].lastAccess) {
        allActivities.push({
          type: 'mode_access',
          studentName: student.displayName,
          email: student.email,
          date: act.modeProgress[mode].lastAccess,
          detail: `Mengakses mode ${mode}`,
          mode,
        });
      }
    });
  });

  // Sort activities by date descending and take last 10
  allActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentActivities = allActivities.slice(0, 10);

  return {
    totalStudents: students.length,
    activeToday,
    averageScore: totalScoreCount > 0 ? Math.round(totalScoreSum / totalScoreCount) : 0,
    averageStreak: students.length > 0 ? Math.round(totalStreak / students.length) : 0,
    modeCompletionCounts,
    recentActivities,
  };
}

// --- Relative Time ---

export function getRelativeTime(isoString) {
  if (!isoString) return '';
  try {
    const now = new Date();
    const then = new Date(isoString);
    const diffMs = now - then;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHour < 24) return `${diffHour} jam lalu`;
    if (diffDay === 1) return 'Kemarin';
    if (diffDay < 7) return `${diffDay} hari lalu`;
    if (diffDay < 30) return `${Math.floor(diffDay / 7)} minggu lalu`;
    return `${Math.floor(diffDay / 30)} bulan lalu`;
  } catch {
    return '';
  }
}
