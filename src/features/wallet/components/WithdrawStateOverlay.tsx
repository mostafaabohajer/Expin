import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { useLanguage } from '@/shared/lib/language';
import { useTranslation } from 'react-i18next';
import type { WithdrawalState } from '../types/wallet.types';

export function WithdrawStateOverlay({
  state,
  message,
  onRetry,
}: {
  state: WithdrawalState;
  message?: string;
  onRetry: () => void;
}) {
  const { language } = useLanguage();
  const { t } = useTranslation();

  if (state === 'idle') return null;

  const isError = state === 'error';
  const isSuccess = state === 'success';
  const isProcessing = state === 'processing';

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutDown}
      className="absolute bottom-6 left-4 right-4"
    >
      <View className="rounded-[28px] bg-white border border-slate-100 shadow-lg p-5">

        <View className="flex-row items-center gap-4">

          {/* Icon */}
          <View
            className={`
              h-12 w-12 items-center justify-center rounded-full
              ${isError ? 'bg-red-50' : isSuccess ? 'bg-emerald-50' : 'bg-slate-100'}
            `}
          >
            <Text className="text-2xl">
              {isError ? '!' : isSuccess ? '✓' : '…'}
            </Text>
          </View>

          {/* Text */}
          <View className="flex-1">

            <Text className="font-bold text-slate-900">
              {isError
                ? t('wallet.overlay.failed')
                : isSuccess
                  ? t('wallet.overlay.success')
                  : t('wallet.overlay.processing')}
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              {message ?? t('wallet.overlay.sync')}
            </Text>

          </View>

          {/* Retry */}
          {isError && (
            <Pressable
              onPress={onRetry}
              className="rounded-2xl bg-slate-900 px-4 py-3"
            >
              <Text className="font-bold text-white">
                {t('wallet.overlay.retry')}
              </Text>
            </Pressable>
          )}

        </View>
      </View>
    </Animated.View>
  );
}