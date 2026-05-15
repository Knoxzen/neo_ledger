import { NextRequest, NextResponse } from 'next/server';
import { getDriveClient, getOrCreateAppDataFolder, getFileContent, DRIVE_CONFIG } from '@/lib/googleDrive';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    
    const drive = await getDriveClient(token);
    const folderId = await getOrCreateAppDataFolder(drive);

    // Fetching ledger and manifest from Drive folder
    const historyData = await getFileContent(drive, folderId, DRIVE_CONFIG.LEDGER_FILE, []);
    const manifestData = await getFileContent(drive, folderId, DRIVE_CONFIG.MANIFEST_FILE, {
      total_burn: 0,
      burn_rate: 0,
      threat_level: 'STABLE',
    });

    return NextResponse.json({
      history: historyData.content,
      manifest: manifestData.content,
    });
  } catch (error: any) {
    console.error('API_METRICS_ERROR:', error);
    return NextResponse.json({ 
      error: error.message || 'INTERNAL_SERVER_ERROR',
      code: 'ERROR_RETRIEVING_DRIVE_MANIFEST'
    }, { status: 500 });
  }
}
