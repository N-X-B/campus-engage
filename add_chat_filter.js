const fs = require('fs');

let code = fs.readFileSync('src/app/chat/[id]/page.tsx', 'utf8');

// Add errorMsg state
code = code.replace("const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);", "const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);\n  const [errorMsg, setErrorMsg] = useState('');");

const badSendMatch = /const handleSend = async \(e: React\.FormEvent\) => \{[\s\S]*?e\.preventDefault\(\);[\s\S]*?if \(!newMessage\.trim\(\) \|\| !user \|\| isAuthorized !== true\) return;[\s\S]*?const text = newMessage\.trim\(\);/;

const goodSend = `const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!newMessage.trim() || !user || isAuthorized !== true) return;

    const text = newMessage.trim();
    const lowerText = text.toLowerCase();
    
    // Strict regex rules to prevent off-platform sharing
    const blockRules = [
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
    }

    // Secondary heuristic: Words that sound like phone numbers spelled out
    const numberWords = ["zero","one","two","three","four","five","six","seven","eight","nine"];
    let numCount = 0;
    numberWords.forEach(w => {
       const regex = new RegExp("\\\\b" + w + "\\\\b", "g");
       const matches = lowerText.match(regex);
       if (matches) numCount += matches.length;
    });
    if (numCount >= 7) {
       setErrorMsg("⚠️ For your safety, sharing phone numbers is not allowed.");
       return;
    }`;

code = code.replace(badSendMatch, goodSend);

// Now we need to render the error message above the input area
const inputAreaMatch = /<form onSubmit=\{handleSend\} className="p-4 bg-zinc-900 border-t border-white\/10">/;
const inputAreaReplace = `<form onSubmit={handleSend} className="p-4 bg-zinc-900 border-t border-white/10 relative">
        {errorMsg && (
          <div className="absolute bottom-full left-0 right-0 p-3 bg-red-500/90 text-white text-sm font-semibold text-center backdrop-blur-md">
            {errorMsg}
          </div>
        )}`;

code = code.replace(inputAreaMatch, inputAreaReplace);

fs.writeFileSync('src/app/chat/[id]/page.tsx', code);
