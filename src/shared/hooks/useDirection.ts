import { I18nManager } from 'react-native';
import { useEffect, useMemo } from 'react';
import { useLanguage } from '@/shared/lib/language';

export function useDirection() {
  const { language } = useLanguage();

  const isRTL = language === 'ar';

  useEffect(() => {
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);

      // مهم جداً: React Native يحتاج restart
      // Expo: يحتاج reload
    }
  }, [isRTL]);

  const direction = useMemo(() => {
    return {
      isRTL,
      flexRow: isRTL ? 'flex-row-reverse' : 'flex-row',
      textAlign: isRTL ? 'text-right' : 'text-left',
      selfAlign: isRTL ? 'items-end' : 'items-start',
    };
  }, [isRTL]);

  return direction;
}