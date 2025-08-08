import * as React from 'react'
import { cn } from '@/lib/utils'

interface UFCLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function UFCLogo({ className, size = 'md' }: UFCLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  }

  return (
    <div className={cn(
      'flex items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-800 text-white font-bold font-mono',
      sizeClasses[size],
      className
    )}>
      <span className="text-xs font-black tracking-wider">UFC</span>
    </div>
  )
}
