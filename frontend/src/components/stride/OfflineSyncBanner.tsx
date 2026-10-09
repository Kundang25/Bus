import React from 'react';
import { useStride } from '../../contexts/StrideContext';
import { WifiOff, Printer, AlertTriangle, RefreshCw } from 'lucide-react';

export const OfflineSyncBanner: React.FC = () => {
  const { settings, activeShift } = useStride();

  const isOffline = settings.simulateNetworkOffline;
  const isPrinterErr = settings.simulatePrinterError;
  const pendingCount = activeShift?.pendingSyncCount || 0;

  if (!isOffline && !isPrinterErr && pendingCount === 0) return null;

  return (
    <div className="bg-amber-950/90 border-b border-amber-500/40 text-amber-200 px-3 py-2 text-[11px] flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        {isOffline ? (
          <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
        ) : isPrinterErr ? (
          <Printer className="w-4 h-4 text-red-400" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        )}
        <div>
          <span className="font-bold block text-amber-300">
            {isOffline
              ? 'OFFLINE MODE ACTIVE (LOCAL STORE)'
              : isPrinterErr
              ? 'SIMULATED PRINTER PAPER JAM'
              : 'PENDING SYNC QUEUE'}
          </span>
          <span className="text-[10px] text-amber-200/80">
            {isOffline
              ? `${pendingCount} tickets saved locally in IndexedDB`
              : isPrinterErr
              ? 'Tickets stored safely in shift history'
              : 'Syncing with transport servers'}
          </span>
        </div>
      </div>
      <span className="bg-amber-900/90 border border-amber-500/50 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-amber-300">
        {pendingCount} PENDING
      </span>
    </div>
  );
};
