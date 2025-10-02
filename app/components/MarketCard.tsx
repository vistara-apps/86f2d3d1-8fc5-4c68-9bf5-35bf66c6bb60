'use client';

import { useState } from 'react';
import { Clock, TrendingUp, Users } from 'lucide-react';
import { BetModal } from './BetModal';
import type { Market } from '../lib/types';

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<'YES' | 'NO'>('YES');

  const totalVolume = market.totalYesVolume + market.totalNoVolume;
  const yesPercentage = totalVolume > 0 ? (market.totalYesVolume / totalVolume) * 100 : 50;
  const noPercentage = 100 - yesPercentage;

  const timeRemaining = new Date(market.expiresAt).getTime() - Date.now();
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const daysRemaining = Math.floor(hoursRemaining / 24);

  const handleBet = (position: 'YES' | 'NO') => {
    setSelectedPosition(position);
    setIsBetModalOpen(true);
  };

  return (
    <>
      <div className="glass-card p-6 hover:shadow-card-hover transition-all duration-200 cursor-pointer">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              market.status === 'open'
                ? 'bg-success/20 text-success'
                : market.status === 'settled'
                ? 'bg-slate-600/20 text-slate-400'
                : 'bg-warning/20 text-warning'
            }`}
          >
            {market.status === 'open' ? 'Active' : market.status === 'settled' ? 'Settled' : 'Locked'}
          </span>
          <div className="flex items-center space-x-1 text-text-muted text-sm">
            <Clock className="w-4 h-4" />
            <span>
              {daysRemaining > 0 ? `${daysRemaining}d` : `${hoursRemaining}h`}
            </span>
          </div>
        </div>

        {/* Question */}
        <h3 className="text-lg font-semibold text-fg mb-4 line-clamp-2">
          {market.question}
        </h3>

        {/* Odds Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-success font-semibold">{yesPercentage.toFixed(0)}% YES</span>
            <span className="text-error font-semibold">{noPercentage.toFixed(0)}% NO</span>
          </div>
          <div className="odds-bar">
            <div className="flex h-full">
              <div
                className="odds-bar-fill-yes"
                style={{ width: `${yesPercentage}%` }}
              />
              <div
                className="odds-bar-fill-no"
                style={{ width: `${noPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-text-muted mb-4">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4" />
            <span>{(totalVolume / 1e18).toFixed(3)} ETH</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{market.bets.length} bets</span>
          </div>
        </div>

        {/* Action Buttons */}
        {market.status === 'open' && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleBet('YES')}
              className="btn-yes text-sm py-2"
            >
              Bet YES
            </button>
            <button
              onClick={() => handleBet('NO')}
              className="btn-no text-sm py-2"
            >
              Bet NO
            </button>
          </div>
        )}

        {market.status === 'settled' && market.outcome && (
          <div className="text-center">
            <div
              className={`inline-flex items-center px-4 py-2 rounded-md font-semibold ${
                market.outcome === 'YES'
                  ? 'bg-success/20 text-success'
                  : 'bg-error/20 text-error'
              }`}
            >
              Settled: {market.outcome}
            </div>
          </div>
        )}
      </div>

      {isBetModalOpen && (
        <BetModal
          market={market}
          position={selectedPosition}
          onClose={() => setIsBetModalOpen(false)}
        />
      )}
    </>
  );
}
