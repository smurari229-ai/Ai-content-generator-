import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing");
    }
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

// Fallback models in priority order for maximum availability & fast response (Free/Standard tier compatible)
const CANDIDATE_MODELS = [
  "gemini-3.7-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateContentWithFallback(params: {
  contents: any;
  config?: any;
  systemInstruction?: string;
}): Promise<string> {
  const ai = getGenAI();
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: {
            ...params.config,
            ...(params.systemInstruction ? { systemInstruction: params.systemInstruction } : {}),
          },
        });
        const text =
          response.text ||
          response.candidates?.[0]?.content?.parts?.map((p: any) => p.text || "").join("") ||
          "";
        if (text && text.trim().length > 0) {
          return text;
        }
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);
        const is503 = msg.includes("503") || msg.includes("high demand") || msg.includes("UNAVAILABLE");
        if (is503 && attempt === 1) {
          await sleep(400 + Math.random() * 400);
          continue;
        }
        break; // Move to next candidate model
      }
    }
  }

  throw lastError || new Error("AI services are currently busy. Please try again in a moment.");
}

function extractAndParseJson<T = any>(raw: string): T {
  if (!raw || typeof raw !== "string") {
    throw new Error("Empty AI response received");
  }

  const text = raw.trim();

  // 1. Try direct parsing
  try {
    return JSON.parse(text);
  } catch {
    // Continue with cleaning heuristics
  }

  // 2. Check for markdown code fence contents: ```json ... ``` or ``` ... ```
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    const blockContent = codeBlockMatch[1].trim();
    try {
      return JSON.parse(blockContent);
    } catch {
      // If direct parse of code block fails, extract outer braces from block
      const candidate = extractOutermostJson(blockContent);
      if (candidate) {
        try {
          return JSON.parse(candidate);
        } catch {
          // Continue to global extraction
        }
      }
    }
  }

  // 3. Find outermost JSON Object '{...}' or Array '[...]' in raw text
  const extracted = extractOutermostJson(text);
  if (extracted) {
    try {
      return JSON.parse(extracted);
    } catch (parseErr: any) {
      // 4. Try lenient fixes (remove trailing commas before closing braces/brackets)
      try {
        const cleanedCommas = extracted
          .replace(/,\s*([}\]])/g, "$1")
          .replace(/[\u201C\u201D]/g, '"'); // Replace smart quotes if present
        return JSON.parse(cleanedCommas);
      } catch {
        throw new Error(`JSON parse error: ${parseErr.message}`);
      }
    }
  }

  throw new Error("Could not extract valid JSON from the AI response");
}

function extractOutermostJson(str: string): string | null {
  const firstBrace = str.indexOf("{");
  const firstBracket = str.indexOf("[");

  let startIdx = -1;
  let endIdx = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    endIdx = str.lastIndexOf("}");
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    endIdx = str.lastIndexOf("]");
  }

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    return str.substring(startIdx, endIdx + 1);
  }
  return null;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

function detectServerTopicCategory(topic: string) {
  const t = (topic || "").toLowerCase();
  if (/(cricket|ipl|virat|rohit|dhoni|football|messi|ronaldo|match|score|sports|kabaddi|badminton|olympic|tennis|stadium|pitch|wicket)/i.test(t)) {
    return { category: "sports", icon: "🏏", hook: "MATCH ALERT", tag: "#Cricket #SportsUpdate", focus: "cricket & sports analysis" };
  }
  if (/(biryani|recipe|cooking|food|paneer|chai|sweet|cake|kitchen|chef|breakfast|dinner|snack|tasty|swad|dish|street food|restaurant|masala)/i.test(t)) {
    return { category: "food", icon: "🍲", hook: "TASTY SECRET", tag: "#CookingHacks #FoodLovers", focus: "delicious culinary recipe secrets" };
  }
  if (/(gym|workout|fitness|weight loss|fat loss|muscle|bicep|chest|yoga|exercise|diet|abs|calorie|bodybuilding|belly|running)/i.test(t)) {
    return { category: "fitness", icon: "💪", hook: "FITNESS HACK", tag: "#FitnessMotivation #Workout", focus: "proven muscle and fat loss training" };
  }
  if (/(ai|chatgpt|gemini|coding|python|software|tech|phone|iphone|android|laptop|gadget|robot|app|programming|computer|developer|hack|web)/i.test(t)) {
    return { category: "tech", icon: "🤖", hook: "TECH SECRET", tag: "#TechNews #AISecrets", focus: "cutting-edge technology and AI automation" };
  }
  if (/(game|gaming|gta|pubg|free fire|bgmi|minecraft|playstation|xbox|esports|streamer)/i.test(t)) {
    return { category: "gaming", icon: "🎮", hook: "GAMING ALERT", tag: "#GamingCommunity #Gamer", focus: "epic gaming gameplay and clutch moments" };
  }
  if (/(earn|money|paisa|kamai|crypto|bitcoin|stock|share market|trading|nifty|business|dropshipping|affiliate|passive income|wealth|crore|lakh|rupee|invest|fund|rupees)/i.test(t)) {
    return { category: "finance", icon: "💰", hook: "MONEY TRICK", tag: "#OnlineEarning #MoneySecrets", focus: "practical income growth and monetization" };
  }
  if (/(study|exam|upsc|ssc|iit|neet|history|facts|gk|quiz|student|knowledge|science|space|universe|english|learn|book|math|physics)/i.test(t)) {
    return { category: "education", icon: "🧠", hook: "SHOCKING FACT", tag: "#GKFacts #DailyKnowledge", focus: "mind-blowing facts and exam preparation" };
  }
  if (/(motivation|success|mindset|quote|discipline|habit|inspire|life advice|sad|emotion|heartbreak|struggle|darr|himmat)/i.test(t)) {
    return { category: "motivation", icon: "🔥", hook: "LIFE LESSON", tag: "#Motivation #SuccessMindset", focus: "unbreakable discipline and winning mindset" };
  }
  return { category: "general", icon: "⚡", hook: "VIRAL SECRET", tag: "#ViralShorts #Trending", focus: "viral trending insights" };
}

function createFallbackContentPackage(topic: string, contentType: string, language: string) {
  const isHindi = language === "Hindi" || language === "Hinglish";
  const cleanTopic = (topic || "AI Shorts").trim();
  const cat = detectServerTopicCategory(cleanTopic);

  const titles = isHindi
    ? [
        `🔥 ${cat.icon} ${cleanTopic}: 3 सबसे बड़े सीक्रेट्स जो 99% लोग नहीं जानते!`,
        `${cat.icon} सिर्फ 60 सेकंड में जानें ${cleanTopic} का पूरा सच 🚀`,
        `क्या आप जानते हैं? ${cleanTopic} से जुड़ी यह बात आपको हैरान कर देगी!`,
      ]
    : [
        `🔥 ${cat.icon} 3 Insane Secrets About ${cleanTopic} Nobody Tells You!`,
        `${cat.icon} The Complete 60-Second Breakdown of ${cleanTopic} 🚀`,
        `Did You Know This Hidden Truth About ${cleanTopic}?`,
      ];

  const script = isHindi
    ? `[Hook / हुक (0-5s)]
रुको! अगर आप ${cleanTopic} के बारे में गंभीर हैं, तो इस 1 सीक्रेट को कभी मिस मत करना!

[Visual / विज़ुअल डायरेक्शन]
${cat.icon} कैमरे की तरफ ज़ूम-इन करें, बैकग्राउंड में ${cleanTopic} से जुड़े हाई-इम्पैक्ट विज़ुअल्स और डायनामिक टेक्स्ट ओवरले दिखाएं।

[Point 1 / मुख्य बात 1]
सबसे पहले: ${cleanTopic} में सफल होने के लिए बेसिक नियमों को समझें और सही टूल्स का इस्तेमाल करें।

[Point 2 / मुख्य बात 2]
दूसरा सीक्रेट: निरंतरता और सटीक तकनीक ही आपको 99% लोगों से आगे ले जाएगी।

[Point 3 / मुख्य बात 3]
तीसरा सबसे बड़ा फ़ायदा: जब आप इस फॉर्मूले को लागू करेंगे, तो नतीजे देखकर हर कोई हैरान रह जाएगा!

[Call to Action / कॉल टू एक्शन]
अगर आपको यह जानकारी पसंद आई, तो अभी लाइक करें, सेव करें और फॉलो करना न भूलें!`
    : `[Hook (0-5s)]
Wait! If you care about ${cleanTopic}, do NOT scroll past this 60-second secret!

[Visual Direction]
High-energy camera zoom, fast cut transitions highlighting ${cleanTopic} with cinematic overlays.

[Point 1: Key Foundation]
First, master the core fundamental behind ${cleanTopic} that most beginners completely overlook.

[Point 2: The Breakthrough]
Second, apply the targeted formula to multiply your efficiency and get instant results.

[Point 3: The Result]
Third, watch your consistency unlock rapid growth and unfair advantages!

[Call to Action]
Save this video right now and follow for Part 2!`;

  const description = isHindi
    ? `${cat.icon} ${cleanTopic} के बारे में संपूर्ण गाइड और सीक्रेट टिप्स। इसे अभी देखें और अपने दोस्तों के साथ शेयर करें! ${cat.tag}`
    : `${cat.icon} The ultimate breakdown of ${cleanTopic}. Actionable insights you can apply right away! ${cat.tag}`;

  const hashtags = [
    `#${cleanTopic.replace(/\s+/g, "")}`,
    cat.tag.split(" ")[0] || "#Viral",
    "#TrendingShorts",
    "#ViralVideo",
    "#ExplorePage",
    "#MustWatch",
    "#YouTubeShorts",
    "#InstaReels",
  ];

  const thumbnailPrompt = `Cinematic 9:16 vertical poster about '${cleanTopic}', dynamic center focal point, bold neon and volumetric studio rim lighting, vivid contrasting colors, ultra high definition 8k resolution, octane render.`;

  return {
    contentType,
    topic: cleanTopic,
    language,
    titles,
    script,
    description,
    hashtags,
    thumbnailPrompt,
    timestamp: new Date().toISOString(),
  };
}

function createFallbackAssistantAnswer(message: string, contextPlan?: any): string {
  const msgLower = (message || "").toLowerCase();
  
  if (msgLower.includes("start") || msgLower.includes("शुरू") || msgLower.includes("कहाँ से")) {
    return `नमस्ते! AI से कमाई शुरू करने के लिए यहाँ सबसे व्यावहारिक 3 कदम दिए गए हैं:

1. **एक स्पष्ट Niche चुनें**: AI Content Creation (YouTube/Reels), AI Freelance Copywriting, या Local Business AI Chatbots में से एक चुनें।
2. **फ्री AI टूल्स सीखें**: Gemini (रिसर्च व स्क्रिप्ट्स), Bing Image Creator (फ्री 9:16 विज़ुअल्स), और CapCut (वीडियो एडिटिंग)।
3. **पोर्टफोलियो बनाएं**: पहले 3-5 बेहतरीन सैंपल्स तैयार करें और सोशल मीडिया / Fiverr पर पोस्ट करना शुरू करें।

आप किस फील्ड में सबसे ज्यादा रुचि रखते हैं? मैं आपको उसी के अनुसार स्टेप्स बता दूंगा!`;
  }

  if (msgLower.includes("tool") || msgLower.includes("टूल") || msgLower.includes("free")) {
    return `2026 में कमाई के लिए टॉप 4 बिल्कुल फ्री AI टूल्स:

1. **Google Gemini**: स्क्रिप्ट राइटिंग, ब्लॉग आर्टिकल्स, रिसर्च और बिज़नेस प्लानिंग के लिए।
2. **Bing Image Creator (DALL-E 3)**: बिना किसी शुल्क के अल्ट्रा-एचडी 9:16 विज़ुअल्स और थंबनेल बनाने के लिए।
3. **CapCut / VN Editor**: ऑटो-कैप्शन और 60fps वीडियो एडिटिंग के लिए।
4. **Notion & Gumroad**: अपने डिजिटल प्रोडक्ट्स और गाइड फ्री में स्टोर व सेल करने के लिए।

क्या आप इनमें से किसी टूल का रेडी-टू-यूज़ प्रॉम्प्ट चाहते हैं?`;
  }

  return `शानदार सवाल! AI की मदद से आप अपने काम की गति को 10x बढ़ा सकते हैं।

- **स्ट्रेटेजी**: पहले हफ्ते में स्किल और मास्टर प्रॉम्प्ट्स पर ध्यान दें।
- **कंटेंट इंजन**: रोज़ाना 1-2 शॉर्ट-फॉर्म कंटेंट बनाकर ऑडियंस और ट्रस्ट बनाएं।
- **मोनेटाइजेशन**: जैसे ही 1,000 फॉलोअर्स या 5 पोर्टफोलियो पीसेस तैयार हों, फ्रीलांस सर्विसेज या एफिलिएट लिंक शुरू करें।

अगर आप चाहें, तो ऊपर दिए गए **AI Content Generator** या **FREE AI Video Maker** से तुरंत अपने लिए वायरल वीडियो स्क्रिप्ट और स्टोरीबोर्ड तैयार कर सकते हैं!`;
}

function createFallbackIdeas(category?: string, excludeTitles: string[] = []): any[] {
  return [
    {
      id: "ai-shorts-agency-" + Date.now(),
      title: "AI Faceless YouTube Shorts & Reels चैनल",
      tagline: "बिना चेहरा दिखाए AI से वायरल वीडियो बनाकर AdSense और Sponsorship कमाएं",
      category: "Content",
      earningPotential: "₹30,000 - ₹1,00,000 / महीना",
      timeToFirstRupee: "15 - 30 दिन",
      difficulty: "Easy",
      investmentRequired: "₹0 (बिल्कुल फ्री)",
      description: "Gemini से वायरल फैक्ट्स व मोटिवेशन स्क्रिप्ट्स बनाएं, Bing AI से 9:16 विज़ुअल्स लें और CapCut में ऑटो-कैप्शन लगाकर यूट्यूब शॉर्ट्स पर डालें।",
      toolsNeeded: ["Google Gemini", "Bing Image Creator", "CapCut", "YouTube Studio"],
      keySteps: [
        "हाई-सीटीआर Niche (साइकोलॉजी, मनी टिप्स, AI फैक्ट्स) चुनें",
        "Gemini से 30 दिनों की शॉर्ट्स स्क्रिप्ट्स जनरेट करें",
        "Bing AI से विज़ुअल्स बनाकर CapCut में एडिट करें",
        "प्रतिदिन 2 वीडियो शेड्यूल करें और एफिलिएट लिंक्स जोड़ें",
      ],
      starterPrompt: "Give me 5 viral 45-second YouTube Shorts script ideas on psychological facts with visual cues and Hindi voiceover.",
      googleTasks: [
        { title: "Niche रिसर्च व यूट्यूब चैनल सेटअप", notes: "चैनल का नाम, लोगो और बैनर Canva से बनाएं", dayOffset: 1 },
        { title: "पहले 5 शॉर्ट्स वीडियो का प्रोडक्शन", notes: "Gemini + Bing AI + CapCut से 5 वीडियो तैयार करें", dayOffset: 2 },
        { title: "पहला वीडियो पब्लिश व SEO टैग्स", notes: "टाइटल, डिस्क्रिप्शन और वायरल हैशटैग्स जोड़कर पब्लिश करें", dayOffset: 3 },
      ],
    },
    {
      id: "ai-copywriting-freelance-" + Date.now(),
      title: "AI कॉपीराइटिंग व सोशल मीडिया कंटेंट सर्विस",
      tagline: "लोकल और ग्लोबल ब्रांड्स के लिए AI से हाई-कन्वर्टिंग ऐड कॉपी और ईमेल लिखें",
      category: "Freelance",
      earningPotential: "₹25,000 - ₹80,000 / महीना",
      timeToFirstRupee: "7 - 14 दिन",
      difficulty: "Easy",
      investmentRequired: "₹0",
      description: "Fiverr, Upwork और LinkedIn पर छोटे बिजनेसेज के लिए ईमेल न्यूजलेटर्स, फेसबुक ऐड्स और ब्लॉग पोस्ट्स लिखकर प्रति प्रोजेक्ट ₹2,000-₹10,000 कमाएं।",
      toolsNeeded: ["Gemini", "Grammarly", "LinkedIn", "Canva"],
      keySteps: [
        "3 अलग-अलग इंडस्ट्रीज के लिए सैंपल ऐड कॉपीज का पोर्टफोलियो बनाएं",
        "LinkedIn और Fiverr पर 'AI Content Specialist' प्रोफाइल बनाएं",
        "रोजाना 10 संभावित बिजनेस ओनर्स को पर्सनलाइज्ड सैंपल भेजें",
        "क्लाइंट्स को मंथली कंटेंट पैकेज ऑफर करें",
      ],
      starterPrompt: "Write 3 high-converting Facebook ad copy variations for an online fitness coaching program with emotional hook and CTA.",
      googleTasks: [
        { title: "3 सैंपल ऐड कॉपीज का पोर्टफोलियो बनाएं", notes: "ई-कॉमर्स, रियल एस्टेट और फिटनेस के लिए", dayOffset: 1 },
        { title: "Fiverr व LinkedIn प्रोफाइल ऑप्टिमाइजेशन", notes: "कीवर्ड्स और पोर्टफोलियो लिंक जोड़ें", dayOffset: 2 },
        { title: "10 कोल्ड पिचेस भेजना", notes: "ईमेल और सोशल मीडिया पर पर्सनलाइज्ड सैंपल पिच करें", dayOffset: 4 },
      ],
    },
    {
      id: "ai-prompt-store-" + Date.now(),
      title: "AI प्रॉम्प्ट्स व Notion टेम्पलेट्स का डिजिटल स्टोर",
      tagline: "Gumroad और Instamojo पर पैसिव इनकम वाला डिजिटल प्रोडक्ट स्टोर बनाएं",
      category: "Digital Products",
      earningPotential: "₹20,000 - ₹60,000 / महीना",
      timeToFirstRupee: "10 - 20 दिन",
      difficulty: "Medium",
      investmentRequired: "₹0",
      description: "मार्केटर्स, छात्रों या क्रिएटर्स के लिए 100+ टेस्टेड Gemini/ChatGPT प्रॉम्प्ट्स की ई-बुक या Notion वर्कस्पेस बनाएं और 100% प्रॉफिट मार्जिन पर बेचें।",
      toolsNeeded: ["Google Gemini", "Notion", "Gumroad / Instamojo", "Canva"],
      keySteps: [
        "100 हाई-वैल्यू प्रॉम्प्ट्स का कलेक्शन तैयार करें",
        "Canva पर 3D बुक कवर और मॉकअप बनाएं",
        "Gumroad या Instamojo पर फ्री में स्टोर लिस्ट करें",
        "Instagram रील्स और Twitter थ्रेड्स से फ्री ऑर्गेनिक ट्रैफिक लाएं",
      ],
      starterPrompt: "Create a structured curriculum of 50 powerful marketing prompts for small business owners with examples.",
      googleTasks: [
        { title: "50 प्रॉम्प्ट्स की लिस्ट तैयार करना", notes: "Gemini से टेस्ट करके हाई-क्वालिटी प्रॉम्प्ट्स सेव करें", dayOffset: 1 },
        { title: "Gumroad स्टोर और Canva कवर डिजाइन", notes: "3D मॉकअप बनाएं और पेमेंट गेटवे कनेक्ट करें", dayOffset: 3 },
        { title: "सोशल मीडिया पर फ्री सैंपल बांटकर लॉन्च करना", notes: "ट्रैफिक लाने के लिए फ्री 10 प्रॉम्प्ट्स का टीज़र पोस्ट करें", dayOffset: 5 },
      ],
    },
  ];
}

function createFallbackCustomPlan(params: {
  niche?: string;
  dailyTime?: string;
  budget?: string;
  skillLevel?: string;
  earningGoal?: string;
}) {
  const { niche, dailyTime, budget, earningGoal } = params;
  return {
    title: `30-दिन का ${niche || "AI"} कमाई मास्टर प्लान`,
    subtitle: `${dailyTime || "2 घंटे/दिन"} और ${budget || "₹0 बजट"} के साथ शुरुआत`,
    overview: `यह 30-दिन का प्रैक्टिकल रोडमैप विशेष रूप से आपके उपलब्ध समय (${dailyTime || "2 घंटे"}) और बजट (${budget || "₹0"}) को ध्यान में रखकर तैयार किया गया है। इसमें स्पष्ट दैनिक कार्य हैं ताकि आप बिना रुके पहले दिन से काम शुरू कर सकें।`,
    targetEarning: {
      month1: earningGoal ? `₹${(parseInt(earningGoal.replace(/\D/g, '')) * 0.25 || 15000).toLocaleString('en-IN')}` : "₹15,000 - ₹30,000",
      month3: earningGoal ? `₹${(parseInt(earningGoal.replace(/\D/g, '')) * 0.75 || 50000).toLocaleString('en-IN')}` : "₹50,000 - ₹90,000",
      month6: earningGoal ? `₹${(parseInt(earningGoal.replace(/\D/g, '')) * 1.5 || 150000).toLocaleString('en-IN')}` : "₹1,50,000+",
    },
    keyPrerequisites: [
      "स्मार्टफोन या कंप्यूटर और सक्रिय इंटरनेट कनेक्शन",
      "प्रतिदिन 1-2 घंटे का अनुशासित समय",
      "सीखने और लगातार 30 दिन क्रियान्वित करने का संकल्प",
    ],
    recommendedTools: [
      { name: "Google Gemini", purpose: "रिसर्च, स्क्रिप्ट्स और बिज़नेस प्लानिंग", isFree: true, linkSuggestion: "https://gemini.google.com" },
      { name: "Bing Image Creator", purpose: "फ्री 9:16 विज़ुअल्स और थंबनेल निर्माण", isFree: true, linkSuggestion: "https://bing.com/create" },
      { name: "CapCut / VN Editor", purpose: "ऑटो-कैप्शन और 60fps वीडियो एडिटिंग", isFree: true, linkSuggestion: "https://capcut.com" },
      { name: "Canva Free", purpose: "सोशल मीडिया पोस्ट्स और 3D कवर मॉकअप्स", isFree: true, linkSuggestion: "https://canva.com" },
    ],
    roadmap: [
      {
        phase: "Day 1-7: Foundation & Setup",
        goals: ["Niche रिसर्च पूरा करना", "फ्री AI टूल्स सेटअप", "3 मास्टर प्रॉम्प्ट्स तैयार करना"],
        actionSteps: ["मार्केट ट्रेंड्स देखें", "सभी फ्री AI अकाउंट्स बनाएं", "पहला सैंपल प्रोजेक्ट तैयार करें"],
      },
      {
        phase: "Day 8-15: Content Engine & Portfolio",
        goals: ["5 हाई-क्वालिटी सैंपल्स बनाना", "पब्लिक प्रोफाइल लाइव करना"],
        actionSteps: ["कंटेंट प्रोडक्शन शुरू करें", "सोशल मीडिया पर शेड्यूल करें", "फीडबैक लेकर सुधारें"],
      },
      {
        phase: "Day 16-23: Outreach & Client Acquisition",
        goals: ["25+ संभावित क्लाइंट्स से संपर्क", "ऑर्गेनिक रीच बढ़ाना"],
        actionSteps: ["कोल्ड पिचेस भेजें", "फ्रीलांस प्लेटफॉर्म्स पर गिग्स लिस्ट करें", "फॉलो-अप करें"],
      },
      {
        phase: "Day 24-30: First Revenue & Scaling",
        goals: ["पहली पेड डील या स्पॉन्सरशिप क्लोज करना", "अगले महीने का ऑटोमेशन प्लान"],
        actionSteps: ["रिव्यूज और टेस्टीमोनियल्स इकट्ठा करें", "मंथली पैकेज ऑफर करें", "कमाई को री-इन्वेस्ट करें"],
      },
    ],
    googleTasks: [
      { title: "Day 1: Niche और 3 सब-टॉपिक्स का चयन", notes: "ट्रेंडिंग मार्केट्स का विश्लेषण करें", dayOffset: 1 },
      { title: "Day 2: AI टूल्स अकाउंट्स सेटअप", notes: "Gemini, Bing AI और Canva पर फ्री अकाउंट बनाएं", dayOffset: 2 },
      { title: "Day 4: पहला सैंपल आउटपुट तैयार करना", notes: "AI से पहला पूरा प्रोजेक्ट बनाकर रिव्यू करें", dayOffset: 4 },
      { title: "Day 8: पोर्टफोलियो शोकेस तैयार करना", notes: "अपने 3 सबसे अच्छे काम Notion में सेव करें", dayOffset: 8 },
      { title: "Day 15: सोशल प्रोफाइल या सर्विस गिग लाइव करना", notes: "Fiverr, Instagram या YouTube पर पब्लिश करें", dayOffset: 15 },
      { title: "Day 22: 10 संभावित क्लाइंट्स को पिच भेजना", notes: "पर्सनलाइज्ड सैंपल के साथ ईमेल भेजें", dayOffset: 22 },
      { title: "Day 30: महीने का रीकैप व स्केल प्लान", notes: "एनालिटिक्स रिव्यू करें और नए लक्ष्य तय करें", dayOffset: 30 },
    ],
    monetizationChannels: [
      "YouTube Shorts & Reels Ad Revenue / Creator Fund",
      "Direct Brand Sponsorships & Collaborations",
      "Fiverr / Upwork Freelance Projects",
      "Digital Products & Prompt Packs on Gumroad",
    ],
    promptsToGetStarted: [
      {
        label: "Viral Script Prompt",
        promptText: `Act as a top-tier viral short-form video creator. Give me 3 high-retention script concepts for ${niche || "AI Money Making"} with hook, 3 points, and CTA.`,
      },
      {
        label: "Client Pitch Prompt",
        promptText: `Write a friendly, high-converting cold message offering short-form video editing and AI content management to a local business owner.`,
      },
    ],
    commonPitfallsToAvoid: [
      "बिना एडिट किए सीधे रॉ AI आउटपुट पब्लिश करना (हमेशा ह्यूमन टच और फैक्ट चेक जोड़ें)",
      "पहले हफ्ते में ही नतीजे न मिलने पर रुक जाना (कम से कम 30 दिन लगातार काम करें)",
      "बहुत सारे टूल्स पर एक साथ भटकना (2-3 मुख्य टूल्स में महारत हासिल करें)",
    ],
    proTips: [
      "शुरुआत में हर वीडियो या सर्विस में एक फ्री बोनस ऑफर करें जिससे लोग तुरंत आकर्षित हों।",
      "कंसिस्टेंसी सबसे बड़ा गेम-चेंजर है; हर दिन निर्धारित समय पर ही काम करें।",
    ],
  };
}

// AI Monetization Custom Roadmap Generator
app.post("/api/ai/custom-plan", async (req, res) => {
  const { skillLevel, dailyTime, budget, niche, earningGoal, language = "hindi" } = req.body || {};

  try {
    const prompt = `
You are a top-tier digital business coach and AI monetization strategist.
Generate an in-depth, realistic, actionable, and structured blueprint to make money using AI tools based on these user parameters:
- User Skill Level: ${skillLevel || "Beginner"}
- Available Daily Time: ${dailyTime || "2 hours/day"}
- Starting Budget: ${budget || "₹0 (Free tools only)"}
- Target Niche / Interest: ${niche || "Content Creation / Freelancing / Digital Products"}
- Language: ${language === "hindi" ? "Hindi (हिंदी + Hinglish mix with clear terminology)" : "English"}

Return ONLY a valid JSON object without markdown fences matching this schema:
{
  "title": "Clear catchy title in chosen language",
  "subtitle": "Short 1-line hook",
  "overview": "Comprehensive 2-3 paragraph summary of how this earning system works",
  "potentialEarnings": {
    "month1": "Realistic range (e.g. ₹5,000 - ₹15,000 / $100 - $300)",
    "month3": "Realistic range (e.g. ₹30,000 - ₹75,000 / $500 - $1,000)",
    "month6": "Realistic range (e.g. ₹1,00,000+ / $1,500+)"
  },
  "difficulty": "Beginner | Intermediate | Advanced",
  "recommendedTools": [
    {
      "name": "Tool Name (e.g. ChatGPT, Canva AI, ElevenLabs, Midjourney)",
      "purpose": "What to use it for",
      "isFree": true,
      "linkSuggestion": "https://..."
    }
  ],
  "roadmap": [
    {
      "phase": "Day 1-7: Foundation & Skill Mastery",
      "goals": ["Goal 1", "Goal 2"],
      "actionSteps": ["Step 1", "Step 2", "Step 3"]
    },
    {
      "phase": "Day 8-15: Portfolio & Initial Setup",
      "goals": ["Goal 1", "Goal 2"],
      "actionSteps": ["Step 1", "Step 2", "Step 3"]
    },
    {
      "phase": "Day 16-23: Client Acquisition / Audience Building",
      "goals": ["Goal 1", "Goal 2"],
      "actionSteps": ["Step 1", "Step 2", "Step 3"]
    },
    {
      "phase": "Day 24-30: First Revenue & Scaling Loop",
      "goals": ["Goal 1", "Goal 2"],
      "actionSteps": ["Step 1", "Step 2", "Step 3"]
    }
  ],
  "googleTasks": [
    {
      "title": "Actionable task title",
      "notes": "Detailed instructions on how to do this step and tools needed",
      "dayOffset": 1
    }
  ],
  "monetizationChannels": [
    "Channel 1 (e.g. Upwork/Fiverr)",
    "Channel 2 (e.g. Direct Instagram DMs)",
    "Channel 3 (e.g. Gumroad/Instamojo)"
  ],
  "promptsToGetStarted": [
    {
      "label": "Prompt title (e.g. Cold Email Pitch for Clients)",
      "promptText": "Exact copy-paste prompt to use in Gemini/ChatGPT"
    },
    {
      "label": "Prompt title (e.g. Content Script Generator)",
      "promptText": "Exact copy-paste prompt"
    }
  ],
  "commonPitfallsToAvoid": [
    "Mistake 1",
    "Mistake 2"
  ],
  "proTips": [
    "Pro tip 1",
    "Pro tip 2"
  ]
}
`;

    const rawText = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = extractAndParseJson(rawText);
    res.json({ success: true, plan: parsed });
  } catch (error: any) {
    console.warn("Error generating custom plan, using resilient fallback:", error?.message || error);
    const fallbackPlan = createFallbackCustomPlan({
      niche,
      dailyTime,
      budget,
      skillLevel,
      earningGoal,
    });
    res.json({ success: true, plan: fallbackPlan });
  }
});

// Dynamic "Tell me another way to make money with AI" (तरीका बताते रहो)
app.post("/api/ai/generate-ideas", async (req, res) => {
  const { category, excludeTitles = [], language = "hindi" } = req.body || {};

  try {
    const prompt = `
You are an expert AI business educator.
Provide 3 fresh, unique, practical, and highly lucrative methods to make money using AI in 2026.
Category focus: ${category || "Any / High Growth"}.
Do not repeat these existing titles: ${excludeTitles.slice(0, 10).join(", ")}.
Language: ${language === "hindi" ? "Hindi (हिंदी + Hinglish mix with clear terminology)" : "English"}.

Return ONLY a valid JSON array of objects without markdown code fences:
[
  {
    "id": "unique-slug-id",
    "title": "Method Title",
    "tagline": "Catchy 1-line summary",
    "category": "Content | Freelance | SaaS | Digital Products | Automation | Agency",
    "earningPotential": "e.g. ₹25,000 - ₹80,000 / month",
    "timeToFirstRupee": "e.g. 7 - 14 Days",
    "difficulty": "Easy | Medium | Hard",
    "investmentRequired": "₹0 or Low",
    "description": "2-3 sentences explaining exactly how money is made",
    "toolsNeeded": ["Tool1", "Tool2", "Tool3"],
    "keySteps": ["Step 1", "Step 2", "Step 3", "Step 4"],
    "starterPrompt": "A ready to use copy-paste prompt",
    "googleTasks": [
      {
        "title": "Task 1",
        "notes": "Task 1 details",
        "dayOffset": 1
      }
    ]
  }
]
`;

    const rawText = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = extractAndParseJson(rawText);
    const validArray = Array.isArray(parsed) && parsed.length > 0 ? parsed : createFallbackIdeas(category, excludeTitles);
    res.json({ success: true, ideas: validArray });
  } catch (error: any) {
    console.warn("Generating ideas falling back to resilient generator:", error?.message || error);
    const fallback = createFallbackIdeas(category, excludeTitles);
    res.json({ success: true, ideas: fallback });
  }
});

// Interactive AI Business Assistant Chat
app.post("/api/ai/ask-assistant", async (req, res) => {
  const { message, contextPlan, conversationHistory = [] } = req.body || {};

  try {
    const systemInstruction = `
You are an expert AI Monetization Coach called 'AI Kamai Guru' (AI कमाई गुरु).
Your mission is to help people generate genuine, ethical, and scalable income using modern AI tools (Gemini, ChatGPT, Midjourney, ElevenLabs, Claude, No-code automation, etc.).
Keep answers clear, enthusiastic, structured with bullet points, practical, and in Hindi/Hinglish (or English if the user asks).
If relevant, offer specific prompts, exact websites, platforms (Fiverr, Upwork, YouTube, Gumroad, Etsy, Instamojo), and step-by-step guidance.
`;

    const contents = [
      ...conversationHistory.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
      {
        role: "user",
        parts: [
          {
            text: contextPlan
              ? `Context of current plan: ${JSON.stringify(contextPlan)}\n\nUser Question: ${message}`
              : message,
          },
        ],
      },
    ];

    const reply = await generateContentWithFallback({
      contents,
      systemInstruction,
    });

    res.json({ success: true, reply });
  } catch (error: any) {
    console.warn("Ask assistant falling back to resilient generator:", error?.message || error);
    const fallbackReply = createFallbackAssistantAnswer(message, contextPlan);
    res.json({ success: true, reply: fallbackReply });
  }
});

// AI Content Generator Endpoint (YouTube Video, Shorts, Reels, FB Post, Blog Post)
app.post("/api/ai/generate-content", async (req, res) => {
  const { contentType = "YouTube Shorts", topic, language = "Hindi" } = req.body || {};

  if (!topic || typeof topic !== "string" || !topic.trim()) {
    return res.status(400).json({ success: false, error: "कृपया एक विषय (Topic) दर्ज करें।" });
  }

  try {
    const languageInstruction =
      language === "Hindi"
        ? "Hindi (हिंदी भाषा में स्पष्ट और आकर्षक शैली)"
        : language === "Hinglish"
        ? "Hinglish (रोमन लिपि में सहज हिंदी + अंग्रेजी का आधुनिक मिश्रण, जैसे सोशल मीडिया क्रिएटर्स बोलते हैं)"
        : "English (engaging, modern, high-retention English)";

    const prompt = `
You are a viral social media content creator, copywriter, and digital marketing expert.
Create a complete, high-converting content package for:
- Content Type: "${contentType}"
- Topic: "${topic.trim()}"
- Language: ${languageInstruction}

Return ONLY a valid JSON object matching this exact schema:
{
  "titles": [
    "Catchy, high-CTR viral title 1 with strong curiosity/benefit hook",
    "Catchy, high-CTR viral title 2 with number/power words",
    "Catchy, high-CTR viral title 3 with question/intrigue"
  ],
  "script": "Complete, ready-to-use script or content. For video/shorts/reel include [Hook], [Visual/Camera direction], [Body points], [Call to Action]. For blog post, include structured sections with headings. For Facebook post, include engaging storytelling hook, value bullet points, and CTA.",
  "description": "Engaging 2-4 line video/post description optimized for search algorithms and social reach with key takeaways.",
  "hashtags": [
    "#hashtag1",
    "#hashtag2",
    "#hashtag3",
    "#hashtag4",
    "#hashtag5",
    "#hashtag6",
    "#hashtag7",
    "#hashtag8"
  ],
  "thumbnailPrompt": "Ultra detailed, vivid visual prompt to generate the ideal thumbnail, banner, or creative visual in Midjourney / Leonardo / DALL-E (in English)."
}
`;

    const rawText = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = extractAndParseJson(rawText);

    // Ensure hashtags is an array
    let hashtagsList: string[] = [];
    if (Array.isArray(parsed.hashtags)) {
      hashtagsList = parsed.hashtags.map((h: any) => (typeof h === "string" ? (h.startsWith("#") ? h : `#${h}`) : ""));
    } else if (typeof parsed.hashtags === "string") {
      hashtagsList = parsed.hashtags.split(/\s+/).filter((h: string) => h.startsWith("#"));
    }

    res.json({
      success: true,
      data: {
        contentType,
        topic: topic.trim(),
        language,
        titles: Array.isArray(parsed.titles) ? parsed.titles : ["Viral Title 1", "Viral Title 2", "Viral Title 3"],
        script: parsed.script || "Content script generated successfully.",
        description: parsed.description || "",
        hashtags: hashtagsList.filter(Boolean),
        thumbnailPrompt: parsed.thumbnailPrompt || "",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.warn("Content generation falling back to resilient generator:", error?.message || error);
    const fallbackPackage = createFallbackContentPackage(topic, contentType, language);
    res.json({
      success: true,
      data: fallbackPackage,
    });
  }
});

function createFallbackVideoBlueprint(params: {
  topic: string;
  selectedTitle: string;
  script?: string;
  thumbnailPrompt?: string;
  preferredLanguage?: string;
}) {
  const { topic, selectedTitle, script, thumbnailPrompt, preferredLanguage = "Hinglish" } = params;
  const cleanTopic = (topic || selectedTitle || "AI Viral Shorts").trim();
  const cat = detectServerTopicCategory(cleanTopic);
  const isHindi =
    preferredLanguage.toLowerCase().includes("hindi") ||
    preferredLanguage.toLowerCase().includes("hinglish");

  const bgMusicMap: Record<string, { genre: string; mood: string; tempo: string; keywords: string }> = {
    sports: {
      genre: "High-Energy Stadium Anthem Beats",
      mood: "Electric, punchy, and fast-paced",
      tempo: "128 BPM",
      keywords: "sports stadium energetic upbeat brass hype beat",
    },
    food: {
      genre: "Warm Acoustic & Chill Lo-Fi Beats",
      mood: "Appetizing, friendly, and joyful",
      tempo: "110 BPM",
      keywords: "culinary cooking warm chill upbeat acoustic lo-fi",
    },
    fitness: {
      genre: "High-BPM Workout Trap & Phonk",
      mood: "Aggressive, motivating, and adrenaline-pumping",
      tempo: "140 BPM",
      keywords: "gym workout motivation phonk energetic bass",
    },
    tech: {
      genre: "Cyberpunk Synthwave & Modern Electronic",
      mood: "Futuristic, sleek, and high-tech",
      tempo: "122 BPM",
      keywords: "cyber synthwave technology electronic futuristic beat",
    },
    gaming: {
      genre: "Electro Gaming Chiptune & Trap Beat",
      mood: "Competitive, fast, and exciting",
      tempo: "135 BPM",
      keywords: "gaming trap electro hype fast gameplay music",
    },
    finance: {
      genre: "Energetic Lo-Fi Synth & Luxury Trap",
      mood: "Curious, exciting, and aspirational",
      tempo: "124 BPM",
      keywords: "luxury lo-fi synth upbeat inspiration background music",
    },
    education: {
      genre: "Curious Ambient Cosmic & Lo-Fi Study",
      mood: "Intriguing, focused, and thought-provoking",
      tempo: "115 BPM",
      keywords: "documentary curious mystery ambient study beat",
    },
    motivation: {
      genre: "Cinematic Orchestral Riser & Piano Beat",
      mood: "Deeply emotional, inspiring, and triumphant",
      tempo: "118 BPM",
      keywords: "epic cinematic motivation piano emotional drums",
    },
  };

  const bgMusic = bgMusicMap[cat.category] || {
    genre: "Energetic Lo-Fi Synth Beats",
    mood: "Curious, exciting, and fast-paced",
    tempo: "124 BPM",
    keywords: "upbeat inspiration energetic free background music",
  };

  return {
    videoTitle: selectedTitle || `${cat.icon} ${cleanTopic} वायरल सीक्रेट`,
    targetDuration: "45-60 Seconds",
    aspectRatio: "9:16 (Vertical Short/Reel)",
    resolution: "1080 × 1920 (Full HD)",
    captionStyle: "Bold Neon Yellow & White with Black Stroke / Drop Shadow (1-3 words per burst)",
    hookStrategy: "Curiosity gap + visual zoom in first 2-3 seconds to lock retention",
    videoSettings: {
      aspectRatio: "9:16",
      resolution: "1080 × 1920",
      recommendedDuration: "45 – 60 Seconds",
      captionStyle: "Bold Neon Yellow & White with Drop Shadow (1-3 words/frame)",
      hookInFirstSeconds: "Curiosity Hook in first 2–3 seconds (High retention)",
    },
    bgMusicSuggestion: {
      genre: bgMusic.genre,
      mood: bgMusic.mood,
      tempo: bgMusic.tempo,
      freeSearchKeywords: bgMusic.keywords,
    },
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0:00 - 0:08",
        duration: "8s",
        sceneTitle: `The Hook (${cat.hook})`,
        visualDescription: `Cinematic high-impact vertical shot focusing prominently on ${cleanTopic} with dramatic atmospheric lighting.`,
        imagePrompt: `Cinematic 9:16 vertical composition, extreme focus on ${cleanTopic}, vivid volumetric studio rim lighting, ${cat.icon} theme atmosphere, ultra photorealistic, 8k resolution, octane render. ${thumbnailPrompt ? thumbnailPrompt.slice(0, 100) : ""}`,
        caption: `WAIT! Truth About ${cleanTopic.slice(0, 20)} 🔥`,
        onScreenText: `WAIT! Truth About ${cleanTopic.slice(0, 20)} 🔥`,
        voiceover: isHindi
          ? `क्या आप जानते हैं कि ${cleanTopic} को लेकर 90% लोग बहुत बड़ी भूल करते हैं? यह सीक्रेट जरूर जानें!`
          : `Did you know that 90% of people get ${cleanTopic} completely wrong? Listen closely!`,
        voiceoverScript: isHindi
          ? `क्या आप जानते हैं कि ${cleanTopic} को लेकर 90% लोग बहुत बड़ी भूल करते हैं? यह सीक्रेट जरूर जानें!`
          : `Did you know that 90% of people get ${cleanTopic} completely wrong? Listen closely!`,
        transition: "Fast Whip Pan Right with Motion Blur",
        bgmCue: "High-energy punchy riser & whoosh effect to grab attention (Volume: 20%)",
      },
      {
        sceneNumber: 2,
        timeRange: "0:08 - 0:20",
        duration: "12s",
        sceneTitle: "The Common Trap & Reality",
        visualDescription: `Contrasting visual showing the most common mistakes people make with ${cleanTopic}.`,
        imagePrompt: `Cinematic 9:16 vertical split composition showing the common mistake vs reality regarding ${cleanTopic}, moody blue and amber rim lighting, ultra sharp focus, 8k.`,
        caption: "The Biggest Trap Revealed ⚠️",
        onScreenText: "The Biggest Trap Revealed ⚠️",
        voiceover: isHindi
          ? `लोग घंटों मेहनत करते हैं लेकिन गलत दिशा में। असली तरीका बहुत आसान और सीधा है।`
          : `People spend hours doing it the hard way, but the actual breakthrough is remarkably simple.`,
        voiceoverScript: isHindi
          ? `लोग घंटों मेहनत करते हैं लेकिन गलत दिशा में। असली तरीका बहुत आसान और सीधा है।`
          : `People spend hours doing it the hard way, but the actual breakthrough is remarkably simple.`,
        transition: "Quick Zoom-In Glitch Cut",
        bgmCue: "Curiosity ambient synth beat, steady baseline (Volume: 15%)",
      },
      {
        sceneNumber: 3,
        timeRange: "0:20 - 0:35",
        duration: "15s",
        sceneTitle: "The Master Step Breakdown",
        visualDescription: `Fast-paced step-by-step visual demonstration of the core secret for ${cleanTopic}.`,
        imagePrompt: `Dynamic 9:16 vertical cinematic shot demonstrating the step-by-step secret technique for ${cleanTopic}, neon glowing highlights, ultra sharp details, 8k.`,
        caption: "The 1 Secret Formula 🚀",
        onScreenText: "The 1 Secret Formula 🚀",
        voiceover: isHindi
          ? `बस इस 1 फॉर्मूले को अपनाएं और अपने काम में 10 गुना तेजी और बेहतर नतीजे देखें!`
          : `Apply this single proven technique to multiply your results and unlock instant momentum!`,
        voiceoverScript: isHindi
          ? `बस इस 1 फॉर्मूले को अपनाएं और अपने काम में 10 गुना तेजी और बेहतर नतीजे देखें!`
          : `Apply this single proven technique to multiply your results and unlock instant momentum!`,
        transition: "Seamless Match Cut with Light Streak",
        bgmCue: "Inspiring uptempo synth rhythm with subtle click sounds (Volume: 15%)",
      },
      {
        sceneNumber: 4,
        timeRange: "0:35 - 0:50",
        duration: "15s",
        sceneTitle: "The Result & Transformation",
        visualDescription: `Cinematic high-energy scene showcasing massive success and progress with ${cleanTopic}.`,
        imagePrompt: `Cinematic vertical 9:16 victory scene celebrating peak results in ${cleanTopic}, golden confetti and volumetric studio lighting, photorealistic, 8k.`,
        caption: "10X Results Guaranteed! 🎯",
        onScreenText: "10X Results Guaranteed! 🎯",
        voiceover: isHindi
          ? `अगर आप इसे लगातार 7 दिन भी फॉलो करेंगे, तो नतीजे देखकर आप खुद हैरान रह जाएंगे!`
          : `Follow this consistently for just 7 days, and the results will completely blow your mind!`,
        voiceoverScript: isHindi
          ? `अगर आप इसे लगातार 7 दिन भी फॉलो करेंगे, तो नतीजे देखकर आप खुद हैरान रह जाएंगे!`
          : `Follow this consistently for just 7 days, and the results will completely blow your mind!`,
        transition: "Dynamic Slide-Up with Light Flash",
        bgmCue: "Energetic climax beat with positive chime sound effect (Volume: 18%)",
      },
      {
        sceneNumber: 5,
        timeRange: "0:50 - 0:60",
        duration: "10s",
        sceneTitle: "Call To Action & Save",
        visualDescription: `High-energy outro screen with bold 'FOLLOW & SAVE' animation and bookmark badge.`,
        imagePrompt: `Cinematic vertical 9:16 outro screen, glowing 3D follow button and bookmark icon, sleek dark glassmorphism background, vibrant neon accent lights, 8k render.`,
        caption: "Save This Reel & Follow! 💾",
        onScreenText: "Save This Reel & Follow! 💾",
        voiceover: isHindi
          ? `पूरी जानकारी दोबारा देखने के लिए इस वीडियो को अभी सेव करें और ऐसे और कंटेंट के लिए फॉलो करें!`
          : `Save this video right now so you have it ready, and follow for more daily updates!`,
        voiceoverScript: isHindi
          ? `पूरी जानकारी दोबारा देखने के लिए इस वीडियो को अभी सेव करें और ऐसे और कंटेंट के लिए फॉलो करें!`
          : `Save this video right now so you have it ready, and follow for more daily updates!`,
        transition: "Smooth Cross Dissolve Fade to Outro",
        bgmCue: "Uplifting outro beat fading down into subtle bell notification (Volume: 12%)",
      },
    ],
    assemblyInstructions: [
      "Step 1: Open Bing Image Creator / Leonardo.ai (Free) -> Paste each scene's Image Prompt to generate 9:16 visuals.",
      "Step 2: Record Voiceover using your phone mic or free TTS using the scene voiceovers.",
      "Step 3: Import clips into CapCut / VN Editor / InShot -> Add Transitions & Auto-Captions.",
      "Step 4: Add royalty-free BGM from YouTube Audio Library -> Set BGM volume to 12-15% -> Export in 1080p 60fps.",
    ],
    recommendedFreeTools: [
      "CapCut / VN Editor (Free Video Editing & Auto-Captions)",
      "Bing Image Creator / Leonardo.ai (Free 9:16 AI Visuals)",
      "YouTube Audio Library / Pixabay (Free Royalty-Free Background Music)",
      "Canva Free / InShot (Quick Mobile Video Assembly)",
    ],
  };
}

// 100% FREE AI Video Maker (Storyboard, Scene Image Prompts, Voiceover, Transitions & Assembly Guide)
app.post("/api/ai/generate-free-video-plan", async (req, res) => {
  const { script, thumbnailPrompt, topic, contentType, language, titles } = req.body || {};

  const preferredLanguage = language || "Hinglish";
  const selectedTitle = Array.isArray(titles) && titles.length > 0 ? titles[0] : (topic || "Trending Video");

  try {
    const storyboardPrompt = `You are an elite short-form video director, cinematic storyteller, and AI prompt engineer (specializing in YouTube Shorts, Instagram Reels, and viral 9:16 vertical videos).
Your task is to create a complete, practical, professional, 100% FREE video production storyboard and scene-by-scene blueprint based on the user's content.

Content Details:
- Title/Topic: ${selectedTitle}
- Content Type: ${contentType || "YouTube Shorts / Reel"}
- Language for Voiceover & Captions: ${preferredLanguage}
- Existing Script/Overview: ${script ? script.slice(0, 700) : topic || ""}
- Visual Vibe / Creative Prompt: ${thumbnailPrompt || ""}

Generate a JSON output with the exact schema:
{
  "videoTitle": "${selectedTitle.replace(/"/g, "'")}",
  "targetDuration": "45 - 60 Seconds",
  "aspectRatio": "9:16 (Vertical Short/Reel)",
  "bgMusicSuggestion": {
    "genre": "Upbeat Lo-Fi / Futuristic Synth / Energetic Motivation",
    "mood": "Inspiring, fast-paced, curious",
    "tempo": "120-128 BPM",
    "freeSearchKeywords": "upbeat inspiration free background music"
  },
  "scenes": [
    {
      "sceneNumber": 1,
      "timeRange": "0:00 - 0:08",
      "duration": "8s",
      "sceneTitle": "The 3-Second Hook (दृश्यक हुक)",
      "visualDescription": "Detailed camera angle and visual action on screen",
      "imagePrompt": "Detailed English prompt for free AI image generators (Bing Image Creator, Leonardo.ai, Canva AI) - specify photorealistic, 9:16 vertical aspect ratio, dynamic volumetric lighting, octane render, 8k, cinematic shot",
      "caption": "Short bold punchy dynamic caption (Max 4-6 words)",
      "onScreenText": "Short bold punchy dynamic caption (Max 4-6 words)",
      "voiceover": "Exact spoken dialogue line in ${preferredLanguage}",
      "voiceoverScript": "Exact spoken dialogue line in ${preferredLanguage}",
      "transition": "Fast Whip Pan to Right with Motion Blur"
    },
    {
      "sceneNumber": 2,
      "timeRange": "0:08 - 0:20",
      "duration": "12s",
      "sceneTitle": "The Problem / Curiosity (मुख्य समस्या या जिज्ञासा)",
      "visualDescription": "...",
      "imagePrompt": "...",
      "caption": "...",
      "onScreenText": "...",
      "voiceover": "...",
      "voiceoverScript": "...",
      "transition": "Quick Zoom-In Glitch Cut"
    },
    {
      "sceneNumber": 3,
      "timeRange": "0:20 - 0:35",
      "duration": "15s",
      "sceneTitle": "The Secret / Breakthrough (समाधान या मुख्य सीक्रेट)",
      "visualDescription": "...",
      "imagePrompt": "...",
      "caption": "...",
      "onScreenText": "...",
      "voiceover": "...",
      "voiceoverScript": "...",
      "transition": "Seamless Match Cut"
    },
    {
      "sceneNumber": 4,
      "timeRange": "0:35 - 0:50",
      "duration": "15s",
      "sceneTitle": "The Result / Transformation (नतीजा और प्रभाव)",
      "visualDescription": "...",
      "imagePrompt": "...",
      "caption": "...",
      "onScreenText": "...",
      "voiceover": "...",
      "voiceoverScript": "...",
      "transition": "Dynamic Slide-Up with Light Flash"
    },
    {
      "sceneNumber": 5,
      "timeRange": "0:50 - 0:60",
      "duration": "10s",
      "sceneTitle": "Call To Action (फॉलो और शेयर)",
      "visualDescription": "...",
      "imagePrompt": "...",
      "caption": "...",
      "onScreenText": "...",
      "voiceover": "...",
      "voiceoverScript": "...",
      "transition": "Smooth Cross Dissolve Fade to Outro"
    }
  ],
  "assemblyInstructions": [
    "Step 1: Open Bing Image Creator / Leonardo.ai (Free) -> Paste each scene's Image Prompt to generate 9:16 visuals.",
    "Step 2: Record Voiceover using phone mic or free TTS reader using the scene voiceovers.",
    "Step 3: Import clips into CapCut / VN Editor / InShot -> Add Transitions & Auto-Captions.",
    "Step 4: Add royalty-free BGM from YouTube Audio Library -> Set BGM volume to 12-15% -> Export in 1080p 60fps."
  ],
  "recommendedFreeTools": [
    "CapCut / VN Editor (100% Free Video Editing & Auto-Captions)",
    "Bing Image Creator / Leonardo.ai (Free 9:16 AI Visuals)",
    "YouTube Audio Library / Pixabay (Free Royalty-Free Background Music)",
    "Canva / InShot (Quick Mobile Video Assembly)"
  ]
}

Ensure all scenes (4 to 5 scenes) have actionable, descriptive English image prompts ready to copy-paste into free generators, clear duration (e.g. 8s, 12s), dynamic captions, smooth creative transitions, and natural spoken voiceovers in ${preferredLanguage}. Return valid JSON ONLY.`;

    let parsed: any = null;
    try {
      const rawText = await generateContentWithFallback({
        contents: storyboardPrompt,
        config: {
          responseMimeType: "application/json",
        },
      });
      parsed = extractAndParseJson(rawText);
    } catch (genErr: any) {
      console.warn("Gemini generation for video plan failed or returned invalid JSON, using fallback blueprint:", genErr?.message || genErr);
      parsed = createFallbackVideoBlueprint({
        topic: topic || selectedTitle,
        selectedTitle,
        script,
        thumbnailPrompt,
        preferredLanguage,
      });
    }

    if (!parsed || !Array.isArray(parsed.scenes) || parsed.scenes.length === 0) {
      parsed = createFallbackVideoBlueprint({
        topic: topic || selectedTitle,
        selectedTitle,
        script,
        thumbnailPrompt,
        preferredLanguage,
      });
    }

    const defaultBgmCues = [
      "High-energy punchy riser & whoosh effect to grab attention (Volume: 20%)",
      "Curiosity ambient synth beat, steady baseline (Volume: 15%)",
      "Inspiring uptempo synth rhythm with subtle click sounds (Volume: 15%)",
      "Energetic climax beat with positive chime sound effect (Volume: 18%)",
      "Uplifting outro beat fading down into subtle bell notification (Volume: 12%)",
    ];

    const sanitizedScenes = (Array.isArray(parsed?.scenes) ? parsed.scenes : []).map(
      (s: any, idx: number) => ({
        sceneNumber: typeof s.sceneNumber === "number" ? s.sceneNumber : idx + 1,
        timeRange: s.timeRange || `0:${String(idx * 10).padStart(2, "0")} - 0:${String((idx + 1) * 10).padStart(2, "0")}`,
        duration: s.duration || "10s",
        sceneTitle: s.sceneTitle || `Scene ${idx + 1}`,
        visualDescription: s.visualDescription || "",
        imagePrompt: s.imagePrompt || "",
        caption: s.caption || s.onScreenText || "",
        onScreenText: s.onScreenText || s.caption || "",
        voiceover: s.voiceover || s.voiceoverScript || "",
        voiceoverScript: s.voiceoverScript || s.voiceover || "",
        transition: s.transition || "Smooth Cross Dissolve",
        bgmCue: s.bgmCue || defaultBgmCues[idx % defaultBgmCues.length],
      })
    );

    res.json({
      success: true,
      blueprint: {
        videoTitle: parsed.videoTitle || selectedTitle,
        targetDuration: parsed.targetDuration || "45-60 Seconds",
        aspectRatio: parsed.aspectRatio || "9:16 (Vertical Short/Reel)",
        resolution: parsed.resolution || "1080 × 1920",
        captionStyle: parsed.captionStyle || "Bold Neon Yellow & White with Black Stroke (1-3 words/burst)",
        hookStrategy: parsed.hookStrategy || "High-energy curiosity hook in first 2-3 seconds",
        videoSettings: {
          aspectRatio: "9:16",
          resolution: "1080 × 1920",
          recommendedDuration: parsed.targetDuration || "45 – 60 Seconds",
          captionStyle: "Bold Neon Yellow & White with Drop Shadow (1-3 words/frame)",
          hookInFirstSeconds: "Curiosity Hook in first 2–3 seconds (High retention)",
        },
        bgMusicSuggestion: parsed.bgMusicSuggestion || {
          genre: "Upbeat Motivational Beats",
          mood: "Fast, exciting and inspiring",
          tempo: "125 BPM",
          freeSearchKeywords: "upbeat inspiration free background music",
        },
        scenes: sanitizedScenes,
        assemblyInstructions: Array.isArray(parsed.assemblyInstructions)
          ? parsed.assemblyInstructions
          : [
              "Step 1: Open Bing Image Creator / Leonardo.ai (Free) -> Paste each scene's Image Prompt to generate 9:16 visuals.",
              "Step 2: Record Voiceover using phone mic or free TTS reader using the scene voiceovers.",
              "Step 3: Import clips into CapCut / VN Editor / InShot -> Add Transitions & Auto-Captions.",
              "Step 4: Add royalty-free BGM from YouTube Audio Library -> Set BGM volume to 12-15% -> Export in 1080p 60fps.",
            ],
        recommendedFreeTools: Array.isArray(parsed.recommendedFreeTools)
          ? parsed.recommendedFreeTools
          : ["CapCut / VN Editor", "Bing Image Creator", "YouTube Audio Library", "Canva Free"],
      },
    });
  } catch (error: any) {
    console.error("Error generating free video storyboard:", error);
    const fallback = createFallbackVideoBlueprint({
      topic: topic || selectedTitle,
      selectedTitle,
      script,
      thumbnailPrompt,
      preferredLanguage,
    });
    res.json({
      success: true,
      blueprint: fallback,
    });
  }
});

// Helper to create fallback single scene
function createFallbackSingleScene(sceneNum: number, topic: string, language: string, title?: string): any {
  const isHindi = (language || "").toLowerCase().includes("hindi") || (language || "").toLowerCase().includes("hinglish");
  const cleanTopic = topic || "AI Earning Strategy";

  switch (sceneNum) {
    case 1:
      return {
        sceneNumber: 1,
        timeRange: "0:00 - 0:08",
        duration: "8s",
        sceneTitle: "The Instant Curiosity Hook (दृश्यक हुक v2)",
        visualDescription: "Dynamic split-screen zoom: on left empty wallet, on right smartphone showing notifications of incoming earnings.",
        imagePrompt: `Cinematic 9:16 vertical split composition, futuristic smartphone receiving instant revenue alerts, glowing neon dollar and rupee holographic icons, volumetric dramatic lighting, photorealistic, 8k, octane render, topic: ${cleanTopic}`,
        caption: "Wait! Don't Skip This 2026 Trick ⚡",
        onScreenText: "Wait! Don't Skip This 2026 Trick ⚡",
        voiceover: isHindi
          ? "अगर आपके पास सिर्फ एक स्मार्टफोन और दिन का 1 घंटा है, तो यह AI तरीका आपकी जिंदगी बदल सकता है!"
          : "If you have a smartphone and just one free hour a day, this secret AI method will change everything for you!",
        voiceoverScript: isHindi
          ? "अगर आपके पास सिर्फ एक स्मार्टफोन और दिन का 1 घंटा है, तो यह AI तरीका आपकी जिंदगी बदल सकता है!"
          : "If you have a smartphone and just one free hour a day, this secret AI method will change everything for you!",
        transition: "Fast Whip Pan Right with Motion Blur",
        bgmCue: "Punchy dramatic riser & whoosh effect to hook attention (Volume: 22%)",
      };
    case 2:
      return {
        sceneNumber: 2,
        timeRange: "0:08 - 0:20",
        duration: "12s",
        sceneTitle: "The Common Trap vs Reality (समस्या और हकीकत v2)",
        visualDescription: "Medium shot of creator frustrated with complex software interfaces, shaking head, timer counting down.",
        imagePrompt: `Cinematic vertical 9:16 shot, modern creator at desk overwhelmed by complex software, dramatic moody shadows, glowing screen reflection in eyeglasses, high contrast, 8k resolution.`,
        caption: "Stop Wasting Time on Complicated Tools!",
        onScreenText: "Stop Wasting Time on Complicated Tools!",
        voiceover: isHindi
          ? "90% लोग गलत टूल्स और महंगे सॉफ्टवेयर में उलझ कर छोड़ देते हैं, जबकि असल में आपको सिर्फ 2 फ्री टूल्स चाहिए।"
          : "90% of beginners get trapped into expensive software, when you actually need just 2 free tools.",
        voiceoverScript: isHindi
          ? "90% लोग गलत टूल्स और महंगे सॉफ्टवेयर में उलझ कर छोड़ देते हैं, जबकि असल में आपको सिर्फ 2 फ्री टूल्स चाहिए।"
          : "90% of beginners get trapped into expensive software, when you actually need just 2 free tools.",
        transition: "Quick Zoom-In Glitch Cut with CRT pulse",
        bgmCue: "Curiosity ambient synth beat, steady baseline (Volume: 15%)",
      };
    case 3:
      return {
        sceneNumber: 3,
        timeRange: "0:20 - 0:35",
        duration: "15s",
        sceneTitle: "The Exact Step-by-Step Formula (सीक्रेट फॉर्मूला v2)",
        visualDescription: "Macro close-up on fingers typing an AI prompt on modern laptop, instantly rendering 9:16 visuals.",
        imagePrompt: `Cinematic vertical 9:16 angle, neon backlit keyboard with hands generating viral content on laptop, holographic analytics floating, cinematic rim lighting, 8k, topic: ${cleanTopic}`,
        caption: "Copy Prompt -> Paste -> Generate 9:16 Visuals",
        onScreenText: "Copy Prompt -> Paste -> Generate 9:16 Visuals",
        voiceover: isHindi
          ? "पहला कदम: दिए गए प्रॉम्प्ट से फ्री इमेज बनाएं। दूसरा कदम: 1-क्लिक में वॉयसओवर जोड़ें और CapCut में ट्रांजिशन लगा दें।"
          : "Step 1: Generate free visuals with the given prompt. Step 2: Add voiceover and smooth transitions in CapCut.",
        voiceoverScript: isHindi
          ? "पहला कदम: दिए गए प्रॉम्प्ट से फ्री इमेज बनाएं। दूसरा कदम: 1-क्लिक में वॉयसओवर जोड़ें और CapCut में ट्रांजिशन लगा दें।"
          : "Step 1: Generate free visuals with the given prompt. Step 2: Add voiceover and smooth transitions in CapCut.",
        transition: "Seamless Match Cut with Light Streak",
        bgmCue: "Inspiring uptempo synth rhythm with subtle click sounds (Volume: 16%)",
      };
    case 4:
      return {
        sceneNumber: 4,
        timeRange: "0:35 - 0:50",
        duration: "15s",
        sceneTitle: "Proof & Rapid Scaling (रिजल्ट व सबूत v2)",
        visualDescription: "Upward camera pan across viral analytics graph soaring to 1 Million views and notifications popping.",
        imagePrompt: `Cinematic vertical 9:16 shot, creator standing proudly in front of neon growth chart showing 1M views, golden particles in air, cinematic studio lighting, 8k.`,
        caption: "From 0 to 100K Views in 7 Days! 📈",
        onScreenText: "From 0 to 100K Views in 7 Days! 📈",
        voiceover: isHindi
          ? "यह तरीका इतना प्रभावी है कि पहले ही हफ्ते में आपके वीडियो को एल्गोरिद्म पुश करने लगेगा और व्यूज तेज़ी से बढ़ेंगे।"
          : "This framework works so consistently that the algorithm starts pushing your content within days.",
        voiceoverScript: isHindi
          ? "यह तरीका इतना प्रभावी है कि पहले ही हफ्ते में आपके वीडियो को एल्गोरिद्म पुश करने लगेगा और व्यूज तेज़ी से बढ़ेंगे।"
          : "This framework works so consistently that the algorithm starts pushing your content within days.",
        transition: "Dynamic Slide-Up with Light Flash",
        bgmCue: "Energetic climax beat with positive chime sound effect (Volume: 18%)",
      };
    default:
      return {
        sceneNumber: 5,
        timeRange: "0:50 - 0:60",
        duration: "10s",
        sceneTitle: "Urgent Call to Action (कॉल टू एक्शन v2)",
        visualDescription: "Eye-catching outro screen with dynamic bookmark pulsating and 'SAVE & FOLLOW' glowing button.",
        imagePrompt: `Cinematic vertical 9:16 outro screen, glowing bookmark icon and 3D follow button, dark sleek modern tech background, radiant emerald and cyan lighting, 8k.`,
        caption: "Save This Reel & Follow for Part 2! 💾",
        onScreenText: "Save This Reel & Follow for Part 2! 💾",
        voiceover: isHindi
          ? "पूरा प्रॉम्प्ट और फ्री टूल्स गाइड खो न जाए, इसलिए इसे तुरंत सेव करें और पार्ट 2 के लिए फॉलो करें!"
          : "Save this reel right now so you don't lose the prompts, and follow for Part 2!",
        voiceoverScript: isHindi
          ? "पूरा प्रॉम्प्ट और फ्री टूल्स गाइड खो न जाए, इसलिए इसे तुरंत सेव करें और पार्ट 2 के लिए फॉलो करें!"
          : "Save this reel right now so you don't lose the prompts, and follow for Part 2!",
        transition: "Smooth Cross Dissolve Fade to Outro",
        bgmCue: "Uplifting outro beat fading down into subtle bell notification (Volume: 12%)",
      };
  }
}

// 100% FREE Single Scene Regenerator
app.post("/api/ai/regenerate-scene", async (req, res) => {
  const {
    sceneNumber = 1,
    topic = "AI Video",
    videoTitle = "Viral Short",
    language = "Hindi",
    sceneTitle,
    duration,
  } = req.body || {};

  const preferredLanguage = language || "Hinglish";

  try {
    const scenePrompt = `You are a viral short-form video director.
Regenerate Scene #${sceneNumber} (${sceneTitle || "Scene"}) with fresh visual angle and narration for a 9:16 short video.
Topic: ${topic}
Title: ${videoTitle}
Language for Voiceover & Caption: ${preferredLanguage}

Return a valid JSON object ONLY:
{
  "sceneNumber": ${sceneNumber},
  "timeRange": "0:00 - 0:10",
  "duration": "${duration || "10s"}",
  "sceneTitle": "Fresh dynamic scene title",
  "visualDescription": "Detailed camera movement, subject action and lighting",
  "imagePrompt": "Detailed English prompt for Bing Image Creator/Leonardo.ai: 9:16 vertical aspect ratio, octane render, 8k, cinematic lighting, photorealistic",
  "caption": "Punchy on-screen caption (4-6 words)",
  "onScreenText": "Punchy on-screen caption (4-6 words)",
  "voiceover": "Natural dialogue line in ${preferredLanguage}",
  "voiceoverScript": "Natural dialogue line in ${preferredLanguage}",
  "transition": "Creative transition suggestion",
  "bgmCue": "Background music cue and sound effect recommendation"
}`;

    const rawText = await generateContentWithFallback({
      contents: scenePrompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = extractAndParseJson(rawText);

    if (parsed && (parsed.visualDescription || parsed.imagePrompt || parsed.voiceover)) {
      return res.json({
        success: true,
        scene: {
          sceneNumber,
          timeRange: parsed.timeRange || "0:00 - 0:10",
          duration: parsed.duration || duration || "10s",
          sceneTitle: parsed.sceneTitle || sceneTitle || `Scene ${sceneNumber}`,
          visualDescription: parsed.visualDescription || "",
          imagePrompt: parsed.imagePrompt || "",
          caption: parsed.caption || parsed.onScreenText || "",
          onScreenText: parsed.onScreenText || parsed.caption || "",
          voiceover: parsed.voiceover || parsed.voiceoverScript || "",
          voiceoverScript: parsed.voiceoverScript || parsed.voiceover || "",
          transition: parsed.transition || "Smooth Cross Dissolve",
          bgmCue: parsed.bgmCue || "Ambient energetic synth beat (Volume: 15%)",
        },
      });
    }

    const fallbackScene = createFallbackSingleScene(sceneNumber, topic || videoTitle, preferredLanguage, sceneTitle);
    res.json({ success: true, scene: fallbackScene });
  } catch (err: any) {
    console.warn("Regenerate scene falling back to resilient template:", err?.message || err);
    const fallbackScene = createFallbackSingleScene(sceneNumber, topic || videoTitle, preferredLanguage, sceneTitle);
    res.json({ success: true, scene: fallbackScene });
  }
});

// Server and Vite setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

