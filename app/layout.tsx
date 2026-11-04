import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Manrope } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { I18nProvider } from '@/components/i18n-provider'
import { Toaster } from '@/components/ui/sonner'
import { getI18n } from '@/lib/i18n/server'
import { getPalette } from '@/lib/palette-server'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
})

export function generateMetadata(): Metadata {
  const { t } = getI18n()
  return {
    title: { default: t.meta.title, template: '%s · CalorieSnap' },
    description: t.meta.description,
    applicationName: 'CalorieSnap',
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf7f1' },
    { media: '(prefers-color-scheme: dark)', color: '#0c1310' },
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const { locale } = getI18n()
  const palette = getPalette()

  return (
    <html lang={locale} data-palette={palette} suppressHydrationWarning>
      <body className={`${manrope.variable} min-h-dvh font-sans`}>
        <I18nProvider locale={locale}>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
