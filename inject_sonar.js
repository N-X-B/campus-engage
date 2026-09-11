const fs = require('fs');

function inject(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  if (!code.includes('SonarBackground')) {
     code = code.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport { SonarBackground } from '@/components/SonarBackground';");
     if (!code.includes('SonarBackground')) { // If framer motion import was different
        code = "import { SonarBackground } from '@/components/SonarBackground';\n" + code;
     }
  }

  // Remove bg-black from main container and inject SonarBackground
  code = code.replace(/className="min-h-screen bg-black /g, 'className="min-h-screen relative z-10 ');
  code = code.replace(/<div className="min-h-screen relative z-10 ([^"]+)">/, '<SonarBackground />\n    <div className="min-h-screen relative z-10 $1">');
  
  fs.writeFileSync(file, code);
}

inject('src/app/feed/page.tsx');
inject('src/app/inbox/page.tsx');
inject('src/app/profile/page.tsx');
