
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Wallet } from 'lucide-react';
import { useBalance } from '@/hooks/useGraphQL';
import { useToast } from '@/hooks/use-toast';
import { BankSpinner } from '../ui/Loading';
import { redirect } from 'next/navigation';


const BalanceCard: React.FC = () => {
  const { user } = useAuth();
  const { data: balance, isLoading, error } = useBalance(user?.accessToken || '')
  const { toast } = useToast();

  if (isLoading) return <BankSpinner />;

  if (!user) return redirect('/auth');

  if (error) toast({
    title: 'Error',
    description: error.message,
    variant: 'destructive',
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium opacity-90">
          Current Balance
        </CardTitle>
        <Wallet className="h-4 w-4 opacity-90" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {formatCurrency(balance || 0)}
        </div>
        <p className="text-xs opacity-80 mt-1">
          Available for transactions
        </p>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
