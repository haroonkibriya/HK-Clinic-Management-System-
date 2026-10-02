import React, { useState } from 'react';
import {
  User,
  KeyRound,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  Languages,
  CheckCircle2,
} from 'lucide-react';
import { ClinicSettings, Patient, UserRole } from '../../types';
import { AuthService } from '../../services/authService';

interface MobileBrandedLoginViewProps {
  settings: ClinicSettings;
  isUrdu: boolean;
  onLoginAdmin: (adminName: string, role: UserRole) => void;
  onLoginPatient: (patient: Patient) => void;
  onToggleLanguage: () => void;
}

export const MobileBrandedLoginView: React.FC<MobileBrandedLoginViewProps> = ({
  settings,
  isUrdu,
  onLoginAdmin,
  onLoginPatient,
  onToggleLanguage,
}) => {
  // Tab: 'patient' or 'admin'
  const [selectedPortal, setSelectedPortal] = useState<'patient' | 'admin'>('patient');

  // Patient inputs
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientError, setPatientError] = useState<string | null>(null);

  // Admin inputs
  const [adminUser, setAdminUser] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminRole, setAdminRole] = useState<'doctor' | 'assistant'>('doctor');
  const [adminError, setAdminError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Handle Patient Submission
  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPatientError(null);

    const clean = patientId.trim();
    if (!clean) {
      setPatientError(
        isUrdu
          ? 'برائے مہربانی موبائل نمبر یا جی میل درج کریں'
          : 'Please enter your Mobile number or Gmail address'
      );
      return;
    }

    const patient = AuthService.findOrCreatePatient({
      identifier: clean,
      name: patientName.trim() || undefined,
    });

    AuthService.saveSession({
      role: 'patient',
      name: patient.name,
      patientId: patient.id,
      identifier: clean,
      isLoggedIn: true,
    });

    onLoginPatient(patient);
  };

  // Handle Admin Submission
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    if (!adminPassword.trim()) {
      setAdminError(
        isUrdu ? 'برائے مہربانی ایڈمن پاس ورڈ درج کریں' : 'Please enter the administration password'
      );
      return;
    }

    const isValid = AuthService.verifyAdminPassword(adminPassword, settings);
    if (!isValid) {
      setAdminError(
        isUrdu
          ? 'پاس ورڈ غلط ہے! (ڈیفالٹ پاس ورڈ: admin123)'
          : 'Incorrect password! (Default password is: admin123)'
      );
      return;
    }

    const name =
      adminUser.trim() ||
      (adminRole === 'doctor' ? settings.doctorName || 'Dr. Haroon Kibriya' : 'Clinic Assistant (Staff)');

    AuthService.saveSession({
      role: adminRole,
      name,
      identifier: adminUser.trim() || undefined,
      isLoggedIn: true,
    });

    onLoginAdmin(name, adminRole);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-gradient-to-b from-teal-900 via-teal-800 to-slate-900 text-white p-4 sm:p-6 select-none">
      {/* Top Bar with Language Toggle */}
      <div className="w-full max-w-sm flex items-center justify-between pt-2">
        <span className="text-[11px] font-bold tracking-wider text-teal-200 uppercase bg-teal-950/60 px-3 py-1 rounded-full border border-teal-700/50">
          HK Clinic Mobile App
        </span>
        <button
          onClick={onToggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold backdrop-blur-xs transition border border-white/20"
        >
          <Languages className="w-3.5 h-3.5 text-teal-300" />
          <span>{isUrdu ? 'English' : 'اردو'}</span>
        </button>
      </div>

      {/* Main Login Card (Styled closely inspired by the reference screenshot) */}
      <div className="w-full max-w-sm my-auto py-6 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-white text-teal-900 flex items-center justify-center font-black text-3xl shadow-2xl border-4 border-teal-400/40 transform hover:scale-105 transition">
            HK
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {isUrdu ? settings.clinicNameUrdu || 'ایچ کے کلینک' : settings.clinicName}
          </h1>
          <p className="text-xs text-teal-200 font-medium">
            {isUrdu ? settings.doctorNameUrdu || 'ڈاکٹر ہارون کبریا' : settings.doctorName} •{' '}
            {settings.doctorQualification}
          </p>
        </div>

        {/* Portal Selection Tabs (Patient vs Administration) */}
        <div className="grid grid-cols-2 p-1.5 bg-teal-950/80 rounded-2xl border border-teal-700/50 shadow-inner text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setSelectedPortal('patient');
              setPatientError(null);
            }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              selectedPortal === 'patient'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-teal-200 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{isUrdu ? 'مریض پورٹل' : 'Patient'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedPortal('admin');
              setAdminError(null);
            }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              selectedPortal === 'admin'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-teal-200 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isUrdu ? 'انتظامیہ / ایڈمن' : 'Administration'}</span>
          </button>
        </div>

        {/* FORM 1: PATIENT PORTAL LOGIN */}
        {selectedPortal === 'patient' && (
          <form onSubmit={handlePatientSubmit} className="space-y-4 animate-in fade-in duration-200">
            {patientError && (
              <div className="p-3 bg-rose-500/20 border border-rose-400 text-rose-100 rounded-2xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
                <span>{patientError}</span>
              </div>
            )}

            {/* Input 1: Mobile / Gmail (White card matching screenshot) */}
            <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200 flex items-center px-4 py-3">
              <User className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder={
                  isUrdu
                    ? 'موبائل نمبر یا جی میل (0300...)'
                    : 'Mobile Number or Gmail'
                }
                required
                className="w-full pl-3 text-sm font-semibold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            {/* Input 2: Full Name (Optional for instant self-registration) */}
            <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200 flex items-center px-4 py-3">
              <KeyRound className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder={
                  isUrdu
                    ? 'مریض کا نام (پہلی بار رجسٹریشن کے لیے)'
                    : 'Patient Full Name (For new registration)'
                }
                className="w-full pl-3 text-sm font-semibold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            {/* Big Action Button (Matching screenshot button style) */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-98 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-xl transition flex items-center justify-center gap-2 border border-emerald-300/30"
            >
              <span>{isUrdu ? 'مریض پورٹل میں داخل ہوں' : 'Enter Patient Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-[11px] text-teal-200/80">
              {isUrdu
                ? 'اپائنٹمنٹ بک کریں، کلینک لوکیشن، اور اپنے تمام نسخہ جات دیکھیں'
                : 'Book doctor appointments, check clinic address, and view prescriptions.'}
            </p>
          </form>
        )}

        {/* FORM 2: ADMINISTRATION LOGIN */}
        {selectedPortal === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4 animate-in fade-in duration-200">
            {adminError && (
              <div className="p-3 bg-rose-500/20 border border-rose-400 text-rose-100 rounded-2xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
                <span>{adminError}</span>
              </div>
            )}

            {/* Role Selector: Doctor vs Clinic Assistant */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAdminRole('doctor')}
                className={`py-2 px-3 rounded-xl border transition flex items-center justify-center gap-1.5 ${
                  adminRole === 'doctor'
                    ? 'bg-white/20 border-white text-white font-bold'
                    : 'bg-white/5 border-white/10 text-teal-200 hover:bg-white/10'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'ڈاکٹر ایڈمن' : 'Doctor / Admin'}</span>
              </button>

              <button
                type="button"
                onClick={() => setAdminRole('assistant')}
                className={`py-2 px-3 rounded-xl border transition flex items-center justify-center gap-1.5 ${
                  adminRole === 'assistant'
                    ? 'bg-white/20 border-white text-white font-bold'
                    : 'bg-white/5 border-white/10 text-teal-200 hover:bg-white/10'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'کلینک عملہ' : 'Clinic Assistant'}</span>
              </button>
            </div>

            {/* Input 1: Doctor/Admin Identifier (Mobile or Gmail) */}
            <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200 flex items-center px-4 py-3">
              <User className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                placeholder={
                  isUrdu ? 'ڈاکٹر موبائل نمبر یا جی میل' : 'Doctor / Staff Mobile or Gmail'
                }
                className="w-full pl-3 text-sm font-semibold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            {/* Input 2: Password (Matching screenshot key field) */}
            <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200 flex items-center px-4 py-3">
              <KeyRound className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder={isUrdu ? 'ایڈمنسٹریشن پاس ورڈ' : 'Administration Password'}
                required
                className="w-full pl-3 text-sm font-semibold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400 placeholder:font-normal font-mono"
              />
            </div>

            {/* Big Action Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 active:scale-98 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-xl transition flex items-center justify-center gap-2 border border-teal-300/30"
            >
              <span>
                {isUrdu
                  ? adminRole === 'doctor'
                    ? 'ڈاکٹر ایڈمن لاگ ان'
                    : 'اسسٹنٹ لاگ ان'
                  : `Login as ${adminRole === 'doctor' ? 'Administrator' : 'Clinic Assistant'}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Password Hint / Assistance */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-teal-300 hover:text-white underline"
              >
                {isUrdu ? 'پاس ورڈ بھول گئے؟ (ڈیفالٹ پاس ورڈ)' : 'Forgot Password? (Default Hint)'}
              </button>
              {showHint && (
                <div className="mt-2 p-2 bg-teal-950/90 border border-teal-600 rounded-xl text-xs text-teal-200">
                  Default App Administration Password: <strong className="text-white font-mono">admin123</strong>
                </div>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Bottom Direct Contact & Clinic Info Footer Bar */}
      <div className="w-full max-w-sm pb-2 pt-4 border-t border-teal-700/40 text-xs">
        <span className="text-[10px] uppercase font-bold tracking-wider text-teal-300 block text-center mb-2.5">
          {isUrdu ? 'براہِ راست کلینک معلومات اور رابطہ' : 'Direct Clinic Location & Instant Contact'}
        </span>

        <div className="grid grid-cols-3 gap-2">
          {/* Direct Phone Call */}
          <a
            href={`tel:${settings.phone}`}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 transition text-center"
            title="Call Clinic"
          >
            <Phone className="w-4 h-4 text-teal-300 mb-1" />
            <span className="text-[10px] font-bold text-white">{isUrdu ? 'کال کریں' : 'Call'}</span>
          </a>

          {/* WhatsApp Direct */}
          <a
            href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              'Assalamu Alaikum Dr. Haroon, I would like to inquire about an appointment.'
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-emerald-600/60 hover:bg-emerald-600 active:scale-95 border border-emerald-400/40 transition text-center"
            title="WhatsApp Dr. Haroon"
          >
            <MessageCircle className="w-4 h-4 text-emerald-200 mb-1" />
            <span className="text-[10px] font-bold text-white">WhatsApp</span>
          </a>

          {/* Google Maps Location */}
          <a
            href={settings.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-rose-600/50 hover:bg-rose-600 active:scale-95 border border-rose-400/40 transition text-center"
            title="Open Clinic in Google Maps"
          >
            <MapPin className="w-4 h-4 text-rose-200 mb-1" />
            <span className="text-[10px] font-bold text-white">{isUrdu ? 'نقشہ / لوکیشن' : 'Maps'}</span>
          </a>
        </div>

        <div className="mt-3 text-center text-[10px] text-teal-300/80 leading-relaxed">
          <p>{settings.address}</p>
          <p className="mt-0.5 font-medium">
            {isUrdu
              ? settings.clinicTimingsUrdu || 'پیر تا ہفتہ: شام 5:00 تا رات 9:00 بجے'
              : settings.clinicTimings || 'Mon - Sat: 5:00 PM - 9:00 PM'}
          </p>
        </div>
      </div>
    </div>
  );
};
