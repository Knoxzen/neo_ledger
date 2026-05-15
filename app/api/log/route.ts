import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getDriveClient,
  getOrCreateAppDataFolder,
  getFileContent,
  updateFile,
  DRIVE_CONFIG,
} from "@/lib/googleDrive";
import crypto from "crypto";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function parseTransaction(input: string, apiKey?: string) {
  const finalApiKey = apiKey || process.env.GEMINI_API_KEY;
  if (!finalApiKey) {
    throw new Error(
      "GEMINI_API_KEY_MISSING. Please provide it in Settings or .env.local",
    );
  }
  const client = new GoogleGenerativeAI(finalApiKey);
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

  const systemPrompt = `You are the core data extraction system. Your task is to parse unstructured, raw human language financial text and accurately convert it into a strictly structured JSON object.

CORE EXTRACTION RULES:
1. MERCHANT IDENTIFICATION & NAMING:
   - Analyze the text to identify the merchant, vendor, or venue.
   - If a real-world merchant name is explicitly mentioned or strongly implied, use that name in the output.
   - If the user provides a specific descriptive context for the place (e.g., "the ramen shop in Shinjuku"), transform that contextual detail into a custom descriptive label (e.g., SHINJUKU_RAMEN_PLACE).
   - If no merchant or context can be inferred from the text, dynamically generate a plausible, thematic custom uppercase cyber-punk identifier based on the category (e.g., UNKNOWN_VENDOR_0X, UNKNOWN_DIAGNOSTIC_NODE).

2. FIELD CONSTRAINTS:
   - "merchant": Must be a single uppercase string following the rules above.
   - "amount": Must be parsed cleanly into a raw float/number (remove currency symbols and commas).
   - "currency": Standard 3-letter ISO code (default to "INR" if completely unmentioned, or deduce from context like "yen" -> "JPY").
   - "class": Restrict strictly to one of these system enums: "DINING" | "FASHION" | "TECH" | "TRAVEL" | "ENTERTAINMENT" | "MISC".
   - "status": Always hardcode to "SUCCESS_00".

3. OUTPUT FORMAT:
   - Return raw JSON matching the schema precisely. Do not wrap the output in markdown code blocks like \`\`\`json. Do not include any preambles, conversational filler, or trailing text.

FEW-SHOT TRAINING EXAMPLES:

Input: "copped a new graphic tee for 45 bucks at uniqlo today"
Output: {
  "merchant": "UNIQLO_APPAREL",
  "amount": 45.00,
  "currency": "INR",
  "class": "FASHION",
  "status": "SUCCESS_00"
}

Input: "Dropped 3000 yen at that small rooftop ramen place in Akihabara"
Output: {
  "merchant": "AKIHABARA_RAMEN_PLACE",
  "amount": 3000,
  "currency": "JPY",
  "class": "DINING",
  "status": "SUCCESS_00"
}

Input: "Paid my monthly AWS cloud subscription bill which was 120 dollars"
Output: {
  "merchant": "AWS_CLOUD_INFRASTRUCTURE",
  "amount": 120.00,
  "currency": "USD",
  "class": "TECH",
  "status": "SUCCESS_00"
}

Input: "spent 15000 on steam games"
Output: {
  "merchant": "STEAM",
  "amount": 15000,
  "currency": "USD",
  "class": "ENTERTAINMENT",
  "status": "SUCCESS_00"
}

Input: "spent 50 bucks on a random transit pass"
Output: {
  "merchant": "UNKNOWN_TRANSIT",
  "amount": 50.00,
  "currency": "USD",
  "class": "TRAVEL",
  "status": "SUCCESS_00"
}`;

  const result = await model.generateContent(
    `${systemPrompt}\n\nInput: "${input}"`,
  );
  const response = await result.response;
  const rawText = response.text() || "{}";
  console.log("AI_RAW_RESPONSE:", rawText);
  const cleanJson = rawText.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
}

async function saveTransaction(entry: any, token?: string) {
  console.log("COMMITTING_TRANSACTION:", entry.id);
  const drive = await getDriveClient(token);
  const folderId = await getOrCreateAppDataFolder(drive);
  console.log("TARGET_FOLDER_ID:", folderId);

  // 1. Update Ledger History
  const historyData = await getFileContent(
    drive,
    folderId,
    DRIVE_CONFIG.LEDGER_FILE,
    [],
  );
  const currentHistory = Array.isArray(historyData.content)
    ? historyData.content
    : [];
  const updatedHistory = [entry, ...currentHistory];

  await updateFile(
    drive,
    folderId,
    DRIVE_CONFIG.LEDGER_FILE,
    updatedHistory,
    historyData.id,
  );
  console.log("LEDGER_HISTORY_SYNCED");

  // 2. Recalibrate Manifest
  const manifestData = await getFileContent(
    drive,
    folderId,
    DRIVE_CONFIG.MANIFEST_FILE,
    {
      total_burn: 0,
      burn_rate: 0,
      threat_level: "STABLE",
    },
  );

  const currentManifest = manifestData.content;
  const amount = Number(entry.amount) || 0;
  const newTotalBurn = (Number(currentManifest.total_burn) || 0) + amount;
  const newThreatLevel = newTotalBurn > 1000 ? "ELEVATED" : "STABLE";

  await updateFile(
    drive,
    folderId,
    DRIVE_CONFIG.MANIFEST_FILE,
    {
      ...currentManifest,
      total_burn: newTotalBurn,
      threat_level: newThreatLevel,
      last_updated: new Date().toISOString(),
    },
    manifestData.id,
  );
  console.log("MANIFEST_RECALIBRATED:", newTotalBurn);

  return { success: true };
}

export async function POST(req: NextRequest) {
  try {
    const { message, action } = await req.json();
    const clientApiKey = req.headers.get("x-gemini-api-key");
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : undefined;

    switch (action) {
      case "fetch": {
        const parsed = await parseTransaction(
          message,
          clientApiKey || undefined,
        );
        const entry = {
          id: `TX_${crypto.randomUUID().split("-")[0].toUpperCase()}`,
          timestamp: new Date().toISOString(),
          ...parsed,
          meta: { raw_input: message },
        };
        return NextResponse.json(entry);
      }
      case "save": {
        return NextResponse.json(await saveTransaction(message, token));
      }
      default:
        return NextResponse.json({ error: "INVALID_ACTION" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("API_LOG_ERROR:", error);
    return NextResponse.json(
      {
        error: error.message,
        code: "ERROR_LOG_PROCESS_FAILED",
      },
      { status: 500 },
    );
  }
}
