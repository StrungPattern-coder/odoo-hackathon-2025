'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Users, 
  Book, 
  MessageSquare, 
  Settings,
  Menu,
  X,
  Zap,
  User
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Browse Skills', href: '/dashboard/browse', icon: Book },
  { name: 'My Skills', href: '/dashboard/skills', icon: Users },
  { name: 'Swaps', href: '/dashboard/swaps', icon: MessageSquare },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-[#8F6CD9]/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <Link href="/" className="flex items-center space-x-2 cursor-pointer">
              <div className="p-2 button-gradient rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">
                SkillSync
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors',
                      isActive
                        ? 'border-[#8F6CD9] text-[#340773]'
                        : 'border-transparent text-gray-500 hover:text-[#8F6CD9] hover:border-[#8F6CD9]/30'
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* User Menu and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/profile">
              <Button variant="outline" size="sm" className="flex items-center gap-2 border-[#8F6CD9] text-[#340773] hover:bg-[#8F6CD9] hover:text-white transition-all duration-300">
                <User className="h-4 w-4" />
                My Profile
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-[#8F6CD9]/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 bg-white border-t border-[#8F6CD9]/20">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-4 py-2 text-base font-medium transition-colors',
                    isActive
                      ? 'bg-[#8F6CD9]/10 text-[#340773] border-r-4 border-[#8F6CD9]'
                      : 'text-gray-600 hover:bg-[#8F6CD9]/5 hover:text-[#8F6CD9]'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
            
            {/* Profile Link in Mobile Menu */}
            <Link
              href="/dashboard/profile"
              className={cn(
                'flex items-center px-4 py-2 text-base font-medium transition-colors',
                pathname === '/dashboard/profile'
                  ? 'bg-[#8F6CD9]/10 text-[#340773] border-r-4 border-[#8F6CD9]'
                  : 'text-gray-600 hover:bg-[#8F6CD9]/5 hover:text-[#8F6CD9]'
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="h-5 w-5 mr-3" />
              My Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
