const fs = require('fs');

let code = fs.readFileSync('src/components/SonarBackground.tsx', 'utf8');

const target = `          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-[2px] border-indigo-500/40 bg-indigo-500/10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 3], 
              opacity: [0, 0.6, 0] 
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2, // stagger the ripples
            }}
          />`;

const replacement = `          <motion.div
            key={i}
            style={{ willChange: "transform, opacity" }}
            className="absolute inset-0 rounded-full border-[2px] border-indigo-500/40 bg-indigo-500/10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 3], 
              opacity: [0, 0.6, 0] 
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
          />`;

code = code.replace(target, replacement);

// Fix the blur killer
const blurTarget = `<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]" />`;
const blurReplacement = `<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)' }} />`;

code = code.replace(blurTarget, blurReplacement);

fs.writeFileSync('src/components/SonarBackground.tsx', code);
