import Link from 'next/link'
import { ArrowLeft, Clock } from 'lucide-react'
import { DotshotLogo } from '@/components/ui/DotshotLogo'
import { Button } from '@/components/ui/Button'

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-8">
        <DotshotLogo size="lg" />
      </div>
      <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-5">
        <Clock size={26} className="text-gold" />
      </div>
      <h1 className="text-3xl font-bold mb-3">Coming Soon</h1>
      <p className="text-text-muted max-w-sm mb-8 leading-relaxed">
        This page is being built. Check back soon — we&apos;re launching fast.
      </p>
      <Link href="/">
        <Button variant="outline">
          <ArrowLeft size={16} />
          Back to Home
        </Button>
      </Link>
    </div>
  )
}
