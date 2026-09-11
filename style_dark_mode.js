const fs = require('fs');

function convertToDarkGlass(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Base background
  content = content.replace(/bg-slate-50(?!0)/g, 'bg-slate-950');
  
  // Add AnimatedBackground import and component
  if (!content.includes('AnimatedBackground')) {
    content = content.replace(/import \{ motion/g, "import { AnimatedBackground } from '@/components/AnimatedBackground';\nimport { motion");
    content = content.replace(/(<div className="flex flex-col min-h-\[100dvh\][^"]*"[^>]*>)/, "$1\n      <AnimatedBackground />");
  }
  
  // Card
  content = content.replace(/bg-white rounded-3xl shadow-xl shadow-slate-200\/50 border border-slate-100/g, 'bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10');
  
  // Text colors
  content = content.replace(/text-slate-900/g, 'text-white');
  content = content.replace(/text-slate-500/g, 'text-slate-400');
  content = content.replace(/text-slate-600/g, 'text-slate-300');
  
  // Inputs (might not have explicit classes if using components, let's check)
  
  fs.writeFileSync(file, content);
}

convertToDarkGlass('src/app/login/page.tsx');
convertToDarkGlass('src/app/register/page.tsx');
