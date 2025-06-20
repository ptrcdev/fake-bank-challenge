"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Minus } from "lucide-react";
import { useBalance, useWithdraw } from "@/hooks/useGraphQL";

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ open, onOpenChange }) => {
  const [amount, setAmount] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const mutation = useWithdraw(user?.accessToken || "");
  const { data: balance, isLoading, error } = useBalance(user?.accessToken || '');

  if (isLoading) return <p>Loading...</p>
  if (error) toast({
    title: 'Error',
    description: error.message,
    variant: 'destructive',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const withdrawAmount = parseFloat(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    if (withdrawAmount > (balance || 0)) {
      toast({
        title: "Insufficient funds",
        description: "You cannot withdraw more than your available balance",
        variant: "destructive",
      });
      return;
    }

    try {
      await mutation.mutateAsync({ amount: withdrawAmount });

      toast({
        title: "Withdrawal successful!",
        description: `$${withdrawAmount.toFixed(2)} has been withdrawn from your account`,
      });

      setAmount("");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Withdrawal failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Minus className="h-5 w-5 text-red-600" />
            Withdraw Money
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              Available Balance:{" "}
              <span className="font-semibold">
                {formatCurrency(balance || 0)}
              </span>
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              max={balance || 0}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Maximum: {formatCurrency(balance || 0)}
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
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Withdraw
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;
