import { NextRequest, NextResponse } from 'next/server';
import { getDriveClient, getOrCreateAppDataFolder, getFileContent, updateFile, DRIVE_CONFIG } from '@/lib/googleDrive';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    const drive = await getDriveClient(token);
    const folderId = await getOrCreateAppDataFolder(drive);
    const settings = await getFileContent(drive, folderId, DRIVE_CONFIG.SETTINGS_FILE, {});
    return NextResponse.json(settings.content);
  } catch (error: any) {
    console.error('API_SETTINGS_GET_ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    const drive = await getDriveClient(token);
    const folderId = await getOrCreateAppDataFolder(drive);
    const newSettings = await req.json();
    console.log('SAVING_SETTINGS:', newSettings);
    
    // centralizing settings sync in .NEO_LEDGER_DATA
    const existing = await getFileContent(drive, folderId, DRIVE_CONFIG.SETTINGS_FILE, {});
    console.log('EXISTING_SETTINGS_ID:', existing.id);
    
    await updateFile(drive, folderId, DRIVE_CONFIG.SETTINGS_FILE, newSettings, existing.id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API_SETTINGS_POST_ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
