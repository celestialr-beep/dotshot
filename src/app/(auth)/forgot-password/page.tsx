'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DotshotLogo } from '@/components/ui/DotshotLogo'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <DotshotLogo size="md" href="/" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Reset your password</h1>
          <p className="text-text-muted text-sm">
            Enter your email and we&apos;ll send you a link to get back in.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-7">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle size={40} className="text-green-400 mx-auto mb-4" />
              <h2 className="font-bold mb-2">Check your inbox</h2>
              <p className="text-sm text-text-muted mb-5">
                We sent a password reset link to <strong className="text-text">{email}</strong>.
                Check your spam folder if you don&apos;t see it.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">Back to Sign In</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={<Mail size={16} />}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              {error && (
                <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <Button type="submit" loading={loading} className="w-full">
                Send Reset Link
              </Button>
            </form>
          )}
        </div>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm text-text-muted hover:text-text transition-colors mt-5"
        >
          <ArrowLeft size={15} />
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}
