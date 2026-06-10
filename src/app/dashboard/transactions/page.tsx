'use client'

import { useEffect, useState } from 'react'
import { useAppStore, Transaction } from '@/store/useAppStore'
import { Card } from '@/components/ui/card'
import { Edit2, Trash2 } from 'lucide-react'
import { EditTransaction } from '@/components/transactions/edit-transaction'

export default function TransactionsPage() {
  const { transactions, isLoading, setTransactions, deleteTransaction } = useAppStore()
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      deleteTransaction(id)
    } catch (err) {
      console.error(err)
      alert("Error deleting transaction")
    } finally {
      setDeletingId(null)
    }
  }

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
              <div className="flex items-center gap-3 sm:gap-6">
                <div className={`text-lg sm:text-xl font-mono font-medium ${tx.type === 'income' ? 'text-foreground' : 'text-foreground'}`}>
                  {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button onClick={() => setEditingTx(tx)} className="p-2 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 rounded-full transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(tx.id)} disabled={deletingId === tx.id} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors disabled:opacity-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
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
      {editingTx && (
        <EditTransaction transaction={editingTx} onClose={() => setEditingTx(null)} />
      )}
    </div>
  )
}
