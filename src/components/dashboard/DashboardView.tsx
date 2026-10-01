import React from 'react';
import {
  Users,
  FileSignature,
  Receipt,
  Calendar,
  DollarSign,
  TrendingUp,
  UserPlus,
  Clock,
  ArrowRight,
  Phone,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Building,
  RefreshCw,
  Cloud,
  WifiOff,
} from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import {
  Patient,
  Prescription,
  FeeReceipt,
  ProcedureReceipt,
  Appointment,
  ClinicSettings,
  UserRole,
} from '../../types';

interface DashboardViewProps {
  patients: Patient[];
  prescriptions: Prescription[];
  feeReceipts: FeeReceipt[];
  procedureReceipts: ProcedureReceipt[];
  appointments: Appointment[];
  settings: ClinicSettings;
  onNavigate: (tab: any) => void;
  onNewPatient: () => void;
  onNewPrescription: (patient?: Patient) => void;
  onNewReceipt: (patient?: Patient) => void;
  onOpenSync?: () => void;
  isUrdu: boolean;
  role: UserRole;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  prescriptions,
  feeReceipts,
  procedureReceipts,
  appointments,
  settings,
  onNavigate,
  onNewPatient,
  onNewPrescription,
  onNewReceipt,
  onOpenSync,
  isUrdu,
  role,
}) => {
  const isOnline = useOnlineStatus();
  const today = new Date().toISOString().split('T')[0];

  // Daily metrics
  const todayAppointments = appointments.filter((a) => a.date === today);
  const todayPrescriptions = prescriptions.filter((r) => r.date === today);
  const todayFeeReceipts = feeReceipts.filter((r) => r.date === today);
  const todayProcedureReceipts = procedureReceipts.filter((r) => r.date === today);

  const todayRevenue =
    todayFeeReceipts.reduce((sum, r) => sum + r.paidAmount, 0) +
    todayProcedureReceipts.reduce((sum, r) => sum + r.paidAmount, 0);

  const totalPendingBalance =
    feeReceipts.reduce((sum, r) => sum + r.balance, 0) +
    procedureReceipts.reduce((sum, r) => sum + r.balance, 0);

  const recentPatients = patients.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Clinic Welcome & Direct Contact Quick Action Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 text-white rounded-3xl p-4 sm:p-5 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={onOpenSync}
                className="inline-flex items-center gap-1.5 bg-teal-900/60 hover:bg-teal-900 active:scale-95 text-teal-100 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-teal-500/40 transition"
                title="Open Online & Offline Sync Center"
              >
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>
                  {isOnline
                    ? isUrdu
                      ? 'آن لائن موڈ • کلاؤڈ سنک'
                      : 'Online • Cloud Sync'
                    : isUrdu
                    ? 'آف لائن موڈ • لوکل ڈیٹا بیس'
                    : 'Offline • Local DB'}
                </span>
              </button>
              <span className="text-teal-200 text-xs">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1 leading-tight tracking-tight">
              {settings.clinicName}
            </h1>
            <p className="text-xs text-teal-100 mt-0.5">
              {settings.doctorName} • {settings.doctorQualification}
            </p>
          </div>

          {/* Direct Contact Buttons (PRD Section 21: Direct Contact Call, WhatsApp, Google Maps) */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-xs rounded-xl text-xs font-semibold border border-white/20 transition"
              title="Direct Phone Call"
            >
              <Phone className="w-3.5 h-3.5 text-teal-200" />
              <span>{isUrdu ? 'کلینک کال' : 'Call Clinic'}</span>
            </a>

            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600/90 hover:bg-emerald-500 active:scale-95 rounded-xl text-xs font-semibold shadow-sm transition"
              title="Open WhatsApp Chat"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 active:scale-95 rounded-xl text-xs font-semibold border border-white/20 transition"
              title="Open in Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-300" />
              <span>{isUrdu ? 'نقشہ / لوکیشن' : 'Google Maps'}</span>
            </a>

            {onOpenSync && (
              <button
                onClick={onOpenSync}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 active:scale-95 rounded-xl text-xs font-semibold border border-white/20 transition"
                title="Online & Offline Sync Center"
              >
                {isOnline ? (
                  <Cloud className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-amber-300" />
                )}
                <span>{isUrdu ? 'سنک سینٹر' : 'Sync Center'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/5 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* KPI Stats Cards (PRD Section 25) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Patients */}
        <div
          onClick={() => onNavigate('patients')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isUrdu ? 'کل مریض' : 'Total Patients'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900 font-mono">{patients.length}</div>
            <span className="text-[10px] text-teal-700 font-semibold">Registered in database</span>
          </div>
        </div>

        {/* Today's Appointments */}
        <div
          onClick={() => onNavigate('appointments')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isUrdu ? 'آج کی اپائنٹمنٹس' : "Today's Visits"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900 font-mono">
              {todayAppointments.length}
            </div>
            <span className="text-[10px] text-sky-700 font-semibold">Scheduled for today</span>
          </div>
        </div>

        {/* Today's Prescriptions */}
        <div
          onClick={() => onNavigate('prescriptions')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isUrdu ? 'آج کے نسخہ جات' : "Today's Rx"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <FileSignature className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900 font-mono">
              {todayPrescriptions.length}
            </div>
            <span className="text-[10px] text-indigo-700 font-semibold">Issued today</span>
          </div>
        </div>

        {/* Today's Revenue */}
        <div
          onClick={() => onNavigate('receipts')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isUrdu ? 'آج کی آمدن' : "Today's Revenue"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-emerald-800 font-mono">
              {todayRevenue.toLocaleString()} <span className="text-xs">{settings.currency}</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">Collected today</span>
          </div>
        </div>
      </div>

      {/* Quick Fast Actions Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 flex-wrap">
        <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
          {isUrdu ? 'فوری اقدامات' : 'Quick Actions'}
        </span>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onNewPatient}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isUrdu ? 'نیا مریض درج کریں' : 'Register Patient'}</span>
          </button>

          {role === 'doctor' && (
            <button
              onClick={() => onNewPrescription()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-semibold transition"
            >
              <FileSignature className="w-4 h-4" />
              <span>{isUrdu ? 'نیا نسخہ لکھیں' : 'Write Rx'}</span>
            </button>
          )}

          <button
            onClick={() => onNewReceipt()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition"
          >
            <Receipt className="w-4 h-4" />
            <span>{isUrdu ? 'فیس رسید جاری کریں' : 'Issue Receipt'}</span>
          </button>
        </div>
      </div>

      {/* Two Column Grid: Upcoming Consultations & Recent Patients */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's Appointments Schedule */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>{isUrdu ? 'آج کی اپائنٹمنٹس کا شیڈول' : "Today's Schedule"}</span>
            </h2>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-xs text-teal-700 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayAppointments.length === 0 ? (
            <p className="text-xs text-slate-400 p-4 text-center">
              No appointments scheduled for today.
            </p>
          ) : (
            <div className="space-y-2">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-teal-50/60 transition flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{apt.patientName}</span>
                    <p className="text-[11px] text-slate-500">
                      {apt.type} • {apt.reason || 'Checkup'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200 block text-[11px]">
                      {apt.timeSlot}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase mt-0.5 inline-block ${
                        apt.status === 'Confirmed' ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Registered Patients */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-600" />
              <span>{isUrdu ? 'حالیہ مریض' : 'Recently Registered Patients'}</span>
            </h2>
            <button
              onClick={() => onNavigate('patients')}
              className="text-xs text-teal-700 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {recentPatients.map((pat) => (
              <div
                key={pat.id}
                onClick={() => onNavigate('patients')}
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-teal-50/60 transition flex items-center justify-between text-xs cursor-pointer"
              >
                <div>
                  <span className="font-bold text-slate-900">{pat.name}</span>
                  <p className="text-[11px] text-slate-500">
                    {pat.age}y {pat.gender} • Ph: {pat.phone}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-teal-700 text-xs">
                    {pat.mrNumber}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(pat.registrationDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
