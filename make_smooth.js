const fs = require('fs');

const timeoutHelper = `
const timeoutPromise = (ms: number, message: string) => 
  new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));
`;

// 1. FIX LOGIN
let loginCode = fs.readFileSync('src/app/login/page.tsx', 'utf8');
if (!loginCode.includes("timeoutPromise")) {
  loginCode = loginCode.replace("export default function LoginPage() {", timeoutHelper + "\nexport default function LoginPage() {");
}
loginCode = loginCode.replace(
  "const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));",
  "const userDoc = (await Promise.race([ getDoc(doc(db, 'users', userCredential.user.uid)), timeoutPromise(1500, 'timeout') ])) as any;"
);
fs.writeFileSync('src/app/login/page.tsx', loginCode);

// 2. FIX REGISTER
let registerCode = fs.readFileSync('src/app/register/page.tsx', 'utf8');
registerCode = registerCode.replace(/timeoutPromise\(8000/g, "timeoutPromise(2500");
registerCode = registerCode.replace(/timeoutPromise\(10000/g, "timeoutPromise(1500");
registerCode = registerCode.replace(/timeoutPromise\(3000/g, "timeoutPromise(1500");
fs.writeFileSync('src/app/register/page.tsx', registerCode);

// 3. FIX ONBOARDING
let onboardingCode = fs.readFileSync('src/app/onboarding/page.tsx', 'utf8');
onboardingCode = onboardingCode.replace(/timeoutPromise\(3000/g, "timeoutPromise(1500");
// Remove the artificial 2000ms delay in onboarding success
onboardingCode = onboardingCode.replace(/setTimeout\(\(\) => \{\n\s*window\.location\.href = '\/feed';\n\s*\}, 2000\);/g, "setTimeout(() => { window.location.href = '/feed'; }, 500);");
fs.writeFileSync('src/app/onboarding/page.tsx', onboardingCode);

