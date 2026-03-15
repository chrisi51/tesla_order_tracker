export const LOCALE_CONFIG = {
  de: { flag: '🇩🇪', label: 'Deutsch', region: 'europe-west' },
  en: { flag: '🇬🇧', label: 'English', region: 'europe-west' },
  fr: { flag: '🇫🇷', label: 'Français', region: 'europe-west' },
  nl: { flag: '🇳🇱', label: 'Nederlands', region: 'europe-west' },
  es: { flag: '🇪🇸', label: 'Español', region: 'europe-west' },
  pt: { flag: '🇵🇹', label: 'Português', region: 'europe-west' },
  it: { flag: '🇮🇹', label: 'Italiano', region: 'europe-west' },
  no: { flag: '🇳🇴', label: 'Norsk', region: 'nordic' },
  sv: { flag: '🇸🇪', label: 'Svenska', region: 'nordic' },
  da: { flag: '🇩🇰', label: 'Dansk', region: 'nordic' },
  fi: { flag: '🇫🇮', label: 'Suomi', region: 'nordic' },
  pl: { flag: '🇵🇱', label: 'Polski', region: 'europe-east' },
  cs: { flag: '🇨🇿', label: 'Čeština', region: 'europe-east' },
  hu: { flag: '🇭🇺', label: 'Magyar', region: 'europe-east' },
  ro: { flag: '🇷🇴', label: 'Română', region: 'europe-east' },
  hr: { flag: '🇭🇷', label: 'Hrvatski', region: 'europe-east' },
  bg: { flag: '🇧🇬', label: 'Български', region: 'europe-east' },
  sk: { flag: '🇸🇰', label: 'Slovenčina', region: 'europe-east' },
  el: { flag: '🇬🇷', label: 'Ελληνικά', region: 'europe-other' },
  tr: { flag: '🇹🇷', label: 'Türkçe', region: 'europe-other' },
  zh: { flag: '🇨🇳', label: '中文', region: 'asian' },
  ja: { flag: '🇯🇵', label: '日本語', region: 'asian' },
  ko: { flag: '🇰🇷', label: '한국어', region: 'asian' },
} as const;

export type Locale = keyof typeof LOCALE_CONFIG;

export const locales = Object.keys(LOCALE_CONFIG) as Locale[];

export const REGION_LABELS: Record<string, string> = {
  'europe-west': 'Western Europe',
  'nordic': 'Nordic',
  'europe-east': 'Eastern Europe',
  'europe-other': 'Other European',
  'asian': 'Asian',
};

/** OpenGraph locale mapping */
export const OG_LOCALE_MAP: Record<Locale, string> = {
  de: 'de_DE',
  en: 'en_GB',
  fr: 'fr_FR',
  nl: 'nl_NL',
  es: 'es_ES',
  pt: 'pt_PT',
  it: 'it_IT',
  no: 'nb_NO',
  sv: 'sv_SE',
  da: 'da_DK',
  fi: 'fi_FI',
  pl: 'pl_PL',
  cs: 'cs_CZ',
  hu: 'hu_HU',
  ro: 'ro_RO',
  hr: 'hr_HR',
  bg: 'bg_BG',
  sk: 'sk_SK',
  el: 'el_GR',
  tr: 'tr_TR',
  zh: 'zh_CN',
  ja: 'ja_JP',
  ko: 'ko_KR',
};
