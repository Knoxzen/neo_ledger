// services/sync.service.ts

import { db } from './db.service';
import { cryptoService } from './crypto.service';
import { driveService } from './drive.service';

export class SyncService {
  async performBackup() {
    const jsonData = await db.exportData();
    const blob = await cryptoService.encryptData(jsonData);
    const fileId = await driveService.uploadBackup(blob);
    await db.syncMetadata.put({ id: 'current', lastSyncTime: Date.now(), driveFileId: fileId, syncVersion: 1 });
  }

  async performRestore() {
    const fileId = await driveService.findBackupFile();
    if (!fileId) throw new Error('No backup found');
    const blob = await driveService.downloadBackup(fileId);
    const jsonData = await cryptoService.decryptData(blob);
    await db.importData(jsonData);
  }
}

export const syncService = new SyncService();
