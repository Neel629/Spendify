'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card } from '@/components/ui/card'
import { Target, AlertTriangle, Info } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function BudgetPage() {
  const { transactions } = useAppStore()
  const [budget, setBudget] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('monthly_budget').eq('id', user.id).single()
        if (data && data.monthly_budget) {
          setBudget(data.monthly_budget)
        }
      }
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const currentMonthSpent = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    return transactions
      .filter(t => t.type === 'expense')
      .filter(t => {
        const d = new Date(t.date)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear
      })
      .reduce((acc, t) => acc + t.amount, 0)
  }, [transactions])

  const progress = budget > 0 ? (currentMonthSpent / budget) * 100 : 0
  const isOverBudget = budget > 0 && currentMonthSpent > budget
  const isWarning = budget > 0 && progress >= 80 && !isOverBudget

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Budget</h1>
        <p className="text-muted-foreground mt-2">Track your monthly spending limits.</p>
      </div>

      {loading ? (
        <Card className="h-48 bg-card border-border animate-pulse" />
      ) : (
        <Card className="p-8 bg-card border-border hover:border-muted-foreground/30 transition-colors">
          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
                <Target className="h-7 w-7 text-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Monthly Overview</h2>
                <p className="text-muted-foreground font-medium">Your global spending limit</p>
              </div>
            </div>
            {isOverBudget && (
              <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-4 py-2 rounded-full text-sm font-semibold">
                <AlertTriangle className="h-4 w-4" /> Over Budget
              </div>
            )}
            {isWarning && (
              <div className="flex items-center gap-2 text-foreground bg-secondary px-4 py-2 rounded-full text-sm font-semibold">
                <AlertTriangle className="h-4 w-4" /> Nearing Limit
              </div>
            )}
            {!isWarning && !isOverBudget && budget > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full text-sm font-semibold">
                <Info className="h-4 w-4" /> On Track
              </div>
            )}
          </div>

          {budget > 0 ? (
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-6xl font-mono font-medium text-foreground">₹{currentMonthSpent.toFixed(0)}</span>
                  <span className="text-muted-foreground font-medium ml-3 text-lg">spent</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono text-muted-foreground">of ₹{budget.toFixed(0)}</span>
                </div>
              </div>

              {/* Custom Progress Bar */}
              <div className="h-8 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out rounded-full ${isOverBudget ? 'bg-destructive' : 'bg-foreground'}`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              
              <p className="text-muted-foreground font-medium text-lg pt-2">
                {isOverBudget 
                  ? `You've exceeded your budget by ₹${(currentMonthSpent - budget).toFixed(2)}.`
                  : `You have ₹${(budget - currentMonthSpent).toFixed(2)} left to spend this month.`}
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground font-medium">You haven't set a monthly budget yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Update your profile to set a spending limit.</p>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
