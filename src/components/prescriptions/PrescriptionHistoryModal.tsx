import React, { useState } from 'react';
import { X, History, Clock, User, CheckCircle2, ChevronRight } from 'lucide-react';
import { Prescription, PrescriptionVersion } from '../../types';

interface PrescriptionHistoryModalProps {
  prescription: Prescription;
  onClose: () => void;
  isUrdu: boolean;
}

export const PrescriptionHistoryModal: React.FC<PrescriptionHistoryModalProps> = ({
  prescription,
  onClose,
  isUrdu,
}) => {
  const versions = prescription.versions || [];
  const [selectedVersion, setSelectedVersion] = useState<PrescriptionVersion>(
    versions[versions.length - 1] || {
      version: 1,
      timestamp: prescription.updatedAt,
      modifiedBy: prescription.createdBy,
      medicines: prescription.medicines,
      diagnosis: prescription.diagnosis,
      clinicalNotes: prescription.examination,
      advice: prescription.advice,
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-teal-800 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-teal-300" />
            <div>
              <h2 className="font-bold text-sm">
                {isUrdu ? 'نسخہ کی تاریخ و ترامیم (ورژنز)' : 'Prescription Revision History'}
              </h2>
              <span className="text-[11px] text-teal-200 font-mono">
                {prescription.prescriptionNumber} • Patient: {prescription.patientName}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Version List Sidebar */}
          <div className="sm:col-span-1 border-r border-slate-200 pr-3 space-y-2">
            <h3 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              {isUrdu ? 'تمام ورژنز' : 'Versions Timeline'}
            </h3>
            {versions.map((ver) => {
              const isSelected = selectedVersion.version === ver.version;
              return (
                <button
                  key={ver.version}
                  onClick={() => setSelectedVersion(ver)}
                  className={`w-full text-left p-2.5 rounded-xl border transition ${
                    isSelected
                      ? 'bg-teal-50 border-teal-300 text-teal-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Version {ver.version}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(ver.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                    <User className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{ver.modifiedBy}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Version Details View */}
          <div className="sm:col-span-2 space-y-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-xs">
                  Version {selectedVersion.version} Details
                </span>
                <p className="text-[11px] text-slate-500">
                  Modified by <strong className="text-slate-700">{selectedVersion.modifiedBy}</strong> on{' '}
                  {new Date(selectedVersion.timestamp).toLocaleString()}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px]">
                {selectedVersion.medicines.length} Medicines
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Diagnosis recorded:</label>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800 font-medium">
                {selectedVersion.diagnosis || 'None'}
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Medicines in this version:</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {selectedVersion.medicines.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg border border-slate-200 bg-white flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-teal-900">{m.brandName}</span>{' '}
                      <span className="text-slate-500 font-mono text-[10px]">({m.genericName} - {m.strength})</span>
                      <p className="text-[10px] text-slate-600">
                        {m.dosageForm} • {m.frequency} • {m.duration}
                      </p>
                    </div>
                    {m.instructions && (
                      <span className="font-urdu text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded" dir="rtl">
                        {m.instructions}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedVersion.advice && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Advice & Instructions:</label>
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-slate-700">
                  {selectedVersion.advice}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-900 transition"
          >
            {isUrdu ? 'بند کریں' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
