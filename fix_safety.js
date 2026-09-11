const fs = require('fs');

let code = fs.readFileSync('src/app/chat/[id]/page.tsx', 'utf8');

const oldRegexSection = `const blockRules = [
      // Phone numbers (e.g. 123-456-7890, 1234567890, 123 456 7890)
      /(?:\\d[\\s\\-\\.]*){10}/,
      // Emails
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/,
      // Instagram / Snapchat keywords
      /insta|instagram|ig\\s+@|ig\\s*:|snapchat|snap\\s+me|snap\\s+@|sc\\s*:|add\\s+my\\s+snap/i,
      // Naked handles (anything starting with @)
      /@[\\w\\.\\_]+/
    ];

    for (const rule of blockRules) {
      if (rule.test(lowerText)) {
        setErrorMsg("⚠️ For your safety, sharing Instagram, Snapchat, Phone Numbers, or Emails is not allowed.");
        return;
      }
    }`;


const newRegexSection = `const blockRules = [
      // 0. Extreme Verbal Abuse, Hate Speech & Slurs
      /\\b(fuck|bitch|cunt|asshole|motherfucker|dickhead|whore|slut|faggot|retard|nigger|nigga|chink|spic|kike|dyke|tranny|kys|kill\\s+yourself)\\b/i,
      // 1. Violence, Threats & Communal Harm
      /\\b(kill|murder|stab|shoot|bomb|terrorist|rape|strangle|massacre|lynch|behead|assassinate)\\b/i,
      // 2. Sexual Content, Nudity & Solicitations
      /\\b(nudes|send\\s+pics|boobs|tits|dick|cock|pussy|vagina|penis|porn|horny|cum|jerk\\s+off|masturbate|blowjob|handjob|squirt|creampie|threesome|orgy|onlyfans|of\\s+link)\\b/i,
      // 3. Phone numbers (e.g. 123-456-7890, 1234567890, 123 456 7890)
      /(?:\\d[\\s\\-\\.]*){10}/,
      // 4. Emails
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/,
      // 5. Instagram / Snapchat keywords
      /insta|instagram|ig\\s+@|ig\\s*:|snapchat|snap\\s+me|snap\\s+@|sc\\s*:|add\\s+my\\s+snap/i,
      // 6. Naked handles (anything starting with @)
      /@[\\w\\.\\_]+/
    ];

    for (let i = 0; i < blockRules.length; i++) {
      if (blockRules[i].test(lowerText)) {
        if (i <= 2) {
           setErrorMsg("🚨 Message blocked: Contains inappropriate, abusive, violent, or sexually explicit content.");
        } else {
           setErrorMsg("⚠️ For your safety, sharing Instagram, Snapchat, Phone Numbers, or Emails is not allowed.");
        }
        return;
      }
    }`;

code = code.replace(oldRegexSection, newRegexSection);

fs.writeFileSync('src/app/chat/[id]/page.tsx', code);
