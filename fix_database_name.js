const fs = require('fs');
let code = fs.readFileSync('src/app/actions/profile.ts', 'utf8');
code = code.replaceAll('/databases/(default)/', '/databases/default/');
fs.writeFileSync('src/app/actions/profile.ts', code);

let missedConnectionsCode = fs.readFileSync('src/app/actions/missedConnections.ts', 'utf8');
missedConnectionsCode = missedConnectionsCode.replaceAll('/databases/(default)/', '/databases/default/');
fs.writeFileSync('src/app/actions/missedConnections.ts', missedConnectionsCode);
