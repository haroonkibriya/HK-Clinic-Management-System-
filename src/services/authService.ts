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
   * Unified Authentication for HK Clinic Management System
   */
  authenticate(username: string, password: string, rememberMe: boolean = true, settings?: ClinicSettings): {
    success: boolean;
    session?: AppUserSession;
    error?: string;
  } {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();
    const clinicSettings = settings || SettingsRepository.get();
    const validAdminPass = (clinicSettings.adminPassword || 'admin123').trim();

    if (!cleanUser || !cleanPass) {
      return {
        success: false,
        error: 'Please enter both username and password.',
      };
    }

    // 1. Doctor / Admin username patterns
    const isDoctor =
      cleanUser === 'admin' ||
      cleanUser === 'doctor' ||
      cleanUser === 'drharoon' ||
      cleanUser === 'dr.haroon' ||
      cleanUser === 'dr. haroon' ||
      cleanUser === 'dr haroon kibriya' ||
      cleanUser === 'haroonkibriya@gmail.com' ||
      cleanUser === clinicSettings.phone.replace(/[^0-9]/g, '');

    // 2. Clinic Assistant / Staff username patterns
    const isAssistant =
      cleanUser === 'assistant' ||
      cleanUser === 'staff' ||
      cleanUser === 'reception' ||
      cleanUser === 'receptionist';

    // Verify Password against clinic administration password
    if ((isDoctor || isAssistant) && cleanPass === validAdminPass) {
      const role: UserRole = isDoctor ? 'doctor' : 'assistant';
      const name = isDoctor
        ? clinicSettings.doctorName || 'Dr. Haroon Kibriya'
        : 'Clinic Assistant (Staff)';

      const session: AppUserSession = {
        role,
        name,
        identifier: username.trim(),
        isLoggedIn: true,
      };

      if (rememberMe) {
        this.saveSession(session);
      }
      AuditRepository.log(name, 'USER_LOGIN', `${role.toUpperCase()} authenticated successfully into HK Clinic Management System`, role);
      return { success: true, session };
    }

    // Also support any clinic username with the master administration password
    if (cleanPass === validAdminPass && cleanUser.length >= 3) {
      const isStaff = cleanUser.includes('assistant') || cleanUser.includes('staff');
      const role: UserRole = isStaff ? 'assistant' : 'doctor';
      const name = isStaff ? 'Clinic Assistant' : clinicSettings.doctorName || 'Dr. Haroon Kibriya';

      const session: AppUserSession = {
        role,
        name,
        identifier: username.trim(),
        isLoggedIn: true,
      };

      if (rememberMe) {
        this.saveSession(session);
      }
      AuditRepository.log(name, 'USER_LOGIN', `User ${username} authenticated successfully into HK Clinic Management System`, role);
      return { success: true, session };
    }

    // 3. Support Patient Login via MR number or registered phone
    const allPatients = PatientRepository.getAll();
    const patientMatch = allPatients.find(
      (p) =>
        p.mrNumber.toLowerCase() === cleanUser ||
        p.phone.replace(/[^0-9]/g, '') === cleanUser.replace(/[^0-9]/g, '') ||
        (p.email && p.email.toLowerCase() === cleanUser)
    );

    if (patientMatch && (cleanPass === validAdminPass || cleanPass === '1234' || cleanPass === patientMatch.mrNumber.toLowerCase())) {
      const session: AppUserSession = {
        role: 'patient',
        name: patientMatch.name,
        patientId: patientMatch.id,
        identifier: cleanUser,
        isLoggedIn: true,
      };

      if (rememberMe) {
        this.saveSession(session);
      }
      AuditRepository.log(patientMatch.name, 'PATIENT_LOGIN', `Patient ${patientMatch.name} signed in`, 'patient');
      return { success: true, session };
    }

    // If credentials are incorrect, return strict generic message
    return {
      success: false,
      error: 'Invalid username or password.',
    };
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
    const newMrNumber = PatientRepository.getNextMrNumber();
    const newPatient = PatientRepository.save(
      {
        id: `pat-${Date.now()}`,
        mrNumber: newMrNumber,
        name: newName,
        fatherOrHusbandName: 'N/A',
        phone: !isEmail ? params.identifier.trim() : '+92 300 0000000',
        email: isEmail ? cleanId : undefined,
        age: params.age || 30,
        gender: params.gender || 'Male',
        address: params.city || 'Lahore',
        city: params.city || 'Lahore',
        registrationDate: new Date().toISOString(),
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
