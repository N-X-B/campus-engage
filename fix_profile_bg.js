const fs = require('fs');

let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

// Remove SonarBackground import if it exists
code = code.replace(/import \{ SonarBackground \} from '@\/components\/SonarBackground';\n/, '');

// Remove the component from JSX and restore bg-black
const target = `<>
      <SonarBackground />
      <div className="min-h-screen relative z-10 pb-24 md:pb-0 font-sans selection:bg-white/20">`;
const replacement = `<div className="min-h-screen bg-black pb-24 md:pb-0 font-sans selection:bg-white/20">`;

code = code.replace(target, replacement);

// Also remove the closing fragment
const endTarget = `</div>
    </>
  );`;
const endReplacement = `</div>
  );`;

code = code.replace(endTarget, endReplacement);

fs.writeFileSync('src/app/profile/page.tsx', code);
