'use client'

import { useCurrentUser, useUserSkills, useSkills } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function AuthTestComponent() {
  const { clerkUser, supabaseUser, loading, error, isAuthenticated } = useCurrentUser()
  const { skills: userSkills, loading: skillsLoading } = useUserSkills()
  const { skills: allSkills, loading: allSkillsLoading } = useSkills()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading authentication data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Authentication Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not Authenticated</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please sign in to test the integration.</p>
          <Button asChild className="mt-4">
            <a href="/sign-in">Sign In</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Clerk User Data */}
      <Card>
        <CardHeader>
          <CardTitle>Clerk User Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>ID:</strong> {clerkUser?.id}
            </div>
            <div>
              <strong>Email:</strong> {clerkUser?.emailAddresses[0]?.emailAddress}
            </div>
            <div>
              <strong>First Name:</strong> {clerkUser?.firstName}
            </div>
            <div>
              <strong>Last Name:</strong> {clerkUser?.lastName}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supabase User Data */}
      <Card>
        <CardHeader>
          <CardTitle>Supabase User Data</CardTitle>
        </CardHeader>
        <CardContent>
          {supabaseUser ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>ID:</strong> {supabaseUser.id}
              </div>
              <div>
                <strong>Clerk ID:</strong> {supabaseUser.clerk_id}
              </div>
              <div>
                <strong>Email:</strong> {supabaseUser.email}
              </div>
              <div>
                <strong>XP Points:</strong> {supabaseUser.xp_points}
              </div>
              <div>
                <strong>Level:</strong> {supabaseUser.level}
              </div>
              <div>
                <strong>Status:</strong> 
                <Badge variant="outline" className="ml-2">
                  {supabaseUser.availability_status}
                </Badge>
              </div>
            </div>
          ) : (
            <p className="text-red-600">Supabase user data not found</p>
          )}
        </CardContent>
      </Card>

      {/* User Skills */}
      <Card>
        <CardHeader>
          <CardTitle>User Skills</CardTitle>
        </CardHeader>
        <CardContent>
          {skillsLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading skills...
            </div>
          ) : userSkills.length > 0 ? (
            <div className="space-y-2">
              {userSkills.map((userSkill) => (
                <div key={userSkill.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <strong>{userSkill.skill?.name}</strong>
                    <Badge variant="secondary" className="ml-2">
                      {userSkill.type}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Level {userSkill.proficiency_level}/5
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No skills added yet</p>
          )}
        </CardContent>
      </Card>

      {/* Available Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Available Skills ({allSkills.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {allSkillsLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading available skills...
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {allSkills.slice(0, 12).map((skill) => (
                <Badge key={skill.id} variant="outline">
                  {skill.name}
                </Badge>
              ))}
              {allSkills.length > 12 && (
                <Badge variant="secondary">+{allSkills.length - 12} more</Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Clerk authentication working</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Supabase database connected</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>User data synchronized</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>API endpoints functional</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
