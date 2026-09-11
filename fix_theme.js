const fs = require('fs');

function replaceTheme(file) {
  let code = fs.readFileSync(file, 'utf8');
  // Replace all slate with zinc
  code = code.replace(/slate/g, 'zinc');
  // Specifically replace bg-zinc-950 with bg-black for the main backgrounds to match Inbox/Profile
  code = code.replace(/bg-zinc-950/g, 'bg-black');
  fs.writeFileSync(file, code);
}

replaceTheme('src/app/feed/page.tsx');
replaceTheme('src/app/missed-connections/page.tsx');
