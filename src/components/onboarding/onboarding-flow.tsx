'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { PersonalInfoStep } from './steps/personal-info-step'
import { SkillsStep } from './steps/skills-step'
import { PreferencesStep } from './steps/preferences-step'

const steps = [
  { id: 'personal', title: 'Personal Information', component: PersonalInfoStep },
  { id: 'skills', title: 'Your Skills', component: SkillsStep },
  { id: 'preferences', title: 'Preferences', component: PreferencesStep },
]

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    availability_status: 'available' as const,
    is_public: true,
    offeredSkills: [],
    wantedSkills: [],
  })
  const router = useRouter()

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    try {
      // Save user data and redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error completing onboarding:', error)
    }
  }

  const handleDataChange = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const CurrentStepComponent = steps[currentStep].component
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Step {currentStep + 1} of {steps.length}</CardTitle>
          <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">{steps[currentStep].title}</h2>
        </div>

        <CurrentStepComponent
          data={formData}
          onChange={handleDataChange}
        />

        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
