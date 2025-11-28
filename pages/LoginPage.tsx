
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as db from '../services/db';
import { UserRole } from '../types';

// Optimized image URLs for faster loading
const backgrounds = [
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=70&w=1280&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=70&w=1280&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?q=70&w=1280&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1627923762502-938a4947974f?q=70&w=1280&auto=format&fit=crop",
];

const RoleIcon: React.FC<{ role: UserRole }> = ({ role }) => {
    switch (role) {
        case 'FARMER':
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16"/><path d="M2 14h16"/><path d="m6 8 4 6 4-6"/><path d="M12 2v2"/><path d="M12 16v2"/></svg>; // Combine harvester icon
        case 'SELLER':
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M12 7v5"/></svg>; // Shop icon
        case 'LABOURER':
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 12a2 2 0 1 0-4 0"/><path d="m22 12-2.25 2.25-1.07-1.07a2.5 2.5 0 0 0-3.36 0l-1.07 1.07L12 12m0 0-2.25 2.25-1.07-1.07a2.5 2.5 0 0 0-3.36 0L4.25 14.5 2 12"/><path d="M12 12v3a2 2 0 0 0 2 2h2v-2a2 2 0 0 0-2-2Z"/><path d="M12 12v3a2 2 0 0 1-2 2H8v-2a2 2 0 0 1 2-2Z"/><path d="M12 2a2.5 2.5 0 0 1 2.5 2.5V6a2.5 2.5 0 0 1-5 0V4.5A2.5 2.5 0 0 1 12 2Z"/></svg>; // Worker icon
        default:
            return null;
    }
};


const LoginPage: React.FC = () => {
    const [currentBg, setCurrentBg] = useState(0);
    const [role, setRole] = useState<UserRole>('FARMER');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % backgrounds.length);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        backgrounds.slice(1).forEach(bg => { new Image().src = bg; });
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const form = e.currentTarget as HTMLFormElement;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;

        try {
            const user = await db.loginUser(email, password);
            if(user.role.toLowerCase() !== role.toLowerCase()) {
                setError(`You are not registered as a ${role.charAt(0) + role.slice(1).toLowerCase()}. Please select the correct role.`);
                setLoading(false);
                return;
            }
            
            db.setCurrentUser(user);
            
            switch (user.role) {
                case 'FARMER':
                    navigate('/farmer');
                    break;
                case 'SELLER':
                    navigate('/seller');
                    break;
                case 'LABOURER':
                    navigate('/labourer');
                    break;
                default:
                    navigate('/');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getRoleButtonStyle = (currentRole: UserRole) => {
        return `relative flex-1 px-4 py-3 text-sm font-medium text-center transition-colors duration-300 z-10 ${role === currentRole ? 'text-white' : 'text-gray-300 hover:text-white'}`;
    };
    
    const getSliderPosition = () => {
        if (role === 'FARMER') return 'translateX(0%)';
        if (role === 'SELLER') return 'translateX(100%)';
        return 'translateX(200%)';
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center text-white overflow-hidden">
            {backgrounds.map((bg, index) => (
                <div
                    key={index}
                    className="absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
                    style={{ 
                        backgroundImage: `url(${bg})`, 
                        opacity: currentBg === index ? 1 : 0,
                        transform: 'scale(1.05)'
                    }}
                />
            ))}
            <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>
            
            <Link to="/" className="absolute top-6 left-8 text-2xl font-bold text-brand-green z-20">
                Krushi Sathi
            </Link>

            <div className="relative z-10 w-full max-w-md p-8 sm:p-12 space-y-8 bg-black/50 backdrop-blur-md rounded-2xl shadow-2xl animate-fade-in-up">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Login</h1>
                </div>

                <div className="bg-gray-900/50 p-1 rounded-full flex relative">
                    <div className="absolute top-0 left-0 h-full w-1/3 p-1 transition-transform duration-300 ease-in-out" style={{ transform: getSliderPosition() }}>
                        <div className="bg-brand-green w-full h-full rounded-full"></div>
                    </div>
                    <button onClick={() => setRole('FARMER')} className={getRoleButtonStyle('FARMER')}>Farmer</button>
                    <button onClick={() => setRole('SELLER')} className={getRoleButtonStyle('SELLER')}>Seller</button>
                    <button onClick={() => setRole('LABOURER')} className={getRoleButtonStyle('LABOURER')}>Labourer</button>
                </div>
                
                <div className="flex justify-center items-center text-brand-green h-8 transition-opacity duration-300">
                    <RoleIcon role={role} />
                </div>
                
                <form className="space-y-6" onSubmit={handleLogin}>
                     {error && <p className="text-sm text-red-400 text-center -mt-4">{error}</p>}
                    <div>
                        <label htmlFor="email" className="sr-only">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
                            placeholder="Email Address"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
                            placeholder="Password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 font-bold text-white bg-brand-green rounded-lg hover:bg-brand-green-dark transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:scale-100"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="text-center text-gray-400 text-sm flex justify-between">
                    <a href="#" className="hover:underline hover:text-white">Forgot password?</a>
                    <Link to="/register" className="hover:underline hover:text-white">Create new account</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
