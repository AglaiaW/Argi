'use client'

import { useState } from 'react'
import {
  FileText, Image, Video, Mail, ShoppingBag,
  X, Star, Zap, Clock, Eye, Shield, ArrowRight,
  Edit3, BarChart2, Send, Plus, Layers, Palette,
  MousePointer, TrendingUp, Calendar, CheckCircle2,
  RefreshCw, Globe, ChevronRight, Play
} from 'lucide-react'
import { useAction, ActionToast } from '@/hooks/useAction'

// ─── Block types ─────────────────────────────────────────────────────────────
type BlockSize = 'sm' | 'md' | 'lg' | 'xl'

interface Block {
  id: string
  type: 'featured' | 'draft' | 'platform' | 'schedule' | 'stats' | 'tool'
  size: BlockSize
}

// ─── 版型：创作者看板（左右分栏）─────────────────────────────────────────────
// 左栏：价值包大卡（占满左半）
// 右栏：从上到下：统计 → 草稿列表 → 平台连接 → 排期任务
const BLOCKS: Block[] = [
  // 左栏：价值包大卡（跨3列，占满4个grid行）
  { id: 'feat', type: 'featured', size: 'xl' },
  // 右栏顶：统计（3列）
  { id: 'stats', type: 'stats', size: 'sm' },
  // 右栏中上：草稿列表 × 2（各1.5列）
  { id: 'draft-0', type: 'draft', size: 'md' },
  { id: 'draft-1', type: 'draft', size: 'md' },
  // 右栏中下：平台连接（3列）
  { id: 'plat-0', type: 'platform', size: 'lg' },
  // 右栏底：工具矩阵 × 2（各1.5列）
  { id: 'tool-0', type: 'tool', size: 'md' },
  { id: 'tool-1', type: 'tool', size: 'md' },
  // 右栏最底：排期任务（3列）
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

const PLATFORMS = [
  { id: 'p1', name: '小红书', icon: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=100&q=80', color: '#FF2442', connected: true, followers: '1.2万', postsThisWeek: 3 },
  { id: 'p2', name: '抖音', icon: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=100&q=80', color: '#00F2EA', connected: true, followers: '8,920', postsThisWeek: 2 },
  { id: 'p3', name: 'B站', icon: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=100&q=80', color: '#FB7299', connected: false, followers: '0', postsThisWeek: 0 },
  { id: 'p4', name: '视频号', icon: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=100&q=80', color: '#07C160', connected: true, followers: '3,450', postsThisWeek: 1 },
  { id: 'p5', name: '公众号', icon: 'https://images.unsplash.com/photo-1573984699409-7d3e1a14e76c?w=100&q=80', color: '#07C160', connected: true, followers: '5,600', postsThisWeek: 2 },
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

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function DetailPanel({ item, onClose }: { item: Record<string, unknown> | null; onClose: () => void }) {
  if (!item) return null

  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const { loading, error, execute: executePurchase } = useAction(
    async () => {
      // 正在购买（需接入支付API）
      return true
    },
    { onSuccess: () => setSuccessMsg(`购买成功！`), onError: (e) => console.error(e) }
  )

  const { execute: executePreview } = useAction(
    async () => {
      // 正在预览内容详情
      return true
    },
    { onSuccess: () => setSuccessMsg(`正在打开预览...`), onError: (e) => console.error(e) }
  )

  return (
    <div className="absolute inset-y-0 right-0 z-20 flex flex-col border-l border-slate-200 bg-white shadow-2xl w-[340px]">
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-5 py-4">
        <span className="text-xs font-medium text-slate-500" style={{ fontFamily: 'monospace' }}>详情</span>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100">
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
        <h2 className="mb-2 text-lg font-bold text-slate-900 leading-snug" style={{ fontFamily: 'Space Grotesk, monospace' }}>
          {item.title as string}
        </h2>
        {item.subtitle && (
          <p className="mb-3 text-sm text-slate-400">{item.subtitle as string}</p>
        )}
        {item.description && (
          <p className="mb-4 text-sm leading-relaxed text-slate-600">{item.description as string}</p>
        )}
        <div className="space-y-3">
          {item.rating && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-[#FFD23F] text-amber-500" />
              <span className="text-sm font-bold text-amber-500">{(item.rating as number).toFixed(1)}</span>
              {item.sales && <span className="text-xs text-slate-500">已售 {item.sales as number} 件</span>}
            </div>
          )}
          {item.price !== undefined && item.price > 0 && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-2xl font-bold text-emerald-600">¥{item.price.toLocaleString()}</span>
              {item.originalPrice && item.originalPrice > 0 && (
                <span className="text-sm text-slate-500 line-through">¥{item.originalPrice as number}</span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-[rgba(255,255,255,0.06)] p-4 space-y-2">
        <button
          onClick={() => executePurchase()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#14D1A0] py-3 text-sm font-bold text-[#010409] transition-all hover:bg-[#14D1A0]/90 active:scale-[0.98]"
        >
          <ArrowRight className="h-4 w-4" /> 立即购买
        </button>
        <button
          onClick={() => executePreview()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-2.5 text-sm text-slate-400 transition-all hover:border-slate-300 active:scale-[0.98]"
        >
          <Play className="h-4 w-4" /> 预览内容
        </button>
      </div>
      <ActionToast loading={loading} error={error} success={successMsg ?? undefined} onClose={() => setSuccessMsg(null)} />
    </div>
  )
}

// ─── Stats Block ───────────────────────────────────────────────────────────────
function StatsBlock() {
  const stats = [
    { label: '本周发布', value: '6', icon: Send, color: '#14D1A0' },
    { label: '草稿', value: '3', icon: FileText, color: '#FFD23F' },
    { label: '绑定平台', value: '5', icon: Globe, color: '#2B59C3' },
    { label: '总曝光', value: '42.3k', icon: Eye, color: '#14D1A0' },
  ]
  return (
    <div
      className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-br from-[#0a1628] to-[#1a2744] p-4"
      style={{ gridColumn: 'span 3' }}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#14D1A0]/20">
          <BarChart2 className="h-4 w-4 text-[#14D1A0]" />
        </div>
        <span className="text-xs font-bold text-slate-300" style={{ fontFamily: 'monospace' }}>创作数据</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0a1628]/50 p-3">
            <p className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, monospace', color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#14D1A0]/20 px-3 py-2">
        <TrendingUp className="h-4 w-4 text-[#14D1A0]" />
        <span className="text-xs text-[#14D1A0]">本周曝光较上周 +23%</span>
      </div>
    </div>
  )
}

// ─── Featured Block ────────────────────────────────────────────────────────────
function FeaturedBlock({ item, onClick }: { item: typeof FEATURED_PACKAGE; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] active:scale-[0.98]"
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
          <h3 className="mb-2 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-600" style={{ fontFamily: 'Space Grotesk, monospace' }}>
            {item.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm text-slate-400">{item.subtitle}</p>

          <div className="mb-4 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-400">#{tag}</span>
            ))}
          </div>

          <div className="mb-4 space-y-1.5">
            {item.items.map((it) => (
              <div key={it} className="flex items-center gap-2 text-xs text-slate-400">
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
            <span className="text-sm text-slate-400">已售 {item.sales}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">¥{item.price}</span>
            {item.originalPrice > 0 && (
              <span className="text-sm text-slate-500 line-through">¥{item.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-emerald-600 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
            <span className="text-sm font-bold">查看详情</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </button>
  )
}

// ─── Draft Block ──────────────────────────────────────────────────────────────
function DraftBlock({ item, size, onClick }: { item: typeof DRAFTS[0]; size: 'md' | 'sm'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] active:scale-[0.98]"
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
        <h4 className="mb-1 line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-600" style={{ fontFamily: 'Space Grotesk, monospace' }}>
          {item.title}
        </h4>
        <div className="mb-2 flex flex-wrap gap-1">
          {item.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] text-slate-400">#{tag}</span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] pt-2.5">
          <span className="text-[10px] text-slate-500">{item.updatedAt}</span>
          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${item.status === '待发布' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
            {item.status}
          </span>
        </div>
      </div>
    </button>
  )
}

// ─── Platform Block ────────────────────────────────────────────────────────────
function PlatformBlock() {
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const { execute: executeAddPlatform } = useAction(
    async () => {
      // 正在打开「添加平台」配置面板（需接入平台API）
      return true
    },
    { onSuccess: () => setSuccessMsg(`平台配置面板即将打开...`), onError: (e) => console.error(e) }
  )

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4"
      style={{ gridColumn: 'span 2' }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, monospace' }}>已绑定平台</span>
        <button onClick={() => executeAddPlatform()} className="flex items-center gap-1 text-[10px] text-emerald-600 hover:text-emerald-500">
          <Plus className="h-3 w-3" /> 添加平台
        </button>
      </div>
      <div className="flex-1 flex flex-col justify-around">
        {PLATFORMS.map((p) => (
          <div key={p.id} className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden" style={{ backgroundColor: p.color + '22' }}>
                {p.connected ? (
                  <img src={p.icon} alt={p.name} className="h-5 w-5 object-cover" />
                ) : (
                  <Globe className="h-4 w-4 text-slate-500" />
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-900">{p.name}</p>
                <p className="text-[9px] text-slate-500">{p.followers} 粉丝</p>
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
      <ActionToast loading={false} error={null} success={successMsg ?? undefined} onClose={() => setSuccessMsg(null)} />
    </div>
  )
}

// ─── Tool Block ────────────────────────────────────────────────────────────────
function ToolBlock({ item, size, onClick }: { item: typeof TOOLS[0]; size: 'md' | 'sm'; onClick: () => void }) {
  const Icon = item.icon
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] active:scale-[0.98]"
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
        <h4 className="mb-1 text-sm font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, monospace' }}>{item.name}</h4>
        <p className="line-clamp-2 text-[10px] text-slate-500">{item.desc}</p>
      </div>
    </button>
  )
}

// ─── Schedule Block ──────────────────────────────────────────────────────────────
function ScheduleBlock() {
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const { execute: executeAddTask } = useAction(
    async () => {
      // 正在打开「新建发布任务」配置面板（需接入排期系统）
      return true
    },
    { onSuccess: () => setSuccessMsg(`新建任务面板即将打开...`), onError: (e) => console.error(e) }
  )

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4"
      style={{ gridColumn: 'span 2' }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, monospace' }}>发布排期</span>
        <button onClick={() => executeAddTask()} className="flex items-center gap-1 text-[10px] text-emerald-600 hover:text-emerald-500">
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
              <p className="truncate text-xs font-medium text-slate-900">{s.title}</p>
              <p className="text-[9px] text-slate-500">{s.platform} · {s.time}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${s.status === '待发布' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
              {s.status}
            </span>
          </div>
        ))}
      </div>
      <ActionToast loading={false} error={null} success={successMsg ?? undefined} onClose={() => setSuccessMsg(null)} />
    </div>
  )
}

// ─── Main CreationModule ──────────────────────────────────────────────────────
export default function CreationModule() {
  const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null)

  const getBlockContent = (block: Block) => {
    switch (block.type) {
      case 'stats':
        return <StatsBlock key={block.id} />
      case 'featured':
        return (
          <FeaturedBlock
            key={block.id}
            item={FEATURED_PACKAGE}
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
            onClick={() => setSelectedItem(d as unknown as Record<string, unknown>)}
          />
        )
      }
      case 'platform':
        return <PlatformBlock key={block.id} />
      case 'tool': {
        const idx = parseInt(block.id.split('-')[1])
        const t = TOOLS[idx % TOOLS.length]
        return (
          <ToolBlock
            key={block.id}
            item={t}
            size={block.size as 'md' | 'sm'}
            onClick={() => setSelectedItem(t as unknown as Record<string, unknown>)}
          />
        )
      }
      case 'schedule':
        return <ScheduleBlock key={block.id} />
      default:
        return null
    }
  }

  return (
    <div className="relative flex h-full flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-6 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
            <Layers className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, monospace' }}>创作中心</h1>
            <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>内容 · 价值包 · 平台 · 排期</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-sm font-bold tabular-nums text-slate-900" style={{ fontFamily: 'monospace' }}>{DRAFTS.length}</p>
            <p className="text-[10px] text-slate-500">草稿</p>
          </div>
          <div className="h-5 w-px bg-[rgba(255,255,255,0.08)]" />
          <div className="text-center">
            <p className="text-sm font-bold tabular-nums text-amber-500" style={{ fontFamily: 'monospace' }}>{PLATFORMS.filter(p => p.connected).length}</p>
            <p className="text-[10px] text-slate-500">平台</p>
          </div>
          <div className="h-5 w-px bg-[rgba(255,255,255,0.08)]" />
          <div className="text-center">
            <p className="text-sm font-bold tabular-nums text-emerald-600" style={{ fontFamily: 'monospace' }}>{SCHEDULE.filter(s => s.status === '待发布').length}</p>
            <p className="text-[10px] text-slate-500">待发布</p>
          </div>
        </div>
      </div>

      {/* Grid: 4列，左侧2列(特色) + 右侧2列(纵向堆叠) */}
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
