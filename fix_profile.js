const fs = require('fs');

let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

const regex = /<div className="grid grid-cols-2 gap-4 mb-8">[\s\S]*?<\/p>\n\n        <\/motion\.div>/;

const replacement = `<div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-black/50 border border-white/5 p-5 rounded-3xl">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Network Status</span>
                <span className="text-emerald-400 font-bold flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Connected
                </span>
             </div>
             <div className="bg-black/50 border border-white/5 p-5 rounded-3xl">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Matchability Score</span>
                <span className="text-white font-bold">94%</span>
             </div>
             <div className="bg-black/50 border border-white/5 p-5 rounded-3xl">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Discovery Mode</span>
                <span className="text-white font-bold">Campus Only</span>
             </div>
             <div className="bg-black/50 border border-white/5 p-5 rounded-3xl">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Incognito Mode</span>
                <span className="text-zinc-500 font-bold flex items-center gap-2">
                   <div className="w-10 h-6 bg-zinc-800 rounded-full border border-white/10 relative">
                     <div className="w-4 h-4 bg-zinc-600 rounded-full absolute left-1 top-0.5"></div>
                   </div>
                   Off
                </span>
             </div>
          </div>

          <button 
             onClick={copyInviteLink}
             className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
          >
             🔗 Invite Friends
          </button>
          <p className="text-center text-xs text-zinc-500 mt-4 font-medium px-4">
             Unlock unlimited messaging by referring 5 friends to the network.
          </p>

        </motion.div>
        
        {/* Account Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 mb-8"
        >
          <h3 className="text-white font-bold text-xl mb-6">Account Settings</h3>
          <div className="space-y-4">
             <button className="w-full flex justify-between items-center bg-black/50 border border-white/5 p-5 rounded-2xl text-white hover:bg-white/5 transition-colors">
                <span className="font-medium">Edit Profile Answers</span>
                <span className="text-zinc-500">→</span>
             </button>
             <button className="w-full flex justify-between items-center bg-black/50 border border-white/5 p-5 rounded-2xl text-white hover:bg-white/5 transition-colors">
                <span className="font-medium">Manage Photos</span>
                <span className="text-zinc-500">→</span>
             </button>
             <button 
                onClick={handleDeleteAccount}
                className="w-full flex justify-between items-center bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl text-rose-500 hover:bg-rose-500/20 transition-colors"
             >
                <span className="font-bold">Delete Account</span>
                <span>⚠️</span>
             </button>
          </div>
        </motion.div>

        {/* Support Developers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-indigo-500/20 rounded-[2.5rem] p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/5 -z-10" />
          <div className="text-center">
             <div className="text-4xl mb-4">☕️</div>
             <h3 className="text-white font-bold text-xl mb-2">Support the Developers</h3>
             <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
               CampusEngage is built and maintained by students. If you found your perfect match or just love the vibes, buy us a coffee to keep the servers running!
             </p>
             <a 
               href="https://buymeacoffee.com/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-block w-full bg-[#FFDD00] text-black py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,221,0,0.2)]"
             >
                Buy me a coffee
             </a>
          </div>
        </motion.div>
`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/app/profile/page.tsx', code);
