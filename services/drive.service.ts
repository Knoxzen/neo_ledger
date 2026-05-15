// services/drive.service.ts

import { authService } from './auth.service';

export class DriveService {
  private static API_BASE = 'https://www.googleapis.com/drive/v3/files';
  private static UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3/files';
  private static BACKUP_FILENAME = 'neo-ledger-backup.enc';

  private static CONFIG_FILENAME = 'neo-ledger-settings.json';

  async findBackupFile(): Promise<string | null> {
    const token = authService.getStoredToken()?.accessToken;
    if (!token) return null;
    const query = encodeURIComponent(`name = '${DriveService.BACKUP_FILENAME}' and spaces = 'appDataFolder'`);
    const res = await fetch(`${DriveService.API_BASE}?q=${query}&spaces=appDataFolder`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return data.files?.[0]?.id || null;
  }

  async findConfigFile(): Promise<string | null> {
    const token = authService.getStoredToken()?.accessToken;
    if (!token) return null;
    const query = encodeURIComponent(`name = '${DriveService.CONFIG_FILENAME}' and spaces = 'appDataFolder'`);
    const res = await fetch(`${DriveService.API_BASE}?q=${query}&spaces=appDataFolder`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return data.files?.[0]?.id || null;
  }

  async uploadBackup(blob: Blob): Promise<string> {
    const token = authService.getStoredToken()?.accessToken;
    const existingId = await this.findBackupFile();
    const metadata = { name: DriveService.BACKUP_FILENAME, parents: ['appDataFolder'] };
    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', blob);

    const url = existingId ? `${DriveService.UPLOAD_BASE}/${existingId}?uploadType=multipart` : `${DriveService.UPLOAD_BASE}?uploadType=multipart`;
    const res = await fetch(url, {
      method: existingId ? 'PATCH' : 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    const data = await res.json();
    return data.id;
  }

  async saveConfig(config: Record<string, any>): Promise<void> {
    const token = authService.getStoredToken()?.accessToken;
    if (!token) return;

    const existingId = await this.findConfigFile();
    const metadata = { name: DriveService.CONFIG_FILENAME, parents: ['appDataFolder'] };
    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', new Blob([JSON.stringify(config)], { type: 'application/json' }));

    const url = existingId ? `${DriveService.UPLOAD_BASE}/${existingId}?uploadType=multipart` : `${DriveService.UPLOAD_BASE}?uploadType=multipart`;
    await fetch(url, {
      method: existingId ? 'PATCH' : 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
  }

  async loadConfig(): Promise<Record<string, any> | null> {
    const token = authService.getStoredToken()?.accessToken;
    if (!token) return null;

    const fileId = await this.findConfigFile();
    if (!fileId) return null;

    const res = await fetch(`${DriveService.API_BASE}/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
  }

  async downloadBackup(fileId: string): Promise<Blob> {
    const token = authService.getStoredToken()?.accessToken;
    const res = await fetch(`${DriveService.API_BASE}/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await res.blob();
  }
}

export const driveService = new DriveService();
