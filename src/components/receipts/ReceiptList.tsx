import React, { useState } from 'react';
import { Search, Receipt, Plus, Printer, ChevronRight, Filter } from 'lucide-react';
import { FeeReceipt, ProcedureReceipt, ClinicSettings } from '../../types';

interface ReceiptListProps {
  feeReceipts: FeeReceipt[];
  procedureReceipts: ProcedureReceipt[];
  onNewReceipt: () => void;
  onSelectFeeReceipt: (receipt: FeeReceipt) => void;
  onSelectProcedureReceipt: (receipt: ProcedureReceipt) => void;
  settings: ClinicSettings;
  isUrdu: boolean;
}

export const ReceiptList: React.FC<ReceiptListProps> = ({
  feeReceipts,
  procedureReceipts,
  onNewReceipt,
  onSelectFeeReceipt,
  onSelectProcedureReceipt,
  settings,
  isUrdu,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'fee' | 'procedure'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Combined list for search and filtering
  const allReceipts = [
    ...feeReceipts.map((r) => ({ ...r, type: 'fee' as const })),
    ...procedureReceipts.map((r) => ({ ...r, type: 'procedure' as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filtered = allReceipts.filter((r) => {
    if (filterType !== 'all' && r.type !== filterType) return false;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.receiptNumber.toLowerCase().includes(q) ||
      r.patientName.toLowerCase().includes(q) ||
      r.patientMrNumber.toLowerCase().includes(q) ||
      r.paymentMethod.toLowerCase().includes(q)
    );
  });

  // Financial summary
  const totalCollected = filtered.reduce((sum, r) => sum + r.paidAmount, 0);
  const totalBalance = filtered.reduce((sum, r) => sum + r.balance, 0);

  return (
    <div className="space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                isUrdu
                  ? 'رسید تلاش کریں: نمبر، مریض کا نام، ایم آر، ادائیگی طریقہ...'
                  : 'Search receipts by #, Patient, MR, Payment Method...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                  filterType === 'all'
                    ? 'bg-white text-teal-800 font-bold shadow-2xs'
                    : 'text-slate-600'
                }`}
              >
                All ({allReceipts.length})
              </button>
              <button
                onClick={() => setFilterType('fee')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                  filterType === 'fee'
                    ? 'bg-white text-teal-800 font-bold shadow-2xs'
                    : 'text-slate-600'
                }`}
              >
                Fees ({feeReceipts.length})
              </button>
              <button
                onClick={() => setFilterType('procedure')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                  filterType === 'procedure'
                    ? 'bg-white text-teal-800 font-bold shadow-2xs'
                    : 'text-slate-600'
                }`}
              >
                Procedures ({procedureReceipts.length})
              </button>
            </div>

            <button
              onClick={onNewReceipt}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-semibold rounded-xl text-xs shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>{isUrdu ? 'نئی رسید' : 'New Receipt'}</span>
            </button>
          </div>
        </div>

        {/* Collection stats summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Total Collected</span>
            <span className="font-bold text-emerald-700 font-mono text-sm">
              {totalCollected.toLocaleString()} {settings.currency}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Outstanding Balance</span>
            <span className="font-bold text-amber-700 font-mono text-sm">
              {totalBalance.toLocaleString()} {settings.currency}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1 text-right sm:text-right self-center">
            <span className="text-[10px] text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Digitally Verified Receipts
            </span>
          </div>
        </div>
      </div>

      {/* Receipts List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
          No receipts recorded yet matching this criteria.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                item.type === 'fee'
                  ? onSelectFeeReceipt(item as FeeReceipt)
                  : onSelectProcedureReceipt(item as ProcedureReceipt)
              }
              className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-300 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded border ${
                      item.type === 'fee'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-sky-50 text-sky-800 border-sky-200'
                    }`}
                  >
                    {item.receiptNumber}
                  </span>
                  <span className="font-bold text-xs text-slate-900 group-hover:text-teal-700 transition">
                    {item.patientName}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    ({item.patientMrNumber})
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded uppercase">
                    {item.paymentMethod}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono ml-auto sm:ml-0">
                    {item.date}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600">
                  {item.type === 'fee'
                    ? `Consultation Fee: ${(item as FeeReceipt).consultationFee} ${settings.currency}`
                    : `Procedures: ${(item as ProcedureReceipt).procedures
                        .map((p) => p.name)
                        .join(', ')}`}
                </p>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                <div className="text-right">
                  <div className="font-extrabold text-sm text-slate-900 font-mono">
                    {item.paidAmount} {settings.currency}
                  </div>
                  {item.balance > 0 && (
                    <span className="text-[10px] text-rose-600 font-semibold font-mono block">
                      Bal: {item.balance} {settings.currency}
                    </span>
                  )}
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 p-2 rounded-xl bg-slate-50 group-hover:bg-teal-50 transition">
                  <Printer className="w-3.5 h-3.5" />
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
