const fs = require('fs');

let code = fs.readFileSync('src/app/register/page.tsx', 'utf8');

// 1. Add validation in handleRegister
const validationCode = `    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const srmRegex = /^[a-zA-Z0-9]+_[a-zA-Z0-9]+@srmap\\.edu\\.in$/i;
    if (!srmRegex.test(email.trim())) {
      setError("Access Denied: You must use your official SRM AP student email (e.g., lastname_firstname@srmap.edu.in).");
      setLoading(false);
      return;
    }`;

code = code.replace(`    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }`, validationCode);

// 2. Change input placeholder
code = code.replace('placeholder="student@university.edu"', 'placeholder="lastname_firstname@srmap.edu.in"');
// Change label
code = code.replace('University Email</label>', 'SRM AP Email</label>');

fs.writeFileSync('src/app/register/page.tsx', code);
