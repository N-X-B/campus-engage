const fs = require('fs');

let code = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

if (!code.includes("import { haptic }")) {
  code = code.replace("import { db } from '@/lib/firebase';", "import { db } from '@/lib/firebase';\nimport { haptic } from '@/lib/haptics';");
}

code = code.replace(/<Link \n              key=\{item\.path\} \n              href=\{item\.path\}/g, `<Link \n              key={item.path} \n              href={item.path}\n              onClick={() => haptic.light()}`);

fs.writeFileSync('src/components/Navigation.tsx', code);
