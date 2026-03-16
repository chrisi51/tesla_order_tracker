'use client'

import { useTranslations } from 'next-intl'
import { OrderStatistics } from '@/lib/statistics'

interface DeliveryTimelineProps {
  stats: OrderStatistics
}

interface Segment {
  days: number | null
}

export function DeliveryTimeline({ stats }: DeliveryTimelineProps) {
  const t = useTranslations('statistics')
  const tc = useTranslations('common')

  const nodes = [
    { label: t('timelineOrder') },
    { label: t('timelineVin') },
    { label: t('timelineProduction') },
    { label: t('timelinePapers') },
    { label: t('timelineDelivery') },
  ]

  const segments: Segment[] = [
    { days: stats.avgOrderToVin },
    { days: stats.avgVinToProduction },
    { days: stats.avgProductionToPapers },
    { days: stats.avgPapersToDelivery },
  ]

  const formatDays = (days: number | null) =>
    days !== null ? `${days} ${tc('days')}` : '–'

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{t('deliveryPipeline')}</h3>

      {/* Desktop: horizontal */}
      <div className="hidden sm:flex items-center justify-between gap-0">
        {nodes.map((node, i) => (
          <div key={node.label} className="flex items-center flex-1 last:flex-none">
            {/* Node */}
            <div className="flex flex-col items-center gap-1 min-w-0">
              <div className="h-3.5 w-3.5 rounded-full border-2 border-primary bg-primary/20 shrink-0" />
              <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">{node.label}</span>
            </div>
            {/* Segment arrow */}
            {i < segments.length && (
              <div className="flex-1 flex flex-col items-center mx-1 min-w-[60px]">
                <span className="text-xs font-semibold tabular-nums text-foreground">{formatDays(segments[i].days)}</span>
                <div className="w-full flex items-center">
                  <div className="flex-1 h-0.5 bg-primary/30" />
                  <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-primary/50" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical */}
      <div className="sm:hidden space-y-0">
        {nodes.map((node, i) => (
          <div key={node.label}>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full border-2 border-primary bg-primary/20 shrink-0" />
              <span className="text-xs font-medium text-muted-foreground">{node.label}</span>
            </div>
            {i < segments.length && (
              <div className="flex items-center gap-3 ml-[5px] my-1">
                <div className="w-0.5 h-6 bg-primary/30" />
                <span className="text-xs font-semibold tabular-nums">{formatDays(segments[i].days)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
