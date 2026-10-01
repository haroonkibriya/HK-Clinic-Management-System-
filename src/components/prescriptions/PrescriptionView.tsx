import React, { useState, useEffect } from 'react';
import {
  Printer,
  Sliders,
  ArrowLeft,
  History,
  QrCode,
  FileText,
  Share2,
  Check,
  Building,
} from 'lucide-react';
import { Prescription, ClinicSettings, PageSetupConfig } from '../../types';
import { generateQrDataUrl } from '../../services/qrService';
import { PageSetupModal } from './PageSetupModal';
import { PrescriptionHistoryModal } from './PrescriptionHistoryModal';
import { PrescriptionRepository, SettingsRepository } from '../../database/storage';

interface PrescriptionViewProps {
  prescription: Prescription;
  settings: ClinicSettings;
  onBack: () => void;
  onEdit: (prescription: Prescription) => void;
  isUrdu: boolean;
  currentUser: string;
}

export const PrescriptionView: React.FC<PrescriptionViewProps> = ({
  prescription,
  settings,
  onBack,
  onEdit,
  isUrdu,
  currentUser,
}) => {
  const [templateType, setTemplateType] = useState<'builtin' | 'letterhead'>(
    prescription.templateType || 'builtin'
  );
  const [pageSetup, setPageSetup] = useState<PageSetupConfig>(
    prescription.pageSetup || settings.defaultPageSetup
  );
  const [showPageSetupModal, setShowPageSetupModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    async function loadQr() {
      // Secure verification payload matching PRD Section 16 (unique verification ID rather than raw sensitive data)
      const qrData = `HK-CLINIC-VERIFY:${prescription.prescriptionNumber}:${prescription.patientMrNumber}:${prescription.verificationCode}`;
      const url = await generateQrDataUrl(qrData);
      setQrCodeUrl(url);
    }
    loadQr();
  }, [prescription]);

  const handlePrint = () => {
    // Log print action in audit
    PrescriptionRepository.save({
      ...prescription,
      templateType,
      pageSetup,
    }, currentUser);
    window.print();
  };

  const handlePageSetupSave = (newSetup: PageSetupConfig) => {
    setPageSetup(newSetup);
    setShowPageSetupModal(false);
    // Persist to prescription
    PrescriptionRepository.save(
      {
        ...prescription,
        pageSetup: newSetup,
        templateType,
      },
      currentUser
    );
  };

  const handleShare = () => {
    const summary = `HK Clinic Prescription - ${prescription.prescriptionNumber}\nPatient: ${prescription.patientName} (${prescription.patientMrNumber})\nDoctor: ${prescription.doctorName}\nVerification ID: ${prescription.verificationCode}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Controls (hidden in print) */}
      <div className="no-print bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isUrdu ? 'واپس' : 'Back'}</span>
          </button>
          <span className="font-mono font-bold text-xs bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-lg">
            {prescription.prescriptionNumber}
          </span>
        </div>

        {/* Template Selector: Option 1 Built-in vs Option 2 Letterhead */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setTemplateType('builtin')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              templateType === 'builtin'
                ? 'bg-white text-teal-800 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isUrdu ? 'کلینک ڈیزائن (Built-in)' : 'Built-in Design'}
          </button>
          <button
            onClick={() => setTemplateType('letterhead')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              templateType === 'letterhead'
                ? 'bg-white text-teal-800 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isUrdu ? 'پرنٹڈ لیٹر ہیڈ (Letterhead)' : 'Existing Letterhead'}
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Page Setup Button */}
          <button
            onClick={() => setShowPageSetupModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold transition"
            title="Adjust Margins & Letterhead Offsets"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'صفحہ سیٹ اپ' : 'Page Setup'}</span>
          </button>

          {/* Versions History */}
          {prescription.versions && prescription.versions.length > 0 && (
            <button
              onClick={() => setShowHistoryModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded-xl text-xs font-semibold transition"
            >
              <History className="w-3.5 h-3.5" />
              <span>v{prescription.versions.length} History</span>
            </button>
          )}

          {/* Share */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold transition"
          >
            {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedShare ? 'Copied!' : 'Share'}</span>
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(prescription)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 rounded-xl text-xs font-semibold transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'ترمیم' : 'Edit Rx'}</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 active:scale-95 shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>{isUrdu ? 'نسخہ پرنٹ کریں' : 'Print / PDF'}</span>
          </button>
        </div>
      </div>

      {/* Live Prescription Preview Sheet */}
      <div className="flex justify-center p-2 sm:p-4 bg-slate-200/70 rounded-2xl overflow-x-auto">
        <div
          id="printable-prescription"
          className="printable-area bg-white text-slate-900 shadow-xl transition-all relative"
          style={{
            width: pageSetup.paperSize === 'a4-half' ? '148mm' : '210mm',
            minHeight: pageSetup.paperSize === 'a4-half' ? '210mm' : '297mm',
            paddingTop:
              templateType === 'letterhead'
                ? `${pageSetup.headerHeight}mm`
                : `${pageSetup.marginTop}mm`,
            paddingBottom:
              templateType === 'letterhead'
                ? `${pageSetup.footerHeight}mm`
                : `${pageSetup.marginBottom}mm`,
            paddingLeft: `${pageSetup.marginLeft}mm`,
            paddingRight: `${pageSetup.marginRight}mm`,
            fontSize:
              pageSetup.fontSize === 'small'
                ? '11px'
                : pageSetup.fontSize === 'large'
                ? '14px'
                : '12px',
          }}
        >
          {/* Option 1: Built-in Clinic Header */}
          {templateType === 'builtin' && !pageSetup.hideHeader && (
            <div className="pb-4 mb-3 border-b-2 border-teal-700 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-lg">
                    HK
                  </div>
                  <div>
                    <h1 className="text-base font-extrabold text-teal-900 tracking-tight leading-tight">
                      {settings.doctorName}
                    </h1>
                    <p className="text-[11px] font-semibold text-teal-800">
                      {settings.doctorQualification}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      {settings.doctorSpecialty} • Reg: {settings.registrationNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Urdu Doctor & Clinic Title */}
              <div className="text-right" dir="rtl">
                <h2 className="text-sm font-bold font-urdu text-teal-900 leading-tight">
                  {settings.doctorNameUrdu}
                </h2>
                <p className="text-[11px] font-urdu text-teal-800">
                  {settings.doctorQualificationUrdu}
                </p>
                <p className="text-[10px] font-urdu text-slate-600">
                  {settings.doctorSpecialtyUrdu}
                </p>
              </div>
            </div>
          )}

          {/* Letterhead spacer indicator in preview (hidden in print) */}
          {templateType === 'letterhead' && (
            <div className="no-print mb-3 py-1.5 px-3 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-800 flex items-center justify-between">
              <span>
                Existing Letterhead Mode: {pageSetup.headerHeight}mm top space reserved for physical printed pad.
              </span>
              <span className="font-semibold">{pageSetup.paperSize.toUpperCase()}</span>
            </div>
          )}

          {/* Patient Info Strip */}
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mb-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Patient Name</span>
              <span className="font-bold text-slate-900">{prescription.patientName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">MR Number</span>
              <span className="font-mono font-bold text-teal-800">{prescription.patientMrNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Age / Gender</span>
              <span className="font-semibold text-slate-800">
                {prescription.patientAge} Yrs / {prescription.patientGender}
              </span>
            </div>
            <div className="text-right sm:text-left">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Date</span>
              <span className="font-mono font-semibold text-slate-800">{prescription.date}</span>
            </div>
          </div>

          {/* Clinical Findings & Vitals */}
          {(prescription.chiefComplaint ||
            prescription.diagnosis ||
            prescription.examination ||
            prescription.vitals) && (
            <div className="mb-3 pb-3 border-b border-slate-200 text-xs space-y-1.5">
              {/* Vitals row */}
              {prescription.vitals && Object.values(prescription.vitals).some(Boolean) && (
                <div className="flex items-center gap-3 text-[11px] bg-teal-50/60 px-2 py-1 rounded border border-teal-100 flex-wrap">
                  <span className="font-bold text-teal-900 uppercase">Vitals:</span>
                  {prescription.vitals.bp && <span>BP: <strong>{prescription.vitals.bp}</strong></span>}
                  {prescription.vitals.pulse && <span>Pulse: <strong>{prescription.vitals.pulse}</strong></span>}
                  {prescription.vitals.weight && <span>Weight: <strong>{prescription.vitals.weight}</strong></span>}
                  {prescription.vitals.temperature && <span>Temp: <strong>{prescription.vitals.temperature}</strong></span>}
                  {prescription.vitals.spo2 && <span>SpO2: <strong>{prescription.vitals.spo2}</strong></span>}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {prescription.chiefComplaint && (
                  <div>
                    <span className="font-bold text-slate-700 text-[11px]">Chief Complaint: </span>
                    <span className="text-slate-800">{prescription.chiefComplaint}</span>
                  </div>
                )}
                {prescription.diagnosis && (
                  <div>
                    <span className="font-bold text-teal-900 text-[11px]">Diagnosis: </span>
                    <span className="font-bold text-teal-950 underline decoration-teal-300">
                      {prescription.diagnosis}
                    </span>
                  </div>
                )}
              </div>

              {prescription.investigations && (
                <div className="text-[11px]">
                  <span className="font-bold text-slate-700">Lab Investigations: </span>
                  <span className="text-slate-800">{prescription.investigations}</span>
                </div>
              )}
            </div>
          )}

          {/* Main Prescription Section with Classic Rx Symbol */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-serif font-black text-2xl text-teal-800 tracking-tighter">℞</span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Prescribed Medicines (ادویات)
            </span>
          </div>

          {/* Medicines List Table */}
          <div className="space-y-3 mb-4">
            {prescription.medicines.map((med, idx) => (
              <div
                key={med.id || idx}
                className="p-2.5 rounded-lg border border-slate-200 bg-white space-y-1 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-900 font-bold text-[11px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-extrabold text-sm text-slate-900">{med.brandName}</span>{' '}
                      <span className="text-[11px] text-teal-800 font-semibold">({med.strength})</span>
                      <span className="ml-1 text-[10px] text-slate-500 italic">
                        — {med.genericName}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {med.dosageForm} • {med.duration}
                  </span>
                </div>

                {/* Dosage frequency & instructions */}
                <div className="pl-7 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="text-slate-700">
                    <span className="font-semibold text-slate-600">Dose:</span> {med.frequency}{' '}
                    {med.quantity && `(${med.quantity})`}
                  </div>

                  {/* Urdu Nastaliq Instruction */}
                  {med.instructions && (
                    <div
                      className="font-urdu text-[13px] text-teal-900 bg-teal-50/70 px-2.5 py-0.5 rounded text-right border border-teal-100"
                      dir="rtl"
                    >
                      {med.instructions}
                    </div>
                  )}
                </div>

                {med.notes && (
                  <div className="pl-7 text-[10px] text-slate-500 italic">Note: {med.notes}</div>
                )}
              </div>
            ))}
          </div>

          {/* Advice & Follow-up */}
          {(prescription.advice || prescription.followUpDate) && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-4 text-xs space-y-1">
              {prescription.advice && (
                <div>
                  <span className="font-bold text-slate-700">Advice & Precautions: </span>
                  <span className="text-slate-800">{prescription.advice}</span>
                </div>
              )}
              {prescription.followUpDate && (
                <div className="text-teal-900 font-bold">
                  Next Follow-up Visit: {prescription.followUpDate}
                </div>
              )}
            </div>
          )}

          {/* Footer Area with QR Code & Clinic Info */}
          <div className="mt-8 pt-3 border-t border-slate-300 flex items-end justify-between text-[10px] text-slate-500">
            <div>
              {templateType === 'builtin' && !pageSetup.hideFooter && (
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-800">{settings.clinicName}</p>
                  <p>{settings.address}</p>
                  <p>Ph: {settings.phone} • WhatsApp: {settings.whatsapp}</p>
                </div>
              )}
              <p className="mt-1 text-[9px] text-slate-400 font-mono">
                Prescription Ref: {prescription.prescriptionNumber} • Verified: {prescription.verificationCode}
              </p>
            </div>

            {/* Doctor Signature / QR block */}
            <div className="flex items-center gap-3">
              {pageSetup.showQrCode && qrCodeUrl && (
                <div className="text-center">
                  <img src={qrCodeUrl} alt="Verification QR" className="w-16 h-16 mx-auto" />
                  <span className="text-[8px] font-mono text-slate-400 block mt-0.5">Scan to verify</span>
                </div>
              )}

              <div className="text-center w-36">
                <div className="h-10 border-b border-dashed border-slate-400"></div>
                <span className="text-[10px] font-semibold text-slate-700 block mt-1">
                  {settings.doctorName}
                </span>
                <span className="text-[9px] text-slate-400">Doctor's Signature</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Setup Modal */}
      {showPageSetupModal && (
        <PageSetupModal
          config={pageSetup}
          onSave={handlePageSetupSave}
          onClose={() => setShowPageSetupModal(false)}
          isUrdu={isUrdu}
        />
      )}

      {/* Revision History Modal */}
      {showHistoryModal && (
        <PrescriptionHistoryModal
          prescription={prescription}
          onClose={() => setShowHistoryModal(false)}
          isUrdu={isUrdu}
        />
      )}
    </div>
  );
};
