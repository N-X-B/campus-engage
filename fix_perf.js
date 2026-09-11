const fs = require('fs');

// 1. Remove Online status from ChatRoom
let chatCode = fs.readFileSync('src/app/chat/[id]/page.tsx', 'utf8');
chatCode = chatCode.replace(/<span className="text-\[10px\] text-emerald-500 font-bold tracking-widest uppercase">Online<\/span>/g, '');
fs.writeFileSync('src/app/chat/[id]/page.tsx', chatCode);

// 2. Make LoadingScreen super fast
let loadingCode = fs.readFileSync('src/components/LoadingScreen.tsx', 'utf8');
loadingCode = loadingCode.replace(/duration: 0\.5/g, 'duration: 0.15'); // Much faster fade
loadingCode = loadingCode.replace(/filter: "blur\\(10px\\)"/g, 'filter: "blur(0px)"'); // Remove heavy blur filter which lags mobile
fs.writeFileSync('src/components/LoadingScreen.tsx', loadingCode);

// 3. Let's check feed/page.tsx
let feedCode = fs.readFileSync('src/app/feed/page.tsx', 'utf8');
// Fasten feed loading animation
feedCode = feedCode.replace(/duration: 0\.6/g, 'duration: 0.2');
feedCode = feedCode.replace(/duration: 0\.5/g, 'duration: 0.2');
fs.writeFileSync('src/app/feed/page.tsx', feedCode);

// 4. Inbox loading speed
let inboxCode = fs.readFileSync('src/app/inbox/page.tsx', 'utf8');
inboxCode = inboxCode.replace(/duration: 0\.6/g, 'duration: 0.2');
fs.writeFileSync('src/app/inbox/page.tsx', inboxCode);

