const fs = require('fs');

let code = fs.readFileSync('src/app/login/page.tsx', 'utf8');

// Add state
const stateTarget = `  const [loginState, setLoginState] = useState<'idle' | 'loading' | 'success'>('idle');`;
const stateReplacement = `  const [loginState, setLoginState] = useState<'idle' | 'loading' | 'success'>('idle');\n  const [isResetMode, setIsResetMode] = useState(false);`;
code = code.replace(stateTarget, stateReplacement);

// Modify handleResetPassword to actually submit the reset
const handleResetTarget = `  const handleResetPassword = async () => {
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
  };`;

const handleResetReplacement = `  const handleResetPassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setError('Please enter your university email first.');
      setResetMessage('');
      return;
    }
    if (isDemoMode) {
      setError('Cannot reset passwords in Demo Mode.');
      return;
    }
    setLoginState('loading');
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Password reset link sent! Check your inbox.');
      setError('');
      setIsResetMode(false); // Switch back to login view but keep the success message
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
      setResetMessage('');
    } finally {
      setLoginState('idle');
    }
  };`;
code = code.replace(handleResetTarget, handleResetReplacement);

// Update Header
const headerTarget = `<div className="text-center mb-8">
              <Link href="/" className="text-xl font-bold tracking-tight text-white mb-2 inline-block">
                CampusEngage.
              </Link>
              <h1 className="text-2xl font-semibold text-white mt-4">Welcome back</h1>
              <p className="text-sm text-zinc-400 mt-2">Sign in to your account to continue</p>
            </div>`;
const headerReplacement = `<div className="text-center mb-8">
              <Link href="/" className="text-xl font-bold tracking-tight text-white mb-2 inline-block">
                CampusEngage.
              </Link>
              <h1 className="text-2xl font-semibold text-white mt-4">{isResetMode ? "Reset Password" : "Welcome back"}</h1>
              <p className="text-sm text-zinc-400 mt-2">
                {isResetMode ? "Enter your SRM AP email to receive a secure reset link." : "Sign in to your account to continue"}
              </p>
            </div>`;
code = code.replace(headerTarget, headerReplacement);

// Update Form fields
const formTarget = `            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="email">
                  University Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loginState === 'loading'}
                  placeholder="you@university.edu"
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 backdrop-blur-md transition-all disabled:opacity-50"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
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
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loginState === 'loading'}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 backdrop-blur-md transition-all disabled:opacity-50"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loginState === 'loading'} 
                className="w-full bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] h-14 text-lg font-medium rounded-xl mt-6 shadow-md transition-all active:scale-95 flex items-center justify-center overflow-hidden relative"
              >
                {loginState === 'loading' ? (
                  <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : 'Sign In'}
              </Button>
            </form>`;

const formReplacement = `            <form onSubmit={isResetMode ? handleResetPassword : handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="email">
                  SRM AP Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loginState === 'loading'}
                  placeholder="lastname_firstname@srmap.edu.in"
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 backdrop-blur-md transition-all disabled:opacity-50"
                />
              </div>
              
              {!isResetMode && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-zinc-300" htmlFor="password">
                      Password
                    </label>
                    <button 
                      type="button" 
                      onClick={() => { setIsResetMode(true); setError(''); setResetMessage(''); }}
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    id="password"
                    type="password"
                    required={!isResetMode}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loginState === 'loading'}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 backdrop-blur-md transition-all disabled:opacity-50"
                  />
                </motion.div>
              )}

              <Button 
                type="submit" 
                disabled={loginState === 'loading'} 
                className="w-full bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] h-14 text-lg font-medium rounded-xl mt-6 shadow-md transition-all active:scale-95 flex items-center justify-center overflow-hidden relative"
              >
                {loginState === 'loading' ? (
                  <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : isResetMode ? 'Send Reset Link' : 'Sign In'}
              </Button>
              
              {isResetMode && (
                 <div className="text-center mt-4">
                   <button 
                     type="button" 
                     onClick={() => setIsResetMode(false)}
                     className="text-sm font-bold text-zinc-400 hover:text-white transition-colors"
                   >
                     ← Back to Login
                   </button>
                 </div>
              )}
            </form>`;
code = code.replace(formTarget, formReplacement);

fs.writeFileSync('src/app/login/page.tsx', code);
