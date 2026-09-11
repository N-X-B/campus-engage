const fs = require('fs');

let actions = fs.readFileSync('src/app/actions/matchmaking.ts', 'utf8');
actions = actions.replace(/match => match.id/g, "(match: any) => match.id");
fs.writeFileSync('src/app/actions/matchmaking.ts', actions);

let feed = fs.readFileSync('src/app/feed/page.tsx', 'utf8');
feed = feed.replace(/m => aiScoreMap\.set\(m\.id, m\.score\)/g, "(m: any) => aiScoreMap.set(m.id, m.score)");
fs.writeFileSync('src/app/feed/page.tsx', feed);
