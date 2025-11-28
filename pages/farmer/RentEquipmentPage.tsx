import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as db from '../../services/db';
import { User } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

const TractorIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 4h18"/><path d="m11 18-3-2 3-4-3-3 3-3"/><path d="M3 10h11"/><path d="M3 15h11"/><path d="M9 18h12"/>
    </svg>
);

const ChevronLeftIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m15 18-6-6 6-6"/>
    </svg>
);

const ChevronRightIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m9 18 6-6-6-6"/>
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

const initialEquipmentData = [
    { name: 'Tractor', price: '₹1200/hr', distance: '5 km', available: true, image: 'https://tse1.mm.bing.net/th/id/OIP.Dn1cpsiYr6aseczptIDQfQHaE8?pid=Api&P=0&h=180', description: 'Heavy-duty tractor for plowing and tilling' },
    { name: 'Harvester', price: '₹2500/hr', distance: '8 km', available: true, image: 'https://www.deere.com.au/assets/images/region-4/products/hay-and-forage/hay-and-forage-harvesting-equipment/self-propelled-forage-harvesters/8800/8800_sp_harvester_r4d076164_rrd_large_ea6d6176a0bac645a6ad75b3af6cf81b4897b711.jpg', description: 'Combine harvester for efficient crop harvesting' },
    { name: 'Rotavator', price: '₹800/hr', distance: '3 km', available: false, image: 'https://3.imimg.com/data3/ES/FO/MY-1742455/semi-champion-rotavator.jpg', description: 'Soil preparation and tilling equipment' },
    { name: 'Pesticide Sprayer', price: '₹500/day', distance: '6 km', available: true, image: 'https://eu-images.contentstack.com/v3/assets/bltdd43779342bd9107/bltb39ba6fde7e14017/63905568555dfd77b730f42e/Link20-20Bestway_Nov18_TypesofSprayers.jpg?width=770&auto=webp&quality=80&disable=upscale', description: 'Efficient pesticide and fertilizer spraying' },
    { name: 'Plough', price: '₹600/hr', distance: '10 km', available: true, image: 'https://tse4.mm.bing.net/th/id/OIP.3oIK7cmcEKPA6-zjxxrCqgHaGp?pid=Api&P=0&h=180', description: 'Traditional and modern ploughing equipment' },
    { name: 'Seed Drill', price: '₹900/hr', distance: '7 km', available: true, image: 'http://www.faizantraders.com/wp-content/uploads/2014/12/seed-drill.jpg', description: 'Precision seed sowing equipment' },
];

const EquipmentCard: React.FC<{ item: typeof initialEquipmentData[0] }> = ({ item }) => (
    <div className="flex-shrink-0 w-72 bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="relative h-48 overflow-hidden">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125" />
            <div className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold text-white rounded-full ${item.available ? 'bg-green-500 animate-sparkle' : 'bg-red-500'}`}>
                {item.available ? 'Available' : 'Booked'}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="p-5">
            <h4 className="font-bold text-xl mb-1">{item.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
            <p className="text-sm text-gray-500 mb-3">📍 {item.distance} away</p>
            <div className="flex justify-between items-center mt-4">
                <p className="font-bold text-brand-green text-lg">{item.price}</p>
                <button disabled={!item.available} className="px-5 py-2 bg-brand-green text-white text-sm font-bold rounded-full hover:bg-brand-green-dark disabled:bg-gray-300 transition-all transform hover:scale-105 shadow-lg">
                    Book Now
                </button>
            </div>
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

const RentEquipmentPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [equipment] = useState(initialEquipmentData);
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    useEffect(() => {
        const currentUser = db.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser);
        }
    }, [navigate]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

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
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">{t('rentEquipment')}</h2>
                        <p className="text-lg text-gray-600">Find and rent the equipment you need for your farm</p>
                    </AnimatedSection>

                    <AnimatedSection>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold">Available Equipment</h3>
                            <div className="hidden md:flex gap-2">
                                <button onClick={() => scroll('left')} className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all smooth-transition transform hover:scale-110">
                                    <ChevronLeftIcon />
                                </button>
                                <button onClick={() => scroll('right')} className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all smooth-transition transform hover:scale-110">
                                    <ChevronRightIcon />
                                </button>
                            </div>
                        </div>
                        <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                            {equipment.map((item, index) => (
                                <EquipmentCard key={`${item.name}-${index}`} item={item} />
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </main>
        </div>
    );
};

export default RentEquipmentPage;

