import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Phone,
  FileSignature,
  Receipt,
  Eye,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Patient, UserRole } from '../../types';

interface PatientListProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onNewPatient: () => void;
  onNewPrescription: (patient: Patient) => void;
  onNewReceipt: (patient: Patient) => void;
  isUrdu: boolean;
  role: UserRole;
}

export const PatientList: React.FC<PatientListProps> = ({
  patients,
  onSelectPatient,
  onNewPatient,
  onNewPrescription,
  onNewReceipt,
  isUrdu,
  role,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Male' | 'Female'>('All');

  // Real-time search filter matching PRD Section 7
  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.mrNumber.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      (p.whatsapp && p.whatsapp.includes(q)) ||
      (p.fatherOrHusbandName && p.fatherOrHusbandName.toLowerCase().includes(q)) ||
      (p.address && p.address.toLowerCase().includes(q)) ||
      (p.city && p.city.toLowerCase().includes(q));

    const matchesGender = genderFilter === 'All' || p.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  return (
    <div className="space-y-4">
      {/* Top Action Bar with Real-time Search */}
      <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-slate-200/80 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                isUrdu
                  ? 'مریض تلاش کریں: نام، ایم آر نمبر، فون، پتہ، والد کا نام...'
                  : 'Fast search by Name, MR#, Phone, Address, Father/Husband...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Gender filter */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 mx-1" />
              {(['All', 'Male', 'Female'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGenderFilter(g)}
                  className={`px-2 py-1 rounded-lg transition text-[11px] ${
                    genderFilter === g
                      ? 'bg-white text-teal-800 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {g === 'All' ? (isUrdu ? 'تمام' : 'All') : g === 'Male' ? (isUrdu ? 'مرد' : 'Male') : (isUrdu ? 'عورت' : 'Female')}
                </button>
              ))}
            </div>

            {/* New Patient Registration Button */}
            <button
              onClick={onNewPatient}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-semibold rounded-xl text-xs shadow-sm transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isUrdu ? 'نیا مریض' : 'New Patient'}</span>
            </button>
          </div>
        </div>

        {/* Count summary */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span>
            {isUrdu
              ? `کل رجسٹرڈ مریض: ${patients.length} | تلاش کے نتائج: ${filteredPatients.length}`
              : `Total Registered Patients: ${patients.length} | Found: ${filteredPatients.length}`}
          </span>
          <span className="text-teal-700 font-medium">
            {isUrdu ? 'آف لائن ڈیٹا بیس' : 'Offline Persistent Database'}
          </span>
        </div>
      </div>

      {/* Patient Card Grid / List */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
          <p className="text-sm font-semibold text-slate-600">
            {isUrdu ? 'کوئی مریض نہیں ملا' : 'No patients matched your search criteria.'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {isUrdu ? 'نیا مریض درج کرنے کے لیے بٹن دبائیں۔' : 'Try a different keyword or register a new patient.'}
          </p>
          <button
            onClick={onNewPatient}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'نیا مریض رجسٹر کریں' : 'Register New Patient'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800 font-bold text-sm">
                      {patient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition">
                        {patient.name}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {patient.fatherOrHusbandName && `s/o, w/o ${patient.fatherOrHusbandName} • `}
                        {patient.age} yrs • {patient.gender}
                        {patient.bloodGroup && (
                          <span className="ml-1 px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 font-semibold text-[10px] border border-rose-200">
                            {patient.bloodGroup}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                    {patient.mrNumber}
                  </span>
                </div>

                {/* Contact & Address line */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="font-mono truncate">{patient.phone}</span>
                  </div>
                  <div className="text-right truncate text-slate-500">
                    {patient.city || 'Lahore'}
                  </div>
                </div>

                {patient.allergies && patient.allergies.length > 0 && (
                  <div className="mt-2 text-[10px] text-rose-700 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">
                    ⚠️ <strong>Allergies:</strong> {patient.allergies.join(', ')}
                  </div>
                )}
              </div>

              {/* Actions row */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => onSelectPatient(patient)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'پروفائل' : 'Profile'}</span>
                </button>

                {role === 'doctor' && (
                  <button
                    onClick={() => onNewPrescription(patient)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold transition"
                  >
                    <FileSignature className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'نسخہ (Rx)' : 'Write Rx'}</span>
                  </button>
                )}

                <button
                  onClick={() => onNewReceipt(patient)}
                  className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-emerald-800 border border-slate-200 text-xs font-semibold transition"
                  title="Issue Fee Receipt"
                >
                  <Receipt className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onSelectPatient(patient)}
                  className="p-1.5 text-slate-400 hover:text-teal-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
