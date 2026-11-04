'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RotateCw } from 'lucide-react'
import { useI18n } from '@/components/i18n-provider'
import { CameraIllustration } from '@/components/illustrations'
import { Button } from '@/components/ui/button'

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useI18n()
  useEffect(() => {
    console.warn('[CalorieSnap] page error', error.digest ?? error.message)
  }, [error])

  return (
    <div className="mx-auto flex max-w-md animate-fade-up flex-col items-center py-16 text-center" role="alert">
      <CameraIllustration className="animate-float" />
      <h1 className="mt-6 text-2xl font-extrabold tracking-tight">{t.errorPage.title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.errorPage.text}</p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>
          <RotateCw /> {t.common.retry}
        </Button>
        <Button asChild variant="outline">
          <Link href="/">{t.common.toDiary}</Link>
        </Button>
      </div>
    </div>
  )
}
