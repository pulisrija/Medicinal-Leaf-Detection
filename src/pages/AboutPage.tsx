import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Award,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Code2,
  Cpu,
  CheckCircle2
} from 'lucide-react';

interface VivaQuestion {
  question: string;
  category: string;
  answer: string;
}

export const AboutPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const vivaQuestions: VivaQuestion[] = [
    {
      question: "What is EfficientDet and why is it preferred over conventional detectors?",
      category: "Deep Learning Architecture",
      answer: "EfficientDet is an object detection architecture developed by Google that combines an EfficientNet backbone with a Bidirectional Feature Pyramid Network (BiFPN). It uses compound scaling to uniformly balance network depth, width, and image resolution. For leaf detection, EfficientDet is superior because it provides rich multi-scale feature representations that capture both micro-features (fine venation, teeth) and macro-features (overall leaf shape) at much lower FLOPs and parameter counts."
    },
    {
      question: "What is the function of BiFPN in EfficientDet?",
      category: "Feature Fusion",
      answer: "BiFPN (Bidirectional Feature Pyramid Network) improves upon traditional top-down FPNs by introducing bidirectional (top-down and bottom-up) multi-scale connections and fast normalized feature fusion. It removes nodes with only one edge to reduce parameters and adds residual cross-scale skip connections, allowing multi-level feature maps (P3 through P7) to exchange contextual information efficiently."
    },
    {
      question: "What is the role of the EfficientNet backbone?",
      category: "Backbone & Transfer Learning",
      answer: "EfficientNet (e.g., EfficientNet-B0) acts as the feature extractor. Built upon Mobile Inverted Bottleneck Convolution (MBConv) blocks with squeeze-and-excitation optimization, it achieves high ImageNet accuracy with minimal parameters. In our project, transfer learning initializes the backbone with ImageNet pretrained weights, enabling the model to converge rapidly even on moderate-sized botanical datasets."
    },
    {
      question: "What is the difference between object detection and standard image classification in this project?",
      category: "Computer Vision",
      answer: "Standard classification outputs only a single label for the entire image without spatial localization. In contrast, object detection simultaneously performs localization (predicting bounding box coordinates [x1, y1, x2, y2] identifying where the leaf is situated in the frame) and classification (predicting which medicinal plant species the detected leaf belongs to). This ensures that background clutter (table surfaces, hands, soil) does not mislead the model."
    },
    {
      question: "How are bounding boxes represented and evaluated?",
      category: "Detection Metrics",
      answer: "Bounding boxes are parameterized as 4-tuples: either [ymin, xmin, ymax, xmax] (normalized relative coordinates) or [x1, y1, x2, y2] (pixel coordinates). Localization accuracy is evaluated using Intersection over Union (IoU): IoU = Area of Overlap / Area of Union. A predicted box is considered a True Positive if its IoU with the ground truth box is greater than or equal to a set threshold (typically 0.50)."
    },
    {
      question: "What is the significance of the 0.50 confidence threshold?",
      category: "Safety & Reliability",
      answer: "The 0.50 threshold acts as a safety gate to reject uncertain or out-of-distribution predictions. Because herbal plants are used for wellness applications, false classifications could lead to accidental ingestion of contraindicated species. If the model's highest class probability is below 0.50, the system displays an explicit warning asking the user to upload a clearer specimen rather than presenting an educated guess as fact."
    },
    {
      question: "How do you define Precision, Recall, F1-Score, and mAP in this system?",
      category: "Evaluation Metrics",
      answer: "Precision is True Positives / (True Positives + False Positives)—measuring how many identified leaves were correct. Recall is True Positives / (True Positives + False Negatives)—measuring what percentage of actual medicinal leaves were detected. F1-score is the harmonic mean of Precision and Recall. Mean Average Precision (mAP) averages the area under the Precision-Recall curve across all 10 plant classes at a specific IoU threshold (mAP@0.5)."
    },
    {
      question: "Why is data leakage avoided and how is the dataset split?",
      category: "Dataset Methodology",
      answer: "Data leakage occurs when test data informs model training, producing artificially inflated metrics that fail in real-world deployment. To prevent this, the dataset is strictly partitioned into 70% Training, 20% Validation, and 10% Testing using stratified random sampling before any augmentation is applied. Augmented variations of an image never cross between train and test splits."
    },
    {
      question: "What augmentations are applied to leaf specimens?",
      category: "Data Preprocessing",
      answer: "To simulate real-world photography conditions, augmentations include random rotations (±20° to handle leaf orientation), random horizontal and vertical flips, random zoom (±10%), brightness/contrast jitter (to handle indoor vs. outdoor lighting), and aspect-preserving letterboxing. Bounding box coordinates are geometrically transformed synchronously with the image."
    },
    {
      question: "How does the herbal remedy recommendation pipeline operate?",
      category: "Software Architecture",
      answer: "Once the model identifies the plant class with confidence >= 0.50, the plant identifier is passed to an independent knowledge base engine (`backend/data/plants.json`). The engine retrieves traditional ethnobotanical uses, parts traditionally used, classical preparations, phytochemical markers, and safety contraindications, displaying them alongside a mandatory educational disclaimer."
    },
    {
      question: "Why use FastAPI for the backend instead of traditional Flask?",
      category: "Full-Stack Development",
      answer: "FastAPI offers native asynchronous request handling (ASGI), automatic data validation and serialization via Pydantic schemas, high throughput, and automatic interactive Swagger UI documentation at `/docs`. It enables clean separation between the React frontend UI and the Python ML inference service."
    },
    {
      question: "What happens when an unknown or non-leaf image is uploaded?",
      category: "Robustness & Edge Cases",
      answer: "The image preprocessing pipeline inspects pixel distributions and aspect ratios. If non-plant content (such as a vehicle or blank canvas) is submitted, the EfficientDet class probabilities remain dispersed and low. The confidence threshold (<0.50) triggers the fallback protocol, safely informing the user that no medicinal leaf could be detected."
    },
    {
      question: "What are the limitations of the current prototype and future scope?",
      category: "Future Scope",
      answer: "Current limitations include a catalog of 10 initial species, requirement for single prominent leaf specimens, and dependence on clear lighting. Future enhancements include scaling to 100+ AYUSH-listed medicinal flora, supporting multi-leaf and whole-plant detection, mobile offline edge deployment via TensorFlow Lite, and integrating an Ayurvedic Dosha (Vata, Pitta, Kapha) balance advisor."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-6">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          About the Project & Academic Documentation
        </h1>
        <p className="text-stone-600 mt-1 text-base">
          Academic project profile, authorship credits, institution affiliation, and viva voce technical documentation.
        </p>
      </div>

      {/* Academic Credits Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 text-xs font-mono font-semibold text-emerald-800 uppercase tracking-wider">
          <GraduationCap className="w-5 h-5 text-emerald-700" />
          <span>Academic Project Record</span>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            An Intelligent Deep Learning System for Medicinal Plant Classification and Herbal Remedy Recommendation
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            B.Tech Information Technology Mini Project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-stone-100 text-sm">
          
          {/* Institutional Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase font-mono text-stone-500">
              Department & Institution
            </h4>
            <div className="space-y-1 text-stone-800">
              <p className="font-semibold text-base">Department of Information Technology</p>
              <p className="text-stone-600">Anurag University</p>
              <p className="text-stone-500 text-xs">Hyderabad, Telangana, India</p>
            </div>
          </div>

          {/* Guide Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase font-mono text-stone-500">
              Project Guide / Mentor
            </h4>
            <div className="space-y-1 text-stone-800">
              <p className="font-semibold text-base">Mr. B. Ravi Raju</p>
              <p className="text-stone-600 text-xs">Assistant Professor, Department of Information Technology</p>
              <p className="text-stone-500 text-xs">Anurag University</p>
            </div>
          </div>

        </div>

        {/* Authors Info */}
        <div className="pt-6 border-t border-stone-100 space-y-3">
          <h4 className="text-xs font-semibold uppercase font-mono text-stone-500 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-700" />
            Project Authors (Student Investigators)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <p className="font-bold text-stone-900 text-sm">Sankeerthana G</p>
              <p className="text-xs text-stone-500 font-mono mt-0.5">B.Tech IT</p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <p className="font-bold text-stone-900 text-sm">P. Srija</p>
              <p className="text-xs text-stone-500 font-mono mt-0.5">B.Tech IT</p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <p className="font-bold text-stone-900 text-sm">V. Shirisha</p>
              <p className="text-xs text-stone-500 font-mono mt-0.5">B.Tech IT</p>
            </div>

          </div>
        </div>

      </div>

      {/* Viva Voce Questions & Answers Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xs font-semibold text-emerald-800 uppercase tracking-wider font-mono">
            Academic Viva Voce Preparation
          </h2>
          <h3 className="text-2xl font-bold text-stone-900 tracking-tight">
            Frequently Asked Viva Questions & Model Answers
          </h3>
          <p className="text-sm text-stone-600 mt-1">
            Comprehensive technical explanations covering EfficientDet, BiFPN, loss functions, metrics, and software design.
          </p>
        </div>

        <div className="space-y-3">
          {vivaQuestions.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-stone-50/50 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-medium text-emerald-800">
                      Q{idx + 1} · {item.category}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-stone-900">
                      {item.question}
                    </h4>
                  </div>
                  <div className="p-1 rounded text-stone-400 mt-1 shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-stone-600" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/30">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
