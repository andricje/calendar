import * as React from 'react'
import { cn } from '@/lib/utils'

interface ONEFCLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ONEFCLogo({ className, size = 'md' }: ONEFCLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  }

  return (
    <div className={cn(
      'flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white font-bold',
      sizeClasses[size],
      className
    )}>
      <span className="text-xs font-black tracking-wider">ONE</span>
    </div>
  )
}
