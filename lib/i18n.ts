export const locales = [
  "th", // Thai
  "en", // English
  "zh", // Chinese
  "ja", // Japanese
  "ko", // Korean
  "ms", // Malay
  "id", // Indonesian
  "vi", // Vietnamese
  "tl", // Filipino
  "es", // Spanish
  "fr", // French
  "de", // German
  "ru", // Russian
  "pt", // Portuguese
  "ar", // Arabic
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const languageNames: Record<Locale, { native: string; english: string; flag: string }> = {
  th: { native: "ไทย", english: "Thai", flag: "🇹🇭" },
  en: { native: "English", english: "English", flag: "🇬🇧" },
  zh: { native: "中文", english: "Chinese", flag: "🇨🇳" },
  ja: { native: "日本語", english: "Japanese", flag: "🇯🇵" },
  ko: { native: "한국어", english: "Korean", flag: "🇰🇷" },
  ms: { native: "Bahasa Melayu", english: "Malay", flag: "🇲🇾" },
  id: { native: "Bahasa Indonesia", english: "Indonesian", flag: "🇮🇩" },
  vi: { native: "Tiếng Việt", english: "Vietnamese", flag: "🇻🇳" },
  tl: { native: "Filipino", english: "Filipino", flag: "🇵🇭" },
  es: { native: "Español", english: "Spanish", flag: "🇪🇸" },
  fr: { native: "Français", english: "French", flag: "🇫🇷" },
  de: { native: "Deutsch", english: "German", flag: "🇩🇪" },
  ru: { native: "Русский", english: "Russian", flag: "🇷🇺" },
  pt: { native: "Português", english: "Portuguese", flag: "🇵🇹" },
  ar: { native: "العربية", english: "Arabic", flag: "🇸🇦" },
};

// Primary languages for SEO (pre-translate these)
export const primaryLanguages: Locale[] = [
  "th",  // Thai
  "en",  // English
  "zh",  // Chinese
  "ja",  // Japanese
  "ko",  // Korean
  "ms",  // Malay
  "id",  // Indonesian
  "vi",  // Vietnamese
  "tl",  // Filipino
  "es",  // Spanish
];

// Secondary languages (on-demand translation)
export const secondaryLanguages: Locale[] = ["fr", "de", "ru", "pt", "ar"];

export function getLocale(locale?: string): Locale {
  if (locale && locales.includes(locale as Locale)) {
    return locale as Locale;
  }
  return defaultLocale;
}

export function isRTL(locale: Locale): boolean {
  return locale === "ar";
}

// Save user's language preference
export function saveLanguagePreference(locale: Locale) {
  if (typeof window !== "undefined") {
    localStorage.setItem("preferred-language", locale);
    // Also save in cookie for server-side access
    document.cookie = `preferred-language=${locale}; max-age=${60 * 60 * 24 * 365}; path=/`;
  }
}

// Get saved language preference
export function getLanguagePreference(): Locale | null {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("preferred-language");
    if (saved && locales.includes(saved as Locale)) {
      return saved as Locale;
    }
  }
  return null;
}
