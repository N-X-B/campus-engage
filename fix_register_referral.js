const fs = require('fs');

let code = fs.readFileSync('src/app/register/page.tsx', 'utf8');

// Ensure arrayUnion is imported
if (!code.includes('arrayUnion')) {
  code = code.replace(/increment \} from 'firebase\/firestore';/, 'increment, arrayUnion } from \'firebase/firestore\';');
}

// Update the referral tracking
const oldReferralCode = `      if (referralId) {
        console.log("[REGISTER] Updating referral count...");
        try {
          const referrerRef = doc(db, 'users', referralId);
          await updateDoc(referrerRef, {
            referralCount: increment(1)
          });
        } catch (err) {
          console.error("[REGISTER] Failed to update referral count", err);
        }
      }`;

const newReferralCode = `      if (referralId) {
        console.log("[REGISTER] Updating referral count...");
        try {
          const referrerRef = doc(db, 'users', referralId);
          await updateDoc(referrerRef, {
            referralCount: increment(1),
            referredUsers: arrayUnion(user.uid)
          });
        } catch (err) {
          console.error("[REGISTER] Failed to update referral count", err);
        }
      }`;

code = code.replace(oldReferralCode, newReferralCode);

fs.writeFileSync('src/app/register/page.tsx', code);
