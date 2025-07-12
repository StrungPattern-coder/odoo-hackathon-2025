'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getUserSwapRequests } from '@/lib/services/user-service'
import { SwapRequest } from '@/types'
import { MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

export function RecentSwaps() {
  const [swaps, setSwaps] = useState<SwapRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSwaps() {
      try {
        const swapRequests = await getUserSwapRequests()
        setSwaps(swapRequests.slice(0, 8)) // Show more swaps now that we have full width
      } catch (error) {
        console.error('Error loading swaps:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSwaps()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'swap-status-pending'
      case 'accepted':
        return 'swap-status-accepted'
      case 'completed':
        return 'swap-status-accepted'
      case 'rejected':
        return 'swap-status-rejected'
      default:
        return 'swap-status-cancelled'
    }
  }

  if (loading) {
    return (
      <Card className="card-gradient border border-[#8F6CD9]/20">
        <CardHeader>
          <CardTitle className="text-[#340773]">Recent Swaps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-gradient border border-[#8F6CD9]/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#340773]">Recent Swaps</CardTitle>
        <Button variant="outline" size="sm" asChild className="border-[#8F6CD9] text-[#340773] hover:bg-[#8F6CD9] hover:text-white transition-all duration-300">
          <Link href="/dashboard/swaps">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {swaps.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-[#8F6CD9] mx-auto mb-6" />
            <h3 className="text-xl font-medium text-[#340773] mb-3">No swaps yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Start by browsing skills or creating your first swap request to begin your learning journey.</p>
            <Button asChild className="button-gradient text-white hover:shadow-lg px-8 py-3">
              <Link href="/dashboard/browse">Browse Skills</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {swaps.map((swap) => (
              <div key={swap.id} className="border border-[#8F6CD9]/20 rounded-lg p-4 hover:bg-[#8F6CD9]/5 transition-all duration-300 bg-white/50 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge className={getStatusColor(swap.status)}>
                        {getStatusIcon(swap.status)}
                        <span className="ml-1 capitalize">{swap.status}</span>
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(swap.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      <p className="font-medium text-[#340773] text-base">
                        {swap.requester_skill?.skill?.name} ↔ {swap.provider_skill?.skill?.name}
                      </p>
                      <p className="text-gray-600 mt-2">
                        with {swap.provider?.first_name} {swap.provider?.last_name}
                      </p>
                      {swap.message && (
                        <p className="text-gray-500 mt-3 text-xs italic bg-gray-50 p-2 rounded">
                          "{swap.message}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
