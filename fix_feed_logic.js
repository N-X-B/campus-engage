const fs = require('fs');

let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

// 1. Fix Icebreaker limit to 7
code = code.replace(/sentToday >= 3/g, 'sentToday >= 7');
code = code.replace(/icebreakersSentToday < 3/g, 'icebreakersSentToday < 7'); // if it exists anywhere else

// 2. Modify sendIcebreakerMessage to create a PENDING request
const oldSendIcebreaker = `  const sendIcebreakerMessage = async (promptToSend: string) => {
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

const newSendIcebreaker = `  const sendIcebreakerMessage = async (promptToSend: string) => {
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

code = code.replace(oldSendIcebreaker, newSendIcebreaker);

fs.writeFileSync('src/app/feed/page.tsx', code);
