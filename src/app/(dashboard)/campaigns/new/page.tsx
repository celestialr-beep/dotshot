'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, MapPin, DollarSign, Calendar, Users, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ROLE_LABELS } from '@/lib/utils'
import type { UserRole } from '@/types'

const roleOptions = Object.entries(ROLE_LABELS) as [UserRole, string][]

export default function NewCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    city: '',
    budget_min: '',
    budget_max: '',
    start_date: '',
    end_date: '',
  })

  function toggleRole(role: string) {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    )
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (selectedRoles.length === 0) {
      setError('Please select at least one role needed.')
      return
    }
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('You must be logged in.'); setLoading(false); return }

    const { error: insertError } = await supabase.from('campaigns').insert({
      client_id: user.id,
      title: form.title,
      description: form.description,
      location: form.location,
      city: form.city,
      budget_min: parseFloat(form.budget_min) || 0,
      budget_max: parseFloat(form.budget_max) || 0,
      roles_needed: selectedRoles,
      start_date: form.start_date,
      end_date: form.end_date || null,
      status: 'open',
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/campaigns')
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/campaigns" className="text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Post a Campaign</h1>
          <p className="text-text-muted text-sm">Crown &amp; Capture — connect with talented creatives</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold flex items-center gap-2"><Briefcase size={16} className="text-gold" /> Campaign Details</h2>

          <Input
            label="Campaign Title"
            name="title"
            placeholder="e.g. Fashion Editorial Shoot — Downtown Orlando"
            value={form.title}
            onChange={handleChange}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-muted">Description</label>
            <textarea
              name="description"
              placeholder="Describe the shoot, the vibe, what you're looking for, and what creatives can expect..."
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Location */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold flex items-center gap-2"><MapPin size={16} className="text-gold" /> Location</h2>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              name="city"
              placeholder="Orlando"
              value={form.city}
              onChange={handleChange}
              required
            />
            <Input
              label="Full Location / Venue"
              name="location"
              placeholder="Orlando, FL"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Budget */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold flex items-center gap-2"><DollarSign size={16} className="text-gold" /> Budget</h2>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Min Budget ($)"
              name="budget_min"
              type="number"
              placeholder="0"
              value={form.budget_min}
              onChange={handleChange}
              required
            />
            <Input
              label="Max Budget ($)"
              name="budget_max"
              type="number"
              placeholder="500"
              value={form.budget_max}
              onChange={handleChange}
              required
            />
          </div>
          <p className="text-xs text-text-faint">Set both to $0 for a free collaboration post.</p>
        </div>

        {/* Dates */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold flex items-center gap-2"><Calendar size={16} className="text-gold" /> Dates</h2>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              name="start_date"
              type="date"
              value={form.start_date}
              onChange={handleChange}
              required
            />
            <Input
              label="End Date (optional)"
              name="end_date"
              type="date"
              value={form.end_date}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Roles needed */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold flex items-center gap-2"><Users size={16} className="text-gold" /> Roles Needed</h2>
          <p className="text-xs text-text-faint">Select all roles you need for this campaign.</p>
          <div className="flex flex-wrap gap-2">
            {roleOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleRole(value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedRoles.includes(value)
                    ? 'bg-gold/15 border-gold/40 text-gold'
                    : 'bg-surface border-border text-text-muted hover:border-border-light'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Safety notice */}
        <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-4">
          <p className="text-xs text-amber-400/80 leading-relaxed">
            <strong>Safety reminder:</strong> All campaign details must be accurate. Misrepresenting location, compensation, or the nature of work to lure creatives is a permanent ban offense. Campaigns involving Minors require parental consent documentation.
          </p>
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
        )}

        <div className="flex gap-3">
          <Button type="submit" loading={loading} className="flex-1">Post Campaign</Button>
          <Link href="/campaigns">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
