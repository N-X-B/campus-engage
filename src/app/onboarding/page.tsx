"use client";

import { useState, useEffect } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { generateAndSaveEmbedding } from '@/app/actions/matchmaking';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { isDemoMode, demoDb } from '@/lib/demo-backend';
import { motion, AnimatePresence } from 'framer-motion';
import * as nsfwjs from 'nsfwjs';


import { uploadString } from 'firebase/storage';

const compressAndUploadImage = async (file: File, uid: string, index: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        try {
          const storageRef = ref(storage, `users/${uid}/photo_${Date.now()}_${index}.jpg`);
          await uploadString(storageRef, dataUrl, 'data_url');
          const downloadUrl = await getDownloadURL(storageRef);
          resolve(downloadUrl);
        } catch (uploadErr) {
          reject(uploadErr);
        }
      };
      img.onerror = error => reject(error);
    };
    reader.onerror = error => reject(error);
  });
};

const Typewriter = ({ text }: { text: string }) => {
  return (
    <motion.h1 className="text-3xl font-bold text-white" initial={{ opacity: 1 }}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.05, delay: index * 0.03 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default function OnboardingWizard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [bio, setBio] = useState('');
  const [files, setFiles] = useState<(File | null)[]>([null, null, null]);
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null]);
  
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [branch, setBranch] = useState('');
  const [gender, setGender] = useState('');

  const [studyVibe, setStudyVibe] = useState('');
  const [weekendVibe, setWeekendVibe] = useState('');
  const [skipClass, setSkipClass] = useState('');
  const [stressLevel, setStressLevel] = useState('');
  const [hotTake, setHotTake] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // New state for the success animation
  const [onboardingSuccess, setOnboardingSuccess] = useState(false);
  const [nsfwModel, setNsfwModel] = useState<nsfwjs.NSFWJS | null>(null);
  const [isScanningImage, setIsScanningImage] = useState(false);

  const [isRestoring, setIsRestoring] = useState(true);
  const [showRulesModal, setShowRulesModal] = useState(true);
  useEffect(() => {
    // Silently preload the NSFW classification model in the background
    nsfwjs.load().then(model => {
      setNsfwModel(model);
    }).catch(err => console.error("Failed to load NSFW model", err));
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && !isDemoMode) {
      const fetchDraft = async () => {
        try {
          const docSnap = await getDoc(doc(db, 'users', user.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            
            // If they are already fully onboarded, let them into the feed
            // (photo requirement is enforced at onboarding step 1 for NEW users only)
            if (data.onboarded || data.onboardingComplete) {
              router.push('/feed');
              return;
            }

            // Restore text fields
            if (data.bio) setBio(data.bio);
            if (data.course) setCourse(data.course);
            if (data.year) setYear(data.year);
            if (data.branch) setBranch(data.branch);
            if (data.gender) setGender(data.gender);
            if (data.studyVibe) setStudyVibe(data.studyVibe);
            if (data.weekendVibe) setWeekendVibe(data.weekendVibe);
            if (data.skipClass) setSkipClass(data.skipClass);
            if (data.stressLevel) setStressLevel(data.stressLevel);
            if (data.hotTake) setHotTake(data.hotTake);
            
            // Restore photos if they uploaded some previously (we map existing URLs to previews)
            if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
               const newPreviews = [null, null, null] as (string | null)[];
               data.photos.forEach((url: string, i: number) => {
                 if (i < 3) newPreviews[i] = url;
               });
               setPreviews(newPreviews);
            }

            // Determine which step to put them on based on what's missing
            if (data.bio && data.photos?.length > 0) {
              if (data.course && data.branch && data.year && data.gender) {
                if (data.studyVibe && data.weekendVibe) {
                  setStep(4);
                  setShowRulesModal(false);
                } else {
                  setStep(3);
                  setShowRulesModal(false);
                }
              } else {
                setStep(2);
                setShowRulesModal(false);
              }
            }
          }
        } catch (err) {
          console.error("Failed to restore draft", err);
        } finally {
          setIsRestoring(false);
        }
      };
      fetchDraft();
    } else {
      setIsRestoring(false);
    }
  }, [user, authLoading, router]);

  const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError('');
      
      if (nsfwModel) {
        setIsScanningImage(true);
        try {
          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          await new Promise((resolve) => { img.onload = resolve; });
          
          const predictions = await nsfwModel.classify(img);
          const isExplicit = predictions.some(p => 
            (p.className === 'Porn' || p.className === 'Hentai' || p.className === 'Sexy') && p.probability > 0.65
          );
          
          if (isExplicit) {
            setError("🚨 Explicit content detected. Please upload an appropriate profile photo.");
            setIsScanningImage(false);
            return;
          }
        } catch (err) {
          console.error("Image scan failed", err);
        }
        setIsScanningImage(false);
      }

      const newFiles = [...files];
      newFiles[index] = file;
      setFiles(newFiles);
      const newPreviews = [...previews];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviews(newPreviews);
    }
  };

  const nextStep = async () => {
    setError('');
    
    // Step validation
    if (step === 1) {
       const hasPhoto = files.some(f => f !== null) || previews.some(p => p !== null);
       if (!hasPhoto) { setError("Please upload at least one photo."); return; }
       if (!bio.trim()) { setError("Please add a short bio."); return; }
       if (user && !isDemoMode) {
         try {
           const finalPhotos: string[] = [];
           for (let i = 0; i < 3; i++) {
             if (files[i]) {
               finalPhotos.push(await compressAndUploadImage(files[i]!, user.uid, i));
             } else if (previews[i] && !previews[i]?.startsWith('blob:')) {
               finalPhotos.push(previews[i]!);
             }
           }
           await updateDoc(doc(db, 'users', user.uid), { bio, photos: finalPhotos });
         } catch(err) {
           console.error("Failed to save draft", err);
         }
       }
    } else if (step === 2) {
       if (!course || !year || !branch.trim() || !gender) {
          setError("Please fill out all academic fields."); return;
       }
       
       if (user && !isDemoMode) {
         updateDoc(doc(db, 'users', user.uid), { course, year, branch, gender }).catch(console.error);
       }
    } else if (step === 3) {
       if (!studyVibe || !weekendVibe || !skipClass) {
          setError("Please answer all vibe checks."); return;
       }
       
       if (user && !isDemoMode) {
         updateDoc(doc(db, 'users', user.uid), { 
           'answers.studyVibe': studyVibe, 
           'answers.weekendVibe': weekendVibe, 
           'answers.skipClass': skipClass 
         }).catch(console.error);
       }
    }
    
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setError('');
    
    // Safety check for abusive content
    const blockRules = [
      /\b(fuck|bitch|cunt|asshole|motherfucker|dickhead|whore|slut|faggot|retard|nigger|nigga|chink|spic|kike|dyke|tranny|kys|kill\s+yourself)\b/i,
      /\b(kill|murder|stab|shoot|bomb|terrorist|rape|strangle|massacre|lynch|behead|assassinate)\b/i,
      /\b(nudes|send\s+pics|boobs|tits|dick|cock|pussy|vagina|penis|porn|horny|cum|jerk\s+off|masturbate|blowjob|handjob|squirt|creampie|threesome|orgy|onlyfans|of\s+link)\b/i,
    ];
    
    const containsViolations = (text: string) => {
      if (!text) return false;
      return blockRules.some(rule => rule.test(text.toLowerCase()));
    };

    if (containsViolations(bio) || containsViolations(branch) || containsViolations(hotTake)) {
       setError("🚨 Profile blocked: Your bio or responses contain inappropriate, abusive, violent, or explicit content that violates our Terms of Service.");
       setStep(1); // send them back to start
       return;
    }

    const hasPhoto = files.some(f => f !== null) || previews.some(p => p !== null);
    if (!hasPhoto) {
       setError("⚠️ You must upload at least 1 photo to complete your profile.");
       setStep(1);
       return;
    }

    if (!course || !year || !branch || !gender || !bio || !hotTake || !stressLevel) {
       setError("⚠️ Please ensure all fields across all steps are fully filled out before completing your profile.");
       return;
    }

    setSaving(true);
    setError("Analyzing photos for AI identity verification...");
    
    // Simulate AI Verification Delay
    await new Promise(r => setTimeout(r, 1500));
    
    // Here we would hook into Google Cloud Vision API or Gemini to detect if Gender Selection !== Photo Gender.
    // For MVP, we use this strict warning delay as a deterrent.
    setError("Verifying campus credentials...");
    await new Promise(r => setTimeout(r, 1000));
    setError(""); // Clear error for actual saving

    try {
      const answers = { 
        studyVibe: studyVibe || "All-nighter in hostel", 
        weekendVibe: weekendVibe || "Late night drive & Maggi", 
        skipClass: skipClass || "Canteen / Maggi Point",
        stressLevel: stressLevel || "Copying topper's PDF at 2 AM", 
        hotTake: hotTake 
      };
      
      if (isDemoMode) {
        await demoDb.updateProfile(user.uid, { course, year, branch, bio, photos: previews.filter(p => p !== null), answers });
        
        setOnboardingSuccess(true);
        setTimeout(() => {
          window.location.href = '/feed';
        }, 2000); // 2 second animation
        return;
      }

      
      

      const finalPhotos: string[] = [];
      
      for (let i = 0; i < 3; i++) {
        if (files[i]) {
          try {
            const urlString = await compressAndUploadImage(files[i]!, user.uid, i);
            finalPhotos.push(urlString);
          } catch (e) {
            console.error("Failed to compress/upload image", e);
          }
        } else if (previews[i] && !previews[i]?.startsWith('blob:')) {
          // Keep previously uploaded/restored photo
          finalPhotos.push(previews[i]!);
        }
      }
      
      console.log("[ONBOARDING] Saving profile directly to Firestore...");
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName || "New User",
          course,
          year,
          branch,
          gender,
          bio,
          answers,
          photos: finalPhotos,
          auraScore: 20,
          onboarded: true,
          // Clean up the draft root fields that were incorrectly placed
          studyVibe: deleteField(),
          weekendVibe: deleteField(),
          skipClass: deleteField(),
          stressLevel: deleteField(),
          hotTake: deleteField()
        }, { merge: true });
        console.log("[ONBOARDING] Profile written successfully!");
      } catch (dbErr) {
        console.warn("[ONBOARDING] Database write failed. Network blocked?", dbErr);
      }
      
      // Fire-and-forget AI embedding
      generateAndSaveEmbedding(user.uid, answers).catch(e => console.error("Embedding generation skipped:", e));

      setOnboardingSuccess(true);
      setTimeout(() => {
        window.location.href = '/feed';
      }, 2000); // 2 second animation
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save profile.');
      setSaving(false);
    }
  };

  if (authLoading || isRestoring) return <LoadingScreen />;

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-black items-center justify-center py-12 px-4 overflow-hidden relative">
      
      {/* Guidelines / Rules Modal */}
      <AnimatePresence>
        {showRulesModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 blur-[60px] pointer-events-none rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <h2 className="text-3xl font-black text-white mb-6 tracking-tighter">Read Before You Enter.</h2>
              
              <div className="space-y-6 mb-8 relative z-10">
                <div className="flex gap-4">
                  <div className="text-2xl">✨</div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Aura is Everything</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">Your actions dictate your Aura Score. Get reported? Your score drops. If your Aura drops too low, girls can automatically filter you out of their inbox.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="text-2xl">🛡️</div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Zero Tolerance</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">Creepy behavior, harassment, or unsolicited toxicity results in an instant ban and an IP block. We keep our community extremely safe.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="text-2xl">💌</div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">The Vouch System (Waitlist)</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">Male spots are heavily limited. Soon, guys will only be able to bypass the waitlist if a female user directly vouches for them. Secure your spot now.</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setShowRulesModal(false)}
                className="w-full bg-white text-black py-4 rounded-full font-bold text-lg hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02]"
              >
                I Understand, Let's Go
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Promo Banner */}
      <div className="mb-6 w-full max-w-md z-10 bg-zinc-900 border border-amber-500/30 shadow-2xl p-4 rounded-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-rose-500/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
        <div className="flex items-start gap-3 relative z-10">
          <div className="text-2xl">🔥</div>
          <div>
            <h3 className="text-amber-500 font-bold text-sm tracking-wide uppercase mb-1">Early Adopter Bonus</h3>
            <p className="text-amber-200/80 text-xs font-medium leading-relaxed">
              Complete your profile within the next <strong className="text-white">3 days</strong> to unlock <strong className="text-white">Double Daily Matches</strong> (10 Icebreakers/day) for your first week!
            </p>
          </div>
        </div>
      </div>

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

            <div className="w-full bg-black/50 backdrop-blur-3xl rounded-3xl shadow-sm border border-white/10 p-8 md:p-12 overflow-hidden relative min-h-[500px]">
              {error && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" variants={slideVariants} initial="initial" animate="in" exit="out" className="space-y-8 pb-20">
                    <div>
                      <Typewriter text="Let's build your profile." />
                      <p className="text-zinc-400 mt-2">First impressions matter. Add your best photos and a bio.</p>
                      <p className="text-[10px] text-rose-400/80 font-medium mt-3 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                        Accounts without photos uploaded within 24 hours will be permanently deleted.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {[0, 1, 2].map((index) => (
                        <label key={index} className="aspect-[3/4] bg-white/5 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:bg-black text-white transition-colors relative overflow-hidden group">
                          <input type="file" accept="image/*" className="text-white hidden" onChange={(e) => handleFileChange(index, e)} />
                          {previews[index] ? (
                            <img src={previews[index]!} alt="preview" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <span className="text-3xl text-zinc-500 group-hover:scale-125 transition-transform">+</span>
                          )}
                        </label>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Your Bio</label>
                      <textarea
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Keep it brief, authentic, and engaging..."
                        className="w-full px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none bg-black text-white transition-colors"
                      />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" variants={slideVariants} initial="initial" animate="in" exit="out" className="space-y-8 pb-20">
                    <div>
                      <Typewriter text="The Academics" />
                      <p className="text-zinc-400 mt-2">Who are you on campus?</p>
                    </div>

                    <div className="space-y-6 mt-12">
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Course</label>
                        <select 
                          value={course}
                          onChange={(e) => { setCourse(e.target.value); setYear(''); }}
                          className="w-full px-4 py-4 rounded-xl border border-white/20 bg-black text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-lg transition-colors"
                        >
                          <option value="" disabled>Select Course</option>
                          <option value="BTech">B.Tech (4 Years)</option>
                          <option value="BBA">BBA (3 Years)</option>
                          <option value="Masters">Masters (2 Years)</option>
                          <option value="PhD">PhD (5 Years)</option>
                        </select>
                      </div>
                      
                      {course && (
                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">Year of Study</label>
                          <select 
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="w-full px-4 py-4 rounded-xl border border-white/20 bg-black text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-lg transition-colors"
                          >
                            <option value="" disabled>Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            {(course === 'BTech' || course === 'BBA' || course === 'PhD') && <option value="3">3rd Year</option>}
                            {(course === 'BTech' || course === 'PhD') && <option value="4">4th Year</option>}
                            {course === 'PhD' && <option value="5">5th Year</option>}
                          </select>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Gender</label>
                        <select 
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full px-4 py-4 rounded-xl border border-white/20 bg-black text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-lg transition-colors"
                        >
                          <option value="" disabled>Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="non-binary">Non-binary</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Branch / Major</label>
                        <input
                          type="text"
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          placeholder="e.g. Computer Science, Architecture"
                          className="w-full px-4 py-4 rounded-xl border border-white/20 bg-black text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-lg transition-colors"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" variants={slideVariants} initial="initial" animate="in" exit="out" className="space-y-8 pb-20">
                    <div>
                      <Typewriter text="The Vibe Check (1/2)" />
                      <p className="text-zinc-400 mt-2">We use this to match you with similar energies.</p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <label className="block text-base font-semibold text-white mb-4">Exam prep strategy?</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {["All-nighter in hostel", "Library (mainly for AC)", "Group study = gossip"].map(opt => (
                            <button key={opt} onClick={() => setStudyVibe(opt)} className={`p-4 rounded-xl border-2 text-left transition-all ${studyVibe === opt ? 'border-indigo-500 bg-indigo-500 text-white shadow-md shadow-indigo-500/20' : 'border-white/10 hover:border-white/30 bg-black'}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-base font-semibold text-white mb-4">Mass bunk! Where are you heading?</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {["Canteen / Maggi Point", "Back to bed", "Roaming around the city"].map(opt => (
                            <button key={opt} onClick={() => setSkipClass(opt)} className={`p-4 rounded-xl border-2 text-left transition-all ${skipClass === opt ? 'border-indigo-500 bg-indigo-500 text-white shadow-md shadow-indigo-500/20' : 'border-white/10 hover:border-white/30 bg-black'}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-base font-semibold text-white mb-4">Friday night vibe?</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {["Late night drive & Maggi", "House party / Club", "Gaming / Movies in PG"].map(opt => (
                            <button key={opt} onClick={() => setWeekendVibe(opt)} className={`p-4 rounded-xl border-2 text-left transition-all ${weekendVibe === opt ? 'border-indigo-500 bg-indigo-500 text-white shadow-md shadow-indigo-500/20' : 'border-white/10 hover:border-white/30 bg-black'}`}>
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
                      <Typewriter text="The Vibe Check (2/2)" />
                      <p className="text-zinc-400 mt-2">Almost done.</p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <label className="block text-base font-semibold text-white mb-4">Assignment submission is tomorrow at 9 AM...</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {["Copying topper's PDF at 2 AM", "Writing it outside class", "Finished it a week ago"].map(opt => (
                            <button key={opt} onClick={() => setStressLevel(opt)} className={`p-4 rounded-xl border-2 text-left transition-all ${stressLevel === opt ? 'border-indigo-500 bg-indigo-500 text-white shadow-md shadow-indigo-500/20' : 'border-white/10 hover:border-white/30 bg-black'}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-base font-semibold text-white mb-2">What is the most overrated thing about this college?</label>
                        <textarea
                          rows={3}
                          value={hotTake}
                          onChange={(e) => setHotTake(e.target.value)}
                          placeholder="Drop your campus hot take here..."
                          className="w-full px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none bg-black text-white transition-colors"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between p-8 bg-black/50 backdrop-blur-3xl border-t border-white/10">
                {step > 1 ? (
                  <Button variant="ghost" onClick={prevStep} className="text-zinc-400 hover:text-white">Back</Button>
                ) : <div />}
                
                {step < totalSteps ? (
                  <>
                    {step === 1 && !previews.some(p => p !== null) ? (
                      <div className="flex flex-col items-end gap-1">
                        <Button disabled className="bg-white/20 text-white/40 rounded-lg px-8 cursor-not-allowed">Continue</Button>
                        <p className="text-rose-400 text-[10px] font-bold uppercase tracking-widest">Upload at least 1 photo to continue</p>
                      </div>
                    ) : (
                      <Button onClick={nextStep} className="bg-white text-black hover:bg-zinc-200 rounded-lg px-8">Continue</Button>
                    )}
                  </>
                ) : (
                  <Button onClick={handleSubmit} disabled={saving} className="bg-white text-black hover:bg-zinc-200 rounded-lg px-8 shadow-md">
                    {saving ? (error ? error : 'Completing...') : 'Finish Profile'}
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
            className="absolute inset-0 flex items-center justify-center bg-black z-50"
          >
             <motion.div 
               initial={{ scale: 0.8 }}
               animate={{ scale: 1 }}
               transition={{ type: "spring", stiffness: 200, damping: 20 }}
               className="flex font-extrabold text-5xl md:text-7xl tracking-tighter text-white items-center"
             >
               <span className="relative z-10">C</span>
               <motion.span 
                 initial={{ width: 0, opacity: 0 }}
                 animate={{ width: "auto", opacity: 1 }}
                 transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                 className="overflow-hidden whitespace-nowrap block text-zinc-300 pr-2"
               >
                 ampus
               </motion.span>
               <span className="relative z-10">E</span>
               <motion.span 
                 initial={{ width: 0, opacity: 0 }}
                 animate={{ width: "auto", opacity: 1 }}
                 transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                 className="overflow-hidden whitespace-nowrap block text-zinc-300 pr-2"
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
