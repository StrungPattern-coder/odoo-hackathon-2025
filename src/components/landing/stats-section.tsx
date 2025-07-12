'use client'

import { motion } from 'framer-motion'

export function StatsSection() {
  const stats = [
    { number: '25,000+', label: 'Active Members', color: 'text-brand-accent' },
    { number: '150,000+', label: 'Skills Swapped', color: 'text-brand-gold' },
    { number: '500+', label: 'Skill Categories', color: 'text-white' },
    { number: '98%', label: 'Success Rate', color: 'text-brand-accent' },
  ]

  return (
    <section id="stats" className="py-20 bg-gradient-to-r from-brand-primary to-brand-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Growing Community
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Join thousands of learners who are already transforming their skills
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-white/70">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
