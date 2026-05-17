'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  Shield,
  FileText,
  MapPin,
  CalendarDays,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DotshotLogo } from '@/components/ui/DotshotLogo'
import { supabase } from '@/lib/supabase'
import { Avatar } from '@/components/ui/Avatar'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/campaigns', icon: Briefcase, label: 'Campaigns' },
  { href: '/forum', icon: MessageSquare, label: 'Forum' },
  { href: '/network', icon: Network, label: 'Network' },
  { href: '/map', icon: MapPin, label: 'Creative Radar' },
  { href: '/calendar', icon: CalendarDays, label: 'Calendar' },
  { href: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
  { href: '/messages', icon: Users, label: 'Messages' },
  { href: '/safety', icon: Shield, label: 'Gig Safety' },
  { href: '/agreement', icon: FileText, label: 'Agreements' },
]

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [profile, setProfile] = useState<{ full_name: string; username: string; avatar_url: string | null } | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('full_name, username, avatar_url')
        .eq('id', user.id)
        .single()
      if (data) setProfile(data)
    }
    loadProfile()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen bg-surface border-r border-border fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <DotshotLogo size="sm" href="/" />
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
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
        {/* User info */}
        {profile && (
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <Avatar name={profile.full_name} src={profile.avatar_url} size="sm" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-text truncate">{profile.full_name}</p>
              <p className="text-xs text-text-faint truncate">@{profile.username}</p>
            </div>
          </div>
        )}

        <Link
          href={profile ? `/profile/${profile.username}` : '/profile/me'}
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
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all text-left w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
