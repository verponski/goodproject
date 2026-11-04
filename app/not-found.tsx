import Link from 'next/link'
import { getT } from '@/lib/i18n/server'
import { SearchIllustration } from '@/components/illustrations'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const t = getT()
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <SearchIllustration className="animate-float" />
      <h1 className="mt-6 text-2xl font-extrabold tracking-tight">{t.errorPage.notFoundTitle}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t.errorPage.notFoundText}</p>
      <Button asChild className="mt-6">
        <Link href="/">{t.common.toDiary}</Link>
      </Button>
    </main>
  )
}
