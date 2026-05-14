import Link from 'next/link'
import { DotshotLogo } from '@/components/ui/DotshotLogo'

const platformLinks = [
  { label: 'Campaigns', href: '/campaigns' },
  { label: 'Forum', href: '/forum' },
  { label: 'Network', href: '/network' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Messages', href: '/messages' },
]

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/careers' },
  { label: 'Press', href: '/press' },
  { label: 'Contact', href: '/contact' },
]

const legalLinks = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Content Policy', href: '/content-policy' },
  { label: 'IP Rights', href: '/ip-rights' },
  { label: 'Cookie Policy', href: '/cookies' },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <DotshotLogo size="sm" href="/" />
            </div>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              Where creative professionals connect, collaborate, and create.
            </p>
            <p className="text-xs text-text-faint">Orlando, FL — Going Global</p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-text mb-3">Platform</h4>
            <ul className="flex flex-col gap-2">
              {platformLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-text-muted hover:text-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-text mb-3">Company</h4>
            <ul className="flex flex-col gap-2">
              {companyLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-text-muted hover:text-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-text mb-3">Legal</h4>
            <ul className="flex flex-col gap-2">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-text-muted hover:text-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-faint">
            © {new Date().getFullYear()} Dotshot. All rights reserved.
          </p>
          <p className="text-xs text-text-faint">
            Built for creators, by creators.
          </p>
        </div>
      </div>
    </footer>
  )
}
