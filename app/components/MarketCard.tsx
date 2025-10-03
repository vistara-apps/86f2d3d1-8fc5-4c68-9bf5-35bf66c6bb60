'use client';

import { useState, useMemo, memo } from 'react';
import { Clock, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { BetModal } from './BetModal';
import type { Market } from '../lib/types';

interface MarketCardProps {
  market: Market;
  isLoading?: boolean;
}

export const MarketCard = memo(function MarketCard({ market, isLoading = false }: MarketCardProps) {
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<'YES' | 'NO'>('YES');

  const { totalVolume, yesPercentage, noPercentage, timeDisplay, isExpiringSoon } = useMemo(() => {
    const totalVol = market.totalYesVolume + market.totalNoVolume;
    const yesPerc = totalVol > 0 ? (market.totalYesVolume / totalVol) * 100 : 50;
    const noPerc = 100 - yesPerc;

    const timeRemaining = new Date(market.expiresAt).getTime() - Date.now();
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
    const daysRemaining = Math.floor(hoursRemaining / 24);
    const isExpiring = timeRemaining < 24 * 60 * 60 * 1000; // Less than 24 hours

    let timeDisplay = '';
    if (daysRemaining > 0) {
      timeDisplay = `${daysRemaining}d`;
    } else if (hoursRemaining > 0) {
      timeDisplay = `${hoursRemaining}h`;
    } else {
      const minutesRemaining = Math.floor(timeRemaining / (1000 * 60));
      timeDisplay = `${minutesRemaining}m`;
    }

    return {
      totalVolume: totalVol,
      yesPercentage: yesPerc,
      noPercentage: noPerc,
      timeDisplay,
      isExpiringSoon: isExpiring,
    };
  }, [market.totalYesVolume, market.totalNoVolume, market.expiresAt]);

  const handleBet = (position: 'YES' | 'NO') => {
    setSelectedPosition(position);
    setIsBetModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="glass-card p-6 pulse-loading">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-16 bg-surface-hover rounded-full"></div>
            <div className="h-4 w-12 bg-surface-hover rounded"></div>
          </div>
          <div className="h-6 w-3/4 bg-surface-hover rounded mb-4"></div>
          <div className="h-2 w-full bg-surface-hover rounded mb-4"></div>
          <div className="flex justify-between mb-4">
            <div className="h-4 w-16 bg-surface-hover rounded"></div>
            <div className="h-4 w-16 bg-surface-hover rounded"></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-surface-hover rounded"></div>
            <div className="h-10 bg-surface-hover rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <article
        className="glass-card p-6 fade-in focus-within:ring-2 focus-within:ring-accent/50"
        role="article"
        aria-labelledby={`market-${market.id}-title`}
        tabIndex={0}
      >
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
            aria-label={`Market status: ${market.status}`}
          >
            {market.status === 'open'
              ? 'Active'
              : market.status === 'settled'
                ? 'Settled'
                : 'Locked'}
          </span>
          <div
            className={`flex items-center space-x-1 text-sm ${
              isExpiringSoon ? 'text-warning' : 'text-text-muted'
            }`}
          >
            {isExpiringSoon && <AlertCircle className="w-4 h-4" />}
            <Clock className="w-4 h-4" />
            <span aria-label={`Time remaining: ${timeDisplay}`}>{timeDisplay}</span>
          </div>
        </div>

        {/* Question */}
        <h3
          id={`market-${market.id}-title`}
          className="text-lg font-semibold text-fg mb-4 line-clamp-2"
        >
          {market.question}
        </h3>

        {/* Odds Bar */}
        <div className="mb-4" aria-label="Betting odds distribution">
          <div className="flex items-center justify-between text-sm mb-2">
            <span
              className="text-success font-semibold flex items-center space-x-1"
              aria-label={`YES odds: ${yesPercentage.toFixed(0)} percent`}
            >
              <span className="w-2 h-2 bg-success rounded-full"></span>
              <span>{yesPercentage.toFixed(0)}% YES</span>
            </span>
            <span className="text-text-muted text-xs">
              {totalVolume > 0 ? `${(totalVolume / 1e18).toFixed(2)} ETH` : 'No bets yet'}
            </span>
            <span
              className="text-error font-semibold flex items-center space-x-1"
              aria-label={`NO odds: ${noPercentage.toFixed(0)} percent`}
            >
              <span>{noPercentage.toFixed(0)}% NO</span>
              <span className="w-2 h-2 bg-error rounded-full"></span>
            </span>
          </div>
          <div className="odds-bar relative" role="progressbar" aria-label="Market sentiment">
            <div className="flex h-full">
              <div
                className="odds-bar-fill-yes relative"
                style={{ width: `${yesPercentage}%` }}
                aria-label={`YES: ${yesPercentage.toFixed(1)}%`}
              >
                {yesPercentage > 15 && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {yesPercentage.toFixed(0)}%
                  </span>
                )}
              </div>
              <div
                className="odds-bar-fill-no relative"
                style={{ width: `${noPercentage}%` }}
                aria-label={`NO: ${noPercentage.toFixed(1)}%`}
              >
                {noPercentage > 15 && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {noPercentage.toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-text-muted mb-4">
          <div
            className="flex items-center space-x-1"
            aria-label={`Total volume: ${(totalVolume / 1e18).toFixed(3)} ETH`}
          >
            <TrendingUp className="w-4 h-4" aria-hidden="true" />
            <span>{(totalVolume / 1e18).toFixed(3)} ETH</span>
          </div>
          <div
            className="flex items-center space-x-1"
            aria-label={`${market.bets.length} total bets`}
          >
            <Users className="w-4 h-4" aria-hidden="true" />
            <span>{market.bets.length} bets</span>
          </div>
        </div>

        {/* Action Buttons */}
        {market.status === 'open' && (
          <div className="grid grid-cols-2 gap-3" role="group" aria-label="Place bet options">
            <button
              onClick={() => handleBet('YES')}
              className="btn-yes text-sm py-2 focus-visible"
              aria-label={`Bet YES on: ${market.question}`}
              type="button"
            >
              Bet YES
            </button>
            <button
              onClick={() => handleBet('NO')}
              className="btn-no text-sm py-2 focus-visible"
              aria-label={`Bet NO on: ${market.question}`}
              type="button"
            >
              Bet NO
            </button>
          </div>
        )}

        {market.status === 'settled' && market.outcome && (
          <div className="text-center">
            <div
              className={`inline-flex items-center px-4 py-2 rounded-md font-semibold ${
                market.outcome === 'YES' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
              }`}
              role="status"
              aria-label={`Market settled with outcome: ${market.outcome}`}
            >
              Settled: {market.outcome}
            </div>
          </div>
        )}
      </article>

      {isBetModalOpen && (
        <BetModal
          market={market}
          position={selectedPosition}
          onClose={() => setIsBetModalOpen(false)}
        />
      )}
    </>
  );
});
