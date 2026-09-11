const fs = require('fs');
let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

// Update header
code = code.replace(
  '<h1 className="text-3xl font-extrabold text-white tracking-tight">Discover</h1>',
  '<h1 className="text-3xl font-extrabold text-white tracking-tight">Your Daily Batch</h1>'
);

code = code.replace(
  '<p className="text-slate-400 mt-1">Immersive matchability.</p>',
  '<p className="text-slate-400 mt-1">Curated picks, refreshing at midnight.</p>'
);

// Add deterministic shuffle and limit logic
const replacement = `
        if (scoredProfiles.length === 0) {
          scoredProfiles = fetchedProfiles
            .filter(p => p.onboarded && p.id !== user.uid)
            .map(p => ({
              ...p,
              matchScore: calculateMatchScore(user, p)
            }))
            .sort((a, b) => b.matchScore - a.matchScore);
        }

        // --- DAILY SCARCITY LIMIT (15 to 25) ---
        // Deterministic daily limit based on user UID and Date
        const today = new Date().toISOString().split('T')[0];
        const seedStr = user.uid + today;
        let seed = 0;
        for (let i = 0; i < seedStr.length; i++) {
          seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
          seed = seed & seed;
        }
        
        // Random limit between 15 and 25
        const dailyLimit = 15 + (Math.abs(seed) % 11);
        
        // Take the top matches up to the daily limit
        scoredProfiles = scoredProfiles.slice(0, dailyLimit);

        setProfiles(scoredProfiles);
`;

code = code.replace(/if \(scoredProfiles\.length === 0\) \{[\s\S]*?\}\n\n\s*setProfiles\(scoredProfiles\);/, replacement.trim() + "\n");

fs.writeFileSync('src/app/feed/page.tsx', code);
