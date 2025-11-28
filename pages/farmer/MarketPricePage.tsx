import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as db from '../../services/db';
import { User } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

const ChartIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 3v18h18"/><path d="M7 12l4-4 4 4 6-6"/>
    </svg>
);

const ChevronLeftIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m15 18-6-6 6-6"/>
    </svg>
);

interface MarketPrice {
    crop: string;
    area: string;
    price: number;
    unit: string;
    change: number;
    trend: 'up' | 'down' | 'stable';
}

const areas = ['Pune', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'];
const crops = ['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Tomato', 'Onion', 'Potato', 'Chilli', 'Turmeric', 'Ginger'];

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

const MarketPricePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [selectedArea, setSelectedArea] = useState('Pune');
    const [selectedCrop, setSelectedCrop] = useState('Wheat');
    const [prices, setPrices] = useState<MarketPrice[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useLanguage();

    useEffect(() => {
        const currentUser = db.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser);
            fetchMarketPrices();
        }
    }, [navigate, selectedArea, selectedCrop]);

    const fetchMarketPrices = async () => {
        setLoading(true);
        // Simulating real-time market price data
        // In production, use actual market price API
        setTimeout(() => {
            const mockPrices: MarketPrice[] = [
                { crop: selectedCrop, area: selectedArea, price: Math.floor(Math.random() * 5000) + 2000, unit: 'per quintal', change: Math.random() * 10 - 5, trend: Math.random() > 0.5 ? 'up' : 'down' },
                { crop: selectedCrop, area: selectedArea, price: Math.floor(Math.random() * 5000) + 2000, unit: 'per quintal', change: Math.random() * 10 - 5, trend: Math.random() > 0.5 ? 'up' : 'down' },
                { crop: selectedCrop, area: selectedArea, price: Math.floor(Math.random() * 5000) + 2000, unit: 'per quintal', change: Math.random() * 10 - 5, trend: 'stable' },
            ];
            setPrices(mockPrices);
            setLoading(false);
        }, 500);
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
                    <div className="text-center mb-8">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">{t('marketPrice')}</h2>
                        <p className="text-lg text-gray-600">Real-time market prices to help you make informed selling decisions</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Area</label>
                                <select
                                    value={selectedArea}
                                    onChange={(e) => setSelectedArea(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all smooth-transition"
                                >
                                    {areas.map(area => (
                                        <option key={area} value={area}>{area}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Crop/Vegetable</label>
                                <select
                                    value={selectedCrop}
                                    onChange={(e) => setSelectedCrop(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all smooth-transition"
                                >
                                    {crops.map(crop => (
                                        <option key={crop} value={crop}>{crop}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={fetchMarketPrices}
                            className="mt-4 w-full md:w-auto px-6 py-3 bg-brand-green text-white font-bold rounded-lg hover:bg-brand-green-dark transition-all smooth-transition transform hover:scale-105 shadow-lg"
                        >
                            {loading ? 'Loading...' : 'Get Latest Prices'}
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {prices.map((price, idx) => (
                                <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all smooth-transition transform hover:-translate-y-2">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">{price.area}</p>
                                            <h3 className="text-2xl font-bold text-gray-800">{price.crop}</h3>
                                        </div>
                                        <ChartIcon className="w-8 h-8 text-brand-green" />
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-3xl font-bold text-brand-green">₹{price.price.toLocaleString()}</p>
                                        <p className="text-sm text-gray-500">{price.unit}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {price.trend === 'up' ? (
                                            <>
                                                <span className="text-green-500 font-semibold">↑</span>
                                                <span className="text-green-500 font-semibold">+{price.change.toFixed(2)}%</span>
                                            </>
                                        ) : price.trend === 'down' ? (
                                            <>
                                                <span className="text-red-500 font-semibold">↓</span>
                                                <span className="text-red-500 font-semibold">{price.change.toFixed(2)}%</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-gray-500 font-semibold">→</span>
                                                <span className="text-gray-500 font-semibold">Stable</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MarketPricePage;

