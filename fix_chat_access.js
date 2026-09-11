const fs = require('fs');
let code = fs.readFileSync('src/app/chat/[id]/page.tsx', 'utf8');

const badMatch = `const data = convSnap.data();
        if (!data.participants || !data.participants.includes(user.uid)) {
           setIsAuthorized(false); // Unauthorized!
           return;
        }`;

const goodMatch = `const data = convSnap.data();
        // Fallback for older database documents that might not have participants array
        const isParticipant = 
          (data.participants && data.participants.includes(user.uid)) || 
          data.senderId === user.uid || 
          data.receiverId === user.uid;
          
        if (!isParticipant) {
           setIsAuthorized(false); // Unauthorized!
           return;
        }
        
        // Ensure data.participants exists for the rest of the code
        if (!data.participants) {
          data.participants = [data.senderId, data.receiverId];
        }`;

code = code.replace(badMatch, goodMatch);
fs.writeFileSync('src/app/chat/[id]/page.tsx', code);
