export interface User {
  id: string;
  farcasterFid?: string;
  telegramUserId?: string;
  discordUserId?: string;
  walletAddress: string;
  reputation: number;
  createdAt: string;
  totalBetsPlaced: number;
  totalWinnings: number;
}

export interface Market {
  id: string;
  question: string;
  creatorId: string;
  platform: 'farcaster' | 'telegram' | 'discord' | 'twitch';
  chatId: string;
  resolutionType: 'oracle' | 'community' | 'manual';
  oracleSource?: string;
  oracleCondition?: string;
  expiresAt: string;
  settledAt?: string;
  outcome?: 'YES' | 'NO' | 'INVALID';
  totalYesVolume: number;
  totalNoVolume: number;
  status: 'open' | 'locked' | 'settled' | 'disputed';
  createdAt: string;
  bets: Bet[];
}

export interface Bet {
  id: string;
  marketId: string;
  userId: string;
  position: 'YES' | 'NO';
  amount: number;
  odds: number;
  potentialPayout: number;
  txHash: string;
  placedAt: string;
  settledAt?: string;
  payout?: number;
}

export interface Vote {
  id: string;
  marketId: string;
  voterId: string;
  outcome: 'YES' | 'NO';
  stake: number;
  votedAt: string;
}

export interface OracleLog {
  id: string;
  marketId: string;
  oracleSource: string;
  queriedAt: string;
  result: any;
  outcome: 'YES' | 'NO' | 'INVALID';
}
