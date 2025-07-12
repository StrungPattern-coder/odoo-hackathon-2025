'use client'

import { Button } from '@/components/ui/button'
import { SignUpButton, useUser } from '@clerk/nextjs'
import { ArrowRight, Sparkles, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function HeroSection() {
  const { isSignedIn } = useUser()
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!heroRef.current) return

    const tl = gsap.timeline()

    // Hero animation
    tl.fromTo(
      titleRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )
      .fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo(
        statsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.2'
      )

    // Floating animation for icons
    gsap.to('.floating-icon', {
      y: -10,
      duration: 2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.3,
    })
  }, [])

  return (
    <section
      ref={heroRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="floating-icon absolute top-24 sm:top-20 left-4 sm:left-10 p-3 sm:p-4 glass-morphism rounded-full"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-[#8F6CD9]" />
        </motion.div>
        <motion.div
          className="floating-icon absolute top-44 sm:top-40 right-4 sm:right-20 p-3 sm:p-4 glass-morphism rounded-full"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-[#A68A56]" />
        </motion.div>
        <motion.div
          className="floating-icon absolute bottom-40 left-4 sm:left-20 p-3 sm:p-4 glass-morphism rounded-full"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-[#340773]" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          ref={titleRef}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="text-gradient">
            Learn. Share. Grow.
          </span>
        </motion.h1>

        <motion.p
          ref={subtitleRef}
          className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          Where skills are swapped, connections are made, and growth never stops. 
          Join thousands of learners exchanging knowledge in real-time.
        </motion.p>

        <motion.div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          {isSignedIn ? (
            <Button asChild size="lg" className="text-lg px-8 py-4 rounded-full button-gradient text-white hover:shadow-lg transition-all duration-300">
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <>
              <SignUpButton mode="modal">
                <Button size="lg" className="text-lg px-8 py-4 rounded-full button-gradient text-white hover:shadow-lg transition-all duration-300">
                  Start Swapping Skills
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignUpButton>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 rounded-full border-2 border-[#8F6CD9] text-[#340773] hover:bg-[#8F6CD9] hover:text-white transition-all duration-300"
                asChild
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </>
          )}
        </motion.div>

        <motion.div
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
        >
          <div className="text-center p-6 card-gradient rounded-xl border border-[#8F6CD9]/20">
            <div className="text-3xl sm:text-4xl font-bold text-[#340773] mb-2">10K+</div>
            <div className="text-gray-600">Active Learners</div>
          </div>
          <div className="text-center p-6 card-gradient rounded-xl border border-[#8F6CD9]/20">
            <div className="text-3xl sm:text-4xl font-bold text-[#8F6CD9] mb-2">50K+</div>
            <div className="text-gray-600">Skills Swapped</div>
          </div>
          <div className="text-center p-6 card-gradient rounded-xl border border-[#8F6CD9]/20">
            <div className="text-3xl sm:text-4xl font-bold text-[#A68A56] mb-2">500+</div>
            <div className="text-gray-600">Skill Categories</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
