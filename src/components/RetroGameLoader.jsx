import React, { useState, useEffect, useRef } from 'react';
import { FiTv, FiVolume2, FiVolumeX, FiInfo, FiCpu } from 'react-icons/fi';

const LOADING_MESSAGES = [
  "STAGE 1: ALIGNING CODES...",
  "OPTIMIZING LEDGER BANDWIDTH...",
  "SYNCING LEDGER ASSETS...",
  "SHIELDING CRYPTO WALLETS...",
  "FEEDING THE SAVINGS GRAPH...",
  "CALCULATING INSIGHT ARRAYS...",
  "SYNCING LEDGER STACKS...",
  "COMPILING WALLET CHECKPOINTS...",
];

const RetroGameLoader = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isMuted, setIsMuted] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('align_game_highscore');
    return saved ? parseInt(saved, 10) : 1000;
  });

  const [gameState, setGameState] = useState('playing'); // 'playing' | 'stopped' | 'gameover'
  const [feedback, setFeedback] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('');
  const [identityLogs, setIdentityLogs] = useState([
    "INITIALIZING LOGIN SEQUENCER...",
    "WAITING FOR BIOMETRIC HANDSHAKE..."
  ]);

  const boxRef = useRef(null);
  const posRef = useRef(50); // percentage 10 to 90
  const dirRef = useRef(1); // 1 or -1
  const speedRef = useRef(1.8);
  const audioCtxRef = useRef(null);

  // Web Audio tone generator
  const playTone = (freq, duration, type = 'sine') => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const audioCtx = audioCtxRef.current;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = type;
      oscillator.frequency.value = freq;
      
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Web Audio API failed:", e);
    }
  };

  // Rotating logs to simulate server checks
  useEffect(() => {
    const logPool = [
      "ESTABLISHING SECURE SSH TUNNEL...",
      "CHECKING JSONWEBTOKEN SCHEMAS...",
      "RESOLVING SYSTEM DECOUPLERS...",
      "PULLING INCOMES LEDGER NODE...",
      "COMPILING REALTIME INSIGHTS...",
      "DECRYPTING DATABASE PORTFOLIO...",
      "DEVICES VERIFIED: SUCCESS",
      "CHECKING EXPENDITURE THRESHOLDS..."
    ];
    
    const interval = setInterval(() => {
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
      setIdentityLogs((prev) => {
        const next = [...prev, randomLog];
        if (next.length > 3) next.shift(); // Keep latest 3 logs
        return next;
      });
    }, 2800);
    
    return () => clearInterval(interval);
  }, []);

  // Loading messages rotation
  useEffect(() => {
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIdx]);
    }, 2000);

    return () => clearInterval(msgInterval);
  }, []);

  // Animation Loop (butter-smooth direct DOM modification to bypass React render cycle lag)
  useEffect(() => {
    if (gameState !== 'playing') return;
    let animationFrameId;
    let lastTime = performance.now();
    
    const update = (time) => {
      const dt = Math.min((time - lastTime) / 16.666, 3); // cap dt to prevent huge jumps
      lastTime = time;
      
      posRef.current += dirRef.current * speedRef.current * dt;
      if (posRef.current >= 90) {
        posRef.current = 90;
        dirRef.current = -1;
      } else if (posRef.current <= 10) {
        posRef.current = 10;
        dirRef.current = 1;
      }
      
      if (boxRef.current) {
        boxRef.current.style.left = `${posRef.current}%`;
      }
      animationFrameId = requestAnimationFrame(update);
    };
    
    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState]);

  // Game action handler
  const handleStop = () => {
    if (gameState !== 'playing') return;
    
    setGameState('stopped');
    playTone(400, 0.05); // click sound
    
    const currentPos = posRef.current;
    const error = Math.abs(currentPos - 50); // distance from exact center (50%)
    let pointsAwarded = 0;
    let feedbackStr = "";
    let colorClass = "";
    let hitSuccess = true;
    
    if (error <= 3.5) {
      pointsAwarded = 150;
      feedbackStr = "🎯 BIOMETRICS MATCHED! +150";
      colorClass = "text-emerald-400 font-bold scale-105 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]";
      playTone(523.25, 0.08); 
      setTimeout(() => playTone(659.25, 0.12), 80);
      setIdentityLogs((prev) => {
        const next = [...prev, "SECURE NODE PERFECT MATCHED!"];
        if (next.length > 3) next.shift();
        return next;
      });
    } else if (error <= 9.5) {
      pointsAwarded = 75;
      feedbackStr = "✨ ALIGNMENT SECURED! +75";
      colorClass = "text-indigo-400 font-semibold drop-shadow-[0_0_6px_rgba(99,102,241,0.5)]";
      playTone(440, 0.12);
      setIdentityLogs((prev) => {
        const next = [...prev, "KEY STABILIZATION LOCKED."];
        if (next.length > 3) next.shift();
        return next;
      });
    } else if (error <= 17) {
      pointsAwarded = 30;
      feedbackStr = "👍 KEY ALIGNED! +30";
      colorClass = "text-blue-400";
      playTone(330, 0.1);
    } else {
      hitSuccess = false;
      feedbackStr = "⚠️ SCAN MISALIGNED! -1 LIFE";
      colorClass = "text-rose-500 font-extrabold animate-bounce drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]";
      playTone(180, 0.35, 'sawtooth');
      setIdentityLogs((prev) => {
        const next = [...prev, "WARNING: AUTHORIZATION FLUIDITY LOST"];
        if (next.length > 3) next.shift();
        return next;
      });
    }
    
    setFeedback(feedbackStr);
    setFeedbackColor(colorClass);
    
    if (hitSuccess) {
      setScore((prev) => {
        const next = prev + pointsAwarded;
        if (next > highScore) {
          setHighScore(next);
          localStorage.setItem('align_game_highscore', String(next));
        }
        return next;
      });
      // Increase speed slightly with success to scale difficulty
      speedRef.current = Math.min(speedRef.current + 0.15, 4.5);
    } else {
      setLives((prev) => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          // Trigger game over
          setTimeout(() => {
            setGameState('gameover');
            setFeedback("🚨 ACCESS SHIELD DESTRUCTED");
            setFeedbackColor("text-red-500 font-black text-xs tracking-wider uppercase");
            playTone(220, 0.25, 'triangle');
            setTimeout(() => playTone(147, 0.45, 'triangle'), 180);
            setIdentityLogs(["ERROR: SECURITY GATEWAY LOCKED", "IDENTITY VERIFICATION CRITICALLY FAILED"]);
          }, 600);
        }
        return nextLives;
      });
    }
    
    // Resume game if still alive
    if (lives > 1 || hitSuccess) {
      setTimeout(() => {
        if (gameState !== 'gameover') {
          setFeedback("");
          // Randomize start side
          posRef.current = Math.random() > 0.5 ? 12 : 88;
          dirRef.current = posRef.current < 50 ? 1 : -1;
          setGameState('playing');
        }
      }, 1300);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setFeedback("");
    setFeedbackColor("");
    setIdentityLogs(["RE-INITIALIZING BIOMETRICS...", "DECRYPTION MATRIX SYNCING..."]);
    posRef.current = 50;
    dirRef.current = 1;
    speedRef.current = 1.6;
    setGameState('playing');
    playTone(523.25, 0.08);
    setTimeout(() => playTone(659.25, 0.08), 80);
    setTimeout(() => playTone(783.99, 0.12), 160);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'playing') {
          handleStop();
        } else if (gameState === 'gameover') {
          resetGame();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, lives]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#070b19] to-[#020205] text-white p-4 font-mono select-none overflow-hidden relative">
      {/* Background Retro Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(16,185,129,0.04),rgba(99,102,241,0.02),rgba(16,185,129,0.04))] bg-[size:100%_4px,3px_100%] z-10 pointer-events-none"></div>

      {/* Cyberpunk grid bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 opacity-10 bg-[linear-gradient(to_bottom,transparent,rgba(16,185,129,0.2)),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom z-0"></div>

      {/* Retro Arcade Console Body */}
      <div className="w-full max-w-xl glass-panel bg-zinc-950/95 border-4 border-emerald-500/20 p-6 flex flex-col gap-4 shadow-[0_0_50px_rgba(16,185,129,0.1)] z-20 relative">
        {/* Neon Bezel Corners */}
        <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-4 border-l-4 border-emerald-400"></div>
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-4 border-r-4 border-emerald-400"></div>
        <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-4 border-l-4 border-emerald-400"></div>
        <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-4 border-r-4 border-emerald-400"></div>

        {/* Console Header */}
        <div className="flex justify-between items-center border-b border-emerald-500/20 pb-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <FiCpu className="animate-spin-slow text-lg" />
            <span className="text-xs font-bold tracking-widest uppercase text-shadow-neon">BIOMETRIC SECURITY GATEWAY v2.5</span>
          </div>
          <button 
            onClick={() => {
              setIsMuted(!isMuted);
              if (isMuted && audioCtxRef.current) {
                audioCtxRef.current.resume();
              }
            }} 
            className="p-1.5 rounded hover:bg-white/5 text-gray-400 hover:text-emerald-400 transition-colors"
          >
            {isMuted ? <FiVolumeX className="text-sm" /> : <FiVolume2 className="animate-bounce text-sm text-emerald-400" />}
          </button>
        </div>

        {/* Retro Game screen */}
        <div className="relative w-full rounded-xl bg-black/90 border border-zinc-800/80 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
          {/* Scanline CRT simulation */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent bg-[size:100%_8px] pointer-events-none z-30"></div>

          {/* Top Info Bar */}
          <div className="flex justify-between items-center text-[10px] font-bold text-emerald-400 z-20 mb-2">
            <div>
              <span>SYNC FACTOR</span>
              <p className="text-sm font-black text-white tracking-widest mt-0.5">
                {score}%
              </p>
            </div>
            <div className="text-center">
              <span>PEAK INTEGRITY</span>
              <p className="text-sm font-black text-amber-400 tracking-widest mt-0.5">
                {highScore}%
              </p>
            </div>
            <div className="text-right">
              <span>SHIELD NODES</span>
              <div className="flex gap-1 justify-end mt-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span 
                    key={i} 
                    className={`text-xs transition-all duration-300 ${
                      i < lives ? 'text-emerald-400 animate-pulse' : 'text-zinc-850 opacity-20'
                    }`}
                  >
                    🛡️
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Biometric Interactive split arena */}
          <div className="flex-1 min-h-[140px] flex flex-col md:flex-row gap-4 items-center justify-between border-y border-zinc-900 py-3 relative z-20">
            {/* Left Biometric scanner feed */}
            <div className="w-full md:w-[40%] flex flex-row md:flex-col items-center md:justify-center gap-3 border-r-0 md:border-r border-zinc-900 md:pr-4">
              {/* Holographic scanner */}
              <div className="relative w-16 h-20 border border-emerald-500/40 bg-zinc-950 rounded-lg flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                {/* Fingerprint Vector */}
                <svg className="w-12 h-15 text-emerald-500/80 animate-pulse" viewBox="0 0 32 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M16 3C11 3 7 7 7 12M25 12C25 7 21 3 16 3M10 15C10 11.5 12.5 9 16 9M22 15C22 11.5 19.5 9 16 9" />
                  <path d="M13 18C13 16.5 14.2 15 16 15M19 18C19 16.5 17.8 15 16 15" />
                  <path d="M16 21C18 21 19.5 22.5 19.5 24M16 21C14 21 12.5 22.5 12.5 24" />
                  <path d="M10 27C10 24.5 12.5 22.5 16 22.5M22 27C22 24.5 19.5 22.5 16 22.5" />
                  <path d="M7 31C7 27.5 11 25.5 16 25.5M25 31C25 27.5 21 25.5 16 25.5" />
                  <path d="M16 12v6" />
                </svg>
                {/* Laser scan line */}
                <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-[scanLaser_2s_infinite_ease-in-out]"></div>
              </div>

              {/* Console logs */}
              <div className="flex-1 md:w-full flex flex-col gap-0.5 font-mono text-[8px] text-zinc-400 overflow-hidden select-none">
                <span className="text-[7px] text-emerald-400 uppercase font-bold tracking-widest flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"></span>
                  SCANNER FEED
                </span>
                {identityLogs.map((log, index) => (
                  <div key={index} className="truncate tracking-wider animate-fadeIn">
                    &gt; {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Interactive Calibrator arena */}
            <div className="w-full md:w-[60%] flex flex-col justify-center gap-2">
              {gameState === 'gameover' ? (
                <div className="flex flex-col items-center justify-center text-center py-4 animate-fadeIn">
                  <span className="text-sm font-black tracking-widest text-rose-500 uppercase animate-pulse">IDENTITY VERIFICATION REJECTED</span>
                  <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider mt-1">Security Decryption Stack Destructed</p>
                  <button
                    onClick={resetGame}
                    className="mt-3 px-4 py-1.5 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-[9px] font-black text-emerald-400 hover:text-emerald-300 tracking-wider uppercase transition-colors"
                  >
                    Recalibrate Biometrics
                  </button>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-2.5">
                  {/* Score Feedback / Status */}
                  <div className="h-5 flex items-center justify-center text-center">
                    {feedback ? (
                      <span className={`text-[10px] uppercase tracking-widest transition-all duration-75 ${feedbackColor}`}>
                        {feedback}
                      </span>
                    ) : (
                      <span className="text-[8px] text-zinc-500 font-bold tracking-widest uppercase animate-pulse">
                        Stop Node inside Cyan Scanner to Verify
                      </span>
                    )}
                  </div>

                  {/* Calibration track */}
                  <div className="w-full h-11 bg-zinc-950/80 border border-zinc-900 rounded-lg relative overflow-hidden flex items-center px-1 shadow-inner">
                    {/* Target Calibration Zone */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-emerald-500/20 -translate-x-1/2"></div>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-dashed border-emerald-400/80 rounded-md shadow-[0_0_8px_rgba(52,211,153,0.15)] flex items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></div>
                    </div>

                    {/* Sliding Node */}
                    <div 
                      ref={boxRef}
                      className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded bg-gradient-to-r from-emerald-500 to-indigo-500 border border-white/20 shadow-[0_0_10px_rgba(16,185,129,0.8)] -translate-x-1/2 z-20"
                      style={{ left: '50%' }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Screen Bar */}
          <div className="border-t border-zinc-900 pt-2 flex justify-between items-center text-[10px] font-bold text-gray-500 z-20">
            <span className="animate-pulse text-emerald-400 uppercase tracking-widest">
              {loadingMsg}
            </span>
            <span className="text-zinc-500">STAGE START</span>
          </div>

          {/* Custom style overrides */}
          <style>{`
            .text-shadow-neon {
              text-shadow: 0 0 5px rgba(16, 185, 129, 0.4);
            }
            @keyframes scanLaser {
              0%, 100% { top: 5%; }
              50% { top: 95%; }
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(2px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn {
              animation: fadeIn 0.2s ease-out forwards;
            }
          `}</style>
        </div>

        {/* Play Control Panel */}
        <div className="flex flex-col items-center gap-1.5 py-1">
          <button
            onClick={gameState === 'playing' ? handleStop : gameState === 'gameover' ? resetGame : undefined}
            disabled={gameState === 'stopped'}
            className={`px-8 py-3 rounded-full border-b-4 font-bold text-xs uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 duration-75 flex items-center gap-2 select-none cursor-pointer ${
              gameState === 'gameover' 
                ? 'bg-rose-600 border-rose-800 active:border-rose-900 active:bg-rose-700 hover:bg-rose-500 shadow-rose-500/20' 
                : 'bg-emerald-600 border-emerald-800 active:border-emerald-900 active:bg-emerald-700 hover:bg-emerald-500 shadow-emerald-500/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {gameState === 'playing' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>}
            {gameState === 'gameover' ? 'Restart Scanner' : 'ALIGN IDENTITY NODE'}
          </button>
          <span className="text-[8px] font-bold text-zinc-500 tracking-widest uppercase mt-0.5">Or Press SPACEBAR on your keyboard</span>
        </div>

        {/* Loading Progress Bar */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            <span>Identity Decryption Syncing...</span>
            <span className="animate-pulse text-emerald-400">CONNECTING SESSION</span>
          </div>
          <div className="w-full bg-zinc-900 border border-zinc-800 h-4 rounded overflow-hidden p-0.5 shadow-inner">
            <div className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-indigo-500 rounded-sm animate-[loadingFill_15s_infinite_linear]"></div>
          </div>
        </div>

        {/* Dynamic Help Bar */}
        <div className="flex items-start gap-2 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg text-[9px] font-bold leading-relaxed text-emerald-400 uppercase tracking-wider">
          <FiInfo className="text-sm shrink-0 mt-0.5" />
          <span>Press the button or SPACEBAR to stop the slider exactly inside the center scanner. Syncing biometrics authorizes the local profile session in 0ms delay.</span>
        </div>
      </div>

      {/* Styled loading progress bar animation */}
      <style>{`
        @keyframes loadingFill {
          0% { width: 5%; }
          15% { width: 20%; }
          30% { width: 35%; }
          50% { width: 55%; }
          70% { width: 70%; }
          90% { width: 88%; }
          100% { width: 98%; }
        }
      `}</style>
    </div>
  );
};

export default RetroGameLoader;
