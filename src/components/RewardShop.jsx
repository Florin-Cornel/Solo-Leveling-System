import React, { useState } from 'react';
import { Plus, ShoppingBag, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import GoldenRune from './GoldenRune';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';

const COLOR_THEMES = [
  { value: 'red', label: 'Crimson Red', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' },
  { value: 'blue', label: 'Ocean Blue', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
  { value: 'green', label: 'Emerald Green', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
  { value: 'purple', label: 'Royal Purple', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.15)' },
  { value: 'gold', label: 'Legendary Gold', color: '#EAB308', bg: 'rgba(234, 179, 8, 0.15)' },
];

const RewardShop = ({ rewards, onAddReward, onBuyReward, onDeleteReward, totalRunes }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [colorTheme, setColorTheme] = useState('blue');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !cost) return;

    const costNum = parseInt(cost, 10);
    if (isNaN(costNum) || costNum < 1) {
      toast.error('Invalid cost');
      return;
    }

    onAddReward({
      name: name.trim(),
      cost: costNum,
      colorTheme,
    });

    setName('');
    setCost('');
    setColorTheme('blue');
    setOpen(false);
    toast.success('Reward created!');
  };

  const handleBuy = (reward) => {
    if (totalRunes < reward.cost) {
      toast.error('Not enough Runes!');
      return;
    }
    onBuyReward(reward.id);
    toast.success(`Purchased: ${reward.name}`, {
      description: `-${reward.cost} Runes`,
    });
  };

  const handleDelete = (reward) => {
    onDeleteReward(reward.id);
    toast.error('Reward deleted', {
      description: reward.name,
    });
  };

  const selectedTheme = COLOR_THEMES.find(t => t.value === colorTheme);

  return (
    <div className="space-y-6" data-testid="reward-shop">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-7 h-7 text-runes" />
          <h2 className="font-heading text-2xl font-bold text-white">Reward Shop</h2>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2 bg-runes hover:bg-cyan-400 text-black font-bold"
              data-testid="add-reward-btn"
            >
              <Plus className="w-5 h-5" />
              Create Reward
            </Button>
          </DialogTrigger>
          
          <DialogContent className="bg-[#1a1a1b] border-zinc-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl font-bold">
                Create New Reward
              </DialogTitle>
              <DialogDescription className="text-zinc-500">
                Design a custom reward to motivate yourself
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label className="text-lg text-zinc-300">Reward Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Movie night, New game..."
                  className="bg-zinc-900 border-zinc-700 text-white text-lg h-12"
                  data-testid="reward-name-input"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label className="text-lg text-zinc-300">Rune Cost</Label>
                <Input
                  type="number"
                  min="1"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="e.g., 500"
                  className="bg-zinc-900 border-zinc-700 text-white text-lg h-12"
                  data-testid="reward-cost-input"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-lg text-zinc-300">Color Theme</Label>
                <Select value={colorTheme} onValueChange={setColorTheme}>
                  <SelectTrigger 
                    className="bg-zinc-900 border-zinc-700 text-white text-lg h-12"
                    data-testid="reward-color-select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {COLOR_THEMES.map((theme) => (
                      <SelectItem 
                        key={theme.value} 
                        value={theme.value}
                        className="text-white hover:bg-zinc-800"
                        data-testid={`color-option-${theme.value}`}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: theme.color }}
                          />
                          <span>{theme.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preview */}
              <div 
                className="p-4 rounded-lg border-2"
                style={{ 
                  backgroundColor: selectedTheme?.bg,
                  borderColor: selectedTheme?.color 
                }}
              >
                <p className="text-sm text-zinc-400 mb-2">Preview</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium text-lg">
                    {name || 'Your reward name'}
                  </span>
                  <div className="flex items-center gap-1 text-runes">
                    <Gem className="w-4 h-4" />
                    <span className="font-bold">{cost || '0'}</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!name.trim() || !cost}
                className="w-full h-12 text-lg font-bold bg-runes hover:bg-cyan-400 text-black"
                data-testid="submit-reward-btn"
              >
                Create Reward
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rewards Grid */}
      {rewards.length === 0 ? (
        <div className="text-center py-16 text-zinc-500" data-testid="empty-rewards">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No rewards yet</p>
          <p className="text-sm">Create custom rewards to motivate yourself!</p>
        </div>
      ) : (
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          data-testid="rewards-grid"
        >
          {rewards.map((reward) => {
            const theme = COLOR_THEMES.find(t => t.value === reward.colorTheme) || COLOR_THEMES[1];
            const canAfford = totalRunes >= reward.cost;
            
            return (
              <div
                key={reward.id}
                className="p-5 rounded-xl border-2 transition-all hover:scale-[1.02] relative group"
                style={{ 
                  backgroundColor: theme.bg,
                  borderColor: theme.color,
                  boxShadow: `0 0 20px ${theme.color}30`
                }}
                data-testid={`reward-card-${reward.id}`}
              >
                {/* Delete button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(reward)}
                  className="absolute top-2 right-2 h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                  data-testid={`delete-reward-${reward.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <div className="flex flex-col gap-4">
                  <div className="pr-8">
                    <h3 className="text-xl font-bold text-white mb-1">{reward.name}</h3>
                    <div className="flex items-center gap-1.5 text-yellow-400">
                      <GoldenRune size={20} />
                      <span className="font-bold text-lg">{reward.cost} Runes</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleBuy(reward)}
                    disabled={!canAfford}
                    className={`
                      w-full h-11 font-bold text-base transition-all
                      ${canAfford 
                        ? 'bg-white/90 hover:bg-white text-black' 
                        : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                      }
                    `}
                    style={canAfford ? { 
                      backgroundColor: theme.color,
                      color: theme.value === 'gold' ? '#000' : '#fff'
                    } : {}}
                    data-testid={`buy-reward-${reward.id}`}
                  >
                    {canAfford ? 'Buy Reward' : 'Not Enough Runes'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RewardShop;
