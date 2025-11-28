import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as db from '../../services/db';

const JobListingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const skills = ['All', 'Harvesting', 'Sowing', 'Irrigation', 'Weeding', 'Plowing', 'Fertilizer Application'];

    useEffect(() => {
        const currentUser = db.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        fetchJobs();
    }, [navigate]);

    const fetchJobs = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/labourer/jobs');
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesFilter = filter === 'All' || job.skill_required === filter;
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-brown mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading jobs...</p>
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
                    <h1 className="text-2xl font-bold text-gray-800">Browse Jobs</h1>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-4 py-8">
                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                            <button
                                key={skill}
                                onClick={() => setFilter(skill)}
                                className={`px-4 py-2 rounded-full font-semibold transition-all ${filter === skill
                                        ? 'bg-brand-brown text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Search by title or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-brown"
                    />
                </div>

                {/* Job Listings */}
                {filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No jobs found</h3>
                        <p className="text-gray-600">Try adjusting your filters or check back later for new opportunities</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.map(job => (
                            <Link
                                key={job.id}
                                to={`/labourer/jobs/${job.id}`}
                                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-brown/10 text-brand-brown">
                                        {job.skill_required}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(job.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-brown transition-colors">
                                    {job.title}
                                </h3>

                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {job.description || 'No description provided'}
                                </p>

                                <div className="space-y-2 text-sm text-gray-600 mb-4">
                                    {job.location && (
                                        <p className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {job.location}
                                        </p>
                                    )}
                                    {job.duration && (
                                        <p className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {job.duration}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <p className="text-2xl font-bold text-brand-brown">
                                        ₹{job.wage}
                                    </p>
                                    <span className="text-brand-brown font-semibold group-hover:underline">
                                        View Details →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default JobListingsPage;
