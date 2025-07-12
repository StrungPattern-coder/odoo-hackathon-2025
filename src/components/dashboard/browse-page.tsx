'use client'

import { useState } from 'react'
import { Search, Star, Filter, User, X, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'

interface UserProfile {
  id: string
  name: string
  profilePhoto: string
  skillsOffered: string[]
  skillsWanted: string[]
  rating: number
  maxRating: number
  availability: 'available' | 'busy' | 'offline'
}

const mockUsers: UserProfile[] = [
  {
    id: '1',
    name: 'Marc Demo',
    profilePhoto: '/api/placeholder/120/120',
    skillsOffered: ['JavaScript', 'Python'],
    skillsWanted: ['Artwork', 'Graphic Design'],
    rating: 3.4,
    maxRating: 5,
    availability: 'available'
  },
  {
    id: '2',
    name: 'Michelle',
    profilePhoto: '/api/placeholder/120/120',
    skillsOffered: ['JavaScript', 'Python'],
    skillsWanted: ['Marketing', 'Graphic Design'],
    rating: 2.5,
    maxRating: 5,
    availability: 'available'
  },
  {
    id: '3',
    name: 'Joe Wills',
    profilePhoto: '/api/placeholder/120/120',
    skillsOffered: ['JavaScript', 'Python'],
    skillsWanted: ['Backend', 'Graphic Design'],
    rating: 4.0,
    maxRating: 5,
    availability: 'available'
  },
  {
    id: '4',
    name: 'Sarah Chen',
    profilePhoto: '/api/placeholder/120/120',
    skillsOffered: ['React', 'UI/UX Design'],
    skillsWanted: ['Node.js', 'DevOps'],
    rating: 4.8,
    maxRating: 5,
    availability: 'busy'
  },
  {
    id: '5',
    name: 'Alex Rodriguez',
    profilePhoto: '/api/placeholder/120/120',
    skillsOffered: ['Machine Learning', 'Data Analysis'],
    skillsWanted: ['Frontend', 'Mobile Dev'],
    rating: 4.2,
    maxRating: 5,
    availability: 'available'
  },
  {
    id: '6',
    name: 'Emma Johnson',
    profilePhoto: '/api/placeholder/120/120',
    skillsOffered: ['Graphic Design', 'Illustration'],
    skillsWanted: ['Web Development', 'Animation'],
    rating: 3.9,
    maxRating: 5,
    availability: 'available'
  }
]

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [requestData, setRequestData] = useState({
    offeredSkill: '',
    wantedSkill: '',
    message: ''
  })
  const usersPerPage = 3
  
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesAvailability = selectedAvailability === 'all' || user.availability === selectedAvailability
    
    return matchesSearch && matchesAvailability
  })

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  )

  const handleRequest = (userId: string, userName: string) => {
    const user = mockUsers.find(u => u.id === userId)
    if (user) {
      setSelectedUser(user)
      setShowRequestModal(true)
    }
  }

  const handleShowRequestForm = () => {
    setShowRequestModal(false)
    setShowRequestForm(true)
  }

  const handleSubmitRequest = () => {
    console.log('Submitting request:', {
      user: selectedUser?.name,
      ...requestData
    })
    // Here you would typically send the request to your backend
    setShowRequestForm(false)
    setSelectedUser(null)
    setRequestData({ offeredSkill: '', wantedSkill: '', message: '' })
    // Show success message
    alert('Request sent successfully!')
  }

  const handleCloseModals = () => {
    setShowRequestModal(false)
    setShowRequestForm(false)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Users</h1>
          <p className="text-lg text-gray-600">Find skilled professionals to exchange knowledge with.</p>
        </div>

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

        {/* User Cards */}
        <div className="space-y-6 mb-10">
          {currentUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-6 flex-1">
                    {/* Profile Photo */}
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white shadow-sm ${
                        user.availability === 'available' ? 'bg-green-500' : 
                        user.availability === 'busy' ? 'bg-orange-500' : 'bg-gray-500'
                      }`}></div>
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-2xl font-semibold text-gray-900">{user.name}</h3>
                        <Badge variant="secondary" className={`${getAvailabilityColor(user.availability)} font-medium px-3 py-1`}>
                          {user.availability}
                        </Badge>
                      </div>
                      
                      {/* Skills Offered */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Skills Offered</h4>
                        <div className="flex flex-wrap gap-2">
                          {user.skillsOffered.map((skill, index) => (
                            <Badge key={index} className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-medium px-3 py-1.5">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Skills Wanted */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Skills Wanted</h4>
                        <div className="flex flex-wrap gap-2">
                          {user.skillsWanted.map((skill, index) => (
                            <Badge key={index} variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 font-medium px-3 py-1.5">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Request Button and Rating */}
                  <div className="flex flex-col items-end space-y-4 flex-shrink-0 ml-6">
                    <Button
                      onClick={() => handleRequest(user.id, user.name)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-medium shadow-sm hover:shadow-md transition-all"
                    >
                      Request Swap
                    </Button>
                    
                    <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900 text-base">
                        {user.rating}
                      </span>
                      <span className="text-gray-500">/ {user.maxRating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-2.5 font-medium"
                >
                  Previous
                </Button>
                
                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className={`w-12 h-12 p-0 font-medium ${currentPage === page ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-6 py-2.5 font-medium"
                >
                  Next
                </Button>
              </div>
              
              <div className="text-base text-gray-600 font-medium">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredUsers.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No users found</h3>
            <p className="text-gray-600 text-lg">Try adjusting your search or filters to find more users</p>
          </div>
        )}
      </main>

      {/* User Detail Modal */}
      {showRequestModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
                <Button variant="ghost" onClick={handleCloseModals} className="p-2">
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* User Info */}
              <div className="flex items-start space-x-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {selectedUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-3xl font-bold text-gray-900">{selectedUser.name}</h3>
                    <Badge variant="secondary" className={`${getAvailabilityColor(selectedUser.availability)} font-medium px-3 py-1`}>
                      {selectedUser.availability}
                    </Badge>
                  </div>
                  <div className="inline-flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900 text-base">
                      {selectedUser.rating}
                    </span>
                    <span className="text-gray-500">/ {selectedUser.maxRating}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Skills Offered</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedUser.skillsOffered.map((skill, index) => (
                      <Badge key={index} className="bg-blue-50 text-blue-700 border border-blue-200 font-medium px-4 py-2 text-base">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Skills Wanted</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedUser.skillsWanted.map((skill, index) => (
                      <Badge key={index} variant="outline" className="border-purple-200 text-purple-700 font-medium px-4 py-2 text-base">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rating and Feedback Section */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Rating and Feedback</h4>
                <p className="text-gray-600">User rating and feedback information would be displayed here.</p>
              </div>

              {/* Action Button */}
              <Button 
                onClick={handleShowRequestForm}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold"
              >
                Request Skill Swap
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Request Form Modal */}
      {showRequestForm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Send Request</h2>
                <Button variant="ghost" onClick={handleCloseModals} className="p-2">
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Offered Skill Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Choose one of your offered skills
                  </label>
                  <select
                    value={requestData.offeredSkill}
                    onChange={(e) => setRequestData({...requestData, offeredSkill: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a skill...</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="React">React</option>
                    <option value="Node.js">Node.js</option>
                  </select>
                </div>

                {/* Wanted Skill Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Choose one of their wanted skills
                  </label>
                  <select
                    value={requestData.wantedSkill}
                    onChange={(e) => setRequestData({...requestData, wantedSkill: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a skill...</option>
                    {selectedUser.skillsWanted.map((skill, index) => (
                      <option key={index} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    value={requestData.message}
                    onChange={(e) => setRequestData({...requestData, message: e.target.value})}
                    placeholder="Write a message to introduce yourself and explain your request..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  onClick={handleSubmitRequest}
                  disabled={!requestData.offeredSkill || !requestData.wantedSkill || !requestData.message.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 text-lg font-semibold"
                >
                  Send Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
