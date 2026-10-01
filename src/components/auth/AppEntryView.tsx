import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  Stethoscope,
  Lock,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Calendar,
  Mail,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Building,
} from 'lucide-react';
import { ClinicSettings, Patient } from '../../types';
import { AuthService } from '../../services/authService';

interface AppEntryViewProps {
  settings: ClinicSettings;
  isUrdu: boolean;
  onEnterAsAdmin: (adminName: string) => void;
  onEnterAsPatient: (patient: Patient) => void;
  onToggleLanguage: () => void;
}

export const AppEntryView: React.FC<AppEntryViewProps> = ({
  settings,
  isUrdu,
  onEnterAsAdmin,
  onEnterAsPatient,
  onToggleLanguage,
}) => {
  const [activeMode, setActiveMode] = useState<'select' | 'patient_login' | 'admin_login'>('select');

  // Patient Login / Register Form State
  const [patientLoginType, setPatientLoginType] = useState<'mobile' | 'gmail'>('mobile');
  const [patientIdentifier, setPatientIdentifier] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>(28);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [patientCity, setPatientCity] = useState('Lahore');
  const [patientError, setPatientError] = useState<string | null>(null);

  // Admin Login State
  const [adminIdentifier, setAdminIdentifier] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPatientError(null);

    const cleanId = patientIdentifier.trim();
    if (!cleanId) {
      setPatientError(
        patientLoginType === 'mobile'
          ? isUrdu
            ? 'برائے مہربانی موبائل نمبر درج کریں'
            : 'Please enter your mobile phone number'
          : isUrdu
          ? 'برائے مہربانی جی میل / ای میل ایڈریس درج کریں'
          : 'Please enter your Gmail / Email address'
      );
      return;
    }

    if (patientLoginType === 'gmail' && !cleanId.includes('@')) {
      setPatientError(isUrdu ? 'درست جی میل درج کریں (مثال: name@gmail.com)' : 'Please enter a valid Gmail address (e.g. name@gmail.com)');
      return;
    }

    const patient = AuthService.findOrCreatePatient({
      identifier: cleanId,
      name: patientName.trim() || undefined,
      age: typeof patientAge === 'number' ? patientAge : undefined,
      gender: patientGender,
      city: patientCity.trim() || undefined,
    });

    onEnterAsPatient(patient);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    if (!adminPassword) {
      setAdminError(isUrdu ? 'برائے مہربانی ایڈمن پاس ورڈ درج کریں' : 'Please enter the Administration Password');
      return;
    }

    const isValid = AuthService.verifyAdminPassword(adminPassword, settings);
    if (!isValid) {
      setAdminError(
        isUrdu
          ? 'غلط پاس ورڈ! برائے مہربانی درست پاس ورڈ درج کریں (ڈیفالٹ: admin123)'
          : 'Incorrect password! Please enter the correct clinic password (Default: admin123)'
      );
      return;
    }

    const name = adminIdentifier.trim() || settings.doctorName || 'Dr. Haroon Kibriya';
    onEnterAsAdmin(name);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden my-4">
      {/* Top Clinic Branding Header */}
      <div className="bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-800 text-white p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-teal-800 flex items-center justify-center font-black text-xl shadow-md border-2 border-teal-200/50">
              HK
            </div>
            <div>
              <h1 className="font-black text-lg sm:text-xl leading-tight">
                {isUrdu ? settings.clinicNameUrdu || 'ایچ کے کلینک' : settings.clinicName}
              </h1>
              <p className="text-xs text-teal-100 mt-0.5">
                {isUrdu ? settings.doctorNameUrdu || 'ڈاکٹر ہارون کبریا' : settings.doctorName}
              </p>
            </div>
          </div>

          <button
            onClick={onToggleLanguage}
            className="px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-xs font-semibold backdrop-blur-xs transition"
          >
            {isUrdu ? 'English' : 'اردو'}
          </button>
        </div>

        <p className="text-xs text-teal-100/90 leading-relaxed">
          {isUrdu
            ? 'کلینک مینجمنٹ سسٹم میں خوش آمدید۔ جاری رکھنے کے لیے اپنے مطلوبہ پورٹل کا انتخاب کریں:'
            : 'Welcome to Clinic Healthcare Portal. Please select your portal to proceed:'}
        </p>
      </div>

      {/* Mode 1: Main Choice (Patient vs Administration) */}
      {activeMode === 'select' && (
        <div className="p-6 space-y-5">
          <div className="space-y-4">
            {/* OPTION 1: PATIENT PORTAL */}
            <div
              onClick={() => setActiveMode('patient_login')}
              className="p-5 rounded-2xl border-2 border-teal-200 bg-gradient-to-r from-teal-50/70 to-emerald-50/50 hover:border-teal-500 hover:shadow-md transition cursor-pointer group flex items-center justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0 group-hover:scale-105 transition">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-black text-base text-teal-950">
                      {isUrdu ? 'مریض پورٹل' : 'Patient Portal'}
                    </h2>
                    <span className="bg-teal-200/80 text-teal-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {isUrdu ? 'مریضوں کے لیے' : 'For Patients'}
                    </span>
                  </div>
                  <p className="text-xs text-teal-800 mt-1 leading-relaxed">
                    {isUrdu
                      ? 'ڈاکٹر اپائنٹمنٹ بکنگ، کلینک لوکیشن، نقشہ، واٹس ایپ رابطہ اور ڈیجیٹل نسخہ جات'
                      : 'Book Dr. appointment, clinic address, WhatsApp chat, and view your digital prescriptions.'}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-teal-600 shrink-0 group-hover:translate-x-1 transition ml-2" />
            </div>

            {/* OPTION 2: ADMINISTRATION / DOCTOR */}
            <div
              onClick={() => setActiveMode('admin_login')}
              className="p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-r from-slate-50 to-teal-50/30 hover:border-slate-400 hover:shadow-md transition cursor-pointer group flex items-center justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-bold shadow-sm shrink-0 group-hover:scale-105 transition">
                  <Stethoscope className="w-6 h-6 text-teal-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-black text-base text-slate-900">
                      {isUrdu ? 'انتظامیہ / ڈاکٹر لاگ ان' : 'Administration & Doctor'}
                    </h2>
                    <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {isUrdu ? 'مکمل کنٹرول' : 'Full Control'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {isUrdu
                      ? 'مریضوں کا اندراج، نسخہ نویسی، فیس رسیدیں، رپورٹیں اور کلینک سیٹنگز'
                      : 'Full clinic management: patient registry, prescriptions, fee receipts, reports & settings.'}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-700 shrink-0 group-hover:translate-x-1 transition ml-2" />
            </div>
          </div>

          {/* Direct Quick Actions for Patients & Visitors */}
          <div className="pt-4 border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
              {isUrdu ? 'براہِ راست کلینک معلومات اور رابطہ' : 'Direct Clinic Information & Quick Contact:'}
            </span>

            <div className="grid grid-cols-3 gap-2">
              <a
                href={`tel:${settings.phone}`}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 transition text-center group"
              >
                <Phone className="w-4 h-4 text-teal-600 group-hover:scale-110 transition mb-1" />
                <span className="text-[11px] font-bold text-slate-800">{isUrdu ? 'کال کریں' : 'Call Dr.'}</span>
              </a>

              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  'Assalamu Alaikum Dr. Haroon, I would like to inquire about an appointment.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition text-center group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition mb-1" />
                <span className="text-[11px] font-bold text-emerald-900">WhatsApp</span>
              </a>

              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 transition text-center group"
              >
                <MapPin className="w-4 h-4 text-rose-600 group-hover:scale-110 transition mb-1" />
                <span className="text-[11px] font-bold text-rose-900">{isUrdu ? 'لوکیشن' : 'Location'}</span>
              </a>
            </div>

            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>
                  {isUrdu
                    ? settings.clinicTimingsUrdu || 'پیر تا ہفتہ: شام 5:00 تا رات 9:00 بجے'
                    : settings.clinicTimings || 'Mon - Sat: 5:00 PM - 9:00 PM'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Patient Registration / Login */}
      {activeMode === 'patient_login' && (
        <form onSubmit={handlePatientSubmit} className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="font-extrabold text-base text-teal-950">
                {isUrdu ? 'مریض لاگ ان اور نیا اندراج' : 'Patient Login & Registration'}
              </h2>
              <p className="text-xs text-slate-500">
                {isUrdu
                  ? 'موبائل نمبر یا جی میل کے ذریعے آسانی سے داخل ہوں'
                  : 'Register or sign in with your mobile number or Gmail'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveMode('select')}
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              {isUrdu ? '← واپس' : '← Back'}
            </button>
          </div>

          {patientError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{patientError}</span>
            </div>
          )}

          {/* Identifier Toggle: Mobile vs Gmail */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPatientLoginType('mobile')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                patientLoginType === 'mobile'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'موبائل نمبر' : 'Mobile Number'}</span>
            </button>
            <button
              type="button"
              onClick={() => setPatientLoginType('gmail')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                patientLoginType === 'gmail'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'جی میل (Gmail)' : 'Gmail / Email'}</span>
            </button>
          </div>

          {/* Identifier Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {patientLoginType === 'mobile'
                ? isUrdu
                  ? 'موبائل نمبر (مثال: 03001234567)'
                  : 'Mobile Phone Number (e.g. 0300 1234567)'
                : isUrdu
                ? 'جی میل ایڈریس (مثال: patient@gmail.com)'
                : 'Gmail / Email Address (e.g. name@gmail.com)'}
            </label>
            <input
              type={patientLoginType === 'mobile' ? 'tel' : 'email'}
              value={patientIdentifier}
              onChange={(e) => setPatientIdentifier(e.target.value)}
              placeholder={
                patientLoginType === 'mobile' ? '0300 1234567' : 'yourname@gmail.com'
              }
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:border-teal-500 focus:outline-none"
            />
          </div>

          {/* Additional details for new patient */}
          <div className="space-y-3 pt-1">
            <span className="text-[11px] font-semibold text-slate-500 block">
              {isUrdu ? 'مریض کی بنیادی معلومات:' : 'Patient Profile Details (For New Registration):'}
            </span>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                {isUrdu ? 'مریض کا پورا نام' : 'Full Name'}
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Muhammad Usman"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'عمر (سال)' : 'Age'}
                </label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'جنس' : 'Gender'}
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold"
                >
                  <option value="Male">Male (مرد)</option>
                  <option value="Female">Female (عورت)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'شہر' : 'City'}
                </label>
                <input
                  type="text"
                  value={patientCity}
                  onChange={(e) => setPatientCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <span>{isUrdu ? 'مریض پورٹل میں داخل ہوں' : 'Continue to Patient Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Mode 3: Administration / Doctor Login */}
      {activeMode === 'admin_login' && (
        <form onSubmit={handleAdminSubmit} className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-teal-600" />
                <span>{isUrdu ? 'انتظامیہ کنٹرول پورٹل' : 'Administration Access'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {isUrdu
                  ? 'کلینک کا مکمل کنٹرول حاصل کرنے کے لیے پاس ورڈ درج کریں'
                  : 'Enter administration password for full clinic management'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveMode('select')}
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              {isUrdu ? '← واپس' : '← Back'}
            </button>
          </div>

          {adminError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{adminError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isUrdu ? 'ڈاکٹر / ایڈمن شناختی موبائل یا جی میل' : 'Doctor / Admin Mobile or Gmail (Optional)'}
            </label>
            <input
              type="text"
              value={adminIdentifier}
              onChange={(e) => setAdminIdentifier(e.target.value)}
              placeholder="e.g. Dr. Haroon Kibriya"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                {isUrdu ? 'ایڈمنسٹریشن پاس ورڈ (Password)' : 'Administration App Password'}
              </label>
              <button
                type="button"
                onClick={() => setShowPasswordHint(!showPasswordHint)}
                className="text-[11px] text-teal-700 hover:underline"
              >
                {showPasswordHint ? 'Hide Hint' : 'Default Password Hint'}
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter password..."
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:border-teal-500 focus:outline-none pr-9"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            {showPasswordHint && (
              <p className="text-[11px] text-teal-800 bg-teal-50 p-2 rounded-lg border border-teal-200 mt-1.5">
                Default administration password is: <strong>admin123</strong> (Can be modified in Clinic Settings).
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-teal-300" />
              <span>{isUrdu ? 'بطور ایڈمن لاگ ان کریں' : 'Unlock Administration Mode'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
