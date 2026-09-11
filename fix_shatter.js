const fs = require('fs');

let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

// The block to replace
const globalShatterMatch = /\{\/\* Global Shatter Animation Overlay \*\/\}[\s\S]*?<\/AnimatePresence>/;

const optimizedShatter = `{/* Global Shatter Animation Overlay (Optimized for Mobile) */}
      <AnimatePresence>
        {shatterPos && (
          <div className="fixed inset-0 pointer-events-none z-[200]">
            {/* The Main Flash */}
            <motion.div
              initial={{ x: shatterPos.x, y: shatterPos.y, width: shatterPos.width, height: 60, opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute bg-white rounded-2xl"
            />
            
            {/* Ice Particles */}
            {[...Array(6)].map((_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              const distance = 150 + Math.random() * 100;
              const destX = shatterPos.x + shatterPos.width / 2 + Math.cos(angle) * distance;
              const destY = shatterPos.y + 30 + Math.sin(angle) * distance;
              
              return (
                <motion.div 
                  key={i}
                  initial={{ 
                    x: shatterPos.x + shatterPos.width / 2, 
                    y: shatterPos.y + 30, 
                    scale: 0.5 + Math.random(),
                    rotate: 0, 
                    opacity: 1 
                  }}
                  animate={{ 
                    x: destX, 
                    y: destY, 
                    rotate: Math.random() * 360, 
                    opacity: 0,
                    scale: 0 
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute w-6 h-6 bg-blue-100 rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  style={{ willChange: 'transform, opacity' }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>`;

code = code.replace(globalShatterMatch, optimizedShatter);

// Reduce the setTimeout from 800ms to 400ms so it feels snappier
code = code.replace(/setTimeout\(\(\) => \{\n\s*if \(isModal\)/, 'setTimeout(() => {\n      if (isModal)');
code = code.replace(/setShatterPos\(null\);\n    \}, 800\);/g, 'setShatterPos(null);\n    }, 400);');

fs.writeFileSync('src/app/feed/page.tsx', code);
