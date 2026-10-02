import {
  Patient,
  Prescription,
  MedicineCatalogEntry,
  FeeReceipt,
  ProcedureReceipt,
  Appointment,
  ClinicSettings,
  AuditLogEntry,
  PageSetupConfig,
  PrescriptionVersion
} from '../types';

const STORAGE_KEYS = {
  PATIENTS: 'hk_clinic_patients_v1',
  PRESCRIPTIONS: 'hk_clinic_prescriptions_v1',
  MEDICINES: 'hk_clinic_medicines_v1',
  FEE_RECEIPTS: 'hk_clinic_fee_receipts_v1',
  PROCEDURE_RECEIPTS: 'hk_clinic_procedure_receipts_v1',
  APPOINTMENTS: 'hk_clinic_appointments_v1',
  SETTINGS: 'hk_clinic_settings_v1',
  AUDIT_LOGS: 'hk_clinic_audit_logs_v1',
  SESSION: 'hk_clinic_user_session_v1',
};

export const DEFAULT_PAGE_SETUP: PageSetupConfig = {
  paperSize: 'a4',
  orientation: 'portrait',
  marginTop: 15,
  marginBottom: 15,
  marginLeft: 15,
  marginRight: 15,
  headerHeight: 45, // in mm - for letterhead top offset
  footerHeight: 25, // in mm - for letterhead bottom offset
  hideHeader: false,
  hideFooter: false,
  showQrCode: true,
  fontSize: 'medium',
};

export const DEFAULT_CLINIC_SETTINGS: ClinicSettings = {
  clinicName: 'HK Clinic Management System',
  clinicNameUrdu: 'ایچ کے کلینک مینجمنٹ سسٹم',
  tagline: 'Compassionate Care, Clinical Excellence',
  taglineUrdu: 'معیاری علاج اور دلی ہمدردی',
  doctorName: 'Dr. Haroon Kibriya',
  doctorNameUrdu: 'ڈاکٹر ہارون کبریا',
  doctorQualification: 'MBBS, FCPS (Medicine), MRCGP (Int)',
  doctorQualificationUrdu: 'ایم بی بی ایس، ایف سی پی ایس (میڈیسن)، ایم آر سی جی پی',
  doctorSpecialty: 'Consultant Physician & Family Medicine Specialist',
  doctorSpecialtyUrdu: 'کنسلٹنٹ فزیشن و ماہر خاندانی امراض',
  registrationNumber: 'PMDC-48291-P',
  address: 'Plot 42-B, Main Boulevard, Gulberg III, Lahore, Pakistan',
  addressUrdu: 'پلاٹ 42-بی، مین بلیوارڈ، گلبرگ 3، لاہور، پاکستان',
  phone: '+92 300 8472910',
  whatsapp: '+923008472910',
  email: 'clinic@hkmedical.pk',
  googleMapsUrl: 'https://maps.google.com/?q=Lahore+Gulberg+III+Medical+Centre',
  googleMapsCoordinates: '31.5204, 74.3587',
  currency: 'PKR',
  adminPassword: 'admin123',
  consultationFee: 1500,
  clinicTimings: 'Mon - Sat: 5:00 PM - 9:00 PM',
  clinicTimingsUrdu: 'پیر تا ہفتہ: شام 5:00 تا رات 9:00 بجے',
  mrNumberPrefix: 'HK-',
  mrNumberDigits: 6,
  logoPosition: 'left',
  logoWidth: 70,
  receiptFooterText: 'Digitally generated receipt — No signature required.',
  receiptFooterTextUrdu: 'ڈیجیٹل کمپیوٹرائزڈ رسید — دستخط کی ضرورت نہیں ہے۔',
  defaultPageSetup: DEFAULT_PAGE_SETUP,
  language: 'en',
};

// High-frequency Pakistani / South Asian primary care medicine catalog
const INITIAL_MEDICINES: MedicineCatalogEntry[] = [
  {
    id: 'med-1',
    brandName: 'Panadol',
    genericName: 'Paracetamol',
    strength: '500mg',
    dosageForm: 'Tablet',
    manufacturer: 'GSK',
    category: 'Analgesic / Antipyretic',
    packSize: '200 Tabs',
    price: 350,
    isFavorite: true,
  },
  {
    id: 'med-2',
    brandName: 'Panadol CF',
    genericName: 'Paracetamol + Pseudoephedrine + Chlorpheniramine',
    strength: '500mg/30mg/2mg',
    dosageForm: 'Tablet',
    manufacturer: 'GSK',
    category: 'Cold & Flu',
    packSize: '100 Tabs',
    price: 450,
    isFavorite: true,
  },
  {
    id: 'med-3',
    brandName: 'Augmentin',
    genericName: 'Amoxicillin + Clavulanic Acid',
    strength: '625mg',
    dosageForm: 'Tablet',
    manufacturer: 'GSK',
    category: 'Antibiotic',
    packSize: '14 Tabs',
    price: 480,
    isFavorite: true,
  },
  {
    id: 'med-4',
    brandName: 'Augmentin 1g',
    genericName: 'Amoxicillin + Clavulanic Acid',
    strength: '1000mg',
    dosageForm: 'Tablet',
    manufacturer: 'GSK',
    category: 'Antibiotic',
    packSize: '14 Tabs',
    price: 680,
    isFavorite: true,
  },
  {
    id: 'med-5',
    brandName: 'Risek',
    genericName: 'Omeprazole',
    strength: '40mg',
    dosageForm: 'Capsule',
    manufacturer: 'Getz Pharma',
    category: 'PPI / Antacid',
    packSize: '14 Caps',
    price: 420,
    isFavorite: true,
  },
  {
    id: 'med-6',
    brandName: 'Risek Insta',
    genericName: 'Omeprazole + Sodium Bicarbonate',
    strength: '20mg/1680mg',
    dosageForm: 'Sachet',
    manufacturer: 'Getz Pharma',
    category: 'PPI / Rapid Antacid',
    packSize: '10 Sachets',
    price: 520,
    isFavorite: false,
  },
  {
    id: 'med-7',
    brandName: 'Brufen',
    genericName: 'Ibuprofen',
    strength: '400mg',
    dosageForm: 'Tablet',
    manufacturer: 'Abbott',
    category: 'NSAID / Anti-inflammatory',
    packSize: '100 Tabs',
    price: 380,
    isFavorite: true,
  },
  {
    id: 'med-8',
    brandName: 'Brufen DS',
    genericName: 'Ibuprofen',
    strength: '200mg/5ml',
    dosageForm: 'Suspension',
    manufacturer: 'Abbott',
    category: 'Pediatric NSAID',
    packSize: '120ml',
    price: 180,
    isFavorite: false,
  },
  {
    id: 'med-9',
    brandName: 'Ciproxin',
    genericName: 'Ciprofloxacin',
    strength: '500mg',
    dosageForm: 'Tablet',
    manufacturer: 'Bayer',
    category: 'Quinolone Antibiotic',
    packSize: '10 Tabs',
    price: 550,
    isFavorite: false,
  },
  {
    id: 'med-10',
    brandName: 'Gravinate',
    genericName: 'Dimenhydrinate',
    strength: '50mg',
    dosageForm: 'Tablet',
    manufacturer: 'Searle',
    category: 'Antiemetic',
    packSize: '100 Tabs',
    price: 290,
    isFavorite: true,
  },
  {
    id: 'med-11',
    brandName: 'Hydryllin',
    genericName: 'Aminophylline + Diphenhydramine + Ammonium Chloride',
    strength: 'Standard',
    dosageForm: 'Syrup',
    manufacturer: 'Searle',
    category: 'Cough Expectorant',
    packSize: '120ml',
    price: 160,
    isFavorite: true,
  },
  {
    id: 'med-12',
    brandName: 'Zyrtec',
    genericName: 'Cetirizine HCl',
    strength: '10mg',
    dosageForm: 'Tablet',
    manufacturer: 'GSK',
    category: 'Antihistamine / Allergy',
    packSize: '30 Tabs',
    price: 280,
    isFavorite: true,
  },
  {
    id: 'med-13',
    brandName: 'Loprin',
    genericName: 'Aspirin (Low Dose)',
    strength: '75mg',
    dosageForm: 'Tablet',
    manufacturer: 'Highnoon',
    category: 'Antiplatelet / Cardio',
    packSize: '30 Tabs',
    price: 120,
    isFavorite: true,
  },
  {
    id: 'med-14',
    brandName: 'Lipiget',
    genericName: 'Atorvastatin',
    strength: '20mg',
    dosageForm: 'Tablet',
    manufacturer: 'Getz Pharma',
    category: 'Lipid Lowering / Statin',
    packSize: '10 Tabs',
    price: 360,
    isFavorite: true,
  },
  {
    id: 'med-15',
    brandName: 'Glucophage',
    genericName: 'Metformin HCl',
    strength: '500mg',
    dosageForm: 'Tablet',
    manufacturer: 'Merck',
    category: 'Antidiabetic',
    packSize: '50 Tabs',
    price: 310,
    isFavorite: true,
  },
  {
    id: 'med-16',
    brandName: 'Concor',
    genericName: 'Bisoprolol Fumarate',
    strength: '5mg',
    dosageForm: 'Tablet',
    manufacturer: 'Merck',
    category: 'Beta Blocker / Antihypertensive',
    packSize: '14 Tabs',
    price: 390,
    isFavorite: true,
  },
  {
    id: 'med-17',
    brandName: 'Norvasc',
    genericName: 'Amlodipine Besylate',
    strength: '5mg',
    dosageForm: 'Tablet',
    manufacturer: 'Pfizer',
    category: 'Calcium Channel Blocker',
    packSize: '30 Tabs',
    price: 520,
    isFavorite: false,
  },
  {
    id: 'med-18',
    brandName: 'Flagyl',
    genericName: 'Metronidazole',
    strength: '400mg',
    dosageForm: 'Tablet',
    manufacturer: 'Sanofi',
    category: 'Antiprotozoal / Antibacterial',
    packSize: '200 Tabs',
    price: 320,
    isFavorite: true,
  },
  {
    id: 'med-19',
    brandName: 'Entamizole',
    genericName: 'Diloxanide Furoate + Metronidazole',
    strength: '250mg/200mg',
    dosageForm: 'Tablet',
    manufacturer: 'Abbott',
    category: 'Amoebiasis / Gastroenteritis',
    packSize: '200 Tabs',
    price: 460,
    isFavorite: true,
  },
  {
    id: 'med-20',
    brandName: 'Sancos',
    genericName: 'Pholcodine + Pseudoephedrine',
    strength: 'Syrup',
    dosageForm: 'Syrup',
    manufacturer: 'Novartis',
    category: 'Dry Cough Suppressant',
    packSize: '120ml',
    price: 190,
    isFavorite: false,
  },
  {
    id: 'med-21',
    brandName: 'Voltral Emulgel',
    genericName: 'Diclofenac Diethylamine',
    strength: '1.16% w/w',
    dosageForm: 'Gel / Topical',
    manufacturer: 'Novartis',
    category: 'Topical Analgesic',
    packSize: '50g Tube',
    price: 240,
    isFavorite: true,
  },
  {
    id: 'med-22',
    brandName: 'Polyfax Skin',
    genericName: 'Polymyxin B + Bacitracin Zinc',
    strength: 'Ointment',
    dosageForm: 'Ointment',
    manufacturer: 'GSK',
    category: 'Topical Antibiotic',
    packSize: '20g Tube',
    price: 130,
    isFavorite: true,
  },
];

const INITIAL_PATIENTS: Patient[] = [];

const INITIAL_PRESCRIPTIONS: Prescription[] = [];

const INITIAL_FEE_RECEIPTS: FeeReceipt[] = [];

const INITIAL_PROCEDURE_RECEIPTS: ProcedureReceipt[] = [];

const INITIAL_APPOINTMENTS: Appointment[] = [];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-1',
    user: 'Dr. Haroon Kibriya',
    role: 'doctor',
    action: 'SYSTEM_INITIALIZED',
    details: 'Offline Clinic Database initialized with standard Pakistani formulary and clinic settings.',
    timestamp: '2026-09-28T08:00:00.000Z',
  },
];

// Helper to safely get from localStorage
function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage, using default:`, e);
    return defaultValue;
  }
}

// Helper to safely set to localStorage
function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

// Initialize seed data if not present
export function initializeClinicDatabase(): void {
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setStorageItem(STORAGE_KEYS.SETTINGS, DEFAULT_CLINIC_SETTINGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEDICINES)) {
    setStorageItem(STORAGE_KEYS.MEDICINES, INITIAL_MEDICINES);
  }

  // Automatically purge demo patients if present
  const purgeVersion = 'hk_clinic_patients_cleared_v1';
  if (!localStorage.getItem(purgeVersion)) {
    const existing = getStorageItem<Patient[]>(STORAGE_KEYS.PATIENTS, []);
    const hasDemo = existing.some(p => p.id === 'pat-1' || p.id === 'pat-2' || p.id === 'pat-3' || p.mrNumber === 'HK-000001');
    if (hasDemo) {
      setStorageItem(STORAGE_KEYS.PATIENTS, []);
      setStorageItem(STORAGE_KEYS.PRESCRIPTIONS, []);
      setStorageItem(STORAGE_KEYS.FEE_RECEIPTS, []);
      setStorageItem(STORAGE_KEYS.PROCEDURE_RECEIPTS, []);
      setStorageItem(STORAGE_KEYS.APPOINTMENTS, []);
    }
    localStorage.setItem(purgeVersion, 'true');
  }

  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    setStorageItem(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS)) {
    setStorageItem(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FEE_RECEIPTS)) {
    setStorageItem(STORAGE_KEYS.FEE_RECEIPTS, INITIAL_FEE_RECEIPTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROCEDURE_RECEIPTS)) {
    setStorageItem(STORAGE_KEYS.PROCEDURE_RECEIPTS, INITIAL_PROCEDURE_RECEIPTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    setStorageItem(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    setStorageItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }
}

// --- Repositories ---

export const PatientRepository = {
  getAll(): Patient[] {
    return getStorageItem<Patient[]>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
  },
  getById(id: string): Patient | undefined {
    return this.getAll().find(p => p.id === id);
  },
  getByMrNumber(mrNumber: string): Patient | undefined {
    return this.getAll().find(p => p.mrNumber.toLowerCase() === mrNumber.toLowerCase().trim());
  },
  search(query: string): Patient[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.getAll();
    return this.getAll().filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.mrNumber.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      (p.whatsapp && p.whatsapp.includes(q)) ||
      p.address.toLowerCase().includes(q) ||
      p.fatherOrHusbandName.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q)
    );
  },
  getNextMrNumber(): string {
    const settings = SettingsRepository.get();
    const patients = this.getAll();
    const prefix = settings.mrNumberPrefix || 'HK-';
    const digits = settings.mrNumberDigits || 6;

    let maxNum = 0;
    for (const p of patients) {
      if (p.mrNumber && p.mrNumber.startsWith(prefix)) {
        const rawNum = parseInt(p.mrNumber.replace(prefix, ''), 10);
        if (!isNaN(rawNum) && rawNum > maxNum) {
          maxNum = rawNum;
        }
      }
    }
    const nextNum = maxNum + 1;
    return `${prefix}${nextNum.toString().padStart(digits, '0')}`;
  },
  save(patient: Patient, currentUser: string = 'Doctor'): Patient {
    const list = this.getAll();
    const idx = list.findIndex(p => p.id === patient.id);
    let updated: Patient;

    if (idx >= 0) {
      updated = { ...list[idx], ...patient };
      list[idx] = updated;
      AuditRepository.log(currentUser, 'PATIENT_UPDATED', `Updated patient details: ${patient.name} (${patient.mrNumber})`);
    } else {
      updated = {
        ...patient,
        id: patient.id || `pat-${Date.now()}`,
        registrationDate: patient.registrationDate || new Date().toISOString(),
      };
      list.unshift(updated);
      AuditRepository.log(currentUser, 'PATIENT_CREATED', `Registered new patient: ${patient.name} (${patient.mrNumber})`);
    }

    setStorageItem(STORAGE_KEYS.PATIENTS, list);
    return updated;
  },
  delete(id: string, currentUser: string = 'Doctor'): boolean {
    const list = this.getAll();
    const target = list.find(p => p.id === id);
    if (!target) return false;

    const filtered = list.filter(p => p.id !== id);
    setStorageItem(STORAGE_KEYS.PATIENTS, filtered);
    AuditRepository.log(currentUser, 'PATIENT_DELETED', `Deleted patient record: ${target.name} (${target.mrNumber})`);
    return true;
  },
  clearAll(currentUser: string = 'Doctor'): void {
    setStorageItem(STORAGE_KEYS.PATIENTS, []);
    setStorageItem(STORAGE_KEYS.PRESCRIPTIONS, []);
    setStorageItem(STORAGE_KEYS.FEE_RECEIPTS, []);
    setStorageItem(STORAGE_KEYS.PROCEDURE_RECEIPTS, []);
    setStorageItem(STORAGE_KEYS.APPOINTMENTS, []);
    AuditRepository.log(currentUser, 'PATIENTS_CLEARED', 'All patient records and associated clinical data have been deleted.');
  },
};

export const PrescriptionRepository = {
  getAll(): Prescription[] {
    return getStorageItem<Prescription[]>(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
  },
  getById(id: string): Prescription | undefined {
    return this.getAll().find(r => r.id === id);
  },
  getByPatientId(patientId: string): Prescription[] {
    return this.getAll().filter(r => r.patientId === patientId);
  },
  getNextRxNumber(): string {
    const year = new Date().getFullYear();
    const list = this.getAll();
    const prefix = `RX-${year}-`;
    let count = 0;
    for (const r of list) {
      if (r.prescriptionNumber && r.prescriptionNumber.startsWith(prefix)) {
        const num = parseInt(r.prescriptionNumber.replace(prefix, ''), 10);
        if (!isNaN(num) && num > count) count = num;
      }
    }
    return `${prefix}${(count + 1).toString().padStart(4, '0')}`;
  },
  save(rx: Prescription, currentUser: string = 'Doctor'): Prescription {
    const list = this.getAll();
    const idx = list.findIndex(r => r.id === rx.id);
    const now = new Date().toISOString();

    if (idx >= 0) {
      // Preserve history versioning
      const existing = list[idx];
      const newVersion: PrescriptionVersion = {
        version: (existing.versions?.length || 1) + 1,
        timestamp: now,
        modifiedBy: currentUser,
        medicines: [...rx.medicines],
        diagnosis: rx.diagnosis,
        clinicalNotes: rx.examination || rx.chiefComplaint,
        advice: rx.advice,
      };

      const versions = existing.versions ? [...existing.versions, newVersion] : [newVersion];

      const updated: Prescription = {
        ...rx,
        updatedAt: now,
        versions,
      };
      list[idx] = updated;
      setStorageItem(STORAGE_KEYS.PRESCRIPTIONS, list);
      AuditRepository.log(currentUser, 'PRESCRIPTION_EDITED', `Updated Rx ${rx.prescriptionNumber} for ${rx.patientName} (v${newVersion.version})`);
      return updated;
    } else {
      const initialVersion: PrescriptionVersion = {
        version: 1,
        timestamp: now,
        modifiedBy: currentUser,
        medicines: [...rx.medicines],
        diagnosis: rx.diagnosis,
        clinicalNotes: rx.examination || rx.chiefComplaint,
        advice: rx.advice,
      };

      const created: Prescription = {
        ...rx,
        id: rx.id || `rx-${Date.now()}`,
        prescriptionNumber: rx.prescriptionNumber || this.getNextRxNumber(),
        verificationCode: rx.verificationCode || `HK-VER-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: now,
        updatedAt: now,
        createdBy: currentUser,
        versions: [initialVersion],
      };
      list.unshift(created);
      setStorageItem(STORAGE_KEYS.PRESCRIPTIONS, list);
      AuditRepository.log(currentUser, 'PRESCRIPTION_CREATED', `Issued Rx ${created.prescriptionNumber} for ${created.patientName}`);
      return created;
    }
  },
  delete(id: string, currentUser: string = 'Doctor'): boolean {
    const list = this.getAll();
    const target = list.find(r => r.id === id);
    if (!target) return false;

    const filtered = list.filter(r => r.id !== id);
    setStorageItem(STORAGE_KEYS.PRESCRIPTIONS, filtered);
    AuditRepository.log(currentUser, 'PRESCRIPTION_DELETED', `Deleted Rx ${target.prescriptionNumber}`);
    return true;
  },
};

export const MedicineRepository = {
  getAll(): MedicineCatalogEntry[] {
    return getStorageItem<MedicineCatalogEntry[]>(STORAGE_KEYS.MEDICINES, INITIAL_MEDICINES);
  },
  search(query: string): MedicineCatalogEntry[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.getAll();
    return this.getAll().filter(m =>
      m.brandName.toLowerCase().includes(q) ||
      m.genericName.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.strength.toLowerCase().includes(q)
    );
  },
  getFavorites(): MedicineCatalogEntry[] {
    return this.getAll().filter(m => m.isFavorite);
  },
  toggleFavorite(id: string): MedicineCatalogEntry[] {
    const list = this.getAll();
    const item = list.find(m => m.id === id);
    if (item) {
      item.isFavorite = !item.isFavorite;
      setStorageItem(STORAGE_KEYS.MEDICINES, list);
    }
    return list;
  },
  add(item: Omit<MedicineCatalogEntry, 'id'>, currentUser: string = 'Doctor'): MedicineCatalogEntry {
    const list = this.getAll();
    const created: MedicineCatalogEntry = {
      ...item,
      id: `med-${Date.now()}`,
    };
    list.unshift(created);
    setStorageItem(STORAGE_KEYS.MEDICINES, list);
    AuditRepository.log(currentUser, 'MEDICINE_ADDED', `Added medicine ${created.brandName} (${created.genericName})`);
    return created;
  },
  syncOnlineBatch(newEntries: MedicineCatalogEntry[], currentUser: string = 'Doctor'): number {
    const list = this.getAll();
    let addedCount = 0;
    for (const item of newEntries) {
      const exists = list.some(m => m.brandName.toLowerCase() === item.brandName.toLowerCase());
      if (!exists) {
        list.push({ ...item, id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` });
        addedCount++;
      }
    }
    if (addedCount > 0) {
      setStorageItem(STORAGE_KEYS.MEDICINES, list);
      AuditRepository.log(currentUser, 'MEDICINE_SYNCED', `Synced ${addedCount} medicine entries from online medical repository`);
    }
    return addedCount;
  },
};

export const ReceiptRepository = {
  getFeeReceipts(): FeeReceipt[] {
    return getStorageItem<FeeReceipt[]>(STORAGE_KEYS.FEE_RECEIPTS, INITIAL_FEE_RECEIPTS);
  },
  getProcedureReceipts(): ProcedureReceipt[] {
    return getStorageItem<ProcedureReceipt[]>(STORAGE_KEYS.PROCEDURE_RECEIPTS, INITIAL_PROCEDURE_RECEIPTS);
  },
  getByPatientId(patientId: string): { feeReceipts: FeeReceipt[]; procedureReceipts: ProcedureReceipt[] } {
    return {
      feeReceipts: this.getFeeReceipts().filter(r => r.patientId === patientId),
      procedureReceipts: this.getProcedureReceipts().filter(r => r.patientId === patientId),
    };
  },
  getNextFeeReceiptNumber(): string {
    const year = new Date().getFullYear();
    const list = this.getFeeReceipts();
    const prefix = `REC-${year}-`;
    let count = 0;
    for (const r of list) {
      if (r.receiptNumber && r.receiptNumber.startsWith(prefix)) {
        const num = parseInt(r.receiptNumber.replace(prefix, ''), 10);
        if (!isNaN(num) && num > count) count = num;
      }
    }
    return `${prefix}${(count + 1).toString().padStart(4, '0')}`;
  },
  getNextProcedureReceiptNumber(): string {
    const year = new Date().getFullYear();
    const list = this.getProcedureReceipts();
    const prefix = `PRC-${year}-`;
    let count = 0;
    for (const r of list) {
      if (r.receiptNumber && r.receiptNumber.startsWith(prefix)) {
        const num = parseInt(r.receiptNumber.replace(prefix, ''), 10);
        if (!isNaN(num) && num > count) count = num;
      }
    }
    return `${prefix}${(count + 1).toString().padStart(4, '0')}`;
  },
  saveFeeReceipt(receipt: FeeReceipt, currentUser: string = 'Doctor'): FeeReceipt {
    const list = this.getFeeReceipts();
    const created: FeeReceipt = {
      ...receipt,
      id: receipt.id || `rec-${Date.now()}`,
      receiptNumber: receipt.receiptNumber || this.getNextFeeReceiptNumber(),
      verificationCode: receipt.verificationCode || `REC-VER-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: receipt.createdAt || new Date().toISOString(),
    };
    list.unshift(created);
    setStorageItem(STORAGE_KEYS.FEE_RECEIPTS, list);
    AuditRepository.log(currentUser, 'RECEIPT_CREATED', `Created Fee Receipt ${created.receiptNumber} (${created.total} PKR) for ${created.patientName}`);
    return created;
  },
  saveProcedureReceipt(receipt: ProcedureReceipt, currentUser: string = 'Doctor'): ProcedureReceipt {
    const list = this.getProcedureReceipts();
    const created: ProcedureReceipt = {
      ...receipt,
      id: receipt.id || `prc-${Date.now()}`,
      receiptNumber: receipt.receiptNumber || this.getNextProcedureReceiptNumber(),
      verificationCode: receipt.verificationCode || `PRC-VER-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: receipt.createdAt || new Date().toISOString(),
    };
    list.unshift(created);
    setStorageItem(STORAGE_KEYS.PROCEDURE_RECEIPTS, list);
    AuditRepository.log(currentUser, 'PROCEDURE_RECEIPT_CREATED', `Created Procedure Receipt ${created.receiptNumber} (${created.netPayable} PKR) for ${created.patientName}`);
    return created;
  },
};

export const AppointmentRepository = {
  getAll(): Appointment[] {
    return getStorageItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  },
  getByPatientId(patientId: string): Appointment[] {
    return this.getAll().filter(a => a.patientId === patientId);
  },
  getToday(): Appointment[] {
    const today = new Date().toISOString().split('T')[0];
    return this.getAll().filter(a => a.date === today);
  },
  save(apt: Appointment, currentUser: string = 'Doctor'): Appointment {
    const list = this.getAll();
    const idx = list.findIndex(a => a.id === apt.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...apt };
      setStorageItem(STORAGE_KEYS.APPOINTMENTS, list);
      AuditRepository.log(currentUser, 'APPOINTMENT_UPDATED', `Updated appointment ${apt.appointmentNumber} status: ${apt.status}`);
      return list[idx];
    } else {
      const year = new Date().getFullYear();
      const count = list.length + 1;
      const created: Appointment = {
        ...apt,
        id: apt.id || `apt-${Date.now()}`,
        appointmentNumber: apt.appointmentNumber || `APT-${year}-${count.toString().padStart(2, '0')}`,
        createdAt: apt.createdAt || new Date().toISOString(),
      };
      list.unshift(created);
      setStorageItem(STORAGE_KEYS.APPOINTMENTS, list);
      AuditRepository.log(currentUser, 'APPOINTMENT_CREATED', `Booked appointment ${created.appointmentNumber} for ${created.patientName} (${created.timeSlot})`);
      return created;
    }
  },
  updateStatus(id: string, status: Appointment['status'], currentUser: string = 'Doctor'): Appointment | undefined {
    const list = this.getAll();
    const apt = list.find(a => a.id === id);
    if (apt) {
      apt.status = status;
      setStorageItem(STORAGE_KEYS.APPOINTMENTS, list);
      AuditRepository.log(currentUser, 'APPOINTMENT_STATUS', `Changed status of appointment ${apt.appointmentNumber} to ${status}`);
    }
    return apt;
  },
};

export const SettingsRepository = {
  get(): ClinicSettings {
    const s = getStorageItem<ClinicSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_CLINIC_SETTINGS);
    if (!s.clinicName || s.clinicName === 'HK Clinic & Healthcare Centre' || s.clinicName === 'Clinic App') {
      s.clinicName = 'HK Clinic Management System';
      s.clinicNameUrdu = 'ایچ کے کلینک مینجمنٹ سسٹم';
    }
    return s;
  },
  save(settings: ClinicSettings, currentUser: string = 'Doctor'): ClinicSettings {
    setStorageItem(STORAGE_KEYS.SETTINGS, settings);
    AuditRepository.log(currentUser, 'SETTINGS_CHANGED', 'Updated clinic profile, doctor credentials, or margins');
    return settings;
  },
};

export const AuditRepository = {
  getAll(): AuditLogEntry[] {
    return getStorageItem<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },
  log(user: string, action: string, details: string, role: 'doctor' | 'assistant' | 'patient' = 'doctor'): void {
    const list = this.getAll();
    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user,
      role,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    list.unshift(entry);
    // Keep last 300 entries
    if (list.length > 300) list.length = 300;
    setStorageItem(STORAGE_KEYS.AUDIT_LOGS, list);
  },
  clear(currentUser: string = 'Doctor'): void {
    const clearedList = [
      {
        id: `aud-${Date.now()}`,
        user: currentUser,
        role: 'doctor' as const,
        action: 'AUDIT_LOG_CLEARED',
        details: 'Audit logs cleared by administrator.',
        timestamp: new Date().toISOString(),
      },
    ];
    setStorageItem(STORAGE_KEYS.AUDIT_LOGS, clearedList);
  },
};

// Database Full Backup and Restore
export const BackupService = {
  exportDatabaseJson(): string {
    const dump = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      app: 'HK Clinic Management System',
      settings: SettingsRepository.get(),
      patients: PatientRepository.getAll(),
      prescriptions: PrescriptionRepository.getAll(),
      medicines: MedicineRepository.getAll(),
      feeReceipts: ReceiptRepository.getFeeReceipts(),
      procedureReceipts: ReceiptRepository.getProcedureReceipts(),
      appointments: AppointmentRepository.getAll(),
      auditLogs: AuditRepository.getAll(),
    };
    return JSON.stringify(dump, null, 2);
  },
  importDatabaseJson(jsonString: string, currentUser: string = 'Doctor'): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data || !data.patients || !data.settings) {
        return { success: false, message: 'Invalid backup format. Missing core patients or settings data.' };
      }

      if (data.settings) setStorageItem(STORAGE_KEYS.SETTINGS, data.settings);
      if (Array.isArray(data.patients)) setStorageItem(STORAGE_KEYS.PATIENTS, data.patients);
      if (Array.isArray(data.prescriptions)) setStorageItem(STORAGE_KEYS.PRESCRIPTIONS, data.prescriptions);
      if (Array.isArray(data.medicines)) setStorageItem(STORAGE_KEYS.MEDICINES, data.medicines);
      if (Array.isArray(data.feeReceipts)) setStorageItem(STORAGE_KEYS.FEE_RECEIPTS, data.feeReceipts);
      if (Array.isArray(data.procedureReceipts)) setStorageItem(STORAGE_KEYS.PROCEDURE_RECEIPTS, data.procedureReceipts);
      if (Array.isArray(data.appointments)) setStorageItem(STORAGE_KEYS.APPOINTMENTS, data.appointments);
      if (Array.isArray(data.auditLogs)) setStorageItem(STORAGE_KEYS.AUDIT_LOGS, data.auditLogs);

      AuditRepository.log(currentUser, 'DATABASE_RESTORED', `Full database restored successfully from file created on ${data.exportedAt || 'Unknown'}`);
      return { success: true, message: `Successfully restored ${data.patients.length} patients and ${data.prescriptions?.length || 0} prescriptions.` };
    } catch (e: unknown) {
      return { success: false, message: e instanceof Error ? e.message : 'JSON parsing error during restore.' };
    }
  },
};
