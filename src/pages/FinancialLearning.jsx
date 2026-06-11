import React, { useState, useEffect } from 'react';
import { WealthBuildingIllustration, InvestmentIllustration, LearningIllustration } from '../components/Illustrations';
import { FiBookOpen, FiArrowRight, FiCheckSquare, FiAward, FiSun, FiBookmark, FiRefreshCw } from 'react-icons/fi';

const QUOTES = [
  { text: "Do not save what is left after spending, spend what is left after saving.", author: "Warren Buffett" },
  { text: "A budget is telling your money where to go instead of wondering where it went.", author: "Dave Ramsey" },
  { text: "Beware of little expenses; a small leak will sink a great ship.", author: "Benjamin Franklin" },
  { text: "The safest way to double your money is to fold it over once and put it in your pocket.", author: "Kin Hubbard" },
  { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" }
];

const FinancialLearning = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState({
    name: "52-Week Savings Challenge",
    desc: "Save incremental amounts each week. Week 1: ₹100, Week 2: ₹200, up to Week 52: ₹5200. Total Target: ₹1,37,800.",
    progress: 35
  });

  // Dynamic Quote rotation every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const dailyTips = [
    "Follow the 50/30/20 budget framework: 50% Needs, 30% Wants, 20% Savings.",
    "Perform a subscription audit. Track and delete recurring bills for services you haven't opened in 30 days.",
    "Implement the 24-hour rule for impulse buys. Wait a day before final purchase checkouts.",
    "Automate your savings deposit triggers to execute immediately upon monthly salary payouts."
  ];

  const financialHabits = [
    { name: "Check Daily Spend logs", checked: true },
    { name: "Verify category budget status", checked: true },
    { name: "Maintain 3 to 6 months emergency buffer", checked: false },
    { name: "Review portfolio growth trends", checked: false }
  ];

  const articles = [
    {
      title: "Budget Planning for Beginners",
      desc: "Learn to build balanced financial systems. Master allocation thresholds and manage variable cash flows.",
      duration: "4 min read",
      topic: "Budgeting"
    },
    {
      title: "Understanding Compound Interest",
      desc: "The mathematical engine behind passive investment portfolio growth. How starting early accelerates wealth yields.",
      duration: "6 min read",
      topic: "Investing"
    },
    {
      title: "Tactical Debt Reduction Schemes",
      desc: "Compare snowball vs avalanche techniques to systematically eliminate personal liabilities and card interest.",
      duration: "5 min read",
      topic: "Debt Management"
    }
  ];

  const guides = [
    { title: "Save your first ₹10,000", steps: "4 strategic action items" },
    { title: "Building a bulletproof monthly budget", steps: "5 step guide" },
    { title: "Top 5 common money mistakes to avoid", steps: "Red flags checklists" },
    { title: "Beginner investing concept keys", steps: "6 definitions overview" }
  ];

  return (
    <div className="flex flex-col gap-6 fade-in-slide">
      {/* Header */}
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-gray-800 dark:text-white leading-none">
          Financial Learning Center
        </h2>
        <p className="text-xs text-gray-400 mt-1.5">Improve your personal finance knowledge and wealth building habits</p>
      </div>

      {/* Dynamic Quote & Hero Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Quote Card */}
        <div className="glass-panel p-6 shadow-sm lg:col-span-8 flex flex-col justify-between min-h-[180px]">
          <div>
            <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
              Financial Wisdom
            </span>
            <blockquote className="font-heading italic text-base sm:text-lg text-gray-800 dark:text-white font-medium mt-3 leading-relaxed">
              "{QUOTES[quoteIndex].text}"
            </blockquote>
          </div>
          <div className="flex items-center justify-between mt-4 border-t border-gray-200/50 dark:border-gray-800/40 pt-3">
            <cite className="text-xs font-bold text-gray-500 dark:text-gray-400 not-italic">
              — {QUOTES[quoteIndex].author}
            </cite>
            <button
              onClick={handleNextQuote}
              className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 transition-all cursor-pointer"
            >
              <FiRefreshCw className="text-xs" />
            </button>
          </div>
        </div>

        {/* Learning Illustration Panel */}
        <div className="hidden lg:flex lg:col-span-4 glass-card bg-gradient-to-br from-indigo-950/5 to-violet-950/5 p-5 flex-col justify-between items-center text-center">
          <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">Academy Hub</span>
          <div className="w-24">
            <LearningIllustration />
          </div>
          <p className="text-[10px] text-gray-400 leading-normal max-w-[200px]">
            Access our tactical wealth guidelines, savings benchmarks, and habits lists dynamically.
          </p>
        </div>
      </div>

      {/* Tips and Habit challenges section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Savings tips */}
        <div className="glass-panel p-5 shadow-sm lg:col-span-2">
          <h3 className="font-heading font-extrabold text-sm text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FiBookmark className="text-indigo-500" /> Savings Strategies
          </h3>
          <div className="flex flex-col gap-3">
            {dailyTips.map((tip, index) => (
              <div key={index} className="p-3.5 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 border-l-2 border-indigo-500 text-xs font-semibold leading-relaxed text-gray-700 dark:text-gray-300">
                {tip}
              </div>
            ))}
          </div>
        </div>

        {/* Habits Checklist / Awareness dashboard */}
        <div className="glass-panel p-5 shadow-sm">
          <h3 className="font-heading font-extrabold text-sm text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FiCheckSquare className="text-indigo-500" /> Habits Tracker
          </h3>
          <div className="flex flex-col gap-3">
            {financialHabits.map((habit, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <input
                  type="checkbox"
                  checked={habit.checked}
                  readOnly
                  className="accent-indigo-500 w-4 h-4 rounded border-gray-300"
                />
                <span className={`text-xs font-bold ${habit.checked ? 'line-through text-gray-400' : 'text-gray-750 dark:text-gray-200'}`}>
                  {habit.name}
                </span>
              </div>
            ))}
          </div>

          {/* Savings Challenge Widget */}
          <div className="mt-6 border-t border-gray-200/50 dark:border-gray-800/40 pt-4">
            <h4 className="font-heading font-extrabold text-xs text-gray-800 dark:text-white mb-2">
              {activeChallenge.name}
            </h4>
            <p className="text-[10px] text-gray-400 leading-normal mb-3">
              {activeChallenge.desc}
            </p>
            <div className="flex justify-between text-[9px] font-bold text-indigo-500 mb-1.5 uppercase">
              <span>Savings Progress</span>
              <span>{activeChallenge.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${activeChallenge.progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div>
        <h3 className="font-heading font-extrabold text-sm text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FiBookOpen className="text-indigo-500" /> Personal Finance Articles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art, idx) => (
            <div key={idx} className="glass-card p-5 flex flex-col justify-between min-h-[180px]">
              <div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 uppercase">
                  {art.topic}
                </span>
                <h4 className="font-heading font-bold text-sm text-gray-800 dark:text-white mt-2.5 leading-snug">
                  {art.title}
                </h4>
                <p className="text-[11px] text-gray-450 mt-2 leading-relaxed">
                  {art.desc}
                </p>
              </div>
              <div className="flex items-center justify-between mt-4 border-t border-gray-200/30 dark:border-gray-800/20 pt-3 text-[10px] font-semibold text-gray-400">
                <span>{art.duration}</span>
                <span className="flex items-center gap-1 text-indigo-500 hover:underline cursor-pointer">
                  Read Article <FiArrowRight />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guides section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 shadow-sm">
          <h3 className="font-heading font-extrabold text-sm text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FiAward className="text-indigo-500" /> Wealth Building Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {guides.map((g, index) => (
              <div key={index} className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent hover:border-indigo-500/20 transition-all cursor-pointer">
                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  {g.title}
                </h4>
                <span className="text-[9px] text-indigo-500 dark:text-indigo-400 font-semibold mt-1 block uppercase">
                  {g.steps}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic illustrations split */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4 flex flex-col justify-between items-center text-center">
            <span className="text-[9px] font-bold text-gray-400 uppercase">Investment Basics</span>
            <div className="w-16">
              <InvestmentIllustration />
            </div>
            <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Start Investing</span>
          </div>
          <div className="glass-card p-4 flex flex-col justify-between items-center text-center">
            <span className="text-[9px] font-bold text-gray-400 uppercase">Wealth Multiplication</span>
            <div className="w-16">
              <WealthBuildingIllustration />
            </div>
            <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Compound Interest</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialLearning;
