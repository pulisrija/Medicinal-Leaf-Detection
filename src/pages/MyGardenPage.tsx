import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Clock,
  History,
  Leaf,
  LogIn,
  LogOut,
  MessageSquare,
  Plus,
  Sparkles,
  Trash2,
  Edit2,
  Check,
  ExternalLink,
  ShieldCheck,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  subscribeUserScans,
  subscribeUserSavedPlants,
  subscribeCommunityNotes,
  deleteScanRecord,
  updateScanNotes,
  deleteSavedPlantRecord,
  updateSavedPlantNotes,
  addCommunityNoteRecord,
  deleteCommunityNoteRecord
} from '../services/firestoreData';
import {
  getLocalScans,
  deleteLocalScan,
  updateLocalScanNotes,
  getLocalSavedPlants,
  deleteLocalSavedPlant,
  updateLocalSavedPlantNotes
} from '../services/historyStorage';
import { PLANTS_DATA } from '../data/plantsData';
import { ScanRecord, SavedPlantRecord, CommunityNoteRecord } from '../types';

interface MyGardenPageProps {
  onSelectPlant: (plantName: string) => void;
  onNavigateToIdentify: () => void;
}

export const MyGardenPage: React.FC<MyGardenPageProps> = ({
  onSelectPlant,
  onNavigateToIdentify,
}) => {
  const { user, signInWithGoogle, signOutUser, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'scans' | 'saved' | 'community'>('scans');
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [savedPlants, setSavedPlants] = useState<SavedPlantRecord[]>([]);
  const [communityNotes, setCommunityNotes] = useState<CommunityNoteRecord[]>([]);

  // Editing state for saved plants
  const [editingSavedId, setEditingSavedId] = useState<string | null>(null);
  const [savedNoteInput, setSavedNoteInput] = useState<string>('');

  // New community note form
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
  const [newNotePlant, setNewNotePlant] = useState<string>('');
  const [newNoteTitle, setNewNoteTitle] = useState<string>('');
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [newNoteRegion, setNewNoteRegion] = useState<string>('');
  const [isSubmittingNote, setIsSubmittingNote] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Load scans and saved plants on mount and sync with Firestore when user is authenticated
  useEffect(() => {
    // 1. Immediately load local research log
    const localScans = getLocalScans();
    const localSaved = getLocalSavedPlants();
    setScans(localScans);
    setSavedPlants(localSaved);

    if (!user) {
      return;
    }

    // 2. When authenticated with Firebase, listen to Firestore in real-time
    const unsubScans = subscribeUserScans(user.uid, (firestoreScans) => {
      if (firestoreScans && firestoreScans.length > 0) {
        const scanMap = new Map<string, ScanRecord>();
        firestoreScans.forEach(s => scanMap.set(s.scanId, s));
        localScans.forEach(s => {
          if (!scanMap.has(s.scanId)) {
            scanMap.set(s.scanId, s);
          }
        });
        const merged = Array.from(scanMap.values()).sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });
        setScans(merged);
      }
    });

    const unsubSaved = subscribeUserSavedPlants(user.uid, (firestoreSaved) => {
      if (firestoreSaved && firestoreSaved.length > 0) {
        const plantMap = new Map<string, SavedPlantRecord>();
        firestoreSaved.forEach(p => plantMap.set(p.savedId, p));
        localSaved.forEach(p => {
          if (!plantMap.has(p.savedId)) {
            plantMap.set(p.savedId, p);
          }
        });
        const merged = Array.from(plantMap.values()).sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });
        setSavedPlants(merged);
      }
    });

    return () => {
      unsubScans();
      unsubSaved();
    };
  }, [user]);

  // Subscribe to community notes
  useEffect(() => {
    const unsubCommunity = subscribeCommunityNotes((data) => {
      setCommunityNotes(data);
    });
    return () => unsubCommunity();
  }, []);

  const handleDeleteScan = async (scanId: string) => {
    try {
      deleteLocalScan(scanId);
      setScans(prev => prev.filter(s => s.scanId !== scanId));
      if (user) {
        await deleteScanRecord(scanId);
      }
      setStatusMessage('Scan record removed.');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch {
      setStatusMessage('Failed to delete scan.');
    }
  };

  const handleSavePlantNote = async (savedId: string) => {
    try {
      updateLocalSavedPlantNotes(savedId, savedNoteInput);
      setSavedPlants(prev => prev.map(p => p.savedId === savedId ? { ...p, userNotes: savedNoteInput } : p));
      if (user) {
        await updateSavedPlantNotes(savedId, savedNoteInput);
      }
      setEditingSavedId(null);
      setSavedNoteInput('');
      setStatusMessage('Remedy notes updated.');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch {
      setStatusMessage('Failed to update note.');
    }
  };

  const handleDeleteSavedPlant = async (savedId: string) => {
    try {
      deleteLocalSavedPlant(savedId);
      setSavedPlants(prev => prev.filter(p => p.savedId !== savedId));
      if (user) {
        await deleteSavedPlantRecord(savedId);
      }
      setStatusMessage('Plant removed from saved list.');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch {
      setStatusMessage('Failed to remove plant.');
    }
  };

  const handleCreateCommunityNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!newNotePlant.trim() || !newNoteTitle.trim() || !newNoteContent.trim()) {
      setStatusMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmittingNote(true);
    try {
      await addCommunityNoteRecord(
        user.uid,
        user.displayName || 'Botanical Contributor',
        {
          plantName: newNotePlant.trim(),
          title: newNoteTitle.trim(),
          content: newNoteContent.trim(),
          region: newNoteRegion.trim() || undefined,
        }
      );
      setShowNoteModal(false);
      setNewNotePlant('');
      setNewNoteTitle('');
      setNewNoteContent('');
      setNewNoteRegion('');
      setStatusMessage('Observation published successfully to Firebase.');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch {
      setStatusMessage('Error publishing note. Check rules and permissions.');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const formatTimestamp = (ts: any) => {
    if (!ts) return 'Recent';
    if (ts.seconds) {
      return new Date(ts.seconds * 1000).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return new Date().toLocaleDateString();
  };

  // Helper to get authentic leaf image from dataset
  const getPlantImage = (plantName: string, fallbackUrl?: string) => {
    if (fallbackUrl && fallbackUrl.startsWith('/src/assets/images/')) {
      return fallbackUrl;
    }
    const found = PLANTS_DATA.find(p => p.name.toLowerCase() === plantName.toLowerCase() || p.id === plantName.toLowerCase());
    return found?.image_url || fallbackUrl || '/src/assets/images/plant_neem_1791811532944.jpg';
  };

  const getScientificName = (plantName: string, fallbackScientific?: string) => {
    if (fallbackScientific && fallbackScientific !== 'Unknown') return fallbackScientific;
    const found = PLANTS_DATA.find(p => p.name.toLowerCase() === plantName.toLowerCase() || p.id === plantName.toLowerCase());
    return found?.scientific_name || 'Medicinal botanical species';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold tracking-wide uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Botanical Research Log & Herbarium</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            My Herbal Garden & Research Log
          </h1>
          <p className="text-stone-600 text-sm mt-1 max-w-2xl">
            Complete history of all previous leaf identifications, bookmarked medicinal plants, and traditional remedies.
          </p>
        </div>

        {/* User Auth Action */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-xl border border-stone-200 shadow-xs">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-10 h-10 rounded-full border border-emerald-200 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold">
                  {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                </div>
              )}
              <div className="text-left">
                <div className="text-xs font-bold text-stone-900 leading-tight">
                  {user.displayName || 'Researcher'}
                </div>
                <div className="text-[11px] text-stone-500 truncate max-w-[140px]">
                  {user.email}
                </div>
              </div>
              <button
                onClick={signOutUser}
                title="Sign out"
                className="ml-2 p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              disabled={authLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 active:scale-98 transition shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign in with Google to Sync</span>
            </button>
          )}
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>{statusMessage}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-stone-400 hover:text-stone-700 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex items-center justify-between border-b border-stone-200 gap-4">
        <div className="flex items-center gap-4 sm:gap-8">
          <button
            onClick={() => setActiveTab('scans')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'scans'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Leaf Scan History</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
              {scans.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'saved'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Medicinal Plants</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
              {savedPlants.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'community'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Community Field Notes</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono">
              {communityNotes.length}
            </span>
          </button>
        </div>

        {activeTab === 'community' && user && (
          <button
            onClick={() => setShowNoteModal(true)}
            className="pb-2 text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Share Observation</span>
          </button>
        )}
      </div>

      {/* Tab 1: Leaf Scan History */}
      {activeTab === 'scans' && (
        <div className="space-y-6">
          {/* Sync status info bar if not logged in */}
          {!user && scans.length > 0 && (
            <div className="bg-emerald-50/80 border border-emerald-200 text-emerald-900 rounded-xl p-3 px-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Showing your active research log ({scans.length} previous leaf scans). Sign in with Google to permanently back them up to Firebase Firestore.</span>
              </div>
              <button
                onClick={signInWithGoogle}
                className="px-3 py-1.5 bg-emerald-800 text-white font-semibold rounded-lg hover:bg-emerald-700 whitespace-nowrap self-start sm:self-auto"
              >
                Sync to Cloud
              </button>
            </div>
          )}

          {scans.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-4 shadow-xs">
              <Leaf className="w-12 h-12 text-emerald-300 mx-auto" />
              <h3 className="text-lg font-bold text-stone-800">No leaf scans recorded yet</h3>
              <p className="text-sm text-stone-500 max-w-md mx-auto">
                Head over to the Identify tab to analyze a medicinal leaf specimen. Identified leaves are automatically recorded here.
              </p>
              <button
                onClick={onNavigateToIdentify}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700"
              >
                <Sparkles className="w-4 h-4" />
                Analyze a Leaf Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scans.map((scan) => {
                const imageUrl = getPlantImage(scan.plantName, scan.previewUrl);
                const scientificName = getScientificName(scan.plantName, scan.scientificName);

                return (
                  <div
                    key={scan.scanId}
                    className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
                  >
                    {/* Leaf Image Container with Badge */}
                    <div className="h-48 bg-stone-100 relative overflow-hidden group">
                      <img
                        src={imageUrl}
                        alt={`${scan.plantName} leaf`}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-emerald-950/85 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-mono font-bold border border-emerald-500/20 shadow-xs">
                        {Math.round((scan.confidence || 0.90) * 100)}% match
                      </div>

                      {/* Explicit Leaf Specimen Identifier on the Image */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none gap-2">
                        <span className="bg-stone-900/85 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded shadow-xs flex items-center gap-1.5 truncate border border-white/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                          <span className="truncate">{scan.plantName} Leaf</span>
                        </span>
                        <span className="bg-emerald-950/85 backdrop-blur-md text-emerald-200 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/20 italic truncate shrink-0">
                          {scientificName}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-lg font-bold text-stone-900">{scan.plantName} Leaf</h4>
                            <p className="text-xs italic text-stone-500 font-serif">
                              {scientificName}
                            </p>
                          </div>
                          <button
                            onClick={() => onSelectPlant(scan.plantName)}
                            className="p-1.5 text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
                            title="View Plant Monograph"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-2 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Scanned {formatTimestamp(scan.createdAt)}</span>
                        </div>

                        {/* Notes Section */}
                        <div className="mt-4 pt-3 border-t border-stone-100">
                          <div className="text-xs text-stone-500 font-medium mb-1">
                            <span>Ethnobotanical / Field Notes:</span>
                          </div>
                          <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100 leading-relaxed">
                            {scan.notes || 'Identified via EfficientDet classification.'}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <button
                          onClick={() => onSelectPlant(scan.plantName)}
                          className="text-xs font-semibold text-emerald-800 hover:text-emerald-900"
                        >
                          View Traditional Remedies →
                        </button>
                        <button
                          onClick={() => handleDeleteScan(scan.scanId)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded transition"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Medicinal Plants (Herbarium) */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          {savedPlants.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-4 shadow-xs">
              <Leaf className="w-12 h-12 text-emerald-300 mx-auto" />
              <h3 className="text-lg font-bold text-stone-800">Your Herbal Herbarium is empty</h3>
              <p className="text-sm text-stone-500 max-w-md mx-auto">
                Explore the Medicinal Plants catalog and click the Bookmark button on any plant to add it to your collection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPlants.map((plant) => {
                const plantImageUrl = getPlantImage(plant.plantName);
                const scientificName = getScientificName(plant.plantName, plant.scientificName);

                return (
                  <div
                    key={plant.savedId}
                    className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div className="h-44 bg-stone-100 relative overflow-hidden">
                      <img
                        src={plantImageUrl}
                        alt={`${plant.plantName} leaf`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 right-2.5 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                        {plant.family || 'Medicinal Flora'}
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 bg-stone-900/85 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>{plant.plantName}</span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-bold text-stone-900">{plant.plantName}</h4>
                            <p className="text-xs italic text-stone-500 font-serif">
                              {scientificName}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteSavedPlant(plant.savedId)}
                            className="text-stone-400 hover:text-rose-600 p-1"
                            title="Remove from saved"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Personal usage notes */}
                        <div className="mt-4 pt-3 border-t border-stone-100">
                          {editingSavedId === plant.savedId ? (
                            <div className="space-y-2">
                              <textarea
                                value={savedNoteInput}
                                onChange={(e) => setSavedNoteInput(e.target.value)}
                                placeholder="Add your preparation notes (e.g. decoction ratio, seasonal harvest)..."
                                className="w-full text-xs p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                                rows={3}
                                maxLength={1000}
                              />
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setEditingSavedId(null)}
                                  className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-100 rounded"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSavePlantNote(plant.savedId)}
                                  className="px-3 py-1 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded"
                                >
                                  Save Note
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1">
                                <span>Remedy Notes:</span>
                                <button
                                  onClick={() => {
                                    setEditingSavedId(plant.savedId);
                                    setSavedNoteInput(plant.userNotes || '');
                                  }}
                                  className="text-emerald-800 hover:underline flex items-center gap-1"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>{plant.userNotes ? 'Edit' : 'Add Note'}</span>
                                </button>
                              </div>
                              <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100 italic leading-relaxed">
                                {plant.userNotes || 'No notes added yet.'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[11px] text-stone-400 font-mono">
                          Saved {formatTimestamp(plant.createdAt)}
                        </span>
                        <button
                          onClick={() => onSelectPlant(plant.plantName)}
                          className="text-xs font-semibold text-emerald-800 hover:text-emerald-900"
                        >
                          Open Monograph →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Community Field Notes & Traditional Remedy Observations */}
      {activeTab === 'community' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-100 p-4 rounded-xl border border-stone-200">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Peer Botanical Knowledge Base
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Traditional knowledge, regional vernacular names, and field preparation tips contributed by botanical researchers.
              </p>
            </div>
            {user ? (
              <button
                onClick={() => setShowNoteModal(true)}
                className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Share Field Note</span>
              </button>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition flex items-center gap-1.5 self-start sm:self-auto"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign in to Contribute</span>
              </button>
            )}
          </div>

          {communityNotes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-3 shadow-xs">
              <MessageSquare className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-stone-800">No community notes yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Be the first to share an observation on traditional remedies, wild harvesting methods, or cultivation tips!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communityNotes.map((note) => (
                <div
                  key={note.noteId}
                  className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-semibold text-xs">
                        {note.plantName}
                      </span>
                      {note.region && (
                        <span className="text-[11px] text-stone-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          {note.region}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-stone-900">{note.title}</h4>
                    <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <div>
                      <span className="font-semibold text-stone-800">{note.authorName}</span>
                      <span className="mx-1.5">•</span>
                      <span>{formatTimestamp(note.createdAt)}</span>
                    </div>
                    {user && user.uid === note.authorId && (
                      <button
                        onClick={() => deleteCommunityNoteRecord(note.noteId)}
                        className="text-stone-400 hover:text-rose-600 transition"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Share Field Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-700" />
                <span>Share Botanical Field Note</span>
              </h3>
              <button
                onClick={() => setShowNoteModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCommunityNote} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Plant Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tulsi (Holy Basil)"
                  value={newNotePlant}
                  onChange={(e) => setNewNotePlant(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Observation Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Traditional ginger-honey decoction for respiratory relief"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  maxLength={120}
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Native Region / Climate (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Western Ghats, Tropical Deciduous Forest"
                  value={newNoteRegion}
                  onChange={(e) => setNewNoteRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Traditional Observation / Preparation Method *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe traditional uses, decoction proportions, leaf harvest timing, or vernacular preparation methods..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  maxLength={1000}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNote}
                  className="px-5 py-2 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isSubmittingNote ? 'Saving to Firestore...' : 'Publish Observation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
