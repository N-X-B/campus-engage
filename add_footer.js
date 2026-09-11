const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

const footerCode = `
      {/* Footer */}
      <footer className="border-t border-white/5 py-16 px-6 bg-black text-sm relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase mb-6 text-xs">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-zinc-500 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-zinc-500 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="text-zinc-500 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-zinc-500 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase mb-6 text-xs">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-zinc-500 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-zinc-500 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/safety" className="text-zinc-500 hover:text-white transition-colors">Safety Tips</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase mb-6 text-xs">Social</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors cursor-none">Instagram</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors cursor-none">TikTok</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors cursor-none">Twitter</a></li>
            </ul>
          </div>
          <div>
            <div className="text-2xl font-extrabold tracking-tighter text-white mb-4">
              CampusEngage.
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              The mathematics of vibes.<br />
              Built for students, by students.
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 text-xs font-mono">
          <p>© {new Date().getFullYear()} CampusEngage Inc.</p>
          <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> All systems operational.</p>
        </div>
      </footer>
    </div>
  );
}
`;

code = code.replace(/    <\/div>\n  \);\n\}\n?$/, footerCode);

fs.writeFileSync('src/app/page.tsx', code);
