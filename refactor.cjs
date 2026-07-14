const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src/App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');

const modes = [
  {
    name: 'ADHDMode',
    start: "{/* SUB-VIEW B.2: MODE ADHD */}",
    end: "{/* SUB-VIEW B.3: MODE TUNARUNGU */}",
    props: "adhdScore, adhdGameState, adhdCamReady, adhdCamError, adhdControlMode, setAdhdControlMode, adhdTimeLeft, adhdFailReason, feedbackToast, adhdFocusSound, toggleFocusSound, stopAdhdCamera, setSelectedMode, adhdVideoRef, adhdOverlayCanvasRef, adhdGameCanvasRef, startGame, handleAdhdBoardMouseMove, handleAdhdBoardMouseDown, handleAdhdBoardMouseUp, handleAdhdBoardTouchMove, handleAdhdBoardTouchStart, handleAdhdBoardTouchEnd"
  },
  {
    name: 'TunarunguMode',
    start: "{/* SUB-VIEW B.3: MODE TUNARUNGU */}",
    end: "{/* SUB-VIEW B.4: MODE TUNANETRA */}",
    props: "tunarunguComicPage, setTunarunguComicPage, activeSignWord, setActiveSignWord, playTone, confetti, triggerBadgeMinting"
  },
  {
    name: 'TunanetraMode',
    start: "{/* SUB-VIEW B.4: MODE TUNANETRA */}",
    end: "{/* SUB-VIEW B.5: MODE DISLEKSIA */}",
    props: "isTunanetraNarrating, tunanetraStoryIndex, setTunanetraStoryIndex, micListeningSimulated, tunanetraAnswerResult, setTunanetraAnswerResult, voiceGuide, speakText, stopSpeaking, startTunanetraMic, TUNANETRA_STORIES"
  },
  {
    name: 'DisleksiaMode',
    start: "{/* SUB-VIEW B.5: MODE DISLEKSIA */}",
    end: "{/* TAB C: PROFILE VIEW */}",
    props: "rulerActive, setRulerActive, rulerTop, setRulerTop, disleksiaChallenge, setDisleksiaChallenge, isDyslexiaTracing, dyslexiaTraceComplete, dyslexiaCanvasRef, handleTraceMouseDown, handleTraceMouseMove, handleTraceMouseUp, setupTraceCanvas, verifyDyslexiaTrace, dyslexiaMouthShape, isReadingMicActive, startDyslexiaReadingMic, readingResultText, dyslexiaPronounceCorrect"
  }
];

modes.forEach(mode => {
  const startIndex = appContent.indexOf(mode.start);
  const endIndex = appContent.indexOf(mode.end);
  if (startIndex === -1 || endIndex === -1) {
    console.error(`Could not find bounds for ${mode.name}`);
    return;
  }
  
  // Extract JSX string
  let jsxString = appContent.slice(startIndex, endIndex);
  // Also we want to skip the comment, so find the actual opening brace
  const renderStart = jsxString.indexOf("{selectedMode ===");
  if (renderStart !== -1) {
    // Replace the block in App.jsx
    const placeholder = `{selectedMode === '${mode.name.replace('Mode', '').toLowerCase()}' && (
              <${mode.name}
                ${mode.props.split(', ').map(p => `${p}={${p}}`).join('\n                ')}
              />
            )}
            
            `;
            
    appContent = appContent.slice(0, startIndex + mode.start.length) + '\n            ' + placeholder + appContent.slice(endIndex);
    
    // Create the component file
    const componentContent = `import React from 'react';\n\nexport default function ${mode.name}({
  ${mode.props.split(', ').join(',\n  ')}
}) {
  return (
    ${jsxString.slice(renderStart + `{selectedMode === '${mode.name.replace('Mode', '').toLowerCase()}' && (`.length, jsxString.lastIndexOf(')')).trim()}
  );
}
`;
    fs.writeFileSync(path.join(__dirname, `src/pages/modes/${mode.name}.jsx`), componentContent);
  }
});

fs.writeFileSync(appPath, appContent);
console.log('Successfully refactored modes.');
