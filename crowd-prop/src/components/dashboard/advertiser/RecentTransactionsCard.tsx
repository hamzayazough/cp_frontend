'use client';

import { useState } from 'react';
import { usePaymentManagement } from '@/hooks/usePaymentManagement';
import { BanknotesIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

interface RecentTransactionsCardProps {
  showHeader?: boolean;
  maxTransactions?: number;
  className?: string;
}

export default function RecentTransactionsCard({
  showHeader = true,
  maxTransactions = 3,
  className = '',
}: RecentTransactionsCardProps) {
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const { transactions } = usePaymentManagement();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const displayedTransactions = showAllTransactions 
    ? transactions 
    : transactions.slice(0, maxTransactions);

  const content = (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        {showHeader && (
          <h3 className="font-medium text-gray-900">
            Recent Transactions
          </h3>
        )}
        {transactions.length > maxTransactions && (
          <button
            onClick={() => setShowAllTransactions(!showAllTransactions)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showAllTransactions ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
      <div className="space-y-3">
        {transactions.length > 0 ? (
          displayedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-green-100">
                  <ArrowUpIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {transaction.type === 'WALLET_DEPOSIT' ? 'Wallet Deposit' : transaction.type}
                  </div>
                  <div className="text-sm text-gray-600">
                    {transaction.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    Status: {transaction.status} • {transaction.paymentMethod}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-green-600">
                  +{formatCurrency(transaction.amount)}
                </div>
                <div className="text-xs text-gray-500">
                  Gross: {formatCurrency(transaction.grossAmount)}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-sm font-medium text-gray-900 mb-2">No transactions yet</h4>
            <p className="text-sm text-gray-500">
              Your transaction history will appear here once you start funding campaigns.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  if (showHeader) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Transaction History
          </h2>
        </div>
        <div className="p-6">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
