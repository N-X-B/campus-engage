"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { messaging, db } from '@/lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { updateDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

export function PushManager() {
  const { user } = useAuth();
  const [permissionStatus, setPermissionStatus] = useState<string>('granted');
  const [showPrompt, setShowPrompt] = useState(false);
  const [foregroundNotification, setForegroundNotification] = useState<{title: string, body: string, icon?: string} | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
      
      // If they haven't chosen, and they are logged in, show the prompt modal after a short delay
      if (Notification.permission === 'default' && user) {
        const timer = setTimeout(() => setShowPrompt(true), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined' && messaging && Notification.permission === 'granted') {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground message received: ', payload);
        setForegroundNotification({
          title: payload.notification?.title || 'New Notification',
          body: payload.notification?.body || '',
          icon: payload.notification?.icon || '/icon-192x192.png'
        });
        
        // Auto-hide toast after 5 seconds
        setTimeout(() => setForegroundNotification(null), 5000);
      });
      return () => unsubscribe();
    }
  }, []);

  const handleEnable = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      setShowPrompt(false);
      
      if (permission === 'granted' && messaging) {
        const token = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY });
        if (token && user) {
          await updateDoc(doc(db, 'users', user.uid), { fcmToken: token });
        }
      }
    } catch (e) {
      console.error("Push enable failed", e);
      setShowPrompt(false);
    }
  };

  const handleDecline = () => {
    setShowPrompt(false);
  };

  return (
    <>
      {/* Foreground Notification Toast */}
      <AnimatePresence>
        {foregroundNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-96 bg-zinc-900 border border-white/10 rounded-2xl p-4 shadow-2xl z-[9999] flex items-start gap-4 cursor-pointer"
            onClick={() => setForegroundNotification(null)}
          >
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
              <span className="text-xl">🔔</span>
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-sm">{foregroundNotification.title}</h4>
              <p className="text-zinc-400 text-xs mt-1">{foregroundNotification.body}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Opt-In Modal */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-indigo-500 to-rose-500" />
              <div className="text-4xl mb-4 text-center">🔔</div>
              <h3 className="text-xl font-black text-white text-center mb-2 tracking-tight">Stay in the Loop</h3>
              <p className="text-zinc-400 text-sm text-center mb-8">
                Turn on notifications to find out immediately when someone likes you, uses a Token on you, or mentions you on Spotted.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleEnable}
                  className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3.5 rounded-xl transition-all"
                >
                  Enable Notifications
                </button>
                <button 
                  onClick={handleDecline}
                  className="w-full bg-transparent hover:bg-white/5 text-zinc-500 font-bold py-3.5 rounded-xl transition-all"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
