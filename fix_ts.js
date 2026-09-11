const fs = require('fs');

function fix(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/for \(const \[key, val\] of Object\.entries\(fields\)\)/g, 'for (const [key, val] of Object.entries(fields) as [string, any][])');
  fs.writeFileSync(file, code);
}

fix('src/app/actions/profile.ts');
fix('src/app/actions/missedConnections.ts');
