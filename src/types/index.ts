export type UserRole = 'doctor' | 'assistant' | 'patient';

export interface UserSession {
  role: UserRole;
  name: string;
  id: string;
  patientId?: string; // If patient role
}

export interface Patient {
  id: string;
  mrNumber: string; // e.g. HK-000001
  name: string;
  fatherOrHusbandName: string;
  age: number;
  dob?: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  email?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  registrationDate: string; // ISO string
  notes?: string;
  allergies?: string[];
  medicalHistory?: MedicalHistory;
}

export interface MedicalHistory {
  chiefComplaint?: string;
  symptoms?: string;
  pastMedicalHistory?: string;
  surgicalHistory?: string;
  drugAllergies?: string;
  currentMedicines?: string;
  familyHistory?: string;
  socialHistory?: string;
  examination?: string;
  diagnosis?: string;
  investigations?: string;
  doctorNotes?: string;
  followUpAdvice?: string;
  updatedAt: string;
}

export interface MedicineItem {
  id: string;
  brandName: string;
  genericName: string;
  strength: string; // e.g. 500mg, 10mg, 1g
  dosageForm: string; // Tablet, Capsule, Syrup, Injection, Cream, Drops
  frequency: string; // e.g. 1-0-1, 1-1-1, Once daily, Twice daily, ہر 8 گھنٹے بعد
  duration: string; // e.g. 5 Days, 1 Week, 10 دن
  route: string; // Oral, Topical, IV, IM, Inhalation
  instructions: string; // English or Urdu Nastaliq: کھانے کے بعد
  quantity: string; // e.g. 10 Tabs, 1 Bottle
  notes?: string;
}

export interface MedicineCatalogEntry {
  id: string;
  brandName: string;
  genericName: string;
  strength: string;
  dosageForm: string;
  manufacturer: string;
  category: string;
  packSize?: string;
  price?: number;
  isFavorite?: boolean;
}

export interface PrescriptionVersion {
  version: number;
  timestamp: string;
  modifiedBy: string;
  medicines: MedicineItem[];
  diagnosis: string;
  clinicalNotes: string;
  advice: string;
}

export interface Prescription {
  id: string;
  prescriptionNumber: string; // e.g. RX-2026-0001
  patientId: string;
  patientName: string;
  patientMrNumber: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  date: string; // YYYY-MM-DD
  doctorName: string;
  doctorQualification: string;
  doctorSpecialty: string;
  clinicName: string;
  chiefComplaint: string;
  vitals?: {
    bp?: string;
    pulse?: string;
    temperature?: string;
    weight?: string;
    spo2?: string;
    sugar?: string;
  };
  examination: string;
  diagnosis: string;
  investigations: string;
  medicines: MedicineItem[];
  advice: string;
  followUpDate?: string;
  verificationCode: string;
  templateType: 'builtin' | 'letterhead'; // Built-in design vs Existing physical letterhead
  pageSetup?: PageSetupConfig;
  versions?: PrescriptionVersion[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface PageSetupConfig {
  paperSize: 'a4' | 'a4-half' | 'letter';
  orientation: 'portrait' | 'landscape';
  marginTop: number; // in mm
  marginBottom: number; // in mm
  marginLeft: number; // in mm
  marginRight: number; // in mm
  headerHeight: number; // in mm (space reserved for existing letterhead header)
  footerHeight: number; // in mm (space reserved for existing letterhead footer)
  hideHeader: boolean; // true if physical letterhead has printed header
  hideFooter: boolean; // true if physical letterhead has printed footer
  showQrCode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export interface FeeReceipt {
  id: string;
  receiptNumber: string; // e.g. REC-2026-0001
  date: string;
  patientId: string;
  patientName: string;
  patientMrNumber: string;
  doctorName: string;
  consultationFee: number;
  discount: number;
  total: number;
  paidAmount: number;
  balance: number;
  paymentMethod: 'Cash' | 'Bank' | 'Card' | 'Online' | 'Other';
  notes?: string;
  verificationCode: string;
  createdAt: string;
}

export interface ProcedureItem {
  id: string;
  name: string;
  charges: number;
  discount: number;
  notes?: string;
}

export interface ProcedureReceipt {
  id: string;
  receiptNumber: string; // e.g. PRC-2026-0001
  date: string;
  patientId: string;
  patientName: string;
  patientMrNumber: string;
  doctorName: string;
  procedures: ProcedureItem[];
  totalCharges: number;
  totalDiscount: number;
  netPayable: number;
  paidAmount: number;
  balance: number;
  paymentMethod: 'Cash' | 'Bank' | 'Card' | 'Online' | 'Other';
  notes?: string;
  verificationCode: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientId: string;
  patientName: string;
  patientMrNumber?: string;
  patientPhone: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. 10:30 AM
  type: 'In-Clinic' | 'Online Consultation';
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  reason?: string;
  notes?: string;
  feeAmount?: number;
  isPaid?: boolean;
  createdAt: string;
}

export interface ClinicSettings {
  clinicName: string;
  clinicNameUrdu: string;
  tagline: string;
  taglineUrdu: string;
  doctorName: string;
  doctorNameUrdu: string;
  doctorQualification: string;
  doctorQualificationUrdu: string;
  doctorSpecialty: string;
  doctorSpecialtyUrdu: string;
  registrationNumber: string; // PMDC / Medical Council #
  address: string;
  addressUrdu: string;
  phone: string;
  whatsapp: string;
  email: string;
  googleMapsUrl: string;
  googleMapsCoordinates?: string;
  currency: string; // PKR, Rs.
  adminPassword?: string; // App administration lock password
  consultationFee?: number;
  clinicTimings?: string;
  clinicTimingsUrdu?: string;
  mrNumberPrefix: string; // e.g. HK-
  mrNumberDigits: number; // e.g. 6 -> HK-000001
  logoUrl?: string;
  logoPosition: 'left' | 'center' | 'right';
  logoWidth: number; // in px
  receiptFooterText: string;
  receiptFooterTextUrdu: string;
  defaultPageSetup: PageSetupConfig;
  language: 'en' | 'ur';
}

export interface AuditLogEntry {
  id: string;
  user: string;
  role: UserRole;
  action: string;
  details: string;
  timestamp: string;
}
