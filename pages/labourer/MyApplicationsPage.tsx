import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as db from '../../services/db';

const MyApplicationsPage: React.FC = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'All' | 'PENDING' | 'ACCEPTED' | 'REJECTED'>('All');

    useEffect(() => {
        const currentUser = db.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        fetchApplications(currentUser.id);
    }, [navigate]);

    const fetchApplications = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/api/labourer/applications/${userId}`);
            const data = await response.json();
            setApplications(data);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredApplications = filter === 'All'
        ? applications
        : applications.filter(app => app.status === filter);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-brown mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading applications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-blue-100">
                <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-4">
                    <button onClick={() => navigate('/labourer')} className="text-gray-600 hover:text-brand-brown">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">My Applications</h1>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex gap-2">
                        {(['All', 'PENDING', 'ACCEPTED', 'REJECTED'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-full font-semibold transition-all ${filter === status
                                        ? 'bg-brand-brown text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredApplications.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No applications yet</h3>
                        <p className="text-gray-600 mb-4">Start applying for jobs to see your applications here</p>
                        <button
                            onClick={() => navigate('/labourer/jobs')}
                            className="px-6 py-3 bg-brand-brown text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                        >
                            Browse Jobs
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredApplications.map(app => (
                            <div key={app.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-gray-900">{app.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${app.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                    app.status === 'ACCEPTED' ? 'bg-emerald-100 text-green-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p><span className="font-semibold">Skill:</span> {app.skill_required}</p>
                                            {app.location && <p><span className="font-semibold">Location:</span> {app.location}</p>}
                                            <p><span className="font-semibold">Wage:</span> ₹{app.wage}</p>
                                            <p className="text-xs text-gray-500">
                                                Applied on {new Date(app.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {app.message && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-xs font-semibold text-gray-700 mb-1">Your Message:</p>
                                                <p className="text-sm text-gray-600">{app.message}</p>
                                            </div>
                                        )}
                                    </div>

                                    {app.status === 'ACCEPTED' && (
                                        <div className="flex items-center gap-2 text-green-700">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="font-semibold">Accepted!</span>
                                        </div>
                                    )}

                                    {app.status === 'REJECTED' && (
                                        <div className="flex items-center gap-2 text-red-700">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="font-semibold">Not selected</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyApplicationsPage;
