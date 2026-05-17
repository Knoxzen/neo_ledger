import { NextRequest, NextResponse } from "next/server";
import { getDriveClient, getOrCreateAppDataFolder, getFileContent, updateFile, DRIVE_CONFIG } from "@/lib/googleDrive";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined;
    
    if (!token) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const drive = await getDriveClient(token);
    const folderId = await getOrCreateAppDataFolder(drive);

    // 1. Wipe Ledger History
    const historyData = await getFileContent(drive, folderId, DRIVE_CONFIG.LEDGER_FILE, []);
    await updateFile(drive, folderId, DRIVE_CONFIG.LEDGER_FILE, [], historyData.id || undefined);

    // 2. Wipe Manifest
    const manifestData = await getFileContent(drive, folderId, DRIVE_CONFIG.MANIFEST_FILE, {});
    const initialManifest = {
      total_burn: 0,
      burn_rate: 0,
      threat_level: "STABLE",
      last_updated: new Date().toISOString(),
    };
    await updateFile(drive, folderId, DRIVE_CONFIG.MANIFEST_FILE, initialManifest, manifestData.id || undefined);

    return NextResponse.json({ success: true, manifest: initialManifest });
  } catch (error: any) {
    console.error("API_WIPEOUT_ERROR:", error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
