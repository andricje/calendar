'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { StatusCard } from '@/components/ui/status-card'
import { Activity, RefreshCw } from 'lucide-react'

interface StatusData {
  ufc: {
    lastUpdated: string
    status: 'online' | 'offline'
    url: string
  }
  onefc: {
    lastUpdated: string
    status: 'online' | 'offline'
    url: string
  }
  backend: {
    status: 'online' | 'offline'
    url: string
  }
}

export function StatusDashboard() {
  const [statusData, setStatusData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/status')
      if (!response.ok) {
        throw new Error('Failed to fetch status')
      }
      const data = await response.json()
      setStatusData(data)
      setError(null)
    } catch (err) {
      setError('Failed to load status')
      console.error('Error fetching status:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    
    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 mb-16"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">System Status</h2>
          <p className="text-gray-300">Loading status information...</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-white/10 rounded-2xl"></div>
            </div>
          ))}
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
          status={statusData?.ufc?.status || 'offline'}
          lastUpdated={statusData?.ufc?.lastUpdated}
          url={statusData?.ufc?.url}
        />
        <StatusCard
          title="ONE FC Calendar"
          status={statusData?.onefc?.status || 'offline'}
          lastUpdated={statusData?.onefc?.lastUpdated}
          url={statusData?.onefc?.url}
        />
        <StatusCard
          title="Backend API"
          status={statusData?.backend?.status || 'offline'}
          url={statusData?.backend?.url}
        />
      </div>
      
      <div className="text-center mt-6">
        <button
          onClick={fetchStatus}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Status</span>
        </button>
      </div>
    </motion.div>
  )
}
