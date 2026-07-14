const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src/App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');

// Insert imports at line 3
const lines = appContent.split('\n');
const importString = `
import Home from './pages/Home';
import Belajar from './pages/Belajar';
import Profile from './pages/Profile';
import RegulerMode from './pages/modes/RegulerMode';
import ADHDMode from './pages/modes/ADHDMode';
import TunarunguMode from './pages/modes/TunarunguMode';
import TunanetraMode from './pages/modes/TunanetraMode';
import DisleksiaMode from './pages/modes/DisleksiaMode';
import { REGULER_LYRICS, TUNANETRA_STORIES, INITIAL_PLANET_CARDS } from './constants';
import { playTone } from './utils/audio';
`;

// Also remove the old playTone, REGULER_LYRICS, TUNANETRA_STORIES, INITIAL_PLANET_CARDS which are between line 4 and 60
// But we can just use string replacement
const exportDefaultIndex = appContent.indexOf('export default function App()');

let beforeExport = appContent.slice(0, exportDefaultIndex);
const afterExport = appContent.slice(exportDefaultIndex);

// Keep the first few lines (React, confetti imports)
const firstLines = lines.slice(0, 3).join('\n');
appContent = firstLines + importString + '\n\n' + afterExport;

fs.writeFileSync(appPath, appContent);
console.log('Successfully added imports and removed extracted constants.');
