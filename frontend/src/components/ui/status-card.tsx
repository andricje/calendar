import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Clock, Wifi, WifiOff, RefreshCw } from "lucide-react"

interface StatusCardProps {
  title: string
  status: 'online' | 'offline' | 'loading'
  lastUpdated?: string
  url?: string
  description?: string
  icon?: string
  className?: string
}

export function StatusCard({ title, status, lastUpdated, url, description, icon, className }: StatusCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'text-green-400'
      case 'offline':
        return 'text-red-400'
      case 'loading':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'online':
        return <Wifi className="w-4 h-4" />
      case 'offline':
        return <WifiOff className="w-4 h-4" />
      case 'loading':
        return <RefreshCw className="w-4 h-4 animate-spin" />
      default:
        return <WifiOff className="w-4 h-4" />
    }
  }

  return (
    <Card className={cn("hover:scale-105 transition-transform duration-300", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className={cn("flex items-center space-x-2", getStatusColor())}>
            {getStatusIcon()}
            <span className="text-sm font-medium capitalize">{status}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {lastUpdated && (
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        )}
        {description && (
          <div className="flex items-center space-x-2 text-sm text-gray-300 mt-2">
            {icon && <span className="text-lg">{icon}</span>}
            <span>{description}</span>
          </div>
        )}
        {url && (
          <div className="mt-2">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              View Calendar
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
