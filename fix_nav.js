const fs = require('fs');
let code = fs.readFileSync('src/components/Navigation.tsx', 'utf8');
code = code.replace(
  "{ name: 'Discover', path: '/feed' },",
  "{ name: 'Discover', path: '/feed' },\n    { name: 'Spotted', path: '/missed-connections' },"
);
fs.writeFileSync('src/components/Navigation.tsx', code);
