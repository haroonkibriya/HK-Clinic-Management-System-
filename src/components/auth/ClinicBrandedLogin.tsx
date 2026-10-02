import React, { useState } from 'react';
import {
  ShieldCheck,
  Stethoscope,
  Lock,
  User,
  Eye,
  EyeOff,
  Languages,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  KeyRound,
  Building,
  HelpCircle,
  X,
  HeartPulse,
} from 'lucide-react';
import { ClinicSettings, Patient, UserRole } from '../../types';
import { AuthService, AppUserSession } from '../../services/authService';

interface ClinicBrandedLoginProps {
  settings: ClinicSettings;
  isUrdu: boolean;
  onLoginSuccess: (session: AppUserSession) => void;
  onToggleLanguage: () => void;
  onOpenPatientSelfService?: (patient: Patient) => void;
}

export const ClinicBrandedLogin: React.FC<ClinicBrandedLoginProps> = ({
  settings,
  isUrdu,
  onLoginSuccess,
  onToggleLanguage,
  onOpenPatientSelfService,
}) => {
  // Login Form States
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);

  // Patient registration / fast login state
  const [patientIdentifier, setPatientIdentifier] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientError, setPatientError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = AuthService.authenticate(username, password, rememberMe, settings);

    if (result.success && result.session) {
      onLoginSuccess(result.session);
    } else {
      setErrorMessage(
        isUrdu
          ? 'صارف نام یا پاس ورڈ درست نہیں ہے۔'
          : result.error || 'Invalid username or password.'
      );
    }
    setIsSubmitting(false);
  };

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPatientError(null);
    const cleanId = patientIdentifier.trim();
    if (!cleanId) {
      setPatientError(isUrdu ? 'براہِ کرم موبائل نمبر درج کریں۔' : 'Please enter your mobile phone number.');
      return;
    }

    const patient = AuthService.findOrCreatePatient({
      identifier: cleanId,
      name: patientName.trim() || undefined,
    });

    const session: AppUserSession = {
      role: 'patient',
      name: patient.name,
      patientId: patient.id,
      identifier: cleanId,
      isLoggedIn: true,
    };

    if (rememberMe) {
      AuthService.saveSession(session);
    }

    setShowPatientModal(false);
    if (onOpenPatientSelfService) {
      onOpenPatientSelfService(patient);
    } else {
      onLoginSuccess(session);
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-between bg-slate-900 text-slate-100 font-sans selection:bg-teal-500 selection:text-white ${
        isUrdu ? 'rtl' : 'ltr'
      }`}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Top Application Header Bar */}
      <header className="w-full bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm ring-2 ring-teal-400/30">
            HK
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-white tracking-wide flex items-center gap-2">
              <span>HK Clinic Management System</span>
              <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800">
                Official Healthcare Suite
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              {isUrdu ? 'ایچ کے کلینک مینجمنٹ سسٹم' : 'Clinical Records & Administration Portal'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleLanguage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            title="Switch Language (English / Urdu)"
          >
            <Languages className="w-3.5 h-3.5 text-teal-400" />
            <span>{isUrdu ? 'English' : 'اردو'}</span>
          </button>
        </div>
      </header>

      {/* Main Center Body: Professional Medical Login & Branding Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-4xl bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Prominent Application Branding Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-teal-900 via-teal-950 to-slate-950 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-teal-800/40 relative overflow-hidden">
            {/* Subtle background hospital cross watermark */}
            <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none text-white">
              <Stethoscope className="w-64 h-64" />
            </div>

            <div className="relative z-10 space-y-6">
              {/* Official Clinic Shield Logo */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white text-teal-900 flex items-center justify-center font-black text-2xl shadow-lg border-2 border-teal-300/40">
                  HK
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-teal-300 block">
                    {isUrdu ? 'سرکاری نظامِ ہسپتال' : 'CLINICAL EMR SYSTEM'}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    Version 2.0 • Offline Ready
                  </span>
                </div>
              </div>

              {/* Prominent App Name */}
              <div className="space-y-2 pt-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                  HK Clinic Management System
                </h2>
                <p className="text-xs sm:text-sm text-teal-200/90 leading-relaxed font-medium">
                  {isUrdu
                    ? 'ڈاکٹر کنسلٹیشن، مریضوں کا مکمل ریکارڈ، ڈیجیٹل نسخہ نویسی اور فیس رسیدوں کا مستند میڈیکل سافٹ ویئر'
                    : 'The unified clinical management suite for patient records, electronic prescriptions, appointment scheduling, and financial accounting.'}
                </p>
              </div>

              {/* Doctor Profile Summary */}
              <div className="bg-teal-950/80 border border-teal-700/50 rounded-2xl p-3.5 space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="font-bold text-white text-sm">
                    {isUrdu ? settings.doctorNameUrdu || 'ڈاکٹر ہارون کبریا' : settings.doctorName}
                  </span>
                </div>
                <p className="text-[11px] text-teal-200 font-medium pl-6">
                  {settings.doctorQualification}
                </p>
                <p className="text-[10px] text-teal-300/80 pl-6">
                  {settings.doctorSpecialty} • Reg: {settings.registrationNumber}
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Offline Independent & Local Storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Secure Role-Based Access Isolation</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Bilingual Nastaliq Urdu & English Letterheads</span>
                </div>
              </div>
            </div>

            {/* Clinic Contact Details at bottom */}
            <div className="pt-6 mt-6 border-t border-teal-800/40 text-[11px] text-teal-200/80 space-y-1 relative z-10">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="truncate">{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>{settings.phone}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean, Medical Login Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-slate-900/90">
            <div className="max-w-md w-full mx-auto space-y-6">
              {/* Form Title */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                  {isUrdu ? 'محفوظ داخلہ' : 'Authorized Access'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  {isUrdu ? 'سسٹم میں لاگ ان کریں' : 'Sign In to Your Account'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isUrdu
                    ? 'ایچ کے کلینک مینجمنٹ سسٹم کے ڈیش بورڈ تک رسائی کے لیے اپنی اسناد درج کریں۔'
                    : 'Enter your clinic credentials to open the HK Clinic Management System dashboard.'}
                </p>
              </div>

              {/* Error Message Display */}
              {errorMessage && (
                <div
                  role="alert"
                  className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/80 text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-150"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-semibold">{errorMessage}</span>
                </div>
              )}

              {/* Main Login Form */}
              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                {/* Field 1: Username */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isUrdu ? 'صارف نام (Username)' : 'Username'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={isUrdu ? 'صارف نام درج کریں (مثلاً admin)' : 'Enter username (e.g. admin)'}
                      required
                      autoComplete="username"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl py-2.5 pl-10 pr-3 text-xs sm:text-sm text-white placeholder:text-slate-500 font-medium transition"
                    />
                  </div>
                </div>

                {/* Field 2: Password with Show/Hide Button */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      {isUrdu ? 'پاس ورڈ (Password)' : 'Password'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] font-semibold text-teal-400 hover:text-teal-300 hover:underline transition"
                    >
                      {isUrdu ? 'پاس ورڈ بھول گئے؟' : 'Forgot Password?'}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isUrdu ? 'پاس ورڈ درج کریں' : 'Enter password'}
                      required
                      autoComplete="current-password"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl py-2.5 pl-10 pr-10 text-xs sm:text-sm text-white placeholder:text-slate-500 font-mono transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition"
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 text-xs">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-teal-600 focus:ring-teal-500 focus:ring-offset-slate-900"
                    />
                    <span>{isUrdu ? 'مجھے یاد رکھیں' : 'Remember Me'}</span>
                  </label>

                  <span className="text-[11px] text-slate-500">
                    Offline encrypted session
                  </span>
                </div>

                {/* Submit / Login Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 active:scale-98 text-white font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4 text-teal-200" />
                    <span>
                      {isUrdu
                        ? 'ایچ کے کلینک مینجمنٹ سسٹم لاگ ان'
                        : 'Sign In to HK Clinic Management System'}
                    </span>
                  </button>
                </div>
              </form>

              {/* Quick Login Role Helpers (For seamless testing & role activation) */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
                  {isUrdu ? 'فوری کردار کا انتخاب' : 'Quick Access Credentials (Pre-fill)'}
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUsername('admin');
                      setPassword(settings.adminPassword || 'admin123');
                    }}
                    className="py-1.5 px-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-lg text-[11px] font-medium border border-slate-700/60 transition flex items-center justify-center gap-1.5"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                    <span>Doctor / Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUsername('assistant');
                      setPassword(settings.adminPassword || 'admin123');
                    }}
                    className="py-1.5 px-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-lg text-[11px] font-medium border border-slate-700/60 transition flex items-center justify-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-sky-400" />
                    <span>Clinic Assistant</span>
                  </button>
                </div>
              </div>

              {/* Secondary Option: Patient Portal Access */}
              <div className="p-3 bg-teal-950/40 rounded-2xl border border-teal-800/40 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">
                    {isUrdu ? 'مریض پورٹل' : 'Looking for Patient Portal?'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isUrdu
                      ? 'ڈاکٹر اپائنٹمنٹ بکنگ اور نسخہ جات دیکھنے کے لیے'
                      : 'Book doctor appointment & view prescriptions'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPatientModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-teal-600/80 hover:bg-teal-600 text-white font-bold text-xs shadow-xs transition"
                >
                  {isUrdu ? 'مریض پورٹل' : 'Patient Portal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="w-full bg-slate-950/80 border-t border-slate-800/80 px-4 py-3 text-center text-xs text-slate-500">
        <p>
          <strong className="text-slate-300">HK Clinic Management System</strong> • Professional EMR & Clinical Suite for {settings.doctorName}
        </p>
        <p className="text-[11px] text-slate-600 mt-0.5">
          Developed by <strong>H.K Tech</strong> • {settings.address} • {settings.phone}
        </p>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-teal-400" />
                <h4 className="font-extrabold text-base text-white">
                  {isUrdu ? 'پاس ورڈ بحالی و معلومات' : 'Administration Password Assistance'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isUrdu
                ? 'ایچ کے کلینک مینجمنٹ سسٹم کے ڈیفالٹ لاگ ان اسناد درج ذیل ہیں:'
                : 'The default credentials configured for HK Clinic Management System are:'}
            </p>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 font-mono text-xs space-y-2 text-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor Username:</span>
                <span className="font-bold text-teal-300">admin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Staff Username:</span>
                <span className="font-bold text-sky-300">assistant</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1.5">
                <span className="text-slate-500">Default Password:</span>
                <span className="font-bold text-emerald-400">admin123</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              You can change this password anytime in <strong>Settings & Backup &rarr; Clinic Settings &rarr; App Administration Password</strong>.
            </p>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setUsername('admin');
                  setPassword('admin123');
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs transition"
              >
                Use Default & Auto-Fill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Fast Login Modal */}
      {showPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-teal-400" />
                <h4 className="font-extrabold text-base text-white">
                  {isUrdu ? 'مریض پورٹل داخلہ' : 'Patient Self-Service Access'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowPatientModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {patientError && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/80 text-rose-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{patientError}</span>
              </div>
            )}

            <form onSubmit={handlePatientSubmit} className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {isUrdu ? 'موبائل نمبر یا جی میل' : 'Mobile Number or Gmail'}
                </label>
                <input
                  type="text"
                  value={patientIdentifier}
                  onChange={(e) => setPatientIdentifier(e.target.value)}
                  placeholder="0300 1234567 or email@gmail.com"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {isUrdu ? 'مریض کا نام (پہلی بار رجسٹریشن کے لیے)' : 'Patient Full Name (For new registration)'}
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Muhammad Usman"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPatientModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition shadow-sm"
                >
                  Open Patient Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
