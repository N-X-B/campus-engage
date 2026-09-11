const fs = require('fs');
function fixSpinner(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/border-white\/30 border-t-white/g, 'border-black/30 border-t-black');
  fs.writeFileSync(file, code);
}
fixSpinner('src/app/login/page.tsx');
fixSpinner('src/app/register/page.tsx');
