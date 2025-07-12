import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentSwaps } from '@/components/dashboard/recent-swaps'
import { SkillsOverview } from '@/components/dashboard/skills-overview'

export default async function DashboardPage() {
  const { userId } = auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your SkillSync overview.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <DashboardStats />
            <RecentSwaps />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <SkillsOverview />
          </div>
        </div>
      </main>
    </div>
  )
}
