
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as db from '../../services/db';
import { useLanguage } from '../../contexts/LanguageContext';

const LabourerHomePage: React.FC = () => {
    const navigate = useNavigate();
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

    useEffect(() => {
        const currentUser = db.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        db.logoutUser();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
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
                            onClick={handleLogout}
                            className="inline-flex items-center rounded-full border border-brand-green text-brand-green font-semibold px-4 py-1.5 hover:bg-brand-green hover:text-white transition-all smooth-transition transform hover:scale-105"
                        >
                            {t('logout')}
                        </button>
                    </div>
                </div>
            </header>
            <div className="pt-20 flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Labourer Dashboard</h1>
                <p className="text-gray-600 mb-8">{t('welcome')}! Here you can find and manage job listings.</p>
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-semibold mb-4 text-brand-green">Job Listings</h2>
                    <p className="text-gray-500">This feature is coming soon. Stay tuned!</p>
                </div>
                <Link to="/" className="mt-8 text-brand-green hover:underline">Go back to Landing Page</Link>
            </div>
        </div>
    );
};

export default LabourerHomePage;

