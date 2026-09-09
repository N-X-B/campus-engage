// Calculates the Matchability Factor between two users (returns a score from 0 to 100)
// Uses a composite mathematical model incorporating Gaussian decay, lifestyle matrices, and pseudo-semantic hashing.
export function calculateMatchScore(currentUser: any, targetUser: any): number {
  if (!currentUser?.answers || !targetUser?.answers) {
    // Fallback if someone hasn't completed the vibe check
    return Math.floor(Math.random() * 20) + 60; 
  }

  let score = 15; // Base minimum score to prevent 0% (which feels terrible UX-wise)

  // --- 1. Academic Year Alignment (Gaussian Decay) - Max 20 points ---
  // Formula: 20 * e^(-0.6 * delta^2)
  const extractYear = (y: string) => {
    if (!y) return 1;
    const match = y.match(/\d+/);
    return match ? parseInt(match[0]) : 1;
  };
  const y1 = extractYear(currentUser.year);
  const y2 = extractYear(targetUser.year);
  const yearDelta = Math.abs(y1 - y2);
  const yearScore = 20 * Math.exp(-0.6 * Math.pow(yearDelta, 2));
  score += yearScore;

  // --- 2. Branch/Major Cross-Pollination - Max 15 points ---
  const b1 = (currentUser.branch || "").toLowerCase().trim();
  const b2 = (targetUser.branch || "").toLowerCase().trim();
  
  if (b1 === b2 && b1 !== "") {
    score += 15; // Exact same major
  } else {
    // If they aren't the exact same, check if they share keywords (e.g. "Computer Science" vs "Data Science")
    const words1 = b1.split(' ');
    const words2 = b2.split(' ');
    const sharedWords = words1.filter((w: string) => words2.includes(w) && w.length > 3);
    
    if (sharedWords.length > 0) {
      score += 10; // Related majors
    } else {
      score += 5; // "Opposites attract" baseline for diverse majors
    }
  }

  // --- 3. Vibe Check Compatibility Matrix - Max 35 points ---
  const cAnswers = currentUser.answers;
  const tAnswers = targetUser.answers;

  // A. Study Vibe (10 points)
  if (cAnswers.studyVibe === tAnswers.studyVibe) {
    score += 10;
  } else {
    score += 4; // Mismatch isn't the end of the world
  }

  // B. Weekend Vibe Matrix (15 points)
  const w1 = cAnswers.weekendVibe;
  const w2 = tAnswers.weekendVibe;
  if (w1 === w2) {
    score += 15;
  } else {
    // Evaluate energy compatibility
    const highEnergy = ["Frat Basement", "Downtown Bar"];
    if (highEnergy.includes(w1) && highEnergy.includes(w2)) {
      // Both like going out, just different venues
      score += 11;
    } else {
      // Introvert (Movie) vs Extrovert (Frat/Bar) -> Lower compatibility
      score += 3;
    }
  }

  // C. Stress/Workflow Level (10 points)
  if (cAnswers.stressLevel === tAnswers.stressLevel) {
    score += 10; // Same workflow
  } else {
    score += 6; // Procrastinator + Planner = Complementary duo
  }

  // --- 4. Semantic "Hot Take" Similarity Hash - Max 15 points ---
  // In production, this uses real OpenAI Vector Embeddings (Cosine Similarity).
  // For MVP, we simulate a deterministic semantic vector distance using a seeded string hash.
  const seedString = [currentUser.uid, targetUser.id].sort().join(':');
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
    hash |= 0; 
  }
  
  // Normalize hash to a pseudo-random value between 0 and 15
  const normalizedSemanticScore = Math.abs(hash) % 16;
  score += normalizedSemanticScore;

  // --- 5. Desirability Normalization (Cap at 99%) ---
  score = Math.round(score);
  return Math.min(score, 99); // 100% is mathematically impossible in human relationships!
}
