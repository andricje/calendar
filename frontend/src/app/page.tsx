'use client'

import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusDashboard } from '@/components/status-dashboard'
import Link from 'next/link'
import { SportsSidebar } from '@/components/sports-sidebar'
import { getActiveLeagues, SPORTS_CONFIG } from '@/lib/sports-config'
import { useState } from 'react'
import { cn } from '@/lib/utils'

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
              className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6"
            >
              Sports Calendar
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto mb-8"
            >
              Free and open source way to subscribe to calendars from multiple sports organizations. 
              Never miss a game, fight, or match again.
            </motion.p>
          </div>

          {/* Mobile Sport Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:hidden mb-8"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
              <h3 className="text-base font-semibold text-white/90 mb-3">Select Sport</h3>
              <div className="grid grid-cols-3 gap-2">
                {SPORTS_CONFIG.map((sport) => (
                  <button
                    key={sport.key}
                    onClick={() => handleSportChange(sport.key)}
                    className={cn(
                      'flex flex-col items-center gap-2 px-3 py-3 rounded-xl text-xs transition-colors',
                      selectedSport === sport.key
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <sport.icon className="w-5 h-5" />
                    <span className="text-center">{sport.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

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
                      <div className="mb-4">
                        {feature.logo ? (
                          <feature.logo size="lg" />
                        ) : (
                          <span className="w-12 h-12 text-white">📅</span>
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

      {/* Sidebar - fixed on the right, hidden on mobile */}
      <div className="hidden lg:block fixed top-20 right-4 z-50">
        <SportsSidebar onSportChange={handleSportChange} selectedSport={selectedSport} />
      </div>
    </div>
  )
}
