const fs = require('fs');

let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

const interestsData = `
const INTEREST_GROUPS = {
  "Academics 📚": ["Study Group", "Library Grind", "Tech & Hackathons", "Startup Building"],
  "Social & Nightlife 🪩": ["Greek Life", "Bar Crawls", "House Parties", "Cafe Hopping"],
  "Hobbies & Arts 🎨": ["Dance Crew", "Jam Sessions", "Gaming & Esports", "Photography"],
  "Sports & Fitness 💪": ["Gym Partners", "Intramural Sports", "Running / Hiking", "Yoga & Wellness"]
};
`;

code = code.replace("const ICEBREAKERS =", interestsData + "\nconst ICEBREAKERS =");

// Also, the tags.map typescript error:
// Object.entries returns [string, unknown] usually if not typed, but in JS it works.
// To fix the typescript error for tags.map, I will cast it.
code = code.replace(/\{tags\.map\(tag => \{/g, '{(tags as string[]).map(tag => {');

fs.writeFileSync('src/app/feed/page.tsx', code);
