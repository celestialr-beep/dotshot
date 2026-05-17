'use client'

import { useState, useEffect, useRef } from 'react'
import { User, Lock, Bell, Shield, Eye, Save, CheckCircle, AlertTriangle, MapPin, Ghost, Pencil, X as XIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { supabase } from '@/lib/supabase'

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/
const MAX_USERNAME_CHANGES = 3

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
  const [profileLoading, setProfileLoading] = useState(true)

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

  const [mapVisible, setMapVisible] = useState(false)
  const [mapToggling, setMapToggling] = useState(false)

  // Avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)

  // Username editing
  const [usernameChanges, setUsernameChanges] = useState(0)
  const [editingUsername, setEditingUsername] = useState(false)
  const [usernameInput, setUsernameInput] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [usernameSaving, setUsernameSaving] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      // getSession() reads from localStorage — no network round-trip,
      // so userId is set before the user can interact with any form field
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) { setProfileLoading(false); return }
      setUserId(user.id)
      const { data } = await supabase
        .from('profiles')
        .select('full_name, username, bio, location, website, avatar_url, role, map_visible, username_changes')
        .eq('id', user.id)
        .single()
      if (data) {
        setProfile(data as Profile)
        setMapVisible((data as Profile & { map_visible: boolean }).map_visible ?? false)
        setUsernameChanges((data as Profile & { username_changes: number }).username_changes ?? 0)
      }
      setProfileLoading(false)
    }
    loadProfile()
  }, [])

  function handleProfileChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!userId) {
      setError('Still loading your session — please wait a second and try again.')
      return
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setError('Only JPG, PNG, or WebP images are supported.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Photo must be under 5 MB.')
      return
    }
    setAvatarUploading(true)
    setError('')
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${userId}/avatar.${ext}`
    const { error: uploadErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type })
    if (uploadErr) {
      setAvatarUploading(false)
      // Catch the common "bucket not found" case and give a clear fix
      if (uploadErr.message.toLowerCase().includes('bucket') || uploadErr.message.includes('not found') || uploadErr.message.includes('404')) {
        setError('Storage bucket not set up yet. Go to Supabase Dashboard → Storage → New bucket → name it "avatars" → enable Public → Create. Then try again.')
      } else if (uploadErr.message.includes('policy') || uploadErr.message.includes('permission') || uploadErr.message.includes('403')) {
        setError('Upload blocked by storage policy. In Supabase Dashboard → Storage → avatars bucket → Policies, make sure authenticated users can INSERT.')
      } else {
        setError(`Upload failed: ${uploadErr.message}`)
      }
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    const { error: updateErr } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)
    setAvatarUploading(false)
    if (updateErr) {
      setError(updateErr.message)
    } else {
      setProfile((prev) => ({ ...prev, avatar_url: publicUrl }))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
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

  async function saveUsername() {
    if (!userId) {
      setUsernameError('Session not loaded yet. Please wait a moment and try again.')
      return
    }
    setUsernameError('')
    const trimmed = usernameInput.trim().toLowerCase()

    if (trimmed === profile.username) {
      setEditingUsername(false)
      return
    }
    if (!USERNAME_REGEX.test(trimmed)) {
      setUsernameError('3–20 characters: letters, numbers, and underscores only.')
      return
    }
    if (usernameChanges >= MAX_USERNAME_CHANGES) {
      setUsernameError('You\'ve used all 3 username changes. This handle is now permanent.')
      return
    }

    setUsernameSaving(true)
    // Check uniqueness
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', trimmed)
      .neq('id', userId!)
      .maybeSingle()

    if (existing) {
      setUsernameError('That username is already taken. Try another.')
      setUsernameSaving(false)
      return
    }

    const newCount = usernameChanges + 1
    const { error: err } = await supabase
      .from('profiles')
      .update({ username: trimmed, username_changes: newCount })
      .eq('id', userId!)

    setUsernameSaving(false)
    if (err) {
      setUsernameError(err.message)
    } else {
      setProfile((prev) => ({ ...prev, username: trimmed }))
      setUsernameChanges(newCount)
      setEditingUsername(false)
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
              <div className="relative flex-shrink-0">
                <Avatar name={profile.full_name || 'You'} src={profile.avatar_url} size="lg" />
                {avatarUploading && (
                  <div className="absolute inset-0 rounded-full bg-dark/60 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <button
                  type="button"
                  disabled={avatarUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-gold hover:text-gold-light font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {avatarUploading ? 'Uploading…' : 'Upload new photo'}
                </button>
                <p className="text-xs text-text-faint mt-1">JPG, PNG, or WebP · Max 5 MB · Square crop looks best</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-text-muted">Username</label>
                {!editingUsername && usernameChanges < MAX_USERNAME_CHANGES && (
                  <button
                    type="button"
                    disabled={profileLoading}
                    onClick={() => { setUsernameInput(profile.username); setUsernameError(''); setEditingUsername(true) }}
                    className="flex items-center gap-1.5 text-xs text-gold hover:text-gold-light font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Pencil size={12} /> {profileLoading ? 'Loading…' : 'Edit'}
                  </button>
                )}
              </div>

              {editingUsername ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-surface border border-gold/40 rounded-lg px-3 py-2.5 focus-within:border-gold focus-within:ring-1 focus-within:ring-gold/30 transition-colors">
                    <span className="text-text-faint text-sm">@</span>
                    <input
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value.toLowerCase())}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); saveUsername() } if (e.key === 'Escape') setEditingUsername(false) }}
                      placeholder="new_username"
                      maxLength={20}
                      autoFocus
                      className="flex-1 bg-transparent text-sm text-text placeholder:text-text-faint focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setEditingUsername(false)}
                      className="text-text-faint hover:text-text transition-colors"
                    >
                      <XIcon size={14} />
                    </button>
                  </div>
                  {usernameError && (
                    <p className="text-xs text-red-400 flex items-center gap-1.5">
                      <AlertTriangle size={12} /> {usernameError}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-text-faint">
                      {MAX_USERNAME_CHANGES - usernameChanges - 1} change{MAX_USERNAME_CHANGES - usernameChanges - 1 !== 1 ? 's' : ''} remaining after this
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      loading={usernameSaving}
                      onClick={saveUsername}
                    >
                      Save Handle
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-surface-2 border border-border rounded-lg px-3 py-2.5">
                  <span className="text-text-faint text-sm">@</span>
                  <span className="text-sm text-text">{profile.username}</span>
                </div>
              )}

              <p className="text-xs text-text-faint mt-1.5">
                {usernameChanges >= MAX_USERNAME_CHANGES
                  ? '🔒 This handle is now permanent — you\'ve used all 3 changes.'
                  : `You can change your username ${MAX_USERNAME_CHANGES - usernameChanges} more time${MAX_USERNAME_CHANGES - usernameChanges !== 1 ? 's' : ''} before it locks permanently.`}
              </p>
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

          {/* Creative Radar */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-gold" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">Creative Radar</h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Control whether you appear on the Creative Radar map for nearby collaborators to find.
                </p>
              </div>
            </div>

            <label className="flex items-start gap-4 cursor-pointer">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {mapVisible ? (
                    <Eye size={14} className="text-gold" />
                  ) : (
                    <Ghost size={14} className="text-text-faint" />
                  )}
                  <p className="text-sm font-medium text-text">
                    {mapVisible ? 'On the Map' : 'Ghost Mode'}
                  </p>
                </div>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  {mapVisible
                    ? 'You\'re visible to nearby creatives. We only share your approximate area — never your exact address.'
                    : 'You\'re hidden from the map. Toggle on to let nearby creatives discover you.'}
                </p>
              </div>
              <div className="relative flex-shrink-0 mt-0.5">
                <div
                  onClick={async () => {
                    if (!userId || mapToggling) return
                    setMapToggling(true)
                    const next = !mapVisible
                    await supabase.from('profiles').update({ map_visible: next }).eq('id', userId)
                    setMapVisible(next)
                    setMapToggling(false)
                  }}
                  className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${mapVisible ? 'bg-gold' : 'bg-border'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${mapVisible ? 'left-5' : 'left-1'}`} />
                </div>
              </div>
            </label>

            <p className="text-xs text-text-faint mt-3 leading-relaxed border-t border-border pt-3">
              Location precision is reduced to approximately 1 km. Your coordinates are updated only when you enable the Radar or visit the map page. You can go Ghost Mode at any time.
            </p>
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
