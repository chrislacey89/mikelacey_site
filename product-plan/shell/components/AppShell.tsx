import { MainNav } from './MainNav'

export interface NavigationItem {
  label: string
  href: string
  isActive?: boolean
}

export interface AppShellProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  brandName?: string
  onNavigate?: (href: string) => void
}

export function AppShell({
  children,
  navigationItems,
  brandName = 'Mike Lacey',
  onNavigate,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <MainNav
        brandName={brandName}
        items={navigationItems}
        onNavigate={onNavigate}
      />
      <main>{children}</main>
    </div>
  )
}
