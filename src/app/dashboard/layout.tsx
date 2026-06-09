import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { QuickAdd } from '@/components/transactions/quick-add'
import { LayoutDashboard, ReceiptText, Target, Users, LogOut, Gift, Flame } from 'lucide-react'
import { SidebarNav } from '@/components/dashboard/sidebar-nav'

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
          <div className="text-emerald-500">🌱</div>
          <div className="font-bold text-xl tracking-tight text-foreground">Spendify</div>
        </div>
        <SidebarNav userEmail={user.email} userName={profile?.full_name || user?.user_metadata?.full_name} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 pb-24 md:pb-12 max-w-7xl mx-auto w-full">
        {children}
      </main>
      
      {/* Global Quick Add button */}
      <QuickAdd />
    </div>
  )
}
