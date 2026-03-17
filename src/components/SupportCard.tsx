'use client'

import { useTranslations } from 'next-intl'
import { Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SupportCardProps {
  donationUrl: string
  paypalUrl?: string
}

export function SupportCard({ donationUrl, paypalUrl }: SupportCardProps) {
  const t = useTranslations('support')

  return (
    <Card className="border-dashed">
      <CardContent className="p-5 flex items-start gap-4">
        <div className="rounded-full bg-pink-50 dark:bg-pink-900/20 p-2.5 shrink-0">
          <Heart className="h-5 w-5 text-pink-500" />
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-sm text-muted-foreground">{t('communityMessage')}</p>
          <div className="flex flex-wrap gap-2">
            <a href={donationUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5">
                {'\u2615'} Buy Me a Coffee
              </Button>
            </a>
            {paypalUrl && (
              <a href={paypalUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.644h6.568c2.175 0 3.906.544 4.996 1.588.322.31.566.66.735 1.04.18.407.263.854.248 1.335-.016.054-.016.108-.032.162a5.58 5.58 0 0 1-.15.823 4.81 4.81 0 0 1-.39 1.014c-.51.97-1.375 1.67-2.585 2.1-.576.205-1.228.35-1.944.433-.283.033-.576.05-.878.05H9.94a.77.77 0 0 0-.758.645l-.924 5.86a.641.641 0 0 1-.633.54H7.07l.006.001z"/><path d="M18.27 7.468c-.01.058-.02.115-.035.173-.636 3.267-2.81 4.394-5.588 4.394h-1.413a.687.687 0 0 0-.679.581l-.723 4.578-.205 1.3a.361.361 0 0 0 .357.417h2.504a.676.676 0 0 0 .668-.57l.027-.144.53-3.355.034-.184a.676.676 0 0 1 .668-.571h.42c2.722 0 4.853-1.105 5.476-4.303.26-1.336.125-2.45-.562-3.234a2.68 2.68 0 0 0-.77-.56l-.107-.05-.002.028z"/></svg>
                  PayPal
                </Button>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
