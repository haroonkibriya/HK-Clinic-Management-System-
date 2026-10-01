import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit,
  Phone,
  MessageCircle,
  FileSignature,
  Receipt,
  Calendar,
  Activity,
  History,
  AlertTriangle,
  MapPin,
  Clock,
  Printer,
  ChevronRight,
  Save,
  Trash2,
} from 'lucide-react';
import { Patient, Prescription, FeeReceipt, ProcedureReceipt, Appointment, UserRole } from '../../types';
import { PatientRepository } from '../../database/storage';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
  onEditPatient: (patient: Patient) => void;
  onNewPrescription: (patient: Patient) => void;
  onNewReceipt: (patient: Patient) => void;
  onSelectPrescription: (rx: Prescription) => void;
  onDeletePatient?: (patient: Patient) => void;
  prescriptions: Prescription[];
  feeReceipts: FeeReceipt[];
  procedureReceipts: ProcedureReceipt[];
  appointments: Appointment[];
  isUrdu: boolean;
  role: UserRole;
  currentUser: string;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({
  patient,
  onBack,
  onEditPatient,
  onNewPrescription,
  onNewReceipt,
  onSelectPrescription,
  onDeletePatient,
  prescriptions,
  feeReceipts,
  procedureReceipts,
  appointments,
  isUrdu,
  role,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'prescriptions' | 'receipts' | 'appointments'>('history');
  const [isEditingHistory, setIsEditingHistory] = useState(false);
  const [historyForm, setHistoryForm] = useState(patient.medicalHistory || {
    chiefComplaint: '',
    symptoms: '',
    pastMedicalHistory: '',
    surgicalHistory: '',
    drugAllergies: '',
    currentMedicines: '',
    familyHistory: '',
    socialHistory: '',
    examination: '',
    diagnosis: '',
    investigations: '',
    doctorNotes: '',
    followUpAdvice: '',
    updatedAt: new Date().toISOString(),
  });

  const patientRx = prescriptions.filter((r) => r.patientId === patient.id);
  const patientFees = feeReceipts.filter((r) => r.patientId === patient.id);
  const patientProcedures = procedureReceipts.filter((r) => r.patientId === patient.id);
  const patientApts = appointments.filter((a) => a.patientId === patient.id);

  const handleSaveHistory = () => {
    const updatedPatient: Patient = {
      ...patient,
      medicalHistory: {
        ...historyForm,
        updatedAt: new Date().toISOString(),
      },
    };
    PatientRepository.save(updatedPatient, currentUser);
    setIsEditingHistory(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isUrdu ? 'واپس مریضوں کی فہرست' : 'Back to Patients'}</span>
          </button>

          <div className="flex items-center gap-2">
            {onDeletePatient && (
              <button
                onClick={() => {
                  const confirmed = window.confirm(
                    isUrdu
                      ? `کیا آپ واقعی ${patient.name} (${patient.mrNumber}) کا ریکارڈ ڈیلیٹ کرنا چاہتے ہیں؟`
                      : `Are you sure you want to delete patient ${patient.name} (${patient.mrNumber})?`
                  );
                  if (confirmed) {
                    onDeletePatient(patient);
                  }
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition"
                title="Delete Patient"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'ڈیلیٹ کریں' : 'Delete'}</span>
              </button>
            )}
            <button
              onClick={() => onEditPatient(patient)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'ترمیم کریں' : 'Edit Info'}</span>
            </button>
            {role === 'doctor' && (
              <button
                onClick={() => onNewPrescription(patient)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 active:scale-95 shadow-sm transition"
              >
                <FileSignature className="w-4 h-4" />
                <span>{isUrdu ? 'نیا نسخہ لکھیں' : 'New Rx'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Patient Profile Banner */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white font-black text-xl flex items-center justify-center shadow-md">
              {patient.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-slate-900">{patient.name}</h1>
                <span className="font-mono text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-lg">
                  {patient.mrNumber}
                </span>
                {patient.bloodGroup && (
                  <span className="text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-lg">
                    {patient.bloodGroup}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {patient.fatherOrHusbandName && `Father/Husband: ${patient.fatherOrHusbandName} • `}
                {patient.age} yrs • {patient.gender} • Registered {new Date(patient.registrationDate).toLocaleDateString()}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-600 mt-2 flex-wrap">
                <a
                  href={`tel:${patient.phone}`}
                  className="inline-flex items-center gap-1 text-teal-700 hover:underline font-mono"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{patient.phone}</span>
                </a>
                {patient.whatsapp && (
                  <a
                    href={`https://wa.me/${patient.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-600 hover:underline font-mono"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
                {patient.address && (
                  <span className="inline-flex items-center gap-1 text-slate-500 truncate max-w-xs">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{patient.address}, {patient.city}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => onNewReceipt(patient)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'فیس رسید کاٹیں' : 'Issue Fee Receipt'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200 bg-white px-3 rounded-xl shadow-2xs overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('history')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
            activeTab === 'history'
              ? 'border-teal-600 text-teal-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{isUrdu ? 'طبی ہسٹری و معائنہ' : 'Medical History & Notes'}</span>
        </button>

        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
            activeTab === 'prescriptions'
              ? 'border-teal-600 text-teal-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSignature className="w-4 h-4" />
          <span>{isUrdu ? 'نسخہ جات (Rx)' : 'Prescriptions'}</span>
          <span className="ml-1 px-1.5 py-0.2 bg-teal-100 text-teal-800 text-[10px] rounded-full">
            {patientRx.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('receipts')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
            activeTab === 'receipts'
              ? 'border-teal-600 text-teal-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>{isUrdu ? 'رسیدیں اور ادائیگیاں' : 'Receipts & Accounts'}</span>
          <span className="ml-1 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] rounded-full">
            {patientFees.length + patientProcedures.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
            activeTab === 'appointments'
              ? 'border-teal-600 text-teal-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{isUrdu ? 'اپائنٹمنٹس' : 'Appointments'}</span>
          <span className="ml-1 px-1.5 py-0.2 bg-sky-100 text-sky-800 text-[10px] rounded-full">
            {patientApts.length}
          </span>
        </button>
      </div>

      {/* Tab Content: Medical History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <History className="w-4 h-4 text-teal-600" />
              <span>{isUrdu ? 'مکمل طبی ریکارڈ اور تشخیصی فائل' : 'Comprehensive Clinical History'}</span>
            </h2>
            {role === 'doctor' && (
              <button
                onClick={() => {
                  if (isEditingHistory) handleSaveHistory();
                  else setIsEditingHistory(true);
                }}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isEditingHistory
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isEditingHistory ? <Save className="w-3.5 h-3.5" /> : <Edit className="w-3.5 h-3.5" />}
                <span>{isEditingHistory ? (isUrdu ? 'محفوظ کریں' : 'Save History') : (isUrdu ? 'ترمیم کریں' : 'Update History')}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Chief Complaint */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1 text-[11px] uppercase tracking-wider text-teal-800">
                1. {isUrdu ? 'ابتدائی علامات و شکایت' : 'Chief Complaint & Symptoms'}
              </span>
              {isEditingHistory ? (
                <textarea
                  rows={2}
                  value={historyForm.chiefComplaint}
                  onChange={(e) => setHistoryForm({ ...historyForm, chiefComplaint: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              ) : (
                <p className="text-slate-800 leading-relaxed font-medium">
                  {patient.medicalHistory?.chiefComplaint || 'No chief complaint recorded.'}
                </p>
              )}
            </div>

            {/* Diagnosis */}
            <div className="bg-teal-50/60 p-3.5 rounded-xl border border-teal-200">
              <span className="font-bold block mb-1 text-[11px] uppercase tracking-wider text-teal-900">
                2. {isUrdu ? 'تشخیص (مرض)' : 'Clinical Diagnosis'}
              </span>
              {isEditingHistory ? (
                <input
                  type="text"
                  value={historyForm.diagnosis}
                  onChange={(e) => setHistoryForm({ ...historyForm, diagnosis: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              ) : (
                <p className="text-teal-950 font-bold text-sm">
                  {patient.medicalHistory?.diagnosis || 'Pending evaluation.'}
                </p>
              )}
            </div>

            {/* Examination */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1 text-[11px] uppercase tracking-wider text-teal-800">
                3. {isUrdu ? 'طبی معائنہ و وائٹلز' : 'Physical Examination & Vitals'}
              </span>
              {isEditingHistory ? (
                <textarea
                  rows={2}
                  value={historyForm.examination}
                  onChange={(e) => setHistoryForm({ ...historyForm, examination: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              ) : (
                <p className="text-slate-800 leading-relaxed">
                  {patient.medicalHistory?.examination || 'Vitals not logged.'}
                </p>
              )}
            </div>

            {/* Past Medical & Surgical */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1 text-[11px] uppercase tracking-wider text-teal-800">
                4. {isUrdu ? 'سابقہ بیماریاں و سرجری' : 'Past Medical & Surgical History'}
              </span>
              {isEditingHistory ? (
                <textarea
                  rows={2}
                  value={historyForm.pastMedicalHistory}
                  onChange={(e) => setHistoryForm({ ...historyForm, pastMedicalHistory: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              ) : (
                <p className="text-slate-800 leading-relaxed">
                  {patient.medicalHistory?.pastMedicalHistory || 'None reported.'}
                </p>
              )}
            </div>

            {/* Drug Allergies */}
            <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-200">
              <span className="font-bold text-rose-800 block mb-1 text-[11px] uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>5. {isUrdu ? 'ادویات کی الرجی' : 'Drug Allergies'}</span>
              </span>
              {isEditingHistory ? (
                <input
                  type="text"
                  value={historyForm.drugAllergies}
                  onChange={(e) => setHistoryForm({ ...historyForm, drugAllergies: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              ) : (
                <p className="text-rose-900 font-semibold">
                  {patient.medicalHistory?.drugAllergies || 'No known drug allergies (NKDA).'}
                </p>
              )}
            </div>

            {/* Current Medicines */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1 text-[11px] uppercase tracking-wider text-teal-800">
                6. {isUrdu ? 'موجودہ ادویات' : 'Current Regular Medicines'}
              </span>
              {isEditingHistory ? (
                <input
                  type="text"
                  value={historyForm.currentMedicines}
                  onChange={(e) => setHistoryForm({ ...historyForm, currentMedicines: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              ) : (
                <p className="text-slate-800">
                  {patient.medicalHistory?.currentMedicines || 'None.'}
                </p>
              )}
            </div>

            {/* Investigations */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1 text-[11px] uppercase tracking-wider text-teal-800">
                7. {isUrdu ? 'تجویز کردہ ٹیسٹ و لیبارٹری' : 'Recommended Investigations'}
              </span>
              {isEditingHistory ? (
                <textarea
                  rows={2}
                  value={historyForm.investigations}
                  onChange={(e) => setHistoryForm({ ...historyForm, investigations: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              ) : (
                <p className="text-slate-800">
                  {patient.medicalHistory?.investigations || 'No investigations advised.'}
                </p>
              )}
            </div>

            {/* Follow-up Advice */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1 text-[11px] uppercase tracking-wider text-teal-800">
                8. {isUrdu ? 'پرہیز، ہدایات و فالو اپ' : 'Follow-up Advice & Diet'}
              </span>
              {isEditingHistory ? (
                <textarea
                  rows={2}
                  value={historyForm.followUpAdvice}
                  onChange={(e) => setHistoryForm({ ...historyForm, followUpAdvice: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              ) : (
                <p className="text-slate-800">
                  {patient.medicalHistory?.followUpAdvice || 'Standard routine review.'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Prescriptions */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-slate-800">
              {isUrdu ? 'جاری کردہ نسخہ جات' : 'Prescription History'}
            </h2>
            {role === 'doctor' && (
              <button
                onClick={() => onNewPrescription(patient)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition"
              >
                <FileSignature className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'نیا نسخہ بنائیں' : 'Create Prescription'}</span>
              </button>
            )}
          </div>

          {patientRx.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl text-center border border-slate-200 text-xs text-slate-500">
              No prescriptions created yet for this patient.
            </div>
          ) : (
            <div className="space-y-2.5">
              {patientRx.map((rx) => (
                <div
                  key={rx.id}
                  onClick={() => onSelectPrescription(rx)}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-300 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {rx.prescriptionNumber}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {rx.date}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase">
                        {rx.templateType === 'letterhead' ? 'Letterhead' : 'Built-in'}
                      </span>
                      {rx.versions && rx.versions.length > 1 && (
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold border border-indigo-200">
                          v{rx.versions.length}
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-xs text-slate-900 mt-1">
                      Diagnosis: {rx.diagnosis || 'General Consultation'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {rx.medicines.length} Medicines: {rx.medicines.map((m) => m.brandName).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="text-xs font-semibold text-teal-700 flex items-center gap-1">
                      <Printer className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'دیکھیں و پرنٹ کریں' : 'View & Print'}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Receipts */}
      {activeTab === 'receipts' && (
        <div className="space-y-4">
          {/* Fee Receipts */}
          <div>
            <h3 className="font-bold text-xs text-slate-800 mb-2 uppercase tracking-wide">
              {isUrdu ? 'مشاورت معائنہ فیس رسیدیں' : 'Consultation Fee Receipts'}
            </h3>
            {patientFees.length === 0 ? (
              <p className="text-xs text-slate-400 bg-white p-4 rounded-xl border border-slate-200">
                No consultation receipts issued yet.
              </p>
            ) : (
              <div className="space-y-2">
                {patientFees.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {rec.receiptNumber}
                      </span>
                      <span className="text-slate-500 ml-2">{rec.date}</span>
                      <p className="text-slate-700 text-[11px] mt-1">
                        Fee: {rec.consultationFee} PKR {rec.discount > 0 && `(Discount: ${rec.discount})`} • Paid via {rec.paymentMethod}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-700 text-sm">{rec.paidAmount} PKR</div>
                      <span className="text-[10px] text-slate-400 font-mono">{rec.verificationCode}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Procedure Receipts */}
          <div>
            <h3 className="font-bold text-xs text-slate-800 mb-2 uppercase tracking-wide">
              {isUrdu ? 'پروسیجر چارجز رسیدیں' : 'Procedure Receipts'}
            </h3>
            {patientProcedures.length === 0 ? (
              <p className="text-xs text-slate-400 bg-white p-4 rounded-xl border border-slate-200">
                No procedure charges recorded.
              </p>
            ) : (
              <div className="space-y-2">
                {patientProcedures.map((prc) => (
                  <div
                    key={prc.id}
                    className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        {prc.receiptNumber}
                      </span>
                      <span className="text-slate-500 ml-2">{prc.date}</span>
                      <p className="text-slate-700 text-[11px] mt-1">
                        Procedures: {prc.procedures.map((p) => p.name).join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sky-800 text-sm">{prc.paidAmount} PKR</div>
                      <span className="text-[10px] text-slate-400 font-mono">{prc.verificationCode}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content: Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-2">
          {patientApts.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl text-center border border-slate-200 text-xs text-slate-500">
              No appointments booked for this patient.
            </div>
          ) : (
            patientApts.map((apt) => (
              <div
                key={apt.id}
                className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{apt.date}</span>
                    <span className="text-teal-700 font-mono font-semibold">{apt.timeSlot}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        apt.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'Completed'
                          ? 'bg-blue-100 text-blue-800'
                          : apt.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1">
                    {apt.type} • Reason: {apt.reason || 'Routine Checkup'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
