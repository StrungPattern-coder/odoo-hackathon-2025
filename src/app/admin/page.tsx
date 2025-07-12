'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Send,
  Shield,
  Activity,
  LogOut,
  Plus,
  Trash2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface AdminStats {
  totalUsers: number
  pendingSwaps: number
  completedSwaps: number
  bannedUsers: number
}

interface User {
  id: string
  name: string
  email: string
  isBanned: boolean
  totalSwaps: number
  rating: number
}

interface SwapRequest {
  id: string
  requesterName: string
  providerName: string
  status: string
  createdAt: string
}

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    pendingSwaps: 0,
    completedSwaps: 0,
    bannedUsers: 0
  })
  const [users, setUsers] = useState<User[]>([])
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([])
  const [adminMessage, setAdminMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Remove authentication check and directly fetch admin data
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)

      // Fetch stats
      const [usersResult, swapsResult] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('swap_requests').select('*')
      ])

      if (usersResult.data) {
        const totalUsers = usersResult.data.length
        const bannedUsers = usersResult.data.filter(u => u.is_banned).length
        
        setStats({
          totalUsers,
          pendingSwaps: swapsResult.data?.filter(s => s.status === 'pending').length || 0,
          completedSwaps: swapsResult.data?.filter(s => s.status === 'completed').length || 0,
          bannedUsers
        })

        // Transform users for display
        const transformedUsers = usersResult.data.slice(0, 10).map(user => ({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          isBanned: user.is_banned || false,
          totalSwaps: user.total_swaps_completed || 0,
          rating: user.average_rating || 0
        }))
        setUsers(transformedUsers)
      }

      // Transform swap requests for display
      if (swapsResult.data) {
        const transformedSwaps = swapsResult.data.slice(0, 10).map(swap => ({
          id: swap.id,
          requesterName: 'User', // You'd need to join with users table for real names
          providerName: 'User',
          status: swap.status,
          createdAt: new Date(swap.created_at).toLocaleDateString()
        }))
        setSwapRequests(transformedSwaps)
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBanUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_banned: true })
        .eq('id', userId)

      if (error) {
        console.error('Error banning user:', error)
        return
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isBanned: true } : user
      ))
      setStats(prev => ({ ...prev, bannedUsers: prev.bannedUsers + 1 }))
    } catch (error) {
      console.error('Error banning user:', error)
    }
  }

  const handleUnbanUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_banned: false })
        .eq('id', userId)

      if (error) {
        console.error('Error unbanning user:', error)
        return
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isBanned: false } : user
      ))
      setStats(prev => ({ ...prev, bannedUsers: prev.bannedUsers - 1 }))
    } catch (error) {
      console.error('Error unbanning user:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!adminMessage.trim()) return

    try {
      // Create platform message
      const { error } = await supabase
        .from('platform_messages')
        .insert({
          title: 'Platform Announcement',
          content: adminMessage,
          type: 'info',
          is_active: true
        })

      if (error) {
        console.error('Error sending message:', error)
        return
      }

      alert('Platform message sent successfully!')
      setAdminMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleLogout = () => {
    router.push('/sign-in')
  }

  const handleDashboard = () => {
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage the SkillSync platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Admin Access
              </Badge>
              <Button variant="outline" onClick={handleDashboard}>
                Dashboard
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Swaps</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingSwaps}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Swaps</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedSwaps}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Banned Users</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.bannedUsers}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No users found</p>
                ) : (
                  users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">{user.totalSwaps} swaps</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{user.rating} rating</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {user.isBanned ? (
                          <Badge variant="destructive">Banned</Badge>
                        ) : (
                          <Badge variant="secondary">Active</Badge>
                        )}
                        {user.isBanned ? (
                          <Button size="sm" onClick={() => handleUnbanUser(user.id)}>
                            Unban
                          </Button>
                        ) : (
                          <Button size="sm" variant="destructive" onClick={() => handleBanUser(user.id)}>
                            Ban
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Swap Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Swap Monitoring</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {swapRequests.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No swap requests found</p>
                ) : (
                  swapRequests.map((swap) => (
                    <div key={swap.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{swap.requesterName} ↔ {swap.providerName}</h3>
                        <p className="text-sm text-gray-500">{swap.createdAt}</p>
                      </div>
                      <Badge 
                        variant={swap.status === 'pending' ? 'secondary' : 
                                swap.status === 'accepted' ? 'default' : 'destructive'}
                      >
                        {swap.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Messages */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Send Platform Message</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your platform-wide message (e.g., feature updates, downtime alerts)..."
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end">
                <Button onClick={handleSendMessage} disabled={!adminMessage.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Skill Category
              </Button>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                View All Users
              </Button>
              <Button variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 