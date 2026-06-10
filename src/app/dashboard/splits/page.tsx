'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Users, Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore, Split } from '@/store/useAppStore'
import { SplitModal } from '@/components/splits/split-modal'

export default function SplitsPage() {
  const { splits, isSplitsLoading, setSplits, deleteSplit, updateSplit } = useAppStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSplit, setEditingSplit] = useState<Split | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchSplits = async () => {
      try {
        const res = await fetch('/api/splits')
        const data = await res.json()
        if (Array.isArray(data)) setSplits(data)
      } catch (err) {
        console.error("Failed to load splits", err)
      }
    }
    fetchSplits()
  }, [setSplits])

  const owedToYou = splits
    .filter(s => s.type === 'owed_to_you' && s.status === 'pending')
    .reduce((sum, s) => sum + Number(s.amount), 0)

  const youOwe = splits
    .filter(s => s.type === 'you_owe' && s.status === 'pending')
    .reduce((sum, s) => sum + Number(s.amount), 0)

  const handleEdit = (split: Split) => {
    setEditingSplit(split)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this split?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/splits/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      deleteSplit(id)
    } catch (err) {
      console.error(err)
      alert("Error deleting split")
    } finally {
      setDeletingId(null)
    }
  }

  const handleSettle = async (split: Split) => {
    try {
      const res = await fetch(`/api/splits/${split.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...split, status: 'settled' })
      })
      if (!res.ok) throw new Error('Failed to settle')
      const updated = await res.json()
      updateSplit(split.id, updated)
    } catch (err) {
      console.error(err)
      alert("Error settling split")
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Settlements</h1>
          <p className="text-muted-foreground mt-2">Track who owes you and settle up.</p>
        </div>
        <Button
          onClick={() => {
            setEditingSplit(null)
            setIsModalOpen(true)
          }}
          className="font-semibold gap-2 rounded-xl h-12 px-6"
        >
          <Plus className="h-4 w-4" /> New Split
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 bg-card border-border hover:border-muted-foreground/30 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">You are owed</h2>
            <span className="text-2xl font-mono text-emerald-500 font-medium">₹{owedToYou.toFixed(2)}</span>
          </div>
          <div className="h-px w-full bg-border mb-6" />
          <div className="text-center py-6">
            {owedToYou > 0 ? (
              <p className="text-muted-foreground font-medium">Collect your money soon!</p>
            ) : (
              <>
                <p className="text-muted-foreground font-medium">No one owes you right now.</p>
                <p className="text-sm text-muted-foreground mt-1">Create a settlement when you pay or when they pay.</p>
              </>
            )}
          </div>
        </Card>

        <Card className="p-8 bg-card border-border hover:border-muted-foreground/30 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">You owe</h2>
            <span className="text-2xl font-mono text-destructive font-medium">₹{youOwe.toFixed(2)}</span>
          </div>
          <div className="h-px w-full bg-border mb-6" />
          <div className="text-center py-6">
            {youOwe > 0 ? (
              <p className="text-muted-foreground font-medium">Make sure to pay your friends back.</p>
            ) : (
              <>
                <p className="text-muted-foreground font-medium">You're all settled up!</p>
                <p className="text-sm text-muted-foreground mt-1">No pending IOUs to pay back.</p>
              </>
            )}
          </div>
        </Card>
      </div>

      <h2 className="text-2xl font-bold text-foreground pt-4">Recent Splits</h2>

      {isSplitsLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <Card key={i} className="p-6 h-24 bg-card border-border animate-pulse" />
          ))}
        </div>
      ) : splits.length > 0 ? (
        <div className="space-y-4">
          {splits.map(split => (
            <Card key={split.id} className={`group p-5 bg-card border-border hover:border-muted-foreground/30 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${split.status === 'settled' ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-xl ${split.type === 'owed_to_you' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-lg text-foreground leading-none mb-1">
                    {split.friend_name} <span className="text-muted-foreground font-normal text-base ml-1">· {split.remark}</span>
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    {new Date(split.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {split.status === 'settled' && <span className="ml-2 text-emerald-500">✓ Settled</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-3 sm:gap-6">
                <div className={`text-lg sm:text-xl font-mono font-medium ${split.type === 'owed_to_you' ? 'text-emerald-500' : 'text-destructive'}`}>
                  {split.type === 'owed_to_you' ? '+' : '-'}₹{Number(split.amount).toFixed(2)}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  {split.status === 'pending' && (
                    <button onClick={() => handleSettle(split)} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-full transition-colors flex items-center gap-1 text-sm font-medium mr-2">
                      <CheckCircle2 className="h-4 w-4" /> <span className="hidden sm:inline">Settle</span>
                    </button>
                  )}
                  <button onClick={() => handleEdit(split)} className="p-2 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 rounded-full transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(split.id)} disabled={deletingId === split.id} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors disabled:opacity-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 bg-secondary/20 border-border border-dashed text-center flex flex-col items-center justify-center rounded-3xl">
          <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-6">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">No splits yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Split dinners, trips, or rent with friends. Everyone's share is tracked right here.
          </p>
        </Card>
      )}

      {isModalOpen && (
        <SplitModal
          split={editingSplit || undefined}
          onClose={() => {
            setIsModalOpen(false)
            setEditingSplit(null)
          }}
        />
      )}
    </div>
  )
}
