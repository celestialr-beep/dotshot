import { DashboardNav } from '@/components/layout/DashboardNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-dark">
      <DashboardNav />
      <main className="flex-1 lg:ml-60 min-h-screen">
        {children}
      </main>
    </div>
  )
}
