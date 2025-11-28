import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as db from '../../services/db';

const ProfileSetupPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        skills: [] as string[],
        experience_years: '',
        hourly_rate: '',
        location: '',
        phone: '',
        languages: [] as string[],
        bio: ''
    });

    const availableSkills = [
        'Harvesting', 'Sowing', 'Irrigation', 'Weeding', 'Plowing',
        'Fertilizer Application', 'Crop Harvesting', 'Seed Sowing',
        'Pesticide Spraying', 'Land Preparation'
    ];

    const availableLanguages = [
        'English', 'Hindi', 'Marathi', 'Tamil', 'Telugu',
        'Kannada', 'Gujarati', 'Bengali'
    ];

    useEffect(() => {
        const currentUser = db.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        fetchProfile(currentUser.id);
    }, [navigate]);

    const fetchProfile = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/api/labourer/profile/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setFormData({
                    skills: data.skills || [],
                    experience_years: data.experience_years?.toString() || '',
                    hourly_rate: data.hourly_rate?.toString() || '',
                    location: data.location || '',
                    phone: data.phone || '',
                    languages: data.languages || [],
                    bio: data.bio || ''
                });
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const currentUser = db.getCurrentUser();
        if (!currentUser) return;

        try {
            const response = await fetch('http://localhost:3001/api/labourer/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUser.id,
                    ...formData,
                    experience_years: parseInt(formData.experience_years) || 0,
                    hourly_rate: parseFloat(formData.hourly_rate) || 0
                }),
            });

            if (response.ok) {
                alert('Profile saved successfully!');
                navigate('/labourer');
            } else {
                alert('Failed to save profile');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile');
        } finally {
            setLoading(false);
        }
    };

    const toggleSkill = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    const toggleLanguage = (language: string) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.includes(language)
                ? prev.languages.filter(l => l !== language)
                : [...prev.languages, language]
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-blue-100">
                <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-4">
                    <button onClick={() => navigate('/labourer')} className="text-gray-600 hover:text-brand-brown">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Setup Your Profile</h1>
                </div>
            </div>

            <main className="mx-auto max-w-4xl px-4 py-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Skills * (Select all that apply)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {availableSkills.map(skill => (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => toggleSkill(skill)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${formData.skills.includes(skill)
                                            ? 'bg-brand-brown text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Experience (Years) *
                            </label>
                            <input
                                type="number"
                                value={formData.experience_years}
                                onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                                required
                                min="0"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-brown"
                                placeholder="5"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Hourly Rate (₹) *
                            </label>
                            <input
                                type="number"
                                value={formData.hourly_rate}
                                onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-brown"
                                placeholder="100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-brown"
                                placeholder="Pune, Maharashtra"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-brown"
                                placeholder="+91 98765 43210"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Languages (Select all that apply)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {availableLanguages.map(language => (
                                <button
                                    key={language}
                                    type="button"
                                    onClick={() => toggleLanguage(language)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${formData.languages.includes(language)
                                            ? 'bg-brand-brown text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {language}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Bio / About You
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-brown"
                            placeholder="Tell farmers about your experience, work ethic, and what makes you a great labourer..."
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/labourer')}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || formData.skills.length === 0}
                            className="flex-1 px-6 py-3 bg-brand-brown text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:bg-gray-400"
                        >
                            {loading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default ProfileSetupPage;
