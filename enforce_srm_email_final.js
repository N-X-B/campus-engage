const fs = require('fs');
let code = fs.readFileSync('src/app/register/page.tsx', 'utf8');

const target = `  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {`;

const replacement = `  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Strict SRM AP Email Validation
    const srmRegex = /^[a-zA-Z0-9]+_[a-zA-Z0-9]+@srmap\\.edu\\.in$/i;
    if (!srmRegex.test(email.trim()) && !isDemoMode) {
      setError("Access Denied: You must use your official SRM AP student email (e.g., lastname_firstname@srmap.edu.in).");
      setLoading(false);
      return;
    }

    try {`;

code = code.replace(target, replacement);

code = code.replace('placeholder="student@university.edu"', 'placeholder="lastname_firstname@srmap.edu.in"');
code = code.replace('University Email</label>', 'SRM AP Email</label>');

fs.writeFileSync('src/app/register/page.tsx', code);
