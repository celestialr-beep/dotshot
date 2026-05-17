'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Users,
  MoreHorizontal,
  Network,
  ShoppingBag,
  Shield,
  FileText,
  User,
  Settings,
  LogOut,
  X,
  MapPin,
  CalendarDays,
  GraduationCap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { DotshotLogo } from '@/components/ui/DotshotLogo'
import { Avatar } from '@/components/ui/Avatar'

// The 4 most-reached destinations go in the bar — thumb-reachable, always visible
const primaryNav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/campaigns', icon: Briefcase, label: 'Campaigns' },
  { href: '/forum', icon: MessageSquare, label: 'Forum' },
  { href: '/map', icon: MapPin, label: 'Radar' },
]

// Everything else lives in the "More" sheet
const moreNav = [
  { href: '/network', icon: Network, label: 'Network' },
  { href: '/calendar', icon: CalendarDays, label: 'Calendar' },
  { href: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
  { href: '/messages', icon: Users, label: 'Messages' },
  { href: '/safety', icon: Shield, label: 'Gig Safety' },
  { href: '/agreement', icon: FileText, label: 'Agreements' },
  { href: '/education', icon: GraduationCap, label: 'Academy' },
]

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [moreOpen, setMoreOpen] = useState(false)
  const [profile, setProfile] = useState<{
    full_name: string
    username: string
    avatar_url: string | null
  } | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
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

  // Close the sheet when navigating
  useEffect(() => {
    setMoreOpen(false)
  }, [pathname])

  async function handleSignOut() {
    setMoreOpen(false)
    await supabase.auth.signOut()
    router.push('/')
  }

  const isMoreActive = moreNav.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  )

  return (
    <>
      {/* ── Bottom tab bar ─────────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border safe-area-bottom">
        <div className="flex items-center h-16 px-2">
          {primaryNav.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-xl transition-all duration-200',
                  active ? 'text-gold' : 'text-text-muted active:text-text'
                )}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={active ? 'drop-shadow-[0_0_6px_rgba(212,160,23,0.6)]' : ''}
                />
                <span className={cn('text-[10px] font-medium', active ? 'text-gold' : '')}>
                  {label}
                </span>
              </Link>
            )
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-xl transition-all duration-200',
              isMoreActive || moreOpen ? 'text-gold' : 'text-text-muted'
            )}
          >
            <MoreHorizontal size={22} strokeWidth={1.8} />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* ── More sheet ─────────────────────────────────────────── */}
      {moreOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />

          {/* Sheet */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-3xl border-t border-border shadow-2xl max-h-[85vh] overflow-y-auto">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border-light" />
            </div>

            {/* User info */}
            {profile && (
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                <Avatar name={profile.full_name} src={profile.avatar_url} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text truncate">{profile.full_name}</p>
                  <p className="text-xs text-text-muted truncate">@{profile.username}</p>
                </div>
              </div>
            )}

            {/* Nav grid */}
            <div className="p-4 grid grid-cols-2 gap-2.5">
              {moreNav.map(({ href, icon: Icon, label }) => {
                const active = pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-gold/15 text-gold border border-gold/20'
                        : 'bg-surface-2 text-text-muted hover:text-text hover:bg-surface-2/80'
                    )}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                )
              })}

              <Link
                href={profile ? `/profile/${profile.username}` : '/profile/me'}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium bg-surface-2 text-text-muted hover:text-text transition-all duration-200"
              >
                <User size={18} />
                My Profile
              </Link>

              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium bg-surface-2 text-text-muted hover:text-text transition-all duration-200"
              >
                <Settings size={18} />
                Settings
              </Link>
            </div>

            {/* Sign out */}
            <div className="px-4 pb-6">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl text-sm font-medium text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 border border-border"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
