const fs = require('fs');

let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

code = code.replace(
  'const [fetching, setFetching] = useState(true);',
  'const [fetching, setFetching] = useState(true);\n  const [selectedDomain, setSelectedDomain] = useState("All");'
);

code = code.replace(
  '{isDemoMode && <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full font-bold border border-orange-500/30">DEMO MODE</span>}\n        </div>',
  '{isDemoMode && <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full font-bold border border-orange-500/30">DEMO MODE</span>}\n        </div>\n\n        {/* Intent / Domain Selector */}\n        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 custom-scrollbar px-2 -mx-2">\n          {["All", "Dating 💖", "Study Buddies 📚", "Networking 💼", "Just Friends ✌️"].map(domain => (\n            <button \n               key={domain}\n               onClick={() => {\n                 setSelectedDomain(domain);\n                 setProfiles(prev => [...prev].sort(() => Math.random() - 0.5));\n               }}\n               className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${selectedDomain === domain ? \'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]\' : \'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/5\'}`}\n            >\n              {domain}\n            </button>\n          ))}\n        </div>'
);

fs.writeFileSync('src/app/feed/page.tsx', code);
