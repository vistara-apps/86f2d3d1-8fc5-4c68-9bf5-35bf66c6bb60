'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { TrendingUp, Clock, Users, DollarSign } from 'lucide-react';
import { MarketCard } from './components/MarketCard';
import { CreateMarketModal } from './components/CreateMarketModal';
import { WalletConnect } from './components/WalletConnect';
import { mockMarkets } from './lib/mockData';
import type { Market } from './lib/types';

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'settled'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setMarkets(mockMarkets);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredMarkets = useMemo(() => {
    return markets.filter((market) => {
      if (filter === 'all') return true;
      if (filter === 'active') return market.status === 'open';
      if (filter === 'settled') return market.status === 'settled';
      return true;
    });
  }, [markets, filter]);

  const stats = useMemo(() => {
    return {
      totalVolume: markets.reduce((sum, m) => sum + m.totalYesVolume + m.totalNoVolume, 0),
      activeMarkets: markets.filter((m) => m.status === 'open').length,
      totalBets: markets.reduce((sum, m) => sum + m.bets.length, 0),
    };
  }, [markets]);

  const handleFilterChange = useCallback((newFilter: 'all' | 'active' | 'settled') => {
    setFilter(newFilter);
  }, []);

  const handleCreateModalToggle = useCallback(() => {
    setIsCreateModalOpen((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-yellow-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-slate-900" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-fg">BetFrame</h1>
                <p className="text-sm text-text-muted">Prediction Markets</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={handleCreateModalToggle}
                className="btn-primary text-sm sm:text-base px-4 sm:px-6"
                aria-label="Create new prediction market"
              >
                <span className="hidden sm:inline">Create Market</span>
                <span className="sm:hidden">Create</span>
              </button>
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Volume</p>
                <p className="text-2xl font-bold text-accent">
                  {(stats.totalVolume / 1e18).toFixed(2)} ETH
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-accent" />
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Active Markets</p>
                <p className="text-2xl font-bold text-fg">{stats.activeMarkets}</p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Bets</p>
                <p className="text-2xl font-bold text-fg">{stats.totalBets}</p>
              </div>
              <Users className="w-8 h-8 text-success" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div
          className="flex space-x-2 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Market filters"
        >
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 whitespace-nowrap focus-visible ${
              filter === 'all'
                ? 'bg-accent text-slate-900'
                : 'bg-surface text-text-secondary hover:bg-surface-hover'
            }`}
            role="tab"
            aria-selected={filter === 'all'}
            aria-controls="markets-grid"
          >
            All Markets
          </button>
          <button
            onClick={() => handleFilterChange('active')}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 whitespace-nowrap focus-visible ${
              filter === 'active'
                ? 'bg-accent text-slate-900'
                : 'bg-surface text-text-secondary hover:bg-surface-hover'
            }`}
            role="tab"
            aria-selected={filter === 'active'}
            aria-controls="markets-grid"
          >
            Active
          </button>
          <button
            onClick={() => handleFilterChange('settled')}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 whitespace-nowrap focus-visible ${
              filter === 'settled'
                ? 'bg-accent text-slate-900'
                : 'bg-surface text-text-secondary hover:bg-surface-hover'
            }`}
            role="tab"
            aria-selected={filter === 'settled'}
            aria-controls="markets-grid"
          >
            Settled
          </button>
        </div>
      </div>

      {/* Markets Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div
          id="markets-grid"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
          role="tabpanel"
          aria-label={`${filter === 'all' ? 'All' : filter === 'active' ? 'Active' : 'Settled'} markets`}
        >
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <MarketCard key={`loading-${index}`} market={{} as Market} isLoading={true} />
            ))
          ) : filteredMarkets.length > 0 ? (
            filteredMarkets.map((market) => <MarketCard key={market.id} market={market} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-text-muted text-lg">
                No {filter === 'all' ? '' : filter} markets found.
              </p>
              <button
                onClick={handleCreateModalToggle}
                className="btn-primary mt-4"
                aria-label="Create your first market"
              >
                Create Your First Market
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Market Modal */}
      {isCreateModalOpen && <CreateMarketModal onClose={handleCreateModalToggle} />}
    </div>
  );
}
