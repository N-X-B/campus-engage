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

// 4. Add resetMessage UI
const errorUIRegex = /\{error && \([\s\S]*?\} \)/;
const errorUIMatch = code.match(errorUIRegex)[0];
const newMessagesUI = `${errorUIMatch}
            {resetMessage && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-4 p-3 bg-emerald-500/10 text-emerald-400 text-sm rounded-lg border border-emerald-500/20">
                {resetMessage}
              </motion.div>
            )}`;
code = code.replace(errorUIRegex, newMessagesUI);

// 5. Add Forgot Password? button
const passwordLabelRegex = /<label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="password">\n                  Password\n                <\/label>/;
const newPasswordLabel = `<div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-zinc-300" htmlFor="password">
                    Password
                  </label>
                  <button 
                    type="button" 
                    onClick={handleResetPassword}
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>`;
code = code.replace(passwordLabelRegex, newPasswordLabel);

fs.writeFileSync('src/app/login/page.tsx', code);
