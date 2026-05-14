export type UserRole =
  | 'photographer'
  | 'videographer'
  | 'makeup_artist'
  | 'hairstylist'
  | 'model'
  | 'art_director'
  | 'stylist'
  | 'retoucher'
  | 'other'

export interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  bio: string | null
  role: UserRole
  location: string | null
  city: string | null
  state: string | null
  country: string
  website: string | null
  instagram: string | null
  tiktok: string | null
  subscription_tier: 'free' | 'pro' | 'elite'
  is_verified: boolean
  rating: number
  review_count: number
  completed_projects: number
  top_collaborators: string[]
  portfolio_images: string[]
  created_at: string
}

export interface ForumPost {
  id: string
  author_id: string
  author: Pick<Profile, 'username' | 'full_name' | 'avatar_url' | 'role' | 'is_verified'>
  title: string
  body: string
  tags: string[]
  category: 'collab_request' | 'general' | 'showcase' | 'advice'
  location: string | null
  upvotes: number
  reply_count: number
  created_at: string
}

export interface Campaign {
  id: string
  client_id: string
  title: string
  description: string
  location: string
  city: string
  budget_min: number
  budget_max: number
  roles_needed: UserRole[]
  start_date: string
  end_date: string | null
  status: 'open' | 'casting' | 'in_progress' | 'completed'
  is_featured: boolean
  application_count: number
  client: Pick<Profile, 'username' | 'full_name' | 'avatar_url' | 'is_verified'>
  images: string[]
  created_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  body: string
  read: boolean
  created_at: string
}

export interface Review {
  id: string
  reviewer_id: string
  subject_id: string
  campaign_id: string | null
  rating: number
  body: string
  created_at: string
  reviewer: Pick<Profile, 'username' | 'full_name' | 'avatar_url'>
}
