'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Download, FileDown, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusDashboard } from '@/components/status-dashboard'
import Link from 'next/link'
import { SportsSidebar } from '@/components/sports-sidebar'
import { getActiveLeagues } from '@/lib/sports-config'

export default function Home() {
  const activeLeagues = getActiveLeagues()
  
  const features = activeLeagues.map(league => ({
    logo: league.logo,
    title: `${league.name} Calendar`,
    description: league.description || `Subscribe to ${league.name} events calendar with automatic updates`,
    link: league.href || '#',
    color: "from-blue-500 to-blue-600"
  }))

  const quickActions = activeLeagues.flatMap(league => [
    {
      title: `${league.name} Apple Calendar`,
      description: "Add to Apple Calendar",
      icon: Download,
      link: `webcal://${process.env.NEXT_PUBLIC_BACKEND_URL || 'localhost:5001'}${league.backendEndpoint}`,
      variant: "glass" as const
    },
    {
      title: `${league.name} Google Calendar`, 
      description: "Add to Google Calendar",
      icon: ExternalLink,
      link: `https://calendar.google.com/calendar/r?cid=http://${process.env.NEXT_PUBLIC_BACKEND_URL || 'localhost:5001'}${league.backendEndpoint}`,
      variant: "glass" as const
    },
    {
      title: `${league.name} Download ICS`,
      description: `Download ${league.name} calendar file`,
      icon: FileDown,
      link: `https://${process.env.NEXT_PUBLIC_BACKEND_URL || 'localhost:5001'}${league.backendEndpoint}`,
      variant: "glass" as const
    }
  ])

  return (
    <div className="min-h-screen">
      <div className="relative z-10 px-4 pt-16 pb-8">
        {/* Main content - centered */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6"
            >
              Sports Calendar
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
            >
              Free and open source way to subscribe to calendars from multiple sports organizations. 
              Never miss a game, fight, or match again.
            </motion.p>
          </div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                >
                  <Card className="h-full hover:scale-105 transition-transform duration-300">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                        {feature.logo ? (
                          <feature.logo size="sm" />
                        ) : (
                          <span className="w-6 h-6 text-white">📅</span>
                        )}
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="gradient" 
                        size="lg" 
                        className="w-full"
                        onClick={() => window.open(feature.link, '_self')}
                      >
                        Subscribe Now
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Quick Actions</h2>
              <p className="text-gray-300">Add calendars directly to your preferred app or download files</p>
              <Link href="/status" className="inline-flex items-center text-blue-400 hover:text-blue-300 mt-2 transition-colors">
                <Activity className="w-4 h-4 mr-2" />
                View System Status
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                >
                  <Card className="hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => window.open(action.link, '_self')}>
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mx-auto mb-3">
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-white mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-300">{action.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Status Dashboard */}
          <StatusDashboard />
        </div>

        {/* Sidebar - fixed on the right */}
        <div className="fixed top-20 right-16 transform hidden xl:block">
          <SportsSidebar />
        </div>
      </div>
    </div>
  )
}
