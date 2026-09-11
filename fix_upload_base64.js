const fs = require('fs');
let code = fs.readFileSync('src/app/onboarding/page.tsx', 'utf8');

const originalUploadLoop = `
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const storageRef = ref(storage, \`users/\${user.uid}/photo_\${i}_\${Date.now()}\`);
        
        // Race upload against a 15-second timeout (usually hangs if CORS is missing)
        await Promise.race([
          uploadBytes(storageRef, file),
          timeoutPromise(15000, "Photo upload timed out! Your Google Cloud Storage bucket might be missing CORS configuration. Try skipping photos for now.")
        ]);
        
        const url = await getDownloadURL(storageRef);
        photoUrls.push(url);
      }`;

const newUploadLoop = `
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        try {
          const base64String = await compressImageToBase64(file);
          photoUrls.push(base64String);
        } catch (e) {
          console.error("Failed to compress image", e);
        }
      }`;

code = code.replace(originalUploadLoop.trim(), newUploadLoop.trim());

fs.writeFileSync('src/app/onboarding/page.tsx', code);
