const fs = require('fs');

let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

// The function is at line ~142
// Let's replace the whole function using regex
const funcRegex = /const sendIcebreakerMessage = async \(\) => \{[\s\S]*?catch\(e\) \{\n      console\.error\(e\);\n    \}\n  \};/;

const newFunc = `const sendIcebreakerMessage = async (promptToSend: string) => {
    if (!user || !selectedUser) return;
    if (isDemoMode) {
      const convId = \`conv-\${selectedUser.id}\`;
      demoDb.sendMessage(convId, promptToSend, user.uid, user.displayName || 'Unknown');
      router.push(\`/chat/\${convId}\`);
      return;
    }
    try {
      const convId = [user.uid, selectedUser.id].sort().join('_');
      await setDoc(doc(db, 'conversations', convId), {
         participants: [user.uid, selectedUser.id],
         lastMessage: promptToSend,
         lastUpdated: Date.now()
      }, { merge: true });

      await addDoc(collection(db, \`conversations/\${convId}/messages\`), {
         text: promptToSend,
         senderId: user.uid,
         senderName: user.displayName || 'Anonymous',
         timestamp: Date.now()
      });

      router.push(\`/chat/\${convId}\`);
    } catch(e) {
      console.error(e);
    }
  };`;

code = code.replace(funcRegex, newFunc);

// Now let's replace the Modal UI
const modalRegex = /<div className="bg-indigo-500\/10 border border-indigo-500\/20 p-6 rounded-2xl mb-8 relative">[\s\S]*?<\/button>\n              <\/div>\n              <button onClick=\{sendIcebreakerMessage\}[^>]*>\n                Send & Open Chat\n              <\/button>/;

const newModalUI = `<div className="space-y-3 mb-8">
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

code = code.replace(modalRegex, newModalUI);

// Fix the onClick on the profile card Break the Ice button
// <button onClick={() => { setSelectedProfileForBrief(null); openIcebreaker(selectedProfileForBrief); }}
// We also need to fix the main feed card Break the Ice button
// onClick={() => openIcebreaker(p)} -> onClick={(e) => { e.stopPropagation(); openIcebreaker(p); }}
code = code.replace(/onClick=\{\(\) => openIcebreaker\(p\)\}/g, "onClick={(e) => { e.stopPropagation(); openIcebreaker(p); }}");

fs.writeFileSync('src/app/feed/page.tsx', code);
