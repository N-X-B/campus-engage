const fs = require('fs');

let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

// 1. Add the INTEREST_GROUPS constant at the top
const importsMatch = "import { Navigation } from '@/components/Navigation';";
const interestsData = `
const INTEREST_GROUPS = {
  "Academics 📚": ["Study Group", "Library Grind", "Tech & Hackathons", "Startup Building"],
  "Social & Nightlife 🪩": ["Greek Life", "Bar Crawls", "House Parties", "Cafe Hopping"],
  "Hobbies & Arts 🎨": ["Dance Crew", "Jam Sessions", "Gaming & Esports", "Photography"],
  "Sports & Fitness 💪": ["Gym Partners", "Intramural Sports", "Running / Hiking", "Yoga & Wellness"]
};
`;
code = code.replace(importsMatch, importsMatch + "\n" + interestsData);

// 2. Add state for editing interests
const stateMatch = "const [deleting, setDeleting] = useState(false);";
const stateReplace = `const [deleting, setDeleting] = useState(false);
  const [editingInterests, setEditingInterests] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  useEffect(() => {
    if (userData?.interests) {
      setSelectedInterests(userData.interests);
    }
  }, [userData]);
  
  const handleToggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      if (selectedInterests.length >= 3) {
        alert("You can only select up to 3 campus groups!");
        return;
      }
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const saveInterests = async () => {
    try {
      await updateDoc(doc(db, 'users', user!.uid), { interests: selectedInterests });
      setEditingInterests(false);
      setUserData({ ...userData, interests: selectedInterests });
    } catch (err) {
      console.error(err);
    }
  };
`;
code = code.replace(stateMatch, stateReplace);

// 3. Inject the UI right above Account Settings
const accountSettingsMatch = "{/* Account Settings */}\n        <motion.div";
const groupsUI = `{/* Campus Groups / Modes */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold text-xl">My Campus Groups</h3>
            <button 
               onClick={() => editingInterests ? saveInterests() : setEditingInterests(true)}
               className="text-sm font-bold text-indigo-400 hover:text-indigo-300"
            >
              {editingInterests ? "Save" : "Edit"}
            </button>
          </div>
          
          {!editingInterests ? (
             <div className="flex flex-wrap gap-2">
               {(userData?.interests || []).length > 0 ? (
                 (userData?.interests || []).map((int: string) => (
                   <span key={int} className="px-4 py-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full font-bold text-sm">
                     {int}
                   </span>
                 ))
               ) : (
                 <p className="text-zinc-500 text-sm">No groups selected. Add some vibes to your profile!</p>
               )}
             </div>
          ) : (
             <div className="space-y-6">
               <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-4">Select up to 3 groups:</p>
               {Object.entries(INTEREST_GROUPS).map(([category, tags]) => (
                 <div key={category}>
                   <h4 className="text-zinc-500 text-sm font-bold mb-3">{category}</h4>
                   <div className="flex flex-wrap gap-2">
                     {tags.map(tag => {
                       const isSelected = selectedInterests.includes(tag);
                       return (
                         <button
                           key={tag}
                           onClick={() => handleToggleInterest(tag)}
                           className={\`px-4 py-2 rounded-full font-bold text-sm transition-all \${isSelected ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border-transparent' : 'bg-black/50 text-zinc-400 border border-white/10 hover:border-white/30'}\`}
                         >
                           {tag}
                         </button>
                       );
                     })}
                   </div>
                 </div>
               ))}
             </div>
          )}
        </motion.div>

        {/* Account Settings */}
        <motion.div`;

code = code.replace(accountSettingsMatch, groupsUI);

fs.writeFileSync('src/app/profile/page.tsx', code);
