import React, { useState } from 'react';
import {
  Pill,
  Search,
  Star,
  Plus,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { MedicineCatalogEntry } from '../../types';
import { MedicineRepository } from '../../database/storage';
import { MedicineService } from '../../services/medicineService';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface MedicineCatalogueProps {
  medicines: MedicineCatalogEntry[];
  onRefresh: () => void;
  isUrdu: boolean;
  currentUser: string;
}

export const MedicineCatalogue: React.FC<MedicineCatalogueProps> = ({
  medicines,
  onRefresh,
  isUrdu,
  currentUser,
}) => {
  const isOnline = useOnlineStatus();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // New Medicine Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBrand, setNewBrand] = useState('');
  const [newGeneric, setNewGeneric] = useState('');
  const [newStrength, setNewStrength] = useState('');
  const [newDosageForm, setNewDosageForm] = useState('Tablet');
  const [newManufacturer, setNewManufacturer] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newPrice, setNewPrice] = useState<number | string>('');

  const categories = ['All', ...Array.from(new Set(medicines.map((m) => m.category)))];

  const filteredMedicines = medicines.filter((m) => {
    if (filterFavorites && !m.isFavorite) return false;
    if (selectedCategory !== 'All' && m.category !== selectedCategory) return false;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      m.brandName.toLowerCase().includes(q) ||
      m.genericName.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.manufacturer.toLowerCase().includes(q)
    );
  });

  const handleToggleFavorite = (id: string) => {
    MedicineRepository.toggleFavorite(id);
    onRefresh();
  };

  const handleOnlineSync = async () => {
    if (!isOnline) {
      setSyncStatus('Internet is not connected. Local medicine repository is active offline.');
      setTimeout(() => setSyncStatus(null), 3000);
      return;
    }

    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await MedicineService.fetchOnlineUpdates();
      onRefresh();
      setSyncStatus(`Successfully checked online repository: ${res.count} new formulations synced.`);
      setTimeout(() => setSyncStatus(null), 4000);
    } catch (err: unknown) {
      setSyncStatus(err instanceof Error ? err.message : 'Sync failed');
      setTimeout(() => setSyncStatus(null), 3500);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand.trim() || !newGeneric.trim()) return;

    MedicineRepository.add(
      {
        brandName: newBrand.trim(),
        genericName: newGeneric.trim(),
        strength: newStrength.trim() || 'Standard',
        dosageForm: newDosageForm,
        manufacturer: newManufacturer.trim() || 'Standard Pharma',
        category: newCategory.trim() || 'General',
        price: Number(newPrice) || undefined,
        isFavorite: true,
      },
      currentUser
    );

    setShowAddModal(false);
    setNewBrand('');
    setNewGeneric('');
    setNewStrength('');
    onRefresh();
  };

  return (
    <div className="space-y-4">
      {/* Top Search, Add, and Online Sync Bar */}
      <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                isUrdu
                  ? 'دوا تلاش کریں: برانڈ نام، جینرک نام، سالٹ، کمپنی...'
                  : 'Search by Brand Name, Generic / Salt, Category, Manufacturer...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Online Sync Button (PRD Section 12) */}
            <button
              onClick={handleOnlineSync}
              disabled={isSyncing}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                isOnline
                  ? 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              }`}
              title={
                isOnline
                  ? 'Sync latest medicine releases from online formulary'
                  : 'Offline: Internet connection required for online catalogue update'
              }
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Online Update'}</span>
            </button>

            {/* Add Custom Medicine */}
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-semibold rounded-xl text-xs shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>{isUrdu ? 'نئی دوا درج کریں' : 'Add Medicine'}</span>
            </button>
          </div>
        </div>

        {/* Sync Status Banner */}
        {syncStatus && (
          <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{syncStatus}</span>
            </div>
          </div>
        )}

        {/* Filters Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterFavorites(!filterFavorites)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                filterFavorites
                  ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  filterFavorites ? 'fill-amber-400 text-amber-500' : 'text-slate-400'
                }`}
              />
              <span>Favorites Only</span>
            </button>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="text-[11px] text-slate-500">
            Total in Database: <strong>{medicines.length}</strong> • Showing: {filteredMedicines.length}
          </div>
        </div>
      </div>

      {/* Medicine Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredMedicines.map((med) => (
          <div
            key={med.id}
            className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-300 hover:shadow-md transition space-y-2 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-slate-900 leading-tight">
                      {med.brandName}
                    </h3>
                    <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-100">
                      {med.strength} • {med.dosageForm}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleFavorite(med.id)}
                  className="p-1 rounded-lg text-slate-300 hover:text-amber-400 transition"
                  title="Toggle Favorite"
                >
                  <Star
                    className={`w-4 h-4 ${
                      med.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Generic Name / Salt */}
              <div className="mt-2 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Generic Composition (سفارش / سالٹ)
                </span>
                <p className="font-mono text-slate-700 font-medium text-[11px] truncate">
                  {med.genericName}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span className="truncate">{med.manufacturer}</span>
              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                {med.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-teal-700 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-200" />
                <h2 className="font-bold text-sm">Add New Medicine to Database</h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-teal-100 hover:bg-teal-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMedicine} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Panadol Extra"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Generic Name (Active Ingredient) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paracetamol + Caffeine"
                    value={newGeneric}
                    onChange={(e) => setNewGeneric(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Strength</label>
                  <input
                    type="text"
                    placeholder="e.g. 500mg / 65mg"
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosage Form</label>
                  <select
                    value={newDosageForm}
                    onChange={(e) => setNewDosageForm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Cream">Cream / Ointment</option>
                    <option value="Drops">Drops</option>
                    <option value="Sachet">Sachet</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    placeholder="e.g. GSK, Getz, Searle"
                    value={newManufacturer}
                    onChange={(e) => setNewManufacturer(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Analgesic, Antibiotic"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 active:scale-95 shadow-md"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
