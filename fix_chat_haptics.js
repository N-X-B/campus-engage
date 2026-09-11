const fs = require('fs');

let code = fs.readFileSync('src/app/chat/[id]/page.tsx', 'utf8');

if (!code.includes("import { haptic }")) {
  code = code.replace("import { db } from '@/lib/firebase';", "import { db } from '@/lib/firebase';\nimport { haptic } from '@/lib/haptics';");
}

code = code.replace("setNewMessage(''); // optimistic clear", "setNewMessage(''); // optimistic clear\n    haptic.light();");

// Also add an error haptic if message blocked
code = code.replace(/setErrorMsg\("🚨 Message blocked/g, "haptic.error();\n           setErrorMsg(\"🚨 Message blocked");
code = code.replace(/setErrorMsg\("⚠️ For your safety/g, "haptic.error();\n           setErrorMsg(\"⚠️ For your safety");

fs.writeFileSync('src/app/chat/[id]/page.tsx', code);
