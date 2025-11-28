
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Icons - SVGs are included directly to avoid extra dependencies
const TractorIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 4h18"/><path d="m11 18-3-2 3-4-3-3 3-3"/><path d="M3 10h11"/><path d="M3 15h11"/><path d="M9 18h12"/></svg>
);
const UserGroupIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const MapPinIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
const CreditCardIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
);
const PhoneIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);
const TagIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.432 0l6.568-6.568a2.426 2.426 0 0 0 0-3.432L12.586 2.586z"/><circle cx="8.5" cy="8.5" r=".5" fill="currentColor"/></svg>
);

const AnimatedSection: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        const currentElement = ref.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`${className || ''} transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            {children}
        </div>
    );
};

function useOnScreen(ref: React.RefObject<HTMLElement>, options: IntersectionObserverInit) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if(entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);

        const currentElement = ref.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [ref, options]);

    return isVisible;
}

const AnimatedCounter: React.FC<{ value: number, text: string, plus?: boolean }> = ({ value, text, plus }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref, { threshold: 0.5 });

    useEffect(() => {
        if (isVisible) {
            let start = 0;
            const end = value;
            if (start === end) return;

            const duration = 2000;
            const incrementTime = Math.max(1, duration / end);
            
            const timer = setInterval(() => {
                start += 1;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(start);
                }
            }, incrementTime);

            return () => clearInterval(timer);
        }
    }, [isVisible, value]);

    return (
        <div ref={ref} className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-brand-green">{count}{plus && '+'}</p>
            <p className="text-gray-600 mt-2">{text}</p>
        </div>
    );
};

const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-brand-green" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <h1 className="text-2xl font-bold text-brand-green">Krushi Sathi</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-600 hover:text-brand-green transition smooth-transition">Features</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-brand-green transition smooth-transition">About Us</a>
            </nav>
            <Link to="/login" className="border border-blue-400 text-gray-700 font-bold py-2 px-6 rounded-full hover:bg-blue-50 transition-all smooth-transition transform hover:scale-105">
                Login
            </Link>
        </div>
    </header>
);

const HeroSection = () => (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/95 via-green-900/90 to-green-950/95"></div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
            {/* Decorative Teal Circles */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-teal-400 rounded-full opacity-30 animate-sparkle"></div>
            <div className="absolute top-20 right-20 w-16 h-16 bg-teal-400 rounded-full opacity-30 animate-sparkle" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 left-20 w-12 h-12 bg-teal-400 rounded-full opacity-30 animate-sparkle" style={{ animationDelay: '2s' }}></div>
            
            {/* Green Brushstroke Background with Text */}
            <AnimatedSection className="relative inline-block">
                <div className="relative">
                    {/* Brushstroke effect - vibrant lime green */}
                    <div className="absolute inset-0 bg-gradient-to-r from-lime-400 via-lime-500 to-lime-400 rounded-full blur-3xl opacity-70 transform -rotate-6 scale-150 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-lime-400 via-lime-500 to-lime-600 rounded-full px-16 py-8 md:px-24 md:py-12 transform rotate-2 shadow-2xl" style={{ boxShadow: '0 20px 60px rgba(118, 215, 0, 0.5)' }}>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white" style={{ fontFamily: 'cursive, serif', textShadow: '3px 3px 6px rgba(0,0,0,0.5)', letterSpacing: '2px' }}>
                            krushi-sathi
                        </h1>
                    </div>
                </div>
                
                {/* Icons below text */}
                <div className="flex justify-center gap-6 mt-6">
                    <div className="w-12 h-12 bg-lime-500 rounded-full flex items-center justify-center animate-float shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <div className="w-12 h-12 bg-lime-500 rounded-full flex items-center justify-center animate-float shadow-lg" style={{ animationDelay: '0.5s' }}>
                        <TractorIcon className="w-6 h-6 text-white" />
                    </div>
                </div>
                
                {/* Tagline */}
                <div className="mt-8 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-lime-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <p className="text-xl md:text-2xl text-white italic font-light" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        Empowering Farmers Through Smart Agri-Tech
                    </p>
                </div>
                
                {/* Get Started Button */}
                <div className="mt-12 flex justify-center items-center gap-4">
                    <Link 
                        to="/login" 
                        className="relative px-10 py-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white font-bold rounded-full text-lg shadow-xl hover:shadow-2xl transition-all smooth-transition transform hover:scale-110 overflow-hidden group"
                    >
                        <span className="relative z-10">Get Started</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                    <div className="w-4 h-4 border-2 border-blue-400 rounded-full animate-pulse"></div>
                </div>
            </AnimatedSection>
            
            {/* Decorative Leaves */}
            <div className="absolute top-20 left-10 opacity-50 animate-float">
                <svg className="w-24 h-24 text-lime-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
            </div>
            <div className="absolute bottom-20 right-10 opacity-50 animate-float" style={{ animationDelay: '1s' }}>
                <svg className="w-32 h-32 text-lime-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
            </div>
        </div>
        
        {/* Bottom light blue strip with dots */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-100 to-transparent" style={{ backgroundImage: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
    </section>
);

const ChartIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 3v18h18"/><path d="M7 12l4-4 4 4 6-6"/>
    </svg>
);

const SproutIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
);

const GearIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
    </svg>
);

const WeatherIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
    </svg>
);

const LanguageIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6H7"/><path d="M16 20l-2-2"/><path d="M17 17l2-2 2 2"/><path d="M19 15v4"/>
    </svg>
);

const features = [
    { 
        icon: <TractorIcon />, 
        title: "Equipment Rental", 
        description: "Access to modern farming equipment and tools through our convenient rental service network.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2a89dPkh1GFLsVYkO0PHBDEsZf4fBhjAUeg&s",
        color: "from-blue-50 to-cyan-50",
        iconColor: "bg-blue-500",
        textColor: "text-blue-600"
    },
    { 
        icon: <ChartIcon />, 
        title: "Live Market Pricing", 
        description: "Real-time market prices and trends to help you make informed selling decisions and maximize profits.",
        image: "https://friscofreshmarket.com/wp-content/uploads/2022/09/fall-farmers-market-scaled.jpeg",
        color: "from-emerald-50 to-teal-50",
        iconColor: "bg-emerald-500",
        textColor: "text-emerald-600"
    },
    { 
        icon: <SproutIcon />, 
        title: "Smart Diversification", 
        description: "Dual crop strategy that helps farmers grow two or more crops together for higher yield and year round income.",
        image: "https://plutuseducation.com/blog/wp-content/uploads/2024/10/DALL%C2%B7E-2024-10-21-21.06.56-A-detailed-thumbnail-image-illustrating-the-concept-of-Agricultural-Diversification.-The-image-features-a-lush-vibrant-farm-scene-divided-into-segm.webp",
        color: "from-green-50 to-lime-50",
        iconColor: "bg-green-500",
        textColor: "text-green-600"
    },
    { 
        icon: <GearIcon />, 
        title: "Labour Services", 
        description: "Connects farmers with skilled local labourers quickly and fairly ensuring on-time farming operations and improved productivity.",
        image: "https://img.freepik.com/premium-photo/workers-work-field-harvesting-manual-labor-farming-agriculture-agro-industry_926199-2094884.jpg",
        color: "from-orange-50 to-amber-50",
        iconColor: "bg-orange-500",
        textColor: "text-orange-600"
    },
    { 
        icon: <WeatherIcon />, 
        title: "Weather Intelligence", 
        description: "Real-time weather updates, alerts, and seasonal forecasts tailored to your location for better crop planning.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1Hy_Pyttr7eD4h5-z1mheA2tsAIHkg3dfcw&s",
        color: "from-cyan-50 to-sky-50",
        iconColor: "bg-cyan-500",
        textColor: "text-cyan-600"
    },
    { 
        icon: <LanguageIcon />, 
        title: "Multi-Language Support", 
        description: "Available in multiple regional languages to ensure accessibility for farmers across different regions.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2w7Mh_jbbmNKyqrWsqPLmcOlghuMiZCNCiQ&s",
        color: "from-purple-50 to-pink-50",
        iconColor: "bg-purple-500",
        textColor: "text-purple-600"
    },
];

const FeaturesSection = () => (
    <section id="features" className="py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="container mx-auto px-6 relative z-10">
            <AnimatedSection className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-teal-600 mb-3 relative inline-block">
                    Our Features
                    <span className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-teal-600 to-transparent rounded-full"></span>
                </h2>
                <p className="text-gray-600 mt-4 text-lg">Comprehensive tools designed for the modern farmer</p>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {features.map((feature, index) => (
                    <AnimatedSection key={index} style={{ transitionDelay: `${index * 100}ms` }}>
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 h-full relative">
                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20"></div>
                            
                            <div className="relative h-56 overflow-hidden">
                                <img 
                                    src={feature.image} 
                                    alt={feature.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className={`absolute top-4 left-4 ${feature.iconColor} w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 z-10`}>
                                    {React.cloneElement(feature.icon, { className: 'w-7 h-7' })}
                                </div>
                            </div>
                            <div className={`p-6 bg-gradient-to-br ${feature.color} relative`}>
                                <h3 className={`text-xl font-bold ${feature.textColor} mb-3 group-hover:scale-105 transition-transform duration-300 inline-block`}>
                                    {feature.title}
                                </h3>
                                <p className="text-gray-700 leading-relaxed text-sm">{feature.description}</p>
                                
                                {/* Decorative corner element */}
                                <div className={`absolute bottom-0 right-0 w-20 h-20 ${feature.iconColor} opacity-5 rounded-tl-full`}></div>
                            </div>
                        </div>
                    </AnimatedSection>
                ))}
            </div>
        </div>
    </section>
);

const steps = [
    { title: "Search", description: "Find the equipment or labour you need with our simple search." },
    { title: "Compare", description: "Compare prices, ratings, and availability to find the best fit." },
    { title: "Book", description: "Book your choice instantly with just a few clicks." },
    { title: "Track", description: "Live-track your equipment or labour's progress on the map." },
    { title: "Pay", description: "Pay securely through the app once the job is done." },
];

const HowItWorksSection = () => (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="container mx-auto px-6 relative z-10">
            <AnimatedSection className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">How It Works</h2>
                <p className="text-gray-600 mt-4 text-lg">A simple, streamlined process from start to finish</p>
            </AnimatedSection>
            <div className="relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brand-green/30 to-transparent"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4">
                    {steps.map((step, index) => (
                        <AnimatedSection key={index} className="w-full md:w-1/5 text-center" style={{ transitionDelay: `${index * 100}ms` }}>
                            <div className="relative group">
                                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-brand-green to-emerald-500 text-white rounded-full flex items-center justify-center text-2xl font-bold z-10 relative shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                    {index + 1}
                                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-0 group-hover:opacity-100"></div>
                                </div>
                                <div className="mt-6 p-4 bg-white rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                                    <h3 className="text-xl font-bold mb-2 text-gray-800">{step.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

const ShowcaseSection = () => (
    <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
                <AnimatedSection>
                    <div className="relative group">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                            <div className="bg-white rounded-2xl p-2 overflow-hidden">
                                <img 
                                    src="https://img.freepik.com/premium-photo/indian-farmer-working-field-farmer-is-wearing-traditional-turban-is-using-hand-hoe-plant-seeds_14117-267064.jpg?w=740" 
                                    alt="Farm Landscape" 
                                    className="rounded-xl w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                                />
                            </div>
                        </div>
                        <div className="absolute -inset-4 bg-gradient-to-r from-brand-green/20 to-emerald-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                    </div>
                </AnimatedSection>
            </div>
            <div className="lg:w-1/2 text-center lg:text-left">
                <AnimatedSection>
                    <span className="text-brand-green font-bold text-sm uppercase tracking-wider">DESIGNED FOR YOU</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-800">Built for Indian Farmers</h2>
                    <p className="text-gray-600 mt-6 text-lg leading-relaxed">
                        Our app is designed with a simple, intuitive interface that works seamlessly even with low internet connectivity. It's available in multiple regional languages to cater to farmers across India.
                    </p>
                </AnimatedSection>
            </div>
        </div>
    </section>
);


const StatsSection = () => (
    <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <AnimatedCounter value={5000} text="Farmers Served" plus />
                <AnimatedCounter value={350} text="Verified Labourers" plus />
                <AnimatedCounter value={120} text="Equipment Types" plus />
                <div className="text-center">
                    <p className="text-4xl md:text-5xl font-bold text-brand-green">4.8/5</p>
                    <p className="text-gray-600 mt-2">Average Rating</p>
                </div>
            </div>
        </div>
    </section>
);


const testimonials = [
    { name: "Rajesh Kumar", location: "Punjab", quote: "Krushi Sathi has changed the way I farm. Renting a harvester was so easy and affordable!", avatar: "https://picsum.photos/seed/farmer1/100/100" },
    { name: "Sita Devi", location: "Maharashtra", quote: "Finding reliable farm labor used to be a challenge. Now I can hire skilled workers in minutes.", avatar: "https://picsum.photos/seed/farmer2/100/100" },
    { name: "Muthu Krishnan", location: "Tamil Nadu", quote: "The live tracking is fantastic! I always know when my rented tractor will arrive.", avatar: "https://picsum.photos/seed/farmer3/100/100" },
];

const TestimonialsSection = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="testimonials" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <AnimatedSection className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">What Our Farmers Say</h2>
                </AnimatedSection>
                <div className="relative max-w-3xl mx-auto h-64">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center p-8 transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'}`}>
                           <img src={testimonial.avatar} alt={testimonial.name} className="w-20 h-20 rounded-full mb-4 object-cover" />
                            <p className="text-lg text-gray-700 italic">"{testimonial.quote}"</p>
                            <h4 className="font-bold text-brand-green mt-4">{testimonial.name}</h4>
                            <p className="text-sm text-gray-500">{testimonial.location}</p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-4 space-x-2">
                    {testimonials.map((_, index) => (
                         <button key={index} onClick={() => setCurrent(index)} className={`w-3 h-3 rounded-full ${index === current ? 'bg-brand-green' : 'bg-gray-300'} transition-colors`}></button>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CtaSection = () => (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
            <AnimatedSection>
                <div className="bg-gradient-to-r from-brand-green via-emerald-500 to-teal-500 text-white rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-green/90 to-emerald-600/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Farming Made Simpler. Start Now.</h2>
                        <p className="mt-4 text-lg opacity-95">Join thousands of farmers revolutionizing their work with Krushi Sathi.</p>
                        <div className="mt-10 flex justify-center items-center">
                            <Link 
                                to="/login" 
                                className="bg-white text-brand-green font-bold py-4 px-10 rounded-full text-lg hover:bg-gray-100 transition-all transform hover:scale-110 shadow-xl hover:shadow-2xl relative overflow-hidden group/btn"
                            >
                                <span className="relative z-10">Get Started</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-green/10 to-emerald-400/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            </Link>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
                </div>
            </AnimatedSection>
        </div>
    </section>
);

const Footer = () => (
    <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6 text-center">
            <h3 className="text-xl font-bold">Krushi Sathi</h3>
            <div className="flex justify-center space-x-6 mt-4">
                <a href="#" className="hover:text-brand-green transition">About Us</a>
                <a href="#" className="hover:text-brand-green transition">Contact</a>
                <a href="#" className="hover:text-brand-green transition">Privacy Policy</a>
            </div>
            <div className="flex justify-center space-x-4 mt-6">
                {/* Social Icons */}
            </div>
            <p className="mt-8 text-sm text-gray-400">&copy; {new Date().getFullYear()} Krushi Sathi. All rights reserved.</p>
        </div>
    </footer>
);

const LandingPage: React.FC = () => {
    return (
        <div className="bg-white">
            <Header />
            <main>
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <ShowcaseSection />
                <StatsSection />
                <TestimonialsSection />
                <CtaSection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;