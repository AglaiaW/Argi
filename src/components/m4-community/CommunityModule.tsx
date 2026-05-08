'use client'

import { useState } from 'react'
import {
  Users, MessageSquare, Trophy, Briefcase,
  X, Star, Zap, Clock, Eye, Shield, ArrowRight,
  BookOpen, Calendar, Heart, Send, CheckCircle2,
  ChevronRight, Play, Bell, TrendingUp, Crown
} from 'lucide-react'

// ─── Block types ─────────────────────────────────────────────────────────────
type BlockSize = 'sm' | 'md' | 'lg' | 'xl'

interface Block {
  id: string
  type: 'featured' | 'post' | 'sect' | 'event' | 'talent' | 'stats'
  size: BlockSize
}

// ─── 版型：社交卡片墙 ──────────────────────────────────────────────────────
// 顶行：置顶帖全宽大卡(4列)
// 中行：普通帖子×2(各2列)
// 底行：活动(2列) + 人才卡片×2(各1列)
const BLOCKS: Block[] = [
  // 顶行：置顶大帖(4列，rowSpan2)
  { id: 'feat', type: 'featured', size: 'xl' },
  // 中行
  { id: 'post-0', type: 'post', size: 'md' },
  { id: 'post-1', type: 'post', size: 'md' },
  // 底行
  { id: 'event-0', type: 'event', size: 'md' },
  { id: 'event-1', type: 'event', size: 'md' },
  { id: 'talent-0', type: 'talent', size: 'sm' },
  { id: 'talent-1', type: 'talent', size: 'sm' },
]

// ─── Mock data ───────────────────────────────────────────────────────────────
const FEATURED_POST = {
  id: 'p1',
  title: '蔚蓝 OPC 平台 2.0 正式发布！全模块 AI 能力升级',
  author: '蔚蓝官方',
  authorAvatar: 'https://i.pravatar.cc/150?img=1',
  sect: '运营公告',
  sectColor: '#14D1A0',
  thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80',
  summary: '全新2.0版本上线，集成阿吉智能助手，支持全模块AI辅助创作与分析，新增数字人直播、硬件智能匹配等功能模块。',
  likes: 2847,
  comments: 342,
  views: '12.4k',
  time: '3天前',
  isPinned: true,
  isHot: true,
  tags: ['公告', '产品更新', 'AI助手'],
}

const POSTS = [
  {
    id: 'p2',
    title: '手把手教你用 AI Agents 打造自动化运营体系，月流水提升 300%',
    author: '创业老王',
    authorAvatar: 'https://i.pravatar.cc/150?img=12',
    sect: '经验分享',
    sectColor: '#2B59C3',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    likes: 1847,
    comments: 213,
    views: '8.2k',
    time: '2小时前',
    isHot: true,
  },
  {
    id: 'p3',
    title: '【招募】AI + 教育赛道创业团队寻找技术合伙人',
    author: '小林同学',
    authorAvatar: 'https://i.pravatar.cc/150?img=44',
    sect: '人才招聘',
    sectColor: '#FFD23F',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
    likes: 234,
    comments: 87,
    views: '3.1k',
    time: '5小时前',
    isHot: false,
  },
]

const SECTIONS = [
  { id: 's1', name: '知识库', count: 128, icon: BookOpen, color: '#14D1A0', desc: '精选文章与教程' },
  { id: 's2', name: '讨论区', count: 2047, icon: MessageSquare, color: '#2B59C3', desc: '问答与经验交流' },
  { id: 's3', name: '赛事活动', count: 36, icon: Trophy, color: '#FFD23F', desc: '竞赛与线下活动' },
  { id: 's4', name: '人才集市', count: 512, icon: Briefcase, color: '#FF6B6B', desc: '招聘与组队' },
]

const EVENTS = [
  {
    id: 'e1',
    title: '2026 AI 创新创业大赛',
    banner: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80',
    prize: '¥50,000',
    deadline: '2026-06-01',
    participants: 1247,
    organizer: '蔚蓝平台',
    status: '报名中',
    statusColor: '#14D1A0',
  },
]

const TALENTS = [
  {
    id: 't1',
    name: '张同学',
    title: 'AI产品经理 · 3年经验',
    avatar: 'https://i.pravatar.cc/150?img=32',
    skills: ['AI产品', '数据分析', '用户研究'],
    score: 94,
    hourlyRate: '¥500/h',
    availability: '可合作',
    tags: ['AI产品', '需求分析'],
  },
  {
    id: 't2',
    name: '李开发',
    title: '全栈工程师 · 5年经验',
    avatar: 'https://i.pravatar.cc/150?img=25',
    skills: ['React', 'Node.js', 'AI集成'],
    score: 91,
    hourlyRate: '¥600/h',
    availability: '可合作',
    tags: ['全栈', 'AI开发'],
  },
]

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function DetailPanel({ item, onClose }: { item: Record<string, unknown> | null; onClose: () => void }) {
  if (!item) return null
  return (
    <div className="absolute inset-y-0 right-0 z-20 flex flex-col border-l border-[rgba(255,255,255,0.08)] bg-white shadow-2xl w-[340px]">
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-5 py-4">
        <span className="text-xs font-medium text-slate-500" style={{ fontFamily: 'monospace' }}>帖子详情</span>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {item.thumbnail && (
          <img src={item.thumbnail as string} alt="" className="w-full h-44 object-cover rounded-2xl mb-4" />
        )}
        <div className="flex items-center gap-2 mb-2">
          {item.sect && (
            <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ backgroundColor: (item.sectColor as string || '#14D1A0') + '22', color: item.sectColor as string }}>
              {item.sect as string}
            </span>
          )}
          {item.isPinned && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">置顶</span>}
        </div>
        <h2 className="mb-2 text-lg font-bold text-slate-900 leading-snug" style={{ fontFamily: 'Space Grotesk, monospace' }}>
          {item.title as string}
        </h2>
        {item.summary && (
          <p className="mb-3 text-sm text-slate-400">{item.summary as string}</p>
        )}
        {item.tags && Array.isArray(item.tags) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {(item.tags as string[]).map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] text-slate-400">#{tag}</span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-4 text-sm text-slate-400">
          {item.likes !== undefined && (
            <span className="flex items-center gap-1"><Heart className="h-4 w-4" />{item.likes as number}</span>
          )}
          {item.comments !== undefined && (
            <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" />{item.comments as number}</span>
          )}
          {item.views && (
            <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{item.views as string}</span>
          )}
        </div>
      </div>
      <div className="border-t border-[rgba(255,255,255,0.06)] p-4 space-y-2">
        <button onClick={() => alert('即将跳转到文章详情页（需接入路由）')} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#14D1A0] py-3 text-sm font-bold text-[#010409] transition-all hover:bg-[#14D1A0]/90">
          <ArrowRight className="h-4 w-4" /> 阅读全文
        </button>
        <button onClick={() => { alert('已添加到收藏夹') }} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-2.5 text-sm text-slate-400 transition-all">
          <Heart className="h-4 w-4" /> 收藏
        </button>
      </div>
    </div>
  )
}

// ─── Stats Block ───────────────────────────────────────────────────────────────
function StatsBlock() {
  const stats = [
    { label: '帖子', value: '8', icon: MessageSquare, color: '#14D1A0' },
    { label: '热议', value: '3', icon: TrendingUp, color: '#2B59C3' },
    { label: '活动', value: '5', icon: Calendar, color: '#FFD23F' },
    { label: '人才', value: '6', icon: Briefcase, color: '#14D1A0' },
  ]
  return (
    <div
      className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-br from-[#0a1628] to-[#1a2744] p-5"
      style={{ gridColumn: 'span 2', gridRow: 'span 1' }}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50">
          <Users className="h-4 w-4 text-emerald-600" />
        </div>
        <span className="text-xs font-bold text-slate-400" style={{ fontFamily: 'monospace' }}>社区数据</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0a1628]/50 p-3">
            <p className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, monospace', color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#FFD23F]/10 px-3 py-2">
        <Bell className="h-4 w-4 text-amber-500" />
        <span className="text-xs text-amber-500">2026 AI 创业大赛 · 报名中</span>
      </div>
    </div>
  )
}

// ─── Featured Post Block ────────────────────────────────────────────────────────
function FeaturedBlock({ item, onClick }: { item: typeof FEATURED_POST; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] active:scale-[0.99]"
      style={{ gridColumn: 'span 4', gridRow: 'span 2' }}
    >
      <div className="relative w-3/5 shrink-0 overflow-hidden">
        <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1628]" />
        {item.isPinned && (
          <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-[#14D1A0] px-3 py-1">
            <Star className="h-3 w-3 fill-black text-black" />
            <span className="text-[10px] font-bold text-black">置顶</span>
          </div>
        )}
      </div>

      <div className="flex w-2/5 flex-col justify-between p-6 text-left">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full px-3 py-1 text-[10px] font-bold" style={{ backgroundColor: item.sectColor + '22', color: item.sectColor }}>
              {item.sect}
            </span>
            {item.isHot && <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold text-red-500">热议</span>}
          </div>
          <h3 className="mb-2 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-600" style={{ fontFamily: 'Space Grotesk, monospace' }}>
            {item.title}
          </h3>
          <p className="mb-4 line-clamp-3 text-sm text-slate-400">{item.summary}</p>

          <div className="mb-4 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-400">#{tag}</span>
            ))}
          </div>

          <div className="mb-4 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src={item.authorAvatar} alt={item.author} className="h-7 w-7 rounded-full object-cover" />
              <span className="text-xs font-medium text-slate-900">{item.author}</span>
            </div>
            <span className="text-[10px] text-slate-500">{item.time}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1"><Heart className="h-4 w-4" />{item.likes.toLocaleString()}</span>
            <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" />{item.comments}</span>
            <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{item.views}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-emerald-600 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
          <span className="text-sm font-bold">阅读全文</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </button>
  )
}

// ─── Post Block ────────────────────────────────────────────────────────────────
function PostBlock({ item, size, onClick }: { item: typeof POSTS[0]; size: 'md' | 'sm'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] active:scale-[0.98]"
      style={{ gridColumn: 'span 2' }}
    >
      <div className="relative overflow-hidden" style={{ height: size === 'md' ? '100px' : '70px' }}>
        <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 to-transparent" />
        <div className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ backgroundColor: item.sectColor + '22', color: item.sectColor }}>
          {item.sect}
        </div>
        {item.isHot && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-[#FF6B6B] px-2 py-0.5">
            <Zap className="h-2.5 w-2.5 text-slate-900" />
            <span className="text-[9px] font-bold text-slate-900">热</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h4 className="mb-1 line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-600" style={{ fontFamily: 'Space Grotesk, monospace' }}>
          {item.title}
        </h4>
        <div className="mb-2 flex items-center gap-2">
          <img src={item.authorAvatar} alt="" className="h-5 w-5 rounded-full object-cover" />
          <span className="text-[10px] text-slate-500">{item.author}</span>
          <span className="text-[10px] text-slate-600">·</span>
          <span className="text-[10px] text-slate-500">{item.time}</span>
        </div>
        <div className="mt-auto flex items-center gap-4 border-t border-[rgba(255,255,255,0.04)] pt-2.5 text-[10px] text-slate-500">
          <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{item.likes}</span>
          <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{item.comments}</span>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{item.views}</span>
        </div>
      </div>
    </button>
  )
}

// ─── Section Block ──────────────────────────────────────────────────────────────
function SectionBlock({ onSectionClick }: { onSectionClick?: (id: string) => void }) {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4"
      style={{ gridColumn: 'span 3', gridRow: 'span 1' }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, monospace' }}>社区版块</span>
        <button className="flex items-center gap-1 text-[10px] text-emerald-600">
          <Crown className="h-3 w-3" /> 全部版块
        </button>
      </div>
      <div className="flex-1 flex flex-col justify-around gap-2">
        {SECTIONS.map((s) => {
          const Icon = s.icon
          return (
            <button key={s.id} onClick={() => onSectionClick?.(s.id)} className="group flex items-center gap-3 rounded-xl border border-[rgba(255,255,255,0.04)] bg-slate-100 p-3 text-left transition-all hover:border-[rgba(255,255,255,0.1)] hover:bg-slate-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: s.color + '22' }}>
                <Icon className="h-4 w-4" style={{ color: s.color }} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-900">{s.name}</p>
                <p className="text-[9px] text-slate-500">{s.desc}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold" style={{ color: s.color }}>{s.count.toLocaleString()}</span>
                <ChevronRight className="h-3 w-3 text-slate-500 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Event Block ────────────────────────────────────────────────────────────────
function EventBlock({ item, size, onClick }: { item: typeof EVENTS[0]; size: 'md' | 'sm'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] active:scale-[0.98]"
      style={{ gridColumn: 'span 2' }}
    >
      <div className="relative overflow-hidden" style={{ height: '90px' }}>
        <img src={item.banner} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/30 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ backgroundColor: item.statusColor, color: '#010409' }}>
          <Trophy className="h-3 w-3" />{item.status}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h4 className="mb-1 line-clamp-1 text-sm font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, monospace' }}>{item.title}</h4>
        <p className="mb-2 text-[10px] text-slate-500">主办：{item.organizer} · 截止 {item.deadline}</p>

        <div className="mt-auto flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] pt-2.5">
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <Users className="h-3 w-3" />{item.participants.toLocaleString()}人已报名
          </div>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-500">{item.prize}</span>
        </div>
      </div>
    </button>
  )
}

// ─── Talent Block ──────────────────────────────────────────────────────────────
function TalentBlock({ item, size, onClick }: { item: typeof TALENTS[0]; size: 'md' | 'sm'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 text-center transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] active:scale-[0.98]"
      style={{ gridColumn: 'span 1' }}
    >
      <div className="relative mb-3">
        <img src={item.avatar} alt={item.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-[rgba(255,255,255,0.08)] transition-all group-hover:ring-[#14D1A0]/30" />
        <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#14D1A0]">
          <CheckCircle2 className="h-3 w-3 text-[#010409]" />
        </div>
      </div>
      <h4 className="mb-0.5 text-sm font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, monospace' }}>{item.name}</h4>
      <p className="mb-2 line-clamp-1 text-[10px] text-slate-500">{item.title}</p>

      <div className="mb-3 flex flex-wrap justify-center gap-1">
        {item.skills.slice(0, 2).map((s) => (
          <span key={s} className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] text-slate-400">{s}</span>
        ))}
      </div>

      <div className="mt-auto flex w-full items-center justify-between border-t border-[rgba(255,255,255,0.04)] pt-3">
        <span className="text-[10px] font-bold text-emerald-600">{item.score}% 匹配</span>
        <span className="text-[10px] text-slate-500">{item.hourlyRate}</span>
      </div>
    </button>
  )
}

// ─── Main CommunityModule ─────────────────────────────────────────────────────
export default function CommunityModule() {
  const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const getBlockContent = (block: Block) => {
    switch (block.type) {
      case 'stats':
        return <StatsBlock key={block.id} />
      case 'featured':
        return (
          <FeaturedBlock
            key={block.id}
            item={FEATURED_POST}
            onClick={() => setSelectedItem(FEATURED_POST as unknown as Record<string, unknown>)}
          />
        )
      case 'post': {
        const idx = parseInt(block.id.split('-')[1])
        const p = POSTS[idx % POSTS.length]
        return (
          <PostBlock
            key={block.id}
            item={p}
            size={block.size as 'md' | 'sm'}
            onClick={() => setSelectedItem(p as unknown as Record<string, unknown>)}
          />
        )
      }
      case 'sect':
        return <SectionBlock key={block.id} onSectionClick={(id) => setActiveSection(id)} />
      case 'event': {
        const idx = parseInt(block.id.split('-')[1])
        const e = EVENTS[idx % EVENTS.length]
        return (
          <EventBlock
            key={block.id}
            item={e}
            size={block.size as 'md' | 'sm'}
            onClick={() => setSelectedItem(e as unknown as Record<string, unknown>)}
          />
        )
      }
      case 'talent': {
        const idx = parseInt(block.id.split('-')[1])
        const t = TALENTS[idx % TALENTS.length]
        return (
          <TalentBlock
            key={block.id}
            item={t}
            size={block.size as 'md' | 'sm'}
            onClick={() => setSelectedItem(t as unknown as Record<string, unknown>)}
          />
        )
      }
      default:
        return null
    }
  }

  return (
    <div className="relative flex h-full flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-6 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
            <Users className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, monospace' }}>超级社区</h1>
            <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>知识 · 交流 · 活动 · 人才</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-sm font-bold tabular-nums text-slate-900" style={{ fontFamily: 'monospace' }}>8</p>
            <p className="text-[10px] text-slate-500">文章</p>
          </div>
          <div className="h-5 w-px bg-[rgba(255,255,255,0.08)]" />
          <div className="text-center">
            <p className="text-sm font-bold tabular-nums text-red-500" style={{ fontFamily: 'monospace' }}>3</p>
            <p className="text-[10px] text-slate-500">热议</p>
          </div>
          <div className="h-5 w-px bg-[rgba(255,255,255,0.08)]" />
          <div className="text-center">
            <p className="text-sm font-bold tabular-nums text-amber-500" style={{ fontFamily: 'monospace' }}>5</p>
            <p className="text-[10px] text-slate-500">活动</p>
          </div>
        </div>
      </div>

      {/* Grid: 4列，社交卡片墙（置顶帖全宽 + 下方卡片瀑布流） */}
      <div className="relative flex-1 overflow-auto p-4">
        <div
          className="grid min-h-full gap-3"
          style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '160px' }}
        >
          {BLOCKS.map(getBlockContent)}
        </div>
        {selectedItem && <DetailPanel item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </div>
    </div>
  )
}
