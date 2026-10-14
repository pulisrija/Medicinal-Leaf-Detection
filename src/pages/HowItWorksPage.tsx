import React from 'react';
import { Layers, Cpu, ArrowDown, GitBranch, Crosshair, Sparkles, BookOpen } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-6">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          System Architecture & Deep Learning Pipeline
        </h1>
        <p className="text-stone-600 mt-1 text-base max-w-3xl">
          Detailed technical breakdown of the EfficientDet-D0 architecture, bidirectional feature pyramid networks (BiFPN), and the end-to-end ethnobotanical recommendation pipeline.
        </p>
      </div>

      {/* 4-Step End-to-End Workflow */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-semibold text-emerald-800 uppercase tracking-wider font-mono">
              01. End-To-End Execution
            </h2>
            <h3 className="text-2xl font-bold text-stone-900 tracking-tight">
              Four-Phase Botanical Intelligence Workflow
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-3 shadow-xs">
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              STEP 1
            </span>
            <h4 className="text-base font-bold text-stone-900">Upload Leaf Image</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              The user submits a digital leaf photograph. The system validates byte integrity, converts to 3-channel RGB, and normalizes pixels to $[0, 1]$ with aspect-preserving letterbox padding to 512×512.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-3 shadow-xs">
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              STEP 2
            </span>
            <h4 className="text-base font-bold text-stone-900">AI Detects Leaf</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              EfficientDet's box regression head predicts coordinates $[x_1, y_1, x_2, y_2]$ delineating the leaf blade from noisy background artifacts, isolating the laminar surface.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-3 shadow-xs">
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              STEP 3
            </span>
            <h4 className="text-base font-bold text-stone-900">EfficientDet Identifies</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Multi-scale BiFPN features pass through the classification subnetwork to produce a softmax probability distribution over the 10 plant classes, verified against the $0.50$ threshold.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-3 shadow-xs">
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              STEP 4
            </span>
            <h4 className="text-base font-bold text-stone-900">Herbal Knowledge Displayed</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              The predicted species identifier queries the structured ethnobotanical JSON repository to deliver traditional uses, preparations, plant parts, and medical safety precautions.
            </p>
          </div>

        </div>
      </section>

      {/* Deep Learning Architecture Stack */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xs font-semibold text-emerald-800 uppercase tracking-wider font-mono">
            02. Model Architecture
          </h2>
          <h3 className="text-2xl font-bold text-stone-900 tracking-tight">
            EfficientDet-D0 Layer-by-Layer Decomposition
          </h3>
        </div>

        {/* Visual Architecture Flow Diagram */}
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-8 border border-stone-800 space-y-8 shadow-sm">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            
            {/* Box 1: Backbone */}
            <div className="p-5 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                <span>STAGE 1</span>
                <span>BACKBONE</span>
              </div>
              <h4 className="text-lg font-bold text-white">EfficientNet-B0</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Compound scaled CNN pretrained on ImageNet. Extracts feature maps P3 (64×64), P4 (32×32), and P5 (16×16) with MBConv blocks.
              </p>
            </div>

            {/* Box 2: BiFPN */}
            <div className="p-5 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>STAGE 2</span>
                <span>FEATURE FUSION</span>
              </div>
              <h4 className="text-lg font-bold text-white">BiFPN Levels P3–P7</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Bidirectional feature pyramid with fast normalized weighted fusion. Top-down and bottom-up passes repeatedly fuse multi-scale semantics.
              </p>
            </div>

            {/* Box 3: Heads */}
            <div className="p-5 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                <span>STAGE 3</span>
                <span>DUAL HEADS</span>
              </div>
              <h4 className="text-lg font-bold text-white">Class & Box Subnets</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Separable convolution heads: Box regression (Smooth L1 Huber loss) and Plant classification (Focal categorical crossentropy).
              </p>
            </div>

            {/* Box 4: Knowledge Base */}
            <div className="p-5 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                <span>STAGE 4</span>
                <span>REPOSITORY</span>
              </div>
              <h4 className="text-lg font-bold text-white">Ethnobotanical KB</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                JSON knowledge base linking species taxon to traditional Ayurvedic uses, active phytochemicals, preparation methods, and cautions.
              </p>
            </div>

          </div>

          {/* Mathematical / Technical Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-800 text-xs">
            <div className="space-y-2">
              <h5 className="font-mono text-stone-300 font-semibold uppercase">Compound Scaling Principle</h5>
              <p className="text-stone-400 leading-relaxed">
                EfficientDet scales network depth $D$, width $W$, and input resolution $R$ simultaneously using compound coefficient $\phi$:
              </p>
              <div className="p-3 bg-black/60 rounded font-mono text-emerald-300 text-[11px]">
                W_bifpn = 64 · (1.35)^φ,  D_bifpn = 3 + φ,  R_input = 512 + φ · 128
              </div>
              <p className="text-stone-400 leading-relaxed">
                For EfficientDet-D0 ($\phi = 0$): Resolution = 512×512, BiFPN channels = 64, BiFPN repeat layers = 3.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-mono text-stone-300 font-semibold uppercase">Why EfficientDet Over YOLO?</h5>
              <ul className="text-stone-400 space-y-1 list-disc pl-4 leading-relaxed">
                <li><strong className="text-stone-200">BiFPN Multi-Scale Sensitivity:</strong> Leaf venation (fine) vs leaf contour (coarse) require cross-scale feature fusion across levels P3 to P7.</li>
                <li><strong className="text-stone-200">Efficiency:</strong> Fewer parameters and FLOPs for the same detection performance, enabling smooth deployment on CPU/edge servers.</li>
                <li><strong className="text-stone-200">Transfer Learning:</strong> Leverages ImageNet pretrained EfficientNet weights, which generalize exceptionally well to botanical specimen domains.</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* Comparison Matrix Table */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xs font-semibold text-emerald-800 uppercase tracking-wider font-mono">
            03. Architectural Comparison
          </h2>
          <h3 className="text-2xl font-bold text-stone-900 tracking-tight">
            Comparison with Traditional Object Detection Models
          </h3>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl border border-stone-200 shadow-xs">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-900 font-semibold uppercase font-mono">
              <tr>
                <th className="py-3 px-4">Architecture</th>
                <th className="py-3 px-4">Backbone</th>
                <th className="py-3 px-4">Feature Fusion</th>
                <th className="py-3 px-4">Compound Scaling</th>
                <th className="py-3 px-4">Suitability for Leaf Flora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              <tr className="bg-emerald-50/50 font-medium text-stone-900">
                <td className="py-3 px-4 font-bold text-emerald-900">EfficientDet-D0 (HerbVision)</td>
                <td className="py-3 px-4">EfficientNet-B0</td>
                <td className="py-3 px-4">BiFPN (Repeated, Weighted)</td>
                <td className="py-3 px-4 text-emerald-800">Yes (Uniform $\phi$)</td>
                <td className="py-3 px-4 text-emerald-800">Optimal (High venation fidelity, lightweight)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-stone-800">Faster R-CNN</td>
                <td className="py-3 px-4">ResNet-50</td>
                <td className="py-3 px-4">Standard FPN (Top-down only)</td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4">Heavy computation, slower inference</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-stone-800">Standard YOLO (v3/v4)</td>
                <td className="py-3 px-4">DarkNet-53</td>
                <td className="py-3 px-4">PANet / Feature Pyramid</td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4">Prioritizes FPS over fine botanical multi-scale balance</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-stone-800">Standard ResNet Classifier</td>
                <td className="py-3 px-4">ResNet-50</td>
                <td className="py-3 px-4">None (Classification only)</td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4">Lacks leaf bounding box localization</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};
