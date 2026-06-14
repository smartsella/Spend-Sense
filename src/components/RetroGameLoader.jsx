import React, { useState, useEffect } from 'react';
import { FiTv, FiVolume2, FiVolumeX, FiInfo } from 'react-icons/fi';

const LOADING_MESSAGES = [
  "STAGE 1: INFLATION DODGING...",
  "COLLECTING GREENBACK COINS...",
  "POWERING UP: SALARY DEPOSITED!",
  "AVOIDING OVERDRAFT INTRUDERS...",
  "FEEDING THE PIGGY BANK MONSTER...",
  "TAX SEASON BOSS LEVEL DETECTED...",
  "COMPILING WALLET CHECKPOINTS...",
  "BUDGET BLOCKER ACTIVATED!"
];

const RetroGameLoader = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isMuted, setIsMuted] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [highScore, setHighScore] = useState(9999);

  // Score counter loop
  useEffect(() => {
    const scoreInterval = setInterval(() => {
      setScore((prev) => {
        const nextScore = prev + 10;
        if (nextScore > highScore) {
          setHighScore(nextScore);
        }
        return nextScore;
      });
    }, 150);

    return () => clearInterval(scoreInterval);
  }, [highScore]);

  // Loading message rotation loop
  useEffect(() => {
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIdx]);
    }, 1800);

    return () => clearInterval(msgInterval);
  }, []);

  // Lives countdown loop just for humor
  useEffect(() => {
    const livesInterval = setInterval(() => {
      setLives((prev) => {
        if (prev <= 1) return 3; // Reset to 3
        return prev - 1;
      });
    }, 6000);

    return () => clearInterval(livesInterval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0c0a1a] to-[#040308] text-white p-4 font-mono select-none overflow-hidden relative">
      {/* Background Retro Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] z-10 pointer-events-none"></div>

      {/* Cyberpunk grid bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 opacity-20 bg-[linear-gradient(to_bottom,transparent,rgba(99,102,241,0.2)),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom z-0"></div>

      {/* Retro Arcade Console Body */}
      <div className="w-full max-w-lg glass-panel bg-zinc-950/90 border-4 border-indigo-500/30 p-6 flex flex-col gap-4 shadow-[0_0_50px_rgba(99,102,241,0.15)] z-20 relative">
        {/* Neon Bezel Corners */}
        <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-4 border-l-4 border-indigo-400"></div>
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-4 border-r-4 border-indigo-400"></div>
        <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-4 border-l-4 border-indigo-400"></div>
        <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-4 border-r-4 border-indigo-400"></div>

        {/* Console Header */}
        <div className="flex justify-between items-center border-b-2 border-indigo-500/20 pb-3">
          <div className="flex items-center gap-2 text-indigo-400">
            <FiTv className="animate-pulse text-lg" />
            <span className="text-xs font-bold tracking-widest uppercase text-shadow-neon">SPENDSENSE CABINET v1.0</span>
          </div>
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-indigo-400 transition-colors"
          >
            {isMuted ? <FiVolumeX /> : <FiVolume2 className="animate-bounce" />}
          </button>
        </div>

        {/* Retro Game screen */}
        <div className="relative aspect-[16/9] w-full rounded-xl bg-black border-2 border-zinc-800/80 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
          {/* Scanline CRT simulation */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent bg-[size:100%_8px] pointer-events-none z-30"></div>

          {/* Top Info Bar */}
          <div className="flex justify-between items-center text-[10px] font-bold text-indigo-400 z-20">
            <div>
              <span>SCORE</span>
              <p className="text-sm font-black text-white tracking-widest mt-0.5">
                {String(score).padStart(6, '0')}
              </p>
            </div>
            <div className="text-center">
              <span>HIGH SCORE</span>
              <p className="text-sm font-black text-amber-400 tracking-widest mt-0.5">
                {String(highScore).padStart(6, '0')}
              </p>
            </div>
            <div className="text-right">
              <span>LIVES</span>
              <div className="flex gap-1 justify-end mt-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span 
                    key={i} 
                    className={`text-xs transition-opacity duration-300 ${
                      i < lives ? 'text-red-505 animate-pulse' : 'text-zinc-850 opacity-20'
                    }`}
                  >
                    ❤️
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Game Arena */}
          <div className="flex-1 relative overflow-hidden flex items-end pb-2">
            {/* Ground Line */}
            <div className="absolute bottom-2 left-0 right-0 h-0.5 bg-indigo-500/50"></div>

            {/* Bouncing Coin Dots */}
            <div className="absolute bottom-10 left-[40%] text-xs animate-bounce delay-100 z-10">
              🪙
            </div>
            <div className="absolute bottom-14 left-[65%] text-xs animate-bounce delay-300 z-10">
              💎
            </div>
            <div className="absolute bottom-12 left-[85%] text-xs animate-bounce delay-700 z-10">
              🪙
            </div>

            {/* Retro Piggy Bank Running & Jumping character */}
            <div className="absolute bottom-2.5 left-10 text-3xl animate-[piggyJump_2.4s_infinite_ease-in-out] z-20 origin-bottom select-none">
              <div className="animate-[piggyRun_0.3s_infinite_linear]">
                🐷
              </div>
            </div>

            {/* Incoming Bills & Tax Obstacles sliding right-to-left */}
            <div className="absolute bottom-2.5 right-[-50px] text-xl animate-[obstacleSlide_2.4s_infinite_linear] z-20 select-none">
              📉
            </div>
            <div className="absolute bottom-2.5 right-[-150px] text-xl animate-[obstacleSlide_2.4s_infinite_linear_0.8s] z-20 select-none">
              💸
            </div>
            <div className="absolute bottom-2.5 right-[-250px] text-xl animate-[obstacleSlide_2.4s_infinite_linear_1.6s] z-20 select-none">
              🚨
            </div>

            {/* Retro Game Grid background lines inside screen */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none"></div>
          </div>

          {/* Bottom Screen Bar */}
          <div className="border-t border-zinc-900 pt-2 flex justify-between items-center text-[10px] font-bold text-gray-500 z-20">
            <span className="animate-pulse text-indigo-400 uppercase tracking-widest">
              {loadingMsg}
            </span>
            <span className="text-zinc-500">STAGE 01</span>
          </div>

          {/* Retro styling custom keyframe animations */}
          <style>{`
            @keyframes piggyJump {
              0%, 100% { transform: translateY(0) scaleY(1); }
              5% { transform: translateY(0) scaleY(0.8); }
              15% { transform: translateY(-48px) scaleY(1.05); }
              30% { transform: translateY(-48px) scaleY(1); }
              40% { transform: translateY(0) scaleY(0.9); }
              45% { transform: translateY(0) scaleY(1); }
            }
            @keyframes piggyRun {
              0%, 100% { transform: rotate(-4deg); }
              50% { transform: rotate(4deg) translateY(-2px); }
            }
            @keyframes obstacleSlide {
              0% { right: -50px; }
              100% { right: 110%; }
            }
            .text-shadow-neon {
              text-shadow: 0 0 5px rgba(99, 102, 241, 0.6);
            }
            .text-red-550 {
              color: #f43f5e;
            }
            .text-red-505 {
              text-shadow: 0 0 5px rgba(244, 63, 94, 0.8);
            }
          `}</style>
        </div>

        {/* Loading Progress Bar */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            <span>Cabinet Memory Syncing...</span>
            <span className="animate-pulse text-indigo-400">STAGE START</span>
          </div>
          <div className="w-full bg-zinc-900 border border-zinc-800 h-4 rounded overflow-hidden p-0.5 shadow-inner">
            <div className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 rounded-sm animate-[loadingFill_12s_infinite_linear]"></div>
          </div>
        </div>

        {/* Funny Controller Help Bar */}
        <div className="flex items-start gap-2 bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-lg text-[10px] font-bold leading-relaxed text-indigo-400 uppercase tracking-wider">
          <FiInfo className="text-sm shrink-0 mt-0.5" />
          <span>Tip: The piggy bank automatically jumps over red down-trends to save your cash! Standby for ledger dashboard booting.</span>
        </div>
      </div>

      {/* Styled loading progress bar animation */}
      <style>{`
        @keyframes loadingFill {
          0% { width: 5%; }
          15% { width: 25%; }
          30% { width: 25%; }
          45% { width: 50%; }
          65% { width: 75%; }
          85% { width: 90%; }
          100% { width: 98%; }
        }
      `}</style>
    </div>
  );
};

export default RetroGameLoader;
