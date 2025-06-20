"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2 } from 'lucide-react';

import { useDeposit } from '@/hooks/useGraphQL';
import { useAuth } from '@/contexts/AuthContext';

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ open, onOpenChange }) => {
  const [amount, setAmount] = useState('');
  const { toast } = useToast();
  const { user } = useAuth()

  const depositAmount = parseFloat(amount);
  const { mutate: deposit, isPending } = useDeposit(user?.accessToken || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!depositAmount || depositAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      });
      return;
    }

    if (depositAmount > 10000) {
      toast({
        title: "Amount too large",
        description: "Maximum deposit amount is $10,000",
        variant: "destructive",
      });
      return;
    }

    deposit(
      { amount: depositAmount },
      {
        onSuccess: () => {
          toast({
            title: "Deposit successful!",
            description: `$${depositAmount.toFixed(2)} has been added to your account.`,
          });
          setAmount('');
          onOpenChange(false);
        },
        onError: (err) => {
          toast({
            title: "Deposit failed",
            description: err?.message ?? "Something went wrong",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            Deposit Money
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              max="10000"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Minimum: $0.01 • Maximum: $10,000
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Deposit
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
