'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Download, FileDown, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { UFCLogo } from '@/components/ui/ufc-logo'

export default function UFCPage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
  
  const quickActions = [
    {
      title: "UFC Apple Calendar",
      description: "Add to Apple Calendar",
      icon: Download,
      link: `webcal://${backendUrl.replace(/^https?:\/\//, '')}/ufc?name=UFC%20Events`,
      variant: "glass" as const
    },
    {
      title: "UFC Google Calendar", 
      description: "Add to Google Calendar",
      icon: ExternalLink,
      link: `https://calendar.google.com/calendar/r?cid=${backendUrl}/ufc&name=UFC%20Events`,
      variant: "glass" as const
    },
    {
      title: "UFC Download ICS",
      description: "Download UFC calendar file",
      icon: FileDown,
      link: `${backendUrl}/ufc?name=UFC%20Events`,
      variant: "glass" as const
    }
  ]

  const features = [
    {
      icon: "🥊",
      title: "UFC Events",
      description: "All UFC fights, including main cards, prelims, and Fight Night events"
    },
    {
      icon: "📅", 
      title: "Auto Updates",
      description: "Calendar automatically updates with new events and schedule changes"
    },
    {
      icon: "🌍",
      title: "Global Coverage", 
      description: "All UFC events worldwide, including PPV, Fight Night, and Contender Series"
    },
    {
      icon: "⚡",
      title: "Real-time Sync",
      description: "Get instant notifications when new events are added or schedules change"
    }
  ]

  return (
    <div className="min-h-screen">
      <div className="relative z-10 px-4 pt-16 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-center mb-6"
            >
              <UFCLogo size="lg" className="mr-4" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                UFC Calendar
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Subscribe to UFC events calendar and never miss a fight again. 
              Get all UFC events directly in your calendar with automatic updates.
            </motion.p>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Subscribe to UFC Calendar</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <Card className="h-full hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => window.open(action.link, '_self')}>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                      <p className="text-sm text-gray-300 mb-4">{action.description}</p>
                      <Button variant={action.variant} className="w-full">
                        Subscribe
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{feature.icon}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                          <p className="text-gray-300">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
