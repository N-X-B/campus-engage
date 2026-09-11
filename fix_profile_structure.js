const fs = require('fs');
let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

// The corrupted block:
const corruptBlock = `                   </div>
                   {isIncognito ? 'On' : 'Off'}
                </span>
             </div>
                   </div>
                   Off
                </span>
             </div>
          </div>`;

const cleanBlock = `                   </div>
                   {isIncognito ? 'On' : 'Off'}
                </span>
             </div>
          </div>`;

code = code.replace(corruptBlock, cleanBlock);
fs.writeFileSync('src/app/profile/page.tsx', code);
