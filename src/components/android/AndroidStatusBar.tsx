import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, BatteryCharging, Signal } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface AndroidStatusBarProps {
  appName?: string;
  roleName?: string;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  appName = 'HK Clinic',
  roleName = 'Doctor',
}) => {
  const isOnline = useOnlineStatus();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="android-status-bar h-8 w-full bg-teal-800 text-teal-100 flex items-center justify-between px-4 text-xs font-medium select-none shadow-xs z-30 shrink-0">
      <div className="flex items-center gap-2">
        <span className="font-semibold tracking-wide text-white">{timeStr || '09:20 AM'}</span>
        <span className="text-[10px] bg-teal-900/80 px-1.5 py-0.5 rounded text-teal-200 uppercase tracking-wider hidden sm:inline-block">
          {appName} • {roleName}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        {isOnline ? (
          <div className="flex items-center gap-1 text-teal-200" title="Connected to Internet">
            <Wifi className="w-3.5 h-3.5" />
            <Signal className="w-3 h-3 text-teal-300" />
          </div>
        ) : (
          <div className="flex items-center gap-1 text-amber-300 bg-amber-900/60 px-1.5 py-0.5 rounded text-[10px]" title="Offline Database">
            <WifiOff className="w-3 h-3" />
            <span className="font-bold">Offline</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-white">
          <span className="text-[11px] font-mono">94%</span>
          <BatteryCharging className="w-4 h-4 text-emerald-300" />
        </div>
      </div>
    </div>
  );
};
