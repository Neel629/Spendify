'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side: Form */}
      <div className="flex w-full flex-col justify-center px-8 sm:px-12 md:w-1/2 lg:px-24 xl:px-32">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <img src="/logo.jpg" alt="Spendify" className="h-8 w-8 rounded-lg" />
              <span className="text-2xl font-black tracking-tighter text-foreground">Spendify</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="mt-2 text-base text-muted-foreground">Please enter your details to sign in.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required className="h-12 bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-base" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Password</Label>
              <Input id="password" name="password" type="password" required className="h-12 bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-base" />
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl mt-8" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground pt-4">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-foreground hover:underline underline-offset-4 transition-all">
                Sign up for free
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side: Editorial/Testimonial */}
      <div className="hidden md:flex md:w-1/2 bg-[#FAFAFA] border-l border-border items-center justify-center p-12">
        <div className="max-w-lg">
          <div className="inline-block p-4 bg-white rounded-2xl shadow-sm border border-slate-200 mb-8">
            <img src="/logo.jpg" alt="Spendify" className="h-12 w-12 rounded-lg" />
          </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight mb-4">
            &quot;Finally, an expense tracker that doesn&apos;t feel like a spreadsheet.&quot;
          </h2>
          <p className="text-slate-600 text-lg">
            Join thousands of users managing their money with clarity and zero clutter.
          </p>
        </div>
      </div>
    </div>
  )
}
