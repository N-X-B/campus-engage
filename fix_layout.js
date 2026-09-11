const fs = require('fs');

let code = fs.readFileSync('src/app/layout.tsx', 'utf8');

const viewportCode = `
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};
`;

code = code.replace('export const metadata: Metadata', viewportCode + '\nexport const metadata: Metadata');
fs.writeFileSync('src/app/layout.tsx', code);
