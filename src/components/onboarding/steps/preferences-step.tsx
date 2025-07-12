'use client'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, Users, Bell, Shield } from 'lucide-react'

interface PreferencesStepProps {
  data: {
    is_public: boolean
    availability_status: 'available' | 'busy' | 'offline'
  }
  onChange: (data: any) => void
}

export function PreferencesStep({ data, onChange }: PreferencesStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5" />
            Profile Visibility
          </CardTitle>
          <p className="text-sm text-gray-600">
            Control who can see your profile and skills
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="public-profile" className="text-sm font-medium">
                Public Profile
              </Label>
              <p className="text-xs text-gray-500">
                Allow others to discover and connect with you
              </p>
            </div>
            <Switch
              id="public-profile"
              checked={data.is_public}
              onCheckedChange={(checked) => onChange({ is_public: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Availability Status
          </CardTitle>
          <p className="text-sm text-gray-600">
            Let others know when you're ready to swap skills
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                data.availability_status === 'available'
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onChange({ availability_status: 'available' })}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <div>
                  <div className="font-medium text-sm">Available</div>
                  <div className="text-xs text-gray-500">
                    Ready to swap skills and learn new things
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                data.availability_status === 'busy'
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onChange({ availability_status: 'busy' })}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div>
                  <div className="font-medium text-sm">Busy</div>
                  <div className="text-xs text-gray-500">
                    Limited availability, may respond slower
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                data.availability_status === 'offline'
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onChange({ availability_status: 'offline' })}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div>
                  <div className="font-medium text-sm">Offline</div>
                  <div className="text-xs text-gray-500">
                    Taking a break from skill swapping
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-blue-900">Safety First</div>
              <div className="text-blue-700">
                Always verify skill credentials and meet in safe, public spaces for in-person swaps.
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <Users className="h-4 w-4 text-green-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-green-900">Build Your Network</div>
              <div className="text-green-700">
                Complete your profile and be responsive to build trust in the community.
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
            <Globe className="h-4 w-4 text-purple-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-purple-900">Global Learning</div>
              <div className="text-purple-700">
                Connect with learners worldwide through video calls and online collaboration.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
