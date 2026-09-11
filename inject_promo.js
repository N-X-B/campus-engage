const fs = require('fs');

function injectPromo(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  const promoHTML = `
      {/* Promo Banner */}
      <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/30 p-4 rounded-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-rose-500/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
        <div className="flex items-start gap-3 relative z-10">
          <div className="text-2xl">🔥</div>
          <div>
            <h3 className="text-amber-500 font-bold text-sm tracking-wide uppercase mb-1">Early Adopter Bonus</h3>
            <p className="text-amber-500/80 text-xs font-medium leading-relaxed">
              Complete your profile within the next <strong className="text-white">3 days</strong> to unlock <strong className="text-white">Double Daily Matches</strong> (14 Icebreakers/day) for your first week!
            </p>
          </div>
        </div>
      </div>
  `;

  if (file.includes('register')) {
    code = code.replace('{error && (', promoHTML + '\n      {error && (');
  } else if (file.includes('onboarding')) {
    code = code.replace('<form', promoHTML + '\n        <form');
  } else if (file.includes('page.tsx') && !file.includes('feed') && !file.includes('inbox') && !file.includes('profile')) {
    // maybe landing page? 
  }
  
  fs.writeFileSync(file, code);
}

injectPromo('src/app/register/page.tsx');
injectPromo('src/app/onboarding/page.tsx');
