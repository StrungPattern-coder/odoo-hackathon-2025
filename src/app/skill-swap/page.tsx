'use client'

import { useState, useEffect } from 'react'
import { Search, Star, Filter, User, X, MessageSquare, Send, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

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

// Static demo data for users
const demoUsers: UserProfile[] = [
  {
    id: 'user1',
    name: 'Sarah Johnson',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    location: 'San Francisco, CA',
    bio: 'Full-stack developer passionate about teaching React and JavaScript. Always excited to learn new technologies!',
    skillsOffered: ['React', 'JavaScript', 'Node.js', 'TypeScript'],
    skillsWanted: ['Python', 'Machine Learning', 'UI/UX Design'],
    rating: 4.8,
    maxRating: 5,
    availability: 'available',
    totalSwaps: 12,
    userSkills: [
      { id: 'skill1', skill: { name: 'React', category: 'Frontend' }, type: 'offered' },
      { id: 'skill2', skill: { name: 'JavaScript', category: 'Programming' }, type: 'offered' },
      { id: 'skill3', skill: { name: 'Python', category: 'Programming' }, type: 'wanted' }
    ]
  },
  {
    id: 'user2',
    name: 'Mike Chen',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    location: 'New York, NY',
    bio: 'Python developer with expertise in data science and machine learning. Love sharing knowledge!',
    skillsOffered: ['Python', 'Machine Learning', 'Data Science', 'Pandas'],
    skillsWanted: ['React', 'JavaScript', 'Web Development'],
    rating: 4.6,
    maxRating: 5,
    availability: 'available',
    totalSwaps: 8,
    userSkills: [
      { id: 'skill4', skill: { name: 'Python', category: 'Programming' }, type: 'offered' },
      { id: 'skill5', skill: { name: 'React', category: 'Frontend' }, type: 'wanted' }
    ]
  },
  {
    id: 'user3',
    name: 'Emma Wilson',
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    location: 'Austin, TX',
    bio: 'UI/UX designer and frontend developer. Creating beautiful user experiences and teaching design principles.',
    skillsOffered: ['UI/UX Design', 'Figma', 'CSS', 'Design Systems'],
    skillsWanted: ['Node.js', 'Backend Development', 'Database Design'],
    rating: 4.9,
    maxRating: 5,
    availability: 'busy',
    totalSwaps: 15,
    userSkills: [
      { id: 'skill6', skill: { name: 'UI/UX Design', category: 'Design' }, type: 'offered' },
      { id: 'skill7', skill: { name: 'Node.js', category: 'Backend' }, type: 'wanted' }
    ]
  },
  {
    id: 'user4',
    name: 'Alex Rodriguez',
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    location: 'Seattle, WA',
    bio: 'Backend developer specializing in scalable systems and cloud architecture. Always learning!',
    skillsOffered: ['Node.js', 'AWS', 'Docker', 'MongoDB'],
    skillsWanted: ['Design', 'Frontend Development', 'User Research'],
    rating: 4.2,
    maxRating: 5,
    availability: 'available',
    totalSwaps: 5,
    userSkills: [
      { id: 'skill8', skill: { name: 'Node.js', category: 'Backend' }, type: 'offered' },
      { id: 'skill9', skill: { name: 'Design', category: 'Creative' }, type: 'wanted' }
    ]
  },
  {
    id: 'user5',
    name: 'David Kim',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    location: 'Boston, MA',
    bio: 'Machine learning engineer and data scientist. Building AI solutions and teaching ML concepts.',
    skillsOffered: ['Machine Learning', 'TensorFlow', 'Python', 'Data Analysis'],
    skillsWanted: ['React', 'Web Development', 'JavaScript'],
    rating: 4.0,
    maxRating: 5,
    availability: 'offline',
    totalSwaps: 3,
    userSkills: [
      { id: 'skill10', skill: { name: 'Machine Learning', category: 'AI' }, type: 'offered' },
      { id: 'skill11', skill: { name: 'React', category: 'Frontend' }, type: 'wanted' }
    ]
  },
  {
    id: 'user6',
    name: 'Lisa Thompson',
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    location: 'Portland, OR',
    bio: 'DevOps engineer and cloud specialist. Helping teams build reliable, scalable infrastructure.',
    skillsOffered: ['DevOps', 'Kubernetes', 'AWS', 'CI/CD'],
    skillsWanted: ['Python', 'Data Science', 'Machine Learning'],
    rating: 4.7,
    maxRating: 5,
    availability: 'available',
    totalSwaps: 9,
    userSkills: [
      { id: 'skill12', skill: { name: 'DevOps', category: 'Infrastructure' }, type: 'offered' },
      { id: 'skill13', skill: { name: 'Python', category: 'Programming' }, type: 'wanted' }
    ]
  }
]

export default function SkillSwapPage() {
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
  const [users, setUsers] = useState<UserProfile[]>(demoUsers)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const usersPerPage = 6

  // Use static data instead of fetching
  useEffect(() => {
    setUsers(demoUsers)
  }, [])

  const handleRequest = (userId: string, userName: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setSelectedUser(user)
      setShowRequestModal(true)
    }
  }

  const handleSubmitRequest = async () => {
    if (!selectedUser) return

    try {
      // Simulate API call for demo
      toast({
        title: "Swap Request Sent!",
        description: `Your swap request has been sent to ${selectedUser.name}. They will be notified and can accept or reject your request.`,
      })
      setShowRequestModal(false)
      setSelectedUser(null)
      setRequestData({ offeredSkill: '', wantedSkill: '', message: '' })
    } catch (error) {
      console.error('Error creating swap request:', error)
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive",
      })
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

  // Filter users based on search and availability
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesAvailability = selectedAvailability === 'all' || user.availability === selectedAvailability
    
    return matchesSearch && matchesAvailability
  })

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                SkillSync
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/dashboard/browse" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Browse
              </Link>
              <Link href="/dashboard/swaps" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                My Swaps
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Skill Swap</h1>
          <p className="text-lg text-gray-600">Find skilled professionals and exchange knowledge with them.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search users, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-base"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="h-12 border border-gray-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white min-w-[160px]"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentUsers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <User className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your search or filters to find more users.</p>
            </div>
          ) : (
            currentUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={user.profilePhoto}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          user.availability === 'available' ? 'bg-green-500' : 
                          user.availability === 'busy' ? 'bg-orange-500' : 'bg-gray-500'
                        }`}></div>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        {user.location && (
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {user.location}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge className={getAvailabilityColor(user.availability)}>
                      {user.availability}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {user.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">{user.bio}</p>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{user.rating}</span>
                    <span className="text-gray-500">/ {user.maxRating}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{user.totalSwaps} swaps</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Offers</h4>
                      <div className="flex flex-wrap gap-1">
                        {user.skillsOffered.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {user.skillsOffered.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.skillsOffered.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Wants</h4>
                      <div className="flex flex-wrap gap-1">
                        {user.skillsWanted.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {user.skillsWanted.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.skillsWanted.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleRequest(user.id, user.name)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Request Swap
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
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
                disabled={currentUsers.length < usersPerPage}
                className="px-4 py-2"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Swap Request Modal */}
        <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Request Skill Swap with {selectedUser?.name}</DialogTitle>
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
              
              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleCloseModals} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSubmitRequest} className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
} 