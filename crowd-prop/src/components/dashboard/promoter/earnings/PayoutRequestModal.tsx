'use client';

import { useState } from 'react';
import {
  XMarkIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { promoterEarningsService } from '@/services/promoter-earnings.service';

interface PayoutRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  minimumThreshold: number;
  onSuccess?: () => void;
}

export default function PayoutRequestModal({
  isOpen,
  onClose,
  availableBalance,
  minimumThreshold,
  onSuccess,
}: PayoutRequestModalProps) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('BANK_TRANSFER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const paymentMethods = [
    { value: 'BANK_TRANSFER', label: 'Bank Transfer', description: 'Direct deposit to your bank account' },
    { value: 'PAYPAL', label: 'PayPal', description: 'Transfer to your PayPal account' },
    { value: 'STRIPE', label: 'Stripe Express', description: 'Instant transfer via Stripe' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requestAmount = parseFloat(amount);
    
    // Validation
    if (!requestAmount || requestAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (requestAmount < minimumThreshold) {
      setError(`Minimum payout amount is ${formatCurrency(minimumThreshold)}`);
      return;
    }
    
    if (requestAmount > availableBalance) {
      setError('Amount exceeds available balance');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await promoterEarningsService.requestPayout(requestAmount, method);
      
      if (response.success) {
        setSuccess(response.message);
        setAmount('');
        
        // Call success callback after a short delay
        setTimeout(() => {
          onSuccess?.();
          handleClose();
        }, 2000);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error('Error requesting payout:', err);
      setError('Failed to request payout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setError(null);
    setSuccess(null);
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const canRequestPayout = availableBalance >= minimumThreshold;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Request Payout</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Balance Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <BanknotesIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Available Balance</p>
                <p className="text-xl font-bold text-blue-900">{formatCurrency(availableBalance)}</p>
                <p className="text-xs text-blue-700">Minimum: {formatCurrency(minimumThreshold)}</p>
              </div>
            </div>
          </div>

          {/* Warning if below threshold */}
          {!canRequestPayout && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Minimum threshold not met</p>
                  <p className="text-xs text-yellow-700">
                    You need at least {formatCurrency(minimumThreshold)} to request a payout.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  max={availableBalance}
                  min={minimumThreshold}
                  step="0.01"
                  disabled={!canRequestPayout || loading || success}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Maximum: {formatCurrency(availableBalance)}
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="space-y-2">
                {paymentMethods.map((paymentMethod) => (
                  <label
                    key={paymentMethod.value}
                    className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      method === paymentMethod.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    } ${(!canRequestPayout || loading || success) ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={paymentMethod.value}
                      checked={method === paymentMethod.value}
                      onChange={(e) => setMethod(e.target.value)}
                      disabled={!canRequestPayout || loading || success}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{paymentMethod.label}</p>
                      <p className="text-xs text-gray-600">{paymentMethod.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Processing Time Note */}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">
                <strong>Processing time:</strong> Bank transfers typically take 1-3 business days.
                PayPal and Stripe transfers are usually processed within 24 hours.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canRequestPayout || loading || !amount || parseFloat(amount) <= 0 || success}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Processing...' : success ? 'Success!' : 'Request Payout'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
