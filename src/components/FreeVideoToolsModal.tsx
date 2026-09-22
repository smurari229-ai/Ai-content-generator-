import React from 'react';
import { X, Video, Play, Sparkles } from 'lucide-react';
import { FreeVideoToolsDirectory } from './FreeVideoToolsDirectory';

interface FreeVideoToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPromptToCopy?: string;
  onOpenInAppStudio?: () => void;
}

export const FreeVideoToolsModal: React.FC<FreeVideoToolsModalProps> = ({
  isOpen,
  onClose,
  currentPromptToCopy,
  onOpenInAppStudio
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        id="free-video-tools-modal-container"
        className="relative w-full max-w-5xl bg-[#0a0a0e] border border-[#26262e] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#202028] bg-[#0d0d12] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>मुफ़्त AI वीडियो टूल्स (Free Video Generator Tools)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30">
                  0 Cost
                </span>
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Kling AI, Hailuo AI, Luma, Pika, CapCut, Leonardo और इन-ऐप लाइव स्टूडियो
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-free-video-tools-modal-btn"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-[#1c1c24] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {onOpenInAppStudio && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0a1812] to-teal-950/40 border border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Play className="w-5 h-5 fill-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>⚡ यहीं से सीधे वीडियो बनाना चाहते हैं? (Make Video Right Here)</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                      In-App Engine
                    </span>
                  </h4>
                  <p className="text-xs text-gray-300 font-mono">
                    बिना किसी बाहरी टूल के ब्राउज़र में काइनेटिक टेक्स्ट, वॉयसओवर और बैकग्राउंड म्यूजिक के साथ वीडियो चलाएं व एक्सपोर्ट करें।
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="modal-open-inapp-studio-btn"
                onClick={() => {
                  onClose();
                  onOpenInAppStudio();
                }}
                className="w-full sm:w-auto shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-bold text-xs shadow-md shadow-emerald-950/40 transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>🎬 यहीं वीडियो बनाएं</span>
              </button>
            </div>
          )}

          <FreeVideoToolsDirectory currentPromptToCopy={currentPromptToCopy} />
        </div>
      </div>
    </div>
  );
};
