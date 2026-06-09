'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ReceiptText, Target, Users, LogOut } from 'lucide-react'

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/dashboard/transactions', icon: ReceiptText },
  { name: 'Budgets', href: '/dashboard/budget', icon: Target },
  { name: 'Goals', href: '/dashboard/savings', icon: Target },
  { name: 'Investments', href: '/dashboard/subscriptions', icon: ReceiptText },
  { name: 'Reports', href: '/dashboard/splits', icon: Users },
]

export function SidebarNav({ userEmail, userName }: { userEmail?: string; userName?: string }) {
  const pathname = usePathname()
  
  const displayName = userName || 'User'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <>
      <nav className="flex-1 px-4 space-y-1 mt-6">
        {navLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-secondary/50 text-emerald-500 border-l-2 border-emerald-500'
                  : 'hover:bg-secondary/30 text-muted-foreground border-l-2 border-transparent'
              }`}
            >
              <Icon className="h-5 w-5" />
              {link.name}
            </Link>
          )
        })}
        
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors mt-4 ${
            pathname === '/dashboard/settings'
              ? 'bg-secondary/50 text-emerald-500 border-l-2 border-emerald-500'
              : 'hover:bg-secondary/30 text-muted-foreground border-l-2 border-transparent'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          Settings
        </Link>
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">{initial}</div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail || 'No email provided'}</p>
          </div>
        </div>
        <form action="/auth/logout" method="POST" className="mt-2">
          <button className="flex w-full items-center gap-4 px-4 py-2 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground font-medium transition-colors text-sm">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </form>
      </div>
    </>
  )
}
