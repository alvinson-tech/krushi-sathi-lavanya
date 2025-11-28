import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as db from '../../services/db';
import { User } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

const CropIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/>
    </svg>
);

const ChevronLeftIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m15 18-6-6 6-6"/>
    </svg>
);

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

const diversificationStrategies = [
    {
        title: 'Wheat + Mustard',
        description: 'Grow wheat and mustard together for higher yield and year-round income',
        benefits: ['Higher yield per hectare', 'Year-round income', 'Better soil health'],
        image: 'https://tse3.mm.bing.net/th/id/OIP.7ftVRZd8uJWC2NrR3Ka4YwHaEK?pid=Api&P=0&h=180',
        season: 'Rabi (Oct-Mar)',
    },
    {
        title: 'Rice + Fish Farming',
        description: 'Combine rice cultivation with fish farming for dual income',
        benefits: ['Dual income source', 'Natural pest control', 'Improved soil fertility'],
        image: 'https://tse1.mm.bing.net/th/id/OIP.COqtvLZkD4e9koxpJp7ZzQHaE6?pid=Api&P=0&h=180',
        season: 'Kharif (Jun-Oct)',
    },
    {
        title: 'Sugarcane + Intercropping',
        description: 'Intercrop vegetables with sugarcane for additional revenue',
        benefits: ['Additional revenue', 'Better land utilization', 'Reduced weed growth'],
        image: 'https://kj1bcdn.b-cdn.net/media/11171/interpluscroppingplusmoongpluswithplussugarcane-kj.jpg?width=1200',
        season: 'Year-round',
    },
    {
        title: 'Cotton + Pulses',
        description: 'Grow pulses between cotton rows for nitrogen fixation and extra income',
        benefits: ['Nitrogen fixation', 'Extra income', 'Reduced fertilizer cost'],
        image: 'https://tse4.mm.bing.net/th/id/OIP.tywk3yWsRiZ7nZb34xQLJQHaEK?pid=Api&P=0&h=180',
        season: 'Kharif (Jun-Oct)',
    },
];

const StrategyCard: React.FC<{ strategy: typeof diversificationStrategies[0] }> = ({ strategy }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="relative h-64 overflow-hidden">
            <img src={strategy.image} alt={strategy.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-2xl font-bold mb-2">{strategy.title}</h3>
                <p className="text-sm bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 inline-block">{strategy.season}</p>
            </div>
        </div>
        <div className="p-6">
            <p className="text-gray-600 mb-4">{strategy.description}</p>
            <div className="space-y-2">
                <p className="font-semibold text-gray-800">Benefits:</p>
                <ul className="space-y-1">
                    {strategy.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-600">
                            <span className="w-2 h-2 bg-brand-green rounded-full"></span>
                            {benefit}
                        </li>
                    ))}
                </ul>
            </div>
            <button className="mt-6 w-full py-3 bg-brand-green text-white font-bold rounded-full hover:bg-brand-green-dark transition-all smooth-transition transform hover:scale-105 shadow-lg">
                Learn More
            </button>
        </div>
    </div>
);

const Header: React.FC<{ user: User | null; onLogout: () => void }> = ({ user, onLogout }) => {
    const { language, setLanguage, t } = useLanguage();
    const [showLangMenu, setShowLangMenu] = useState(false);
    const languages = [
        { code: 'en' as const, name: 'English', flag: '🇬🇧' },
        { code: 'hi' as const, name: 'हिंदी', flag: '🇮🇳' },
        { code: 'mr' as const, name: 'मराठी', flag: '🇮🇳' },
        { code: 'ta' as const, name: 'தமிழ்', flag: '🇮🇳' },
        { code: 'te' as const, name: 'తెలుగు', flag: '🇮🇳' },
        { code: 'kn' as const, name: 'ಕನ್ನಡ', flag: '🇮🇳' },
        { code: 'gu' as const, name: 'ગુજરાતી', flag: '🇮🇳' },
        { code: 'bn' as const, name: 'বাংলা', flag: '🇮🇳' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-600 hover:text-brand-green transition smooth-transition">
                    <ChevronLeftIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Back</span>
                </button>
                <h1 className="text-2xl font-bold text-brand-green">Krushi Sathi</h1>
                <div className="flex items-center gap-4">
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
                        {t('logout')}
                    </button>
                </div>
            </div>
        </header>
    );
};

const SmartDiversificationPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const { t } = useLanguage();

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
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800">
            <Header user={user} onLogout={handleLogout} />
            <main className="pt-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
                    <AnimatedSection className="text-center mb-8">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">{t('smartDiversification')}</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Discover dual crop strategies that help you grow two or more crops together for higher yield and year-round income
                        </p>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {diversificationStrategies.map((strategy, idx) => (
                            <AnimatedSection key={idx} style={{ transitionDelay: `${idx * 100}ms` }}>
                                <StrategyCard strategy={strategy} />
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SmartDiversificationPage;

