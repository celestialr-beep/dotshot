'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ChevronLeft, ChevronRight, Plus, Video, MapPin, Users,
  Clock, X, Check, AlertTriangle, Shield, Calendar,
  ExternalLink, ChevronDown,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { timeAgo } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────
type BookingType = 'virtual' | 'scout' | 'collab'
type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

type Booking = {
  id: string
  type: BookingType
  status: BookingStatus
  title: string
  notes: string | null
  scheduled_at: string
  duration_minutes: number
  meeting_link: string | null
  location_notes: string | null
  requester: { id: string; username: string; full_name: string; avatar_url: string | null }
  host: { id: string; username: string; full_name: string; avatar_url: string | null }
}

type SearchProfile = {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  role: string
}

// ── Constants ─────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const TYPE_META: Record<BookingType, { label: string; icon: typeof Video; color: string; desc: string }> = {
  virtual: {
    label: 'Virtual Meetup',
    icon: Video,
    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    desc: 'Video call via Jitsi — no account needed, just click the link',
  },
  scout: {
    label: 'Location Scout',
    icon: MapPin,
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    desc: 'Meet in a public place to preview the shoot location together',
  },
  collab: {
    label: 'Collab Session',
    icon: Users,
    color: 'bg-green-500/20 text-green-300 border-green-500/30',
    desc: 'The actual creative session — confirm everything first',
  },
}

const STATUS_META: Record<BookingStatus, { label: string; color: string }> = {
  pending:   { label: 'Pending',   color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  confirmed: { label: 'Confirmed', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  completed: { label: 'Completed', color: 'bg-surface text-text-muted border-border' },
}

// Generate a Jitsi room link for a booking
function jitsiLink(bookingId: string) {
  return `https://meet.jit.si/dotshot-${bookingId.replace(/-/g, '').slice(0, 12)}`
}

// Build the calendar grid for a given month
function buildMonthGrid(year: number, month: number): (number | null)[] {
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const grid: (number | null)[] = Array(firstDow).fill(null)
  for (let d = 1; d <= daysInMonth; d++) grid.push(d)
  while (grid.length % 7 !== 0) grid.push(null)
  return grid
}

// ── Toggle component ──────────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-gold' : 'bg-border'}`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? 'left-5' : 'left-1'}`} />
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selfId, setSelfId] = useState<string | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)

  // Load user + bookings
  const loadBookings = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setSelfId(user.id)

    const { data } = await supabase
      .from('bookings')
      .select(`
        id, type, status, title, notes, scheduled_at, duration_minutes,
        meeting_link, location_notes,
        requester:profiles!requester_id(id, username, full_name, avatar_url),
        host:profiles!host_id(id, username, full_name, avatar_url)
      `)
      .or(`requester_id.eq.${user.id},host_id.eq.${user.id}`)
      .neq('status', 'cancelled')
      .order('scheduled_at', { ascending: true })

    setBookings((data as unknown as Booking[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadBookings() }, [loadBookings])

  // Navigate months
  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
    setSelectedDay(null)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
    setSelectedDay(null)
  }

  const grid = buildMonthGrid(viewYear, viewMonth)

  // Bookings keyed by day of month (for dot indicators)
  const bookingsByDay = bookings.reduce<Record<number, Booking[]>>((acc, b) => {
    const d = new Date(b.scheduled_at)
    if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
      const day = d.getDate()
      if (!acc[day]) acc[day] = []
      acc[day].push(b)
    }
    return acc
  }, {})

  // Bookings for selected day
  const dayBookings = selectedDay ? (bookingsByDay[selectedDay] ?? []) : []

  // Upcoming (future) bookings across all months
  const upcoming = bookings.filter(b => new Date(b.scheduled_at) > new Date()).slice(0, 5)

  // Update booking status
  async function updateStatus(id: string, status: BookingStatus) {
    await supabase.from('bookings').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    loadBookings()
  }

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Calendar</h1>
          <p className="text-text-muted text-sm">
            Schedule virtual meetups, location scouts, and collab sessions — safely.
          </p>
        </div>
        <Button onClick={() => setShowNewModal(true)} className="flex-shrink-0">
          <Plus size={16} />
          Request a Meetup
        </Button>
      </div>

      {/* ── Safety banner ── */}
      <div className="bg-gold/5 border border-gold/20 rounded-xl px-4 py-3 flex items-start gap-3 mb-6">
        <Shield size={16} className="text-gold flex-shrink-0 mt-0.5" />
        <p className="text-xs text-text-muted leading-relaxed">
          <span className="text-gold font-semibold">Safety First: </span>
          Always start with a <strong className="text-text">Virtual Meetup</strong> before meeting anyone in person.
          Use the Location Scout type for public previews — never share your home address.
          For in-person sessions, use Dotshot&apos;s{' '}
          <a href="/safety" className="text-gold hover:underline">Gig Safety check-in system</a>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Calendar ── */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl overflow-hidden">

          {/* Month nav */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-surface-2 text-text-muted hover:text-text transition-colors">
              <ChevronLeft size={18} />
            </button>
            <h2 className="font-semibold text-sm">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h2>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-surface-2 text-text-muted hover:text-text transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {DAY_NAMES.map(d => (
              <div key={d} className="py-2 text-center text-xs text-text-faint font-medium">{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7">
            {grid.map((day, i) => {
              const hasBookings = day && bookingsByDay[day]?.length > 0
              const isSelected = day === selectedDay
              const isTodayCell = day ? isToday(day) : false

              return (
                <button
                  key={i}
                  disabled={!day}
                  onClick={() => day && setSelectedDay(day === selectedDay ? null : day)}
                  className={`relative aspect-square flex flex-col items-center justify-center text-sm transition-colors border-b border-r border-border/50 last:border-r-0 ${
                    !day ? 'cursor-default opacity-0' :
                    isSelected ? 'bg-gold/15 text-gold' :
                    isTodayCell ? 'text-gold font-semibold' :
                    'text-text hover:bg-surface-2'
                  }`}
                >
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs ${
                    isSelected ? 'bg-gold text-dark font-bold' :
                    isTodayCell && !isSelected ? 'border border-gold' : ''
                  }`}>
                    {day}
                  </span>
                  {hasBookings && (
                    <div className="flex gap-0.5 mt-0.5">
                      {bookingsByDay[day!].slice(0, 3).map((b) => (
                        <span
                          key={b.id}
                          className={`w-1 h-1 rounded-full ${
                            b.type === 'virtual' ? 'bg-blue-400' :
                            b.type === 'scout' ? 'bg-amber-400' : 'bg-green-400'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 px-5 py-3 border-t border-border text-xs text-text-faint">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400" />Virtual</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" />Scout</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400" />Collab</span>
          </div>
        </div>

        {/* ── Right panel: selected day or upcoming ── */}
        <div className="flex flex-col gap-4">

          {selectedDay && (
            <div className="bg-surface border border-border rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-3">
                {MONTH_NAMES[viewMonth]} {selectedDay}
              </h3>

              {dayBookings.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar size={24} className="text-text-faint mx-auto mb-2 opacity-40" />
                  <p className="text-xs text-text-muted">Nothing scheduled</p>
                  <button
                    onClick={() => setShowNewModal(true)}
                    className="text-xs text-gold hover:underline mt-2 block mx-auto"
                  >
                    Schedule something →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {dayBookings.map(b => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      selfId={selfId}
                      onUpdate={updateStatus}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upcoming */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h3 className="font-semibold text-sm mb-3">Upcoming</h3>

            {loading && (
              <div className="space-y-3">
                {[1,2].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-3 bg-border rounded w-3/4 mb-1.5" />
                    <div className="h-2 bg-border rounded w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {!loading && upcoming.length === 0 && (
              <div className="text-center py-6">
                <p className="text-xs text-text-muted mb-1">No upcoming meetups</p>
                <button
                  onClick={() => setShowNewModal(true)}
                  className="text-xs text-gold hover:underline"
                >
                  Request one →
                </button>
              </div>
            )}

            {!loading && upcoming.map(b => {
              const Icon = TYPE_META[b.type].icon
              const d = new Date(b.scheduled_at)
              const other = b.requester.id === selfId ? b.host : b.requester
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    setViewYear(d.getFullYear())
                    setViewMonth(d.getMonth())
                    setSelectedDay(d.getDate())
                  }}
                  className="w-full flex items-start gap-3 py-2.5 border-b border-border last:border-0 text-left hover:bg-surface-2 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text truncate">{b.title}</p>
                    <p className="text-xs text-text-faint">
                      with {other.full_name.split(' ')[0]} · {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                  <Badge className={STATUS_META[b.status].color + ' text-xs flex-shrink-0'}>
                    {STATUS_META[b.status].label}
                  </Badge>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── New Booking Modal ── */}
      {showNewModal && (
        <NewBookingModal
          selfId={selfId}
          onClose={() => setShowNewModal(false)}
          onCreated={() => { setShowNewModal(false); loadBookings() }}
        />
      )}
    </div>
  )
}

// ── Booking card (inside day view) ───────────────────────────────────────────
function BookingCard({
  booking: b,
  selfId,
  onUpdate,
}: {
  booking: Booking
  selfId: string | null
  onUpdate: (id: string, status: BookingStatus) => void
}) {
  const Icon = TYPE_META[b.type].icon
  const other = b.requester.id === selfId ? b.host : b.requester
  const isRequester = b.requester.id === selfId
  const d = new Date(b.scheduled_at)
  const isPast = d < new Date()
  const jitsi = b.meeting_link || (b.type === 'virtual' ? jitsiLink(b.id) : null)

  return (
    <div className="bg-surface-2 border border-border rounded-xl p-4">
      {/* Type + status */}
      <div className="flex items-center gap-2 mb-3">
        <Badge className={TYPE_META[b.type].color + ' text-xs'}>
          <Icon size={10} className="mr-1" />
          {TYPE_META[b.type].label}
        </Badge>
        <Badge className={STATUS_META[b.status].color + ' text-xs'}>
          {STATUS_META[b.status].label}
        </Badge>
      </div>

      <h4 className="font-semibold text-sm mb-1">{b.title}</h4>

      {/* Time + duration */}
      <div className="flex items-center gap-1.5 text-xs text-text-faint mb-2">
        <Clock size={11} />
        {d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        <span>·</span>
        {b.duration_minutes} min
      </div>

      {/* Other person */}
      <div className="flex items-center gap-2 mb-3">
        <Avatar name={other.full_name} src={other.avatar_url} size="xs" />
        <span className="text-xs text-text-muted">
          {isRequester ? 'Meeting' : 'Requested by'} {other.full_name}
        </span>
      </div>

      {b.notes && (
        <p className="text-xs text-text-faint italic mb-3 leading-relaxed">&ldquo;{b.notes}&rdquo;</p>
      )}

      {/* Location notes for scouts */}
      {b.location_notes && b.type === 'scout' && (
        <div className="flex items-start gap-1.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-2 mb-3">
          <MapPin size={11} className="flex-shrink-0 mt-0.5" />
          {b.location_notes}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {/* Join call */}
        {b.type === 'virtual' && b.status === 'confirmed' && jitsi && !isPast && (
          <a href={jitsi} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button size="sm" className="w-full gap-1.5">
              <Video size={13} />
              Join Call
              <ExternalLink size={11} />
            </Button>
          </a>
        )}

        {/* Confirm (host only) */}
        {!isRequester && b.status === 'pending' && (
          <Button size="sm" onClick={() => onUpdate(b.id, 'confirmed')} className="flex-1 gap-1.5">
            <Check size={13} />
            Confirm
          </Button>
        )}

        {/* Mark complete */}
        {b.status === 'confirmed' && isPast && (
          <Button size="sm" variant="outline" onClick={() => onUpdate(b.id, 'completed')} className="flex-1">
            Mark Complete
          </Button>
        )}

        {/* Cancel */}
        {(b.status === 'pending' || b.status === 'confirmed') && !isPast && (
          <Button size="sm" variant="outline" onClick={() => onUpdate(b.id, 'cancelled')}
            className="text-red-400 border-red-400/30 hover:bg-red-400/10">
            Cancel
          </Button>
        )}
      </div>
    </div>
  )
}

// ── New Booking Modal ─────────────────────────────────────────────────────────
function NewBookingModal({
  selfId,
  onClose,
  onCreated,
}: {
  selfId: string | null
  onClose: () => void
  onCreated: () => void
}) {
  const [type, setType] = useState<BookingType>('virtual')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [locationNotes, setLocationNotes] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState(30)
  const [hostQuery, setHostQuery] = useState('')
  const [hostResults, setHostResults] = useState<SearchProfile[]>([])
  const [selectedHost, setSelectedHost] = useState<SearchProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Safety acknowledgment for in-person types
  const [safetyAck, setSafetyAck] = useState(false)

  // Search for a creative to invite
  useEffect(() => {
    if (hostQuery.length < 2) { setHostResults([]); return }
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, role')
        .neq('id', selfId ?? '')
        .or(`username.ilike.%${hostQuery}%,full_name.ilike.%${hostQuery}%`)
        .limit(6)
      setHostResults((data as SearchProfile[]) ?? [])
    }, 300)
    return () => clearTimeout(t)
  }, [hostQuery, selfId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selfId || !selectedHost) { setError('Select who you want to meet with.'); return }
    if (!date || !time) { setError('Pick a date and time.'); return }
    if (type !== 'virtual' && !safetyAck) { setError('Please acknowledge the safety guidelines.'); return }

    setLoading(true)
    setError('')

    const scheduled_at = new Date(`${date}T${time}`).toISOString()
    // Pre-generate Jitsi link for virtual meetings
    const tempId = crypto.randomUUID()
    const meeting_link = type === 'virtual' ? jitsiLink(tempId) : null

    const { error: err } = await supabase.from('bookings').insert({
      requester_id: selfId,
      host_id: selectedHost.id,
      type,
      title: title || `${TYPE_META[type].label} with ${selectedHost.full_name.split(' ')[0]}`,
      notes: notes || null,
      location_notes: type !== 'virtual' ? locationNotes || null : null,
      scheduled_at,
      duration_minutes: duration,
      meeting_link,
      status: 'pending',
    })

    setLoading(false)
    if (err) { setError(err.message); return }
    onCreated()
  }

  const needsSafetyAck = type !== 'virtual'
  const TypeIcon = TYPE_META[type].icon

  // Min date = today
  const minDate = new Date().toISOString().split('T')[0]

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto max-h-[90dvh] overflow-y-auto">
        <div className="bg-surface border border-border rounded-2xl shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div>
              <h2 className="font-bold text-base">Request a Meetup</h2>
              <p className="text-xs text-text-muted mt-0.5">Start with a virtual call — always safest</p>
            </div>
            <button onClick={onClose} className="text-text-faint hover:text-text transition-colors p-1">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* Type selector */}
            <div>
              <label className="text-xs font-medium text-text-muted block mb-2">Meeting Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(TYPE_META) as [BookingType, typeof TYPE_META['virtual']][]).map(([t, meta]) => {
                  const Icon = meta.icon
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => { setType(t); setSafetyAck(false) }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                        type === t
                          ? 'bg-gold/15 border-gold/40 text-gold'
                          : 'bg-surface-2 border-border text-text-muted hover:text-text'
                      }`}
                    >
                      <Icon size={16} />
                      {meta.label.split(' ')[0]}
                    </button>
                  )
                })}
              </div>
              <p className="text-xs text-text-faint mt-2 leading-relaxed">
                {TYPE_META[type].desc}
              </p>
            </div>

            {/* Who */}
            <div>
              <label className="text-xs font-medium text-text-muted block mb-2">Who</label>
              {selectedHost ? (
                <div className="flex items-center gap-3 bg-surface-2 border border-border rounded-xl px-3 py-2.5">
                  <Avatar name={selectedHost.full_name} src={selectedHost.avatar_url} size="xs" />
                  <span className="text-sm flex-1">{selectedHost.full_name}</span>
                  <span className="text-xs text-text-faint">@{selectedHost.username}</span>
                  <button type="button" onClick={() => { setSelectedHost(null); setHostQuery('') }}>
                    <X size={14} className="text-text-faint hover:text-text" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    value={hostQuery}
                    onChange={e => setHostQuery(e.target.value)}
                    placeholder="Search by name or @username..."
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-gold transition-colors"
                  />
                  {hostResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-xl z-10 overflow-hidden">
                      {hostResults.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => { setSelectedHost(p); setHostQuery(''); setHostResults([]) }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface-2 transition-colors text-left"
                        >
                          <Avatar name={p.full_name} src={p.avatar_url} size="xs" />
                          <div>
                            <p className="text-sm font-medium">{p.full_name}</p>
                            <p className="text-xs text-text-faint">@{p.username}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-medium text-text-muted block mb-2">Title <span className="text-text-faint">(optional)</span></label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={`${TYPE_META[type].label} — what's it about?`}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {/* Date + Time + Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-text-muted block mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  min={minDate}
                  onChange={e => setDate(e.target.value)}
                  required
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted block mb-2">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  required
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-muted block mb-2">Duration</label>
              <select
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-gold transition-colors"
              >
                {[15,30,45,60,90,120].map(m => (
                  <option key={m} value={m} className="bg-surface">{m} minutes</option>
                ))}
              </select>
            </div>

            {/* Location notes (for scouts) */}
            {type === 'scout' && (
              <div>
                <label className="text-xs font-medium text-text-muted block mb-2">Public Meeting Point</label>
                <input
                  value={locationNotes}
                  onChange={e => setLocationNotes(e.target.value)}
                  placeholder="e.g. Starbucks on Orange Ave, Downtown Orlando"
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-gold transition-colors"
                />
                <p className="text-xs text-text-faint mt-1">Use a public landmark — never a private address.</p>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="text-xs font-medium text-text-muted block mb-2">Notes <span className="text-text-faint">(optional)</span></label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="What's the goal? What do you want to discuss or scope out?"
                rows={2}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-gold transition-colors resize-none"
              />
            </div>

            {/* Safety acknowledgment for in-person */}
            {needsSafetyAck && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-300 font-semibold leading-relaxed">
                    In-Person Safety Reminder
                  </p>
                </div>
                <ul className="text-xs text-text-muted space-y-1.5 mb-3 leading-relaxed">
                  <li>✓ Only meet in public, well-lit locations</li>
                  <li>✓ Tell a trusted person where you&apos;re going</li>
                  <li>✓ Use Dotshot&apos;s Gig Safety check-in before you arrive</li>
                  <li>✓ Complete a Virtual Meetup first if you haven&apos;t already</li>
                </ul>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <Toggle value={safetyAck} onChange={setSafetyAck} />
                  <span className="text-xs text-text-muted leading-relaxed">
                    I understand and agree to follow these safety guidelines
                  </span>
                </label>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2.5">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" loading={loading} className="flex-1">
                <TypeIcon size={14} />
                Send Request
              </Button>
            </div>

            {type === 'virtual' && (
              <p className="text-xs text-text-faint text-center leading-relaxed">
                A Jitsi video link is auto-generated — no account or download needed for either party.
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  )
}
