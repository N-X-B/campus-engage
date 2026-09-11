const fs = require('fs');
let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

// 1. Add new state for the sending transition
code = code.replace("const [promptOptions, setPromptOptions] = useState<string[]>([]);", "const [promptOptions, setPromptOptions] = useState<string[]>([]);\n  const [sendingPrompt, setSendingPrompt] = useState<string | null>(null);\n  const [sentSuccess, setSentSuccess] = useState(false);");

// 2. Modify handleBreakIceClick to make the transition snappier (300ms instead of 400ms)
code = code.replace("}, 400);", "}, 300);");

// 3. Rewrite sendIcebreakerMessage
const oldSend = `const sendIcebreakerMessage = async (promptToSend: string) => {
    if (!user || !selectedUser) return;
    
    // In Demo Mode, just behave normally
    if (isDemoMode) {
      alert("Icebreaker sent! (Demo Mode)");
      setIcebreakerModal(false);
      return;
    }

    try {
      const convId = [user.uid, selectedUser.id].sort().join('_');
      
      // We create a conversation document but mark it as pending
      // and we store the prompt so the receiver can see it before accepting.
      await setDoc(doc(db, 'conversations', convId), {
         participants: [user.uid, selectedUser.id],
         status: 'pending',
         senderId: user.uid,
         receiverId: selectedUser.id,
         icebreakerPrompt: promptToSend,
         lastUpdated: Date.now()
      }, { merge: true });

      alert("Invitation sent! You can chat once they accept your Icebreaker.");
      setIcebreakerModal(false);
      
      // Remove them from the feed locally so we don't see them again
      setProfiles(prev => prev.filter(p => p.id !== selectedUser.id));
      
    } catch(e) {
      console.error(e);
      alert("Failed to send invitation.");
    }
  };`;

const newSend = `const sendIcebreakerMessage = (promptToSend: string) => {
    if (!user || !selectedUser) return;
    
    // Optimistic UI updates
    setSendingPrompt(promptToSend);
    
    setTimeout(() => {
      setSentSuccess(true);
      setTimeout(() => {
         setIcebreakerModal(false);
         setSendingPrompt(null);
         setSentSuccess(false);
         setProfiles(prev => prev.filter(p => p.id !== selectedUser.id));
      }, 1000);
    }, 400); // Tiny fake delay to feel the button click

    if (isDemoMode) return;

    // Fire-and-forget network request to eliminate lag
    const convId = [user.uid, selectedUser.id].sort().join('_');
    setDoc(doc(db, 'conversations', convId), {
       participants: [user.uid, selectedUser.id],
       status: 'pending',
       senderId: user.uid,
       receiverId: selectedUser.id,
       icebreakerPrompt: promptToSend,
       lastUpdated: Date.now()
    }, { merge: true }).catch(e => {
       console.error("Failed to send icebreaker in background", e);
    });
  };`;
code = code.replace(oldSend, newSend);

// 4. Update the modal render logic
const oldModalRender = `              <div className="space-y-3 mb-8">
                {promptOptions.map((prompt, i) => (
                  <button 
                    key={i}
                    onClick={() => sendIcebreakerMessage(prompt)}
                    className="w-full text-left p-4 bg-zinc-800/50 hover:bg-white hover:text-black border border-zinc-700/50 rounded-2xl text-zinc-300 transition-all font-medium text-lg shadow-sm"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
              <button onClick={() => {
                const shuffled = [...ICEBREAKERS].sort(() => 0.5 - Math.random());
                setPromptOptions(shuffled.slice(0, 3));
              }} className="w-full py-3 text-sm text-zinc-500 font-bold hover:text-white transition uppercase tracking-widest bg-zinc-800/30 rounded-xl">
                🎲 Shuffle Options
              </button>`;

const newModalRender = `              <div className="space-y-3 mb-8">
                {promptOptions.map((prompt, i) => {
                  const isThisSending = sendingPrompt === prompt;
                  const isAnotherSending = sendingPrompt && sendingPrompt !== prompt;
                  
                  return (
                    <button 
                      key={i}
                      disabled={!!sendingPrompt}
                      onClick={() => sendIcebreakerMessage(prompt)}
                      className={\`w-full text-left p-4 rounded-2xl transition-all font-medium text-lg shadow-sm border \${
                        isThisSending 
                          ? (sentSuccess ? 'bg-green-500 text-white border-green-400 scale-[1.02]' : 'bg-white text-black border-white scale-[1.02]')
                          : isAnotherSending 
                            ? 'bg-zinc-800/20 text-zinc-600 border-zinc-800/50 opacity-50 scale-95' 
                            : 'bg-zinc-800/50 hover:bg-white hover:text-black border-zinc-700/50 text-zinc-300'
                      }\`}
                    >
                      {isThisSending && sentSuccess ? "Sent! 🧊" : \`"\${prompt}"\`}
                    </button>
                  );
                })}
              </div>
              {!sendingPrompt && (
                <button onClick={() => {
                  const shuffled = [...ICEBREAKERS].sort(() => 0.5 - Math.random());
                  setPromptOptions(shuffled.slice(0, 3));
                }} className="w-full py-3 text-sm text-zinc-500 font-bold hover:text-white transition uppercase tracking-widest bg-zinc-800/30 rounded-xl">
                  🎲 Shuffle Options
                </button>
              )}`;

code = code.replace(oldModalRender, newModalRender);

// Also reset state when modal is manually closed via the 'X' button
code = code.replace("onClick={() => setIcebreakerModal(false)}", "onClick={() => { setIcebreakerModal(false); setSendingPrompt(null); setSentSuccess(false); }}");

fs.writeFileSync('src/app/feed/page.tsx', code);
