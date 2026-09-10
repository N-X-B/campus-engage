"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';

const INTEREST_GROUPS = {
  "Academics 📚": ["Study Group", "Library Grind", "Tech & Hackathons", "Startup Building"],
  "Social & Nightlife 🪩": ["Greek Life", "Bar Crawls", "House Parties", "Cafe Hopping"],
  "Hobbies & Arts 🎨": ["Dance Crew", "Jam Sessions", "Gaming & Esports", "Photography"],
  "Sports & Fitness 💪": ["Gym Partners", "Intramural Sports", "Running / Hiking", "Yoga & Wellness"]
};

import { isDemoMode, demoAuth } from '@/lib/demo-backend';
import { auth } from '@/lib/firebase';
import { signOut, deleteUser } from 'firebase/auth';
import { doc, deleteDoc, getDoc, updateDoc, setDoc, arrayUnion, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { deleteUserEmbedding } from '@/app/actions/matchmaking';
import { motion, AnimatePresence } from 'framer-motion';
import * as nsfwjs from 'nsfwjs';

const compressImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
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
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [editingInterests, setEditingInterests] = useState(false);
  const [interestError, setInterestError] = useState("");
  const [appVotes, setAppVotes] = useState<string[]>([]);
  const [isVoting, setIsVoting] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isIncognito, setIsIncognito] = useState(false);
  const [showEditAnswersModal, setShowEditAnswersModal] = useState(false);
  const [editAnswers, setEditAnswers] = useState({
    studyVibe: '',
    weekendVibe: '',
    stressLevel: '',
    hotTake: ''
  });
  const [savingAnswers, setSavingAnswers] = useState(false);
  const [editBranch, setEditBranch] = useState('');

  // Photo Edit Modal State
  const [showEditPhotosModal, setShowEditPhotosModal] = useState(false);
  const [editPhotos, setEditPhotos] = useState<(string | null)[]>([null, null, null]);
  const [nsfwModel, setNsfwModel] = useState<nsfwjs.NSFWJS | null>(null);
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [savingPhotos, setSavingPhotos] = useState(false);

  useEffect(() => {
    // Silently preload the NSFW classification model in the background when profile loads
    nsfwjs.load().then(model => {
      setNsfwModel(model);
    }).catch(err => console.error("Failed to load NSFW model", err));
  }, []);
  
  useEffect(() => {
    if (userData) {
       setIsIncognito(userData.incognito || false);
    }
  }, [userData]);

  const toggleIncognito = async () => {
    const newValue = !isIncognito;
    setIsIncognito(newValue);
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(30);
    
    try {
       await updateDoc(doc(db, 'users', user!.uid), { incognito: newValue });
       setUserData({ ...userData, incognito: newValue });
       
       if (newValue === true) {
         router.push('/confessions');
       }
    } catch(err) {
       console.error("Failed to toggle incognito", err);
    }
  };

  
  useEffect(() => {
    if (userData?.interests) {
      setSelectedInterests(userData.interests);
    }
  }, [userData]);
  
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const pollDoc = await getDoc(doc(db, 'polls', 'app_demand'));
        if (pollDoc.exists()) {
           setAppVotes(pollDoc.data().voted_uids || []);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchPoll();
  }, []);

  const handleVoteApp = async () => {
    if (!user || appVotes.includes(user.uid)) return;
    setIsVoting(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([30, 60, 40]);
    try {
      const pollRef = doc(db, 'polls', 'app_demand');
      const pollDoc = await getDoc(pollRef);
      if (!pollDoc.exists()) {
        await setDoc(pollRef, { voted_uids: [user.uid] });
      } else {
        await updateDoc(pollRef, { voted_uids: arrayUnion(user.uid) });
      }
      setAppVotes(prev => [...prev, user.uid]);
    } catch (e) {
      console.error(e);
    }
    setIsVoting(false);
  };
  const handlePhotoChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError('');

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
          setPhotoError("🚨 Explicit content detected. Please select a different photo.");
          setIsScanningImage(false);
          return;
        }
      } catch (err) {
        console.error("Image scan failed", err);
      }
      setIsScanningImage(false);
    }

    try {
      const base64 = await compressImageToBase64(file);
      const newPhotos = [...editPhotos];
      newPhotos[index] = base64;
      setEditPhotos(newPhotos);
    } catch (err) {
      setPhotoError("Failed to process image.");
    }
  };

  const handleSavePhotos = async () => {
    if (!user) return;
    
    // Validate they have at least one photo
    if (!editPhotos.some(p => p !== null)) {
      setPhotoError("You must have at least one profile photo.");
      return;
    }

    setSavingPhotos(true);
    try {
      const cleanPhotos = editPhotos.filter(p => p !== null);
      await updateDoc(doc(db, 'users', user.uid), { photos: cleanPhotos });
      setUserData({ ...userData, photos: cleanPhotos });
      setShowEditPhotosModal(false);
    } catch (err) {
      console.error(err);
      setPhotoError("Failed to save photos.");
    }
    setSavingPhotos(false);
  };


  const handleToggleInterest = (interest: string) => {
    setInterestError("");
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      if (selectedInterests.length >= 5) {
        setInterestError("You can only select up to 5 campus groups!");
        return;
      }
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const saveInterests = async () => {
    try {
      await updateDoc(doc(db, 'users', user!.uid), { interests: selectedInterests });
      setEditingInterests(false);
      setUserData({ ...userData, interests: selectedInterests });
    } catch (err) {
      console.error(err);
    }
  };


  const [praises, setPraises] = useState<any[]>([]);

  useEffect(() => {
    if (user && !isDemoMode) {
      getDoc(doc(db, 'users', user.uid)).then(d => {
        if (d.exists()) setUserData(d.data());
      });
      
      const fetchPraises = async () => {
        try {
          const q = query(collection(db, 'superlative_votes'), where('receiverId', '==', user.uid));
          const snap = await getDocs(q);
          const fetched: any[] = [];
          snap.forEach(docSnap => fetched.push(docSnap.data()));
          fetched.sort((a, b) => {
             const tA = a.timestamp?.toMillis?.() || 0;
             const tB = b.timestamp?.toMillis?.() || 0;
             return tB - tA;
          });
          setPraises(fetched);
        } catch (err) {
          console.error("Failed to fetch praises", err);
        }
      };
      fetchPraises();
    }
  }, [user]);
  const router = useRouter();

  if (loading) return <LoadingScreen />;
  if (!user) {
    router.push('/login');
    return null;
  }

  const handleLogout = async () => {
    if (isDemoMode) {
      demoAuth.logout();
      window.location.href = '/';
      return;
    }
    await signOut(auth);
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    if (isDemoMode) {
      alert("Cannot delete accounts in Demo Mode.");
      return;
    }
    
    const confirmDelete = window.confirm(
      "Are you absolutely sure you want to permanently delete your account?\n\nThis will instantly erase your profile, photos, matches, and all data from our servers. This action cannot be undone."
    );
    
    if (!confirmDelete) return;

    try {
      // 1. Delete from AI Vector Database (Fire and forget)
      deleteUserEmbedding(user.uid).catch(e => console.error(e));
      
      // 2. Delete the profile document from Firestore (this also deletes the base64 photos stored inside it)
      await deleteDoc(doc(db, "users", user.uid));
      
      // 3. Delete the user from Firebase Authentication
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }
      
      alert("Your account and all associated data have been permanently erased.");
      window.location.href = '/';
    } catch (error: any) {
      console.error("Error deleting account:", error);
      if (error.code === 'auth/requires-recent-login') {
        alert("For security reasons, you need to log out and log back in before deleting your account.");
      } else {
        alert("An error occurred while deleting your account: " + error.message);
      }
    }
  };


  const copyInviteLink = () => {
    const link = `https://campusengage.vercel.app/register?ref=${user?.uid}`;
    navigator.clipboard.writeText(link);
    alert("Invite link copied to clipboard! Share it with 5 friends to unlock full chat features.");
  };

  if (loading || !user || !userData) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-0 font-sans selection:bg-white/20">
      <Navigation />
      
      <main className="max-w-2xl mx-auto p-4 sm:p-6 mt-4">
        
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Profile</h1>
            <p className="text-zinc-500 mt-1 text-sm">Manage your identity.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-rose-500 transition-colors"
          >
            Logout
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 mb-8 relative overflow-hidden shadow-2xl"
        >
          {/* Subtle gradient behind profile */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10" />
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-zinc-800 rounded-full border-2 border-white/10 flex items-center justify-center text-4xl grayscale">
               👤
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{user.displayName || "Anonymous Student"}</h2>
              <p className="text-zinc-400 font-medium">{user.email || "No email provided"}</p>
              {userData?.branch && (
                <p className="text-indigo-400 text-sm font-bold mt-1 uppercase tracking-wider">{userData.branch}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-black/50 border border-white/5 p-5 rounded-3xl flex flex-col justify-between cursor-pointer" onClick={toggleIncognito}>
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Incognito Mode</span>
                <span className={`font-bold flex items-center gap-2 ${isIncognito ? 'text-indigo-400' : 'text-zinc-500'}`}>
                   <div className={`w-10 h-6 rounded-full border relative transition-colors ${isIncognito ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-zinc-800 border-white/10'}`}>
                     <motion.div 
                        animate={{ left: isIncognito ? '1.2rem' : '0.25rem' }} 
                        className={`w-4 h-4 rounded-full absolute top-0.5 ${isIncognito ? 'bg-indigo-400' : 'bg-zinc-600'}`} 
                     />
                   </div>
                   {isIncognito ? 'On' : 'Off'}
                </span>
             </div>

             <div className="bg-black/50 border border-white/5 p-5 rounded-3xl flex flex-col justify-between">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex justify-between items-center">
                  Aura Score
                  <span className="text-amber-500/80 text-xs text-shadow-glow">✨</span>
                </span>
                <div className="flex items-end gap-1">
                   <span className="text-2xl font-black text-white">{userData.auraScore ?? 20}</span>
                   <span className="text-sm font-bold text-zinc-600 mb-1.5">/ 100</span>
                </div>
                <div className="w-full h-1 bg-zinc-800/80 rounded-full mt-2 overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${Math.min(100, Math.max(0, userData.auraScore ?? 20))}%` }}
                     transition={{ duration: 1, delay: 0.5 }}
                     className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" 
                   />
                </div>
             </div>
          </div>

          {/* Praises UI */}
          {praises.length > 0 && (
            <div className="bg-black/50 border border-indigo-500/20 p-6 rounded-3xl mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[50px] -z-10" />
              <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                ✨ Recent Praises
              </h3>
              <div className="flex flex-col gap-3">
                {praises.slice(0, 5).map((praise, idx) => {
                  const emojiMatch = praise.prompt.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u);
                  const emoji = emojiMatch ? emojiMatch[0] : '✨';
                  const text = praise.prompt.replace(emoji, '').trim();
                  
                  return (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5"
                    >
                      <div className="w-10 h-10 shrink-0 rounded-full bg-indigo-500/20 flex items-center justify-center text-xl border border-indigo-500/20">
                        {emoji}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-tight">{text}</p>
                        <p className="text-xs text-indigo-400 mt-0.5 font-medium">Someone voted for you!</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Referral Progress UI */}
          <div className="bg-black/50 border border-white/5 p-6 rounded-3xl mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[50px] -z-10" />
            <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              🏆 Network Expansion
              {((userData?.referredUsers?.length || userData?.referralCount || 0)) >= 5 && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full uppercase tracking-widest font-black ml-auto">UNLOCKED</span>}
            </h3>
            
            <div className="flex gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-3 flex-1 rounded-full transition-all ${i < ((userData?.referredUsers?.length || userData?.referralCount || 0)) ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/10'}`} />
              ))}
            </div>
            
            <div className="flex justify-between items-center text-xs font-medium text-zinc-400 mb-6">
              <span>{(userData?.referredUsers?.length || userData?.referralCount || 0)} / 5 Friends Referred</span>
              <span>{((userData?.referredUsers?.length || userData?.referralCount || 0)) >= 5 ? 'Unlimited Messaging Active' : 'Unlock Unlimited Messaging'}</span>
            </div>

            <button 
               onClick={copyInviteLink}
               className="w-full bg-white text-black py-3.5 rounded-2xl font-bold text-base hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
            >
               🔗 Copy Invite Link
            </button>
          </div>


        </motion.div>
        
        {/* Campus Groups / Modes */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold text-lg">My Campus Groups</h3>
            <button 
               onClick={() => editingInterests ? saveInterests() : setEditingInterests(true)}
               className="text-sm font-bold text-indigo-400 hover:text-indigo-300"
            >
              {editingInterests ? "Save" : "Edit"}
            </button>
          </div>
          
          {!editingInterests ? (
             <div className="flex flex-wrap gap-2">
               {(userData?.interests || []).length > 0 ? (
                 (userData?.interests || []).map((int: string) => (
                   <span key={int} className="px-4 py-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full font-bold text-sm">
                     {int}
                   </span>
                 ))
               ) : (
                 <p className="text-zinc-500 text-sm">No groups selected. Add some vibes to your profile!</p>
               )}
             </div>
          ) : (
             <div className="space-y-6">
               <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-2">Select up to 5 groups:</p>
               {interestError && <p className="text-rose-400 text-sm font-bold mb-4">{interestError}</p>}
               {selectedInterests.length >= 5 && !interestError && <p className="text-emerald-400 text-sm font-bold mb-4">You've reached the 5 group limit!</p>}
               {Object.entries(INTEREST_GROUPS).map(([category, tags]) => (
                 <div key={category}>
                   <h4 className="text-zinc-500 text-sm font-bold mb-3">{category}</h4>
                   <div className="flex flex-wrap gap-2">
                     {tags.map(tag => {
                       const isSelected = selectedInterests.includes(tag);
                       return (
                         <button
                           key={tag}
                           onClick={() => handleToggleInterest(tag)}
                           disabled={!isSelected && selectedInterests.length >= 5}
                           className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${isSelected ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border-transparent' : (!isSelected && selectedInterests.length >= 5) ? 'bg-black/20 text-zinc-600 border border-white/5 cursor-not-allowed' : 'bg-black/50 text-zinc-400 border border-white/10 hover:border-white/30'}`}
                         >
                           {tag}
                         </button>
                       );
                     })}
                   </div>
                 </div>
               ))}
             </div>
          )}
        </motion.div>

        {/* Native App Poll Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl mb-8 relative overflow-hidden group"
        >
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           <div className="relative z-10">
             <h2 className="text-lg font-bold text-white mb-2">Want a Native App? 📱</h2>
             <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
               We are currently running on the web. If you want us to build an official iOS and Android app, cast your vote below!
             </p>
             
             <div className="flex items-center justify-between gap-4">
               <button 
                 onClick={handleVoteApp}
                 disabled={appVotes.includes(user?.uid || '') || isVoting}
                 className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
                   appVotes.includes(user?.uid || '') 
                     ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                     : 'bg-white text-black hover:scale-[1.02] active:scale-95'
                 }`}
               >
                 {isVoting ? 'Voting...' : appVotes.includes(user?.uid || '') ? '✓ Voted' : 'Vote for Native App'}
               </button>
               
               <div className="bg-black/50 border border-white/10 px-4 py-3 rounded-xl flex flex-col items-center justify-center min-w-[80px]">
                 <span className="text-xl font-black text-white">{appVotes.length}</span>
                 <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Votes</span>
               </div>
             </div>
           </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 mb-8"
        >
          
          <AnimatePresence>
            {isIncognito && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div onClick={() => router.push('/confessions')} className="w-full bg-indigo-900/30 border border-indigo-500/50 p-5 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-indigo-900/50 transition-colors">
                  <div>
                    <h4 className="text-indigo-300 font-bold flex items-center gap-2">🎭 Anonymous Confessions</h4>
                    <p className="text-xs text-indigo-400/70 mt-1">Unlocked via Incognito Mode</p>
                  </div>
                  <span className="text-indigo-400">→</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <h3 className="text-white font-bold text-lg mb-6">Account Settings</h3>

          <div className="space-y-4">
             <button 
                onClick={() => {
                   setEditAnswers({
                     studyVibe: userData?.answers?.studyVibe || '',
                     weekendVibe: userData?.answers?.weekendVibe || '',
                     stressLevel: userData?.answers?.stressLevel || '',
                     hotTake: userData?.answers?.hotTake || ''
                   });
                   setEditBranch(userData?.branch || '');
                   setShowEditAnswersModal(true);
                }} 
                className="w-full flex justify-between items-center bg-black/50 border border-white/5 p-5 rounded-2xl text-white hover:bg-white/5 transition-colors"
             >
                <span className="font-medium">Edit Profile & Branch</span>
                <span className="text-zinc-500">→</span>
             </button>
             <button 
                onClick={() => {
                   setEditPhotos([...(userData?.photos || [null, null, null])]);
                   setShowEditPhotosModal(true);
                }} 
                className="w-full flex justify-between items-center bg-black/50 border border-white/5 p-5 rounded-2xl text-white hover:bg-white/5 transition-colors"
             >
                <span className="font-medium">Manage Photos</span>
                <span className="text-zinc-500">→</span>
             </button>
             <button 
                onClick={handleDeleteAccount}
                className="w-full flex justify-between items-center bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl text-rose-500 hover:bg-rose-500/20 transition-colors"
             >
                <span className="font-bold">Delete Account</span>
                <span>⚠️</span>
             </button>
          </div>
        </motion.div>

        {/* Support Developers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-indigo-500/20 rounded-[2.5rem] p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/5 -z-10" />
          <div className="text-center">
             <div className="text-4xl mb-4">☕️</div>
             <h3 className="text-white font-bold text-lg mb-2">Support the Developers</h3>
             <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
               CampusEngage is built and maintained by students. If you found your perfect match or just love the vibes, buy us a coffee to keep the servers running!
             </p>
             <a 
               href="https://buymeacoffee.com/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-block w-full bg-[#FFDD00] text-black py-3.5 rounded-2xl font-bold text-base hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,221,0,0.2)]"
             >
                Buy me a coffee
             </a>
          </div>
        </motion.div>


      </main>
    
      {/* Edit Photos Modal */}
      <AnimatePresence>
        {showEditPhotosModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowEditPhotosModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-white/10 p-6 rounded-[2rem] w-full max-w-md relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => setShowEditPhotosModal(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
              >
                ✕
              </button>

              <h2 className="text-xl font-bold mb-6 text-white tracking-tight">Manage Photos</h2>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black/50 border-2 border-dashed border-white/10 flex flex-col items-center justify-center group">
                    {editPhotos[index] ? (
                      <>
                        <img src={editPhotos[index]!} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="text-white text-xs font-bold mb-2">Change</span>
                           <button 
                             onClick={(e) => { e.preventDefault(); const newPhotos = [...editPhotos]; newPhotos[index] = null; setEditPhotos(newPhotos); }}
                             className="text-rose-400 text-xs font-bold bg-black/50 px-2 py-1 rounded-full hover:bg-rose-500/20"
                           >
                             Remove
                           </button>
                        </div>
                      </>
                    ) : (
                      <span className="text-2xl text-white/20">+</span>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handlePhotoChange(index, e)}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                  </div>
                ))}
              </div>

              {isScanningImage && (
                <p className="text-indigo-400 text-sm mb-4 font-medium animate-pulse text-center">
                  🤖 Scanning image for safety...
                </p>
              )}
              {photoError && (
                <p className="text-rose-400 text-sm mb-4 font-medium text-center">{photoError}</p>
              )}

              <button
                onClick={handleSavePhotos}
                disabled={savingPhotos || isScanningImage}
                className="w-full bg-indigo-500 text-white py-4 rounded-xl font-bold hover:bg-indigo-400 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50"
              >
                {savingPhotos ? "Saving..." : "Save Photos"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Answers Modal */}
      <AnimatePresence>
        {showEditAnswersModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowEditAnswersModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-white/10 p-6 rounded-[2rem] w-full max-w-md relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => setShowEditAnswersModal(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
              >
                ✕
              </button>

              <h2 className="text-xl font-bold mb-6 text-white tracking-tight">Edit Profile & Answers</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Branch / Major</label>
                  <input 
                     type="text"
                     value={editBranch}
                     onChange={(e) => setEditBranch(e.target.value)}
                     placeholder="e.g. Computer Science"
                     className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Study Vibe</label>
                  <select 
                     value={editAnswers.studyVibe}
                     onChange={(e) => setEditAnswers({...editAnswers, studyVibe: e.target.value})}
                     className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                  >
                     <option value="Dead Silence (Library)">Dead Silence (Library)</option>
                     <option value="Low-fi Beats (Coffee Shop)">Low-fi Beats (Coffee Shop)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Weekend Vibe</label>
                  <select 
                     value={editAnswers.weekendVibe}
                     onChange={(e) => setEditAnswers({...editAnswers, weekendVibe: e.target.value})}
                     className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                  >
                     <option value="Frat Basement">Frat Basement</option>
                     <option value="Downtown Bar">Downtown Bar</option>
                     <option value="Movie in Dorm">Movie in Dorm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Stress Level</label>
                  <select 
                     value={editAnswers.stressLevel}
                     onChange={(e) => setEditAnswers({...editAnswers, stressLevel: e.target.value})}
                     className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                  >
                     <option value="A week early">A week early</option>
                     <option value="12 hours before">12 hours before</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Campus Hot Take</label>
                  <textarea 
                     value={editAnswers.hotTake}
                     onChange={(e) => setEditAnswers({...editAnswers, hotTake: e.target.value})}
                     rows={3}
                     className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <button 
                  onClick={async () => {
                    setSavingAnswers(true);
                    try {
                      await updateDoc(doc(db, 'users', user!.uid), { answers: editAnswers, branch: editBranch });
                      setUserData({ ...userData, answers: editAnswers, branch: editBranch });
                      setShowEditAnswersModal(false);
                    } catch(err) {
                      console.error("Failed to update answers", err);
                    } finally {
                      setSavingAnswers(false);
                    }
                  }}
                  disabled={savingAnswers}
                  className="w-full bg-indigo-500 text-white py-4 rounded-xl font-bold hover:bg-indigo-400 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.3)] mt-2"
                >
                  {savingAnswers ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
