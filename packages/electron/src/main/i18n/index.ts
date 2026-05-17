import zhCN from '../i18n/main-zh-CN.json';
import en from '../i18n/main-en.json';
import { getAppSetting } from '../utils/store';

export type MainLocale = 'en' | 'zh-CN';

const translations: Record<MainLocale, Record<string, string>> = {
  en,
  'zh-CN': zhCN,
};

/**
 * 获取当前 UI 语言设置
 */
export function getMainLocale(): MainLocale {
  const locale = getAppSetting<string>('uiLocale');
  if (locale === 'en' || locale === 'zh-CN') return locale;
  return 'zh-CN';
}

/**
 * 翻译函数，根据 key 获取当前语言的对应文本
 * @param key - 翻译键
 * @param fallback - 可选的回退文本
 */
export function tm(key: string, fallback?: string): string {
  const locale = getMainLocale();
  const translation = translations[locale]?.[key];
  if (translation !== undefined) return translation;

  const enTranslation = translations['en']?.[key];
  if (enTranslation !== undefined) return enTranslation;

  return fallback ?? key;
}
