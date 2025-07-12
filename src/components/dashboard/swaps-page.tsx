'use client'

import { useState } from 'react'
import { Search, User, Check, X, Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'

interface SwapRequest {
  id: string
  requesterName: string
  requesterPhoto: string
  skillOffered: string
  skillWanted: string
  rating: number
  maxRating: number
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  createdAt: string
}

const mockSwapRequests: SwapRequest[] = [
  {
    id: '1',
    requesterName: 'Marc Demo',
    requesterPhoto: '/api/placeholder/120/120',
    skillOffered: 'Java Script',
    skillWanted: 'Kotlin',
    rating: 3.4,
    maxRating: 5,
    status: 'pending',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    requesterName: 'Sarah Chen',
    requesterPhoto: '/api/placeholder/120/120',
    skillOffered: 'React',
    skillWanted: 'UI/UX Design',
    rating: 4.8,
    maxRating: 5,
    status: 'rejected',
    createdAt: '2024-01-14'
  },
  {
    id: '3',
    requesterName: 'Alex Rodriguez',
    requesterPhoto: '/api/placeholder/120/120',
    skillOffered: 'Python',
    skillWanted: 'Machine Learning',
    rating: 4.2,
    maxRating: 5,
    status: 'pending',
    createdAt: '2024-01-13'
  },
  {
    id: '4',
    requesterName: 'Emma Johnson',
    requesterPhoto: '/api/placeholder/120/120',
    skillOffered: 'Graphic Design',
    skillWanted: 'Web Development',
    rating: 3.9,
    maxRating: 5,
    status: 'accepted',
    createdAt: '2024-01-12'
  },
  {
    id: '5',
    requesterName: 'Joe Wilson',
    requesterPhoto: '/api/placeholder/120/120',
    skillOffered: 'Node.js',
    skillWanted: 'DevOps',
    rating: 4.1,
    maxRating: 5,
    status: 'completed',
    createdAt: '2024-01-11'
  }
]

export default function SwapsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const requestsPerPage = 3

  const filteredRequests = mockSwapRequests.filter(request => {
    const matchesSearch = request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.skillOffered.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.skillWanted.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage)
  const currentRequests = filteredRequests.slice(
    (currentPage - 1) * requestsPerPage,
    currentPage * requestsPerPage
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'accepted':
        return <Check className="w-4 h-4" />
      case 'rejected':
        return <X className="w-4 h-4" />
      case 'completed':
        return <Check className="w-4 h-4" />
      default:
        return null
    }
  }

  const handleAccept = (requestId: string) => {
    console.log('Accepting request:', requestId)
    // Here you would update the request status in your backend
  }

  const handleReject = (requestId: string) => {
    console.log('Rejecting request:', requestId)
    // Here you would update the request status in your backend
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Swap Requests</h1>
          <p className="text-lg text-gray-600">Manage your skill swap requests and responses.</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search requests, skills, users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-base"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-12 border border-gray-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[160px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Swap Request Cards */}
        <div className="space-y-6 mb-10">
          {currentRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-6 flex-1">
                    {/* Profile Photo */}
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {request.requesterName.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    
                    {/* Request Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-2xl font-semibold text-gray-900">{request.requesterName}</h3>
                        <Badge className={`${getStatusColor(request.status)} font-medium px-3 py-1.5 border`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(request.status)}
                            <span className="capitalize">{request.status}</span>
                          </div>
                        </Badge>
                      </div>
                      
                      {/* Skills Exchange */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Skills Exchange</h4>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500 mb-1">Skills Offered →</span>
                            <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-medium px-3 py-1.5">
                              {request.skillOffered}
                            </Badge>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500 mb-1">Skills Wanted →</span>
                            <Badge variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 font-medium px-3 py-1.5">
                              {request.skillWanted}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 w-fit">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-900 text-base">
                          {request.rating}
                        </span>
                        <span className="text-gray-500">/ {request.maxRating}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col items-end space-y-4 flex-shrink-0 ml-6">
                    {request.status === 'pending' && (
                      <div className="flex space-x-3">
                        <Button
                          onClick={() => handleAccept(request.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 text-base font-medium shadow-sm hover:shadow-md transition-all"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleReject(request.id)}
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-6 py-2.5 text-base font-medium"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                    
                    {request.status === 'accepted' && (
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-medium shadow-sm hover:shadow-md transition-all">
                        Start Chat
                      </Button>
                    )}
                    
                    {request.status === 'completed' && (
                      <Button variant="outline" className="px-8 py-3 text-base font-medium">
                        View Details
                      </Button>
                    )}
                    
                    <div className="text-sm text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
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
        {filteredRequests.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No swap requests found</h3>
            <p className="text-gray-600 text-lg">Try adjusting your search or filters to find more requests</p>
          </div>
        )}
      </main>
    </div>
  )
}
