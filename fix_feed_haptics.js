const fs = require('fs');

let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

if (!code.includes("import { haptic }")) {
  code = code.replace("import { db } from '@/lib/firebase';", "import { db } from '@/lib/firebase';\nimport { haptic } from '@/lib/haptics';");
}

// 1. "Break the Ice" button click (open modal)
code = code.replace("const handleBreakIceClick = (e: any, p: any, isModal: boolean = false) => {", "const handleBreakIceClick = (e: any, p: any, isModal: boolean = false) => {\n    haptic.medium();");

// 2. Selecting a prompt in the modal
code = code.replace("setSendingPrompt(promptToSend);", "setSendingPrompt(promptToSend);\n    haptic.light();");

// 3. Sent success badge appears
code = code.replace("setSentSuccess(true);", "setSentSuccess(true);\n      haptic.success();");

// 4. Opening the Vibe filter
code = code.replace("onClick={() => setShowFilterModal(true)}", "onClick={() => { haptic.medium(); setShowFilterModal(true); }}");

// 5. Selecting a vibe filter tag
code = code.replace("const handleFilterToggle = (tag: string) => {", "const handleFilterToggle = (tag: string) => {\n    haptic.light();");

fs.writeFileSync('src/app/feed/page.tsx', code);
