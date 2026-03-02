import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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

const RANKS = [
  { value: 'D', label: 'D-Rank (Routine)', color: '#71717A', runes: 10 },
  { value: 'C', label: 'C-Rank (Normal)', color: '#10B981', runes: 20 },
  { value: 'B', label: 'B-Rank (Hard)', color: '#3B82F6', runes: 50 },
  { value: 'A', label: 'A-Rank (Very Hard)', color: '#A855F7', runes: 100 },
  { value: 'S', label: 'S-Rank (Epic)', color: '#EAB308', runes: 200 },
];

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

  const selectedRank = RANKS.find(r => r.value === rank);

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
            Create a new task to track your progress and earn Runes
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
                {RANKS.map((r) => (
                  <SelectItem 
                    key={r.value} 
                    value={r.value}
                    className="text-white hover:bg-zinc-800 cursor-pointer"
                    data-testid={`rank-option-${r.value}`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: r.color }}
                      />
                      <span>{r.label}</span>
                      <span className="text-zinc-500 text-sm">+{r.runes} Runes</span>
                    </div>
                  </SelectItem>
                ))}
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
          <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <p className="text-sm text-zinc-500 mb-2">Mission Preview</p>
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">
                {name || 'Your mission name'}
              </span>
              <div className="flex items-center gap-2">
                <span 
                  className="font-bold"
                  style={{ color: selectedRank?.color }}
                >
                  {rank}-Rank
                </span>
                <span className="text-runes text-sm">
                  +{selectedRank?.runes} Runes
                </span>
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
