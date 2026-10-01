import React from 'react';
import { WifiOff, ShieldCheck } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-amber-600/95 px-4 py-1.5 text-xs font-medium text-white shadow-xl backdrop-blur-xs border border-amber-400/40 animate-in fade-in slide-in-from-top-3 duration-300">
      <WifiOff className="w-3.5 h-3.5 text-amber-100 animate-pulse" />
      <span>Offline Mode Active — Local clinic database fully operational</span>
      <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
    </div>
  );
};
