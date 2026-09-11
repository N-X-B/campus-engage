const fs = require('fs');

const files = [
  'src/app/inbox/page.tsx',
  'src/app/chat/[id]/page.tsx',
  'src/app/register/page.tsx',
  'src/app/profile/page.tsx',
  'src/app/missed-connections/page.tsx',
  'src/app/feed/page.tsx',
  'src/app/onboarding/page.tsx'
];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  
  const originalCode = code;

  // Add import if not present and if we are going to replace something
  if (/<div[^>]*>Loading\.\.\.<\/div>/.test(code) && !code.includes('LoadingScreen')) {
    // Add import after the first import
    code = code.replace(/import [^\n]+;\n/, match => match + "import { LoadingScreen } from '@/components/LoadingScreen';\n");
  }

  // Replace all div loading variants with LoadingScreen component
  code = code.replace(/<div className="flex h-screen items-center justify-center bg-black text-white">Loading\.\.\.<\/div>/g, '<LoadingScreen />');
  code = code.replace(/<div className="flex h-screen items-center justify-center">Loading\.\.\.<\/div>/g, '<LoadingScreen />');
  code = code.replace(/<div className="text-white text-center">Loading\.\.\.<\/div>/g, '<LoadingScreen />');

  if (code !== originalCode) {
    fs.writeFileSync(file, code);
  }
});
