// useSync — wires LocalStorage state to Supabase with pull-on-login + debounced push.
import { useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { pullFromCloud, pushToCloud, schedulePush, LS_KEYS } from '../lib/syncService';

export const useSync = () => {
  const [systemKey, setSystemKeyState] = useLocalStorage(LS_KEYS.systemKey, null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error' | 'offline'
  const [lastSyncAt, setLastSyncAt] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // On mount with a saved key, pull from cloud once (overwrites local with remote).
  useEffect(() => {
    if (!isSupabaseConfigured || !systemKey) {
      setStatus(isSupabaseConfigured ? 'idle' : 'offline');
      return;
    }
    let cancelled = false;
    (async () => {
      setStatus('syncing');
      const result = await pullFromCloud(systemKey);
      if (cancelled) return;
      if (result.ok) {
        setStatus('synced');
        setLastSyncAt(new Date().toISOString());
        // Force a refresh so hooks reading localStorage see the new values.
        window.dispatchEvent(new Event('epic-grind-cloud-pulled'));
      } else {
        setStatus('error');
        setErrorMessage(result.reason);
      }
    })();
    return () => { cancelled = true; };
  }, [systemKey]);

  // Provide a debounced push trigger callers fire whenever they mutate state.
  const triggerSync = useCallback(() => {
    if (!isSupabaseConfigured || !systemKey) return;
    schedulePush(systemKey, 1500, (s) => {
      setStatus(s);
      if (s === 'synced') setLastSyncAt(new Date().toISOString());
    });
  }, [systemKey]);

  // Manual full sync (e.g., "Sync Now" button).
  const syncNow = useCallback(async () => {
    if (!isSupabaseConfigured || !systemKey) return { ok: false, reason: 'not-configured' };
    setStatus('syncing');
    const result = await pushToCloud(systemKey);
    if (result.ok) {
      setStatus('synced');
      setLastSyncAt(new Date().toISOString());
    } else {
      setStatus('error');
      setErrorMessage(result.reason);
    }
    return result;
  }, [systemKey]);

  // Set/login the System Access Key — triggers an immediate pull via effect.
  const login = useCallback((key) => {
    if (!key || !key.trim()) return;
    setSystemKeyState(key.trim());
  }, [setSystemKeyState]);

  const logout = useCallback(() => {
    setSystemKeyState(null);
    setStatus(isSupabaseConfigured ? 'idle' : 'offline');
    setLastSyncAt(null);
    setErrorMessage(null);
  }, [setSystemKeyState]);

  return {
    isSupabaseConfigured,
    isCloudLinked: Boolean(systemKey && isSupabaseConfigured),
    systemKey,
    status,
    lastSyncAt,
    errorMessage,
    login,
    logout,
    triggerSync,
    syncNow,
    supabase,
  };
};
