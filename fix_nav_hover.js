const fs = require('fs');
let code = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

const targetDesktop = `className={\`text-sm font-bold tracking-widest uppercase transition-all \${
                pathname === item.path 
                  ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' 
                  : 'text-zinc-500 hover:text-white'
              }\`}`;

const replaceDesktop = `className={\`text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:-translate-y-1 \${
                pathname === item.path 
                  ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]' 
                  : 'text-zinc-500 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
              }\`}`;

const targetMobile = `className={\`text-[10px] font-bold tracking-widest uppercase transition-all flex flex-col items-center gap-1 \${
              pathname === item.path 
                ? 'text-white' 
                : 'text-zinc-600'
            }\`}`;

const replaceMobile = `className={\`text-[10px] font-bold tracking-widest uppercase transition-all duration-300 flex flex-col items-center gap-1 hover:-translate-y-1 hover:text-white \${
              pathname === item.path 
                ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                : 'text-zinc-600'
            }\`}`;

code = code.replace(targetDesktop, replaceDesktop);
code = code.replace(targetMobile, replaceMobile);

fs.writeFileSync('src/components/Navigation.tsx', code);
