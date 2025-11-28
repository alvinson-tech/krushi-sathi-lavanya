import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as db from '../../services/db';

const ManageEquipmentPage: React.FC = () => {
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'All' | 'Equipment' | 'Input'>('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const currentUser = db.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        fetchEquipment(currentUser.id);
    }, [navigate]);

    const fetchEquipment = async (sellerId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/api/seller/equipment/${sellerId}`);
            const data = await response.json();
            setEquipment(data);
        } catch (error) {
            console.error('Failed to fetch equipment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'Available' ? 'Paused' : 'Available';
        try {
            await fetch(`http://localhost:3001/api/seller/equipment/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            setEquipment(equipment.map(item =>
                item.id === id ? { ...item, status: newStatus } : item
            ));
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this equipment?')) return;

        try {
            await fetch(`http://localhost:3001/api/admin/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: 'admin',
                    password: 'admin123',
                    tableName: 'equipment',
                    recordId: id
                }),
            });
            setEquipment(equipment.filter(item => item.id !== id));
        } catch (error) {
            console.error('Failed to delete equipment:', error);
        }
    };

    const filteredEquipment = equipment.filter(item => {
        const matchesFilter = filter === 'All' || item.category === filter;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading equipment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-emerald-100">
                <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/seller')} className="text-gray-600 hover:text-brand-green">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Manage Equipment</h1>
                    </div>
                    <Link
                        to="/seller/equipment/add"
                        className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 text-white font-semibold shadow-lg hover:bg-brand-green-dark transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Equipment
                    </Link>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex gap-2">
                            {(['All', 'Equipment', 'Input'] as const).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-4 py-2 rounded-full font-semibold transition-all ${filter === cat
                                            ? 'bg-brand-green text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="Search equipment..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green w-full md:w-64"
                        />
                    </div>
                </div>

                {filteredEquipment.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No equipment found</h3>
                        <p className="text-gray-600 mb-4">Start by adding your first equipment or input listing</p>
                        <Link
                            to="/seller/equipment/add"
                            className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 text-white font-semibold hover:bg-brand-green-dark transition-all"
                        >
                            Add Equipment
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEquipment.map(item => (
                            <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-emerald-50">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-20 h-20 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                    )}
                                    <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'Available' ? 'bg-emerald-100 text-brand-green' :
                                            item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                                                'bg-gray-200 text-gray-600'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{item.category}</p>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description || 'No description'}</p>
                                    <p className="text-2xl font-bold text-brand-green mb-1">
                                        ₹{item.price} <span className="text-sm font-medium text-gray-500">{item.unit}</span>
                                    </p>
                                    <p className="text-sm text-gray-600 mb-4">{item.availability}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <span>⭐ {item.rating || 0}</span>
                                        <span>{item.bookings || 0} bookings</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleStatusToggle(item.id, item.status)}
                                            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${item.status === 'Available'
                                                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                    : 'bg-emerald-100 text-brand-green hover:bg-emerald-200'
                                                }`}
                                        >
                                            {item.status === 'Available' ? 'Pause' : 'Resume'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="px-4 py-2 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition-all"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ManageEquipmentPage;
