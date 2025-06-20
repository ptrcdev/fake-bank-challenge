"use client";

import { useLogin, useRegister } from '@/hooks/useGraphQL';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface User {
    id: string;
    email: string;
    balance: number;
    accessToken: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateBalance: (newBalance: number) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

type RegisterMutationResponse = {
    register: {
        accessToken: string;
        user: User;
    }
}

type LoginMutationResponse = {
    login: {
        accessToken: string;
        user: User;
    }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { mutateAsync: registerMutation } = useRegister();
    const { mutateAsync: loginMutation } = useLogin();

    const register = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            const data = await registerMutation({
                email,
                password
            }) as RegisterMutationResponse;

            const token = data.register.accessToken;
            localStorage.setItem('accessToken', token);
            const userData = { id: data.register.user.id, email: data.register.user.email, balance: data.register.user.balance, accessToken: token };
            setUser(userData);
            localStorage.setItem('bankUser', JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Registration error:', error);
            return false;

        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Check for existing session
        const savedUser = localStorage.getItem('bankUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);

        try {
            const data = await loginMutation({
                email,
                password
            }) as LoginMutationResponse;
            const token = data.login.accessToken;
            localStorage.setItem('accessToken', token);
            const userData = { id: data.login.user.id, email: data.login.user.email, balance: data.login.user.balance, accessToken: token };
            setUser(userData);
            localStorage.setItem('bankUser', JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('bankUser');
        localStorage.removeItem('accessToken');
    }, []);

    const updateBalance = (newBalance: number) => {
        if (user) {
            const updatedUser = { ...user, balance: newBalance };
            setUser(updatedUser);
            localStorage.setItem('bankUser', JSON.stringify(updatedUser));

            // Update in users array too
            const users = JSON.parse(localStorage.getItem('bankUsers') || '[]');
            const userIndex = users.findIndex((u: User) => u.id === user.id);
            if (userIndex !== -1) {
                users[userIndex].balance = newBalance;
                localStorage.setItem('bankUsers', JSON.stringify(users));
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateBalance, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};