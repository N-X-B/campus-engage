const fs = require('fs');
let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

const target = `        {/* Account Settings */}`;

const pollUI = `        {/* Native App Poll Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl mb-8 relative overflow-hidden group"
        >
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
        </motion.div>

        {/* Account Settings */}`;

if (!code.includes("Want a Native App?")) {
  code = code.replace(target, pollUI);
  fs.writeFileSync('src/app/profile/page.tsx', code);
  console.log("Successfully injected Poll UI.");
} else {
  console.log("Poll UI already exists!");
}
