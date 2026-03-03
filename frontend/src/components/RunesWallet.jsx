import React from 'react';
import { Gem, Sparkles } from 'lucide-react';

const RunesWallet = ({ runes, isAnimating = false, hasShadowBuff = false }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Shadow Buff indicator */}
      {hasShadowBuff && (
        <div 
          className="flex items-center gap-1.5 bg-purple-500/20 border border-purple-500/40 px-3 py-1.5 rounded-full animate-pulse"
          style={{ boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)' }}
          data-testid="shadow-buff-indicator"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-bold text-purple-300">1.5x</span>
        </div>
      )}
      
      {/* Runes wallet */}
      <div 
        className={`
          flex items-center gap-2 
          bg-white/5 backdrop-blur-sm 
          border border-white/10 
          px-4 py-2 rounded-full
          transition-all duration-300
          ${isAnimating ? 'runes-pop' : ''}
        `}
        data-testid="runes-wallet"
      >
        <Gem 
          className="w-5 h-5 text-runes" 
          style={{ filter: 'drop-shadow(0 0 4px #22D3EE)' }}
        />
        <span className="font-heading font-bold text-lg text-white tracking-wide">
          <span className="text-zinc-400 font-body font-medium mr-1">Runes:</span>
          <span data-testid="runes-count">{runes.toLocaleString()}</span>
        </span>
      </div>
    </div>
  );
};

export default RunesWallet;
