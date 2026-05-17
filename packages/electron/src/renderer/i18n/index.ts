import zhCN from './zh-CN.json';
import en from './en.json';

export type Locale = 'en' | 'zh-CN';

export type TranslationKeys = typeof en;

const translations: Record<Locale, TranslationKeys> = {
  en,
  'zh-CN': zhCN as unknown as TranslationKeys,
};

let currentLocale: Locale = 'zh-CN';

/**
 * 获取当前语言设置
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * 设置当前语言
 */
export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

/**
 * 从 store 中加载语言设置（在 App 初始化时调用）
 */
export async function loadLocaleFromStore(): Promise<void> {
  try {
    const locale = await window.electronAPI?.invoke('app-settings:get', 'uiLocale');
    if (locale === 'en' || locale === 'zh-CN') {
      currentLocale = locale;
    }
  } catch {
    currentLocale = 'zh-CN';
  }
}

/**
 * 将语言设置持久化到 store
 */
export async function persistLocale(locale: Locale): Promise<void> {
  currentLocale = locale;
  try {
    await window.electronAPI?.invoke('app-settings:set', 'uiLocale', locale);
  } catch {
    // ignore
  }
}

/**
 * 根据点号分隔的路径获取嵌套对象的值
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : undefined;
}

/**
 * 翻译函数，根据 key 获取当前语言的对应文本
 * @param key - 点号分隔的翻译键，如 "menu.file"
 * @param fallback - 可选的回退文本，找不到翻译时返回
 */
export function t(key: string, fallback?: string): string {
  const translation = getNestedValue(translations[currentLocale] as unknown as Record<string, unknown>, key);
  if (translation !== undefined) return translation;

  if (fallback !== undefined) return fallback;

  const enTranslation = getNestedValue(translations.en as unknown as Record<string, unknown>, key);
  if (enTranslation !== undefined) return enTranslation;

  return key;
}

/**
 * React Hook：获取翻译函数和当前语言
 */
export function useI18n() {
  return {
    t,
    locale: currentLocale,
    setLocale: persistLocale,
  };
}
