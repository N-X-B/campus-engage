const fs = require('fs');

const pages = ['src/app/privacy/page.tsx', 'src/app/terms/page.tsx', 'src/app/safety/page.tsx'];

for (const page of pages) {
  let code = fs.readFileSync(page, 'utf8');
  
  // Replace <Navigation /> with a custom static header
  const customNav = `
      <nav className="w-full px-6 py-5 bg-black/50 backdrop-blur-xl border-b border-white/5 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="text-xl font-bold tracking-tight text-white hover:scale-105 transition-transform">
          CampusEngage.
        </Link>
        <Link href="/" className="text-xs font-bold tracking-widest uppercase text-zinc-500 hover:text-white transition-colors">
          Back to Home
        </Link>
      </nav>
  `;
  
  code = code.replace('<Navigation />', customNav);
  code = code.replace("import { Navigation } from '@/components/Navigation';", "");
  
  fs.writeFileSync(page, code);
}
