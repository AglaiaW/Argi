'use client'

import { MessageCircle, Users, BookOpen, Star, CheckCircle2, Clock } from 'lucide-react'

export interface StudyBuddy {
  id: string
  name: string
  avatar: string
  title: string
  learningGoal: string
  matchScore: number
  isOnline: boolean
  timezone: string
  languages: string[]
  interests: string[]
  currentCourse?: string
  completedCourses: number
  streakDays: number
  rating: number
  sessionsCompleted: number
  isVerified: boolean
}

export interface StudyBuddyCardProps {
  buddy?: StudyBuddy
  className?: string
  onConnect?: (id: string) => void
}

const DEFAULT_BUDDY: StudyBuddy = {
  id: 'buddy-1',
  name: 'Marcus Chen',
  avatar: 'https://i.pravatar.cc/150?img=12',
  title: 'CS Student & AI Enthusiast',
  learningGoal: 'Mastering AI Agent development with Python',
  matchScore: 94,
  isOnline: true,
  timezone: 'UTC+8',
  languages: ['English', 'Mandarin'],
  interests: ['AI Agents', 'Python', 'Machine Learning', 'Robotics'],
  currentCourse: 'Advanced AI Agent Engineering',
  completedCourses: 12,
  streakDays: 21,
  rating: 4.8,
  sessionsCompleted: 47,
  isVerified: true,
}

export default function StudyBuddyCard({ buddy = DEFAULT_BUDDY, className = '', onConnect }: StudyBuddyCardProps) {
  return (
    <div className={`rounded-2xl overflow-hidden bg-slate-800/70 border border-white/10 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 ${className}`}>
      {/* Online indicator */}
      <div className="relative px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <img src={buddy.avatar} alt={buddy.name} className="w-14 h-14 rounded-xl object-cover border-2 border-white/20" />
            {buddy.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-800" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 truncate">{buddy.name}</h3>
              {buddy.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
            </div>
            <p className="text-xs text-slate-900/50 truncate">{buddy.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] text-slate-900/40 flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{buddy.timezone}</span>
              <span className="text-[9px] text-emerald-400 font-semibold bg-emerald-500/15 px-1.5 py-0.5 rounded">{buddy.matchScore}% Match</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current course */}
      {buddy.currentCourse && (
        <div className="mx-4 mb-3 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-[9px] text-blue-400 font-semibold uppercase mb-0.5">Currently Learning</p>
          <p className="text-xs text-slate-900/80 font-medium truncate">{buddy.currentCourse}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mx-4 mb-3">
        <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
          <BookOpen className="w-3.5 h-3.5 text-slate-900/40 mb-1" />
          <span className="text-xs font-bold text-slate-900">{buddy.completedCourses}</span>
          <span className="text-[9px] text-slate-900/40">Courses</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
          <Users className="w-3.5 h-3.5 text-slate-900/40 mb-1" />
          <span className="text-xs font-bold text-slate-900">{buddy.sessionsCompleted}</span>
          <span className="text-[9px] text-slate-900/40">Sessions</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
          <Star className="w-3.5 h-3.5 text-amber-400 mb-1" />
          <span className="text-xs font-bold text-slate-900">{buddy.rating}</span>
          <span className="text-[9px] text-slate-900/40">Rating</span>
        </div>
      </div>

      {/* Streak */}
      <div className="mx-4 mb-3 flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <div className="flex items-center gap-1 text-amber-400">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        </div>
        <span className="text-xs font-semibold text-amber-300">🔥 {buddy.streakDays}-day streak!</span>
      </div>

      {/* Languages */}
      <div className="mx-4 mb-3">
        <p className="text-[9px] text-slate-900/30 uppercase tracking-wider mb-1.5">Languages</p>
        <div className="flex flex-wrap gap-1">
          {buddy.languages.map((lang) => (
            <span key={lang} className="px-2 py-0.5 rounded text-[9px] bg-white/5 border border-white/8 text-slate-900/60">{lang}</span>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="mx-4 mb-4">
        <p className="text-[9px] text-slate-900/30 uppercase tracking-wider mb-1.5">Interests</p>
        <div className="flex flex-wrap gap-1">
          {buddy.interests.map((interest) => (
            <span key={interest} className="px-2 py-0.5 rounded text-[9px] bg-blue-500/15 border border-blue-500/25 text-blue-300">{interest}</span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mx-4 mb-4">
        <button
          onClick={() => onConnect?.(buddy.id)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm bg-blue-500 hover:bg-blue-400 text-slate-900 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Connect
        </button>
      </div>
    </div>
  )
}
