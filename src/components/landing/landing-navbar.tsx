'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignInButton, SignUpButton, useUser, useClerk } from '@clerk/nextjs'
import { Menu, X, Zap, User, Shield } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-[#8F6CD9]/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <div className="p-2 button-gradient rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">
              SkillSync
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-[#8F6CD9] transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="outline" className="flex items-center gap-2 border-[#8F6CD9] text-[#340773] hover:bg-[#8F6CD9] hover:text-white transition-all duration-300">
              <Link href="/admin">
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            </Button>
            {isSignedIn ? (
              <>
                <Button asChild variant="outline" className="flex items-center gap-2 border-[#8F6CD9] text-[#340773] hover:bg-[#8F6CD9] hover:text-white transition-all duration-300">
                  <Link href="/dashboard/profile">
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                </Button>
                <Button asChild className="button-gradient text-white hover:shadow-lg">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="outline" onClick={async () => { await clerk.signOut(); window.location.href = '/sign-in'; }} className="flex items-center gap-2 border-[#8F6CD9] text-[#340773] hover:bg-[#8F6CD9] hover:text-white transition-all duration-300">
                  <i className="fa-solid fa-right-from-bracket"></i>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="hover:bg-[#8F6CD9]/10 hover:text-[#8F6CD9]">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="button-gradient text-white hover:shadow-lg">Get Started</Button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[#8F6CD9]/10 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-[#340773]" />
            ) : (
              <Menu className="h-6 w-6 text-[#340773]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass-morphism border-t border-[#8F6CD9]/20"
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-600 hover:text-[#8F6CD9] transition-colors duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-[#8F6CD9]/20 space-y-2">
                <Button asChild variant="outline" className="w-full flex items-center gap-2 border-[#8F6CD9] text-[#340773] hover:bg-[#8F6CD9] hover:text-white transition-all duration-300">
                  <Link href="/admin">
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                </Button>
                {isSignedIn ? (
                  <>
                    <Button asChild variant="outline" className="w-full flex items-center gap-2 border-[#8F6CD9] text-[#340773] hover:bg-[#8F6CD9] hover:text-white transition-all duration-300">
                      <Link href="/dashboard/profile">
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                    </Button>
                    <Button asChild className="w-full button-gradient text-white hover:shadow-lg">
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="outline" className="w-full flex items-center gap-2 border-[#8F6CD9] text-[#340773] hover:bg-[#8F6CD9] hover:text-white transition-all duration-300" onClick={async () => { await clerk.signOut(); window.location.href = '/sign-in'; }}>
                      <i className="fa-solid fa-right-from-bracket"></i>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <Button variant="ghost" className="w-full hover:bg-[#8F6CD9]/10 hover:text-[#8F6CD9]">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="w-full button-gradient text-white hover:shadow-lg">Get Started</Button>
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
