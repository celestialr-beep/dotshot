'use client'

import { useEffect, useState, useRef } from 'react'
import { Shield, MapPin, Clock, Phone, Mail, User, AlertTriangle, CheckCircle, ArrowLeft, Plus, History } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase'

type Status = 'checked_in' | 'checked_out' | 'overdue' | 'panic'

interface Checkin {
  id: string
  gig_name: string
  location_address: string
  emergency_contact_name: string
  emergency_contact_email: string
  emergency_contact_phone: string
  checkin_time: string
  expected_checkout_time: string
  actual_checkout_time: string | null
  status: Status
  panic_triggered_at: string | null
}

interface EmergencyContact {
  name: string
  email: string
  phone: string
}

type View = 'home' | 'checkin_form' | 'active' | 'history' | 'contacts'

export default function SafetyPage() {
  const [view, setView] = useState<View>('home')
  const [userId, setUserId] = useState<string | null>(null)
  const [activeCheckin, setActiveCheckin] = useState<Checkin | null>(null)
  const [history, setHistory] = useState<Checkin[]>([])
  const [savedContact, setSavedContact] = useState<EmergencyContact>({ name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [panicLoading, setPanicLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')
  const [isOverdue, setIsOverdue] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Check-in form state
  const [form, setForm] = useState({
    gig_name: '',
    location_address: '',
    duration_hours: '3',
    emergency_contact_name: '',
    emergency_contact_email: '',
    emergency_contact_phone: '',
    notes: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (activeCheckin) {
      startTimer(activeCheckin.expected_checkout_time)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [activeCheckin])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)

    // Load profile emergency contact
    const { data: profile } = await supabase
      .from('profiles')
      .select('emergency_contact_name, emergency_contact_email, emergency_contact_phone')
      .eq('id', user.id)
      .single()

    if (profile) {
      const contact = {
        name: profile.emergency_contact_name || '',
        email: profile.emergency_contact_email || '',
        phone: profile.emergency_contact_phone || '',
      }
      setSavedContact(contact)
      setForm(prev => ({
        ...prev,
        emergency_contact_name: contact.name,
        emergency_contact_email: contact.email,
        emergency_contact_phone: contact.phone,
      }))
    }

    // Load active checkin
    const { data: active } = await supabase
      .from('gig_checkins')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'checked_in')
      .order('checkin_time', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (active) {
      setActiveCheckin(active)
      setView('active')
    }

    // Load history
    const { data: hist } = await supabase
      .from('gig_checkins')
      .select('*')
      .eq('user_id', user.id)
      .neq('status', 'checked_in')
      .order('created_at', { ascending: false })
      .limit(20)

    if (hist) setHistory(hist)
  }

  function startTimer(expectedTime: string) {
    if (timerRef.current) clearInterval(timerRef.current)
    function update() {
      const diff = new Date(expectedTime).getTime() - Date.now()
      if (diff <= 0) {
        setIsOverdue(true)
        setTimeLeft('OVERDUE')
        if (timerRef.current) clearInterval(timerRef.current)
        return
      }
      setIsOverdue(false)
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${h > 0 ? h + 'h ' : ''}${m}m ${s}s`)
    }
    update()
    timerRef.current = setInterval(update, 1000)
  }

  async function handleCheckin(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setLoading(true)

    const expectedOut = new Date(Date.now() + parseFloat(form.duration_hours) * 3600000).toISOString()

    const { data, error } = await supabase
      .from('gig_checkins')
      .insert({
        user_id: userId,
        gig_name: form.gig_name,
        location_address: form.location_address,
        emergency_contact_name: form.emergency_contact_name,
        emergency_contact_email: form.emergency_contact_email,
        emergency_contact_phone: form.emergency_contact_phone,
        expected_checkout_time: expectedOut,
        notes: form.notes,
      })
      .select()
      .single()

    if (!error && data) {
      // Save emergency contact to profile for next time
      await supabase.from('profiles').update({
        emergency_contact_name: form.emergency_contact_name,
        emergency_contact_email: form.emergency_contact_email,
        emergency_contact_phone: form.emergency_contact_phone,
      }).eq('id', userId)

      setActiveCheckin(data)
      setView('active')

      // Send check-in notification email to emergency contact
      await sendSafetyEmail('checkin', data)
    }
    setLoading(false)
  }

  async function handleCheckout() {
    if (!activeCheckin) return
    setLoading(true)

    await supabase
      .from('gig_checkins')
      .update({
        status: 'checked_out',
        actual_checkout_time: new Date().toISOString(),
      })
      .eq('id', activeCheckin.id)

    await sendSafetyEmail('checkout', activeCheckin)

    if (timerRef.current) clearInterval(timerRef.current)
    setActiveCheckin(null)
    await loadData()
    setView('home')
    setLoading(false)
  }

  async function handlePanic() {
    if (!activeCheckin) return
    setPanicLoading(true)

    await supabase
      .from('gig_checkins')
      .update({
        status: 'panic',
        panic_triggered_at: new Date().toISOString(),
      })
      .eq('id', activeCheckin.id)

    await sendSafetyEmail('panic', activeCheckin)

    setPanicLoading(false)
  }

  async function sendSafetyEmail(type: 'checkin' | 'checkout' | 'panic', checkin: Checkin) {
    // Opens mailto as fallback — Edge Function handles automated alerts
    const contact = checkin.emergency_contact_email
    const name = checkin.emergency_contact_name

    if (type === 'panic') {
      const subject = encodeURIComponent(`🚨 EMERGENCY: ${checkin.gig_name}`)
      const body = encodeURIComponent(
        `${name},\n\nThis is an EMERGENCY ALERT from Dotshot.\n\n` +
        `Your contact has triggered the panic button at their gig.\n\n` +
        `Gig: ${checkin.gig_name}\n` +
        `Location: ${checkin.location_address}\n` +
        `Checked in at: ${new Date(checkin.checkin_time).toLocaleString()}\n` +
        `Panic triggered at: ${new Date().toLocaleString()}\n\n` +
        `Please contact them immediately or call 911 if you cannot reach them.\n\n` +
        `— Dotshot Safety System`
      )
      window.open(`mailto:${contact}?subject=${subject}&body=${body}`)
    } else if (type === 'checkin') {
      const subject = encodeURIComponent(`✅ Gig Check-In: ${checkin.gig_name}`)
      const body = encodeURIComponent(
        `${name},\n\nThis is a safety notification from Dotshot.\n\n` +
        `Your contact has safely checked in to a gig.\n\n` +
        `Gig: ${checkin.gig_name}\n` +
        `Location: ${checkin.location_address}\n` +
        `Checked in: ${new Date(checkin.checkin_time).toLocaleString()}\n` +
        `Expected to check out by: ${new Date(checkin.expected_checkout_time).toLocaleString()}\n\n` +
        `If you do not receive a check-out notification by that time, please contact them.\n\n` +
        `— Dotshot Safety System`
      )
      window.open(`mailto:${contact}?subject=${subject}&body=${body}`)
    }
  }

  function getStatusColor(status: Status) {
    if (status === 'checked_out') return 'text-green-400'
    if (status === 'panic') return 'text-red-400'
    if (status === 'overdue') return 'text-amber-400'
    return 'text-gold'
  }

  function getStatusLabel(status: Status) {
    if (status === 'checked_out') return 'Checked Out Safe'
    if (status === 'panic') return 'PANIC TRIGGERED'
    if (status === 'overdue') return 'Overdue'
    return 'Active'
  }

  // ─── ACTIVE GIG VIEW ──────────────────────────────────────────────────────
  if (view === 'active' && activeCheckin) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Shield size={24} className="text-gold" />
          <h1 className="text-xl font-bold">Safety Active</h1>
          <Badge variant="gold" className="ml-auto">Live</Badge>
        </div>

        {/* Active gig card */}
        <div className={`border rounded-2xl p-6 mb-5 ${isOverdue ? 'bg-red-400/5 border-red-400/30' : 'bg-gold/5 border-gold/30'}`}>
          <h2 className="font-bold text-lg mb-1">{activeCheckin.gig_name}</h2>
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <MapPin size={13} />
            {activeCheckin.location_address}
          </div>

          {/* Timer */}
          <div className={`text-center py-6 rounded-xl mb-4 ${isOverdue ? 'bg-red-400/10' : 'bg-surface'}`}>
            <p className="text-xs text-text-faint mb-1">{isOverdue ? 'YOU ARE OVERDUE' : 'Time until expected checkout'}</p>
            <p className={`text-4xl font-black tracking-tight ${isOverdue ? 'text-red-400' : 'text-gold'}`}>{timeLeft}</p>
            <p className="text-xs text-text-faint mt-1">
              Expected out by {new Date(activeCheckin.expected_checkout_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-text-muted mb-5">
            <User size={12} />
            Emergency contact: <strong className="text-text">{activeCheckin.emergency_contact_name}</strong>
            {activeCheckin.emergency_contact_phone && (
              <span>· {activeCheckin.emergency_contact_phone}</span>
            )}
          </div>

          {/* Safe checkout */}
          <Button
            onClick={handleCheckout}
            loading={loading}
            className="w-full mb-3 bg-green-500 hover:bg-green-400 border-green-500"
          >
            <CheckCircle size={18} />
            I&apos;m Safe — Check Out
          </Button>

          {/* PANIC BUTTON */}
          <button
            onClick={handlePanic}
            disabled={panicLoading || activeCheckin.status === 'panic'}
            className="w-full py-4 rounded-xl bg-red-500 hover:bg-red-400 active:scale-95 text-white font-black text-lg tracking-wider uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-3 border-2 border-red-400"
          >
            <AlertTriangle size={22} />
            {panicLoading ? 'SENDING ALERT...' : activeCheckin.status === 'panic' ? 'ALERT SENT' : 'PANIC — SEND ALERT'}
          </button>

          {activeCheckin.status === 'panic' && (
            <div className="mt-3 p-3 bg-red-400/10 border border-red-400/20 rounded-lg">
              <p className="text-xs text-red-400 text-center font-medium">
                🚨 Emergency alert sent to {activeCheckin.emergency_contact_name}. If in immediate danger, call 911.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setView('history')}
          className="text-xs text-text-muted hover:text-text text-center w-full transition-colors"
        >
          View gig history
        </button>
      </div>
    )
  }

  // ─── CHECK-IN FORM ──────────────────────────────────────────────────────
  if (view === 'checkin_form') {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView('home')} className="text-text-muted hover:text-text">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Check In to a Gig</h1>
        </div>

        <form onSubmit={handleCheckin} className="space-y-5">
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <MapPin size={15} className="text-gold" /> Gig Details
            </h2>
            <Input
              label="Gig / Job Name"
              placeholder="e.g. Fashion editorial with Luxe Brand"
              value={form.gig_name}
              onChange={e => setForm(p => ({ ...p, gig_name: e.target.value }))}
              required
            />
            <Input
              label="Full Address / Location"
              placeholder="123 Studio Ave, Orlando, FL 32801"
              value={form.location_address}
              onChange={e => setForm(p => ({ ...p, location_address: e.target.value }))}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-muted">Expected Duration</label>
              <select
                value={form.duration_hours}
                onChange={e => setForm(p => ({ ...p, duration_hours: e.target.value }))}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
              >
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
                <option value="4">4 hours</option>
                <option value="6">6 hours</option>
                <option value="8">8 hours (full day)</option>
                <option value="12">12 hours</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-muted">Notes (optional)</label>
              <textarea
                placeholder="Any extra details about the gig..."
                value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                rows={2}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors resize-none"
              />
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <Phone size={15} className="text-gold" /> Emergency Contact
            </h2>
            <p className="text-xs text-text-faint">This person will be notified when you check in, and alerted if you don&apos;t check out on time.</p>
            <Input
              label="Name"
              placeholder="Mom, Partner, Best Friend..."
              value={form.emergency_contact_name}
              onChange={e => setForm(p => ({ ...p, emergency_contact_name: e.target.value }))}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="their@email.com"
              value={form.emergency_contact_email}
              onChange={e => setForm(p => ({ ...p, emergency_contact_email: e.target.value }))}
              required
            />
            <Input
              label="Phone (optional but recommended)"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={form.emergency_contact_phone}
              onChange={e => setForm(p => ({ ...p, emergency_contact_phone: e.target.value }))}
            />
          </div>

          <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-4">
            <p className="text-xs text-amber-400/80 leading-relaxed">
              <strong>How it works:</strong> Your emergency contact receives an email when you check in. If you don&apos;t check out on time, they receive an overdue alert. If you hit PANIC, they receive an emergency alert immediately with your location.
            </p>
          </div>

          <Button type="submit" loading={loading} className="w-full" size="lg">
            <Shield size={18} />
            Check In — I&apos;m at My Gig
          </Button>
        </form>
      </div>
    )
  }

  // ─── HISTORY VIEW ──────────────────────────────────────────────────────
  if (view === 'history') {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView('home')} className="text-text-muted hover:text-text">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Gig History</h1>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-16 text-text-faint">
            <History size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No completed gigs yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((gig) => (
              <div key={gig.id} className="bg-surface border border-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-semibold text-sm">{gig.gig_name}</h3>
                    <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                      <MapPin size={11} /> {gig.location_address}
                    </p>
                  </div>
                  <span className={`text-xs font-bold ${getStatusColor(gig.status)}`}>
                    {getStatusLabel(gig.status)}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-text-faint">
                  <span>In: {new Date(gig.checkin_time).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  {gig.actual_checkout_time && (
                    <span>Out: {new Date(gig.actual_checkout_time).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ─── HOME VIEW ──────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Shield size={28} className="text-gold" />
        <h1 className="text-2xl font-bold">Gig Safety</h1>
      </div>
      <p className="text-text-muted text-sm mb-8">
        Check in before every gig. Your emergency contact is notified automatically. One tap to send an alert if something feels wrong.
      </p>

      {/* Main check-in CTA */}
      <Button
        size="lg"
        className="w-full mb-4 glow-gold"
        onClick={() => setView('checkin_form')}
      >
        <Shield size={20} />
        Check In to a Gig
      </Button>

      {/* Safety tips */}
      <div className="bg-surface border border-border rounded-xl p-5 mb-5">
        <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
          <AlertTriangle size={15} className="text-gold" /> Safety Tips for Every Gig
        </h2>
        <ul className="space-y-3">
          {[
            'Always check in before you go anywhere for a gig',
            'Share the address with someone you trust before you leave home',
            'First time with a new client? Meet somewhere public first',
            'Trust your gut — if something feels off, it is. Leave.',
            'Your emergency contact gets an email when you check in and out',
            'Hit PANIC if anything feels unsafe. Your contact is alerted immediately.',
            'Never attend a private residence alone for a first shoot',
            'Minors: a parent or guardian must always be present on set',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-text-muted">
              <CheckCircle size={13} className="text-gold mt-0.5 flex-shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Emergency contact on file */}
      <div className="bg-surface border border-border rounded-xl p-5 mb-5">
        <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Phone size={15} className="text-gold" /> Emergency Contact on File
        </h2>
        {savedContact.name ? (
          <div className="space-y-1">
            <p className="text-sm text-text font-medium">{savedContact.name}</p>
            {savedContact.email && <p className="text-xs text-text-muted flex items-center gap-1"><Mail size={11} /> {savedContact.email}</p>}
            {savedContact.phone && <p className="text-xs text-text-muted flex items-center gap-1"><Phone size={11} /> {savedContact.phone}</p>}
            <button
              onClick={() => setView('checkin_form')}
              className="text-xs text-gold hover:underline mt-2 block"
            >
              Update contact →
            </button>
          </div>
        ) : (
          <div>
            <p className="text-xs text-text-faint mb-3">No emergency contact saved yet. Add one when you check in for the first time.</p>
            <Button size="sm" variant="outline" onClick={() => setView('checkin_form')}>
              <Plus size={14} /> Add Emergency Contact
            </Button>
          </div>
        )}
      </div>

      {/* History link */}
      {history.length > 0 && (
        <button
          onClick={() => setView('history')}
          className="w-full text-sm text-text-muted hover:text-text transition-colors flex items-center justify-center gap-2 py-3"
        >
          <History size={15} />
          View Gig History ({history.length} gigs logged)
        </button>
      )}
    </div>
  )
}
