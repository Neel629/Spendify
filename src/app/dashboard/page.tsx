'use client'

import { useEffect, useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card } from '@/components/ui/card'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Shield, Laptop, Plane, CalendarDays } from 'lucide-react'

export default function DashboardHome() {
  const { transactions, isLoading, setTransactions } = useAppStore()

  useEffect(() => {
    const fetchTx = async () => {
      const res = await fetch('/api/transactions')
      const data = await res.json()
      if (Array.isArray(data)) setTransactions(data)
    }
    fetchTx()
  }, [setTransactions])

  // Process data for Line chart (Cash Flow)
  const lineChartData = useMemo(() => {
    const dataMap: Record<string, { income: number, expense: number, savings: number }> = {}
    const recentTx = [...transactions].reverse().slice(0, 50)

    recentTx.forEach(tx => {
      const date = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (!dataMap[date]) dataMap[date] = { income: 0, expense: 0, savings: 0 }
      if (tx.type === 'income') dataMap[date].income += tx.amount
      else dataMap[date].expense += tx.amount
      dataMap[date].savings = dataMap[date].income - dataMap[date].expense
    })
    
    return Object.keys(dataMap).slice(0, 7).map(date => ({
      date,
      Income: dataMap[date].income,
      Expenses: dataMap[date].expense,
      Savings: Math.max(0, dataMap[date].savings)
    }))
  }, [transactions])

  // Mock Donut Chart Data
  const donutData = [
    { name: 'Housing', value: 980, color: '#EF4444' },
    { name: 'Food & Dining', value: 520, color: '#F59E0B' },
    { name: 'Transportation', value: 320, color: '#10B981' },
    { name: 'Utilities', value: 210, color: '#3B82F6' },
    { name: 'Entertainment', value: 150, color: '#8B5CF6' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Good evening, Neel! <span className="text-2xl">👋</span>
          </h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your finances today.</p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-lg text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          May 20 – May 26, 2024
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Card key={i} className="h-32 bg-card border-border animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-card border-border flex flex-col justify-between">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                <ArrowUpRight className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-muted-foreground font-medium mb-1">Income</p>
              <h2 className="text-3xl font-bold text-emerald-500 mb-2">$6,540.00</h2>
              <p className="text-xs text-muted-foreground"><span className="text-emerald-500">↑ 8.2%</span> from last month</p>
            </Card>

            <Card className="p-6 bg-card border-border flex flex-col justify-between">
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <ArrowDownRight className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-muted-foreground font-medium mb-1">Expenses</p>
              <h2 className="text-3xl font-bold text-red-500 mb-2">$2,340.00</h2>
              <p className="text-xs text-muted-foreground"><span className="text-red-500">↑ 3.1%</span> from last month</p>
            </Card>

            <Card className="p-6 bg-card border-border flex flex-col justify-between">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <Wallet className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-muted-foreground font-medium mb-1">Savings</p>
              <h2 className="text-3xl font-bold text-blue-500 mb-2">$3,200.00</h2>
              <p className="text-xs text-muted-foreground"><span className="text-blue-500">↑ 12.4%</span> from last month</p>
            </Card>

            <Card className="p-6 bg-card border-border flex flex-col justify-between">
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-muted-foreground font-medium mb-1">Investments</p>
              <h2 className="text-3xl font-bold text-purple-500 mb-2">$8,750.00</h2>
              <p className="text-xs text-muted-foreground"><span className="text-purple-500">↑ 15.7%</span> from last month</p>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="p-6 bg-card border-border col-span-1 lg:col-span-3 min-h-[400px] flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-bold text-foreground">Cash Flow Overview</h2>
                <div className="text-xs text-muted-foreground bg-background px-3 py-1 rounded-md border border-border">This Month</div>
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
                      <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                      <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px' }} itemStyle={{ color: '#F8FAFC' }} />
                      <Line type="monotone" dataKey="Income" stroke="#10B981" strokeWidth={3} dot={{r:4, fill:'#10B981', strokeWidth:2, stroke:'#1E293B'}} />
                      <Line type="monotone" dataKey="Expenses" stroke="#EF4444" strokeWidth={3} dot={{r:4, fill:'#EF4444', strokeWidth:2, stroke:'#1E293B'}} />
                      <Line type="monotone" dataKey="Savings" stroke="#3B82F6" strokeWidth={3} dot={{r:4, fill:'#3B82F6', strokeWidth:2, stroke:'#1E293B'}} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-xl">Add transactions to see cash flow.</div>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-card border-border col-span-1 lg:col-span-2 min-h-[400px] flex flex-col">
              <h2 className="text-lg font-bold text-foreground mb-6">Spending by Category</h2>
              <div className="flex-1 flex items-center justify-center mb-6">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={donutData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {donutData.map(item => (
                  <div key={item.name} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      {item.name}
                    </div>
                    <div className="flex gap-4">
                      <span className="text-foreground">${item.value}</span>
                      <span className="text-muted-foreground w-8 text-right">{(item.value / 2180 * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Savings Goals */}
          <Card className="p-6 bg-card border-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-foreground">Savings Goals</h2>
              <button className="text-sm text-emerald-500 font-medium">View All Goals</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Emergency Fund</h3>
                    <p className="text-sm text-muted-foreground">$1,200 of $2,000</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[60%] rounded-full"></div>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">60%</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Laptop className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">New Laptop</h3>
                    <p className="text-sm text-muted-foreground">$850 of $1,500</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[43%] rounded-full"></div>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">43%</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Plane className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Vacation</h3>
                    <p className="text-sm text-muted-foreground">$1,350 of $3,000</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[45%] rounded-full"></div>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">45%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Transactions Table */}
          <Card className="p-6 bg-card border-border overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-foreground">Recent Transactions</h2>
              <button className="text-sm text-emerald-500 font-medium">View All Transactions</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Description</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold text-right">Amount</th>
                    <th className="px-4 py-3 font-semibold text-right">Account</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 6).map((tx, i) => (
                    <tr key={tx.id || i} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-4 text-muted-foreground">
                        {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-xs">
                            {tx.type === 'income' ? '💼' : '🛒'}
                          </div>
                          <span className="font-medium text-foreground">{tx.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${tx.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                          <span className="text-muted-foreground">{tx.type === 'income' ? 'Income' : 'Expense'}</span>
                        </div>
                      </td>
                      <td className={`px-4 py-4 text-right font-medium ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-right text-muted-foreground">
                        Checking Account
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No recent transactions.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-emerald-600 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                View All Transactions
              </button>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
