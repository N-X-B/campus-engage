const fs = require('fs');

let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

// 1. Define INTEREST_GROUPS
const importsMatch = "import { collection, query, where, getDocs, updateDoc, doc, arrayUnion, addDoc } from 'firebase/firestore';";
const interestsData = `
const INTEREST_GROUPS = {
  "Academics 📚": ["Study Group", "Library Grind", "Tech & Hackathons", "Startup Building"],
  "Social & Nightlife 🪩": ["Greek Life", "Bar Crawls", "House Parties", "Cafe Hopping"],
  "Hobbies & Arts 🎨": ["Dance Crew", "Jam Sessions", "Gaming & Esports", "Photography"],
  "Sports & Fitness 💪": ["Gym Partners", "Intramural Sports", "Running / Hiking", "Yoga & Wellness"]
};
`;
code = code.replace(importsMatch, importsMatch + "\n" + interestsData);

// 2. Add state
const stateMatch = 'const [selectedDomain, setSelectedDomain] = useState("All");';
const stateReplace = `const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterError, setFilterError] = useState("");
  // Keep all fetched profiles to filter locally
  const [allFetchedProfiles, setAllFetchedProfiles] = useState<any[]>([]);`;
code = code.replace(stateMatch, stateReplace);

// 3. Update fetchProfiles to store in allFetchedProfiles
const fetchMatch = `const profilesList: any[] = [];
      querySnapshot.forEach(doc => {
         const d = doc.data();
         if (d.onboarded) {
           profilesList.push({ id: doc.id, ...d });
         }
      });
      
      const ranked = runMatchAlgorithm(user, docSnap.data(), profilesList);
      setProfiles(ranked);`;

const fetchReplace = `const profilesList: any[] = [];
      querySnapshot.forEach(doc => {
         const d = doc.data();
         if (d.onboarded) {
           profilesList.push({ id: doc.id, ...d });
         }
      });
      
      const ranked = runMatchAlgorithm(user, docSnap.data(), profilesList);
      setAllFetchedProfiles(ranked);
      setProfiles(ranked);`;
code = code.replace(fetchMatch, fetchReplace);

// 4. Update the effect to filter profiles when selectedFilters changes
const effectInsertion = `
  useEffect(() => {
    if (selectedFilters.length === 0) {
      setProfiles(allFetchedProfiles);
      return;
    }
    const filtered = allFetchedProfiles.filter(p => {
      if (!p.interests || !Array.isArray(p.interests)) return false;
      return selectedFilters.some(filter => p.interests.includes(filter));
    });
    setProfiles(filtered);
  }, [selectedFilters, allFetchedProfiles]);
`;
const insertionPoint = "const handleBreakIceClick = (e: any, p: any, isModal: boolean = false) => {";
code = code.replace(insertionPoint, effectInsertion + "\n  " + insertionPoint);

// 5. Build the UI
const topRowMatch = /<div className="flex gap-2 overflow-x-auto pb-4 mb-4 custom-scrollbar px-2 -mx-2">[\s\S]*?<\/div>/;
const topRowReplace = `<div className="flex flex-wrap gap-2 mb-6">
          <button 
             onClick={() => setShowFilterModal(true)}
             className="px-4 py-2 rounded-full font-bold text-sm transition-all bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-2"
          >
             <span className="text-lg">🎯</span> Filter Vibes {selectedFilters.length > 0 && \`(\${selectedFilters.length}/5)\`}
          </button>
          
          {selectedFilters.length === 0 && (
             <span className="px-4 py-2 rounded-full font-bold text-sm bg-white text-black shadow-sm">
               All Campus
             </span>
          )}

          {selectedFilters.map(filter => (
             <button 
               key={filter}
               onClick={() => setSelectedFilters(prev => prev.filter(f => f !== filter))}
               className="px-4 py-2 rounded-full font-bold text-sm bg-zinc-800 text-white border border-white/10 hover:border-rose-500/50 hover:text-rose-400 transition-colors flex items-center gap-2 group"
             >
               {filter}
               <span className="text-zinc-500 group-hover:text-rose-400 transition-colors">✕</span>
             </button>
          ))}
        </div>`;
code = code.replace(topRowMatch, topRowReplace);

// 6. Build the Filter Modal Overlay
const modalInjectionPoint = "{/* Profile Brief Modal Overlay */}";
const filterModalCode = `
      {/* Vibe Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-zinc-900 rounded-[2rem] border border-white/10 overflow-hidden max-w-md w-full shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                 <div>
                   <h2 className="text-xl font-bold text-white mb-1">Filter by Campus Groups</h2>
                   <p className="text-xs text-zinc-400">Select up to 5 groups to match with.</p>
                 </div>
                 <button onClick={() => setShowFilterModal(false)} className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-white hover:bg-zinc-700 transition-colors">✕</button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                {filterError && <p className="text-rose-400 text-sm font-bold bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">{filterError}</p>}
                
                {Object.entries(INTEREST_GROUPS).map(([category, tags]) => (
                  <div key={category}>
                    <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => {
                        const isSelected = selectedFilters.includes(tag);
                        const atLimit = selectedFilters.length >= 5;
                        const disabled = !isSelected && atLimit;
                        
                        return (
                          <button
                            key={tag}
                            disabled={disabled}
                            onClick={() => {
                               setFilterError("");
                               if (isSelected) {
                                 setSelectedFilters(prev => prev.filter(f => f !== tag));
                               } else {
                                 if (atLimit) {
                                   setFilterError("You can only select up to 5 campus groups to filter by!");
                                   return;
                                 }
                                 setSelectedFilters(prev => [...prev, tag]);
                               }
                            }}
                            className={\`px-4 py-2 rounded-full font-bold text-sm transition-all \${
                               isSelected 
                                 ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border-transparent' 
                                 : disabled 
                                    ? 'bg-black/20 text-zinc-600 border border-white/5 cursor-not-allowed' 
                                    : 'bg-black/50 text-zinc-400 border border-white/10 hover:border-white/30'
                            }\`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-white/5 bg-black/20 shrink-0">
                 <button 
                   onClick={() => setShowFilterModal(false)}
                   className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition-colors shadow-lg"
                 >
                   Apply Filters
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Brief Modal Overlay */}
`;
code = code.replace(modalInjectionPoint, filterModalCode);

fs.writeFileSync('src/app/feed/page.tsx', code);
