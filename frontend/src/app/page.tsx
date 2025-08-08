'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Download, FileDown, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusDashboard } from '@/components/status-dashboard'
import Link from 'next/link'
import { SportsSidebar } from '@/components/sports-sidebar'
import { getActiveLeagues, SPORTS_CONFIG } from '@/lib/sports-config'
import { useState } from 'react'

export default function Home() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
  const [selectedSport, setSelectedSport] = useState('mma')
  
  // Debug function
  const handleSportChange = (sportKey: string) => {
    setSelectedSport(sportKey)
  }

  // Filtriram lige na osnovu izabranog sporta
  const currentSport = SPORTS_CONFIG.find(sport => sport.key === selectedSport) || SPORTS_CONFIG[0]
  const activeLeagues = currentSport.leagues.filter(league => !league.disabled)
  
  const features = activeLeagues.map(league => ({
    logo: league.logo,
    title: `${league.name} Calendar`,
    description: league.description || `Subscribe to ${league.name} events calendar with automatic updates`,
    link: league.href || '#',
    color: "from-blue-500 to-blue-600"
  }))

  // Quick actions za trenutni sport
  const quickActions = activeLeagues.flatMap(league => [
    {
      title: `${league.name} Apple Calendar`,
      description: "Add to Apple Calendar",
      icon: Download,
      link: `webcal://${backendUrl.replace(/^https?:\/\//, '')}${league.backendEndpoint}?name=${encodeURIComponent(league.name + ' Events')}`,
      variant: "glass" as const
    },
    {
      title: `${league.name} Google Calendar`, 
      description: "Add to Google Calendar",
      icon: ExternalLink,
      link: `https://calendar.google.com/calendar/r?cid=${backendUrl}${league.backendEndpoint}&name=${encodeURIComponent(league.name + ' Events')}`,
      variant: "glass" as const
    },
    {
      title: `${league.name} Download ICS`,
      description: `Download ${league.name} calendar file`,
      icon: FileDown,
      link: `${backendUrl}${league.backendEndpoint}?name=${encodeURIComponent(league.name + ' Events')}`,
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
                  <Card className="h-full hover:bg-white/5 transition-all duration-300">
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
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium py-3 px-6 rounded-xl hover:bg-white/20 transition-all duration-300"
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
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                >
                  <Card className="h-full hover:bg-white/5 transition-all duration-300 cursor-pointer"
                        onClick={() => window.open(action.link, '_self')}>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                      <p className="text-sm text-gray-300 mb-4">{action.description}</p>
                      <Button 
                        variant="gradient" 
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium py-3 px-6 rounded-xl hover:bg-white/20 transition-all duration-300"
                      >
                        Subscribe
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Status Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mb-16"
          >
            <StatusDashboard />
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="text-center text-gray-400"
          >
            <p className="text-sm">
              <a 
                href="https://github.com/andricje/calendar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                View on GitHub
              </a>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Sidebar - fixed on the right */}
      <div className="fixed top-20 right-4 z-50">
        <SportsSidebar onSportChange={handleSportChange} selectedSport={selectedSport} />
      </div>
    </div>
  )
}
