'use client'

import { useState, useEffect } from 'react'
import { Search, User, Check, X, Clock, Star, Trash2, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { useCurrentUser } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase'
import { SwapRequest } from '@/types'

export default function SwapsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { supabaseUser } = useCurrentUser()
  const requestsPerPage = 5

  // Fetch swap requests
  const fetchSwapRequests = async () => {
    if (!supabaseUser) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: supabaseError } = await supabase
        .from('swap_requests')
        .select(`
          *,
          requester:users!requester_id(*),
          provider:users!provider_id(*),
          requester_skill:user_skills!requester_skill_id(*, skill:skills(*)),
          provider_skill:user_skills!provider_skill_id(*, skill:skills(*))
        `)
        .or(`requester_id.eq.${supabaseUser.id},provider_id.eq.${supabaseUser.id}`)
        .order('created_at', { ascending: false })

      if (supabaseError) {
        setError(supabaseError.message)
        setSwapRequests([])
      } else {
        setSwapRequests(data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setSwapRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSwapRequests()

    // Set up real-time subscription
    if (supabaseUser) {
      const subscription = supabase
        .channel('swap_requests')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'swap_requests',
            filter: `requester_id=eq.${supabaseUser.id},provider_id=eq.${supabaseUser.id}`,
          },
          () => {
            fetchSwapRequests()
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [supabaseUser])

  const filteredRequests = swapRequests.filter(request => {
    const requesterName = request.requester ? `${request.requester.first_name} ${request.requester.last_name}` : ''
    const providerName = request.provider ? `${request.provider.first_name} ${request.provider.last_name}` : ''
    const requesterSkill = request.requester_skill?.skill?.name || ''
    const providerSkill = request.provider_skill?.skill?.name || ''
    
    const matchesSearch = requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      requesterSkill.toLowerCase().includes(searchTerm.toLowerCase()) ||
      providerSkill.toLowerCase().includes(searchTerm.toLowerCase())
    
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
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200'
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
      case 'cancelled':
        return <X className="w-4 h-4" />
      default:
        return null
    }
  }

  const handleAccept = async (requestId: string) => {
    try {
      const response = await fetch(`/api/swaps/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'accepted' }),
      })

      if (!response.ok) {
        throw new Error('Failed to accept request')
      }

      // The real-time subscription will automatically update the UI
    } catch (error) {
      console.error('Error accepting request:', error)
      setError('Failed to accept request')
    }
  }

  const handleReject = async (requestId: string) => {
    try {
      const response = await fetch(`/api/swaps/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' }),
      })

      if (!response.ok) {
        throw new Error('Failed to reject request')
      }

      // The real-time subscription will automatically update the UI
    } catch (error) {
      console.error('Error rejecting request:', error)
      setError('Failed to reject request')
    }
  }

  const handleDelete = async (requestId: string) => {
    try {
      const response = await fetch(`/api/swaps/${requestId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete request')
      }

      // The real-time subscription will automatically update the UI
    } catch (error) {
      console.error('Error deleting request:', error)
      setError('Failed to delete request')
    }
  }

  const isUserRequester = (request: SwapRequest) => {
    return request.requester_id === supabaseUser?.id
  }

  const canUserAct = (request: SwapRequest) => {
    if (request.status !== 'pending') return false
    return isUserRequester(request) || request.provider_id === supabaseUser?.id
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading swap requests...</p>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Swap Requests</h1>
          <p className="text-lg text-gray-600">Manage your skill swap requests and responses.</p>
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
                className="h-12 border border-gray-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white w-full sm:min-w-[160px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Swap Requests List */}
        <div className="space-y-6">
          {currentRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <MessageSquare className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No swap requests found</h3>
              <p className="text-gray-600">You don't have any swap requests matching your criteria.</p>
            </div>
          ) : (
            currentRequests.map((request) => {
              const requesterName = request.requester ? `${request.requester.first_name} ${request.requester.last_name}` : 'Unknown User'
              const providerName = request.provider ? `${request.provider.first_name} ${request.provider.last_name}` : 'Unknown User'
              const requesterSkill = request.requester_skill?.skill?.name || 'Unknown Skill'
              const providerSkill = request.provider_skill?.skill?.name || 'Unknown Skill'
              const requesterPhoto = request.requester?.image_url || '/api/placeholder/120/120'
              const providerPhoto = request.provider?.image_url || '/api/placeholder/120/120'
              
              return (
                <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
                  <div className="p-4 sm:p-6">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        {/* User Info */}
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="relative flex-shrink-0">
                            <img
                              src={requesterPhoto}
                              alt={requesterName}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{requesterName}</h3>
                            <p className="text-xs sm:text-sm text-gray-500">wants to swap</p>
                          </div>
                        </div>
                        
                        {/* Skills Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                          <div className="flex flex-col xs:flex-row xs:items-center gap-2">
                            <Badge variant="secondary" className="px-2 py-1 text-xs sm:text-sm w-fit">
                              {requesterSkill}
                            </Badge>
                            <span className="text-gray-400 hidden xs:inline">↔</span>
                            <span className="text-gray-400 xs:hidden text-center">↓</span>
                            <Badge variant="secondary" className="px-2 py-1 text-xs sm:text-sm w-fit">
                              {providerSkill}
                            </Badge>
                          </div>
                          
                          {/* Rating */}
                          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-2 py-1 sm:px-3 sm:py-2 w-fit">
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-gray-900 text-sm sm:text-base">
                              {request.requester?.average_rating || 0}
                            </span>
                            <span className="text-gray-500 text-xs sm:text-sm">/ 5</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="flex justify-between sm:justify-end items-center">
                        <Badge className={getStatusColor(request.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(request.status)}
                            <span className="capitalize text-xs sm:text-sm">{request.status}</span>
                          </div>
                        </Badge>
                        <span className="text-xs sm:text-sm text-gray-500 sm:hidden">
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Message Section */}
                    {request.message && (
                      <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 text-sm sm:text-base">{request.message}</p>
                      </div>
                    )}
                    
                    {/* Footer Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="hidden sm:flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      {canUserAct(request) && (
                        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
                          {!isUserRequester(request) && (
                            <>
                              <Button
                                onClick={() => handleAccept(request.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-medium shadow-sm hover:shadow-md transition-all w-full xs:w-auto"
                              >
                                <Check className="w-4 h-4 mr-1 sm:mr-2" />
                                Accept
                              </Button>
                              <Button
                                onClick={() => handleReject(request.id)}
                                variant="outline"
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-medium w-full xs:w-auto"
                              >
                                <X className="w-4 h-4 mr-1 sm:mr-2" />
                                Reject
                              </Button>
                            </>
                          )}
                          {isUserRequester(request) && (
                            <Button
                              onClick={() => handleDelete(request.id)}
                              variant="outline"
                              className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-medium w-full xs:w-auto"
                            >
                              <Trash2 className="w-4 h-4 mr-1 sm:mr-2" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      )}
                      
                      {request.status === 'accepted' && (
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium shadow-sm hover:shadow-md transition-all w-full sm:w-auto">
                          Start Chat
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base"
              >
                Previous
              </Button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="px-2 sm:px-3 py-2 text-sm sm:text-base w-8 sm:w-auto"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base"
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
