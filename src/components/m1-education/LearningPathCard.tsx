'use client'

import { CheckCircle2, Clock, BookOpen, TrendingUp, Users, Play, Lock } from 'lucide-react'

export interface LearningPathStep {
  id: string
  title: string
  type: 'course' | 'project' | 'quiz' | 'exam'
  duration: string
  isCompleted: boolean
  isLocked: boolean
}

export interface LearningPath {
  id: string
  title: string
  subtitle: string
  category: string
  difficulty: 'Foundation' | 'Intermediate' | 'Professional'
  totalDuration: string
  totalCourses: number
  enrolledCount: number
  rating: number
  progress: number
  thumbnail: string
  instructor: string
  steps: LearningPathStep[]
  tags: string[]
  description: string
}

export interface LearningPathCardProps {
  path?: LearningPath
  className?: string
}

const DEFAULT_PATH: LearningPath = {
  id: 'lp-1',
  title: 'AI Engineering Professional Track',
  subtitle: 'From fundamentals to deploying production AI agents',
  category: 'AI & Machine Learning',
  difficulty: 'Professional',
  totalDuration: '120h',
  totalCourses: 8,
  enrolledCount: 8432,
  rating: 4.9,
  progress: 37,
  thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80',
  instructor: 'Dr. Elena Vasquez',
  description: 'Master AI engineering from basics to production deployment. Build autonomous agents, integrate LLMs, and ship real AI products.',
  steps: [
    { id: 's1', title: 'Python for AI Engineering', type: 'course', duration: '12h', isCompleted: true, isLocked: false },
    { id: 's2', title: 'Machine Learning Fundamentals', type: 'course', duration: '18h', isCompleted: true, isLocked: false },
    { id: 's3', title: 'Deep Learning & Neural Networks', type: 'course', duration: '20h', isCompleted: false, isLocked: false },
    { id: 's4', title: 'ML Project: Image Classifier', type: 'project', duration: '8h', isCompleted: false, isLocked: false },
    { id: 's5', title: 'Large Language Models Mastery', type: 'course', duration: '16h', isCompleted: false, isLocked: false },
    { id: 's6', title: 'LangChain & AI Agents', type: 'course', duration: '14h', isCompleted: false, isLocked: false },
    { id: 's7', title: 'Capstone Project', type: 'project', duration: '20h', isCompleted: false, isLocked: true },
    { id: 's8', title: 'Final Certification Exam', type: 'exam', duration: '3h', isCompleted: false, isLocked: true },
  ],
  tags: ['AI Agents', 'LangChain', 'Python', 'Deep Learning', 'LLM'],
}

const DIFFICULTY_COLORS = {
  Foundation: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
  Intermediate: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  Professional: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
}

const STEP_ICONS = {
  course: BookOpen,
  project: TrendingUp,
  quiz: Clock,
  exam: CheckCircle2,
}

export default function LearningPathCard({ path = DEFAULT_PATH, className = '' }: LearningPathCardProps) {
  return (
    <div className={`rounded-2xl overflow-hidden bg-slate-800/70 border border-white/10 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="relative h-36 overflow-hidden">
        <img src={path.thumbnail} alt={path.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded border text-[9px] font-medium ${DIFFICULTY_COLORS[path.difficulty]}`}>{path.difficulty}</span>
          <span className="text-[9px] text-white/50">{path.category}</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-sm font-bold text-white leading-tight">{path.title}</h3>
          <p className="text-xs text-white/50 mt-0.5">{path.instructor}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-xs text-white/60">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>{path.progress}% complete</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/40">
            <Clock className="w-3.5 h-3.5" />
            <span>{path.totalDuration}</span>
          </div>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all" style={{ width: `${path.progress}%` }} />
        </div>
      </div>

      {/* Steps */}
      <div className="px-4 py-3 space-y-1.5">
        {path.steps.map((step, idx) => {
          const Icon = STEP_ICONS[step.type]
          return (
            <div key={step.id} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${step.isLocked ? 'opacity-40' : step.isCompleted ? 'bg-emerald-500/10' : 'bg-white/5 hover:bg-white/8'}`}>
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${step.isCompleted ? 'bg-emerald-500 text-white' : step.isLocked ? 'bg-white/10 text-white/30' : 'bg-white/15 text-white/60'}`}>
                {step.isLocked ? <Lock className="w-3 h-3" /> : step.isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-medium ${step.isCompleted ? 'text-emerald-300' : step.isLocked ? 'text-white/30' : 'text-white/80'}`}>{step.title}</span>
                <span className="text-[10px] text-white/40 ml-2">{step.duration}</span>
              </div>
              {idx === 2 && !step.isCompleted && (
                <span className="flex-shrink-0 text-[9px] font-semibold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded">In Progress</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-white/40">
          <Users className="w-3.5 h-3.5" />
          <span>{(path.enrolledCount / 1000).toFixed(1)}k enrolled</span>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-colors">
          <Play className="w-3 h-3" />
          Continue
        </button>
      </div>
    </div>
  )
}
