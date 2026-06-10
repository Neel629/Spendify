'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAppStore, Split } from '@/store/useAppStore'

interface SplitModalProps {
  split?: Split
  onClose: () => void
}

export function SplitModal({ split, onClose }: SplitModalProps) {
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<'you_owe' | 'owed_to_you'>(split?.type || 'owed_to_you')
  
  const addSplit = useAppStore(state => state.addSplit)
  const updateSplit = useAppStore(state => state.updateSplit)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const payload = {
      friend_name: formData.get('friend_name'),
      remark: formData.get('remark'),
      amount: parseFloat(formData.get('amount') as string),
      type,
      date: formData.get('date'),
      status: split ? split.status : 'pending',
    }

    try {
      if (split) {
        // Edit mode
        const res = await fetch(`/api/splits/${split.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Failed to update split')
        const updated = await res.json()
        updateSplit(split.id, updated)
      } else {
        // Add mode
        const res = await fetch('/api/splits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Failed to create split')
        const newSplit = await res.json()
        addSplit(newSplit)
      }
      onClose()
    } catch (err: any) {
      console.error(err)
      alert("Error saving split: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const defaultDate = split?.date ? new Date(split.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border overflow-hidden animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {split ? 'Edit Split' : 'New Split'}
            </h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground bg-secondary/50 p-2 rounded-full transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex p-1 mb-6 bg-background border border-border rounded-xl">
            <button 
              type="button"
              onClick={() => setType('owed_to_you')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === 'owed_to_you' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              They owe you
            </button>
            <button 
              type="button"
              onClick={() => setType('you_owe')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === 'you_owe' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              You owe them
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-2 block">Amount</Label>
              <div className="flex items-center text-4xl font-light text-foreground border-b border-border/60 pb-2 transition-colors focus-within:border-emerald-500">
                <span className="text-muted-foreground mr-2">₹</span>
                <input 
                  name="amount" 
                  type="number" 
                  step="0.01" 
                  required 
                  defaultValue={split?.amount}
                  placeholder="0.00" 
                  className="bg-transparent w-full focus:outline-none placeholder:text-muted-foreground/30 font-mono" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Friend's Name</Label>
              <input 
                name="friend_name" 
                type="text" 
                required 
                defaultValue={split?.friend_name}
                placeholder="e.g. Alex" 
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-muted-foreground/50" 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Remark / Title</Label>
              <input 
                name="remark" 
                type="text" 
                required 
                defaultValue={split?.remark}
                placeholder="e.g. Dinner at Luigi's" 
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-muted-foreground/50" 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Date</Label>
              <input 
                name="date" 
                type="date" 
                required 
                defaultValue={defaultDate} 
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer" 
                style={{ colorScheme: 'dark' }}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-14 text-base font-semibold rounded-xl mt-8 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all">
              {loading ? 'Saving...' : 'Save Split'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
