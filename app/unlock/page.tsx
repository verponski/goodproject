import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { LockKeyhole } from 'lucide-react'
import { LogoMark } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { accessRequired, hasAccess } from '@/lib/access'
import { unlock } from '@/lib/actions/access'
import { firstParam, safeNextPath } from '@/lib/utils'
import { getT } from '@/lib/i18n/server'
import { LanguagePicker } from '@/components/settings/language-picker'

export function generateMetadata(): Metadata {
  return { title: getT().meta.pages.unlock }
}

export default function UnlockPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const next = safeNextPath(firstParam(searchParams.next))
  if (!accessRequired() || hasAccess()) redirect(next)
  const error = firstParam(searchParams.error) === '1'
  const t = getT()

  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-12">
      <form action={unlock} className="w-full max-w-sm animate-scale-in space-y-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <LogoMark className="h-16 w-16" />
          <div className="space-y-1.5">
            <h1 className="text-2xl font-extrabold tracking-tight">{t.unlock.title}</h1>
            <p className="text-[15px] text-muted-foreground">{t.unlock.text}</p>
          </div>
        </div>

        <input type="hidden" name="next" value={next} />
        <div className="space-y-2">
          <Label htmlFor="password">{t.unlock.password}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
            aria-invalid={error || undefined}
            aria-describedby={error ? 'password-error' : undefined}
          />
          {error && (
            <p id="password-error" role="alert" className="text-sm font-medium text-destructive">
              {t.unlock.wrong}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full">
          <LockKeyhole aria-hidden />
          {t.unlock.submit}
        </Button>
        <LanguagePicker className="pt-2" />
      </form>
    </main>
  )
}
