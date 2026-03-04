import React from 'react';
import { Scroll, ShoppingBag, Trophy } from 'lucide-react';

const TABS = [
  { id: 'missions', label: 'Mission Log', icon: Scroll },
  { id: 'shop', label: 'Reward Shop', icon: ShoppingBag },
  { id: 'trophies', label: 'Trophy Room', icon: Trophy },
];

const Navigation = ({ activeTab, onTabChange }) => {
  return (
    <nav 
      className="flex items-center justify-center gap-2 bg-[#1a1a1b] border-b border-zinc-800 px-4 py-3"
      data-testid="navigation"
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-base
              transition-all duration-200
              ${isActive 
                ? 'bg-runes/20 text-runes border border-runes/30' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }
            `}
            data-testid={`nav-tab-${tab.id}`}
          >
            <Icon className="w-5 h-5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
