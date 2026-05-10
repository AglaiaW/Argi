'use client'

import { useState } from 'react'
import {
  Store, Users, Cpu, Coins, TrendingUp,
  X, Star, Zap, Eye, Shield,
  ArrowRight, ShoppingCart, Heart, ExternalLink, CheckCircle2,
  ChevronRight, MessageSquare, Play, AlertCircle, Package
} from 'lucide-react'
import { useAction, ActionToast } from '@/hooks/useAction'

// ─── Block types ─────────────────────────────────────────────────────────────
type BlockSize = 'sm' | 'md' | 'lg' | 'xl'

interface Block {
  id: string
  type: 'featured' | 'digital_human' | 'case' | 'hardware' | 'compute' | 'stats'
  size: BlockSize
}

// ─── 版型：数字人画廊 + 横向滚动 ─────────────────────────────────────────────
// 顶行：特色数字人(4列) + 统计(2列)
// 底行：数字人×2(各2列) + 行业案例(2列)
// 第三行：硬件商(3列) + 算力通证(3列)
const BLOCKS: Block[] = [
  // 顶行
  { id: 'feat', type: 'featured', size: 'xl' },
  { id: 'stats', type: 'stats', size: 'sm' },
  // 底行
  { id: 'dh-0', type: 'digital_human', size: 'md' },
  { id: 'dh-1', type: 'digital_human', size: 'md' },
  { id: 'case-0', type: 'case', size: 'md' },
  { id: 'case-1', type: 'case', size: 'sm' },
  // 第三行
  { id: 'hw-0', type: 'hardware', size: 'sm' },
  { id: 'hw-1', type: 'hardware', size: 'sm' },
  { id: 'comp-0', type: 'compute', size: 'md' },
  { id: 'comp-1', type: 'compute', size: 'md' },
]

// ─── Mock data ───────────────────────────────────────────────────────────────
const DIGITAL_HUMANS = [
  {
    id: 'dh1',
    name: '智能客服数字人·小雅',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
    category: '零售客服',
    price: 2999,
    originalPrice: 4999,
    rating: 4.9,
    sales: 1247,
   试用次数: '3次免费',
    tags: ['7×24在线', '多轮对话', '情绪识别'],
    isNew: false,
    isHot: true,
    description: '基于大模型的新一代智能客服，可接入网站、APP、微信等多渠道，平均响应时间<1秒',
  },
  {
    id: 'dh2',
    name: '直播带货数字人·小蓝',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    category: '直播主播',
    price: 5999,
    originalPrice: 8999,
    rating: 4.8,
    sales: 834,
   试用次数: '3次免费',
    tags: ['实时互动', '商品推荐', '弹幕回复'],
    isNew: true,
    isHot: false,
    description: '支持抖音、快手、淘宝直播等多平台，AI实时生成话术，24小时不间断直播',
  },
]

const CASES = [
  {
    id: 'case1',
    title: '某头部电商平台智能客服升级案例',
    industry: '零售电商',
    scenario: '智能客服',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    company: '某头部电商',
    effect: '人工客服成本降低 67%，响应速度提升 300%',
    product: '智能客服数字人·小雅',
    views: '12.4k',
    likes: 342,
    description: '接入数字人客服后，实现7×24小时全天候服务，智能识别用户意图并精准回复',
  },
  {
    id: 'case2',
    title: '连锁餐饮品牌直播数字人落地案例',
    industry: '餐饮连锁',
    scenario: '直播主播',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
    company: '某知名连锁餐饮',
    effect: '直播时长延长至24小时，GMV提升 45%',
    product: '直播带货数字人·小蓝',
    views: '8.7k',
    likes: 218,
    description: '数字人主播接管非黄金时段直播，保持品牌曝光持续性，大幅降低人力成本',
  },
]

const HARDWARE = [
  {
    id: 'hw1',
    name: 'NVIDIA Jetson AGX Orin',
    category: '边缘计算',
    thumbnail: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80',
    priceRange: '¥8,000-12,000',
    tops: '275 TOPS',
    adapter: '客服/巡检/导览',
    vendor: '英伟达官方',
    isVerified: true,
  },
  {
    id: 'hw2',
    name: '华为昇腾 Atlas 200DK',
    category: 'AI加速卡',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    priceRange: '¥5,000-8,000',
    tops: '88 TOPS',
    adapter: '图像识别/推理',
    vendor: '华为云',
    isVerified: true,
  },
]

const COMPUTE_PACKAGES = [
  {
    id: 'comp1',
    name: '创业版套餐',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    tokens: '500万tokens/月',
    models: 'GPT-4o / Claude-3.5 / 国产主流模型',
    price: 299,
    originalPrice: 0,
    features: ['优先推理通道', '50GB存储', 'API调用'],
    badge: '推荐',
    isHot: true,
  },
  {
    id: 'comp2',
    name: '企业版套餐',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
    tokens: '5000万tokens/月',
    models: 'GPT-4o / Claude-3.5 / 国产主流模型',
    price: 1999,
    originalPrice: 0,
    features: ['独享推理通道', '1TB存储', 'SLA保障', '专属客服'],
    badge: '',
    isHot: false,
  },
]

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function DetailPanel({ item, onClose }: { item: Record<string, unknown> | null; onClose: () => void }) {
  if (!item) return null

  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const { loading, error, execute: executePurchase } = useAction(
    async () => {
      // 即将购买（需接入支付API）
      return true
    },
    { onSuccess: () => setSuccessMsg(`购买成功！`), onError: (e) => console.error(e) }
  )

  const { execute: executeTrial } = useAction(
    async () => {
      // 即将申请免费试用（需接入试用API）
      return true
    },
    { onSuccess: () => setSuccessMsg(`试用申请已提交！`), onError: (e) => console.error(e) }
  )

  const { execute: executeViewPlan } = useAction(
    async () => {
      // 即将跳转到套餐详情页（需接入路由）
      return true
    },
    { onSuccess: () => setSuccessMsg(`正在跳转套餐详情...`), onError: (e) => console.error(e) }
  )

  return (
    <div className="absolute inset-y-0 right-0 z-20 flex flex-col border-l border-[rgba(255,255,255,0.08)] bg-white shadow-2xl w-[340px]">
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-5 py-4">
        <span className="text-xs font-medium text-slate-500" style={{ fontFamily: 'monospace' }}>商品详情</span>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
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
          {item.isHot && <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-500">热门</span>}
          {item.isNew && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">新品</span>}
        </div>
        <h2 className="mb-2 text-lg font-bold text-slate-900 leading-snug" style={{ fontFamily: 'Space Grotesk, monospace' }}>
          {item.name as string}
        </h2>
        {item.description && (
          <p className="mb-3 text-sm text-slate-400">{item.description as string}</p>
        )}
        {item.tags && Array.isArray(item.tags) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {(item.tags as string[]).map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] text-slate-400">
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
              {item.sales && <span className="text-xs text-slate-500">已售 {item.sales as number} 件</span>}
            </div>
          )}
          {item.priceRange && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Coins className="h-4 w-4" />
              <span>{item.priceRange as string}</span>
            </div>
          )}
          {item.tops && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Cpu className="h-4 w-4" />
              <span>{item.tops as string} 算力</span>
            </div>
          )}
          {item.effect && (
            <div className="flex items-start gap-2 rounded-xl bg-emerald-50 p-3">
              <TrendingUp className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              <p className="text-sm text-emerald-600">{item.effect as string}</p>
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
        {item.price !== undefined && item.price > 0 ? (
          <>
            <button onClick={() => executePurchase()} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#14D1A0] py-3 text-sm font-bold text-[#010409] transition-all hover:bg-[#14D1A0]/90 active:scale-[0.98]">
              <ShoppingCart className="h-4 w-4" /> 立即购买
            </button>
            <button onClick={() => executeTrial()} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(255,255,255,0.08)] py-2.5 text-sm text-slate-400 transition-all hover:border-[rgba(255,255,255,0.15)]">
              <Play className="h-4 w-4" /> {item.试用次数 as string || '免费试用3次'}
            </button>
          </>
        ) : (
          <button onClick={() => executeViewPlan()} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#14D1A0] py-3 text-sm font-bold text-[#010409] transition-all hover:bg-[#14D1A0]/90">
            <ArrowRight className="h-4 w-4" /> 查看套餐详情
          </button>
        )}
      </div>
      <ActionToast loading={loading} error={error} success={successMsg ?? undefined} onClose={() => setSuccessMsg(null)} />
    </div>
  )
}

// ─── Stats Block ───────────────────────────────────────────────────────────────
function StatsBlock() {
  const stats = [
    { label: 'Agent总数', value: '2,847', icon: Package, color: '#14D1A0' },
    { label: '数字人', value: '1,204', icon: Users, color: '#2B59C3' },
    { label: '硬件商', value: '156', icon: Cpu, color: '#FFD23F' },
    { label: '算力商', value: '89', icon: Coins, color: '#14D1A0' },
  ]
  return (
    <div
      className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-br from-[#0a1628] to-[#1a2744] p-4"
      style={{ gridColumn: 'span 1' }}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2B59C3]/20">
          <Store className="h-4 w-4 text-blue-400" />
        </div>
        <span className="text-xs font-bold text-slate-400" style={{ fontFamily: 'monospace' }}>市场数据</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0a1628]/50 p-3">
              <p className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, monospace', color: s.color }}>{s.value}</p>
              <p className="text-[10px] text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2">
        <Shield className="h-4 w-4 text-blue-600" />
        <span className="text-xs text-blue-600">7天无理由退款 · 交易保障</span>
      </div>
    </div>
  )
}

// ─── Featured Agent Block ──────────────────────────────────────────────────────
function FeaturedBlock({ agent, onClick }: { agent: typeof DIGITAL_HUMANS[0]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] active:scale-[0.98]"
      style={{ gridColumn: 'span 4', gridRow: 'span 2' }}
    >
      {/* 全宽图片背景 */}
      <div className="relative flex-1 overflow-hidden">
        <img
          src={agent.avatar}
          alt={agent.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-transparent" />
        {agent.isHot && (
          <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-[#FF6B6B] px-3 py-1">
            <Zap className="h-3 w-3 text-slate-900" />
            <span className="text-[10px] font-bold text-slate-900">热门爆款</span>
          </div>
        )}
      </div>

      {/* Content overlay bottom */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-between p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600">{agent.category}</span>
          <span className="rounded-full border border-slate-100 bg-slate-100 backdrop-blur-sm px-2.5 py-1 text-[10px] text-slate-900">数字人</span>
        </div>
        <div>
          <h3 className="mb-1 text-xl font-bold leading-snug text-slate-900 drop-shadow-lg" style={{ fontFamily: 'Space Grotesk, monospace' }}>
            {agent.name}
          </h3>
          <p className="mb-3 line-clamp-1 text-xs text-slate-900/70">{agent.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#FFD23F] text-amber-500" />
                <span className="text-sm font-bold text-amber-500">{agent.rating}</span>
              </div>
              <span className="text-xs text-slate-900/60">已售 {agent.sales.toLocaleString()}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-600">¥{agent.price.toLocaleString()}</span>
              {agent.originalPrice > 0 && <span className="text-sm text-slate-900/50 line-through">¥{agent.originalPrice}</span>}
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

// ─── Digital Human Block ────────────────────────────────────────────────────────
function DigitalHumanBlock({ agent, size, onClick }: { agent: typeof DIGITAL_HUMANS[0]; size: 'md' | 'sm'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] active:scale-[0.98]"
      style={{ gridColumn: 'span 2' }}
    >
      <div className="relative overflow-hidden" style={{ height: size === 'md' ? '110px' : '70px' }}>
        <img src={item.avatar} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 to-transparent" />
        {item.isHot && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-[#FF6B6B] px-2 py-0.5">
            <Zap className="h-2.5 w-2.5 text-slate-900" />
            <span className="text-[9px] font-bold text-slate-900">热门</span>
          </div>
        )}
        {item.isNew && (
          <div className="absolute left-2 top-2 flex items-center rounded-full bg-[#14D1A0] px-2 py-0.5">
            <span className="text-[9px] font-bold text-black">新品</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="mb-1 flex items-center gap-1.5">
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-medium text-blue-600">{item.category}</span>
        </div>
        <h4 className="mb-1 line-clamp-1 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-600" style={{ fontFamily: 'Space Grotesk, monospace' }}>
          {item.name}
        </h4>
        <p className="mb-2 line-clamp-2 text-[10px] text-slate-500">{item.description}</p>

        <div className="mt-auto flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] pt-2.5">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-[#FFD23F] text-amber-500" />
            <span className="text-[10px] font-bold text-amber-500">{item.rating}</span>
          </div>
          <span className="text-sm font-bold text-emerald-600">¥{item.price.toLocaleString()}</span>
        </div>
      </div>
    </button>
  )
}

// ─── Case Block ────────────────────────────────────────────────────────────────
function CaseBlock({ item, size, onClick }: { item: typeof CASES[0]; size: 'md' | 'lg'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] active:scale-[0.98]"
      style={{ gridColumn: size === 'lg' ? 'span 3' : 'span 1' }}
    >
      <div className="relative overflow-hidden" style={{ height: size === 'lg' ? '100px' : '70px' }}>
        <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/30 to-transparent" />
        <div className="absolute bottom-2 left-3">
          <span className="rounded-full bg-[#2B59C3]/20 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-blue-600">
            {item.industry} · {item.scenario}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h4 className="mb-1 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-600" style={{ fontFamily: 'Space Grotesk, monospace' }}>
          {item.title}
        </h4>
        <p className="mb-2 line-clamp-1 text-[10px] text-slate-400">{item.company} · {item.description}</p>

        <div className="mt-auto flex items-start gap-2 rounded-xl bg-emerald-50 p-2.5">
          <TrendingUp className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
          <p className="text-[10px] text-emerald-600">{item.effect}</p>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] pt-2">
          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{item.views}</span>
            <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{item.likes}</span>
          </div>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">查看方案</span>
        </div>
      </div>
    </button>
  )
}

// ─── Hardware Block ─────────────────────────────────────────────────────────────
function HardwareBlock({ item, size, onClick }: { item: typeof HARDWARE[0]; size: 'md' | 'sm'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] active:scale-[0.98]"
      style={{ gridColumn: 'span 3' }}
    >
      <div className="relative overflow-hidden" style={{ height: '80px' }}>
        <img src={item.thumbnail} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 to-transparent" />
        {item.isVerified && (
          <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#14D1A0]">
            <CheckCircle2 className="h-3 w-3 text-[#010409]" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h4 className="mb-1 line-clamp-1 text-sm font-bold text-slate-900 transition-colors group-hover:text-emerald-600" style={{ fontFamily: 'Space Grotesk, monospace' }}>
          {item.name}
        </h4>
        <p className="mb-2 text-[10px] text-slate-500">{item.vendor} · {item.tops}</p>

        <div className="mt-auto flex items-center justify-between">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] text-slate-400">{item.category}</span>
          <span className="text-xs font-bold text-emerald-600">{item.priceRange}</span>
        </div>
      </div>
    </button>
  )
}

// ─── Compute Block ──────────────────────────────────────────────────────────────
function ComputeBlock({ item, onClick }: { item: typeof COMPUTE_PACKAGES[0]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] active:scale-[0.98]"
      style={{ gridColumn: 'span 3' }}
    >
      <div className="relative overflow-hidden" style={{ height: '80px' }}>
        <img src={item.thumbnail} alt={item.name} className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent" />
        {item.badge && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#14D1A0] px-3 py-1">
            <Zap className="h-3 w-3 text-black" />
            <span className="text-[10px] font-bold text-black">{item.badge}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h4 className="mb-1 text-sm font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, monospace' }}>{item.name}</h4>
        <p className="mb-2 text-[10px] text-slate-400">{item.tokens} · {item.models.split('/')[0]}</p>

        <div className="mb-2 flex flex-wrap gap-1">
          {item.features.map((f) => (
            <span key={f} className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] text-slate-400">{f}</span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] pt-2.5">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-emerald-600">¥{item.price}</span>
            <span className="text-[10px] text-slate-500">/月</span>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">立即订阅</span>
        </div>
      </div>
    </button>
  )
}

// ─── Main AgentMarketModule ────────────────────────────────────────────────────
export default function AgentMarketModule() {
  const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null)

  const getBlockContent = (block: Block) => {
    switch (block.type) {
      case 'stats':
        return <StatsBlock key={block.id} />
      case 'featured':
        return (
          <FeaturedBlock
            key={block.id}
            agent={DIGITAL_HUMANS[0]}
            onClick={() => setSelectedItem(DIGITAL_HUMANS[0] as unknown as Record<string, unknown>)}
          />
        )
      case 'digital_human': {
        const idx = parseInt(block.id.split('-')[1])
        const dh = DIGITAL_HUMANS[idx % DIGITAL_HUMANS.length]
        return (
          <DigitalHumanBlock
            key={block.id}
            agent={dh}
            size={block.size as 'md' | 'sm'}
            onClick={() => setSelectedItem(dh as unknown as Record<string, unknown>)}
          />
        )
      }
      case 'case': {
        const idx = parseInt(block.id.split('-')[1])
        const c = CASES[idx % CASES.length]
        return (
          <CaseBlock
            key={block.id}
            item={c}
            size={block.size as 'md' | 'lg'}
            onClick={() => setSelectedItem(c as unknown as Record<string, unknown>)}
          />
        )
      }
      case 'hardware': {
        const idx = parseInt(block.id.split('-')[1])
        const hw = HARDWARE[idx % HARDWARE.length]
        return (
          <HardwareBlock
            key={block.id}
            item={hw}
            size={block.size as 'md' | 'sm'}
            onClick={() => setSelectedItem(hw as unknown as Record<string, unknown>)}
          />
        )
      }
      case 'compute': {
        const idx = parseInt(block.id.split('-')[1])
        const comp = COMPUTE_PACKAGES[idx % COMPUTE_PACKAGES.length]
        return (
          <ComputeBlock
            key={block.id}
            item={comp}
            onClick={() => setSelectedItem(comp as unknown as Record<string, unknown>)}
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
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
            <Store className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, monospace' }}>AGENT 市场</h1>
            <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>数字人 · 案例 · 硬件 · 算力通证</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-sm font-bold tabular-nums text-slate-900" style={{ fontFamily: 'monospace' }}>2,847</p>
            <p className="text-[10px] text-slate-500">Agent</p>
          </div>
          <div className="h-5 w-px bg-[rgba(255,255,255,0.08)]" />
          <div className="text-center">
            <p className="text-sm font-bold tabular-nums text-blue-600" style={{ fontFamily: 'monospace' }}>1,204</p>
            <p className="text-[10px] text-slate-500">数字人</p>
          </div>
          <div className="h-5 w-px bg-[rgba(255,255,255,0.08)]" />
          <div className="text-center">
            <p className="text-sm font-bold tabular-nums text-amber-500" style={{ fontFamily: 'monospace' }}>156</p>
            <p className="text-[10px] text-slate-500">算力商</p>
          </div>
        </div>
      </div>

      {/* Grid: 6列，差异化版型 */}
      <div className="relative flex-1 overflow-auto p-4">
        <div
          className="grid min-h-full gap-3"
          style={{ gridTemplateColumns: 'repeat(6, 1fr)', gridAutoRows: '160px' }}
        >
          {BLOCKS.map(getBlockContent)}
        </div>
        {selectedItem && <DetailPanel item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </div>
    </div>
  )
}
