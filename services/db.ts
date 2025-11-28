import { User, UserRegistrationData } from '../types';

const API_URL = 'http://localhost:3001/api';
const SESSION_KEY = 'krushi-sathi-session';

// --- User Management ---

export const registerUser = async (userData: UserRegistrationData): Promise<User> => {
    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        return data.user;
    } catch (error: any) {
        throw new Error(error.message || 'Failed to register user');
    }
};

export const loginUser = async (email: string, password: string): Promise<User> => {
    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        return data.user;
    } catch (error: any) {
        throw new Error(error.message || 'Failed to login');
    }
};


// --- Session Management ---

export const setCurrentUser = (user: User): void => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
    try {
        const userJson = sessionStorage.getItem(SESSION_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error("Failed to parse session user", error);
        return null;
    }
};

export const logoutUser = (): void => {
    sessionStorage.removeItem(SESSION_KEY);
};
