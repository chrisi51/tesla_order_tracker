import { defineRouting } from 'next-intl/routing';
import { locales } from './locales';

export const routing = defineRouting({
  locales,
  defaultLocale: 'de',
  localePrefix: 'as-needed'
});
