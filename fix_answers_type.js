const fs = require('fs');
let code = fs.readFileSync('src/app/actions/matchmaking.ts', 'utf8');
code = code.replace("export async function generateAndSaveEmbedding(uid: string, answers: string[]) {", 
  "export async function generateAndSaveEmbedding(uid: string, answers: any) {");
  
code = code.replace("const textToEmbed = answers.join(\" | \");", 
  "const textToEmbed = Object.values(answers).join(\" | \");");
fs.writeFileSync('src/app/actions/matchmaking.ts', code);
