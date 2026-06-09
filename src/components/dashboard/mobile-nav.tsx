'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, ReceiptText, Target, Users, LogOut } from 'lucide-react'

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/dashboard/transactions', icon: ReceiptText },
  { name: 'Budgets', href: '/dashboard/budget', icon: Target },
  { name: 'Goals', href: '/dashboard/savings', icon: Target },
  { name: 'Investments', href: '/dashboard/subscriptions', icon: ReceiptText },
  { name: 'Reports', href: '/dashboard/splits', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: LayoutDashboard },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-background border-b border-border sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsOpen(true)}
            className="p-2 -ml-2 rounded-lg text-foreground hover:bg-secondary/50 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="text-emerald-500 text-lg">🌱</div>
            <div className="font-bold text-lg tracking-tight text-foreground">Spendify</div>
          </div>
        </div>
      </div>

      {/* Fullscreen Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-left-full duration-300">
          <div className="p-4 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <div className="text-emerald-500 text-lg">🌱</div>
              <div className="font-bold text-lg tracking-tight text-foreground">Menu</div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 rounded-lg text-muted-foreground hover:bg-secondary/50 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2 mt-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'text-foreground hover:bg-secondary/50 border border-transparent'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {link.name}
                </Link>
              )
            })}
          </nav>
          
          <div className="p-6 border-t border-border">
            <form action="/auth/logout" method="POST">
              <button className="flex w-full items-center justify-center gap-3 px-4 py-4 rounded-xl bg-destructive/10 text-destructive font-bold transition-colors">
                <LogOut className="h-5 w-5" />
                Log out
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
