'use client'

import { useState, useEffect, useCallback, type ElementType } from 'react'
import {
  Users, MessageSquare, Trophy, Briefcase,
  X, Star, Zap, Clock, Eye, Shield, ArrowRight,
  BookOpen, Calendar, Heart, Send, CheckCircle2,
  ChevronRight, ChevronLeft, Play, Bell, TrendingUp,
  Crown, Plus, Image, Tag, Clock3, Pencil, Award,
  Flame, Pin, Search, Megaphone, CircleDot,
  StarHalf, Moon, ShoppingBag, Bot, Sparkles, Cpu
} from 'lucide-react'
import KnowledgeBase from './KnowledgeBase'
import DiscussionZone from './DiscussionZone'
import TalentMarket from './TalentMarket'
import SectCreate from './SectCreate'

// ─── Types ───────────────────────────────────────────────────────────────────

type Theme = 'dark' | 'light'

interface Circle {
  id: string
  name: string
  icon: ElementType
  color: string
  count: number
  desc: string
  members: number
  isHot?: boolean
}

interface Competition {
  id: string
  title: string
  banner: string
  prize: string
  deadline: string
  participants: number
  organizer: string
  status: '报名中' | '进行中' | '已结束'
  statusColor: string
  tags: string[]
  description: string
  circleId?: string
}

interface Post {
  id: string
  title: string
  author: string
  authorAvatar: string
  circle: string
  circleColor: string
  thumbnail: string
  summary: string
  likes: number
  comments: number
  views: string
  time: string
  isPinned?: boolean
  isHot?: boolean
  isCompetition?: boolean
  tags: string[]
  relatedCaseId?: string
  communityPostId?: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CIRCLES: Circle[] = [
  { id: 'c1', name: '知识库', icon: BookOpen, color: '#14D1A0', count: 128, desc: '精选文章与教程', members: 3420, isHot: true },
  { id: 'c2', name: '讨论区', icon: MessageSquare, color: '#2B59C3', count: 2047, desc: '问答与经验交流', members: 12840, isHot: true },
  { id: 'c3', name: '赛事活动', icon: Trophy, color: '#FFD23F', count: 36, desc: '竞赛与线下活动', members: 8920, isHot: false },
  { id: 'c4', name: '人才集市', icon: Briefcase, color: '#FF6B6B', count: 512, desc: '招聘与组队', members: 4560, isHot: false },
  { id: 'c5', name: '运营实战', icon: Zap, color: '#A855F7', count: 876, desc: '案例与实战分享', members: 6780, isHot: true },
  { id: 'c6', name: '资源对接', icon: CircleDot, color: '#14B8D1', count: 324, desc: '品牌与服务对接', members: 2340, isHot: false },
]

const COMPETITIONS: Competition[] = [
  {
    id: 'comp-1',
    title: '2026 AI 创新创业大赛',
    banner: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    prize: '¥50,000',
    deadline: '2026-06-01',
    participants: 1247,
    organizer: '蔚蓝平台',
    status: '报名中',
    statusColor: '#14D1A0',
    tags: ['AI', '创新', '创业'],
    description: '汇聚全国AI创业精英，探索技术创新与商业落地新路径',
    circleId: 'c5',
  },
  {
    id: 'comp-2',
    title: '短视频创意挑战赛·夏季赛',
    banner: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80',
    prize: '¥20,000',
    deadline: '2026-05-28',
    participants: 3421,
    organizer: '内容创作联盟',
    status: '进行中',
    statusColor: '#A855F7',
    tags: ['短视频', '创意', '内容'],
    description: '用创意点亮内容，用镜头记录生活，赢取丰厚奖金',
    circleId: 'c1',
  },
  {
    id: 'comp-3',
    title: '私域增长黑客松',
    banner: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    prize: '¥15,000',
    deadline: '2026-05-15',
    participants: 486,
    organizer: '运营增长社区',
    status: '已结束',
    statusColor: '#64748b',
    tags: ['私域', '增长', 'Hackathon'],
    description: '24小时极限挑战，私域增长方案路演与实战',
    circleId: 'c5',
  },
]

const POSTS: Post[] = [
  {
    id: 'p1',
    title: '蔚蓝 OPC 平台 2.0 正式发布！全模块 AI 能力升级',
    author: '蔚蓝官方',
    authorAvatar: 'https://i.pravatar.cc/150?img=1',
    circle: '运营公告',
    circleColor: '#14D1A0',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80',
    summary: '全新2.0版本上线，集成阿吉智能助手，支持全模块AI辅助创作与分析，新增数字人直播、硬件智能匹配等功能模块。',
    likes: 2847,
    comments: 342,
    views: '12.4k',
    time: '3天前',
    isPinned: true,
    isHot: true,
    isCompetition: false,
    tags: ['公告', '产品更新', 'AI助手'],
  },
  {
    id: 'p2',
    title: '【参赛作品】AI + 教育赛道创业方案：智能学习伴侣',
    author: '创业老王',
    authorAvatar: 'https://i.pravatar.cc/150?img=12',
    circle: '赛事活动',
    circleColor: '#FFD23F',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    summary: '针对K12教育市场，打造AI智能学习伴侣，实现个性化学习路径规划与实时答疑。',
    likes: 1847,
    comments: 213,
    views: '8.2k',
    time: '2小时前',
    isPinned: false,
    isHot: true,
    isCompetition: true,
    tags: ['AI教育', '创业大赛', '智能学习'],
  },
  {
    id: 'p3',
    title: '手把手教你用 AI Agents 打造自动化运营体系，月流水提升 300%',
    author: '小林同学',
    authorAvatar: 'https://i.pravatar.cc/150?img=44',
    circle: '讨论区',
    circleColor: '#2B59C3',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80',
    summary: '分享如何利用AI Agents实现运营流程自动化，从内容生产到数据反馈全链路覆盖。',
    likes: 234,
    comments: 87,
    views: '3.1k',
    time: '5小时前',
    isPinned: false,
    isHot: false,
    isCompetition: false,
    tags: ['AI运营', 'Agents', '自动化'],
    relatedCaseId: 'case-1',
    communityPostId: 'cp-101',
  },
  {
    id: 'p4',
    title: '【招募】2026 AI 创新大赛寻找技术合伙人',
    author: '创业少女阿朵',
    authorAvatar: 'https://i.pravatar.cc/150?img=47',
    circle: '人才集市',
    circleColor: '#FF6B6B',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
    summary: '已有MVP产品，寻找有AI落地经验的技术合伙人，共同冲击决赛名额。',
    likes: 567,
    comments: 124,
    views: '4.7k',
    time: '8小时前',
    isPinned: false,
    isHot: false,
    isCompetition: true,
    tags: ['招募', '技术合伙', 'AI大赛'],
  },
  {
    id: 'p5',
    title: '私域流量运营全攻略：从引流到转化的完整闭环',
    author: '增长官阿杰',
    authorAvatar: 'https://i.pravatar.cc/150?img=33',
    circle: '运营实战',
    circleColor: '#A855F7',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    summary: '私域流量是当前最核心的资产之一，本文手把手教你从0到1搭建私域运营体系。',
    likes: 1847,
    comments: 213,
    views: '8.2k',
    time: '1天前',
    isPinned: false,
    isHot: true,
    isCompetition: false,
    tags: ['私域流量', '用户运营', '转化'],
    relatedCaseId: 'case-2',
    communityPostId: 'cp-205',
  },
  {
    id: 'p6',
    title: 'M2 市场对接：品牌方与服务商的高效匹配策略',
    author: '莉莉安',
    authorAvatar: 'https://i.pravatar.cc/150?img=25',
    circle: '资源对接',
    circleColor: '#14B8D1',
    thumbnail: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&q=80',
    summary: '品牌方如何在 M2 市场找到最合适的运营服务商？本文分享5个高效匹配策略。',
    likes: 678,
    comments: 89,
    views: '5.1k',
    time: '2天前',
    isPinned: false,
    isHot: false,
    isCompetition: false,
    tags: ['M2市场', '品牌对接', '服务商'],
    relatedCaseId: 'case-3',
    communityPostId: 'cp-310',
  },
]

// ─── Latest Cases (from M2 Agent Market) ─────────────────────────────────────

const LATEST_CASES = [
  {
    id: 'case-1',
    title: '电商数字人直播：GMV 提升 45%',
    toolUsed: '直播带货数字人·小蓝',
    effect: 'GMV +45%',
    author: { name: '电商老张', avatar: 'https://i.pravatar.cc/150?img=11' },
    thumbnail: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=400&q=80',
    commentCount: 12,
    viewCount: 342,
    communityPostId: 'p2',
    createdAt: '2026-05-10',
  },
  {
    id: 'case-2',
    title: 'AI 辅助教学：效率提升 300%',
    toolUsed: '智能客服数字人·小雅',
    effect: '效率 +300%',
    author: { name: '教育创新者', avatar: 'https://i.pravatar.cc/150?img=22' },
    thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80',
    commentCount: 8,
    viewCount: 215,
    communityPostId: 'p3',
    createdAt: '2026-05-08',
  },
  {
    id: 'case-3',
    title: '私域运营自动化：月流水翻 3 倍',
    toolUsed: 'AI 文案生成器·妙笔',
    effect: '月流水 ×3',
    author: { name: '增长官阿杰', avatar: 'https://i.pravatar.cc/150?img=53' },
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
    commentCount: 23,
    viewCount: 567,
    communityPostId: 'p5',
    createdAt: '2026-05-05',
  },
]

// ─── Quick Entry Grid Data ────────────────────────────────────────────────────

const QUICK_ENTRIES = [
  { id: 'community', label: '超级社区', icon: Users, color: '#14D1A0', desc: '竞赛 · 圈子 · 讨论' },
  { id: 'education', label: '技能教育', icon: BookOpen, color: '#2B59C3', desc: '课程 · 路径 · 共学' },
  { id: 'market', label: 'AGENT市场', icon: Bot, color: '#A855F7', desc: '工具 · 案例 · 算力' },
  { id: 'creation', label: '创作中心', icon: Sparkles, color: '#FFD23F', desc: '编辑 · 发布 · 变现' },
]

// ─── Theme-aware color hooks ─────────────────────────────────────────────────

function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')
  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) setTheme(stored)
    else if (window.matchMedia('(prefers-color-scheme: light)').matches) setTheme('light')
  }, [])
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      return next
    })
  }, [])
  return { theme, setTheme, toggleTheme }
}

// ─── Theme colors helper ─────────────────────────────────────────────────────

interface ThemeColors {
  bg: string
  bgSecondary: string
  bgTertiary: string
  border: string
  borderHover: string
  text: string
  textSecondary: string
  textMuted: string
  card: string
  cardHover: string
}

function getThemeColors(theme: Theme): ThemeColors {
  return {
    bg: theme === 'dark' ? '#0a1628' : '#f8fafc',
    bgSecondary: theme === 'dark' ? '#0f172a' : '#f1f5f9',
    bgTertiary: theme === 'dark' ? '#1e293b' : '#e2e8f0',
    border: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    borderHover: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
    text: theme === 'dark' ? '#f1f5f9' : '#0f172a',
    textSecondary: theme === 'dark' ? '#94a3b8' : '#475569',
    textMuted: theme === 'dark' ? '#64748b' : '#94a3b8',
    card: theme === 'dark' ? '#0f172a' : '#ffffff',
    cardHover: theme === 'dark' ? '#1e293b' : '#f8fafc',
  }
}

// ─── CompetitionBanner Carousel ───────────────────────────────────────────────

function CompetitionBannerCarousel({ competitions, theme, onJoin }: {
  competitions: Competition[]
  theme: Theme
  onJoin: (comp: Competition) => void
}) {
  const [current, setCurrent] = useState(0)
  const colors = getThemeColors(theme)
  const total = competitions.length

  const prev = () => setCurrent(c => (c - 1 + total) % total)
  const next = () => setCurrent(c => (c + 1) % total)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % total), 5000)
    return () => clearInterval(timer)
  }, [total])

  const comp = competitions[current]

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: `linear-gradient(135deg, ${colors.bgSecondary} 0%, ${colors.bg} 100%)`,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={comp.banner}
          alt={comp.title}
          className="h-full w-full object-cover transition-all duration-700"
          style={{ transform: `translateX(-${current * 100}%)` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${colors.bg}cc 0%, transparent 60%)`,
          }}
        />

        {/* Status badge */}
        <div
          className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
          style={{ backgroundColor: comp.statusColor, color: '#010409' }}
        >
          <Trophy className="h-3.5 w-3.5" />
          {comp.status}
        </div>

        {/* Navigation dots */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {competitions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === current ? 24 : 8,
                backgroundColor: i === current ? comp.statusColor : `${colors.border}`,
              }}
            />
          ))}
        </div>

        {/* Arrow nav */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-md transition-all hover:scale-110"
          style={{ backgroundColor: `${colors.bg}cc`, color: colors.text }}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-md transition-all hover:scale-110"
          style={{ backgroundColor: `${colors.bg}cc`, color: colors.text }}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              {comp.tags.map(tag => (
                <span
                  key={tag}
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{ backgroundColor: `${comp.statusColor}22`, color: comp.statusColor }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3
              className="mb-1 text-base font-bold truncate"
              style={{ fontFamily: 'Space Grotesk, monospace', color: colors.text }}
            >
              {comp.title}
            </h3>
            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
              {comp.description}
            </p>
            <div
              className="mt-2 flex items-center gap-4 text-xs"
              style={{ color: colors.textMuted }}
            >
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {comp.participants.toLocaleString()}人
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                截止 {comp.deadline}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5" />
                {comp.organizer}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className="text-xl font-black"
              style={{ fontFamily: 'Space Grotesk, monospace', color: comp.statusColor }}
            >
              {comp.prize}
            </span>
            <button
              onClick={() => onJoin(comp)}
              className="rounded-xl px-4 py-2 text-xs font-bold transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: comp.statusColor,
                color: '#010409',
              }}
            >
              {comp.status === '报名中' ? '立即报名' : comp.status === '进行中' ? '查看详情' : '查看回顾'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── CircleList Sidebar ──────────────────────────────────────────────────────

function CircleListSidebar({
  circles,
  activeCircle,
  onCircleClick,
  theme,
}: {
  circles: Circle[]
  activeCircle: string | null
  onCircleClick: (id: string) => void
  theme: Theme
}) {
  const colors = getThemeColors(theme)

  return (
    <div
      className="flex h-full w-56 flex-col overflow-hidden rounded-2xl p-3"
      style={{
        background: colors.bgSecondary,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className="text-xs font-bold"
          style={{ fontFamily: 'Space Grotesk, monospace', color: colors.text }}
        >
          社区圈子
        </span>
        <span
          className="text-[10px]"
          style={{ color: colors.textMuted }}
        >
          {circles.length} 个
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {circles.map((circle) => {
          const Icon = circle.icon
          const isActive = activeCircle === circle.id
          return (
            <button
              key={circle.id}
              onClick={() => onCircleClick(circle.id)}
              className="group relative flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-200"
              style={{
                backgroundColor: isActive ? `${circle.color}15` : 'transparent',
                border: `1px solid ${isActive ? circle.color + '40' : 'transparent'}`,
              }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: circle.color + '22' }}
              >
                <Icon className="h-4 w-4" style={{ color: circle.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p
                    className="text-xs font-medium truncate"
                    style={{ fontFamily: 'Space Grotesk, monospace', color: isActive ? circle.color : colors.text }}
                  >
                    {circle.name}
                  </p>
                  {circle.isHot && (
                    <Flame className="h-3 w-3 shrink-0 text-orange-500" />
                  )}
                </div>
                <p
                  className="text-[10px] truncate"
                  style={{ color: colors.textMuted }}
                >
                  {circle.members.toLocaleString()} 成员
                </p>
              </div>
              <div
                className="flex items-center"
                style={{ color: circle.color }}
              >
                <span className="text-[10px] font-bold">{circle.count}</span>
                <ChevronRight
                  className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                  style={{ color: colors.textMuted }}
                />
              </div>
            </button>
          )
        })}
      </div>

      <div
        className="mt-3 flex items-center justify-center rounded-xl py-2.5 text-xs font-medium transition-all hover:opacity-80 cursor-pointer"
        style={{
          border: `1px dashed ${colors.border}`,
          color: colors.textSecondary,
        }}
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        创建圈子
      </div>
    </div>
  )
}

// ─── CompetitionCard ──────────────────────────────────────────────────────────

function CompetitionCard({ comp, theme, onJoin }: {
  comp: Competition
  theme: Theme
  onJoin: (comp: Competition) => void
}) {
  const colors = getThemeColors(theme)

  return (
    <div
      className="group overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="relative h-28 overflow-hidden">
        <img
          src={comp.banner}
          alt={comp.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to top, ${colors.card} 0%, transparent 60%)` }}
        />
        <div
          className="absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold"
          style={{ backgroundColor: comp.statusColor, color: '#010409' }}
        >
          <Trophy className="h-3 w-3" />
          {comp.status}
        </div>
        <div
          className="absolute right-3 top-3 text-lg font-black"
          style={{ fontFamily: 'Space Grotesk, monospace', color: comp.statusColor }}
        >
          {comp.prize}
        </div>
      </div>
      <div className="p-3">
        <h4
          className="mb-1 line-clamp-1 text-sm font-bold"
          style={{ fontFamily: 'Space Grotesk, monospace', color: colors.text }}
        >
          {comp.title}
        </h4>
        <p className="mb-2 text-[10px]" style={{ color: colors.textSecondary }}>
          {comp.organizer} · {comp.participants.toLocaleString()}人参与
        </p>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {comp.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="rounded-full px-2 py-0.5 text-[9px]"
                style={{ backgroundColor: `${comp.statusColor}15`, color: comp.statusColor }}
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => onJoin(comp)}
            className="rounded-lg px-3 py-1 text-[10px] font-bold transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: comp.statusColor, color: '#010409' }}
          >
            {comp.status === '报名中' ? '报名' : '查看'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── PostCard ─────────────────────────────────────────────────────────────────

function PostCard({ post, theme, onClick }: {
  post: Post
  theme: Theme
  onClick: () => void
}) {
  const colors = getThemeColors(theme)

  return (
    <button
      onClick={onClick}
      className="group flex w-full items-start gap-3 rounded-2xl p-4 text-left transition-all duration-300 hover:scale-[1.01]"
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
        <img
          src={post.thumbnail}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {post.isCompetition && (
          <div className="absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-tl-xl rounded-br-xl bg-amber-500 text-[8px]">
            🏅
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          {post.isCompetition && (
            <span
              className="flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold"
              style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}
            >
              🏅 竞赛
            </span>
          )}
          {post.isPinned && (
            <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">
              <Pin className="h-2.5 w-2.5" /> 置顶
            </span>
          )}
          {post.isHot && (
            <span className="flex items-center gap-0.5 rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold text-red-500">
              <Zap className="h-2.5 w-2.5" /> 热
            </span>
          )}
          <span
            className="rounded-full px-2 py-0.5 text-[9px] font-bold"
            style={{ backgroundColor: `${post.circleColor}22`, color: post.circleColor }}
          >
            {post.circle}
          </span>
          {post.relatedCaseId && (
            <span className="flex items-center gap-0.5 rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-500">
              🔗 关联案例
            </span>
          )}
        </div>

        <h4
          className="mb-1 line-clamp-2 text-sm font-bold leading-snug transition-colors group-hover:text-emerald-500"
          style={{ fontFamily: 'Space Grotesk, monospace', color: colors.text }}
        >
          {post.title}
        </h4>

        <div className="mb-2 flex items-center gap-2">
          <img
            src={post.authorAvatar}
            alt={post.author}
            className="h-5 w-5 rounded-full object-cover"
          />
          <span className="text-[10px]" style={{ color: colors.textSecondary }}>
            {post.author}
          </span>
          <span className="text-[10px]" style={{ color: colors.textMuted }}>·</span>
          <span className="text-[10px]" style={{ color: colors.textMuted }}>
            {post.time}
          </span>
        </div>

        <div
          className="flex items-center gap-3 text-[10px]"
          style={{ color: colors.textMuted }}
        >
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {post.likes.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {post.comments}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {post.views}
          </span>
        </div>
      </div>
    </button>
  )
}

// ─── Posting Modal ────────────────────────────────────────────────────────────

function PostingModal({ theme, circles, onClose, onPost }: {
  theme: Theme
  circles: Circle[]
  onClose: () => void
  onPost: (data: { title: string; content: string; circle: string; tags: string[]; isCompetition: boolean }) => void
}) {
  const colors = getThemeColors(theme)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedCircle, setSelectedCircle] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isCompetition, setIsCompetition] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleSubmit = () => {
    if (title.trim() && content.trim() && selectedCircle) {
      onPost({ title, content, circle: selectedCircle, tags, isCompetition })
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        onClick={onClose}
      >
        <div
          className="mx-4 w-full max-w-md rounded-3xl p-8 text-center"
          style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
          onClick={e => e.stopPropagation()}
        >
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: '#14D1A022' }}
          >
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h3
            className="mb-2 text-xl font-bold"
            style={{ fontFamily: 'Space Grotesk, monospace', color: colors.text }}
          >
            发布成功！
          </h3>
          <p className="mb-6 text-sm" style={{ color: colors.textSecondary }}>
            您的内容已提交，社区管理员将在24小时内审核
          </p>
          <button
            onClick={onClose}
            className="rounded-xl px-6 py-2.5 text-sm font-bold transition-all hover:scale-105"
            style={{ backgroundColor: '#14D1A0', color: '#010409' }}
          >
            完成
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl"
        style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between border-b p-5"
          style={{ borderColor: colors.border, backgroundColor: colors.bg }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:opacity-80"
              style={{ border: `1px solid ${colors.border}`, color: colors.textSecondary }}
            >
              <X className="h-4 w-4" />
            </button>
            <div>
              <h2
                className="text-base font-bold"
                style={{ fontFamily: 'Space Grotesk, monospace', color: colors.text }}
              >
                发布内容
              </h2>
              <p className="text-[10px]" style={{ color: colors.textMuted }}>
                选择圈子并完善以下信息
              </p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || !selectedCircle}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundColor: '#14D1A0', color: '#010409' }}
          >
            <Send className="h-4 w-4" />
            发布
          </button>
        </div>

        <div className="space-y-5 p-5">
          {/* Circle selector */}
          <div>
            <label className="mb-2 block text-xs font-medium" style={{ color: colors.textSecondary }}>
              选择圈子 <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {circles.map(circle => {
                const Icon = circle.icon
                const isSelected = selectedCircle === circle.id
                return (
                  <button
                    key={circle.id}
                    onClick={() => setSelectedCircle(circle.id)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition-all"
                    style={{
                      border: `1px solid ${isSelected ? circle.color : colors.border}`,
                      backgroundColor: isSelected ? `${circle.color}15` : 'transparent',
                      color: isSelected ? circle.color : colors.textSecondary,
                    }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {circle.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: colors.textSecondary }}>
              标题 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="输入一个吸引人的标题..."
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                backgroundColor: colors.bgSecondary,
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
            />
          </div>

          {/* Content */}
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: colors.textSecondary }}>
              内容 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="详细描述您想分享的内容..."
              className="h-40 w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                backgroundColor: colors.bgSecondary,
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
            />
          </div>

          {/* Competition toggle */}
          <div
            className="flex items-center justify-between rounded-xl p-4"
            style={{ backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: '#FEF3C722' }}
              >
                <Award className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: colors.text }}>
                  参赛作品
                </p>
                <p className="text-[10px]" style={{ color: colors.textMuted }}>
                  标记后将在竞赛圈子中展示
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCompetition(!isCompetition)}
              className="relative h-6 w-11 rounded-full transition-all"
              style={{ backgroundColor: isCompetition ? '#14D1A0' : colors.border }}
            >
              <div
                className="absolute top-0.5 h-5 w-5 rounded-full transition-all"
                style={{
                  backgroundColor: '#fff',
                  left: isCompetition ? '24px' : '2px',
                }}
              />
            </button>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: colors.textSecondary }}>
              标签
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
                  style={{ backgroundColor: `${colors.bgTertiary}`, color: colors.textSecondary }}
                >
                  <Tag className="h-2.5 w-2.5" />
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="ml-0.5 hover:text-red-400">
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="添加标签..."
                  className="w-24 rounded-lg px-2.5 py-1 text-xs outline-none"
                  style={{
                    backgroundColor: colors.bgSecondary,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                  }}
                />
                <button
                  onClick={handleAddTag}
                  className="flex h-6 w-6 items-center justify-center rounded-lg transition-all hover:scale-110"
                  style={{ border: `1px dashed ${colors.border}`, color: colors.textMuted }}
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Image attachment hint */}
          <div
            className="flex items-center gap-3 rounded-xl p-3"
            style={{ border: `1px dashed ${colors.border}` }}
          >
            <button
              className="flex items-center gap-2 text-xs transition-all hover:opacity-80"
              style={{ color: colors.textSecondary }}
            >
              <Image className="h-4 w-4" />
              添加图片
            </button>
            <div className="h-4 w-px" style={{ backgroundColor: colors.border }} />
            <span className="text-[10px]" style={{ color: colors.textMuted }}>
              支持 JPG/PNG，最大 5MB
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({ post, onClose, theme }: {
  post: Post
  onClose: () => void
  theme: Theme
}) {
  const colors = getThemeColors(theme)

  return (
    <div
      className="absolute inset-y-0 right-0 z-20 flex flex-col shadow-2xl"
      style={{
        width: 340,
        backgroundColor: colors.bg,
        borderLeft: `1px solid ${colors.border}`,
      }}
    >
      <div
        className="flex items-center justify-between border-b p-5"
        style={{ borderColor: colors.border }}
      >
        <span
          className="text-xs font-medium"
          style={{ fontFamily: 'monospace', color: colors.textMuted }}
        >
          帖子详情
        </span>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:opacity-80"
          style={{ color: colors.textSecondary }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt=""
            className="mb-4 w-full rounded-2xl object-cover"
            style={{ height: 180 }}
          />
        )}

        <div className="mb-2 flex items-center gap-2">
          {post.isCompetition && (
            <span
              className="flex items-center gap-0.5 rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}
            >
              🏅 竞赛
            </span>
          )}
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-bold"
            style={{ backgroundColor: `${post.circleColor}22`, color: post.circleColor }}
          >
            {post.circle}
          </span>
          {post.isPinned && (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
              置顶
            </span>
          )}
        </div>

        <h2
          className="mb-3 text-lg font-bold leading-snug"
          style={{ fontFamily: 'Space Grotesk, monospace', color: colors.text }}
        >
          {post.title}
        </h2>

        {post.summary && (
          <p className="mb-4 text-sm" style={{ color: colors.textSecondary }}>
            {post.summary}
          </p>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="rounded-full px-2.5 py-1 text-[10px]"
              style={{ backgroundColor: colors.bgTertiary, color: colors.textMuted }}
            >
              #{tag}
            </span>
          ))}
        </div>

        <div
          className="mb-4 flex items-center gap-4 text-sm"
          style={{ color: colors.textSecondary }}
        >
          <img
            src={post.authorAvatar}
            alt={post.author}
            className="h-8 w-8 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium" style={{ color: colors.text }}>
              {post.author}
            </p>
            <p className="text-[10px]" style={{ color: colors.textMuted }}>
              {post.time}
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 text-sm"
          style={{ color: colors.textSecondary }}
        >
          <span className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {post.likes.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {post.comments}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.views}
          </span>
        </div>
      </div>

      <div
        className="space-y-2 border-t p-4"
        style={{ borderColor: colors.border }}
      >
        <button
          onClick={() => alert('即将跳转到文章详情页（需接入路由）')}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition-all hover:scale-[1.02]"
          style={{ backgroundColor: '#14D1A0', color: '#010409' }}
        >
          <ArrowRight className="h-4 w-4" />
          阅读全文
        </button>
        <button
          onClick={() => alert('已添加到收藏夹')}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-sm transition-all"
          style={{
            border: `1px solid ${colors.border}`,
            color: colors.textSecondary,
          }}
        >
          <Heart className="h-4 w-4" />
          收藏
        </button>
      </div>
    </div>
  )
}

// ─── Stats Bar ─────────────────────────────────────────────────────────────────

function StatsBar({ theme }: { theme: Theme }) {
  const colors = getThemeColors(theme)
  const stats = [
    { label: '帖子', value: '8', icon: MessageSquare, color: '#14D1A0' },
    { label: '热议', value: '3', icon: TrendingUp, color: '#2B59C3' },
    { label: '活动', value: '5', icon: Calendar, color: '#FFD23F' },
    { label: '人才', value: '6', icon: Briefcase, color: '#14D1A0' },
  ]

  return (
    <div
      className="flex items-center justify-between rounded-2xl p-4"
      style={{
        background: `linear-gradient(135deg, ${colors.bgSecondary} 0%, ${colors.bg} 100%)`,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: '#14D1A022' }}
        >
          <Users className="h-4 w-4 text-emerald-500" />
        </div>
        <div>
          <h1
            className="text-base font-bold"
            style={{ fontFamily: 'Space Grotesk, monospace', color: colors.text }}
          >
            超级社区
          </h1>
          <p className="text-[10px]" style={{ color: colors.textMuted }}>
            知识 · 交流 · 活动 · 人才
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p
              className="text-sm font-bold tabular-nums"
              style={{ fontFamily: 'Space Grotesk, monospace', color: s.color }}
            >
              {s.value}
            </p>
            <p className="text-[10px]" style={{ color: colors.textMuted }}>
              {s.label}
            </p>
          </div>
        ))}
        <div className="h-5 w-px" style={{ backgroundColor: colors.border }} />
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-medium"
          style={{ backgroundColor: '#FEF3C722', color: '#D97706' }}
        >
          <Bell className="h-3 w-3" />
          2026 AI 创业大赛 · 报名中
        </div>
      </div>
    </div>
  )
}

// ─── Main CommunityModule ─────────────────────────────────────────────────────

export default function CommunityModule() {
  const { theme, toggleTheme }: { theme: Theme; toggleTheme: () => void } = useTheme()
  const colors = getThemeColors(theme)

  const [activeCircle, setActiveCircle] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showPostModal, setShowPostModal] = useState(false)
  const [filter, setFilter] = useState<'all' | 'hot' | 'competition'>('all')
  const [communityTab, setCommunityTab] = useState<'posts' | 'knowledge' | 'discussion' | 'talent' | 'create'>('posts')

  const filteredPosts = POSTS.filter(p => {
    if (filter === 'hot') return p.isHot
    if (filter === 'competition') return p.isCompetition
    return true
  })

  const handleJoinCompetition = (comp: Competition) => {
    alert(`${comp.status === '报名中' ? '报名' : '查看'}竞赛: ${comp.title}\n奖金: ${comp.prize}`)
  }

  const handlePost = (data: {
    title: string
    content: string
    circle: string
    tags: string[]
    isCompetition: boolean
  }) => {
    console.log('New post:', data)
    setShowPostModal(false)
  }

  return (
    <div
      className="relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl p-4"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Header Stats Bar */}
      <StatsBar theme={theme} />

      {/* Community Sub-Tab Bar */}
      <div
        className="flex items-center gap-1 rounded-2xl p-1.5"
        style={{ backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}` }}
      >
        {([
          { key: 'posts' as const, label: '帖子', icon: MessageSquare, color: '#14D1A0' },
          { key: 'knowledge' as const, label: '知识库', icon: BookOpen, color: '#2B59C3' },
          { key: 'discussion' as const, label: '讨论区', icon: Users, color: '#A855F7' },
          { key: 'talent' as const, label: '人才集市', icon: Briefcase, color: '#FF6B6B' },
          { key: 'create' as const, label: '创建', icon: Plus, color: '#FFD23F' },
        ]).map(tab => {
          const TabIcon = tab.icon
          const isActive = communityTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setCommunityTab(tab.key)}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all"
              style={{
                backgroundColor: isActive ? `${tab.color}20` : 'transparent',
                border: isActive ? `1px solid ${tab.color}40` : '1px solid transparent',
                color: isActive ? tab.color : colors.textMuted,
              }}
            >
              <TabIcon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Main layout: sidebar + content */}
      {communityTab === 'posts' ? (
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* CircleList Sidebar */}
        <CircleListSidebar
          circles={CIRCLES}
          activeCircle={activeCircle}
          onCircleClick={setActiveCircle}
          theme={theme}
        />

        {/* Content Area */}
        <div className="relative flex-1 overflow-y-auto pr-2 space-y-4">
          {/* Quick Entry Grid */}
          <div className="grid grid-cols-4 gap-3">
            {QUICK_ENTRIES.map(entry => {
              const Icon = entry.icon
              return (
                <button
                  key={entry.id}
                  className="group flex flex-col items-center gap-2 rounded-2xl p-4 transition-all hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: `linear-gradient(135deg, ${entry.color}11 0%, ${entry.color}05 100%)`,
                    border: `1px solid ${entry.color}33`,
                  }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl transition-all group-hover:scale-110"
                    style={{ backgroundColor: `${entry.color}22` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: entry.color }} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold" style={{ color: colors.text }}>{entry.label}</p>
                    <p className="text-[10px]" style={{ color: colors.textMuted }}>{entry.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Latest Cases from M2 */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3
                className="flex items-center gap-2 text-sm font-bold"
                style={{ fontFamily: 'Space Grotesk, monospace', color: colors.text }}
              >
                <Sparkles className="h-4 w-4 text-purple-500" />
                最新案例
              </h3>
              <button
                className="text-[10px] font-medium transition-all hover:opacity-80"
                style={{ color: colors.textSecondary }}
              >
                更多案例
                <ChevronRight className="ml-0.5 inline h-3 w-3" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {LATEST_CASES.map(c => (
                <button
                  key={c.id}
                  className="group overflow-hidden rounded-2xl text-left transition-all hover:scale-[1.02] hover:shadow-lg"
                  style={{
                    backgroundColor: colors.card,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div className="relative h-28 overflow-hidden">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span
                      className="absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                      style={{ backgroundColor: '#14D1A0cc' }}
                    >
                      {c.effect}
                    </span>
                    <span
                      className="absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-medium text-white/90"
                      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    >
                      🔧 {c.toolUsed}
                    </span>
                  </div>
                  <div className="p-3">
                    <h4
                      className="mb-2 text-xs font-bold leading-snug"
                      style={{ color: colors.text }}
                    >
                      {c.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={c.author.avatar}
                          alt={c.author.name}
                          className="h-4 w-4 rounded-full object-cover"
                        />
                        <span className="text-[10px]" style={{ color: colors.textMuted }}>
                          {c.author.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]" style={{ color: colors.textMuted }}>
                        <span className="flex items-center gap-0.5">
                          <Eye className="h-3 w-3" />{c.viewCount}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <MessageSquare className="h-3 w-3" />{c.commentCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Competition Banner Carousel */}
          <CompetitionBannerCarousel
            competitions={COMPETITIONS}
            theme={theme}
            onJoin={handleJoinCompetition}
          />

          {/* Competition Cards Row */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3
                className="flex items-center gap-2 text-sm font-bold"
                style={{ fontFamily: 'Space Grotesk, monospace', color: colors.text }}
              >
                <Trophy className="h-4 w-4 text-amber-500" />
                竞赛推荐
              </h3>
              <button
                className="text-[10px] font-medium transition-all hover:opacity-80"
                style={{ color: colors.textSecondary }}
              >
                查看全部
                <ChevronRight className="ml-0.5 inline h-3 w-3" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {COMPETITIONS.map(comp => (
                <CompetitionCard
                  key={comp.id}
                  comp={comp}
                  theme={theme}
                  onJoin={(c) => { handleJoinCompetition(c) }}
                />
              ))}
            </div>
          </div>

          {/* Posts Section */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3
                className="flex items-center gap-2 text-sm font-bold"
                style={{ fontFamily: 'Space Grotesk, monospace', color: colors.text }}
              >
                <MessageSquare className="h-4 w-4 text-emerald-500" />
                社区帖子
              </h3>

              {/* Filter tabs */}
              <div className="flex items-center gap-1 rounded-xl p-1" style={{ backgroundColor: colors.bgSecondary }}>
                {(['all', 'hot', 'competition'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="rounded-lg px-3 py-1 text-[10px] font-medium transition-all"
                    style={{
                      backgroundColor: filter === f ? colors.bgTertiary : 'transparent',
                      color: filter === f ? colors.text : colors.textMuted,
                    }}
                  >
                    {f === 'all' ? '全部' : f === 'hot' ? '🔥 热议' : '🏅 竞赛'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  theme={theme}
                  onClick={() => { setSelectedPost(post) }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      ) : (
      <div className="flex flex-1 overflow-hidden">
        {communityTab === 'knowledge' && <KnowledgeBase />}
        {communityTab === 'discussion' && <DiscussionZone />}
        {communityTab === 'talent' && <TalentMarket />}
        {communityTab === 'create' && <SectCreate />}
      </div>
      )}

      {/* FAB: New Post */}
      <button
        onClick={() => setShowPostModal(true)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
        style={{
          backgroundColor: '#14D1A0',
          color: '#010409',
          boxShadow: '0 4px 20px rgba(20, 209, 160, 0.4)',
        }}
      >
        <Pencil className="h-5 w-5" />
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 left-6 flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-110"
        style={{
          backgroundColor: colors.bgSecondary,
          border: `1px solid ${colors.border}`,
          color: colors.text,
        }}
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? (
          <Star className="h-4 w-4 text-amber-400" />
        ) : (
          <Moon className="h-4 w-4 text-slate-600" />
        )}
      </button>

      {/* Detail Panel */}
      {selectedPost && (
        <DetailPanel
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          theme={theme}
        />
      )}

      {/* Posting Modal */}
      {showPostModal && (
        <PostingModal
          theme={theme}
          circles={CIRCLES}
          onClose={() => setShowPostModal(false)}
          onPost={handlePost}
        />
      )}
    </div>
  )
}
