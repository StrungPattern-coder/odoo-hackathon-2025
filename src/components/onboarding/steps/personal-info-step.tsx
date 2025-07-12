'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

interface PersonalInfoStepProps {
  data: {
    bio: string
    location: string
    is_public: boolean
  }
  onChange: (data: any) => void
}

export function PersonalInfoStep({ data, onChange }: PersonalInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="location">Location (Optional)</Label>
        <Input
          id="location"
          placeholder="e.g., San Francisco, CA"
          value={data.location}
          onChange={(e) => onChange({ location: e.target.value })}
        />
        <p className="text-sm text-gray-500">
          Help others find local skill swap opportunities
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio (Optional)</Label>
        <Textarea
          id="bio"
          placeholder="Tell others about yourself, your interests, and what you're passionate about..."
          rows={4}
          value={data.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
        />
        <p className="text-sm text-gray-500">
          A good bio helps others connect with you better
        </p>
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-1">
          <Label htmlFor="public-profile">Public Profile</Label>
          <p className="text-sm text-gray-500">
            Allow others to find and connect with you
          </p>
        </div>
        <Switch
          id="public-profile"
          checked={data.is_public}
          onCheckedChange={(checked: boolean) => onChange({ is_public: checked })}
        />
      </div>
    </div>
  )
}
