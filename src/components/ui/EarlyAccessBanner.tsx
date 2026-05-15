'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles } from 'lucide-react'

interface EarlyAccessBannerProps {
  storageKey: string         // unique per page so each page can be dismissed separately
  headline: string
  body: string
}

export function EarlyAccessBanner({ storageKey, headline, body }: EarlyAccessBannerProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only show if they haven't dismissed it before
    const dismissed = localStorage.getItem(storageKey)
    if (!dismissed) setVisible(true)
  }, [storageKey])

  function dismiss() {
    localStorage.setItem(storageKey, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="relative bg-gradient-to-r from-gold/10 via-gold/5 to-transparent border border-gold/25 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
      <Sparkles size={18} className="text-gold flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text mb-0.5">{headline}</p>
        <p className="text-xs text-text-muted leading-relaxed">{body}</p>
      </div>
      <button
        onClick={dismiss}
        className="text-text-faint hover:text-text-muted transition-colors flex-shrink-0 mt-0.5"
        aria-label="Dismiss"
      >
        <X size={15} />
      </button>
    </div>
  )
}
