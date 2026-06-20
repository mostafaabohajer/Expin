import { useEffect, useState } from 'react';
import { I18nManager, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useLanguage } from '@/shared/lib/language';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../utils/formatCurrency';
import type { WalletBalance, WithdrawalState } from '../types/wallet.types';


export function BalanceCard({
  balance,
  state,
}: {
  balance: WalletBalance;
  state: WithdrawalState;
}) {
  const { language, direction } = useLanguage();
  const { t } = useTranslation();

  const displayed = useSharedValue(balance.available);
  const shake = useSharedValue(0);

  const [label, setLabel] = useState(
    formatCurrency(balance.available, language, balance.currency),
  );

  useEffect(() => {
    displayed.value = withTiming(balance.available, { duration: 650 });

    const id = setInterval(() => {
      setLabel(formatCurrency(displayed.value, language, balance.currency));
    }, 32);

    return () => clearInterval(id);
  }, [balance.available, balance.currency, displayed, language]);

  useEffect(() => {
    if (state === 'error') {
      shake.value = withSequence(
        withTiming(-8),
        withTiming(8),
        withTiming(-5),
        withSpring(0),
      );
    }
  }, [shake, state]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const stateKey =
  state === 'processing'
    ? 'wallet.balance.states.processing'
    : state === 'success'
      ? 'wallet.balance.states.success'
      : 'wallet.balance.states.error';
  return (
    <Animated.View
      layout={Layout.springify()}
      style={animatedStyle}
      entering={FadeIn}
      className="overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm"
    >
      <View className="p-6">
        
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold uppercase tracking-[3px] text-slate-500">
            {t('wallet.balance.available')}
          </Text>

          <Text
            style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
            className="text-2xl text-emerald-500"
          >
            ↗
          </Text>
        </View>

        {/* Balance */}
        <Text
          style={{
            writingDirection: 'ltr',
            fontVariant: ['tabular-nums'],
            textAlign: direction === 'rtl' ? 'right' : 'left',
          }}
          className="mt-5 text-5xl font-black text-slate-900"
        >
          {label}
        </Text>

        {/* Bottom stats */}
        <View className="mt-6 flex-row justify-between rounded-3xl bg-slate-50 p-4 border border-slate-100">
          
          {/* Pending */}
          <View>
            <Text className="text-xs text-slate-500">
              {t('wallet.balance.pending')}
            </Text>

            <Text
              style={{ writingDirection: 'ltr' }}
              className="mt-1 text-base font-bold text-slate-900"
            >
              {formatCurrency(balance.pending, language, balance.currency)}
            </Text>
          </View>

          {/* State */}
          <View>
            <Text className="text-xs text-slate-500">
              {t('wallet.balance.state')}
            </Text>

            <Text className="mt-1 text-base font-bold text-emerald-600">
              {state === 'idle'
                ? t('wallet.balance.ready')
                : t(stateKey)}
            </Text>
          </View>

        </View>
      </View>
    </Animated.View>
  );
}