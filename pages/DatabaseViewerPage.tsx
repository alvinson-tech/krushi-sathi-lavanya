
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface DatabaseRecords {
    users: any[];
    equipment: any[];
    labour_jobs: any[];
    job_applications: any[];
    equipment_bookings: any[];
    labourer_profiles: any[];
    market_prices: any[];
}

const DatabaseViewerPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState<DatabaseRecords | null>(null);
    const [activeTab, setActiveTab] = useState<keyof DatabaseRecords>('users');
    const navigate = useNavigate();

    // Check for existing session on mount
    useEffect(() => {
        const savedAuth = sessionStorage.getItem('admin-auth');
        if (savedAuth) {
            const { username: savedUsername, password: savedPassword } = JSON.parse(savedAuth);
            setUsername(savedUsername);
            setPassword(savedPassword);
            setIsAuthenticated(true);
            // Fetch records with saved credentials
            fetchRecordsWithCredentials(savedUsername, savedPassword);
        }
    }, []);

    const fetchRecordsWithCredentials = async (user: string, pass: string) => {
        try {
            const response = await fetch('http://localhost:3001/api/admin/records', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: user, password: pass }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch records');
            }

            setRecords(data);
        } catch (err: any) {
            setError(err.message);
            // If fetch fails, clear session
            sessionStorage.removeItem('admin-auth');
            setIsAuthenticated(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3001/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Save credentials to sessionStorage
            sessionStorage.setItem('admin-auth', JSON.stringify({ username, password }));
            setIsAuthenticated(true);
            fetchRecords();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecords = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/admin/records', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch records');
            }

            setRecords(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin-auth');
        setIsAuthenticated(false);
        setUsername('');
        setPassword('');
        setRecords(null);
    };

    const handleDelete = async (tableName: string, recordId: number) => {
        if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/admin/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, tableName, recordId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete record');
            }

            // Refresh records after deletion
            fetchRecords();
        } catch (err: any) {
            alert('Error: ' + err.message);
        }
    };

    const renderTable = (data: any[], tableName: string) => {
        if (!data || data.length === 0) {
            return (
                <div className="text-center py-12 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-lg">No records found in {tableName.replace('_', ' ')}</p>
                </div>
            );
        }

        const columns = Object.keys(data[0]);

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                                >
                                    {col.replace('_', ' ')}
                                </th>
                            ))}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                        {data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-800 transition-colors">
                                {columns.map((col) => (
                                    <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {col === 'password' ? '••••••••' : String(row[col])}
                                    </td>
                                ))}
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => handleDelete(tableName, row.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                        title="Delete record"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-green rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
                            <p className="text-gray-400">Database Viewer</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
                                    placeholder="Enter admin username"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
                                    placeholder="Enter admin password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-brand-green hover:bg-brand-green-dark text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-gray-600 disabled:scale-100"
                            >
                                {loading ? 'Authenticating...' : 'Login'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link to="/" className="text-sm text-gray-400 hover:text-brand-green transition-colors">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* Header */}
            <div className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link to="/" className="text-2xl font-bold text-brand-green">
                                Krushi Sathi
                            </Link>
                            <span className="text-gray-400">|</span>
                            <h1 className="text-xl font-semibold">Database Viewer</h1>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden">
                    <div className="flex border-b border-gray-700 overflow-x-auto">
                        {(['users', 'equipment', 'labour_jobs', 'job_applications', 'equipment_bookings', 'labourer_profiles', 'market_prices'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab
                                    ? 'bg-brand-green text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                            >
                                {tab.replace('_', ' ').toUpperCase()}
                                {records && records[tab] && (
                                    <span className="ml-2 px-2 py-1 bg-gray-700 rounded-full text-xs">
                                        {records[tab].length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Table Content */}
                    <div className="p-6">
                        {records ? (
                            renderTable(records[activeTab], activeTab)
                        ) : (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto"></div>
                                <p className="mt-4 text-gray-400">Loading database records...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                {records && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                        {(Object.entries(records) as [keyof DatabaseRecords, any[]][]).map(([key, value]) => (
                            <div key={key} className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
                                <h3 className="text-gray-400 text-sm font-medium mb-2">
                                    {key.replace('_', ' ').toUpperCase()}
                                </h3>
                                <p className="text-3xl font-bold text-brand-green">{value.length}</p>
                                <p className="text-gray-500 text-xs mt-1">Total Records</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DatabaseViewerPage;
