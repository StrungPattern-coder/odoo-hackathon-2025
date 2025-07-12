'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getUserSwapRequests } from '@/lib/services/user-service'
import { SwapRequest } from '@/types'
import { TrendingUp, Users, BookOpen, MessageSquare } from 'lucide-react'

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalSwaps: 0,
    pendingRequests: 0,
    skillsOffered: 0,
    skillsWanted: 0,
    loading: true
  })

  useEffect(() => {
    async function loadStats() {
      try {
        const swapRequests = await getUserSwapRequests()
        
        setStats({
          totalSwaps: swapRequests.filter(r => r.status === 'completed').length,
          pendingRequests: swapRequests.filter(r => r.status === 'pending').length,
          skillsOffered: 0, // Will be loaded from user skills
          skillsWanted: 0,  // Will be loaded from user skills
          loading: false
        })
      } catch (error) {
        console.error('Error loading stats:', error)
        setStats(prev => ({ ...prev, loading: false }))
      }
    }

    loadStats()
  }, [])

  const statCards = [
    {
      title: 'Total Swaps',
      value: stats.totalSwaps,
      icon: TrendingUp,
      color: 'text-[#A68A56]',
      bgColor: 'bg-[#A68A56]/10'
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: MessageSquare,
      color: 'text-[#8F6CD9]',
      bgColor: 'bg-[#8F6CD9]/10'
    },
    {
      title: 'Skills Offered',
      value: stats.skillsOffered,
      icon: BookOpen,
      color: 'text-[#340773]',
      bgColor: 'bg-[#340773]/10'
    },
    {
      title: 'Skills Wanted',
      value: stats.skillsWanted,
      icon: Users,
      color: 'text-[#8F6CD9]',
      bgColor: 'bg-[#8F6CD9]/10'
    }
  ]

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse card-gradient border border-[#8F6CD9]/20">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.title} className="card-gradient border border-[#8F6CD9]/20 hover:border-[#8F6CD9]/40 transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#340773]">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#340773]">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
