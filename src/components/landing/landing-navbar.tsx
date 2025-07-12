'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignInButton, SignUpButton, useUser, useClerk } from '@clerk/nextjs'
import { Menu, X, Zap, User } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'About', href: '#about' },
]

export function LandingNavbar() {
  const { isSignedIn } = useUser()
  const clerk = useClerk()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SkillSync
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium rounded-full hover:bg-blue-50"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isSignedIn ? (
              <>
                <Button asChild variant="outline" className="rounded-full flex items-center gap-2">
                  <Link href="/dashboard/profile">
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                </Button>
                <Button asChild className="rounded-full">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="outline" onClick={async () => { await clerk.signOut(); window.location.href = '/sign-in'; }} className="rounded-full">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="rounded-full">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="rounded-full">Get Started</Button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium rounded-full hover:bg-blue-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                {isSignedIn ? (
                  <div className="flex flex-col space-y-2">
                    <Button asChild variant="outline" className="rounded-full flex items-center gap-2">
                      <Link href="/dashboard/profile">
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                    </Button>
                    <Button asChild className="rounded-full">
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="outline" className="rounded-full" onClick={async () => { await clerk.signOut(); window.location.href = '/sign-in'; }}>
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <SignInButton mode="modal">
                      <Button variant="ghost" className="rounded-full">Sign In</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="rounded-full">Get Started</Button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
