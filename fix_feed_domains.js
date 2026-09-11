const fs = require('fs');

let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

// Add state for selectedDomain
const stateTarget = /const \[fetching, setFetching\] = useState\(true\);/;
const stateReplacement = `const [fetching, setFetching] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState("All");`;
code = code.replace(stateTarget, stateReplacement);

// Add the domain selector UI
const uiTarget = /<div className="flex justify-between items-end mb-8 px-2">[\s\S]*?<\/div>/;
const uiReplacement = `<div className="flex justify-between items-end mb-4 px-2">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Daily Batch</h1>
            <p className="text-zinc-400 mt-1">Curated picks, refreshing at midnight.</p>
          </div>
          {isDemoMode && <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full font-bold border border-orange-500/30">DEMO MODE</span>}
        </div>

        {/* Intent / Domain Selector */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 custom-scrollbar px-2">
          {["All", "Dating 💖", "Study Buddies 📚", "Networking 💼", "Just Friends ✌️"].map(domain => (
            <button 
               key={domain}
               onClick={() => {
                 setSelectedDomain(domain);
                 // Simulate algorithm recalculation by slightly shuffling the deck
                 setProfiles(prev => [...prev].sort(() => Math.random() - 0.5));
               }}
               className={\`whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-all shadow-sm \${selectedDomain === domain ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/5'}\`}
            >
              {domain}
            </button>
          ))}
        </div>`;

code = code.replace(uiTarget, uiReplacement);

fs.writeFileSync('src/app/feed/page.tsx', code);
