import { useState, useEffect, useCallback } from 'react';

interface TerminalData {
  history: any[];
  manifest: {
    total_burn: number;
    burn_rate: number;
    threat_level: string;
  };
}

export function useTerminalData() {
  const [data, setData] = useState<TerminalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const auth = localStorage.getItem('NEO_AUTH');
      const token = auth ? JSON.parse(auth).accessToken : null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/metrics', { headers });
      if (!res.ok) throw new Error('ERROR_RETRIEVING_DRIVE_MANIFEST');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logTransaction = async (input: string, apiKey?: string) => {
    setIsLoading(true);
    try {
      const auth = localStorage.getItem('NEO_AUTH');
      const token = auth ? JSON.parse(auth).accessToken : null;

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (apiKey) headers['x-gemini-api-key'] = apiKey;
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/log', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: input, action: 'fetch' }),
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.code || 'LOG_FAILED');
      }
      
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const commitTransaction = async (transactionData: any) => {
    setIsLoading(true);
    try {
      const auth = localStorage.getItem('NEO_AUTH');
      const token = auth ? JSON.parse(auth).accessToken : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/log', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: transactionData, action: 'save' }),
      });

      if (!res.ok) throw new Error('DRIVE_SYNC_FAILED');
      await fetchData();
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchData,
    logTransaction,
    commitTransaction,
  };
}
