import React, { useState } from 'react';
import { Languages, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { URDU_QUICK_PHRASES } from '../../hooks/useTranslations';

interface UrduKeyboardHelperProps {
  onSelectPhrase: (phrase: string) => void;
  label?: string;
}

export const UrduKeyboardHelper: React.FC<UrduKeyboardHelperProps> = ({
  onSelectPhrase,
  label = 'Quick Urdu Instructions (فوری اردو ہدایات)',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const quickBadges = [
    { label: 'کھانے کے بعد', text: 'کھانے کے بعد استعمال کریں۔' },
    { label: 'نہار منہ (خالی پیٹ)', text: 'صبح نہار منہ ناشتے سے آدھا گھنٹہ پہلے لیں۔' },
    { label: 'دن میں 2 بار', text: 'دن میں دو مرتبہ صبح اور شام لیں۔' },
    { label: 'دن میں 3 بار', text: 'دن میں تین مرتبہ کھانے کے بعد لیں۔' },
    { label: 'رات کو سوتے وقت', text: 'رات کو سونے سے پہلے دودھ کے ساتھ لیں۔' },
    { label: 'ضرورت کے وقت (درد)', text: 'درد یا بخار کی صورت میں ضرورت کے وقت لیں۔' },
    { label: 'پرہیز: نمک و چکنائی', text: 'نمک، چکنائی اور تلی ہوئی چیزوں سے پرہیز کریں۔' },
  ];

  return (
    <div className="rounded-xl border border-teal-100 bg-teal-50/70 p-2.5 transition">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-950"
        >
          <Languages className="w-3.5 h-3.5 text-teal-600" />
          <span>{label}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        <span className="text-[10px] text-teal-600 font-medium">نستعلیق رسم الخط</span>
      </div>

      {/* Quick horizontal tap badges */}
      <div className="mt-2 flex flex-wrap gap-1.5" dir="rtl">
        {quickBadges.map((badge, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPhrase(badge.text)}
            className="inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-white px-2.5 py-1 text-[11px] font-urdu font-medium text-teal-900 shadow-2xs hover:bg-teal-50 active:bg-teal-100 transition"
          >
            <Plus className="w-2.5 h-2.5 text-teal-600" />
            <span>{badge.label}</span>
          </button>
        ))}
      </div>

      {/* Expanded list of detailed Urdu instructions */}
      {isOpen && (
        <div className="mt-2.5 border-t border-teal-100 pt-2.5 space-y-1.5 max-h-48 overflow-y-auto" dir="rtl">
          {URDU_QUICK_PHRASES.map((phrase, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                onSelectPhrase(phrase);
              }}
              className="w-full text-right p-2 rounded-lg bg-white/90 hover:bg-teal-100/70 text-xs font-urdu text-slate-800 border border-teal-100/60 shadow-2xs transition flex items-center justify-between"
            >
              <span>{phrase}</span>
              <span className="text-[10px] text-teal-600 font-sans border border-teal-200 rounded px-1.5 py-0.5 ml-2">منتخب کریں</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
