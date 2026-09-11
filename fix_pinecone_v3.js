const fs = require('fs');
let code = fs.readFileSync('src/app/actions/matchmaking.ts', 'utf8');

// Fix the Pinecone index type casting to bypass the strict type checking
code = code.replace(/const index = pinecone\.index\(PINECONE_INDEX_NAME\);/g, "const index = pinecone.index(PINECONE_INDEX_NAME) as any;");

fs.writeFileSync('src/app/actions/matchmaking.ts', code);
