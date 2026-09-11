const fs = require('fs');

let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

// Fix the backdrop-blur
code = code.replace(/backdrop-blur-xl/g, 'bg-zinc-800');

// Reduce Ice Cubes from 20 to 8
code = code.replace(/\[\.\.\.Array\(20\)\]/g, '[...Array(8)]');

// Change duration from 1.5 to 0.8
code = code.replace(/duration: 1\.5/g, 'duration: 0.8');
code = code.replace(/duration: 1\.4/g, 'duration: 0.8');
code = code.replace(/duration: 1\.3/g, 'duration: 0.8');

// Change setTimeout from 1500 to 800
code = code.replace(/setTimeout\(\(\) => \{[\s\S]*?\}, 1500\);/g, match => match.replace('1500', '800'));

fs.writeFileSync('src/app/feed/page.tsx', code);
