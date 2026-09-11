const fs = require('fs');

let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

const mainTarget = '<main className="max-w-md mx-auto p-4 sm:p-6 mt-4">';
const mainReplacement = '<main className="max-w-7xl mx-auto p-4 sm:p-6 mt-4">';

code = code.replace(mainTarget, mainReplacement);

fs.writeFileSync('src/app/feed/page.tsx', code);
