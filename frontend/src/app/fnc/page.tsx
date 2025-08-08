'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FNCLogo } from '@/components/ui/fnc-logo'
import Link from 'next/link'

export default function FNCPage() {
  const features = [
    {
      title: 'FNC Calendar',
      description: 'Subscribe to FNC (Fight Night Championship) events calendar with automatic updates',
      link: '/fnc',
      color: "from-orange-500 to-orange-600"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-orange-800/10 to-transparent"></div>
      
      <div className="relative z-10 px-4 pt-16 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center justify-center mb-8"
            >
              <div className="mb-6">
                <FNCLogo size="lg" />
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white">
                FNC Calendar
              </h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Subscribe to FNC (Fight Night Championship) events calendar. Never miss a fight again.
            </motion.p>
          </div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-16"
          >
            <div className="grid md:grid-cols-1 gap-6 max-w-2xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 + index * 0.1 }}
                >
                  <Card className="h-full hover:bg-white/5 transition-all duration-300">
                    <CardHeader>
                      <div className="mb-4">
                        <FNCLogo size="lg" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/20 text-orange-300 text-sm font-medium">
                          <span>🚧</span>
                          <span>Coming Soon</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-3">
                          FNC calendar integration is in development
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="text-center text-gray-400"
          >
            <Link 
              href="/"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
