'use client';

import { useState } from 'react';
import { X, TrendingUp, AlertCircle } from 'lucide-react';
import type { Market } from '../lib/types';

interface BetModalProps {
  market: Market;
  position: 'YES' | 'NO';
  onClose: () => void;
}

export function BetModal({ market, position, onClose }: BetModalProps) {
  const [amount, setAmount] = useState('0.01');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalVolume = market.totalYesVolume + market.totalNoVolume;
  const currentOdds = position === 'YES'
    ? totalVolume > 0 ? (market.totalYesVolume / totalVolume) * 100 : 50
    : totalVolume > 0 ? (market.totalNoVolume / totalVolume) * 100 : 50;

  const betAmount = parseFloat(amount) || 0;
  const potentialPayout = betAmount * (100 / currentOdds);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // In production, this would call MiniKit.sendTransaction()
    console.log('Bet placed:', { market: market.id, position, amount: betAmount });
    
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-fg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-fg mb-2">Place Your Bet</h2>
          <p className="text-text-secondary text-sm line-clamp-2">{market.question}</p>
        </div>

        {/* Position Badge */}
        <div className="mb-6">
          <div
            className={`inline-flex items-center px-4 py-2 rounded-md font-semibold ${
              position === 'YES'
                ? 'bg-success/20 text-success'
                : 'bg-error/20 text-error'
            }`}
          >
            Betting on {position}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-text-secondary text-sm font-medium mb-2">
            Bet Amount (ETH)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.001"
            min="0.001"
            className="w-full bg-surface border border-border rounded-md px-4 py-3 text-fg focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="0.01"
          />
          <div className="flex items-center space-x-2 mt-2">
            {['0.01', '0.05', '0.1', '0.5'].map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className="px-3 py-1 bg-surface-hover rounded-md text-sm text-text-secondary hover:text-fg transition-colors"
              >
                {preset} ETH
              </button>
            ))}
          </div>
        </div>

        {/* Odds Info */}
        <div className="glass-card p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-text-muted text-sm">Current Odds</span>
            <span className="text-fg font-semibold">{currentOdds.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-muted text-sm">Your Bet</span>
            <span className="text-fg font-semibold">{betAmount.toFixed(3)} ETH</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-text-secondary font-medium">Potential Payout</span>
            <span className="text-accent font-bold text-lg">
              {potentialPayout.toFixed(3)} ETH
            </span>
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start space-x-2 mb-6 p-3 bg-warning/10 border border-warning/30 rounded-md">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <p className="text-sm text-text-secondary">
            Bets are final and cannot be cancelled. Market settles at{' '}
            {new Date(market.expiresAt).toLocaleString()}.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={position === 'YES' ? 'btn-yes' : 'btn-no'}
            disabled={isSubmitting || betAmount <= 0}
          >
            {isSubmitting ? 'Placing Bet...' : `Bet ${position}`}
          </button>
        </div>
      </div>
    </div>
  );
}
