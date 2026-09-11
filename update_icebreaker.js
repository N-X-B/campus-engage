const fs = require('fs');

let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

// 1. Add promptOptions state
code = code.replace(
  /const \[selectedPrompt, setSelectedPrompt\] = useState\(""\);/,
  `const [selectedPrompt, setSelectedPrompt] = useState("");\n  const [promptOptions, setPromptOptions] = useState<string[]>([]);`
);

// 2. Modify openIcebreaker
const oldOpenIcebreaker = `  const openIcebreaker = (targetUser: any) => {
    setSelectedUser(targetUser);
    setSelectedPrompt(ICEBREAKERS[Math.floor(Math.random() * ICEBREAKERS.length)]);
    setIcebreakerModal(true);
  };`;

const newOpenIcebreaker = `  const openIcebreaker = (targetUser: any) => {
    setSelectedUser(targetUser);
    const shuffled = [...ICEBREAKERS].sort(() => 0.5 - Math.random());
    setPromptOptions(shuffled.slice(0, 3));
    setIcebreakerModal(true);
  };`;

code = code.replace(oldOpenIcebreaker, newOpenIcebreaker);

// 3. Modify sendIcebreakerMessage
code = code.replace(/const sendIcebreakerMessage = async \(\) => {/g, 'const sendIcebreakerMessage = async (promptToSend: string) => {');
code = code.replace(/selectedPrompt/g, 'promptToSend');
// Wait, changing all selectedPrompt to promptToSend might break something else.
// Let's manually replace it only inside the function.
