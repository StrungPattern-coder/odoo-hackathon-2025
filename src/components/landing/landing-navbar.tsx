'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignInButton, SignUpButton, useUser, useClerk } from '@clerk/nextjs'
import { Menu, X, Zap, User } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function LandingNavbar() {
  const { isSignedIn } = useUser()
  const clerk = useClerk()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Stats', href: '#stats' },
  ]

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Button asChild variant="outline" className="flex items-center gap-2">
                  <Link href="/dashboard/profile">
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="outline" onClick={async () => { await clerk.signOut(); window.location.href = '/sign-in'; }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Get Started</Button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {isSignedIn ? (
                  <>
                    <Button asChild variant="outline" className="w-full flex items-center gap-2">
                      <Link href="/dashboard/profile">
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="outline" className="w-full" onClick={async () => { await clerk.signOut(); window.location.href = '/sign-in'; }}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <Button variant="ghost" className="w-full">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="w-full">Get Started</Button>
                    </SignUpButton>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
