const fs = require('fs');
let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

// 1. Add useState, useEffect imports if needed
if (!code.includes('useState')) {
  code = code.replace(/import \{ useAuth \} from '@\/lib\/AuthContext';/, "import { useState, useEffect } from 'react';\nimport { useAuth } from '@/lib/AuthContext';");
}
if (!code.includes('getDoc')) {
  code = code.replace(/import \{ doc, deleteDoc \} from 'firebase\/firestore';/, "import { doc, deleteDoc, getDoc } from 'firebase/firestore';");
}

// 2. Add userData state and fetch logic
const componentStart = `export default function ProfilePage() {\n  const { user, loading } = useAuth();`;
const stateCode = `export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (user && !isDemoMode) {
      getDoc(doc(db, 'users', user.uid)).then(d => {
        if (d.exists()) setUserData(d.data());
      });
    }
  }, [user]);`;
code = code.replace(componentStart, stateCode);

// 3. Update Profile UI to show referral progress
const inviteCodeRegex = /<button \n             onClick=\{copyInviteLink\}[\s\S]*?5 friends to the network\.\n          <\/p>/;
const newInviteUI = `
          {/* Referral Progress UI */}
          <div className="bg-black/50 border border-white/5 p-6 rounded-3xl mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[50px] -z-10" />
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              🏆 Network Expansion
              {(userData?.referralCount || 0) >= 5 && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full uppercase tracking-widest font-black ml-auto">UNLOCKED</span>}
            </h3>
            
            <div className="flex gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={\`h-3 flex-1 rounded-full transition-all \${i < (userData?.referralCount || 0) ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/10'}\`} />
              ))}
            </div>
            
            <div className="flex justify-between items-center text-xs font-medium text-zinc-400 mb-6">
              <span>{userData?.referralCount || 0} / 5 Friends Referred</span>
              <span>{(userData?.referralCount || 0) >= 5 ? 'Unlimited Messaging Active' : 'Unlock Unlimited Messaging'}</span>
            </div>

            <button 
               onClick={copyInviteLink}
               className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
            >
               🔗 Copy Invite Link
            </button>
          </div>
`;
code = code.replace(inviteCodeRegex, newInviteUI);

fs.writeFileSync('src/app/profile/page.tsx', code);
