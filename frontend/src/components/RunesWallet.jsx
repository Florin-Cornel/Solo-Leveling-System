import React from 'react';
import { Gem } from 'lucide-react';

const RunesWallet = ({ runes, isAnimating = false }) => {
  return (
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
  );
};

export default RunesWallet;
