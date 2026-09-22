import React, { useState } from 'react';
import { X, Calculator, TrendingUp, Sparkles, CheckCircle2, DollarSign } from 'lucide-react';

interface IncomeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ModelConfig {
  name: string;
  unitName: string;
  defaultUnitsPerMonth: number;
  ratePerUnit: number;
  currency: string;
  notes: string;
}

const MODELS: Record<string, ModelConfig> = {
  youtube: {
    name: 'AI Faceless Shorts / Reels',
    unitName: 'वीडियो प्रति माह',
    defaultUnitsPerMonth: 60,
    ratePerUnit: 500, // AdSense + Affiliate + Sponsorship per video on avg
    currency: '₹',
    notes: '2 वीडियो रोज़ाना = 60 वीडियो/माह। 50,000+ व्यूज होने पर अनुमानित स्पॉन्सरशिप व एफिलिएट।',
  },
  freelance: {
    name: 'AI SEO आर्टिकल्स / कॉपीराइटिंग',
    unitName: 'आर्टिकल्स प्रति माह',
    defaultUnitsPerMonth: 20,
    ratePerUnit: 2000,
    currency: '₹',
    notes: 'Upwork/Fiverr पर ₹2,000 - ₹4,000 प्रति लॉन्ग-फॉर्म आर्टिकल।',
  },
  chatbots: {
    name: 'लोकल बिजनेस AI चैटबॉट्स',
    unitName: 'क्लाइंट्स / बॉट्स',
    defaultUnitsPerMonth: 3,
    ratePerUnit: 25000,
    currency: '₹',
    notes: 'प्रति बॉट सेटअप ₹20,000 + ₹3,000 मासिक मेंटेनेंस।',
  },
  digital_products: {
    name: 'प्रॉम्प्ट पैक्स व Notion टेम्पलेट्स',
    unitName: 'सेल्स / डाउनलोड्स प्रति माह',
    defaultUnitsPerMonth: 80,
    ratePerUnit: 499,
    currency: '₹',
    notes: 'Gumroad / Instamojo पर ₹499 में 80 प्रतियां।',
  },
  automation: {
    name: 'Make.com वर्कफ़्लो ऑटोमेशन',
    unitName: 'प्रोजेक्ट्स प्रति माह',
    defaultUnitsPerMonth: 2,
    ratePerUnit: 40000,
    currency: '₹',
    notes: 'प्रति ऑटोमेशन प्रोजेक्ट ₹35,000 - ₹50,000।',
  },
};

export const IncomeCalculatorModal: React.FC<IncomeCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [selectedModel, setSelectedModel] = useState<string>('youtube');
  const [units, setUnits] = useState<number>(MODELS.youtube.defaultUnitsPerMonth);
  const [rate, setRate] = useState<number>(MODELS.youtube.ratePerUnit);

  if (!isOpen) return null;

  const current = MODELS[selectedModel];

  const handleModelChange = (key: string) => {
    setSelectedModel(key);
    setUnits(MODELS[key].defaultUnitsPerMonth);
    setRate(MODELS[key].ratePerUnit);
  };

  const monthlyTotal = units * rate;
  const threeMonthTotal = monthlyTotal * 3;
  const yearlyTotal = monthlyTotal * 12;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        id="income-calc-modal-container"
        className="relative w-full max-w-2xl bg-[#111] border border-[#333] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#0c0c0c] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#10b981]/15 text-[#10b981] flex items-center justify-center border border-[#10b981]/30">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                AI कमाई और ROI कैलकुलेटर
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                समय और आउटपुट के आधार पर संभावित मासिक और वार्षिक कमाई का हिसाब
              </p>
            </div>
          </div>
          <button
            id="close-calc-modal-btn"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-[#1a1a1a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Method selector tabs */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400">
              AI बिजनेस मॉडल चुनें:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(MODELS).map(([key, config]) => (
                <button
                  key={key}
                  id={`calc-model-${key}`}
                  onClick={() => handleModelChange(key)}
                  className={`p-3 rounded-2xl text-left text-xs font-semibold transition-all border ${
                    selectedModel === key
                      ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-md shadow-[#3b82f6]/20'
                      : 'bg-[#050505] hover:bg-[#161616] text-gray-300 border-[#262626]'
                  }`}
                >
                  {config.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-3xl bg-[#050505] border border-[#222]">
            {/* Units */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-300">{current.unitName}:</span>
                <span className="font-mono text-[#10b981] font-bold text-sm">{units}</span>
              </div>
              <input
                type="range"
                min="1"
                max={selectedModel === 'chatbots' || selectedModel === 'automation' ? '10' : '200'}
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                className="w-full accent-[#3b82f6]"
              />
              <p className="text-[11px] text-gray-500 font-mono">
                प्रति माह आप कितना डिलीवर करेंगे।
              </p>
            </div>

            {/* Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-300">प्रति यूनिट कमाई (₹):</span>
                <span className="font-mono text-[#3b82f6] font-bold text-sm">₹{rate.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={selectedModel === 'digital_products' ? '199' : '500'}
                max={selectedModel === 'chatbots' || selectedModel === 'automation' ? '100000' : '10000'}
                step={selectedModel === 'chatbots' ? '1000' : '100'}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-[#3b82f6]"
              />
              <p className="text-[11px] text-gray-500 font-mono">
                औसत प्रति यूनिट मिलने वाला भुगतान।
              </p>
            </div>
          </div>

          {/* Earnings Projection */}
          <div className="p-5 rounded-3xl bg-[#0c0c0c] border border-[#333] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#10b981] uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#10b981]" /> संभावित कुल कमाई
              </span>
              <span className="text-[11px] font-mono text-gray-400">{current.name}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div className="p-3.5 rounded-2xl bg-[#050505] border border-[#222]">
                <span className="text-[11px] text-gray-400 font-mono">1 माह (Monthly)</span>
                <p className="text-base sm:text-xl font-mono font-extrabold text-[#10b981] mt-1 truncate">
                  ₹{monthlyTotal.toLocaleString()}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#050505] border border-[#222]">
                <span className="text-[11px] text-gray-400 font-mono">3 माह (Quarterly)</span>
                <p className="text-base sm:text-xl font-mono font-extrabold text-[#f59e0b] mt-1 truncate">
                  ₹{threeMonthTotal.toLocaleString()}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#050505] border border-[#222]">
                <span className="text-[11px] text-gray-400 font-mono">1 वर्ष (Annual)</span>
                <p className="text-base sm:text-xl font-mono font-extrabold text-[#3b82f6] mt-1 truncate">
                  ₹{yearlyTotal.toLocaleString()}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-300 bg-[#050505] p-3.5 rounded-2xl border border-[#222] leading-relaxed">
              💡 <strong>नोट:</strong> {current.notes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
