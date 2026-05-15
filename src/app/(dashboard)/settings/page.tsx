'use client'

import { useState, useEffect } from 'react'
import { User, Lock, Bell, Shield, Eye, Save, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { supabase } from '@/lib/supabase'

type Profile = {
  full_name: string
  username: string
  bio: string
  location: string
  website: string
  avatar_url: string | null
  role: string
}

type Tab = 'profile' | 'account' | 'notifications' | 'privacy'

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account & Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Eye },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  const [profile, setProfile] = useState<Profile>({
    full_name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    avatar_url: null,
    role: '',
  })

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new_password: '',
    confirm: '',
  })

  const [notifications, setNotifications] = useState({
    new_collab_request: true,
    new_message: true,
    campaign_match: true,
    gig_reminder: true,
    marketing: false,
  })

  const [privacy, setPrivacy] = useState({
    profile_visible: true,
    show_location: true,
    show_email: false,
    allow_messages_from: 'verified', // 'everyone' | 'verified' | 'connections'
  })

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data } = await supabase
        .from('profiles')
        .select('full_name, username, bio, location, website, avatar_url, role')
        .eq('id', user.id)
        .single()
      if (data) setProfile(data as Profile)
    }
    loadProfile()
  }, [])

  function handleProfileChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setLoading(true)
    setError('')
    const { error: err } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
      })
      .eq('id', userId)
    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (passwordForm.new_password !== passwordForm.confirm) {
      setError('New passwords do not match.')
      return
    }
    if (passwordForm.new_password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password: passwordForm.new_password })
    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      setPasswordForm({ current: '', new_password: '', confirm: '' })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-text-muted text-sm">Manage your profile, account security, and preferences.</p>
      </div>

      {/* Tabs — horizontal scroll on mobile */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-8 border-b border-border scrollbar-none">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setError(''); setSaved(false) }}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg flex-shrink-0 transition-all border-b-2 -mb-px ${
              activeTab === id
                ? 'text-gold border-gold'
                : 'text-text-muted border-transparent hover:text-text'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Success / error banners */}
      {saved && (
        <div className="flex items-center gap-2.5 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-5 text-green-400 text-sm">
          <CheckCircle size={16} /> Changes saved successfully.
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5 text-red-400 text-sm">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* ── PROFILE TAB ──────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <form onSubmit={saveProfile} className="space-y-6">
          {/* Avatar */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h2 className="font-semibold text-sm mb-4">Profile Photo</h2>
            <div className="flex items-center gap-4">
              <Avatar name={profile.full_name || 'You'} src={profile.avatar_url} size="lg" />
              <div>
                <button
                  type="button"
                  className="text-sm text-gold hover:text-gold-light font-medium transition-colors"
                >
                  Upload new photo
                </button>
                <p className="text-xs text-text-faint mt-1">JPG or PNG · Max 5MB · Square recommended</p>
              </div>
            </div>
          </div>

          {/* Basic info */}
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-sm mb-1">Basic Information</h2>
            <Input
              label="Full Name"
              name="full_name"
              value={profile.full_name}
              onChange={handleProfileChange}
              placeholder="Your full name"
            />
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Username</label>
              <div className="flex items-center gap-2 bg-surface-2 border border-border rounded-lg px-3 py-2.5">
                <span className="text-text-faint text-sm">@</span>
                <span className="text-sm text-text-muted">{profile.username}</span>
              </div>
              <p className="text-xs text-text-faint mt-1">Username cannot be changed once set.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleProfileChange}
                placeholder="Tell other creatives who you are and what you do..."
                rows={3}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Location"
                name="location"
                value={profile.location}
                onChange={handleProfileChange}
                placeholder="e.g. Orlando, FL"
              />
              <Input
                label="Website or Portfolio Link"
                name="website"
                value={profile.website}
                onChange={handleProfileChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <Button type="submit" loading={loading} className="w-full sm:w-auto">
            <Save size={16} />
            Save Profile
          </Button>
        </form>
      )}

      {/* ── ACCOUNT & SECURITY TAB ───────────────────────────── */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          <form onSubmit={changePassword} className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-sm mb-1">Change Password</h2>
            <Input
              label="New Password"
              name="new_password"
              type="password"
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm((p) => ({ ...p, new_password: e.target.value }))}
              placeholder="At least 8 characters"
            />
            <Input
              label="Confirm New Password"
              name="confirm"
              type="password"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
              placeholder="Repeat new password"
            />
            <Button type="submit" loading={loading} variant="outline">
              Update Password
            </Button>
          </form>

          {/* Danger zone */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
            <h2 className="font-semibold text-sm text-red-400 mb-1 flex items-center gap-2">
              <AlertTriangle size={15} /> Danger Zone
            </h2>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">
              Deleting your account is permanent. All your profile data, campaign history,
              and collaborations will be removed and cannot be recovered.
            </p>
            <button className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors">
              Request Account Deletion
            </button>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS TAB ────────────────────────────────── */}
      {activeTab === 'notifications' && (
        <div className="bg-surface border border-border rounded-xl p-5 space-y-5">
          <h2 className="font-semibold text-sm mb-2">Email & Push Notifications</h2>
          {[
            { key: 'new_collab_request', label: 'New Collab Request', desc: 'Someone wants to collaborate with you' },
            { key: 'new_message', label: 'New Message', desc: 'Someone sent you a direct message' },
            { key: 'campaign_match', label: 'Campaign Match', desc: "A campaign that matches your role was posted" },
            { key: 'gig_reminder', label: 'Gig Safety Reminder', desc: 'Check-in / check-out reminders for active gigs' },
            { key: 'marketing', label: 'Platform Updates & Tips', desc: 'News, feature releases, and creator tips' },
          ].map(({ key, label, desc }) => (
            <label key={key} className="flex items-start gap-4 cursor-pointer">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text">{label}</p>
                <p className="text-xs text-text-muted mt-0.5">{desc}</p>
              </div>
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={notifications[key as keyof typeof notifications]}
                  onChange={(e) => setNotifications((prev) => ({ ...prev, [key]: e.target.checked }))}
                  className="sr-only"
                />
                <div
                  onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }))}
                  className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${
                    notifications[key as keyof typeof notifications] ? 'bg-gold' : 'bg-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                    notifications[key as keyof typeof notifications] ? 'left-5' : 'left-1'
                  }`} />
                </div>
              </div>
            </label>
          ))}
          <Button className="w-full sm:w-auto mt-2">
            <Save size={16} />
            Save Preferences
          </Button>
        </div>
      )}

      {/* ── PRIVACY TAB ──────────────────────────────────────── */}
      {activeTab === 'privacy' && (
        <div className="space-y-5">
          <div className="bg-surface border border-border rounded-xl p-5 space-y-5">
            <h2 className="font-semibold text-sm mb-2">Profile Visibility</h2>

            {[
              { key: 'profile_visible', label: 'Public Profile', desc: 'Your profile is visible to all platform members' },
              { key: 'show_location', label: 'Show Location', desc: 'Display your city on your profile and in search results' },
              { key: 'show_email', label: 'Show Email', desc: 'Allow other members to see your email address' },
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-start gap-4 cursor-pointer">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text">{label}</p>
                  <p className="text-xs text-text-muted mt-0.5">{desc}</p>
                </div>
                <div className="relative flex-shrink-0 mt-0.5">
                  <div
                    onClick={() => setPrivacy((prev) => ({ ...prev, [key]: !prev[key as keyof typeof privacy] }))}
                    className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${
                      privacy[key as keyof typeof privacy] ? 'bg-gold' : 'bg-border'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                      privacy[key as keyof typeof privacy] ? 'left-5' : 'left-1'
                    }`} />
                  </div>
                </div>
              </label>
            ))}

            <div>
              <label className="text-sm font-medium text-text block mb-1.5">Who Can Message You</label>
              <select
                value={privacy.allow_messages_from}
                onChange={(e) => setPrivacy((prev) => ({ ...prev, allow_messages_from: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:outline-none focus:border-gold transition-colors"
              >
                <option value="everyone">Everyone</option>
                <option value="verified">Verified profiles only</option>
                <option value="connections">People I've collaborated with</option>
              </select>
            </div>
          </div>

          {/* Safety notice */}
          <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 flex gap-3">
            <Shield size={16} className="text-gold flex-shrink-0 mt-0.5" />
            <p className="text-xs text-text-muted leading-relaxed">
              Your safety is our priority. We recommend keeping your profile public so other
              creatives can find and collaborate with you — but only share personal contact
              details through our secure in-app messaging system, never in your public profile.
            </p>
          </div>

          <Button className="w-full sm:w-auto">
            <Save size={16} />
            Save Privacy Settings
          </Button>
        </div>
      )}
    </div>
  )
}
