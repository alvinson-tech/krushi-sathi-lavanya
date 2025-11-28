import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as db from '../../services/db';
import { User } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

const SunIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
    </svg>
);

const CloudIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
    </svg>
);

const RainIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m16 14 2 2"/><path d="m16 20 2 2"/><path d="m13 16 2 2"/><path d="m13 22 2 2"/>
    </svg>
);

const WindIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
    </svg>
);

const ChevronLeftIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m15 18-6-6 6-6"/>
    </svg>
);

interface WeatherData {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    rainChance: number;
    sunrise: string;
    sunset: string;
    forecast: Array<{ day: string; high: number; low: number; condition: string }>;
}

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

const SearchIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
);

const buildMockWeather = (city: string) => {
    const now = Date.now();
    return {
        name: city,
        sys: {
            country: 'IN',
            sunrise: Math.floor((now - 2 * 60 * 60 * 1000) / 1000),
            sunset: Math.floor((now + 4 * 60 * 60 * 1000) / 1000),
        },
        main: {
            temp: 29 + Math.random() * 4 - 2,
            humidity: 60 + Math.round(Math.random() * 20),
        },
        wind: {
            speed: 3 + Math.random() * 2,
        },
        weather: [
            { main: 'Partly Cloudy' }
        ],
        rain: { '1h': Math.round(Math.random() * 5) },
    };
};

const buildMockForecast = (currentTemp: number) =>
    Array.from({ length: 5 }, (_, i) => ({
        dt: Math.floor((Date.now() + i * 24 * 60 * 60 * 1000) / 1000),
        main: {
            temp_max: currentTemp + (Math.random() * 4 - 1),
            temp_min: currentTemp - (Math.random() * 4 + 2),
        },
        weather: [
            { main: i % 2 === 0 ? 'Sunny' : 'Cloudy' }
        ],
    }));

const WeatherForecastPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [weather, setWeather] = useState<any>(null);
    const [forecast, setForecast] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchCity, setSearchCity] = useState('chansandra,Banglore,Karnataka');
    const [inputCity, setInputCity] = useState('chansandra,Banglore,Karnataka');
    const [showSearch, setShowSearch] = useState(false);
    const navigate = useNavigate();
    const { t } = useLanguage();

    useEffect(() => {
        const currentUser = db.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser);
            fetchWeatherData(searchCity);
        }
    }, [navigate, searchCity]);

    const fetchWeatherData = async (city: string) => {
        setLoading(true);
        setError(null);
        const apiKey = 'e60aca8362515862a065903047bbb0c3';

        try {
            const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}`);
            if (!currentResponse.ok) {
                throw new Error(`Unable to fetch weather for ${city}`);
            }
            const currentData = await currentResponse.json();
            
            if (currentData.cod === 200 || currentData.cod === '200') {
                setWeather(currentData);
                
                try {
                    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}`);
                    if (!forecastResponse.ok) {
                        throw new Error('Forecast API error');
                    }
                    const forecastData = await forecastResponse.json();
                    
                    if (forecastData.cod === '200' || forecastData.cod === 200) {
                        const dailyForecast = forecastData.list.filter((item: any, index: number) => index % 8 === 0).slice(0, 5);
                        setForecast(dailyForecast);
                    } else {
                        setForecast(buildMockForecast(currentData.main.temp));
                    }
                } catch (forecastErr) {
                    console.warn('Forecast fetch error:', forecastErr);
                    setForecast(buildMockForecast(currentData.main.temp));
                }
            } else {
                throw new Error(currentData?.message || 'Weather API error');
            }
        } catch (err: any) {
            console.error('Error fetching weather:', err);
            const mockWeather = buildMockWeather(city);
            setWeather(mockWeather);
            setForecast(buildMockForecast(mockWeather.main.temp));
            setError('Showing mock weather data due to connection issues.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputCity.trim()) {
            setSearchCity(inputCity.trim());
            setShowSearch(false);
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
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div className="text-center md:text-left">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">{t('weatherForecast')}</h2>
                            <p className="text-lg text-gray-600">Real-time weather updates for better crop planning</p>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className="px-4 py-2 bg-brand-green text-white font-semibold rounded-full hover:bg-brand-green-dark transition-all smooth-transition transform hover:scale-105 flex items-center gap-2"
                            >
                                <SearchIcon className="w-5 h-5" />
                                Search City
                            </button>
                            {showSearch && (
                                <form onSubmit={handleSearch} className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 min-w-[250px]">
                                    <input
                                        type="text"
                                        value={inputCity}
                                        onChange={(e) => setInputCity(e.target.value)}
                                        placeholder="Enter city name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent mb-2"
                                        autoFocus
                                    />
                                    <button type="submit" className="w-full px-4 py-2 bg-brand-green text-white font-semibold rounded-lg hover:bg-brand-green-dark transition-all">
                                        Search
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
                            <p className="mt-4 text-gray-500">Loading weather data...</p>
                        </div>
                    ) : weather && (
                        <>
                            {error && (
                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-700 text-center">
                                    {error}
                                </div>
                            )}
                            <div className="bg-gradient-to-br from-cyan-400 to-blue-600 text-white rounded-3xl p-8 shadow-2xl">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-xl mb-2">{weather.name}, {weather.sys.country}</p>
                                        <p className="text-6xl font-bold mb-2">{Math.round(weather.main.temp)}°C</p>
                                        <p className="text-xl">{weather.weather[0].main}</p>
                                    </div>
                                    <div className="text-right">
                                        {weather.weather[0].main.includes('Clear') || weather.weather[0].main.includes('Sun') ? (
                                            <SunIcon className="w-20 h-20 text-yellow-300 animate-spin" style={{ animationDuration: '20s' }} />
                                        ) : weather.weather[0].main.includes('Cloud') ? (
                                            <CloudIcon className="w-20 h-20 text-white" />
                                        ) : (
                                            <RainIcon className="w-20 h-20 text-white" />
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">{weather.rain ? `${weather.rain['1h'] || 0}mm` : '0mm'}</p>
                                        <p className="text-sm opacity-90">Rain</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">{Math.round(weather.wind.speed * 3.6)} km/h</p>
                                        <p className="text-sm opacity-90">Wind</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">{weather.main.humidity}%</p>
                                        <p className="text-sm opacity-90">Humidity</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold">{new Date(weather.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p className="text-sm opacity-90">Sunrise</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {forecast.map((day, idx) => {
                                    const date = new Date(day.dt * 1000);
                                    const dayNames = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5'];
                                    return (
                                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all smooth-transition transform hover:-translate-y-1">
                                            <p className="font-bold text-gray-800 mb-2">{dayNames[idx] || date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                            <div className="flex items-center justify-center mb-4">
                                                {day.weather[0].main.includes('Clear') || day.weather[0].main.includes('Sun') ? (
                                                    <SunIcon className="w-12 h-12 text-yellow-400" />
                                                ) : day.weather[0].main.includes('Cloud') ? (
                                                    <CloudIcon className="w-12 h-12 text-gray-400" />
                                                ) : (
                                                    <RainIcon className="w-12 h-12 text-blue-400" />
                                                )}
                                            </div>
                                            <p className="text-2xl font-bold text-gray-800">{Math.round(day.main.temp_max)}°</p>
                                            <p className="text-gray-600">{Math.round(day.main.temp_min)}°</p>
                                            <p className="text-sm text-gray-500 mt-2">{day.weather[0].main}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default WeatherForecastPage;

