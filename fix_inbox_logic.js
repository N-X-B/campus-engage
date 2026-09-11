const fs = require('fs');

let code = fs.readFileSync('src/app/inbox/page.tsx', 'utf8');

// Update imports
if (!code.includes('updateDoc')) {
  code = code.replace(/getDocs \} from 'firebase\/firestore';/, "getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';");
}

// Modify the onSnapshot listener to grab status and pending details
const oldSnapshotCode = `    const unsubscribe = onSnapshot(q, (snapshot) => {
       const convos: any[] = [];
       snapshot.forEach(d => {
          const data = d.data();
          const otherUserId = data.participants?.find((id: string) => id !== user.uid);
          convos.push({
             id: d.id,
             otherUserId,
             lastMessage: data.lastMessage,
             lastUpdated: data.lastUpdated,
             read: true
          });
       });
       convos.sort((a, b) => b.lastUpdated - a.lastUpdated);
       setConversations(convos);
    });`;

const newSnapshotCode = `    const unsubscribe = onSnapshot(q, (snapshot) => {
       const convos: any[] = [];
       snapshot.forEach(d => {
          const data = d.data();
          const otherUserId = data.participants?.find((id: string) => id !== user.uid);
          convos.push({
             id: d.id,
             otherUserId,
             status: data.status || 'active',
             senderId: data.senderId,
             receiverId: data.receiverId,
             icebreakerPrompt: data.icebreakerPrompt,
             lastMessage: data.lastMessage,
             lastUpdated: data.lastUpdated || 0,
             read: true
          });
       });
       // Sort correctly to have latest at the top
       convos.sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));
       setConversations(convos);
    });`;

code = code.replace(oldSnapshotCode, newSnapshotCode);

// Add accept function
const acceptFn = `  const handleAccept = async (convId: string, prompt: string, senderId: string) => {
    try {
      await updateDoc(doc(db, 'conversations', convId), {
        status: 'active',
        lastMessage: prompt,
        lastUpdated: Date.now()
      });
      // Add the prompt as the first actual message
      await addDoc(collection(db, \`conversations/\${convId}/messages\`), {
         text: prompt,
         senderId: senderId,
         senderName: 'Connection',
         timestamp: Date.now()
      });
    } catch(err) {
      console.error("Failed to accept", err);
    }
  };`;

code = code.replace(/export default function InboxPage\(\) \{[\s\S]*?useEffect\(\(\) => \{/, match => match + "\n" + acceptFn + "\n");

// Modify the UI rendering of the conversation list
const oldUIRegex = /<div className="space-y-4">[\s\S]*?<\/div>\n\n        <\/div>/;

const newUI = `<div className="space-y-4">
            {conversations.map(conv => {
              const otherUser = allUsers.find(u => u.id === conv.otherUserId) || {
                 name: 'Unknown User',
                 major: 'Unknown Major',
                 photoUrl: ''
              };
              
              const isPending = conv.status === 'pending';
              const isReceiver = conv.receiverId === user?.uid;
              const isSender = conv.senderId === user?.uid;

              if (isPending && isSender) {
                 return (
                   <div key={conv.id} className="block bg-zinc-900/50 border border-white/5 p-4 rounded-3xl opacity-60">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-zinc-800 border border-white/10 flex-shrink-0 flex items-center justify-center text-xl overflow-hidden grayscale">
                           {otherUser.photoUrl ? <img src={otherUser.photoUrl} className="w-full h-full object-cover" /> : '👤'}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg">{otherUser.name || 'User'}</h3>
                          <p className="text-zinc-500 text-sm italic">Waiting for them to accept...</p>
                        </div>
                     </div>
                   </div>
                 );
              }

              if (isPending && isReceiver) {
                 return (
                   <div key={conv.id} className="block bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-3xl">
                     <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 rounded-full bg-zinc-800 border border-indigo-500/50 flex-shrink-0 flex items-center justify-center text-xl overflow-hidden">
                           {otherUser.photoUrl ? <img src={otherUser.photoUrl} className="w-full h-full object-cover" /> : '👤'}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg">{otherUser.name || 'User'}</h3>
                          <p className="text-indigo-300 text-sm font-medium">Sent you an Icebreaker!</p>
                        </div>
                     </div>
                     <div className="bg-black/40 p-4 rounded-2xl mb-3 border border-white/5 text-white italic">
                        "{conv.icebreakerPrompt}"
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => handleAccept(conv.id, conv.icebreakerPrompt, conv.senderId)} className="flex-1 bg-white text-black py-3 rounded-xl font-bold shadow-lg hover:bg-zinc-200 transition">Accept</button>
                     </div>
                   </div>
                 );
              }

              return (
                <Link key={conv.id} href={\`/chat/\${conv.id}\`} className="block bg-zinc-900/50 border border-white/5 p-4 rounded-3xl hover:bg-zinc-900 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-zinc-800 border border-white/10 flex-shrink-0 flex items-center justify-center text-xl overflow-hidden">
                       {otherUser.photoUrl ? <img src={otherUser.photoUrl} className="w-full h-full object-cover" /> : '👤'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-white font-bold text-lg truncate">{otherUser.name || 'User'}</h3>
                      </div>
                      <p className="text-zinc-400 text-sm truncate">{conv.lastMessage || 'Connected!'}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>`;

code = code.replace(oldUIRegex, newUI);

fs.writeFileSync('src/app/inbox/page.tsx', code);
