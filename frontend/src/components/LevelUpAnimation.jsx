import React, { useEffect, useState, useCallback } from 'react';
import { Star, ArrowUp } from 'lucide-react';
import { playLevelUpFanfare } from '../utils/sounds';

const LevelUpAnimation = ({ show, newLevel, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Handle dismissal - tap/click anywhere to close
  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (show) {
      setIsVisible(true);

      // Play self-hosted Web Audio fanfare (no CDN dependency)
      playLevelUpFanfare();

      // Auto-hide after 3 seconds (also dismissible on tap)
      const timer = setTimeout(() => {
        handleDismiss();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, handleDismiss]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center cursor-pointer"
      onClick={handleDismiss}
      onTouchEnd={handleDismiss}
      data-testid="level-up-animation"
      role="button"
      aria-label="Click to dismiss level up animation"
    >
      {/* Purple flash overlay */}
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.4) 0%, rgba(88, 28, 135, 0.6) 50%, rgba(0, 0, 0, 0.9) 100%)',
          animation: 'purpleFlash 0.5s ease-out',
        }}
      />

      {/* Particle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-purple-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particleFloat ${2 + Math.random() * 2}s ease-out infinite`,
              animationDelay: `${Math.random() * 0.5}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-6 pointer-events-none">
        {/* Glowing rings */}
        <div
          className="absolute w-80 h-80 rounded-full animate-ping opacity-20"
          style={{ backgroundColor: '#A855F7' }}
        />
        <div
          className="absolute w-60 h-60 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, transparent 70%)',
            boxShadow: '0 0 100px 50px rgba(168, 85, 247, 0.4)',
          }}
        />

        {/* Arrow up animation */}
        <div className="relative animate-bounce">
          <ArrowUp
            className="w-16 h-16 text-purple-400"
            style={{ filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 1))' }}
          />
        </div>

        {/* Level Up Text */}
        <h1
          className="font-heading text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text tracking-wider animate-pulse"
          style={{
            backgroundImage: 'linear-gradient(135deg, #A855F7 0%, #E879F9 50%, #A855F7 100%)',
            textShadow: '0 0 40px rgba(168, 85, 247, 0.8)',
            animation: 'textGlow 1s ease-in-out infinite alternate',
          }}
        >
          LEVEL UP!
        </h1>

        {/* New Level Display */}
        <div
          className="flex items-center gap-4 bg-purple-900/50 px-8 py-4 rounded-2xl border-2 border-purple-500"
          style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)' }}
        >
          <Star className="w-8 h-8 text-purple-300 animate-spin" style={{ animationDuration: '3s' }} />
          <span className="text-4xl font-heading font-bold text-white">
            Level {newLevel}
          </span>
          <Star className="w-8 h-8 text-purple-300 animate-spin" style={{ animationDuration: '3s' }} />
        </div>

        <p className="text-lg text-purple-200 animate-pulse">
          +5 Attribute Points Available!
        </p>

        {/* Tap to dismiss hint */}
        <p className="text-sm text-purple-400/60 mt-4 animate-pulse">
          Tap anywhere to continue
        </p>
      </div>
    </div>
  );
};

export default LevelUpAnimation;
