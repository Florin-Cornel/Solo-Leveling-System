import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

const RANK_UP_SOUND = 'https://cdn.pixabay.com/audio/2022/03/15/audio_783d1a013f.mp3';

const RankUpAnimation = ({ show, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      // Play the chime sound
      const audio = new Audio(RANK_UP_SOUND);
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio play failed:', e));
      
      // Hide after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
      data-testid="rank-up-animation"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 animate-pulse" />
      
      {/* Blue glow effect */}
      <div className="absolute inset-0 bg-blue-500/20 animate-pulse" />
      
      {/* Main content */}
      <div className="relative flex flex-col items-center gap-4 animate-bounce">
        {/* Glowing ring */}
        <div 
          className="absolute w-64 h-64 rounded-full animate-ping"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%)',
          }}
        />
        <div 
          className="absolute w-48 h-48 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 60%)',
            boxShadow: '0 0 80px 40px rgba(59, 130, 246, 0.5)',
          }}
        />
        
        {/* Icon */}
        <Zap 
          className="w-20 h-20 text-blue-400 relative z-10 animate-pulse" 
          style={{ filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 1))' }}
        />
        
        {/* Text */}
        <h1 
          className="font-heading text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 relative z-10 tracking-wider"
          style={{ 
            textShadow: '0 0 40px rgba(59, 130, 246, 0.8), 0 0 80px rgba(59, 130, 246, 0.5)',
            animation: 'pulse 0.5s ease-in-out infinite'
          }}
        >
          RANK UP!
        </h1>
        
        <p className="text-xl text-blue-300 font-medium relative z-10 animate-pulse">
          100% Missions Complete
        </p>
      </div>
    </div>
  );
};

export default RankUpAnimation;
