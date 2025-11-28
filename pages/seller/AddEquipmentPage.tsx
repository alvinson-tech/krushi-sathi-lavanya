import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as db from '../../services/db';

const AddEquipmentPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Equipment',
        description: '',
        price: '',
        unit: 'per day',
        image_url: '',
        availability: '',
        status: 'Available'
    });

    useEffect(() => {
        const currentUser = db.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const currentUser = db.getCurrentUser();
        if (!currentUser) return;

        try {
            const response = await fetch('http://localhost:3001/api/seller/equipment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    owner_id: currentUser.id
                }),
            });

            if (response.ok) {
                alert('Equipment added successfully!');
                navigate('/seller/equipment');
            } else {
                alert('Failed to add equipment');
            }
        } catch (error) {
            console.error('Error adding equipment:', error);
            alert('Failed to add equipment');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-emerald-100">
                <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-4">
                    <button onClick={() => navigate('/seller/equipment')} className="text-gray-600 hover:text-brand-green">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Add New Equipment</h1>
                </div>
            </div>

            <main className="mx-auto max-w-4xl px-4 py-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Equipment Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                                placeholder="e.g., John Deere 5310 Tractor"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                            >
                                <option value="Equipment">Equipment</option>
                                <option value="Input">Input (Seeds/Fertilizer/Pesticide)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Price *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                                placeholder="1100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Unit *
                            </label>
                            <select
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                            >
                                <option value="per hour">per hour</option>
                                <option value="per day">per day</option>
                                <option value="per acre">per acre</option>
                                <option value="per litre">per litre</option>
                                <option value="per kg">per kg</option>
                                <option value="per bag">per bag</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Availability
                            </label>
                            <input
                                type="text"
                                name="availability"
                                value={formData.availability}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                                placeholder="e.g., Available from 4 PM today"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                            >
                                <option value="Available">Available</option>
                                <option value="Low Stock">Low Stock</option>
                                <option value="Paused">Paused</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Image URL
                        </label>
                        <input
                            type="url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                            placeholder="https://example.com/image.jpg"
                        />
                        <p className="text-xs text-gray-500 mt-1">Optional: Add a URL to an image of your equipment</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                            placeholder="Describe your equipment, its condition, features, etc."
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/seller/equipment')}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-brand-green text-white rounded-lg font-semibold hover:bg-brand-green-dark transition-all disabled:bg-gray-400"
                        >
                            {loading ? 'Adding...' : 'Add Equipment'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default AddEquipmentPage;
