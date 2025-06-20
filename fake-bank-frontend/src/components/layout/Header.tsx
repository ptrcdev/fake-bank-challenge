import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();

    setTimeout(() => router.push('/auth'), 0);
  }, [logout, router]);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SecureBank</h1>
          <p className="text-sm text-gray-500">Your trusted banking partner</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">{user?.email}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
