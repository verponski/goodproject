import type { ReactNode } from 'react'

/** Плавное появление страницы при переходах между вкладками. */
export default function AppTemplate({ children }: { children: ReactNode }) {
  return <div className="animate-page-in">{children}</div>
}
