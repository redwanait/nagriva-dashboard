import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app">
      <Sidebar />
      <div className="app-body">
        <Header />
        <main className="app-content">{children}</main>
      </div>
      <BottomNav />
    </div>
  )
}
