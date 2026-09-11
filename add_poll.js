const fs = require('fs');

let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

// 1. Add required imports if missing
if (!code.includes("arrayUnion")) {
  code = code.replace("updateDoc,", "updateDoc, arrayUnion, setDoc, getDoc,");
}

// 2. Add state variables for the poll
const stateInjection = `  const [interestError, setInterestError] = useState("");
  const [appVotes, setAppVotes] = useState<string[]>([]);
  const [isVoting, setIsVoting] = useState(false);`;

code = code.replace(`  const [interestError, setInterestError] = useState("");`, stateInjection);

// 3. Add useEffect to fetch poll data
const pollEffect = `  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const pollDoc = await getDoc(doc(db, 'polls', 'app_demand'));
        if (pollDoc.exists()) {
           setAppVotes(pollDoc.data().voted_uids || []);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchPoll();
  }, []);

  const handleVoteApp = async () => {
    if (!user || appVotes.includes(user.uid)) return;
    setIsVoting(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([30, 60, 40]);
    try {
      const pollRef = doc(db, 'polls', 'app_demand');
      const pollDoc = await getDoc(pollRef);
      if (!pollDoc.exists()) {
        await setDoc(pollRef, { voted_uids: [user.uid] });
      } else {
        await updateDoc(pollRef, { voted_uids: arrayUnion(user.uid) });
      }
      setAppVotes(prev => [...prev, user.uid]);
    } catch (e) {
      console.error(e);
    }
    setIsVoting(false);
  };`;

code = code.replace(`  const handleToggleInterest = (interest: string) => {`, pollEffect + `\n\n  const handleToggleInterest = (interest: string) => {`);

// 4. Inject the Poll UI card into the Profile Page
const uiInjection = `          {/* Native App Poll Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl mb-6 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="relative z-10">
               <h2 className="text-xl font-bold text-white mb-2">Want a Native App? 📱</h2>
               <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                 We are currently running on the web. If you want us to build an official iOS and Android app, cast your vote below!
               </p>
               
               <div className="flex items-center justify-between gap-4">
                 <button 
                   onClick={handleVoteApp}
                   disabled={appVotes.includes(user?.uid || '') || isVoting}
                   className={\`flex-1 py-3 rounded-xl font-bold text-sm transition-all shadow-md \${
                     appVotes.includes(user?.uid || '') 
                       ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                       : 'bg-white text-black hover:scale-[1.02] active:scale-95'
                   }\`}
                 >
                   {isVoting ? 'Voting...' : appVotes.includes(user?.uid || '') ? '✓ Voted' : 'Vote for Native App'}
                 </button>
                 
                 <div className="bg-black/50 border border-white/10 px-4 py-3 rounded-xl flex flex-col items-center justify-center min-w-[80px]">
                   <span className="text-xl font-black text-white">{appVotes.length}</span>
                   <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Votes</span>
                 </div>
               </div>
             </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl relative">`;

code = code.replace(`          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl relative">`, uiInjection);

fs.writeFileSync('src/app/profile/page.tsx', code);
