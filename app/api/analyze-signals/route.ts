import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDriveClient, getOrCreateAppDataFolder, getFileContent, updateFile, DRIVE_CONFIG } from "@/lib/googleDrive";

export async function POST(req: NextRequest) {
  try {
    const { history, manifest, baseCurrency } = await req.json();
    const clientApiKey = req.headers.get("x-gemini-api-key");
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined;
    
    const finalApiKey = clientApiKey || process.env.GEMINI_API_KEY;
    if (!finalApiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY_MISSING. Please configure it in your Settings." },
        { status: 400 }
      );
    }

    // 1. Calculate general stats to supply as high-quality context to Gemini
    const now = new Date();
    const monthNames = [
      "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
      "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];
    const monthName = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

    // Get daily spends
    const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dailySpends = new Array(totalDays).fill(0);
    const categoryTotals: Record<string, number> = {};
    let recentTxSummaries: string[] = [];

    (history || []).forEach((tx: any) => {
      const txDate = new Date(tx.timestamp);
      if (txDate.getFullYear() === now.getFullYear() && txDate.getMonth() === now.getMonth()) {
        const d = txDate.getDate();
        if (d >= 1 && d <= totalDays) {
          dailySpends[d - 1] += tx.amount;
        }
      }
      // Summarize recent entries
      if (recentTxSummaries.length < 15) {
        recentTxSummaries.push(`${tx.merchant || 'UNKNOWN'} (${tx.class}): ${tx.amount} ${tx.currency}`);
      }
      // Sum categories
      const cat = tx.class || 'MISC';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + tx.amount;
    });

    const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
      categoryTotals[a] > categoryTotals[b] ? a : b, 'NONE'
    );

    // Initialize Gemini
    const client = new GoogleGenerativeAI(finalApiKey);
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are a high-level cyber-security financial AI auditor.
Your job is to analyze the user's transaction ledger history, their current overall spending metrics (manifest), and synthesize exactly 3 specific, action-oriented system telemetry signals (warnings, diagnostics, or optimizations) for EACH of the 6 core system widgets:

WIDGET 1: TOTAL BURN (Current Month Total Spend)
- Signal 1: SPIKE DIAGNOSTIC. Pinpoint where the biggest spending spikes occurred, stating the day/week and category.
- Signal 2: TRAJECTORY. Analyze current velocity to predict month-end burn bounds.
- Signal 3: PROACTIVE OPTIMIZATION. Give a practical budget re-allocation recommendation.

WIDGET 2: BURN RATE (Daily Speed Limit)
- Signal 1: VELOCITY DIAGNOSTIC. Rate the daily speed limit (e.g. within normal limits, critical leak detected).
- Signal 2: LEAK LOCATOR. Call out which category is driving up the daily velocity.
- Signal 3: BUDGET LOCK. Give an action recommendation to set a strict spending cap.

WIDGET 3: TOP FLEX PROTOCOL (Top Spending Category)
- Signal 1: POWER DOMINANCE. Call out the dominant spending category.
- Signal 2: ACCELERATION FACTOR. Identify which category is experiencing the fastest week-over-week acceleration.
- Signal 3: FLEE PROTOCOL. Detail a specific action to lower the burn rate of this top category.

WIDGET 4: SYNC STATUS (Integration Health)
- Signal 1: TELEMETRY QUALITY. Diagnose the Google Drive AppData synchronization stability.
- Signal 2: INTEGRITY VERIFICATION. Verify the state hydration check (e.g. perfect local-cloud database lock).
- Signal 3: PRESERVATION PROTOCOL. Recommend standard backup/maintenance actions.

WIDGET 5: THREAT LEVEL (AI Risk Assessment)
- Signal 1: THREAT RADIUS. Diagnose the security of the budget (e.g. STABLE, ELEVATED, CRITICAL).
- Signal 2: ANOMALY VECTORS. Call out any suspicious spending nodes or threshold breaches.
- Signal 3: SYSTEM CONTAINMENT. Suggest an immediate limit/block measure to secure the vault.

WIDGET 6: FORECAST (Future Outlook)
- Signal 1: OUTLOOK BOUNDS. Estimate the 30-day forecast bound.
- Signal 2: OVERFLOW PROBABILITY. Calculate a high/low warning for potential budget overruns.
- Signal 3: FORWARD INTERVENTION. Suggest an upfront optimization step (e.g., deferring optional tech purchases).

OUTPUT FORMAT:
Return a JSON object containing exactly 6 keys matching this schema structure precisely:
{
  "widget_1": [string, string, string],
  "widget_2": [string, string, string],
  "widget_3": [string, string, string],
  "widget_4": [string, string, string],
  "widget_5": [string, string, string],
  "widget_6": [string, string, string]
}

Ensure the strings are concise, thematic, high-contrast, uppercase-friendly, and actionable. Do not include markdown code blocks like \`\`\`json. Return only the raw JSON.`;

    const inputPrompt = `Month: ${monthName}
Daily Spend Vector: ${JSON.stringify(dailySpends)}
Category Totals Map: ${JSON.stringify(categoryTotals)}
Top Category: ${topCategory}
Manifest Status: ${JSON.stringify(manifest || {})}
Recent Telemetry Context: ${JSON.stringify(recentTxSummaries)}`;

    console.log("SENDING_SIGNAL_DIAGNOSTICS_PROMPT_TO_GEMINI...");
    const result = await model.generateContent(`${systemPrompt}\n\nInput:\n${inputPrompt}`);
    const response = await result.response;
    const rawText = response.text() || "{}";
    
    const cleanJson = rawText.replace(/```json|```/g, "").trim();
    const signalsMap = JSON.parse(cleanJson);
    console.log("GEMINI_SIGNALS_PARSED_SUCCESSFULLY");

    // 2. If Auth Token is supplied, write it back to Google Drive app folder!
    if (token) {
      try {
        console.log("WRITING_SIGNALS_TO_GDRIVE...");
        const drive = await getDriveClient(token);
        const folderId = await getOrCreateAppDataFolder(drive);
        
        // Find existing signals file if any
        const signalsData = await getFileContent(
          drive,
          folderId,
          DRIVE_CONFIG.SIGNALS_FILE,
          null
        );

        await updateFile(
          drive,
          folderId,
          DRIVE_CONFIG.SIGNALS_FILE,
          signalsMap,
          signalsData.id || undefined
        );
        console.log("SIGNALS_FILE_SAVED_SECURELY_ON_GDRIVE");
      } catch (err) {
        console.error("GDRIVE_SIGNALS_WRITE_FAILED (non-blocking):", err);
      }
    }

    return NextResponse.json({ signals: signalsMap });
  } catch (error: any) {
    console.error("API_ANALYZE_SIGNALS_ERROR:", error);
    return NextResponse.json(
      {
        error: error.message,
        code: "ERROR_SIGNALS_PROCESS_FAILED",
      },
      { status: 500 }
    );
  }
}
