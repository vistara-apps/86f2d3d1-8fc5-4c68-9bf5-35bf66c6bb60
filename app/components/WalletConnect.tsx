'use client';

import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';

export function WalletConnect() {
  return (
    <Wallet>
      <ConnectWallet className="bg-accent hover:bg-yellow-400 text-slate-900 font-semibold px-6 py-2 rounded-md transition-all duration-200">
        <Avatar className="w-6 h-6" />
        <Name className="font-semibold" />
      </ConnectWallet>
    </Wallet>
  );
}
