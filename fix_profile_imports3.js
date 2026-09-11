const fs = require('fs');

let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

code = code.replace("import { motion } from 'framer-motion';", "import { motion, AnimatePresence } from 'framer-motion';");

fs.writeFileSync('src/app/profile/page.tsx', code);
