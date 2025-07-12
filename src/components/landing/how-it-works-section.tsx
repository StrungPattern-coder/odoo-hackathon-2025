'use client'

import { motion } from 'framer-motion'

export function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Create Your Profile',
      description: 'Sign up and list the skills you offer and want to learn.',
      color: 'from-brand-primary to-brand-accent',
    },
    {
      step: '02',
      title: 'Discover Matches',
      description: 'Browse and find perfect skill swap partners in your area or globally.',
      color: 'from-brand-accent to-brand-gold',
    },
    {
      step: '03',
      title: 'Connect & Swap',
      description: 'Send requests, schedule sessions, and start learning together.',
      color: 'from-brand-gold to-brand-primary',
    },
    {
      step: '04',
      title: 'Grow Together',
      description: 'Rate experiences, earn badges, and build lasting connections.',
      color: 'from-brand-secondary to-brand-accent',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start your skill swapping journey in just four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${step.color} text-white text-xl font-bold mb-6`}>
                {step.step}
              </div>
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
