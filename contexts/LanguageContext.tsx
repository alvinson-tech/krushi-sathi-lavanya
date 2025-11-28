import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'kn' | 'gu' | 'bn';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  welcome: {
    en: 'Welcome',
    hi: 'स्वागत है',
    mr: 'स्वागत आहे',
    ta: 'வரவேற்கிறோம்',
    te: 'స్వాగతం',
    kn: 'ಸ್ವಾಗತ',
    gu: 'સ્વાગત',
    bn: 'স্বাগতম',
  },
  logout: {
    en: 'Logout',
    hi: 'लॉग आउट',
    mr: 'लॉग आउट',
    ta: 'வெளியேறு',
    te: 'లాగ్ అవుట్',
    kn: 'ಲಾಗ್ ಔಟ್',
    gu: 'લૉગ આઉટ',
    bn: 'লগআউট',
  },
  rentEquipment: {
    en: 'Rent Equipment',
    hi: 'उपकरण किराए पर लें',
    mr: 'उपकरणे भाड्याने घ्या',
    ta: 'உபகரணங்களை வாடகைக்கு எடுங்கள்',
    te: 'పరికరాలను అద్దెకు తీసుకోండి',
    kn: 'ಸಲಕರಣೆಗಳನ್ನು ಬಾಡಿಗೆಗೆ ತೆಗೆದುಕೊಳ್ಳಿ',
    gu: 'સાધનો ભાડે લો',
    bn: 'সরঞ্জাম ভাড়া নিন',
  },
  smartDiversification: {
    en: 'Smart Diversification',
    hi: 'स्मार्ट विविधीकरण',
    mr: 'स्मार्ट विविधीकरण',
    ta: 'ஸ்மார்ட் பன்முகப்படுத்தல்',
    te: 'స్మార్ట్ వైవిధ్యం',
    kn: 'ಸ್ಮಾರ್ಟ್ ವೈವಿಧ್ಯೀಕರಣ',
    gu: 'સ્માર્ટ વિવિધતા',
    bn: 'স্মার্ট বৈচিত্র্য',
  },
  weatherForecast: {
    en: 'Weather Forecast',
    hi: 'मौसम पूर्वानुमान',
    mr: 'हवामान अंदाज',
    ta: 'வானிலை முன்னறிவிப்பு',
    te: 'వాతావరణ సూచన',
    kn: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ',
    gu: 'હવામાન પૂર્વાનુમાન',
    bn: 'আবহাওয়ার পূর্বাভাস',
  },
  marketPrice: {
    en: 'Live Market Price',
    hi: 'लाइव मार्केट प्राइस',
    mr: 'लाइव्ह मार्केट किंमत',
    ta: 'நேரடி சந்தை விலை',
    te: 'లైవ్ మార్కెట్ ధర',
    kn: 'ಲೈವ್ ಮಾರ್ಕೆಟ್ ಬೆಲೆ',
    gu: 'લાઇવ માર્કેટ કિંમત',
    bn: 'লাইভ মার্কেট প্রাইস',
  },
  cropRecommendation: {
    en: 'Crop Recommendation',
    hi: 'फसल सिफारिश',
    mr: 'पीक शिफारस',
    ta: 'பயிர் பரிந்துரை',
    te: 'పంట సిఫార్సు',
    kn: 'ಬೆಳೆ ಶಿಫಾರಸು',
    gu: 'પાકની ભલામણ',
    bn: 'ফসলের সুপারিশ',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

