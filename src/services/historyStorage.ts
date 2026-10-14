import { ScanRecord, SavedPlantRecord } from '../types';
import { saveScanRecord, savePlantRecord } from './firestoreData';

const LOCAL_SCANS_KEY = 'herbvision_local_scans';
const LOCAL_SAVED_PLANTS_KEY = 'herbvision_local_saved_plants';

// Initial curated research log specimens so the user immediately sees a rich history
export const INITIAL_DEMO_SCANS: ScanRecord[] = [
  {
    scanId: 'scan_demo_neem_1',
    userId: 'guest',
    plantName: 'Neem',
    scientificName: 'Azadirachta indica',
    confidence: 0.94,
    notes: 'Identified compound serrated foliage. Tested traditional decoction for dental and skin health.',
    previewUrl: '/src/assets/images/plant_neem_1791811532944.jpg',
    createdAt: { seconds: Math.floor((Date.now() - 3600 * 1000 * 2) / 1000) },
    updatedAt: { seconds: Math.floor((Date.now() - 3600 * 1000 * 2) / 1000) },
  },
  {
    scanId: 'scan_demo_tulsi_2',
    userId: 'guest',
    plantName: 'Tulsi',
    scientificName: 'Ocimum tenuiflorum',
    confidence: 0.98,
    notes: 'Aromatic Holy Basil leaf with gland trichomes. Used in morning tea infusion for respiratory comfort.',
    previewUrl: '/src/assets/images/plant_tulsi_1791811543098.jpg',
    createdAt: { seconds: Math.floor((Date.now() - 3600 * 1000 * 14) / 1000) },
    updatedAt: { seconds: Math.floor((Date.now() - 3600 * 1000 * 14) / 1000) },
  },
  {
    scanId: 'scan_demo_eucalyptus_3',
    userId: 'guest',
    plantName: 'Eucalyptus',
    scientificName: 'Eucalyptus',
    confidence: 0.91,
    notes: 'Falcate sickle-shaped leaf specimen. High cineole aroma noted for steam inhalation.',
    previewUrl: '/src/assets/images/plant_eucalyptus_1791962774353.jpg',
    createdAt: { seconds: Math.floor((Date.now() - 3600 * 1000 * 28) / 1000) },
    updatedAt: { seconds: Math.floor((Date.now() - 3600 * 1000 * 28) / 1000) },
  },
  {
    scanId: 'scan_demo_aloe_4',
    userId: 'guest',
    plantName: 'Aloe Vera',
    scientificName: 'Aloe vera',
    confidence: 0.96,
    notes: 'Succulent cross-section with transparent parenchymal hydrogel for skin soothing.',
    previewUrl: '/src/assets/images/plant_aloe_1791811555544.jpg',
    createdAt: { seconds: Math.floor((Date.now() - 3600 * 1000 * 48) / 1000) },
    updatedAt: { seconds: Math.floor((Date.now() - 3600 * 1000 * 48) / 1000) },
  }
];

export const INITIAL_DEMO_SAVED_PLANTS: SavedPlantRecord[] = [
  {
    savedId: 'saved_demo_1',
    userId: 'guest',
    plantId: 'tulsi',
    plantName: 'Tulsi',
    scientificName: 'Ocimum tenuiflorum',
    family: 'Lamiaceae',
    userNotes: 'Holy Basil adaptogen — harvested fresh for daily morning decoction.',
    createdAt: { seconds: Math.floor((Date.now() - 3600 * 1000 * 24) / 1000) },
  },
  {
    savedId: 'saved_demo_2',
    userId: 'guest',
    plantId: 'neem',
    plantName: 'Neem',
    scientificName: 'Azadirachta indica',
    family: 'Meliaceae',
    userNotes: 'Bitter antimicrobial leaf — external wash and home garden pest deterrent.',
    createdAt: { seconds: Math.floor((Date.now() - 3600 * 1000 * 36) / 1000) },
  }
];

/**
 * Retrieve local scans from localStorage
 */
export const getLocalScans = (): ScanRecord[] => {
  try {
    const raw = localStorage.getItem(LOCAL_SCANS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_SCANS_KEY, JSON.stringify(INITIAL_DEMO_SCANS));
      return INITIAL_DEMO_SCANS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DEMO_SCANS;
  } catch {
    return INITIAL_DEMO_SCANS;
  }
};

/**
 * Save scan to local storage and sync to Firestore if user is authenticated
 */
export const recordScanResult = async (
  scanData: {
    plantName: string;
    scientificName?: string;
    confidence: number;
    notes?: string;
    previewUrl?: string;
  },
  userId?: string | null
): Promise<ScanRecord> => {
  const scanId = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const nowSeconds = Math.floor(Date.now() / 1000);

  const newScan: ScanRecord = {
    scanId,
    userId: userId || 'guest',
    plantName: scanData.plantName,
    scientificName: scanData.scientificName,
    confidence: scanData.confidence,
    notes: scanData.notes || 'Identified via EfficientDet deep learning pipeline.',
    previewUrl: scanData.previewUrl,
    createdAt: { seconds: nowSeconds },
    updatedAt: { seconds: nowSeconds },
  };

  // 1. Save to local storage
  try {
    const current = getLocalScans();
    const updated = [newScan, ...current];
    localStorage.setItem(LOCAL_SCANS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to write to localStorage', e);
  }

  // 2. Sync to Firestore if authenticated
  if (userId) {
    try {
      await saveScanRecord(userId, {
        plantName: scanData.plantName,
        scientificName: scanData.scientificName,
        confidence: scanData.confidence,
        notes: scanData.notes,
        previewUrl: scanData.previewUrl,
      });
    } catch (e) {
      console.warn('Firestore cloud sync notice:', e);
    }
  }

  return newScan;
};

/**
 * Delete a scan from local storage
 */
export const deleteLocalScan = (scanId: string): void => {
  try {
    const current = getLocalScans();
    const filtered = current.filter(s => s.scanId !== scanId);
    localStorage.setItem(LOCAL_SCANS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error(e);
  }
};

/**
 * Update scan notes in local storage
 */
export const updateLocalScanNotes = (scanId: string, notes: string): void => {
  try {
    const current = getLocalScans();
    const updated = current.map(s => {
      if (s.scanId === scanId) {
        return { ...s, notes, updatedAt: { seconds: Math.floor(Date.now() / 1000) } };
      }
      return s;
    });
    localStorage.setItem(LOCAL_SCANS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
};

/**
 * Saved Plants Local Storage
 */
export const getLocalSavedPlants = (): SavedPlantRecord[] => {
  try {
    const raw = localStorage.getItem(LOCAL_SAVED_PLANTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_SAVED_PLANTS_KEY, JSON.stringify(INITIAL_DEMO_SAVED_PLANTS));
      return INITIAL_DEMO_SAVED_PLANTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DEMO_SAVED_PLANTS;
  } catch {
    return INITIAL_DEMO_SAVED_PLANTS;
  }
};

export const recordSavedPlant = async (
  plant: {
    id: string;
    name: string;
    scientific_name?: string;
    family?: string;
    userNotes?: string;
  },
  userId?: string | null
): Promise<SavedPlantRecord> => {
  const savedId = `saved_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const nowSeconds = Math.floor(Date.now() / 1000);

  const newSaved: SavedPlantRecord = {
    savedId,
    userId: userId || 'guest',
    plantId: plant.id,
    plantName: plant.name,
    scientificName: plant.scientific_name,
    family: plant.family,
    userNotes: plant.userNotes || 'Saved to personal herbal garden.',
    createdAt: { seconds: nowSeconds },
  };

  try {
    const current = getLocalSavedPlants();
    const existingIndex = current.findIndex(p => p.plantId === plant.id);
    if (existingIndex === -1) {
      const updated = [newSaved, ...current];
      localStorage.setItem(LOCAL_SAVED_PLANTS_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.error(e);
  }

  if (userId) {
    try {
      await savePlantRecord(userId, plant);
    } catch (e) {
      console.warn('Firestore cloud sync notice:', e);
    }
  }

  return newSaved;
};

export const deleteLocalSavedPlant = (savedId: string): void => {
  try {
    const current = getLocalSavedPlants();
    const filtered = current.filter(p => p.savedId !== savedId);
    localStorage.setItem(LOCAL_SAVED_PLANTS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error(e);
  }
};

export const updateLocalSavedPlantNotes = (savedId: string, notes: string): void => {
  try {
    const current = getLocalSavedPlants();
    const updated = current.map(p => {
      if (p.savedId === savedId) {
        return { ...p, userNotes: notes };
      }
      return p;
    });
    localStorage.setItem(LOCAL_SAVED_PLANTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
};
