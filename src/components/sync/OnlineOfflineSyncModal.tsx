import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Database,
  Cloud,
  CheckCircle2,
  HardDrive,
  Download,
  Upload,
  X,
  ShieldCheck,
  Smartphone,
  Info,
} from 'lucide-react';
import { useNetworkSync } from '../../hooks/useOnlineStatus';
import { performCloudSync, exportFullBackupFile } from '../../services/syncService';

interface OnlineOfflineSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  isUrdu: boolean;
  currentUser: string;
  onSyncComplete?: () => void;
}

export const OnlineOfflineSyncModal: React.FC<OnlineOfflineSyncModalProps> = ({
  isOpen,
  onClose,
  isUrdu,
  currentUser,
  onSyncComplete,
}) => {
  const { isOnline, isBrowserOnline, isForcedOffline, syncState, toggleForceOffline, toggleAutoSync } =
    useNetworkSync();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await performCloudSync(currentUser);
      setSyncFeedback(
        isUrdu
          ? `کلاؤڈ سنک کامیاب: کل ${res.totalItems} ریکارڈز محفوظ اور تصدیق شدہ ہیں`
          : `Cloud Sync Successful: ${res.totalItems} clinical records synchronized & verified.`
      );
      if (onSyncComplete) onSyncComplete();
    } catch {
      setSyncFeedback(
        isUrdu ? 'سنک میں خرابی پیش آگئی' : 'Failed to synchronize with cloud service.'
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const formattedLastSync = syncState.lastSyncedAt
    ? new Date(syncState.lastSyncedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        month: 'short',
        day: 'numeric',
      })
    : isUrdu
    ? 'ابھی تک نہیں ہوا'
    : 'Not yet synced';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xs">
              {isOnline ? (
                <Cloud className="w-5 h-5 text-emerald-300" />
              ) : (
                <WifiOff className="w-5 h-5 text-amber-300" />
              )}
            </div>
            <div>
              <h2 className="font-extrabold text-base leading-tight">
                {isUrdu ? 'آن لائن اور آف لائن سنک سینٹر' : 'Online & Offline Sync Center'}
              </h2>
              <p className="text-teal-200 text-xs">
                {isUrdu
                  ? 'بغیر انٹرنیٹ کے مکمل کام کریں اور آن لائن ہونے پر سنک کریں'
                  : 'Work 100% offline, sync automatically when connected'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs text-slate-700">
          {/* Real-time Status Card */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
              isOnline
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-3.5 h-3.5 rounded-full animate-ping ${
                  isOnline ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <div>
                <span className="font-bold text-sm block">
                  {isOnline
                    ? isUrdu
                      ? 'آن لائن موڈ — کلاؤڈ اور واٹس ایپ فعال'
                      : 'Online Mode Active'
                    : isUrdu
                    ? 'آف لائن موڈ — لوکل ڈیٹا بیس فعال'
                    : 'Offline Mode Active'}
                </span>
                <p className="text-[11px] opacity-80 mt-0.5">
                  {isOnline
                    ? isUrdu
                      ? 'انٹرنیٹ کنکشن موجود ہے۔ ڈیٹا کلاؤڈ کے ساتھ سنک کے لیے تیار ہے۔'
                      : 'Internet connected. Ready for cloud sync and patient messaging.'
                    : isUrdu
                    ? 'انٹرنیٹ کے بغیر تمام نسخے، رسیدیں اور مریضوں کا اندراج عام رفتار سے کام کر رہے ہیں۔'
                    : 'All prescriptions, receipts, and patients work locally with 0 delay.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleSyncNow}
              disabled={isSyncing || !isBrowserOnline}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                !isBrowserOnline
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700 active:scale-95 text-white'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? (isUrdu ? 'سنک ہو رہا ہے...' : 'Syncing...') : isUrdu ? 'ابھی سنک کریں' : 'Sync Now'}</span>
            </button>
          </div>

          {/* Sync Feedback Alert */}
          {syncFeedback && (
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{syncFeedback}</span>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wide block font-semibold">
                {isUrdu ? 'آخری سنک' : 'Last Synced'}
              </span>
              <span className="font-bold text-slate-800 text-xs mt-1 block truncate">
                {formattedLastSync}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wide block font-semibold">
                {isUrdu ? 'لوکل ریکارڈز' : 'Cached Records'}
              </span>
              <span className="font-bold text-teal-700 text-sm mt-0.5 block">
                {syncState.totalRecords}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wide block font-semibold">
                {isUrdu ? 'لوکل سٹوریج سائز' : 'Storage Size'}
              </span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block font-mono">
                ~{syncState.storageUsageKb} KB
              </span>
            </div>
          </div>

          {/* Feature toggles */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <Smartphone className="w-4 h-4 text-teal-600" />
              <span>{isUrdu ? 'آن لائن / آف لائن سیٹنگز' : 'Online & Offline Preferences'}</span>
            </h3>

            {/* Toggle 1: Auto-Sync */}
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <div>
                <span className="font-semibold text-slate-800 block">
                  {isUrdu ? 'خودکار کلاؤڈ سنک (Auto-Sync)' : 'Automatic Cloud Sync'}
                </span>
                <p className="text-[11px] text-slate-500">
                  {isUrdu
                    ? 'انٹرنیٹ بحال ہونے پر خودبخود کلاؤڈ کے ساتھ سنک کریں'
                    : 'Automatically sync pending changes when internet reconnects'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleAutoSync()}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  syncState.autoSyncEnabled ? 'bg-teal-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    syncState.autoSyncEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Force Offline Mode */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-semibold text-slate-800 block">
                  {isUrdu ? 'آف لائن موڈ نافذ کریں (Force Offline)' : 'Force Offline Mode'}
                </span>
                <p className="text-[11px] text-slate-500">
                  {isUrdu
                    ? 'وائی فائی بند کیے بغیر ایپ کو خالص آف لائن تیز رفتاری پر چلائیں'
                    : 'Operate strictly from device storage with zero network latency'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleForceOffline()}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isForcedOffline ? 'bg-amber-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isForcedOffline ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* How It Works Explainer Card */}
          <div className="bg-teal-50/70 p-3.5 rounded-2xl border border-teal-200/70 text-[11px] text-teal-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>{isUrdu ? 'آن لائن اور آف لائن کیسے کام کرتا ہے؟' : 'How Online & Offline Works:'}</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-teal-800">
              <li>
                <strong>{isUrdu ? 'مکمل آف لائن آزادی:' : '100% Offline Independence:'}</strong>{' '}
                {isUrdu
                  ? 'مریض رجسٹر کریں، نسخہ لکھیں یا فیس کی پرچی پرنٹ کریں — بغیر انٹرنیٹ کے بجلی کی تیزی سے کام کرتا ہے۔'
                  : 'Register patients, write prescriptions, and print receipts without any internet.'}
              </li>
              <li>
                <strong>{isUrdu ? 'آن لائن کلاؤڈ بیک اپ:' : 'Online Cloud Backup:'}</strong>{' '}
                {isUrdu
                  ? 'جب انٹرنیٹ میسر ہو تو سنک کا بٹن دبائیں یا خودکار سنک کے ذریعے کلاؤڈ پر محفوظ رکھیں۔'
                  : 'When connected, your data synchronizes safely and enables direct WhatsApp prescription sharing.'}
              </li>
              <li>
                <strong>{isUrdu ? 'اینڈرائیڈ PWA کیش:' : 'Android PWA Cache:'}</strong>{' '}
                {isUrdu
                  ? 'ایپ براہ راست آپ کے موبائل پر محفوظ ہوتی ہے اور بغیر انٹرنیٹ کے بھی کھلتی ہے۔'
                  : 'The application is cached locally via Service Worker and boots instantly anytime.'}
              </li>
            </ul>
          </div>

          {/* Quick Manual Export */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500">
              {isUrdu ? 'ڈیٹا بیک اپ اور موبائل ایپ:' : 'Offline backup & Android APK:'}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/HK_Clinic_Management_System.apk';
                  link.download = 'HK_Clinic_Management_System.apk';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold rounded-xl text-xs transition"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isUrdu ? 'اینڈرائڈ APK ڈاؤنلوڈ' : 'Download Android APK'}</span>
              </button>
              <button
                type="button"
                onClick={exportFullBackupFile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                <Download className="w-3.5 h-3.5 text-teal-600" />
                <span>{isUrdu ? 'آف لائن بیک اپ JSON' : 'Export Offline Backup JSON'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs transition"
          >
            {isUrdu ? 'بند کریں' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
