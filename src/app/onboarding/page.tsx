"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { isDemoMode, demoDb } from '@/lib/demo-backend';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingWizard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [bio, setBio] = useState('');
  const [files, setFiles] = useState<(File | null)[]>([null, null, null]);
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null]);
  
  const [year, setYear] = useState('');
  const [branch, setBranch] = useState('');

  const [studyVibe, setStudyVibe] = useState('');
  const [weekendVibe, setWeekendVibe] = useState('');
  const [stressLevel, setStressLevel] = useState('');
  const [hotTake, setHotTake] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // New state for the success animation
  const [onboardingSuccess, setOnboardingSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFiles = [...files];
      newFiles[index] = file;
      setFiles(newFiles);
      const newPreviews = [...previews];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviews(newPreviews);
    }
  };

  const nextStep = () => {
    setError('');
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setError('');
    setSaving(true);

    try {
      const answers = { 
        studyVibe: studyVibe || "Dead Silence (Library)", 
        weekendVibe: weekendVibe || "Downtown Bar", 
        stressLevel: stressLevel || "12 hours before", 
        hotTake: hotTake || "I have no hot takes." 
      };
      
      if (isDemoMode) {
        await demoDb.updateProfile(user.uid, { year, branch, bio, photos: previews.filter(p => p !== null), answers });
        
        setOnboardingSuccess(true);
        setTimeout(() => {
          router.push('/feed');
        }, 3000); // 3 second animation
        return;
      }

      const validFiles = files.filter(f => f !== null) as File[];
      const photoUrls: string[] = [];
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const storageRef = ref(storage, `users/${user.uid}/photo_${i}_${Date.now()}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        photoUrls.push(url);
      }

      await updateDoc(doc(db, 'users', user.uid), {
        year,
        branch,
        bio,
        answers,
        photos: photoUrls,
        onboarded: true,
      });

      setOnboardingSuccess(true);
      setTimeout(() => {
        router.push('/feed');
      }, 3000); // 3 second animation
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save profile.');
      setSaving(false);
    }
  };

  if (authLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-50 items-center justify-center py-12 px-4 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {!onboardingSuccess ? (
          <motion.div 
            key="wizard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(5px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full max-w-2xl flex flex-col items-center z-10"
          >
            {/* Progress Bar */}
            <div className="w-full mb-8 flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-slate-900' : 'bg-slate-200'}`} />
              ))}
            </div>

            <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 overflow-hidden relative min-h-[500px]">
              {error && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" variants={slideVariants} initial="initial" animate="in" exit="out" className="space-y-8 pb-20">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900">Let's build your profile.</h1>
                      <p className="text-slate-500 mt-2">First impressions matter. Add your best photos and a bio.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {[0, 1, 2].map((index) => (
                        <label key={index} className="aspect-[3/4] bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative overflow-hidden group">
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(index, e)} />
                          {previews[index] ? (
                            <img src={previews[index]!} alt="preview" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <span className="text-3xl text-slate-400 group-hover:scale-125 transition-transform">+</span>
                          )}
                        </label>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Your Bio</label>
                      <textarea
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Keep it brief, authentic, and engaging..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 resize-none bg-slate-50 transition-colors"
                      />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" variants={slideVariants} initial="initial" animate="in" exit="out" className="space-y-8 pb-20">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900">The Academics</h1>
                      <p className="text-slate-500 mt-2">Who are you on campus?</p>
                    </div>

                    <div className="space-y-6 mt-12">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Year of Study</label>
                        <select 
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-lg transition-colors"
                        >
                          <option value="" disabled>Select Year</option>
                          <option value="1">1st Year (Fresher)</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                          <option value="postgrad">Postgraduate</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Branch / Major</label>
                        <input
                          type="text"
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          placeholder="e.g. Computer Science, Architecture"
                          className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-lg transition-colors"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" variants={slideVariants} initial="initial" animate="in" exit="out" className="space-y-8 pb-20">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900">The Vibe Check (1/2)</h1>
                      <p className="text-slate-500 mt-2">We use this to match you with similar energies.</p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <label className="block text-base font-semibold text-slate-900 mb-4">Dead silence in the library, or low-fi beats in a busy coffee shop?</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {["Dead Silence (Library)", "Low-fi Beats (Coffee Shop)"].map(opt => (
                            <button key={opt} onClick={() => setStudyVibe(opt)} className={`p-4 rounded-xl border-2 text-left transition-all ${studyVibe === opt ? 'border-slate-900 bg-slate-900 text-white shadow-md' : 'border-slate-100 hover:border-slate-300 bg-slate-50'}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-base font-semibold text-slate-900 mb-4">Friday night vibe?</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {["Frat Basement", "Downtown Bar", "Movie in Dorm"].map(opt => (
                            <button key={opt} onClick={() => setWeekendVibe(opt)} className={`p-4 rounded-xl border-2 text-left transition-all ${weekendVibe === opt ? 'border-slate-900 bg-slate-900 text-white shadow-md' : 'border-slate-100 hover:border-slate-300 bg-slate-50'}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="step4" variants={slideVariants} initial="initial" animate="in" exit="out" className="space-y-8 pb-20">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900">The Vibe Check (2/2)</h1>
                      <p className="text-slate-500 mt-2">Almost done.</p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <label className="block text-base font-semibold text-slate-900 mb-4">Do you start essays a week early, or 12 hours before the deadline?</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {["A week early", "12 hours before"].map(opt => (
                            <button key={opt} onClick={() => setStressLevel(opt)} className={`p-4 rounded-xl border-2 text-left transition-all ${stressLevel === opt ? 'border-slate-900 bg-slate-900 text-white shadow-md' : 'border-slate-100 hover:border-slate-300 bg-slate-50'}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-base font-semibold text-slate-900 mb-2">What is the most overrated tradition at this university?</label>
                        <textarea
                          rows={3}
                          value={hotTake}
                          onChange={(e) => setHotTake(e.target.value)}
                          placeholder="Drop your campus hot take here..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 resize-none bg-slate-50 transition-colors"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between p-8 bg-white border-t border-slate-100">
                {step > 1 ? (
                  <Button variant="ghost" onClick={prevStep} className="text-slate-500 hover:text-slate-900">Back</Button>
                ) : <div />}
                
                {step < totalSteps ? (
                  <Button onClick={nextStep} className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-8">Continue</Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={saving} className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-8 shadow-md">
                    {saving ? 'Completing...' : 'Finish Profile'}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="success-brand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-slate-50 z-50"
          >
             <motion.div 
               initial={{ scale: 0.8 }}
               animate={{ scale: 1 }}
               transition={{ type: "spring", stiffness: 200, damping: 20 }}
               className="flex font-extrabold text-5xl md:text-7xl tracking-tighter text-slate-900 items-center"
             >
               <span className="relative z-10">C</span>
               <motion.span 
                 initial={{ width: 0, opacity: 0 }}
                 animate={{ width: "auto", opacity: 1 }}
                 transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                 className="overflow-hidden whitespace-nowrap block text-slate-800 pr-2"
               >
                 ampus
               </motion.span>
               <span className="relative z-10">E</span>
               <motion.span 
                 initial={{ width: 0, opacity: 0 }}
                 animate={{ width: "auto", opacity: 1 }}
                 transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                 className="overflow-hidden whitespace-nowrap block text-slate-800 pr-2"
               >
                 ngage.
               </motion.span>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
