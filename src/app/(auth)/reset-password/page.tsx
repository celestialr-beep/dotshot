'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DotshotLogo } from '@/components/ui/DotshotLogo'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    setError('')

    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)
    setTimeout(() => router.push('/dashboard'), 2500)
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <DotshotLogo size="md" href="/" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Set a new password</h1>
          <p className="text-text-muted text-sm">Choose something strong and memorable.</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-7">
          {done ? (
            <div className="text-center py-4">
              <CheckCircle size={40} className="text-green-400 mx-auto mb-4" />
              <h2 className="font-bold mb-2">Password updated!</h2>
              <p className="text-sm text-text-muted">Taking you to your dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="New Password"
                type="password"
                placeholder="Min. 8 characters"
                icon={<Lock size={16} />}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Repeat your new password"
                icon={<Lock size={16} />}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
              {error && (
                <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <Button type="submit" loading={loading} className="w-full">
                Update Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
