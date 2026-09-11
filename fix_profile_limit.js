const fs = require('fs');

let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

// Replace the alert with a local error state
const stateMatch = "const [editingInterests, setEditingInterests] = useState(false);";
const stateReplace = `const [editingInterests, setEditingInterests] = useState(false);
  const [interestError, setInterestError] = useState("");`;

code = code.replace(stateMatch, stateReplace);

// Update handleToggleInterest
const handleToggleTarget = /const handleToggleInterest = \([\s\S]*?setSelectedInterests\(prev => \[\.\.\.prev, interest\]\);\n    \}\n  \};/;
const handleToggleReplace = `const handleToggleInterest = (interest: string) => {
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

code = code.replace(handleToggleTarget, handleToggleReplace);

// Update UI to show error and disable buttons
const uiTarget = /<p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-4">Select up to 3 groups:<\/p>/;
const uiReplace = `<p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-2">Select up to 3 groups:</p>
               {interestError && <p className="text-rose-400 text-sm font-bold mb-4">{interestError}</p>}
               {selectedInterests.length >= 3 && !interestError && <p className="text-emerald-400 text-sm font-bold mb-4">You've reached the 3 group limit!</p>}`;

code = code.replace(uiTarget, uiReplace);

const buttonTarget = /onClick=\{\(\) => handleToggleInterest\(tag\)\}\n                           className=\{/g;
const buttonReplace = `onClick={() => handleToggleInterest(tag)}\n                           disabled={!isSelected && selectedInterests.length >= 3}\n                           className={`;

code = code.replace(buttonTarget, buttonReplace);

// Add opacity to disabled buttons
const classTarget = /'bg-black\/50 text-zinc-400 border border-white\/10 hover:border-white\/30'\}\`/g;
const classReplace = `(!isSelected && selectedInterests.length >= 3) ? 'bg-black/20 text-zinc-600 border border-white/5 cursor-not-allowed' : 'bg-black/50 text-zinc-400 border border-white/10 hover:border-white/30'}\``;

code = code.replace(classTarget, classReplace);


fs.writeFileSync('src/app/profile/page.tsx', code);
