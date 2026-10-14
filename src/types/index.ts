export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
}

export interface CandidateClass {
  name: string;
  confidence: number;
}

export interface SalientFeature {
  name: string;
  weight: number;
  point: [number, number];
}

export interface InterpretabilityData {
  architecture: string;
  backbone?: string;
  salient_leaf_features?: SalientFeature[];
  feature_levels?: string[];
}

export interface Plant {
  id: string;
  name: string;
  scientific_name: string;
  family: string;
  sanskrit_name?: string;
  common_names: string[];
  short_description: string;
  botanical_characteristics: string;
  parts_traditionally_used: string[];
  traditional_uses: string[];
  traditional_preparations: string[];
  precautions: string[];
  key_phytochemicals: string[];
  image_url?: string;
}

export interface PredictionResult {
  success: boolean;
  is_mock?: boolean;
  detected?: boolean;
  plant_name?: string;
  scientific_name?: string;
  confidence: number;
  threshold?: number;
  message?: string;
  is_medicinal?: boolean;
  is_in_dataset?: boolean;
  medicinal_status?: string;
  bounding_box?: BoundingBox | null;
  candidate_classes?: CandidateClass[];
  traditional_uses?: string[];
  parts_used?: string[];
  precautions?: string[];
  traditional_preparations?: string[];
  botanical_characteristics?: string;
  key_phytochemicals?: string[];
  short_description?: string;
  family?: string;
  interpretability?: InterpretabilityData;
}

export interface ApiHealth {
  status: string;
  model_mode: 'mock' | 'real';
  model_path?: string;
  confidence_threshold: number;
  supported_classes_count: number;
  supported_classes: string[];
}

export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  photoUrl?: string;
  totalScans?: number;
  savedPlantsCount?: number;
  createdAt: any;
  updatedAt: any;
}

export interface ScanRecord {
  scanId: string;
  userId: string;
  plantName: string;
  scientificName?: string;
  confidence: number;
  notes?: string;
  previewUrl?: string;
  createdAt: any;
  updatedAt: any;
}

export interface SavedPlantRecord {
  savedId: string;
  userId: string;
  plantId: string;
  plantName: string;
  scientificName?: string;
  family?: string;
  userNotes?: string;
  createdAt: any;
}

export interface CommunityNoteRecord {
  noteId: string;
  authorId: string;
  authorName: string;
  plantName: string;
  title: string;
  content: string;
  region?: string;
  createdAt: any;
}
