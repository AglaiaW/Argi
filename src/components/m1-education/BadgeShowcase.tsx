'use client'

import { Award, Star, Zap, Trophy, Target, TrendingUp } from 'lucide-react'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  earned: boolean
  earnedDate?: string
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  award: <Award className="w-5 h-5" />,
  star: <Star className="w-5 h-5" />,
  zap: <Zap className="w-5 h-5" />,
  trophy: <Trophy className="w-5 h-5" />,
  target: <Target className="w-5 h-5" />,
  trending: <TrendingUp className="w-5 h-5" />,
}

const BADGE_COLORS: Record<string, string> = {
  gold: 'from-amber-400 to-yellow-600 text-amber-300 border-amber-500/40',
  emerald: 'from-emerald-400 to-green-600 text-emerald-300 border-emerald-500/40',
  azure: 'from-blue-400 to-indigo-600 text-blue-300 border-blue-500/40',
  purple: 'from-purple-400 to-violet-600 text-purple-300 border-purple-500/40',
  rose: 'from-rose-400 to-pink-600 text-rose-300 border-rose-500/40',
}

export interface BadgeShowcaseProps {
  badges?: Badge[]
  className?: string
}

const DEFAULT_BADGES: Badge[] = [
  { id: 'b1', name: 'First Course', description: 'Completed your first course', icon: 'star', color: 'gold', earned: true, earnedDate: '2026-03-15' },
  { id: 'b2', name: 'Fast Learner', description: 'Completed a course in under 48h', icon: 'zap', color: 'emerald', earned: true, earnedDate: '2026-03-18' },
  { id: 'b3', name: 'Path Pioneer', description: 'Started your first learning path', icon: 'trophy', color: 'azure', earned: true, earnedDate: '2026-03-20' },
  { id: 'b4', name: 'Top Scorer', description: 'Achieved 95%+ on any quiz', icon: 'target', color: 'purple', earned: true, earnedDate: '2026-04-01' },
  { id: 'b5', name: 'Consistent Learner', description: 'Studied 7 days in a row', icon: 'trending', color: 'emerald', earned: true, earnedDate: '2026-04-10' },
  { id: 'b6', name: 'Expert Level', description: 'Completed 5 advanced courses', icon: 'award', color: 'gold', earned: false },
  { id: 'b7', name: 'Mentor', description: 'Helped 3 study buddies pass exams', icon: 'star', color: 'azure', earned: false },
  { id: 'b8', name: 'Champion', description: 'Ranked #1 on the weekly leaderboard', icon: 'trophy', color: 'rose', earned: false },
]

export default function BadgeShowcase({ badges = DEFAULT_BADGES, className = '' }: BadgeShowcaseProps) {
  const earned = badges.filter((b) => b.earned)
  const locked = badges.filter((b) => !b.earned)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Earned Badges */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900/80 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Earned Badges ({earned.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {earned.map((badge) => {
            const colorClass = BADGE_COLORS[badge.color] ?? BADGE_COLORS.gold
            const IconComp = BADGE_ICONS[badge.icon]
            return (
              <div
                key={badge.id}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br ${colorClass} bg-opacity-10 border backdrop-blur-sm transition-transform hover:scale-105`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-current to-current opacity-80">
                  <div className="text-slate-900">{IconComp}</div>
                </div>
                <span className="text-xs font-bold text-center text-slate-900">{badge.name}</span>
                <span className="text-[10px] text-slate-900/60 text-center leading-tight">{badge.description}</span>
                {badge.earnedDate && (
                  <span className="absolute top-1.5 right-1.5 text-[9px] text-slate-900/40">{badge.earnedDate}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Locked Badges */}
      {locked.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900/40 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Locked ({locked.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {locked.map((badge) => {
              return (
                <div
                  key={badge.id}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 opacity-50 grayscale"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10">
                    <Award className="w-5 h-5 text-slate-900/40" />
                  </div>
                  <span className="text-xs font-bold text-center text-slate-900/60">{badge.name}</span>
                  <span className="text-[10px] text-slate-900/30 text-center leading-tight">{badge.description}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
