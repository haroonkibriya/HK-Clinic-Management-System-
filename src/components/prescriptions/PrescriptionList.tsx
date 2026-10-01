import React, { useState } from 'react';
import { Search, FileSignature, Clock, Printer, ChevronRight, Filter } from 'lucide-react';
import { Prescription, UserRole } from '../../types';

interface PrescriptionListProps {
  prescriptions: Prescription[];
  onSelectPrescription: (prescription: Prescription) => void;
  onNewPrescription: () => void;
  isUrdu: boolean;
  role: UserRole;
}

export const PrescriptionList: React.FC<PrescriptionListProps> = ({
  prescriptions,
  onSelectPrescription,
  onNewPrescription,
  isUrdu,
  role,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = prescriptions.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.prescriptionNumber.toLowerCase().includes(q) ||
      r.patientName.toLowerCase().includes(q) ||
      r.patientMrNumber.toLowerCase().includes(q) ||
      (r.diagnosis && r.diagnosis.toLowerCase().includes(q)) ||
      r.medicines.some((m) => m.brandName.toLowerCase().includes(q) || m.genericName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Top Search & Create Bar */}
      <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              isUrdu
                ? 'نسخہ تلاش کریں: مریض کا نام، Rx نمبر، ایم آر، دوا...'
                : 'Search prescriptions by Patient, Rx#, MR#, Diagnosis, Medicine...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {role === 'doctor' && (
          <button
            onClick={onNewPrescription}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-semibold rounded-xl text-xs shadow-sm transition"
          >
            <FileSignature className="w-4 h-4" />
            <span>{isUrdu ? 'نیا نسخہ لکھیں' : 'Write Prescription'}</span>
          </button>
        )}
      </div>

      {/* Prescription List Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
          No prescriptions found matching your search.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((rx) => (
            <div
              key={rx.id}
              onClick={() => onSelectPrescription(rx)}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-300 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-xs bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-lg">
                    {rx.prescriptionNumber}
                  </span>
                  <span className="font-bold text-xs text-slate-900 group-hover:text-teal-700 transition">
                    {rx.patientName}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    ({rx.patientMrNumber})
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 ml-auto sm:ml-0">
                    <Clock className="w-3 h-3" />
                    {rx.date}
                  </span>
                  {rx.versions && rx.versions.length > 1 && (
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-bold border border-indigo-200">
                      v{rx.versions.length}
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-slate-700">
                  Diagnosis: <span className="text-teal-900">{rx.diagnosis || 'Routine Follow-up'}</span>
                </p>

                <p className="text-[11px] text-slate-500">
                  {rx.medicines.length} Medicines: {rx.medicines.map((m) => m.brandName).join(', ')}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span className="text-xs font-semibold text-teal-700 flex items-center gap-1 group-hover:underline">
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'دیکھیں و پرنٹ کریں' : 'View / Print'}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
