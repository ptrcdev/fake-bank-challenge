"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Minus } from "lucide-react";

import { useTransactions } from "@/hooks/useGraphQL";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";
import { BankSpinner } from "../ui/Loading";

export type Transaction = {
  id: string;
  amount: number;
  type: string;
  postBalance: number;
  createdAt: string;
};
const TransactionHistory: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<'ALL' | 'DEPOSIT' | 'WITHDRAWAL'>('ALL');
  const limit = 5;

  const { data: transactions, isLoading, error } = useTransactions(
    limit,
    (currentPage - 1) * limit,
    user?.accessToken || '',
    filterType === 'ALL' ? undefined : filterType
  );

  if (isLoading) return <BankSpinner />

  if (!user) return redirect('/auth');

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading transactions...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Failed to load transactions.</p>
        </CardContent>
      </Card>
    );
  }

  if (!transactions?.items.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
        <div className="flex gap-2 mb-4">
          <Button
            variant={filterType === 'ALL' ? 'default' : 'outline'}
            onClick={() => setFilterType('ALL')}
          >
            All
          </Button>
          <Button
            variant={filterType === 'DEPOSIT' ? 'default' : 'outline'}
            onClick={() => setFilterType('DEPOSIT')}
          >
            Deposits
          </Button>
          <Button
            variant={filterType === 'WITHDRAWAL' ? 'default' : 'outline'}
            onClick={() => setFilterType('WITHDRAWAL')}
          >
            Withdrawals
          </Button>
        </div>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No transactions yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Your transaction history will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button
            variant={filterType === 'ALL' ? 'default' : 'outline'}
            onClick={() => setFilterType('ALL')}
          >
            All
          </Button>
          <Button
            variant={filterType === 'DEPOSIT' ? 'default' : 'outline'}
            onClick={() => setFilterType('DEPOSIT')}
          >
            Deposits
          </Button>
          <Button
            variant={filterType === 'WITHDRAWAL' ? 'default' : 'outline'}
            onClick={() => setFilterType('WITHDRAWAL')}
          >
            Withdrawals
          </Button>
        </div>
        <div className="space-y-4">
          {transactions.items.map((transaction: Transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${transaction.type === "DEPOSIT"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                    }`}
                >
                  {transaction.type === "DEPOSIT" ? (
                    <Plus className="h-4 w-4" />
                  ) : (
                    <Minus className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{transaction.type}</span>
                    <Badge
                      variant={transaction.type === "DEPOSIT" ? "default" : "secondary"}
                      className={
                        transaction.type === "DEPOSIT"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {transaction.type === "DEPOSIT" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  Balance: {formatCurrency(transaction.postBalance)}
                </p>
                <p className="text-xs text-gray-500">ID: {transaction.id}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          
          <div className="text-sm text-gray-500">
            Page {currentPage} of {Math.ceil((transactions?.total || 0) / limit)}
          </div>
          
          <Button
            variant="outline"
            disabled={!transactions?.hasMore}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
