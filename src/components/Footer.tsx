import React from 'react';
import { ShieldAlert, GraduationCap, Github } from 'lucide-react';

interface FooterProps {
  onOpenDisclaimer?: () => void;
  onNavigate?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDisclaimer, onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Prominent Educational & Medical Disclaimer Bar */}
      <div className="bg-amber-950/60 border-b border-amber-900/60 text-amber-200 py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3 text-xs leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="flex-1">
            <strong className="font-semibold text-amber-100">Medical & Educational Disclaimer:</strong> This application provides educational and ethnobotanical information about medicinal plants. The information is not medical advice and should not be used to diagnose, treat, cure, or prevent any disease. Consult a qualified healthcare professional before using medicinal plants.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Col 1: Project Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white tracking-tight">HerbVision AI</span>
              <span className="text-xs text-emerald-400 font-mono border border-emerald-800 px-1.5 py-0.5 rounded">B.Tech IT</span>
            </div>
            <p className="text-sm text-stone-400 max-w-lg leading-relaxed">
              An Intelligent Deep Learning System for Medicinal Plant Classification and Herbal Remedy Recommendation utilizing an EfficientDet deep learning architecture (EfficientNet-B0 backbone + BiFPN) and structured ethnobotanical knowledge repository.
            </p>
            <div className="text-xs text-stone-400 space-y-1 pt-2">
              <p><span className="text-stone-300 font-medium">Department:</span> Department of Information Technology</p>
              <p><span className="text-stone-300 font-medium">Institution:</span> Anurag University, Hyderabad</p>
            </div>
          </div>

          {/* Col 2: Project Team */}
          <div>
            <h4 className="text-xs font-semibold text-stone-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              Project Team
            </h4>
            <div className="text-xs text-stone-400 space-y-2">
              <div>
                <p className="text-stone-300 font-medium">Student Authors:</p>
                <ul className="mt-1 space-y-0.5 pl-2 border-l border-stone-800">
                  <li>Sankeerthana G</li>
                  <li>P. Srija</li>
                  <li>V. Shirisha</li>
                </ul>
              </div>
              <div className="pt-2">
                <p className="text-stone-300 font-medium">Project Guide:</p>
                <p className="pl-2 border-l border-stone-800 text-stone-400">Mr. B. Ravi Raju</p>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© 2026 Anurag University · Department of Information Technology · B.Tech Mini Project</p>
          <div className="flex items-center gap-4">
            <span className="text-stone-400 font-mono">EfficientDet-D0</span>
            <span>·</span>
            <span className="text-stone-400 font-mono">TensorFlow</span>
            <span>·</span>
            <span className="text-stone-400 font-mono">FastAPI</span>
            <span>·</span>
            <span className="text-stone-400 font-mono">React</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
