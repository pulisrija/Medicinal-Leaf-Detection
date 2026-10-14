import React, { useState } from 'react';
import { Search, ArrowRight, BookOpen, Bookmark, BookmarkCheck } from 'lucide-react';
import { PLANTS_DATA } from '../data/plantsData';
import { Plant } from '../types';
import { useAuth } from '../context/AuthContext';
import { savePlantRecord } from '../services/firestoreData';
import { recordSavedPlant } from '../services/historyStorage';

interface MedicinalPlantsPageProps {
  onSelectPlant: (plantName: string) => void;
}

export const MedicinalPlantsPage: React.FC<MedicinalPlantsPageProps> = ({ onSelectPlant }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [savedPlantIds, setSavedPlantIds] = useState<Record<string, boolean>>({});

  const handleQuickBookmark = async (e: React.MouseEvent, plant: Plant) => {
    e.stopPropagation();
    if (savedPlantIds[plant.id]) return;

    try {
      await recordSavedPlant({
        id: plant.id,
        name: plant.name,
        scientific_name: plant.scientific_name,
        family: plant.family,
        userNotes: `Bookmarked from species directory.`,
      }, user?.uid);
      setSavedPlantIds(prev => ({ ...prev, [plant.id]: true }));
    } catch (err) {
      console.error(err);
    }
  };

  const categories = [
    'All',
    'Respiratory',
    'Digestive & GI',
    'Dermatological',
    'Nutritional & Tonic'
  ];

  const filteredPlants = PLANTS_DATA.filter((plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.scientific_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.common_names.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (activeCategory === 'All') return true;

    // Filter by traditional applications
    if (activeCategory === 'Respiratory') {
      return ['tulsi', 'mint', 'eucalyptus'].includes(plant.id);
    }
    if (activeCategory === 'Digestive & GI') {
      return ['guava', 'curry-leaf', 'mint', 'neem'].includes(plant.id);
    }
    if (activeCategory === 'Dermatological') {
      return ['neem', 'aloe-vera', 'hibiscus'].includes(plant.id);
    }
    if (activeCategory === 'Nutritional & Tonic') {
      return ['moringa', 'ashoka', 'tulsi'].includes(plant.id);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-6">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Medicinal Plants Knowledge Base
        </h1>
        <p className="text-stone-600 mt-1 text-base max-w-3xl">
          Repository of the 10 Indian medicinal plant species supported by the HerbVision AI EfficientDet classification pipeline.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by common name, scientific name, or family..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all shadow-xs"
          />
        </div>

        {/* Category Segmented Controls (Interactive Filter Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                activeCategory === cat
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Plant Grid (10 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlants.map((plant) => (
          <div
            key={plant.id}
            className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
          >
            {/* Plant Image */}
            <div className="aspect-4/3 w-full bg-stone-100 overflow-hidden relative">
              <img
                src={plant.image_url}
                alt={plant.name}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 right-2.5 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded">
                {plant.family}
              </div>
              <button
                onClick={(e) => handleQuickBookmark(e, plant)}
                title={savedPlantIds[plant.id] ? "Saved to Herbarium" : "Bookmark to Herbarium"}
                className={`absolute top-2.5 left-2.5 p-1.5 rounded-lg backdrop-blur-md transition shadow-xs z-10 ${
                  savedPlantIds[plant.id]
                    ? 'bg-emerald-800 text-white'
                    : 'bg-white/85 text-stone-700 hover:bg-white hover:text-emerald-800'
                }`}
              >
                {savedPlantIds[plant.id] ? (
                  <BookmarkCheck className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Bookmark className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Explicit Leaf Specimen Identifier Badge */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none gap-2">
                <span className="bg-stone-900/85 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow-xs flex items-center gap-1.5 truncate border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                  <span className="truncate">{plant.name} Leaf</span>
                </span>
                <span className="bg-emerald-950/85 backdrop-blur-md text-emerald-200 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/20 italic truncate shrink-0">
                  {plant.scientific_name}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-bold text-stone-900">{plant.name}</h3>
                  {plant.sanskrit_name && (
                    <span className="text-xs text-stone-600 font-mono">
                      {plant.sanskrit_name}
                    </span>
                  )}
                </div>
                <p className="text-xs italic text-stone-500 font-serif">
                  {plant.scientific_name}
                </p>
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed pt-1">
                  {plant.short_description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div className="text-[11px] text-stone-600 font-mono">
                  {plant.parts_traditionally_used.length} parts used
                </div>
                <button
                  onClick={() => onSelectPlant(plant.name)}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors flex items-center gap-1 group/btn"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPlants.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200 space-y-2">
          <BookOpen className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="text-base font-semibold text-stone-900">No medicinal plants found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search query or reset the category filter to view all species.
          </p>
        </div>
      )}

    </div>
  );
};
