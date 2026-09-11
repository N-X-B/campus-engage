const fs = require('fs');

function fix(file) {
  let code = fs.readFileSync(file, 'utf8');
  if (code.startsWith("import { SonarBackground } from '@/components/SonarBackground';\n\"use client\";")) {
     code = code.replace("import { SonarBackground } from '@/components/SonarBackground';\n\"use client\";", "\"use client\";\nimport { SonarBackground } from '@/components/SonarBackground';");
     fs.writeFileSync(file, code);
  }
}

fix('src/app/feed/page.tsx');
fix('src/app/inbox/page.tsx');
fix('src/app/profile/page.tsx');
