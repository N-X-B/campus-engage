const fs = require('fs');
const files = [
  'src/app/actions/profile.ts',
  'src/app/actions/missedConnections.ts',
  'src/app/missed-connections/page.tsx'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  // Replace \` with just `
  code = code.replace(/\\`/g, '`');
  // Replace \$ with just $
  code = code.replace(/\\\$/g, '$');
  fs.writeFileSync(file, code);
}
