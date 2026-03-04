import React, { useEffect, useState } from 'react';
import { Crown, Zap } from 'lucide-react';

const HunterRankUpModal = ({ show, rankData, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show && rankData) {
      setIsVisible(true);
      
      // Play rank up sound
      const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_783d1a013f.mp3');
      audio.volume = 0.6;
      audio.play().catch(e => console.log('Audio play failed:', e));
      
      // Auto close after 4 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [show, rankData, onClose]);

  if (!isVisible || !rankData) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center"
      data-testid="hunter-rank-up-modal"
      onClick={() => { setIsVisible(false); onClose?.(); }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80" />
      
      {/* Rank color glow */}
      <div 
        className="absolute inset-0 animate-pulse"
        style={{ backgroundColor: `${rankData.color}20` }}
      />
      
      {/* Main content */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Glowing rings */}
        <div 
          className="absolute w-80 h-80 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: rankData.color }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full animate-pulse"
          style={{
            background: `radial-gradient(circle, ${rankData.color}60 0%, transparent 70%)`,
            boxShadow: `0 0 100px 50px ${rankData.color}40`,
          }}
        />
        
        {/* Badge */}
        <div 
          className="relative w-32 h-32 rounded-full flex items-center justify-center border-4 animate-bounce"
          style={{ 
            borderColor: rankData.color,
            backgroundColor: `${rankData.color}30`,
            boxShadow: `0 0 40px ${rankData.color}80`
          }}
        >
          <Crown 
            className="w-16 h-16" 
            style={{ color: rankData.color, filter: `drop-shadow(0 0 10px ${rankData.color})` }}
          />
        </div>
        
        {/* Text */}
        <div className="text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            <span className="text-xl text-yellow-400 font-bold tracking-wider">HUNTER RANK UP!</span>
            <Zap className="w-6 h-6 text-yellow-400" />
          </div>
          
          <h1 
            className="font-heading text-5xl md:text-7xl font-extrabold tracking-wider mb-2"
            style={{ 
              color: rankData.color,
              textShadow: `0 0 30px ${rankData.color}, 0 0 60px ${rankData.color}80`
            }}
          >
            {rankData.name}
          </h1>
          
          <p className="text-lg text-zinc-300">
            You have completed <span className="font-bold text-white">{rankData.threshold}</span> missions!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HunterRankUpModal;
