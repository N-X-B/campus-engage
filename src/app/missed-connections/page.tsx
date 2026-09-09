"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Navigation } from '@/components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getMissedConnections, postMissedConnection } from '@/app/actions/missedConnections';
import { isDemoMode, demoDb } from '@/lib/demo-backend';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function MissedConnectionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  
  // Post modal state
  const [isComposing, setIsComposing] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [location, setLocation] = useState("Library");
  
  // Claim modal state
  const [claimingPost, setClaimingPost] = useState<any>(null);
  const [claimMessage, setClaimMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (isDemoMode) {
          setPosts([
             { id: '1', authorId: 'fake-1', text: "To the guy in the vintage denim jacket ordering an iced oat matcha at 10 AM... you dropped your pen and I was too shy to say hi.", location: "Campus Cafe", time: "2 hours ago" },
             { id: '2', authorId: 'fake-2', text: "Girl in the front row of Bio 101 with the sick stickers on her laptop. If you see this, let's study together.", location: "Science Building", time: "5 hours ago" }
          ]);
        } else {
          const res = await getMissedConnections();
          if (res.success && res.posts) {
            setPosts(res.posts);
          } else {
             // Fallback if db fails
             setPosts([]);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setFetching(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePost = async () => {
    if (!newPostText.trim() || !user) return;
    
    const newPost = {
       authorId: user.uid,
       text: newPostText,
       location,
       timestamp: Date.now(),
       time: "Just now"
    };

    if (isDemoMode) {
      setPosts([ { id: Date.now().toString(), ...newPost }, ...posts ]);
    } else {
      await postMissedConnection(newPost);
      setPosts([ { id: Date.now().toString(), ...newPost }, ...posts ]);
    }
    
    setNewPostText("");
    setIsComposing(false);
  };

  const handleClaim = async () => {
    if (!user || !claimingPost) return;
    
    if (isDemoMode) {
      const convId = `conv-${claimingPost.authorId}`;
      demoDb.sendMessage(convId, claimMessage, user.uid, user.displayName || 'Anonymous');
      router.push(`/chat/${convId}`);
      return;
    }
    
    try {
      const convId = [user.uid, claimingPost.authorId].sort().join('_');
      
      await setDoc(doc(db, 'conversations', convId), {
         participants: [user.uid, claimingPost.authorId],
         lastMessage: claimMessage,
         lastUpdated: Date.now()
      }, { merge: true });

      await addDoc(collection(db, `conversations/${convId}/messages`), {
         text: claimMessage,
         senderId: user.uid,
         senderName: user.displayName || 'Anonymous',
         timestamp: Date.now()
      });

      router.push(`/chat/${convId}`);
    } catch(e) {
      console.error(e);
    }
  };

  if (loading || fetching) return <div className="flex h-screen items-center justify-center bg-slate-950 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 pb-24 md:pb-0 font-sans selection:bg-indigo-500/30">
      <Navigation />
      
      {/* Compose Modal */}
      <AnimatePresence>
        {isComposing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Post a Connection</h2>
                  <button onClick={() => setIsComposing(false)} className="text-slate-500 hover:text-white text-xl">✕</button>
               </div>
               
               <input 
                 value={location} onChange={e => setLocation(e.target.value)}
                 placeholder="Where did it happen? (e.g. Library, Cafe)"
                 className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-indigo-500"
               />
               
               <textarea 
                 value={newPostText} onChange={e => setNewPostText(e.target.value)}
                 placeholder="To the guy in the red hoodie... you dropped your pen."
                 className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 mb-6 h-32 resize-none focus:outline-none focus:border-indigo-500"
               />
               
               <button onClick={handlePost} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-slate-200 transition">
                  Post Anonymously
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Claim Modal */}
      <AnimatePresence>
        {claimingPost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Claim Connection</h2>
                  <button onClick={() => setClaimingPost(null)} className="text-slate-500 hover:text-white text-xl">✕</button>
               </div>
               
               <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl mb-6">
                  <p className="text-indigo-300 italic text-sm">"{claimingPost.text}"</p>
               </div>
               
               <p className="text-slate-300 text-sm mb-4">Send a message to prove it was you. If they reply, your identities will be revealed.</p>
               
               <textarea 
                 value={claimMessage} onChange={e => setClaimMessage(e.target.value)}
                 placeholder="I think this was me! I was ordering a matcha..."
                 className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 mb-6 h-24 resize-none focus:outline-none focus:border-indigo-500"
               />
               
               <button onClick={handleClaim} className="w-full bg-indigo-500 text-white font-bold py-4 rounded-xl hover:bg-indigo-600 transition shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  Send Message
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-md mx-auto p-4 sm:p-6 mt-4">
        <div className="flex justify-between items-end mb-8 px-2">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Spotted</h1>
            <p className="text-slate-400 mt-1">Missed connections on campus.</p>
          </div>
          <button onClick={() => setIsComposing(true)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-bold text-sm backdrop-blur-md transition">
             + Post
          </button>
        </div>
        
        <div className="space-y-4">
           {posts.length === 0 ? (
              <div className="text-center py-20">
                 <div className="text-4xl mb-4">👀</div>
                 <p className="text-slate-400 font-medium">No missed connections yet.</p>
                 <p className="text-slate-500 text-sm mt-1">Be the first to post someone you spotted.</p>
              </div>
           ) : posts.map(post => (
              <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                 {/* Top info */}
                 <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                       {post.location}
                    </span>
                    <span className="text-xs font-medium text-slate-500">{post.time}</span>
                 </div>
                 
                 {/* The Post */}
                 <p className="text-white text-lg leading-relaxed font-medium mb-5">
                    "{post.text}"
                 </p>
                 
                 {/* Claim Button */}
                 {user?.uid !== post.authorId && (
                    <button onClick={() => setClaimingPost(post)} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-2">
                       🙋‍♂️ That was me
                    </button>
                 )}
              </div>
           ))}
        </div>
      </main>
    </div>
  );
}
