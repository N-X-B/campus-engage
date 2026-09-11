const fs = require('fs');

function fix(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/-tranzinc-x-/g, '-translate-x-');
  code = code.replace(/-tranzinc-y-/g, '-translate-y-');
  fs.writeFileSync(file, code);
}

fix('src/app/feed/page.tsx');
fix('src/app/missed-connections/page.tsx');
