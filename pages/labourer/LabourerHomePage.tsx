
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as db from '../../services/db';
import { useLanguage } from '../../contexts/LanguageContext';

const LabourerHomePage: React.FC = () => {
    const navigate = useNavigate();
    const { language, setLanguage, t } = useLanguage();
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [labourerName, setLabourerName] = useState('Labourer');
    const [profile, setProfile] = useState<any>(null);
    const [recentJobs, setRecentJobs] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
        setLabourerName(currentUser.name);
        fetchData(currentUser.id);
    }, [navigate]);

    const fetchData = async (userId: string) => {
        try {
            // Fetch profile
            const profileRes = await fetch(`http://localhost:3001/api/labourer/profile/${userId}`);
            if (profileRes.ok) {
                const profileData = await profileRes.json();
                setProfile(profileData);
            }

            // Fetch recent jobs
            const jobsRes = await fetch('http://localhost:3001/api/labourer/jobs');
            const jobsData = await jobsRes.json();
            setRecentJobs(jobsData.slice(0, 3));

            // Fetch applications
            const appsRes = await fetch(`http://localhost:3001/api/labourer/applications/${userId}`);
            const appsData = await appsRes.json();
            setApplications(appsData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        db.logoutUser();
        navigate('/login');
    };

    const profileCompletion = profile ? 100 : 0;
    const pendingApps = applications.filter(a => a.status === 'PENDING').length;
    const acceptedApps = applications.filter(a => a.status === 'ACCEPTED').length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-brown mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 text-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-brand-brown">Krushi Sathi</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setShowLangMenu(!showLangMenu)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-all"
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
                                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-2 ${language === lang.code ? 'bg-brand-brown/10 text-brand-brown font-semibold' : ''}`}
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
                            className="inline-flex items-center rounded-full border border-brand-brown text-brand-brown font-semibold px-4 py-1.5 hover:bg-brand-brown hover:text-white transition-all"
                        >
                            {t('logout')}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Welcome Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('welcome')}, {labourerName}!</h2>
                    <p className="text-gray-600">Find jobs, manage your profile, and track your applications</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-sm text-gray-500 mb-1">Profile Completion</p>
                        <p className="text-3xl font-bold text-brand-brown">{profileCompletion}%</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-sm text-gray-500 mb-1">Available Jobs</p>
                        <p className="text-3xl font-bold text-brand-brown">{recentJobs.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-sm text-gray-500 mb-1">Pending Applications</p>
                        <p className="text-3xl font-bold text-amber-600">{pendingApps}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-sm text-gray-500 mb-1">Accepted Jobs</p>
                        <p className="text-3xl font-bold text-green-600">{acceptedApps}</p>
                    </div>
                </div>

                {/* Profile Alert */}
                {!profile && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div className="flex-1">
                                <h3 className="font-bold text-amber-900 mb-1">Complete Your Profile</h3>
                                <p className="text-amber-800 text-sm mb-3">Set up your profile to start applying for jobs and get hired by farmers</p>
                                <Link
                                    to="/labourer/profile"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-brown text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                                >
                                    Setup Profile Now
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            to="/labourer/jobs"
                            className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-brand-brown hover:bg-blue-50 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-brand-brown/10 flex items-center justify-center group-hover:bg-brand-brown group-hover:text-white transition-all">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Browse Jobs</p>
                                <p className="text-sm text-gray-600">Find work opportunities</p>
                            </div>
                        </Link>

                        <Link
                            to="/labourer/profile"
                            className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-brand-brown hover:bg-blue-50 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-brand-brown/10 flex items-center justify-center group-hover:bg-brand-brown group-hover:text-white transition-all">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Update Profile</p>
                                <p className="text-sm text-gray-600">Edit your information</p>
                            </div>
                        </Link>

                        <Link
                            to="/labourer/applications"
                            className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-brand-brown hover:bg-blue-50 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-brand-brown/10 flex items-center justify-center group-hover:bg-brand-brown group-hover:text-white transition-all">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">My Applications</p>
                                <p className="text-sm text-gray-600">Track your applications</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Jobs */}
                {recentJobs.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Recent Job Openings</h3>
                            <Link to="/labourer/jobs" className="text-brand-brown font-semibold hover:underline">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {recentJobs.map(job => (
                                <Link
                                    key={job.id}
                                    to={`/labourer/jobs/${job.id}`}
                                    className="block p-4 rounded-xl border border-gray-200 hover:border-brand-brown hover:bg-blue-50 transition-all"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{job.title}</h4>
                                            <p className="text-sm text-gray-600">{job.skill_required} • {job.location}</p>
                                        </div>
                                        <p className="text-lg font-bold text-brand-brown">₹{job.wage}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default LabourerHomePage;
