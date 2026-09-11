const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// Remove the spring logic completely to eliminate latency
code = code.replace(/const springConfig = { damping: 28, stiffness: 1000, mass: 0.05 };/g, '');
code = code.replace(/const cursorXSpring = useSpring\(cursorX, springConfig\);/g, '');
code = code.replace(/const cursorYSpring = useSpring\(cursorY, springConfig\);/g, '');

code = code.replace(/style={{ x: cursorXSpring, y: cursorYSpring }}/g, 'style={{ x: cursorX, y: cursorY }}');
code = code.replace(/useSpring, /g, '');

fs.writeFileSync('src/app/page.tsx', code);
