const fs = require('fs');
const files = [
  'src/lib/AuthContext.tsx',
  'src/app/profile/page.tsx'
];
files.forEach(f => {
  let code = fs.readFileSync(f, 'utf8');
  code = code.replace(/import \{ isDemoMode[^}]*\} from '.*?demo-backend';\n/g, 'const isDemoMode = false;\nconst demoAuth: any = {};\n');
  fs.writeFileSync(f, code);
});
