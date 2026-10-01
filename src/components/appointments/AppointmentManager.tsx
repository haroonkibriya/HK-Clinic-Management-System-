import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Plus,
  Phone,
  MessageCircle,
  Video,
  Building,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
} from 'lucide-react';
import { Appointment, Patient, ClinicSettings, UserRole } from '../../types';
import { AppointmentRepository } from '../../database/storage';

interface AppointmentManagerProps {
  appointments: Appointment[];
  patients: Patient[];
  settings: ClinicSettings;
  onRefresh: () => void;
  isUrdu: boolean;
  role: UserRole;
  currentUser: string;
}

export const AppointmentManager: React.FC<AppointmentManagerProps> = ({
  appointments,
  patients,
  settings,
  onRefresh,
  isUrdu,
  role,
  currentUser,
}) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');
  const [filterType, setFilterType] = useState<'All' | 'In-Clinic' | 'Online Consultation'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking Form State
  const [bookingPatientType, setBookingPatientType] = useState<'existing' | 'new'>('existing');
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState('05:30 PM');
  const [consultType, setConsultType] = useState<'In-Clinic' | 'Online Consultation'>('In-Clinic');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const availableSlots = [
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '05:00 PM',
    '05:30 PM',
    '06:00 PM',
    '06:30 PM',
    '07:00 PM',
    '07:30 PM',
    '08:00 PM',
  ];

  const filteredAppointments = appointments.filter((a) => {
    if (filterStatus !== 'All' && a.status !== filterStatus) return false;
    if (filterType !== 'All' && a.type !== filterType) return false;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      a.patientName.toLowerCase().includes(q) ||
      a.patientPhone.includes(q) ||
      (a.patientMrNumber && a.patientMrNumber.toLowerCase().includes(q)) ||
      a.appointmentNumber.toLowerCase().includes(q)
    );
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    let name = patientName;
    let phone = patientPhone;
    let mrNumber = '';

    if (bookingPatientType === 'existing') {
      const p = patients.find((pat) => pat.id === selectedPatientId);
      if (!p) {
        setError('Please select an existing patient.');
        return;
      }
      name = p.name;
      phone = p.phone;
      mrNumber = p.mrNumber;
    } else {
      if (!name.trim()) {
        setError('Please provide patient name.');
        return;
      }
      if (!phone.trim()) {
        setError('Please provide contact phone.');
        return;
      }
    }

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      appointmentNumber: `APT-2026-${Math.floor(10 + Math.random() * 90)}`,
      patientId: bookingPatientType === 'existing' ? selectedPatientId : `pat-${Date.now()}`,
      patientName: name.trim(),
      patientMrNumber: mrNumber || undefined,
      patientPhone: phone.trim(),
      doctorName: settings.doctorName,
      date: appointmentDate,
      timeSlot,
      type: consultType,
      status: 'Confirmed',
      reason: reason.trim() || undefined,
      feeAmount: consultType === 'Online Consultation' ? 1500 : 2000,
      isPaid: false,
      createdAt: new Date().toISOString(),
    };

    AppointmentRepository.save(newApt, currentUser);
    setShowBookingModal(false);
    onRefresh();
  };

  const handleStatusChange = (id: string, newStatus: Appointment['status']) => {
    AppointmentRepository.updateStatus(id, newStatus, currentUser);
    onRefresh();
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Booking Bar */}
      <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                isUrdu
                  ? 'اپائنٹمنٹ تلاش کریں: مریض کا نام، فون نمبر، بکنگ نمبر...'
                  : 'Search visits by Patient Name, Phone, APT#...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBookingModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-semibold rounded-xl text-xs shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>{isUrdu ? 'نئی اپائنٹمنٹ بک کریں' : 'Book Appointment'}</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                  filterStatus === st
                    ? 'bg-white text-teal-800 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['All', 'In-Clinic', 'Online Consultation'] as const).map((tp) => (
              <button
                key={tp}
                onClick={() => setFilterType(tp)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition ${
                  filterType === tp
                    ? 'bg-white text-teal-800 font-bold shadow-2xs'
                    : 'text-slate-600'
                }`}
              >
                {tp === 'Online Consultation' ? 'Online' : tp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Cards List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
          No appointments recorded matching this criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      apt.type === 'Online Consultation'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-teal-50 text-teal-800 border border-teal-200'
                    }`}
                  >
                    {apt.type === 'Online Consultation' ? (
                      <Video className="w-4 h-4" />
                    ) : (
                      <Building className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{apt.patientName}</h3>
                    <p className="text-[11px] text-slate-500">
                      {apt.patientMrNumber ? `MR: ${apt.patientMrNumber} • ` : ''}
                      {apt.type}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    apt.status === 'Confirmed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : apt.status === 'Completed'
                      ? 'bg-blue-100 text-blue-800'
                      : apt.status === 'Cancelled'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {apt.status}
                </span>
              </div>

              {/* Date & Time */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="font-mono">{apt.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="font-semibold text-teal-900">{apt.timeSlot}</span>
                </div>
              </div>

              {apt.reason && (
                <p className="text-xs text-slate-600 bg-teal-50/50 p-2 rounded-lg border border-teal-100/60">
                  Reason: <strong>{apt.reason}</strong>
                </p>
              )}

              {/* Contact Actions & Status Controls */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${apt.patientPhone}`}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs"
                    title="Call Patient"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/${apt.patientPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs"
                    title="WhatsApp Patient"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-1 text-[10px]">
                  {apt.status !== 'Confirmed' && (
                    <button
                      onClick={() => handleStatusChange(apt.id, 'Confirmed')}
                      className="px-2 py-1 rounded bg-emerald-50 text-emerald-800 font-semibold hover:bg-emerald-100"
                    >
                      Confirm
                    </button>
                  )}
                  {apt.status !== 'Completed' && (
                    <button
                      onClick={() => handleStatusChange(apt.id, 'Completed')}
                      className="px-2 py-1 rounded bg-blue-50 text-blue-800 font-semibold hover:bg-blue-100"
                    >
                      Complete
                    </button>
                  )}
                  {apt.status !== 'Cancelled' && (
                    <button
                      onClick={() => handleStatusChange(apt.id, 'Cancelled')}
                      className="px-2 py-1 rounded bg-rose-50 text-rose-800 font-semibold hover:bg-rose-100"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="bg-teal-700 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-200" />
                <h2 className="font-bold text-sm">
                  {isUrdu ? 'نئی اپائنٹمنٹ درج کریں' : 'Book Clinical Appointment'}
                </h2>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-1 rounded-lg text-teal-100 hover:bg-teal-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              {error && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
                  {error}
                </div>
              )}

              {/* Consultation Type */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setConsultType('In-Clinic')}
                  className={`py-2 rounded-lg font-bold transition text-center ${
                    consultType === 'In-Clinic'
                      ? 'bg-white text-teal-800 shadow-2xs'
                      : 'text-slate-600'
                  }`}
                >
                  In-Clinic Visit
                </button>
                <button
                  type="button"
                  onClick={() => setConsultType('Online Consultation')}
                  className={`py-2 rounded-lg font-bold transition text-center ${
                    consultType === 'Online Consultation'
                      ? 'bg-white text-teal-800 shadow-2xs'
                      : 'text-slate-600'
                  }`}
                >
                  Online Consultation
                </button>
              </div>

              {/* Patient Selection Type */}
              <div className="space-y-2">
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                    <input
                      type="radio"
                      checked={bookingPatientType === 'existing'}
                      onChange={() => setBookingPatientType('existing')}
                      className="text-teal-600"
                    />
                    <span>Existing Patient</span>
                  </label>
                  <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                    <input
                      type="radio"
                      checked={bookingPatientType === 'new'}
                      onChange={() => setBookingPatientType('new')}
                      className="text-teal-600"
                    />
                    <span>New Walk-in / Caller</span>
                  </label>
                </div>

                {bookingPatientType === 'existing' ? (
                  <div>
                    <select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                    >
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.mrNumber}) — {p.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="text"
                        placeholder="Patient Full Name *"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Contact Phone *"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Appointment Date</label>
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Available Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-teal-900"
                  >
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Visit</label>
                <input
                  type="text"
                  placeholder="e.g. Fever checkup, blood pressure review, lab discussion"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              {/* Submit */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 active:scale-95 shadow-md"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
