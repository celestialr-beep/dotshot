'use client'

import { useState } from 'react'
import { Send, Search } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { timeAgo } from '@/lib/utils'

const mockConversations = [
  {
    id: '1', username: 'sofia_glam', full_name: 'Sofia Morales',
    lastMessage: 'Hey! I\'d love to collab on that editorial you mentioned.',
    time: new Date(Date.now() - 30 * 60000).toISOString(),
    unread: 2, avatar_url: null,
  },
  {
    id: '2', username: 'luxskin_brand', full_name: 'LuxSkin Official',
    lastMessage: 'Your application has been shortlisted for the Fall Campaign.',
    time: new Date(Date.now() - 2 * 3600000).toISOString(),
    unread: 1, avatar_url: null,
  },
  {
    id: '3', username: 'rex_films', full_name: 'Rex Williams',
    lastMessage: 'Let me know when you\'re free to discuss the music video shoot.',
    time: new Date(Date.now() - 24 * 3600000).toISOString(),
    unread: 0, avatar_url: null,
  },
]

const mockMessages = [
  { id: '1', sender: 'sofia_glam', body: 'Hey! I saw your profile and I think we\'d make a great creative team.', time: new Date(Date.now() - 60 * 60000).toISOString() },
  { id: '2', sender: 'me', body: 'I totally agree! I\'ve been looking for an MUA for an editorial I have planned.', time: new Date(Date.now() - 55 * 60000).toISOString() },
  { id: '3', sender: 'sofia_glam', body: 'What\'s the aesthetic you\'re going for? I\'m comfortable with everything from minimal to bold glam.', time: new Date(Date.now() - 50 * 60000).toISOString() },
  { id: '4', sender: 'me', body: 'Think editorial — moody, high contrast. Inspired by Vogue Italia. Dark lip, sculptural.', time: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: '5', sender: 'sofia_glam', body: 'Hey! I\'d love to collab on that editorial you mentioned.', time: new Date(Date.now() - 30 * 60000).toISOString() },
]

export default function MessagesPage() {
  const [activeConvo, setActiveConvo] = useState(mockConversations[0])
  const [message, setMessage] = useState('')

  return (
    <div className="flex h-screen bg-dark">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 bg-surface border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="font-bold mb-3">Messages</h1>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
            <input
              placeholder="Search conversations..."
              className="w-full bg-surface-2 border border-border rounded-lg pl-8 pr-3 py-2 text-xs text-text placeholder:text-text-faint focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((convo) => (
            <button
              key={convo.id}
              onClick={() => setActiveConvo(convo)}
              className={`w-full flex items-start gap-3 p-4 border-b border-border text-left transition-colors ${
                activeConvo.id === convo.id ? 'bg-gold/5' : 'hover:bg-surface-2'
              }`}
            >
              <div className="relative flex-shrink-0">
                <Avatar name={convo.full_name} size="sm" />
                {convo.unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold rounded-full text-dark text-xs flex items-center justify-center font-bold">
                    {convo.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-medium truncate">{convo.full_name}</span>
                  <span className="text-xs text-text-faint flex-shrink-0">{timeAgo(convo.time)}</span>
                </div>
                <p className="text-xs text-text-muted truncate">{convo.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="flex items-center gap-3 p-4 border-b border-border bg-surface">
          <Avatar name={activeConvo.full_name} size="sm" />
          <div>
            <div className="font-semibold text-sm">{activeConvo.full_name}</div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-text-muted">Active now</span>
            </div>
          </div>
          <div className="ml-auto">
            <Badge variant="muted" className="text-xs">Collab Request</Badge>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          {mockMessages.map((msg) => {
            const isMe = msg.sender === 'me'
            return (
              <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isMe && <Avatar name={activeConvo.full_name} size="xs" className="mt-1 flex-shrink-0" />}
                <div className={`max-w-xs lg:max-w-sm ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? 'bg-gold text-dark rounded-tr-sm'
                        : 'bg-surface-2 text-text border border-border rounded-tl-sm'
                    }`}
                  >
                    {msg.body}
                  </div>
                  <span className="text-xs text-text-faint">{timeAgo(msg.time)}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-surface">
          <div className="flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-gold transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && setMessage('')}
            />
            <Button size="md" onClick={() => setMessage('')} disabled={!message.trim()}>
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
