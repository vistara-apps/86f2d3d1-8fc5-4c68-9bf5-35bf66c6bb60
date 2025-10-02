# BetFrame - Prediction Markets in Chat

Turn any chat into a prediction market — one click, instant bets.

## Features

- 🎯 **One-Click Betting**: Create and bet on predictions directly in chat
- 💰 **Real-Time Odds**: Dynamic odds based on betting volume
- 🔮 **Oracle Integration**: Auto-settle markets using Chainlink price feeds
- 👥 **Community Governance**: Vote-based resolution for subjective markets
- 🌐 **Multi-Platform**: Works in Farcaster, Telegram, Discord, and more
- ⚡ **Base L2**: Fast, cheap transactions on Base network

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base L2 (Ethereum L2)
- **Wallet**: OnchainKit + MiniKit for Farcaster
- **Styling**: Tailwind CSS with custom finance theme
- **Oracles**: Chainlink Price Feeds
- **TypeScript**: Full type safety

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Get your OnchainKit API key from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

## Project Structure

```
app/
├── components/          # React components
│   ├── MarketCard.tsx   # Market display card
│   ├── BetModal.tsx     # Betting interface
│   ├── CreateMarketModal.tsx
│   └── WalletConnect.tsx
├── lib/
│   ├── types.ts         # TypeScript types
│   └── mockData.ts      # Sample data
├── layout.tsx           # Root layout
├── page.tsx             # Home page
├── providers.tsx        # OnchainKit provider
└── globals.css          # Global styles
```

## Key Features

### Market Creation
- Create prediction markets with custom questions
- Choose oracle-based or community-based resolution
- Set expiration dates and conditions

### Betting
- Bet YES or NO on any market
- Real-time odds calculation
- Transparent potential payouts
- Instant transaction confirmation

### Resolution
- **Oracle Markets**: Auto-settle using Chainlink price feeds
- **Community Markets**: Vote-based resolution with staking
- **Dispute System**: Challenge outcomes with community voting

## Design System

The app uses a professional finance theme:
- **Colors**: Dark navy background with gold accents
- **Typography**: Clean, modern fonts
- **Components**: Reusable, accessible UI components
- **Responsive**: Mobile-first design

## Smart Contract Integration

Markets are stored on-chain with:
- Transparent bet tracking
- Immutable market conditions
- Trustless settlement
- On-chain dispute resolution

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel deploy
```

## Environment Variables

- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: OnchainKit API key
- `NEXT_PUBLIC_BASE_RPC_URL`: Base RPC endpoint (optional)
- `UPSTASH_REDIS_REST_URL`: Redis cache URL (optional)
- `UPSTASH_REDIS_REST_TOKEN`: Redis auth token (optional)

## Contributing

Contributions welcome! Please read our contributing guidelines.

## License

MIT License - see LICENSE file for details
