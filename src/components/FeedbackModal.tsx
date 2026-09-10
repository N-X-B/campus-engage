"use client";

import { useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { MessageSquare, X, Send, CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const user = auth.currentUser;
      
      // Save feedback to Firestore 'feedback' collection
      await addDoc(collection(db, 'feedback'), {
        userId: user ? user.uid : 'anonymous',
        email: user ? user.email : 'unknown',
        message: feedback.trim(),
        timestamp: serverTimestamp(),
        status: 'new'
      });

      setIsSuccess(true);
      setFeedback('');
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => setIsSuccess(false), 300);
      }, 2000);
    } catch (err: any) {
      console.error("Error submitting feedback:", err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button in the bottom right corner */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Give Feedback"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Modal Overlay & Content */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-lg text-slate-800">Help us improve</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors rounded-full p-1 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex flex-col items-center justify-center text-center py-6"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
                    <h4 className="text-lg font-medium text-slate-800 mb-1">Thank you!</h4>
                    <p className="text-slate-500 text-sm">Your feedback helps us make the campus experience better.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-slate-600">
                      Got an idea, spotted a bug, or just want a new feature? Let us know below!
                    </p>
                    
                    {error && (
                      <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {error}
                      </div>
                    )}

                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="I think it would be cool if..."
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                    />
                    
                    <button
                      type="submit"
                      disabled={isSubmitting || !feedback.trim()}
                      className="w-full flex items-center justify-center space-x-2 bg-slate-900 text-white hover:bg-slate-800 h-12 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Submit Feedback</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
