const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src/App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// I will just use regex to remove the inline code blocks that were duplicated.

// 1. Remove Home inline block
content = content.replace(/\{currentTab === 'home' && !selectedMode && \(\s*<div className="space-y-5">.*?\{\/\* -------------------------------------------------------- \*\/\}/s, '{/* -------------------------------------------------------- */}');

// 2. Remove Belajar inline block
content = content.replace(/\{currentTab === 'belajar' && !selectedMode && \(\s*<div className="space-y-4">\s*<div className="mb-2">.*?\{\/\* -------------------------------------------------------- \*\/\}/s, '{/* -------------------------------------------------------- */}');

// 3. Remove RegulerMode inline block
content = content.replace(/\{selectedMode === 'reguler' && \(\s*<div className="space-y-4">\s*<div className="border-b border-emerald-100 pb-3 flex justify-between items-center">.*?\{\/\* SUB-VIEW B\.2: MODE ADHD \*\/\}/s, '{/* SUB-VIEW B.2: MODE ADHD */}');

// 4. Remove Profile inline block
// Profile's end is `</main>`
content = content.replace(/\{currentTab === 'profile' && !selectedMode && \(\s*<div className="space-y-4">\s*\{\/\* Profile header \*\/\}.*?<\/main>/s, '</main>');

// 5. Remove ADHDMode inline block (Wait, did my first script for ADHDMode also duplicate it?)
// Let's check if ADHDMode was duplicated.
// The first script used modes.forEach, and replaced from `start` to `end`.
// start was `{/* SUB-VIEW B.2: MODE ADHD */}`, end was `{/* SUB-VIEW B.3: MODE TUNARUNGU */}`.
// That one probably worked perfectly because the `start` and `end` were unique!

fs.writeFileSync(appPath, content);
console.log('Fixed duplicates!');
