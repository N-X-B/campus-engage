"use client";

import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import { haptic } from '@/lib/haptics';

export default function CrushPage({ params }: { params: { id: string } }) {
  const [targetUser, setTargetUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentStatus, setSentStatus] = useState<'idle' | 'sent' | 'auth_required'>('idle');
  
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchTargetUser = async () => {
      try {
        const docRef = doc(db, 'users', params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTargetUser(docSnap.data());
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTargetUser();
  }, [params.id]);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    // THE VIRAL HOOK: Force them to sign up to actually send the message
    if (!user) {
      setSentStatus('auth_required');
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([30, 50, 30]);
      return;
    }

    setIsSending(true);
    try {
      await addDoc(collection(db, 'secret_crushes'), {
        receiverId: params.id,
        senderId: user.uid,
        message: message.trim(),
        timestamp: serverTimestamp(),
        isRead: false
      });
      setSentStatus('sent');
      haptic.success();
      setMessage('');
    } catch (err) {
      console.error("Failed to send crush", err);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!targetUser) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
        <h1 className="text-2xl font-bold mb-2">User not found</h1>
        <p className="text-zinc-500 text-center">This link might be expired or invalid.</p>
        <Link href="/" className="mt-8 px-6 py-3 bg-white text-black font-bold rounded-full">Go to CampusEngage</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-rose-500/30 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-zinc-800 border-2 border-white/10 mb-4 overflow-hidden relative shadow-[0_0_30px_rgba(244,63,94,0.2)]">
            {targetUser.photos?.[0] ? (
              <img src={targetUser.photos[0]} alt={targetUser.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl grayscale">👤</div>
            )}
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-1">
            Send {targetUser.name?.split(' ')[0]} a Secret
          </h1>
          <p className="text-zinc-400 text-sm font-medium">
            100% anonymous. They won't know it's you... unless you match. 🤫
          </p>
        </div>

        {sentStatus === 'sent' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-rose-500/10 border border-rose-500/20 rounded-[2rem] p-8 text-center"
          >
            <div className="text-5xl mb-4">💌</div>
            <h2 className="text-xl font-bold mb-2">Secret Sent!</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Your crush has been notified. Want to see if anyone has a crush on you?
            </p>
            <Link 
              href="/register"
              className="block w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-colors"
            >
              Get Your Own Link
            </Link>
          </motion.div>
        ) : (
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="I always see you at the library..."
              className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none mb-4"
              rows={4}
              maxLength={200}
            />
            
            <div className="flex justify-between items-center mb-6 px-2">
              <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
                {200 - message.length} chars left
              </span>
              <span className="text-xs font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1">
                🔒 Anonymous
              </span>
            </div>

            <button
              onClick={handleSend}
              disabled={isSending || !message.trim()}
              className="w-full bg-rose-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:bg-rose-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSending ? "Sending..." : "Send Secret 💌"}
            </button>
          </div>
        )}
      </motion.div>

      {/* The Viral Acquisition Modal */}
      {sentStatus === 'auth_required' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSentStatus('idle')} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-zinc-900 border border-white/10 p-8 rounded-[2rem] max-w-sm w-full relative z-10 text-center shadow-2xl"
          >
            <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              🎓
            </div>
            <h3 className="text-2xl font-black mb-3">Student Check</h3>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              Your message is encrypted and ready to send. To prevent spam, please quickly verify your university email to prove you're a real student.
            </p>
            <button 
              onClick={() => {
                // Save the drafted message to sessionStorage so we can send it after they sign up!
                sessionStorage.setItem('pendingCrushMsg', message);
                sessionStorage.setItem('pendingCrushTarget', params.id);
                router.push(`/register?ref=${params.id}&intent=crush`);
              }}
              className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-colors mb-4"
            >
              Verify to Send Message
            </button>
            <button 
              onClick={() => setSentStatus('idle')}
              className="text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
