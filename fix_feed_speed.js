const fs = require('fs');

let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

const slowFetchMatch = /const userDoc = await getDoc\(doc\(db, 'users', user\.uid\)\);[\s\S]*?fetchedProfiles = await demoDb\.getProfiles\(\);[\s\S]*?\} else \{[\s\S]*?const querySnapshot = await getDocs\(query\(collection\(db, 'users'\), where\('onboarded', '==', true\)\)\);[\s\S]*?querySnapshot\.forEach\(doc => \{[\s\S]*?const d = doc\.data\(\);[\s\S]*?if \(d\.onboarded && doc\.id !== user\.uid\) \{[\s\S]*?fetchedProfiles\.push\(\{ id: doc\.id, \.\.\.d \}\);[\s\S]*?\}[\s\S]*?\}\);[\s\S]*?\}/;

const fastFetchReplace = `let userDocPromise;
        let querySnapshotPromise;
        
        if (!isDemoMode) {
          userDocPromise = getDoc(doc(db, 'users', user.uid));
          querySnapshotPromise = getDocs(query(collection(db, 'users'), where('onboarded', '==', true)));
          
          const [userDoc, querySnapshot] = await Promise.all([userDocPromise, querySnapshotPromise]);
          
          if (userDoc.exists()) setUserData(userDoc.data());
          
          querySnapshot.forEach(doc => {
             const d = doc.data();
             if (d.onboarded && doc.id !== user.uid) {
               fetchedProfiles.push({ id: doc.id, ...d });
             }
          });
        } else {
          fetchedProfiles = await demoDb.getProfiles();
        }`;

code = code.replace(slowFetchMatch, fastFetchReplace);

// Also fix the calculateMatchScore to use userData instead of user!
code = code.replace(/calculateMatchScore\(user, p\)/g, 'calculateMatchScore(userDoc?.exists() ? userDoc.data() : userData, p)');

fs.writeFileSync('src/app/feed/page.tsx', code);
