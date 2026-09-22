import { FreeVideoTool } from '../types';

export const FREE_VIDEO_TOOLS: FreeVideoTool[] = [
  {
    id: 'kling-ai',
    name: 'Kling AI',
    category: 'AI Video Gen',
    description: 'High-end realistic text-to-video & image-to-video with ultra-fluid physics and cinematic camera movements.',
    hindiDescription: 'टेक्स्ट या फोटो से 1080p सिनेमैटिक वीडियो जनरेट करें। शानदार कैमरा मूवमेंट और रियलिस्टिक मोशन।',
    freeTierDetails: 'रोजाना 66 फ्री क्रेडिट्स (Daily Check-in Credits), नो क्रेडिट कार्ड जरूरी',
    url: 'https://klingai.com',
    badge: 'Trending #1',
    rating: '4.9/5',
    features: [
      'Text-to-Video & Image-to-Video',
      '1080p HD Video Export',
      '5 से 10 सेकंड के स्मूथ क्लिप्स',
      'कस्टम कैमरा कंट्रोल्स (Pan, Zoom, Tilt)'
    ],
    recommendedFor: 'YouTube Shorts और Instagram Reels के लिए रियलिस्टिक AI वीडियो क्लिप्स'
  },
  {
    id: 'hailuo-ai',
    name: 'Hailuo AI (MiniMax)',
    category: 'AI Video Gen',
    description: 'Ultra-fast, hyper-realistic AI video generator with incredibly natural human expressions and lighting.',
    hindiDescription: 'बहुत तेज़ और असली जैसा दिखने वाला फ्री वीडियो जेनरेटर। इंसानी चेहरे और मोशन बेहद स्वाभाविक।',
    freeTierDetails: '100% फ्री जनरेशन, बिना वॉटरमार्क के हाई-डेफिनिशन एक्सपोर्ट',
    url: 'https://hailuoai.video',
    badge: 'No Watermark',
    rating: '4.9/5',
    features: [
      'फोटो या टेक्स्ट प्रॉम्प्ट से तुरंत वीडियो',
      'क्रिस्टल क्लियर HD क्वालिटी',
      'कोई वॉटरमार्क नहीं',
      'डायनामिक एक्शन और स्मूथ मूवमेंट'
    ],
    recommendedFor: 'हाई-एंगेजमेंट वायरल रील्स और सिनेमैटिक बैकड्रॉप वीडियो'
  },
  {
    id: 'luma-dream-machine',
    name: 'Luma Dream Machine',
    category: 'AI Video Gen',
    description: 'Next-generation video foundation model creating photorealistic 5-second video clips from prompts and photos.',
    hindiDescription: 'फोटो या टेक्स्ट लिखकर 5 सेकंड का असली दिखने वाला 3D वीडियो बनाएं।',
    freeTierDetails: 'महीने में 30 फ्री वीडियो जनरेशंस, सीधे गूगल अकाउंट से लॉगिन',
    url: 'https://lumalabs.ai/dream-machine',
    badge: '30 Free/Mo',
    rating: '4.8/5',
    features: [
      'फोटो को तुरंत वीडियो में बदलें (Image-to-Video)',
      'सिनेमैटिक 3D कैमरा मूव्स',
      'फ्री टियर में कोई छुपा शुल्क नहीं',
      'हाई-क्वालिटी MP4 डाउनलोड'
    ],
    recommendedFor: 'स्टोरीटेलिंग, हिस्टोरिकल, और मोटिवेशनल वीडियो सीन्स'
  },
  {
    id: 'pika-labs',
    name: 'Pika (Pika.art)',
    category: 'Motion & Animation',
    description: 'Idea-to-video platform with sound effects, lip-sync, motion control, and anime/3D creative animation styles.',
    hindiDescription: 'एनीमेशन, स्पेशल इफेक्ट्स और साउंड इफेक्ट्स के साथ वीडियो जनरेट करने का बेहतरीन टूल।',
    freeTierDetails: 'रोजाना फ्री रीन्यू होने वाले क्रेडिट्स, बेसिक एक्सपोर्ट फ्री',
    url: 'https://pika.art',
    badge: 'With Sound FX',
    rating: '4.7/5',
    features: [
      'ऑटो-साउंड इफेक्ट्स जनरेटर',
      'इमेज के किसी भी हिस्से को एनिमेट करें',
      '3D, एनीमे और सिनेमैटिक स्टाइल्स',
      'एस्पेक्ट रेश्यो सेलेक्टर (9:16, 16:9)'
    ],
    recommendedFor: 'एनिमेशन रील्स, फनी/मीम क्लिप्स और साउंड-ड्रिवन शॉर्ट्स'
  },
  {
    id: 'leonardo-motion',
    name: 'Leonardo.ai Motion',
    category: 'Motion & Animation',
    description: 'Generate high-fidelity AI images with Leonardo and convert them to motion videos in 1 click.',
    hindiDescription: 'पहले लियोनार्डो से 9:16 इमेज बनाएं और 1-क्लिक में उसे मोशन वीडियो लूप में बदलें।',
    freeTierDetails: 'रोजाना 150 फ्री टोकन्स, डेली रीसेट, नो क्रेडिट कार्ड',
    url: 'https://leonardo.ai',
    badge: '150 Daily Tokens',
    rating: '4.8/5',
    features: [
      'इमेज जनरेशन + वीडियो एनीमेशन एक ही जगह',
      'मोशन स्ट्रेंथ (Motion Strength) कंट्रोल 1-10',
      'मोबाइल व कंप्यूटर दोनों पर सुगम',
      '9:16 वर्टिकल रेशियो सपोर्ट'
    ],
    recommendedFor: 'शॉर्ट्स/रील्स के बैकग्राउंड लूप्स और विजुअल हुक्स'
  },
  {
    id: 'viggle-ai',
    name: 'Viggle AI',
    category: 'Motion & Animation',
    description: 'Controllable character animation engine. Mix any image character with any motion/dance video.',
    hindiDescription: 'किसी भी फोटो वाले कैरेक्टर को मनचाहे डांस या एक्शन वीडियो में बदलें।',
    freeTierDetails: 'फ्री वेब और डिस्कॉर्ड ऐप पर अनलिमिटेड बेसिक जनरेशन',
    url: 'https://viggle.ai',
    badge: 'Viral Dance/Meme',
    rating: '4.6/5',
    features: [
      'कैरेक्टर रिप्लेसमेंट (Mix any character into video)',
      'टेक्स्ट प्रॉम्प्ट से बॉडी मूवमेंट',
      'ग्रीन स्क्रीन बैकग्राउंड आउटपुट',
      'मजेदार और वायरल रील्स बनाने के लिए श्रेष्ठ'
    ],
    recommendedFor: 'फनी रील्स, वायरल ट्रेंड्स और कैरेक्टर एनिमेशन'
  },
  {
    id: 'heygen-free',
    name: 'HeyGen (Free)',
    category: 'Talking Avatar',
    description: 'Produce realistic talking human avatars reciting your script in Hindi, Hinglish, or English.',
    hindiDescription: 'बिना अपना चेहरा दिखाए AI इंसान से अपना स्क्रिप्ट बुलवाएं। हिंदी/इंग्लिश लिप-सिंक सपोर्ट।',
    freeTierDetails: '1 फ्री क्रेडिट (720p HD एक्सपोर्ट), फ्री साइन अप',
    url: 'https://www.heygen.com',
    badge: 'Talking Avatar',
    rating: '4.8/5',
    features: [
      'फोटो या प्री-मेड AI इंसानी अवतार',
      'परफेक्ट लिप-सिंक और नेचुरल एक्सप्रेशन्स',
      'हिंदी, हिंग्लिश और 40+ भाषाओं में आवाज',
      'फेसलेस यूट्यूब चैनल्स के लिए बेस्ट'
    ],
    recommendedFor: 'फेसलेस एक्सप्लेनर वीडियो, न्यूज बुलेटिन, और टेक टिप्स'
  },
  {
    id: 'capcut',
    name: 'CapCut Web & Mobile',
    category: 'Video Editor & Captions',
    description: 'The ultimate video editor for Creators with free Auto-Captions, Text-to-Speech voices, zoom transitions, and 9:16 templates.',
    hindiDescription: 'रील्स और शॉर्ट्स का नंबर-1 एडिटर: फ्री ऑटो-कैप्शन्स (हिंदी/इंग्लिश), वॉयसओवर और वायरल इफेक्ट्स।',
    freeTierDetails: '100% फ्री, कोई वॉटरमार्क नहीं, 1080p 60FPS फ्री एक्सपोर्ट',
    url: 'https://www.capcut.com',
    badge: 'Essential #1',
    rating: '4.9/5',
    features: [
      '1-क्लिक ऑटो-कैप्शन (बोल्ड नियन येलो स्टाइल)',
      'नेचुरल हिंदी/इंग्लिश Text-to-Speech वॉयस',
      'ट्रेंडिंग साउंड इफेक्ट्स और बैकग्राउंड म्यूजिक',
      'ऑटो-कट, व्हिप पैन और ज़ूम ट्रांजिशन्स'
    ],
    recommendedFor: 'सभी शॉर्ट्स, रील्स और यूट्यूब वीडियो की फाइनल एडिटिंग व ऑटो-कैप्शन्स'
  },
  {
    id: 'clipchamp',
    name: 'Microsoft Clipchamp',
    category: 'Video Editor & Captions',
    description: 'Official Microsoft cloud video editor with 1080p watermark-free exports, free AI voice synthesis, and royalty-free stock.',
    hindiDescription: 'माइक्रोसॉफ्ट का फ्री वीडियो एडिटर। बिना किसी वॉटरमार्क के 1080p एक्सपोर्ट और रियलिस्टिक AI वॉयस।',
    freeTierDetails: 'बिना वॉटरमार्क के 1080p एक्सपोर्ट 100% फ्री, कोई समय सीमा नहीं',
    url: 'https://clipchamp.com',
    badge: 'Microsoft Free',
    rating: '4.7/5',
    features: [
      'माइक्रोसॉफ्ट Azure AI नेचुरल वॉयसओवर इनबिल्ट',
      'बिना वॉटरमार्क के फुल HD (1080p) एक्सपोर्ट',
      'स्क्रीन और वेबकैम रिकॉर्डर',
      'ड्रैग एंड ड्रॉप टाइमलाइन'
    ],
    recommendedFor: 'लैपटॉप और कंप्यूटर पर लॉन्ग-फॉर्म और शॉर्ट्स वीडियो बनाना'
  },
  {
    id: 'vn-video-editor',
    name: 'VN Video Editor',
    category: 'Video Editor & Captions',
    description: 'Zero watermark, multi-track mobile & desktop video editor with curve speed ramping and keyframe animation.',
    hindiDescription: 'मोबाइल का सबसे साफ-सुथरा एडिटर। कोई विज्ञापन नहीं, कोई वॉटरमार्क नहीं, फुल 4K 60FPS सपोर्ट।',
    freeTierDetails: '100% फ्री, वॉटरमार्क हटाने का कोई पैसा नहीं लगता',
    url: 'https://www.vlognow.me',
    badge: '100% Free / No Ads',
    rating: '4.8/5',
    features: [
      'एक्सपोर्ट के अंत में वॉटरमार्क डिलीट करने का फ्री बटन',
      'स्पीड कर्व (Speed Ramping) स्मूथ स्लो-मोशन',
      'मल्टी-ट्रैक ऑडियो और वीडियो लेयर्स',
      'Android, iPhone, Mac, Windows सपोर्ट'
    ],
    recommendedFor: 'मोबाइल फोन से बिना किसी झंझट के एचडी रील्स एडिट करना'
  },
  {
    id: 'canva-video',
    name: 'Canva Video Editor',
    category: 'Video Editor & Captions',
    description: 'Intuitive drag-and-drop video maker with thousands of free 9:16 mobile templates, stock media, and text animations.',
    hindiDescription: 'हजारों फ्री 9:16 टेम्पलेट्स, एनिमेटेड टेक्स्ट और रेडीमेड ग्राफिक्स के साथ वीडियो बनाएं।',
    freeTierDetails: 'फ्री अकाउंट में फ्री टेम्पलेट्स और अनलिमिटेड एक्सपोर्ट्स',
    url: 'https://www.canva.com',
    badge: 'Easy Templates',
    rating: '4.8/5',
    features: [
      'रेडीमेड 9:16 शॉर्ट्स/रील्स टेम्पलेट्स',
      'सुंदर टेक्स्ट एनिमेशंस (Typewriter, Pop, Fade)',
      'फ्री म्यूजिक और ग्राफिक्स लाइब्रेरी',
      'क्लाउड ऑटो-सेव और आसान शेयरिंग'
    ],
    recommendedFor: 'कोट्स, फैक्ट्स, लिस्टिकल्स और बिजनेस प्रोमो वीडियो'
  },
  {
    id: 'bing-image-creator',
    name: 'Bing Image Creator (Copilot Designer)',
    category: 'Image Keyframe',
    description: 'Powered by DALL-E 3, generates ultra-detailed 4K photorealistic images to use as visual scenes in your videos.',
    hindiDescription: 'माइक्रोसॉफ्ट का 100% फ्री टूल। DALL-E 3 द्वारा संचालित बेहद सुंदर और असली जैसी इमेजेस बनाएं।',
    freeTierDetails: '100% फ्री, 15 दैनिक बूस्ट क्रेडिट्स + असीमित सामान्य जनरेशन',
    url: 'https://www.bing.com/create',
    badge: '100% Free DALL-E 3',
    rating: '4.9/5',
    features: [
      'DALL-E 3 इंजन (OpenAI लेवल क्वालिटी)',
      'हिंदी या इंग्लिश किसी भी प्रॉम्प्ट को समझता है',
      'हाई-रेजोल्यूशन इमेज डाउनलोड',
      'शॉर्ट्स के सभी सीन्स के लिए परफेक्ट'
    ],
    recommendedFor: 'वीडियो के हर एक सीन की हाई-क्वालिटी बैकड्रॉप इमेज जनरेट करना'
  }
];

export const VIDEO_TOOL_CATEGORIES = [
  'All',
  'AI Video Gen',
  'Motion & Animation',
  'Talking Avatar',
  'Video Editor & Captions',
  'Image Keyframe'
] as const;
