import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'

export default async function SkillsPage() {
  const { userId } = auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Skills</h1>
          <p className="text-gray-600 mt-2">Manage your offered and wanted skills.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Offered Skills */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills I Offer</h2>
            <p className="text-gray-600">Skills you can teach or help others with.</p>
            {/* Skills list will be populated by client component */}
          </div>

          {/* Wanted Skills */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills I Want</h2>
            <p className="text-gray-600">Skills you want to learn from others.</p>
            {/* Skills list will be populated by client component */}
          </div>
        </div>
      </main>
    </div>
  )
} 