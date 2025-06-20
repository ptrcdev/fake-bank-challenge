"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SecureBank...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return redirect('/auth');
  }

  return redirect('/dashboard')
};

const Home: React.FC = () => {
  return (
    <AppContent />
  );
};

export default Home;
