import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow'

export default async function OnboardingPage() {
  const { userId } = auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to SkillSync! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Let's get you set up so you can start swapping skills right away.
          </p>
        </div>
        
        <OnboardingFlow />
      </div>
    </div>
  )
}
