import React from 'react';
import { ArrowRight, Sparkles, BookOpen, Layers, ShieldCheck, Microscope } from 'lucide-react';
import { PLANTS_DATA } from '../data/plantsData';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onSelectPlant: (plantName: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectPlant }) => {
  const featuredPlants = PLANTS_DATA.slice(0, 4);

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-stone-100/80 to-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Natural Editorial Kicker (No Pill Badges) */}
              <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase font-mono">
                B.Tech Information Technology Project · Anurag University
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
                Identify Medicinal Plants with AI
              </h1>

              <p className="text-lg sm:text-xl text-stone-600 leading-relaxed max-w-2xl font-normal">
                Upload a leaf image and discover its plant identity along with traditional herbal knowledge. Powered by an EfficientDet deep learning architecture for precise leaf localization and species classification.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('identify')}
                  className="px-6 py-3.5 text-base font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-700 active:scale-98 transition-all shadow-xs flex items-center gap-2 group"
                >
                  <span>Identify a Plant</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => onNavigate('plants')}
                  className="px-6 py-3.5 text-base font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 hover:text-stone-900 transition-colors shadow-xs"
                >
                  Explore Plants
                </button>
              </div>

              {/* Key Architecture Facts (Clean unboxed text metadata) */}
              <div className="pt-6 border-t border-stone-200/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-stone-500 font-mono">
                <span>EfficientDet-D0 BiFPN</span>
                <span aria-hidden="true">·</span>
                <span>EfficientNet-B0 Backbone</span>
                <span aria-hidden="true">·</span>
                <span>10 Indian Flora Classes</span>
                <span aria-hidden="true">·</span>
                <span>Ethnobotanical Repository</span>
              </div>
            </div>

            {/* Right Hero Image Column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-lg">
                <img
                  src="/src/assets/images/herbvision_hero_1791811522166.jpg"
                  alt="Scientific botanical photography of Indian medicinal leaves"
                  className="w-full h-auto object-cover aspect-4/3"
                  referrerPolicy="no-referrer"
                />
                <div className="p-4 bg-white/95 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-medium text-stone-800">Medicinal Herbarium Analysis</span>
                  <span className="font-mono">HerbVision Engine</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4-Step How It Works Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-semibold text-emerald-800 uppercase tracking-wider font-mono mb-2">
            Automated Botanical Pipeline
          </h2>
          <h3 className="text-3xl font-bold text-stone-900 tracking-tight">
            How The System Identifies & Recommends
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm font-mono">
              01
            </div>
            <h4 className="text-base font-semibold text-stone-900">Upload Leaf Image</h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              Submit a clear photograph of a specimen leaf via upload, drag-and-drop, or test samples.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm font-mono">
              02
            </div>
            <h4 className="text-base font-semibold text-stone-900">AI Detects Leaf</h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              Regression head predicts the precise spatial coordinates of the leaf blade with a bounding box.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm font-mono">
              03
            </div>
            <h4 className="text-base font-semibold text-stone-900">EfficientDet Identifies</h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              BiFPN multi-scale features classify the species and evaluate confidence against the threshold.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm font-mono">
              04
            </div>
            <h4 className="text-base font-semibold text-stone-900">Herbal Knowledge Displayed</h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              Instant retrieval of verified traditional uses, preparation methods, parts used, and precautions.
            </p>
          </div>

        </div>
      </section>

      {/* Featured Medicinal Plants Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xs font-semibold text-emerald-800 uppercase tracking-wider font-mono mb-2">
              Indian Botanical Flora
            </h2>
            <h3 className="text-3xl font-bold text-stone-900 tracking-tight">
              Supported Medicinal Plant Classes
            </h3>
          </div>
          <button
            onClick={() => onNavigate('plants')}
            className="text-sm font-semibold text-emerald-800 hover:text-emerald-700 flex items-center gap-1 group whitespace-nowrap"
          >
            <span>View All 10 Plants</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPlants.map((plant) => (
            <div
              key={plant.id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
            >
              <div className="aspect-4/3 w-full overflow-hidden bg-stone-100">
                <img
                  src={plant.image_url}
                  alt={plant.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-stone-900">{plant.name}</h4>
                  <p className="text-xs italic text-stone-500 font-serif">{plant.scientific_name}</p>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed pt-1">
                    {plant.short_description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-mono text-stone-500">{plant.family}</span>
                  <button
                    onClick={() => onSelectPlant(plant.name)}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-700"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Deep Learning Architecture Highlight Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-8 sm:p-10 border border-stone-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                Deep Learning Model Specification
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                EfficientDet: Scalable & Efficient Object Detection
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed max-w-2xl">
                Unlike single-scale detectors, EfficientDet utilizes a compound-scaled EfficientNet backbone coupled with Bidirectional Feature Pyramid Networks (BiFPN). This enables weighted multi-scale feature fusion across levels P3 to P7, capturing micro-details in leaf venation and margins.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <button
                onClick={() => onNavigate('architecture')}
                className="px-5 py-3 text-sm font-semibold text-stone-900 bg-white rounded-lg hover:bg-stone-100 transition-colors shadow-xs"
              >
                Explore Full Architecture
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
