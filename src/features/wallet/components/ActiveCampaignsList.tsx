import { Text, View } from 'react-native';
import { useLanguage } from '@/shared/lib/language';
import { useTranslation } from 'react-i18next';
import type { ActiveCampaign } from '../types/wallet.types';
import { formatCurrency } from '../utils/formatCurrency';

export function ActiveCampaignsList({ campaigns }: { campaigns: ActiveCampaign[] }) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  if (campaigns.length === 0)
    return (
      <View className="rounded-[28px] border border-dashed border-slate-300 bg-white p-6">
        <Text className="text-center text-slate-500">
          {t('campaigns.empty')}
        </Text>
      </View>
    );

  return (
    <View className="gap-3">
      <Text className="text-lg font-bold text-slate-900">
        {t('campaigns.title')}
      </Text>

      {campaigns.map((c) => (
        <View
          key={c.id}
          className="rounded-[24px] bg-white p-4 border border-slate-200 shadow-sm"
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-bold text-slate-900">
                {t(c.title)}
              </Text>

              <Text className="mt-1 text-xs text-slate-500">
                {t(c.brand)}
                {t('campaigns.statusSeparator')}
                {t(c.status)}
              </Text>
            </View>

            <Text
              style={{ writingDirection: 'ltr' }}
              className="font-bold text-emerald-600"
            >
              {formatCurrency(c.expectedReturn, language)}
            </Text>
          </View>

          <View className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
            <View
              style={{ width: `${c.progress * 100}%` }}
              className="h-2 rounded-full bg-violet-500"
            />
          </View>
        </View>
      ))}
    </View>
  );
}