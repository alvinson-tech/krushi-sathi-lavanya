import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as db from '../../services/db';
import { User } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

// ----------------- Small helper icons (lightweight) -----------------
const BellIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
);
const MapPinIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
);

const LANGUAGE_OPTIONS = [
    { code: 'en' as const, name: 'English', flag: '🇬🇧' },
    { code: 'hi' as const, name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr' as const, name: 'मराठी', flag: '🇮🇳' },
    { code: 'ta' as const, name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te' as const, name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'kn' as const, name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'gu' as const, name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'bn' as const, name: 'বাংলা', flag: '🇮🇳' },
];

// ----------------- Animation helper -----------------
const AnimatedSection: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.1 });
        const currentElement = ref.current;
        if (currentElement) observer.observe(currentElement);
        return () => { if (currentElement) observer.unobserve(currentElement); };
    }, []);
    return <div ref={ref} className={`${className || ''} transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>{children}</div>;
};

// ----------------- Localized copy (kept as-is) -----------------
type LanguageKey = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'kn' | 'gu' | 'bn';

interface CopyBlock {
    hero: { title: string; subtitle: string }[];
    actions: {
        rent: string;
        hire: string;
        weather: string;
        diversify: string;
        market: string;
    };
    highlights: {
        diversificationTitle: string;
        diversificationDescription: string;
        marketTitle: string;
        marketDescription: string;
        cta: string;
    };
    location: {
        detecting: string;
        denied: string;
        unavailable: string;
    };
    footer: {
        help: string;
        about: string;
        language: string;
        rights: string;
    };
    loadingText: string;
}

const localizedCopy: Record<LanguageKey, CopyBlock> = {
    en: {
        hero: [
            { title: 'Find Equipment Near You', subtitle: 'Smart rentals, verified listings, instant booking' },
            { title: 'Hire Verified Labourers', subtitle: 'Connect with trusted farm hands in seconds' },
            { title: 'Smart Crop Recommendations', subtitle: 'AI tips for higher yields and better planning' }
        ],
        actions: {
            rent: 'Access modern tractors, harvesters and tools whenever you need them.',
            hire: 'Hire skilled labourers with verified experience and transparent pricing.',
            weather: 'Get hyper-local weather intelligence before you step into the field.',
            diversify: 'Plan profitable crop mixes tailored to your soil and climate.',
            market: 'Track real-time mandi trends and never miss the best selling window.'
        },
        highlights: {
            diversificationTitle: 'Smart Diversification',
            diversificationDescription: 'Visualize dual-crop strategies, compare profitability and plan the entire season with confidence.',
            marketTitle: 'Live Market Pricing',
            marketDescription: 'Monitor mandi benchmarks, compare states and lock better deals before you sell.',
            cta: 'Explore Insights'
        },
        location: {
            detecting: 'Detecting your location…',
            denied: 'Permission denied',
            unavailable: 'Location unavailable'
        },
        footer: {
            help: 'Help & Support',
            about: 'About Us',
            language: 'Language',
            rights: 'All rights reserved.'
        },
        loadingText: 'Loading experience…'
    },
    // ... other languages (kept exactly as you provided) ...
    hi: {
        hero: [
            { title: 'अपने आसपास उपकरण खोजें', subtitle: 'स्मार्ट किराया, सत्यापित सूची और त्वरित बुकिंग' },
            { title: 'प्रमाणित मजदूर किराए पर लें', subtitle: 'विश्वसनीय खेत मजदूरों से तुरंत जुड़ें' },
            { title: 'स्मार्ट फसल अनुशंसाएँ', subtitle: 'बेहतर पैदावार और योजना के लिए एआई सुझाव' }
        ],
        actions: {
            rent: 'आधुनिक ट्रैक्टर, हार्वेस्टर और उपकरण जब भी चाहें प्राप्त करें।',
            hire: 'सत्यापित अनुभव और पारदर्शी कीमत वाले श्रमिक किराए पर लें।',
            weather: 'खेत में जाने से पहले स्थानीय मौसम जानकारी पाएं।',
            diversify: 'मिट्टी और जलवायु के अनुसार लाभदायक फसल मिश्रण की योजना बनाएं।',
            market: 'रीयल-टाइम मंडी रुझान देखें और सबसे अच्छे दाम न चूकें।'
        },
        highlights: {
            diversificationTitle: 'स्मार्ट विविधीकरण',
            diversificationDescription: 'दोहरी फसल रणनीतियाँ देखें, लाभ की तुलना करें और पूरे सीज़न की योजना बनाएं।',
            marketTitle: 'लाइव मार्केट प्राइस',
            marketDescription: 'मंडी दरों की निगरानी करें, राज्यों की तुलना करें और बेहतर सौदे पक्के करें।',
            cta: 'इनसाइट देखें'
        },
        location: {
            detecting: 'आपका स्थान पता लगाया जा रहा है…',
            denied: 'अनुमति अस्वीकार',
            unavailable: 'स्थान उपलब्ध नहीं'
        },
        footer: {
            help: 'सहायता और समर्थन',
            about: 'हमारे बारे में',
            language: 'भाषा',
            rights: 'सभी अधिकार सुरक्षित।'
        },
        loadingText: 'लोड हो रहा है…'
    },
    mr: {
        hero: [
            { title: 'तुमच्या आसपास उपकरण शोधा', subtitle: 'स्मार्ट भाडे, सत्यापित यादी आणि जलद बुकिंग' },
            { title: 'विश्वासार्ह मजूर भाड्याने घ्या', subtitle: 'विश्वस्त शेतमजूरांशी क्षणात संपर्क करा' },
            { title: 'स्मार्ट पीक शिफारसी', subtitle: 'उच्च उत्पादनासाठी एआय मार्गदर्शन' }
        ],
        actions: {
            rent: 'आधुनिक ट्रॅक्टर आणि साधने तुमच्या वेळापत्रकानुसार मिळवा.',
            hire: 'अनुभवी मजूर पारदर्शक दरात भाड्याने घ्या.',
            weather: 'शेतात जाण्यापूर्वी स्थानिक हवामान कळू द्या.',
            diversify: 'माती आणि हवामानावर आधारित लाभदायक पीक संयोजन ठरवा.',
            market: 'मंडीतील थेट किमती पाहा आणि योग्य वेळी विक्री करा.'
        },
        highlights: {
            diversificationTitle: 'स्मार्ट विविधीकरण',
            diversificationDescription: 'दुहेरी पीक धोरणे पाहा आणि हंगामभर आत्मविश्वासाने नियोजन करा.',
            marketTitle: 'लाइव्ह मार्केट किंमत',
            marketDescription: 'मंडी दर पाहा, राज्यांची तुलना करा आणि चांगले सौदे निश्चित करा.',
            cta: 'इनसाइट्स पाहा'
        },
        location: {
            detecting: 'तुमचे स्थान शोधत आहोत…',
            denied: 'परवानगी नाकारली',
            unavailable: 'स्थान उपलब्ध नाही'
        },
        footer: {
            help: 'मदत व सहाय्य',
            about: 'आमच्याबद्दल',
            language: 'भाषा',
            rights: 'सर्व हक्क राखीव.'
        },
        loadingText: 'लोड होत आहे…'
    },
    ta: {
        hero: [
            { title: 'உங்கள் அருகில் உள்ள உபகரணங்களை கண்டுபிடிக்கவும்', subtitle: 'ஸ்மார்ட் வாடகை, சரிபார்க்கப்பட்ட பட்டியல், உடனடி முன்பதிவு' },
            { title: 'நம்பகமான தொழிலாளர்களை வேலைக்கு எடுங்கள்', subtitle: 'நம்பத்தகுந்த வயல்வெளி தொழிலாளர்களுடன் உடனடியாக இணைக' },
            { title: 'ஸ்மார்ட் பயிர் பரிந்துரைகள்', subtitle: 'உயர் மகசூலுக்கு ஏஐ ஆலோசனை' }
        ],
        actions: {
            rent: 'நவீன டிராக்டர் மற்றும் கருவிகளை தேவையான நேரத்தில் பெறுங்கள்.',
            hire: 'அனுபவமுள்ள தொழிலாளர்களை வெளிப்படையான விலையில் பணியமர்த்துங்கள்.',
            weather: 'பயிரிடுவதற்கு முன் உள்ளூர் வானிலை முன்னறிவிப்பு பெறுங்கள்.',
            diversify: 'மண் மற்றும் காலநிலைக்கு ஏற்ற லாபகரமான பயிர் கலவை திட்டமிடுங்கள்.',
            market: 'நேரடி சந்தை போக்குகளை கவனித்து சிறந்த விலையைப் பெறுங்கள்.'
        },
        highlights: {
            diversificationTitle: 'ஸ்மார்ட் பன்முகப்படுத்தல்',
            diversificationDescription: 'இரட்டை பயிர் திட்டங்களை காட்சிப்படுத்தி முழு பருவத்தையும் தன்னம்பிக்கையுடன் திட்டமிடுங்கள்.',
            marketTitle: 'நேரடி சந்தை விலை',
            marketDescription: 'மண்டி விலைகளை கண்காணித்து மாநிலங்களை ஒப்பிட்டு சிறந்த ஒப்பந்தங்களை முடிவு செய்யுங்கள்.',
            cta: 'ஆழ்ந்த பார்வை'
        },
        location: {
            detecting: 'உங்கள் இருப்பிடத்தை கண்டறிகிறோம்…',
            denied: 'அனுமதி மறுக்கப்பட்டது',
            unavailable: 'இருப்பிடம் கிடைக்கவில்லை'
        },
        footer: {
            help: 'உதவி & ஆதரவு',
            about: 'எங்களை பற்றி',
            language: 'மொழி',
            rights: 'அனைத்து உரிமைகளும் பாதுகாக்கப்படுகின்றன.'
        },
        loadingText: 'ஏற்றப்படுகிறது…'
    },
    te: {
        hero: [
            { title: 'మీ సమీపంలోని పరికరాలను కనుగొనండి', subtitle: 'స్మార్ట్ అద్దె, ధృవీకరించిన జాబితాలు, తక్షణ బుకింగ్' },
            { title: 'నమ్మకమైన కూలీలను işe کریں', subtitle: 'నమ్మదగిన కూలీలతో వెంటనే కలవండి' },
            { title: 'స్మార్ట్ పంట సిఫార్సులు', subtitle: 'మంచి దిగుబడులకు ఏఐ సూచనలు' }
        ],
        actions: {
            rent: 'ఆధునిక ట్రాక్టర్లు, హార్వెస్టర్లు అవసరమైనప్పుడు పొందండి.',
            hire: 'అనుభవజ్ఞులను పారదర్శక ధరకే işe చేసుకోండి.',
            weather: 'పొలంలోకి వెళ్ళే ముందు స్థానిక వాతావరణాన్ని తెలుసుకోండి.',
            diversify: 'మట్టి మరియు వాతావరణానుసారం లాభదాయకమైన పంట కలయికలు రూపొందించండి.',
            market: 'రియల్-టైమ్ మండీ ధోరణులను పర్యవేక్షించి ఉత్తమ ధరలు పొందండి.'
        },
        highlights: {
            diversificationTitle: 'స్మార్ట్ వైవిధ్యం',
            diversificationDescription: 'డబుల్ పంట వ్యూహాలను చూడండి మరియు సీజన్ మొత్తాన్ని ధైర్యంగా ప్లాన్ చేయండి.',
            marketTitle: 'లైవ్ మార్కెట్ ధర',
            marketDescription: 'మండీ రేట్లను గమనించి రాష్ట్రాలను పోల్చి మంచి ఒప్పందాలు చేసుకోండి.',
            cta: 'ఇన్‌సైట్స్ చూడండి'
        },
        location: {
            detecting: 'మీ స్థానం గుర్తిస్తున్నారు…',
            denied: 'అనుమతి నిరాకరించబడింది',
            unavailable: 'స్థానం అందుబాటులో లేదు'
        },
        footer: {
            help: 'సహాయం & మద్దతు',
            about: 'మా గురించి',
            language: 'భాష',
            rights: 'అన్ని హక్కులు రిజర్వ్.'
        },
        loadingText: 'లోడ్ అవుతోంది…'
    },
    kn: {
        hero: [
            { title: 'ನಿಮ್ಮ ಹತ್ತಿರದ ಉಪಕರಣಗಳನ್ನು ಹುಡುಕಿ', subtitle: 'ಸ್ಮಾರ್ಟ್ ಬಾಡಿಗೆ, ಪರಿಶೀಲಿತ ಪಟ್ಟಿ, ಕ್ಷಣಿಕ ಬುಕ್ಕಿಂಗ್' },
            { title: 'ಪರಿಶೀಲಿತ ಕಾರ್ಮಿಕರನ್ನು ನೇಮಿಸಿ', subtitle: 'ನಂಬಲರ್ಹ ಕಾರ್ಮಿಕರೊಂದಿಗೆ ತಕ್ಷಣ ಸಂಪರ್ಕಿಸಿರಿ' },
            { title: 'ಸ್ಮಾರ್ಟ್ ಬೆಳೆ ಶಿಫಾರಸುಗಳು', subtitle: 'ಉತ್ತಮ ಉತ್ಪಾದನೆಗಾಗಿ ಏಐ ಸಲಹೆ' }
        ],
        actions: {
            rent: 'ಆಧುನಿಕ ಟ್ರಾಕ್ಟರ್ ಮತ್ತು ಉಪಕರಣಗಳನ್ನು ಅಗತ್ಯವಿರುವಾಗ ಪಡೆಯಿರಿ.',
            hire: 'ಅನುಭವಸಂಪನ್ನ ಕಾರ್ಮಿಕರನ್ನು ಪಾರದರ್ಶಕ ದರದಲ್ಲಿ ನೇಮಕಮಾಡಿ.',
            weather: 'ಗದ್ದೆಗೆ ಹೋಗುವ ಮೊದಲು ಸ್ಥಳೀಯ ಹವಾಮಾನ ತಿಳಿದುಕೊಳ್ಳಿ.',
            diversify: 'ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನಕ್ಕೆ ತಕ್ಕಂತೆ ಲಾಭದಾಯಕ ಬೆಳೆ ಸಂಯೋಜನೆ ರೂಪಿಸಿರಿ.',
            market: 'ರಿಯಲ್-ಟೈಮ್ ಮಾರುಕಟ್ಟೆ ಧೋರಣೆಯನ್ನು ಗಮನಿಸಿ ಉತ್ತಮ ಬೆಲೆ ಪಡೆಯಿರಿ.'
        },
        highlights: {
            diversificationTitle: 'ಸ್ಮಾರ್ಟ್ ವೈವಿಧ್ಯೀಕರಣ',
            diversificationDescription: 'ಎರಡು ಬೆಳೆ ತಂತ್ರಗಳನ್ನು ವೀಕ್ಷಿಸಿ ಮತ್ತು ಸಂಪೂರ್ಣ ರುತುವನ್ನು ಯೋಜಿಸಿರಿ.',
            marketTitle: 'ಲೈವ್ ಮಾರ್ಕೆಟ್ ಬೆಲೆ',
            marketDescription: 'ಮಾರುಕಟ್ಟೆ ದರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ರಾಜ್ಯಗಳನ್ನು ಹೋಲಿಸಿ ಒಳ್ಳೆಯ ಒಪ್ಪಂದ ಮಾಡಿ.',
            cta: 'ಅಭ್ಯಂತರ ನೋಡಿ'
        },
        location: {
            detecting: 'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಪತ್ತೆಹಚ್ಚಲಾಗುತ್ತಿದೆ…',
            denied: 'ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ',
            unavailable: 'ಸ್ಥಳ ಲಭ್ಯವಿಲ್ಲ'
        },
        footer: {
            help: 'ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ',
            about: 'ನಮ್ಮ ಬಗ್ಗೆ',
            language: 'ಭಾಷೆ',
            rights: 'ಎಲ್ಲ ಹಕ್ಕುಗಳು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.'
        },
        loadingText: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ…'
    },
    gu: {
        hero: [
            { title: 'તમારા નજીક ઉપકરણો શોધો', subtitle: 'સ્માર્ટ ભાડે, ચકાસેલ યાદી અને તરત બુકિંગ' },
            { title: 'પ્રમાણિત મજૂરો ભાડે લો', subtitle: 'વિશ્વસनीय ખેડૂત મજૂરો સાથે તરત જોડાઓ' },
            { title: 'સ્માર્ટ પાક ભલામણો', subtitle: 'ઉચ્ચ ઉપજ માટે એઆઈ સલાહ' }
        ],
        actions: {
            rent: 'આધુનિક ટ્રેક્ટર અને સાધનો જ્યારે જરૂર હોય ત્યારે મેળવો.',
            hire: 'અનુભવી મજૂરોને પારદર્શક દરે ભાડે લો.',
            weather: 'ખેતરમાં જવા પહેલાં સ્થાનિક હવામાન જાણો.',
            diversify: 'માટી અને હવામાન પ્રમાણે નફાકારક પાક સંયોજન બનાવો.',
            market: 'લાઈવ બજાર ટ્રેન્ડ જુઓ અને શ્રેષ્ઠ ભાવ મેળવો.'
        },
        highlights: {
            diversificationTitle: 'સ્માર્ટ વિવિધતા',
            diversificationDescription: 'ડ્યુઅલ પાક વ્યૂહરચનાઓ જુઓ અને આખો સિઝન આત્મવિશ્વાસથી પ્લાન કરો.',
            marketTitle: 'લાઈવ માર્કેટ કિંમત',
            marketDescription: 'મડી ભાવોની દેખરેખ રાખો, રાજ્યની તુલના કરો અને સારો સોદો કરો.',
            cta: 'ઇનસાઇટ્સ જુઓ'
        },
        location: {
            detecting: 'તમારું સ્થાન શોધી રહ્યા છીએ…',
            denied: 'પરવાનગી નકારી',
            unavailable: 'સ્થાન ઉપલબ્ધ નથી'
        },
        footer: {
            help: 'મદદ અને સપોર્ટ',
            about: 'અમારા વિશે',
            language: 'ભાષા',
            rights: 'બધા અધિકારો સુરક્ષિત.'
        },
        loadingText: 'લોડ થઈ રહ્યું છે…'
    },
    bn: {
        hero: [
            { title: 'আপনার নিকটবর্তী যন্ত্রপাতি খুঁজুন', subtitle: 'স্মার্ট ভাড়া, যাচাইকৃত তালিকা ও তাৎক্ষণিক বুকিং' },
            { title: 'বিশ্বস্ত শ্রমিক নিয়োগ করুন', subtitle: 'ভরসাযোগ্য মাঠকর্মীদের সঙ্গে সেকেন্ডেই যুক্ত হন' },
            { title: 'স্মার্ট ফসল সুপারিশ', subtitle: 'উচ্চ ফলনের জন্য এআই পরামর্শ' }
        ],
        actions: {
            rent: 'আধুনিক ট্র্যাক্টর ও যন্ত্র যখন খুশি নিন।',
            hire: 'অভিজ্ঞ শ্রমিকদের স্বচ্ছ দামে নিয়োগ করুন।',
            weather: 'ক্ষেতে যাওয়ার আগে স্থানীয় আবহাওয়া জেনে নিন।',
            diversify: 'মাটি ও আবহাওয়ার সাথে মানানসই লাভজনক ফসল পরিকল্পনা করুন।',
            market: 'রিয়েল-টাইম বাজার প্রবণতা দেখুন এবং সেরা দাম পান।'
        },
        highlights: {
            diversificationTitle: 'স্মার্ট বৈচিত্র্য',
            diversificationDescription: 'দ্বৈত ফসল কৌশল দেখুন এবং সমগ্র মৌসুম আত্মবিশ্বাসে পরিকল্পনা করুন।',
            marketTitle: 'লাইভ মার্কেট প্রাইস',
            marketDescription: 'মণ্ডি দরের উপর নজর রাখুন, রাজ্য তুলনা করুন এবং ভালো চুক্তি করুন।',
            cta: 'ইনসাইট দেখুন'
        },
        location: {
            detecting: 'আপনার অবস্থান নির্ণয় করা হচ্ছে…',
            denied: 'অনুমতি অস্বীকৃত',
            unavailable: 'অবস্থান অনুপলব্ধ'
        },
        footer: {
            help: 'সহায়তা ও সমর্থন',
            about: 'আমাদের সম্পর্কে',
            language: 'ভাষা',
            rights: 'সমস্ত অধিকার সংরক্ষিত।'
        },
        loadingText: 'লোড হচ্ছে…'
    }
};

// ----------------- Header -----------------
const Header: React.FC<{ user: User | null; onLogout: () => void }> = ({ user, onLogout }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [locationLabel, setLocationLabel] = useState<string>('');
    const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('loading');
    const { language, setLanguage, t } = useLanguage();
    const [showLangMenu, setShowLangMenu] = useState(false);
    const copy = localizedCopy[language as LanguageKey] || localizedCopy.en;
    const languages = LANGUAGE_OPTIONS;

    useEffect(() => {
        const defaultAvatar = `https://i.pravatar.cc/120?u=${user?.email || 'farmer'}`;
        if (!user) {
            setAvatarUrl(defaultAvatar);
            return;
        }
        const storageKey = `ks-avatar-${user.email}`;
        const saved = localStorage.getItem(storageKey);
        setAvatarUrl(saved || defaultAvatar);
    }, [user]);

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationStatus('error');
            setLocationLabel(copy.location.unavailable);
            return;
        }
        setLocationStatus('loading');
        setLocationLabel(copy.location.detecting);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
                    const data = await response.json();
                    const label = data?.address
                        ? `${data.address.city || data.address.town || data.address.village || ''}, ${data.address.state || ''}`.trim().replace(/^,|,$/g, '')
                        : `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`;
                    setLocationLabel(label || copy.location.unavailable);
                    setLocationStatus('ready');
                } catch (error) {
                    console.error('Location lookup failed', error);
                    setLocationStatus('error');
                    setLocationLabel(copy.location.unavailable);
                }
            },
            (error) => {
                console.warn('Location permission denied', error);
                setLocationStatus('error');
                setLocationLabel(copy.location.denied);
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
        );
    }, [copy.location.denied, copy.location.detecting, copy.location.unavailable]);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user) return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            setAvatarUrl(result);
            localStorage.setItem(`ks-avatar-${user.email}`, result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-brand-green">Krushi Sathi</h1>
                <div className="hidden md:flex items-center gap-2 text-gray-600">
                    <MapPinIcon className={`${locationStatus === 'loading' ? 'animate-pulse text-brand-green' : ''}`} />
                    <span className="capitalize">{locationLabel}</span>
                </div>
                <div className="flex items-center gap-4">
                    <p className="hidden sm:block text-gray-700">{t?.('welcome') || 'Welcome'}, {user?.name?.split(' ')[0] || 'Farmer'} 👋</p>
                    <button aria-label="Notifications" className="text-gray-600 hover:text-brand-green transition-all smooth-transition transform hover:scale-110"><BellIcon /></button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-full border-2 border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/50"
                        aria-label="Update profile picture"
                    >
                        <img src={avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleAvatarChange}
                    />
                    <div className="relative">
                        <button
                            onClick={() => setShowLangMenu(!showLangMenu)}
                            className="p-2 rounded-full hover:bg-gray-100 transition-all smooth-transition transform hover:scale-110"
                            aria-label="Language"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                        </button>
                        {showLangMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition smooth-transition flex items-center gap-2 ${language === lang.code ? 'bg-brand-green/10 text-brand-green font-semibold' : ''}`}
                                    >
                                        <span>{lang.flag}</span>
                                        <span>{lang.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onLogout}
                        className="inline-flex items-center rounded-full border border-brand-green text-brand-green font-semibold px-4 py-1.5 hover:bg-brand-green hover:text-white transition-all smooth-transition transform hover:scale-105"
                    >
                        {t?.('logout') || 'Logout'}
                    </button>
                </div>
            </div>
        </header>
    );
};

// ----------------- Hero -----------------
const HeroBanner: React.FC = () => {
    const { language } = useLanguage();
    const copy = localizedCopy[language as LanguageKey] || localizedCopy.en;
    const heroSlides = copy.hero;

    // your 3 images (local preview-safe paths)
    const heroImages = [
        "https://www.rishabhsoft.com/wp-content/uploads/2022/04/RSPL-Std-Case-Farming-Equipment-Hiring-Platform-Development-.jpg", // equipment
        "https://images.indianexpress.com/2015/03/farmers-main1.jpg", // labourers
        "https://blogmedia.testbook.com/blog/wp-content/uploads/2023/10/crop-diversification-7be1fb9e.png"  // smart crop
    ];

    const [current, setCurrent] = useState(0);
    const [parallaxOffset, setParallaxOffset] = useState(0);

    // slide interval (uses heroSlides.length so it always matches your copy)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroSlides.length]);

    // parallax scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const offset = window.pageYOffset;
            if (offset < 800) {
                setParallaxOffset(offset);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatedSection className="relative h-72 md:h-[22rem] rounded-[32px] overflow-hidden shadow-xl">
            {heroSlides.map((banner, index) => {
                // safety: ensure an image exists for this slide, otherwise use a soft placeholder
                const imageUrl = heroImages[index] ?? 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80';

                return (
                    <div
                        key={index}
                        className="absolute inset-0 transition-transform duration-1000 ease-in-out flex items-center justify-center p-8 md:p-16 overflow-hidden"
                        style={{ transform: `translateX(${(index - current) * 100}%) translateY(${parallaxOffset * 0.1}px)` }}
                    >
                        {/* background image + light overlay (reduced opacity so image is visible) */}
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.20), rgba(0,0,0,0.05)), url(${imageUrl})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center"
                            }}
                        />

                        <div className="relative text-center z-10 text-white space-y-4 px-4">
                            <h2 className={`text-3xl md:text-5xl font-black tracking-tight transition-all duration-700 ease-out delay-200 ${index === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                                {banner.title}
                            </h2>
                            <p className={`text-base md:text-xl font-medium transition-all duration-700 ease-out delay-300 ${index === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                                {banner.subtitle}
                            </p>
                        </div>
                    </div>
                );
            })}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${index === current ? 'bg-brand-green' : 'bg-white/50 hover:bg-white/75'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </AnimatedSection>
    );
};

// ----------------- Quick actions -----------------
const QuickActions: React.FC = () => {
    const navigate = useNavigate();
    const { language, t } = useLanguage();
    const copy = localizedCopy[language as LanguageKey] || localizedCopy.en;

    const cards = [
        {
            title: t?.('rentEquipment') || 'Rent Equipment',
            description: copy.actions.rent,
            image: 'https://www.afgri.com.au/media/strongready-r4a052760.jpg',
            path: '/farmer/rent-equipment',
            cta: t?.('rentEquipment') || 'Rent Equipment'
        },
        {
            title: copy.hero[1].title,
            description: copy.actions.hire,
            image: 'https://img.freepik.com/premium-photo/workers-work-field-harvesting-manual-labor-farming-agriculture-agro-industry_926199-2094884.jpg',
            path: '/farmer/hire-labour',
            cta: copy.hero[1].title
        },
        {
            title: t?.('weatherForecast') || 'Weather Forecast',
            description: copy.actions.weather,
            image: 'https://www.futurefarming.com/app/uploads/2024/08/Firefly-using-AI-for-weather-forecast-in-agriculture-7417.jpeg',
            path: '/farmer/weather-forecast',
            cta: t?.('weatherForecast') || 'Weather Forecast'
        },
        {
            title: t?.('smartDiversification') || 'Smart Diversification',
            description: copy.actions.diversify,
            image: 'https://theinterview.world/wp-content/uploads/2023/12/Diversification-in-Agriculture.jpg',
            path: '/farmer/smart-diversification',
            cta: t?.('smartDiversification') || 'Smart Diversification'
        },
        {
            title: t?.('marketPrice') || 'Live Market Price',
            description: copy.actions.market,
            image: 'https://www.agrisay.com/wp-content/uploads/2023/07/Fluctuated-farmer-income-610x343.webp',
            path: '/farmer/market-price',
            cta: t?.('marketPrice') || 'Live Market Price'
        }
    ];
    return (
        <AnimatedSection>
            <div className="grid gap-8 md:grid-cols-2">
                {cards.map((card, index) => (
                    <div
                        key={card.title}
                        className="relative h-72 rounded-[32px] overflow-hidden shadow-xl group focus-within:ring-2 focus-within:ring-brand-green"
                    >
                        <img src={card.image} alt={card.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-black/10"></div>
                        <div className="relative z-10 h-full flex flex-col justify-between p-8 text-white">
                            <div>
                                <p className="uppercase tracking-[0.35em] text-xs text-white/70">{copy.highlights.cta}</p>
                                <h3 className="text-3xl font-black mt-3 drop-shadow-lg">{card.title}</h3>
                                <p className="mt-4 text-sm md:text-base text-white/85 leading-relaxed max-w-2xl">{card.description}</p>
                            </div>
                            <button
                                onClick={() => navigate(card.path)}
                                className="self-start px-6 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 font-semibold tracking-wide hover:bg-white/30 transition-all"
                            >
                                {card.cta}
                            </button>
                        </div>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-brand-green/40 to-transparent"></div>
                        <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-[32px] shadow-[0_15px_45px_rgba(16,185,129,0.2)]"></div>
                    </div>
                ))}
            </div>
        </AnimatedSection>
    );
};

// ----------------- Footer -----------------
const Footer: React.FC = () => {
    const { language } = useLanguage();
    const copy = localizedCopy[language as LanguageKey] || localizedCopy.en;
    const languageMeta = LANGUAGE_OPTIONS.find(item => item.code === language) ?? LANGUAGE_OPTIONS[0];

    return (
        <footer className="bg-gray-800 text-white py-8 mt-12">
            <div className="container mx-auto px-6 text-center space-y-4">
                <h3 className="text-xl font-bold">Krushi Sathi</h3>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <a href="#" className="hover:text-brand-green transition">{copy.footer.help}</a>
                    <a href="#" className="hover:text-brand-green transition">{copy.footer.about}</a>
                    <span className="text-gray-300">{copy.footer.language}: {languageMeta.name}</span>
                </div>
                <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Krushi Sathi. {copy.footer.rights}</p>
            </div>
        </footer>
    );
};

// ----------------- FarmerHomePage (page) -----------------
const FarmerHomePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const { language } = useLanguage();
    const copy = localizedCopy[language as LanguageKey] || localizedCopy.en;

    useEffect(() => {
        const currentUser = db.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser);
        }
    }, [navigate]);

    const handleLogout = () => {
        db.logoutUser();
        navigate('/login');
    };

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">{copy.loadingText}</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800">
            <Header user={user} onLogout={handleLogout} />
            <main className="pt-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
                    <HeroBanner />
                    <QuickActions />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FarmerHomePage;
