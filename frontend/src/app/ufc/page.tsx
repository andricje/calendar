'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Download, FileDown, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { UFCLogo } from '@/components/ui/ufc-logo'

export default function UFCPage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
  const envGoogleCalendarId = process.env.NEXT_PUBLIC_UFC_GCAL_ID
  const googleCid = encodeURIComponent(envGoogleCalendarId ?? `${backendUrl}/ufc`)
  let backendHost: string
  try {
    backendHost = new URL(backendUrl).host
  } catch {
    backendHost = backendUrl
  }
  
  const quickActions = [
    {
      title: "Apple Calendar (iCal)",
      description: "Subscribe via iCalendar with automatic updates",
      icon: Download,
      link: `webcal://${backendHost}/ufc`,
      variant: "glass" as const
    },
    {
      title: "Google Calendar", 
      description: "Subscribe in Google Calendar",
      icon: ExternalLink,
      link: `https://calendar.google.com/calendar/r?cid=${googleCid}`,
      variant: "glass" as const
    },
    {
      title: "Download (.ics)",
      description: "One-time download of the UFC calendar file",
      icon: FileDown,
      link: `${backendUrl}/ufc`,
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
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-red-800/10 to-transparent"></div>
      
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
              className="flex flex-col items-center justify-center mb-8"
            >
              <div className="mb-6">
                <UFCLogo size="lg" />
              </div>
              <h1 className="text-5xl font-bold text-white">
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
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <Card className="h-full hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => window.open(action.link, '_self')}>
                    <CardContent className="p-6 text-center flex flex-col h-full">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                      <p className="text-sm text-gray-300 mb-4">{action.description}</p>
                      <Button variant={action.variant} className="w-full mt-auto">
                        {action.title.includes('Google') ? 'Add to Google Calendar' : action.title.includes('Apple') ? 'Add to Apple Calendar' : 'Download .ics'}
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
