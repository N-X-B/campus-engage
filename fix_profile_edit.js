const fs = require('fs');

let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

// 1. Add state for the Edit Answers Modal
const stateMatch = 'const [showEditModal, setShowEditModal] = useState(false);';
const stateReplace = `const [showEditAnswersModal, setShowEditAnswersModal] = useState(false);
  const [editAnswers, setEditAnswers] = useState({
    studyVibe: '',
    weekendVibe: '',
    stressLevel: '',
    hotTake: ''
  });
  const [savingAnswers, setSavingAnswers] = useState(false);`;

code = code.replace(stateMatch, stateReplace);

// 2. Change the button click handler
const editBtnMatch = `<button onClick={() => router.push('/onboarding')} className="w-full flex justify-between items-center bg-black/50 border border-white/5 p-5 rounded-2xl text-white hover:bg-white/5 transition-colors">
                <span className="font-medium">Edit Profile Answers</span>`;
const editBtnReplace = `<button 
                onClick={() => {
                   setEditAnswers({
                     studyVibe: userData?.answers?.studyVibe || '',
                     weekendVibe: userData?.answers?.weekendVibe || '',
                     stressLevel: userData?.answers?.stressLevel || '',
                     hotTake: userData?.answers?.hotTake || ''
                   });
                   setShowEditAnswersModal(true);
                }} 
                className="w-full flex justify-between items-center bg-black/50 border border-white/5 p-5 rounded-2xl text-white hover:bg-white/5 transition-colors"
             >
                <span className="font-medium">Edit Profile Answers</span>`;

code = code.replace(editBtnMatch, editBtnReplace);

// 3. Add the Modal UI at the bottom of the component
const modalUI = `
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

              <h2 className="text-2xl font-bold mb-6 text-white">Edit Vibe Check</h2>
              
              <div className="space-y-6">
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
                      await updateDoc(doc(db, 'users', user!.uid), { answers: editAnswers });
                      setUserData({ ...userData, answers: editAnswers });
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
}`;

const bottomMatch = /<\/div>\n  \);\n\}/;
code = code.replace(bottomMatch, modalUI);

fs.writeFileSync('src/app/profile/page.tsx', code);
