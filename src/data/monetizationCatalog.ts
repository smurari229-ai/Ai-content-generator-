import { MonetizationMethod } from '../types';

export const MONETIZATION_CATEGORIES = [
  'All',
  'Content',
  'Freelance',
  'Digital Products',
  'Automation',
  'SaaS',
  'Agency',
] as const;

export const INITIAL_MONETIZATION_METHODS: MonetizationMethod[] = [
  {
    id: 'faceless-youtube-reels',
    title: 'AI Faceless YouTube व Instagram Reels चैनल',
    tagline: 'बिना चेहरा दिखाए AI से वायरल वीडियो बनाकर AdSense और Sponsorship से कमाई करें।',
    category: 'Content',
    earningPotential: '₹40,000 - ₹2,50,000 / माह',
    timeToFirstRupee: '30 - 45 दिन',
    difficulty: 'Easy',
    investmentRequired: '₹0 (फ्री टूल्स से शुरुआत)',
    description:
      'Gemini/ChatGPT से आकर्षक स्क्रिप्ट लिखें, ElevenLabs से रियलिस्टिक वॉयसओवर जनरेट करें, और Leonardo/Canva/CapCut से ऑटोमेटेड विज़ुअल्स जोड़कर हिंदी स्टोरीज, मोटिवेशन, या टेक फैक्ट्स के वीडियो बनाएं।',
    toolsNeeded: [
      { name: 'Gemini 2.5 Flash (Scripting)', isFree: true, badge: 'Free' },
      { name: 'ElevenLabs / Clipchamp (Voiceover)', isFree: true, badge: 'Freemium' },
      { name: 'Leonardo AI / Pika (Visuals)', isFree: true, badge: 'Free credits' },
      { name: 'CapCut / Canva (Auto Captions & Editing)', isFree: true, badge: 'Free' },
    ],
    keySteps: [
      'High-demand niche चुनें (जैसे: Success Stories, Psychological Facts, History Mysteries, AI News)।',
      'Gemini से 10 वीडियो के लिए वायरल हुक और 60-सेकंड स्क्रिप्ट लिखवाएं।',
      'AI वॉयस जनरेट कर 9:16 रेश्यो में बैकग्राउंड वीडियो और ऑटोमैटिक सबटाइटल्स लगाएं।',
      'प्रतिदिन 2 Reels/Shorts और हफ्ते में 2 लॉन्ग वीडियो अपलोड करें।',
      '1,000 सब्सक्राइबर्स होते ही AdSense, Affiliate Links, और Brand Deals से कमाना शुरू करें।',
    ],
    starterPrompt: `तुम एक वायरल YouTube Shorts व Instagram Reels क्रिएटर हो। मुझे "Psychology Facts That Change Your Life" विषय पर 3 स्क्रिप्ट लिख कर दो। 
हर स्क्रिप्ट में:
1. पहले 3 सेकंड का जबर्दस्त Hook
2. 45 सेकंड की दिलचस्प जानकारी
3. अंतिम 5 सेकंड में Call-To-Action (फॉलो और शेयर करने की अपील)।
भाषा: सरल और प्रभावशाली हिंदी + English (Hinglish)।`,
    googleTasks: [
      {
        title: 'Niche और YouTube/Instagram चैनल सेटअप करें',
        notes: 'Logo, Banner (Canva से बनाएं) और Bio में SEO कीवर्ड्स डालें।',
        dayOffset: 1,
      },
      {
        title: 'Gemini से 15 वायरल स्क्रिप्ट्स जनरेट करें',
        notes: 'Hook-heavy 45s शॉर्ट्स स्क्रिप्ट तैयार करें।',
        dayOffset: 2,
      },
      {
        title: 'पहला बैच: 5 वीडियो का वॉयसओवर व वीडियो एडिट करें',
        notes: 'CapCut में Auto-Captions ऑन करें और ट्रांजिशन्स लगाएं।',
        dayOffset: 3,
      },
      {
        title: 'पहले 5 Shorts शेड्यूल करें और डेली 2 पोस्टिंग रूटीन बनाएं',
        notes: 'सुबह 9 बजे और शाम 7 बजे बेस्ट पोस्टिंग टाइम टेस्ट करें।',
        dayOffset: 4,
      },
      {
        title: 'Amazon Affiliate लिंक और डिस्क्रिप्शन टेम्पलेट सेट करें',
        notes: 'बायो में लिंक्स और स्पॉन्सरशिप बिजनेस ईमेल जोड़ें।',
        dayOffset: 7,
      },
    ],
    monetizationChannels: [
      'YouTube Partner Program (AdSense)',
      'Instagram Creator Bonus & Gifts',
      'Amazon / ClickBank Affiliate Links',
      'Direct Brand Sponsorships (₹5,000 - ₹50,000 per reel)',
    ],
    proTips: [
      'शुरुआत में कभी भी 1 मिनट से लंबा शॉर्ट न बनाएं।',
      'ऑडियो की क्वालिटी क्रिस्प रखें—लोग खराब वीडियो देख लेते हैं लेकिन खराब ऑडियो नहीं सुनते।',
    ],
  },
  {
    id: 'ai-prompt-engineering-freelance',
    title: 'AI कॉपीराइटिंग व प्रॉम्प्ट इंजीनियरिंग फ्रीलांसिंग',
    tagline: 'Fiverr और Upwork पर ग्लोबल क्लाइंट्स के लिए SEO ब्लॉग, सेल्स ईमेल और एड कॉपी लिखें।',
    category: 'Freelance',
    earningPotential: '₹50,000 - ₹1,80,000 / माह',
    timeToFirstRupee: '10 - 20 दिन',
    difficulty: 'Easy',
    investmentRequired: '₹0',
    description:
      'कंपनियों को अपनी वेबसाइट्स के लिए रोज़ाना सैकड़ों आर्टिकल्स और सेल्स फनल की ज़रूरत होती है। आप एडवांस प्रॉम्प्ट्स का इस्तेमाल करके 10 गुना तेजी से हाई-कन्वर्टिंग कंटेंट तैयार करके प्रति प्रोजेक्ट चार्ज कर सकते हैं।',
    toolsNeeded: [
      { name: 'Gemini / Claude 3.5 (Writing)', isFree: true, badge: 'Free' },
      { name: 'Grammarly (Proofreading)', isFree: true, badge: 'Free' },
      { name: 'Originality.ai / QuillBot (Refining)', isFree: true, badge: 'Freemium' },
      { name: 'Notion (Portfolio Showcase)', isFree: true, badge: 'Free' },
    ],
    keySteps: [
      'Fiverr और Upwork पर "SEO AI Content Editor & Prompt Specialist" की गिग बनाएं।',
      'Notion में 3 बेहतरीन सैंपल आर्टिकल्स (Tech, Health, Finance) का फ्री पोर्टफोलियो बनाएं।',
      'LinkedIn पर मार्केटिंग एजेंसियों के फाउंडर्स को डायरेक्ट वैल्यू-बेस्ड पिच भेजें।',
      'AI से रॉ ड्राफ्ट जनरेट कर उसमें ह्यूमन टच, रियल एग्जांपल्स और स्टेटिस्टिक्स जोड़कर क्लाइंट को डिलीवर करें।',
    ],
    starterPrompt: `Act as a senior B2B SaaS copywriter. Write a 1,200-word comprehensive, SEO-optimized guide on "How Small Businesses Can Automate Customer Support in 2026".
Include:
- Compelling H1 headline with power words
- Table of Contents
- Real statistics and bullet-point comparison tables
- 3 case studies
- Actionable checklist at the end.
Tone: Conversational, authoritative, zero fluff.`,
    googleTasks: [
      {
        title: 'Fiverr & Upwork अकाउंट सेटअप और प्रोफाइल ऑप्टिमाइज़ेशन',
        notes: 'सर्च कीवर्ड्स: AI Content Writer, SEO Blog Optimization, Prompt Engineer.',
        dayOffset: 1,
      },
      {
        title: 'Notion पर 3 हाई-क्वालिटी सैंपल आर्टिकल्स का लाइव पोर्टफोलियो बनाएं',
        notes: 'Before AI draft vs After Human-edited final polish का अंतर दिखाएं।',
        dayOffset: 2,
      },
      {
        title: 'LinkedIn पर 20 मार्केटिंग मैनेजर्स को पर्सनलाइज्ड मैसेज भेजें',
        notes: 'मुफ्त में एक 500 शब्द का आर्टिकल रिव्यू ऑफर करें।',
        dayOffset: 3,
      },
      {
        title: 'पहले क्लाइंट का ऑर्डर डिलीवर करें और 5-स्टार रिव्यू मांगें',
        notes: 'फास्ट डिलीवरी और एक्स्ट्रा बोनस प्रॉम्प्ट शीट दें।',
        dayOffset: 10,
      },
    ],
    monetizationChannels: [
      'Upwork / Fiverr Client Contracts ($20 - $50/hour)',
      'Monthly Retainer Clients (₹25,000/client)',
      'Direct Agency Subcontracting',
    ],
    proTips: [
      'कभी भी AI का अन-एडिटेड कंटेंट क्लाइंट को न भेजें। फैक्ट्स को हमेशा वेरिफाई करें।',
      'क्लाइंट्स को "AI + Human Polish" कॉम्बो सबसे ज्यादा पसंद आता है।',
    ],
  },
  {
    id: 'custom-gpt-local-business-chatbots',
    title: 'लोकल बिजनेसेज के लिए AI कस्टम चैटबॉट्स और एजेंट्स',
    tagline: 'रेस्टोरेंट्स, रियल एस्टेट एजेंट्स और क्लिनिक्स को 24/7 ऑटोमेटेड AI लीड बॉट बेचें।',
    category: 'Agency',
    earningPotential: '₹80,000 - ₹3,00,000 / माह',
    timeToFirstRupee: '15 - 30 दिन',
    difficulty: 'Medium',
    investmentRequired: '₹500 - ₹2,000 (डोमेन या टेस्टिंग)',
    description:
      'लोकल बिजनेसेज (जैसे डेंटल क्लिनिक, कोचिंग इंस्टीट्यूट, जिम) के 70% कस्टमर सवाल बेसिक होते हैं। आप Voiceflow, Botpress या Chatbase से नो-कोड AI चैटबॉट बनाकर उन्हें ₹15,000 - ₹40,000 वन-टाइम और ₹3,000/महीना मेंटेनेंस पर बेच सकते हैं।',
    toolsNeeded: [
      { name: 'Chatbase / Botpress (No-Code AI Bot)', isFree: true, badge: 'Free tier' },
      { name: 'Gemini API (Knowledge Base Parsing)', isFree: true, badge: 'Free tier' },
      { name: 'WhatsApp Business API / Zapier (Integration)', isFree: true, badge: 'Freemium' },
      { name: 'Loom (Demo Video Recording)', isFree: true, badge: 'Free' },
    ],
    keySteps: [
      'एक डेमो चैटबॉट तैयार करें जो किसी कोचिंग या जिम के अक्सर पूछे जाने वाले प्रश्नों (FAQs) का 2 सेकंड में जवाब दे।',
      'Loom से 1 मिनट का स्क्रीन रिकॉर्डिंग डेमो वीडियो बनाएं जिसमें बॉट लीड का नाम और फोन नंबर कलेक्ट करता दिखे।',
      'Google Maps से अपने शहर के 30 बिजनेसेज को ईमेल या व्हाट्सएप पर डेमो भेजें।',
      'उन्हें 7 दिन का फ्री ट्रायल दें और संतुष्ट होने पर मंथली रिटेनर डील साइन करें।',
    ],
    starterPrompt: `तुम एक डेंटल क्लिनिक के लिए AI असिस्टेंट के रूप में बात करोगे। 
क्लिनिक का नाम: "स्माइल केयर डेंटल"। 
समय: सुबह 10 से रात 8 बजे तक।
सेवाएं: टीथ क्लीनिंग (₹999), रूट कैनाल (₹3500), ब्रेसेस कंसल्टेशन (फ्री)।
अगर कोई मरीज अपॉइंटमेंट बुक करना चाहे तो विनम्रता से उनका नाम, पसंदीदा तारीख और फोन नंबर पूछो।`,
    googleTasks: [
      {
        title: 'Botpress / Chatbase पर पहला फंक्शनल जिम/क्लिनिक बॉट बनाएं',
        notes: 'कस्टमर FAQ और लीड कैप्चर फॉर्म कॉन्फ़िगर करें।',
        dayOffset: 1,
      },
      {
        title: 'Loom पर 90-सेकंड का इम्प्रेसिव डेमो वीडियो रिकॉर्ड करें',
        notes: '"How this bot saves 20 hours/week for your front desk" एंगल रखें।',
        dayOffset: 2,
      },
      {
        title: 'Google Maps से 25 लोकल बिजनेसेज की लिस्ट और ओनर कॉन्टैक्ट निकालें',
        notes: 'Google Sheets में नाम, फोन, ईमेल और वर्तमान वेबसाइट स्टेटस नोट करें।',
        dayOffset: 3,
      },
      {
        title: '10 ओनर को डेमो वीडियो और फ्री 7-दिन ट्रायल का ऑफर भेजें',
        notes: 'फॉलो अप कॉल 48 घंटे बाद करें।',
        dayOffset: 5,
      },
      {
        title: 'पहले पेड क्लाइंट का बॉट लाइव करें और एनुअल सपोर्ट एग्रीमेंट करें',
        notes: 'WhatsApp API या वेबसाइट विजेट कोड इंजेक्ट करें।',
        dayOffset: 14,
      },
    ],
    monetizationChannels: [
      'One-time Setup Fee (₹15,000 - ₹35,000)',
      'Monthly Maintenance & Hosting Retainer (₹3,000 - ₹7,000/mo per client)',
      'WhatsApp Notification Add-on',
    ],
    proTips: [
      'क्लाइंट्स को टेक्नोलॉजी मत समझाएं, उन्हें बताएं कि यह बॉट उनकी सेल्स 20% कैसे बढ़ाएगा।',
    ],
  },
  {
    id: 'ai-digital-products-notion-templates',
    title: 'AI प्रॉम्प्ट पैक्स, ई-बुक्स और Notion AI टेम्पलेट्स',
    tagline: 'एक बार डिजिटल प्रोडक्ट बनाएं और Gumroad / Etsy पर ऑटोपायलट पैसिव इनकम कमाएं।',
    category: 'Digital Products',
    earningPotential: '₹30,000 - ₹1,50,000 / माह',
    timeToFirstRupee: '14 - 21 दिन',
    difficulty: 'Easy',
    investmentRequired: '₹0',
    description:
      'AI की मदद से 500+ Mega Prompts for Real Estate, Fitness Trackers with Notion, या 30-दिन की AI सोशल मीडिया गाइड बनाएं। Gumroad, Instamojo या Payhip पर लिस्ट करें और Twitter/LinkedIn/Pinterest पर फ्री वैल्यू देकर ट्रैफिक लाएं।',
    toolsNeeded: [
      { name: 'Gemini / ChatGPT (Content Generation)', isFree: true, badge: 'Free' },
      { name: 'Canva (Cover Design & PDF Formatting)', isFree: true, badge: 'Free' },
      { name: 'Gumroad / Instamojo (Storefront & Payments)', isFree: true, badge: 'Free' },
      { name: 'Notion (Product Template Builder)', isFree: true, badge: 'Free' },
    ],
    keySteps: [
      'एक स्पेसिफिक समस्या चुनें (जैसे: "Small Business Social Media Planner" या "AI for Students Guide")।',
      'Gemini से 100+ टेस्टेड और हाई-परफॉर्मिंग प्रॉम्प्ट्स और गाइड तैयार करवाएं।',
      'Canva में प्रीमियम 3D मॉकअप और ई-बुक कवर डिजाइन करें।',
      'Gumroad पर ₹499 ($9) की कीमत पर लिस्ट करें।',
      'Twitter/X और Instagram पर फ्री वैल्यू पोस्ट (जैसे "10 Best Prompts") डालकर बायो लिंक में प्रोडक्ट दें।',
    ],
    starterPrompt: `Create a structured outline and content for a digital product: "The Ultimate 2026 AI Productivity Kit for Solopreneurs".
Sections needed:
1. Daily task management workflows with AI
2. 50 Copy-paste prompts for Sales, Marketing, and Customer Support
3. Step-by-step checklist to save 15 hours weekly
Provide the full introduction, table of contents, and 5 detailed sample workflows.`,
    googleTasks: [
      {
        title: 'डिजिटल प्रोडक्ट आइडिया और Niche फाइनल करें',
        notes: 'Check Gumroad trending products for inspiration.',
        dayOffset: 1,
      },
      {
        title: 'Gemini से पूरा ई-बुक / प्रॉम्प्ट बंडल कंटेंट जनरेट और रिव्यू करें',
        notes: 'हर प्रॉम्प्ट को खुद टेस्ट करके आउटपुट की क्वालिटी सुधारें।',
        dayOffset: 2,
      },
      {
        title: 'Canva में 3D कवर और PDF ई-बुक लेआउट डिजाइन करें',
        notes: 'सुंदर टाइपोग्राफी और विजुअल्स जोड़ें।',
        dayOffset: 3,
      },
      {
        title: 'Gumroad / Instamojo पर प्रोडक्ट पेज बनाएं और पेमेंट गेटवे जोड़ें',
        notes: 'डिस्काउंट कूपन "LAUNCH50" तैयार करें।',
        dayOffset: 4,
      },
      {
        title: 'Twitter/LinkedIn पर पहली थ्रेड पोस्ट करें और 10 लोगों को फ्री शेयर करें',
        notes: 'टेस्टिमोनियल्स कलेक्ट करें और सोशल प्रूफ बनाएं।',
        dayOffset: 5,
      },
    ],
    monetizationChannels: [
      'Gumroad Global Sales (USD $9 - $29)',
      'Instamojo / Razorpay India Sales (₹299 - ₹999)',
      'Etsy Digital Downloads',
    ],
    proTips: [
      'शुरुआत में 5-10 लोगों को फ्री रिव्यू कॉपी दें ताकि वे आपको 5-स्टार रेटिंग दे सकें।',
    ],
  },
  {
    id: 'ai-workflow-automation-freelance',
    title: 'AI वर्कफ़्लो ऑटोमेशन कंसल्टिंग (Make & Zapier)',
    tagline: 'कंपनियों के मैन्युअल कामों को AI और ऑटोमेशन से जोड़कर ₹1 लाख+ चार्ज करें।',
    category: 'Automation',
    earningPotential: '₹75,000 - ₹3,50,000 / माह',
    timeToFirstRupee: '20 - 30 दिन',
    difficulty: 'Medium',
    investmentRequired: '₹0 (फ्री टियर में सीखें)',
    description:
      'जब कोई लीड आए -> AI उसका ईमेल पढ़े -> CRM में जोड़े -> ऑटोमैटिक पर्सनलाइज्ड रिप्लाई भेजे -> स्लैक पर टीम को नोटिफाई करे। ऐसी ऑटोमेशन पाइपलाइन बनाकर आप स्टार्टअप्स और ई-कॉमर्स ब्रांड्स को हाई-टिकट सर्विस बेच सकते हैं।',
    toolsNeeded: [
      { name: 'Make.com / Zapier (Automation Engine)', isFree: true, badge: 'Free tier' },
      { name: 'Gemini API / OpenAI API (AI Processing)', isFree: true, badge: 'Free tier' },
      { name: 'Google Sheets / Airtable (Database)', isFree: true, badge: 'Free' },
    ],
    keySteps: [
      'Make.com पर "Email Auto-Responder with AI Analysis" का बेसिक वर्कफ़्लो बनाना सीखें।',
      'एक डेमो ऑटोमेशन बनाएं जो किसी Google Form सबमिशन को प्रोसेस करके कस्टम AI रिपोर्ट ईमेल करे।',
      'Upwork पर "Make.com & Zapier Automation Expert" प्रोफाइल बनाएं।',
      'ई-कॉमर्स और रियल एस्टेट बिजनेस ओनर्स को कोल्ड ईमेल और लिंक्डइन पर अप्रोच करें।',
    ],
    starterPrompt: `Design a step-by-step workflow architecture in Make.com that takes incoming lead inquiries from a Google Form, passes the customer's budget and requirements to Gemini 2.5 Flash to classify lead quality (Hot/Warm/Cold), updates Google Sheets, and drafts an instant personalized email reply.`,
    googleTasks: [
      {
        title: 'Make.com और Zapier पर 3 कोर वर्कफ़्लोज़ का लाइव डेमो बनाएं',
        notes: '1. Lead Qualifier, 2. Social Media Auto-Poster, 3. Invoice Extractor.',
        dayOffset: 1,
      },
      {
        title: 'Upwork पर 5 स्पेसिफिक Zapier/Make जॉब्स पर प्रपोजल भेजें',
        notes: 'प्रपोजल में अपने बने हुए वर्कफ़्लो का स्क्रीनशॉट या Loom वीडियो अटैच करें।',
        dayOffset: 3,
      },
      {
        title: 'पहला कंसल्टेशन कॉल बुक करें और क्लाइंट की समस्या समझें',
        notes: 'कैलेंडली लिंक शेयर करें।',
        dayOffset: 7,
      },
    ],
    monetizationChannels: [
      'Project-based automation fee (₹20,000 - ₹80,000 per flow)',
      'Hourly automation consulting ($40 - $100/hr)',
      'Monthly maintenance retainer',
    ],
    proTips: [
      'स्टार्टअप्स ऑटोमेशन के लिए खुशी-खुशी बड़ी रकम चुकाते हैं क्योंकि यह उनके कई कर्मचारियों का समय बचाती है।',
    ],
  },
  {
    id: 'ai-micro-saas-tools',
    title: 'AI Micro-SaaS और कस्टम टूल्स (Cursor + Gemini)',
    tagline: 'AI कोडिंग टूल्स से खुद का छोटा वेब ऐप बनाएं और सब्सक्रिप्शन मॉडल से रिकरिंग कमाई करें।',
    category: 'SaaS',
    earningPotential: '₹1,00,000 - ₹5,00,000+ / माह',
    timeToFirstRupee: '30 - 60 दिन',
    difficulty: 'Advanced',
    investmentRequired: '₹1,500 (डोमेन + होस्टिंग)',
    description:
      'आज बिना कोडिंग बैकग्राउंड के भी आप Cursor, v0 या Gemini API की मदद से छोटे सिंगल-परपज टूल्स बना सकते हैं (जैसे: AI Resume Enhancer, YouTube Thumbnail Scorer, Instagram Caption Generator)। Stripe या LemonSqueezy से मंथली $9-$29 सब्सक्रिप्शन लें।',
    toolsNeeded: [
      { name: 'Gemini API (AI Intelligence)', isFree: true, badge: 'Free tier' },
      { name: 'Cursor / VS Code (AI Coding)', isFree: true, badge: 'Freemium' },
      { name: 'Vite + React + Tailwind (Frontend)', isFree: true, badge: 'Free' },
      { name: 'LemonSqueezy / Stripe (Payments)', isFree: true, badge: 'Free setup' },
    ],
    keySteps: [
      'एक स्पेसिफिक समस्या ढूंढें (उदा: रियल एस्टेट एजेंट्स के लिए 1-क्लिक प्रॉपर्टी डिस्क्रिप्शन जनरेटर)।',
      'Cursor और React की मदद से 48 घंटे में MVP (Minimum Viable Product) तैयार करें।',
      'LemonSqueezy पेमेंट गेटवे जोड़कर ₹499/माह का प्लान रखें।',
      'Reddit (r/SideProject), Product Hunt और Twitter पर लॉन्च करें।',
    ],
    starterPrompt: `Give me 5 highly profitable Micro-SaaS ideas that solve painful daily problems for freelancers or small business owners in 2026. For each idea, outline the core 1-feature MVP, the Gemini API prompt pipeline, and the pricing strategy.`,
    googleTasks: [
      {
        title: 'Micro-SaaS आइडिया और ऑडियंस वैलिडेट करें',
        notes: 'Reddit और Twitter पर देखें कि लोग किस काम के लिए शिकायत कर रहे हैं।',
        dayOffset: 1,
      },
      {
        title: 'Cursor / AI Studio में 3 दिन में फंक्शनल MVP बनाएं',
        notes: 'Keep only 1 main hero feature that works flawlessly.',
        dayOffset: 3,
      },
      {
        title: 'LemonSqueezy / Stripe पेमेंट लिंक और यूजर ऑथेंटिकेशन जोड़ें',
        notes: 'Free tier (3 uses) + Pro tier ($9/month) सेट करें।',
        dayOffset: 7,
      },
      {
        title: 'Product Hunt, Indie Hackers और Twitter पर लॉन्च करें',
        notes: 'लॉन्च डिस्काउंट कोड "LIFETIME50" ऑफर करें।',
        dayOffset: 14,
      },
    ],
    monetizationChannels: [
      'Monthly / Yearly SaaS Subscriptions ($9 - $29/mo)',
      'Lifetime Deals on AppSumo',
      'API Usage Credits',
    ],
    proTips: [
      'जटिल बड़ा सॉफ्टवेयर बनाने की कोशिश न करें; एक छोटा टूल बनाएं जो एक काम 100% परफेक्ट करे।',
    ],
  },
];

export const AI_PROMPTS_VAULT = [
  {
    id: 'p1',
    category: 'YouTube & Video',
    title: 'वायरल YouTube Shorts हुक और स्क्रिप्ट जनरेटर',
    prompt: `तुम YouTube के नंबर 1 स्क्रिप्ट राइटर हो। मुझे [विषय डालें, जैसे: 3 AI Websites That Feel Illegal To Know] पर एक 50-सेकंड की हाई-रिटेंशन स्क्रिप्ट बना कर दो।
संरचना:
1. Hook (0-3 sec): एक चौंकाने वाला सवाल या दृश्य जो यूजर को स्क्रॉल करने से रोके।
2. Problem (4-15 sec): आम गलती जो 99% लोग करते हैं।
3. AI Solution (16-40 sec): 3 स्टेप्स या टूल्स का प्रैक्टिकल नाम।
4. CTA (41-50 sec): "पार्ट 2 के लिए फॉलो करें और बायो में लिंक चेक करें।"`,
  },
  {
    id: 'p2',
    category: 'Client Outreach',
    title: 'क्लाइंट्स को डायरेक्ट ईमेल/DM भेजने का हाई-कन्वर्जन टेम्पलेट',
    prompt: `Write a friendly, personalized, zero-spam cold outreach message to an Instagram business owner / agency founder offering AI content repurposing services.
Rules:
- Compliment a specific recent post
- Identify 1 clear opportunity where they are leaving money on the table (e.g. not turning long videos into 10 viral shorts)
- Offer a FREE sample video with no obligation
- Keep it under 100 words. No sales jargon.`,
  },
  {
    id: 'p3',
    category: 'Digital Products',
    title: '30-दिन का Notion AI प्लानर कंटेंट क्रिएटर',
    prompt: `Create the full layout, daily habit tracking structure, and prompt library for a digital product titled: "30-Day Solopreneur AI Growth Blueprint". Include 4 distinct weekly phases with exact checklist items that users can tick off every single day.`,
  },
  {
    id: 'p4',
    category: 'SEO & Copywriting',
    title: '100% ह्यूमन-लाइक SEO ब्लॉग आर्टिकल मास्टर प्रॉम्प्ट',
    prompt: `Write an engaging, insightful 1500-word article on [Insert Topic]. 
Requirements:
- Natural conversational rhythm with varying sentence lengths
- Include FAQ section with schema markup format
- Use bullet points, bold key terms, and actionable takeaways
- Avoid clichés like "In today's fast-paced digital world" or "delve into"
- Include 3 practical real-world examples.`,
  },
];
