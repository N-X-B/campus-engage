const fs = require('fs');

let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

// 1. Add state for incognito and edit profile modal
const stateMatch = "const [selectedInterests, setSelectedInterests] = useState<string[]>([]);";
const stateReplace = `const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isIncognito, setIsIncognito] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  useEffect(() => {
    if (userData) {
       setIsIncognito(userData.incognito || false);
    }
  }, [userData]);

  const toggleIncognito = async () => {
    const newValue = !isIncognito;
    setIsIncognito(newValue);
    try {
       await updateDoc(doc(db, 'users', user!.uid), { incognito: newValue });
       setUserData({ ...userData, incognito: newValue });
    } catch(err) {
       console.error("Failed to toggle incognito", err);
    }
  };
`;
code = code.replace(stateMatch, stateReplace);

// 2. Make Incognito Toggle Functional & Add Confessions Button
const incognitoMatch = /<div className="bg-black\/50 border border-white\/5 p-5 rounded-3xl">[\s\S]*?Incognito Mode[\s\S]*?<\/div>/;
const incognitoReplace = `<div className="bg-black/50 border border-white/5 p-5 rounded-3xl flex flex-col justify-between cursor-pointer" onClick={toggleIncognito}>
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Incognito Mode</span>
                <span className={\`font-bold flex items-center gap-2 \${isIncognito ? 'text-indigo-400' : 'text-zinc-500'}\`}>
                   <div className={\`w-10 h-6 rounded-full border relative transition-colors \${isIncognito ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-zinc-800 border-white/10'}\`}>
                     <motion.div 
                        animate={{ left: isIncognito ? '1.2rem' : '0.25rem' }} 
                        className={\`w-4 h-4 rounded-full absolute top-0.5 \${isIncognito ? 'bg-indigo-400' : 'bg-zinc-600'}\`} 
                     />
                   </div>
                   {isIncognito ? 'On' : 'Off'}
                </span>
             </div>`;
code = code.replace(incognitoMatch, incognitoReplace);

// 3. Render Confessions button if Incognito is ON (above the Account Settings)
const accSettingsTitle = `<h3 className="text-white font-bold text-xl mb-6">Account Settings</h3>`;
const confessionsBtn = `
          <AnimatePresence>
            {isIncognito && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div onClick={() => router.push('/confessions')} className="w-full bg-indigo-900/30 border border-indigo-500/50 p-5 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-indigo-900/50 transition-colors">
                  <div>
                    <h4 className="text-indigo-300 font-bold flex items-center gap-2">🎭 Anonymous Confessions</h4>
                    <p className="text-xs text-indigo-400/70 mt-1">Unlocked via Incognito Mode</p>
                  </div>
                  <span className="text-indigo-400">→</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <h3 className="text-white font-bold text-xl mb-6">Account Settings</h3>
`;
code = code.replace(accSettingsTitle, confessionsBtn);

// 4. Link Edit Profile and Manage Photos to Onboarding or Modals
// Let's just route them to `/onboarding` so they can edit their profile there.
const editAnswersBtn = `<button className="w-full flex justify-between items-center bg-black/50 border border-white/5 p-5 rounded-2xl text-white hover:bg-white/5 transition-colors">
                <span className="font-medium">Edit Profile Answers</span>`;
const editAnswersReplace = `<button onClick={() => router.push('/onboarding')} className="w-full flex justify-between items-center bg-black/50 border border-white/5 p-5 rounded-2xl text-white hover:bg-white/5 transition-colors">
                <span className="font-medium">Edit Profile Answers</span>`;
code = code.replace(editAnswersBtn, editAnswersReplace);

const managePhotosBtn = `<button className="w-full flex justify-between items-center bg-black/50 border border-white/5 p-5 rounded-2xl text-white hover:bg-white/5 transition-colors">
                <span className="font-medium">Manage Photos</span>`;
const managePhotosReplace = `<button onClick={() => router.push('/onboarding')} className="w-full flex justify-between items-center bg-black/50 border border-white/5 p-5 rounded-2xl text-white hover:bg-white/5 transition-colors">
                <span className="font-medium">Manage Photos</span>`;
code = code.replace(managePhotosBtn, managePhotosReplace);


fs.writeFileSync('src/app/profile/page.tsx', code);
