import React, { useState, useMemo } from 'react';
import { 
  Plus, Sword, Shield, FlaskConical, Flame, Trash2, Edit2, Check, X, Lock, CheckCircle,
  Settings
} from 'lucide-react';
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
import { toast } from 'sonner';

// Item Categories
const CATEGORIES = [
  { value: 'weapon', label: 'Weapon', icon: Sword },
  { value: 'armor', label: 'Armor', icon: Shield },
  { value: 'potion', label: 'Potion', icon: FlaskConical },
  { value: 'dragon', label: 'Dragon', icon: Flame },
];

// Icon options
const ICONS = [
  { value: 'sword', label: 'Sword', icon: Sword },
  { value: 'shield', label: 'Shield/Cape', icon: Shield },
  { value: 'flask', label: 'Flask', icon: FlaskConical },
  { value: 'dragon', label: 'Dragon', icon: Flame },
];

// Color options
const COLORS = [
  { value: 'white', label: 'White', hex: '#FFFFFF' },
  { value: 'green', label: 'Green', hex: '#22C55E' },
  { value: 'brown', label: 'Brown', hex: '#A16207' },
  { value: 'red', label: 'Red', hex: '#EF4444' },
  { value: 'cyan', label: 'Cyan', hex: '#22D3EE' },
  { value: 'darkblue', label: 'Dark Blue', hex: '#1E40AF' },
];

// Unlock condition types
const CONDITION_TYPES = [
  { value: 'none', label: 'No Condition (Always Unlocked)' },
  { value: 'streak', label: 'Streak-Based (Days without Penalty)' },
  { value: 'mission_count', label: 'Mission-Based (Specific Rank Count)' },
  { value: 'hunter_rank', label: 'Rank-Based (Hunter Rank)' },
];

// Hunter ranks for condition
const HUNTER_RANKS_OPTIONS = [
  { value: 'e-rank', label: 'E-Rank' },
  { value: 'd-rank', label: 'D-Rank' },
  { value: 'c-rank', label: 'C-Rank' },
  { value: 'b-rank', label: 'B-Rank' },
  { value: 'a-rank', label: 'A-Rank' },
  { value: 's-rank', label: 'S-Rank (Shadow Monarch)' },
  { value: 'elden-lord', label: 'Elden Lord' },
];

// Mission ranks for condition
const MISSION_RANKS = ['D', 'C', 'B', 'A', 'S'];

const getIconComponent = (iconValue) => {
  const iconData = ICONS.find(i => i.value === iconValue);
  return iconData ? iconData.icon : Sword;
};

const ShadowInventory = ({ 
  items, 
  onAddItem, 
  onUpdateItem, 
  onDeleteItem,
  // Stats for checking unlock conditions
  streakDays = 0,
  missionCounts = { D: 0, C: 0, B: 0, A: 0, S: 0 },
  hunterRankAchieved = ['e-rank'],
  isEldenLord = false,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('weapon');
  const [icon, setIcon] = useState('sword');
  const [color, setColor] = useState('white');
  const [conditionType, setConditionType] = useState('none');
  const [conditionValue, setConditionValue] = useState('');
  const [conditionRank, setConditionRank] = useState('D');

  const resetForm = () => {
    setName('');
    setCategory('weapon');
    setIcon('sword');
    setColor('white');
    setConditionType('none');
    setConditionValue('');
    setConditionRank('D');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const itemData = {
      name: name.trim(),
      category,
      icon,
      color,
      condition: {
        type: conditionType,
        value: conditionType === 'none' ? null : conditionValue,
        rank: conditionType === 'mission_count' ? conditionRank : null,
      },
    };

    if (editingItem) {
      onUpdateItem(editingItem.id, itemData);
      toast.success('Item updated!');
    } else {
      onAddItem(itemData);
      toast.success('Shadow item created!');
    }

    resetForm();
    setIsAddOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setIcon(item.icon);
    setColor(item.color);
    setConditionType(item.condition?.type || 'none');
    setConditionValue(item.condition?.value || '');
    setConditionRank(item.condition?.rank || 'D');
    setIsAddOpen(true);
  };

  const handleDelete = (itemId) => {
    onDeleteItem(itemId);
    toast.error('Item deleted');
  };

  // Check if an item is unlocked based on its condition
  const isItemUnlocked = (item) => {
    if (!item.condition || item.condition.type === 'none') return true;

    switch (item.condition.type) {
      case 'streak':
        return streakDays >= parseInt(item.condition.value || 0);
      case 'mission_count':
        const rank = item.condition.rank || 'D';
        return (missionCounts[rank] || 0) >= parseInt(item.condition.value || 0);
      case 'hunter_rank':
        if (item.condition.value === 'elden-lord') return isEldenLord;
        return hunterRankAchieved.includes(item.condition.value);
      default:
        return true;
    }
  };

  const getConditionText = (item) => {
    if (!item.condition || item.condition.type === 'none') return 'Always Available';
    
    switch (item.condition.type) {
      case 'streak':
        return `${item.condition.value} days without penalty`;
      case 'mission_count':
        return `${item.condition.value} ${item.condition.rank}-Rank missions`;
      case 'hunter_rank':
        const rank = HUNTER_RANKS_OPTIONS.find(r => r.value === item.condition.value);
        return `Reach ${rank?.label || item.condition.value}`;
      default:
        return 'Unknown condition';
    }
  };

  const selectedColor = COLORS.find(c => c.value === color);

  return (
    <div className="space-y-6" data-testid="shadow-inventory">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="w-7 h-7 text-purple-400" />
          <h2 className="font-heading text-2xl font-bold text-white">Shadow Inventory</h2>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={(open) => {
          setIsAddOpen(open);
          if (!open) {
            resetForm();
            setEditingItem(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold"
              data-testid="add-inventory-item-btn"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </Button>
          </DialogTrigger>
          
          <DialogContent className="bg-[#1a1a1b] border-zinc-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl font-bold">
                {editingItem ? 'Edit Shadow Item' : 'Create Shadow Item'}
              </DialogTitle>
              <DialogDescription className="text-zinc-500">
                Configure a new item for your shadow inventory
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              {/* Name */}
              <div className="space-y-2">
                <Label className="text-lg text-zinc-300">Item Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Shadow Blade, Dragon Scale..."
                  className="bg-zinc-900 border-zinc-700 text-white text-lg h-12"
                  data-testid="item-name-input"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="text-lg text-zinc-300">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-zinc-800">
                        <div className="flex items-center gap-2">
                          <cat.icon className="w-4 h-4" />
                          {cat.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Icon */}
              <div className="space-y-2">
                <Label className="text-lg text-zinc-300">Icon</Label>
                <Select value={icon} onValueChange={setIcon}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {ICONS.map((ic) => (
                      <SelectItem key={ic.value} value={ic.value} className="text-white hover:bg-zinc-800">
                        <div className="flex items-center gap-2">
                          <ic.icon className="w-4 h-4" />
                          {ic.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label className="text-lg text-zinc-300">Color</Label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {COLORS.map((c) => (
                      <SelectItem key={c.value} value={c.value} className="text-white hover:bg-zinc-800">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.hex }} />
                          {c.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Unlock Condition */}
              <div className="space-y-2">
                <Label className="text-lg text-zinc-300">Unlock Condition</Label>
                <Select value={conditionType} onValueChange={setConditionType}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {CONDITION_TYPES.map((ct) => (
                      <SelectItem key={ct.value} value={ct.value} className="text-white hover:bg-zinc-800">
                        {ct.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Condition Value */}
              {conditionType === 'streak' && (
                <div className="space-y-2">
                  <Label className="text-zinc-300">Days without Penalty</Label>
                  <Input
                    type="number"
                    min="1"
                    value={conditionValue}
                    onChange={(e) => setConditionValue(e.target.value)}
                    placeholder="e.g., 7"
                    className="bg-zinc-900 border-zinc-700 text-white h-12"
                  />
                </div>
              )}

              {conditionType === 'mission_count' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Number of Missions</Label>
                    <Input
                      type="number"
                      min="1"
                      value={conditionValue}
                      onChange={(e) => setConditionValue(e.target.value)}
                      placeholder="e.g., 10"
                      className="bg-zinc-900 border-zinc-700 text-white h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Mission Rank</Label>
                    <Select value={conditionRank} onValueChange={setConditionRank}>
                      <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        {MISSION_RANKS.map((r) => (
                          <SelectItem key={r} value={r} className="text-white hover:bg-zinc-800">
                            {r}-Rank
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {conditionType === 'hunter_rank' && (
                <div className="space-y-2">
                  <Label className="text-zinc-300">Required Hunter Rank</Label>
                  <Select value={conditionValue} onValueChange={setConditionValue}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white h-12">
                      <SelectValue placeholder="Select rank..." />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      {HUNTER_RANKS_OPTIONS.map((r) => (
                        <SelectItem key={r.value} value={r.value} className="text-white hover:bg-zinc-800">
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Preview */}
              <div 
                className="p-4 rounded-lg border-2"
                style={{ 
                  borderColor: selectedColor?.hex,
                  backgroundColor: `${selectedColor?.hex}15`
                }}
              >
                <p className="text-sm text-zinc-400 mb-2">Preview</p>
                <div className="flex items-center gap-3">
                  {React.createElement(getIconComponent(icon), {
                    className: "w-8 h-8",
                    style: { color: selectedColor?.hex }
                  })}
                  <div>
                    <span className="text-white font-bold text-lg">{name || 'Item Name'}</span>
                    <p className="text-sm text-zinc-500">{CATEGORIES.find(c => c.value === category)?.label}</p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!name.trim()}
                className="w-full h-12 text-lg font-bold bg-purple-600 hover:bg-purple-500 text-white"
              >
                {editingItem ? 'Update Item' : 'Create Item'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Items Grid */}
      {items.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No shadow items yet</p>
          <p className="text-sm">Create items with custom unlock conditions!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="inventory-grid">
          {items.map((item) => {
            const unlocked = isItemUnlocked(item);
            const colorData = COLORS.find(c => c.value === item.color);
            const IconComponent = getIconComponent(item.icon);
            
            return (
              <div
                key={item.id}
                className={`
                  relative p-5 rounded-xl border-2 transition-all
                  ${unlocked ? '' : 'grayscale opacity-60'}
                `}
                style={{ 
                  borderColor: unlocked ? colorData?.hex : '#3f3f46',
                  backgroundColor: unlocked ? `${colorData?.hex}15` : '#1a1a1b',
                  boxShadow: unlocked ? `0 0 20px ${colorData?.hex}30` : 'none'
                }}
                data-testid={`inventory-item-${item.id}`}
              >
                {/* Status icon */}
                <div className="absolute top-3 right-3">
                  {unlocked ? (
                    <CheckCircle className="w-5 h-5" style={{ color: colorData?.hex }} />
                  ) : (
                    <Lock className="w-5 h-5 text-zinc-600" />
                  )}
                </div>

                <div className="flex items-start gap-4">
                  <div 
                    className="w-14 h-14 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: unlocked ? `${colorData?.hex}30` : '#27272a' }}
                  >
                    <IconComponent 
                      className="w-8 h-8"
                      style={{ color: unlocked ? colorData?.hex : '#52525b' }}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-white truncate pr-8">{item.name}</h4>
                    <p className="text-sm text-zinc-500">{CATEGORIES.find(c => c.value === item.category)?.label}</p>
                    <p className="text-xs text-zinc-600 mt-1">{getConditionText(item)}</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="flex-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <Edit2 className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
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

export default ShadowInventory;
