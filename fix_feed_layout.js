const fs = require('fs');

let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

const target = '<div className="flex flex-col gap-10">';
const replacement = '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">';

code = code.replace(target, replacement);

// Adjust max width of main container from default to a wider layout
const mainTarget = '<main className="max-w-md mx-auto px-4 pt-4 pb-20 relative z-10">';
const mainReplacement = '<main className="max-w-7xl mx-auto px-4 pt-4 pb-20 relative z-10">';

code = code.replace(mainTarget, mainReplacement);

fs.writeFileSync('src/app/feed/page.tsx', code);
