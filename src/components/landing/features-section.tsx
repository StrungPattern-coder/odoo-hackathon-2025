'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  Search, 
  MessageSquare, 
  Star, 
  Trophy, 
  Shield,
  Zap,
  Globe
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  const features = [
    {
      icon: Users,
      title: 'Smart Skill Matching',
      description: 'Our AI-powered algorithm connects you with perfect skill swap partners based on compatibility and learning goals.',
      color: 'text-[#340773]',
      bgColor: 'bg-[#340773]/10',
    },
    {
      icon: Search,
      title: 'Advanced Discovery',
      description: 'Search and filter by location, availability, skill level, and categories to find exactly what you need.',
      color: 'text-[#8F6CD9]',
      bgColor: 'bg-[#8F6CD9]/10',
    },
    {
      icon: MessageSquare,
      title: 'Real-time Communication',
      description: 'Instant messaging, video calls, and collaboration tools to make learning seamless and engaging.',
      color: 'text-[#A68A56]',
      bgColor: 'bg-[#A68A56]/10',
    },
    {
      icon: Star,
      title: 'Quality Assurance',
      description: 'Comprehensive rating and feedback system ensures high-quality skill exchanges and trusted connections.',
      color: 'text-[#340773]',
      bgColor: 'bg-[#340773]/10',
    },
    {
      icon: Trophy,
      title: 'Gamified Learning',
      description: 'Earn XP, unlock badges, and climb leaderboards while mastering new skills and helping others grow.',
      color: 'text-[#8F6CD9]',
      bgColor: 'bg-[#8F6CD9]/10',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Advanced verification, moderation tools, and privacy controls keep your learning environment safe.',
      color: 'text-[#A68A56]',
      bgColor: 'bg-[#A68A56]/10',
    },
    {
      icon: Zap,
      title: 'Instant Swaps',
      description: 'Quick skill exchanges for busy schedules - from 30-minute sessions to multi-week collaborations.',
      color: 'text-[#340773]',
      bgColor: 'bg-[#340773]/10',
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Connect with learners worldwide, experience diverse perspectives, and build international networks.',
      color: 'text-[#8F6CD9]',
      bgColor: 'bg-[#8F6CD9]/10',
    },
  ]

  useEffect(() => {
    if (!sectionRef.current) return

    const cards = sectionRef.current.querySelectorAll('.feature-card')
    
    gsap.fromTo(
      cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  return (
    <section id="features" ref={sectionRef} className="py-20 hero-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-gradient">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to discover, connect, and grow through skill sharing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                className="feature-card"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full card-gradient border border-[#8F6CD9]/20 shadow-lg hover:shadow-xl transition-all duration-300 group hover:border-[#8F6CD9]/40">
                  <CardHeader className="text-center pb-4">
                    <div className={`inline-flex p-3 rounded-full ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg font-semibold text-[#340773]">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 mb-4">
            Ready to experience the future of skill sharing?
          </p>
          <div className="inline-flex p-1 button-gradient rounded-full">
            <div className="bg-white rounded-full px-6 py-2">
              <span className="text-sm font-medium text-gradient">
                Join thousands of learners today
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
