const fs = require('fs');

let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

const replacements = [
  // Page header
  ['className="text-4xl font-black text-white tracking-tight"', 'className="text-3xl font-black text-white tracking-tight"'],
  ['className="text-zinc-500 mt-1 text-lg"', 'className="text-zinc-500 mt-1 text-sm"'],
  
  // Profile info
  ['className="text-3xl font-bold text-white"', 'className="text-2xl font-bold text-white tracking-tight"'],
  
  // Bio
  ['className="text-white font-bold text-lg mb-4 flex items-center gap-2"', 'className="text-white font-bold text-base mb-4 flex items-center gap-2"'],
  ['className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"', 'className="w-full bg-white text-black py-3.5 rounded-2xl font-bold text-base hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"'],
  
  // Sections
  ['className="text-white font-bold text-xl"', 'className="text-white font-bold text-lg"'],
  ['className="text-white font-bold text-xl mb-6"', 'className="text-white font-bold text-lg mb-6"'],
  ['className="text-xl font-bold text-white mb-2"', 'className="text-lg font-bold text-white mb-2"'],
  ['className="text-white font-bold text-xl mb-2"', 'className="text-white font-bold text-lg mb-2"'],
  
  // Buttons
  ['className="inline-block w-full bg-[#FFDD00] text-black py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,221,0,0.2)]"', 'className="inline-block w-full bg-[#FFDD00] text-black py-3.5 rounded-2xl font-bold text-base hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,221,0,0.2)]"'],
  
  // Edit vibe check modal
  ['<h2 className="text-2xl font-bold mb-6 text-white">Edit Vibe Check</h2>', '<h2 className="text-xl font-bold mb-6 text-white tracking-tight">Edit Vibe Check</h2>']
];

replacements.forEach(([target, replacement]) => {
  code = code.replace(target, replacement);
});

fs.writeFileSync('src/app/profile/page.tsx', code);
