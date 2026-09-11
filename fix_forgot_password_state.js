const fs = require('fs');
let code = fs.readFileSync('src/app/login/page.tsx', 'utf8');

// 1. Add sendPasswordResetEmail import
code = code.replace(
  /import \{ signInWithEmailAndPassword \} from 'firebase\/auth';/,
  "import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';"
);

// 2. Add resetMessage state
code = code.replace(
  /const \[error, setError\] = useState\(''\);/,
  "const [error, setError] = useState('');\n  const [resetMessage, setResetMessage] = useState('');"
);

// 3. Add handleResetPassword
const handleLoginStart = "const handleLogin = async (e: React.FormEvent) => {";
const handleResetPasswordCode = `  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your university email first to reset your password.');
      setResetMessage('');
      return;
    }
    if (isDemoMode) {
      setError('Cannot reset passwords in Demo Mode.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Password reset link sent! Check your email inbox to create a new password.');
      setError('');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
      setResetMessage('');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {`;
code = code.replace(handleLoginStart, handleResetPasswordCode);

fs.writeFileSync('src/app/login/page.tsx', code);
