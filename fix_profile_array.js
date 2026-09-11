const fs = require('fs');
let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

code = code.replace(/userData\?\.referralCount \|\| 0/g, "(userData?.referredUsers?.length || userData?.referralCount || 0)");

fs.writeFileSync('src/app/profile/page.tsx', code);
