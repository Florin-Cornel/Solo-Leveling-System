import React from 'react';
import { Cloud, CloudOff, RefreshCw, Shield, AlertCircle } from 'lucide-react';

const ICON_MAP = {
  idle:    { Icon: CloudOff,      color: '#71717A', label: 'Local' },
  offline: { Icon: CloudOff,      color: '#71717A', label: 'Offline' },
  syncing: { Icon: RefreshCw,     color: '#3B82F6', label: 'Sync', spin: true },
  synced:  { Icon: Cloud,         color: '#22C55E', label: 'Synced' },
  error:   { Icon: AlertCircle,   color: '#EF4444', label: 'Error' },
};

const SyncIndicator = ({ sync, onOpen }) => {
  const { Icon, color, label, spin } = ICON_MAP[sync.status] || ICON_MAP.idle;
  const linked = sync.isCloudLinked;

  return (
    <button
      onClick={onOpen}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-all hover:scale-105"
      style={{
        backgroundColor: `${color}15`,
        borderColor: `${color}50`,
        boxShadow: linked ? `0 0 12px ${color}40` : 'none',
      }}
      data-testid="sync-indicator-btn"
      aria-label="Open System Access"
    >
      {linked ? (
        <Shield className="w-3.5 h-3.5" style={{ color }} />
      ) : (
        <Icon className={`w-3.5 h-3.5 ${spin ? 'animate-spin' : ''}`} style={{ color }} />
      )}
      <span className="text-xs font-medium hidden sm:inline" style={{ color }}>{label}</span>
    </button>
  );
};

export default SyncIndicator;
