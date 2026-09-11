const fs = require('fs');

let code = fs.readFileSync('src/app/chat/[id]/page.tsx', 'utf8');

const targetArray = `const blockRules = [`;

const extraRules = `const blockRules = [
      // 1. Extreme Verbal Abuse, Hate Speech & Slurs (Profanity & Communal Violence)
      /\\b(fuck|bitch|cunt|asshole|motherfucker|dickhead|whore|slut|faggot|retard|nigger|nigga|chink|spic|kike|dyke|tranny|kys|kill yourself)\\b/i,
      // 2. Violence, Threats & Communal Harm
      /\\b(kill|murder|stab|shoot|bomb|terrorist|rape|strangle|massacre|lynch|behead|assassinate)\\b/i,
      // 3. Sexual Content, Nudity & Solicitations
      /\\b(nudes|send pics|boobs|tits|dick|cock|pussy|vagina|penis|porn|horny|cum|jerk off|masturbate|blowjob|handjob|squirt|creampie|threesome|orgy|onlyfans|of\\slink)\\b/i,
`;

code = code.replace(targetArray, extraRules);

// Update the error message so it's dynamic based on the violation
const badLoopMatch = /for \\(const rule of blockRules\\) \\{[\\s\\S]*?if \\(rule\\.test\\(lowerText\\)\\) \\{[\\s\\S]*?setErrorMsg\\("⚠️ For your safety, sharing Instagram, Snapchat, Phone Numbers, or Emails is not allowed\\."\\);[\\s\\S]*?return;[\\s\\S]*?\\}[\\s\\S]*?\\}/;

const goodLoop = `for (let i = 0; i < blockRules.length; i++) {
      if (blockRules[i].test(lowerText)) {
        if (i <= 2) {
           setErrorMsg("🚨 Message blocked: Contains inappropriate, abusive, violent, or sexually explicit content. Continued violations will result in a ban.");
        } else {
           setErrorMsg("⚠️ For your safety, sharing Instagram, Snapchat, Phone Numbers, or Emails is not allowed.");
        }
        return;
      }
    }`;

// Wait, doing this via string replacement might be brittle. Let's do a more robust replacement.
