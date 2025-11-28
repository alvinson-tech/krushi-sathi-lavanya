import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as db from '../../services/db';

const BookingRequestsPage: React.FC = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'All' | 'PENDING' | 'ACCEPTED' | 'REJECTED'>('All');

    useEffect(() => {
        const currentUser = db.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        fetchBookings(currentUser.id);
    }, [navigate]);

    const fetchBookings = async (sellerId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/api/seller/bookings/${sellerId}`);
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id: number) => {
        try {
            await fetch(`http://localhost:3001/api/seller/bookings/${id}/accept`, {
                method: 'PATCH',
            });
            setBookings(bookings.map(booking =>
                booking.id === id ? { ...booking, status: 'ACCEPTED' } : booking
            ));
        } catch (error) {
            console.error('Failed to accept booking:', error);
        }
    };

    const handleReject = async (id: number) => {
        try {
            await fetch(`http://localhost:3001/api/seller/bookings/${id}/reject`, {
                method: 'PATCH',
            });
            setBookings(bookings.map(booking =>
                booking.id === id ? { ...booking, status: 'REJECTED' } : booking
            ));
        } catch (error) {
            console.error('Failed to reject booking:', error);
        }
    };

    const filteredBookings = filter === 'All'
        ? bookings
        : bookings.filter(b => b.status === filter);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-emerald-100">
                <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-4">
                    <button onClick={() => navigate('/seller')} className="text-gray-600 hover:text-brand-green">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Booking Requests</h1>
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
                                        ? 'bg-brand-green text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No booking requests</h3>
                        <p className="text-gray-600">You don't have any {filter !== 'All' ? filter.toLowerCase() : ''} booking requests yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map(booking => (
                            <div key={booking.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-gray-900">{booking.equipment_name}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                    booking.status === 'ACCEPTED' ? 'bg-emerald-100 text-brand-green' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p><span className="font-semibold">Farmer:</span> {booking.farmer_name}</p>
                                            <p><span className="font-semibold">Email:</span> {booking.farmer_email}</p>
                                            <p><span className="font-semibold">Slot:</span> {booking.slot}</p>
                                            <p className="text-lg font-bold text-brand-green mt-2">₹{booking.price}</p>
                                        </div>
                                    </div>

                                    {booking.status === 'PENDING' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleReject(booking.id)}
                                                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleAccept(booking.id)}
                                                className="px-6 py-2 rounded-lg bg-brand-green text-white font-semibold hover:bg-brand-green-dark transition-all"
                                            >
                                                Accept
                                            </button>
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

export default BookingRequestsPage;
