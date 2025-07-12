'use client'

import { motion } from 'framer-motion'

export function StatsSection() {
  const stats = [
    { number: '25,000+', label: 'Active Members', color: 'text-blue-500' },
    { number: '150,000+', label: 'Skills Swapped', color: 'text-purple-500' },
    { number: '500+', label: 'Skill Categories', color: 'text-green-500' },
    { number: '98%', label: 'Success Rate', color: 'text-orange-500' },
  ]

  return (
    <section id="stats" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
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
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
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
              <div className="text-blue-100">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
