'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, MapPin, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DotshotLogo } from '@/components/ui/DotshotLogo'
import { ROLE_LABELS } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { UserRole } from '@/types'

const roles = Object.entries(ROLE_LABELS) as [UserRole, string][]

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<UserRole>('photographer')
  const [step, setStep] = useState<1 | 2>(1)
  const [error, setError] = useState('')

  // Step 1 fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Step 2 fields
  const [location, setLocation] = useState('')
  const [username, setUsername] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (step === 1) { setStep(2); return }

    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: username.replace('@', ''),
          role,
          location,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Success — redirect to dashboard
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <DotshotLogo size="md" href="/" />
          </div>
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
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail size={16} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Min. 8 characters"
                  icon={<Lock size={16} />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />

                <Input
                  label="Username"
                  type="text"
                  placeholder="@yourhandle"
                  icon={<span className="text-text-faint font-bold">@</span>}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

                {error && (
                  <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
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
