import React, { useState } from 'react';
import {
  X,
  Save,
  Plus,
  Trash2,
  Search,
  Sliders,
  FileSignature,
  AlertCircle,
  Clock,
  Sparkles,
  HeartPulse,
} from 'lucide-react';
import {
  Patient,
  Prescription,
  MedicineItem,
  MedicineCatalogEntry,
  ClinicSettings,
} from '../../types';
import { MedicineRepository, PrescriptionRepository } from '../../database/storage';
import { UrduKeyboardHelper } from '../common/UrduKeyboardHelper';

interface PrescriptionEditorProps {
  prescription?: Prescription | null;
  patient?: Patient | null;
  patients: Patient[];
  settings: ClinicSettings;
  onSave: (prescription: Prescription) => void;
  onClose: () => void;
  isUrdu: boolean;
  currentUser: string;
}

export const PrescriptionEditor: React.FC<PrescriptionEditorProps> = ({
  prescription,
  patient: initialPatient,
  patients,
  settings,
  onSave,
  onClose,
  isUrdu,
  currentUser,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    prescription?.patientId || initialPatient?.id || patients[0]?.id || ''
  );

  const activePatient =
    patients.find((p) => p.id === selectedPatientId) || initialPatient || patients[0];

  // Clinical fields
  const [chiefComplaint, setChiefComplaint] = useState(
    prescription?.chiefComplaint || activePatient?.medicalHistory?.chiefComplaint || ''
  );
  const [diagnosis, setDiagnosis] = useState(
    prescription?.diagnosis || activePatient?.medicalHistory?.diagnosis || ''
  );
  const [examination, setExamination] = useState(
    prescription?.examination || activePatient?.medicalHistory?.examination || ''
  );
  const [investigations, setInvestigations] = useState(
    prescription?.investigations || activePatient?.medicalHistory?.investigations || ''
  );
  const [advice, setAdvice] = useState(
    prescription?.advice || activePatient?.medicalHistory?.followUpAdvice || ''
  );
  const [followUpDate, setFollowUpDate] = useState(
    prescription?.followUpDate ||
      new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );

  // Vitals
  const [bp, setBp] = useState(prescription?.vitals?.bp || '120/80');
  const [pulse, setPulse] = useState(prescription?.vitals?.pulse || '72');
  const [weight, setWeight] = useState(prescription?.vitals?.weight || '70 kg');
  const [temperature, setTemperature] = useState(prescription?.vitals?.temperature || '98.4 F');
  const [spo2, setSpo2] = useState(prescription?.vitals?.spo2 || '99%');

  // Medicines items list
  const [medicines, setMedicines] = useState<MedicineItem[]>(
    prescription?.medicines || [
      {
        id: `med-item-${Date.now()}`,
        brandName: 'Panadol',
        genericName: 'Paracetamol',
        strength: '500mg',
        dosageForm: 'Tablet',
        frequency: '1-1-1',
        duration: '5 Days',
        route: 'Oral',
        instructions: 'کھانے کے بعد استعمال کریں',
        quantity: '10 Tabs',
        notes: '',
      },
    ]
  );

  // Quick medicine search catalogue
  const catalog = MedicineRepository.getAll();
  const [medicineSearchIndex, setMedicineSearchIndex] = useState<number | null>(null);
  const [medicineSearchQuery, setMedicineSearchQuery] = useState('');
  const [activeUrduInstructionIndex, setActiveUrduInstructionIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePatientChange = (patientId: string) => {
    setSelectedPatientId(patientId);
    const pat = patients.find((p) => p.id === patientId);
    if (pat && pat.medicalHistory) {
      if (!chiefComplaint) setChiefComplaint(pat.medicalHistory.chiefComplaint || '');
      if (!diagnosis) setDiagnosis(pat.medicalHistory.diagnosis || '');
      if (!examination) setExamination(pat.medicalHistory.examination || '');
    }
  };

  const handleAddMedicineRow = () => {
    setMedicines([
      ...medicines,
      {
        id: `med-item-${Date.now()}`,
        brandName: '',
        genericName: '',
        strength: '',
        dosageForm: 'Tablet',
        frequency: '1-0-1',
        duration: '5 Days',
        route: 'Oral',
        instructions: 'کھانے کے بعد استعمال کریں',
        quantity: '10 Tabs',
        notes: '',
      },
    ]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    setMedicines(medicines.filter((_, idx) => idx !== index));
  };

  const handleUpdateMedicine = (index: number, field: keyof MedicineItem, value: string) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };

    // When Brand Name is selected or typed, check catalog for auto-generic match (Requirement 10)
    if (field === 'brandName') {
      const match = catalog.find(
        (c) => c.brandName.toLowerCase() === value.trim().toLowerCase()
      );
      if (match) {
        updated[index].genericName = match.genericName;
        if (!updated[index].strength) updated[index].strength = match.strength;
        if (!updated[index].dosageForm) updated[index].dosageForm = match.dosageForm;
      }
    }

    setMedicines(updated);
  };

  const handleSelectCatalogItem = (index: number, item: MedicineCatalogEntry) => {
    const updated = [...medicines];
    updated[index] = {
      ...updated[index],
      brandName: item.brandName,
      genericName: item.genericName,
      strength: item.strength,
      dosageForm: item.dosageForm,
    };
    setMedicines(updated);
    setMedicineSearchIndex(null);
    setMedicineSearchQuery('');
  };

  const handleUrduPhraseInsert = (phrase: string) => {
    if (activeUrduInstructionIndex !== null && medicines[activeUrduInstructionIndex]) {
      handleUpdateMedicine(activeUrduInstructionIndex, 'instructions', phrase);
    } else {
      // Append to advice
      setAdvice((prev) => (prev ? `${prev} • ${phrase}` : phrase));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) {
      setError('Please select a valid patient.');
      return;
    }
    if (medicines.length === 0) {
      setError('Please add at least one medicine.');
      return;
    }

    const cleanedMeds = medicines.filter((m) => m.brandName.trim());
    if (cleanedMeds.length === 0) {
      setError('Please enter a medicine brand or generic name.');
      return;
    }

    const rxToSave: Prescription = {
      id: prescription?.id || `rx-${Date.now()}`,
      prescriptionNumber: prescription?.prescriptionNumber || PrescriptionRepository.getNextRxNumber(),
      patientId: activePatient.id,
      patientName: activePatient.name,
      patientMrNumber: activePatient.mrNumber,
      patientAge: activePatient.age,
      patientGender: activePatient.gender,
      patientPhone: activePatient.phone,
      date: prescription?.date || new Date().toISOString().split('T')[0],
      doctorName: settings.doctorName,
      doctorQualification: settings.doctorQualification,
      doctorSpecialty: settings.doctorSpecialty,
      clinicName: settings.clinicName,
      chiefComplaint: chiefComplaint.trim(),
      vitals: {
        bp,
        pulse,
        weight,
        temperature,
        spo2,
      },
      examination: examination.trim(),
      diagnosis: diagnosis.trim(),
      investigations: investigations.trim(),
      medicines: cleanedMeds,
      advice: advice.trim(),
      followUpDate: followUpDate || undefined,
      verificationCode: prescription?.verificationCode || `HK-VER-${Math.floor(1000 + Math.random() * 9000)}`,
      templateType: prescription?.templateType || 'builtin',
      pageSetup: prescription?.pageSetup || settings.defaultPageSetup,
      createdAt: prescription?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: prescription?.createdBy || currentUser,
    };

    const saved = PrescriptionRepository.save(rxToSave, currentUser);
    onSave(saved);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-teal-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-teal-200" />
            <div>
              <h2 className="font-bold text-sm">
                {prescription
                  ? isUrdu
                    ? 'نسخہ میں ترمیم کریں (Versioned)'
                    : 'Edit Prescription (Version Preserved)'
                  : isUrdu
                  ? 'نیا نسخہ لکھیں'
                  : 'Write Clinical Prescription'}
              </h2>
              <span className="text-[11px] text-teal-200">
                {prescription ? prescription.prescriptionNumber : 'New Rx'} • {settings.doctorName}
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Patient Selection & Identity */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                {isUrdu ? 'مریض کا انتخاب کریں' : 'Select Patient'} *
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => handlePatientChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white font-semibold text-slate-800"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.mrNumber}) — {p.age}y {p.gender} • {p.phone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isUrdu ? 'تاریخ' : 'Prescription Date'}
              </label>
              <input
                type="date"
                value={prescription?.date || new Date().toISOString().split('T')[0]}
                disabled
                className="w-full rounded-lg border border-slate-200 p-2 text-xs bg-slate-100 font-mono text-slate-600"
              />
            </div>
          </div>

          {/* Patient Quick Medical Alert Pill */}
          {activePatient?.allergies && activePatient.allergies.length > 0 && (
            <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800 font-medium">
              ⚠️ <strong>Patient Allergies:</strong> {activePatient.allergies.join(', ')}
            </div>
          )}

          {/* Section 2: Vitals & Clinical Examination */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-900 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
                <span>{isUrdu ? 'وائٹلز اور علامات' : 'Vitals & Chief Complaint'}</span>
              </span>
            </div>

            {/* Quick vitals row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
              <div>
                <label className="text-slate-500 font-semibold block mb-0.5">BP</label>
                <input
                  type="text"
                  placeholder="120/80"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-0.5">Pulse</label>
                <input
                  type="text"
                  placeholder="76 bpm"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-0.5">Weight</label>
                <input
                  type="text"
                  placeholder="72 kg"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-0.5">Temp</label>
                <input
                  type="text"
                  placeholder="98.6 F"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-0.5">SpO2</label>
                <input
                  type="text"
                  placeholder="98%"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'ابتدائی علامات (Chief Complaint)' : 'Chief Complaint & Symptoms'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Headache for 3 days, low grade fever..."
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'تشخیص (Diagnosis)' : 'Diagnosis'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Essential Hypertension, Acute Pharyngitis"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-teal-950"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'طبی معائنہ (Examination Notes)' : 'Physical Examination'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Throat congested, Chest clear"
                  value={examination}
                  onChange={(e) => setExamination(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'تجویز کردہ ٹیسٹ (Investigations)' : 'Recommended Investigations'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. CBC, Serum Creatinine, Fasting Blood Sugar"
                  value={investigations}
                  onChange={(e) => setInvestigations(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Prescribed Medicines (Rx) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-xl text-teal-800">℞</span>
                <span className="font-bold text-sm text-slate-800">
                  {isUrdu ? 'ادویات کا اندراج' : 'Prescribed Medicines'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px]">
                  {medicines.length} Items
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddMedicineRow}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold active:scale-95 shadow-2xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'مزید دوا شامل کریں' : 'Add Medicine'}</span>
              </button>
            </div>

            {/* Medicine Rows */}
            <div className="space-y-3">
              {medicines.map((med, index) => (
                <div
                  key={med.id || index}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2 relative"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold text-[11px] flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="font-bold text-slate-800 text-xs">
                        {med.brandName || `Medicine #${index + 1}`}
                      </span>
                      {med.genericName && (
                        <span className="text-[11px] text-teal-700 font-mono italic">
                          ({med.genericName})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setMedicineSearchIndex(medicineSearchIndex === index ? null : index);
                          setMedicineSearchQuery(med.brandName || '');
                        }}
                        className="px-2 py-1 rounded bg-teal-50 text-teal-800 text-[10px] font-semibold border border-teal-200 hover:bg-teal-100 transition"
                      >
                        Search Catalog
                      </button>

                      {medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicineRow(index)}
                          className="p-1 rounded text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Catalog quick popup dropdown for this row */}
                  {medicineSearchIndex === index && (
                    <div className="p-2.5 bg-teal-50/90 rounded-xl border border-teal-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-teal-900 text-[11px]">
                          Pick from Local Medicine Database:
                        </span>
                        <button
                          type="button"
                          onClick={() => setMedicineSearchIndex(null)}
                          className="text-slate-400 hover:text-slate-600 text-[10px]"
                        >
                          Close
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Search brand (Panadol, Augmentin, Risek, Brufen...)"
                        value={medicineSearchQuery}
                        onChange={(e) => setMedicineSearchQuery(e.target.value)}
                        className="w-full bg-white border border-teal-300 rounded p-1.5 text-xs"
                      />
                      <div className="max-h-36 overflow-y-auto space-y-1">
                        {catalog
                          .filter(
                            (c) =>
                              !medicineSearchQuery ||
                              c.brandName.toLowerCase().includes(medicineSearchQuery.toLowerCase()) ||
                              c.genericName.toLowerCase().includes(medicineSearchQuery.toLowerCase())
                          )
                          .slice(0, 10)
                          .map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleSelectCatalogItem(index, item)}
                              className="w-full text-left p-1.5 bg-white hover:bg-teal-100 rounded text-xs flex items-center justify-between border border-teal-100"
                            >
                              <div>
                                <strong className="text-teal-950">{item.brandName}</strong>{' '}
                                <span className="text-slate-500">({item.genericName})</span>
                              </div>
                              <span className="text-[10px] text-teal-700 font-mono font-semibold">
                                {item.dosageForm} • {item.strength}
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Medicine Row Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Brand Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Augmentin"
                        value={med.brandName}
                        onChange={(e) => handleUpdateMedicine(index, 'brandName', e.target.value)}
                        className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded p-1.5 font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Generic Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Amoxicillin+Clavulanate"
                        value={med.genericName}
                        onChange={(e) => handleUpdateMedicine(index, 'genericName', e.target.value)}
                        className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded p-1.5 text-slate-700 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Strength
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 625mg / 10mg"
                        value={med.strength}
                        onChange={(e) => handleUpdateMedicine(index, 'strength', e.target.value)}
                        className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded p-1.5 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Dosage Form
                      </label>
                      <select
                        value={med.dosageForm}
                        onChange={(e) => handleUpdateMedicine(index, 'dosageForm', e.target.value)}
                        className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded p-1.5 text-slate-800"
                      >
                        <option value="Tablet">Tablet (گولی)</option>
                        <option value="Capsule">Capsule (کیپسول)</option>
                        <option value="Syrup">Syrup (شربت)</option>
                        <option value="Suspension">Suspension</option>
                        <option value="Injection">Injection (ٹیکہ)</option>
                        <option value="Cream">Cream / Ointment (مرہم)</option>
                        <option value="Drops">Eye/Ear Drops (قطرے)</option>
                        <option value="Inhaler">Inhaler</option>
                        <option value="Sachet">Sachet</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs pt-1">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Frequency (Dose)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1-0-1 or Twice daily"
                        value={med.frequency}
                        onChange={(e) => handleUpdateMedicine(index, 'frequency', e.target.value)}
                        className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded p-1.5 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Duration
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5 Days / 1 Month"
                        value={med.duration}
                        onChange={(e) => handleUpdateMedicine(index, 'duration', e.target.value)}
                        className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded p-1.5 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Quantity
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 10 Tabs / 1 Bottle"
                        value={med.quantity}
                        onChange={(e) => handleUpdateMedicine(index, 'quantity', e.target.value)}
                        className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded p-1.5 text-slate-800"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="text-[10px] font-semibold text-teal-800">
                          Urdu Instruction (ہدایات)
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveUrduInstructionIndex(
                              activeUrduInstructionIndex === index ? null : index
                            )
                          }
                          className="text-[10px] text-teal-600 font-urdu hover:underline"
                        >
                          نستعلیق کی بورڈ
                        </button>
                      </div>
                      <input
                        type="text"
                        dir="rtl"
                        placeholder="کھانے کے بعد استعمال کریں"
                        value={med.instructions}
                        onChange={(e) => handleUpdateMedicine(index, 'instructions', e.target.value)}
                        className="w-full bg-teal-50/50 focus:bg-white border border-teal-200 rounded p-1.5 text-xs font-urdu text-teal-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Urdu Keyboard Helper */}
          <UrduKeyboardHelper
            onSelectPhrase={handleUrduPhraseInsert}
            label={
              activeUrduInstructionIndex !== null
                ? `Click to apply Urdu phrase to Medicine #${activeUrduInstructionIndex + 1}`
                : 'Click to add advice in Urdu Nastaliq'
            }
          />

          {/* Section 4: General Advice & Follow-up */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                {isUrdu ? 'پرہیز و دیگر ہدایات (Advice)' : 'General Advice & Precautions'}
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Avoid salty food, drink plenty of water, 30 min daily brisk walk..."
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>{isUrdu ? 'دوبارہ معائنے کی تاریخ' : 'Follow-up Date'}</span>
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Default: 7 days from today
              </span>
            </div>
          </div>

          {/* Footer Save & Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              {isUrdu ? 'منسوخ' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 font-bold text-white hover:bg-teal-700 active:scale-95 shadow-md flex items-center gap-1.5 transition"
            >
              <Save className="w-4 h-4" />
              <span>{isUrdu ? 'نسخہ محفوظ کریں' : 'Save & Preview Rx'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
