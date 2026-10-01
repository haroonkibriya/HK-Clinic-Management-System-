import { UserRole, Patient, ClinicSettings } from '../types';
import { PatientRepository, AuditRepository, SettingsRepository } from '../database/storage';

export interface AppUserSession {
  role: UserRole;
  name: string;
  patientId?: string;
  identifier?: string; // Mobile or Gmail
  isLoggedIn: boolean;
}

const SESSION_STORAGE_KEY = 'hk_clinic_user_active_session_v2';

export const AuthService = {
  getSession(): AppUserSession | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  saveSession(session: AppUserSession): void {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      window.dispatchEvent(new Event('hk-auth-session-change'));
    } catch (e) {
      console.error('Error saving session:', e);
    }
  },

  clearSession(): void {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      window.dispatchEvent(new Event('hk-auth-session-change'));
    } catch (e) {
      console.error('Error clearing session:', e);
    }
  },

  verifyAdminPassword(inputPassword: string, settings?: ClinicSettings): boolean {
    const clinicSettings = settings || SettingsRepository.get();
    const correctPassword = clinicSettings.adminPassword || 'admin123';
    return inputPassword.trim() === correctPassword.trim();
  },

  /**
   * Patient Registration / Login by Mobile Number or Gmail
   */
  findOrCreatePatient(params: {
    identifier: string; // Mobile number (e.g. 0300-1234567) or Gmail
    name?: string;
    age?: number;
    gender?: 'Male' | 'Female' | 'Other';
    city?: string;
  }): Patient {
    const allPatients = PatientRepository.getAll();
    const cleanId = params.identifier.trim().toLowerCase();

    // Check if phone or email matches
    const existing = allPatients.find((p) => {
      const pPhone = p.phone ? p.phone.replace(/[^0-9]/g, '') : '';
      const inputCleanPhone = cleanId.replace(/[^0-9]/g, '');
      const matchesPhone = inputCleanPhone.length >= 7 && pPhone.includes(inputCleanPhone);
      const matchesEmail = p.email && p.email.toLowerCase().trim() === cleanId;
      return matchesPhone || matchesEmail;
    });

    if (existing) {
      AuditRepository.log(
        existing.name,
        'PATIENT_LOGIN',
        `Patient logged in with ${params.identifier} (MR: ${existing.mrNumber})`,
        'patient'
      );
      return existing;
    }

    // Otherwise create new patient account
    const isEmail = cleanId.includes('@');
    const newName = params.name?.trim() || (isEmail ? cleanId.split('@')[0] : `Patient ${cleanId.slice(-4)}`);
    const newPatient = PatientRepository.create(
      {
        name: newName,
        phone: !isEmail ? params.identifier.trim() : '+92 300 0000000',
        email: isEmail ? cleanId : undefined,
        age: params.age || 30,
        gender: params.gender || 'Male',
        city: params.city || 'Lahore',
      },
      'Self-Registration'
    );

    AuditRepository.log(
      newPatient.name,
      'PATIENT_SELF_REGISTERED',
      `New patient registered via mobile/Gmail: ${params.identifier} -> MR: ${newPatient.mrNumber}`,
      'patient'
    );

    return newPatient;
  },
};
