'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAppStore, Transaction } from '@/store/useAppStore'

interface EditTransactionProps {
  transaction: Transaction
  onClose: () => void
}

export function EditTransaction({ transaction, onClose }: EditTransactionProps) {
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<'expense' | 'income'>(transaction.type)
  const updateTransaction = useAppStore(state => state.updateTransaction)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const payload = {
      title: formData.get('title'),
      amount: parseFloat(formData.get('amount') as string),
      type,
      date: formData.get('date'),
    }

    try {
      const res = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || errData.details || 'Failed to update')
      }
      
      const updatedTx = await res.json()
      updateTransaction(transaction.id, updatedTx)
      onClose()
    } catch (err: any) {
      console.error(err)
      alert("Error updating transaction: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Format date correctly for default value
  const txDate = transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : ''

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border overflow-hidden animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Edit Transaction</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground bg-secondary/50 p-2 rounded-full transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex p-1 mb-8 bg-background border border-border rounded-xl">
            <button 
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === 'expense' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Expense
            </button>
            <button 
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === 'income' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Income
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-2 block">Amount</Label>
              <div className="flex items-center text-4xl font-light text-foreground border-b border-border/60 pb-2 transition-colors focus-within:border-emerald-500">
                <span className="text-muted-foreground mr-2">$</span>
                <input 
                  name="amount" 
                  type="number" 
                  step="0.01" 
                  required 
                  defaultValue={transaction.amount}
                  placeholder="0.00" 
                  className="bg-transparent w-full focus:outline-none placeholder:text-muted-foreground/30 font-mono" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Title</Label>
              <input 
                name="title" 
                type="text" 
                required 
                defaultValue={transaction.title}
                placeholder="e.g. Morning Coffee" 
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-muted-foreground/50" 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Date</Label>
              <input 
                name="date" 
                type="date" 
                required 
                defaultValue={txDate} 
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer" 
                style={{ colorScheme: 'dark' }}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-14 text-base font-semibold rounded-xl mt-8 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
