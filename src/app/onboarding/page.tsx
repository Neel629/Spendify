'use client'

import { useState } from 'react'
import { completeOnboarding } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function OnboardingPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await completeOnboarding(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-background">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <img src="/logo.jpg" alt="Spendify" className="h-16 w-16 rounded-2xl shadow-sm mb-6" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Welcome to Spendify
          </h1>
          <p className="text-muted-foreground text-base">
            Let&apos;s set up your profile so you can start tracking your finances.
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-7">
            {error && (
              <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Your Name
              </Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="e.g. Neel Prajapati"
                required
                className="h-12 bg-background border border-border rounded-xl px-4 focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all text-base"
              />
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Primary Currency
              </Label>
              <Select name="currency" defaultValue="INR">
                <SelectTrigger className="h-12 bg-background border border-border rounded-xl px-4 focus:ring-1 focus:ring-emerald-500 text-base">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border">
                  <SelectItem value="INR">₹ INR – Indian Rupee</SelectItem>
                  <SelectItem value="USD">$ USD – US Dollar</SelectItem>
                  <SelectItem value="EUR">€ EUR – Euro</SelectItem>
                  <SelectItem value="GBP">£ GBP – British Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Monthly Budget */}
            <div className="space-y-2">
              <Label htmlFor="monthly_budget" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Target Monthly Budget
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-base">₹</span>
                <Input
                  id="monthly_budget"
                  name="monthly_budget"
                  type="number"
                  placeholder="10,000"
                  min="0"
                  step="1"
                  required
                  className="h-12 bg-background border border-border rounded-xl pl-9 pr-4 focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all text-base"
                />
              </div>
              <p className="text-xs text-muted-foreground">You can always change this later in Settings.</p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-[0_0_20px_rgba(16,185,129,0.25)]"
              disabled={loading}
            >
              {loading ? 'Setting up...' : 'Get Started →'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Your data is encrypted and securely stored.
        </p>
      </div>
    </div>
  )
}
