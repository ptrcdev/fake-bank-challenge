"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import BalanceCard from '@/components/dashboard/BalanceCard';
import QuickActions from '@/components/dashboard/QuickActions';
import TransactionHistory from '@/components/transactions/TransactionHistory';
import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';
import { BankSpinner } from '@/components/ui/Loading';

const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <BankSpinner />;

  if (!user) return redirect('/auth');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Manage your account and transactions</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <BalanceCard />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
        
        <TransactionHistory />
      </main>
    </div>
  );
};

export default DashboardPage;
