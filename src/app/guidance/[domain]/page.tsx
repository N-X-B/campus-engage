"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const DOMAIN_DATA: Record<string, any> = {
  tech: {
    slug: 'tech',
    title: 'The Algorithm Oracle',
    subtitle: 'CSE · AI/ML · Software Engineering',
    emoji: '🔮',
    accent: 'text-indigo-400',
    border: 'border-indigo-500/30',
    glow: 'bg-indigo-500/10',
    gradient: 'from-indigo-500/20 to-violet-500/20',
    spiritualOpening: `The ancient rishis encoded the cosmos in mathematical patterns. You, the modern programmer, do the same. Every algorithm you write is a prayer. Every bug you fix is an act of karma yoga — selfless refinement of the craft.\n\nCode is not just logic. It is intention made manifest. Write with presence.`,
    roadmap: [
      { stage: 'Shishya', meaning: 'The Student', emoji: '📖', description: "Embrace beginner's mind. The wisest programmers never stop being students.", career: ['Master one language deeply (Python or JavaScript)', 'Build 3 real projects, not tutorials', 'Contribute to one open-source repo'], life: ['Wake 30 mins earlier — guard your morning mind', 'Journal daily: what did you learn? what confused you?', 'Delete social media from phone for 30 days'], wisdom: 'The bamboo takes 5 years underground before it grows 90 feet in 6 weeks.' },
      { stage: 'Sadhak', meaning: 'The Practitioner', emoji: '⚡', description: 'Discipline over motivation. The daily practice is everything.', career: ['Learn system design fundamentals', 'Get your first internship or freelance client', 'Build in public — share your work on LinkedIn/GitHub'], life: ['Adopt a 5 AM or 10 PM deep work block', 'Read 1 non-tech book per month', 'Find a mentor — someone 5 years ahead of you'], wisdom: "Do not seek to be better than others. Seek to be better than yesterday's version of yourself." },
      { stage: 'Guru', meaning: 'The Master', emoji: '🔥', description: 'True mastery reveals itself by making complex things beautifully simple.', career: ['Specialize: AI/ML, DevOps, Security, or Full-Stack', 'Lead a small team or own a product feature', 'Speak at a college tech event or write technical articles'], life: ['Build a personal philosophy — what do you stand for?', 'Start teaching someone else what you know', 'Adopt a physical practice (gym, yoga, sport)'], wisdom: "\"In the beginner's mind there are many possibilities, but in the expert's mind there are few.\" — Shunryu Suzuki" },
      { stage: 'Rishi', meaning: 'The Visionary', emoji: '🌌', description: 'The highest goal: create systems that outlive you.', career: ['Build something that solves a real-world problem', 'Mentor others freely — your legacy is in your students', 'Think in decades, not quarters'], life: ['Practice non-attachment to outcomes — ship, iterate, release', 'Cultivate silence — meditation is debugging your mind', 'Ask: "What would I build if money was not the goal?"'], wisdom: '"The measure of intelligence is the ability to change." — Albert Einstein' },
    ],
    dailyWisdom: [
      { quote: 'Programs must be written for people to read, and only incidentally for machines to execute.', source: 'Hal Abelson' },
      { quote: 'First, solve the problem. Then, write the code.', source: 'John Johnson' },
      { quote: 'Clean code always looks like it was written by someone who cares.', source: 'Robert C. Martin' },
      { quote: 'Be curious. Read widely. Try new things.', source: 'Aaron Swartz' },
      { quote: 'Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.', source: 'Antoine de Saint-Exupery' },
      { quote: 'Do what you can, with what you have, where you are.', source: 'Theodore Roosevelt' },
      { quote: 'An ounce of action is worth a ton of theory.', source: 'Ralph Waldo Emerson' },
      { quote: 'You are what you repeatedly do. Excellence is not an act but a habit.', source: 'Aristotle' },
      { quote: 'The impediment to action advances action. What stands in the way becomes the way.', source: 'Marcus Aurelius' },
      { quote: 'The wound is the place where the Light enters you.', source: 'Rumi' },
      { quote: 'If you want to go far, go together.', source: 'African Proverb' },
      { quote: 'Where focus goes, energy flows.', source: 'Tony Robbins' },
      { quote: 'The present moment always will have been.', source: 'Stoic Maxim' },
      { quote: 'Do not go where the path may lead. Go instead where there is no path and leave a trail.', source: 'Emerson' },
      { quote: 'Hardships often prepare ordinary people for an extraordinary destiny.', source: 'C.S. Lewis' },
      { quote: 'You have power over your mind — not outside events.', source: 'Marcus Aurelius' },
      { quote: 'Knowing yourself is the beginning of all wisdom.', source: 'Aristotle' },
      { quote: 'Be the change you wish to see in the world.', source: 'Mahatma Gandhi' },
      { quote: 'Arise, awake, and stop not until the goal is reached.', source: 'Swami Vivekananda' },
      { quote: 'The mind is everything. What you think, you become.', source: 'The Buddha' },
      { quote: 'Begin. The rest is easy.', source: 'A Sage' },
      { quote: 'Ships in harbour are safe, but that is not what ships are for.', source: 'John A. Shedd' },
      { quote: 'He who has a why can endure any how.', source: 'Friedrich Nietzsche' },
      { quote: 'In the middle of every difficulty lies opportunity.', source: 'Albert Einstein' },
      { quote: 'Whether you think you can, or think you cannot — you are right.', source: 'Henry Ford' },
      { quote: 'The only way to do great work is to love what you do.', source: 'Steve Jobs' },
      { quote: 'Your work is to discover your work and then with all your heart to give yourself to it.', source: 'The Buddha' },
      { quote: 'The journey of a thousand miles begins with a single step.', source: 'Lao Tzu' },
      { quote: 'We are what we repeatedly do. Excellence is a habit.', source: 'Aristotle' },
      { quote: 'I am not a product of my circumstances. I am a product of my decisions.', source: 'Stephen R. Covey' },
      { quote: 'Strive not to be a success, but rather to be of value.', source: 'Albert Einstein' },
    ],
    discoveryQuestions: [
      { q: 'If you could only write one program for the rest of your life that helped people, what would it do?', type: 'vision' },
      { q: 'What kind of problem makes you lose track of time when solving it?', type: 'calling' },
      { q: 'When you explain a technical concept to a non-technical person, how does it feel?', type: 'reflection' },
      { q: 'Are you building things, or are you running from something?', type: 'shadow' },
      { q: 'What would you build if you were guaranteed it would succeed?', type: 'vision' },
      { q: 'Who is the engineer/developer you most want to become? What are their daily habits?', type: 'identity' },
      { q: 'Is your code a reflection of your mind right now — chaotic or clear?', type: 'mindfulness' },
    ],
    resources: [
      { title: 'The Pragmatic Programmer', type: 'Book', link: '#', desc: 'Life philosophy disguised as a programming book.' },
      { title: 'CS50x by Harvard', type: 'Course (Free)', link: 'https://cs50.harvard.edu/x', desc: 'The best introduction to computer science, ever.' },
      { title: 'The Missing Semester of Your CS Education (MIT)', type: 'Course (Free)', link: 'https://missing.csail.mit.edu', desc: 'Tools every developer needs — not taught in class.' },
      { title: 'Atomic Habits by James Clear', type: 'Book', link: '#', desc: 'How to build the habits of elite performers.' },
      { title: 'Bhagavad Gita (As It Is)', type: 'Text (Free)', link: 'https://vedabase.io/en/library/bg/', desc: 'The original guide to performing your duty without ego.' },
    ],
  },
  seeker: {
    slug: 'seeker',
    title: 'The Eternal Seeker',
    subtitle: 'All Domains · The Undecided · The Curious',
    emoji: '🌌',
    accent: 'text-sky-400',
    border: 'border-sky-500/30',
    glow: 'bg-sky-500/10',
    gradient: 'from-sky-500/20 to-blue-500/20',
    spiritualOpening: `In the Mahabharata, Arjuna was not confused because he was weak. He was confused because he was perceptive enough to see the full complexity of his situation. His confusion was the beginning of wisdom, not the absence of it.\n\nIf you are still finding your path, you are not behind. The greatest thinkers — Darwin, Einstein, Tolkien — did not find their calling until their late twenties. The question is not "what should I do?" The question is "who am I becoming?"`,
    roadmap: [
      { stage: 'Shishya', meaning: 'The Curious One', emoji: '🔍', description: 'Not knowing is not a weakness. Exploring everything is the first duty.', career: ['Take one online course in something you know nothing about', 'Shadow someone in a field that interests you for a day', 'Do a strengths assessment (MBTI, Ikigai, StrengthsFinder)'], life: ['Start a notebook — write down what energizes you and what drains you', 'Travel somewhere new, even just a different part of your city', 'Talk to 5 professionals about what they actually do every day'], wisdom: '"The purpose of life is to be defeated by greater and greater things." — Rainer Maria Rilke' },
      { stage: 'Sadhak', meaning: 'The Experimenter', emoji: '🎲', description: 'Test hypotheses about your own life. Launch, learn, iterate.', career: ['Try a 30-day experiment in a new domain', 'Volunteer for an organization that moves you emotionally', 'Build something small — anything — and share it with the world'], life: ['Practice saying yes to more things than you are comfortable with', 'Study the Ikigai framework — passion + mission + profession + vocation', 'Remove one numbing thing from your life (excess scrolling, gaming)'], wisdom: '"Life is not a problem to be solved, but a reality to be experienced." — Soren Kierkegaard' },
      { stage: 'Guru', meaning: 'The Chooser', emoji: '🎯', description: 'Commitment is not the end of freedom. It is the beginning of depth.', career: ['Make a bet on your direction — commit for 2 years minimum', 'Build skills that transfer: communication, data, persuasion', 'Find what you would do for free and figure out how to get paid for it'], life: ['Embrace solitude — your clearest answers will not come from others', 'Read widely: philosophy, history, science, art', 'Stop comparing your chapter 1 to someone else\'s chapter 20'], wisdom: '"Until you make the unconscious conscious, it will direct your life." — Carl Jung' },
      { stage: 'Rishi', meaning: 'The Integrator', emoji: '♾️', description: 'The greatest calling is to become fully, authentically yourself.', career: ['Build a portfolio career — your unique blend IS your advantage', 'Create something original — a business, body of work, a life philosophy', 'Give freely what you have learned on your journey'], life: ['Ask: if fear was absent, what would I do tomorrow?', 'Practice Neti Neti — eliminate what you are not, until what remains is you', 'Recognize that the search itself was the answer'], wisdom: '"He who knows others is wise; he who knows himself is enlightened." — Lao Tzu' },
    ],
    dailyWisdom: [
      { quote: 'Not all those who wander are lost.', source: 'J.R.R. Tolkien' },
      { quote: 'The wound is the place where the Light enters you.', source: 'Rumi' },
      { quote: 'He who knows others is wise; he who knows himself is enlightened.', source: 'Lao Tzu' },
      { quote: 'Until you make the unconscious conscious, it will direct your life and you will call it fate.', source: 'Carl Jung' },
      { quote: 'Life is not a problem to be solved, but a reality to be experienced.', source: 'Soren Kierkegaard' },
      { quote: 'Your work is to discover your work and then with all your heart to give yourself to it.', source: 'The Buddha' },
      { quote: 'The purpose of life is to be defeated by greater and greater things.', source: 'Rainer Maria Rilke' },
      { quote: 'You have power over your mind — not outside events. Realize this, and you will find strength.', source: 'Marcus Aurelius' },
      { quote: 'Know thyself.', source: 'Socrates' },
      { quote: 'The mind is everything. What you think, you become.', source: 'The Buddha' },
      { quote: 'The impediment to action advances action. What stands in the way becomes the way.', source: 'Marcus Aurelius' },
      { quote: 'Do not go where the path may lead. Go where there is no path and leave a trail.', source: 'Ralph Waldo Emerson' },
      { quote: 'Arise, awake, and stop not until the goal is reached.', source: 'Swami Vivekananda' },
      { quote: 'Man is not the creature of circumstances, circumstances are the creatures of men.', source: 'Benjamin Disraeli' },
      { quote: 'In the middle of every difficulty lies opportunity.', source: 'Albert Einstein' },
      { quote: 'The present moment always will have been.', source: 'Stoic Maxim' },
      { quote: 'We do not see things as they are, we see them as we are.', source: 'Anais Nin' },
      { quote: 'Two roads diverged in a wood, and I took the one less traveled by.', source: 'Robert Frost' },
      { quote: 'You must be the change you wish to see in the world.', source: 'Mahatma Gandhi' },
      { quote: 'He who has a why can endure any how.', source: 'Friedrich Nietzsche' },
      { quote: 'Knowing yourself is the beginning of all wisdom.', source: 'Aristotle' },
      { quote: 'Excellence is never an accident. It is always the result of high intention.', source: 'Aristotle' },
      { quote: 'Every saint has a past. Every sinner has a future.', source: 'Oscar Wilde' },
      { quote: 'The secret of getting ahead is getting started.', source: 'Mark Twain' },
      { quote: 'Hardships often prepare ordinary people for an extraordinary destiny.', source: 'C.S. Lewis' },
      { quote: 'You are what you repeatedly do. Excellence is a habit.', source: 'Aristotle' },
      { quote: 'The only way to do great work is to love what you do.', source: 'Steve Jobs' },
      { quote: 'I am not a product of my circumstances. I am a product of my decisions.', source: 'Stephen R. Covey' },
      { quote: 'Life shrinks or expands in proportion to courage.', source: 'Anais Nin' },
      { quote: 'The journey of a thousand miles begins with a single step.', source: 'Lao Tzu' },
      { quote: 'Strive not to be a success, but rather to be of value.', source: 'Albert Einstein' },
    ],
    discoveryQuestions: [
      { q: 'What did you love doing at age 10, before the world told you what you "should" do?', type: 'vision' },
      { q: 'What makes you angry when it is done badly in the world? That anger is a clue.', type: 'calling' },
      { q: 'If everyone earned the same salary, what would you choose to do with your life?', type: 'reflection' },
      { q: 'What are you avoiding thinking about? Why?', type: 'shadow' },
      { q: 'What would you do if you knew you could not fail?', type: 'vision' },
      { q: 'Describe your ideal ordinary Tuesday in 5 years — not your ideal vacation.', type: 'identity' },
      { q: 'Are you confused, or are you afraid of committing to a wrong choice? There is a difference.', type: 'mindfulness' },
    ],
    resources: [
      { title: 'Ikigai: The Japanese Secret to a Long and Happy Life', type: 'Book', link: '#', desc: 'The 2,000-year-old framework for finding your reason for being.' },
      { title: 'The Almanack of Naval Ravikant', type: 'Book (Free PDF)', link: 'https://www.navalmanack.com/', desc: 'Clear thinking on wealth, happiness, and meaning.' },
      { title: "Man's Search for Meaning by Viktor Frankl", type: 'Book', link: '#', desc: 'The most important book on finding purpose under any circumstances.' },
      { title: 'Coursera — Learning How to Learn', type: 'Course (Free)', link: 'https://www.coursera.org/learn/learning-how-to-learn', desc: 'The most-enrolled online course in history. Learn how your brain learns.' },
      { title: 'Bhagavad Gita (As It Is)', type: 'Text (Free)', link: 'https://vedabase.io/en/library/bg/', desc: 'The original guide to acting in the face of uncertainty.' },
    ],
  },
};

// Fill remaining domains from seeker as fallback
const FALLBACK_DOMAINS: Record<string, any> = {
  mechanical: { title: 'The Iron Sage', subtitle: 'Mechanical Engineering · Design · Manufacturing', emoji: '⚙️', accent: 'text-orange-400', border: 'border-orange-500/30', glow: 'bg-orange-500/10', gradient: 'from-orange-500/20 to-amber-500/20' },
  civil: { title: 'The Earth Shaper', subtitle: 'Civil Engineering · Architecture', emoji: '🏔️', accent: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'bg-emerald-500/10', gradient: 'from-emerald-500/20 to-teal-500/20' },
  electrical: { title: 'The Current Keeper', subtitle: 'Electrical · Electronics · EEE · ECE', emoji: '⚡', accent: 'text-yellow-400', border: 'border-yellow-500/30', glow: 'bg-yellow-500/10', gradient: 'from-yellow-500/20 to-amber-500/20' },
  management: { title: 'The Dharmic Leader', subtitle: 'MBA · Business · Finance · Leadership', emoji: '🪷', accent: 'text-rose-400', border: 'border-rose-500/30', glow: 'bg-rose-500/10', gradient: 'from-rose-500/20 to-pink-500/20' },
  health: { title: 'The Healer Monk', subtitle: 'Pharmacy · Biotech · Life Sciences', emoji: '🌿', accent: 'text-green-400', border: 'border-green-500/30', glow: 'bg-green-500/10', gradient: 'from-green-500/20 to-emerald-500/20' },
  design: { title: 'The Vision Weaver', subtitle: 'Design · Arts · Media', emoji: '🎨', accent: 'text-fuchsia-400', border: 'border-fuchsia-500/30', glow: 'bg-fuchsia-500/10', gradient: 'from-fuchsia-500/20 to-purple-500/20' },
};

const UNIVERSAL_SPIRITUAL_OPENER: Record<string, string> = {
  mechanical: 'Vishwakarma — the divine architect — fashioned the weapons of the gods and the chariots of the devas. He is your patron. The mechanical engineer does not merely design machines; they give form to the laws of nature. Stress, strain, thermodynamics — these are not just formulae. They are the universal rules governing all matter.\n\nEvery structure you design is a temporary home for the eternal laws of physics. Build with humility and precision.',
  civil: 'The great temples of India — Brihadeeswara, Konark, Khajuraho — were built not by contractors, but by devotees. Civil engineers are the closest humans have ever come to the act of creation. You shape the land. You make rivers submit. You give shelter to millions.\n\nBuild as if your structures will outlast your name. Because the best ones will.',
  electrical: 'Prana — the life force — flows through all living things. Electricity, the physicist would say, is just electrons moving through a conductor. But those who work with it know it is something more. It is the invisible force that separates the modern world from the ancient one.\n\nYou are a keeper of this force. Channel it wisely. Every circuit you design becomes part of the infrastructure of civilization.',
  management: 'Chanakya did not build an empire through tactics alone. He built it through a deep understanding of human nature, philosophy, and the laws of cause and effect. The Arthashastra is not a business textbook. It is a guide to sovereign life.\n\nTrue leadership is the art of making others feel seen, heard, and capable of more than they thought possible.',
  health: 'Dhanvantari — the god of medicine — emerged from the cosmic ocean holding the nectar of immortality. Every healer carries a fragment of this ancient duty. To reduce suffering is the highest of all callings.\n\nDo not just treat the disease. Understand the life that created it. The body is not separate from the mind, the spirit, or the circumstances. Heal the whole.',
  design: 'In the beginning was the Word — and the Word was the first act of design. Every act of creation — a painting, a typeface, a user interface — is a small echo of the original creative act. The designer does not make things. The designer makes meaning.\n\nAsk not just "does this look good?" Ask "does this make someone feel something true?"',
};

export default function DomainGuidancePage() {
  const params = useParams();
  const domainSlug = (params.domain as string) || 'seeker';
  
  let data = DOMAIN_DATA[domainSlug];
  if (!data) {
    const fallback = FALLBACK_DOMAINS[domainSlug] || {};
    data = {
      ...DOMAIN_DATA.seeker,
      slug: domainSlug,
      spiritualOpening: UNIVERSAL_SPIRITUAL_OPENER[domainSlug] || DOMAIN_DATA.seeker.spiritualOpening,
      ...fallback,
    };
  }

  const dayOfMonth = new Date().getDate() - 1;
  const todayWisdom = data.dailyWisdom[dayOfMonth % data.dailyWisdom.length];

  const [activeStage, setActiveStage] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [savedJournals, setSavedJournals] = useState<Record<number, string>>({});
  const [activeTab, setActiveTab] = useState<'roadmap' | 'wisdom' | 'discover' | 'resources'>('roadmap');

  const currentStage = data.roadmap[activeStage];
  const currentQ = data.discoveryQuestions[questionIdx];

  const saveJournal = () => {
    if (journalText.trim()) {
      setSavedJournals((prev: Record<number, string>) => ({ ...prev, [questionIdx]: journalText }));
      setJournalText('');
      setShowAnswer(false);
      if (questionIdx < data.discoveryQuestions.length - 1) {
        setQuestionIdx((q: number) => q + 1);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-32">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className={`absolute top-[-10%] left-[5%] w-[50%] h-[50%] ${data.glow} opacity-30 rounded-full blur-[160px]`} />
        <div className="absolute bottom-[-20%] right-0 w-[40%] h-[50%] bg-violet-500/5 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-4xl mx-auto px-5 pt-14 pb-8">
        <Link href="/guidance" className="inline-flex items-center gap-2 text-zinc-600 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors mb-10">
          ← All Paths
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
          <div className={`inline-flex items-center gap-3 ${data.border} border ${data.glow} rounded-2xl px-5 py-3 mb-6`}>
            <span className="text-3xl">{data.emoji}</span>
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest ${data.accent}`}>{data.subtitle}</p>
              <h1 className="text-2xl font-black text-white">{data.title}</h1>
            </div>
          </div>
          <div className={`p-6 rounded-2xl border ${data.border} bg-gradient-to-br ${data.gradient}`}>
            {data.spiritualOpening.split('\n\n').map((para: string, i: number) => (
              <p key={i} className={`text-zinc-300 leading-relaxed text-sm ${i > 0 ? 'mt-4' : ''}`}>{para}</p>
            ))}
          </div>
        </motion.div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {(['roadmap', 'wisdom', 'discover', 'resources'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? `${data.glow} border ${data.border} ${data.accent}` : 'text-zinc-600 hover:text-zinc-400 border border-transparent'}`}>
              {tab === 'roadmap' && '🗺 Roadmap'}
              {tab === 'wisdom' && '☀️ Today'}
              {tab === 'discover' && '🪬 Discover'}
              {tab === 'resources' && '📚 Resources'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'roadmap' && (
            <motion.div key="roadmap" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <p className="text-zinc-500 text-sm mb-6">Four stages — not milestones to rush through, but states of being to grow into.</p>
              <div className="flex gap-2 mb-6 flex-wrap">
                {data.roadmap.map((s: any, i: number) => (
                  <button key={i} onClick={() => setActiveStage(i)} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeStage === i ? `${data.glow} border ${data.border} ${data.accent}` : 'border border-white/5 text-zinc-600 hover:text-zinc-400'}`}>
                    {s.emoji} {s.stage}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={activeStage} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className={`p-6 rounded-2xl border ${data.border} bg-gradient-to-br ${data.gradient} mb-4`}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${data.glow} border ${data.border} flex-shrink-0`}>{currentStage.emoji}</div>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-widest ${data.accent}`}>{currentStage.meaning}</p>
                        <h2 className="text-2xl font-black text-white">{currentStage.stage}</h2>
                        <p className="text-zinc-400 text-sm mt-1 italic">{currentStage.description}</p>
                      </div>
                    </div>
                    <div className="border-t border-white/5 pt-4 mt-4">
                      <p className={`text-xs font-bold uppercase tracking-widest ${data.accent} mb-2`}>Wisdom for this stage</p>
                      <p className="text-zinc-300 text-sm italic">&quot;{currentStage.wisdom}&quot;</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">⚡ Career Actions</p>
                      <ul className="space-y-3">
                        {currentStage.career.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                            <span className={`w-5 h-5 rounded-full ${data.glow} border ${data.border} flex items-center justify-center text-[10px] font-black ${data.accent} flex-shrink-0 mt-0.5`}>{i + 1}</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">🌱 Life Adoptions</p>
                      <ul className="space-y-3">
                        {currentStage.life.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                            <span className="text-lg flex-shrink-0">{['🔥', '🌿', '✨'][i] || '•'}</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4 gap-3">
                    <button disabled={activeStage === 0} onClick={() => setActiveStage(s => s - 1)} className="flex-1 py-3 rounded-xl border border-white/5 text-zinc-600 hover:text-white hover:border-white/20 transition-all text-sm font-bold disabled:opacity-30">← Previous Stage</button>
                    <button disabled={activeStage === data.roadmap.length - 1} onClick={() => setActiveStage(s => s + 1)} className={`flex-1 py-3 rounded-xl border ${data.border} ${data.accent} ${data.glow} transition-all text-sm font-bold disabled:opacity-30`}>Next Stage →</button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'wisdom' && (
            <motion.div key="wisdom" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className={`p-8 rounded-2xl border ${data.border} bg-gradient-to-br ${data.gradient} text-center mb-6`}>
                <div className="text-4xl mb-4">{data.emoji}</div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Today — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                <blockquote className="text-2xl md:text-3xl font-black text-white leading-tight mb-6">&quot;{todayWisdom.quote}&quot;</blockquote>
                <p className={`text-sm font-bold ${data.accent}`}>— {todayWisdom.source}</p>
              </div>
              <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6 mb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">📝 Reflect on this</p>
                <p className="text-zinc-300 text-sm leading-relaxed">How does this quote apply to where you are right now in your studies, your relationships, your daily habits? Sit with it for 5 minutes before scrolling.</p>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: 30 }, (_, i) => {
                  const isToday = i === dayOfMonth % 30;
                  const isPast = i < dayOfMonth % 30;
                  return (
                    <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold ${isToday ? `${data.glow} border ${data.border} ${data.accent}` : isPast ? 'bg-white/5 text-zinc-700' : 'bg-black/20 text-zinc-800'}`}>
                      {i + 1}
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-zinc-700 text-xs mt-3">30-day wisdom calendar · A new quote every day</p>
            </motion.div>
          )}

          {activeTab === 'discover' && (
            <motion.div key="discover" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <p className="text-zinc-500 text-sm mb-6">Sit quietly. Read the question. Answer honestly — not for anyone else, just for you.</p>
              <div className="flex gap-1.5 mb-6 flex-wrap">
                {data.discoveryQuestions.map((_: any, i: number) => (
                  <button key={i} onClick={() => { setQuestionIdx(i); setShowAnswer(false); setJournalText(''); }} className={`w-9 h-9 rounded-full text-xs font-black transition-all ${i === questionIdx ? `${data.glow} border ${data.border} ${data.accent}` : savedJournals[i] ? 'bg-white/10 text-white border border-white/10' : 'border border-white/5 text-zinc-700'}`}>
                    {savedJournals[i] ? '✓' : i + 1}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={questionIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className={`p-7 rounded-2xl border ${data.border} bg-gradient-to-br ${data.gradient} mb-4`}>
                    <p className={`text-xs font-bold uppercase tracking-widest ${data.accent} mb-4`}>Question {questionIdx + 1} of {data.discoveryQuestions.length}</p>
                    <h2 className="text-xl md:text-2xl font-black text-white leading-snug">{currentQ.q}</h2>
                    <p className="text-zinc-600 text-xs mt-3 uppercase tracking-widest">Theme: {currentQ.type}</p>
                  </div>
                  {!showAnswer ? (
                    <button onClick={() => setShowAnswer(true)} className={`w-full py-4 rounded-xl border ${data.border} ${data.accent} ${data.glow} font-bold text-sm transition-all hover:scale-[1.01]`}>
                      I am ready to reflect →
                    </button>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <textarea value={journalText} onChange={e => setJournalText(e.target.value)} placeholder="Write your honest thoughts here... this is just for you." rows={5} className="w-full bg-zinc-900/60 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none placeholder:text-zinc-700 mb-3" />
                      <div className="flex gap-3">
                        <button onClick={saveJournal} disabled={!journalText.trim()} className={`flex-1 py-3 rounded-xl border ${data.border} ${data.accent} ${data.glow} font-bold text-sm disabled:opacity-30`}>
                          {questionIdx < data.discoveryQuestions.length - 1 ? 'Save & Next →' : 'Complete Reflection ✓'}
                        </button>
                        <button onClick={() => setShowAnswer(false)} className="px-5 py-3 rounded-xl border border-white/5 text-zinc-600 hover:text-white font-bold text-sm">Skip</button>
                      </div>
                    </motion.div>
                  )}
                  {savedJournals[questionIdx] && (
                    <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-xs text-zinc-600 uppercase tracking-widest font-bold mb-2">Your reflection</p>
                      <p className="text-zinc-400 text-sm">{savedJournals[questionIdx]}</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              {Object.keys(savedJournals).length === data.discoveryQuestions.length && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-6 p-6 rounded-2xl border ${data.border} ${data.glow} text-center`}>
                  <div className="text-4xl mb-3">🙏</div>
                  <h3 className={`text-lg font-black ${data.accent} mb-2`}>Reflection Complete</h3>
                  <p className="text-zinc-400 text-sm">You have looked within. That is the rarest act of courage. Come back tomorrow.</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'resources' && (
            <motion.div key="resources" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <p className="text-zinc-500 text-sm mb-6">Curated for your path. Not what the syllabus says — what will actually change you.</p>
              <div className="space-y-4">
                {data.resources.map((r: any, i: number) => (
                  <motion.a key={i} href={r.link} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className={`flex items-start gap-4 p-5 rounded-2xl border ${data.border} bg-gradient-to-br ${data.gradient} group hover:scale-[1.01] transition-all block`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${data.glow} border ${data.border} flex-shrink-0`}>📖</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-black text-white">{r.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/30 ${data.accent} border ${data.border} flex-shrink-0 mt-0.5`}>{r.type}</span>
                      </div>
                      <p className="text-zinc-500 text-sm mt-1">{r.desc}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
              <div className="mt-8 p-6 rounded-2xl border border-white/5 bg-zinc-900/40 text-center">
                <p className="text-zinc-600 text-xs uppercase tracking-widest font-bold mb-2">A note on learning</p>
                <p className="text-zinc-400 text-sm italic leading-relaxed">&quot;The things you learn from books give you the language. The things you learn from life give you the wisdom. Seek both, but trust the latter more.&quot;</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
