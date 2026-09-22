import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  MessageSquare, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { ChatMessage } from '../types';
import { safeFetchJson } from '../services/apiHelper';

interface AIChatCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_QUESTIONS = [
  'YouTube AI चैनल के लिए पहले 10 दिन क्या करें?',
  'Fiverr और Upwork पर बिना रिव्यू पहला क्लाइंट कैसे पाएं?',
  '2026 में कौन सा AI टूल पूरी तरह फ्री है?',
  'Instagram AI रील्स के लिए हाई-कन्वर्टिंग हुक बताओ',
];

function getFallbackCoachReply(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('youtube') || q.includes('short') || q.includes('video')) {
    return `🎯 **YouTube Shorts & Videos से कमाई की रणनीति:**\n\n1. **हाई-रिटेंशन हुक (0-3s):** पहले 3 सेकंड में व्यूअर का ध्यान खींचें (उदा. 'स्क्रॉल करना बंद करो!')।\n2. **फ्री AI विजुअल्स:** Leonardo.ai या Bing Image Creator से 9:16 विजुअल्स बनाएं।\n3. **CapCut ऑटो-कैप्शन:** पीले/सफेद टेक्स्ट के साथ बोल्ड कैप्शन्स जोड़ें।\n4. **3 तरह से मोनेटाइजेशन:** Ad Revenue + Affiliate Links + Brand Deals।\n\n💡 *टिप: आप सीधे हमारे 'AI कंटेंट जनरेटर' से 100% फ्री वीडियो स्क्रिप्ट और स्टोरीबोर्ड भी बना सकते हैं!*`;
  }
  if (q.includes('freelance') || q.includes('client') || q.includes('fiverr') || q.includes('upwork')) {
    return `💼 **AI फ्रीलांसिंग से क्लाइंट पाने का तरीका:**\n\n1. **हाई-डिमांड स्किल:** AI इमेज जनरेशन, कॉपीराइटिंग, या सोशल मीडिया ऑटोमेशन चुनें।\n2. **फ्री पोर्टफोलियो:** 5 बेहतरीन सैंपल तैयार करें और Gumroad/Notion पर होस्ट करें।\n3. **कोल्ड आउटरीच:** इंस्टाग्राम या लिंक्डइन पर क्रिएटर्स को 1 फ्री सैंपल वीडियो या थंबनेल भेजें।\n4. **प्राइसिंग:** शुरुआत में ₹500 - ₹1,500 प्रति प्रोजेक्ट से शुरू करें, फिर बढ़ाएं।`;
  }
  return `💡 **AI कमाई गुरु का त्वरित मार्गदर्शन:**\n\n- **2026 का सुनहरा नियम:** टूल से ज़्यादा ज़रूरी है कि आप किस समस्या का समाधान कर रहे हैं।\n- **शुरुआत करें:** बिना किसी खर्च के Gemini, Bing Image Creator और CapCut का इस्तेमाल करके कंटेंट या सर्विस बनाना शुरू करें।\n- **कंसिस्टेंसी:** रोज़ 1-2 घंटे लगातार 30 दिनों तक काम करें।\n\nक्या आप किसी ख़ास तरीके (जैसे YouTube Shorts, फ्रीलांसिंग, या डिजिटल प्रोडक्ट्स) के बारे में विस्तार से जानना चाहते हैं?`;
}

export const AIChatCoachModal: React.FC<AIChatCoachModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content:
        'नमस्ते! 🙏 मैं आपका **AI कमाई गुरु** हूँ। आप AI टूल्स (Gemini, ChatGPT, Midjourney, Automation) से पैसे कमाने, क्लाइंट ढूंढने, या यूट्यूब चैनल ग्रो करने के बारे में मुझसे कोई भी सवाल पूछ सकते हैं। आप क्या शुरू करना चाहते हैं?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await safeFetchJson<{
        success: boolean;
        reply?: string;
        error?: string;
      }>('/api/ai/ask-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          conversationHistory: messages.slice(-6),
        }),
      });

      if (res.ok && res.data && res.data.success && res.data.reply) {
        const botMsg: ChatMessage = {
          id: 'bot-' + Date.now(),
          role: 'model',
          content: res.data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(res.error || res.data?.error || 'No response');
      }
    } catch (e: any) {
      console.warn('AI Chat Coach API fallback:', e);
      const fallbackReply = getFallbackCoachReply(query);
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'model',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end">
      <div 
        id="ai-chat-coach-container"
        className="relative w-full max-w-xl bg-[#050505] border-l border-[#262626] shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#262626] bg-[#0c0c0c] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3b82f6] flex items-center justify-center text-white shadow-md border border-[#3b82f6]/40">
              <Bot className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AI कमाई गुरु (Coach)</h3>
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Powered by Gemini 2.5 Flash
              </p>
            </div>
          </div>

          <button
            id="close-chat-coach-btn"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-[#1a1a1a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => {
            const isBot = m.role === 'model';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                    isBot ? 'bg-[#111] text-[#3b82f6] border border-[#333]' : 'bg-[#3b82f6] text-white font-bold'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isBot
                      ? 'bg-[#111] border border-[#333] text-gray-200 shadow-sm'
                      : 'bg-[#3b82f6] text-white font-medium shadow-md shadow-[#3b82f6]/20'
                  }`}
                >
                  {m.content}
                  <div className={`text-[10px] mt-1.5 ${isBot ? 'text-gray-500' : 'text-blue-100'} text-right font-mono`}>
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#111] p-3 rounded-2xl border border-[#333] w-fit font-mono">
              <Sparkles className="w-4 h-4 animate-spin text-[#3b82f6]" />
              <span>AI गुरु उत्तर तैयार कर रहे हैं...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        <div className="p-3 bg-[#0c0c0c] border-t border-[#262626] shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1.5 font-mono">
            <Lightbulb className="w-3 h-3 text-[#f59e0b]" />
            <span>सुझाए गए सवाल:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                id={`suggested-q-${idx}`}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-lg bg-[#111] hover:bg-[#1a1a1a] text-gray-300 text-[11px] whitespace-nowrap border border-[#333] hover:border-[#3b82f6] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-[#050505] border-t border-[#262626] flex items-center gap-2 shrink-0"
        >
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="AI कमाई से जुड़ा कोई भी सवाल पूछें..."
            className="flex-1 bg-[#111] border border-[#333] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3b82f6]"
          />
          <button
            id="chat-send-btn"
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-white hover:bg-gray-200 text-black font-bold disabled:opacity-40 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
