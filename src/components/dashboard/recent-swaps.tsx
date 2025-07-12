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
        setSwaps(swapRequests.slice(0, 5)) // Show only recent 5
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
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Swaps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Swaps</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/swaps">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {swaps.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No swaps yet</h3>
            <p className="text-gray-600 mb-4">Start by browsing skills or creating your first swap request.</p>
            <Button asChild>
              <Link href="/dashboard/browse">Browse Skills</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {swaps.map((swap) => (
              <div key={swap.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getStatusColor(swap.status)}>
                        {getStatusIcon(swap.status)}
                        <span className="ml-1 capitalize">{swap.status}</span>
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(swap.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      <p className="font-medium">
                        {swap.requester_skill?.skill?.name} ↔ {swap.provider_skill?.skill?.name}
                      </p>
                      <p className="text-gray-600 mt-1">
                        with {swap.provider?.first_name} {swap.provider?.last_name}
                      </p>
                      {swap.message && (
                        <p className="text-gray-500 mt-2 text-xs italic">
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
