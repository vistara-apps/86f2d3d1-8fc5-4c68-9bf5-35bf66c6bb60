'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Clock, Users, DollarSign, Search } from 'lucide-react';
import { MarketCard } from './components/MarketCard';
import { CreateMarketModal } from './components/CreateMarketModal';
import { WalletConnect } from './components/WalletConnect';
import { SkeletonCard } from './components/SkeletonCard';
import { ThemeToggle } from './components/ThemeToggle';
import { mockMarkets } from './lib/mockData';
import type { Market } from './lib/types';

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'settled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setMarkets(mockMarkets);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const filteredMarkets = markets.filter((market) => {
    // Filter by status
    let statusMatch = true;
    if (filter === 'active') statusMatch = market.status === 'open';
    else if (filter === 'settled') statusMatch = market.status === 'settled';

    // Filter by search query
    const searchMatch = searchQuery === '' || 
      market.question.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  const stats = {
    totalVolume: markets.reduce((sum, m) => sum + m.totalYesVolume + m.totalNoVolume, 0),
    activeMarkets: markets.filter((m) => m.status === 'open').length,
    totalBets: markets.reduce((sum, m) => sum + m.bets.length, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-fg">BetFrame</h1>
                <p className="text-sm text-text-muted hidden sm:block">Prediction Markets</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <ThemeToggle />
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 whitespace-nowrap"
                aria-label="Create new prediction market"
              >
                Create Market
              </button>
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="glass-card p-4 sm:p-6 transition-all duration-200 hover:shadow-card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs sm:text-sm">Total Volume</p>
                <p className="text-xl sm:text-2xl font-bold text-accent">
                  {isLoading ? (
                    <div className="h-8 w-24 bg-surface-hover rounded animate-pulse"></div>
                  ) : (
                    `${(stats.totalVolume / 1e18).toFixed(2)} ETH`
                  )}
                </p>
              </div>
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-accent flex-shrink-0" />
            </div>
          </div>
          <div className="glass-card p-4 sm:p-6 transition-all duration-200 hover:shadow-card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs sm:text-sm">Active Markets</p>
                <p className="text-xl sm:text-2xl font-bold text-fg">
                  {isLoading ? (
                    <div className="h-8 w-16 bg-surface-hover rounded animate-pulse"></div>
                  ) : (
                    stats.activeMarkets
                  )}
                </p>
              </div>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
            </div>
          </div>
          <div className="glass-card p-4 sm:p-6 transition-all duration-200 hover:shadow-card-hover sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs sm:text-sm">Total Bets</p>
                <p className="text-xl sm:text-2xl font-bold text-fg">
                  {isLoading ? (
                    <div className="h-8 w-16 bg-surface-hover rounded animate-pulse"></div>
                  ) : (
                    stats.totalBets
                  )}
                </p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-success flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-md text-fg placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
              aria-label="Search prediction markets"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2 w-full sm:w-auto" role="tablist" aria-label="Market filter options">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm ${
                filter === 'all'
                  ? 'bg-accent text-slate-900 shadow-button'
                  : 'bg-surface text-text-secondary hover:bg-surface-hover'
              }`}
              role="tab"
              aria-selected={filter === 'all'}
              aria-controls="markets-content"
            >
              All Markets
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm ${
                filter === 'active'
                  ? 'bg-accent text-slate-900 shadow-button'
                  : 'bg-surface text-text-secondary hover:bg-surface-hover'
              }`}
              role="tab"
              aria-selected={filter === 'active'}
              aria-controls="markets-content"
            >
              Active
            </button>
            <button
              onClick={() => setFilter('settled')}
              className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm ${
                filter === 'settled'
                  ? 'bg-accent text-slate-900 shadow-button'
                  : 'bg-surface text-text-secondary hover:bg-surface-hover'
              }`}
              role="tab"
              aria-selected={filter === 'settled'}
              aria-controls="markets-content"
            >
              Settled
            </button>
          </div>
        </div>
      </div>

      {/* Markets Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" id="markets-content" role="tabpanel">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredMarkets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-sm mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-surface rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-lg font-semibold text-fg mb-2">No markets found</h3>
              <p className="text-text-muted mb-6">
                {searchQuery 
                  ? `No markets match "${searchQuery}". Try adjusting your search.`
                  : filter === 'active' 
                    ? 'No active markets at the moment. Create one to get started!'
                    : 'No settled markets yet. Check back later!'
                }
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn-primary"
                >
                  Create First Market
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Market Modal */}
      {isCreateModalOpen && (
        <CreateMarketModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
}
