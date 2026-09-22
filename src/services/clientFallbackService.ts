import {
  GeneratedContentResult,
  FreeVideoMakerBlueprint,
  VideoStoryboardScene,
  ContentTypeOption,
  ContentLanguageOption,
} from '../types';

export interface TopicCategoryInfo {
  category: 'sports' | 'food' | 'fitness' | 'tech' | 'finance' | 'education' | 'motivation' | 'entertainment' | 'general';
  icon: string;
  themeStyle: 'neon' | 'cyber' | 'gold' | 'cinematic';
  hookKeyword: string;
  accentColor: string;
}

export function detectTopicCategory(topic: string): TopicCategoryInfo {
  const t = (topic || '').toLowerCase();

  if (/(cricket|ipl|virat|rohit|dhoni|football|messi|ronaldo|match|score|sports|kabaddi|badminton|olympic|tennis|stadium|pitch|wicket)/i.test(t)) {
    return {
      category: 'sports',
      icon: '🏏',
      themeStyle: 'neon',
      hookKeyword: 'MATCH UPDATE',
      accentColor: '#0ea5e9'
    };
  }

  if (/(biryani|recipe|cooking|food|paneer|chai|sweet|cake|kitchen|chef|breakfast|dinner|snack|tasty|swad|dish|street food|restaurant|masala)/i.test(t)) {
    return {
      category: 'food',
      icon: '🍲',
      themeStyle: 'gold',
      hookKeyword: 'TASTY SECRET',
      accentColor: '#f97316'
    };
  }

  if (/(gym|workout|fitness|weight loss|fat loss|muscle|bicep|chest|yoga|exercise|diet|abs|calorie|bodybuilding|belly|running)/i.test(t)) {
    return {
      category: 'fitness',
      icon: '💪',
      themeStyle: 'neon',
      hookKeyword: 'FITNESS HACK',
      accentColor: '#ef4444'
    };
  }

  if (/(ai|chatgpt|gemini|coding|python|software|tech|phone|iphone|android|laptop|gadget|robot|app|programming|computer|developer|hack|web)/i.test(t)) {
    return {
      category: 'tech',
      icon: '🤖',
      themeStyle: 'cyber',
      hookKeyword: 'TECH SECRET',
      accentColor: '#06b6d4'
    };
  }

  if (/(game|gaming|gta|pubg|free fire|bgmi|minecraft|playstation|xbox|esports|streamer)/i.test(t)) {
    return {
      category: 'entertainment',
      icon: '🎮',
      themeStyle: 'cyber',
      hookKeyword: 'GAMING ALERT',
      accentColor: '#8b5cf6'
    };
  }

  if (/(earn|money|paisa|kamai|crypto|bitcoin|stock|share market|trading|nifty|business|dropshipping|affiliate|passive income|wealth|crore|lakh|rupee|invest|fund|rupees)/i.test(t)) {
    return {
      category: 'finance',
      icon: '💰',
      themeStyle: 'gold',
      hookKeyword: 'MONEY TRICK',
      accentColor: '#10b981'
    };
  }

  if (/(study|exam|upsc|ssc|iit|neet|history|facts|gk|quiz|student|knowledge|science|space|universe|english|learn|book|math|physics)/i.test(t)) {
    return {
      category: 'education',
      icon: '🧠',
      themeStyle: 'cinematic',
      hookKeyword: 'SHOCKING FACT',
      accentColor: '#3b82f6'
    };
  }

  if (/(motivation|success|mindset|quote|discipline|habit|inspire|life advice|sad|emotion|heartbreak|struggle|darr|himmat)/i.test(t)) {
    return {
      category: 'motivation',
      icon: '🔥',
      themeStyle: 'cinematic',
      hookKeyword: 'LIFE LESSON',
      accentColor: '#f59e0b'
    };
  }

  if (/(comedy|funny|joke|meme|prank|movie|cinema|bollywood|hollywood|horror|bhoot|ghost|mystery|viral|reel|drama|actress|actor)/i.test(t)) {
    return {
      category: 'entertainment',
      icon: '🎬',
      themeStyle: 'cinematic',
      hookKeyword: 'VIRAL STORY',
      accentColor: '#ec4899'
    };
  }

  return {
    category: 'general',
    icon: '⚡',
    themeStyle: 'neon',
    hookKeyword: 'VIRAL SECRET',
    accentColor: '#10b981'
  };
}

export function generateClientFallbackContent(
  topic: string,
  contentType: ContentTypeOption = 'YouTube Shorts',
  language: ContentLanguageOption = 'Hindi'
): GeneratedContentResult {
  const isHindi = language === 'Hindi' || language === 'Hinglish';
  const cleanTopic = (topic || 'Viral AI Video').trim();
  const info = detectTopicCategory(cleanTopic);

  let titles: string[] = [];
  let script = '';
  let description = '';
  let hashtags: string[] = [];

  if (info.category === 'sports') {
    titles = isHindi
      ? [
          `🔥 ${cleanTopic}: ये 3 रिकॉर्ड्स कोई नहीं तोड़ सकता! 🏏`,
          `क्या सच में ${cleanTopic} ने इतिहास रच दिया? देखिए पूरा सच ⚡`,
          `${cleanTopic} का ये हैरान करने वाला मोमेंट मिस मत करना! 😱`,
        ]
      : [
          `🔥 ${cleanTopic}: The Unbreakable Records & Full Truth 🏏`,
          `What Really Happened in ${cleanTopic}? Watch Till End! ⚡`,
          `Top Shocking Moments from ${cleanTopic} You Missed! 😱`,
        ];

    script = isHindi
      ? `[Hook / हुक (0-5s)]
[Visual: स्टेडियम का हाई-स्पीड ज़ूम-इन और ${cleanTopic} का डायनामिक स्लो-मोशन मोमेंट]
"अगर आप स्पोर्ट्स और ${cleanTopic} के सच्चे फैन हैं, तो ये वीडियो आपकी धड़कनें तेज कर देगा! क्या आप जानते हैं इसका सबसे बड़ा सीक्रेट?"

[Point 1 / मुख्य बात 1: सबसे बड़ा रिकॉर्ड]
[Visual: स्क्रीन पर स्टैट्स, स्कोरकार्ड और ग्राफिक्स का फास्ट पॉप-अप]
"पहली बात - ${cleanTopic} के इस ऐतिहासिक पल ने पूरे खेल जगत को हैरान कर दिया है, जिसे बड़े-बड़े एक्सपर्ट्स भी मुमकिन नहीं मान रहे थे।"

[Point 2 / मुख्य बात 2: गेम-चेंजिंग मोमेंट]
[Visual: गेम की क्रूशियल क्लिप और क्राउड का चीयरिंग रिएक्शन]
"दूसरा टर्निंग पॉइंट - जब मुकाबला कांटे का था, तब इस शानदार दांव ने पूरा मैच एक ही झटके में पलट दिया।"

[Call to Action / कॉल टू एक्शन]
[Visual: लाइक और फॉलो बटन पर एरो, कमेंट में अपनी राय का कॉल]
"क्या आपको लगता है कि ${cleanTopic} सबसे बेहतरीन था? कमेंट में अपनी राय बताएं और ऐसे ही रोमांचक अपडेट्स के लिए तुरंत फॉलो करें!"`
      : `[Hook (0-5s)]
[Visual: Fast cinematic stadium zoom-in on ${cleanTopic} action moment]
"If you are a true fan of ${cleanTopic}, this breakdown will blow your mind! Here is the unseen truth!"

[Point 1: Historic Moment]
[Visual: Scorecard and dynamic statistics graphics popping on screen]
"First, what happened in ${cleanTopic} completely defied all expert predictions and rewrote modern records."

[Point 2: Game-Changing Move]
[Visual: High-energy crowd reaction and slow-motion replay]
"Second, the exact moment that turned the entire game upside down and sealed the victory."

[Call to Action]
[Visual: Arrow pointing to follow button]
"Who is your favorite in ${cleanTopic}? Drop your comments below and follow for daily sports highlights!"`;

    description = `${cleanTopic} का पूरा विश्लेषण और सबसे रोमांचक मोमेंट्स। देखिए कैसे इस गेम ने सबको हैरान कर दिया! #SportsShorts #${cleanTopic.replace(/\s+/g, '')}`;
    hashtags = ['#SportsNews', '#TrendingShorts', '#ViralMatch', '#Cricket', '#SportsUpdate', '#GameChanger'];

  } else if (info.category === 'food') {
    titles = isHindi
      ? [
          `🍲 ${cleanTopic}: रेस्टोरेंट जैसी परफेक्ट रेसिपी का असली राज़! 😋`,
          `सिर्फ 10 मिनट में बनाएं सबसे स्वादिष्ट ${cleanTopic} (सीक्रेट मसाला) ✨`,
          `घर पर बनाएं हलवाई जैसा ${cleanTopic} - ये 1 सीक्रेट ट्रिक जान लो! 🤤`,
        ]
      : [
          `🍲 Secret to Making the Ultimate Restaurant-Style ${cleanTopic}! 😋`,
          `Make Delicious ${cleanTopic} in Just 10 Minutes (Chef Secret) ✨`,
          `Master Chef Recipe for ${cleanTopic} Revealed! 🤤`,
        ];

    script = isHindi
      ? `[Hook / हुक (0-5s)]
[Visual: गरमा-गरम ${cleanTopic} से निकलता धुआं और मुंह में पानी लाने वाला क्लोज़-अप]
"क्या आपका ${cleanTopic} रेस्टोरेंट जैसा स्वादिष्ट नहीं बनता? तो आज जान लीजिए शेफ का वो सीक्रेट जो कोई नहीं बताता!"

[Point 1 / स्टेप 1: सीक्रेट तड़का व तैयारी]
[Visual: फ्रेश मसालों और सामग्री का तेज चॉपिंग व रोस्टिंग शॉट]
"स्टेप 1 - असली स्वाद आता है सही तापमान और सीक्रेट मसाले से। इसे धीमी आंच पर 2 मिनट भूनें ताकि असली खुशबू बाहर आए।"

[Point 2 / स्टेप 2: परफेक्ट टेक्सचर व कुकिंग]
[Visual: कड़ाही में पकती हुई ग्रेवी और सही कंसिस्टेंसी का डेमो]
"स्टेप 2 - कभी भी इसमें ठंडा पानी मत डालिए, हमेशा हल्का गर्म पानी डालकर सही कंसिस्टेंसी तक पकाएं।"

[Call to Action / कॉल टू एक्शन]
[Visual: सुंदर प्लेटिंग और गार्निशिंग, सेव रेसिपी का पॉपअप]
"इस सीक्रेट रेसिपी को अभी सेव करें और अपने फूडी दोस्तों के साथ शेयर करें। अगली रेसिपी कौन सी चाहिए, कमेंट में बताएं!"`
      : `[Hook (0-5s)]
[Visual: Sizzling hot close-up of delicious ${cleanTopic}]
"Stop making bland food! Here is the chef's secret to making the most flavorful ${cleanTopic} right at home!"

[Point 1: Secret Base]
[Visual: Fresh ingredients and authentic spice sizzle]
"Step 1: The key to authentic taste is roasting the core ingredients on medium flame for exactly 2 minutes."

[Point 2: Cooking Perfection]
[Visual: Perfect simmering consistency and texture]
"Step 2: Never add cold water; always simmer with warm broth to lock in the rich flavors."

[Call to Action]
[Visual: Gorgeous finished dish and save icon]
"Save this recipe now and tag your foodie friend! What should we cook next? Tell us below!"`;

    description = `घर पर बनाएं रेस्टोरेंट से भी बेहतर ${cleanTopic}। यह आसान और स्वादिष्ट रेसिपी ज़रूर ट्राई करें! #Foodie #${cleanTopic.replace(/\s+/g, '')}`;
    hashtags = ['#FoodLovers', '#RecipeShorts', '#IndianFood', '#CookingHacks', '#TastyBites', '#ChefSecret'];

  } else if (info.category === 'fitness') {
    titles = isHindi
      ? [
          `💪 ${cleanTopic}: 30 दिनों में गजब का ट्रांसफॉर्मेशन (Zero Gym) 🔥`,
          `${cleanTopic} में 99% लोग करते हैं ये बड़ी गलती! तुरंत सुधारें ⚡`,
          `कम समय में बेस्ट रिजल्ट्स: ${cleanTopic} का साइंटिफिक तरीका 🏋️`,
        ]
      : [
          `💪 Fast Transformation with ${cleanTopic} in Just 30 Days! 🔥`,
          `Stop Doing ${cleanTopic} Like This! 99% Make This Mistake ⚡`,
          `Scientific Method for Maximum Results with ${cleanTopic} 🏋️`,
        ];

    script = isHindi
      ? `[Hook / हुक (0-5s)]
[Visual: फिट बॉडी का ट्रांसफॉर्मेशन क्लिप और ${cleanTopic} का हाई-इंटेंसिटी शॉट]
"अगर आप भी ${cleanTopic} कर रहे हैं और रिजल्ट्स नहीं मिल रहे, तो आप ये 1 भयंकर गलती कर रहे हैं! रुकिए और ध्यान से समझिए!"

[Point 1 / स्टेप 1: सही फॉर्म और माइंड-मसल कनेक्शन]
[Visual: सही वर्सेज गलत पॉश्चर का स्प्लिट-स्क्रीन रेड/ग्रीन टिक]
"पहली गलती - गलत पॉश्चर। जब आप सही एंगल पर फोकस करते हैं, तो मसल्स पर 3 गुना ज्यादा लोड आता है और असर तुरंत दिखता है।"

[Point 2 / स्टेप 2: कंसिस्टेंसी और रिकवरी]
[Visual: डाइट प्लेट, पानी और वर्कआउट रूटीन टाइमर]
"दूसरी बात - सिर्फ मेहनत काफी नहीं है, सही रिकवरी और न्यूट्रिशन के बिना रिजल्ट्स रुक जाते हैं।"

[Call to Action / कॉल टू एक्शन]
[Visual: 30-डे चैलेंज बैज और फॉलो बटन]
"क्या आप 30 दिन का ${cleanTopic} चैलेंज लेने को तैयार हैं? कमेंट में 'YES' लिखें और अपनी फिटनेस जर्नी के लिए फॉलो करें!"`
      : `[Hook (0-5s)]
[Visual: High intensity transformation clips of ${cleanTopic}]
"If you are doing ${cleanTopic} and seeing zero results, you are making this huge mistake! Watch this right now!"

[Point 1: Correct Form]
[Visual: Split screen comparing wrong vs right technique]
"Point 1: Form is everything. Proper biomechanics activates 3x more target muscle fibers instantly."

[Point 2: Recovery Protocol]
[Visual: Clean diet and consistency calendar]
"Point 2: Training without targeted nutrition is wasted effort. Fuel your body with the right fuel."

[Call to Action]
[Visual: Follow icon with challenge badge]
"Are you ready for the 30-day ${cleanTopic} challenge? Comment YES below and follow for daily workout guides!"`;

    description = `${cleanTopic} का सही तरीका और बेस्ट टिप्स। 30 दिनों में देखिए असली फर्क! #FitnessShorts #${cleanTopic.replace(/\s+/g, '')}`;
    hashtags = ['#FitnessMotivation', '#WorkoutTips', '#HealthyLifestyle', '#GymShorts', '#Transformation', '#BodyGoals'];

  } else if (info.category === 'tech') {
    titles = isHindi
      ? [
          `🤖 ${cleanTopic}: 2026 का सबसे क्रांतिकारी सीक्रेट टूल! ⚡`,
          `क्या आपने ${cleanTopic} की ये सीक्रेट सेटिंग देखी है? होश उड़ जाएंगे 😱`,
          `बिना कोडिंग ${cleanTopic} से काम करें 10 गुना तेज़ 🚀 (New Update)`,
        ]
      : [
          `🤖 ${cleanTopic}: The Secret Tech Breakthrough of 2026! ⚡`,
          `Have You Tried This Hidden Feature in ${cleanTopic}? Insane! 😱`,
          `Work 10x Faster with ${cleanTopic} (No Coding Needed) 🚀`,
        ];

    script = isHindi
      ? `[Hook / हुक (0-5s)]
[Visual: टेक टर्मिनल पर फ्यूचरिस्टिक कोड/UI का तेज एनीमेशन और ${cleanTopic} का लोगो]
"सावधान! अगर आप 2026 में ${cleanTopic} का इस्तेमाल नहीं कर रहे, तो आप दुनिया से 2 साल पीछे चल रहे हैं! देखिए ये कैसे काम करता है!"

[Point 1 / स्टेप 1: मेन फीचर व ऑटोमेशन]
[Visual: सॉफ्टवेयर इंटरफेस पर 1-क्लिक में काम होने का स्मूथ स्क्रीन रिकॉर्डिंग]
"फीचर नंबर 1 - जो काम पहले घंटों में होता था, अब ${cleanTopic} उसे सिर्फ 1 क्लिक में ऑटोमेट कर देता है।"

[Point 2 / स्टेप 2: फ्री एक्सेस व प्रो टिप्स]
[Visual: हिडन सेटिंग्स और शॉर्टकट कीज का हाइलाइट]
"फीचर नंबर 2 - इसकी ये हिडन सेटिंग ऑन करते ही आपकी स्पीड और आउटपुट क्वालिटी 5 गुना बढ़ जाती है।"

[Call to Action / कॉल टू एक्शन]
[Visual: फ्री लिंक इन बायो और सेव रील का प्रॉम्प्ट]
"इस रील को अभी सेव कर लें ताकि आप भूल न जाएं, और ऐसे ही लेटेस्ट टेक हैक्स के लिए सब्सक्राइब करें!"`
      : `[Hook (0-5s)]
[Visual: Futuristic digital interface showcasing ${cleanTopic}]
"Warning! If you aren't using ${cleanTopic} in 2026, you are falling way behind. Check out what it can do!"

[Point 1: Automation Power]
[Visual: Fast screen demo showing hours of manual work solved in seconds]
"Feature 1: ${cleanTopic} automates repetitive tasks with surgical accuracy in just one tap."

[Point 2: Hidden Trick]
[Visual: Toggling advanced settings to unleash maximum performance]
"Feature 2: Turn on this hidden toggle to instantly supercharge your workflow by 5x."

[Call to Action]
[Visual: Save icon and link in bio pointer]
"Save this reel right now before you lose it, and follow for the best AI and tech tools daily!"`;

    description = `2026 में ${cleanTopic} का सबसे ताकतवर इस्तेमाल। जानिए कैसे आप अपने काम को आसान बना सकते हैं! #TechHacks #${cleanTopic.replace(/\s+/g, '')}`;
    hashtags = ['#TechShorts', '#AItools', '#FutureTech', '#ProductivityHacks', '#SmartTools', '#GadgetUpdate'];

  } else if (info.category === 'finance') {
    titles = isHindi
      ? [
          `💰 ${cleanTopic}: 2026 में पैसे कमाने का असली फॉर्मूला 📈`,
          `बिना इन्वेस्टमेंट ${cleanTopic} से महीने के ₹50,000+ का पूरा प्लान 💸`,
          `${cleanTopic} से वेल्थ बनाने की 3 सीक्रेट स्ट्रैटेजी (Live Proof) 🚀`,
        ]
      : [
          `💰 The Real Formula to Make Money with ${cleanTopic} in 2026 📈`,
          `Zero-Investment Blueprint to Earn with ${cleanTopic} 💸`,
          `3 Secrets to Build Long-Term Wealth Using ${cleanTopic} 🚀`,
        ];

    script = isHindi
      ? `[Hook / हुक (0-5s)]
[Visual: फोन स्क्रीन पर अर्निंग डैशबोर्ड और ₹ सिंबल का फास्ट ज़ूम-इन]
"क्या आप जानते हैं कि 2026 में स्मार्ट लोग ${cleanTopic} की मदद से लगातार पैसिव इनकम बना रहे हैं? जानिए इसका पूरा रोडमैप!"

[Point 1 / स्टेप 1: सही रणनीति]
[Visual: मार्केट ट्रेंड्स और ग्रोथ चार्ट का विज़ुअलाइज़ेशन]
"पहला कदम - बिना सोचे-समझे नहीं, बल्कि ${cleanTopic} के सबसे हाई-डिमांड एरिया को पहचानें जहां कॉम्पिटिशन कम और मार्जिन ज्यादा है।"

[Point 2 / स्टेप 2: स्केलिंग और ऑटोमेशन]
[Visual: डिजिटल सिस्टम और ऑटोमेशन का फ्लोचार्ट]
"दूसरा कदम - अपने प्रोसेस को ऑटोमेट करें ताकि आप कम समय देकर भी लगातार कमाई कर सकें।"

[Call to Action / कॉल टू एक्शन]
[Visual: कमेंट 'GUIDE' और सब्सक्राइब एरो]
"अगर आपको ${cleanTopic} की पूरी फ्री गाइड चाहिए, तो कमेंट में 'MONEY' लिखें और तुरंत फॉलो करें!"`
      : `[Hook (0-5s)]
[Visual: Fast zoom on growth chart showing revenue analytics]
"Smart creators in 2026 are using ${cleanTopic} to generate real automated income. Here is the secret blueprint!"

[Point 1: High Margin Angle]
[Visual: Low competition, high-return strategy diagram]
"Step 1: Focus on the high-demand niche inside ${cleanTopic} where margins are highest."

[Point 2: Automation & Scale]
[Visual: Clean workflow diagram showing system running automatically]
"Step 2: Automate your delivery pipeline so income flows without working 24/7."

[Call to Action]
[Visual: Follow and save button highlights]
"Comment 'START' below for the step-by-step breakdown and follow for daily finance hacks!"`;

    description = `${cleanTopic} से ऑनलाइन कमाई और वेल्थ क्रिएशन की पूरी गाइड। #OnlineEarning #${cleanTopic.replace(/\s+/g, '')}`;
    hashtags = ['#OnlineIncome', '#WealthMindset', '#PassiveIncome', '#SideHustle', '#FinancialFreedom', '#BusinessTips'];

  } else if (info.category === 'education') {
    titles = isHindi
      ? [
          `🧠 ${cleanTopic}: 99% लोग नहीं जानते ये चौंकाने वाला सच! 📚`,
          `क्या आपको ${cleanTopic} का ये ऐतिहासिक रहस्य पता है? 😱`,
          `${cleanTopic} को याद रखने की सबसे आसान सीक्रेट ट्रिक ✨`,
        ]
      : [
          `🧠 99% of People Don't Know This Shocking Truth About ${cleanTopic}! 📚`,
          `The Untold Secret History Behind ${cleanTopic} Revealed 😱`,
          `The Easiest Memory Trick to Master ${cleanTopic} ✨`,
        ];

    script = isHindi
      ? `[Hook / हुक (0-5s)]
[Visual: रहस्यमयी विंटेज बैकग्राउंड और ${cleanTopic} का डार्क ग्लोइंग सिंबल]
"क्या आपको पता है कि ${cleanTopic} के पीछे एक ऐसा राज़ छिपा है जिसे किताबों में कभी नहीं पढ़ाया गया? सच जानकर आपके होश उड़ जाएंगे!"

[Point 1 / मुख्य रहस्य 1: असली फैक्ट]
[Visual: हिस्टोरिकल डॉक्युमेंट्स और एनिमेटेड टाइमलाइन]
"सच्चाई ये है कि ${cleanTopic} की शुरुआत उस तरह नहीं हुई थी जैसा हम सोचते हैं। इसके पीछे का असली कारण बेहद चौंकाने वाला है।"

[Point 2 / मुख्य रहस्य 2: गहरा प्रभाव]
[Visual: वर्ल्ड मैप और मॉडर्न साइंस कनेक्शन का 3D विज़ुअल]
"और आज की तारीख में भी इसका असर हमारे रोज़मर्रा के जीवन पर पड़ता है, जिसे ज्यादातर लोग अनदेखा कर देते हैं।"

[Call to Action / कॉल टू एक्शन]
[Visual: कमेंट बॉक्स और फॉलो आइकॉन]
"क्या आपको यह फैक्ट पहले से पता था? कमेंट में बताइए और ऐसे ही ज्ञानवर्धक वीडियोज़ के लिए सब्सक्राइब करें!"`
      : `[Hook (0-5s)]
[Visual: Mysterious deep navy background with glowing icon for ${cleanTopic}]
"Did you know there is a hidden truth about ${cleanTopic} that is almost never taught in schools? Prepare to be amazed!"

[Point 1: The Untold Origin]
[Visual: Dynamic timeline graphics and historical archives]
"The real origin of ${cleanTopic} is completely different from what common myth suggests."

[Point 2: Modern Impact]
[Visual: Holographic globe connecting historical facts to present day]
"Even today, it quietly shapes the world around us in ways most people never notice."

[Call to Action]
[Visual: Follow and share icons]
"Did you know this before? Tell us in the comments and follow for mind-bending facts daily!"`;

    description = `${cleanTopic} के बारे में चौंकाने वाले तथ्य और रहस्य। देखिए पूरी जानकारी! #EducationShorts #${cleanTopic.replace(/\s+/g, '')}`;
    hashtags = ['#DidYouKnow', '#ShockingFacts', '#KnowledgeHub', '#StudyHacks', '#CuriousMinds', '#HistoryFacts'];

  } else if (info.category === 'motivation') {
    titles = isHindi
      ? [
          `🔥 ${cleanTopic}: जब सब कुछ मुश्किल लगे तो ये 30 सेकंड सुनो! ✨`,
          `हार मानने से पहले ${cleanTopic} की ये बात हमेशा याद रखना 💯`,
          `${cleanTopic}: अपने अंदर की ताक़त को जगाने वाला सबसे गहरा संदेश ⚡`,
        ]
      : [
          `🔥 When Everything Feels Hard, Listen to This About ${cleanTopic}! ✨`,
          `Never Give Up: The Most Powerful Lesson from ${cleanTopic} 💯`,
          `${cleanTopic}: The Mindset Shift That Changes Everything ⚡`,
        ];

    script = isHindi
      ? `[Hook / हुक (0-5s)]
[Visual: अंधेरे से रोशनी की ओर दौड़ता हुआ इंसान, धीमा सिनेमैटिक ज़ूम]
"अगर आज आपकी ज़िंदगी में मुश्किल समय चल रहा है और आप हार मानने की सोच रहे हैं, तो रुकिए! ये 30 सेकंड आपकी सोच बदल देंगे!"

[Point 1 / सबक 1: धैर्य और संघर्ष]
[Visual: पहाड़ पर चढ़ाई और सूर्योदय की सुनहरी किरणें]
"याद रखिए, सोना भी आग में तपकर ही चमकता है। ${cleanTopic} हमें सिखाता है कि हर दर्द के पीछे एक बड़ी सफलता छिपी होती है।"

[Point 2 / सबक 2: अटूट विश्वास]
[Visual: शीशे में अपनी आंखों में देखता हुआ आत्मविश्वास भरा चेहरा]
"दुनिया आप पर तब तक विश्वास नहीं करेगी, जब तक आप खुद पर भरोसा नहीं करेंगे। आज से ही अपनी मंज़िल की ओर कदम बढ़ाइए।"

[Call to Action / कॉल टू एक्शन]
[Visual: फायर इमोजी और 'SHARE WITH SOMEONE' टेक्स्ट]
"इस वीडियो को उस दोस्त के साथ शेयर करें जिसे आज हिम्मत की ज़रूरत है, और रोज़ मोटिवेशन के लिए फॉलो करें!"`
      : `[Hook (0-5s)]
[Visual: Cinematic silhouette walking towards sunrise]
"If you feel like quitting today, pause for 30 seconds. This message is specifically for you!"

[Point 1: The Power of Struggle]
[Visual: Mountain climb and golden rays of light]
"Diamonds are formed under extreme pressure. ${cleanTopic} proves that your current hardship is simply preparing you for greatness."

[Point 2: Unshakable Belief]
[Visual: Determined athlete staring ahead with relentless focus]
"Do not let temporary setbacks define your ultimate journey. You are stronger than your excuses."

[Call to Action]
[Visual: Share icon and follow prompt]
"Share this with someone who needs strength today, and follow for daily motivation!"`;

    description = `${cleanTopic} - जीवन में कभी हार न मानने की प्रेरणा। इस वीडियो को शेयर ज़रूर करें! #Motivation #${cleanTopic.replace(/\s+/g, '')}`;
    hashtags = ['#MotivationalQuotes', '#SuccessMindset', '#NeverGiveUp', '#InspirationDaily', '#MindsetShift', '#DailyWisdom'];

  } else {
    // General / Entertainment / Viral Topic
    titles = isHindi
      ? [
          `🔥 ${cleanTopic}: ये सीक्रेट वीडियो गलती से भी मिस मत करना! 😱`,
          `क्या सच में ${cleanTopic} ऐसा हो सकता है? हैरान कर देने वाला सच ⚡`,
          `${cleanTopic} के 3 सबसे बड़े सीक्रेट्स जो कोई नहीं बताता 🚀`,
        ]
      : [
          `🔥 ${cleanTopic}: Do Not Miss This Shocking Breakdown! 😱`,
          `The Ultimate Truth Behind ${cleanTopic} Exposed ⚡`,
          `3 Mind-Blowing Secrets About ${cleanTopic} You Need to Know 🚀`,
        ];

    script = isHindi
      ? `[Hook / हुक (0-5s)]
[Visual: हाई-कंट्रास्ट ज़ूम-इन और ${cleanTopic} का आकर्षक विज़ुअल]
"रुको! अगर आप ${cleanTopic} के बारे में सर्च कर रहे हैं, तो अगले 45 सेकंड में आपको वो जानकारी मिलेगी जो इंटरनेट पर कोई नहीं बताता!"

[Point 1 / मुख्य पहलू 1: असली रहस्य]
[Visual: डायनामिक 3D ग्राफिक्स और हाई-स्पीड कट]
"पहली बात - ${cleanTopic} का सबसे बड़ा पहलू यह है कि लोग ऊपरी चीज़ों पर ध्यान देते हैं, जबकि असली खेल इसकी गहराई में है।"

[Point 2 / मुख्य पहलू 2: प्रो ट्रिक]
[Visual: स्क्रीन पर स्टेप-बाय-स्टेप गाइड और हाइलाइटेड टेक्स्ट]
"दूसरी बात - अगर आप इस खास तरीके को अपनाते हैं, तो आपको बिना किसी परेशानी के सबसे बेहतरीन रिज़ल्ट्स मिलेंगे।"

[Call to Action / कॉल टू एक्शन]
[Visual: सब्सक्राइब और लाइक का एनिमेटेड एरो]
"क्या आप ${cleanTopic} के बारे में और जानना चाहते हैं? तुरंत कमेंट करें और चैनल को फॉलो करें!"`
      : `[Hook (0-5s)]
[Visual: High-contrast dynamic zoom showcasing ${cleanTopic}]
"Wait! If you are interested in ${cleanTopic}, this 45-second breakdown reveals what nobody else talks about!"

[Point 1: The Core Secret]
[Visual: Dynamic 3D graphics illustrating the core concept of ${cleanTopic}]
"First: The real game-changer in ${cleanTopic} is focusing on fundamentals that 90% of people completely ignore."

[Point 2: Actionable Hack]
[Visual: Screen highlight showing the exact winning method]
"Second: By applying this simple tweak, you achieve effortless, high-impact results every single time."

[Call to Action]
[Visual: Follow and subscribe animated pointer]
"Drop your thoughts about ${cleanTopic} in the comments and follow for part 2!"`;

    description = `${cleanTopic} के बारे में संपूर्ण और सटीक जानकारी। वीडियो को लाइक और फॉलो ज़रूर करें! #ViralVideo #${cleanTopic.replace(/\s+/g, '')}`;
    hashtags = ['#ViralShorts', '#TrendingNow', '#MustWatch', '#ExplorePage', '#DailyReel', '#ShortsFeed'];
  }

  const thumbnailPrompt = `Ultra-cinematic 9:16 vertical composition for "${cleanTopic}". Modern ${info.category} aesthetic, vibrant volumetric ${info.accentColor} and golden studio lighting, dynamic camera angle, sharp focus, 8k octane render, photorealistic.`;

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

export function generateClientFallbackVideoBlueprint(
  topic: string,
  contentType: ContentTypeOption = 'YouTube Shorts',
  language: ContentLanguageOption = 'Hindi',
  script?: string,
  thumbnailPrompt?: string
): FreeVideoMakerBlueprint {
  const isHindi = language === 'Hindi' || language === 'Hinglish';
  const cleanTopic = (topic || 'Viral Video').trim();
  const info = detectTopicCategory(cleanTopic);

  const title = isHindi
    ? `🔥 ${cleanTopic} का पूरा सीक्रेट ${info.icon}`
    : `🔥 Complete Secret of ${cleanTopic} ${info.icon}`;

  // Build 5 scenes strictly customized to the topic and category
  let scene1Caption = isHindi ? `रुको! ${cleanTopic.slice(0, 18)} 😱` : `Stop! ${cleanTopic.slice(0, 18)} 😱`;
  let scene1Voiceover = isHindi
    ? `अगर आप ${cleanTopic} के बारे में यह जरूरी बात नहीं जानते, तो अगले 30 सेकंड में आपकी सोच बदलने वाली है!`
    : `If you do not know this critical fact about ${cleanTopic}, your mind is about to be blown!`;

  let scene2Caption = isHindi ? `सीक्रेट 1: असली सच्चाई ✨` : `Secret 1: The Truth ✨`;
  let scene2Voiceover = isHindi
    ? `स्टेप 1: ${cleanTopic} का सबसे पहला नियम है सही जानकारी और सही शुरुआत करना।`
    : `Step 1: The most important rule of ${cleanTopic} is getting the fundamentals right from day one.`;

  let scene3Caption = isHindi ? `सीक्रेट 2: वायरल ट्रिक ⚡` : `Secret 2: Pro Method ⚡`;
  let scene3Voiceover = isHindi
    ? `स्टेप 2: अब इस्तेमाल करें ये सीक्रेट तकनीक, जिससे आपको ${cleanTopic} में 10 गुना बेहतर नतीजे मिलेंगे!`
    : `Step 2: Now apply this proven technique to unlock 10x better results with ${cleanTopic}!`;

  let scene4Caption = isHindi ? `नतीजा: 100% असरदार 🎯` : `Result: 100% Proven 🎯`;
  let scene4Voiceover = isHindi
    ? `स्टेप 3: देखिए इसका लाइव असर! जो लोग इस तरीके को अपनाते हैं, वे हमेशा आगे रहते हैं।`
    : `Step 3: See the results speak for themselves! Those who master this always stay ahead.`;

  let scene5Caption = isHindi ? `फॉलो करें अगला पार्ट 🚀` : `Follow for Part 2! 🚀`;
  let scene5Voiceover = isHindi
    ? `अगर आपको ${cleanTopic} का ये तरीका पसंद आया, तो वीडियो लाइक करें और अगला पार्ट देखने के लिए अभी फॉलो करें!`
    : `If you loved this breakdown of ${cleanTopic}, hit like and follow right now for Part 2!`;

  // Tailor scene captions further based on category
  if (info.category === 'sports') {
    scene1Caption = isHindi ? `रुको! ये मैच मत भूलना 🏏` : `Stop! Historic Match 🏏`;
    scene1Voiceover = isHindi
      ? `क्या आपने ${cleanTopic} का ये ऐतिहासिक पल देखा? खेल जगत में ऐसा कारनामा कभी-कभार ही देखने को मिलता है!`
      : `Did you witness this unbelievable moment in ${cleanTopic}? True history was made right here!`;
    scene2Caption = isHindi ? `नया वर्ल्ड रिकॉर्ड 🏆` : `New World Record 🏆`;
    scene3Caption = isHindi ? `टर्निंग पॉइंट ⚡` : `The Turning Point ⚡`;
    scene4Caption = isHindi ? `मैच-विनिंग मोमेंट 💥` : `Match-Winning Play 💥`;
    scene5Caption = isHindi ? `कमेंट में फेवरेट प्लेयर लिखें! 🏏` : `Drop Your Fav Player! 🏏`;
  } else if (info.category === 'food') {
    scene1Caption = isHindi ? `रुकिए! असली ${cleanTopic.slice(0, 14)} 🍲` : `Secret ${cleanTopic.slice(0, 14)} 🍲`;
    scene1Voiceover = isHindi
      ? `रेस्टोरेंट जैसा परफेक्ट ${cleanTopic} घर पर कैसे बनाएं? जानिए वो एक गुप्त सीक्रेट जो शेफ कभी नहीं बताते!`
      : `How to make the ultimate restaurant-style ${cleanTopic} right at home? Here is the chef's secret!`;
    scene2Caption = isHindi ? `स्टेप 1: सीक्रेट तड़का 🌶️` : `Step 1: Secret Spices 🌶️`;
    scene3Caption = isHindi ? `स्टेप 2: परफेक्ट ग्रेवी ✨` : `Step 2: Perfect Simmer ✨`;
    scene4Caption = isHindi ? `स्वाद: 100% लाजवाब 😋` : `Taste: 100% Delicious 😋`;
    scene5Caption = isHindi ? `रेसिपी सेव करें व शेयर करें! 👨‍🍳` : `Save Recipe & Follow! 👨‍🍳`;
  } else if (info.category === 'fitness') {
    scene1Caption = isHindi ? `सावधान! ${cleanTopic.slice(0, 14)} 🛑` : `Stop Doing This! 🛑`;
    scene1Voiceover = isHindi
      ? `अगर आप ${cleanTopic} कर रहे हैं और रिजल्ट्स नहीं मिल रहे, तो तुरंत रुकिए और ये सही फॉर्म सीखिए!`
      : `If you are doing ${cleanTopic} and seeing no results, stop right now and fix your form!`;
    scene2Caption = isHindi ? `गलती 1: गलत पॉश्चर ❌` : `Mistake 1: Bad Form ❌`;
    scene3Caption = isHindi ? `सही तरीका: 3x लोड ✅` : `Fix: 3x Muscle Load ✅`;
    scene4Caption = isHindi ? `30 दिन में ट्रांसफॉर्मेशन 💪` : `30-Day Result 💪`;
    scene5Caption = isHindi ? `कमेंट करें: 30 DAYS 🔥` : `Comment 'CHALLENGE' 🔥`;
  } else if (info.category === 'tech') {
    scene1Caption = isHindi ? `रुको! ${cleanTopic.slice(0, 14)} ⚡` : `New Tech Alert! ⚡`;
    scene1Voiceover = isHindi
      ? `2026 का सबसे क्रांतिकारी टूल! अगर आप ${cleanTopic} का इस्तेमाल नहीं कर रहे, तो आप बहुत कुछ मिस कर रहे हैं!`
      : `The most powerful tech of 2026! If you aren't using ${cleanTopic}, you are falling way behind!`;
    scene2Caption = isHindi ? `फ़ीचर 1: 10x स्पीड 🚀` : `Feature 1: 10x Speed 🚀`;
    scene3Caption = isHindi ? `फ़ीचर 2: हिडन सेटिंग 🤖` : `Feature 2: Hidden Hack 🤖`;
    scene4Caption = isHindi ? `100% ऑटोमेटेड रिज़ल्ट ⚡` : `100% Automated ⚡`;
    scene5Caption = isHindi ? `लिंक के लिए फॉलो करें! 💻` : `Save & Follow for Link! 💻`;
  } else if (info.category === 'finance') {
    scene1Caption = isHindi ? `रुकिए! रोज़ ₹2000 का प्लान 💰` : `Daily Income Plan 💰`;
    scene1Voiceover = isHindi
      ? `क्या आप जानते हैं कि ${cleanTopic} की मदद से लोग कैसे लगातार कमाई कर रहे हैं? देखिए पूरा सीक्रेट!`
      : `Smart creators in 2026 are using ${cleanTopic} to generate consistent revenue. Here is the blueprint!`;
    scene2Caption = isHindi ? `स्टेप 1: ज़ीरो इन्वेस्टमेंट 📈` : `Step 1: Zero Budget 📈`;
    scene3Caption = isHindi ? `स्टेप 2: वायरल सिस्टम ⚡` : `Step 2: Viral System ⚡`;
    scene4Caption = isHindi ? `3 गुना पैसिव इनकम 💸` : `3x Passive Income 💸`;
    scene5Caption = isHindi ? `कमेंट करें: MONEY 🚀` : `Comment: MONEY 🚀`;
  }

  const scenes: VideoStoryboardScene[] = [
    {
      sceneNumber: 1,
      timeRange: '0:00 - 0:08',
      duration: '8s',
      sceneTitle: isHindi ? `हुक: ${info.hookKeyword}` : `Hook: ${info.hookKeyword}`,
      visualDescription: isHindi
        ? `${cleanTopic} का हाई-इम्पैक्ट डायनामिक विज़ुअल, कैमरे की ओर फास्ट ज़ूम-इन और स्क्रीन पर बोल्ड टेक्स्ट।`
        : `Dynamic high-contrast camera zoom-in highlighting ${cleanTopic} with cinematic studio lighting.`,
      imagePrompt: `Cinematic vertical 9:16 shot visualizing ${cleanTopic}, high dynamic range, volumetric lighting, photorealistic 8k octane render, sharp focus`,
      caption: scene1Caption,
      onScreenText: scene1Caption,
      voiceover: scene1Voiceover,
      voiceoverScript: scene1Voiceover,
      transition: 'Fast Whip Pan with Whoosh SFX',
      bgmCue: 'Energetic hook riser begins (Volume: 20%)',
    },
    {
      sceneNumber: 2,
      timeRange: '0:08 - 0:18',
      duration: '10s',
      sceneTitle: isHindi ? `कदम 1: मुख्य राज़` : `Step 1: Core Secret`,
      visualDescription: isHindi
        ? `${cleanTopic} के पहले मुख्य चरण का स्पष्ट और आकर्षक प्रदर्शन।`
        : `Clear visual demonstration of the primary key point of ${cleanTopic}.`,
      imagePrompt: `Clean modern vertical 9:16 composition focusing on ${cleanTopic} core elements, soft studio illumination, highly detailed`,
      caption: scene2Caption,
      onScreenText: scene2Caption,
      voiceover: scene2Voiceover,
      voiceoverScript: scene2Voiceover,
      transition: 'Smooth Slide Left Transition',
      bgmCue: 'Rhythmic background beat drops in',
    },
    {
      sceneNumber: 3,
      timeRange: '0:18 - 0:30',
      duration: '12s',
      sceneTitle: isHindi ? `कदम 2: प्रो तकनीक` : `Step 2: Pro Method`,
      visualDescription: isHindi
        ? `${cleanTopic} की मुख्य तकनीक का लाइव डेमोंस्ट्रेशन और हाईलाइटेड ग्राफिक्स।`
        : `Live high-energy demonstration of ${cleanTopic} execution with glowing graphic indicators.`,
      imagePrompt: `Action-packed vertical 9:16 view of ${cleanTopic} in action, dynamic contrast, sharp details, vibrant aesthetic`,
      caption: scene3Caption,
      onScreenText: scene3Caption,
      voiceover: scene3Voiceover,
      voiceoverScript: scene3Voiceover,
      transition: 'Glitch Flash Transition',
      bgmCue: 'Energetic rhythm build up',
    },
    {
      sceneNumber: 4,
      timeRange: '0:30 - 0:42',
      duration: '12s',
      sceneTitle: isHindi ? `कदम 3: नतीजा व असर` : `Step 3: The Result`,
      visualDescription: isHindi
        ? `${cleanTopic} के प्रभावशाली परिणामों का विज़ुअल शोकेस।`
        : `Impactful visual showcase of results and proof for ${cleanTopic}.`,
      imagePrompt: `Stunning vertical 9:16 showcase of high success and transformation for ${cleanTopic}, golden highlights, premium look`,
      caption: scene4Caption,
      onScreenText: scene4Caption,
      voiceover: scene4Voiceover,
      voiceoverScript: scene4Voiceover,
      transition: 'Dynamic Scale Transition',
      bgmCue: 'Flourish and resolution chord',
    },
    {
      sceneNumber: 5,
      timeRange: '0:42 - 0:50',
      duration: '8s',
      sceneTitle: isHindi ? `कॉल टू एक्शन (CTA)` : `Call To Action`,
      visualDescription: isHindi
        ? `फॉलो और कमेंट का आकर्षक आउट्रो कार्ड, लाइक व शेयर का कॉल आउट।`
        : `Vibrant end screen with follow and comment arrows tailored to ${cleanTopic}.`,
      imagePrompt: `Clean creator end screen with neon follow prompts and glowing comment bubble for ${cleanTopic}, 9:16 vertical`,
      caption: scene5Caption,
      onScreenText: scene5Caption,
      voiceover: scene5Voiceover,
      voiceoverScript: scene5Voiceover,
      transition: 'Smooth Fade Out',
      bgmCue: 'Music fades smoothly with warm resolution',
    },
  ];

  return {
    videoTitle: title,
    targetDuration: '50s',
    aspectRatio: '9:16 (Vertical Shorts / Reels / TikTok)',
    resolution: '1080x1920 (Full HD)',
    captionStyle: 'CapCut Modern Pop (Bold Yellow & White with Black Outline)',
    hookStrategy: `Curiosity Hook specifically designed for ${cleanTopic}`,
    videoSettings: {
      aspectRatio: '9:16',
      resolution: '1080x1920',
      recommendedDuration: '45 - 55s',
      captionStyle: 'CapCut Pop Bold (Yellow / White)',
      hookInFirstSeconds: '0 - 4s',
    },
    bgMusicSuggestion: {
      genre: `${info.category === 'sports' ? 'Fast Electronic Stadium' : info.category === 'fitness' ? 'Energetic Gym Beat' : info.category === 'tech' ? 'Cyber Synth' : 'Chill Lofi'} (Royalty-Free)`,
      mood: 'Engaging, High-Retention, Topic-Matched',
      tempo: '120 - 128 BPM',
      freeSearchKeywords: `${info.category} background music no copyright`,
    },
    scenes,
    assemblyInstructions: [
      `1. दृश्य 1 से 5 के AI Image Prompts को Bing Image Creator या Leonardo.ai में पेस्ट करके 9:16 इमेज बनाएं।`,
      `2. इन-ऐप वीडियो स्टूडियो में "Play Video" दबाकर लाइव प्रीव्यू देखें या सीधे MP4 डाउनलोड करें।`,
      `3. बाहरी संपादन के लिए CapCut में इम्पोर्ट करके ऑटो-कैप्शन और YouTube ऑडियो लाइब्रेरी से बैकग्राउंड म्यूजिक जोड़ें।`,
    ],
    recommendedFreeTools: [
      'Bing Image Creator (मुफ़्त 9:16 AI इमेज)',
      'Leonardo.ai (150 मुफ़्त टोकन रोज़)',
      'CapCut / VN Editor (मुफ़्त ऑटो-कैप्शन्स व एक्सपोर्ट)',
      'YouTube Audio Library (100% रॉयल्टी-फ्री बैकग्राउंड म्यूजिक)',
    ],
  };
}

export function generateClientFallbackScene(
  sceneNumber: number,
  topic: string,
  language: string = 'Hindi',
  sceneTitle?: string
): VideoStoryboardScene {
  const isHindi = language === 'Hindi' || language === 'Hinglish';
  const cleanTopic = (topic || 'AI Video').trim();
  const info = detectTopicCategory(cleanTopic);

  return {
    sceneNumber,
    timeRange: '0:00 - 0:10',
    duration: '10s',
    sceneTitle: sceneTitle || (isHindi ? `दृश्य #${sceneNumber}` : `Scene #${sceneNumber}`),
    visualDescription: isHindi
      ? `डायनामिक कैमरा एंगल, ${cleanTopic} का विज़ुअल प्रकटीकरण और स्क्रीन पर बोल्ड टेक्स्ट।`
      : `Dynamic camera angle showcasing key elements of ${cleanTopic} with high contrast lighting.`,
      imagePrompt: `Cinematic 9:16 vertical shot illustrating ${cleanTopic}, photorealistic 8k octane render, vivid studio neon lighting, high detail`,
    caption: isHindi ? `महत्वपूर्ण पॉइंट #${sceneNumber} ${info.icon}` : `Key Takeaway #${sceneNumber} ${info.icon}`,
    onScreenText: isHindi ? `महत्वपूर्ण पॉइंट #${sceneNumber} ${info.icon}` : `Key Takeaway #${sceneNumber} ${info.icon}`,
    voiceover: isHindi
      ? `इस दृश्य में जानिए ${cleanTopic} का सबसे खास फॉर्मूला जो आपके वीडियो को वायरल बना देगा!`
      : `In this scene, discover the exact high-retention formula for ${cleanTopic}!`,
    voiceoverScript: isHindi
      ? `इस दृश्य में जानिए ${cleanTopic} का सबसे खास फॉर्मूला जो आपके वीडियो को वायरल बना देगा!`
      : `In this scene, discover the exact high-retention formula for ${cleanTopic}!`,
    transition: 'Smooth Cross Dissolve',
    bgmCue: 'Ambient rhythmic synth beat (Volume: 15%)',
  };
}
