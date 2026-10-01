import React, { useState } from 'react';
import { ShieldCheck, User, Stethoscope, Lock, Check } from 'lucide-react';
import { UserRole, Patient } from '../../types';
import { AuditRepository } from '../../database/storage';

interface LoginModalProps {
  currentRole: UserRole;
  currentPatientId?: string;
  patients: Patient[];
  onSelectRole: (role: UserRole, name: string, patientId?: string) => void;
  onClose: () => void;
  isUrdu: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  currentRole,
  currentPatientId,
  patients,
  onSelectRole,
  onClose,
  isUrdu,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    currentPatientId || patients[0]?.id || ''
  );
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'doctor') {
      onSelectRole('doctor', 'Dr. Haroon Kibriya');
      AuditRepository.log('Dr. Haroon Kibriya', 'USER_LOGIN', 'Doctor session activated', 'doctor');
    } else if (selectedRole === 'assistant') {
      onSelectRole('assistant', 'Clinic Assistant (Staff)');
      AuditRepository.log('Clinic Assistant', 'USER_LOGIN', 'Assistant session activated', 'assistant');
    } else {
      const pat = patients.find((p) => p.id === selectedPatientId) || patients[0];
      onSelectRole('patient', pat.name, pat.id);
      AuditRepository.log(pat.name, 'USER_LOGIN', `Patient portal opened for ${pat.name} (${pat.mrNumber})`, 'patient');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-teal-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-200" />
            <div>
              <h2 className="font-bold text-sm">
                {isUrdu ? 'صارف کا کردار منتخب کریں' : 'Switch User Role / Session'}
              </h2>
              <span className="text-[10px] text-teal-200">
                Offline role-based access & patient privacy isolation
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-teal-200 hover:text-white text-sm">
            ✕
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleConfirm} className="p-5 space-y-4 text-xs">
          <div className="space-y-2">
            {/* Role Option 1: Doctor */}
            <div
              onClick={() => setSelectedRole('doctor')}
              className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                selectedRole === 'doctor'
                  ? 'bg-teal-50 border-teal-300 shadow-2xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">Doctor / Administrator</h3>
                  <p className="text-[11px] text-slate-500">
                    Full access: Prescriptions, clinical history, medicines, settings, backup
                  </p>
                </div>
              </div>
              {selectedRole === 'doctor' && <Check className="w-4 h-4 text-teal-600" />}
            </div>

            {/* Role Option 2: Clinic Assistant */}
            <div
              onClick={() => setSelectedRole('assistant')}
              className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                selectedRole === 'assistant'
                  ? 'bg-teal-50 border-teal-300 shadow-2xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-700 text-white flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">Clinic Assistant</h3>
                  <p className="text-[11px] text-slate-500">
                    Staff access: Registration, search, appointments, fee & procedure receipts
                  </p>
                </div>
              </div>
              {selectedRole === 'assistant' && <Check className="w-4 h-4 text-teal-600" />}
            </div>

            {/* Role Option 3: Patient */}
            <div
              onClick={() => setSelectedRole('patient')}
              className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                selectedRole === 'patient'
                  ? 'bg-teal-50 border-teal-300 shadow-2xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">Patient Access</h3>
                  <p className="text-[11px] text-slate-500">
                    Isolated portal: Only view own visit bookings, prescriptions, and receipts
                  </p>
                </div>
              </div>
              {selectedRole === 'patient' && <Check className="w-4 h-4 text-teal-600" />}
            </div>
          </div>

          {/* If Patient selected, allow picking which patient identity to simulate/open */}
          {selectedRole === 'patient' && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
              <label className="block font-semibold text-emerald-950 text-xs">
                Select Patient Identity:
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-xs font-semibold text-slate-900"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.mrNumber}) — {p.phone}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-emerald-800 block">
                Security Rule: In patient mode, all other patient records are strictly isolated.
              </span>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 active:scale-95 shadow-md transition"
            >
              Activate Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
