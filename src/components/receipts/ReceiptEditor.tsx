import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Receipt, AlertCircle } from 'lucide-react';
import {
  Patient,
  FeeReceipt,
  ProcedureReceipt,
  ProcedureItem,
  ClinicSettings,
} from '../../types';
import { ReceiptRepository } from '../../database/storage';

interface ReceiptEditorProps {
  initialType?: 'fee' | 'procedure';
  patient?: Patient | null;
  patients: Patient[];
  settings: ClinicSettings;
  onSaveFee: (receipt: FeeReceipt) => void;
  onSaveProcedure: (receipt: ProcedureReceipt) => void;
  onClose: () => void;
  isUrdu: boolean;
  currentUser: string;
}

export const ReceiptEditor: React.FC<ReceiptEditorProps> = ({
  initialType = 'fee',
  patient: initialPatient,
  patients,
  settings,
  onSaveFee,
  onSaveProcedure,
  onClose,
  isUrdu,
  currentUser,
}) => {
  const [receiptType, setReceiptType] = useState<'fee' | 'procedure'>(initialType);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    initialPatient?.id || patients[0]?.id || ''
  );

  const activePatient =
    patients.find((p) => p.id === selectedPatientId) || initialPatient || patients[0];

  // Fee receipt fields
  const [consultationFee, setConsultationFee] = useState<number>(2000);
  const [feeDiscount, setFeeDiscount] = useState<number>(0);
  const [feePaidAmount, setFeePaidAmount] = useState<number>(2000);
  const [feePaymentMethod, setFeePaymentMethod] = useState<FeeReceipt['paymentMethod']>('Cash');
  const [feeNotes, setFeeNotes] = useState('');

  // Procedure receipt fields
  const [procedures, setProcedures] = useState<ProcedureItem[]>([
    {
      id: `proc-${Date.now()}`,
      name: 'Nebulization & Inhalation',
      charges: 800,
      discount: 0,
      notes: '',
    },
  ]);
  const [procedurePaidAmount, setProcedurePaidAmount] = useState<number>(800);
  const [procedurePaymentMethod, setProcedurePaymentMethod] =
    useState<ProcedureReceipt['paymentMethod']>('Cash');
  const [procedureNotes, setProcedureNotes] = useState('');

  const [error, setError] = useState<string | null>(null);

  // Fee totals
  const feeNetTotal = Math.max(0, consultationFee - feeDiscount);
  const feeBalance = Math.max(0, feeNetTotal - feePaidAmount);

  // Procedure totals
  const totalProcCharges = procedures.reduce((sum, p) => sum + (Number(p.charges) || 0), 0);
  const totalProcDiscount = procedures.reduce((sum, p) => sum + (Number(p.discount) || 0), 0);
  const procNetPayable = Math.max(0, totalProcCharges - totalProcDiscount);
  const procBalance = Math.max(0, procNetPayable - procedurePaidAmount);

  const handleAddProcedureRow = () => {
    setProcedures([
      ...procedures,
      {
        id: `proc-${Date.now()}`,
        name: 'Stitching / Wound Dressing',
        charges: 1000,
        discount: 0,
        notes: '',
      },
    ]);
  };

  const handleRemoveProcedureRow = (idx: number) => {
    setProcedures(procedures.filter((_, i) => i !== idx));
  };

  const handleUpdateProcedure = (idx: number, field: keyof ProcedureItem, val: any) => {
    const updated = [...procedures];
    updated[idx] = { ...updated[idx], [field]: val };
    setProcedures(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) {
      setError('Please select a patient.');
      return;
    }

    if (receiptType === 'fee') {
      const newFeeReceipt: FeeReceipt = {
        id: `rec-${Date.now()}`,
        receiptNumber: ReceiptRepository.getNextFeeReceiptNumber(),
        date: new Date().toISOString().split('T')[0],
        patientId: activePatient.id,
        patientName: activePatient.name,
        patientMrNumber: activePatient.mrNumber,
        doctorName: settings.doctorName,
        consultationFee,
        discount: feeDiscount,
        total: feeNetTotal,
        paidAmount: feePaidAmount,
        balance: feeBalance,
        paymentMethod: feePaymentMethod,
        notes: feeNotes.trim() || undefined,
        verificationCode: `REC-VER-${Math.floor(100 + Math.random() * 900)}`,
        createdAt: new Date().toISOString(),
      };
      const saved = ReceiptRepository.saveFeeReceipt(newFeeReceipt, currentUser);
      onSaveFee(saved);
    } else {
      if (procedures.length === 0) {
        setError('Please add at least one procedure.');
        return;
      }
      const newProcReceipt: ProcedureReceipt = {
        id: `prc-${Date.now()}`,
        receiptNumber: ReceiptRepository.getNextProcedureReceiptNumber(),
        date: new Date().toISOString().split('T')[0],
        patientId: activePatient.id,
        patientName: activePatient.name,
        patientMrNumber: activePatient.mrNumber,
        doctorName: settings.doctorName,
        procedures,
        totalCharges: totalProcCharges,
        totalDiscount: totalProcDiscount,
        netPayable: procNetPayable,
        paidAmount: procedurePaidAmount,
        balance: procBalance,
        paymentMethod: procedurePaymentMethod,
        notes: procedureNotes.trim() || undefined,
        verificationCode: `PRC-VER-${Math.floor(100 + Math.random() * 900)}`,
        createdAt: new Date().toISOString(),
      };
      const saved = ReceiptRepository.saveProcedureReceipt(newProcReceipt, currentUser);
      onSaveProcedure(saved);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-teal-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-teal-200" />
            <div>
              <h2 className="font-bold text-sm">
                {isUrdu ? 'نئی کمپیوٹرائزڈ رسید جاری کریں' : 'Issue Digital Receipt'}
              </h2>
              <span className="text-[11px] text-teal-200 font-mono">
                {receiptType === 'fee' ? 'Consultation Fee' : 'Procedure Charges'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-teal-100 hover:bg-teal-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Toggle Type */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setReceiptType('fee')}
              className={`flex-1 py-2 rounded-lg font-bold transition text-center ${
                receiptType === 'fee'
                  ? 'bg-white text-teal-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isUrdu ? 'معائنہ و مشاورت فیس' : 'Consultation Fee'}
            </button>
            <button
              type="button"
              onClick={() => setReceiptType('procedure')}
              className={`flex-1 py-2 rounded-lg font-bold transition text-center ${
                receiptType === 'procedure'
                  ? 'bg-white text-teal-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isUrdu ? 'پروسیجر چارجز' : 'Procedure Charges'}
            </button>
          </div>

          {/* Patient Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {isUrdu ? 'مریض کا انتخاب کریں' : 'Patient'} *
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-900"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.mrNumber}) — {p.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Form branch: Consultation Fee */}
          {receiptType === 'fee' ? (
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Consultation Fee ({settings.currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={consultationFee}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setConsultationFee(v);
                      setFeePaidAmount(Math.max(0, v - feeDiscount));
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Discount ({settings.currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={feeDiscount}
                    onChange={(e) => {
                      const d = Number(e.target.value);
                      setFeeDiscount(d);
                      setFeePaidAmount(Math.max(0, consultationFee - d));
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-rose-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Paid Amount ({settings.currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={feePaidAmount}
                    onChange={(e) => setFeePaidAmount(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={feePaymentMethod}
                    onChange={(e) => setFeePaymentMethod(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2"
                  >
                    <option value="Cash">Cash (نقد)</option>
                    <option value="Bank">Bank Transfer / Raast</option>
                    <option value="Card">Debit / Credit Card</option>
                    <option value="Online">Online / EasyPaisa / JazzCash</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Live Fee Calculation summary */}
              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex items-center justify-between text-xs font-semibold text-emerald-900">
                <span>Net Total: {feeNetTotal} {settings.currency}</span>
                <span>Paid: {feePaidAmount} {settings.currency}</span>
                <span>Balance Due: {feeBalance} {settings.currency}</span>
              </div>
            </div>
          ) : (
            /* Form branch: Procedure Charges */
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-[11px] uppercase">
                  Procedures List
                </span>
                <button
                  type="button"
                  onClick={handleAddProcedureRow}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-900"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Another Procedure</span>
                </button>
              </div>

              {procedures.map((proc, i) => (
                <div
                  key={proc.id || i}
                  className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-[11px]">Procedure #{i + 1}</span>
                    {procedures.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProcedureRow(i)}
                        className="text-rose-500 hover:text-rose-700 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Procedure name (e.g. Nebulization, ECG, Blood Sugar...)"
                        value={proc.name}
                        onChange={(e) => handleUpdateProcedure(i, 'name', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 font-medium"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Charges"
                        value={proc.charges}
                        onChange={(e) =>
                          handleUpdateProcedure(i, 'charges', Number(e.target.value))
                        }
                        className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Paid Amount</label>
                  <input
                    type="number"
                    min="0"
                    value={procedurePaidAmount}
                    onChange={(e) => setProcedurePaidAmount(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-emerald-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={procedurePaymentMethod}
                    onChange={(e) => setProcedurePaymentMethod(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2"
                  >
                    <option value="Cash">Cash (نقد)</option>
                    <option value="Bank">Bank Transfer / Raast</option>
                    <option value="Card">Debit / Credit Card</option>
                    <option value="Online">Online / EasyPaisa / JazzCash</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Procedure Calculation summary */}
              <div className="bg-sky-50 p-2.5 rounded-lg border border-sky-200 flex items-center justify-between text-xs font-semibold text-sky-900">
                <span>Net Total: {procNetPayable} {settings.currency}</span>
                <span>Paid: {procedurePaidAmount} {settings.currency}</span>
                <span>Balance: {procBalance} {settings.currency}</span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Receipt Remarks / Notes</label>
            <input
              type="text"
              placeholder="e.g. Follow-up consultation waived, spot payment..."
              value={receiptType === 'fee' ? feeNotes : procedureNotes}
              onChange={(e) =>
                receiptType === 'fee'
                  ? setFeeNotes(e.target.value)
                  : setProcedureNotes(e.target.value)
              }
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 font-medium text-slate-600 hover:bg-slate-50"
            >
              {isUrdu ? 'منسوخ' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 active:scale-95 shadow-md flex items-center gap-1.5 transition"
            >
              <Save className="w-4 h-4" />
              <span>{isUrdu ? 'رسید جاری کریں' : 'Generate Digital Receipt'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
