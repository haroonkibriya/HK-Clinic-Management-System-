import React, { useState } from 'react';
import {
  User,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  FileSignature,
  Receipt,
  Clock,
  Printer,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Building,
  DollarSign,
  HeartPulse,
  LogOut,
  Sparkles,
} from 'lucide-react';
import {
  Patient,
  Prescription,
  FeeReceipt,
  ProcedureReceipt,
  Appointment,
  ClinicSettings,
} from '../../types';
import { AppointmentRepository, AuditRepository } from '../../database/storage';

interface PatientPortalViewProps {
  patient: Patient;
  prescriptions: Prescription[];
  feeReceipts: FeeReceipt[];
  procedureReceipts: ProcedureReceipt[];
  appointments: Appointment[];
  settings: ClinicSettings;
  onBookAppointment?: () => void;
  onViewPrescription: (rx: Prescription) => void;
  onViewFeeReceipt: (receipt: FeeReceipt) => void;
  onRefreshData?: () => void;
  onLogout?: () => void;
  isUrdu: boolean;
}

export const PatientPortalView: React.FC<PatientPortalViewProps> = ({
  patient,
  prescriptions,
  feeReceipts,
  procedureReceipts,
  appointments,
  settings,
  onViewPrescription,
  onViewFeeReceipt,
  onRefreshData,
  onLogout,
  isUrdu,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'booking' | 'prescriptions' | 'receipts' | 'appointments' | 'clinic_info'
  >('overview');

  // Booking Form State
  const [bookDate, setBookDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [bookSlot, setBookSlot] = useState('06:00 PM');
  const [bookType, setBookType] = useState<'In-Clinic' | 'Online Consultation'>('In-Clinic');
  const [bookReason, setBookReason] = useState('Routine Medical Consultation');
  const [bookingSuccess, setBookingSuccess] = useState<Appointment | null>(null);

  const myPrescriptions = prescriptions.filter((r) => r.patientId === patient.id);
  const myFeeReceipts = feeReceipts.filter((r) => r.patientId === patient.id);
  const myAppointments = appointments.filter((a) => a.patientId === patient.id);

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment = AppointmentRepository.create(
      {
        patientId: patient.id,
        patientName: patient.name,
        patientMrNumber: patient.mrNumber,
        patientPhone: patient.phone,
        doctorName: settings.doctorName,
        date: bookDate,
        timeSlot: bookSlot,
        type: bookType,
        status: 'Confirmed',
        reason: bookReason.trim() || 'General Consultation',
        feeAmount: settings.consultationFee || 1500,
        isPaid: false,
      },
      patient.name
    );

    AuditRepository.log(
      patient.name,
      'PATIENT_BOOKED_APPOINTMENT',
      `Patient ${patient.name} booked appointment for ${bookDate} (${bookSlot})`,
      'patient'
    );

    setBookingSuccess(newAppointment);
    if (onRefreshData) onRefreshData();
  };

  const timeSlots = [
    '10:30 AM',
    '11:30 AM',
    '12:30 PM',
    '05:00 PM',
    '05:30 PM',
    '06:00 PM',
    '06:30 PM',
    '07:00 PM',
    '07:30 PM',
    '08:00 PM',
    '08:30 PM',
  ];

  return (
    <div className="space-y-4">
      {/* Patient Welcome Header Card */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 text-white rounded-3xl p-5 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs text-white font-black text-2xl flex items-center justify-center border border-white/30 shadow-inner">
              {patient.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-900/60 text-teal-200 px-2 py-0.5 rounded-full border border-teal-600/40">
                  {isUrdu ? 'مریض پورٹل' : 'Patient Portal'}
                </span>
                <span className="text-[11px] font-mono text-teal-200">
                  {patient.mrNumber}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black mt-0.5">{patient.name}</h1>
              <p className="text-xs text-teal-100">
                {patient.age} yrs • {patient.gender} • {patient.phone}
              </p>
            </div>
          </div>

          {/* Quick Direct Clinic Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 active:scale-95 rounded-xl text-xs font-semibold border border-white/20 transition"
              title="Call Clinic"
            >
              <Phone className="w-3.5 h-3.5 text-teal-200" />
              <span>{isUrdu ? 'کال کریں' : 'Call'}</span>
            </a>

            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Assalamu Alaikum Dr. Haroon, I am ${patient.name} (MR: ${patient.mrNumber}). I would like to inquire about consultation.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 rounded-xl text-xs font-semibold shadow-sm transition"
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
              title="View Google Maps Location"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-300" />
              <span>{isUrdu ? 'لوکیشن' : 'Location'}</span>
            </a>

            {onLogout && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-500/80 hover:bg-rose-600 active:scale-95 rounded-xl text-xs font-semibold transition"
                title="Switch / Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'لاگ آؤٹ' : 'Exit'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-3.5 rounded-xl transition shrink-0 ${
            activeTab === 'overview'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {isUrdu ? 'ہوم / خلاصہ' : 'Overview'}
        </button>

        <button
          onClick={() => {
            setActiveTab('booking');
            setBookingSuccess(null);
          }}
          className={`py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'booking'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{isUrdu ? 'اپائنٹمنٹ بک کریں' : 'Book Appointment'}</span>
        </button>

        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'prescriptions'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSignature className="w-3.5 h-3.5" />
          <span>{isUrdu ? 'میرے نسخے' : 'Prescriptions'}</span>
          <span className="px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded-full text-[10px]">
            {myPrescriptions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('receipts')}
          className={`py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'receipts'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>{isUrdu ? 'رسیدیں' : 'Receipts'}</span>
          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px]">
            {myFeeReceipts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('clinic_info')}
          className={`py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'clinic_info'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>{isUrdu ? 'کلینک معلومات و رابطہ' : 'Clinic Info'}</span>
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Quick Booking Call-to-action */}
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                {isUrdu ? 'ڈاکٹر چیک اپ' : 'Doctor Consultation'}
              </span>
              <h2 className="font-extrabold text-base text-teal-950 mt-1">
                {isUrdu ? 'ڈاکٹر ہارون سے اپائنٹمنٹ حاصل کریں' : 'Book a Consultation with Dr. Haroon'}
              </h2>
              <p className="text-xs text-teal-800 mt-0.5">
                {isUrdu
                  ? 'کلینک چیک اپ، فالو اپ، یا لیب رپورٹ کے جائزے کے لیے آن لائن ٹوکن حاصل کریں'
                  : 'Fast-track your clinic visit, routine checkup, or medical evaluation.'}
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('booking');
                setBookingSuccess(null);
              }}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>{isUrdu ? 'ابھی بک کریں' : 'Book Appointment Now'}</span>
            </button>
          </div>

          {/* Grid of Latest Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* My Latest Prescription */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase text-slate-800 flex items-center gap-1.5">
                  <FileSignature className="w-4 h-4 text-teal-600" />
                  <span>{isUrdu ? 'تازہ ترین نسخہ' : 'Latest Prescription'}</span>
                </h3>
                {myPrescriptions.length > 0 && (
                  <button
                    onClick={() => setActiveTab('prescriptions')}
                    className="text-[11px] text-teal-600 font-bold hover:underline"
                  >
                    {isUrdu ? 'تمام دیکھیں' : 'View All'}
                  </button>
                )}
              </div>

              {myPrescriptions.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-400">
                  {isUrdu ? 'ابھی تک کوئی نسخہ ریکارڈ نہیں ہوا' : 'No prescriptions recorded yet.'}
                </div>
              ) : (
                <div
                  onClick={() => onViewPrescription(myPrescriptions[0])}
                  className="p-3.5 bg-teal-50/60 rounded-2xl border border-teal-200/80 hover:border-teal-400 transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono font-bold text-teal-900 text-xs">
                      {myPrescriptions[0].prescriptionNumber}
                    </span>
                    <span className="text-[11px] text-slate-500 ml-2">
                      {myPrescriptions[0].date}
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-1">
                      {myPrescriptions[0].diagnosis || 'General Consultation'}
                    </p>
                    <span className="text-[11px] text-teal-700 block mt-0.5">
                      {myPrescriptions[0].medicines.length} Prescribed Medicines
                    </span>
                  </div>
                  <span className="text-xs font-bold text-teal-700 flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-teal-200 shadow-2xs">
                    <Printer className="w-3.5 h-3.5" />
                    <span>View / Print</span>
                  </span>
                </div>
              )}
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <span>{isUrdu ? 'میری اپائنٹمنٹس' : 'Upcoming Bookings'}</span>
                </h3>
              </div>

              {myAppointments.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-400">
                  {isUrdu
                    ? 'کوئی طے شدہ اپائنٹمنٹ نہیں ہے'
                    : 'No upcoming appointments booked.'}
                </div>
              ) : (
                <div className="space-y-2">
                  {myAppointments.slice(0, 2).map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{apt.date}</span>
                          <span className="font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[10px] font-bold">
                            {apt.timeSlot}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {apt.reason || 'General Consultation'}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Booking Form */}
      {activeTab === 'booking' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-5">
          <div>
            <h2 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <span>{isUrdu ? 'ڈاکٹر اپائنٹمنٹ بک کریں' : 'Book Doctor Appointment'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isUrdu
                ? 'اپنا مطلوبہ وقت اور تاریخ منتخب کر کے باآسانی آن لائن ٹوکن حاصل کریں'
                : 'Select your preferred consultation date, time slot, and reason for visit.'}
            </p>
          </div>

          {bookingSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3 className="font-bold text-sm">
                  {isUrdu ? 'اپائنٹمنٹ کامیابی سے بک ہو گئی!' : 'Appointment Successfully Booked!'}
                </h3>
              </div>
              <p className="text-xs text-emerald-800">
                {isUrdu
                  ? `آپ کا ٹوکن نمبر ${bookingSuccess.appointmentNumber} ہے برائے ${bookingSuccess.date} بوقت ${bookingSuccess.timeSlot}`
                  : `Your booking token is ${bookingSuccess.appointmentNumber} for ${bookingSuccess.date} at ${bookingSuccess.timeSlot}.`}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Assalamu Alaikum Dr. Haroon, I have booked Appointment ${bookingSuccess.appointmentNumber} for ${bookingSuccess.date} at ${bookingSuccess.timeSlot}. Patient: ${patient.name}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send Confirmation on WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isUrdu ? 'تاریخ انتخاب کریں' : 'Select Date'}
                </label>
                <input
                  type="date"
                  value={bookDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookDate(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isUrdu ? 'مشاورت کی نوعیت' : 'Consultation Type'}
                </label>
                <select
                  value={bookType}
                  onChange={(e) => setBookType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:bg-white focus:border-teal-500"
                >
                  <option value="In-Clinic">In-Clinic Visit (کلینک تشریف آوری)</option>
                  <option value="Online Consultation">Online / Tele-Consultation (آن لائن مشاورت)</option>
                </select>
              </div>
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                {isUrdu ? 'مطلوبہ وقت کا انتخاب کریں (Time Slot)' : 'Select Preferred Time Slot'}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setBookSlot(slot)}
                    className={`py-2 px-1 rounded-xl text-center font-mono text-xs transition border ${
                      bookSlot === slot
                        ? 'bg-teal-600 text-white font-bold border-teal-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-teal-50 hover:border-teal-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason / Symptoms */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isUrdu ? 'طبی شکایت / دورے کا مقصد' : 'Reason for Visit / Symptoms'}
              </label>
              <textarea
                rows={2}
                value={bookReason}
                onChange={(e) => setBookReason(e.target.value)}
                placeholder="e.g. Fever, blood pressure checkup, medical certificate, prescription refill..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:border-teal-500"
              />
            </div>

            {/* Fee summary */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                {isUrdu ? 'مشاورت فیس:' : 'Consultation Fee:'}
              </span>
              <span className="font-black text-teal-800 text-sm font-mono">
                {settings.currency} {settings.consultationFee || 1500}
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isUrdu ? 'اپائنٹمنٹ کنفرم کریں' : 'Confirm & Book Appointment'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Prescriptions */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-3">
          {myPrescriptions.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
              No prescriptions found for this patient record.
            </div>
          ) : (
            myPrescriptions.map((rx) => (
              <div
                key={rx.id}
                onClick={() => onViewPrescription(rx)}
                className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs hover:border-teal-400 transition cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-teal-800 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                      {rx.prescriptionNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">{rx.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mt-1">
                    {rx.diagnosis || 'Clinical Prescription'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {rx.medicines.map((m) => m.brandName).join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl font-bold text-xs flex items-center gap-1 border border-teal-200">
                    <Printer className="w-3.5 h-3.5" />
                    <span>View Rx</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Receipts */}
      {activeTab === 'receipts' && (
        <div className="space-y-3">
          {myFeeReceipts.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
              No receipts found for this patient.
            </div>
          ) : (
            myFeeReceipts.map((rcpt) => (
              <div
                key={rcpt.id}
                onClick={() => onViewFeeReceipt(rcpt)}
                className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs hover:border-teal-400 transition cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      {rcpt.receiptNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">{rcpt.date}</span>
                  </div>
                  <p className="font-bold text-slate-900 text-xs mt-1">
                    Consultation Fee — {rcpt.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-700 text-sm font-mono block">
                    {settings.currency} {rcpt.paidAmount}
                  </span>
                  <span className="text-[10px] text-slate-400">Click to view</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Clinic Info & Contact Details */}
      {activeTab === 'clinic_info' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-5 text-xs text-slate-700">
          <div>
            <h2 className="font-black text-base text-slate-900">
              {isUrdu ? 'کلینک کی مکمل معلومات اور رابطہ' : 'Clinic Details & Location'}
            </h2>
            <p className="text-slate-500 mt-0.5">
              {isUrdu
                ? 'پتہ، فون نمبر، واٹس ایپ اور نقشے کی تفصیلات'
                : 'Direct address, phone numbers, WhatsApp, and Google Maps directions.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Address Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>{isUrdu ? 'کلینک کا پتہ' : 'Clinic Address'}</span>
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">
                {isUrdu ? settings.addressUrdu || settings.address : settings.address}
              </p>
              <div className="pt-2">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 transition"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'گوگل میپس پر کھولیں' : 'Open in Google Maps'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Timings Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>{isUrdu ? 'کلینک کے اوقات' : 'Clinic Timings'}</span>
              </span>
              <p className="text-slate-700 font-medium">
                {isUrdu
                  ? settings.clinicTimingsUrdu || 'پیر تا ہفتہ: شام 5:00 تا رات 9:00 بجے'
                  : settings.clinicTimings || 'Mon - Sat: 5:00 PM - 9:00 PM'}
              </p>
              <p className="text-slate-500 text-[11px]">
                {isUrdu ? 'اتوار: بند' : 'Sunday: Closed'}
              </p>
            </div>

            {/* Contact Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <Phone className="w-4 h-4 text-teal-600" />
                <span>{isUrdu ? 'فون اور رابطہ نمبر' : 'Phone Contact'}</span>
              </span>
              <p className="text-slate-800 font-mono font-bold">{settings.phone}</p>
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-xl border border-teal-200 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'ابھی کال کریں' : 'Call Now'}</span>
              </a>
            </div>

            {/* WhatsApp Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </span>
              <p className="text-slate-800 font-mono font-bold">{settings.whatsapp}</p>
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl border border-emerald-200 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'واٹس ایپ میسج کریں' : 'Send WhatsApp Message'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
