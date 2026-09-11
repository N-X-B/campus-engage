const fs = require('fs');

function makeDark(file) {
  let code = fs.readFileSync(file, 'utf8');

  // Card container
  code = code.replace(/bg-white\/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/g, 'bg-black/50 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/10');
  
  // Headers and text
  code = code.replace(/text-slate-900/g, 'text-white');
  code = code.replace(/text-slate-500/g, 'text-zinc-400');
  code = code.replace(/text-slate-700/g, 'text-zinc-300');
  
  // Inputs
  code = code.replace(/bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-500/g, 'bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:ring-white');
  
  // Submit Button
  code = code.replace(/bg-slate-900 text-white hover:bg-slate-800/g, 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]');
  
  // Link styles
  code = code.replace(/text-indigo-600 hover:text-indigo-500/g, 'text-white underline hover:text-zinc-300');

  // Success Screen Container
  code = code.replace(/bg-slate-950/g, 'bg-black');
  code = code.replace(/text-slate-800/g, 'text-zinc-500');

  fs.writeFileSync(file, code);
}

makeDark('src/app/login/page.tsx');
makeDark('src/app/register/page.tsx');
