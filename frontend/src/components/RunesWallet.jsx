import React from 'react';
import EldenRune from './EldenRune';
import { Sparkles } from 'lucide-react';

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
          bg-gradient-to-r from-yellow-900/30 to-amber-900/20
          border border-yellow-600/40
          px-4 py-2 rounded-full
          transition-all duration-300
          ${isAnimating ? 'runes-pop scale-110' : ''}
        `}
        style={{ boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)' }}
        data-testid="runes-wallet"
      >
        <EldenRune size={28} />
        <span className="font-heading font-bold text-lg tracking-wide">
          <span className="text-yellow-200/70 font-body font-medium mr-1">Runes:</span>
          <span data-testid="runes-count" className="text-yellow-400">{runes.toLocaleString()}</span>
        </span>
      </div>
    </div>
  );
};

export default RunesWallet;
