
import { User, UserRegistrationData } from '../types';

const DB_KEY = 'krushi-sathi-users';
const SESSION_KEY = 'krushi-sathi-session';

// --- User Management ---

const getUsers = (): User[] => {
    try {
        const usersJson = localStorage.getItem(DB_KEY);
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
        return [];
    }
};

const saveUsers = (users: User[]): void => {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
};

export const registerUser = (userData: UserRegistrationData): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { // Simulate network delay
            const users = getUsers();
            const existingUser = users.find(user => user.email.toLowerCase() === userData.email.toLowerCase());

            if (existingUser) {
                return reject(new Error('An account with this email already exists.'));
            }

            const newUser: User = {
                id: Date.now().toString(),
                ...userData,
            };

            users.push(newUser);
            saveUsers(users);
            resolve(newUser);
        }, 500);
    });
};

export const loginUser = (email: string, password: string): Promise<User> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => { // Simulate network delay
            const users = getUsers();
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user || user.password !== password) {
                return reject(new Error('Invalid email or password.'));
            }
            
            resolve(user);
        }, 500);
    });
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
