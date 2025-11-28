
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as db from '../../services/db';
import { useLanguage } from '../../contexts/LanguageContext';

const BellIcon = (props: React.ComponentProps<'svg'>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
);

const MessageIcon = (props: React.ComponentProps<'svg'>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.4Z" />
    </svg>
);

const ChartTrendIcon = (props: React.ComponentProps<'svg'>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 3v18h18" />
        <path d="M7 14l4-4 3 3 5-5" />
    </svg>
);

const PlusIcon = (props: React.ComponentProps<'svg'>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
    </svg>
);

const ToolboxIcon = (props: React.ComponentProps<'svg'>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="18" height="12" x="3" y="7" rx="2" />
        <path d="M16 7V5H8v2" />
        <path d="M2 13h20" />
        <path d="m8.5 16 1-1h5l1 1" />
    </svg>
);

const ListingIcon = (props: React.ComponentProps<'svg'>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 5h18" />
        <path d="M3 12h18" />
        <path d="M3 19h18" />
        <path d="M9 5v14" />
    </svg>
);

const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.15 });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`${className} transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
            {children}
        </div>
    );
};

type Listing = {
    id: number;
    name: string;
    category: string;
    image: string;
    price: string;
    unit: string;
    availability: string;
    rating: number;
    bookings: number;
    status: 'Available' | 'Low Stock' | 'Paused';
};

type BookingRequest = {
    id: number;
    farmer: string;
    item: string;
    slot: string;
    price: string;
    type: 'Equipment' | 'Input';
};

const SellerHomePage: React.FC = () => {
    const navigate = useNavigate();
    const [sellerName, setSellerName] = useState('Seller');
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
            return;
        }
        if (currentUser?.name) {
            setSellerName(currentUser.name);
        }
    }, [navigate]);

    const summaryCards = [
        { label: 'Active Listings', value: '18', chip: '+3 this week', accent: 'from-emerald-500/15 to-white' },
        { label: 'This Month Earnings', value: '₹2.8L', chip: '↑ 18% vs last month', accent: 'from-brand-green/20 to-white' },
        { label: 'Upcoming Bookings', value: '12', chip: 'Next 7 days', accent: 'from-amber-200/40 to-white' },
        { label: 'Rating Overview', value: '4.8 / 5', chip: '126 reviews', accent: 'from-sky-200/50 to-white' },
    ];

    const quickActions = [
        { title: 'Add New Equipment', description: 'Upload tractors, harvesters & tools', icon: <PlusIcon className="w-6 h-6" /> },
        { title: 'Add Pesticide / Fertilizer', description: 'List agri-input inventory', icon: <ToolboxIcon className="w-6 h-6" /> },
        { title: 'Manage My Listings', description: 'Edit pricing, pause or boost', icon: <ListingIcon className="w-6 h-6" /> },
        { title: 'Messages & Inquiries', description: 'Reply to farmer chats', icon: <MessageIcon className="w-6 h-6" /> },
    ];

    const listings: Listing[] = [
        {
            id: 1,
            name: 'John Deere 5310 Tractor',
            category: 'Equipment',
            image: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=600&q=60',
            price: '₹1,100',
            unit: 'per hour',
            availability: 'Available from 4 PM today',
            rating: 4.9,
            bookings: 86,
            status: 'Available',
        },
        {
            id: 2,
            name: 'Rotavator - 6 Feet',
            category: 'Equipment',
            image: 'https://images.unsplash.com/photo-1508385082359-f38ae991e8f2?auto=format&fit=crop&w=600&q=60',
            price: '₹4,500',
            unit: 'per day',
            availability: 'Booked tomorrow',
            rating: 4.7,
            bookings: 54,
            status: 'Low Stock',
        },
        {
            id: 3,
            name: 'Organic Neem Oil',
            category: 'Input',
            image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=60',
            price: '₹320',
            unit: 'per litre',
            availability: '126 litres in stock',
            rating: 4.6,
            bookings: 210,
            status: 'Available',
        },
        {
            id: 4,
            name: 'Boom Sprayer',
            category: 'Equipment',
            image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=60',
            price: '₹950',
            unit: 'per acre',
            availability: 'Next slot 22 Nov',
            rating: 4.5,
            bookings: 41,
            status: 'Paused',
        },
    ];

    const bookingRequests: BookingRequest[] = [
        { id: 1, farmer: 'Anita Gaikwad', item: 'John Deere 5310 Tractor', slot: '21 Nov • 6 AM – 2 PM', price: '₹8,800', type: 'Equipment' },
        { id: 2, farmer: 'Harish Patel', item: 'Organic Neem Oil (80 L)', slot: 'Dispatch today', price: '₹25,600', type: 'Input' },
        { id: 3, farmer: 'Varun Reddy', item: 'Rotavator - 6 Feet', slot: '22 Nov • Full Day', price: '₹4,500', type: 'Equipment' },
    ];

    const messages = [
        { id: 1, farmer: 'Ragini Singh', preview: 'Can we extend the sprayer booking by 2 hours?', time: '2m ago', unread: true },
        { id: 2, farmer: 'Kailash Kumar', preview: 'Payment received. Tractor reached on time, thanks!', time: '35m ago', unread: false },
        { id: 3, farmer: 'S. Prakash', preview: 'Need bulk urea delivery next week. Pricing?', time: '1h ago', unread: true },
        { id: 4, farmer: 'Hema B', preview: 'Please share instructions for neem oil dilution.', time: '4h ago', unread: false },
    ];

    const weeklyBookings = [
        { label: 'Mon', value: 9 },
        { label: 'Tue', value: 14 },
        { label: 'Wed', value: 11 },
        { label: 'Thu', value: 15 },
        { label: 'Fri', value: 18 },
        { label: 'Sat', value: 12 },
        { label: 'Sun', value: 7 },
    ];

    const promotionalTips = [
        'Upload clear, daylight images – listings with better photos earn 32% more.',
        'Enable same-day pickup for equipment to appear in “Fast Track” searches.',
        'Respond to inquiries within 15 minutes to boost your search ranking.',
        'Bundle equipment with pesticides/fertilizers for seasonal packages.',
    ];

    const maxBookingValue = useMemo(() => Math.max(...weeklyBookings.map((item) => item.value)), [weeklyBookings]);

    const handleQuickAction = (action: string) => {
        // Placeholder – hook into actual flows once forms exist
        alert(`${action} flow coming soon!`);
    };

    const handleLogout = () => {
        db.logoutUser();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 text-gray-900">
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-emerald-100">
                <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center">
                            <span className="text-2xl font-black text-brand-green">KS</span>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500">Krushi Sathi</p>
                            <p className="text-lg font-semibold text-gray-800">Seller Hub</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button aria-label="Notifications" className="relative p-3 rounded-full bg-emerald-50 text-brand-green hover:bg-brand-green hover:text-white transition-all">
                            <BellIcon className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                        </button>
                        <button aria-label="Messages" className="p-3 rounded-full bg-emerald-50 text-brand-green hover:bg-brand-green hover:text-white transition-all">
                            <MessageIcon className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="text-right text-sm">
                                <p className="text-gray-500">{t('welcome')}</p>
                                <p className="font-semibold text-gray-800">{sellerName}</p>
                            </div>
                            <img src={`https://i.pravatar.cc/56?u=${sellerName}`} alt="Seller avatar" className="w-12 h-12 rounded-2xl object-cover border-2 border-brand-green/40" />
                        </div>
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
                            className="rounded-full border border-brand-green text-brand-green font-semibold px-5 py-2 hover:bg-brand-green hover:text-white transition-all smooth-transition transform hover:scale-105"
                        >
                            {t('logout')}
                        </button>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 space-y-12">
                <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <Reveal className="space-y-3">
                        <p className="text-sm uppercase tracking-[0.2em] text-brand-green">Dashboard</p>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome back, {sellerName}</h1>
                        <p className="text-gray-600 max-w-2xl">
                            Track bookings, earnings, inventory and farmer conversations – everything you need to run your agriculture business like a pro.
                        </p>
                    </Reveal>
                    <Reveal delay={150}>
                        <button
                            onClick={() => handleQuickAction('Add New Listing')}
                            className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 text-white font-semibold shadow-lg shadow-brand-green/30 hover:-translate-y-0.5 hover:bg-brand-green-dark transition-all"
                        >
                            <PlusIcon className="w-5 h-5" /> Create Listing
                        </button>
                    </Reveal>
                </header>

                <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map((card, idx) => (
                        <Reveal key={card.label} delay={idx * 80}>
                            <div className={`rounded-2xl bg-gradient-to-br ${card.accent} p-5 shadow-sm hover:shadow-md transition-shadow`}>
                                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                                <p className="mt-3 text-3xl font-bold text-gray-900">{card.value}</p>
                                <p className="mt-2 inline-flex items-center text-xs font-semibold text-brand-green bg-white/70 rounded-full px-3 py-1">
                                    <ChartTrendIcon className="w-4 h-4 mr-1 text-brand-green" /> {card.chip}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </section>

                <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Reveal className="bg-white rounded-3xl shadow-lg shadow-emerald-100/60 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                                <p className="text-sm text-gray-500">Set up listings and respond faster</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {quickActions.map((action) => (
                                <button
                                    key={action.title}
                                    onClick={() => handleQuickAction(action.title)}
                                    className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 p-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-brand-green"
                                >
                                    <span className="absolute inset-0 bg-brand-green/5 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    <div className="relative flex items-center gap-3 text-brand-green">
                                        <div className="w-11 h-11 rounded-2xl bg-brand-green/10 flex items-center justify-center transition-transform group-hover:scale-105">
                                            {action.icon}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{action.title}</p>
                                            <p className="text-xs text-gray-500">{action.description}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Reveal>

                    <Reveal className="bg-white rounded-3xl shadow-lg shadow-emerald-100/60 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Sales Analytics</h2>
                                <p className="text-sm text-gray-500">Bookings this week</p>
                            </div>
                            <span className="text-xs font-semibold text-brand-green bg-brand-green/10 px-3 py-1 rounded-full">Live</span>
                        </div>
                        <div className="mt-8 flex items-end gap-3">
                            {weeklyBookings.map((day) => (
                                <div key={day.label} className="flex flex-col items-center w-full">
                                    <div
                                        className="w-full rounded-full bg-gradient-to-t from-brand-green to-emerald-300 transition-all"
                                        style={{ height: `${(day.value / maxBookingValue) * 120 || 0}px` }}
                                    ></div>
                                    <p className="mt-2 text-xs font-semibold text-gray-600">{day.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                            <div className="rounded-2xl bg-emerald-50 p-3">
                                <p className="text-gray-500">Daily bookings</p>
                                <p className="text-xl font-bold text-gray-900">12 avg</p>
                            </div>
                            <div className="rounded-2xl bg-emerald-50 p-3">
                                <p className="text-gray-500">Top equipment</p>
                                <p className="text-xl font-bold text-gray-900">5310 Tractor</p>
                            </div>
                        </div>
                    </Reveal>
                </section>

                <section className="bg-white rounded-3xl shadow-lg shadow-emerald-100/60 p-6">
                    <Reveal className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Active Listings</h2>
                            <p className="text-sm text-gray-500">Swipe to view all equipment & inputs</p>
                        </div>
                        <button className="text-sm font-semibold text-brand-green hover:underline">View all</button>
                    </Reveal>
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-4 min-w-full">
                            {listings.map((item, idx) => (
                                <Reveal key={item.id} delay={idx * 100} className="w-72 flex-shrink-0 rounded-3xl border border-emerald-50 shadow-md">
                                    <div className="relative">
                                        <img src={item.image} alt={item.name} className="h-40 w-full object-cover rounded-t-3xl" />
                                        <span className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'Available' ? 'bg-emerald-100 text-brand-green' : item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-600'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <p className="text-xs uppercase tracking-wide text-gray-500">{item.category}</p>
                                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-600">{item.availability}</p>
                                        <p className="text-2xl font-bold text-brand-green">
                                            {item.price} <span className="text-sm font-medium text-gray-500">{item.unit}</span>
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>⭐ {item.rating}</span>
                                            <span>{item.bookings} bookings</span>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button className="flex-1 rounded-full border border-brand-green text-brand-green text-sm font-semibold px-3 py-2 hover:bg-brand-green hover:text-white transition-colors">Edit</button>
                                            <button className="rounded-full border border-gray-200 text-gray-600 px-3 py-2 text-sm font-semibold hover:bg-gray-50">Pause</button>
                                            <button className="rounded-full border border-gray-200 text-gray-600 px-3 py-2 text-sm font-semibold hover:bg-gray-50">⋯</button>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <Reveal className="bg-white rounded-3xl shadow-lg shadow-emerald-100/60 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Booking Requests</h2>
                                <p className="text-sm text-gray-500">Approve equipment & input orders</p>
                            </div>
                            <button className="text-sm font-semibold text-brand-green hover:underline">See history</button>
                        </div>
                        <div className="space-y-4">
                            {bookingRequests.map((request) => (
                                <div key={request.id} className="rounded-2xl border border-emerald-50 p-4 bg-emerald-50/40 hover:border-brand-green transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">{request.type}</p>
                                            <p className="text-base font-semibold text-gray-900">{request.item}</p>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900">{request.price}</p>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{request.slot}</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-900">Farmer: {request.farmer}</p>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50">Reject</button>
                                            <button className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-semibold hover:bg-brand-green-dark">Accept</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    <div className="space-y-4">
                        <Reveal className="bg-white rounded-3xl shadow-lg shadow-emerald-100/60 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Messages & Chat</h2>
                                    <p className="text-sm text-gray-500">Respond quickly to improve ratings</p>
                                </div>
                                <button className="text-sm font-semibold text-brand-green hover:underline">Open inbox</button>
                            </div>
                            <div className="space-y-3">
                                {messages.map((message) => (
                                    <button
                                        key={message.id}
                                        className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors ${message.unread ? 'border-brand-green/40 bg-brand-green/5' : 'border-gray-100 bg-white hover:border-brand-green/40'}`}
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-900">{message.farmer}</p>
                                            <p className="text-sm text-gray-600">{message.preview}</p>
                                        </div>
                                        <div className="text-right text-xs text-gray-500">
                                            <p>{message.time}</p>
                                            {message.unread && <span className="inline-flex w-6 justify-center rounded-full bg-brand-green text-white text-[10px] font-semibold px-1 py-0.5">NEW</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </Reveal>

                        <Reveal className="bg-gradient-to-br from-emerald-100 to-white rounded-3xl p-6 shadow-inner shadow-emerald-200/60">
                            <div className="flex items-center gap-3 mb-4">
                                <ChartTrendIcon className="w-6 h-6 text-brand-green" />
                                <h2 className="text-lg font-semibold text-gray-900">Promotional Tips</h2>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-700">
                                {promotionalTips.map((tip, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-brand-green font-semibold">{idx + 1}</span>
                                        <p>{tip}</p>
                                    </li>
                                ))}
                            </ul>
                        </Reveal>
                    </div>
                </section>
            </main>

            <footer className="border-t border-emerald-100 bg-white/80 backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-sm text-gray-600">
                    <p>&copy; {new Date().getFullYear()} Krushi Sathi Seller Hub</p>
                    <div className="flex flex-wrap gap-4">
                        <a href="#" className="hover:text-brand-green">Help Center</a>
                        <a href="#" className="hover:text-brand-green">Seller Support</a>
                        <a href="#" className="hover:text-brand-green">Terms</a>
                        <a href="#" className="hover:text-brand-green">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SellerHomePage;
