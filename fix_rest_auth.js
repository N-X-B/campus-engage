const fs = require('fs');
let code = fs.readFileSync('src/app/actions/profile.ts', 'utf8');

const API_KEY = "AIzaSyD4uG7W2_m1bZgB18x26b9e8bjZnPKRSCQ";

// 1. Fix saveProfileOnServer
code = code.replace(
  "const fullUrl = `\${url}?\${maskParams}`;",
  "const fullUrl = `\${url}?key=AIzaSyD4uG7W2_m1bZgB18x26b9e8bjZnPKRSCQ&\${maskParams}`;"
);

// 2. Fix getProfilesOnServer
code = code.replace(
  "const url = `https://firestore.googleapis.com/v1/projects/\${PROJECT_ID}/databases/(default)/documents/users`;",
  "const url = `https://firestore.googleapis.com/v1/projects/\${PROJECT_ID}/databases/(default)/documents/users?key=AIzaSyD4uG7W2_m1bZgB18x26b9e8bjZnPKRSCQ`;"
);

// 3. Fix getUserOnServer
code = code.replace(
  "const url = `https://firestore.googleapis.com/v1/projects/\${PROJECT_ID}/databases/(default)/documents/users/\${uid}\`;",
  "const url = `https://firestore.googleapis.com/v1/projects/\${PROJECT_ID}/databases/(default)/documents/users/\${uid}?key=AIzaSyD4uG7W2_m1bZgB18x26b9e8bjZnPKRSCQ\`;"
);

fs.writeFileSync('src/app/actions/profile.ts', code);
