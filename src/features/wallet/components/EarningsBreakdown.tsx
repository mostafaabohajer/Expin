import { Text, View } from 'react-native';
import { useLanguage } from '@/shared/lib/language';
import { useTranslation } from 'react-i18next';
import type { WalletEarnings } from '../types/wallet.types';
import { formatCurrency } from '../utils/formatCurrency';

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-3xl bg-slate-50 p-4 border border-slate-100">

      <Text className="text-xs text-slate-500">
        {label}
      </Text>

      <Text
        style={{ writingDirection: 'ltr', fontVariant: ['tabular-nums'] }}
        className="mt-2 text-xl font-black text-slate-900"
      >
        {value}
      </Text>

    </View>
  );
}

export function EarningsBreakdown({ earnings }: { earnings: WalletEarnings }) {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <View className="rounded-[28px] bg-white p-5 border border-slate-100 shadow-sm">

      {/* Title */}
      <Text className="text-lg font-bold text-slate-900">
        {t('wallet.earnings.title')}
      </Text>

      {/* Summary tiles */}
      <View className="mt-4 flex-row gap-3">

        <Tile
          label={t('wallet.earnings.thisMonth')}
          value={formatCurrency(earnings.thisMonth, language)}
        />

        <Tile
          label={t('wallet.earnings.lifetime')}
          value={formatCurrency(earnings.total, language)}
        />

      </View>

      {/* Campaign list */}
      {earnings.byCampaign.map((item) => (
        <View key={item.campaignId} className="mt-4">

          <View className="flex-row justify-between">
            <Text className="text-slate-700">
              {t(item.title)}
            </Text>

            <Text
              style={{ writingDirection: 'ltr' }}
              className="font-semibold text-emerald-600"
            >
              {formatCurrency(item.amount, language)}
            </Text>
          </View>

          <View className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <View
              style={{ width: `${item.progress * 100}%` }}
              className="h-2 rounded-full bg-emerald-500"
            />
          </View>

        </View>
      ))}

    </View>
  );
}