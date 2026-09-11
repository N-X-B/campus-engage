const fs = require('fs');
let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

const regex = /const openIcebreaker = \(targetUser: any\) => \{[\s\S]*?setIcebreakerModal\(true\);\n  \};/;
const replacement = `const openIcebreaker = (targetUser: any) => {
    setSelectedUser(targetUser);
    const shuffled = [...ICEBREAKERS].sort(() => 0.5 - Math.random());
    setPromptOptions(shuffled.slice(0, 3));
    setIcebreakerModal(true);
  };`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/app/feed/page.tsx', code);
