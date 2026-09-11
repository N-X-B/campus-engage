const fs = require('fs');

let code = fs.readFileSync('src/app/chat/[id]/page.tsx', 'utf8');

// Use React.use() to unwrap params
if (!code.includes('import { use } from')) {
  code = code.replace("import { useState, useEffect, useRef } from 'react';", "import { useState, useEffect, useRef, use } from 'react';");
}

code = code.replace("export default function ChatRoom({ params }: { params: { id: string } }) {", "export default function ChatRoom({ params }: { params: Promise<{ id: string }> }) {\n  const resolvedParams = use(params);");

// Replace all instances of params.id with resolvedParams.id
code = code.replace(/params\.id/g, 'resolvedParams.id');

fs.writeFileSync('src/app/chat/[id]/page.tsx', code);
