const fs = require('fs');
let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

// 1. Add state
code = code.replace(
  /const \[promptOptions, setPromptOptions\] = useState<string\[\]>\(\[\]\);/,
  `const [promptOptions, setPromptOptions] = useState<string[]>([]);\n  const [breakingIceId, setBreakingIceId] = useState<string | null>(null);`
);

// 2. Add handleBreakIceClick
const openIcebreakerCode = `  const openIcebreaker = (targetUser: any) => {`;
const handleBreakIceClickCode = `  const handleBreakIceClick = (e: any, p: any, isModal: boolean = false) => {
    e.stopPropagation();
    setBreakingIceId(p.id);
    setTimeout(() => {
      if (isModal) setSelectedProfileForBrief(null);
      openIcebreaker(p);
      setBreakingIceId(null);
    }, 1000);
  };

  const openIcebreaker = (targetUser: any) => {`;

code = code.replace(openIcebreakerCode, handleBreakIceClickCode);

// 3. Replace card button
const cardBtnTarget = `<div className="pointer-events-auto">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openIcebreaker(p); }} 
                      className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-2xl py-4 font-bold text-lg transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:-translate-y-1"
                    >
                      Break the Ice 🧊
                    </button>
                  </div>`;

const cardBtnReplacement = `<div className="pointer-events-auto relative h-16 w-full">
                    <AnimatePresence>
                      {breakingIceId === p.id ? (
                        <motion.div key="breaking" className="absolute inset-0 flex justify-center items-center pointer-events-none">
                          {/* Left Half */}
                          <motion.div 
                            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                            animate={{ x: -40, y: 100, rotate: -30, opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeIn" }}
                            className="absolute bg-white/10 backdrop-blur-xl border border-white/30 text-white rounded-l-2xl py-4 font-bold text-lg w-1/2 flex justify-end overflow-hidden z-10"
                            style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}
                          >
                            <span className="pr-1">Break </span>
                          </motion.div>

                          {/* Right Half */}
                          <motion.div 
                            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                            animate={{ x: 40, y: 100, rotate: 30, opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeIn" }}
                            className="absolute bg-white/10 backdrop-blur-xl border-t border-b border-r border-white/30 text-white rounded-r-2xl py-4 font-bold text-lg w-1/2 flex justify-start overflow-hidden left-1/2 z-10"
                            style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}
                          >
                            <span className="pl-1">the Ice</span>
                          </motion.div>

                          {/* Melting Ice Cubes */}
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ y: 0, x: 0, scale: 1.5, opacity: 1 }}
                              animate={{ 
                                y: 80 + Math.random() * 60, 
                                x: (Math.random() - 0.5) * 100,
                                scale: 0, 
                                opacity: 0,
                                rotate: Math.random() * 360
                              }}
                              transition={{ duration: 0.8, delay: Math.random() * 0.2, ease: "easeOut" }}
                              className="absolute text-2xl z-0"
                            >
                              🧊
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.button 
                          key="btn"
                          exit={{ opacity: 0, scale: 1.1 }}
                          onClick={(e) => handleBreakIceClick(e, p)} 
                          className="absolute inset-0 w-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-2xl py-4 font-bold text-lg transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                          Break the Ice 🧊
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>`;
code = code.replace(cardBtnTarget, cardBtnReplacement);


// 4. Replace Brief modal button
const briefBtnTarget = `<button onClick={() => { setSelectedProfileForBrief(null); openIcebreaker(selectedProfileForBrief); }} className="w-full bg-white text-black rounded-2xl py-4 font-bold text-lg hover:bg-zinc-200 transition shadow-lg hover:-translate-y-1">
                   Break the Ice
                 </button>`;

const briefBtnReplacement = `<div className="relative h-16 w-full mt-4">
                   <AnimatePresence>
                     {breakingIceId === selectedProfileForBrief.id ? (
                        <motion.div key="breaking" className="absolute inset-0 flex justify-center items-center pointer-events-none">
                          {/* Left Half */}
                          <motion.div 
                            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                            animate={{ x: -40, y: 100, rotate: -30, opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeIn" }}
                            className="absolute bg-white text-black rounded-l-2xl py-4 font-bold text-lg w-1/2 flex justify-end overflow-hidden z-10"
                            style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}
                          >
                            <span className="pr-1">Break </span>
                          </motion.div>

                          {/* Right Half */}
                          <motion.div 
                            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                            animate={{ x: 40, y: 100, rotate: 30, opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeIn" }}
                            className="absolute bg-white text-black rounded-r-2xl py-4 font-bold text-lg w-1/2 flex justify-start overflow-hidden left-1/2 z-10"
                            style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}
                          >
                            <span className="pl-1">the Ice</span>
                          </motion.div>

                          {/* Melting Ice Cubes */}
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ y: 0, x: 0, scale: 1.5, opacity: 1 }}
                              animate={{ 
                                y: 80 + Math.random() * 60, 
                                x: (Math.random() - 0.5) * 100,
                                scale: 0, 
                                opacity: 0,
                                rotate: Math.random() * 360
                              }}
                              transition={{ duration: 0.8, delay: Math.random() * 0.2, ease: "easeOut" }}
                              className="absolute text-2xl z-0"
                            >
                              🧊
                            </motion.div>
                          ))}
                        </motion.div>
                     ) : (
                       <motion.button 
                         key="btn"
                         exit={{ opacity: 0, scale: 1.1 }}
                         onClick={(e) => handleBreakIceClick(e, selectedProfileForBrief, true)} 
                         className="absolute inset-0 w-full bg-white text-black rounded-2xl py-4 font-bold text-lg hover:bg-zinc-200 transition shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2"
                       >
                         Break the Ice 🧊
                       </motion.button>
                     )}
                   </AnimatePresence>
                 </div>`;
code = code.replace(briefBtnTarget, briefBtnReplacement);


fs.writeFileSync('src/app/feed/page.tsx', code);
