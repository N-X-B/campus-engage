const fs = require('fs');

let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

// Replace limit in handleToggleInterest
code = code.replace(/if \(selectedInterests.length >= 3\) \{/g, 'if (selectedInterests.length >= 5) {');
code = code.replace(/setInterestError\("You can only select up to 3 campus groups!"\);/g, 'setInterestError("You can only select up to 5 campus groups!");');

// Replace limit in UI text
code = code.replace(/Select up to 3 groups:/g, 'Select up to 5 groups:');
code = code.replace(/You've reached the 3 group limit!/g, 'You\\'ve reached the 5 group limit!');

// Replace limit in logic statements
code = code.replace(/selectedInterests.length >= 3/g, 'selectedInterests.length >= 5');

fs.writeFileSync('src/app/profile/page.tsx', code);
