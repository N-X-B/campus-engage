const fs = require('fs');

let code = fs.readFileSync('src/app/chat/[id]/page.tsx', 'utf8');
code = code.replace('new RegExp("\\b" + w + "\\b", "g")', 'new RegExp("\\\\b" + w + "\\\\b", "g")');
fs.writeFileSync('src/app/chat/[id]/page.tsx', code);
