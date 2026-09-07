const fs = require('fs');
let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

code = code.replace(
  `  const sendIcebreakerMessage = async () => {
    if (!user || !selectedUser) return;
    if (isDemoMode) {
      const convId = \`conv-\${selectedUser.id}\`;
      demoDb.sendMessage(convId, selectedPrompt, user.uid, user.displayName || 'Unknown');
      router.push(\`/chat/\${convId}\`);
      return;
    }
    try {
       router.push(\`/chat/\${selectedUser.id}\`);
    } catch(e) {}
  };`,
  `  const sendIcebreakerMessage = async () => {
    if (!user || !selectedUser) return;
    if (isDemoMode) {
      const convId = \`conv-\${selectedUser.id}\`;
      demoDb.sendMessage(convId, selectedPrompt, user.uid, user.displayName || 'Unknown');
      router.push(\`/chat/\${convId}\`);
      return;
    }
    try {
      const { doc, setDoc, addDoc, collection } = require('firebase/firestore');
      const convId = [user.uid, selectedUser.id].sort().join('_');
      
      // Initialize conversation document
      await setDoc(doc(db, 'conversations', convId), {
         participants: [user.uid, selectedUser.id],
         lastMessage: selectedPrompt,
         lastUpdated: Date.now()
      }, { merge: true });

      // Add the message
      await addDoc(collection(db, \`conversations/\${convId}/messages\`), {
         text: selectedPrompt,
         senderId: user.uid,
         senderName: user.displayName || 'Anonymous',
         timestamp: Date.now()
      });

      router.push(\`/chat/\${convId}\`);
    } catch(e) {
      console.error(e);
    }
  };`
);

fs.writeFileSync('src/app/feed/page.tsx', code);
