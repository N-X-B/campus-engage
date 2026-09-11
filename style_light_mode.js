const fs = require('fs');

function convertToLightGlass(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Revert card to light mode
  content = content.replace(/bg-slate-900\/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white\/10/g, 'bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200');
  
  // Revert text colors
  content = content.replace(/text-white/g, 'text-slate-900');
  content = content.replace(/text-slate-400/g, 'text-slate-500');
  content = content.replace(/text-slate-300/g, 'text-slate-600');
  
  // Revert inputs
  content = content.replace(/bg-slate-800\/50 border-slate-700 text-white placeholder:text-slate-500/g, 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400');
  
  // Revert buttons
  content = content.replace(/bg-white text-slate-900 hover:bg-slate-100/g, 'bg-slate-900 text-white hover:bg-slate-800');
  content = content.replace(/shadow-\[0_4px_14px_0_rgb\(255,255,255,0\.1\)\]/g, 'shadow-[0_4px_14px_0_rgb(0,0,0,0.1)]');
  
  fs.writeFileSync(file, content);
}

convertToLightGlass('src/app/login/page.tsx');
convertToLightGlass('src/app/register/page.tsx');
