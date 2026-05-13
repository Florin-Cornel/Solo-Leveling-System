import React, { useState } from 'react';
import { ShoppingBag, Package } from 'lucide-react';
import { Button } from './ui/button';
import { SHOP_ITEMS, SHOP_CATEGORIES } from '../config/gameConfig';
import EldenRune from './EldenRune';
import { toast } from 'sonner';

const ShopAndInventory = ({ totalRunes, inventory, onPurchase }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showInventory, setShowInventory] = useState(false);

  const filteredItems = activeCategory === 'all' 
    ? SHOP_ITEMS 
    : SHOP_ITEMS.filter(item => item.category === activeCategory);

  const handlePurchase = (item) => {
    if (totalRunes < item.cost) {
      toast.error('Not enough Runes!', {
        description: `You need ${item.cost - totalRunes} more Runes`,
      });
      return;
    }
    onPurchase(item);
    toast.success(`Purchased ${item.name}!`, {
      description: `-${item.cost} Runes`,
    });
  };

  const isOwned = (itemId) => {
    return inventory.some(inv => inv.id === itemId);
  };

  const getOwnedCount = (itemId) => {
    return inventory.filter(inv => inv.id === itemId).length;
  };

  return (
    <div className="space-y-6 slide-in-right" data-testid="shop-inventory">
      {/* Header with Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showInventory ? (
            <Package className="w-7 h-7 text-purple-400" />
          ) : (
            <ShoppingBag className="w-7 h-7 text-yellow-400" />
          )}
          <h2 className="font-heading text-2xl font-bold text-white">
            {showInventory ? 'Inventory' : 'Shadow Shop'}
          </h2>
        </div>
        
        <Button
          onClick={() => setShowInventory(!showInventory)}
          variant="outline"
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          data-testid="toggle-inventory-btn"
        >
          {showInventory ? (
            <>
              <ShoppingBag className="w-4 h-4 mr-2" />
              View Shop
            </>
          ) : (
            <>
              <Package className="w-4 h-4 mr-2" />
              View Inventory ({inventory.length})
            </>
          )}
        </Button>
      </div>

      {/* Runes Balance */}
      <div 
        className="bg-gradient-to-r from-yellow-900/30 to-amber-900/20 border border-yellow-600/40 rounded-xl p-4 flex items-center justify-between"
        style={{ boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)' }}
      >
        <span className="text-zinc-300 font-medium">Your Balance</span>
        <div className="flex items-center gap-2">
          <EldenRune size={28} />
          <span className="text-2xl font-heading font-bold text-yellow-400">
            {totalRunes.toLocaleString()}
          </span>
          <span className="text-yellow-200/60">Runes</span>
        </div>
      </div>

      {showInventory ? (
        /* INVENTORY VIEW */
        <div className="space-y-4">
          {inventory.length === 0 ? (
            <div className="text-center py-16 text-zinc-500 bg-[#1a1a1b] rounded-xl border border-zinc-800">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Your inventory is empty</p>
              <p className="text-sm">Purchase items from the shop!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4" data-testid="inventory-grid">
              {/* Group inventory by item id and count */}
              {Object.entries(
                inventory.reduce((acc, item) => {
                  acc[item.id] = acc[item.id] || { ...item, count: 0 };
                  acc[item.id].count++;
                  return acc;
                }, {})
              ).map(([id, item]) => {
                // Re-hydrate icon and colors from SHOP_ITEMS config (icons can't be serialized to localStorage)
                const shopItem = SHOP_ITEMS.find((si) => si.id === id);
                const Icon = shopItem?.icon || Package;
                const color = item.color || shopItem?.color || '#A855F7';
                const bgColor = item.bgColor || shopItem?.bgColor || 'rgba(168, 85, 247, 0.15)';
                return (
                  <div
                    key={id}
                    className="relative p-4 rounded-xl border transition-all hover:scale-105"
                    style={{
                      backgroundColor: bgColor,
                      borderColor: `${color}40`,
                    }}
                    data-testid={`inventory-item-${id}`}
                  >
                    {/* Count Badge */}
                    {item.count > 1 && (
                      <div 
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: color, color: '#000' }}
                      >
                        {item.count}
                      </div>
                    )}
                    
                    <div className="flex flex-col items-center text-center gap-2">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${color}30` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: color }} />
                      </div>
                      <span className="text-white font-medium text-sm">{item.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* SHOP VIEW */
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Object.entries(SHOP_CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all
                  ${activeCategory === key 
                    ? 'bg-zinc-700 text-white' 
                    : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
                  }
                `}
                style={activeCategory === key ? { 
                  borderBottom: `2px solid ${cat.color}` 
                } : {}}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Shop Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="shop-grid">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const canAfford = totalRunes >= item.cost;
              const owned = getOwnedCount(item.id);
              
              return (
                <div
                  key={item.id}
                  className="p-5 rounded-xl border-2 transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: item.bgColor,
                    borderColor: `${item.color}40`,
                    boxShadow: canAfford ? `0 0 15px ${item.color}20` : 'none',
                  }}
                  data-testid={`shop-item-${item.id}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${item.color}30` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: item.color }} />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{item.name}</h3>
                        {owned > 0 && (
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: item.color, color: '#000' }}
                          >
                            Owned: {owned}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">{item.description}</p>
                      
                      {/* Price and Buy */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1.5">
                          <EldenRune size={18} />
                          <span className="font-bold text-yellow-400">{item.cost}</span>
                        </div>
                        
                        <Button
                          onClick={() => handlePurchase(item)}
                          disabled={!canAfford}
                          size="sm"
                          className={`
                            font-bold transition-all
                            ${canAfford 
                              ? 'hover:scale-105' 
                              : 'opacity-50 cursor-not-allowed'
                            }
                          `}
                          style={canAfford ? {
                            backgroundColor: item.color,
                            color: '#000',
                          } : {}}
                          data-testid={`buy-${item.id}`}
                        >
                          {canAfford ? 'Purchase' : 'Need More'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopAndInventory;
