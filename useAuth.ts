
import { useState, useEffect, useCallback } from 'react';
import { User, UserWithPassword } from '../types';

const USERS_STORAGE_KEY = 'auth_users';
const SESSION_STORAGE_KEY = 'auth_currentUser';

const getStoredUsers = (): UserWithPassword[] => {
    try {
        const users = window.localStorage.getItem(USERS_STORAGE_KEY);
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
        return [];
    }
};

const getStoredSession = (): User | null => {
    try {
        const session = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
        return session ? JSON.parse(session) : null;
    } catch (error) {
        console.error("Failed to parse session from sessionStorage", error);
        return null;
    }
};

export const useAuth = () => {
    const [users, setUsers] = useState<UserWithPassword[]>(getStoredUsers);
    const [currentUser, setCurrentUser] = useState<User | null>(getStoredSession);

    useEffect(() => {
        try {
            window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        } catch (error) {
            console.error("Failed to save users to localStorage", error);
        }
    }, [users]);

    const register = useCallback(async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
        if (!username || !password) {
            return { success: false, message: 'Username and password are required.' };
        }
        const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (existingUser) {
            return { success: false, message: 'Username already exists.' };
        }

        const newUser: UserWithPassword = {
            id: `user-${new Date().getTime()}`,
            username,
            password, // In a real app, this should be hashed
        };

        setUsers(prev => [...prev, newUser]);
        
        // Automatically log in the new user
        const sessionUser: User = { id: newUser.id, username: newUser.username };
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
        setCurrentUser(sessionUser);

        return { success: true, message: 'Registration successful!' };
    }, [users]);

    const login = useCallback(async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
        if (user) {
            const sessionUser: User = { id: user.id, username: user.username };
            window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
            setCurrentUser(sessionUser);
            return { success: true, message: 'Login successful!' };
        }
        return { success: false, message: 'Invalid username or password.' };
    }, [users]);

    const logout = useCallback(() => {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
        setCurrentUser(null);
    }, []);

    return { user: currentUser, login, register, logout };
};
