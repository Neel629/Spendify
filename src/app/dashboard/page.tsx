'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card } from '@/components/ui/card'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, CalendarDays } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const CATEGORY_COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#14B8A6']

export default function DashboardHome() {
  const { transactions, isLoading, setTransactions } = useAppStore()
  const [userName, setUserName] = useState('User')
  const [budgets, setBudgets] = useState<any[]>([])
  const [currency, setCurrency] = useState('₹')

  useEffect(() => {
    const fetchAll = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name, currency').eq('id', user.id).single()
        
        if (!profile) {
          await supabase.from('profiles').insert({ id: user.id, full_name: user.user_metadata?.full_name || 'User' })
          await supabase.from('categories').insert([
            { user_id: user.id, name: 'Food & Drinks', emoji: '🍔', type: 'expense', is_default: true },
            { user_id: user.id, name: 'Transport',     emoji: '🚌', type: 'expense', is_default: true },
            { user_id: user.id, name: 'Shopping',      emoji: '🛍', type: 'expense', is_default: true },
            { user_id: user.id, name: 'Other',         emoji: '💸', type: 'expense', is_default: true },
            { user_id: user.id, name: 'Salary',        emoji: '💰', type: 'income',  is_default: true },
            { user_id: user.id, name: 'Freelance',     emoji: '💻', type: 'income',  is_default: true },
          ])
          setUserName(user.user_metadata?.full_name || 'User')
        } else {
          setUserName(profile.full_name || user.user_metadata?.full_name || 'User')
          const cMap: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' }
          setCurrency(cMap[profile.currency] || '₹')
        }
      }

      // Fetch Budgets
      try {
        const bRes = await fetch('/api/budgets')
        const bData = await bRes.json()
        if (Array.isArray(bData)) setBudgets(bData)
      } catch {}

      // Fetch Transactions
      try {
        const res = await fetch('/api/transactions')
        const data = await res.json()
        if (Array.isArray(data)) {
          setTransactions(data)
        } else {
          setTransactions([])
        }
      } catch {
        setTransactions([])
      }
    }
    fetchAll()
  }, [setTransactions])

  // =============================================
  // ALL COMPUTED DATA — 100% from real transactions
  // =============================================

  const totalIncome = useMemo(() => transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0), [transactions])
  const totalExpense = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0), [transactions])
  const totalSavings = useMemo(() => Math.max(0, totalIncome - totalExpense), [totalIncome, totalExpense])
  const txCount = transactions.length

  // Greeting based on time
  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])

  // Current month name
  const currentMonth = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }, [])

  // Cash Flow Line Chart Data (grouped by date)
  const lineChartData = useMemo(() => {
    const dataMap: Record<string, { income: number, expense: number }> = {}
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    sorted.forEach(tx => {
      const date = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (!dataMap[date]) dataMap[date] = { income: 0, expense: 0 }
      if (tx.type === 'income') dataMap[date].income += Number(tx.amount)
      else dataMap[date].expense += Number(tx.amount)
    })
    
    return Object.keys(dataMap).slice(-7).map(date => ({
      date,
      Income: dataMap[date].income,
      Expenses: dataMap[date].expense,
      Savings: Math.max(0, dataMap[date].income - dataMap[date].expense)
    }))
  }, [transactions])

  // Spending by Category (Donut Chart) — built from REAL transaction data
  const donutData = useMemo(() => {
    const catMap: Record<string, { name: string, emoji: string, value: number }> = {}
    
    transactions.filter(t => t.type === 'expense').forEach(tx => {
      const catName = (tx as any).categories?.name || 'Other'
      const catEmoji = (tx as any).categories?.emoji || '💸'
      if (!catMap[catName]) catMap[catName] = { name: catName, emoji: catEmoji, value: 0 }
      catMap[catName].value += Number(tx.amount)
    })
    
    return Object.values(catMap)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
      .map((item, i) => ({ ...item, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }))
  }, [transactions])

  const totalDonut = donutData.reduce((s, d) => s + d.value, 0)

  // Format currency
  const fmt = (n: number) => `${currency}${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {greeting}, {userName}! <span className="text-2xl">👋</span>
          </h1>
          <p className="text-muted-foreground mt-1">Here&apos;s your financial overview.</p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-lg text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          {currentMonth}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Card key={i} className="h-32 bg-card border-border animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* Top Metrics — 100% real data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-card border-border flex flex-col justify-between">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                <ArrowUpRight className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-muted-foreground font-medium text-sm mb-1">Total Income</p>
              <h2 className="text-2xl font-bold text-emerald-500">{fmt(totalIncome)}</h2>
              <p className="text-xs text-muted-foreground mt-1">{transactions.filter(t => t.type === 'income').length} transactions</p>
            </Card>

            <Card className="p-6 bg-card border-border flex flex-col justify-between">
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <ArrowDownRight className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-muted-foreground font-medium text-sm mb-1">Total Expenses</p>
              <h2 className="text-2xl font-bold text-red-500">{fmt(totalExpense)}</h2>
              <p className="text-xs text-muted-foreground mt-1">{transactions.filter(t => t.type === 'expense').length} transactions</p>
            </Card>

            <Card className="p-6 bg-card border-border flex flex-col justify-between">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <Wallet className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-muted-foreground font-medium text-sm mb-1">Net Savings</p>
              <h2 className="text-2xl font-bold text-blue-500">{fmt(totalSavings)}</h2>
              <p className="text-xs text-muted-foreground mt-1">{totalIncome > 0 ? `${((totalSavings / totalIncome) * 100).toFixed(1)}% savings rate` : 'Add income to track'}</p>
            </Card>

            <Card className="p-6 bg-card border-border flex flex-col justify-between">
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-muted-foreground font-medium text-sm mb-1">Transactions</p>
              <h2 className="text-2xl font-bold text-purple-500">{txCount}</h2>
              <p className="text-xs text-muted-foreground mt-1">Total recorded</p>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Cash Flow */}
            <Card className="p-6 bg-card border-border col-span-1 lg:col-span-3 min-h-[400px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-foreground">Cash Flow Overview</h2>
                <div className="text-xs text-muted-foreground bg-background px-3 py-1 rounded-md border border-border">{currentMonth}</div>
              </div>
              
              <div className="flex items-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-1 bg-emerald-500 rounded-full"></div> Income</div>
                <div className="flex items-center gap-2"><div className="w-3 h-1 bg-red-500 rounded-full"></div> Expenses</div>
                <div className="flex items-center gap-2"><div className="w-3 h-1 bg-blue-500 rounded-full"></div> Savings</div>
              </div>

              <div className="flex-1 min-h-[250px]">
                {lineChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartData}>
                      <XAxis dataKey="date" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${currency}${v}`} />
                      <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px' }} itemStyle={{ color: '#F8FAFC' }} formatter={(v: number) => fmt(v)} />
                      <Line type="monotone" dataKey="Income" stroke="#10B981" strokeWidth={3} dot={{r:4, fill:'#10B981', strokeWidth:2, stroke:'#1E293B'}} />
                      <Line type="monotone" dataKey="Expenses" stroke="#EF4444" strokeWidth={3} dot={{r:4, fill:'#EF4444', strokeWidth:2, stroke:'#1E293B'}} />
                      <Line type="monotone" dataKey="Savings" stroke="#3B82F6" strokeWidth={3} dot={{r:4, fill:'#3B82F6', strokeWidth:2, stroke:'#1E293B'}} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                    Add transactions to see your cash flow chart.
                  </div>
                )}
              </div>
            </Card>

            {/* Spending by Category — REAL data */}
            <Card className="p-6 bg-card border-border col-span-1 lg:col-span-2 min-h-[400px] flex flex-col">
              <h2 className="text-lg font-bold text-foreground mb-6">Spending by Category</h2>
              {donutData.length > 0 ? (
                <>
                  <div className="flex-1 flex items-center justify-center mb-6">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={donutData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                          {donutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px' }} formatter={(v: number) => fmt(v)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {donutData.map(item => (
                      <div key={item.name} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span>{item.emoji}</span>
                          {item.name}
                        </div>
                        <div className="flex gap-4">
                          <span className="text-foreground font-medium">{fmt(item.value)}</span>
                          <span className="text-muted-foreground w-12 text-right">{totalDonut > 0 ? (item.value / totalDonut * 100).toFixed(1) : 0}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                  Add expense transactions to see category breakdown.
                </div>
              )}
            </Card>
          </div>

          {/* Monthly Budgets */}
          <Card className="p-6 bg-card border-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-foreground">Monthly Budgets</h2>
            </div>
            
            {budgets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {budgets.map((budget: any) => {
                  const percent = Math.min(100, Math.round((budget.spent / budget.amount) * 100))
                  const isOver = budget.spent > budget.amount
                  return (
                    <div key={budget.id} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${budget.categories?.color || '#3B82F6'}1a` }}>
                          {budget.categories?.emoji || '🎯'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{budget.categories?.name || 'Category'}</h3>
                          <p className="text-sm text-muted-foreground">{fmt(budget.spent)} of {fmt(budget.amount)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${isOver ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${percent}%` }}></div>
                        </div>
                        <span className={`text-xs font-bold ${isOver ? 'text-red-500' : 'text-muted-foreground'}`}>{percent}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-8 text-center border border-dashed border-border rounded-xl">
                <p className="text-muted-foreground">No budgets set for this month.</p>
              </div>
            )}
          </Card>

          {/* Recent Transactions — REAL data */}
          <Card className="p-6 bg-card border-border overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-foreground">Recent Transactions</h2>
              <span className="text-sm text-muted-foreground">{transactions.length} total</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Description</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 8).map((tx, i) => (
                    <tr key={tx.id || i} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-sm">
                            {(tx as any).categories?.emoji || (tx.type === 'income' ? '💰' : '💸')}
                          </div>
                          <span className="font-medium text-foreground">{tx.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${tx.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                          <span className="text-muted-foreground">{(tx as any).categories?.name || (tx.type === 'income' ? 'Income' : 'Expense')}</span>
                        </div>
                      </td>
                      <td className={`px-4 py-4 text-right font-semibold ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {tx.type === 'income' ? '+' : '-'}{fmt(Number(tx.amount))}
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                        No transactions yet. Click the + button to add your first one!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
