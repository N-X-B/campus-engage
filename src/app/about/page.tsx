import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-white text-slate-900 font-sans selection:bg-slate-100">
      
      {/* Navigation */}
      <header className="w-full px-6 py-6 flex items-center justify-between border-b border-slate-100">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          CampusEngage.
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            Sign In
          </Link>
          <Link href="/register">
            <Button variant="default" className="bg-slate-900 text-white hover:bg-slate-800 rounded-md px-5 shadow-sm">
              Join Now
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-16 md:py-24">
        <div className="w-full max-w-3xl">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">How It Works</h1>
            <p className="text-lg text-slate-500 font-light">
              We ditched the cringe swiping. Here is how you actually make meaningful connections on campus.
            </p>
          </div>

          <div className="space-y-16">
            
            {/* Step 1 */}
            <section className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-900 font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">Set up your authentic profile</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Add 2 to 5 of your best photos, your major, your year, and write a genuine bio. No strict university email verification required for now—just jump right in.
                </p>
              </div>
            </section>

            {/* Step 2 */}
            <section className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-900 font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">The "Icebreaker" Mechanism</h3>
                <p className="text-slate-600 leading-relaxed">
                  Mindless left/right swiping is old and superficial. Instead, when you see someone you want to connect with, you initiate contact by answering an <strong>Icebreaker Prompt</strong> on their profile (e.g., "Best study spot on campus?" or "Unpopular cafeteria opinion"). It sparks an actual conversation from the very first interaction. If they reply, it's a match!
                </p>
              </div>
            </section>

            {/* Step 3 */}
            <section className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-900 font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">The Referral Unlock (Direct Messaging)</h3>
                <p className="text-slate-600 leading-relaxed">
                  Want to skip the icebreakers and just send a direct message to someone you're interested in? 
                  <strong> If you invite and onboard students to the platform, you unlock the ability to direct message anyone on the site.</strong> 
                  Help us grow the community, and you get premium connection perks in return.
                </p>
              </div>
            </section>

          </div>

          <div className="mt-20 text-center">
            <Link href="/register">
              <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-md px-10 py-6 text-lg shadow-sm">
                Ready to connect? Join Now
              </Button>
            </Link>
          </div>

        </div>
      </main>

      <footer className="w-full py-8 text-center border-t border-slate-100 mt-auto">
        <p className="text-sm text-slate-400">
          © 2026 CampusEngage.
        </p>
      </footer>
    </div>
  );
}
