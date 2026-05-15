'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { DotshotLogo } from '@/components/ui/DotshotLogo'
import { Avatar } from '@/components/ui/Avatar'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export function MobileHeader() {
  const [profile, setProfile] = useState<{
    full_name: string
    username: string
    avatar_url: string | null
  } | null>(null)

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

  return (
    <header className="lg:hidden sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-border flex items-center justify-between px-4 h-14">
      {/* Logo */}
      <DotshotLogo size="sm" href="/dashboard" />

      {/* Right side: notifications + avatar */}
      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full text-text-muted hover:text-text hover:bg-surface-2 transition-all">
          <Bell size={18} />
          {/* Notification dot — wire to real data later */}
          {/* <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold" /> */}
        </button>

        {profile && (
          <Link href={`/profile/${profile.username}`}>
            <Avatar
              name={profile.full_name}
              src={profile.avatar_url}
              size="sm"
              className="ring-2 ring-transparent hover:ring-gold/40 transition-all cursor-pointer"
            />
          </Link>
        )}
      </div>
    </header>
  )
}
