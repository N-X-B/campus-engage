const fs = require('fs');

let code = fs.readFileSync('src/app/register/page.tsx', 'utf8');

// Container
code = code.replace(/bg-slate-50/g, 'bg-black');
// Inputs
code = code.replace(/w-full bg-black border border-slate-200 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all/g, 'w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all backdrop-blur-md');
// Headers
code = code.replace(/text-slate-900/g, 'text-white');
code = code.replace(/text-slate-500/g, 'text-zinc-400');
code = code.replace(/text-slate-700/g, 'text-zinc-300');
code = code.replace(/text-slate-600/g, 'text-zinc-400');

// Fix button
code = code.replace(/bg-slate-900 text-white hover:bg-slate-800/g, 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]');

fs.writeFileSync('src/app/register/page.tsx', code);
