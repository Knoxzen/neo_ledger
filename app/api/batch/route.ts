import { NextRequest, NextResponse } from 'next/server';
import { getDriveClient, getOrCreateAppDataFolder, getFileContent, DRIVE_CONFIG } from '@/lib/googleDrive';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    
    const drive = await getDriveClient(token);
    const folderId = await getOrCreateAppDataFolder(drive);

    // Parallel fetch of all core data
    const [manifest, ledger, settings] = await Promise.all([
      getFileContent(drive, folderId, DRIVE_CONFIG.MANIFEST_FILE, {
        total_burn: 0,
        burn_rate: 0,
        threat_level: 'STABLE',
        last_updated: new Date().toISOString()
      }),
      getFileContent(drive, folderId, DRIVE_CONFIG.LEDGER_FILE, []),
      getFileContent(drive, folderId, DRIVE_CONFIG.SETTINGS_FILE, {})
    ]);

    return NextResponse.json({
      manifest: manifest.content,
      ledger: ledger.content,
      settings: settings.content,
      syncTime: Date.now()
    });
  } catch (error: any) {
    console.error('API_BATCH_FETCH_ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
