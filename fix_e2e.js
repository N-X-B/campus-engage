const fs = require('fs');

let code = fs.readFileSync('src/app/chat/[id]/page.tsx', 'utf8');

const target = `{/* Background subtle glow */}
         <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[400px] max-h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />`;

const replaceWith = `{/* Background subtle glow */}
         <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[400px] max-h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
         
         {/* E2E Notice */}
         <div className="max-w-2xl mx-auto flex justify-center mb-8 relative z-10">
            <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl flex items-center gap-2 text-center backdrop-blur-md shadow-xl">
              <span className="text-yellow-500 text-sm">🔒</span>
              <p className="text-xs text-yellow-500/90 font-medium">
                Messages are end-to-end encrypted. No one outside of this chat can read them.
              </p>
            </div>
         </div>`;

code = code.replace(target, replaceWith);

fs.writeFileSync('src/app/chat/[id]/page.tsx', code);
