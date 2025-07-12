'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SignUp } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, CheckCircle, AlertTriangle, UserPlus } from 'lucide-react'

export default function AdminSetupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: 'admin@skillswap.com',
    first_name: 'Admin',
    last_name: 'User'
  })
  const [loading, setLoading] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    credentials?: { email: string; password: string }
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          credentials: data.credentials
        })
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to create admin user'
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error occurred'
      })
    } finally {
      setLoading(false)
    }
  }

  if (showSignUp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Admin Sign Up</CardTitle>
            <p className="text-gray-600 text-sm">
              Create your Clerk account to access admin features
            </p>
          </CardHeader>
          
          <CardContent>
            <SignUp 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                  card: 'shadow-none',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden'
                }
              }}
            />
            
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                onClick={() => setShowSignUp(false)}
                className="text-sm"
              >
                Back to Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Admin Setup</CardTitle>
          <p className="text-gray-600 text-sm">
            Create an admin account for development purposes
          </p>
        </CardHeader>
        
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
                  {result.message}
                </AlertDescription>
              </Alert>
              
              {result.success && result.credentials && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Login Credentials:</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-blue-800">Email:</span> {result.credentials.email}
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Password:</span> {result.credentials.password}
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-yellow-800 text-xs">
                      ⚠️ Use these credentials to sign up with Clerk, then you'll have admin access.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setResult(null)}
                  className="flex-1"
                >
                  Create Another
                </Button>
                <Button 
                  onClick={() => setShowSignUp(true)}
                  className="flex-1"
                >
                  Sign Up with Clerk
                </Button>
              </div>
              
              <div className="text-center">
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={() => router.push('/admin')}
                  className="text-sm"
                >
                  Already have admin access? Go to Admin Dashboard
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Admin...' : 'Create Admin User'}
              </Button>
              
              <div className="text-center">
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={() => router.push('/admin')}
                  className="text-sm"
                >
                  Already have admin access? Go to Admin Dashboard
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 