"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const JOBS = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    department: 'Technical Department',
    type: 'Internship / Full-time',
    location: 'Remote',
    description: 'Help build and scale our matchmaking algorithm and real-time messaging architecture using Next.js and Firebase.',
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    department: 'Design',
    type: 'Part-time / Internship',
    location: 'Remote',
    description: 'Craft beautiful, student-friendly, and highly engaging dark-mode interfaces for the next generation of campus networking.',
  },
  {
    id: 'techstat',
    title: 'Techstat (Data Analyst)',
    department: 'Data & Analytics',
    type: 'Internship',
    location: 'Remote',
    description: 'Analyze engagement metrics, optimize matchmaking algorithms, and derive insights from campus trends.',
  },
  {
    id: 'campus-ambassador',
    title: 'Campus Ambassador',
    department: 'Growth & Marketing',
    type: 'Part-time',
    location: 'On-Campus',
    description: 'Be the face of CampusEngage at your university. Drive user acquisition, host events, and spread the word.',
  }
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const openApplication = (job?: any) => {
    setSelectedJob(job || null);
    setSubmitStatus('idle');
    setIsModalOpen(true);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    // Simulate API submission
    setTimeout(() => {
      setSubmitStatus('success');
      setTimeout(() => setIsModalOpen(false), 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-white/20 overflow-hidden relative pb-20 text-white">
      
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-screen overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] bg-rose-500/10 rounded-full blur-[100px]" />
      </div>

      <nav className="p-6">
        <Link href="/" className="text-white font-black text-xl tracking-tighter">
          CampusEngage.
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-bold uppercase tracking-widest mb-6">
            Careers
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            Join Our Team
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
            We're looking for passionate people to help us build CampusEngage.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32">
          {JOBS.map((job, idx) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="bg-zinc-900/40 border border-white/5 hover:border-indigo-500/30 hover:bg-zinc-900/80 transition-all rounded-[2rem] p-8 flex flex-col group relative overflow-hidden"
            >
              {/* Card Hover Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/0 group-hover:bg-indigo-500/10 rounded-full blur-[40px] transition-colors -z-10" />

              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">
                  {job.department}
                </span>
                <h3 className="text-2xl font-bold text-white">{job.title}</h3>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium text-zinc-300 border border-white/5">
                  {job.type}
                </span>
                <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium text-zinc-300 border border-white/5">
                  📍 {job.location}
                </span>
              </div>

              <p className="text-zinc-400 leading-relaxed mb-8 flex-grow">
                {job.description}
              </p>

              <div className="flex gap-4 mt-auto">
                <button 
                  onClick={() => openApplication(job)}
                  className="flex-1 bg-white text-black py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  Apply Now
                </button>
                <button className="px-6 py-3 rounded-xl font-bold text-white border border-white/10 hover:bg-white/5 transition-colors">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-indigo-900/20 border border-indigo-500/20 rounded-[2.5rem] p-12 text-center max-w-3xl mx-auto mb-20 relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -z-10" />
          <h2 className="text-3xl font-bold mb-4">Don't see a suitable role?</h2>
          <p className="text-zinc-400 mb-8 text-lg">
            We are always on the lookout for hidden talent. If you think you can bring value to CampusEngage, we want to hear from you.
          </p>
          <button 
            onClick={() => openApplication(null)}
            className="px-8 py-4 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-400 transition-colors shadow-[0_0_30px_rgba(99,102,241,0.3)]"
          >
            Send us your profile →
          </button>
        </motion.div>
      </main>

      {/* Application Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-white/10 p-8 rounded-[2rem] w-full max-w-lg relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
              >
                ✕
              </button>

              <h2 className="text-3xl font-bold mb-2">
                {selectedJob ? 'Apply for Role' : 'General Application'}
              </h2>
              <p className="text-zinc-400 mb-6">
                Or email us directly at <a href="mailto:careers@campusengage.com" className="text-indigo-400 hover:underline">careers@campusengage.com</a>
              </p>

              {submitStatus === 'success' ? (
                <div className="py-20 text-center">
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Application Sent!</h3>
                  <p className="text-zinc-400">We will review your profile and get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Full Name</label>
                    <input type="text" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Email Address</label>
                    <input type="email" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">College / University</label>
                    <input type="text" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Role</label>
                    <input 
                      type="text" 
                      required 
                      defaultValue={selectedJob?.title || ''}
                      placeholder="e.g. Frontend Developer"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Resume / Portfolio Link</label>
                    <input type="url" required placeholder="https://" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Why do you want to join?</label>
                    <textarea required rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitStatus === 'submitting'}
                    className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-zinc-200 transition-colors mt-4"
                  >
                    {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
