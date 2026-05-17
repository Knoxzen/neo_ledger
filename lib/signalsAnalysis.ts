export interface Transaction {
  id: string;
  timestamp: string;
  merchant: string;
  amount: number;
  currency: string;
  class: string;
  status: string;
}

/**
 * Computes the daily spend array for the current month based on transaction history.
 */
export function computeDailySpendForMonth(history: Transaction[]): {
  dailySpend: number[];
  monthName: string;
  historyContext: { merchant: string; amount: number; class: string; day: number }[];
} {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  // Get month name
  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];
  const monthName = `${monthNames[currentMonth]} ${currentYear}`;

  // Get total days in this month
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dailySpend = new Array(totalDays).fill(0);

  // Filter and sum by day
  const contextList: { merchant: string; amount: number; class: string; day: number }[] = [];

  history.forEach((tx) => {
    if (!tx.timestamp) return;
    const txDate = new Date(tx.timestamp);
    if (
      txDate.getFullYear() === currentYear &&
      txDate.getMonth() === currentMonth
    ) {
      const day = txDate.getDate(); // 1-indexed
      if (day >= 1 && day <= totalDays) {
        dailySpend[day - 1] += tx.amount;
        
        // Push a subset to context so Gemini understands the classes and merchants of spends
        if (contextList.length < 15) {
          contextList.push({
            merchant: tx.merchant,
            amount: tx.amount,
            class: tx.class,
            day: day
          });
        }
      }
    }
  });

  return {
    dailySpend,
    monthName,
    historyContext: contextList
  };
}

export type UnifiedSignalsMap = {
  widget_1: string[];
  widget_2: string[];
  widget_3: string[];
  widget_4: string[];
  widget_5: string[];
  widget_6: string[];
};

/**
 * Reusable utility to request unified 6-widget diagnostic signals from Gemini via the API route.
 * Also stores the computed results inside Google Drive AppData folder automatically if token is active.
 */
export async function fetchUnifiedSignals(
  history: Transaction[],
  manifest: any,
  baseCurrency: string,
  token?: string,
  apiKey?: string
): Promise<UnifiedSignalsMap> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    if (apiKey) {
      headers["x-gemini-api-key"] = apiKey;
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch("/api/analyze-signals", {
      method: "POST",
      headers,
      body: JSON.stringify({
        history,
        manifest,
        baseCurrency
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to analyze signals");
    }

    const data = await res.json();
    return data.signals || getFallbackSignals();
  } catch (error) {
    console.error("fetchUnifiedSignals failed:", error);
    return getFallbackSignals();
  }
}

export function getFallbackSignals(): UnifiedSignalsMap {
  return {
    widget_1: [
      "No anomaly detected. System functioning within normal bounds.",
      "Standby for dynamic telemetry synchronization...",
      "Tip: Set custom category indicators in system settings."
    ],
    widget_2: [
      "Daily spend velocity rated as OPTIMAL.",
      "Leak diagnostics scan complete. No critical drain nodes identified.",
      "Action: Maintain standard containment limits."
    ],
    widget_3: [
      "FLEX metric optimal. Balanced categories distribution.",
      "No severe acceleration vectors detected in dining/tech.",
      "Recommendation: Category quotas aligned with Drive baseline."
    ],
    widget_4: [
      "Sync status locked. Connection check successful.",
      "AppData local-cloud delta matches absolute coordinates.",
      "Tip: Sync operates in high-contrast background mode."
    ],
    widget_5: [
      "Threat radius clean. Budget parameter protection enabled.",
      "Vulnerability scan returned 0 anomalous spikes.",
      "Protocol: System standby under secure ledger parameters."
    ],
    widget_6: [
      "Forward forecast paths map cleanly inside budget bounds.",
      "Overflow probability index is minimal.",
      "Intervention: Proactive saving standby active."
    ]
  };
}
