import React, { useState } from 'react';
import { Key, Cloud, CloudOff, LogIn, LogOut, RefreshCw, Shield, Sparkles, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const STATUS_STYLES = {
  idle: { color: '#71717A', label: 'Local Only', Icon: CloudOff },
  offline: { color: '#71717A', label: 'Offline Mode', Icon: CloudOff },
  syncing: { color: '#3B82F6', label: 'Syncing…', Icon: RefreshCw, spin: true },
  synced: { color: '#22C55E', label: 'Synced', Icon: Cloud },
  error: { color: '#EF4444', label: 'Sync Error', Icon: CloudOff },
};

// Suggests a memorable 3-word system key (used as default placeholder hint).
const suggestKey = () => {
  const w1 = ['shadow', 'monarch', 'iron', 'crimson', 'azure', 'frost', 'storm', 'ember'];
  const w2 = ['blade', 'crown', 'fang', 'gate', 'rune', 'seal', 'pact', 'oath'];
  const w3 = ['001', '777', '2026', 'igris', 'arise', 'echo', 'forge', 'reign'];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  return `${pick(w1)}-${pick(w2)}-${pick(w3)}`;
};

const SystemLogin = ({ sync, onClose }) => {
  const [input, setInput] = useState('');
  const [suggested] = useState(suggestKey());

  const handleLogin = () => {
    const key = input.trim() || suggested;
    sync.login(key);
    setInput('');
  };

  const handleLogout = () => {
    if (window.confirm('Disconnect from the cloud? Your local progress will remain on this device.')) {
      sync.logout();
    }
  };

  const statusStyle = STATUS_STYLES[sync.status] || STATUS_STYLES.idle;
  const StatusIcon = statusStyle.Icon;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
      data-testid="system-login-overlay"
    >
      <div
        className="relative w-full max-w-md bg-gradient-to-br from-zinc-900 to-[#0a0a0b] rounded-2xl border-2 border-purple-500/30 p-6 sm:p-8"
        style={{ boxShadow: '0 0 40px rgba(168, 85, 247, 0.3)' }}
        onClick={(e) => e.stopPropagation()}
        data-testid="system-login-modal"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-500 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          aria-label="Close"
          data-testid="system-login-close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center"
            style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)' }}
          >
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-white">System Access</h2>
            <p className="text-sm text-zinc-400">Cloud-sync between PC & Mobile</p>
          </div>
        </div>

        {/* Status Pill */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg my-4 border"
          style={{
            borderColor: `${statusStyle.color}50`,
            backgroundColor: `${statusStyle.color}15`,
          }}
          data-testid="system-login-status"
        >
          <StatusIcon
            className={`w-4 h-4 ${statusStyle.spin ? 'animate-spin' : ''}`}
            style={{ color: statusStyle.color }}
          />
          <span className="text-sm font-medium" style={{ color: statusStyle.color }}>
            {statusStyle.label}
          </span>
          {sync.lastSyncAt && (
            <span className="text-xs text-zinc-500 ml-auto">
              {new Date(sync.lastSyncAt).toLocaleTimeString()}
            </span>
          )}
        </div>

        {sync.errorMessage && (
          <div className="text-xs text-red-400 mb-3 p-2 bg-red-500/10 rounded border border-red-500/30">
            {sync.errorMessage}
          </div>
        )}

        {!sync.isSupabaseConfigured && (
          <div className="text-xs text-amber-400 mb-3 p-3 bg-amber-500/10 rounded border border-amber-500/30">
            <strong>Cloud not configured.</strong> Add <code className="text-amber-300">REACT_APP_SUPABASE_URL</code> and{' '}
            <code className="text-amber-300">REACT_APP_SUPABASE_ANON_KEY</code> to <code>frontend/.env</code> and restart.
          </div>
        )}

        {sync.isCloudLinked ? (
          /* ----- LOGGED IN VIEW ----- */
          <div className="space-y-4">
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
              <div className="flex items-center gap-2 mb-1">
                <Key className="w-4 h-4 text-purple-400" />
                <span className="text-xs uppercase tracking-wider text-zinc-400">Active Key</span>
              </div>
              <p className="font-mono text-sm text-white break-all" data-testid="system-key-display">
                {sync.systemKey}
              </p>
              <p className="text-xs text-zinc-500 mt-2">
                Type this same key on any device to sync progress.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={sync.syncNow}
                disabled={sync.status === 'syncing'}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                data-testid="sync-now-btn"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${sync.status === 'syncing' ? 'animate-spin' : ''}`} />
                Sync Now
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                data-testid="system-logout-btn"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          /* ----- LOGGED OUT VIEW ----- */
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-2 block">System Access Key</label>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={suggested}
                className="bg-zinc-800 border-zinc-700 text-white font-mono"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                data-testid="system-key-input"
              />
              <p className="text-xs text-zinc-500 mt-2">
                Create a new key OR re-enter an existing one to pull progress from another device.
              </p>
            </div>

            <Button
              onClick={handleLogin}
              disabled={!sync.isSupabaseConfigured}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold"
              data-testid="system-login-btn"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Enter The System
            </Button>

            <button
              onClick={() => setInput(suggested)}
              className="w-full text-xs text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1"
              data-testid="suggest-key-btn"
            >
              <Sparkles className="w-3 h-3" />
              Use suggested: <span className="font-mono">{suggested}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemLogin;
