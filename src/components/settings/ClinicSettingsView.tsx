import React, { useState, useRef } from 'react';
import {
  Settings,
  Building,
  Save,
  Database,
  Upload,
  Download,
  Shield,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Clock,
  User,
  History,
} from 'lucide-react';
import { ClinicSettings, AuditLogEntry, UserRole } from '../../types';
import {
  SettingsRepository,
  AuditRepository,
  BackupService,
  DEFAULT_CLINIC_SETTINGS,
} from '../../database/storage';

interface ClinicSettingsViewProps {
  settings: ClinicSettings;
  onSaveSettings: (settings: ClinicSettings) => void;
  auditLogs: AuditLogEntry[];
  onRefresh: () => void;
  isUrdu: boolean;
  role: UserRole;
  currentUser: string;
}

export const ClinicSettingsView: React.FC<ClinicSettingsViewProps> = ({
  settings,
  onSaveSettings,
  auditLogs,
  onRefresh,
  isUrdu,
  role,
  currentUser,
}) => {
  const [form, setForm] = useState<ClinicSettings>({ ...settings });
  const [activeSubTab, setActiveSubTab] = useState<'clinic' | 'doctor' | 'margins' | 'backup' | 'audit'>('clinic');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [restoreStatus, setRestoreStatus] = useState<{ success: boolean; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = SettingsRepository.save(form, currentUser);
    onSaveSettings(saved);
    setSaveStatus('Clinic configuration saved successfully.');
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handleExportBackup = () => {
    const jsonStr = BackupService.exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    link.href = url;
    link.download = `HK_Clinic_Backup_${timestamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
    AuditRepository.log(currentUser, 'BACKUP_DOWNLOADED', 'Exported JSON database backup.');
    onRefresh();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('Are you sure you want to restore the database from this backup? Existing records will be updated.')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = BackupService.importDatabaseJson(content, currentUser);
        setRestoreStatus(result);
        if (result.success) {
          onRefresh();
          setForm(SettingsRepository.get());
        }
      }
    };
    reader.readAsText(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setForm({ ...form, logoUrl: url });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Settings Navigation Bar */}
      <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-teal-600" />
          <div>
            <h1 className="font-bold text-sm text-slate-800">
              {isUrdu ? 'کلینک ترتیبات و بیک اپ سسٹم' : 'Clinic Configuration & System Control'}
            </h1>
            <p className="text-[11px] text-slate-500">
              {isUrdu ? 'ڈاکٹر معلومات، لیٹر ہیڈ، بیک اپ و بحالی' : 'Doctor profile, letterhead margins, backup & restore'}
            </p>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('clinic')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeSubTab === 'clinic' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Clinic Details
          </button>
          <button
            onClick={() => setActiveSubTab('doctor')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeSubTab === 'doctor' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Doctor Profile
          </button>
          <button
            onClick={() => setActiveSubTab('margins')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeSubTab === 'margins' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Page & Letterhead
          </button>
          <button
            onClick={() => setActiveSubTab('backup')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeSubTab === 'backup' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Backup & Restore
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeSubTab === 'audit' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Audit Log ({auditLogs.length})
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Tab: Clinic Details */}
      {activeSubTab === 'clinic' && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Clinic Name (English)
              </label>
              <input
                type="text"
                required
                value={form.clinicName}
                onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                کلینک کا نام (اردو نستعلیق)
              </label>
              <input
                type="text"
                dir="rtl"
                value={form.clinicNameUrdu}
                onChange={(e) => setForm({ ...form, clinicNameUrdu: e.target.value })}
                className="w-full bg-teal-50/50 border border-teal-200 rounded-lg p-2 font-urdu text-teal-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number (Dialer)</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Clinic Physical Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Google Maps Direction URL</label>
              <input
                type="text"
                value={form.googleMapsUrl}
                onChange={(e) => setForm({ ...form, googleMapsUrl: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Receipt Digital Footer</label>
              <input
                type="text"
                value={form.receiptFooterText}
                onChange={(e) => setForm({ ...form, receiptFooterText: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">رسید ڈیجیٹل فوٹر (اردو)</label>
              <input
                type="text"
                dir="rtl"
                value={form.receiptFooterTextUrdu}
                onChange={(e) => setForm({ ...form, receiptFooterTextUrdu: e.target.value })}
                className="w-full bg-teal-50/50 border border-teal-200 rounded-lg p-2 font-urdu"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Currency Code</label>
              <input
                type="text"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">MR Number Prefix</label>
              <input
                type="text"
                value={form.mrNumberPrefix}
                onChange={(e) => setForm({ ...form, mrNumberPrefix: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                App Administration Password (ایڈمن پاس ورڈ)
              </label>
              <input
                type="text"
                value={form.adminPassword || 'admin123'}
                onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
                placeholder="admin123"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-teal-800 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Consultation Fee (PKR) (چیک اپ فیس)
              </label>
              <input
                type="number"
                value={form.consultationFee || 1500}
                onChange={(e) => setForm({ ...form, consultationFee: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Clinic Timings (English)
              </label>
              <input
                type="text"
                value={form.clinicTimings || 'Mon - Sat: 5:00 PM - 9:00 PM'}
                onChange={(e) => setForm({ ...form, clinicTimings: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                کلینک کے اوقات (اردو)
              </label>
              <input
                type="text"
                dir="rtl"
                value={form.clinicTimingsUrdu || 'پیر تا ہفتہ: شام 5:00 تا رات 9:00 بجے'}
                onChange={(e) => setForm({ ...form, clinicTimingsUrdu: e.target.value })}
                className="w-full bg-teal-50/50 border border-teal-200 rounded-lg p-2 font-urdu"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Clinic Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Doctor Profile */}
      {activeSubTab === 'doctor' && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Doctor Name</label>
              <input
                type="text"
                value={form.doctorName}
                onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ڈاکٹر کا نام (اردو)</label>
              <input
                type="text"
                dir="rtl"
                value={form.doctorNameUrdu}
                onChange={(e) => setForm({ ...form, doctorNameUrdu: e.target.value })}
                className="w-full bg-teal-50/50 border border-teal-200 rounded-lg p-2 font-urdu text-teal-900 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Qualifications</label>
              <input
                type="text"
                value={form.doctorQualification}
                onChange={(e) => setForm({ ...form, doctorQualification: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ڈگریاں / اسناد (اردو)</label>
              <input
                type="text"
                dir="rtl"
                value={form.doctorQualificationUrdu}
                onChange={(e) => setForm({ ...form, doctorQualificationUrdu: e.target.value })}
                className="w-full bg-teal-50/50 border border-teal-200 rounded-lg p-2 font-urdu text-teal-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Specialty</label>
              <input
                type="text"
                value={form.doctorSpecialty}
                onChange={(e) => setForm({ ...form, doctorSpecialty: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">تخصص / شعبہ (اردو)</label>
              <input
                type="text"
                dir="rtl"
                value={form.doctorSpecialtyUrdu}
                onChange={(e) => setForm({ ...form, doctorSpecialtyUrdu: e.target.value })}
                className="w-full bg-teal-50/50 border border-teal-200 rounded-lg p-2 font-urdu text-teal-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Medical Council / PMDC Reg #
              </label>
              <input
                type="text"
                value={form.registrationNumber}
                onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Doctor Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Page Margins & Letterhead Defaults */}
      {activeSubTab === 'margins' && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 text-xs">
          <h2 className="font-bold text-xs uppercase text-slate-800 tracking-wider">
            Default Page Setup for New Prescriptions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Top Margin (mm)</label>
              <input
                type="number"
                value={form.defaultPageSetup.marginTop}
                onChange={(e) =>
                  setForm({
                    ...form,
                    defaultPageSetup: { ...form.defaultPageSetup, marginTop: Number(e.target.value) },
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bottom Margin (mm)</label>
              <input
                type="number"
                value={form.defaultPageSetup.marginBottom}
                onChange={(e) =>
                  setForm({
                    ...form,
                    defaultPageSetup: {
                      ...form.defaultPageSetup,
                      marginBottom: Number(e.target.value),
                    },
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Letterhead Header Gap (mm)
              </label>
              <input
                type="number"
                value={form.defaultPageSetup.headerHeight}
                onChange={(e) =>
                  setForm({
                    ...form,
                    defaultPageSetup: {
                      ...form.defaultPageSetup,
                      headerHeight: Number(e.target.value),
                    },
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Letterhead Footer Gap (mm)
              </label>
              <input
                type="number"
                value={form.defaultPageSetup.footerHeight}
                onChange={(e) =>
                  setForm({
                    ...form,
                    defaultPageSetup: {
                      ...form.defaultPageSetup,
                      footerHeight: Number(e.target.value),
                    },
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Margin Defaults</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Backup & Restore (Mandatory PRD Section 27) */}
      {activeSubTab === 'backup' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5 text-xs">
          <div>
            <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-600" />
              <span>Offline Database Backup & Full Restore</span>
            </h2>
            <p className="text-slate-500 mt-1">
              Export and safeguard all patient records, medical histories, prescription archives,
              receipts, medicines, and audit logs. The backup file is a portable JSON document that can
              be restored on any Android device or future Windows desktop counterpart.
            </p>
          </div>

          {restoreStatus && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2 ${
                restoreStatus.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {restoreStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{restoreStatus.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Export Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-800 text-xs block">
                  Export Database Backup (بیک اپ بنائیں)
                </span>
                <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                  Downloads a complete snapshot of all patients, prescriptions, and financial receipts
                  into a secure local JSON file.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportBackup}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Database JSON</span>
              </button>
            </div>

            {/* Import Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-800 text-xs block">
                  Restore from File (ڈیٹا بیس بحال کریں)
                </span>
                <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                  Upload an existing backup file to restore records. Data integrity is validated before
                  saving.
                </p>
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-bold rounded-xl text-xs shadow-sm transition"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Backup File to Restore</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Audit Log (PRD Section 28) */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-teal-600" />
                <span>Security & Clinical Audit Trail (آڈٹ لاگ)</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Tamper-evident log of clinical entries, prescriptions, edits, and receipts.
              </p>
            </div>

            <button
              onClick={() => {
                if (confirm('Clear audit history?')) {
                  AuditRepository.clear(currentUser);
                  onRefresh();
                }
              }}
              className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold"
            >
              Clear Logs
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pt-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-[11px] flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded uppercase">
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-800">{log.user}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{log.details}</p>
                </div>
                <div className="text-right text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                  {new Date(log.timestamp).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
