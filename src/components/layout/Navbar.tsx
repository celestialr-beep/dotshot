'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { DotshotLogo } from '@/components/ui/DotshotLogo'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-dark/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <DotshotLogo size="sm" />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm text-text-muted hover:text-text transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="text-sm text-text-muted hover:text-text transition-colors">
              Pricing
            </Link>
            <Link href="/forum" className="text-sm text-text-muted hover:text-text transition-colors">
              Community
            </Link>
            <Link href="/campaigns" className="text-sm text-text-muted hover:text-text transition-colors">
              Campaigns
            </Link>
            <Link href="/marketplace" className="text-sm text-text-muted hover:text-text transition-colors">
              Marketplace
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Join Free</Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-text-muted hover:text-text p-1"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-4 flex flex-col gap-4">
          <Link href="/#features" className="text-sm text-text-muted" onClick={() => setOpen(false)}>Features</Link>
          <Link href="/#pricing" className="text-sm text-text-muted" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="/forum" className="text-sm text-text-muted" onClick={() => setOpen(false)}>Community</Link>
          <Link href="/campaigns" className="text-sm text-text-muted" onClick={() => setOpen(false)}>Campaigns</Link>
          <Link href="/marketplace" className="text-sm text-text-muted" onClick={() => setOpen(false)}>Marketplace</Link>
          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button variant="secondary" className="w-full">Sign In</Button>
            </Link>
            <Link href="/signup" onClick={() => setOpen(false)}>
              <Button className="w-full">Join Free</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
