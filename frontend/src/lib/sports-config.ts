import { Dumbbell, Trophy, Gamepad2, Car, Globe2, Target, Shield, Zap } from 'lucide-react'
import { UFCLogo } from '@/components/ui/ufc-logo'
import { ONEFCLogo } from '@/components/ui/onefc-logo'

export interface League {
  id: string
  name: string
  href?: string
  disabled?: boolean
  description?: string
  backendEndpoint?: string
  icon?: string
  logo?: any
}

export interface Sport {
  key: string
  name: string
  icon: any
  color: string
  leagues: League[]
  description: string
}

export const SPORTS_CONFIG: Sport[] = [
  {
    key: 'mma',
    name: 'MMA',
    icon: Dumbbell,
    color: 'from-red-500 to-red-600',
    description: 'Mixed Martial Arts events and fights',
    leagues: [
      { 
        id: 'ufc',
        name: 'UFC', 
        href: '/ufc',
        backendEndpoint: '/ufc',
        description: 'Ultimate Fighting Championship events',
        logo: UFCLogo
      },
      { 
        id: 'onefc',
        name: 'ONE Championship', 
        href: '/onefc',
        backendEndpoint: '/onefccalendar',
        description: 'ONE Championship events',
        logo: ONEFCLogo
      },
      { 
        id: 'pfl',
        name: 'PFL', 
        disabled: true,
        description: 'Professional Fighters League'
      },
      { 
        id: 'bellator',
        name: 'Bellator', 
        disabled: true,
        description: 'Bellator MMA events'
      },
    ],
  },
  {
    key: 'football',
    name: 'Football',
    icon: Target,
    color: 'from-green-500 to-green-600',
    description: 'Soccer and American Football leagues',
    leagues: [
      { 
        id: 'premier-league',
        name: 'Premier League', 
        disabled: true,
        description: 'English Premier League'
      },
      { 
        id: 'la-liga',
        name: 'La Liga', 
        disabled: true,
        description: 'Spanish La Liga'
      },
      { 
        id: 'serie-a',
        name: 'Serie A', 
        disabled: true,
        description: 'Italian Serie A'
      },
    ],
  },
  {
    key: 'basketball',
    name: 'Basketball',
    icon: Trophy,
    color: 'from-orange-500 to-orange-600',
    description: 'Basketball leagues and tournaments',
    leagues: [
      { 
        id: 'nba',
        name: 'NBA', 
        disabled: true,
        description: 'National Basketball Association'
      },
      { 
        id: 'euroleague',
        name: 'EuroLeague', 
        disabled: true,
        description: 'EuroLeague Basketball'
      },
    ],
  },
  {
    key: 'tennis',
    name: 'Tennis',
    icon: Globe2,
    color: 'from-yellow-500 to-yellow-600',
    description: 'Tennis tournaments and leagues',
    leagues: [
      { 
        id: 'atp',
        name: 'ATP', 
        disabled: true,
        description: 'Association of Tennis Professionals'
      },
      { 
        id: 'wta',
        name: 'WTA', 
        disabled: true,
        description: 'Women\'s Tennis Association'
      },
    ],
  },
  {
    key: 'f1',
    name: 'Formula 1',
    icon: Car,
    color: 'from-red-500 to-red-600',
    description: 'Formula 1 racing events',
    leagues: [
      { 
        id: 'f1-2025',
        name: 'F1 2025 Season', 
        disabled: true,
        description: 'Formula 1 2025 Championship'
      },
    ],
  },
  {
    key: 'esports',
    name: 'eSports',
    icon: Gamepad2,
    color: 'from-purple-500 to-purple-600',
    description: 'Esports tournaments and leagues',
    leagues: [
      { 
        id: 'cs2',
        name: 'CS2', 
        disabled: true,
        description: 'Counter-Strike 2 tournaments'
      },
      { 
        id: 'lol',
        name: 'LoL', 
        disabled: true,
        description: 'League of Legends tournaments'
      },
    ],
  },
]

export function getSportByKey(key: string): Sport | undefined {
  return SPORTS_CONFIG.find(sport => sport.key === key)
}

export function getLeagueById(sportKey: string, leagueId: string): League | undefined {
  const sport = getSportByKey(sportKey)
  return sport?.leagues.find(league => league.id === leagueId)
}

export function getActiveLeagues(): League[] {
  return SPORTS_CONFIG.flatMap(sport => 
    sport.leagues.filter(league => !league.disabled)
  )
}
