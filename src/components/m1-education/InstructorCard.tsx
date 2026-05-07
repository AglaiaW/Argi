'use client'

import { Star, Users, BookOpen, Award } from 'lucide-react'

export interface Instructor {
  id: string
  name: string
  title: string
  avatar: string
  bio: string
  rating: number
  reviewCount: number
  studentCount: number
  courseCount: number
  specialties: string[]
  badges: string[]
  isVerified: boolean
}

export interface InstructorCardProps {
  instructor?: Instructor
  className?: string
}

const DEFAULT_INSTRUCTOR: Instructor = {
  id: 'inst-1',
  name: 'Dr. Elena Vasquez',
  title: 'Senior AI & Machine Learning Instructor',
  avatar: 'https://i.pravatar.cc/150?img=47',
  bio: 'Former Google DeepMind researcher with 12+ years teaching AI/ML to 50,000+ students globally. Passionate about making complex concepts accessible.',
  rating: 4.9,
  reviewCount: 3421,
  studentCount: 54123,
  courseCount: 18,
  specialties: ['Machine Learning', 'Deep Learning', 'Python', 'Data Science', 'TensorFlow'],
  badges: ['Top Instructor', 'Best Seller', 'Community Choice'],
  isVerified: true,
}

export default function InstructorCard({ instructor = DEFAULT_INSTRUCTOR, className = '' }: InstructorCardProps) {
  return (
    <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-white/10 ${className}`}>
      {/* Verified ribbon */}
      {instructor.isVerified && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
          <Award className="w-3 h-3" />
          Verified
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <img
            src={instructor.avatar}
            alt={instructor.name}
            className="w-16 h-16 rounded-xl object-cover border-2 border-white/20"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 truncate">{instructor.name}</h3>
            <p className="text-xs text-slate-900/60 mt-0.5">{instructor.title}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold text-amber-400">{instructor.rating}</span>
              <span className="text-xs text-slate-900/40">({instructor.reviewCount.toLocaleString()} reviews)</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-900/70 leading-relaxed mb-4 line-clamp-3">{instructor.bio}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
            <span className="text-sm font-bold text-slate-900">{instructor.studentCount > 999 ? `${(instructor.studentCount / 1000).toFixed(1)}k` : instructor.studentCount}</span>
            <span className="text-[10px] text-slate-900/40 flex items-center gap-1"><Users className="w-2.5 h-2.5" /> Students</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
            <span className="text-sm font-bold text-slate-900">{instructor.courseCount}</span>
            <span className="text-[10px] text-slate-900/40 flex items-center gap-1"><BookOpen className="w-2.5 h-2.5" /> Courses</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
            <span className="text-sm font-bold text-slate-900">{instructor.reviewCount > 999 ? `${(instructor.reviewCount / 1000).toFixed(1)}k` : instructor.reviewCount}</span>
            <span className="text-[10px] text-slate-900/40 flex items-center gap-1"><Star className="w-2.5 h-2.5" /> Reviews</span>
          </div>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {instructor.specialties.map((s) => (
            <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 border border-emerald-500/25 text-emerald-300">
              {s}
            </span>
          ))}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {instructor.badges.map((badge) => (
            <span key={badge} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/15 border border-amber-500/25 text-amber-300">
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-4">
        <button className="w-full py-2 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-900 transition-all">
          View Profile
        </button>
      </div>
    </div>
  )
}
