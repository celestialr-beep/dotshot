'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Briefcase,
  Network,
  User,
  Settings,
  LogOut,
  ShoppingBag,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DotshotLogo } from '@/components/ui/DotshotLogo'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/campaigns', icon: Briefcase, label: 'Campaigns' },
  { href: '/forum', icon: MessageSquare, label: 'Forum' },
  { href: '/network', icon: Network, label: 'Network' },
  { href: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
  { href: '/messages', icon: Users, label: 'Messages' },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-surface border-r border-border fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <DotshotLogo size="sm" href="/" />
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-gold/15 text-gold border border-gold/20'
                  : 'text-text-muted hover:text-text hover:bg-surface-2'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-border flex flex-col gap-1">
        <Link
          href="/profile/me"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-text hover:bg-surface-2 transition-all"
        >
          <User size={18} />
          My Profile
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-text hover:bg-surface-2 transition-all"
        >
          <Settings size={18} />
          Settings
        </Link>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-error hover:bg-error/10 transition-all text-left w-full">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
