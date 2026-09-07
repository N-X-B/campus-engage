// Calculates the Matchability Factor between two users (returns a score from 0 to 100)
export function calculateMatchScore(currentUser: any, targetUser: any): number {
  if (!currentUser?.answers || !targetUser?.answers) {
    // Fallback if someone hasn't completed the vibe check
    return Math.floor(Math.random() * 40) + 40; 
  }

  let score = 0;
  const maxScore = 100;

  // 1. Academic Alignment (20%)
  if (currentUser.year === targetUser.year) score += 10;
  if (currentUser.branch?.toLowerCase() === targetUser.branch?.toLowerCase()) score += 10;

  // 2. Vibe Check Alignment (50%)
  const cAnswers = currentUser.answers;
  const tAnswers = targetUser.answers;

  // Study Vibe (20 points)
  if (cAnswers.studyVibe === tAnswers.studyVibe) {
    score += 20;
  }

  // Weekend Vibe (20 points)
  if (cAnswers.weekendVibe === tAnswers.weekendVibe) {
    score += 20;
  } else {
    // Partial logic: Bar and Frat are both "Going out"
    const goingOut = ["Frat Basement", "Downtown Bar"];
    if (goingOut.includes(cAnswers.weekendVibe) && goingOut.includes(tAnswers.weekendVibe)) {
      score += 10; // Partial match
    }
  }

  // Stress Level (10 points)
  if (cAnswers.stressLevel === tAnswers.stressLevel) {
    score += 10;
  }

  // 3. Semantic Hot Take Similarity (30%)
  // In production, this would use OpenAI embeddings stored in a Vector DB.
  // For the MVP, we simulate semantic similarity using a deterministic hash based on their UIDs
  // so the score stays consistent between the same two users.
  const hash = (currentUser.uid + targetUser.id).split('').reduce((a: number, b: string) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const semanticScore = Math.abs(hash) % 31; // Returns 0-30
  score += semanticScore;

  // Ensure minimum baseline so users don't see 0% and feel bad
  if (score < 35) score = 35 + (Math.abs(hash) % 15);

  return Math.min(score, 100);
}
