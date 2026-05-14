// hooks/useSync.ts

import { useAppStore } from '../store/useAppStore';
import { syncService } from '../services/sync.service';

export function useSync() {
  const { syncStatus, setSyncStatus, setLastBackupAt } = useAppStore();
  const sync = async () => {
    setSyncStatus('syncing');
    try {
      await syncService.performBackup();
      setSyncStatus('success');
      setLastBackupAt(Date.now());
    } catch {
      setSyncStatus('error');
    }
  };
  const restore = async () => {
    setSyncStatus('syncing');
    try {
      await syncService.performRestore();
      setSyncStatus('success');
      setLastBackupAt(Date.now());
    } catch {
      setSyncStatus('error');
    }
  };
  return { sync, restore, syncStatus };
}
