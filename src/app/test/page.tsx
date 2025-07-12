import { AuthTestComponent } from '@/components/test/AuthTestComponent'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">🧪 Integration Test Page</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This page tests the Clerk + Supabase integration. Sign in to see your synchronized data.
            </p>
          </CardContent>
        </Card>

        <AuthTestComponent />
      </div>
    </div>
  )
}
