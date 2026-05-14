'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Mail, Lock, User, MapPin, Zap, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ROLE_LABELS } from '@/lib/utils'
import type { UserRole } from '@/types'

const roles = Object.entries(ROLE_LABELS) as [UserRole, string][]

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<UserRole>('photographer')
  const [step, setStep] = useState<1 | 2>(1)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (step === 1) { setStep(2); return }
    setLoading(true)
    setError('')
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setError('Coming soon — Supabase auth will be connected here.')
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center">
              <Zap size={20} className="text-dark" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold">
              <span className="text-gradient-gold">Dot</span>
              <span className="text-text">shot</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-text-muted text-sm">Join thousands of creatives on Dotshot</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                  step >= s
                    ? 'bg-gold border-gold text-dark'
                    : 'border-border text-text-faint'
                }`}
              >
                {s}
              </div>
              <div
                className={`flex-1 h-0.5 rounded-full transition-colors ${
                  s === 1 ? (step > 1 ? 'bg-gold' : 'bg-border') : 'hidden'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {step === 1 ? (
              <>
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Your full name"
                  icon={<User size={16} />}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail size={16} />}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Min. 8 characters"
                  icon={<Lock size={16} />}
                  required
                  minLength={8}
                />
                <Button type="submit" className="w-full mt-1">Continue</Button>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-muted">I am a...</label>
                  <div className="relative">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text appearance-none focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
                    >
                      {roles.map(([value, label]) => (
                        <option key={value} value={value} className="bg-surface">
                          {label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint pointer-events-none" />
                  </div>
                </div>

                <Input
                  label="City / Location"
                  type="text"
                  placeholder="Orlando, FL"
                  icon={<MapPin size={16} />}
                  required
                />

                <Input
                  label="Username"
                  type="text"
                  placeholder="@yourhandle"
                  icon={<span className="text-text-faint font-bold">@</span>}
                  required
                />

                {error && (
                  <p className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <p className="text-xs text-text-faint leading-relaxed">
                  By joining, you agree to our{' '}
                  <Link href="/terms" className="text-gold hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-gold hover:underline">Privacy Policy</Link>.
                </p>

                <Button type="submit" loading={loading} className="w-full">
                  Create Account
                </Button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-text-muted hover:text-text text-center transition-colors"
                >
                  ← Back
                </button>
              </>
            )}
          </form>
        </div>

        <p className="text-center text-sm text-text-muted mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-gold hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
