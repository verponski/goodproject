import type { ReactNode } from 'react'
import { AppHeader } from '@/components/app-header'
import { TabBar } from '@/components/tab-bar'
import { ClientSync } from '@/components/client-sync'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl px-4 pb-36 pt-5 sm:px-6 md:pb-16 md:pt-8">{children}</main>
      <TabBar />
      <ClientSync />
    </div>
  )
}
