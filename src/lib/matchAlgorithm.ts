// Calculates the Matchability Factor between two users (returns a score from 0 to 100)
// Uses a 5-cluster mathematical model incorporating Gaussian decay, lifestyle matrices, and Jaccard NLP similarity.

const STOP_WORDS = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'am', 'to', 'for', 'of', 'in', 'on', 'with', 'it', 'this', 'that', 'i', 'you', 'we', 'they', 'my', 'at', 'be', 'do', 'not']);

function jaccardSimilarity(text1: string, text2: string): number {
  if (!text1 || !text2) return 0;
  
  const getWords = (t: string) => new Set(
    t.toLowerCase()
     .replace(/[^a-z0-9\s]/g, '')
     .split(/\s+/)
     .filter(w => w.length > 2 && !STOP_WORDS.has(w))
  );
  
  const set1 = getWords(text1);
  const set2 = getWords(text2);
  
  if (set1.size === 0 && set2.size === 0) return 0;
  
  let intersection = 0;
  set1.forEach(w => {
    if (set2.has(w)) intersection++;
  });
  
  const union = set1.size + set2.size - intersection;
  if (union === 0) return 0;
  
  return intersection / union;
}

export function calculateMatchScore(currentUser: any, targetUser: any): number {
  if (!currentUser?.answers || !targetUser?.answers) {
    // Fallback if someone hasn't completed the vibe check
    return Math.floor(Math.random() * 20) + 60; 
  }

  let score = 10; // Baseline minimum to prevent absolute 0%

  const cAnswers = currentUser.answers;
  const tAnswers = targetUser.answers;

  // --- CLUSTER A: Academics (Max 25 points) ---
  
  // 1. Course Match (10 pts)
  const cCourse = currentUser.course || "";
  const tCourse = targetUser.course || "";
  if (cCourse && tCourse) {
    if (cCourse === tCourse) {
      score += 10;
    } else if ((cCourse === 'BTech' && tCourse === 'BBA') || (cCourse === 'BBA' && tCourse === 'BTech')) {
      score += 5; // Undergrad cross-pollination
    } else {
      score += 2; // Undergrad + Postgrad (Different phases of life)
    }
  }

  // 2. Year Alignment (Gaussian Decay) (15 pts)
  const extractYear = (y: string) => {
    if (!y) return 1;
    const match = y.match(/\d+/);
    return match ? parseInt(match[0]) : 1;
  };
  const y1 = extractYear(currentUser.year);
  const y2 = extractYear(targetUser.year);
  const yearDelta = Math.abs(y1 - y2);
  // Max 15 points. Fast decay: diff of 0 = 15, diff of 1 = ~8.2, diff of 2 = ~1.3
  const yearScore = 15 * Math.exp(-0.6 * Math.pow(yearDelta, 2));
  score += yearScore;

  // 3. Branch Cross-Pollination (Bonus up to 5 pts)
  const b1 = (currentUser.branch || "").toLowerCase().trim();
  const b2 = (targetUser.branch || "").toLowerCase().trim();
  if (b1 === b2 && b1 !== "") {
    score += 5; // Exact same major
  } else {
    const words1 = b1.split(' ');
    const words2 = b2.split(' ');
    const sharedWords = words1.filter((w: string) => words2.includes(w) && w.length > 3);
    if (sharedWords.length > 0) {
      score += 3; // Related majors
    }
  }

  // --- CLUSTER B: Vibe Matrix (Max 30 points) ---
  
  // 1. Study Vibe (10 points)
  if (cAnswers.studyVibe === tAnswers.studyVibe) {
    score += 10;
  } else {
    score += 4; 
  }

  // 2. Weekend Vibe (10 points)
  const w1 = cAnswers.weekendVibe;
  const w2 = tAnswers.weekendVibe;
  if (w1 === w2) {
    score += 10;
  } else {
    // Evaluate energy compatibility
    const highEnergy = ["Frat Basement", "Downtown Bar"];
    if (highEnergy.includes(w1) && highEnergy.includes(w2)) {
      score += 7; // Both like going out
    } else {
      score += 3; // Introvert vs Extrovert
    }
  }

  // 3. Stress/Workflow Level (10 points)
  if (cAnswers.stressLevel === tAnswers.stressLevel) {
    score += 10; // Same workflow
  } else {
    score += 6; // Procrastinator + Planner = Complementary duo
  }

  // --- CLUSTER C: Skip Class Routine (Max 15 points) ---
  const s1 = cAnswers.skipClass;
  const s2 = tAnswers.skipClass;
  if (s1 === s2 && s1) {
    score += 15; // Exact location match
  } else {
    const active = ["Cafe / Canteen", "Gym"];
    if (s1 && s2 && active.includes(s1) && active.includes(s2)) {
      score += 8; // Both social/active skippers
    } else {
      score += 3; // Mismatched energy (e.g. Dorm Bed vs Gym)
    }
  }

  // --- CLUSTER D: Demographic Parity & Smoothing (Max 5 points) ---
  const g1 = currentUser.gender || "";
  const g2 = targetUser.gender || "";
  if (g1 !== g2 && g1 !== "" && g2 !== "") {
    score += 5; // Diversity bump 
  } else {
    score += 2;
  }

  // --- CLUSTER E: Semantic "Hot Take" Similarity Hash (Max 20 points) ---
  const h1 = cAnswers.hotTake || "";
  const h2 = tAnswers.hotTake || "";
  
  const similarity = jaccardSimilarity(h1, h2);
  
  if (similarity > 0) {
    // Boost significantly if there's actual text overlap (max 20 points)
    // A 0.5 Jaccard is very high for short text, so we multiply by 40 to scale it up
    score += Math.min(20, similarity * 40); 
  } else {
    // Pseudo-random deterministic fallback based on ID so it isn't strictly 0
    const seedString = [currentUser.uid, targetUser.id].sort().join(':');
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
      hash |= 0; 
    }
    score += Math.abs(hash) % 8; // fallback 0-7 points
  }

  // --- 6. Normalization (Cap at 99%) ---
  score = Math.round(score);
  return Math.min(score, 99); 
}
