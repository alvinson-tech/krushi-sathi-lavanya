import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as db from '../../services/db';

const JobDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState('');
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        const currentUser = db.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        fetchJobDetails();
        checkIfApplied(currentUser.id);
    }, [id, navigate]);

    const fetchJobDetails = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/labourer/jobs');
            const data = await response.json();
            const jobData = data.find((j: any) => j.id === parseInt(id!));
            setJob(jobData);
        } catch (error) {
            console.error('Failed to fetch job details:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkIfApplied = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/api/labourer/applications/${userId}`);
            const applications = await response.json();
            const applied = applications.some((app: any) => app.job_id === parseInt(id!));
            setHasApplied(applied);
        } catch (error) {
            console.error('Failed to check applications:', error);
        }
    };

    const handleApply = async () => {
        const currentUser = db.getCurrentUser();
        if (!currentUser) return;

        setApplying(true);
        try {
            const response = await fetch(`http://localhost:3001/api/labourer/apply/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    labourer_id: currentUser.id,
                    message
                }),
            });

            if (response.ok) {
                alert('Application submitted successfully!');
                setHasApplied(true);
            } else {
                alert('Failed to submit application');
            }
        } catch (error) {
            console.error('Error applying for job:', error);
            alert('Failed to submit application');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-brown mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading job details...</p>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Job not found</h2>
                    <button onClick={() => navigate('/labourer/jobs')} className="text-brand-brown hover:underline">
                        Back to jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-blue-100">
                <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-4">
                    <button onClick={() => navigate('/labourer/jobs')} className="text-gray-600 hover:text-brand-brown">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Job Details</h1>
                </div>
            </div>

            <main className="mx-auto max-w-4xl px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-brown/10 text-brand-brown">
                                {job.skill_required}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500">
                            Posted {new Date(job.created_at).toLocaleDateString()}
                        </span>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <svg className="w-6 h-6 text-brand-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="text-sm text-gray-600">Wage</p>
                                <p className="text-xl font-bold text-brand-brown">₹{job.wage}</p>
                            </div>
                        </div>

                        {job.duration && (
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <svg className="w-6 h-6 text-brand-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="text-sm text-gray-600">Duration</p>
                                    <p className="text-lg font-semibold text-gray-900">{job.duration}</p>
                                </div>
                            </div>
                        )}

                        {job.location && (
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <svg className="w-6 h-6 text-brand-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <p className="text-sm text-gray-600">Location</p>
                                    <p className="text-lg font-semibold text-gray-900">{job.location}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <svg className="w-6 h-6 text-brand-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <p className="text-lg font-semibold text-green-600">{job.status}</p>
                            </div>
                        </div>
                    </div>

                    {job.description && (
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Job Description</h3>
                            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                        </div>
                    )}
                </div>

                {/* Application Form */}
                {!hasApplied ? (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Apply for this Job</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Cover Message (Optional)
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-brown"
                                    placeholder="Tell the farmer why you're a good fit for this job..."
                                />
                            </div>
                            <button
                                onClick={handleApply}
                                disabled={applying}
                                className="w-full px-6 py-3 bg-brand-brown text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:bg-gray-400"
                            >
                                {applying ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                        <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-bold text-green-900 mb-2">Already Applied</h3>
                        <p className="text-green-800 mb-4">You have already applied for this job</p>
                        <button
                            onClick={() => navigate('/labourer/applications')}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
                        >
                            View My Applications
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default JobDetailsPage;
