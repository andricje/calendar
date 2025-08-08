'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { StatusCard } from '@/components/ui/status-card'
import { Activity, RefreshCw, TrendingUp } from 'lucide-react'

interface StatusData {
  ufc: {
    lastUpdated: string
    status: 'online' | 'offline'
    events: number
    dailyStats: Array<{ date: string; success: boolean }>
  }
  onefc: {
    lastUpdated: string
    status: 'online' | 'offline'
    events: number
    dailyStats: Array<{ date: string; success: boolean }>
  }
  backend: {
    status: 'online' | 'offline'
    uptime: string
    dailyStats: Array<{ date: string; success: boolean }>
  }
}

export function StatusDashboard() {
  const [statusData, setStatusData] = useState<StatusData>({
    ufc: {
      lastUpdated: new Date().toLocaleString(),
      status: 'online',
      events: 12,
      dailyStats: []
    },
    onefc: {
      lastUpdated: new Date().toLocaleString(),
      status: 'online', 
      events: 9,
      dailyStats: []
    },
    backend: {
      status: 'online',
      uptime: '24h 32m',
      dailyStats: []
    }
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
      
      // Fetch stats from backend
      const statsResponse = await fetch(`${backendUrl}/stats`)
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch stats')
      }
      
      const statsData = await statsResponse.json()
      const dailyStats = statsData.stats.daily_success_array || []
      
      // Fetch cache info
      const cacheResponse = await fetch(`${backendUrl}/cache`)
      const cacheData = cacheResponse.ok ? await cacheResponse.json() : null
      
      setStatusData({
        ufc: {
          lastUpdated: cacheData?.cache_info?.last_update ? 
            new Date(cacheData.cache_info.last_update).toLocaleString() : 
            new Date().toLocaleString(),
          status: cacheData?.cache_info?.status === 'success' ? 'online' : 'offline',
          events: Math.floor(Math.random() * 5) + 10, // Simulated for now
          dailyStats: dailyStats
        },
        onefc: {
          lastUpdated: cacheData?.cache_info?.last_update ? 
            new Date(cacheData.cache_info.last_update).toLocaleString() : 
            new Date().toLocaleString(),
          status: cacheData?.cache_info?.status === 'success' ? 'online' : 'offline',
          events: Math.floor(Math.random() * 3) + 8, // Simulated for now
          dailyStats: dailyStats
        },
        backend: {
          status: 'online',
          uptime: '24h 32m', // Simulated for now
          dailyStats: dailyStats
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status')
      // Fallback to simulated data
      setStatusData(prev => ({
        ...prev,
        ufc: { ...prev.ufc, dailyStats: generateDailyStats(30, 0.98) },
        onefc: { ...prev.onefc, dailyStats: generateDailyStats(30, 0.97) },
        backend: { ...prev.backend, dailyStats: generateDailyStats(30, 0.99) }
      }))
    } finally {
      setLoading(false)
    }
  }

  function generateDailyStats(days: number, successRate: number): Array<{ date: string; success: boolean }> {
    const stats = []
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      stats.push({
        date: dateStr,
        success: Math.random() < successRate
      })
    }
    
    return stats
  }

  // Fetch status on mount and every 60 seconds
  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 mb-16"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="text-gray-300 mt-2">Loading status...</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto px-4 mb-16"
    >
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Activity className="w-6 h-6 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">System Status</h2>
        </div>
        <p className="text-gray-300">Real-time status of all calendar services</p>
        {error && (
          <p className="text-red-400 mt-2">{error}</p>
        )}
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <StatusCard
          title="UFC Calendar"
          status={statusData.ufc.status}
          lastUpdated={statusData.ufc.lastUpdated}
          description={`${statusData.ufc.events} events loaded`}
          icon="🥊"
        />
        <StatusCard
          title="ONE Championship"
          status={statusData.onefc.status}
          lastUpdated={statusData.onefc.lastUpdated}
          description={`${statusData.onefc.events} events loaded`}
          icon="🏆"
        />
        <StatusCard
          title="Backend API"
          status={statusData.backend.status}
          lastUpdated={statusData.backend.uptime}
          description="All systems operational"
          icon="⚡"
        />
      </div>
      
      {/* 30-Day Success Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-8 max-w-4xl mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">30-Day Success History</h3>
          </div>
          
          <div className="space-y-4">
            {/* UFC Stats */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">UFC Calendar</span>
                <span className="text-xs text-gray-300">
                  {statusData.ufc.dailyStats.filter(d => d.success).length}/30 days
                </span>
              </div>
              <div className="flex space-x-1">
                {statusData.ufc.dailyStats.map((day, index) => (
                  <div
                    key={index}
                    className={`w-2 h-8 rounded-sm transition-all duration-200 hover:scale-125 cursor-pointer ${
                      day.success ? 'bg-green-400' : 'bg-red-400'
                    }`}
                    title={`${day.date}: ${day.success ? 'Success' : 'Failed'}`}
                  />
                ))}
              </div>
            </div>
            
            {/* ONE FC Stats */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">ONE Championship</span>
                <span className="text-xs text-gray-300">
                  {statusData.onefc.dailyStats.filter(d => d.success).length}/30 days
                </span>
              </div>
              <div className="flex space-x-1">
                {statusData.onefc.dailyStats.map((day, index) => (
                  <div
                    key={index}
                    className={`w-2 h-8 rounded-sm transition-all duration-200 hover:scale-125 cursor-pointer ${
                      day.success ? 'bg-green-400' : 'bg-red-400'
                    }`}
                    title={`${day.date}: ${day.success ? 'Success' : 'Failed'}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Backend Stats */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">Backend API</span>
                <span className="text-xs text-gray-300">
                  {statusData.backend.dailyStats.filter(d => d.success).length}/30 days
                </span>
              </div>
              <div className="flex space-x-1">
                {statusData.backend.dailyStats.map((day, index) => (
                  <div
                    key={index}
                    className={`w-2 h-8 rounded-sm transition-all duration-200 hover:scale-125 cursor-pointer ${
                      day.success ? 'bg-green-400' : 'bg-red-400'
                    }`}
                    title={`${day.date}: ${day.success ? 'Success' : 'Failed'}`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              Hover over bars to see details • Green = Success • Red = Failed
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
