import React, { useState } from 'react';
import { X, Save, User, Phone, MapPin, AlertCircle, FileText } from 'lucide-react';
import { Patient } from '../../types';
import { PatientRepository } from '../../database/storage';

interface PatientFormProps {
  patient?: Patient | null;
  onSave: (patient: Patient) => void;
  onClose: () => void;
  isUrdu: boolean;
  currentUser: string;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  patient,
  onSave,
  onClose,
  isUrdu,
  currentUser,
}) => {
  const [mrNumber] = useState<string>(
    patient ? patient.mrNumber : PatientRepository.getNextMrNumber()
  );
  const [name, setName] = useState(patient?.name || '');
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState(patient?.fatherOrHusbandName || '');
  const [age, setAge] = useState<number | string>(patient?.age ?? '');
  const [dob, setDob] = useState(patient?.dob || '');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(patient?.gender || 'Male');
  const [phone, setPhone] = useState(patient?.phone || '');
  const [whatsapp, setWhatsapp] = useState(patient?.whatsapp || '');
  const [address, setAddress] = useState(patient?.address || '');
  const [city, setCity] = useState(patient?.city || 'Lahore');
  const [email, setEmail] = useState(patient?.email || '');
  const [bloodGroup, setBloodGroup] = useState(patient?.bloodGroup || 'B+');
  const [emergencyContact, setEmergencyContact] = useState(patient?.emergencyContact || '');
  const [notes, setNotes] = useState(patient?.notes || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(isUrdu ? 'براہ کرم مریض کا نام درج کریں' : 'Please enter patient name.');
      return;
    }
    if (!phone.trim()) {
      setError(isUrdu ? 'فون نمبر درج کرنا ضروری ہے' : 'Please enter contact phone number.');
      return;
    }
    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 130) {
      setError(isUrdu ? 'براہ کرم درست عمر درج کریں' : 'Please enter a valid age.');
      return;
    }

    const newPatient: Patient = {
      id: patient?.id || `pat-${Date.now()}`,
      mrNumber,
      name: name.trim(),
      fatherOrHusbandName: fatherOrHusbandName.trim(),
      age: ageNum,
      dob: dob || undefined,
      gender,
      phone: phone.trim(),
      whatsapp: (whatsapp || phone).trim(),
      address: address.trim(),
      city: city.trim(),
      email: email.trim() || undefined,
      bloodGroup,
      emergencyContact: emergencyContact.trim() || undefined,
      registrationDate: patient?.registrationDate || new Date().toISOString(),
      notes: notes.trim() || undefined,
      allergies: patient?.allergies || [],
      medicalHistory: patient?.medicalHistory || {
        chiefComplaint: '',
        symptoms: '',
        examination: '',
        diagnosis: '',
        updatedAt: new Date().toISOString(),
      },
    };

    const saved = PatientRepository.save(newPatient, currentUser);
    onSave(saved);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-teal-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-teal-200" />
            <div>
              <h2 className="font-bold text-base leading-tight">
                {patient
                  ? isUrdu
                    ? 'مریض کی تفصیلات میں ترمیم'
                    : 'Edit Patient Details'
                  : isUrdu
                  ? 'نیا مریض رجسٹر کریں'
                  : 'Fast Patient Registration'}
              </h2>
              <span className="text-xs text-teal-200 font-mono tracking-wider">
                MR: {mrNumber}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-teal-100 hover:bg-teal-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section: Basic Identity */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-800 text-[13px] flex items-center gap-1.5">
              <User className="w-4 h-4 text-teal-600" />
              <span>{isUrdu ? 'بنیادی معلومات' : 'Personal Information'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'مریض کا نام' : 'Patient Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Tariq"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'والد / شوہر کا نام' : "Father / Husband's Name"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Abdul Rehman"
                  value={fatherOrHusbandName}
                  onChange={(e) => setFatherOrHusbandName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'عمر (سال)' : 'Age (Years)'} *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="125"
                    required
                    placeholder="45"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'جنس' : 'Gender'}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-teal-500 focus:outline-none bg-white"
                  >
                    <option value="Male">{isUrdu ? 'مرد (Male)' : 'Male'}</option>
                    <option value="Female">{isUrdu ? 'عورت (Female)' : 'Female'}</option>
                    <option value="Other">{isUrdu ? 'دیگر (Other)' : 'Other'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'تاریخ پیدائش' : 'Date of Birth'}
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-teal-500 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'بلڈ گروپ' : 'Blood Group'}
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-teal-500 focus:outline-none bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Contact & Location */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-800 text-[13px] flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-teal-600" />
              <span>{isUrdu ? 'رابطہ و پتہ' : 'Contact & Address'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'موبائل فون نمبر' : 'Phone Number'} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+92 300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-teal-500 focus:outline-none bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'واٹس ایپ نمبر' : 'WhatsApp Number'}
                </label>
                <input
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-teal-500 focus:outline-none bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'ایمرجنسی رابطہ' : 'Emergency Contact'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. +92 300 9876543 (Brother)"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-teal-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'ای میل' : 'Email Address'}
                </label>
                <input
                  type="email"
                  placeholder="patient@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-teal-500 focus:outline-none bg-white"
                />
              </div>

              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'مکمل پتہ' : 'Street / Home Address'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. House 14, Street 3, Block C"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-teal-500 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'شہر' : 'City'}
                  </label>
                  <input
                    type="text"
                    placeholder="Lahore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-teal-500 focus:outline-none bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>{isUrdu ? 'خصوصی طبی نوٹ / الرجی' : 'General Notes & Known Allergies'}</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Known hypertensive, allergic to penicillin..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-teal-500 focus:outline-none bg-white"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              {isUrdu ? 'منسوخ' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 font-semibold text-white hover:bg-teal-700 active:scale-95 shadow-md flex items-center gap-1.5 transition"
            >
              <Save className="w-4 h-4" />
              <span>{isUrdu ? 'مریض محفوظ کریں' : 'Save Patient'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
