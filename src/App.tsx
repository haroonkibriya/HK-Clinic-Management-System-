/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  initializeClinicDatabase,
  PatientRepository,
  PrescriptionRepository,
  ReceiptRepository,
  AppointmentRepository,
  MedicineRepository,
  SettingsRepository,
  AuditRepository,
} from './database/storage';
import {
  Patient,
  Prescription,
  FeeReceipt,
  ProcedureReceipt,
  Appointment,
  MedicineCatalogEntry,
  ClinicSettings,
  UserRole,
  AuditLogEntry,
} from './types';
import { AndroidNavBar, ActiveTab } from './components/android/AndroidNavBar';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { PWAInstallButton } from './components/common/PWAInstallButton';
import { DashboardView } from './components/dashboard/DashboardView';
import { PatientList } from './components/patients/PatientList';
import { PatientForm } from './components/patients/PatientForm';
import { PatientDetail } from './components/patients/PatientDetail';
import { PrescriptionList } from './components/prescriptions/PrescriptionList';
import { PrescriptionEditor } from './components/prescriptions/PrescriptionEditor';
import { PrescriptionView } from './components/prescriptions/PrescriptionView';
import { ReceiptList } from './components/receipts/ReceiptList';
import { ReceiptEditor } from './components/receipts/ReceiptEditor';
import { ReceiptPrintModal } from './components/receipts/ReceiptPrintModal';
import { AppointmentManager } from './components/appointments/AppointmentManager';
import { MedicineCatalogue } from './components/medicines/MedicineCatalogue';
import { ReportsView } from './components/reports/ReportsView';
import { ClinicSettingsView } from './components/settings/ClinicSettingsView';
import { PatientPortalView } from './components/portal/PatientPortalView';
import { LoginModal } from './components/auth/LoginModal';
import { ClinicBrandedLogin } from './components/auth/ClinicBrandedLogin';
import { AuthService } from './services/authService';
import { OnlineOfflineSyncModal } from './components/sync/OnlineOfflineSyncModal';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import {
  Smartphone,
  Tablet,
  Maximize2,
  Languages,
  UserCircle2,
  Menu,
  X,
  Stethoscope,
  Pill,
  BarChart3,
  Settings,
  Scissors,
  Calendar,
  Lock,
  RefreshCw,
  Cloud,
  WifiOff,
  LogOut,
} from 'lucide-react';

export default function App() {
  // Ensure database initialized
  useEffect(() => {
    initializeClinicDatabase();
    refreshAllData();
  }, []);

  // Application Data States
  const [settings, setSettings] = useState<ClinicSettings>(() => SettingsRepository.get());
  const [patients, setPatients] = useState<Patient[]>(() => PatientRepository.getAll());
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() =>
    PrescriptionRepository.getAll()
  );
  const [feeReceipts, setFeeReceipts] = useState<FeeReceipt[]>(() =>
    ReceiptRepository.getFeeReceipts()
  );
  const [procedureReceipts, setProcedureReceipts] = useState<ProcedureReceipt[]>(() =>
    ReceiptRepository.getProcedureReceipts()
  );
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    AppointmentRepository.getAll()
  );
  const [medicines, setMedicines] = useState<MedicineCatalogEntry[]>(() =>
    MedicineRepository.getAll()
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() =>
    AuditRepository.getAll()
  );

  // User & UI State
  const initialSession = AuthService.getSession();
  const [currentRole, setCurrentRole] = useState<UserRole | null>(
    () => initialSession?.role || null
  );
  const [currentUserName, setCurrentUserName] = useState<string>(
    () => initialSession?.name || 'Dr. Haroon Kibriya'
  );
  const [activePatientId, setActivePatientId] = useState<string>(
    () => initialSession?.patientId || patients[0]?.id || ''
  );
  const [isUrdu, setIsUrdu] = useState<boolean>(settings.language === 'ur');
  const isOnline = useOnlineStatus();

  // Android Viewport Mode: Phone (420px), Tablet (768px), or Fullscreen
  const [viewportMode, setViewportMode] = useState<'phone' | 'tablet' | 'fullscreen'>('fullscreen');

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [viewingPrescription, setViewingPrescription] = useState<Prescription | null>(null);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
  const [printReceiptData, setPrintReceiptData] = useState<{
    receipt: FeeReceipt | ProcedureReceipt;
    type: 'fee' | 'procedure';
  } | null>(null);

  // Modals
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [showPrescriptionEditor, setShowPrescriptionEditor] = useState(false);
  const [showReceiptEditor, setShowReceiptEditor] = useState(false);
  const [receiptEditorType, setReceiptEditorType] = useState<'fee' | 'procedure'>('fee');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);

  // Refresh all state from storage
  const refreshAllData = () => {
    setSettings(SettingsRepository.get());
    setPatients(PatientRepository.getAll());
    setPrescriptions(PrescriptionRepository.getAll());
    setFeeReceipts(ReceiptRepository.getFeeReceipts());
    setProcedureReceipts(ReceiptRepository.getProcedureReceipts());
    setAppointments(AppointmentRepository.getAll());
    setMedicines(MedicineRepository.getAll());
    setAuditLogs(AuditRepository.getAll());
  };

  const handleRoleChange = (role: UserRole, name: string, patientId?: string) => {
    setCurrentRole(role);
    setCurrentUserName(name);
    if (patientId) {
      setActivePatientId(patientId);
      const pat = patients.find((p) => p.id === patientId);
      if (pat) setSelectedPatient(pat);
      setActiveTab('portal');
    } else {
      setActiveTab('dashboard');
    }
  };

  const currentPatientUser =
    patients.find((p) => p.id === activePatientId) || patients[0];

  // If user has not authenticated yet, display the official HK Clinic Management System branding & login page
  if (!currentRole) {
    return (
      <div
        className={`min-h-screen bg-slate-950 flex flex-col justify-between ${
          isUrdu ? 'rtl' : 'ltr'
        }`}
        dir={isUrdu ? 'rtl' : 'ltr'}
      >
        <OfflineIndicator onOpenSyncModal={() => setShowSyncModal(true)} isUrdu={isUrdu} />
        <ClinicBrandedLogin
          settings={settings}
          isUrdu={isUrdu}
          onLoginSuccess={(session) => {
            setCurrentRole(session.role);
            setCurrentUserName(session.name);
            if (session.role === 'patient') {
              if (session.patientId) {
                setActivePatientId(session.patientId);
                const pat = patients.find((p) => p.id === session.patientId);
                if (pat) setSelectedPatient(pat);
              }
              setActiveTab('portal');
            } else {
              setActiveTab('dashboard');
            }
          }}
          onOpenPatientSelfService={(pat) => {
            setCurrentRole('patient');
            setCurrentUserName(pat.name);
            setActivePatientId(pat.id);
            setSelectedPatient(pat);
            setActiveTab('portal');
          }}
          onToggleLanguage={() => setIsUrdu(!isUrdu)}
        />
        <OnlineOfflineSyncModal
          isOpen={showSyncModal}
          onClose={() => setShowSyncModal(false)}
          isUrdu={isUrdu}
          currentUser={currentUserName}
          onSyncComplete={refreshAllData}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-slate-200 text-slate-900 flex flex-col items-center justify-start ${
        isUrdu ? 'rtl' : 'ltr'
      }`}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Offline Status Alert */}
      <OfflineIndicator onOpenSyncModal={() => setShowSyncModal(true)} isUrdu={isUrdu} />

      {/* Top App Control Bar for Android preview & settings (hidden in print) */}
      <div className="no-print w-full bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs shadow-md z-40 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-teal-600 flex items-center justify-center font-bold text-xs text-white">
            HK
          </div>
          <span className="font-extrabold tracking-wide hidden sm:inline">
            HK Clinic Management System
          </span>
          <span className="text-[10px] bg-teal-800 text-teal-200 px-2 py-0.5 rounded-full font-mono">
            Android-First v1.0
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* In-app PWA install button */}
          <PWAInstallButton />

          {/* Language Switcher */}
          <button
            onClick={() => setIsUrdu(!isUrdu)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-200 text-xs font-semibold border border-slate-700 transition"
            title="Toggle Interface Language English / Urdu"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'English' : 'اردو'}</span>
          </button>

          {/* Viewport Form Factor Switcher */}
          <div className="hidden md:flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setViewportMode('phone')}
              className={`p-1.5 rounded transition ${
                viewportMode === 'phone'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Android Phone View (420px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('tablet')}
              className={`p-1.5 rounded transition ${
                viewportMode === 'tablet'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Android Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('fullscreen')}
              className={`p-1.5 rounded transition ${
                viewportMode === 'fullscreen'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Full Window View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Role Pill & Switcher */}
          <button
            onClick={() => setShowRoleModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-700/80 hover:bg-teal-700 text-white text-xs font-semibold border border-teal-500/40 transition shadow-2xs"
          >
            <UserCircle2 className="w-3.5 h-3.5 text-teal-200" />
            <span className="capitalize">{currentRole}</span>
          </button>
        </div>
      </div>

      {/* Main Container / Android Device Simulation Shell */}
      <div
        className={`w-full transition-all duration-300 flex flex-col flex-1 bg-slate-100 ${
          viewportMode === 'phone'
            ? 'max-w-[425px] my-3 sm:my-6 rounded-3xl shadow-2xl overflow-hidden border-8 border-slate-800 ring-1 ring-slate-900/40 min-h-[850px] max-h-[92vh]'
            : viewportMode === 'tablet'
            ? 'max-w-[768px] my-3 sm:my-6 rounded-3xl shadow-2xl overflow-hidden border-8 border-slate-800 ring-1 ring-slate-900/40 min-h-[850px] max-h-[92vh]'
            : 'max-w-6xl min-h-screen shadow-lg'
        }`}
      >
        {/* Android App Top Header */}
        <div className="no-print bg-teal-700 text-white px-4 py-3 flex items-center justify-between shadow-xs select-none shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white text-teal-800 flex items-center justify-center font-extrabold text-sm shadow-xs">
              HK
            </div>
            <div>
              <h2 className="font-extrabold text-sm leading-tight">
                {isUrdu ? 'ایچ کے کلینک مینجمنٹ سسٹم' : 'HK Clinic Management System'}
              </h2>
              <span className="text-[10px] text-teal-200 font-medium">
                {settings.doctorName} • {currentRole.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Online / Offline Sync Center Trigger */}
            <button
              onClick={() => setShowSyncModal(true)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition shadow-2xs ${
                isOnline
                  ? 'bg-teal-800/90 hover:bg-teal-900 text-teal-100 border-teal-500/40'
                  : 'bg-amber-800/90 hover:bg-amber-900 text-amber-100 border-amber-400/50 animate-pulse'
              }`}
              title={
                isOnline
                  ? isUrdu
                    ? 'آن لائن موڈ — سنک سینٹر کھولنے کے لیے دبائیں'
                    : 'Online Mode — Click for Sync Center'
                  : isUrdu
                  ? 'آف لائن موڈ — سنک سینٹر کھولنے کے لیے دبائیں'
                  : 'Offline Mode — Click for Sync Center'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-[11px] font-medium hidden sm:inline">
                {isOnline ? (isUrdu ? 'آن لائن' : 'Online') : (isUrdu ? 'آف لائن' : 'Offline')}
              </span>
              <RefreshCw className="w-3 h-3 text-teal-300" />
            </button>

            <button
              onClick={() => setShowMoreDrawer(true)}
              className="p-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-teal-100 transition"
              title="Menu Drawer"
            >
              <Menu className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                AuthService.clearSession();
                setCurrentRole(null);
              }}
              className="p-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-teal-100 transition"
              title={isUrdu ? 'لاگ آؤٹ / پورٹل تبدیل کریں' : 'Logout / Switch Portal'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic App Content Body */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 pb-20">
          {/* If viewing a prescription */}
          {viewingPrescription ? (
            <PrescriptionView
              prescription={viewingPrescription}
              settings={settings}
              onBack={() => setViewingPrescription(null)}
              onEdit={(rx) => {
                setEditingPrescription(rx);
                setShowPrescriptionEditor(true);
              }}
              isUrdu={isUrdu}
              currentUser={currentUserName}
            />
          ) : selectedPatient ? (
            /* If inspecting a patient's comprehensive profile */
            <PatientDetail
              patient={selectedPatient}
              onBack={() => setSelectedPatient(null)}
              onEditPatient={(pat) => {
                setEditingPatient(pat);
                setShowPatientForm(true);
              }}
              onNewPrescription={(pat) => {
                setEditingPrescription(null);
                setSelectedPatient(pat);
                setShowPrescriptionEditor(true);
              }}
              onNewReceipt={(pat) => {
                setSelectedPatient(pat);
                setReceiptEditorType('fee');
                setShowReceiptEditor(true);
              }}
              onSelectPrescription={(rx) => setViewingPrescription(rx)}
              prescriptions={prescriptions}
              feeReceipts={feeReceipts}
              procedureReceipts={procedureReceipts}
              appointments={appointments}
              onDeletePatient={(pat) => {
                PatientRepository.delete(pat.id, currentUserName);
                setSelectedPatient(null);
                refreshAllData();
              }}
              isUrdu={isUrdu}
              role={currentRole}
              currentUser={currentUserName}
            />
          ) : currentRole === 'patient' ? (
            /* Dedicated Patient Portal */
            <PatientPortalView
              patient={currentPatientUser}
              prescriptions={prescriptions}
              feeReceipts={feeReceipts}
              procedureReceipts={procedureReceipts}
              appointments={appointments}
              settings={settings}
              onViewPrescription={(rx) => setViewingPrescription(rx)}
              onViewFeeReceipt={(rec) => setPrintReceiptData({ receipt: rec, type: 'fee' })}
              onRefreshData={refreshAllData}
              onLogout={() => {
                AuthService.clearSession();
                setCurrentRole(null);
              }}
              isUrdu={isUrdu}
            />
          ) : (
            /* Role: Doctor or Assistant views */
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  patients={patients}
                  prescriptions={prescriptions}
                  feeReceipts={feeReceipts}
                  procedureReceipts={procedureReceipts}
                  appointments={appointments}
                  settings={settings}
                  onNavigate={(tab) => setActiveTab(tab)}
                  onNewPatient={() => {
                    setEditingPatient(null);
                    setShowPatientForm(true);
                  }}
                  onNewPrescription={(pat) => {
                    setEditingPrescription(null);
                    if (pat) setSelectedPatient(pat);
                    setShowPrescriptionEditor(true);
                  }}
                  onNewReceipt={(pat) => {
                    if (pat) setSelectedPatient(pat);
                    setReceiptEditorType('fee');
                    setShowReceiptEditor(true);
                  }}
                  onOpenSync={() => setShowSyncModal(true)}
                  isUrdu={isUrdu}
                  role={currentRole}
                />
              )}

              {activeTab === 'patients' && (
                <PatientList
                  patients={patients}
                  onSelectPatient={(pat) => setSelectedPatient(pat)}
                  onNewPatient={() => {
                    setEditingPatient(null);
                    setShowPatientForm(true);
                  }}
                  onNewPrescription={(pat) => {
                    setEditingPrescription(null);
                    setSelectedPatient(pat);
                    setShowPrescriptionEditor(true);
                  }}
                  onNewReceipt={(pat) => {
                    setSelectedPatient(pat);
                    setReceiptEditorType('fee');
                    setShowReceiptEditor(true);
                  }}
                  onDeletePatient={(pat) => {
                    PatientRepository.delete(pat.id, currentUserName);
                    refreshAllData();
                  }}
                  onDeleteAllPatients={() => {
                    PatientRepository.clearAll(currentUserName);
                    setSelectedPatient(null);
                    setViewingPrescription(null);
                    refreshAllData();
                  }}
                  isUrdu={isUrdu}
                  role={currentRole}
                />
              )}

              {activeTab === 'prescriptions' && (
                <PrescriptionList
                  prescriptions={prescriptions}
                  onSelectPrescription={(rx) => setViewingPrescription(rx)}
                  onNewPrescription={() => {
                    setEditingPrescription(null);
                    setShowPrescriptionEditor(true);
                  }}
                  isUrdu={isUrdu}
                  role={currentRole}
                />
              )}

              {activeTab === 'receipts' && (
                <ReceiptList
                  feeReceipts={feeReceipts}
                  procedureReceipts={procedureReceipts}
                  onNewReceipt={() => {
                    setReceiptEditorType('fee');
                    setShowReceiptEditor(true);
                  }}
                  onSelectFeeReceipt={(rec) =>
                    setPrintReceiptData({ receipt: rec, type: 'fee' })
                  }
                  onSelectProcedureReceipt={(rec) =>
                    setPrintReceiptData({ receipt: rec, type: 'procedure' })
                  }
                  settings={settings}
                  isUrdu={isUrdu}
                />
              )}

              {activeTab === 'procedures' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-sm text-slate-800">
                        {isUrdu ? 'پروسیجر چارجز رسیدیں' : 'Clinical Procedure Receipts'}
                      </h2>
                      <p className="text-xs text-slate-500">
                        Nebulization, wound dressing, stitching, ECG, spot investigations
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setReceiptEditorType('procedure');
                        setShowReceiptEditor(true);
                      }}
                      className="px-3.5 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition"
                    >
                      New Procedure Receipt
                    </button>
                  </div>
                  <ReceiptList
                    feeReceipts={[]}
                    procedureReceipts={procedureReceipts}
                    onNewReceipt={() => {
                      setReceiptEditorType('procedure');
                      setShowReceiptEditor(true);
                    }}
                    onSelectFeeReceipt={() => {}}
                    onSelectProcedureReceipt={(rec) =>
                      setPrintReceiptData({ receipt: rec, type: 'procedure' })
                    }
                    settings={settings}
                    isUrdu={isUrdu}
                  />
                </div>
              )}

              {activeTab === 'appointments' && (
                <AppointmentManager
                  appointments={appointments}
                  patients={patients}
                  settings={settings}
                  onRefresh={refreshAllData}
                  isUrdu={isUrdu}
                  role={currentRole}
                  currentUser={currentUserName}
                />
              )}

              {activeTab === 'medicines' && (
                <MedicineCatalogue
                  medicines={medicines}
                  onRefresh={refreshAllData}
                  isUrdu={isUrdu}
                  currentUser={currentUserName}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsView
                  patients={patients}
                  prescriptions={prescriptions}
                  feeReceipts={feeReceipts}
                  procedureReceipts={procedureReceipts}
                  appointments={appointments}
                  settings={settings}
                  isUrdu={isUrdu}
                />
              )}

              {activeTab === 'settings' && (
                <ClinicSettingsView
                  settings={settings}
                  onSaveSettings={(newSettings) => {
                    setSettings(newSettings);
                    setIsUrdu(newSettings.language === 'ur');
                    refreshAllData();
                  }}
                  auditLogs={auditLogs}
                  onRefresh={refreshAllData}
                  isUrdu={isUrdu}
                  role={currentRole}
                  currentUser={currentUserName}
                />
              )}
            </>
          )}

          {/* App View Branding Footer */}
          <div className="no-print mt-8 pt-4 pb-2 border-t border-slate-200 text-center text-[11px] text-slate-500">
            <p>
              Developed by <strong className="font-semibold text-slate-700">H.K Tech</strong>, A company by <strong className="font-semibold text-slate-700">Haroon Kibriya</strong>
            </p>
            <a
              href="https://wa.me/923129223127"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-0.5 text-teal-600 hover:text-teal-700 font-medium transition"
            >
              Whatsapp +923129223127
            </a>
          </div>
        </main>

        {/* Android Material Bottom Navigation Bar */}
        <AndroidNavBar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setSelectedPatient(null);
            setViewingPrescription(null);
            setActiveTab(tab);
          }}
          role={currentRole}
          isUrdu={isUrdu}
          onOpenMoreMenu={() => setShowMoreDrawer(true)}
        />
      </div>

      {/* GitHub Website View / Full Page Branding Footer */}
      <footer className="no-print w-full py-3.5 px-4 text-center bg-slate-900 text-slate-400 text-xs border-t border-slate-800 shrink-0 select-none">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-[11px] sm:text-xs">
          <span>Developed by <strong className="text-white font-semibold">H.K Tech</strong>, A company by <strong className="text-white font-semibold">Haroon Kibriya</strong></span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <a
            href="https://wa.me/923129223127"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 font-medium transition"
          >
            Whatsapp +923129223127
          </a>
        </div>
      </footer>

      {/* More / Menu Drawer Slide-out */}
      {showMoreDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-5 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                    HK
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">HK Clinic Menu</h3>
                    <p className="text-[11px] text-slate-500">Android Offline App</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMoreDrawer(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links in Drawer */}
              <div className="space-y-1 text-xs font-semibold">
                {/* Online / Offline Sync Center */}
                <button
                  onClick={() => {
                    setShowMoreDrawer(false);
                    setShowSyncModal(true);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 transition"
                >
                  <div className="flex items-center gap-2.5">
                    {isOnline ? (
                      <Cloud className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-amber-600" />
                    )}
                    <span>{isUrdu ? 'آن لائن / آف لائن سنک سینٹر' : 'Online & Offline Sync'}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isOnline
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('procedures');
                    setSelectedPatient(null);
                    setViewingPrescription(null);
                    setShowMoreDrawer(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition"
                >
                  <Scissors className="w-4 h-4 text-teal-600" />
                  <span>{isUrdu ? 'پروسیجر چارجز' : 'Procedure Receipts'}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('medicines');
                    setSelectedPatient(null);
                    setViewingPrescription(null);
                    setShowMoreDrawer(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition"
                >
                  <Pill className="w-4 h-4 text-teal-600" />
                  <span>{isUrdu ? 'ادویات کا ڈیٹا بیس' : 'Medicine Catalogue'}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('reports');
                    setSelectedPatient(null);
                    setViewingPrescription(null);
                    setShowMoreDrawer(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition"
                >
                  <BarChart3 className="w-4 h-4 text-teal-600" />
                  <span>{isUrdu ? 'رپورٹس و حسابات' : 'Financial & Clinic Reports'}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setSelectedPatient(null);
                    setViewingPrescription(null);
                    setShowMoreDrawer(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition"
                >
                  <Settings className="w-4 h-4 text-teal-600" />
                  <span>{isUrdu ? 'کلینک ترتیبات و بیک اپ' : 'Settings & Backup'}</span>
                </button>

                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = '/HK_Clinic_Management_System.apk';
                    link.download = 'HK_Clinic_Management_System.apk';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setShowMoreDrawer(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold border border-emerald-200 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>{isUrdu ? 'اینڈرائڈ ایپ ڈاؤنلوڈ (.apk)' : 'Download Android APK'}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
                    APK
                  </span>
                </button>
              </div>
            </div>

            {/* Drawer Bottom Info */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <button
                onClick={() => {
                  setShowRoleModal(true);
                  setShowMoreDrawer(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-teal-50 text-teal-900 font-semibold"
              >
                <span>Role: {currentRole}</span>
                <span className="text-[10px] bg-teal-200 text-teal-800 px-2 py-0.5 rounded">
                  Change
                </span>
              </button>

              <button
                onClick={() => {
                  setShowMoreDrawer(false);
                  AuthService.clearSession();
                  setCurrentRole(null);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold flex items-center justify-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>{isUrdu ? 'لاگ آؤٹ / پورٹل تبدیل کریں' : 'Logout / Switch Portal'}</span>
              </button>

              <div className="pt-2 border-t border-slate-100 text-center text-[11px] text-slate-500 space-y-1">
                <p>
                  Developed by <strong className="font-semibold text-slate-700">H.K Tech</strong>, A company by <strong className="font-semibold text-slate-700">Haroon Kibriya</strong>
                </p>
                <a
                  href="https://wa.me/923129223127"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-teal-600 hover:text-teal-700 font-semibold"
                >
                  Whatsapp +923129223127
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Registration / Edit Modal */}
      {showPatientForm && (
        <PatientForm
          patient={editingPatient}
          onSave={(pat) => {
            setShowPatientForm(false);
            setEditingPatient(null);
            refreshAllData();
            setSelectedPatient(pat);
          }}
          onClose={() => {
            setShowPatientForm(false);
            setEditingPatient(null);
          }}
          isUrdu={isUrdu}
          currentUser={currentUserName}
        />
      )}

      {/* Prescription Editor Modal */}
      {showPrescriptionEditor && (
        <PrescriptionEditor
          prescription={editingPrescription}
          patient={selectedPatient}
          patients={patients}
          settings={settings}
          onSave={(savedRx) => {
            setShowPrescriptionEditor(false);
            setEditingPrescription(null);
            refreshAllData();
            setViewingPrescription(savedRx);
          }}
          onClose={() => {
            setShowPrescriptionEditor(false);
            setEditingPrescription(null);
          }}
          isUrdu={isUrdu}
          currentUser={currentUserName}
        />
      )}

      {/* Fee & Procedure Receipt Editor Modal */}
      {showReceiptEditor && (
        <ReceiptEditor
          initialType={receiptEditorType}
          patient={selectedPatient}
          patients={patients}
          settings={settings}
          onSaveFee={(savedFee) => {
            setShowReceiptEditor(false);
            refreshAllData();
            setPrintReceiptData({ receipt: savedFee, type: 'fee' });
          }}
          onSaveProcedure={(savedProc) => {
            setShowReceiptEditor(false);
            refreshAllData();
            setPrintReceiptData({ receipt: savedProc, type: 'procedure' });
          }}
          onClose={() => setShowReceiptEditor(false)}
          isUrdu={isUrdu}
          currentUser={currentUserName}
        />
      )}

      {/* Digital Receipt Print Modal */}
      {printReceiptData && (
        <ReceiptPrintModal
          receipt={printReceiptData.receipt}
          type={printReceiptData.type}
          settings={settings}
          onClose={() => setPrintReceiptData(null)}
          isUrdu={isUrdu}
        />
      )}

      {/* Role Switcher Modal */}
      {showRoleModal && (
        <LoginModal
          currentRole={currentRole}
          currentPatientId={activePatientId}
          patients={patients}
          onSelectRole={handleRoleChange}
          onClose={() => setShowRoleModal(false)}
          isUrdu={isUrdu}
        />
      )}

      {/* Online & Offline Sync Center Modal */}
      <OnlineOfflineSyncModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        isUrdu={isUrdu}
        currentUser={currentUserName}
        onSyncComplete={refreshAllData}
      />
    </div>
  );
}
