import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  increment,
  Unsubscribe
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { ScanRecord, SavedPlantRecord, CommunityNoteRecord } from '../types';

// Helper to generate a clean safe ID
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Scan Records (Leaf Identification History)
 */
export const saveScanRecord = async (
  userId: string,
  scanData: {
    plantName: string;
    scientificName?: string;
    confidence: number;
    notes?: string;
    previewUrl?: string;
  }
): Promise<string> => {
  const scanId = generateId('scan');
  const path = `scans/${scanId}`;
  try {
    const docRef = doc(db, 'scans', scanId);
    const payload: any = {
      scanId,
      userId,
      plantName: scanData.plantName.slice(0, 100),
      confidence: Math.max(0, Math.min(1, scanData.confidence)),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (scanData.scientificName) {
      payload.scientificName = scanData.scientificName.slice(0, 100);
    }
    if (scanData.notes) {
      payload.notes = scanData.notes.slice(0, 1000);
    }
    if (scanData.previewUrl) {
      payload.previewUrl = scanData.previewUrl.slice(0, 2000);
    }

    await setDoc(docRef, payload);

    // Optionally increment user's total scans count
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        totalScans: increment(1),
        updatedAt: serverTimestamp(),
      });
    } catch {
      // Non-fatal if user doc update is separate
    }

    return scanId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const subscribeUserScans = (
  userId: string,
  onUpdate: (scans: ScanRecord[]) => void
): Unsubscribe => {
  const path = 'scans';
  const q = query(collection(db, 'scans'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const scans: ScanRecord[] = [];
      snapshot.forEach((doc) => {
        scans.push(doc.data() as ScanRecord);
      });
      // Sort client-side by date descending
      scans.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      onUpdate(scans);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
};

export const deleteScanRecord = async (scanId: string): Promise<void> => {
  const path = `scans/${scanId}`;
  try {
    await deleteDoc(doc(db, 'scans', scanId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const updateScanNotes = async (scanId: string, notes: string): Promise<void> => {
  const path = `scans/${scanId}`;
  try {
    await updateDoc(doc(db, 'scans', scanId), {
      notes: notes.slice(0, 1000),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

/**
 * Saved Plants (Personal Herbal Garden)
 */
export const savePlantRecord = async (
  userId: string,
  plant: {
    id: string;
    name: string;
    scientific_name?: string;
    family?: string;
    userNotes?: string;
  }
): Promise<string> => {
  const savedId = generateId('saved');
  const path = `saved_plants/${savedId}`;
  try {
    const docRef = doc(db, 'saved_plants', savedId);
    const payload: any = {
      savedId,
      userId,
      plantId: plant.id.slice(0, 64),
      plantName: plant.name.slice(0, 100),
      createdAt: serverTimestamp(),
    };
    if (plant.scientific_name) {
      payload.scientificName = plant.scientific_name.slice(0, 100);
    }
    if (plant.family) {
      payload.family = plant.family.slice(0, 100);
    }
    if (plant.userNotes) {
      payload.userNotes = plant.userNotes.slice(0, 1000);
    }

    await setDoc(docRef, payload);

    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        savedPlantsCount: increment(1),
        updatedAt: serverTimestamp(),
      });
    } catch {
      // Non-fatal
    }

    return savedId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const deleteSavedPlantRecord = async (savedId: string): Promise<void> => {
  const path = `saved_plants/${savedId}`;
  try {
    await deleteDoc(doc(db, 'saved_plants', savedId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const subscribeUserSavedPlants = (
  userId: string,
  onUpdate: (plants: SavedPlantRecord[]) => void
): Unsubscribe => {
  const path = 'saved_plants';
  const q = query(collection(db, 'saved_plants'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const plants: SavedPlantRecord[] = [];
      snapshot.forEach((doc) => {
        plants.push(doc.data() as SavedPlantRecord);
      });
      plants.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      onUpdate(plants);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
};

export const updateSavedPlantNotes = async (savedId: string, notes: string): Promise<void> => {
  const path = `saved_plants/${savedId}`;
  try {
    await updateDoc(doc(db, 'saved_plants', savedId), {
      userNotes: notes.slice(0, 1000),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

/**
 * Community Traditional Remedy Notes & Observations
 */
export const subscribeCommunityNotes = (
  onUpdate: (notes: CommunityNoteRecord[]) => void
): Unsubscribe => {
  const path = 'community_notes';
  return onSnapshot(
    collection(db, 'community_notes'),
    (snapshot) => {
      const list: CommunityNoteRecord[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as CommunityNoteRecord);
      });
      list.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
};

export const addCommunityNoteRecord = async (
  authorId: string,
  authorName: string,
  data: {
    plantName: string;
    title: string;
    content: string;
    region?: string;
  }
): Promise<string> => {
  const noteId = generateId('note');
  const path = `community_notes/${noteId}`;
  try {
    const docRef = doc(db, 'community_notes', noteId);
    const payload: any = {
      noteId,
      authorId,
      authorName: authorName.slice(0, 100),
      plantName: data.plantName.slice(0, 100),
      title: data.title.slice(0, 120),
      content: data.content.slice(0, 1000),
      createdAt: serverTimestamp(),
    };
    if (data.region) {
      payload.region = data.region.slice(0, 100);
    }
    await setDoc(docRef, payload);
    return noteId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const deleteCommunityNoteRecord = async (noteId: string): Promise<void> => {
  const path = `community_notes/${noteId}`;
  try {
    await deleteDoc(doc(db, 'community_notes', noteId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};
