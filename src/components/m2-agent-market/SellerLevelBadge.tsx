'use client'

import { Star, ShieldCheck, Zap, Award } from 'lucide-react'

export type SellerLevel = 'new' | 'verified' | 'pro' | 'elite'

export interface SellerLevelBadgeProps {
  level: SellerLevel
  showLabel?: boolean
  size?: 'sm' | 'md'
}

const levelConfig: Record<SellerLevel, {
  label: string
  icon: React.ReactNode
  bgClass: string
  textClass: string
  borderClass: string
}> = {
  new: {
    label: 'New',
    icon: <Star className="h-2.5 w-2.5" />,
    bgClass: 'bg-white/5',
    textClass: 'text-white/50',
    borderClass: 'border-white/10',
  },
  verified: {
    label: 'Verified',
    icon: <ShieldCheck className="h-2.5 w-2.5" />,
    bgClass: 'bg-blue-500/15',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/30',
  },
  pro: {
    label: 'Pro',
    icon: <Zap className="h-2.5 w-2.5" />,
    bgClass: 'bg-emerald-500/15',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
  },
  elite: {
    label: 'Elite',
    icon: <Award className="h-2.5 w-2.5" />,
    bgClass: 'bg-amber-500/15',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
  },
}

export function SellerLevelBadge({ level, showLabel = true, size = 'md' }: SellerLevelBadgeProps) {
  const config = levelConfig[level]
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5 gap-1' : 'text-xs px-2 py-1 gap-1.5'

  return (
    <span
      className={[
        'inline-flex items-center rounded-full font-medium border',
        config.bgClass,
        config.textClass,
        config.borderClass,
        sizeClass,
      ].join(' ')}
    >
      {config.icon}
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}
