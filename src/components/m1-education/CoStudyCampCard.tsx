'use client'

import { Users, Calendar, Clock, BookOpen, MessageSquare, Star, CheckCircle2, Globe, Zap } from 'lucide-react'

export interface CoStudyCampMember {
  id: string
  name: string
  avatar: string
  role: 'leader' | 'mentor' | 'member'
  isOnline: boolean
}

export interface CoStudyCamp {
  id: string
  name: string
  tagline: string
  description: string
  category: string
  thumbnail: string
  memberCount: number
  maxMembers: number
  members: CoStudyCampMember[]
  startDate: string
  duration: string
  schedule: string
  timezone: string
  language: string
  currentTopic?: string
  progress: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  rating: number
  reviewCount: number
  isPublic: boolean
  tags: string[]
  isJoined?: boolean
}

export interface CoStudyCampCardProps {
  camp?: CoStudyCamp
  className?: string
}

const DEFAULT_CAMP: CoStudyCamp = {
  id: 'camp-1',
  name: 'AI Agent Builders Collective',
  tagline: 'Build. Ship. Learn. Together.',
  description: 'A collaborative cohort for building production AI agents. Weekly standups, pair programming, code reviews, and shared project milestones.',
  category: 'AI & Machine Learning',
  thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
  memberCount: 24,
  maxMembers: 30,
  startDate: '2026-05-01',
  duration: '8 weeks',
  schedule: 'Mon & Thu 8PM UTC',
  timezone: 'UTC+0',
  language: 'English',
  currentTopic: 'Building Multi-Agent Systems with CrewAI',
  progress: 42,
  difficulty: 'Intermediate',
  rating: 4.8,
  reviewCount: 312,
  isPublic: true,
  members: [
    { id: 'm1', name: 'Elena Vasquez', avatar: 'https://i.pravatar.cc/150?img=47', role: 'mentor', isOnline: true },
    { id: 'm2', name: 'Marcus Chen', avatar: 'https://i.pravatar.cc/150?img=12', role: 'leader', isOnline: true },
    { id: 'm3', name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?img=23', role: 'member', isOnline: false },
    { id: 'm4', name: 'Alex Kim', avatar: 'https://i.pravatar.cc/150?img=33', role: 'member', isOnline: true },
    { id: 'm5', name: 'Jordan Lee', avatar: 'https://i.pravatar.cc/150?img=56', role: 'member', isOnline: false },
  ],
  tags: ['AI Agents', 'Python', 'CrewAI', 'LangChain', 'Production'],
  isJoined: false,
}

const DIFFICULTY_COLORS = {
  Beginner: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
  Intermediate: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  Advanced: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
}

const ROLE_LABELS = {
  leader: { label: 'Leader', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  mentor: { label: 'Mentor', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  member: { label: 'Member', color: 'bg-white/10 text-white/60 border-white/20' },
}

export default function CoStudyCampCard({ camp = DEFAULT_CAMP, className = '' }: CoStudyCampCardProps) {
  return (
    <div className={`rounded-2xl overflow-hidden bg-slate-800/70 border border-white/10 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 ${className}`}>
      {/* Header with thumbnail */}
      <div className="relative h-36 overflow-hidden">
        <img src={camp.thumbnail} alt={camp.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded border text-[9px] font-medium ${DIFFICULTY_COLORS[camp.difficulty]}`}>{camp.difficulty}</span>
          {camp.isPublic ? (
            <span className="flex items-center gap-1 text-[9px] text-white/50"><Globe className="w-3 h-3" />Public</span>
          ) : (
            <span className="text-[9px] text-white/50">Private</span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          {camp.isJoined ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/30 border border-emerald-500/40 text-emerald-300">
              <CheckCircle2 className="w-3 h-3" /> Joined
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/30 border border-purple-500/40 text-purple-300">
              <Zap className="w-3 h-3" /> Open
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-sm font-bold text-white leading-tight">{camp.name}</h3>
          <p className="text-xs text-purple-300 mt-0.5">{camp.tagline}</p>
        </div>
      </div>

      {/* Current topic */}
      {camp.currentTopic && (
        <div className="mx-4 mt-3 p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <p className="text-[9px] text-purple-400 font-semibold uppercase mb-0.5">Current Topic</p>
          <p className="text-xs text-white/80 font-medium">{camp.currentTopic}</p>
        </div>
      )}

      {/* Description */}
      <p className="mx-4 mt-3 text-xs text-white/60 leading-relaxed line-clamp-2">{camp.description}</p>

      {/* Schedule info */}
      <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <Calendar className="w-3.5 h-3.5 text-purple-400" />
          <span>Starts {camp.startDate}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span>{camp.schedule}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <Globe className="w-3.5 h-3.5 text-purple-400" />
          <span>{camp.timezone}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          <span>{camp.duration}</span>
        </div>
      </div>

      {/* Progress */}
      {camp.isJoined && camp.progress > 0 && (
        <div className="mx-4 mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-white/40">Progress</span>
            <span className="text-[10px] font-semibold text-purple-300">{camp.progress}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full" style={{ width: `${camp.progress}%` }} />
          </div>
        </div>
      )}

      {/* Members preview */}
      <div className="mx-4 mt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-white/40" />
            <span className="text-xs text-white/60">{camp.memberCount}/{camp.maxMembers} members</span>
          </div>
          <div className="flex -space-x-2">
            {camp.members.slice(0, 5).map((member) => (
              <div key={member.id} className="relative">
                <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full border-2 border-slate-800 object-cover" />
                {member.isOnline && <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-slate-800" />}
              </div>
            ))}
            {camp.memberCount > 5 && (
              <div className="w-6 h-6 rounded-full bg-white/20 border-2 border-slate-800 flex items-center justify-center">
                <span className="text-[8px] text-white">+{camp.memberCount - 5}</span>
              </div>
            )}
          </div>
        </div>
        {/* Role labels */}
        <div className="flex flex-wrap gap-1">
          {camp.members.filter(m => m.role !== 'member').map((member) => {
            const roleInfo = ROLE_LABELS[member.role]
            return (
              <div key={member.id} className="flex items-center gap-1">
                <img src={member.avatar} alt={member.name} className="w-4 h-4 rounded-full object-cover" />
                <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium ${roleInfo.color}`}>{roleInfo.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tags */}
      <div className="mx-4 mt-3 flex flex-wrap gap-1">
        {camp.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded text-[9px] bg-white/5 border border-white/8 text-white/50">{tag}</span>
        ))}
      </div>

      {/* Footer */}
      <div className="mx-4 mt-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-white">{camp.rating}</span>
          <span className="text-[10px] text-white/40">({camp.reviewCount})</span>
        </div>
        {camp.isJoined ? (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500 hover:bg-purple-400 text-white transition-colors">
            <MessageSquare className="w-3.5 h-3.5" />
            Open Chat
          </button>
        ) : (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white transition-all">
            <Zap className="w-3.5 h-3.5" />
            Join Camp
          </button>
        )}
      </div>
    </div>
  )
}
