'use client'

import { MessageSquare, Send, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

// Real-time messaging is coming in the next sprint.
// This page shows an honest state rather than fake conversations.

export default function MessagesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5">
        <MessageSquare size={28} className="text-gold" />
      </div>

      <h1 className="text-2xl font-bold mb-2">Messages</h1>
      <p className="text-text-muted text-sm max-w-sm mb-2 leading-relaxed">
        Direct messaging between collaborators is being built right now.
        When it launches, you'll be able to message anyone on the platform directly from their profile.
      </p>
      <p className="text-xs text-text-faint max-w-xs mb-8 leading-relaxed">
        In the meantime, connect with other creatives through Collab Calls in the forum —
        post what you're looking for and let the community respond.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/forum">
          <Button size="lg" className="glow-gold">
            <Send size={16} />
            Post a Collab Call
          </Button>
        </Link>
        <Link href="/network">
          <Button size="lg" variant="outline">
            Browse the Network
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      {/* What to expect */}
      <div className="mt-12 bg-surface border border-border rounded-2xl p-6 max-w-sm text-left">
        <h2 className="text-sm font-semibold mb-4 text-text">When messaging launches, you'll be able to:</h2>
        <ul className="space-y-3">
          {[
            'Message any creative directly from their profile',
            'Send and receive collab invitations',
            'Coordinate shoot details and timing',
            'Get notified instantly on your phone',
            'Keep a full history of every collaboration conversation',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-text-muted">
              <span className="text-gold mt-0.5 flex-shrink-0">→</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
