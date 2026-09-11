const fs = require('fs');
let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

code = code.replace(
  'const [selectedPrompt, setSelectedPrompt] = useState("");',
  'const [selectedPrompt, setSelectedPrompt] = useState("");\n  const [promptOptions, setPromptOptions] = useState<string[]>([]);\n  const [breakingIceId, setBreakingIceId] = useState<string | null>(null);'
);

fs.writeFileSync('src/app/feed/page.tsx', code);
