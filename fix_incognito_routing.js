const fs = require('fs');

let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

const oldToggle = `  const toggleIncognito = async () => {
    const newValue = !isIncognito;
    setIsIncognito(newValue);
    try {
       await updateDoc(doc(db, 'users', user!.uid), { incognito: newValue });
       setUserData({ ...userData, incognito: newValue });
    } catch(err) {
       console.error("Failed to toggle incognito", err);
    }
  };`;

const newToggle = `  const toggleIncognito = async () => {
    const newValue = !isIncognito;
    setIsIncognito(newValue);
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(30);
    
    try {
       await updateDoc(doc(db, 'users', user!.uid), { incognito: newValue });
       setUserData({ ...userData, incognito: newValue });
       
       if (newValue === true) {
         router.push('/missed-connections');
       }
    } catch(err) {
       console.error("Failed to toggle incognito", err);
    }
  };`;

code = code.replace(oldToggle, newToggle);

fs.writeFileSync('src/app/profile/page.tsx', code);
