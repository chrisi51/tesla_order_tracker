import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tff-order-stats.de'
  const now = new Date()

  const pages = [
    { path: '', changeFrequency: 'daily' as const, priority: 1 },
    { path: '/docs', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/impressum', changeFrequency: 'yearly' as const, priority: 0.3 },
  ]

  return routing.locales.flatMap(locale =>
    pages.map(({ path, changeFrequency, priority }) => ({
      url: `${baseUrl}${locale === 'de' ? '' : `/${locale}`}${path}`,
      lastModified: now,
      changeFrequency,
      priority: locale === 'de' ? priority : priority * 0.9,
    }))
  )
}
