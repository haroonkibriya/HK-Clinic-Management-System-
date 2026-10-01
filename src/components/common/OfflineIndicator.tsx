import React, { useEffect, useState } from 'react';
import { WifiOff, ShieldCheck, Wifi } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface OfflineIndicatorProps {
  onOpenSyncModal?: () => void;
  isUrdu?: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  onOpenSyncModal,
  isUrdu = false,
}) => {
  const isOnline = useOnlineStatus();
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline && isOnline) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (showReconnected) {
    return (
      <div
        onClick={onOpenSyncModal}
        className="fixed top-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-emerald-600/95 px-4 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-xs border border-emerald-400/40 animate-in fade-in slide-in-from-top-3 duration-300 cursor-pointer hover:bg-emerald-700 transition"
      >
        <Wifi className="w-3.5 h-3.5 text-emerald-100" />
        <span>
          {isUrdu
            ? 'انٹرنیٹ بحال ہو گیا — ڈیٹا کلاؤڈ کے ساتھ سنک کے لیے تیار ہے'
            : 'Back Online — Database ready to sync'}
        </span>
      </div>
    );
  }

  if (isOnline) {
    return null;
  }

  return (
    <div
      onClick={onOpenSyncModal}
      className="fixed top-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-amber-600/95 px-4 py-1.5 text-xs font-medium text-white shadow-xl backdrop-blur-xs border border-amber-400/40 animate-in fade-in slide-in-from-top-3 duration-300 cursor-pointer hover:bg-amber-700 transition"
      title="Click to view Online/Offline Sync Center"
    >
      <WifiOff className="w-3.5 h-3.5 text-amber-100 animate-pulse" />
      <span>
        {isUrdu
          ? 'آف لائن موڈ فعال — لوکل کلینک ڈیٹا بیس مکمل طور پر فعال ہے'
          : 'Offline Mode Active — Local database 100% operational'}
      </span>
      <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
    </div>
  );
};

