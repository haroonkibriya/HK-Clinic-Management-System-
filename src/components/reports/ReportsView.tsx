import React, { useState } from 'react';
import {
  BarChart3,
  DollarSign,
  Users,
  FileSignature,
  Calendar,
  Printer,
  TrendingUp,
  Download,
  Filter,
} from 'lucide-react';
import {
  Patient,
  Prescription,
  FeeReceipt,
  ProcedureReceipt,
  Appointment,
  ClinicSettings,
} from '../../types';

interface ReportsViewProps {
  patients: Patient[];
  prescriptions: Prescription[];
  feeReceipts: FeeReceipt[];
  procedureReceipts: ProcedureReceipt[];
  appointments: Appointment[];
  settings: ClinicSettings;
  isUrdu: boolean;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  patients,
  prescriptions,
  feeReceipts,
  procedureReceipts,
  appointments,
  settings,
  isUrdu,
}) => {
  const [reportTab, setReportTab] = useState<'financial' | 'patients' | 'clinical'>('financial');

  // Financial aggregates
  const totalConsultationFees = feeReceipts.reduce((sum, r) => sum + r.consultationFee, 0);
  const totalFeeDiscounts = feeReceipts.reduce((sum, r) => sum + r.discount, 0);
  const totalFeeCollected = feeReceipts.reduce((sum, r) => sum + r.paidAmount, 0);
  const totalFeeBalance = feeReceipts.reduce((sum, r) => sum + r.balance, 0);

  const totalProcedureCharges = procedureReceipts.reduce((sum, r) => sum + r.totalCharges, 0);
  const totalProcedureDiscounts = procedureReceipts.reduce((sum, r) => sum + r.totalDiscount, 0);
  const totalProcedureCollected = procedureReceipts.reduce((sum, r) => sum + r.paidAmount, 0);
  const totalProcedureBalance = procedureReceipts.reduce((sum, r) => sum + r.balance, 0);

  const netClinicCollection = totalFeeCollected + totalProcedureCollected;
  const netOutstandingBalance = totalFeeBalance + totalProcedureBalance;

  // Prescriptions stats
  const medicineFrequencyMap: Record<string, number> = {};
  prescriptions.forEach((r) => {
    r.medicines.forEach((m) => {
      medicineFrequencyMap[m.brandName] = (medicineFrequencyMap[m.brandName] || 0) + 1;
    });
  });
  const topMedicines = Object.entries(medicineFrequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Demographics
  const maleCount = patients.filter((p) => p.gender === 'Male').length;
  const femaleCount = patients.filter((p) => p.gender === 'Female').length;
  const otherCount = patients.filter((p) => p.gender === 'Other').length;

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Report Tabs */}
      <div className="no-print bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-teal-600" />
          <div>
            <h1 className="font-bold text-sm text-slate-800">
              {isUrdu ? 'کلینک کی جامع رپورٹس و شماریات' : 'Clinic Analytics & Reports'}
            </h1>
            <p className="text-[11px] text-slate-500">
              Generated from local persistent offline database
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setReportTab('financial')}
              className={`px-3 py-1.5 rounded-lg transition ${
                reportTab === 'financial'
                  ? 'bg-white text-teal-800 shadow-2xs'
                  : 'text-slate-600'
              }`}
            >
              Financial (مالی حسابات)
            </button>
            <button
              onClick={() => setReportTab('patients')}
              className={`px-3 py-1.5 rounded-lg transition ${
                reportTab === 'patients'
                  ? 'bg-white text-teal-800 shadow-2xs'
                  : 'text-slate-600'
              }`}
            >
              Patients (مریضوں کی شماریات)
            </button>
            <button
              onClick={() => setReportTab('clinical')}
              className={`px-3 py-1.5 rounded-lg transition ${
                reportTab === 'clinical'
                  ? 'bg-white text-teal-800 shadow-2xs'
                  : 'text-slate-600'
              }`}
            >
              Rx & Medicines (نسخہ شماریات)
            </button>
          </div>

          <button
            onClick={handlePrintReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Financial Report Tab */}
      {reportTab === 'financial' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Total Net Collections
              </span>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-1">
                {netClinicCollection.toLocaleString()} {settings.currency}
              </div>
              <span className="text-[10px] text-emerald-800 font-medium">
                {feeReceipts.length} consultation + {procedureReceipts.length} procedure receipts
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Total Discounts Granted
              </span>
              <div className="text-2xl font-black text-rose-700 font-mono mt-1">
                {(totalFeeDiscounts + totalProcedureDiscounts).toLocaleString()} {settings.currency}
              </div>
              <span className="text-[10px] text-slate-500">Subsidies & concessions</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Outstanding Balance Receivable
              </span>
              <div className="text-2xl font-black text-amber-700 font-mono mt-1">
                {netOutstandingBalance.toLocaleString()} {settings.currency}
              </div>
              <span className="text-[10px] text-amber-800 font-medium">Pending payments</span>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h2 className="font-bold text-xs uppercase text-slate-800 tracking-wider">
              Revenue Breakdown Summary
            </h2>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold">
                  <th className="py-2">Category</th>
                  <th className="py-2 text-right">Gross Total</th>
                  <th className="py-2 text-right">Discounts</th>
                  <th className="py-2 text-right">Net Received</th>
                  <th className="py-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr>
                  <td className="py-2.5 font-sans font-medium text-slate-800">
                    Consultation Fees
                  </td>
                  <td className="py-2.5 text-right">{totalConsultationFees.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-rose-600">
                    {totalFeeDiscounts.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right font-bold text-emerald-800">
                    {totalFeeCollected.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right text-amber-700">
                    {totalFeeBalance.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-medium text-slate-800">
                    Procedure Charges
                  </td>
                  <td className="py-2.5 text-right">{totalProcedureCharges.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-rose-600">
                    {totalProcedureDiscounts.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right font-bold text-emerald-800">
                    {totalProcedureCollected.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right text-amber-700">
                    {totalProcedureBalance.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Patients Report Tab */}
      {reportTab === 'patients' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">
              Total Registered
            </span>
            <div className="text-3xl font-black text-slate-900 font-mono mt-1">
              {patients.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Active electronic medical records</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">
              Gender Distribution
            </span>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Male:</span>
                <strong className="font-mono">{maleCount} ({Math.round((maleCount / (patients.length || 1)) * 100)}%)</strong>
              </div>
              <div className="flex justify-between">
                <span>Female:</span>
                <strong className="font-mono">{femaleCount} ({Math.round((femaleCount / (patients.length || 1)) * 100)}%)</strong>
              </div>
              {otherCount > 0 && (
                <div className="flex justify-between">
                  <span>Other:</span>
                  <strong className="font-mono">{otherCount}</strong>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">
              Appointments Status
            </span>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Confirmed:</span>
                <strong className="font-mono text-emerald-700">
                  {appointments.filter((a) => a.status === 'Confirmed').length}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Pending:</span>
                <strong className="font-mono text-amber-700">
                  {appointments.filter((a) => a.status === 'Pending').length}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <strong className="font-mono text-blue-700">
                  {appointments.filter((a) => a.status === 'Completed').length}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clinical / Prescriptions Report Tab */}
      {reportTab === 'clinical' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <h2 className="font-bold text-xs uppercase text-slate-800 tracking-wider">
            Most Frequently Prescribed Formulations
          </h2>
          <div className="space-y-2">
            {topMedicines.map(([name, count], idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold text-[11px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-800">{name}</span>
                </div>
                <span className="font-mono font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200 text-[11px]">
                  {count} Prescriptions
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
