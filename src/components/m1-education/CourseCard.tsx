'use client'

import { Star, Users, Clock, BookOpen, TrendingUp, Play } from 'lucide-react'

export interface Course {
  id: string
  title: string
  subtitle: string
  thumbnail: string
  instructor: string
  rating: number
  reviewCount: number
  studentCount: number
  duration: string
  lessons: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  price: number
  isBestseller?: boolean
  isNew?: boolean
  progress?: number
  tags: string[]
}

export interface CourseCardProps {
  course?: Course
  variant?: 'default' | 'compact' | 'horizontal'
  className?: string
}

const DEFAULT_COURSE: Course = {
  id: 'c1',
  title: 'Advanced AI Agent Engineering',
  subtitle: 'Build autonomous AI agents with LangChain, AutoGPT & CrewAI',
  thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80',
  instructor: 'Dr. Elena Vasquez',
  rating: 4.8,
  reviewCount: 2891,
  studentCount: 21450,
  duration: '42h',
  lessons: 156,
  level: 'Advanced',
  category: 'AI & Machine Learning',
  price: 129.99,
  isBestseller: true,
  progress: 35,
  tags: ['AI Agents', 'LangChain', 'Python', 'LLM'],
}

const LEVEL_COLORS = {
  Beginner: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
  Intermediate: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  Advanced: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
}

export default function CourseCard({ course = DEFAULT_COURSE, variant = 'default', className = '' }: CourseCardProps) {
  if (variant === 'horizontal') {
    return (
      <div className={`flex gap-4 rounded-2xl overflow-hidden bg-slate-800/70 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all ${className}`}>
        <img src={course.thumbnail} alt={course.title} className="w-36 h-28 object-cover flex-shrink-0" />
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm font-bold text-slate-900 truncate">{course.title}</h3>
            {course.isBestseller && (
              <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 border border-amber-500/30 text-amber-400 uppercase">Bestseller</span>
            )}
          </div>
          <p className="text-xs text-slate-900/50 mb-2 truncate">{course.instructor}</p>
          <div className="flex items-center gap-3 text-[10px] text-slate-900/40">
            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{course.rating}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{(course.studentCount / 1000).toFixed(1)}k</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
            <span className={`px-1.5 py-0.5 rounded border text-[9px] font-medium ${LEVEL_COLORS[course.level]}`}>{course.level}</span>
          </div>
        </div>
        <div className="flex-shrink-0 pr-4 pt-4">
          <span className="text-sm font-bold text-slate-900">${course.price}</span>
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-white/8 hover:border-white/16 transition-all ${className}`}>
        <img src={course.thumbnail} alt={course.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-900 truncate">{course.title}</p>
          <p className="text-[10px] text-slate-900/40 mt-0.5">{course.instructor}</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-slate-900">{course.rating}</span>
        </div>
      </div>
    )
  }

  // Default card
  return (
    <div className={`group rounded-2xl overflow-hidden bg-slate-800/70 border border-white/10 backdrop-blur-sm hover:border-emerald-500/40 transition-all duration-300 ${className}`}>
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {course.isBestseller && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-slate-900">Bestseller</span>
          )}
          {course.isNew && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-slate-900">New</span>
          )}
        </div>
        <div className="absolute bottom-2.5 left-2.5">
          <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors">
            <Play className="w-4 h-4 text-slate-900 fill-white ml-0.5" />
          </button>
        </div>
        {course.progress !== undefined && course.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400" style={{ width: `${course.progress}%` }} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`px-2 py-0.5 rounded border text-[9px] font-medium ${LEVEL_COLORS[course.level]}`}>{course.level}</span>
          <span className="text-[9px] text-slate-900/40">{course.category}</span>
        </div>
        <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1 line-clamp-2">{course.title}</h3>
        <p className="text-xs text-slate-900/50 mb-3 truncate">{course.instructor}</p>

        {/* Stats */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-slate-900">{course.rating}</span>
            <span className="text-[10px] text-slate-900/40">({(course.reviewCount / 1000).toFixed(1)}k)</span>
          </div>
          <div className="flex items-center gap-1 text-slate-900/40">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs">{(course.studentCount / 1000).toFixed(1)}k</span>
          </div>
          <div className="flex items-center gap-1 text-slate-900/40">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{course.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-900/40">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-xs">{course.lessons}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {course.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 border border-white/8 text-slate-900/50">{tag}</span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-white/6">
          <span className="text-base font-bold text-slate-900">${course.price}</span>
          {course.progress !== undefined && course.progress > 0 ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              {course.progress}% Done
            </span>
          ) : (
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-900 transition-colors">
              Enroll
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
