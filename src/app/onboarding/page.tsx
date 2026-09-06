"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { isDemoMode, demoDb } from '@/lib/demo-backend';

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [year, setYear] = useState('');
  const [branch, setBranch] = useState('');
  const [bio, setBio] = useState('');
  const [files, setFiles] = useState<(File | null)[]>([null, null, null, null, null]);
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null, null, null]);
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async () => {
    if (!user) return;
    setError('');

    const validFiles = files.filter(f => f !== null) as File[];
    if (validFiles.length < 2) {
      setError('Please upload at least 2 photos.');
      return;
    }
    if (!year || !branch || !bio) {
      setError('Please fill in all text fields.');
      return;
    }

    setSaving(true);
    try {
      if (isDemoMode) {
        // Just use blob URLs for demo mode
        await demoDb.updateProfile(user.uid, { year, branch, bio, photos: previews.filter(p => p !== null) });
        router.push('/feed');
        return;
      }

      // 1. Upload photos to Firebase Storage
      const photoUrls: string[] = [];
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const storageRef = ref(storage, `users/${user.uid}/photo_${i}_${Date.now()}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        photoUrls.push(url);
      }

      // 2. Update Firestore Document
      await updateDoc(doc(db, 'users', user.uid), {
        year,
        branch,
        bio,
        photos: photoUrls,
        onboarded: true,
      });

      // 3. Redirect to feed
      router.push('/feed');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-50 items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Set up your profile</h1>
          <p className="text-slate-500 mt-2">Let others know a bit about you.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Photos Section */}
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Photos <span className="text-sm font-normal text-slate-500">(Upload 2 to 5 photos)</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4].map((index) => (
                <label key={index} className="aspect-[3/4] bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative overflow-hidden">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleFileChange(index, e)}
                  />
                  {previews[index] ? (
                    <img src={previews[index]!} alt="preview" className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-4xl text-slate-300">+</span>
                  )}
                </label>
              ))}
            </div>
          </section>

          {/* Academic Info */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Academic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Year of Study</label>
                <select 
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Branch / Major</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                />
              </div>
            </div>
          </section>

          {/* Bio */}
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">About Me</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a short bio about your interests, hobbies, etc."
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 resize-none"
              />
            </div>
          </section>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button onClick={handleSubmit} disabled={saving} className="bg-slate-900 text-white hover:bg-slate-800 h-12 px-8 rounded-lg shadow-sm">
              {saving ? 'Saving...' : 'Complete Profile'}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
