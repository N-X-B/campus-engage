"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  
  useEffect(() => {
    // Detect iOS
    const isIosDevice = 
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    // Don't show if already installed
    if (isStandalone) {
      return;
    }

    if (isIosDevice) {
      setIsIOS(true);
      // Show iOS prompt after a slight delay
      const timer = setTimeout(() => {
        const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
        if (!hasDismissed) {
          setShowPrompt(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Android / Chrome
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!hasDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-20 left-4 right-4 z-[999] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md"
        >
          <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
               <span className="text-white font-bold text-xl">CE</span>
            </div>
            
            <div className="flex-1">
              <h4 className="text-white font-bold text-sm">Install CampusEngage</h4>
              <p className="text-zinc-400 text-xs mt-1">
                {isIOS ? 'Tap Share ⍐ then "Add to Home Screen"' : 'Install for a faster, app-like experience.'}
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              {!isIOS && (
                <button 
                  onClick={handleInstallClick}
                  className="bg-white text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors shadow-md"
                >
                  Install
                </button>
              )}
              <button 
                onClick={handleDismiss}
                className="text-zinc-500 hover:text-white text-xs font-medium"
              >
                Not Now
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
