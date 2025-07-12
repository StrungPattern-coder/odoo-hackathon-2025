'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSkillSwapStore, User } from '@/store/skill-swap-store'
import { Search, MapPin, Star, Clock, ArrowRight } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

export function BrowseSkillsPage() {
  const { user } = useUser()
  const { 
    getPublicUsers, 
    searchUsersBySkill, 
    currentUser,
    setCurrentUser,
    users 
  } = useSkillSwapStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showSwapModal, setShowSwapModal] = useState(false)

  // Initialize current user from Clerk
  useEffect(() => {
    if (user && !currentUser) {
      const existingUser = users.find(u => u.id === user.id)
      if (existingUser) {
        setCurrentUser(existingUser)
      }
    }
  }, [user, currentUser, users, setCurrentUser])

  // Filter users based on search
  useEffect(() => {
    if (searchTerm.trim()) {
      setFilteredUsers(searchUsersBySkill(searchTerm))
    } else {
      setFilteredUsers(getPublicUsers())
    }
  }, [searchTerm, getPublicUsers, searchUsersBySkill])

  const handleRequestSwap = (targetUser: User) => {
    setSelectedUser(targetUser)
    setShowSwapModal(true)
    // For demo, just show an alert
    alert(`Swap request sent to ${targetUser.name}!`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Browse Skills</h1>
          <p className="text-gray-600">Discover talented people and the skills they offer</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search for skills (e.g., React, Python, Design)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        {filteredUsers.length} {filteredUsers.length === 1 ? 'person' : 'people'} found
        {searchTerm && ` for "${searchTerm}"`}
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((profileUser) => (
          <Card key={profileUser.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profileUser.profilePhoto} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {profileUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{profileUser.name}</CardTitle>
                    {profileUser.location && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {profileUser.location}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Rating */}
                <div className="flex items-center space-x-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{profileUser.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({profileUser.totalSwaps})</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Skills Offered */}
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Skills Offered</h4>
                <div className="flex flex-wrap gap-1">
                  {profileUser.skillsOffered.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="default" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {profileUser.skillsOffered.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{profileUser.skillsOffered.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Skills Wanted */}
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Looking to Learn</h4>
                <div className="flex flex-wrap gap-1">
                  {profileUser.skillsWanted.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {profileUser.skillsWanted.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{profileUser.skillsWanted.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                Available: {profileUser.availability.join(', ')}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {user ? (
                  <Button 
                    onClick={() => handleRequestSwap(profileUser)}
                    className="w-full group"
                    disabled={profileUser.id === currentUser?.id}
                  >
                    {profileUser.id === currentUser?.id ? (
                      'This is you'
                    ) : (
                      <>
                        Request Skill Swap
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button className="w-full" disabled>
                    Sign in to request swap
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No skills found</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? `No one is offering "${searchTerm}" skills right now. Try a different search term.`
              : 'No public profiles available at the moment.'
            }
          </p>
        </div>
      )}
    </div>
  )
}
