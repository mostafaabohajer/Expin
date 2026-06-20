import type {
  LaravelResponse,
  WalletData,
  WithdrawPayload,
  WithdrawResult,
} from '../types/wallet.types';

const randomLatency = () => 300 + Math.floor(Math.random() * 501);
const requestId = () => `req_${Math.random().toString(36).slice(2, 10)}`;

let serverWallet: WalletData = {
  balance: {
    available: 8420.75,
    pending: 1280.25,
    currency: 'AED',
    lastSyncedAt: new Date().toISOString(),
  },
  earnings: {
    thisMonth: 3120.5,
    total: 48670,
    byCampaign: [
      {
        campaignId: 'c1',
        title: 'wallet.campaigns.dubaiMarina',
        amount: 1450,
        progress: 0.82,
        expectedPayout: 1780,
      },
      {
        campaignId: 'c2',
        title: 'wallet.campaigns.ramadanPack',
        amount: 920.5,
        progress: 0.64,
        expectedPayout: 1440,
      },
      {
        campaignId: 'c3',
        title: 'wallet.campaigns.fintechWeek',
        amount: 750,
        progress: 0.48,
        expectedPayout: 1560,
      },
    ],
  },
  activeCampaigns: [
    {
      id: 'c1',
      title: 'wallet.campaigns.dubaiMarina',
      brand: 'wallet.brands.nuraLiving',
      progress: 0.82,
      expectedReturn: 1780,
      status: 'wallet.status.endingSoon',
    },
    {
      id: 'c2',
      title: 'wallet.campaigns.ramadanPack',
      brand: 'wallet.brands.saffronPay',
      progress: 0.64,
      expectedReturn: 1440,
      status: 'wallet.status.live',
    },
    {
      id: 'c3',
      title: 'wallet.campaigns.fintechWeek',
      brand: 'wallet.brands.stripeMena',
      progress: 0.48,
      expectedReturn: 1560,
      status: 'wallet.status.reviewing',
    },
  ],
};

const envelope = <T>(data: T, locale: 'en' | 'ar' = 'en'): LaravelResponse<T> => ({
  data,
  meta: { requestId: requestId(), servedAt: new Date().toISOString(), locale, currency: 'AED' },
});

export async function fetchWallet(locale: 'en' | 'ar' = 'en') {
  await new Promise((resolve) => setTimeout(resolve, randomLatency()));
  return envelope(structuredClone(serverWallet), locale);
}

export async function withdrawFunds(payload: WithdrawPayload) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (Math.random() < 0.2) throw new Error('Withdrawal could not be queued. Please try again.');
  serverWallet = {
    ...serverWallet,
    balance: {
      ...serverWallet.balance,
      available: Math.max(0, serverWallet.balance.available - payload.amount),
      lastSyncedAt: new Date().toISOString(),
    },
  };
  return envelope<WithdrawResult>({
    withdrawalId: `wd_${Date.now()}`,
    amount: payload.amount,
    status: 'queued',
    createdAt: new Date().toISOString(),
  });
}
