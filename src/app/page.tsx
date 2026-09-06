import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-white text-slate-900 font-sans selection:bg-slate-100">
      
      {/* Minimalist Navigation */}
      <header className="w-full px-6 py-6 flex items-center justify-between border-b border-slate-100">
        <div className="text-xl font-semibold tracking-tight">
          CampusEngage.
        </div>
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

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <section className="w-full max-w-4xl py-20 md:py-32 flex flex-col items-center text-center">
          
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-slate-900 mr-2"></span>
            Exclusive to university students
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Meaningful connections <br className="hidden sm:block"/> start here.
          </h1>
          
          <p className="max-w-2xl text-lg sm:text-xl text-slate-500 mb-10 font-light leading-relaxed">
            A refined space to meet, connect, and date within your university network. Designed for students who value authenticity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/register">
              <Button className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 rounded-md px-8 py-6 text-lg h-14 shadow-sm">
                Create Account
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="w-full sm:w-auto rounded-md px-8 py-6 text-lg h-14 border-slate-200 text-slate-600 hover:bg-slate-50">
                How it works
              </Button>
            </Link>
          </div>

        </section>
      </main>

      <footer className="w-full py-8 text-center border-t border-slate-100">
        <p className="text-sm text-slate-400">
          © 2026 CampusEngage.
        </p>
      </footer>
    </div>
  );
}
