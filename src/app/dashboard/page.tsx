import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentSwaps } from '@/components/dashboard/recent-swaps'

export default async function DashboardPage() {
  const { userId } = auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen hero-gradient">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#340773]">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your SkillSync overview.</p>
        </div>

        <div className="space-y-8">
          <DashboardStats />
          <RecentSwaps />
        </div>
      </main>
    </div>
  )
}
