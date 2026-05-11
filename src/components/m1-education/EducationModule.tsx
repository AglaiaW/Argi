'use client'

import { useState, useEffect } from 'react'
import {
  BookOpen, Users, Star, Award, Clock, TrendingUp,
  CheckCircle2, MapPin, Globe, X, ChevronRight,
  ArrowRight, Zap, Shield, UserCheck, Calendar,
  MessageSquare, Play, Gift, Lock, Search
} from 'lucide-react'
import CourseDetailPage from './CourseDetailPage'
import { useAction, ActionToast } from '@/hooks/useAction'

// ─── Block types ─────────────────────────────────────────────────────────────
type BlockSize = 'sm' | 'md' | 'lg' | 'xl'

interface Block {
  id: string
  type: 'featured_course' | 'course' | 'path' | 'camp' | 'instructor' | 'buddy' | 'stats'
  size: BlockSize
}

// ─── 版型：杂志大图 + 信息流 ─────────────────────────────────────────────────
// 左侧全高特色课(跨3列) + 右侧纵向堆叠(3列)
const BLOCKS: Block[] = [
  // 左侧：全高特色课程（跨3列，4个grid行）
  { id: 'feat', type: 'featured_course', size: 'xl' },
  // 右侧：从上到下分区排列（各占3列）
  { id: 'stats', type: 'stats', size: 'sm' },
  { id: 'path-0', type: 'path', size: 'sm' },
  { id: 'path-1', type: 'path', size: 'sm' },
  { id: 'camp-0', type: 'camp', size: 'lg' },
  { id: 'course-0', type: 'course', size: 'sm' },
  { id: 'course-1', type: 'course', size: 'sm' },
  { id: 'course-2', type: 'course', size: 'sm' },
  { id: 'course-3', type: 'course', size: 'sm' },
  { id: 'inst-0', type: 'instructor', size: 'sm' },
  { id: 'inst-1', type: 'instructor', size: 'sm' },
  { id: 'buddy-0', type: 'buddy', size: 'lg' },
]

// ─── Mock data (中文 OPC 平台) ─────────────────────────────────────────────────
const COURSES = [
  {
    id: 'c1',
    title: 'AI 运营实战训练营',
    subtitle: '从 0 到 1 打造百万级私域流量，28天系统化课程',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    instructor: '张运营',
    instructorAvatar: 'https://i.pravatar.cc/150?img=32',
    rating: 4.9,
    reviewCount: 1847,
    studentCount: 3847,
    duration: '42课时',
    level: '进阶',
    price: 2999,
    originalPrice: 4999,
    isBestseller: true,
    progress: 35,
    tags: ['私域运营', 'AI工具', '内容创作'],
    category: '运营增长',
  },
  {
    id: 'c2',
    title: '数字人从入门到变现',
    subtitle: '7天快速掌握数字人创建、训练与商业化全流程',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
    instructor: '李数字',
    instructorAvatar: 'https://i.pravatar.cc/150?img=25',
    rating: 4.8,
    reviewCount: 923,
    studentCount: 2108,
    duration: '28课时',
    level: '入门',
    price: 1999,
    originalPrice: 2999,
    isNew: true,
    progress: 0,
    tags: ['数字人', 'AI克隆', '变现指南'],
    category: 'AI技术',
    chapters: [
      { id: 'ch1', title: '第一章：数字人认知与工具选择', duration: '4课时 · 3小时', isFree: true, hasQuiz: false },
      { id: 'ch2', title: '第二章：数字人形象创建流程', duration: '5课时 · 4小时', isFree: false, hasQuiz: true },
      { id: 'ch3', title: '第三章：声音克隆与唇形同步', duration: '6课时 · 5小时', isFree: false, hasQuiz: true },
      { id: 'ch4', title: '第四章：商业化变现路径', duration: '4课时 · 3小时', isFree: false, hasQuiz: false },
      { id: 'ch5', title: '结业实战', duration: '3小时', isFree: false, hasQuiz: false },
    ],
  },
  {
    id: 'c3',
    title: '企业数字化转型实战',
    subtitle: '制造业、零售业、服务业数字化落地案例全拆解',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    instructor: '王转型',
    instructorAvatar: 'https://i.pravatar.cc/150?img=51',
    rating: 4.7,
    reviewCount: 654,
    studentCount: 1820,
    duration: '56课时',
    level: '高级',
    price: 5999,
    originalPrice: 8999,
    progress: 0,
    tags: ['数字化转型', '企业咨询', '案例拆解'],
    category: '企业管理',
    chapters: [
      { id: 'ch1', title: '第一章：数字化转型认知框架', duration: '6课时 · 5小时', isFree: true, hasQuiz: true },
      { id: 'ch2', title: '第二章：制造业数字化案例', duration: '8课时 · 7小时', isFree: false, hasQuiz: true },
      { id: 'ch3', title: '第三章：零售业数字化升级', duration: '7课时 · 6小时', isFree: false, hasQuiz: false },
      { id: 'ch4', title: '第四章：数字化组织建设', duration: '6课时 · 5小时', isFree: false, hasQuiz: false },
      { id: 'ch5', title: '结业答辩', duration: '3小时', isFree: false, hasQuiz: false },
    ],
  },
  {
    id: 'c4',
    title: '小红书爆款内容训练课',
    subtitle: 'AI辅助创作，单月涨粉1万+的实战方法论',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
    instructor: '小林同学',
    instructorAvatar: 'https://i.pravatar.cc/150?img=44',
    rating: 4.9,
    reviewCount: 3211,
    studentCount: 8920,
    duration: '21课时',
    level: '进阶',
    price: 999,
    originalPrice: 1499,
    progress: 12,
    tags: ['小红书', '内容营销', 'AI创作'],
    category: '内容运营',
    chapters: [
      { id: 'ch1', title: '第一章：小红书算法与流量逻辑', duration: '3课时 · 2.5小时', isFree: true, hasQuiz: true },
      { id: 'ch2', title: '第二章：AI辅助内容创作工具链', duration: '4课时 · 3小时', isFree: false, hasQuiz: true },
      { id: 'ch3', title: '第三章：爆款标题与封面公式', duration: '3课时 · 2.5小时', isFree: false, hasQuiz: false },
      { id: 'ch4', title: '第四章：数据复盘与迭代优化', duration: '3课时 · 2.5小时', isFree: false, hasQuiz: false },
      { id: 'ch5', title: '结业：完整爆款笔记打造', duration: '3小时', isFree: false, hasQuiz: false },
    ],
  },
]

const PATHS = [
  {
    id: 'lp-1',
    title: '7天 AI 创业启动计划',
    subtitle: '从0到1完成AI产品定位、验证与MVP上线',
    category: 'OPC创业',
    difficulty: '入门',
    totalDuration: '7天',
    totalCourses: 5,
    enrolledCount: 3240,
    rating: 4.9,
    progress: 0,
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80',
    steps: 5,
    completedSteps: 0,
  },
  {
    id: 'lp-2',
    title: '数字人变现三步走',
    subtitle: '7天时间，从0开始创建并商业化你的第一个数字人',
    category: 'AI副业',
    difficulty: '入门',
    totalDuration: '7天',
    totalCourses: 4,
    enrolledCount: 5620,
    rating: 4.8,
    progress: 37,
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80',
    steps: 4,
    completedSteps: 1,
  },
]

// ─── Course Detail ────────────────────────────────────────────────────────────
export const COURSE_DETAIL = {
  id: 'c1',
  title: 'AI 运营实战训练营',
  subtitle: '从 0 到 1 打造百万级私域流量，28天系统化课程',
  thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
  instructor: '张运营',
  instructorAvatar: 'https://i.pravatar.cc/150?img=32',
  instructorTitle: '前字节跳动运营总监',
  rating: 4.9,
  reviewCount: 1847,
  studentCount: 3847,
  duration: '42课时',
  level: '进阶',
  price: 2999,
  originalPrice: 4999,
  category: '运营增长',
  tags: ['私域运营', 'AI工具', '内容创作'],
  isEnrolled: true,
  progress: 35,
}

const CAMPS = [
  {
    id: 'camp-1',
    name: '618大促流量打法共学营',
    tagline: '冲刺618，抢占流量红利',
    description: '3位头部品牌操盘手联袂分享，覆盖选品、投放、转化全链路实战经验',
    category: '大促特训',
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80',
    memberCount: 847,
    maxMembers: 1000,
    startDate: '2026-05-25',
    duration: '7天',
    schedule: '每日20:00直播',
    instructor: '阿吉运营组',
    progress: 0,
    difficulty: '实战',
    rating: 4.8,
    isJoined: false,
    badge: '限时免费',
  },
]

const INSTRUCTORS = [
  {
    id: 'inst-1',
    name: '张运营',
    title: '前字节跳动运营总监',
    avatar: 'https://i.pravatar.cc/150?img=32',
    rating: 4.9,
    reviewCount: 3421,
    studentCount: 12450,
    courseCount: 8,
    specialties: ['私域运营', 'AI增长', '内容营销'],
    badges: ['金牌讲师', '销冠导师'],
    isVerified: true,
    isFollowing: false,
  },
  {
    id: 'inst-2',
    name: '李数字',
    title: '数字人技术专家',
    avatar: 'https://i.pravatar.cc/150?img=25',
    rating: 4.8,
    reviewCount: 2109,
    studentCount: 8920,
    courseCount: 5,
    specialties: ['数字人克隆', 'AI驱动', '商业变现'],
    badges: ['技术大牛'],
    isVerified: true,
    isFollowing: true,
  },
]

const BUDDY = {
  id: 'buddy-1',
  name: '小林同学',
  avatar: 'https://i.pravatar.cc/150?img=44',
  title: '运营新人 · 学习中',
  learningGoal: '想系统学习数字人创建和变现，已完成「数字人入门」第一节',
  matchScore: 94,
  isOnline: true,
  timezone: 'UTC+8',
  interests: ['数字人', '小红书运营', 'AI副业'],
  currentCourse: '数字人从入门到变现',
  streakDays: 12,
  rating: 4.8,
  sessionsCompleted: 18,
  isVerified: false,
  completionRate: 35,
}

// ─── Camp Detail Panel ───────────────────────────────────────────────────────────
function CampDetailPanel({ camp, onClose }: { camp: typeof CAMPS[0]; onClose: () => void }) {
  const [joined, setJoined] = useState(false)
  return (
    <div className="absolute inset-y-0 right-0 z-20 flex flex-col border-l border-[rgba(255,255,255,0.08)] bg-[#0a1628] shadow-2xl w-[340px]">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <span className="text-xs font-medium text-slate-500" style={{ fontFamily: 'monospace' }}>共学营详情</span>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-[#1a2744] hover:text-white transition-colors"><X className="h-4 w-4" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <img src={camp.thumbnail} alt={camp.name} className="w-full h-36 object-cover rounded-2xl mb-4" />
        {camp.badge && (
          <div className="mb-3 flex items-center gap-1 rounded-full bg-[#14D1A0] px-3 py-1 w-fit">
            <Gift className="h-3 w-3 text-black" /><span className="text-[10px] font-bold text-black">{camp.badge}</span>
          </div>
        )}
        <h2 className="mb-2 text-lg font-bold text-slate-900 leading-snug" style={{ fontFamily: 'Space Grotesk, monospace' }}>{camp.name}</h2>
        <p className="mb-4 text-sm text-slate-400">{camp.description}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">{camp.category}</span>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-500">{camp.difficulty}</span>
        </div>
        <div className="mb-4 space-y-2">
          {[
            { icon: Calendar, label: '开营时间', value: camp.startDate },
            { icon: Clock, label: '训练周期', value: camp.duration },
            { icon: BookOpen, label: '学习形式', value: camp.schedule },
            { icon: Users, label: '报名人数', value: `${camp.memberCount}/${camp.maxMembers}人` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 text-sm text-slate-400">
              <Icon className="h-4 w-4 shrink-0 text-slate-500" /><span className="w-20 text-xs">{label}</span>
              <span className="text-slate-900">{value}</span>
            </div>
          ))}
        </div>
        <div className="mb-4 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#0a1628]/60 p-4">
          <p className="mb-2 text-xs font-bold text-slate-400">课程大纲</p>
          <div className="space-y-2">
            {['Day 1-2: 选品策略与竞品分析', 'Day 3-4: 投放素材制作与优化', 'Day 5-6: 转化链路设计与AB测试', 'Day 7: 复盘与后续策略'].map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                <div className="h-1.5 w-1.5 rounded-full bg-[#14D1A0] shrink-0" />
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 p-4 space-y-2">
        {joined ? (
          <>
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#14D1A0] py-3 text-sm font-bold text-emerald-600">
              <MessageSquare className="h-4 w-4" />进入学习群
            </button>
            <p className="text-center text-xs text-slate-500">加群码：OPCX618</p>
          </>
        ) : (
          <button onClick={() => setJoined(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#14D1A0] py-3 text-sm font-bold text-[#010409] transition-all hover:bg-[#14D1A0]/90">
            <ArrowRight className="h-4 w-4" />立即报名加入
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Buddy Detail Panel ─────────────────────────────────────────────────────────
function BuddyDetailPanel({ buddy, onClose }: { buddy: typeof BUDDY; onClose: () => void }) {
  const [tab, setTab] = useState<'profile' | 'chat'>('profile')
  const [message, setMessage] = useState('')
  const [chatMsgs, setChatMsgs] = useState([
    { from: 'them', text: '你好！看到你也在学数字人变现，我们组队吧～' },
    { from: 'me', text: '好的！我已经学完第一节了' },
    { from: 'them', text: '我也是！第三节的AI克隆部分有点难，一起讨论？' },
  ])
  return (
    <div className="absolute inset-y-0 right-0 z-20 flex flex-col border-l border-[rgba(255,255,255,0.08)] bg-[#0a1628] shadow-2xl w-[340px]">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <img src={buddy.avatar} className="h-8 w-8 rounded-full object-cover" />
            <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0a1628] ${buddy.isOnline ? 'bg-[#14D1A0]' : 'bg-slate-600'}`} />
          </div>
          <span className="text-xs font-medium text-slate-500" style={{ fontFamily: 'monospace' }}>学习搭子</span>
        </div>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-[#1a2744] hover:text-white"><X className="h-4 w-4" /></button>
      </div>
      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        {[['profile', '资料'], ['chat', '聊天']].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t as typeof tab)} className={`flex-1 py-3 text-xs font-medium transition-colors ${tab === t ? 'text-emerald-600 border-b-2 border-[#14D1A0]' : 'text-slate-500'}`}>{label}</button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {tab === 'profile' ? (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <img src={buddy.avatar} className="h-16 w-16 rounded-full object-cover ring-2 ring-[#14D1A0]/20" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, monospace' }}>{buddy.name}</h3>
                  {buddy.isVerified && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                </div>
                <p className="text-xs text-slate-500">{buddy.title}</p>
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600"><Zap className="h-3 w-3" />{buddy.matchScore}% 匹配</span>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold text-slate-400">学习目标</p>
              <p className="text-sm text-slate-700">{buddy.learningGoal}</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold text-slate-400">技能标签</p>
              <div className="flex flex-wrap gap-1.5">
                {buddy.interests.map((i) => <span key={i} className="rounded-full bg-[#1a2744] px-2.5 py-1 text-[10px] text-slate-300">#{i}</span>)}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[{ label: '连续打卡', value: `${buddy.streakDays}天` }, { label: '完成课时', value: `${buddy.sessionsCompleted}节` }, { label: '完课率', value: `${buddy.completionRate}%` }].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628]/60 p-3 text-center">
                  <p className="text-sm font-bold text-emerald-600">{value}</p><p className="text-[10px] text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMsgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-xs ${m.from === 'me' ? 'bg-[#14D1A0] text-[#010409]' : 'bg-[rgba(255,255,255,0.08)] text-slate-300'}`}>{m.text}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 p-3 flex gap-2">
              <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && message.trim()) { setChatMsgs([...chatMsgs, { from: "me", text: message }]); setMessage("") } }} placeholder="发消息..." className="flex-1 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#0a1628]/60 px-3 py-2 text-xs text-slate-900 placeholder-slate-500 outline-none focus:border-[#14D1A0]/40" />
              <button onClick={() => { if (message.trim()) { setChatMsgs([...chatMsgs, { from: "me", text: message }]); setMessage("") } }} className="rounded-xl bg-[#14D1A0] px-3 py-2 text-xs font-bold text-[#010409] hover:bg-[#14D1A0]/90 transition-colors">发送</button>
            </div>
          </div>
        )}
      </div>
      {tab === 'profile' && (
        <div className="border-t border-slate-100 p-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#14D1A0] py-3 text-sm font-bold text-[#010409] transition-all hover:bg-[#14D1A0]/90">
            <MessageSquare className="h-4 w-4" />发起搭子学习
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Six-Dimensional Assessment Modal ───────────────────────────────────────────
function SixDimensionalAssessment({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  // Load from localStorage or use default scores
  const [scores, setScores] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('m1-six-dimensional-scores')
      if (saved) {
        try { return JSON.parse(saved) } catch { /* ignore */ }
      }
    }
    return { ai: 72, tools: 65, content: 58, business: 45, community: 38, hardware: 25 }
  })
  const [hasTakenAssessment, setHasTakenAssessment] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('m1-has-taken-assessment') === 'true'
    }
    return false
  })

  const saveAssessment = (newScores: typeof scores) => {
    setScores(newScores)
    localStorage.setItem('m1-six-dimensional-scores', JSON.stringify(newScores))
    localStorage.setItem('m1-has-taken-assessment', 'true')
    setHasTakenAssessment(true)
  }

  const dimensions = [
    { key: 'ai', label: 'AI认知', score: scores.ai },
    { key: 'tools', label: '工具使用', score: scores.tools },
    { key: 'content', label: '内容创作', score: scores.content },
    { key: 'business', label: '商业思维', score: scores.business },
    { key: 'community', label: '社区运营', score: scores.community },
    { key: 'hardware', label: '硬件落地', score: scores.hardware },
  ]
  const avgScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length)
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="w-[480px] rounded-3xl border border-[rgba(255,255,255,0.1)] bg-[#0a1628] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50"><Shield className="h-4 w-4 text-blue-600" /></div>
            <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, monospace' }}>{step === 0 ? '六维能力测评' : '测评结果'}</h2>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-[#1a2744] hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        {step === 0 ? (
          <>
            <p className="mb-4 text-sm text-slate-400">完成测评，了解你在 AI OPC 创业赛道中的六维能力分布。</p>
            <div className="mb-5 space-y-2">
              {dimensions.map((d) => (
                <div key={d.key} className="flex items-center gap-3">
                  <span className="w-20 text-xs text-slate-400">{d.label}</span>
                  <div className="h-2 w-full flex-1 overflow-hidden rounded-full bg-[#0a1628]/60">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${d.score}%` }} /></div>
                  <span className="w-10 text-right text-xs font-bold text-emerald-600">{d.score}</span>
                </div>
              ))}
            </div>
            {hasTakenAssessment && (
              <p className="mb-3 rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-600">已有测评记录 · 平均分 {avgScore} · 可重新生成</p>
            )}
            <div className="flex gap-3">
              <button onClick={() => saveAssessment(scores)} className="flex-1 rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-white hover:bg-emerald-600 transition-all">保存结果</button>
              <button onClick={onClose} className="rounded-2xl border border-[rgba(255,255,255,0.15)] px-4 py-3 text-sm text-slate-300 hover:border-[rgba(255,255,255,0.25)] hover:text-white transition-all">先看看</button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-400">根据你的能力画像，系统为你推荐以下学习路径：</p>
            <div className="mb-5 space-y-2">
              {[{ title: 'AI 内容创作从0到1', match: 92 }, { title: '7天 AI 创业启动计划', match: 78 }].map((rec) => (
                <div key={rec.title} className="flex items-center gap-3 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#0a1628]/60 p-4">
                  <div className="flex-1"><p className="text-sm font-bold text-slate-900">{rec.title}</p><p className="text-xs text-slate-500">匹配度 {rec.match}%</p></div>
                  <span className="text-lg font-bold text-emerald-600">{rec.match}%</span>
                </div>
              ))}
            </div>
            <button onClick={onClose} className="w-full rounded-2xl bg-[#14D1A0] py-3 text-sm font-bold text-[#010409] hover:bg-[#14D1A0]/90 transition-all">开始学习</button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Instructor Detail Panel ─────────────────────────────────────────────────────
function InstructorDetailPanel({ inst, onClose }: { inst: Record<string, unknown>; onClose: () => void }) {
  return (
    <div className="absolute inset-y-0 right-0 z-20 flex flex-col border-l border-[rgba(255,255,255,0.08)] bg-[#0a1628] shadow-2xl w-[340px]">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <span className="text-xs font-medium text-slate-500" style={{ fontFamily: 'monospace' }}>讲师详情</span>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-[#1a2744] hover:text-white transition-colors"><X className="h-4 w-4" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <div className="mb-4 flex flex-col items-center text-center">
          <img src={inst.avatar as string} alt={inst.name as string} className="mb-3 h-16 w-16 rounded-full object-cover" />
          <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, monospace' }}>{inst.name as string}</h3>
          <p className="text-xs text-slate-500">{inst.title as string}</p>
        </div>
        <div className="mb-4 grid grid-cols-3 gap-2 text-center">
          {[
            { label: '学员', value: (inst.studentCount as number).toLocaleString() },
            { label: '评分', value: String(inst.rating as number) },
            { label: '课程', value: `${inst.courseCount as number}门` },
          ].map(s => (
            <div key={s.label} className="rounded-xl bg-[#0a1628]/60 p-3">
              <p className="text-sm font-bold text-slate-900">{s.value}</p>
              <p className="text-[10px] text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <p className="mb-2 text-xs font-bold text-slate-400">讲师简介</p>
          <p className="text-sm leading-relaxed text-slate-500">{inst.bio as string || '深耕AI运营与内容创作领域多年，擅长从0到1搭建私域流量体系，服务过多家头部品牌。'}</p>
        </div>
        <div>
          <p className="mb-2 text-xs font-bold text-slate-400">代表课程</p>
          <div className="space-y-2">
            {['AI运营实战训练营', '私域流量搭建指南'].map((c, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl bg-[#0a1628]/60 p-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600">{i + 1}</div>
                <span className="text-xs font-medium text-slate-700">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#14D1A0] py-3 text-sm font-bold text-[#010409] transition-all hover:bg-[#14D1A0]/90">
          <BookOpen className="h-4 w-4" />查看全部课程
        </button>
      </div>
    </div>
  )
}

// ─── Path Detail Panel ─────────────────────────────────────────────────────────
function PathDetailPanel({ path, onClose }: { path: typeof PATHS[0]; onClose: () => void }) {
  const STEPS = [
    { label: 'AI认知与工具选择', done: true }, { label: '内容创作方法论', done: true },
    { label: '私域流量获取', done: false, locked: true }, { label: '商业变现设计', done: false, locked: true },
    { label: 'MVP 上线与迭代', done: false, locked: true },
  ]
  return (
    <div className="absolute inset-y-0 right-0 z-20 flex flex-col border-l border-[rgba(255,255,255,0.08)] bg-[#0a1628] shadow-2xl w-[340px]">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <span className="text-xs font-medium text-slate-500" style={{ fontFamily: 'monospace' }}>学习路径详情</span>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-[#1a2744] hover:text-white transition-colors"><X className="h-4 w-4" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <img src={path.thumbnail} alt={path.title} className="w-full h-32 object-cover rounded-2xl mb-4" />
        <div className="flex items-center gap-2 mb-2">
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">{path.category}</span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">{path.difficulty}</span>
        </div>
        <h2 className="mb-2 text-lg font-bold text-slate-900 leading-snug" style={{ fontFamily: 'Space Grotesk, monospace' }}>{path.title}</h2>
        <p className="mb-4 text-sm text-slate-400">{path.subtitle}</p>
        <div className="mb-4 flex items-center gap-4 text-xs text-slate-500">
          <span>{path.totalCourses}节课程</span><span>{path.totalDuration}</span>
          <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-[#FFD23F] text-amber-500" />{path.rating}</span>
          <span>{path.enrolledCount.toLocaleString()}人学习</span>
        </div>
        <div className="mb-4 space-y-2">
          <p className="text-xs font-bold text-slate-400">学习阶段</p>
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold shrink-0 ${step.done ? 'bg-[#14D1A0] text-[#010409]' : step.locked ? 'border border-slate-300 text-slate-500' : 'bg-[rgba(255,255,255,0.08)] text-slate-400'}`}>
                {step.done ? '✓' : i + 1}</div>
              <span className={`text-xs ${step.locked ? 'text-slate-500' : 'text-slate-300'}`}>{step.label}</span>
              {step.locked && <Lock className="h-3 w-3 text-slate-500 shrink-0" />}
            </div>
          ))}
        </div>
        <div className="mb-4 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#0a1628]/60 p-4">
          <p className="mb-2 text-xs font-bold text-slate-400">关联 Agent 模板</p>
          <div className="flex items-center gap-2 rounded-xl bg-[#0a1628]/60 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50"><Zap className="h-4 w-4 text-emerald-600" /></div>
            <div className="flex-1"><p className="text-xs font-medium text-slate-900">AI 内容创作助手</p><p className="text-[10px] text-slate-500">学完即可免费试用</p></div>
            <ArrowRight className="h-4 w-4 text-slate-500" />
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#14D1A0] py-3 text-sm font-bold text-[#010409] transition-all hover:bg-[#14D1A0]/90">
          <ArrowRight className="h-4 w-4" />开始学习路径
        </button>
      </div>
    </div>
  )
}

// ─── Detail Panel ──────────────────────────────────────────────────────────────
function DetailPanel({ item, onClose }: { item: Record<string, unknown> | null; onClose: () => void }) {
  if (!item) return null
  return (
    <div className="absolute inset-y-0 right-0 z-20 flex flex-col border-l border-[rgba(255,255,255,0.08)] bg-[#0a1628] shadow-2xl w-[340px]">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <span className="text-xs font-medium text-slate-500" style={{ fontFamily: 'monospace' }}>详情</span>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-[#1a2744] hover:text-white transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {item.thumbnail && (
          <img src={item.thumbnail as string} alt="" className="w-full h-44 object-cover rounded-2xl mb-4" />
        )}
        <div className="flex items-center gap-2 mb-2">
          {item.category && (
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">
              {item.category as string}
            </span>
          )}
          {item.level && (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
              {item.level as string}
            </span>
          )}
        </div>
        <h2 className="mb-2 text-lg font-bold text-slate-900 leading-snug" style={{ fontFamily: 'Space Grotesk, monospace' }}>
          {item.title as string}
        </h2>
        {item.subtitle && (
          <p className="mb-3 text-sm text-slate-400">{item.subtitle as string}</p>
        )}
        {item.description && (
          <p className="mb-4 text-sm leading-relaxed text-slate-300">{item.description as string}</p>
        )}
        {item.tags && Array.isArray(item.tags) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {(item.tags as string[]).map((tag) => (
              <span key={tag} className="rounded-full border border-[rgba(255,255,255,0.1)] bg-[#0a1628]/60 px-2.5 py-1 text-[10px] text-slate-400">
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className="space-y-3">
          {item.rating && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-[#FFD23F] text-amber-500" />
              <span className="text-sm font-bold text-amber-500">{(item.rating as number).toFixed(1)}</span>
              {item.reviewCount && <span className="text-xs text-slate-500">({(item.reviewCount as number).toLocaleString()} 评价)</span>}
            </div>
          )}
          {item.studentCount && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Users className="h-4 w-4" />
              <span>{(item.studentCount as number).toLocaleString()} 学员</span>
            </div>
          )}
          {item.duration && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock className="h-4 w-4" />
              <span>{item.duration as string}</span>
            </div>
          )}
          {item.memberCount && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Users className="h-4 w-4" />
              <span>{item.memberCount as number}人已加入 · 限{item.maxMembers as number}人</span>
            </div>
          )}
          {item.price !== undefined && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-2xl font-bold text-emerald-600">
                {item.price === 0 ? '免费' : `¥${(item.price as number).toLocaleString()}`}
              </span>
              {item.originalPrice && item.originalPrice > 0 && (
                <span className="text-sm text-slate-500 line-through">¥{item.originalPrice as number}</span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-slate-100 p-4 space-y-2">
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#14D1A0] py-3 text-sm font-bold text-[#010409] transition-all hover:bg-[#14D1A0]/90 active:scale-[0.98]">
          <ArrowRight className="h-4 w-4" />
          {item.price === 0 ? '免费学习' : item.price ? `¥${item.price} 立即购买` : '查看详情'}
        </button>
        {(item.studentCount || item.memberCount) && (
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(255,255,255,0.15)] py-2.5 text-sm text-slate-300 transition-all hover:border-[rgba(255,255,255,0.25)] hover:text-white">
            <Play className="h-4 w-4" /> 先试听课程
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Stats Block ───────────────────────────────────────────────────────────────
function StatsBlock() {
  const stats = [
    { label: '课程总数', value: '128', icon: BookOpen, color: '#14D1A0' },
    { label: '学习路径', value: '24', icon: TrendingUp, color: '#2B59C3' },
    { label: '认证导师', value: '36', icon: Award, color: '#FFD23F' },
    { label: '累计学员', value: '4.2万', icon: Users, color: '#14D1A0' },
  ]
  return (
    <div
      className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-br from-[#0a1628] to-[#1a2744] p-4"
      style={{ gridColumn: 'span 1', gridRow: 'span 1' }}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#14D1A0]/20">
          <BookOpen className="h-4 w-4 text-[#14D1A0]" />
        </div>
        <span className="text-xs font-bold text-slate-300" style={{ fontFamily: 'monospace' }}>平台数据</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0a1628]/50 p-3">
            <p className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, monospace', color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#14D1A0]/20 px-3 py-2">
        <Gift className="h-4 w-4 text-[#14D1A0]" />
        <span className="text-xs text-[#14D1A0]">新用户首月课程8折优惠</span>
      </div>
    </div>
  )
}

// ─── Featured Course Block ────────────────────────────────────────────────────
function FeaturedCourseBlock({ course, onClick }: { course: typeof COURSES[0]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628] transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] active:scale-[0.99]"
      style={{ gridColumn: 'span 3', gridRow: 'span 4' }}
    >
      {/* 全高图片背景 */}
      <div className="relative flex-1 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/40 to-transparent" />
        {course.isBestseller && (
          <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-[#FFD23F] px-3 py-1">
            <Star className="h-3 w-3 fill-black text-black" />
            <span className="text-[10px] font-bold text-black">人气爆款</span>
          </div>
        )}
      </div>

      {/* Content overlay on image — top section */}
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600">
              {course.category}
            </span>
            <span className="rounded-full border border-slate-100 bg-slate-200 backdrop-blur-sm px-2.5 py-1 text-[10px] text-slate-900">
              {course.level}
            </span>
          </div>
          <h3 className="mb-2 text-2xl font-bold leading-snug text-slate-900 drop-shadow-lg" style={{ fontFamily: 'Space Grotesk, monospace' }}>
            {course.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm text-slate-900/80">{course.subtitle}</p>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-3">
            <img src={course.instructorAvatar} alt={course.instructor} className="h-8 w-8 rounded-full object-cover ring-1 ring-white/20" />
            <div>
              <p className="text-xs font-medium text-slate-900">{course.instructor}</p>
              <p className="text-[10px] text-slate-900/60">课程讲师</p>
            </div>
          </div>

          <div className="mb-3 flex items-center gap-4 text-xs text-slate-900/70">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-[#FFD23F] text-amber-500" />
              <span className="font-bold text-amber-500">{course.rating}</span>
              <span className="text-slate-900/60">({course.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.studentCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
          </div>

          {course.progress > 0 && (
            <div className="mb-3">
              <div className="mb-1 flex items-center justify-between text-[10px] text-slate-900/60">
                <span>学习进度</span>
                <span className="text-emerald-600">{course.progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200">
                <div className="h-1.5 rounded-full bg-[#14D1A0]" style={{ width: `${course.progress}%` }} />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-600">¥{course.price.toLocaleString()}</span>
              {course.originalPrice > 0 && (
                <span className="text-sm text-slate-900/50 line-through">¥{course.originalPrice}</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-emerald-600 opacity-0 transition-all duration-300 group-hover:opacity-100">
              <span className="text-sm font-bold">查看详情</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

// ─── Course Block ──────────────────────────────────────────────────────────────
function CourseBlock({ course, size, onClick }: { course: typeof COURSES[0]; size: 'md' | 'sm'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628]/60 transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] active:scale-[0.98]"
      style={{ gridColumn: 'span 1' }}
    >
      {/* Image top */}
      <div className="relative overflow-hidden" style={{ height: '70px' }}>
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 to-transparent" />
        {course.isBestseller && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-[#FFD23F] px-2 py-0.5">
            <Star className="h-2.5 w-2.5 fill-black text-black" />
            <span className="text-[9px] font-bold text-black">爆款</span>
          </div>
        )}
        {course.isNew && (
          <div className="absolute left-2 top-2 flex items-center rounded-full bg-[#14D1A0] px-2 py-0.5">
            <span className="text-[9px] font-bold text-black">新课</span>
          </div>
        )}
      </div>

      {/* Content bottom */}
      <div className="flex flex-1 flex-col justify-between p-2.5">
        <div>
          <div className="mb-1 flex items-center gap-1">
            <span className="rounded-full bg-[#2B59C3]/20 px-2 py-0.5 text-[9px] font-medium text-[#2B59C3]">
              {course.level}
            </span>
          </div>
          <h4 className="mb-1 line-clamp-2 text-xs font-bold leading-snug text-white transition-colors group-hover:text-[#14D1A0]" style={{ fontFamily: 'Space Grotesk, monospace' }}>
            {course.title}
          </h4>
          <div className="mb-2 flex items-center gap-2">
            <img src={course.instructorAvatar} alt="" className="h-4 w-4 rounded-full object-cover" />
            <span className="text-[10px] text-slate-400">{course.instructor}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] pt-2">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-[#FFD23F] text-amber-500" />
            <span className="text-[10px] font-bold text-amber-500">{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-[#14D1A0]">¥{course.price}</span>
            {course.originalPrice > 0 && (
              <span className="text-[10px] text-slate-500 line-through">¥{course.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

// ─── Learning Path Block ───────────────────────────────────────────────────────
function PathBlock({ path, size, onClick }: { path: typeof PATHS[0]; size: 'md' | 'lg'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628]/60 transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] active:scale-[0.98]"
      style={{ gridColumn: 'span 1' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: '60px' }}>
        <img src={path.thumbnail} alt={path.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/30 to-transparent" />
        <div className="absolute bottom-1.5 left-2">
          <span className="rounded-full bg-[#14D1A0]/20 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold text-emerald-600">
            {path.category} · {path.difficulty}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-2.5">
        <div>
          <h4 className="mb-1 line-clamp-2 text-xs font-bold leading-snug text-white transition-colors group-hover:text-[#14D1A0]" style={{ fontFamily: 'Space Grotesk, monospace' }}>
            {path.title}
          </h4>
          <p className="line-clamp-1 text-[10px] text-slate-400">{path.subtitle}</p>
        </div>

        <div className="mt-2 space-y-1.5">
          {path.progress > 0 && (
            <div>
              <div className="mb-1 flex items-center justify-between text-[9px] text-slate-400">
                <span>进度</span>
                <span className="text-[#14D1A0]">{path.progress}%</span>
              </div>
              <div className="h-1 w-full rounded-full bg-[rgba(255,255,255,0.08)]">
                <div className="h-1 rounded-full bg-[#14D1A0]" style={{ width: `${path.progress}%` }} />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] pt-1.5">
            <div className="flex items-center gap-2 text-[9px] text-slate-400">
              <span>{path.totalCourses}节</span>
              <span>{path.totalDuration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-[#FFD23F] text-[#FFD23F]" />
              <span className="text-[9px] font-bold text-[#FFD23F]">{path.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

// ─── Camp Block ────────────────────────────────────────────────────────────────
function CampBlock({ camp, onClick }: { camp: typeof CAMPS[0]; onClick: () => void }) {
  // Countdown to start date
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0 })
  useEffect(() => {
    const update = () => {
      const now = new Date()
      const start = new Date(camp.startDate)
      const diff = Math.max(0, start.getTime() - now.getTime())
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
      })
    }
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [camp.startDate])

  // Member avatars — up to 6 shown
  const AVATAR_IDS = [32, 25, 44, 51, 12, 68]
  const shownAvatars = AVATAR_IDS.slice(0, 6)

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628]/60 transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] active:scale-[0.98]"
      style={{ gridColumn: 'span 3' }}
    >
      {/* Full image background */}
      <div className="relative" style={{ height: '130px' }}>
        <img src={camp.thumbnail} alt={camp.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-transparent" />
        {camp.badge && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#14D1A0] px-3 py-1">
            <Gift className="h-3 w-3 text-black" />
            <span className="text-[10px] font-bold text-black">{camp.badge}</span>
          </div>
        )}
        {/* Countdown badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-sm">
          <Clock className="h-3 w-3 text-white" />
          <span className="text-[10px] font-mono font-bold text-white">
            {countdown.days > 0 ? `${countdown.days}天` : countdown.hours > 0 ? `${countdown.hours}时` : `${countdown.mins}分`}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <span className="mb-1 block text-sm font-bold text-white" style={{ fontFamily: 'Space Grotesk, monospace' }}>{camp.name}</span>
          <p className="line-clamp-1 text-[11px] text-slate-400">{camp.tagline}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="mb-2 flex items-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{camp.startDate} 开营</span>
          <span>{camp.duration}</span>
          <span>{camp.schedule}</span>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] pt-2.5">
          {/* Avatar wall — up to 6 members with overlap */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {shownAvatars.map((n, i) => (
                <img
                  key={n}
                  src={`https://i.pravatar.cc/150?img=${n}`}
                  className="h-6 w-6 rounded-full border-2 border-[#0a1628] object-cover"
                  style={{ marginLeft: i > 0 ? '-8px' : 0, zIndex: 6 - i }}
                />
              ))}
              {camp.memberCount > 6 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0a1628] bg-[#0a1628]/50" style={{ marginLeft: '-8px', zIndex: 0 }}>
                  <span className="text-[9px] font-bold text-slate-400">+{camp.memberCount - 6}</span>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400">{camp.memberCount.toLocaleString()}人已报名</span>
          </div>
          <span className="rounded-full bg-[#14D1A0]/20 px-2.5 py-1 text-[10px] font-bold text-[#14D1A0]">立即报名</span>
        </div>
      </div>
    </button>
  )
}

// ─── Instructor Block ──────────────────────────────────────────────────────────
function InstructorBlock({ inst, size, onClick }: { inst: typeof INSTRUCTORS[0]; size: 'md' | 'sm'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628]/60 p-3 text-center transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] active:scale-[0.98]"
      style={{ gridColumn: 'span 1' }}
    >
      <div className="relative mb-3">
        <img src={inst.avatar} alt={inst.name} className="h-16 w-16 rounded-full object-cover ring-2 ring-[rgba(255,255,255,0.08)] transition-all group-hover:ring-[#14D1A0]/30" />
        {inst.isVerified && (
          <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#14D1A0]">
            <CheckCircle2 className="h-3 w-3 text-[#010409]" />
          </div>
        )}
      </div>
      <h4 className="mb-0.5 text-sm font-bold text-white" style={{ fontFamily: 'Space Grotesk, monospace' }}>{inst.name}</h4>
      <p className="mb-2 line-clamp-1 text-[10px] text-slate-400">{inst.title}</p>
      <div className="mb-3 flex flex-wrap justify-center gap-1">
        {inst.specialties.slice(0, 2).map((s) => (
          <span key={s} className="rounded-full bg-[#0a1628]/40 px-2 py-0.5 text-[9px] text-slate-300">{s}</span>
        ))}
      </div>
      <div className="mt-auto flex w-full items-center justify-between border-t border-[rgba(255,255,255,0.04)] pt-3">
        <div className="flex items-center gap-0.5">
          <Star className="h-3 w-3 fill-[#FFD23F] text-[#FFD23F]" />
          <span className="text-[10px] font-bold text-[#FFD23F]">{inst.rating}</span>
        </div>
        <span className="text-[10px] text-slate-400">{(inst.studentCount / 1000).toFixed(1)}k学员</span>
      </div>
    </button>
  )
}

// ─── Buddy Block ──────────────────────────────────────────────────────────────
function BuddyBlock({ buddy, onClick }: { buddy: typeof BUDDY; onClick: () => void }) {
  const [showMatchInfo, setShowMatchInfo] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const { loading, error, execute } = useAction(
    async () => {
      // 搭子功能开发中，后续接入真实API
      return true
    },
    {
      onSuccess: () => setSuccessMsg('搭子功能即将上线！'),
      onError: (e) => console.error(e),
    }
  )

  const matchReasons = [
    { label: '学习目标相似', score: 30 },
    { label: '课程进度接近', score: 25 },
    { label: '兴趣标签重合', score: 20 },
    { label: '在线时间互补', score: 15 },
    { label: '社区活跃度匹配', score: 10 },
  ]

  return (
    <div className="relative" style={{ gridColumn: 'span 3' }}>
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628]/60 p-4 text-left transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] hover:shadow-md active:scale-[0.98] w-full"
    >
      <div className="mb-3 flex items-start gap-3">
        <div className="relative shrink-0">
          <img src={buddy.avatar} alt={buddy.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-[#14D1A0]/20" />
          <div className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-[#0a1628] ${buddy.isOnline ? 'bg-[#14D1A0]' : 'bg-slate-600'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm font-bold text-white" style={{ fontFamily: 'Space Grotesk, monospace' }}>{buddy.name}</h4>
            {buddy.isVerified && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#14D1A0]" />}
          </div>
          <p className="text-[10px] text-slate-400">{buddy.title}</p>
          {/* Match score — clickable */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowMatchInfo(v => !v) }}
            className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#14D1A0]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#14D1A0] hover:bg-[#14D1A0]/30 transition-colors cursor-pointer"
          >
            <Zap className="h-3 w-3" />{buddy.matchScore}% 匹配度
          </button>
        </div>
      </div>

      <p className="mb-3 line-clamp-2 text-xs text-slate-400">{buddy.learningGoal}</p>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {buddy.interests.map((i) => (
          <span key={i} className="rounded-full bg-[#0a1628]/40 px-2 py-0.5 text-[9px] text-slate-300">#{i}</span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] pt-3">
        <div className="flex items-center gap-3 text-[10px] text-slate-500">
          <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{buddy.currentCourse}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />连续{buddy.streakDays}天</span>
        </div>
        <span
          onClick={(e) => { e.stopPropagation(); execute() }}
          className="cursor-pointer rounded-full bg-[#14D1A0] px-3 py-1 text-[10px] font-bold text-[#010409] hover:bg-[#14D1A0]/80 transition-colors"
        >
          发起搭子
        </span>
      </div>
    </button>

    {/* Match explanation tooltip */}
    {showMatchInfo && (
      <div className="absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628] p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold text-white">匹配分解释</p>
          <button onClick={() => setShowMatchInfo(false)} className="text-slate-400 hover:text-slate-200">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="space-y-2">
          {matchReasons.map((r) => (
            <div key={r.label} className="flex items-center gap-2">
              <span className="flex-1 text-xs text-slate-300">{r.label}</span>
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
                <div className="h-full rounded-full bg-[#14D1A0]" style={{ width: `${r.score * 2.5}%` }} />
              </div>
              <span className="text-[10px] font-bold text-[#14D1A0] w-8 text-right">+{r.score}</span>
            </div>
          ))}
          <div className="border-t border-[rgba(255,255,255,0.04)] pt-2 flex items-center justify-between">
            <span className="text-xs font-medium text-white">总分</span>
            <span className="text-sm font-bold text-[#14D1A0]">{buddy.matchScore}%</span>
          </div>
        </div>
        <p className="mt-3 text-[10px] text-slate-400">基于学习行为、兴趣标签和活跃时段综合计算</p>
      </div>
    )}

    <ActionToast loading={loading} error={error} success={successMsg ?? undefined} onClose={() => setSuccessMsg(null)} />
    </div>
  )
}

// ─── Main EducationModule ──────────────────────────────────────────────────────
export default function EducationModule() {
  const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null)
  const [selectedPath, setSelectedPath] = useState<typeof PATHS[0] | null>(null)
  const [selectedCamp, setSelectedCamp] = useState<typeof CAMPS[0] | null>(null)
  const [selectedBuddy, setSelectedBuddy] = useState<typeof BUDDY | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Record<string, unknown> | null>(null)
  const [selectedInstructor, setSelectedInstructor] = useState<Record<string, unknown> | null>(null)
  const [activeTab, setActiveTab] = useState('全部')
  const [contentType, setContentType] = useState<'all' | 'course' | 'path' | 'camp' | 'buddy'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'price'>('popular')
  const [showAssessment, setShowAssessment] = useState(false)

  // Filter logic
  const isSearchActive = searchQuery.trim().length > 0
  const filteredCourses = COURSES.filter(c =>
    !isSearchActive || (
      c.title.includes(searchQuery) ||
      c.instructor.includes(searchQuery) ||
      c.category.includes(searchQuery) ||
      c.tags.some((t: string) => t.includes(searchQuery))
    )
  )
  const filteredPaths = PATHS.filter(p =>
    !isSearchActive || (
      p.title.includes(searchQuery) ||
      p.category.includes(searchQuery)
    )
  )
  const tabFilter = activeTab === '全部' ? null : activeTab
  const contentFilter = contentType === 'all' ? null : contentType
  const levelFiltered = tabFilter
    ? COURSES.filter(c => c.level === tabFilter)
    : COURSES
  const contentFiltered = contentFilter
    ? levelFiltered.filter(c => c.category === contentFilter)
    : levelFiltered
  const sortFn = (a: typeof COURSES[0], b: typeof COURSES[0]) => {
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'newest') return b.id.localeCompare(a.id)
    if (sortBy === 'price') return a.price - b.price
    if (sortBy === 'popular') return b.studentCount - a.studentCount
    return 0
  }
  const displayCourses = [...contentFiltered].sort(sortFn)
  // contentType filter: when not 'all', show only that type's cards
  const showMagazineLayout = !isSearchActive && !tabFilter && contentType === 'all'
  const showFeaturedTop = !isSearchActive && !tabFilter && contentType === 'course'
  const showFeaturedTopPath = !isSearchActive && !tabFilter && contentType === 'path'
  const displayBlocks = showMagazineLayout ? BLOCKS : null

  const getBlockContent = (block: Block) => {
    switch (block.type) {
      case 'stats':
        return <StatsBlock key={block.id} />
      case 'featured_course':
        return (
          <FeaturedCourseBlock
            key={block.id}
            course={COURSES[0]}
            onClick={() => setSelectedCourse(COURSES[0])}
          />
        )
      case 'course': {
        const idx = parseInt(block.id.split('-')[1])
        const c = COURSES[idx % COURSES.length]
        return (
          <CourseBlock
            key={block.id}
            course={c}
            size={block.size as 'md' | 'sm'}
            onClick={() => setSelectedCourse(c)}
          />
        )
      }
      case 'path': {
        const idx = parseInt(block.id.split('-')[1])
        const p = PATHS[idx % PATHS.length]
        return (
          <PathBlock
            key={block.id}
            path={p}
            size={block.size as 'md' | 'lg'}
            onClick={() => { setSelectedPath(p); setSelectedItem(null) }}
          />
        )
      }
      case 'camp':
        return (
          <CampBlock
            key={block.id}
            camp={CAMPS[0]}
            onClick={() => { setSelectedCamp(CAMPS[0]); setSelectedItem(null) }}
          />
        )
      case 'instructor': {
        const idx = parseInt(block.id.split('-')[1])
        const inst = INSTRUCTORS[idx % INSTRUCTORS.length]
        return (
          <InstructorBlock
            key={block.id}
            inst={inst}
            size={block.size as 'md' | 'sm'}
            onClick={() => setSelectedItem(inst as unknown as Record<string, unknown>)}
          />
        )
      }
      case 'buddy':
        return (
          <BuddyBlock
            key={block.id}
            buddy={BUDDY}
            onClick={() => { setSelectedBuddy(BUDDY); setSelectedItem(null) }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628]">
      {/* Header — 深色，突出搜索和筛选区 */}
      <div className="flex flex-col border-b border-[rgba(255,255,255,0.06)] bg-[#0a1628] px-6 py-4 shrink-0 gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14D1A0]/20">
              <BookOpen className="h-5 w-5 text-[#14D1A0]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white" style={{ fontFamily: 'Space Grotesk, monospace' }}>技能教育</h1>
              <p className="text-[10px] text-slate-400" style={{ fontFamily: 'monospace' }}>课程 · 路径 · 导师 · 学习伙伴</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm font-bold tabular-nums text-white" style={{ fontFamily: 'monospace' }}>4</p>
              <p className="text-[10px] text-slate-400">课程</p>
            </div>
            <div className="h-5 w-px bg-[rgba(255,255,255,0.08)]" />
            <div className="text-center">
              <p className="text-sm font-bold tabular-nums text-[#14D1A0]" style={{ fontFamily: 'monospace' }}>2</p>
              <p className="text-[10px] text-slate-400">路径</p>
            </div>
            <div className="h-5 w-px bg-[rgba(255,255,255,0.08)]" />
            <div className="text-center">
              <p className="text-sm font-bold tabular-nums text-[#FFD23F]" style={{ fontFamily: 'monospace' }}>36</p>
              <p className="text-[10px] text-slate-400">导师</p>
            </div>
            <div className="h-5 w-px bg-[rgba(255,255,255,0.08)]" />
            <button
              onClick={() => setShowAssessment(true)}
              className="flex items-center gap-1.5 rounded-xl border border-[#2B59C3]/30 bg-[#2B59C3]/20 px-3 py-1.5 text-xs font-medium text-[#2B59C3] transition-all hover:border-[#2B59C3]/50 hover:bg-[#2B59C3]/30"
            >
              <Shield className="h-3.5 w-3.5" />六维测评
            </button>
          </div>
        </div>
        {/* 搜索 + 分类标签 */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索课程、讲师或学习路径..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628]/60 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-400 outline-none focus:border-[#14D1A0] focus:bg-[#0a1628]/80 transition-colors"
            />
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628]/60 p-1">
            {['全部', '入门', '进阶', '高级', '免费'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${activeTab === tab ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628]/60 p-1">
            {[
              { id: 'all', label: '全部' },
              { id: 'course', label: '课程' },
              { id: 'path', label: '路径' },
              { id: 'camp', label: '共学营' },
              { id: 'buddy', label: '搭子' },
            ].map((ct) => (
              <button
                key={ct.id}
                onClick={() => setContentType(ct.id as typeof contentType)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${contentType === ct.id ? 'bg-[#14D1A0] text-[#010409]' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {ct.label}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628]/60 px-3 py-2 text-xs text-slate-300 outline-none focus:border-[#14D1A0]"
          >
            <option value="popular">最热</option>
            <option value="rating">评分最高</option>
            <option value="newest">最新</option>
            <option value="price">价格</option>
          </select>
        </div>
      </div>

      {/* 内容区 — 深色背景 + 卡片式布局 */}
      <div className="relative flex-1 overflow-hidden bg-[#0a1628]">
        <div className="absolute inset-0 overflow-auto p-4">
          {isSearchActive ? (
            /* 搜索结果视图 */
            <div>
              <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
                <Search className="h-4 w-4" />
                <span>找到 <span className="font-bold text-white">{filteredCourses.length + filteredPaths.length}</span> 个结果：</span>
                <span className="rounded-full bg-[rgba(255,255,255,0.08)] px-2 py-0.5 text-xs text-slate-300">"{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="ml-auto flex items-center gap-1 text-xs text-[#14D1A0] hover:underline">
                  <X className="h-3 w-3" />清除
                </button>
              </div>
              {filteredCourses.length === 0 && filteredPaths.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)]">
                    <Search className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">未找到"{searchQuery}"</h3>
                  <p className="text-sm text-slate-400">试试其他关键词，或<button onClick={() => setSearchQuery('')} className="text-[#14D1A0] hover:underline">查看全部课程</button></p>
                </div>
              ) : (
                <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(6, 1fr)', gridAutoRows: '150px' }}>
                  {filteredCourses.map((c, i) => (
                    <CourseBlock
                      key={c.id}
                      course={c}
                      size="md"
                      onClick={() => setSelectedCourse(c)}
                    />
                  ))}
                  {filteredPaths.map((p, i) => (
                    contentType !== 'course' && (
                    <PathBlock
                      key={p.id}
                      path={p}
                      size="lg"
                      onClick={() => { setSelectedPath(p); setSelectedItem(null) }}
                    />
                    )
                  ))}
                </div>
              )}
            </div>
          ) : showFeaturedTop ? (
            <div className="space-y-3">
              <FeaturedCourseBlock course={COURSES[0]} onClick={() => setSelectedCourse(COURSES[0])} />
              <div className="grid grid-cols-2 gap-3">
                {COURSES.slice(1).map(c => (
                  <CourseBlock key={c.id} course={c} size="md" onClick={() => setSelectedCourse(c)} />
                ))}
              </div>
            </div>
          ) : showFeaturedTopPath ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-[#14D1A0]/30 bg-[#14D1A0]/10 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#14D1A0]" />
                  <span className="text-xs font-bold text-[#14D1A0]">推荐路径</span>
                </div>
                <p className="text-sm font-bold text-white">AI 内容创作从0到1 · 8节课程</p>
                <p className="text-xs text-slate-400">匹配度 98%</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {PATHS.slice(0, 2).map(p => (
                  <PathBlock key={p.id} path={p} size="md" onClick={() => setSelectedPath(p)} />
                ))}
              </div>
            </div>
          ) : displayBlocks ? (
            /* 默认网格视图 */
            <div
              className="grid min-h-full gap-3"
              style={{ gridTemplateColumns: 'repeat(6, 1fr)', gridAutoRows: '150px' }}
            >
              {BLOCKS.map(getBlockContent)}
            </div>
          ) : (
            /* Tab 筛选视图 */
            <div
              className="grid min-h-full gap-3"
              style={{ gridTemplateColumns: 'repeat(6, 1fr)', gridAutoRows: '150px' }}
            >
              {displayCourses.map((c, i) => (
                <CourseBlock
                  key={c.id}
                  course={c}
                  size="md"
                  onClick={() => setSelectedCourse(c)}
                />
              ))}
            </div>
          )}
        </div>
        {selectedItem && <DetailPanel item={selectedItem} onClose={() => setSelectedItem(null)} />}
        {selectedPath && <PathDetailPanel path={selectedPath} onClose={() => setSelectedPath(null)} />}
        {selectedInstructor && <InstructorDetailPanel inst={selectedInstructor} onClose={() => setSelectedInstructor(null)} />}
        {selectedCamp && <CampDetailPanel camp={selectedCamp} onClose={() => setSelectedCamp(null)} />}
        {selectedBuddy && <BuddyDetailPanel buddy={selectedBuddy} onClose={() => setSelectedBuddy(null)} />}
        {showAssessment && <SixDimensionalAssessment onClose={() => setShowAssessment(false)} />}
        {selectedCourse && (
          <CourseDetailPage
            course={selectedCourse}
            onBack={() => setSelectedCourse(null)}
            onEnroll={(id) => console.log('enroll', id)}
          />
        )}
      </div>
    </div>
  )
}
