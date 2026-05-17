'use client'

import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Briefcase, MessageSquare, MapPin,
  CalendarDays, FileText, GraduationCap, X, ArrowRight, CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'dotshot_onboarded_v1'

const STEPS = [
  {
    icon: LayoutDashboard,
    color: 'text-gold',
    bg: 'bg-gold/10 border-gold/20',
    title: 'Welcome to Dotshot 👋',
    description:
      'Your personal studio network — right in your pocket. This is your home base. Everything you need to find work, connect with creatives, and protect your craft is here.',
    tip: null,
  },
  {
    icon: Briefcase,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
    title: 'Find Paid Campaigns',
    description:
      'Brands and clients post Crown & Capture sessions — paid photography, video, makeup, and more. Browse open campaigns, apply with your portfolio, and get selected.',
    tip: 'Pro and Elite members can apply to paid campaigns. Free members can browse and apply to free collabs.',
  },
  {
    icon: MessageSquare,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/20',
    title: 'Post a Collab Call',
    description:
      'Need a photographer for your shoot? A model for your portfolio? Post a free Collab Call on the Forum and connect with creatives in your area — no money required.',
    tip: 'Collab Calls are how most connections start. Be specific about your concept, location, and what you\'re offering.',
  },
  {
    icon: MapPin,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10 border-purple-400/20',
    title: 'Creative Radar',
    description:
      'See photographers, videographers, models, and creatives near you on the map. Ghost Mode is on by default — turn it on when you want to be discovered.',
    tip: 'Your location is rounded to about 1 km — close enough to connect, private enough to stay safe.',
  },
  {
    icon: CalendarDays,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10 border-cyan-400/20',
    title: 'Book Safely — Meet Virtually First',
    description:
      'Use the Calendar to book a virtual meetup before any in-person session. Scope out the location, vet your collaborator, and plan the shoot — all before you arrive.',
    tip: 'Virtual-first is our safety recommendation. The booking system includes a Jitsi video call link — no accounts needed for either party.',
  },
  {
    icon: FileText,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
    title: 'Protect Every Shoot with an Agreement',
    description:
      'The Agreements Library has everything you need — Media Release, Collaboration Agreement, Minor Release, and more. Sign before the shoot, not after.',
    tip: 'Even free collabs need an agreement. It defines who owns the photos, who can post, and what credit is required.',
  },
  {
    icon: GraduationCap,
    color: 'text-gold',
    bg: 'bg-gold/10 border-gold/20',
    title: 'You\'re all set 🎉',
    description:
      'Dotshot Academy has guides, tips, and resources to help you grow — from pricing your work to getting your first booking. Check it out whenever you need it.',
    tip: null,
  },
]

export function OnboardingWalkthrough() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    try {
      const done = localStorage.getItem(STORAGE_KEY)
      if (!done) setVisible(true)
    } catch {
      // localStorage unavailable — skip walkthrough
    }
  }, [])

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, '1') } catch { /* ignore */ }
    setVisible(false)
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      dismiss()
    }
  }

  if (!visible) return null

  const current = STEPS[step]
  const Icon = current.icon
  const isLast = step === STEPS.length - 1

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-sm bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 pt-4 pb-0">
            <span className="text-xs text-text-faint font-medium">
              {step + 1} of {STEPS.length}
            </span>
            <button
              onClick={dismiss}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mx-5 mt-3 h-1 rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Icon */}
            <div className={cn('w-12 h-12 rounded-xl border flex items-center justify-center mb-4', current.bg)}>
              {isLast
                ? <CheckCircle size={24} className={current.color} />
                : <Icon size={24} className={current.color} />
              }
            </div>

            <h2 className="text-lg font-bold mb-2">{current.title}</h2>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              {current.description}
            </p>

            {current.tip && (
              <div className="bg-gold/5 border border-gold/15 rounded-xl p-3 mb-4">
                <p className="text-xs text-text-muted leading-relaxed">
                  <span className="text-gold font-semibold">💡 Pro tip: </span>
                  {current.tip}
                </p>
              </div>
            )}
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 pb-2">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={cn(
                  'rounded-full transition-all duration-200',
                  i === step
                    ? 'w-5 h-1.5 bg-gold'
                    : 'w-1.5 h-1.5 bg-border hover:bg-border-light'
                )}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-2.5 px-5 pb-5 pt-2">
            {!isLast && (
              <button
                onClick={dismiss}
                className="flex-1 py-2.5 rounded-xl text-sm text-text-muted hover:text-text hover:bg-surface-2 transition-colors border border-border"
              >
                Skip tour
              </button>
            )}
            <Button
              onClick={next}
              className={cn('flex-1', isLast ? 'w-full glow-gold' : '')}
            >
              {isLast ? 'Start Exploring' : (
                <>Next <ArrowRight size={15} /></>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
