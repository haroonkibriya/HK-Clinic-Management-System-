import React, { useState, useEffect } from 'react';
import { X, Printer, Check, Share2, Receipt, ShieldCheck } from 'lucide-react';
import { FeeReceipt, ProcedureReceipt, ClinicSettings } from '../../types';
import { generateQrDataUrl } from '../../services/qrService';

interface ReceiptPrintModalProps {
  receipt: FeeReceipt | ProcedureReceipt;
  type: 'fee' | 'procedure';
  settings: ClinicSettings;
  onClose: () => void;
  isUrdu: boolean;
}

export const ReceiptPrintModal: React.FC<ReceiptPrintModalProps> = ({
  receipt,
  type,
  settings,
  onClose,
  isUrdu,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    async function loadQr() {
      const qrData = `HK-CLINIC-RECEIPT:${receipt.receiptNumber}:${receipt.patientMrNumber}:${receipt.verificationCode}`;
      const url = await generateQrDataUrl(qrData);
      setQrCodeUrl(url);
    }
    loadQr();
  }, [receipt]);

  const handlePrint = () => {
    window.print();
  };

  const isProcedure = type === 'procedure';
  const procReceipt = isProcedure ? (receipt as ProcedureReceipt) : null;
  const feeReceipt = !isProcedure ? (receipt as FeeReceipt) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Top Action Bar (hidden in print) */}
        <div className="no-print bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="font-bold text-sm">
                {isProcedure
                  ? isUrdu
                    ? 'پروسیجر چارجز رسید'
                    : 'Procedure Charges Receipt'
                  : isUrdu
                  ? 'معائنہ و مشاورت فیس رسید'
                  : 'Consultation Fee Receipt'}
              </h2>
              <span className="text-[11px] text-slate-300 font-mono">
                {receipt.receiptNumber}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'پرنٹ کریں' : 'Print'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 flex justify-center">
          <div
            id="printable-receipt"
            className="printable-area bg-white p-6 rounded-xl border border-slate-200 shadow-md text-slate-900 w-full max-w-md text-xs space-y-4 font-sans"
          >
            {/* Clinic Header */}
            <div className="text-center pb-3 border-b-2 border-slate-800">
              <h1 className="text-base font-black text-slate-900 tracking-tight uppercase">
                {settings.clinicName}
              </h1>
              <p className="text-[11px] font-semibold text-teal-800">
                {settings.doctorName} • {settings.doctorQualification}
              </p>
              <p className="text-[10px] text-slate-500">{settings.address}</p>
              <p className="text-[10px] text-slate-500 font-mono">Ph: {settings.phone}</p>
              <div className="mt-2 inline-block bg-slate-100 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-slate-800 border border-slate-200">
                {isProcedure ? 'PROCEDURE CHARGES RECEIPT' : 'PATIENT CONSULTATION RECEIPT'}
              </div>
            </div>

            {/* Receipt Meta & Patient Information */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">RECEIPT NO</span>
                <span className="font-mono font-bold text-slate-900">{receipt.receiptNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">DATE</span>
                <span className="font-mono font-semibold text-slate-800">{receipt.date}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">PATIENT NAME</span>
                <span className="font-bold text-slate-900">{receipt.patientName}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">MR NUMBER</span>
                <span className="font-mono font-bold text-teal-800">{receipt.patientMrNumber}</span>
              </div>
            </div>

            {/* Fee or Procedures Breakdown */}
            {isProcedure && procReceipt ? (
              <div className="space-y-2">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-300 text-[10px] text-slate-500 uppercase">
                      <th className="py-1">Procedure Description</th>
                      <th className="py-1 text-right">Charges</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {procReceipt.procedures.map((proc, idx) => (
                      <tr key={idx}>
                        <td className="py-1.5 font-medium text-slate-800">
                          {proc.name}
                          {proc.discount > 0 && (
                            <span className="block text-[10px] text-slate-400">
                              Discount: {proc.discount} {settings.currency}
                            </span>
                          )}
                        </td>
                        <td className="py-1.5 text-right font-mono text-slate-900">
                          {proc.charges} {settings.currency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-1.5 py-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Consultation Fee:</span>
                  <span className="font-mono font-semibold">
                    {feeReceipt?.consultationFee} {settings.currency}
                  </span>
                </div>
                {feeReceipt && feeReceipt.discount > 0 && (
                  <div className="flex justify-between text-xs text-rose-600">
                    <span>Discount Allowed:</span>
                    <span className="font-mono">- {feeReceipt.discount} {settings.currency}</span>
                  </div>
                )}
              </div>
            )}

            {/* Payment Summary Box */}
            <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-900 text-sm">
                <span>Net Total:</span>
                <span className="font-mono">
                  {isProcedure ? procReceipt?.netPayable : feeReceipt?.total} {settings.currency}
                </span>
              </div>
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Paid Amount ({receipt.paymentMethod}):</span>
                <span className="font-mono">{receipt.paidAmount} {settings.currency}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Outstanding Balance:</span>
                <span className="font-mono">{receipt.balance} {settings.currency}</span>
              </div>
            </div>

            {receipt.notes && (
              <div className="text-[11px] text-slate-600 italic">
                Note: {receipt.notes}
              </div>
            )}

            {/* Digital Footer Notice (PRD Section 17: Digitally generated receipt — No signature required) */}
            <div className="pt-3 border-t border-dashed border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
              <div className="space-y-1">
                <p className="font-semibold text-slate-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>{settings.receiptFooterText}</span>
                </p>
                <p className="font-urdu text-[11px] text-slate-600" dir="rtl">
                  {settings.receiptFooterTextUrdu}
                </p>
                <p className="font-mono text-[9px] text-slate-400">
                  Verification Code: {receipt.verificationCode}
                </p>
              </div>

              {qrCodeUrl && (
                <div className="text-center shrink-0">
                  <img src={qrCodeUrl} alt="Receipt QR" className="w-14 h-14 mx-auto" />
                  <span className="text-[8px] font-mono text-slate-400">Verify</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
