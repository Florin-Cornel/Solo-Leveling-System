import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { RANK_CONFIG, calculateRewards } from '../config/gameConfig';
import EldenRune from './EldenRune';

const REPEAT_OPTIONS = [
  { value: 'once', label: 'Just Once' },
  { value: 'daily', label: 'Daily' },
];

const AddMissionModal = ({ onAddMission }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [rank, setRank] = useState('D');
  const [repeat, setRepeat] = useState('once');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddMission({
      name: name.trim(),
      rank,
      isRecurring: repeat === 'daily',
    });

    // Reset form
    setName('');
    setRank('D');
    setRepeat('once');
    setOpen(false);
  };

  const selectedRank = RANK_CONFIG[rank];
  const RankIcon = selectedRank?.icon;
  const rewards = calculateRewards(rank);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-runes hover:bg-cyan-400 text-black shadow-lg transition-all hover:scale-110"
          style={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)' }}
          data-testid="add-mission-btn"
          aria-label="Add new mission"
        >
          <Plus className="w-7 h-7" strokeWidth={3} />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-[#0a0a0a] border-zinc-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-bold tracking-tight">
            New Mission
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Create a new quest to earn XP and Runes
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Mission Name */}
          <div className="space-y-2">
            <Label htmlFor="mission-name" className="text-lg text-zinc-300">
              Mission Name
            </Label>
            <Input
              id="mission-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your mission..."
              className="bg-zinc-900 border-zinc-700 text-white text-lg h-12 placeholder:text-zinc-600 focus:border-runes focus:ring-runes"
              data-testid="mission-name-input"
              autoFocus
            />
          </div>

          {/* Rank Selection */}
          <div className="space-y-2">
            <Label className="text-lg text-zinc-300">
              Rank
            </Label>
            <Select value={rank} onValueChange={setRank}>
              <SelectTrigger 
                className="bg-zinc-900 border-zinc-700 text-white text-lg h-12"
                data-testid="rank-select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                {Object.entries(RANK_CONFIG).map(([key, config]) => {
                  const Icon = config.icon;
                  const rankRewards = calculateRewards(key);
                  return (
                    <SelectItem 
                      key={key} 
                      value={key}
                      className="text-white hover:bg-zinc-800 cursor-pointer"
                      data-testid={`rank-option-${key}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" style={{ color: config.color }} />
                        <span style={{ color: config.color }} className="font-bold">
                          {config.name}
                        </span>
                        <span className="text-zinc-500 text-sm">
                          ({config.label})
                        </span>
                        <span className="text-zinc-400 text-sm ml-auto">
                          {config.multiplier}x
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Repeat Selection */}
          <div className="space-y-2">
            <Label className="text-lg text-zinc-300">
              Repeat
            </Label>
            <Select value={repeat} onValueChange={setRepeat}>
              <SelectTrigger 
                className="bg-zinc-900 border-zinc-700 text-white text-lg h-12"
                data-testid="repeat-select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                {REPEAT_OPTIONS.map((opt) => (
                  <SelectItem 
                    key={opt.value} 
                    value={opt.value}
                    className="text-white hover:bg-zinc-800 cursor-pointer"
                    data-testid={`repeat-option-${opt.value}`}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          <div 
            className="p-4 rounded-xl border-2"
            style={{ 
              backgroundColor: selectedRank?.bgColor,
              borderColor: selectedRank?.borderColor,
            }}
          >
            <p className="text-sm text-zinc-400 mb-3">Mission Preview</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {RankIcon && (
                  <RankIcon 
                    className="w-6 h-6" 
                    style={{ color: selectedRank?.color }}
                  />
                )}
                <span className="text-white font-medium">
                  {name || 'Your mission name'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <span 
                className="font-bold text-lg"
                style={{ color: selectedRank?.color }}
              >
                {selectedRank?.name}
              </span>
              <span className="text-zinc-500">|</span>
              <span className="text-blue-400 font-bold">+{rewards.xp} XP</span>
              <span className="text-zinc-500">|</span>
              <div className="flex items-center gap-1 text-yellow-400 font-bold">
                <EldenRune size={16} />
                +{rewards.runes}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!name.trim()}
            className="w-full h-12 text-lg font-bold bg-runes hover:bg-cyan-400 text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            data-testid="submit-mission-btn"
          >
            Create Mission
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMissionModal;
