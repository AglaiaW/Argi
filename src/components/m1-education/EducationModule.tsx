'use client'

import { useState } from 'react'
import {
  BookOpen,
  Route,
  Users,
  Award,
  Radar,
  UserCheck,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Star,
  Play,
  Globe,
  MessageSquare,
  Calendar,
  CheckCircle2,
} from 'lucide-react'

import CourseCard from './CourseCard'
import LearningPathCard from './LearningPathCard'
import StudyBuddyCard from './StudyBuddyCard'
import CoStudyCampCard from './CoStudyCampCard'
import InstructorCard from './InstructorCard'
import BadgeShowcase from './BadgeShowcase'
import RadarChart from './RadarChart'

// ─── Sub-tab types ───────────────────────────────────────────────────────────
type SubTabId = 'courses' | 'paths' | 'study-buddies' | 'camps' | 'instructors' | 'achievements'

interface SubTab {
  id: SubTabId
  label: string
  icon: React.ReactNode
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_COURSES = [
  {
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
    level: 'Advanced' as const,
    category: 'AI & Machine Learning',
    price: 129.99,
    isBestseller: true,
    progress: 35,
    tags: ['AI Agents', 'LangChain', 'Python', 'LLM'],
  },
  {
    id: 'c2',
    title: 'Full-Stack AI Applications with Next.js & OpenAI',
    subtitle: 'Ship production AI apps with React, OpenAI, and vector databases',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&q=80',
    instructor: 'Marcus Chen',
    rating: 4.9,
    reviewCount: 1872,
    studentCount: 15820,
    duration: '38h',
    lessons: 142,
    level: 'Intermediate' as const,
    category: 'Web Development',
    price: 99.99,
    isNew: true,
    progress: 0,
    tags: ['Next.js', 'OpenAI', 'React', 'Vector DB'],
  },
  {
    id: 'c3',
    title: 'Python for Data Science & Machine Learning',
    subtitle: 'NumPy, Pandas, Scikit-learn, TensorFlow — complete ML pipeline',
    thumbnail: 'https://images.unsplash.com/photo-1527628173875-3c7bfd28a4de?w=400&q=80',
    instructor: 'Priya Sharma',
    rating: 4.7,
    reviewCount: 5430,
    studentCount: 45200,
    duration: '56h',
    lessons: 210,
    level: 'Beginner' as const,
    category: 'Data Science',
    price: 79.99,
    progress: 100,
    tags: ['Python', 'ML', 'TensorFlow', 'Data Science'],
  },
  {
    id: 'c4',
    title: 'Multi-Agent Systems Architecture',
    subtitle: 'Design and orchestrate autonomous multi-agent workflows',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80',
    instructor: 'Dr. Elena Vasquez',
    rating: 4.9,
    reviewCount: 987,
    studentCount: 8720,
    duration: '30h',
    lessons: 98,
    level: 'Advanced' as const,
    category: 'AI & Machine Learning',
    price: 149.99,
    isBestseller: true,
    progress: 12,
    tags: ['Multi-Agent', 'CrewAI', 'Architecture', 'LLM'],
  },
]

const MOCK_PATHS = [
  {
    id: 'lp-1',
    title: 'AI Engineering Professional Track',
    subtitle: 'From fundamentals to deploying production AI agents',
    category: 'AI & Machine Learning',
    difficulty: 'Professional' as const,
    totalDuration: '120h',
    totalCourses: 8,
    enrolledCount: 8432,
    rating: 4.9,
    progress: 37,
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80',
    instructor: 'Dr. Elena Vasquez',
    description: 'Master AI engineering from basics to production deployment.',
    steps: [
      { id: 's1', title: 'Python for AI Engineering', type: 'course' as const, duration: '12h', isCompleted: true, isLocked: false },
      { id: 's2', title: 'Machine Learning Fundamentals', type: 'course' as const, duration: '18h', isCompleted: true, isLocked: false },
      { id: 's3', title: 'Deep Learning & Neural Networks', type: 'course' as const, duration: '20h', isCompleted: false, isLocked: false },
      { id: 's4', title: 'ML Project: Image Classifier', type: 'project' as const, duration: '8h', isCompleted: false, isLocked: false },
      { id: 's5', title: 'Large Language Models Mastery', type: 'course' as const, duration: '16h', isCompleted: false, isLocked: false },
      { id: 's6', title: 'LangChain & AI Agents', type: 'course' as const, duration: '14h', isCompleted: false, isLocked: false },
      { id: 's7', title: 'Capstone Project', type: 'project' as const, duration: '20h', isCompleted: false, isLocked: true },
      { id: 's8', title: 'Final Certification Exam', type: 'exam' as const, duration: '3h', isCompleted: false, isLocked: true },
    ],
    tags: ['AI Agents', 'LangChain', 'Python', 'Deep Learning', 'LLM'],
  },
  {
    id: 'lp-2',
    title: 'Full-Stack AI Web Developer',
    subtitle: 'Build and deploy AI-powered web applications end-to-end',
    category: 'Web Development',
    difficulty: 'Intermediate' as const,
    totalDuration: '90h',
    totalCourses: 6,
    enrolledCount: 12450,
    rating: 4.8,
    progress: 0,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    instructor: 'Marcus Chen',
    description: 'Learn to build AI-powered full-stack apps with Next.js and OpenAI.',
    steps: [
      { id: 's1', title: 'Next.js Fundamentals', type: 'course' as const, duration: '12h', isCompleted: false, isLocked: false },
      { id: 's2', title: 'React & TypeScript Mastery', type: 'course' as const, duration: '16h', isCompleted: false, isLocked: false },
      { id: 's3', title: 'OpenAI API Integration', type: 'course' as const, duration: '14h', isCompleted: false, isLocked: false },
      { id: 's4', title: 'Vector Databases & RAG', type: 'course' as const, duration: '12h', isCompleted: false, isLocked: true },
      { id: 's5', title: 'AI UI/UX Patterns', type: 'course' as const, duration: '10h', isCompleted: false, isLocked: true },
      { id: 's6', title: 'Deploying AI Apps', type: 'project' as const, duration: '8h', isCompleted: false, isLocked: true },
    ],
    tags: ['Next.js', 'OpenAI', 'React', 'Vercel', 'PostgreSQL'],
  },
]

const MOCK_BUDDIES = [
  {
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
  },
  {
    id: 'buddy-2',
    name: 'Priya Sharma',
    avatar: 'https://i.pravatar.cc/150?img=23',
    title: 'Data Scientist at TechCorp',
    learningGoal: 'Deep learning for NLP and production ML systems',
    matchScore: 88,
    isOnline: true,
    timezone: 'UTC+5',
    languages: ['English', 'Hindi'],
    interests: ['Deep Learning', 'NLP', 'Python', 'Data Science'],
    currentCourse: 'Multi-Agent Systems Architecture',
    completedCourses: 24,
    streakDays: 42,
    rating: 4.9,
    sessionsCompleted: 103,
    isVerified: true,
  },
  {
    id: 'buddy-3',
    name: 'Alex Kim',
    avatar: 'https://i.pravatar.cc/150?img=33',
    title: 'Freelance Web Developer',
    learningGoal: 'Adding AI capabilities to web applications',
    matchScore: 82,
    isOnline: false,
    timezone: 'UTC-5',
    languages: ['English', 'Korean'],
    interests: ['Next.js', 'OpenAI', 'React', 'TypeScript'],
    currentCourse: 'Full-Stack AI Applications',
    completedCourses: 8,
    streakDays: 7,
    rating: 4.6,
    sessionsCompleted: 28,
    isVerified: false,
  },
]

const MOCK_CAMPS = [
  {
    id: 'camp-1',
    name: 'AI Agent Builders Collective',
    tagline: 'Build. Ship. Learn. Together.',
    description: 'A collaborative cohort for building production AI agents. Weekly standups, pair programming, code reviews, and shared project milestones.',
    category: 'AI & Machine Learning',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
    memberCount: 24,
    maxMembers: 30,
    members: [
      { id: 'm1', name: 'Elena Vasquez', avatar: 'https://i.pravatar.cc/150?img=47', role: 'mentor' as const, isOnline: true },
      { id: 'm2', name: 'Marcus Chen', avatar: 'https://i.pravatar.cc/150?img=12', role: 'leader' as const, isOnline: true },
      { id: 'm3', name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?img=23', role: 'member' as const, isOnline: false },
      { id: 'm4', name: 'Alex Kim', avatar: 'https://i.pravatar.cc/150?img=33', role: 'member' as const, isOnline: true },
      { id: 'm5', name: 'Jordan Lee', avatar: 'https://i.pravatar.cc/150?img=56', role: 'member' as const, isOnline: false },
    ],
    startDate: '2026-05-01',
    duration: '8 weeks',
    schedule: 'Mon & Thu 8PM UTC',
    timezone: 'UTC+0',
    language: 'English',
    currentTopic: 'Building Multi-Agent Systems with CrewAI',
    progress: 42,
    difficulty: 'Intermediate' as const,
    rating: 4.8,
    reviewCount: 312,
    isPublic: true,
    tags: ['AI Agents', 'Python', 'CrewAI', 'LangChain', 'Production'],
    isJoined: false,
  },
  {
    id: 'camp-2',
    name: 'Full-Stack AI Developers',
    tagline: 'Ship AI-powered apps, together.',
    description: 'Weekly build sessions, code reviews, and collaborative projects for full-stack AI applications.',
    category: 'Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80',
    memberCount: 18,
    maxMembers: 20,
    members: [
      { id: 'm1', name: 'Marcus Chen', avatar: 'https://i.pravatar.cc/150?img=12', role: 'leader' as const, isOnline: true },
      { id: 'm2', name: 'Alex Kim', avatar: 'https://i.pravatar.cc/150?img=33', role: 'mentor' as const, isOnline: true },
      { id: 'm3', name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?img=44', role: 'member' as const, isOnline: false },
    ],
    startDate: '2026-05-15',
    duration: '6 weeks',
    schedule: 'Wed & Sat 6PM UTC',
    timezone: 'UTC+0',
    language: 'English',
    currentTopic: 'Building a RAG Chatbot with Next.js',
    progress: 0,
    difficulty: 'Intermediate' as const,
    rating: 4.7,
    reviewCount: 198,
    isPublic: true,
    tags: ['Next.js', 'OpenAI', 'React', 'RAG', 'TypeScript'],
    isJoined: true,
  },
]

const MOCK_INSTRUCTORS = [
  {
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
  },
  {
    id: 'inst-2',
    name: 'Marcus Chen',
    title: 'Full-Stack Developer & AI Educator',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'Ex-Stripe engineer who built and scaled AI features for millions of users. Now teaching how to ship AI products that matter.',
    rating: 4.8,
    reviewCount: 2109,
    studentCount: 32100,
    courseCount: 12,
    specialties: ['Next.js', 'OpenAI', 'React', 'TypeScript', 'PostgreSQL'],
    badges: ['Top Instructor', 'Fastest Growing'],
    isVerified: true,
  },
  {
    id: 'inst-3',
    name: 'Priya Sharma',
    title: 'Data Scientist & Python Instructor',
    avatar: 'https://i.pravatar.cc/150?img=23',
    bio: 'Data Scientist at a Fortune 500 company, teaching Python, ML, and data analysis to over 30,000 students worldwide.',
    rating: 4.7,
    reviewCount: 4892,
    studentCount: 38200,
    courseCount: 15,
    specialties: ['Python', 'Data Science', 'Pandas', 'Scikit-learn', 'SQL'],
    badges: ['Best Seller', 'Expert Educator'],
    isVerified: true,
  },
]

const RADAR_DATA = [
  { label: 'Python', value: 90 },
  { label: 'ML/DL', value: 75 },
  { label: 'React', value: 60 },
  { label: 'System Design', value: 55 },
  { label: 'Data Eng.', value: 45 },
  { label: 'DevOps', value: 35 },
]

// ─── Sub-tab config ───────────────────────────────────────────────────────────
const SUB_TABS: SubTab[] = [
  { id: 'courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'paths', label: 'Learning Paths', icon: <Route className="w-4 h-4" /> },
  { id: 'study-buddies', label: 'Study Buddies', icon: <Users className="w-4 h-4" /> },
  { id: 'camps', label: 'Co-Study Camps', icon: <Globe className="w-4 h-4" /> },
  { id: 'instructors', label: 'Instructors', icon: <UserCheck className="w-4 h-4" /> },
  { id: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4" /> },
]

// ─── Component ───────────────────────────────────────────────────────────────
export default function EducationModule() {
  const [activeTab, setActiveTab] = useState<SubTabId>('courses')
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleStart, setVisibleStart] = useState(0)
  const VISIBLE_COUNT = 3

  const filteredCourses = MOCK_COURSES.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const prevVisible = () => setVisibleStart((s) => Math.max(0, s - 1))
  const nextVisible = () => setVisibleStart((s) => Math.min(filteredCourses.length - VISIBLE_COUNT, s + 1))

  return (
    <div className="flex flex-col h-full bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
      {/* ── Top header bar ── */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
        <Radar className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <div>
          <h2 className="text-sm font-bold text-white">Education Hub</h2>
          <p className="text-[10px] text-white/40">Learn, grow, and master new skills</p>
        </div>

        {/* Stats chips */}
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-white/50">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>12 Courses</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/50">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Level 8</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/50">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>4.8</span>
          </div>
        </div>
      </div>

      {/* ── Sub-tab navigation ── */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-white/8 overflow-x-auto">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              setSearchQuery('')
              setVisibleStart(0)
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Search bar (for courses & paths) ── */}
      {(activeTab === 'courses' || activeTab === 'paths' || activeTab === 'study-buddies') && (
        <div className="px-4 pt-3 pb-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder={`Search ${activeTab.replace('-', ' ')}...`}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleStart(0) }}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
        </div>
      )}

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">

        {/* COURSES */}
        {activeTab === 'courses' && (
          <div>
            {/* Featured course hero */}
            <div className="mb-4">
              <CourseCard course={MOCK_COURSES[0]} className="max-w-2xl mx-auto" />
            </div>

            {/* Skill radar */}
            <div className="mb-4 p-4 rounded-xl bg-slate-800/60 border border-white/8">
              <div className="flex items-center gap-2 mb-3">
                <Radar className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-semibold text-white/80">Skill Radar</h3>
              </div>
              <div className="flex justify-center">
                <RadarChart data={RADAR_DATA} size={240} />
              </div>
            </div>

            {/* Carousel */}
            <div>
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">All Courses</h3>
              <div className="relative">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex gap-3 transition-transform duration-300"
                    style={{ transform: `translateX(-${visibleStart * (300 + 12)}px)`, width: '100%' }}>
                    {filteredCourses.map((course) => (
                      <div key={course.id} className="flex-shrink-0 w-[300px]">
                        <CourseCard course={course} variant="horizontal" />
                      </div>
                    ))}
                  </div>
                </div>
                {filteredCourses.length > VISIBLE_COUNT && (
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-white/30">{visibleStart + 1}–{Math.min(visibleStart + VISIBLE_COUNT, filteredCourses.length)} of {filteredCourses.length}</span>
                    <div className="flex gap-2">
                      <button onClick={prevVisible} disabled={visibleStart === 0} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors">
                        <ChevronLeft className="w-4 h-4 text-white/60" />
                      </button>
                      <button onClick={nextVisible} disabled={visibleStart >= filteredCourses.length - VISIBLE_COUNT} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors">
                        <ChevronRight className="w-4 h-4 text-white/60" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* LEARNING PATHS */}
        {activeTab === 'paths' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_PATHS.map((path) => (
                <LearningPathCard key={path.id} path={path} />
              ))}
            </div>
          </div>
        )}

        {/* STUDY BUDDIES */}
        {activeTab === 'study-buddies' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_BUDDIES.map((buddy) => (
                <StudyBuddyCard key={buddy.id} buddy={buddy} />
              ))}
            </div>
          </div>
        )}

        {/* CO-STUDY CAMPS */}
        {activeTab === 'camps' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_CAMPS.map((camp) => (
              <CoStudyCampCard key={camp.id} camp={camp} />
            ))}
          </div>
        )}

        {/* INSTRUCTORS */}
        {activeTab === 'instructors' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_INSTRUCTORS.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        )}

        {/* ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div className="max-w-2xl mx-auto">
            <BadgeShowcase />
          </div>
        )}
      </div>
    </div>
  )
}
