import { View, Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/shared/components/AppText';
import { useLanguage } from '@/shared/lib/language';
import { useDirection } from '@/shared/hooks/useDirection';

export function ProfileScreen() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { isRTL, flexRow, textAlign } = useDirection();

  return (
    <View className="flex-1 bg-slate-50 px-4 pt-6">

      {/* Header */}
      <View className="mb-6">
        <Text className="mt-3 text-sm font-semibold uppercase tracking-[3px] text-emerald-600">
          {t('profile.title')}
        </Text>

        <Text className="mt-2 text-3xl font-black text-slate-900">
          {t('profile.subtitle')}
        </Text>
      </View>

      {/* Profile Card */}
      <View className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

        {/* Avatar + Info (RTL/LTR FIXED) */}
        <View className={`${flexRow} items-center`}>

          {/* Avatar */}
          <View className="h-14 w-14 rounded-full bg-violet-500 items-center justify-center">
            <AppText className="text-white font-bold text-lg">
              U
            </AppText>
          </View>

          {/* spacing */}
          <View className="w-4" />

          {/* Info */}
          <View className={`flex-1 ${textAlign}`}>
            <AppText className={`text-slate-900 font-bold text-base `}>
              {t('profile.name')}
            </AppText>

            <AppText className={`text-slate-500 text-sm `}>
              {t('profile.email')}
            </AppText>
          </View>

        </View>

        {/* Divider */}
        <View className="h-px bg-slate-100 my-4" />

        {/* Stats */}
        <View className="flex-row justify-between">
          <View>
            <AppText className="text-slate-500 text-xs">
              {t('profile.stats.projects')}
            </AppText>
            <AppText className="text-slate-900 font-bold">
              12
            </AppText>
          </View>

          <View>
            <AppText className="text-slate-500 text-xs">
              {t('profile.stats.revenue')}
            </AppText>
            <AppText className="text-emerald-600 font-bold">
              $4.2K
            </AppText>
          </View>

          <View>
            <AppText className="text-slate-500 text-xs">
              {t('profile.stats.level')}
            </AppText>
            <AppText className="text-slate-900 font-bold">
              Pro
            </AppText>
          </View>
        </View>
      </View>

      {/* Settings Section */}
      <View className="mt-6 gap-3">

        <AppText className="text-slate-900 font-bold text-base">
          {t('profile.settings.title')}
        </AppText>

        {/* Language Switch */}
        <Pressable
          onPress={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="bg-white border border-slate-200 rounded-2xl p-4 flex-row items-center justify-between"
        >
          <AppText className="text-slate-700">
            {t('profile.settings.language')}
          </AppText>

          <AppText className="text-violet-600 font-bold">
            {language === 'ar'
              ? t('profile.settings.english')
              : t('profile.settings.arabic')}
          </AppText>
        </Pressable>

        {/* Account */}
        <Pressable className="bg-white border border-slate-200 rounded-2xl p-4">
          <AppText className="text-slate-700">
            {t('profile.settings.account')}
          </AppText>
        </Pressable>

        {/* Security */}
        <Pressable className="bg-white border border-slate-200 rounded-2xl p-4">
          <AppText className="text-slate-700">
            {t('profile.settings.security')}
          </AppText>
        </Pressable>

        {/* Logout */}
        <Pressable className="bg-white border border-slate-200 rounded-2xl p-4">
          <AppText className="text-red-500 font-medium">
            {t('profile.settings.logout')}
          </AppText>
        </Pressable>

      </View>
    </View>
  );
}