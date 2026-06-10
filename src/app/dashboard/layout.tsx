import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { QuickAdd } from '@/components/transactions/quick-add'
import { LayoutDashboard, ReceiptText, Target, Users, LogOut, Gift, Flame } from 'lucide-react'
import { SidebarNav } from '@/components/dashboard/sidebar-nav'
import { MobileNav } from '@/components/dashboard/mobile-nav'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed, full_name')
    .eq('id', user.id)
    .single()

  if (profile && !profile.onboarding_completed) {
    redirect('/onboarding')
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background selection:bg-secondary">
      {/* Sidebar */}
      <aside className="w-full md:w-[260px] border-r border-border bg-background hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <img src="/logo.jpg" alt="Spendify" className="h-9 w-9 rounded-lg" />
          <div className="font-bold text-xl tracking-tight text-foreground">Spendify</div>
        </div>
        <SidebarNav userEmail={user.email} userName={profile?.full_name || user?.user_metadata?.full_name} />
      </aside>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 md:p-12 pb-24 md:pb-12 max-w-7xl mx-auto w-full">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="border-t border-border py-4 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <img src="/logo.jpg" alt="Spendify" className="h-5 w-5 rounded" />
              <span className="text-xs text-muted-foreground font-medium">Spendify</span>
            </div>
            <p className="text-xs text-muted-foreground">Made by <span className="text-foreground font-semibold">Neel Prajapati</span></p>
          </div>
        </footer>
      </div>
      
      {/* Global Quick Add button */}
      <QuickAdd />
    </div>
  )
}
