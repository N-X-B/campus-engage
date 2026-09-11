const fs = require('fs');

function fixJSX(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Wrap with fragment
  code = code.replace(/<SonarBackground \/>\s*<div className="min-h-screen relative z-10([^>]+)>/g, '<>\n      <SonarBackground />\n      <div className="min-h-screen relative z-10$1>');
  
  // Find the last closing div before the end of the return statement and add closing fragment
  // Easiest is just replace the last '    </div>\n  );\n}' with '    </div>\n    </>\n  );\n}'
  // Or simply regex matching the end of the component
  code = code.replace(/<\/div>\s*\);\s*\}/, '</div>\n    </>\n  );\n}');

  // In profile/page.tsx, there might be multiple returns, let's just do it manually for safety
  
  fs.writeFileSync(file, code);
}

fixJSX('src/app/feed/page.tsx');
fixJSX('src/app/inbox/page.tsx');
fixJSX('src/app/profile/page.tsx');
