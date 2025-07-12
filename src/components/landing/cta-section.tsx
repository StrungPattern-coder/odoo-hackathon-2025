'use client'

import { Button } from '@/components/ui/button'
import { SignUpButton, useUser } from '@clerk/nextjs'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function CTASection() {
  const { isSignedIn } = useUser()

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-brand-accent/10 to-brand-gold/10 rounded-full mb-8">
            <Sparkles className="h-5 w-5 text-brand-accent mr-2" />
            <span className="text-sm font-medium text-brand-primary">
              Ready to start your journey?
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
              Your Next Skill
            </span>
            <br />
            Is Just One Swap Away
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our thriving community of learners and start exchanging skills today. 
            No fees, no barriers – just pure learning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isSignedIn ? (
              <Button asChild size="lg" className="text-lg px-8 py-4 rounded-full">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <SignUpButton mode="modal">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-primary/90 hover:to-brand-accent/90"
                >
                  Join SkillSync for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignUpButton>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Free forever • No credit card required • Join in 30 seconds
          </p>
        </motion.div>
      </div>
    </section>
  )
}
