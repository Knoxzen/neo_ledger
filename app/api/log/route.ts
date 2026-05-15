import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getDriveClient, getOrCreateAppDataFolder, getFileContent, updateFile, DRIVE_CONFIG } from '@/lib/googleDrive';

/**
 * Serverless API Kernel for TERMINAL_01
 * Model: Gemini 1.5 Flash (for quota stability)
 */
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '',
  apiVersion: 'v1'
});

async function parseTransaction(input: string, apiKey?: string) {
  const kernel = apiKey ? new GoogleGenAI({ apiKey, apiVersion: 'v1' }) : ai;
  
  const systemPrompt = `You are the extraction kernel for TERMINAL_01. Parse unstructured financial text into structural JSON format.
  Standardize or cyber-ify merchant labels (e.g., Target -> SUPPLY_GRID_0X, Starbucks -> COFFEE_PROTO_LABS).
  
  Return JSON matching this schema:
  {
    "merchant": string (UPPERCASE),
    "amount": number,
    "currency": string (3-letter code),
    "class": "DINING" | "FASHION" | "TECH" | "TRAVEL" | "ENTERTAINMENT" | "MISC",
    "status": "SUCCESS_00"
  }`;

  const result = await kernel.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${systemPrompt}\n\nInput: "${input}"`
  });

  const rawText = result.text || '{}';
  console.log(rawText);
  const cleanJson = rawText.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanJson);
}

async function saveTransaction(entry: any, token?: string) {
  console.log('COMMITTING_TRANSACTION:', entry.id);
  const drive = await getDriveClient(token);
  const folderId = await getOrCreateAppDataFolder(drive);
  console.log('TARGET_FOLDER_ID:', folderId);

  // 1. Update Ledger History
  const historyData = await getFileContent(drive, folderId, DRIVE_CONFIG.LEDGER_FILE, []);
  const currentHistory = Array.isArray(historyData.content) ? historyData.content : [];
  const updatedHistory = [entry, ...currentHistory];
  
  await updateFile(drive, folderId, DRIVE_CONFIG.LEDGER_FILE, updatedHistory, historyData.id);
  console.log('LEDGER_HISTORY_SYNCED');

  // 2. Recalibrate Manifest
  const manifestData = await getFileContent(drive, folderId, DRIVE_CONFIG.MANIFEST_FILE, {
    total_burn: 0,
    burn_rate: 0,
    threat_level: 'STABLE'
  });

  const currentManifest = manifestData.content;
  const amount = Number(entry.amount) || 0;
  const newTotalBurn = (Number(currentManifest.total_burn) || 0) + amount;
  const newThreatLevel = newTotalBurn > 1000 ? 'ELEVATED' : 'STABLE';

  await updateFile(drive, folderId, DRIVE_CONFIG.MANIFEST_FILE, {
    ...currentManifest,
    total_burn: newTotalBurn,
    threat_level: newThreatLevel,
    last_updated: new Date().toISOString()
  }, manifestData.id);
  console.log('MANIFEST_RECALIBRATED:', newTotalBurn);

  return { success: true };
}

export async function POST(req: NextRequest) {
  try {
    const { message, action } = await req.json();
    const clientApiKey = req.headers.get('x-gemini-api-key');
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

    switch (action) {
      case 'fetch': {
        const parsed = await parseTransaction(message, clientApiKey || undefined);
        const entry = {
          id: `TX_${crypto.randomUUID().split('-')[0].toUpperCase()}`,
          timestamp: new Date().toISOString(),
          ...parsed,
          meta: { raw_input: message }
        };
        return NextResponse.json(entry);
      }
      case 'save': {
        return NextResponse.json(await saveTransaction(message, token));
      }
      default:
        return NextResponse.json({ error: 'INVALID_ACTION' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('API_LOG_ERROR:', error);
    return NextResponse.json({ 
      error: error.message,
      code: 'ERROR_LOG_PROCESS_FAILED'
    }, { status: 500 });
  }
}
