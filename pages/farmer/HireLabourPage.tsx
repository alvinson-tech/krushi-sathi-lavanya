import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as db from '../../services/db';
import { User } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

const UserGroupIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
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

const labourerData = [
    { 
        id: 1,
        name: 'Ramesh Singh', 
        skill: 'Harvesting', 
        experience: '5 years', 
        rating: 4.5, 
        price: '₹700/day', 
        image: 'https://picsum.photos/seed/labourer1/100/100',
        location: 'Pune, Maharashtra',
        phone: '+91 98765 43210',
        availability: 'Available',
        completedJobs: 45,
        languages: ['Hindi', 'Marathi']
    },
    { 
        id: 2,
        name: 'Suresh Patel', 
        skill: 'Sowing', 
        experience: '3 years', 
        rating: 4.8, 
        price: '₹650/day', 
        image: 'https://picsum.photos/seed/labourer2/100/100',
        location: 'Nashik, Maharashtra',
        phone: '+91 98765 43211',
        availability: 'Available',
        completedJobs: 32,
        languages: ['Marathi', 'Gujarati']
    },
    { 
        id: 3,
        name: 'Vikram Kumar', 
        skill: 'Irrigation', 
        experience: '8 years', 
        rating: 4.9, 
        price: '₹800/day', 
        image: 'https://picsum.photos/seed/labourer3/100/100',
        location: 'Aurangabad, Maharashtra',
        phone: '+91 98765 43212',
        availability: 'Available',
        completedJobs: 78,
        languages: ['Hindi', 'Marathi', 'English']
    },
    { 
        id: 4,
        name: 'Anita Devi', 
        skill: 'Weeding', 
        experience: '2 years', 
        rating: 4.2, 
        price: '₹600/day', 
        image: 'https://picsum.photos/seed/labourer4/100/100',
        location: 'Nagpur, Maharashtra',
        phone: '+91 98765 43213',
        availability: 'Available',
        completedJobs: 28,
        languages: ['Hindi', 'Marathi']
    },
    { 
        id: 5,
        name: 'Rajesh Yadav', 
        skill: 'Plowing', 
        experience: '6 years', 
        rating: 4.7, 
        price: '₹750/day', 
        image: 'https://picsum.photos/seed/labourer5/100/100',
        location: 'Kolhapur, Maharashtra',
        phone: '+91 98765 43214',
        availability: 'Available',
        completedJobs: 56,
        languages: ['Marathi', 'Kannada']
    },
    { 
        id: 6,
        name: 'Priya Sharma', 
        skill: 'Fertilizer Application', 
        experience: '4 years', 
        rating: 4.6, 
        price: '₹680/day', 
        image: 'https://picsum.photos/seed/labourer6/100/100',
        location: 'Sangli, Maharashtra',
        phone: '+91 98765 43215',
        availability: 'Available',
        completedJobs: 41,
        languages: ['Marathi', 'Hindi']
    },
    { 
        id: 7,
        name: 'Mohan Das', 
        skill: 'Crop Harvesting', 
        experience: '10 years', 
        rating: 4.9, 
        price: '₹850/day', 
        image: 'https://picsum.photos/seed/labourer7/100/100',
        location: 'Solapur, Maharashtra',
        phone: '+91 98765 43216',
        availability: 'Available',
        completedJobs: 92,
        languages: ['Marathi', 'Hindi', 'Kannada']
    },
    { 
        id: 8,
        name: 'Sunita Patil', 
        skill: 'Seed Sowing', 
        experience: '3 years', 
        rating: 4.4, 
        price: '₹620/day', 
        image: 'https://picsum.photos/seed/labourer8/100/100',
        location: 'Satara, Maharashtra',
        phone: '+91 98765 43217',
        availability: 'Available',
        completedJobs: 35,
        languages: ['Marathi']
    },
];

const LabourerCard: React.FC<{ item: typeof labourerData[0]; onHire: (item: typeof labourerData[0]) => void }> = ({ item, onHire }) => (
    <div className="flex-shrink-0 w-72 bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center group hover:shadow-xl transition-all smooth-transition transform hover:-translate-y-2">
        <img src={item.image} alt={item.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg -mt-16 transition-transform group-hover:scale-110" />
        <h4 className="font-bold text-xl mt-4">{item.name}</h4>
        <p className="text-sm bg-brand-green/10 text-brand-green font-semibold px-3 py-1 rounded-full mt-2">{item.skill}</p>
        <div className="text-yellow-500 flex mt-3 text-lg">{'★'.repeat(Math.round(item.rating))}{'☆'.repeat(5-Math.round(item.rating))} <span className="text-gray-600 ml-2 text-sm">({item.rating})</span></div>
        <div className="mt-4 w-full space-y-2">
            <p className="text-sm text-gray-600">📍 {item.location}</p>
            <p className="text-sm text-gray-600">📞 {item.phone}</p>
            <p className="text-sm text-gray-600">💼 {item.experience} • {item.completedJobs} jobs</p>
            <p className="text-xs text-gray-500">Languages: {item.languages.join(', ')}</p>
        </div>
        <div className="flex justify-between items-center mt-6 w-full">
            <p className="font-bold text-brand-brown text-lg">{item.price}</p>
            <button 
                onClick={() => onHire(item)}
                className="px-6 py-2 bg-brand-brown text-white text-sm font-bold rounded-full hover:bg-opacity-80 transition-all smooth-transition transform hover:scale-105"
            >
                Hire Now
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

const HireLabourPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [labourers] = useState(labourerData);
    const [selectedSkill, setSelectedSkill] = useState<string>('All');
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

    const handleLogout = () => {
        db.logoutUser();
        navigate('/login');
    };

    const handleHire = (labourer: typeof labourerData[0]) => {
        alert(`Hiring ${labourer.name} for ${labourer.skill}. Contact: ${labourer.phone}`);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const skills = ['All', ...Array.from(new Set(labourers.map(l => l.skill)))];

    const filteredLabourers = selectedSkill === 'All' 
        ? labourers 
        : labourers.filter(l => l.skill === selectedSkill);

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800">
            <Header user={user} onLogout={handleLogout} />
            <main className="pt-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
                    <AnimatedSection className="text-center mb-8">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">Hire Skilled Labourers</h2>
                        <p className="text-lg text-gray-600">Find verified and experienced farm workers for your agricultural needs</p>
                    </AnimatedSection>

                    <AnimatedSection>
                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                            {skills.map(skill => (
                                <button
                                    key={skill}
                                    onClick={() => setSelectedSkill(skill)}
                                    className={`px-4 py-2 rounded-full font-semibold transition-all smooth-transition transform hover:scale-105 ${
                                        selectedSkill === skill
                                            ? 'bg-brand-brown text-white shadow-lg'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </AnimatedSection>

                    <AnimatedSection>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold">Available Labourers ({filteredLabourers.length})</h3>
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
                            {filteredLabourers.map(item => (
                                <LabourerCard key={item.id} item={item} onHire={handleHire} />
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </main>
        </div>
    );
};

export default HireLabourPage;

