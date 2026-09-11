const fs = require('fs');
let code = fs.readFileSync('src/app/register/page.tsx', 'utf8');

const debugRegister = `
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log("[REGISTER] Starting registration process...");
      if (isDemoMode) {
        console.log("[REGISTER] Using demo mode");
        await demoAuth.register(email, name);
        window.location.href = '/onboarding';
        return;
      }

      console.log("[REGISTER] Calling createUserWithEmailAndPassword...");
      const userCredential = await Promise.race([
        createUserWithEmailAndPassword(auth, email, password),
        timeoutPromise(8000, "Firebase Auth is not responding. Check your network or Vercel configuration.")
      ]) as any;
      
      const user = userCredential.user;
      console.log("[REGISTER] User created in Auth:", user.uid);

      console.log("[REGISTER] Updating profile...");
      await updateProfile(user, { displayName: name });
      
      console.log("[REGISTER] Saving profile to Firestore...");
      await Promise.race([
        setDoc(doc(db, 'users', user.uid), {
          name,
          email,
          createdAt: new Date().toISOString(),
          onboardingComplete: false,
          referralCount: 0,
          referredBy: referralId || null
        }),
        timeoutPromise(10000, "Database connection timed out. Firestore is hanging.")
      ]);
      
      console.log("[REGISTER] Firestore save complete!");

      if (referralId) {
        console.log("[REGISTER] Updating referral count...");
        try {
          const referrerRef = doc(db, 'users', referralId);
          await updateDoc(referrerRef, {
            referralCount: increment(1)
          });
        } catch (err) {
          console.error("[REGISTER] Failed to update referral count", err);
        }
      }

      console.log("[REGISTER] Routing to /onboarding...");
      router.push('/onboarding');
    } catch (err: any) {
      console.error("[REGISTER] Caught Error:", err);
      setError(err.message || 'Failed to create account');
      setLoading(false);
    }
  };
`;

code = code.replace(/const handleRegister = async \([\s\S]*?\} catch \(err: any\) \{[\s\S]*?setLoading\(false\);\n    \}\n  \};/, debugRegister.trim());
fs.writeFileSync('src/app/register/page.tsx', code);
