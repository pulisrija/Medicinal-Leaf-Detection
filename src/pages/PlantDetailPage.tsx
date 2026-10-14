import React, { useState } from 'react';
import { ArrowLeft, BookOpen, AlertTriangle, FlaskConical, Sparkles, ShieldAlert, Leaf, Bookmark, BookmarkCheck } from 'lucide-react';
import { Plant } from '../types';
import { useAuth } from '../context/AuthContext';
import { savePlantRecord } from '../services/firestoreData';
import { recordSavedPlant } from '../services/historyStorage';

interface PlantDetailPageProps {
  plant: Plant;
  onBack: () => void;
  onIdentify: (plantName: string) => void;
}

const BookmarkPlantButton: React.FC<{ plant: Plant }> = ({ plant }) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleBookmark = async () => {
    if (isSaved) return;

    setIsSaving(true);
    try {
      await recordSavedPlant({
        id: plant.id,
        name: plant.name,
        scientific_name: plant.scientific_name,
        family: plant.family,
        userNotes: `Bookmarked from species monograph. Parts used: ${plant.parts_traditionally_used?.join(', ')}`,
      }, user?.uid);
      setIsSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={isSaving}
      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border shadow-xs ${
        isSaved
          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
      }`}
    >
      {isSaved ? (
        <>
          <BookmarkCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Saved to My Herbarium</span>
        </>
      ) : (
        <>
          <Bookmark className="w-3.5 h-3.5 text-stone-500" />
          <span>{isSaving ? 'Saving...' : 'Save to My Herbarium'}</span>
        </>
      )}
    </button>
  );
};

export const PlantDetailPage: React.FC<PlantDetailPageProps> = ({
  plant,
  onBack,
  onIdentify
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Species Catalog</span>
        </button>
      </div>

      {/* Main Profile Header */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-stretch">
          
          {/* Plant Image */}
          <div className="md:col-span-5 bg-stone-100 min-h-[320px] relative overflow-hidden">
            <img
              src={plant.image_url}
              alt={plant.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Plant Title & Core Meta */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-stone-500">
                <span>Family: {plant.family}</span>
                {plant.sanskrit_name && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Ayurvedic: {plant.sanskrit_name}</span>
                  </>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                {plant.name}
              </h1>

              <p className="text-base font-serif italic text-emerald-800">
                {plant.scientific_name}
              </p>

              <p className="text-sm text-stone-600 leading-relaxed pt-2">
                {plant.short_description}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onIdentify(plant.name)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test in Identification Workspace</span>
              </button>

              <BookmarkPlantButton plant={plant} />
            </div>
          </div>
        </div>
      </div>

      {/* Botanical Identification Characteristics */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-3 shadow-xs">
        <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <Leaf className="w-4 h-4 text-emerald-800" />
          Botanical & Foliar Characteristics (EfficientDet Recognition Targets)
        </h3>
        <p className="text-sm text-stone-700 leading-relaxed">
          {plant.botanical_characteristics}
        </p>
      </div>

      {/* Traditional Uses & Parts Used (2-Column Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Ethnobotanical Uses */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-800" />
            Traditional / Ethnobotanical Uses
          </h3>
          <ul className="text-xs text-stone-600 space-y-2 list-disc pl-4 leading-relaxed">
            {plant.traditional_uses.map((use, idx) => (
              <li key={idx}>{use}</li>
            ))}
          </ul>
        </div>

        {/* Parts Traditionally Used */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <FlaskConical className="w-4 h-4 text-emerald-800" />
            Parts Traditionally Used
          </h3>
          <ul className="text-xs text-stone-600 space-y-2 list-disc pl-4 leading-relaxed">
            {plant.parts_traditionally_used.map((part, idx) => (
              <li key={idx}>{part}</li>
            ))}
          </ul>
        </div>

      </div>

      {/* Traditional Preparations */}
      {plant.traditional_preparations && plant.traditional_preparations.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider font-mono">
            Traditional Preparation Methods
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plant.traditional_preparations.map((prep, idx) => (
              <div key={idx} className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-700 leading-relaxed">
                {prep}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Phytochemicals */}
      {plant.key_phytochemicals && plant.key_phytochemicals.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-3 shadow-xs">
          <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider font-mono">
            Key Phytochemical Markers
          </h3>
          <div className="flex flex-wrap gap-2">
            {plant.key_phytochemicals.map((chem, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200/80 rounded text-xs font-mono"
              >
                {chem}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Precautions & Safety */}
      {plant.precautions && plant.precautions.length > 0 && (
        <div className="bg-amber-50/80 rounded-xl border border-amber-200 p-6 space-y-3 shadow-xs">
          <h3 className="text-xs font-semibold text-amber-950 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            Precautions, Toxicity Alerts & Contraindications
          </h3>
          <ul className="text-xs text-amber-900 space-y-1.5 list-disc pl-4 leading-relaxed">
            {plant.precautions.map((prec, idx) => (
              <li key={idx}>{prec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 bg-stone-100 rounded-lg border border-stone-200 text-xs text-stone-600 leading-relaxed flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          <strong>Educational Notice:</strong> Ethnobotanical knowledge presented for {plant.name} is compiled for academic documentation in this B.Tech IT project. It is not approved clinical medical advice. Always consult a healthcare professional.
        </p>
      </div>

    </div>
  );
};
