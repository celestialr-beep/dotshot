import { DashboardNav } from '@/components/layout/DashboardNav'
import { MobileNav } from '@/components/layout/MobileNav'
import { MobileHeader } from '@/components/layout/MobileHeader'
import { OnboardingWalkthrough } from '@/components/ui/OnboardingWalkthrough'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-dark">
      {/* First-time user walkthrough — shows once, dismissed via localStorage */}
      <OnboardingWalkthrough />

      {/* Desktop sidebar — hidden on mobile */}
      <DashboardNav />

      {/* Main content area */}
      <main className="flex-1 lg:ml-60 min-h-screen flex flex-col">
        {/* Mobile top header — hidden on desktop */}
        <MobileHeader />

        {/* Page content — extra bottom padding on mobile so nothing hides behind the tab bar */}
        <div className="flex-1 pb-20 lg:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile bottom tab bar — hidden on desktop */}
      <MobileNav />
    </div>
  )
}
