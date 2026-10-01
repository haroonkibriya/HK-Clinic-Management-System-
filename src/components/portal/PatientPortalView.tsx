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
} from 'lucide-react';
import {
  Patient,
  Prescription,
  FeeReceipt,
  ProcedureReceipt,
  Appointment,
  ClinicSettings,
} from '../../types';

interface PatientPortalViewProps {
  patient: Patient;
  prescriptions: Prescription[];
  feeReceipts: FeeReceipt[];
  procedureReceipts: ProcedureReceipt[];
  appointments: Appointment[];
  settings: ClinicSettings;
  onBookAppointment: () => void;
  onViewPrescription: (rx: Prescription) => void;
  onViewFeeReceipt: (receipt: FeeReceipt) => void;
  isUrdu: boolean;
}

export const PatientPortalView: React.FC<PatientPortalViewProps> = ({
  patient,
  prescriptions,
  feeReceipts,
  procedureReceipts,
  appointments,
  settings,
  onBookAppointment,
  onViewPrescription,
  onViewFeeReceipt,
  isUrdu,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'prescriptions' | 'receipts' | 'appointments'>('overview');

  const myPrescriptions = prescriptions.filter((r) => r.patientId === patient.id);
  const myFeeReceipts = feeReceipts.filter((r) => r.patientId === patient.id);
  const myAppointments = appointments.filter((a) => a.patientId === patient.id);

  return (
    <div className="space-y-4">
      {/* Patient Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-600 text-white rounded-3xl p-5 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs text-white font-black text-xl flex items-center justify-center border border-white/30">
              {patient.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-200">
                {isUrdu ? 'مریض پورٹل' : 'Personal Patient Portal'}
              </span>
              <h1 className="text-xl font-bold">{patient.name}</h1>
              <p className="text-xs text-teal-100 font-mono">
                MR: {patient.mrNumber} • {patient.age} yrs • {patient.gender}
              </p>
            </div>
          </div>

          {/* Quick Direct Clinic Action Buttons (PRD Section 21 & 22) */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 active:scale-95 rounded-xl text-xs font-semibold border border-white/20 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'کلینک کال' : 'Call Clinic'}</span>
            </a>

            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 active:scale-95 rounded-xl text-xs font-semibold border border-white/20 transition"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'راستہ / نقشہ' : 'Get Directions'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-white px-3 rounded-xl border border-slate-200 shadow-2xs text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 border-b-2 transition ${
            activeTab === 'overview'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500'
          }`}
        >
          {isUrdu ? 'خلاصہ' : 'Overview'}
        </button>
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'prescriptions'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500'
          }`}
        >
          <span>{isUrdu ? 'میرے نسخہ جات' : 'My Prescriptions'}</span>
          <span className="px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded-full text-[10px]">
            {myPrescriptions.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('receipts')}
          className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'receipts'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500'
          }`}
        >
          <span>{isUrdu ? 'میری رسیدیں' : 'My Receipts'}</span>
          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px]">
            {myFeeReceipts.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'appointments'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500'
          }`}
        >
          <span>{isUrdu ? 'اپائنٹمنٹس' : 'Appointments'}</span>
          <span className="px-1.5 py-0.2 bg-sky-100 text-sky-800 rounded-full text-[10px]">
            {myAppointments.length}
          </span>
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Booking Action */}
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-sm text-teal-950">
                {isUrdu ? 'آن لائن یا کلینک مشاورت بک کریں' : 'Need a Consultation?'}
              </h2>
              <p className="text-xs text-teal-800 mt-0.5">
                Book a visit with {settings.doctorName} for follow-up or routine medical evaluation.
              </p>
            </div>
            <button
              onClick={onBookAppointment}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-sm transition"
            >
              Book Now
            </button>
          </div>

          {/* Quick Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Latest Prescription */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-xs uppercase text-slate-800 flex items-center gap-1.5">
                <FileSignature className="w-4 h-4 text-teal-600" />
                <span>{isUrdu ? 'تازہ ترین نسخہ' : 'Latest Prescription'}</span>
              </h3>
              {myPrescriptions.length === 0 ? (
                <p className="text-xs text-slate-400">No prescriptions found on file.</p>
              ) : (
                <div
                  onClick={() => onViewPrescription(myPrescriptions[0])}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-teal-300 transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono font-bold text-teal-800 text-xs">
                      {myPrescriptions[0].prescriptionNumber}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-2">{myPrescriptions[0].date}</span>
                    <p className="text-xs font-semibold text-slate-800 mt-1">
                      {myPrescriptions[0].diagnosis || 'Medical Consultation'}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                    <Printer className="w-3.5 h-3.5" />
                    <span>View</span>
                  </span>
                </div>
              )}
            </div>

            {/* Clinic Location & Hours */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2 text-xs">
              <h3 className="font-bold text-xs uppercase text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Clinic Address & Timings</span>
              </h3>
              <p className="text-slate-700 font-medium">{settings.address}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Timings: Mon - Sat: 5:00 PM - 9:00 PM</span>
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-700 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>Open Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Prescriptions */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-2.5">
          {myPrescriptions.map((rx) => (
            <div
              key={rx.id}
              onClick={() => onViewPrescription(rx)}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-300 transition cursor-pointer flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {rx.prescriptionNumber}
                  </span>
                  <span className="text-xs text-slate-400">{rx.date}</span>
                </div>
                <p className="font-semibold text-xs text-slate-800 mt-1">
                  Diagnosis: {rx.diagnosis || 'Clinical visit'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {rx.medicines.map((m) => m.brandName).join(', ')}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700">
                <Printer className="w-3.5 h-3.5" />
                <span>View Rx</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Receipts */}
      {activeTab === 'receipts' && (
        <div className="space-y-2.5">
          {myFeeReceipts.map((rec) => (
            <div
              key={rec.id}
              onClick={() => onViewFeeReceipt(rec)}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-300 transition cursor-pointer flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {rec.receiptNumber}
                </span>
                <span className="text-slate-400 ml-2">{rec.date}</span>
                <p className="text-slate-700 text-[11px] mt-1">
                  Consultation Fee • Paid via {rec.paymentMethod}
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-sm text-emerald-800 font-mono">
                  {rec.paidAmount} {settings.currency}
                </span>
                <span className="text-[10px] text-teal-700 font-semibold block flex items-center gap-1 justify-end">
                  <Printer className="w-3 h-3" />
                  <span>Print Receipt</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-2.5">
          {myAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{apt.date}</span>
                  <span className="font-mono text-teal-800 font-semibold">{apt.timeSlot}</span>
                  <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px]">
                    {apt.status}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1">
                  {apt.type} • {apt.reason || 'Checkup'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
