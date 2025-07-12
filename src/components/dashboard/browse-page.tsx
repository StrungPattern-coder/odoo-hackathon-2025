'use client'

import { useState, useEffect } from 'react'
import { Search, Star, Filter, User, X, MessageSquare, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { useCurrentUser } from '@/hooks/use-auth'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface UserProfile {
  id: string
  name: string
  profilePhoto: string
  location?: string
  bio?: string
  skillsOffered: string[]
  skillsWanted: string[]
  rating: number
  maxRating: number
  availability: 'available' | 'busy' | 'offline'
  totalSwaps: number
  userSkills: any[]
}

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [requestData, setRequestData] = useState({
    offeredSkill: '',
    wantedSkill: '',
    message: ''
  })
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { supabaseUser } = useCurrentUser()
  const usersPerPage = 6

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: usersPerPage.toString()
      })

      if (searchTerm) {
        params.append('skill', searchTerm)
      }

      if (selectedAvailability !== 'all') {
        params.append('availability', selectedAvailability)
      }

      const response = await fetch(`/api/users?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users')
      }

      setUsers(data.users || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchTerm, selectedAvailability])

  const handleRequest = (userId: string, userName: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setSelectedUser(user)
      setShowRequestModal(true)
    }
  }

  const handleSubmitRequest = async () => {
    if (!selectedUser || !supabaseUser) return

    try {
      // Find the user skills for the swap
      const offeredSkill = selectedUser.userSkills.find((us: any) => 
        us.skill.name === requestData.offeredSkill && us.type === 'offered'
      )
      const wantedSkill = selectedUser.userSkills.find((us: any) => 
        us.skill.name === requestData.wantedSkill && us.type === 'wanted'
      )

      if (!offeredSkill || !wantedSkill) {
        throw new Error('Selected skills not found')
      }

      const response = await fetch('/api/swaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider_id: selectedUser.id,
          requester_skill_id: offeredSkill.id,
          provider_skill_id: wantedSkill.id,
          message: requestData.message
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create swap request')
      }

      setShowRequestModal(false)
    setSelectedUser(null)
    setRequestData({ offeredSkill: '', wantedSkill: '', message: '' })
      
    // Show success message
      alert('Swap request sent successfully!')
    } catch (error) {
      console.error('Error creating swap request:', error)
      alert(error instanceof Error ? error.message : 'Failed to send request')
    }
  }

  const handleCloseModals = () => {
    setShowRequestModal(false)
    setSelectedUser(null)
    setRequestData({ offeredSkill: '', wantedSkill: '', message: '' })
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'busy':
        return 'bg-orange-100 text-orange-800'
      case 'offline':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-green-100 text-green-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Users</h1>
          <p className="text-lg text-gray-600">Find skilled professionals to exchange knowledge with.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search users, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-base"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="h-12 border border-gray-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[160px]"
              >
                <option value="all">All Availability</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {users.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <User className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your search or filters to find more users.</p>
            </div>
          ) : (
            users.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="relative flex-shrink-0">
                        <img
                          src={user.profilePhoto}
                          alt={user.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          user.availability === 'available' ? 'bg-green-500' : 
                          user.availability === 'busy' ? 'bg-orange-500' : 'bg-gray-500'
                        }`}></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-lg truncate">{user.name}</CardTitle>
                        {user.location && (
                          <p className="text-xs sm:text-sm text-gray-500 truncate">{user.location}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={getAvailabilityColor(user.availability)}>
                      {user.availability}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                  {user.bio && (
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{user.bio}</p>
                  )}
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{user.rating}</span>
                    <span className="text-gray-500">/ {user.maxRating}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs sm:text-sm text-gray-500">{user.totalSwaps} swaps</span>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Offers</h4>
                      <div className="flex flex-wrap gap-1">
                        {user.skillsOffered.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                            {skill}
                          </Badge>
                        ))}
                        {user.skillsOffered.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            +{user.skillsOffered.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Wants</h4>
                      <div className="flex flex-wrap gap-1">
                        {user.skillsWanted.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                            {skill}
                          </Badge>
                        ))}
                        {user.skillsWanted.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            +{user.skillsWanted.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Dialog open={showRequestModal && selectedUser?.id === user.id} onOpenChange={setShowRequestModal}>
                      <DialogTrigger asChild>
                    <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleRequest(user.id, user.name)}
                    >
                          <Send className="w-4 h-4 mr-2" />
                      Request Swap
                    </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Request Swap with {selectedUser?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Your Skill to Offer</label>
                            <Select value={requestData.offeredSkill} onValueChange={(value: string) => setRequestData(prev => ({ ...prev, offeredSkill: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your skill to offer" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedUser?.skillsWanted.map((skill) => (
                                  <SelectItem key={skill} value={skill}>
                                    {skill}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-700">Skill You Want</label>
                            <Select value={requestData.wantedSkill} onValueChange={(value: string) => setRequestData(prev => ({ ...prev, wantedSkill: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select skill you want to learn" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedUser?.skillsOffered.map((skill) => (
                                  <SelectItem key={skill} value={skill}>
                                    {skill}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                    </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-700">Message (Optional)</label>
                            <Textarea
                              placeholder="Tell them why you'd like to swap skills..."
                              value={requestData.message}
                              onChange={(e) => setRequestData(prev => ({ ...prev, message: e.target.value }))}
                              rows={3}
                            />
                  </div>
                          
                          <div className="flex space-x-3 pt-4">
                            <Button variant="outline" onClick={handleCloseModals} className="flex-1">
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleSubmitRequest}
                              disabled={!requestData.offeredSkill || !requestData.wantedSkill}
                              className="flex-1"
                            >
                              Send Request
                            </Button>
                </div>
              </div>
                      </DialogContent>
                    </Dialog>
            </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {users.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
                <Button
                  variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                className="px-4 py-2"
                >
                  Previous
                </Button>
                
                <Button
                  variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={users.length < usersPerPage}
                className="px-4 py-2"
                >
                  Next
                </Button>
              </div>
          </div>
        )}
      </main>
    </div>
  )
}
