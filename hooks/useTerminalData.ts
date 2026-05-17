import { useTerminalData as useTerminalContext } from '../src/context/TerminalDataContext';

export function useTerminalData() {
  const context = useTerminalContext();

  return {
    data: {
      history: context.ledgerHistory,
      manifest: context.manifest,
      settings: context.settings
    },
    isLoading: !context.isHydrated || context.isSyncing,
    isSyncing: context.isSyncing,
    error: context.error,
    refresh: context.refreshData,
    logTransaction: context.logTransaction,
    wipeoutData: context.wipeoutData,
  };
}
