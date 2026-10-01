import React, { useState } from 'react';
import { X, Sliders, Check, RotateCcw } from 'lucide-react';
import { PageSetupConfig } from '../../types';
import { DEFAULT_PAGE_SETUP } from '../../database/storage';

interface PageSetupModalProps {
  config: PageSetupConfig;
  onSave: (config: PageSetupConfig) => void;
  onClose: () => void;
  isUrdu: boolean;
}

export const PageSetupModal: React.FC<PageSetupModalProps> = ({
  config,
  onSave,
  onClose,
  isUrdu,
}) => {
  const [form, setForm] = useState<PageSetupConfig>({ ...config });

  const handleReset = () => {
    setForm({ ...DEFAULT_PAGE_SETUP });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="font-bold text-sm">
                {isUrdu ? 'صفحہ سیٹ اپ و پرنٹنگ مارجنز' : 'Page Setup & Print Margins'}
              </h2>
              <p className="text-[10px] text-slate-300">
                {isUrdu ? 'لیٹر ہیڈ اور پیپر سائز ایڈجسٹمنٹ' : 'Word-style margin adjustments for physical letterheads'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Paper Size & Orientation */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isUrdu ? 'کاغذ کا سائز' : 'Paper Size'}
              </label>
              <select
                value={form.paperSize}
                onChange={(e) =>
                  setForm({ ...form, paperSize: e.target.value as 'a4' | 'a4-half' | 'letter' })
                }
                className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white font-medium"
              >
                <option value="a4">A4 Full Sheet (210 × 297 mm)</option>
                <option value="a4-half">A4 Half-Page (210 × 148 mm)</option>
                <option value="letter">US Letter (216 × 279 mm)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isUrdu ? 'فونٹ سائز' : 'Prescription Font Size'}
              </label>
              <select
                value={form.fontSize}
                onChange={(e) =>
                  setForm({ ...form, fontSize: e.target.value as 'small' | 'medium' | 'large' })
                }
                className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white font-medium"
              >
                <option value="small">Compact (Small)</option>
                <option value="medium">Standard (Medium)</option>
                <option value="large">Spacious (Large)</option>
              </select>
            </div>
          </div>

          {/* Margins in mm */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-teal-800">
              {isUrdu ? 'چاروں اطراف کے مارجنز (ملی میٹر میں)' : 'Page Margins (in Millimeters)'}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block font-semibold text-slate-600 mb-0.5">Top (اوپر)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.marginTop}
                    onChange={(e) => setForm({ ...form, marginTop: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white pr-7 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mm</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-0.5">Bottom (نیچے)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.marginBottom}
                    onChange={(e) => setForm({ ...form, marginBottom: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white pr-7 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mm</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-0.5">Left (بائیں)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={form.marginLeft}
                    onChange={(e) => setForm({ ...form, marginLeft: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white pr-7 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mm</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-0.5">Right (دائیں)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={form.marginRight}
                    onChange={(e) => setForm({ ...form, marginRight: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white pr-7 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Letterhead Offsets */}
          <div className="bg-teal-50/70 p-3.5 rounded-xl border border-teal-200 space-y-3">
            <h3 className="font-bold text-teal-900 text-[11px] uppercase tracking-wider">
              {isUrdu ? 'موجودہ پرنٹڈ لیٹر ہیڈ آف سیٹ' : 'Existing Pre-printed Letterhead Offsets'}
            </h3>
            <p className="text-[11px] text-teal-800 leading-normal">
              {isUrdu
                ? 'اگر آپ کلینک کے پہلے سے چھپے ہوئے پیڈ / لیٹر ہیڈ پر پرنٹ کر رہے ہیں، تو اوپر اور نیچے کی خالی جگہ یہاں ایڈجسٹ کریں۔'
                : 'Adjust header and footer spacing so medicine instructions print below physical clinic letterhead.'}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-teal-900 mb-0.5">
                  Header Height Gap (اوپری ہیڈر خالی جگہ)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="150"
                    value={form.headerHeight}
                    onChange={(e) => setForm({ ...form, headerHeight: Number(e.target.value) })}
                    className="w-full rounded-lg border border-teal-300 p-2 text-xs bg-white pr-7 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-teal-600">mm</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-teal-900 mb-0.5">
                  Footer Height Gap (نچلی فوٹر خالی جگہ)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="80"
                    value={form.footerHeight}
                    onChange={(e) => setForm({ ...form, footerHeight: Number(e.target.value) })}
                    className="w-full rounded-lg border border-teal-300 p-2 text-xs bg-white pr-7 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-teal-600">mm</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hideHeader}
                  onChange={(e) => setForm({ ...form, hideHeader: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>
                  {isUrdu
                    ? 'ہیڈر غائب رکھیں (لیٹر ہیڈ پر پہلے سے ڈاکٹر کی معلومات موجود ہیں)'
                    : 'Hide clinic header (Letterhead already has doctor branding)'}
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hideFooter}
                  onChange={(e) => setForm({ ...form, hideFooter: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>
                  {isUrdu
                    ? 'فوٹر غائب رکھیں (پتہ اور فون پہلے سے لیٹر ہیڈ پر موجود ہیں)'
                    : 'Hide clinic footer (Contact info already printed at bottom)'}
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.showQrCode}
                  onChange={(e) => setForm({ ...form, showQrCode: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>
                  {isUrdu ? 'کیو آر کوڈ ویریفیکیشن دکھائیں' : 'Include verification QR Code'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'ڈیفالٹ پر ری سیٹ کریں' : 'Reset Defaults'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
            >
              {isUrdu ? 'منسوخ' : 'Cancel'}
            </button>
            <button
              onClick={() => onSave(form)}
              className="px-5 py-2 rounded-xl bg-teal-600 font-semibold text-white hover:bg-teal-700 active:scale-95 transition flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>{isUrdu ? 'ترتیبات لاگو کریں' : 'Apply Settings'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
