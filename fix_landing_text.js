const fs = require('fs');

let code = fs.readFileSync('src/app/page.tsx', 'utf8');

const oldClass = `className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-[0.1em] sm:tracking-[0.2em] mb-8 flex justify-center flex-nowrap whitespace-nowrap w-full overflow-hidden sm:overflow-visible"`;
const newClass = `className="text-[1.7rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-widest sm:tracking-[0.2em] mb-8 flex justify-center flex-wrap sm:flex-nowrap w-full"`;

code = code.replace(oldClass, newClass);

fs.writeFileSync('src/app/page.tsx', code);
