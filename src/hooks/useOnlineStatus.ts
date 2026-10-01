import { useEffect, useState } from 'react';
import { getSyncState, saveSyncState } from '../services/syncService';

export function useOnlineStatus(): boolean {
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isForcedOffline, setIsForcedOffline] = useState<boolean>(() => {
    return getSyncState().forceOfflineMode;
  });

  useEffect(() => {
    const handleOnline = () => setIsBrowserOnline(true);
    const handleOffline = () => setIsBrowserOnline(false);
    const handleSyncChange = () => {
      setIsForcedOffline(getSyncState().forceOfflineMode);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('hk-sync-state-change', handleSyncChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('hk-sync-state-change', handleSyncChange);
    };
  }, []);

  return isBrowserOnline && !isForcedOffline;
}

export function useNetworkSync() {
  const isOnline = useOnlineStatus();
  const [syncState, setSyncState] = useState(getSyncState());

  useEffect(() => {
    const handleSyncChange = () => {
      setSyncState(getSyncState());
    };
    window.addEventListener('hk-sync-state-change', handleSyncChange);
    return () => {
      window.removeEventListener('hk-sync-state-change', handleSyncChange);
    };
  }, []);

  const toggleForceOffline = (force?: boolean) => {
    const next = force !== undefined ? force : !syncState.forceOfflineMode;
    saveSyncState({ forceOfflineMode: next });
  };

  const toggleAutoSync = (enabled?: boolean) => {
    const next = enabled !== undefined ? enabled : !syncState.autoSyncEnabled;
    saveSyncState({ autoSyncEnabled: next });
  };

  return {
    isOnline,
    isBrowserOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isForcedOffline: syncState.forceOfflineMode,
    syncState,
    toggleForceOffline,
    toggleAutoSync,
  };
}

