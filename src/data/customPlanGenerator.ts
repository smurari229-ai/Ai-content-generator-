import { CustomRoadmapPlan } from '../types';

export interface PlanGeneratorParams {
  niche: string;
  dailyTime: string;
  budget: string;
  skillLevel: string;
  earningGoal?: string;
  language?: 'hindi' | 'english';
}

export function generateRealistic30DayPlan(params: PlanGeneratorParams): CustomRoadmapPlan {
  const { niche, dailyTime, budget, skillLevel, earningGoal } = params;

  const isContent = niche.toLowerCase().includes('youtube') || niche.toLowerCase().includes('reels') || niche.toLowerCase().includes('content');
  const isFreelance = niche.toLowerCase().includes('copywriting') || niche.toLowerCase().includes('freelanc') || niche.toLowerCase().includes('voice');
  const isAgency = niche.toLowerCase().includes('chatbot') || niche.toLowerCase().includes('local business') || niche.toLowerCase().includes('agency');
  const isDigitalProducts = niche.toLowerCase().includes('digital') || niche.toLowerCase().includes('notion') || niche.toLowerCase().includes('prompt');
  const isAutomation = niche.toLowerCase().includes('automation') || niche.toLowerCase().includes('zapier') || niche.toLowerCase().includes('make');

  let title = `30-दिन का AI कमाई मास्टर प्लान`;
  let subtitle = `${dailyTime} और ${budget} के साथ शुरुआत`;
  let overview = `यह 30-दिन का व्यावहारिक एक्शन प्लान विशेष रूप से आपके उपलब्ध समय (${dailyTime}) और बजट (${budget}) को ध्यान में रखकर तैयार किया गया है। इसमें दिन-प्रतिदिन के स्पष्ट कार्य दिए गए हैं ताकि आप पहले दिन से व्यावहारिक काम शुरू कर सकें और 30 दिनों में अपनी पहली आय प्राप्त कर सकें।`;

  let m1 = earningGoal ? `₹${(parseInt(earningGoal.replace(/\D/g, '')) * 0.2 || 10000).toLocaleString('en-IN')}` : '₹10,000 - ₹25,000';
  let m3 = earningGoal ? `₹${(parseInt(earningGoal.replace(/\D/g, '')) * 0.6 || 45000).toLocaleString('en-IN')}` : '₹40,000 - ₹80,000';
  let m6 = earningGoal ? `₹${(parseInt(earningGoal.replace(/\D/g, '')) * 1.2 || 120000).toLocaleString('en-IN')}` : '₹1,00,000 - ₹2,50,000+';

  if (isContent) {
    title = `30-दिन का AI Content & Reels मोनेटाइजेशन प्लान`;
    subtitle = `बिना चेहरा दिखाए AI से वायरल वीडियो बनाकर AdSense और Sponsorship कमाएं`;
    overview = `इस 30-दिन के रोडमैप में आप प्रतिदिन 1-2 AI शॉर्ट्स और रील्स बनाकर YouTube और Instagram पर ऑर्गेनिक ऑडियंस तैयार करेंगे। Gemini से स्क्रिप्ट, ElevenLabs से वॉयसओवर और Canva/CapCut से ऑटोमेटेड वीडियो तैयार किए जाएंगे।`;
  } else if (isFreelance) {
    title = `30-दिन का AI फ्रीलांसिंग व कॉपीराइटिंग प्लान`;
    subtitle = `Fiverr, Upwork और LinkedIn से हाई-पेइंग इंटरनेशनल क्लाइंट्स हासिल करें`;
    overview = `इस 30-दिन के रोडमैप में आप अपने कौशल का 3-पीस पोर्टफोलियो तैयार करेंगे, 50+ बिजनेस ओनर्स को पर्सनलाइज्ड कोल्ड पिचेस भेजेंगे और अपने पहले 3 पेड फ्रीलांस क्लाइंट्स हासिल करेंगे।`;
  } else if (isAgency) {
    title = `30-दिन का लोकल बिजनेस AI चैटबॉट व एजेंसी प्लान`;
    subtitle = `डॉक्टर्स, रेस्टोरेंट्स और रियल एस्टेट ब्रोकर्स को AI लीड बॉट बेचकर मंथली रिटेनर कमाएं`;
    overview = `इस 30-दिन के रोडमैप में आप बिना कोडिंग के Voiceflow या Chatbase पर एक फंक्शनल डेमो बॉट बनाएंगे, 30 लोकल बिजनेसेज को डेमो भेजेंगे और ₹15,000 वन-टाइम + ₹3,000 मंथली मेंटेनेंस पर 2 क्लाइंट्स क्लोज करेंगे।`;
  } else if (isDigitalProducts) {
    title = `30-दिन का AI डिजिटल प्रोडक्ट्स व Notion टेम्पलेट प्लान`;
    subtitle = `Gumroad और Instamojo पर पैसिव इनकम स्टोर बनाएं`;
    overview = `इस 30-दिन के रोडमैप में आप एक हाई-वैल्यू AI प्रॉम्प्ट गाइड या Notion प्रोडक्ट तैयार करेंगे, प्रीमियम 3D कवर डिजाइन करेंगे और सोशल मीडिया वैल्यू पोस्ट्स के माध्यम से पहली 50 सेल्स करेंगे।`;
  }

  // 30 actionable daily tasks with title, notes, and dayOffset 1-30
  const dailyTasks = [
    // Phase 1 (Day 1 - 7): Foundation & Skill Setup
    {
      dayOffset: 1,
      title: 'Day 1: Niche रिसर्च और मार्केट अवसर की पहचान',
      notes: 'YouTube, Instagram या Upwork पर देखें कि इस फील्ड में कौन से टॉपिक्स सबसे ज्यादा ट्रेंड कर रहे हैं। 3 कोर सब-टॉपिक्स नोट करें।',
    },
    {
      dayOffset: 2,
      title: 'Day 2: AI टूल्स अकाउंट्स व वर्कस्पेस सेटअप',
      notes: 'Gemini, ChatGPT, Canva और Notion पर फ्री अकाउंट बनाएं और आवश्यक टेम्पलेट्स सेव करें।',
    },
    {
      dayOffset: 3,
      title: 'Day 3: कोर प्रॉम्प्ट लाइब्रेरी और मास्टर टेम्पलेट्स तैयार करना',
      notes: 'अपने काम के लिए 5 ऐसे मास्टर प्रॉम्प्ट्स टेस्ट करें जो कम से कम समय में 95% सटीक परिणाम देते हों।',
    },
    {
      dayOffset: 4,
      title: 'Day 4: पहला प्रोटोटाइप / सैंपल आउटपुट बनाना',
      notes: 'AI की मदद से अपना पहला पूरा सैंपल (वीडियो/आर्टिकल/बॉट/गाइड) बनाएं और क्वालिटी चेक करें।',
    },
    {
      dayOffset: 5,
      title: 'Day 5: कमियों को ठीक करना और ह्यूमन टच जोड़ना',
      notes: 'AI आउटपुट में अपनी व्यक्तिगत स्टाइल, सही फैक्ट्स और आकर्षक विजुअल्स जोड़ें।',
    },
    {
      dayOffset: 6,
      title: 'Day 6: सोशल प्रोफाइल्स / प्लेटफॉर्म सेटअप (Fiverr / YouTube / Gumroad)',
      notes: 'प्रोफाइल पिक्चर, हाई-कंट्रास्ट बैनर और SEO कीवर्ड्स से भरपूर बायो लिखें।',
    },
    {
      dayOffset: 7,
      title: 'Day 7: वीक 1 का रीकैप व 3 फाइनल सैंपल्स की तैयारी',
      notes: 'अपने काम के 3 सबसे बेहतरीन सैंपल्स को Google Drive या Notion पोर्टफोलियो में सुरक्षित रखें।',
    },

    // Phase 2 (Day 8 - 15): Portfolio & Content Engine
    {
      dayOffset: 8,
      title: 'Day 8: पोर्टफोलियो वेबसाइट या लिंक-इन-बायो पेज तैयार करना',
      notes: 'Bento.me, Linktree या Notion पर 1-पेज का सुंदर शोकेस तैयार करें।',
    },
    {
      dayOffset: 9,
      title: 'Day 9: पहले 5 पीसेस कंटेंट / सर्विस पैकेज का प्रोडक्शन',
      notes: 'AI की मदद से 5 रेडी-टू-पब्लिश आइटम्स तैयार करें (5 रील्स या 5 ब्लॉग ड्राफ्ट्स)।',
    },
    {
      dayOffset: 10,
      title: 'Day 10: पहला पब्लिक पब्लिश / पहली सर्विस लिस्टिंग लाइव करना',
      notes: 'अपने पहले काम को लाइव करें और एनालिटिक्स ट्रैक करना शुरू करें।',
    },
    {
      dayOffset: 11,
      title: 'Day 11: ऑडियंस एंगेजमेंट और रिलेवेंट ग्रुप्स में वैल्यू शेयरिंग',
      notes: 'Reddit, LinkedIn, Facebook Groups में बिना स्पैम किए लोगों की समस्याओं के जवाब दें।',
    },
    {
      dayOffset: 12,
      title: 'Day 12: बैच प्रोडक्शन - अगले 5 आइटम्स तैयार करना',
      notes: 'कंसिस्टेंसी बनाए रखने के लिए 2 दिन पहले का बफर स्टॉक तैयार रखें।',
    },
    {
      dayOffset: 13,
      title: 'Day 13: कीवर्ड रिसर्च और SEO ऑप्टिमाइज़ेशन',
      notes: 'सर्च वॉल्यूम चेक करें और टाइटल में 2 सर्च होने वाले कीवर्ड्स शामिल करें।',
    },
    {
      dayOffset: 14,
      title: 'Day 14: एनालिटिक्स रिव्यू: क्या काम कर रहा है और क्या नहीं?',
      notes: 'व्यूज, क्लिक्स और इम्प्रेशन्स का डेटा देखें। सबसे ज्यादा पसंद किए गए टॉपिक पर फोकस करें।',
    },
    {
      dayOffset: 15,
      title: 'Day 15: मिड-प्लान रिव्यू: वीक 2 का लक्ष्य पूरा करना',
      notes: 'अब आपके पास 10+ लाइव एसेट्स या 1 मजबूत पोर्टफोलियो तैयार है।',
    },

    // Phase 3 (Day 16 - 23): Outreach & Audience Growth
    {
      dayOffset: 16,
      title: 'Day 16: 20 टारगेटेड संभावित क्लाइंट्स / ऑडियंस की लिस्ट बनाना',
      notes: 'Google Maps, LinkedIn या Instagram से 20 संभावित ग्राहकों की लिस्ट बनाएं।',
    },
    {
      dayOffset: 17,
      title: 'Day 17: AI पर्सनलाइज्ड आउटरीच मैसेज / ईमेल ड्राफ्ट करना',
      notes: 'Gemini से हर क्लाइंट के लिए 3 लाइन का वैल्यू-फर्स्ट मैसेज तैयार करवाएं।',
    },
    {
      dayOffset: 18,
      title: 'Day 18: पहले 10 क्लाइंट्स को डायरेक्ट संपर्क करना',
      notes: 'उन्हें कोई फ्री वैल्यू (फ्री वीडियो री-डिजाइन या 500-वर्ड सैंपल) ऑफर करें।',
    },
    {
      dayOffset: 19,
      title: 'Day 19: बाकी 10 क्लाइंट्स को संपर्क और सोशल पोस्टिंग जारी रखना',
      notes: 'अपनी मुख्य प्रोफाइल पर लगातार वैल्यू पोस्ट्स डालते रहें।',
    },
    {
      dayOffset: 20,
      title: 'Day 20: फॉलो-अप मैसेजिंग (48-घंटे बाद का रिमाइंडर)',
      notes: 'जिन्होंने रिप्लाई नहीं दिया, उन्हें 1 छोटा फ्रेंडली फॉलो-अप भेजें।',
    },
    {
      dayOffset: 21,
      title: 'Day 21: पहले रिस्पॉन्स पर बातचीत और आवश्यकता समझना',
      notes: 'क्लाइंट की मुख्य समस्या समझें और उन्हें अपना समाधान बताएं।',
    },
    {
      dayOffset: 22,
      title: 'Day 22: एफिलिएट प्रोग्राम या पेमेंट गेटवे (Instamojo/Razorpay) सेटअप',
      notes: 'पैसे सीधे बैंक अकाउंट में प्राप्त करने के लिए पेमेंट लिंक रेडी रखें।',
    },
    {
      dayOffset: 23,
      title: 'Day 23: पहला डेमो कॉल या फ्री ट्रायल डिलीवरी',
      notes: 'क्लाइंट को अपनी स्पीड और AI क्वालिटी से पूरी तरह संतुष्ट करें।',
    },

    // Phase 4 (Day 24 - 30): First Revenue & Scaling
    {
      dayOffset: 24,
      title: 'Day 24: पहली पेड डील या पहली प्रोडक्ट सेल क्लोज करना',
      notes: 'पेमेंट लिंक शेयर करें और इनवॉइस / कन्फर्मेशन भेजें।',
    },
    {
      dayOffset: 25,
      title: 'Day 25: 100% परफेक्शन के साथ फाइनल डिलीवरी पूरी करना',
      notes: 'क्लाइंट को तय समय से पहले काम दें और 1 एक्स्ट्रा बोनस गिफ्ट करें।',
    },
    {
      dayOffset: 26,
      title: 'Day 26: 5-स्टार रिव्यू और टेस्टिमोनियल कलेक्ट करना',
      notes: 'क्लाइंट से 2 लाइन का फीडबैक लें और अपने पोर्टफोलियो में लगाएं।',
    },
    {
      dayOffset: 27,
      title: 'Day 27: रिटेनर या रिपीट बिजनेस का प्रस्ताव रखना',
      notes: 'क्लाइंट को मंथली पैकेज पर 15% डिस्काउंट के साथ रेगुलर सर्विस ऑफर करें।',
    },
    {
      dayOffset: 28,
      title: 'Day 28: पूरे वर्कफ़्लो को ऑटोमेट या टेम्पलेटाइज करना',
      notes: 'जो काम दोहराव वाले हैं, उनके लिए Make/Zapier या AI शॉर्टकट्स बनाएं।',
    },
    {
      dayOffset: 29,
      title: 'Day 29: महीने 2 के लिए 3 गुना बड़ा लक्ष्य निर्धारित करना',
      notes: 'प्राइसिंग को 20% बढ़ाएं और आउटरीच की संख्या दोगुनी करें।',
    },
    {
      dayOffset: 30,
      title: 'Day 30: 30-दिन की सफलता का जश्न और अगला लेवल शुरू करना',
      notes: 'अपनी कमाई का विश्लेषण करें और इस सिस्टम को लगातार जारी रखें!',
    },
  ];

  return {
    title,
    subtitle,
    overview,
    potentialEarnings: {
      month1: m1,
      month3: m3,
      month6: m6,
    },
    difficulty: (skillLevel.includes('Beginner') ? 'Beginner' : skillLevel.includes('Advanced') ? 'Advanced' : 'Intermediate') as any,
    recommendedTools: [
      { name: 'Gemini 2.5 Flash', purpose: 'स्क्रिप्टिंग, रिसर्च व प्रॉम्प्टिंग', isFree: true },
      { name: 'Canva / CapCut', purpose: 'डिजाइन, वीडियो एडिटिंग व थंबनेल', isFree: true },
      { name: 'ElevenLabs / Clipchamp', purpose: 'हाई-क्वालिटी AI ऑडियो व वॉयसओवर', isFree: true },
      { name: 'Notion / Google Docs', purpose: 'वर्कस्पेस व क्लाइंट पोर्टफोलियो', isFree: true },
    ],
    roadmap: [
      {
        phase: 'Day 1-7: फाउंडेशन व बेसिक AI सेटअप (Phase 1)',
        goals: ['Niche फाइनल करना', 'सभी आवश्यक AI टूल्स सेटअप', 'पहला टेस्ट सैंपल तैयार करना'],
        actionSteps: [
          'Day 1-3: Niche रिसर्च व 5 मास्टर प्रॉम्प्ट्स तैयार करें',
          'Day 4-5: पहला AI आउटपुट बनाकर क्वालिटी टेस्ट करें',
          'Day 6-7: सोशल प्रोफाइल्स व 3 सैंपल्स का फोल्डर बनाएं',
        ],
      },
      {
        phase: 'Day 8-15: पोर्टफोलियो व कंटेंट इंजन (Phase 2)',
        goals: ['1-पेज पोर्टफोलियो लाइव करना', '10+ हाई क्वालिटी एसेट्स बनाना', 'SEO व ऑडियंस एंगेजमेंट'],
        actionSteps: [
          'Day 8-10: Bento/Notion पर पोर्टफोलियो बनाएं और पहला काम लाइव करें',
          'Day 11-13: रिलेवेंट कम्युनिटीज में वैल्यू पोस्ट करें और कीवर्ड्स लगाएं',
          'Day 14-15: एनालिटिक्स देखकर टॉप परफॉर्मिंग फॉर्मेट पहचानें',
        ],
      },
      {
        phase: 'Day 16-23: आउटरीच व पहली बातचीत (Phase 3)',
        goals: ['20+ टारगेटेड क्लाइंट्स से संपर्क', 'फ्री वैल्यू ऑफर करना', 'पेमेंट चैनल एक्टिव करना'],
        actionSteps: [
          'Day 16-18: 20 क्लाइंट्स की लिस्ट बनाकर AI पर्सनलाइज्ड पिचेस भेजें',
          'Day 19-21: 48 घंटे में फॉलो-अप करें और रिस्पॉन्स पर बात करें',
          'Day 22-23: पेमेंट गेटवे रेडी करें और फ्री डेमो डिलीवर करें',
        ],
      },
      {
        phase: 'Day 24-30: पहली कमाई व स्केलिंग (Phase 4)',
        goals: ['पहली पेड डील क्लोज करना', '5-स्टार टेस्टिमोनियल पाना', 'मंथली रिटेनर साइन करना'],
        actionSteps: [
          'Day 24-26: पेमेंट रिसीव करें, 100% परफेक्शन के साथ डिलीवरी दें और रिव्यू मांगें',
          'Day 27-28: मंथली रिटेनर डील ऑफर करें और वर्कफ़्लो ऑटोमेट करें',
          'Day 29-30: अगले महीने के लिए 3x ग्रोथ प्लान सेट करें',
        ],
      },
    ],
    googleTasks: dailyTasks,
    monetizationChannels: [
      'Direct Client Contracts / Freelance Gigs',
      'Monthly Retainer Packages (₹15,000 - ₹35,000/mo)',
      'Digital Product Sales & Affiliate Earnings',
    ],
    promptsToGetStarted: [
      {
        label: 'हाई-कन्वर्जन क्लाइंट आउटरीच प्रॉम्प्ट',
        promptText: `तुम एक प्रीमियम डिजिटल बिजनेस कंसल्टेंट हो। मुझे [इंडस्ट्री / क्लाइंट का नाम] के लिए एक 3-वाक्य का कोल्ड ईमेल लिख कर दो जो बिना स्पैमी लगे उनकी वेबसाइट या सोशल मीडिया की 1 बड़ी कमी बताए और फ्री सैंपल ऑफर करे।`,
      },
      {
        label: 'वायरल कंटेंट आइडिएशन प्रॉम्प्ट',
        promptText: `मुझे [विषय] पर 10 ऐसे हुक और वीडियो कॉन्सेप्ट्स दो जो पहले 3 सेकंड में व्यूअर का ध्यान खींच लें और 90%+ ऑडियंस रिटेंशन हासिल करें।`,
      },
    ],
    commonPitfallsToAvoid: [
      'शुरुआत में बहुत सारे टूल्स खरीदकर पैसे बर्बाद न करें; पहले फ्री टूल्स से कमाई शुरू करें।',
      'AI आउटपुट को बिना पढ़े या बिना एडिट किए सीधे क्लाइंट को न भेजें।',
      'लगातार 30 दिन काम किए बिना 3 दिन में हार न मानें—कंसिस्टेंसी ही सफलता की कुंजी है।',
    ],
    proTips: [
      'प्रतिदिन सुबह अपना पहला टास्क पूरा करें और चेकबॉक्स पर टिक लगाएं।',
      'क्लाइंट्स को रिजल्ट्स बेचें, टूल्स के नाम नहीं।',
    ],
  };
}
