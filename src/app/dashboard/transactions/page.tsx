'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card } from '@/components/ui/card'

export default function TransactionsPage() {
  const { transactions, isLoading, setTransactions } = useAppStore()

  useEffect(() => {
    const fetchTx = async () => {
      const res = await fetch('/api/transactions')
      const data = await res.json()
      if (Array.isArray(data)) setTransactions(data)
    }
    fetchTx()
  }, [setTransactions])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Transactions</h1>
          <p className="text-muted-foreground mt-2">All your recent income and expenses.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-6 h-24 bg-card border-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map(tx => (
            <Card key={tx.id} className="group p-5 bg-card border-border hover:border-muted-foreground/30 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-xl bg-secondary`}>
                  {tx.category_id ? '💸' : (tx.type === 'income' ? '💰' : '💳')}
                </div>
                <div>
                  <p className="font-semibold text-lg text-foreground leading-none mb-1">{tx.title}</p>
                  <p className="text-sm text-muted-foreground font-medium">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className={`text-xl font-mono font-medium ${tx.type === 'income' ? 'text-foreground' : 'text-foreground'}`}>
                {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
              </div>
            </Card>
          ))}
          
          {transactions.length === 0 && (
            <div className="text-center py-20 bg-secondary/20 rounded-3xl border border-border border-dashed">
              <p className="text-lg text-muted-foreground font-medium">No transactions yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Tap the + button to add your first one.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
