import { MedicineCatalogEntry } from '../types';
import { MedicineRepository } from '../database/storage';

// Online medical formulary updates repository (Modular endpoint simulator / fallback open list)
const CLOUD_MEDICINE_RELEASES: MedicineCatalogEntry[] = [
  {
    id: 'cloud-med-1',
    brandName: 'Janumet',
    genericName: 'Sitagliptin + Metformin HCl',
    strength: '50mg/500mg',
    dosageForm: 'Tablet',
    manufacturer: 'MSD',
    category: 'Antidiabetic DPP-4 inhibitor',
    packSize: '28 Tabs',
    price: 1100,
    isFavorite: false,
  },
  {
    id: 'cloud-med-2',
    brandName: 'Forxiga',
    genericName: 'Dapagliflozin',
    strength: '10mg',
    dosageForm: 'Tablet',
    manufacturer: 'AstraZeneca',
    category: 'SGLT2 Inhibitor / Renal Cardio',
    packSize: '28 Tabs',
    price: 2400,
    isFavorite: false,
  },
  {
    id: 'cloud-med-3',
    brandName: 'Xarelto',
    genericName: 'Rivaroxaban',
    strength: '15mg',
    dosageForm: 'Tablet',
    manufacturer: 'Bayer',
    category: 'DOAC Anticoagulant',
    packSize: '28 Tabs',
    price: 3600,
    isFavorite: false,
  },
  {
    id: 'cloud-med-4',
    brandName: 'Nexum',
    genericName: 'Esomeprazole Magnesium',
    strength: '40mg',
    dosageForm: 'Capsule',
    manufacturer: 'Getz Pharma',
    category: 'PPI / Antacid',
    packSize: '14 Caps',
    price: 460,
    isFavorite: true,
  },
  {
    id: 'cloud-med-5',
    brandName: 'Azomax',
    genericName: 'Azithromycin Dihydrate',
    strength: '500mg',
    dosageForm: 'Capsule',
    manufacturer: 'Highnoon',
    category: 'Macrolide Antibiotic',
    packSize: '6 Caps',
    price: 520,
    isFavorite: true,
  },
  {
    id: 'cloud-med-6',
    brandName: 'Avelox',
    genericName: 'Moxifloxacin HCl',
    strength: '400mg',
    dosageForm: 'Tablet',
    manufacturer: 'Bayer',
    category: 'Respiratory Quinolone',
    packSize: '5 Tabs',
    price: 890,
    isFavorite: false,
  },
  {
    id: 'cloud-med-7',
    brandName: 'Kestine',
    genericName: 'Ebastine',
    strength: '20mg',
    dosageForm: 'Tablet',
    manufacturer: 'Searle',
    category: 'Non-sedating Antihistamine',
    packSize: '20 Tabs',
    price: 340,
    isFavorite: false,
  },
  {
    id: 'cloud-med-8',
    brandName: 'Rovista',
    genericName: 'Rosuvastatin Calcium',
    strength: '10mg',
    dosageForm: 'Tablet',
    manufacturer: 'Getz Pharma',
    category: 'Statin / Lipid Lowering',
    packSize: '10 Tabs',
    price: 380,
    isFavorite: true,
  },
];

export const MedicineService = {
  async fetchOnlineUpdates(): Promise<{ count: number; items: MedicineCatalogEntry[] }> {
    // Check network connectivity first
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new Error('Internet is unavailable. Offline medicine database remains fully accessible.');
    }

    // Modular simulated async fetch representing WHO/National Drug Formulary API
    await new Promise((resolve) => setTimeout(resolve, 800));

    const added = MedicineRepository.syncOnlineBatch(CLOUD_MEDICINE_RELEASES, 'Doctor / Auto-Sync');
    return {
      count: added,
      items: CLOUD_MEDICINE_RELEASES,
    };
  },
};
