import { Bell, TrendingUp, Calendar, Star, Briefcase, MessageSquare, Users } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const recentActivity = [
  { type: 'campaign', text: 'New campaign posted near you', time: '2h ago', icon: Briefcase },
  { type: 'collab', text: 'Sofia M. responded to your collab post', time: '4h ago', icon: Users },
  { type: 'review', text: 'You received a 5-star review from Marcus P.', time: '1d ago', icon: Star },
  { type: 'message', text: '3 new messages from your network', time: '1d ago', icon: MessageSquare },
]

const quickStats = [
  { label: 'Profile Views', value: '142', change: '+12%', up: true },
  { label: 'Collab Posts', value: '3', change: 'this month', up: null },
  { label: 'Campaign Apps', value: '5', change: '2 pending', up: null },
  { label: 'Network Size', value: '47', change: '+8 this week', up: true },
]

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Good morning 👋</h1>
          <p className="text-text-muted text-sm">Here&apos;s what&apos;s happening with your Dotshot account.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg bg-surface border border-border text-text-muted hover:text-text transition-colors">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full text-dark text-xs flex items-center justify-center font-bold">3</span>
          </button>
          <Link href="/campaigns">
            <Button size="sm">Find Campaigns</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map(({ label, value, change, up }) => (
          <div key={label} className="bg-surface border border-border rounded-xl p-4">
            <div className="text-2xl font-bold mb-1">{value}</div>
            <div className="text-xs text-text-muted mb-1">{label}</div>
            <div className={`text-xs font-medium ${up === true ? 'text-green-400' : up === false ? 'text-red-400' : 'text-text-faint'}`}>
              {change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Activity feed */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Activity</h2>
            <TrendingUp size={16} className="text-text-muted" />
          </div>
          <div className="flex flex-col gap-3">
            {recentActivity.map(({ type, text, time, icon: Icon }) => (
              <div key={type + text} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text">{text}</p>
                  <p className="text-xs text-text-faint mt-0.5">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-col gap-4">
          <div className="bg-surface border border-border rounded-xl p-5">
            <h2 className="font-semibold mb-3">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <Link href="/forum">
                <Button variant="secondary" className="w-full justify-start gap-3" size="sm">
                  <MessageSquare size={15} />
                  Post a Collab Request
                </Button>
              </Link>
              <Link href="/campaigns">
                <Button variant="secondary" className="w-full justify-start gap-3" size="sm">
                  <Briefcase size={15} />
                  Browse Campaigns
                </Button>
              </Link>
              <Link href="/network">
                <Button variant="secondary" className="w-full justify-start gap-3" size="sm">
                  <Users size={15} />
                  Grow Your Network
                </Button>
              </Link>
            </div>
          </div>

          {/* Upgrade CTA */}
          <div className="bg-gold/5 border border-gold/30 rounded-xl p-5">
            <Badge variant="gold" className="mb-3 text-xs">Pro Plan</Badge>
            <h3 className="font-semibold mb-2">Unlock paid campaigns</h3>
            <p className="text-xs text-text-muted mb-3 leading-relaxed">
              Upgrade to Pro to apply for paid Crown & Capture sessions and get priority placement.
            </p>
            <Button size="sm" className="w-full">Upgrade — $6.99/mo</Button>
          </div>

          {/* Upcoming */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={16} className="text-gold" />
              <h2 className="font-semibold">Upcoming</h2>
            </div>
            <p className="text-sm text-text-muted">No upcoming sessions booked yet.</p>
            <Link href="/campaigns" className="text-xs text-gold hover:underline mt-2 block">
              Browse open campaigns →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
