import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'

export default async function SettingsPage() {
  const { userId } = auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences.</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
            <p className="text-gray-600 mt-1">Update your account information and preferences.</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {/* Privacy Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Public Profile</p>
                      <p className="text-sm text-gray-500">Allow others to see your profile and skills</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive email updates about your swaps</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div>
                <h3 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 