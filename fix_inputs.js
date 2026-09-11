const fs = require('fs');

function fix(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Replace the broken input classes with proper dark mode ones
  const brokenClass = /bg-slate-50 border border-slate-200 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent/g;
  const fixedClass = 'bg-black/40 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 backdrop-blur-md';
  
  code = code.replace(brokenClass, fixedClass);
  fs.writeFileSync(file, code);
}

fix('src/app/login/page.tsx');
fix('src/app/register/page.tsx');
