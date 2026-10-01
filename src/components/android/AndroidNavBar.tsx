import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileSignature,
  Receipt,
  CalendarDays,
  Menu,
} from 'lucide-react';
import { UserRole } from '../../types';

export type ActiveTab =
  | 'dashboard'
  | 'patients'
  | 'prescriptions'
  | 'receipts'
  | 'procedures'
  | 'appointments'
  | 'medicines'
  | 'reports'
  | 'settings'
  | 'portal';

interface AndroidNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  role: UserRole;
  isUrdu: boolean;
  onOpenMoreMenu: () => void;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({
  activeTab,
  onTabChange,
  role,
  isUrdu,
  onOpenMoreMenu,
}) => {
  // If patient role, simplified navigation
  if (role === 'patient') {
    return (
      <div className="android-nav-bar shrink-0 bg-white border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around z-30 select-none">
        <button
          onClick={() => onTabChange('portal')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'portal' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'portal' ? 'bg-teal-100 text-teal-800' : ''}`}>
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="text-[11px]">{isUrdu ? 'میرا پورٹل' : 'My Portal'}</span>
        </button>

        <button
          onClick={() => onTabChange('appointments')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'appointments' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'appointments' ? 'bg-teal-100 text-teal-800' : ''}`}>
            <CalendarDays className="w-5 h-5" />
          </div>
          <span className="text-[11px]">{isUrdu ? 'مشاورت بکنگ' : 'Book Visit'}</span>
        </button>
      </div>
    );
  }

  // Doctor / Assistant standard Android Bottom Navigation
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: isUrdu ? 'ڈیش بورڈ' : 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'patients' as ActiveTab,
      label: isUrdu ? 'مریض' : 'Patients',
      icon: Users,
    },
    {
      id: 'prescriptions' as ActiveTab,
      label: isUrdu ? 'نسخہ جات' : 'Prescription',
      icon: FileSignature,
    },
    {
      id: 'receipts' as ActiveTab,
      label: isUrdu ? 'رسیدیں' : 'Receipts',
      icon: Receipt,
    },
    {
      id: 'appointments' as ActiveTab,
      label: isUrdu ? 'اپائنٹمنٹس' : 'Visits',
      icon: CalendarDays,
    },
  ];

  return (
    <div className="android-nav-bar shrink-0 bg-white border-t border-slate-200 shadow-xl px-1 py-1 flex items-center justify-around z-30 select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition ${
              isActive
                ? 'text-teal-700 font-bold'
                : 'text-slate-500 hover:text-slate-800 active:scale-95'
            }`}
          >
            <div
              className={`p-1 px-2.5 rounded-full transition-all duration-200 ${
                isActive ? 'bg-teal-100 text-teal-800 scale-105' : 'hover:bg-slate-100'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}

      {/* More / Menu Drawer toggle */}
      <button
        onClick={onOpenMoreMenu}
        className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition ${
          ['procedures', 'medicines', 'reports', 'settings'].includes(activeTab)
            ? 'text-teal-700 font-bold'
            : 'text-slate-500 hover:text-slate-800 active:scale-95'
        }`}
      >
        <div
          className={`p-1 px-2.5 rounded-full transition-all duration-200 ${
            ['procedures', 'medicines', 'reports', 'settings'].includes(activeTab)
              ? 'bg-teal-100 text-teal-800 scale-105'
              : 'hover:bg-slate-100'
          }`}
        >
          <Menu className="w-5 h-5" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">{isUrdu ? 'مزید' : 'More'}</span>
      </button>
    </div>
  );
};
