const fs = require('fs');

let code = fs.readFileSync('src/app/chat/[id]/page.tsx', 'utf8');

const targetPoint = `<div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">`;

const replaceWith = `<div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          <div className="flex justify-center mt-2 mb-6">
            <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl flex items-center gap-2 max-w-sm text-center">
              <span className="text-yellow-500 text-sm">🔒</span>
              <p className="text-xs text-yellow-500/90 leading-tight">
                Messages are end-to-end encrypted. No one outside of this chat can read them.
              </p>
            </div>
          </div>`;

code = code.replace(targetPoint, replaceWith);

fs.writeFileSync('src/app/chat/[id]/page.tsx', code);
