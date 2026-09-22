import { MonetizationMethod, CustomRoadmapPlan } from '../types';

export const ADDITIONAL_DYNAMIC_METHODS: MonetizationMethod[] = [
  {
    id: 'ai-voiceover-audiobooks',
    title: 'AI वॉयसओवर व ऑडियोबुक प्रोडक्शन',
    tagline: 'ElevenLabs और AI ऑडियो टूल्स से पॉडकास्ट, विज्ञापनों और ऑडियोबुक्स के लिए वॉयसओवर दें।',
    category: 'Freelance',
    earningPotential: '₹35,000 - ₹1,40,000 / माह',
    timeToFirstRupee: '10 - 20 दिन',
    difficulty: 'Easy',
    investmentRequired: '₹0 (फ्री टियर से शुरुआत)',
    description:
      'ACX, Audible, KDP लेखकों और YouTube क्रिएटर्स को अपनी किताबों और वीडियो के लिए क्रिस्प वॉयसओवर चाहिए। आप AI वॉयस क्लोनिंग व ऑडियो एन्हांसमेंट से 10 मिनट में रिकॉर्डिंग तैयार कर सकते हैं।',
    toolsNeeded: [
      { name: 'ElevenLabs (Ultra-realistic Voice)', isFree: true, badge: 'Freemium' },
      { name: 'Adobe Podcast AI (Audio Polish & Noise Removal)', isFree: true, badge: 'Free' },
      { name: 'Audacity (Open-source Editing)', isFree: true, badge: 'Free' },
      { name: 'Fiverr / Upwork (Client Marketplace)', isFree: true, badge: 'Free' },
    ],
    keySteps: [
      'ElevenLabs पर 3 अलग-अलग टोन (Storytelling, Corporate, Excited Ad) में सैंपल वॉयस डेमो बनाएं।',
      'Adobe Podcast AI से बैकग्राउंड नॉइज़ हटाकर स्टूडियो जैसी 4k साउंड बनाएं।',
      'Fiverr पर "Professional Voiceover Artist (Hindi / Indian Accent)" की गिग बनाएं।',
      'YouTube वीडियो क्रिएटर्स को 1 मिनट का फ्री ऑडियो सैंपल ईमेल करें।',
      'प्रति ऑडियो मिनट ₹200 - ₹500 चार्ज करें और 24 घंटे में डिलीवरी दें।',
    ],
    starterPrompt: `तुम एक ऑडियोबुक डायरेक्टर हो। नीचे दिए गए टेक्स्ट को पढ़ने के लिए वॉयसओवर आर्टिस्ट के लिए भावनात्मक नोट्स, पॉज (विराम चिन्ह) और सही टोन गाइड तैयार करो:
[यहाँ अपना पैराग्राफ डालें]
टोन: रहस्यमयी, गंभीर और भावनात्मक।`,
    googleTasks: [
      {
        title: 'ElevenLabs व Adobe Podcast AI सेटअप करें',
        notes: '3 हिंदी और 3 इंग्लिश डेमो वॉयसओवर फाइल्स एक्सपोर्ट करें।',
        dayOffset: 1,
      },
      {
        title: 'Fiverr और Upwork पर वॉयसओवर प्रोफाइल बनाएं',
        notes: 'सैंपल ऑडियो प्लेयर लिंक और पोर्टफोलियो जोड़ें।',
        dayOffset: 2,
      },
      {
        title: '15 YouTube चैनल्स को फ्री डेमो वॉयस मेल करें',
        notes: 'उनके हालिया वीडियो के 30 सेकंड का वॉयसओवर सैंपल बनाकर भेजें।',
        dayOffset: 3,
      },
      {
        title: 'पहला पेड ऑर्डर डिलीवर करें और 5-स्टार रेटिंग पाएं',
        notes: 'क्लाइंट को MP3 और WAV दोनों फॉर्मेट में मास्टर ऑडियो दें।',
        dayOffset: 7,
      },
    ],
    monetizationChannels: [
      'Fiverr / Upwork Audio Gig ($15 - $50 per 500 words)',
      'ACX / Audible Audiobook Royalty Share',
      'YouTube Video Voiceover Retainers',
    ],
    proTips: [
      'क्लाइंट्स को बताएं कि आप 24 घंटे के अंदर 2 फ्री रिविजन्स के साथ डिलीवरी देंगे।',
    ],
  },
  {
    id: 'ai-thumbnail-design-agency',
    title: 'AI YouTube थंबनेल व बैनर डिजाइनिंग',
    tagline: 'Midjourney और Canva AI से हाई-क्लिक YouTube थंबनेल बनाकर हर महीने लाखों कमाएं।',
    category: 'Freelance',
    earningPotential: '₹40,000 - ₹1,60,000 / माह',
    timeToFirstRupee: '7 - 14 दिन',
    difficulty: 'Easy',
    investmentRequired: '₹0',
    description:
      'YouTube पर 80% व्यूज थंबनेल के CTR (Click-Through Rate) पर निर्भर करते हैं। क्रिएटर्स ₹500 - ₹2,000 प्रति थंबनेल देने को तैयार रहते हैं। AI इमेज जनरेशन और Canva से 10 मिनट में 3D थंबनेल बनाएं।',
    toolsNeeded: [
      { name: 'Canva Pro / Free (Design & Typography)', isFree: true, badge: 'Free' },
      { name: 'Leonardo.ai / Midjourney (3D Characters & Backgrounds)', isFree: true, badge: 'Freemium' },
      { name: 'Photoroom / Clipdrop (Background Removal)', isFree: true, badge: 'Free' },
      { name: 'TestMyThumbnails (CTR Prediction)', isFree: true, badge: 'Free' },
    ],
    keySteps: [
      'टॉप वायरल यूट्यूबर्स (MrBeast, Dhruv Rathee, Ali Abdaal) के थंबनेल स्टाइल का विश्लेषण करें।',
      'Leonardo.ai से एक्सप्रेशन-बेस्ड कैरेक्टर्स और 3D बैकग्राउंड जनरेट करें।',
      'Canva में बोल्ड हाई-कंट्रास्ट टेक्स्ट और आउटलाइन जोड़ें।',
      'Twitter/X और Instagram पर 20 यूट्यूबर्स के थंबनेल का "Redesign Concept" बनाकर उन्हें टैग करें।',
      'प्रति थंबनेल ₹800 या 10 थंबनेल के मंथली पैकेज पर ₹7,000 में डील क्लोज करें।',
    ],
    starterPrompt: `Create an ultra-detailed Midjourney/Leonardo prompt for a YouTube thumbnail character:
- Subject: Shocked 3D Pixar-style digital creator holding a glowing golden laptop
- Lighting: Cyberpunk neon blue and orange rim lighting
- Background: Explosive viral chart with upward green arrows
- Style: 8k, cinematic, hyper-detailed, octane render.`,
    googleTasks: [
      {
        title: '5 वायरल शैलियों में 10 सैंपल थंबनेल तैयार करें',
        notes: 'Finance, Tech, Motivation, Gaming और Storytelling शैलियों में बनाएं।',
        dayOffset: 1,
      },
      {
        title: 'Bento / Notion पर 1-पेज पोर्टफोलियो वेबसाइट बनाएं',
        notes: '"Before vs After CTR Booster" का उदाहरण दिखाएं।',
        dayOffset: 2,
      },
      {
        title: '15 यूट्यूबर्स को फ्री थंबनेल री-डिजाइन ईमेल करें',
        notes: 'ईमेल में उनका पुराना थंबनेल और आपका नया हाई-CTR वर्जन साथ में रखें।',
        dayOffset: 3,
      },
      {
        title: 'पहला मंथली रिटेनर क्लाइंट साइन करें',
        notes: 'महीने में 12 थंबनेल का पैकेज ऑफर करें।',
        dayOffset: 7,
      },
    ],
    monetizationChannels: [
      'Direct YouTube Creator Retainers (₹15,000 - ₹35,000/creator)',
      'Fiverr / Upwork Thumbnail Packages',
      'Canva Template Packs for Sale on Gumroad',
    ],
    proTips: [
      'हमेशा थंबनेल में 3 से ज्यादा शब्द न लिखें। फोन की स्क्रीन पर बड़ा और साफ दिखना चाहिए।',
    ],
  },
  {
    id: 'ai-instagram-theme-pages',
    title: 'AI इंस्टाग्राम थीम पेज व एफिलिएट ऑटोमेशन',
    tagline: 'AI रील्स और कारोसल्स से 1 लाख फॉलोअर्स बनाएं और पेड प्रमोशन व एफिलिएट से कमाएं।',
    category: 'Content',
    earningPotential: '₹30,000 - ₹1,80,000 / माह',
    timeToFirstRupee: '30 - 60 दिन',
    difficulty: 'Medium',
    investmentRequired: '₹0',
    description:
      'Luxury Lifestyle, Stoic Philosophy, या AI Tech टिप्स के थीम पेज बनाएं। AI से 100 कारोसल्स 1 घंटे में तैयार करें और ऑटो-शेड्यूल कर दें। 20K फॉलोअर्स के बाद हर स्टोरी और बायो लिंक से कमाई शुरू करें।',
    toolsNeeded: [
      { name: 'Gemini (30 Days Content Calendar & Quotes)', isFree: true, badge: 'Free' },
      { name: 'Canva Bulk Create (Batch 50 Posts in 2 mins)', isFree: true, badge: 'Free' },
      { name: 'Meta Business Suite (Auto-Scheduling)', isFree: true, badge: 'Free' },
      { name: 'ManyChat (Auto DM & Link Delivery Bot)', isFree: true, badge: 'Freemium' },
    ],
    keySteps: [
      'हाई-एंगेजमेंट Niche चुनें (Business Motivation, AI Hacks, Wealth Habits)।',
      'Gemini से 30 दिनों के लिए 60 हाई-कन्वर्टिंग टिप्स और कोट्स जनरेट करवाएं।',
      'Canva के "Bulk Create" फीचर से 5 मिनट में 60 कारोसल्स एक्सपोर्ट करें।',
      'ManyChat जोड़ें: जब कोई कमेंट करे "SEND", उसे बायो लिंक का ऑटोमैटिक DM चला जाए।',
      'बायो में Amazon/Gumroad एफिलिएट लिंक्स और ब्रांड प्रमोशन ईमेल जोड़ें।',
    ],
    starterPrompt: `मुझे Instagram Theme Page के लिए "Rich Habits vs Poor Habits" पर 10 स्लाइड का वायरल कारोसोल कंटेंट बनाकर दो। 
हर स्लाइड में:
1. स्लाइड का छोटा कैची हेडिंग
2. 2 लाइनों में गहरा सबक
3. आखिरी स्लाइड में: "फॉलो करें और 'BOOK' कमेंट करें फ्री गाइड के लिए।"`,
    googleTasks: [
      {
        title: 'थीम पेज प्रोफाइल और बायो ऑप्टिमाइज़ करें',
        notes: 'SEO कीवर्ड्स और हाइलाइट्स कवर्स Canva से लगाएं।',
        dayOffset: 1,
      },
      {
        title: 'Gemini + Canva Bulk Create से 30 पोस्ट्स का बैच बनाएं',
        notes: '1 घंटे में पूरा 1 महीने का कंटेंट तैयार हो जाएगा।',
        dayOffset: 2,
      },
      {
        title: 'Meta Business Suite में रोज़ाना 2 पोस्ट्स शेड्यूल करें',
        notes: 'दोपहर 1 बजे और रात 8 बजे का टाइम सेट करें।',
        dayOffset: 3,
      },
      {
        title: 'ManyChat Auto-DM बॉट कनेक्ट करें',
        notes: 'कमेंट ट्रिगर पर एफिलिएट लिंक ऑटो-सेंड सेट करें।',
        dayOffset: 7,
      },
    ],
    monetizationChannels: [
      'Instagram Story / Reel Promotions (₹1,500 - ₹10,000 per post)',
      'Digital Product / eBook Sales via Bio Link',
      'Amazon & Software Affiliate Commissions',
    ],
    proTips: [
      'कंसिस्टेंसी सबसे बड़ा गेम है—अगर आप 60 दिन बिना रुके रोज़ 2 पोस्ट डालेंगे तो इंस्टाग्राम एल्गोरिदम आपको 100% बूस्ट देगा।',
    ],
  },
  {
    id: 'ai-newsletter-monetization',
    title: 'AI क्यूरेटेड वीकली ईमेल न्यूज़लेटर',
    tagline: 'हफ्ते में सिर्फ 1 घंटा AI से न्यूज़लेटर लिखकर स्पॉन्सरशिप और पेड सब्सक्रिप्शन से कमाएं।',
    category: 'Content',
    earningPotential: '₹50,000 - ₹2,50,000 / माह',
    timeToFirstRupee: '30 - 45 दिन',
    difficulty: 'Medium',
    investmentRequired: '₹0 (beehiiv / Substack पर फ्री शुरुआत)',
    description:
      'हफ्ते भर के बेस्ट AI टूल्स, टेक अपडेट्स या बिजनेस केस स्टडीज को Gemini से समराइज करवाकर 5 मिनट की रीडेबल ईमेल भेजें। 5,000 सब्सक्राइबर्स होते ही स्पॉन्सर कंपनियां प्रति ईमेल ₹10,000 - ₹30,000 देती हैं।',
    toolsNeeded: [
      { name: 'beehiiv / Substack (Newsletter Platform)', isFree: true, badge: 'Free' },
      { name: 'Gemini 2.5 Flash (Research & Summarization)', isFree: true, badge: 'Free' },
      { name: 'Twitter/X & LinkedIn (Subscriber Growth)', isFree: true, badge: 'Free' },
      { name: 'SparkLoop / beehiiv Boosts (Paid Recommendations)', isFree: true, badge: 'Free' },
    ],
    keySteps: [
      'beehiiv पर "AI Weekly Insights" नाम से 100% फ्री न्यूज़लेटर बनाएं।',
      'Gemini से हफ्ते के 5 सबसे उपयोगी AI टूल्स और उनकी 2-लाइन समरी तैयार करवाएं।',
      'हर शनिवार सुबह 9 बजे न्यूज़लेटर ऑटो-सेंड शेड्यूल करें।',
      'LinkedIn और Twitter पर न्यूज़लेटर के मुख्य अंश पोस्ट करके सब्सक्राइब लिंक शेयर करें।',
      'beehiiv Ad Network और डायरेक्ट सॉफ्टवेयर कंपनियों से स्पॉन्सरशिप स्वीकार करें।',
    ],
    starterPrompt: `तुम दुनिया के सबसे लोकप्रिय टेक न्यूज़लेटर (जैसे The Hustle या TLDR) के एडिटर हो। मुझे इस हफ्ते के 5 सबसे क्रांतिकारी AI टूल्स की रोचक समरी लिख कर दो:
प्रत्येक टूल के लिए:
- नाम और 1-लाइन हुक
- यह किसी का 5 घंटा समय कैसे बचाएगा?
- फ्री है या पेड?
टोन: सरल, मजेदार, बिना किसी बोरिंग तकनीकी शब्दावली के।`,
    googleTasks: [
      {
        title: 'beehiiv / Substack पर न्यूज़लेटर पब्लिकेशन बनाएं',
        notes: 'वेलकम ईमेल और ब्रांडिंग कलर्स सेट करें।',
        dayOffset: 1,
      },
      {
        title: 'Gemini से पहला एडिशन लिखें और खुद को टेस्ट ईमेल भेजें',
        notes: 'मोबाइल पर फॉर्मेटिंग और लिंक्स चेक करें।',
        dayOffset: 2,
      },
      {
        title: 'LinkedIn और WhatsApp कम्युनिटी में पहला एडिशन शेयर करें',
        notes: 'पहले 100 सब्सक्राइबर्स अपने नेटवर्क से जोड़ें।',
        dayOffset: 3,
      },
      {
        title: 'beehiiv Ad Network ऑन करें और स्पॉन्सरशिप चालू करें',
        notes: '1,000 रीडर्स पहुंचते ही मोनेटाइजेशन एक्टिव हो जाएगा।',
        dayOffset: 15,
      },
    ],
    monetizationChannels: [
      'beehiiv Ad Network & Sponsored Slots ($20 - $50 per 1,000 opens)',
      'Affiliate Tool Links inside newsletter',
      'Premium Paid Subscriber Tier (₹299/mo)',
    ],
    proTips: [
      'न्यूज़लेटर को कभी भी लंबा न बनाएं; 3 से 5 मिनट में पढ़ने योग्य बुलेट पॉइंट्स सबसे ज्यादा पसंद किए जाते हैं।',
    ],
  },
  {
    id: 'ai-lead-generation-b2b',
    title: 'AI B2B लीड जेनरेशन व कोल्ड ईमेल एजेंसी',
    tagline: 'कंपनियों के लिए हाई-वैल्यू क्लाइंट्स की लीड्स निकालें और प्रति मीटिंग ₹3,000 - ₹10,000 चार्ज करें।',
    category: 'Freelance',
    earningPotential: '₹60,000 - ₹2,50,000 / माह',
    timeToFirstRupee: '14 - 25 दिन',
    difficulty: 'Medium',
    investmentRequired: '₹0',
    description:
      'हर सॉफ्टवेयर कंपनी और एजेंसी को नए क्लाइंट्स चाहिए। Apollo.io और Gemini की मदद से 500 टारगेटेड कंपनियों के डिसीजन मेकर्स की ईमेल लिस्ट निकालें और AI से पर्सनलाइज्ड कोल्ड ईमेल भेजकर उनके लिए मीटिंग्स बुक करें।',
    toolsNeeded: [
      { name: 'Apollo.io / LinkedIn Sales Nav (Lead Finding)', isFree: true, badge: 'Free tier' },
      { name: 'Gemini (Hyper-Personalized Icebreakers)', isFree: true, badge: 'Free' },
      { name: 'Instantly.ai / GMass (Cold Email Engine)', isFree: true, badge: 'Free trial' },
      { name: 'Google Sheets (Lead Database Management)', isFree: true, badge: 'Free' },
    ],
    keySteps: [
      'एक स्पेसिफिक इंडस्ट्री चुनें (उदा: Real Estate Brokerages, Fitness Brands, US SaaS Startups)।',
      'Apollo.io से 100 वेरीफाइड फाउंडर्स और मार्केटिंग डायरेक्टर्स के ईमेल एक्सपोर्ट करें।',
      'Gemini से हर कंपनी की वेबसाइट देखकर 1 पर्सनलाइज्ड फर्स्ट लाइन लिखवाएं।',
      'क्लाइंट को "Pay Per Booked Meeting" मॉडल ऑफर करें (₹5,000 प्रति क्वालिफाइड मीटिंग)।',
      'महीने में 10 मीटिंग्स बुक करके ₹50,000 - ₹1,00,000 शुद्ध मुनाफा कमाएं।',
    ],
    starterPrompt: `Below is the LinkedIn profile summary and website info of a CEO:
[CEO Info]
Write a 3-sentence non-pushy, high-converting cold email asking if they have capacity for 5 new high-ticket clients next month.
Rules:
- Sentence 1: Ultra-specific compliment about their company
- Sentence 2: The exact offer with social proof
- Sentence 3: Low-friction CTA ("Open to a 6-minute chat this Thursday?")`,
    googleTasks: [
      {
        title: 'Apollo.io फ्री अकाउंट बनाएं और 50 B2B लीड्स निकालें',
        notes: 'CEO, Founder और Head of Growth फिल्टर्स लगाएं।',
        dayOffset: 1,
      },
      {
        title: 'Gemini से 3-स्टेप कोल्ड ईमेल सीक्वेंस तैयार करें',
        notes: 'Initial email, 3-day follow up, और final breakup email बनाएं।',
        dayOffset: 2,
      },
      {
        title: 'पहला कोल्ड कैंपेन लॉन्च करें (25 ईमेल्स/दिन)',
        notes: 'ओपन रेट और रिप्लाई रेट ट्रैक करें।',
        dayOffset: 3,
      },
      {
        title: 'पहली क्वालिफाइड क्लाइंट मीटिंग बुक करें और डील फाइनल करें',
        notes: 'कैलेंडली स्लॉट कन्फर्मेशन भेजें।',
        dayOffset: 10,
      },
    ],
    monetizationChannels: [
      'Pay-per-meeting Model (₹4,000 - ₹12,000 per qualified demo call)',
      'Monthly Retainer for Outbound Sales (₹40,000/month)',
      'Sales Commission (% of closed deal)',
    ],
    proTips: [
      'कोल्ड ईमेल में कभी भी लंबा पैराग्राफ न लिखें—मोबाइल स्क्रीन पर पूरा ईमेल बिना स्क्रॉल किए दिखना चाहिए।',
    ],
  },
  {
    id: 'ai-ecommerce-mockups-pod',
    title: 'AI प्रिंट-ऑन-डिमांड व ई-कॉमर्स मर्चेंडाइज',
    tagline: 'Midjourney से ट्रेंडिंग ग्राफिक्स जनरेट करें और बिना इन्वेंट्री के टी-शर्ट्स/हुडीज बेचें।',
    category: 'Digital Products',
    earningPotential: '₹30,000 - ₹1,20,000 / माह',
    timeToFirstRupee: '20 - 35 दिन',
    difficulty: 'Easy',
    investmentRequired: '₹0 (प्रिंट-ऑन-डिमांड मॉडल)',
    description:
      'Printrove, Blinkstore या Printful पर फ्री में अपनी टी-शर्ट और हुडी स्टोर खोलें। AI से जापानी एनीमे, फिटनेस मोटिवेशन, या कोडिंग मीम्स के हाई-रेजोल्यूशन ग्राफिक्स बनाएं। जब कोई ऑर्डर करेगा, कंपनी खुद प्रिंट और डिलीवर करेगी, मुनाफा सीधे आपके बैंक में।',
    toolsNeeded: [
      { name: 'Leonardo.ai / Midjourney (Graphic Art Generation)', isFree: true, badge: 'Freemium' },
      { name: 'Vectorizer.ai / Upscayl (4K Vector Upscaling)', isFree: true, badge: 'Free' },
      { name: 'Blinkstore / Printrove (India POD Fulfillment)', isFree: true, badge: 'Free' },
      { name: 'Canva / Placeit (Realistic Model Mockups)', isFree: true, badge: 'Free' },
    ],
    keySteps: [
      'Blinkstore या Printrove पर 0 रुपये में अपनी मर्चेंडाइज स्टोर बनाएं।',
      'Pinterest और Instagram पर ट्रेंडिंग टी-शर्ट डिजाइन्स (उदा: Retro Cyberpunk, Minimalist Typography) ढूंढें।',
      'AI से ट्रांसपेरेंट PNG आर्टवर्क जनरेट करें और Vectorizer.ai से 300 DPI में स्केल करें।',
      'Canva में AI मॉडल मॉकअप्स बनाएं और Instagram Reels / Pinterest पर शेयर करें।',
      'हर टी-शर्ट बिक्री पर ₹300 - ₹600 का शुद्ध प्रॉफिट मार्जिन रखें।',
    ],
    starterPrompt: `Create a clean, isolated vector graphic t-shirt design:
Subject: Cyberpunk Samurai cat wearing futuristic headphones and neon jacket.
Style: Japanese aesthetic, crisp clean lines, vibrant vector colors, isolated on pure white background, no text, screen printing ready.`,
    googleTasks: [
      {
        title: 'Blinkstore / Printful पर फ्री स्टोर रजिस्टर करें',
        notes: 'पेमेंट बैंक अकाउंट और UPI सेट करें।',
        dayOffset: 1,
      },
      {
        title: 'AI से 10 ट्रेंडिंग टी-शर्ट ग्राफिक्स जनरेट और अपस्केल करें',
        notes: '300 DPI ट्रांसपेरेंट PNG फाइल्स एक्सपोर्ट करें।',
        dayOffset: 2,
      },
      {
        title: 'स्टोर पर प्रोडक्ट्स लिस्ट करें और कीमतें सेट करें',
        notes: 'टी-शर्ट ₹699 (प्रॉफिट मार्जिन ₹300) सेट करें।',
        dayOffset: 3,
      },
      {
        title: 'Pinterest और Instagram पर पहला रील्स वीडियो पोस्ट करें',
        notes: 'बायो में स्टोर लिंक और 10% डिस्काउंट कूपन डालें।',
        dayOffset: 5,
      },
    ],
    monetizationChannels: [
      'Print-on-Demand Profit Margins (₹300 - ₹700 per sale)',
      'Etsy Digital Art / SVG Design Packs',
      'Custom Merchandise for Influencers',
    ],
    proTips: [
      'Pinterest पर हर डिजाइन के 5 अलग-अलग मॉकअप्स पिन करें—वहां से 6 महीने तक लगातार फ्री ऑर्गेनिक ट्रैफिक आता रहता है।',
    ],
  },
];
