'use client'

import * as React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SPORTS_CONFIG } from '@/lib/sports-config'

interface SportsSidebarProps {
  className?: string
  onSportChange?: (sportKey: string) => void
  selectedSport?: string
}

export function SportsSidebar({ className, onSportChange, selectedSport: externalSelectedSport }: SportsSidebarProps) {
  const [internalSelected, setInternalSelected] = useState<string>('mma')
  
  // Koristi external selected sport ako je prosleđen, inače internal
  const selected = externalSelectedSport || internalSelected
  const current = SPORTS_CONFIG.find((s) => s.key === selected) ?? SPORTS_CONFIG[0]

  const handleSportChange = (sportKey: string) => {
    setInternalSelected(sportKey)
    if (onSportChange) {
      onSportChange(sportKey)
    }
  }

  return (
    <aside className={cn('space-y-6 w-80 pointer-events-auto', className)}>
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 pointer-events-auto">
        <h3 className="text-lg font-semibold text-white/90 mb-4">Sports</h3>
        <div className="grid grid-cols-2 gap-3">
          {SPORTS_CONFIG.map((sport) => (
            <button
              key={sport.key}
              onClick={() => handleSportChange(sport.key)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors cursor-pointer pointer-events-auto',
                selected === sport.key
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <sport.icon className="w-5 h-5" />
              <span>{sport.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 pointer-events-auto">
        <h3 className="text-lg font-semibold text-white/90 mb-4">Leagues</h3>
        <div className="flex flex-col gap-3">
          {current.leagues.map((league) =>
            league.href && !league.disabled ? (
              <Link
                key={league.id}
                href={league.href}
                className="px-4 py-3 rounded-xl text-sm bg-white/10 hover:bg-white/20 text-white transition-colors pointer-events-auto"
                title={league.description}
              >
                {league.name}
              </Link>
            ) : (
              <div
                key={league.id}
                className="px-4 py-3 rounded-xl text-sm bg-white/5 text-white/50 cursor-not-allowed flex items-center justify-between pointer-events-auto"
                title={league.description || 'Coming soon'}
              >
                {league.name}
                <span className="text-[10px] uppercase tracking-wide">soon</span>
              </div>
            )
          )}
        </div>
      </div>
    </aside>
  )
}
