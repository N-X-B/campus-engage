const fs = require('fs');

let code = fs.readFileSync('src/app/inbox/page.tsx', 'utf8');

// Modify wipeAllChats
const oldWipe = `  const wipeAllChats = async () => {
    if (!confirm("Are you sure you want to delete ALL your chats? This is irreversible.")) return;
    setIsWiping(true);
    try {
       for (const conv of conversations) {
          await deleteDoc(doc(db, 'conversations', conv.id));
       }
       alert("All chats wiped successfully.");
    } catch(err) {
       console.error("Failed to wipe", err);
    } finally {
       setIsWiping(false);
    }
  };`;

const newWipe = `  const wipeAllChats = async () => {
    if (!confirm("DEV OVERRIDE: Are you sure you want to nuke EVERY chat from ALL users?")) return;
    setIsWiping(true);
    try {
       // Fetch literally all conversations in the database
       const allConvs = await getDocs(collection(db, 'conversations'));
       for (const document of allConvs.docs) {
          await deleteDoc(doc(db, 'conversations', document.id));
       }
       alert("GLOBAL NUKE COMPLETE: All chats from all users have been erased.");
       setConversations([]);
    } catch(err) {
       console.error("Failed to global wipe", err);
       alert("Failed to wipe all. You might have security rules blocking it. Check console.");
    } finally {
       setIsWiping(false);
    }
  };`;

code = code.replace(oldWipe, newWipe);

fs.writeFileSync('src/app/inbox/page.tsx', code);
