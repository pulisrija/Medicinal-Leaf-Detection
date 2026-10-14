import React, { useState } from 'react';
import { Eye, Crosshair, Sparkles } from 'lucide-react';
import { BoundingBox, InterpretabilityData } from '../types';

interface BoundingBoxOverlayProps {
  imageUrl: string;
  plantName?: string;
  scientificName?: string;
  confidence: number;
  boundingBox?: BoundingBox | null;
  interpretability?: InterpretabilityData;
  isMock?: boolean;
}

export const BoundingBoxOverlay: React.FC<BoundingBoxOverlayProps> = ({
  imageUrl,
  plantName,
  scientificName,
  confidence,
  boundingBox,
  interpretability,
  isMock = false
}) => {
  const [showAttention, setShowAttention] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(false);

  // Confidence color scale
  const isHighConfidence = confidence >= 0.70;
  const isModerate = confidence >= 0.50 && confidence < 0.70;

  const strokeColor = isHighConfidence ? '#059669' : isModerate ? '#d97706' : '#dc2626';
  const fillColor = isHighConfidence ? 'rgba(5, 150, 105, 0.12)' : 'rgba(217, 119, 6, 0.12)';

  return (
    <div className="relative flex flex-col bg-stone-900 rounded-xl overflow-hidden border border-stone-800 shadow-md">
      {/* Top HUD Toolbar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-stone-950/80 border-b border-stone-800 text-xs text-stone-300">
        <div className="flex items-center gap-2">
          <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-stone-300">
            {boundingBox ? `DETECTION: [${boundingBox.x1}, ${boundingBox.y1}, ${boundingBox.x2}, ${boundingBox.y2}]` : 'DETECTION STAGE'}
          </span>
          {isMock && (
            <span className="ml-2 font-mono text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.2 rounded">
              DEMO/SIMULATION
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {interpretability?.salient_leaf_features && (
            <button
              onClick={() => setShowAttention(!showAttention)}
              className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
                showAttention
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title="Toggle BiFPN Feature Saliency Points"
            >
              <Eye className="w-3 h-3" />
              <span>{showAttention ? 'Hide Attention' : 'Show Attention'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Image Stage with SVG Detection Layer */}
      <div className="relative aspect-4/3 w-full bg-stone-950 flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt={plantName || "Medicinal Leaf"}
          className="w-full h-full object-contain"
        />

        {/* SVG Overlay for Bounding Box and Attention Heatmap */}
        {boundingBox && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 512 512"
            preserveAspectRatio="none"
          >
            {/* Detected Leaf Box */}
            <rect
              x={boundingBox.x1}
              y={boundingBox.y1}
              width={boundingBox.width}
              height={boundingBox.height}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="3"
              strokeDasharray={isModerate ? "6 4" : "none"}
              rx="4"
            />

            {/* Corner Reticles for authentic detection feel */}
            <g stroke={strokeColor} strokeWidth="3" fill="none">
              <path d={`M ${boundingBox.x1} ${boundingBox.y1 + 16} L ${boundingBox.x1} ${boundingBox.y1} L ${boundingBox.x1 + 16} ${boundingBox.y1}`} />
              <path d={`M ${boundingBox.x2 - 16} ${boundingBox.y1} L ${boundingBox.x2} ${boundingBox.y1} L ${boundingBox.x2} ${boundingBox.y1 + 16}`} />
              <path d={`M ${boundingBox.x1} ${boundingBox.y2 - 16} L ${boundingBox.x1} ${boundingBox.y2} L ${boundingBox.x1 + 16} ${boundingBox.y2}`} />
              <path d={`M ${boundingBox.x2 - 16} ${boundingBox.y2} L ${boundingBox.x2} ${boundingBox.y2} L ${boundingBox.x2} ${boundingBox.y2 - 16}`} />
            </g>

            {/* Salient Attention Feature Points (Interpretability) */}
            {showAttention && interpretability?.salient_leaf_features?.map((feat, idx) => (
              <g key={idx} className="transition-opacity">
                <circle
                  cx={feat.point[0]}
                  cy={feat.point[1]}
                  r="7"
                  fill="rgba(56, 189, 248, 0.4)"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
                <circle
                  cx={feat.point[0]}
                  cy={feat.point[1]}
                  r="2"
                  fill="#ffffff"
                />
              </g>
            ))}
          </svg>
        )}

        {/* Floating Label on top of bounding box */}
        {boundingBox && (
          <div
            className="absolute z-10 pointer-events-none font-mono text-xs px-2.5 py-1 rounded shadow-md flex items-center gap-1.5 text-white"
            style={{
              top: `${Math.max(8, (boundingBox.y1 / 512) * 100)}%`,
              left: `${Math.max(4, (boundingBox.x1 / 512) * 100)}%`,
              backgroundColor: strokeColor
            }}
          >
            <span className="font-semibold">{plantName || 'Leaf'}</span>
            <span className="opacity-90">({Math.round(confidence * 100)}%)</span>
          </div>
        )}
      </div>

      {/* Bottom Interpretability Legend */}
      {showAttention && interpretability?.salient_leaf_features && (
        <div className="bg-stone-950 px-4 py-2.5 border-t border-stone-800 text-[11px] text-stone-400">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-stone-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Visual Attention Features (BiFPN Multi-Scale Activations)
            </span>
            <span className="font-mono text-stone-400">P3-P7 Fusion</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {interpretability.salient_leaf_features.map((feat, idx) => (
              <div key={idx} className="flex items-center justify-between text-stone-400">
                <span className="truncate">· {feat.name}</span>
                <span className="font-mono text-cyan-400 ml-1">{(feat.weight * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
