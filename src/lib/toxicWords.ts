export const toxicWords = [
  // English Profanity & Slurs
  'bitch', 'fuck', 'slut', 'whore', 'ugly', 'die', 'kill', 'hate', 'cunt', 'fag', 'faggot', 'nigger', 'nigga', 'retard', 'dick', 'cock', 'pussy', 'asshole', 'motherfucker',
  
  // Hindi Profanity & Slurs (Romanized / Hinglish)
  // Base words
  'bhenchod', 'behenchod', 'madarchod', 'chutiya', 'bhosadike', 'bhosdike', 'bhadwe', 'gandu', 'randi', 'raand', 'kamina', 'kutta', 'kaminey', 'harami', 'haramzade', 'chinal', 'suar', 'hijda', 'chakka', 'tatte', 'lodu', 'lund', 'lavde', 'lawde', 'mutth', 'muth', 'jhant', 'jhat', 'gand', 'gaand', 'chudai', 'chod', 'chodenge',
  
  // Acronyms
  'bc', 'mc', 'bsdk', 'tmkc', 'mkl',
  
  // Deduplicated Base Word Matches (Since our logic strips repeated letters, we map to their reduced forms)
  // Example: "chutiya" reduced is "chutiya". "bhenchod" reduced is "bhenchod".
  // Note: For words that inherently have double letters like 'gaand', our logic reduces it to 'gand', 
  // so we ensure 'gand' is in the list above (which it is).
  
  // Phonetic & Typo Variations
  'bhnchod', 'bhnchd', 'behnchod', 'bhenchd',
  'mdrchod', 'madarchd', 'mdrchd',
  'chtiya', 'chutya', 'chootiya', 'chutiye',
  'bhosdi', 'bhosada', 'bhosda',
  'lnd', 'laude', 'lode', 'lowde',
  'gnd', 'gaandu',
  'rndi', 'raandi',
  
  // Hindi Profanity (Devanagari)
  'भेनचोद', 'बहनचोद', 'मदरचोद', 'चुतिया', 'चूतिया', 'भोसड़ीके', 'भोसडीके', 'भड़वे', 'गांडू', 'रंडी', 'कमीना', 'कुत्ता', 'हरामी', 'हरामजादे', 'सूअर', 'हिजड़ा', 'छक्का', 'लौड़े', 'लंड', 'लवड़े', 'झांट', 'गांड', 'चुदाई', 'चोद'
];
