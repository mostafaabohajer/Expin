import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useLanguage } from '@/shared/lib/language';
import { useTranslation } from 'react-i18next';
import { useWalletQuery } from '../api/useWalletQuery';
import { useWithdrawMutation } from '../api/useWithdrawMutation';
import type { WithdrawalState } from '../types/wallet.types';

import { ActiveCampaignsList } from './ActiveCampaignsList';
import { BalanceCard } from './BalanceCard';
import { EarningsBreakdown } from './EarningsBreakdown';
import { WithdrawButton } from './WithdrawButton';
import { WithdrawStateOverlay } from './WithdrawStateOverlay';

const WITHDRAW_AMOUNT = 500;

export function WalletDashboard() {
  const { language, direction } = useLanguage();
  const { t } = useTranslation();

  const wallet = useWalletQuery();
  const withdraw = useWithdrawMutation();

  const [state, setState] = useState<WithdrawalState>('idle');
  const [message, setMessage] = useState<string>();

  const data = wallet.data?.data;

  const canWithdraw =
    (data?.balance.available ?? 0) >= WITHDRAW_AMOUNT &&
    state !== 'processing' &&
    !withdraw.isPending;

  useEffect(() => {
    if (withdraw.isPending) setState('processing');

    if (withdraw.isSuccess) {
      setState('success');
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const id = setTimeout(() => setState('idle'), 1800);
      return () => clearTimeout(id);
    }

    if (withdraw.isError) {
      setState('error');
      setMessage(withdraw.error.message);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [withdraw.error, withdraw.isError, withdraw.isPending, withdraw.isSuccess]);

  const onWithdraw = useCallback(() => {
    if (!canWithdraw) return;

    setMessage(undefined);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    withdraw.mutate({ amount: WITHDRAW_AMOUNT, currency: 'AED' });
  }, [canWithdraw, withdraw]);

  const onRetry = useCallback(() => {
    setState('idle');
    onWithdraw();
  }, [onWithdraw]);

  if (wallet.isLoading) return <WalletSkeleton />;

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-white">
        <Text className="text-center text-slate-600">
          {t('wallet.dashboard.loadingError')}
        </Text>
      </View>
    );
  }

  const zero = data.balance.available <= 0;

  return (
    <View className="flex-1 bg-slate-50" style={{ direction }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={wallet.isRefetching}
            tintColor="#10b981"
            colors={['#10b981']}
            onRefresh={wallet.refetch}
          />
        }
        contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
      >
        {/* Header */}
        <Text className="mt-3 text-sm font-semibold uppercase tracking-[3px] text-emerald-600">
          {t('wallet.dashboard.appName')}
        </Text>

        <Text className="mt-2 text-3xl font-black text-slate-900">
          {t('wallet.dashboard.title')}
        </Text>

        {/* Balance */}
        <View className="mt-6">
          <BalanceCard balance={data.balance} state={state} />

          {zero && (
            <Text className="mt-3 text-center text-slate-500">
              {t('wallet.dashboard.zeroBalance')}
            </Text>
          )}

          <WithdrawButton state={state} disabled={!canWithdraw} onPress={onWithdraw} />
        </View>

        {/* Earnings */}
        <View className="mt-6">
          <EarningsBreakdown earnings={data.earnings} />
        </View>

        {/* Campaigns */}
        <View className="mt-6">
          <ActiveCampaignsList campaigns={data.activeCampaigns} />
        </View>
      </ScrollView>

      <WithdrawStateOverlay
        state={state}
        {...(message ? { message } : {})}
        onRetry={onRetry}
      />
    </View>
  );
}

/* ---------------- Skeleton ---------------- */

function WalletSkeleton() {
  const shimmer = useSharedValue(-1);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1100 }), -1, true);
  }, [shimmer]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.4 + Math.abs(shimmer.value) * 0.4,
  }));

  return (
    <View className="flex-1 gap-5 p-5 pt-12 bg-white">
      {[96, 220, 160, 96, 96].map((height, index) => (
        <Animated.View
          key={index}
          style={[style, { height }]}
          className="rounded-[28px] bg-slate-100 border border-slate-200"
        />
      ))}
    </View>
  );
}

export { WalletDashboard as WalletScreen };