import React, { useState } from 'react';
import { X, BookOpen, Copy, Check, Sparkles, Filter } from 'lucide-react';
import { AI_PROMPTS_VAULT } from '../data/monetizationCatalog';

interface PromptsVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptsVaultModal: React.FC<PromptsVaultModalProps> = ({ isOpen, onClose }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(AI_PROMPTS_VAULT.map((p) => p.category)))];

  const filtered = activeCategory === 'All'
    ? AI_PROMPTS_VAULT
    : AI_PROMPTS_VAULT.filter((p) => p.category === activeCategory);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        id="prompts-vault-modal-container"
        className="relative w-full max-w-3xl bg-[#111] border border-[#333] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#0c0c0c] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f59e0b]/15 text-[#f59e0b] flex items-center justify-center border border-[#f59e0b]/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                AI कमाई मास्टर प्रॉम्प्ट्स वॉल्ट
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                कॉपी-पेस्ट करके तुरंत रिजल्ट देने वाले टेस्टेड प्रॉम्प्ट्स
              </p>
            </div>
          </div>
          <button
            id="close-prompts-modal-btn"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-[#1a1a1a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="p-3 bg-[#050505] border-b border-[#262626] flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <Filter className="w-3.5 h-3.5 text-gray-500 ml-2 font-mono" />
          {categories.map((cat) => (
            <button
              key={cat}
              id={`prompt-filter-${cat}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                activeCategory === cat
                  ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-sm'
                  : 'bg-[#111] text-gray-400 border-[#333] hover:text-white hover:border-gray-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              id={`prompt-card-${item.id}`}
              className="p-4 rounded-2xl bg-[#050505] border border-[#222] hover:border-[#3b82f6] transition-colors space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30">
                    {item.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{item.title}</h4>
                </div>
                <button
                  id={`copy-vault-btn-${item.id}`}
                  onClick={() => handleCopy(item.id, item.prompt)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161616] hover:bg-[#222] text-xs font-medium text-gray-200 border border-[#333] transition-colors shrink-0"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#10b981]" />
                      <span className="text-[#10b981] font-semibold font-mono">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="font-mono">Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 bg-[#0c0c0c] rounded-xl border border-[#222] font-mono text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
                {item.prompt}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
