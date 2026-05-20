'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  FileText, Image, Video, Mail, ShoppingBag,
  X, Star, Zap, Clock, Eye, Shield, ArrowRight,
  Edit3, BarChart2, Send, Plus, Layers, Palette,
  MousePointer, TrendingUp, Calendar, CheckCircle2,
  RefreshCw, Globe, ChevronRight, Play, Rocket,
  Link2, AlertTriangle, Users, Briefcase, MessageSquare,
  BookOpen, Wand2, LayoutGrid, Share2, Trophy,
  ExternalLink, ChevronDown, Search, Filter, Upload,
  Tag, Hash, CheckSquare, Copy, CalendarClock,
  Globe2, LayoutTemplate, Sparkles, CopyCheck
} from 'lucide-react'
import { useAction, ActionToast } from '@/hooks/useAction'

// ─── Theme Context ──────────────────────────────────────────────────────────
type Theme = 'dark' | 'light' | 'system'

function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) setTheme(stored)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      setResolvedTheme(mq.matches ? 'dark' : 'light')
      root.classList.toggle('dark', mq.matches)
      root.classList.toggle('light', !mq.matches)
    } else {
      setResolvedTheme(theme)
      root.classList.toggle('dark', theme === 'dark')
      root.classList.toggle('light', theme === 'light')
    }
  }, [theme])

  return { theme, setTheme, resolvedTheme }
}

// ─── Block types ─────────────────────────────────────────────────────────────
type BlockSize = 'sm' | 'md' | 'lg' | 'xl'

interface Block {
  id: string
  type: 'featured' | 'draft' | 'platform' | 'schedule' | 'stats' | 'tool' | 'value-pack'
  size: BlockSize
}

// ─── 版型：创作者看板（左右分栏）─────────────────────────────────────────────
const BLOCKS: Block[] = [
  { id: 'feat', type: 'featured', size: 'xl' },
  { id: 'stats', type: 'stats', size: 'sm' },
  { id: 'draft-0', type: 'draft', size: 'md' },
  { id: 'draft-1', type: 'draft', size: 'md' },
  { id: 'plat-0', type: 'platform', size: 'lg' },
  { id: 'tool-0', type: 'tool', size: 'md' },
  { id: 'tool-1', type: 'tool', size: 'md' },
  { id: 'sched-0', type: 'schedule', size: 'lg' },
]

// ─── Mock data ───────────────────────────────────────────────────────────────
const FEATURED_PACKAGE = {
  id: 'pkg1',
  title: '小红书爆款图文创作包',
  subtitle: '含封面模板15套、正文话术32组、数据分析模板',
  thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
  type: '图文模板包',
  price: 299,
  originalPrice: 599,
  rating: 4.9,
  sales: 892,
  preview: 'https://images.unsplash.com/photo-1611162616305-c8f76a9798f5?w=400&q=80',
  items: ['15套封面模板', '32组正文话术', '数据分析表'],
  badge: '销量冠军',
  tags: ['小红书', '图文模板', '爆款攻略'],
}

const DRAFTS = [
  {
    id: 'd1',
    title: 'AI数字人直播从0到1变现指南',
    platform: '小红书',
    platformColor: '#FF2442',
    platformIcon: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=100&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80',
    updatedAt: '2小时前',
    status: '待发布',
    views: 0,
    likes: 0,
    tags: ['数字人', '直播', '变现'],
  },
  {
    id: 'd2',
    title: '2026最全私域流量运营SOP',
    platform: '公众号',
    platformColor: '#07C160',
    platformIcon: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=100&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80',
    updatedAt: '昨天',
    status: '草稿',
    views: 0,
    likes: 0,
    tags: ['私域运营', 'SOP', '增长'],
  },
]

const TOOLS = [
  {
    id: 't1',
    name: 'AI文案生成器',
    desc: '输入商品卖点，生成3-5个爆款文案版本',
    icon: Edit3,
    color: '#14D1A0',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&q=80',
  },
  {
    id: 't2',
    name: '多平台内容适配',
    desc: '一键调整内容格式，适配各平台发布规范',
    icon: RefreshCw,
    color: '#2B59C3',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80',
  },
]

const SCHEDULE = [
  {
    id: 's1', title: 'AI数字人直播指南', platform: '小红书', time: '今天 20:00',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80', status: '待发布',
  },
  {
    id: 's2', title: '私域SOP完整版', platform: '公众号', time: '明天 10:00',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80', status: '待发布',
  },
  {
    id: 's3', title: 'AI工具盘点2026', platform: 'B站', time: '周三 15:00',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80', status: '草稿',
  },
]

// ─── Platform OAuth Data ─────────────────────────────────────────────────────
type OAuthPlatform = 'xiaohongshu' | 'douyin' | 'bilibili' | 'gongzhonghao' | 'shipinhao'

interface OAuthPlatformInfo {
  id: OAuthPlatform
  name: string
  icon: string
  color: string
  bgColor: string
  connected: boolean
  accountName?: string
  followers?: string
  postsThisWeek?: number
  lastSynced?: string
  status: 'connected' | 'disconnected' | 'error' | 'pending'
  bindingTime?: string
  oAuthUrl?: string
}

const OAUTH_PLATFORMS: OAuthPlatformInfo[] = [
  {
    id: 'xiaohongshu',
    name: '小红书',
    icon: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=100&q=80',
    color: '#FF2442',
    bgColor: 'rgba(255,36,66,0.1)',
    connected: true,
    accountName: '蔚蓝运营笔记',
    followers: '1.2万',
    postsThisWeek: 3,
    lastSynced: '10分钟前',
    status: 'connected',
    bindingTime: '2026-03-15',
  },
  {
    id: 'douyin',
    name: '抖音',
    icon: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=100&q=80',
    color: '#00F2EA',
    bgColor: 'rgba(0,242,234,0.1)',
    connected: true,
    accountName: '蔚蓝OPC',
    followers: '8,920',
    postsThisWeek: 2,
    lastSynced: '30分钟前',
    status: 'connected',
    bindingTime: '2026-02-20',
  },
  {
    id: 'bilibili',
    name: 'B站',
    icon: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=100&q=80',
    color: '#FB7299',
    bgColor: 'rgba(251,114,153,0.1)',
    connected: false,
    status: 'disconnected',
  },
  {
    id: 'gongzhonghao',
    name: '公众号',
    icon: 'https://images.unsplash.com/photo-1573984699409-7d3e1a14e76c?w=100&q=80',
    color: '#07C160',
    bgColor: 'rgba(7,193,96,0.1)',
    connected: true,
    accountName: '蔚蓝科技官方',
    followers: '5,600',
    postsThisWeek: 2,
    lastSynced: '1小时前',
    status: 'connected',
    bindingTime: '2026-01-10',
  },
  {
    id: 'shipinhao',
    name: '视频号',
    icon: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=100&q=80',
    color: '#07C160',
    bgColor: 'rgba(7,193,96,0.1)',
    connected: false,
    status: 'disconnected',
  },
]

// ─── Competition Data ─────────────────────────────────────────────────────────
interface Competition {
  id: string
  name: string
  deadline: string
  prize: string
  participants: number
  status: 'ongoing' | 'upcoming' | 'ended'
  tag: string
}

const COMPETITIONS: Competition[] = [
  { id: 'c1', name: '2026 AI内容创作大赛', deadline: '2026-06-30', prize: '¥50,000', participants: 1280, status: 'ongoing', tag: 'AI创作' },
  { id: 'c2', name: '蔚蓝平台创意征集赛', deadline: '2026-05-31', prize: '¥20,000', participants: 456, status: 'ongoing', tag: '平台征集' },
  { id: 'c3', name: '短视频创意挑战赛', deadline: '2026-07-15', prize: '¥30,000', participants: 892, status: 'upcoming', tag: '短视频' },
]

// ─── Publish Record Data ──────────────────────────────────────────────────────
interface PublishRecord {
  id: string
  title: string
  platform: OAuthPlatform
  status: 'success' | 'failed' | 'pending'
  publishedAt: string
  views: number
  likes: number
  comments: number
  url?: string
  competition?: string
  caseCardGenerated: boolean
}

const PUBLISH_RECORDS: PublishRecord[] = [
  { id: 'r1', title: 'AI数字人直播从0到1变现指南', platform: 'xiaohongshu', status: 'success', publishedAt: '2026-05-06 10:30', views: 12400, likes: 876, comments: 42, url: 'https://xiaohongshu.com/post/abc123', competition: '2026 AI内容创作大赛', caseCardGenerated: true },
  { id: 'r2', title: '2026最全私域流量运营SOP', platform: 'gongzhonghao', status: 'success', publishedAt: '2026-05-05 14:20', views: 8900, likes: 520, comments: 28, url: 'https://mp.weixin.qq.com/s/xyz789', caseCardGenerated: true },
  { id: 'r3', title: 'AI工具盘点2026', platform: 'douyin', status: 'failed', publishedAt: '2026-05-04 16:00', views: 0, likes: 0, comments: 0, caseCardGenerated: false },
  { id: 'r4', title: '企业数字化转型白皮书', platform: 'gongzhonghao', status: 'success', publishedAt: '2026-05-03 09:00', views: 45200, likes: 2340, comments: 156, url: 'https://mp.weixin.qq.com/s/def456', caseCardGenerated: true },
  { id: 'r5', title: '618预售活动预告', platform: 'xiaohongshu', status: 'pending', publishedAt: '2026-05-07 08:00', views: 0, likes: 0, comments: 0, caseCardGenerated: false },
]

// ─── Case Card Template ───────────────────────────────────────────────────────
interface CaseCard {
  id: string
  title: string
  author: string
  platform: OAuthPlatform
  coverImage: string
  views: number
  likes: number
  engagement: string
  publishedAt: string
  tags: string[]
  competition?: string
  generated: boolean
}

// ─── Theme-aware color tokens ─────────────────────────────────────────────────
const THEME_TOKENS = {
  dark: {
    bg: 'bg-[#0a1628]',
    bgSecondary: 'bg-[#0f1e35]',
    bgTertiary: 'bg-[#162032]',
    border: 'border-[rgba(255,255,255,0.08)]',
    borderHover: 'border-[rgba(255,255,255,0.15)]',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    textMuted: 'text-slate-500',
    accent: 'text-[#14D1A0]',
    accentBg: 'bg-[#14D1A0]',
    accentLight: 'bg-[#14D1A0]/20',
    accentText: 'text-emerald-400',
    card: 'bg-[rgba(15,23,42,0.85)]',
    cardHover: 'hover:bg-[rgba(20,30,50,0.9)]',
    shadow: 'shadow-2xl shadow-black/30',
  },
  light: {
    bg: 'bg-[#f8fafc]',
    bgSecondary: 'bg-white',
    bgTertiary: 'bg-slate-50',
    border: 'border-slate-200',
    borderHover: 'border-slate-300',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    accent: 'text-[#14D1A0]',
    accentBg: 'bg-[#14D1A0]',
    accentLight: 'bg-[#14D1A0]/10',
    accentText: 'text-emerald-600',
    card: 'bg-white',
    cardHover: 'hover:bg-slate-50',
    shadow: 'shadow-xl shadow-slate-200/50',
  },
}

// ─── PublishModal ────────────────────────────────────────────────────────────
interface PublishModalProps {
  draft?: typeof DRAFTS[0] | null
  onClose: () => void
  theme: 'dark' | 'light'
}

function PublishModal({ draft, onClose, theme }: PublishModalProps) {
  const t = THEME_TOKENS[theme]
  const [step, setStep] = useState<'config' | 'preview' | 'publishing' | 'done'>('config')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<OAuthPlatform>>(new Set(['xiaohongshu']))
  const [selectedCompetition, setSelectedCompetition] = useState<string>('')
  const [caseCardPreview, setCaseCardPreview] = useState<CaseCard | null>(null)
  const [generateCard, setGenerateCard] = useState(true)
  const { loading, error, success, execute: executePublish } = useAction(
    async () => {
      await new Promise(r => setTimeout(r, 2000))
      return true
    },
    { onSuccess: () => { setStep('done') }, onError: (e) => console.error(e) }
  )

  const togglePlatform = (p: OAuthPlatform) => {
    const next = new Set(selectedPlatforms)
    if (next.has(p)) next.delete(p)
    else next.add(p)
    setSelectedPlatforms(next)
  }

  const handleGeneratePreview = () => {
    const card: CaseCard = {
      id: `card-${Date.now()}`,
      title: draft?.title || '未选择内容',
      author: '蔚蓝运营笔记',
      platform: [...selectedPlatforms][0] || 'xiaohongshu',
      coverImage: draft?.thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
      views: 0,
      likes: 0,
      engagement: '预估 8.5%',
      publishedAt: new Date().toLocaleString('zh-CN'),
      tags: draft?.tags || ['AI运营'],
      competition: selectedCompetition || undefined,
      generated: false,
    }
    setCaseCardPreview(card)
    setStep('preview')
  }

  const handleConfirmPublish = () => {
    setStep('publishing')
    executePublish()
  }

  const platformInfo = (id: OAuthPlatform) => OAUTH_PLATFORMS.find(p => p.id === id)!

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`relative w-full max-w-2xl ${t.card} rounded-3xl ${t.border} border-2 ${t.shadow} overflow-hidden`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 ${t.border} border-b`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.accentLight}`}>
              <Rocket className={`h-5 w-5 ${t.accent}`} />
            </div>
            <div>
              <h2 className={`text-base font-bold ${t.textPrimary}`} style={{ fontFamily: 'Space Grotesk, monospace' }}>
                一键发布到社区
              </h2>
              <p className={`text-xs ${t.textMuted}`} style={{ fontFamily: 'monospace' }}>
                {draft?.title || '选择内容进行发布'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className={`flex h-8 w-8 items-center justify-center rounded-xl ${t.border} ${t.textSecondary} hover:${t.card} transition`}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'config' && (
            <div className="space-y-6">
              {/* Platform Selection */}
              <div>
                <label className={`mb-3 flex items-center gap-2 text-sm font-semibold ${t.textPrimary}`}>
                  <Share2 className="h-4 w-4" /> 选择发布平台
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {OAUTH_PLATFORMS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={`flex flex-col items-center gap-2 rounded-2xl p-3 transition-all border-2 ${
                        selectedPlatforms.has(p.id)
                          ? `${t.border} bg-[#14D1A0]/10`
                          : `${t.border} ${t.card}`
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden" style={{ backgroundColor: p.bgColor }}>
                        {p.connected ? (
                          <img src={p.icon} alt={p.name} className="h-6 w-6 object-cover" />
                        ) : (
                          <Globe className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                      <span className={`text-xs font-medium ${t.textPrimary}`}>{p.name}</span>
                      {selectedPlatforms.has(p.id) && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto-generate case card */}
              <div>
                <label className={`mb-3 flex items-center gap-2 text-sm font-semibold ${t.textPrimary}`}>
                  <Sparkles className="h-4 w-4" /> 自动生成案例卡片
                </label>
                <div className={`flex items-center gap-4 rounded-2xl p-4 ${t.border} ${t.card}`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.accentLight}`}>
                      <LayoutTemplate className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${t.textPrimary}`}>智能案例卡片</p>
                      <p className={`text-xs ${t.textMuted}`}>自动生成展示内容效果的数据卡片，可用于社区分享</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setGenerateCard(!generateCard)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${generateCard ? 'bg-emerald-500' : 'bg-slate-600'}`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${generateCard ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>

              {/* Competition Association */}
              <div>
                <label className={`mb-3 flex items-center gap-2 text-sm font-semibold ${t.textPrimary}`}>
                  <Trophy className="h-4 w-4" /> 关联竞赛（可选）
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCompetition('')}
                    className={`w-full flex items-center gap-3 rounded-xl p-3 transition ${selectedCompetition === '' ? `${t.border} bg-[#14D1A0]/10` : `${t.border} ${t.card} ${t.cardHover}`}`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                      <Hash className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm ${t.textPrimary}`}>不关联竞赛</p>
                    </div>
                    {selectedCompetition === '' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  </button>
                  {COMPETITIONS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCompetition(c.id)}
                      className={`w-full flex items-center gap-3 rounded-xl p-3 transition ${selectedCompetition === c.id ? `${t.border} bg-[#14D1A0]/10` : `${t.border} ${t.card} ${t.cardHover}`}`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                        <Trophy className="h-4 w-4 text-amber-500" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`text-sm ${t.textPrimary}`}>{c.name}</p>
                        <p className={`text-xs ${t.textMuted}`}>奖金 {c.prize} · {c.participants}人参与</p>
                      </div>
                      {selectedCompetition === c.id && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'preview' && caseCardPreview && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-semibold ${t.textPrimary}`}>案例卡片预览</h3>
                <button onClick={() => setStep('config')} className={`text-xs ${t.accentText} hover:underline`}>
                  返回修改
                </button>
              </div>
              {/* Case Card Preview */}
              <div className={`rounded-2xl ${t.border} ${t.card} overflow-hidden`}>
                <img src={caseCardPreview.coverImage} alt="" className="h-40 w-full object-cover" />
                <div className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                        <img src={platformInfo(caseCardPreview.platform).icon} alt="" className="h-5 w-5 rounded-full object-cover" />
                      </div>
                      <div>
                        <p className={`text-xs font-medium ${t.textPrimary}`}>{caseCardPreview.author}</p>
                        <p className={`text-[10px] ${t.textMuted}`}>刚刚发布</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      <span className="text-[10px] text-emerald-600">案例卡片</span>
                    </div>
                  </div>
                  <h4 className={`mb-2 text-sm font-bold ${t.textPrimary}`}>{caseCardPreview.title}</h4>
                  <div className="mb-3 flex flex-wrap gap-1">
                    {caseCardPreview.tags.map(tag => (
                      <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">#{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Eye className="h-3 w-3" /> 预估 0
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Star className="h-3 w-3" /> 预估 0
                    </div>
                    <div className="flex items-center gap-1 text-xs text-emerald-500">
                      <TrendingUp className="h-3 w-3" /> 预估 engagement {caseCardPreview.engagement}
                    </div>
                  </div>
                  {caseCardPreview.competition && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 p-2">
                      <Trophy className="h-3 w-3 text-amber-500" />
                      <span className="text-[10px] text-amber-700">关联竞赛：{caseCardPreview.competition}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CopyCheck className="h-3 w-3" />
                平台审核通过后，案例卡片将自动生成并可在社区分享
              </div>
            </div>
          )}

          {step === 'publishing' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
                  <Rocket className="h-10 w-10 text-emerald-400 animate-pulse" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full border-2 border-emerald-500/30 animate-ping" />
                </div>
              </div>
              <h3 className={`mb-2 text-lg font-bold ${t.textPrimary}`}>正在发布到 {selectedPlatforms.size} 个平台...</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {[...selectedPlatforms].map(p => (
                  <span key={p} className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-400">
                    {platformInfo(p).name}
                  </span>
                ))}
              </div>
              {generateCard && (
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                  <Sparkles className="h-4 w-4" /> 正在生成案例卡片
                </div>
              )}
            </div>
          )}

          {step === 'done' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              </div>
              <h3 className={`mb-2 text-lg font-bold ${t.textPrimary}`}>发布成功！</h3>
              <p className={`mb-6 text-sm ${t.textMuted}`}>内容已成功发布到 {selectedPlatforms.size} 个平台</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[...selectedPlatforms].map(p => (
                  <span key={p} className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> {platformInfo(p).name}
                  </span>
                ))}
              </div>
              {generateCard && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2">
                  <LayoutTemplate className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-emerald-400">案例卡片已自动生成</span>
                </div>
              )}
              {selectedCompetition && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-amber-500">已关联竞赛：{COMPETITIONS.find(c => c.id === selectedCompetition)?.name}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 px-6 py-4 ${t.border} border-t`}>
          {step === 'config' && (
            <>
              <button onClick={onClose} className={`rounded-xl px-4 py-2 text-sm ${t.textSecondary} ${t.border} border transition hover:${t.card}`}>
                取消
              </button>
              <button
                onClick={handleGeneratePreview}
                disabled={selectedPlatforms.size === 0}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-[#010409] transition ${t.accentBg} hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <Wand2 className="h-4 w-4" /> 生成预览
              </button>
            </>
          )}
          {step === 'preview' && (
            <>
              <button onClick={() => setStep('config')} className={`rounded-xl px-4 py-2 text-sm ${t.textSecondary} ${t.border} border transition hover:${t.card}`}>
                上一步
              </button>
              <button
                onClick={handleConfirmPublish}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-[#010409] transition ${t.accentBg} hover:bg-emerald-400`}
              >
                <Rocket className="h-4 w-4" /> 确认发布
              </button>
            </>
          )}
          {step === 'done' && (
            <button
              onClick={onClose}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-[#010409] transition ${t.accentBg} hover:bg-emerald-400`}
            >
              完成
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Platform OAuth Binding Panel ─────────────────────────────────────────────
interface OAuthBindingPanelProps {
  theme: 'dark' | 'light'
}

function OAuthBindingPanel({ theme }: OAuthBindingPanelProps) {
  const t = THEME_TOKENS[theme]
  const [platforms, setPlatforms] = useState(OAUTH_PLATFORMS)
  const [bindingPlatform, setBindingPlatform] = useState<OAuthPlatform | null>(null)
  const [bindingStep, setBindingStep] = useState<string>('scan')
  const [qrCode, setQrCode] = useState('')
  const { loading, success, error, execute: executeOAuth } = useAction(
    async (platformId: OAuthPlatform) => {
      await new Promise(r => setTimeout(r, 1500))
      setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=oauth_${platformId}_mock_token_${Date.now()}`)
      setBindingStep('scan')
      return true
    },
    {}
  )

  const handleBindClick = (platformId: OAuthPlatform) => {
    setBindingPlatform(platformId)
    executeOAuth(platformId)
    setBindingStep('scan')
  }

  const handleConfirmBind = () => {
    if (!bindingPlatform) return
    setPlatforms(prev => prev.map(p =>
      p.id === bindingPlatform
        ? { ...p, connected: true, status: 'connected' as const, accountName: '已绑定账号', bindingTime: new Date().toLocaleDateString('zh-CN') }
        : p
    ))
    setBindingPlatform(null)
    setBindingStep('scan')
  }

  const handleUnbind = (platformId: OAuthPlatform) => {
    setPlatforms(prev => prev.map(p =>
      p.id === platformId
        ? { ...p, connected: false, status: 'disconnected' as const, accountName: undefined, followers: undefined, lastSynced: undefined }
        : p
    ))
  }

  const connectedCount = platforms.filter(p => p.connected).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className={`h-4 w-4 ${t.accent}`} />
          <span className={`text-sm font-semibold ${t.textPrimary}`} style={{ fontFamily: 'Space Grotesk, monospace' }}>
            平台 OAuth 授权
          </span>
        </div>
        <span className={`text-xs ${t.textMuted}`}>
          已连接 {connectedCount}/{platforms.length}
        </span>
      </div>

      {/* Platform List */}
      <div className="space-y-3">
        {platforms.map(p => (
          <div key={p.id} className={`flex items-center justify-between rounded-2xl p-4 ${t.border} ${t.card} transition`}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: p.bgColor }}>
                {p.connected ? (
                  <img src={p.icon} alt={p.name} className="h-7 w-7 rounded-lg object-cover" />
                ) : (
                  <Globe className="h-5 w-5 text-slate-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${t.textPrimary}`}>{p.name}</p>
                  {p.connected && (
                    <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] text-emerald-600">
                      <CheckCircle2 className="h-2.5 w-2.5" /> 已连接
                    </span>
                  )}
                </div>
                {p.connected ? (
                  <div className="mt-0.5 flex items-center gap-3">
                    <span className={`text-[10px] ${t.textMuted}`}>{p.accountName}</span>
                    <span className={`text-[10px] ${t.textMuted}`}>·</span>
                    <span className={`text-[10px] ${t.textMuted}`}>{p.followers} 粉丝</span>
                    <span className={`text-[10px] ${t.textMuted}`}>·</span>
                    <span className={`text-[10px] ${t.textMuted}`}>本周{p.postsThisWeek}篇</span>
                  </div>
                ) : (
                  <p className={`mt-0.5 text-[10px] ${t.textMuted}`}>点击右侧按钮进行授权绑定</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {p.connected ? (
                <>
                  <span className={`text-[10px] ${t.textMuted}`}>绑定于 {p.bindingTime}</span>
                  <button
                    onClick={() => handleUnbind(p.id)}
                    className="rounded-lg px-2.5 py-1 text-[10px] text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    解除
                  </button>
                  <button className={`flex items-center gap-1 rounded-lg ${t.accentLight} px-2.5 py-1 text-[10px] ${t.accentText} hover:bg-emerald-500/20 transition`}>
                    <RefreshCw className="h-3 w-3" /> 同步
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleBindClick(p.id)}
                  className={`flex items-center gap-1 rounded-lg ${t.accentBg} px-3 py-1.5 text-xs font-medium text-[#010409] transition hover:bg-emerald-400`}
                >
                  <Link2 className="h-3 w-3" /> 授权绑定
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* OAuth Binding Modal */}
      {bindingPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`relative w-full max-w-sm ${t.card} rounded-3xl ${t.border} border-2 ${t.shadow} overflow-hidden`}>
            <div className={`flex items-center justify-between px-5 py-4 ${t.border} border-b`}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: platforms.find(p => p.id === bindingPlatform)?.bgColor }}>
                  <Globe className="h-4 w-4" />
                </div>
                <span className={`text-sm font-semibold ${t.textPrimary}`}>授权绑定 {platforms.find(p => p.id === bindingPlatform)?.name}</span>
              </div>
              <button onClick={() => setBindingPlatform(null)} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 flex flex-col items-center">
              {bindingStep === 'scan' && (
                <>
                  <p className={`mb-4 text-sm ${t.textSecondary}`}>请使用 {platforms.find(p => p.id === bindingPlatform)?.name} App 扫描下方二维码</p>
                  <div className="mb-4 rounded-2xl bg-white p-4">
                    {qrCode ? (
                      <img src={qrCode} alt="OAuth QR Code" className="h-40 w-40" />
                    ) : (
                      <div className="h-40 w-40 flex items-center justify-center">
                        <RefreshCw className="h-8 w-8 text-slate-400 animate-spin" />
                      </div>
                    )}
                  </div>
                  <p className={`mb-4 text-xs ${t.textMuted}`}>二维码有效期：5分钟</p>
                  <button
                    onClick={handleConfirmBind}
                    className={`w-full rounded-xl ${t.accentBg} py-2.5 text-sm font-semibold text-[#010409] transition hover:bg-emerald-400`}
                  >
                    我已扫码确认
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function DetailPanel({ item, onClose, onPublish, theme }: { item: Record<string, unknown> | null; onClose: () => void; onPublish?: () => void; theme: 'dark' | 'light' }) {
  const t = THEME_TOKENS[theme]
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const { execute: executePreview } = useAction(
    async () => { return true },
    { onSuccess: () => setSuccessMsg(`正在打开预览...`) }
  )

  if (!item) return null

  return (
    <div className={`absolute inset-y-0 right-0 z-20 flex flex-col ${t.border} border-l ${t.bg} ${t.shadow} w-[340px]`}>
      <div className={`flex items-center justify-between px-5 py-4 ${t.border} border-b`}>
        <span className={`text-xs font-medium ${t.textMuted}`} style={{ fontFamily: 'monospace' }}>详情</span>
        <button onClick={onClose} className={`flex h-8 w-8 items-center justify-center rounded-xl ${t.textSecondary} hover:${t.card} transition`}>
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {item.thumbnail && (
          <img src={item.thumbnail as string} alt="" className="w-full h-44 object-cover rounded-2xl mb-4" />
        )}
        <div className="flex items-center gap-2 mb-2">
          {item.type && (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">{item.type as string}</span>
          )}
        </div>
        <h2 className={`mb-2 text-lg font-bold ${t.textPrimary} leading-snug`} style={{ fontFamily: 'Space Grotesk, monospace' }}>
          {item.title as string}
        </h2>
        {item.subtitle && (
          <p className={`mb-3 text-sm ${t.textSecondary}`}>{item.subtitle as string}</p>
        )}
        {item.description && (
          <p className={`mb-4 text-sm leading-relaxed ${t.textSecondary}`}>{item.description as string}</p>
        )}
        <div className="space-y-3">
          {item.rating && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-[#FFD23F] text-amber-500" />
              <span className="text-sm font-bold text-amber-500">{(item.rating as number).toFixed(1)}</span>
              {item.sales && <span className={`text-xs ${t.textMuted}`}>已售 {item.sales as number} 件</span>}
            </div>
          )}
          {item.price !== undefined && item.price > 0 && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-2xl font-bold text-emerald-600">¥{item.price.toLocaleString()}</span>
              {item.originalPrice && item.originalPrice > 0 && (
                <span className={`text-sm ${t.textMuted} line-through`}>¥{item.originalPrice as number}</span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={`flex flex-col gap-2 px-4 py-4 ${t.border} border-t`}>
        {onPublish && (
          <button
            onClick={onPublish}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl ${t.accentBg} py-3 text-sm font-bold text-[#010409] transition-all hover:bg-emerald-400 active:scale-[0.98]`}
          >
            <Rocket className="h-4 w-4" /> 一键发布
          </button>
        )}
        <button
          onClick={() => executePreview()}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl ${t.border} border py-2.5 text-sm ${t.textSecondary} transition-all hover:${t.card} active:scale-[0.98]`}
        >
          <Play className="h-4 w-4" /> 预览内容
        </button>
      </div>
      <ActionToast loading={false} error={null} success={successMsg ?? undefined} onClose={() => setSuccessMsg(null)} />
    </div>
  )
}

// ─── Stats Block ───────────────────────────────────────────────────────────────
function StatsBlock({ theme }: { theme: 'dark' | 'light' }) {
  const t = THEME_TOKENS[theme]
  const stats = [
    { label: '本周发布', value: '6', icon: Send, color: '#14D1A0' },
    { label: '草稿', value: '3', icon: FileText, color: '#FFD23F' },
    { label: '绑定平台', value: '5', icon: Globe, color: '#2B59C3' },
    { label: '总曝光', value: '42.3k', icon: Eye, color: '#14D1A0' },
  ]
  return (
    <div className={`flex flex-col justify-between overflow-hidden rounded-2xl ${t.border} ${t.card} p-4`} style={{ gridColumn: 'span 3' }}>
      <div className="mb-4 flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${t.accentLight}`}>
          <BarChart2 className="h-4 w-4 text-emerald-400" />
        </div>
        <span className={`text-xs font-bold ${t.textSecondary}`} style={{ fontFamily: 'monospace' }}>创作数据</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl ${t.border} ${t.card} p-3`}>
            <p className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, monospace', color: s.color }}>{s.value}</p>
            <p className={`text-[10px] ${t.textMuted}`}>{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2">
        <TrendingUp className="h-4 w-4 text-emerald-400" />
        <span className="text-xs text-emerald-400">本周曝光较上周 +23%</span>
      </div>
    </div>
  )
}

// ─── Featured Block ────────────────────────────────────────────────────────────
function FeaturedBlock({ item, onClick, theme }: { item: typeof FEATURED_PACKAGE; onClick: () => void; theme: 'dark' | 'light' }) {
  const t = THEME_TOKENS[theme]
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col overflow-hidden rounded-2xl ${t.border} ${t.card} transition-all duration-300 active:scale-[0.98]`}
      style={{ gridColumn: 'span 3', gridRow: 'span 4' }}
    >
      <div className="relative w-3/5 shrink-0 overflow-hidden">
        <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1628]" />
        {item.badge && (
          <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-[#FFD23F] px-3 py-1">
            <Star className="h-3 w-3 fill-black text-black" />
            <span className="text-[10px] font-bold text-black">{item.badge}</span>
          </div>
        )}
      </div>
      <div className="flex w-2/5 flex-col justify-between p-6 text-left">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600">{item.type}</span>
          </div>
          <h3 className={`mb-2 text-xl font-bold leading-snug ${t.textPrimary} transition-colors group-hover:text-emerald-600`} style={{ fontFamily: 'Space Grotesk, monospace' }}>
            {item.title}
          </h3>
          <p className={`mb-4 line-clamp-2 text-sm ${t.textSecondary}`}>{item.subtitle}</p>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-400">#{tag}</span>
            ))}
          </div>
          <div className="mb-4 space-y-1.5">
            {item.items.map((it) => (
              <div key={it} className={`flex items-center gap-2 text-xs ${t.textSecondary}`}>
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <span>{it}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-[#FFD23F] text-amber-500" />
              <span className="text-sm font-bold text-amber-500">{item.rating}</span>
            </div>
            <span className={`text-sm ${t.textMuted}`}>已售 {item.sales}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">¥{item.price}</span>
            {item.originalPrice > 0 && (
              <span className={`text-sm ${t.textMuted} line-through`}>¥{item.originalPrice}</span>
            )}
          </div>
          <div className={`flex items-center gap-1 ${t.accentText} opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1`}>
            <span className="text-sm font-bold">查看详情</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </button>
  )
}

// ─── Draft Block ──────────────────────────────────────────────────────────────
function DraftBlock({ item, size, onClick, theme }: { item: typeof DRAFTS[0]; size: 'md' | 'sm'; onClick: () => void; theme: 'dark' | 'light' }) {
  const t = THEME_TOKENS[theme]
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col overflow-hidden rounded-2xl ${t.border} ${t.card} transition-all duration-300 active:scale-[0.98]`}
      style={{ gridColumn: 'span 1' }}
    >
      <div className="relative overflow-hidden" style={{ height: size === 'md' ? '100px' : '70px' }}>
        <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 to-transparent" />
        <div className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ backgroundColor: item.platformColor + '22', color: item.platformColor }}>
          {item.platform}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h4 className={`mb-1 line-clamp-2 text-sm font-bold leading-snug ${t.textPrimary} transition-colors group-hover:text-emerald-600`} style={{ fontFamily: 'Space Grotesk, monospace' }}>
          {item.title}
        </h4>
        <div className="mb-2 flex flex-wrap gap-1">
          {item.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] text-slate-400">#{tag}</span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-2.5">
          <span className={`text-[10px] ${t.textMuted}`}>{item.updatedAt}</span>
          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${item.status === '待发布' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
            {item.status}
          </span>
        </div>
      </div>
    </button>
  )
}

// ─── Platform Block (simplified inside main grid) ────────────────────────────
function PlatformBlockGrid({ theme }: { theme: 'dark' | 'light' }) {
  const t = THEME_TOKENS[theme]
  const { execute: executeAddPlatform } = useAction(
    async () => { return true },
    { onSuccess: () => {} }
  )

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl ${t.border} ${t.card} p-4`} style={{ gridColumn: 'span 2' }}>
      <div className="mb-3 flex items-center justify-between">
        <span className={`text-sm font-bold ${t.textPrimary}`} style={{ fontFamily: 'Space Grotesk, monospace' }}>已绑定平台</span>
        <button className={`flex items-center gap-1 text-[10px] ${t.accentText} hover:text-emerald-500`}>
          <Plus className="h-3 w-3" /> 添加平台
        </button>
      </div>
      <div className="flex-1 flex flex-col justify-around">
        {[
          { name: '小红书', color: '#FF2442', connected: true, followers: '1.2万', posts: 3 },
          { name: '抖音', color: '#00F2EA', connected: true, followers: '8,920', posts: 2 },
          { name: 'B站', color: '#FB7299', connected: false, followers: '0', posts: 0 },
          { name: '公众号', color: '#07C160', connected: true, followers: '5,600', posts: 2 },
          { name: '视频号', color: '#07C160', connected: false, followers: '0', posts: 0 },
        ].map((p) => (
          <div key={p.name} className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: p.color + '22' }}>
                <Globe className="h-4 w-4 text-slate-400" />
              </div>
              <div>
                <p className={`text-xs font-medium ${t.textPrimary}`}>{p.name}</p>
                <p className={`text-[9px] ${t.textMuted}`}>{p.followers} 粉丝</p>
              </div>
            </div>
            {p.connected ? (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[9px] font-bold text-emerald-600">
                <CheckCircle2 className="h-3 w-3" /> 已连接
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[9px] text-slate-500">未连接</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tool Block ───────────────────────────────────────────────────────────────
function ToolBlock({ item, size, onClick, theme }: { item: typeof TOOLS[0]; size: 'md' | 'sm'; onClick: () => void; theme: 'dark' | 'light' }) {
  const t = THEME_TOKENS[theme]
  const Icon = item.icon
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col overflow-hidden rounded-2xl ${t.border} ${t.card} transition-all duration-300 active:scale-[0.98]`}
      style={{ gridColumn: 'span 1' }}
    >
      <div className="relative overflow-hidden" style={{ height: '70px' }}>
        <img src={item.thumbnail} alt={item.name} className="h-full w-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent" />
        <div className="absolute bottom-2 left-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ backgroundColor: item.color + '22' }}>
            <Icon className="h-4 w-4" style={{ color: item.color }} />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h4 className={`mb-1 text-sm font-bold ${t.textPrimary}`} style={{ fontFamily: 'Space Grotesk, monospace' }}>{item.name}</h4>
        <p className={`line-clamp-2 text-[10px] ${t.textMuted}`}>{item.desc}</p>
      </div>
    </button>
  )
}

// ─── Schedule Block ──────────────────────────────────────────────────────────────
function ScheduleBlock({ theme }: { theme: 'dark' | 'light' }) {
  const t = THEME_TOKENS[theme]
  const { execute: executeAddTask } = useAction(
    async () => { return true },
    {}
  )

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl ${t.border} ${t.card} p-4`} style={{ gridColumn: 'span 2' }}>
      <div className="mb-3 flex items-center justify-between">
        <span className={`text-sm font-bold ${t.textPrimary}`} style={{ fontFamily: 'Space Grotesk, monospace' }}>发布排期</span>
        <button className={`flex items-center gap-1 text-[10px] ${t.accentText} hover:text-emerald-500`}>
          <Plus className="h-3 w-3" /> 添加任务
        </button>
      </div>
      <div className="flex-1 flex flex-col justify-around">
        {SCHEDULE.map((s) => (
          <div key={s.id} className="flex items-center gap-3 py-1.5">
            <div className="h-10 w-14 overflow-hidden rounded-lg shrink-0">
              <img src={s.thumbnail} alt={s.title} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`truncate text-xs font-medium ${t.textPrimary}`}>{s.title}</p>
              <p className={`text-[9px] ${t.textMuted}`}>{s.platform} · {s.time}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${s.status === '待发布' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 我的创作 Tab ────────────────────────────────────────────────────────────
function MyCreationsTab({ theme, onPublishDraft }: { theme: 'dark' | 'light'; onPublishDraft: (draft: typeof DRAFTS[0]) => void }) {
  const t = THEME_TOKENS[theme]
  const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null)

  const getBlockContent = (block: Block) => {
    switch (block.type) {
      case 'stats':
        return <StatsBlock key={block.id} theme={theme} />
      case 'featured':
        return (
          <FeaturedBlock
            key={block.id}
            item={FEATURED_PACKAGE}
            theme={theme}
            onClick={() => setSelectedItem(FEATURED_PACKAGE as unknown as Record<string, unknown>)}
          />
        )
      case 'draft': {
        const idx = parseInt(block.id.split('-')[1])
        const d = DRAFTS[idx % DRAFTS.length]
        return (
          <DraftBlock
            key={block.id}
            item={d}
            size={block.size as 'md' | 'sm'}
            theme={theme}
            onClick={() => setSelectedItem({ ...d, canPublish: true } as unknown as Record<string, unknown>)}
          />
        )
      }
      case 'platform':
        return <PlatformBlockGrid key={block.id} theme={theme} />
      case 'tool': {
        const idx = parseInt(block.id.split('-')[1])
        const t_item = TOOLS[idx % TOOLS.length]
        return (
          <ToolBlock
            key={block.id}
            item={t_item}
            size={block.size as 'md' | 'sm'}
            theme={theme}
            onClick={() => setSelectedItem(t_item as unknown as Record<string, unknown>)}
          />
        )
      }
      case 'schedule':
        return <ScheduleBlock key={block.id} theme={theme} />
      default:
        return null
    }
  }

  return (
    <div className="relative flex-1 overflow-auto p-4">
      <div className="grid min-h-full gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '160px' }}>
        {BLOCKS.map(getBlockContent)}
      </div>
      {selectedItem && (
        <DetailPanel
          item={selectedItem}
          theme={theme}
          onClose={() => setSelectedItem(null)}
          onPublish={selectedItem.canPublish ? () => { onPublishDraft(selectedItem as unknown as typeof DRAFTS[0]); setSelectedItem(null) } : undefined}
        />
      )}
    </div>
  )
}

// ─── 创作工具 Tab ────────────────────────────────────────────────────────────
function CreationToolsTab({ theme }: { theme: 'dark' | 'light' }) {
  const t = THEME_TOKENS[theme]

  const tools2 = [
    { id: 'ct1', name: 'AI文案生成器', desc: '输入商品卖点，AI生成3-5个爆款文案版本', icon: Edit3, color: '#14D1A0', stats: '已生成 1,284 篇' },
    { id: 'ct2', name: '多平台内容适配', desc: '一键调整内容格式，适配各平台发布规范', icon: RefreshCw, color: '#2B59C3', stats: '已适配 3,921 次' },
    { id: 'ct3', name: '智能配图生成', desc: '根据内容自动匹配最佳封面图和插图', icon: Image, color: '#FB7299', stats: '已生成 892 张' },
    { id: 'ct4', name: '数据趋势分析', desc: '分析内容表现，输出可执行的增长建议', icon: BarChart2, color: '#FFD23F', stats: '分析 456 次' },
    { id: 'ct5', name: '批量发布管理', desc: '同时管理多个平台的内容排期和发布', icon: Calendar, color: '#07C160', stats: '管理 12 个平台' },
    { id: 'ct6', name: '案例卡片生成', desc: '自动生成精美案例卡片用于社区分享', icon: LayoutTemplate, color: '#FF2442', stats: '已生成 628 张' },
  ]

  return (
    <div className="flex-1 overflow-auto p-4 space-y-6">
      {/* Tools Grid */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Wand2 className={`h-4 w-4 ${t.accent}`} />
          <span className={`text-sm font-semibold ${t.textPrimary}`} style={{ fontFamily: 'Space Grotesk, monospace' }}>AI 创作工具</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {tools2.map(tool => {
            const Icon = tool.icon
            return (
              <button
                key={tool.id}
                className={`flex flex-col items-start gap-3 rounded-2xl ${t.border} ${t.card} p-4 text-left transition hover:${t.cardHover} active:scale-[0.98]`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: tool.color + '22' }}>
                    <Icon className="h-5 w-5" style={{ color: tool.color }} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${t.textPrimary}`} style={{ fontFamily: 'Space Grotesk, monospace' }}>{tool.name}</p>
                    <p className={`text-[10px] ${t.textMuted}`}>{tool.stats}</p>
                  </div>
                </div>
                <p className={`text-xs ${t.textSecondary}`}>{tool.desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* OAuth Platform Binding */}
      <div className={`rounded-2xl ${t.border} ${t.card} p-5`}>
        <OAuthBindingPanel theme={theme} />
      </div>
    </div>
  )
}

// ─── 发布记录 Tab ────────────────────────────────────────────────────────────
function PublishRecordsTab({ theme }: { theme: 'dark' | 'light' }) {
  const t = THEME_TOKENS[theme]
  const [records] = useState(PUBLISH_RECORDS)
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed' | 'pending'>('all')
  const [filterPlatform, setFilterPlatform] = useState<OAuthPlatform | 'all'>('all')
  const [selectedRecord, setSelectedRecord] = useState<PublishRecord | null>(null)

  const filtered = records.filter(r => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false
    if (filterPlatform !== 'all' && r.platform !== filterPlatform) return false
    return true
  })

  const totalViews = filtered.reduce((s, r) => s + r.views, 0)
  const totalLikes = filtered.reduce((s, r) => s + r.likes, 0)
  const successCount = filtered.filter(r => r.status === 'success').length
  const platformName = (id: OAuthPlatform) => OAUTH_PLATFORMS.find(p => p.id === id)?.name || id
  const platformColor = (id: OAuthPlatform) => OAUTH_PLATFORMS.find(p => p.id === id)?.color || '#999'

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: '总发布数', value: records.length.toString(), color: '#14D1A0' },
          { label: '成功发布', value: successCount.toString(), color: '#07C160' },
          { label: '总曝光', value: totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews.toString(), color: '#2B59C3' },
          { label: '总点赞', value: totalLikes >= 1000 ? `${(totalLikes / 1000).toFixed(1)}k` : totalLikes.toString(), color: '#FB7299' },
        ].map(s => (
          <div key={s.label} className={`flex items-center gap-3 rounded-2xl ${t.border} ${t.card} p-4`}>
            <p className="text-2xl font-bold" style={{ color: s.color, fontFamily: 'monospace' }}>{s.value}</p>
            <p className={`text-xs ${t.textMuted}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          {(['all', 'success', 'failed', 'pending'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filterStatus === s ? 'bg-emerald-500/20 text-emerald-600' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              {s === 'all' ? '全部' : s === 'success' ? '成功' : s === 'failed' ? '失败' : '待发布'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setFilterPlatform('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              filterPlatform === 'all' ? 'bg-emerald-500/20 text-emerald-600' : 'text-slate-400 hover:text-slate-900'
            }`}
          >
            全平台
          </button>
          {OAUTH_PLATFORMS.map(p => (
            <button
              key={p.id}
              onClick={() => setFilterPlatform(p.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filterPlatform === p.id ? 'bg-emerald-500/20 text-emerald-600' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className={`flex flex-col items-center justify-center rounded-2xl ${t.border} ${t.card} py-12 text-center`}>
            <FileText className={`h-10 w-10 ${t.textMuted} mb-3`} />
            <p className={`text-sm ${t.textMuted}`}>暂无发布记录</p>
          </div>
        ) : (
          filtered.map(record => (
            <div
              key={record.id}
              className={`flex items-start gap-4 rounded-2xl ${t.border} ${t.card} p-4 transition cursor-pointer hover:${t.cardHover}`}
              onClick={() => setSelectedRecord(record)}
            >
              {/* Status Icon */}
              <div className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
                record.status === 'success' ? 'bg-emerald-500/20' : record.status === 'failed' ? 'bg-rose-500/20' : 'bg-amber-500/20'
              }`}>
                {record.status === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : record.status === 'failed' ? (
                  <X className="h-5 w-5 text-rose-400" />
                ) : (
                  <Clock className="h-5 w-5 text-amber-400" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-medium" style={{ color: platformColor(record.platform) }}>
                    {platformName(record.platform)}
                  </span>
                  <span className={`text-[10px] ${t.textMuted}`}>{record.publishedAt}</span>
                  {record.competition && (
                    <span className="flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] text-amber-600">
                      <Trophy className="h-2.5 w-2.5" /> {record.competition}
                    </span>
                  )}
                  {record.caseCardGenerated && (
                    <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] text-emerald-600">
                      <LayoutTemplate className="h-2.5 w-2.5" /> 案例卡
                    </span>
                  )}
                </div>
                <p className={`text-sm font-medium ${t.textPrimary} truncate`} style={{ fontFamily: 'Space Grotesk, monospace' }}>
                  {record.title}
                </p>
                {record.status === 'success' && (
                  <div className="mt-2 flex items-center gap-4">
                    <span className={`flex items-center gap-1 text-[10px] ${t.textMuted}`}>
                      <Eye className="h-3 w-3" /> {record.views.toLocaleString()}
                    </span>
                    <span className={`flex items-center gap-1 text-[10px] ${t.textMuted}`}>
                      <Star className="h-3 w-3" /> {record.likes.toLocaleString()}
                    </span>
                    <span className={`flex items-center gap-1 text-[10px] ${t.textMuted}`}>
                      <MessageSquare className="h-3 w-3" /> {record.comments.toLocaleString()}
                    </span>
                    {record.url && (
                      <a href={record.url} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-1 text-[10px] text-blue-500 hover:underline" onClick={e => e.stopPropagation()}>
                        <ExternalLink className="h-3 w-3" /> 查看
                      </a>
                    )}
                  </div>
                )}
                {record.status === 'failed' && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg bg-rose-500/10 p-2">
                    <AlertTriangle className="h-3 w-3 text-rose-400" />
                    <span className="text-[10px] text-rose-400">内容违规审核未通过</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ─── Main CreationModule ──────────────────────────────────────────────────────
export default function CreationModule() {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme
  const t = THEME_TOKENS[theme]
  const [activeTab, setActiveTab] = useState<'my-creation' | 'tools' | 'records'>('my-creation')
  const [publishModalDraft, setPublishModalDraft] = useState<typeof DRAFTS[0] | null>(null)
  const [showPublishModal, setShowPublishModal] = useState(false)

  const handlePublishDraft = useCallback((draft: typeof DRAFTS[0]) => {
    setPublishModalDraft(draft)
    setShowPublishModal(true)
  }, [])

  const tabs = [
    { id: 'my-creation' as const, label: '我的创作', icon: Layers },
    { id: 'tools' as const, label: '创作工具', icon: Wand2 },
    { id: 'records' as const, label: '发布记录', icon: FileText },
  ]

  return (
    <div className={`relative flex h-full flex-col gap-0 overflow-hidden rounded-2xl ${t.border} border ${t.bg}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-6 py-4 ${t.border} border-b shrink-0`}>
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${t.accentLight}`}>
            <Layers className={`h-5 w-5 ${t.accent}`} />
          </div>
          <div>
            <h1 className={`text-base font-bold ${t.textPrimary}`} style={{ fontFamily: 'Space Grotesk, monospace' }}>创作中心</h1>
            <p className={`text-[10px] ${t.textMuted}`} style={{ fontFamily: 'monospace' }}>内容 · 价值包 · 平台 · 排期</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition ${
                  activeTab === tab.id
                    ? `${t.accentBg} text-[#010409]`
                    : `${t.textSecondary} hover:${t.textPrimary}`
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className={`text-sm font-bold tabular-nums ${t.textPrimary}`} style={{ fontFamily: 'monospace' }}>{DRAFTS.length}</p>
            <p className={`text-[10px] ${t.textMuted}`}>草稿</p>
          </div>
          <div className="h-5 w-px bg-slate-200" />
          <div className="text-center">
            <p className={`text-sm font-bold tabular-nums ${t.accentText}`} style={{ fontFamily: 'monospace' }}>{SCHEDULE.filter(s => s.status === '待发布').length}</p>
            <p className={`text-[10px] ${t.textMuted}`}>待发布</p>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'my-creation' && <MyCreationsTab theme={theme} onPublishDraft={handlePublishDraft} />}
      {activeTab === 'tools' && <CreationToolsTab theme={theme} />}
      {activeTab === 'records' && <PublishRecordsTab theme={theme} />}

      {/* Publish Modal */}
      {showPublishModal && (
        <PublishModal
          draft={publishModalDraft}
          theme={theme}
          onClose={() => { setShowPublishModal(false); setPublishModalDraft(null) }}
        />
      )}
    </div>
  )
}
