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
  clinicName: 'HK Clinic & Healthcare Centre',
  clinicNameUrdu: 'ایچ کے کلینک اینڈ ہیلتھ کیئر سینٹر',
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

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    mrNumber: 'HK-000001',
    name: 'Muhammad Tariq',
    fatherOrHusbandName: 'Abdul Rehman',
    age: 48,
    dob: '1978-04-12',
    gender: 'Male',
    phone: '+92 321 4455667',
    whatsapp: '+923214455667',
    address: 'House # 14, Street 3, Model Town',
    city: 'Lahore',
    email: 'tariq.rehman@example.com',
    bloodGroup: 'B+',
    emergencyContact: '+92 300 9876543 (Son - Hamza)',
    registrationDate: '2026-09-15T09:30:00.000Z',
    notes: 'Hypertensive for 4 years. Patient is compliant with treatment.',
    allergies: ['Penicillin (mild rash)'],
    medicalHistory: {
      chiefComplaint: 'Headache & occasional dizziness for 3 days',
      symptoms: 'Mild occipital headache, fatigue, blurred vision when fatigued',
      pastMedicalHistory: 'Essential Hypertension diagnosed in 2022',
      surgicalHistory: 'Appendectomy in 2011',
      drugAllergies: 'Penicillin causes mild urticarial rash',
      currentMedicines: 'Tab Concor 5mg 1 OD',
      familyHistory: 'Father had Type 2 Diabetes; Mother had HTN',
      socialHistory: 'Non-smoker, sedentary lifestyle',
      examination: 'BP: 145/92 mmHg, Pulse: 78 bpm, Chest: Clear, Heart: S1 S2 normal',
      diagnosis: 'Uncontrolled Hypertension, Tension-type Headache',
      investigations: 'Serum Creatinine, Fasting Blood Sugar, Lipid Profile, ECG',
      doctorNotes: 'Advised sodium restriction, 30 min daily walking, review in 10 days.',
      followUpAdvice: 'Follow up after 10 days with lab reports and BP log.',
      updatedAt: '2026-09-28T11:00:00.000Z',
    },
  },
  {
    id: 'pat-2',
    mrNumber: 'HK-000002',
    name: 'Fatima Bibi',
    fatherOrHusbandName: 'Muhammad Aslam (Husband)',
    age: 34,
    dob: '1992-08-20',
    gender: 'Female',
    phone: '+92 333 1122334',
    whatsapp: '+923331122334',
    address: 'Flat 204, Royal Heights, DHA Phase 5',
    city: 'Lahore',
    email: 'fatima.aslam@example.com',
    bloodGroup: 'O+',
    emergencyContact: '+92 333 5566778 (Husband)',
    registrationDate: '2026-09-20T14:15:00.000Z',
    notes: 'Seasonal allergic rhinitis, dyspepsia.',
    allergies: [],
    medicalHistory: {
      chiefComplaint: 'Epigastric burning pain, sour burping after meals',
      symptoms: 'Heartburn, bloating, nausea',
      pastMedicalHistory: 'GERD, seasonal allergies',
      surgicalHistory: 'None',
      drugAllergies: 'None known',
      currentMedicines: 'Occasional antacid syrups',
      familyHistory: 'Non-contributory',
      socialHistory: 'Takes tea 4 cups daily, spicy diet',
      examination: 'Mild epigastric tenderness, no organomegaly',
      diagnosis: 'Gastroesophageal Reflux Disease (GERD) / Dyspepsia',
      investigations: 'Complete Blood Count, Stool for H. Pylori Ag if symptoms persist',
      doctorNotes: 'Prescribed PPI course for 2 weeks with dietary counseling.',
      followUpAdvice: 'Avoid fatty food, tea, and spicy curries. Walk after dinner.',
      updatedAt: '2026-09-25T16:30:00.000Z',
    },
  },
  {
    id: 'pat-3',
    mrNumber: 'HK-000003',
    name: 'Zubair Ahmed',
    fatherOrHusbandName: 'Ghulam Rasool',
    age: 58,
    dob: '1968-11-05',
    gender: 'Male',
    phone: '+92 300 7766554',
    whatsapp: '+923007766554',
    address: 'Mohallah Islamia, Old City',
    city: 'Lahore',
    email: 'zubair.ahmed@example.com',
    bloodGroup: 'A+',
    emergencyContact: '+92 312 9988776',
    registrationDate: '2026-09-29T10:00:00.000Z',
    notes: 'Type 2 Diabetes Mellitus for 8 years.',
    allergies: ['Sulfa drugs'],
    medicalHistory: {
      chiefComplaint: 'Bilateral knee pain, increased thirst',
      symptoms: 'Joint stiffness in morning, polyuria',
      pastMedicalHistory: 'Type 2 Diabetes Mellitus, Osteoarthritis',
      surgicalHistory: 'None',
      drugAllergies: 'Sulfonamides',
      currentMedicines: 'Glucophage 500mg BD',
      familyHistory: 'Strong diabetic history',
      socialHistory: 'Smoker (5 cigs/day)',
      examination: 'Knee crepitus positive, random blood sugar 210 mg/dL',
      diagnosis: 'Suboptimally controlled T2DM, Bilateral Knee Osteoarthritis',
      investigations: 'HbA1c, Serum Uric Acid, X-Ray Both Knees (AP/Lat)',
      doctorNotes: 'Encouraged smoking cessation and physical physiotherapy exercises.',
      followUpAdvice: 'Follow up in 2 weeks with HbA1c and Knee X-ray.',
      updatedAt: '2026-09-29T10:30:00.000Z',
    },
  },
];

const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-1',
    prescriptionNumber: 'RX-2026-0001',
    patientId: 'pat-1',
    patientName: 'Muhammad Tariq',
    patientMrNumber: 'HK-000001',
    patientAge: 48,
    patientGender: 'Male',
    patientPhone: '+92 321 4455667',
    date: '2026-09-28',
    doctorName: 'Dr. Haroon Kibriya',
    doctorQualification: 'MBBS, FCPS (Medicine), MRCGP (Int)',
    doctorSpecialty: 'Consultant Physician & Family Medicine Specialist',
    clinicName: 'HK Clinic & Healthcare Centre',
    chiefComplaint: 'Occipital headache and elevated blood pressure',
    vitals: {
      bp: '145/92 mmHg',
      pulse: '78 bpm',
      weight: '82 kg',
      temperature: '98.4 F',
      spo2: '98%',
    },
    examination: 'Chest clear bilaterally, S1 S2 normal, no peripheral edema.',
    diagnosis: 'Uncontrolled Hypertension, Tension Headache',
    investigations: 'Lipid Profile, Serum Creatinine, Fasting Blood Sugar',
    medicines: [
      {
        id: 'med-item-1',
        brandName: 'Concor',
        genericName: 'Bisoprolol Fumarate',
        strength: '5mg',
        dosageForm: 'Tablet',
        frequency: '1-0-0 (Once daily)',
        duration: '1 Month',
        route: 'Oral',
        instructions: 'صبح ناشتے کے بعد روزانہ ایک گولی لیں',
        quantity: '30 Tablets',
        notes: 'Do not discontinue abruptly',
      },
      {
        id: 'med-item-2',
        brandName: 'Panadol',
        genericName: 'Paracetamol',
        strength: '500mg',
        dosageForm: 'Tablet',
        frequency: '1-1-1 (SOS / When needed)',
        duration: '5 Days',
        route: 'Oral',
        instructions: 'درد یا سر درد کی صورت میں ضرورت کے وقت لیں',
        quantity: '10 Tablets',
        notes: 'Max 6 tablets in 24 hours',
      },
      {
        id: 'med-item-3',
        brandName: 'Risek',
        genericName: 'Omeprazole',
        strength: '40mg',
        dosageForm: 'Capsule',
        frequency: '1-0-0 (Before breakfast)',
        duration: '14 Days',
        route: 'Oral',
        instructions: 'صبح نہار منہ ناشتے سے آدھا گھنٹہ پہلے لیں',
        quantity: '14 Capsules',
        notes: 'Take with full glass of water',
      },
    ],
    advice: 'Daily 30 min brisk walk. Restrict dietary salt. Maintain a daily BP diary.',
    followUpDate: '2026-10-08',
    verificationCode: 'HK-VER-2026-9482',
    templateType: 'builtin',
    pageSetup: DEFAULT_PAGE_SETUP,
    versions: [
      {
        version: 1,
        timestamp: '2026-09-28T11:15:00.000Z',
        modifiedBy: 'Dr. Haroon Kibriya',
        diagnosis: 'Uncontrolled Hypertension, Tension Headache',
        clinicalNotes: 'Initial consultation and therapy initiation',
        advice: 'Daily 30 min brisk walk. Restrict dietary salt.',
        medicines: [
          {
            id: 'med-item-1',
            brandName: 'Concor',
            genericName: 'Bisoprolol Fumarate',
            strength: '5mg',
            dosageForm: 'Tablet',
            frequency: '1-0-0 (Once daily)',
            duration: '1 Month',
            route: 'Oral',
            instructions: 'صبح ناشتے کے بعد روزانہ ایک گولی لیں',
            quantity: '30 Tablets',
          },
        ],
      },
    ],
    createdAt: '2026-09-28T11:15:00.000Z',
    updatedAt: '2026-09-28T11:15:00.000Z',
    createdBy: 'Dr. Haroon Kibriya',
  },
];

const INITIAL_FEE_RECEIPTS: FeeReceipt[] = [
  {
    id: 'rec-1',
    receiptNumber: 'REC-2026-0001',
    date: '2026-09-28',
    patientId: 'pat-1',
    patientName: 'Muhammad Tariq',
    patientMrNumber: 'HK-000001',
    doctorName: 'Dr. Haroon Kibriya',
    consultationFee: 2000,
    discount: 200,
    total: 1800,
    paidAmount: 1800,
    balance: 0,
    paymentMethod: 'Cash',
    notes: 'Routine specialist consultation with vitals check',
    verificationCode: 'REC-VER-001',
    createdAt: '2026-09-28T11:30:00.000Z',
  },
  {
    id: 'rec-2',
    receiptNumber: 'REC-2026-0002',
    date: '2026-09-29',
    patientId: 'pat-3',
    patientName: 'Zubair Ahmed',
    patientMrNumber: 'HK-000003',
    doctorName: 'Dr. Haroon Kibriya',
    consultationFee: 2000,
    discount: 0,
    total: 2000,
    paidAmount: 2000,
    balance: 0,
    paymentMethod: 'Bank',
    notes: 'Diabetic and joint review',
    verificationCode: 'REC-VER-002',
    createdAt: '2026-09-29T10:45:00.000Z',
  },
];

const INITIAL_PROCEDURE_RECEIPTS: ProcedureReceipt[] = [
  {
    id: 'prc-1',
    receiptNumber: 'PRC-2026-0001',
    date: '2026-09-25',
    patientId: 'pat-2',
    patientName: 'Fatima Bibi',
    patientMrNumber: 'HK-000002',
    doctorName: 'Dr. Haroon Kibriya',
    procedures: [
      {
        id: 'proc-1',
        name: 'Nebulization & Inhalation Therapy',
        charges: 800,
        discount: 0,
        notes: 'Duolin + Clenil administered',
      },
      {
        id: 'proc-2',
        name: 'Blood Sugar & Vitals Screening',
        charges: 400,
        discount: 100,
        notes: 'Glucometer spot check',
      },
    ],
    totalCharges: 1200,
    totalDiscount: 100,
    netPayable: 1100,
    paidAmount: 1100,
    balance: 0,
    paymentMethod: 'Cash',
    notes: 'Emergency allergic broncho-spasm stabilization',
    verificationCode: 'PRC-VER-001',
    createdAt: '2026-09-25T17:00:00.000Z',
  },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    appointmentNumber: 'APT-2026-01',
    patientId: 'pat-1',
    patientName: 'Muhammad Tariq',
    patientMrNumber: 'HK-000001',
    patientPhone: '+92 321 4455667',
    doctorName: 'Dr. Haroon Kibriya',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlot: '05:00 PM',
    type: 'In-Clinic',
    status: 'Confirmed',
    reason: 'Follow-up for BP evaluation & lab review',
    feeAmount: 2000,
    isPaid: true,
    createdAt: '2026-09-30T10:00:00.000Z',
  },
  {
    id: 'apt-2',
    appointmentNumber: 'APT-2026-02',
    patientId: 'pat-2',
    patientName: 'Fatima Bibi',
    patientMrNumber: 'HK-000002',
    patientPhone: '+92 333 1122334',
    doctorName: 'Dr. Haroon Kibriya',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlot: '06:30 PM',
    type: 'Online Consultation',
    status: 'Pending',
    reason: 'Review acid reflux symptoms and medicine response',
    feeAmount: 1500,
    isPaid: false,
    createdAt: '2026-10-01T08:00:00.000Z',
  },
  {
    id: 'apt-3',
    appointmentNumber: 'APT-2026-03',
    patientId: 'pat-3',
    patientName: 'Zubair Ahmed',
    patientMrNumber: 'HK-000003',
    patientPhone: '+92 300 7766554',
    doctorName: 'Dr. Haroon Kibriya',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    timeSlot: '07:15 PM',
    type: 'In-Clinic',
    status: 'Confirmed',
    reason: 'Review HbA1c and Knee joint X-ray reports',
    feeAmount: 2000,
    isPaid: false,
    createdAt: '2026-10-01T09:00:00.000Z',
  },
];

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
    return getStorageItem<ClinicSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_CLINIC_SETTINGS);
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
