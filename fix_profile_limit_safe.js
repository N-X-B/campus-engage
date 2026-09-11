const fs = require('fs');

let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

// 1. Change the alert to a local error state
code = code.replace(
  'const [editingInterests, setEditingInterests] = useState(false);',
  'const [editingInterests, setEditingInterests] = useState(false);\n  const [interestError, setInterestError] = useState("");'
);

// 2. Safely replace handleToggleInterest
const toggleOld = `  const handleToggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      if (selectedInterests.length >= 3) {
        alert("You can only select up to 3 campus groups!");
        return;
      }
      setSelectedInterests(prev => [...prev, interest]);
    }
  };`;

const toggleNew = `  const handleToggleInterest = (interest: string) => {
    setInterestError("");
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      if (selectedInterests.length >= 3) {
        setInterestError("You can only select up to 3 campus groups!");
        return;
      }
      setSelectedInterests(prev => [...prev, interest]);
    }
  };`;

code = code.replace(toggleOld, toggleNew);

// 3. Inject the inline error message
const limitTitleOld = `<p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-4">Select up to 3 groups:</p>`;
const limitTitleNew = `<p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-2">Select up to 3 groups:</p>
               {interestError && <p className="text-rose-400 text-sm font-bold mb-4">{interestError}</p>}
               {selectedInterests.length >= 3 && !interestError && <p className="text-emerald-400 text-sm font-bold mb-4">You've reached the 3 group limit!</p>}`;
code = code.replace(limitTitleOld, limitTitleNew);

// 4. Disable buttons if limit reached
const buttonCodeOld = `onClick={() => handleToggleInterest(tag)}
                           className={\`px-4 py-2 rounded-full font-bold text-sm transition-all \${isSelected ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border-transparent' : 'bg-black/50 text-zinc-400 border border-white/10 hover:border-white/30'}\`}`;

const buttonCodeNew = `onClick={() => handleToggleInterest(tag)}
                           disabled={!isSelected && selectedInterests.length >= 3}
                           className={\`px-4 py-2 rounded-full font-bold text-sm transition-all \${isSelected ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border-transparent' : (!isSelected && selectedInterests.length >= 3) ? 'bg-black/20 text-zinc-600 border border-white/5 cursor-not-allowed' : 'bg-black/50 text-zinc-400 border border-white/10 hover:border-white/30'}\`}`;

code = code.replace(buttonCodeOld, buttonCodeNew);

fs.writeFileSync('src/app/profile/page.tsx', code);
