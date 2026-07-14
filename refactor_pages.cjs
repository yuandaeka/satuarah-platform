const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src/App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');

const pages = [
  {
    name: 'Home',
    start: "{/* TAB A: HOME SCREEN */}",
    end: "{/* -------------------------------------------------------- */}",
    propString: "username={username} selectedAvatar={selectedAvatar} renderedStreakDays={renderedStreakDays} renderedDuration={renderedDuration} walletTokens={walletTokens} speakText={speakText}"
  },
  {
    name: 'Belajar',
    start: "{/* TAB B: BELAJAR (LEARNING OPTIONS GRID) */}",
    end: "{/* -------------------------------------------------------- */}",
    propString: "setSelectedMode={setSelectedMode} voiceGuide={voiceGuide} speakText={speakText}"
  },
  {
    name: 'Profile',
    start: "{/* TAB C: PROFILE VIEW */}",
    end: "</main>",
    propString: "username={username} selectedAvatar={selectedAvatar} setIsLoggedIn={setIsLoggedIn} setSelectedMode={setSelectedMode} stopSpeaking={stopSpeaking} unlockedBadges={unlockedBadges} blockchainLogs={blockchainLogs}"
  },
  {
    name: 'RegulerMode',
    start: "{/* SUB-VIEW B.1: MODE REGULER */}",
    end: "{/* SUB-VIEW B.2: MODE ADHD */}",
    propString: "regulerSubMode={regulerSubMode} setRegulerSubMode={setRegulerSubMode} regulerSlide={regulerSlide} setRegulerSlide={setRegulerSlide} karaokePlaying={karaokePlaying} setKaraokePlaying={setKaraokePlaying} karaokeLyricIndex={karaokeLyricIndex} triggerBadgeMinting={triggerBadgeMinting}"
  }
];

// First let's check what exactly is between start and end.
pages.forEach(page => {
  const startIndex = appContent.indexOf(page.start);
  if (startIndex === -1) { console.error("Could not find start", page.name); return; }
  
  // Find the end marker after start
  const endIndex = appContent.indexOf(page.end, startIndex + page.start.length);
  if (endIndex === -1) { console.error("Could not find end", page.name); return; }
  
  let conditionalMatch = "";
  if (page.name === 'Home') conditionalMatch = "currentTab === 'home' && !selectedMode";
  if (page.name === 'Belajar') conditionalMatch = "currentTab === 'belajar' && !selectedMode";
  if (page.name === 'Profile') conditionalMatch = "currentTab === 'profile' && !selectedMode";
  if (page.name === 'RegulerMode') conditionalMatch = "selectedMode === 'reguler'";

  const placeholder = `{${conditionalMatch} && (
              <${page.name}
                ${page.propString.split(' ').join('\\n                ')}
              />
            )}
            `;
  appContent = appContent.slice(0, startIndex + page.start.length) + '\\n            ' + placeholder + appContent.slice(endIndex);
});

fs.writeFileSync(appPath, appContent);
console.log('Successfully replaced pages inside App.jsx');
