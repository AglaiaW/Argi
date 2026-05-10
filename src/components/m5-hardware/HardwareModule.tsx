'use client'

import { useState } from 'react'
import {
  Cpu, Server, Monitor, HardDrive, Zap, Star, Users,
  X, Clock, ArrowRight, Shield, CheckCircle2,
  ChevronRight, Activity, Database, Battery, Wifi,
  Package, TrendingUp, Calendar, AlertTriangle, Play
} from 'lucide-react'
import { useAction, ActionToast } from '@/hooks/useAction'

// ─── Block types ─────────────────────────────────────────────────────────────
type BlockSize = 'sm' | 'md' | 'lg' | 'xl'

interface Block {
  id: string
  type: 'featured' | 'gpu' | 'package' | 'my_device' | 'stats' | 'promo'
  size: BlockSize
}

// ─── 版型：硬件仪表盘 ──────────────────────────────────────────────────────
// Row 1：特色GPU(4列)
// Row 2：统计(2列) + GPU列表1(2列)
// Row 3：GPU列表2(2列) + 算力套餐(2列)
// Row 4：我的设备(2列) + 促销(2列)
const BLOCKS: Block[] = [
  // Row 1：特色GPU集群(4列，rowSpan2)
  { id: 'feat', type: 'featured', size: 'xl' },
  // Row 2
  { id: 'stats', type: 'stats', size: 'sm' },
  { id: 'gpu-0', type: 'gpu', size: 'md' },
  // Row 3
  { id: 'gpu-1', type: 'gpu', size: 'md' },
  { id: 'pkg-0', type: 'package', size: 'lg' },
  // Row 4
  { id: 'dev-0', type: 'my_device', size: 'lg' },
  { id: 'promo-0', type: 'promo', size: 'lg' },
]

// ─── Mock data ───────────────────────────────────────────────────────────────
const GPU_CLUSTERS = [
  {
    id: 'gpu1',
    name: 'NovaCloud H100 Farm',
    vendor: 'NovaCloud Tech',
    thumbnail: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80',
    location: 'Shanghai, CN',
    bandwidth: '100 Gbps',
    hbm: '80GB HBM3',
    uptime: '99.97%',
    pricePerHour: 12.99,
    tier: 'ELITE',
    tierColor: '#14D1A0',
    tags: ['H100', '大规模推理', '训练'],
    available: true,
  },
  {
    id: 'gpu2',
    name: 'EastCloud A100 Cluster',
    vendor: 'EastCloud',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    location: 'Beijing, CN',
    bandwidth: '40 Gbps',
    hbm: '40GB HBM2',
    uptime: '99.8%',
    pricePerHour: 8.99,
    tier: 'STANDARD',
    tierColor: '#2B59C3',
    tags: ['A100', '均衡之选'],
    available: true,
  },
]

const PACKAGES = [
  {
    id: 'pkg1',
    name: '创业版套餐',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    tokens: '500万tokens/月',
    price: 299,
    originalPrice: 0,
    features: ['GPT-4o / Claude-3.5', '优先推理通道', '50GB存储', 'API调用'],
    badge: '最受欢迎',
    badgeColor: '#14D1A0',
    models: '主流大模型全覆盖',
    isHot: true,
  },
  {
    id: 'pkg2',
    name: '基础推理套餐',
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80',
    tokens: '100万tokens/月',
    price: 99,
    originalPrice: 0,
    features: ['GPT-4o / Claude-3.5', '基础队列', '10GB存储'],
    badge: '',
    badgeColor: '',
    models: '基础模型支持',
    isHot: false,
  },
]

const MY_DEVICE = {
  id: 'dev1',
  name: '我的算力账户',
  usedTokens: 3420000,
  totalTokens: 5000000,
  daysLeft: 18,
  currentPlan: '创业版套餐',
  usagePercent: 68,
  nextBilling: '2026-06-01',
  activeAgents: 3,
}

const PROMO = {
  id: 'promo1',
  title: '学生/初创特惠',
  desc: '学生认证首月免费，初创企业首月5折',
  thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
  cta: '立即认证',
  color: '#FFD23F',
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function DetailPanel({ item, onClose }: { item: Record<string, unknown> | null; onClose: () => void }) {
  if (!item) return null

  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const { loading, error, execute: executeRent } = useAction(
    async () => {
      // 正在租用GPU集群（需接入计费系统）
      return true
    },
    { onSuccess: () => setSuccessMsg(`租用请求已提交！`), onError: (e) => console.error(e) }
  )

  const { execute: executeTrial } = useAction(
    async () => {
      // 正在申请试用资格（需企业认证）
      return true
    },
    { onSuccess: () => setSuccessMsg(`试用申请已提交！`), onError: (e) => console.error(e) }
  )

  const { execute: executeUpgrade } = useAction(
    async () => {
      // 正在升级套餐（需接入订阅系统）
      return true
    },
    { onSuccess: () => setSuccessMsg(`升级请求已提交！`), onError: (e) => console.error(e) }
  )

  return (
    <div className="absolute inset-y-0 right-0 z-20 flex flex-col border-l border-[rgba(255,255,255,0.08)] bg-white shadow-2xl w-[340px]">
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
        {item.tier && (
          <span className="mb-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold" style={{ backgroundColor: (item.tierColor as string) + '22', color: item.tierColor as string }}>
            <Server className="h-3 w-3" />{item.tier as string}
          </span>
        )}
        <h2 className="mb-2 text-lg font-bold text-slate-900 leading-snug" style={{ fontFamily: 'Space Grotesk, monospace' }}>
          {item.name as string}
        </h2>
        {item.vendor && (
          <p className="mb-3 text-sm text-slate-400">{item.vendor as string} · {item.location as string}</p>
        )}
        {item.tags && Array.isArray(item.tags) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {(item.tags as string[]).map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] text-slate-400">#{tag}</span>
            ))}
          </div>
        )}
        <div className="space-y-3">
          {item.hbm && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Cpu className="h-4 w-4" />{item.hbm as string}
            </div>
          )}
          {item.bandwidth && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Wifi className="h-4 w-4" />{item.bandwidth as string}
            </div>
          )}
          {item.uptime && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Activity className="h-4 w-4" />可用率 {item.uptime as string}
            </div>
          )}
          {item.pricePerHour !== undefined && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-2xl font-bold text-emerald-600">¥{item.pricePerHour as number}/小时</span>
            </div>
          )}
          {item.price !== undefined && item.price > 0 && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-2xl font-bold text-emerald-600">¥{item.price.toLocaleString()}</span>
              <span className="text-sm text-slate-500">/月</span>
            </div>
          )}
          {item.tokens && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Zap className="h-4 w-4 text-emerald-600" />{item.tokens as string}
            </div>
          )}
          {item.models && (
            <p className="text-xs text-slate-500">{item.models as string}</p>
          )}
        </div>
      </div>
      <div className="border-t border-[rgba(255,255,255,0.06)] p-4 space-y-2">
        {item.pricePerHour !== undefined ? (
          <>
            <button
              onClick={() => executeRent()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#14D1A0] py-3 text-sm font-bold text-[#010409] transition-all hover:bg-[#14D1A0]/90 active:scale-[0.98]"
            >
              <Play className="h-4 w-4" /> 立即租用
            </button>
            <button
              onClick={() => executeTrial()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-2.5 text-sm text-slate-400 transition-all hover:border-slate-300 active:scale-[0.98]"
            >
              <Shield className="h-4 w-4" /> 申请试用
            </button>
          </>
        ) : (
          <button
            onClick={() => executeUpgrade()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#14D1A0] py-3 text-sm font-bold text-[#010409] transition-all hover:bg-[#14D1A0]/90 active:scale-[0.98]"
          >
            <ArrowRight className="h-4 w-4" /> 升级套餐
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
    { label: '活跃节点', value: '3,847', icon: Server, color: '#14D1A0' },
    { label: 'GPU集群', value: '1,204', icon: Cpu, color: '#2B59C3' },
    { label: '可用率', value: '99.97%', icon: Activity, color: '#FFD23F' },
    { label: '在线用户', value: '12.4k', icon: Users, color: '#14D1A0' },
  ]
  return (
    <div
      className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-br from-[#0a1628] to-[#1a2744] p-5"
      style={{ gridColumn: 'span 2', gridRow: 'span 1' }}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2B59C3]/20">
          <HardDrive className="h-4 w-4 text-[#2B59C3]" />
        </div>
        <span className="text-xs font-bold text-slate-300" style={{ fontFamily: 'monospace' }}>算力数据</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0a1628]/50 p-3">
            <p className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, monospace', color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#2B59C3]/20 px-3 py-2">
        <Shield className="h-4 w-4 text-[#2B59C3]" />
        <span className="text-xs text-[#2B59C3]">企业级安全保障 · 7×24运维</span>
      </div>
    </div>
  )
}

// ─── Featured GPU Block ─────────────────────────────────────────────────────────
function FeaturedBlock({ item, onClick }: { item: typeof GPU_CLUSTERS[0]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] active:scale-[0.99]"
      style={{ gridColumn: 'span 4', gridRow: 'span 2' }}
    >
      <div className="relative w-3/5 shrink-0 overflow-hidden">
        <img src={item.thumbnail} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1628]" />
        <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold" style={{ backgroundColor: item.tierColor + '22', color: item.tierColor }}>
          <Server className="h-3 w-3" />{item.tier}
        </div>
        {item.available && (
          <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-[#14D1A0]/20 backdrop-blur-sm px-3 py-1">
            <div className="h-2 w-2 rounded-full bg-[#14D1A0]" />
            <span className="text-[10px] font-bold text-emerald-600">可用</span>
          </div>
        )}
      </div>

      <div className="flex w-2/5 flex-col justify-between p-6 text-left">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-[#2B59C3]/20 px-3 py-1 text-[10px] font-bold text-[#2B59C3]">{item.vendor}</span>
            <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-2.5 py-1 text-[10px] text-slate-400">{item.location}</span>
          </div>
          <h3 className="mb-2 text-xl font-bold leading-snug text-white transition-colors group-hover:text-[#14D1A0]" style={{ fontFamily: 'Space Grotesk, monospace' }}>
            {item.name}
          </h3>

          <div className="mb-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628]/60 p-2.5">
              <p className="text-[10px] text-slate-400">显存</p>
              <p className="text-xs font-bold text-white">{item.hbm}</p>
            </div>
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628]/60 p-2.5">
              <p className="text-[10px] text-slate-400">带宽</p>
              <p className="text-xs font-bold text-white">{item.bandwidth}</p>
            </div>
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628]/60 p-2.5">
              <p className="text-[10px] text-slate-400">可用率</p>
              <p className="text-xs font-bold text-[#14D1A0]">{item.uptime}</p>
            </div>
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628]/60 p-2.5">
              <p className="text-[10px] text-slate-400">计费</p>
              <p className="text-xs font-bold text-white">¥{item.pricePerHour}/h</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-400">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-emerald-600">¥{item.pricePerHour}</span>
            <span className="text-sm text-slate-500">/小时</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
            <span className="text-sm font-bold">租用</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </button>
  )
}

// ─── GPU Block ──────────────────────────────────────────────────────────────────
function GPUBlock({ item, size, onClick }: { item: typeof GPU_CLUSTERS[0]; size: 'md' | 'sm'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] active:scale-[0.98]"
      style={{ gridColumn: size === 'md' ? 'span 2' : 'span 1' }}
    >
      <div className="relative overflow-hidden" style={{ height: size === 'md' ? '90px' : '60px' }}>
        <img src={item.thumbnail} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 to-transparent" />
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ backgroundColor: item.tierColor + '22', color: item.tierColor }}>
          {item.tier}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h4 className="mb-1 line-clamp-1 text-sm font-bold text-slate-900 transition-colors group-hover:text-emerald-600" style={{ fontFamily: 'Space Grotesk, monospace' }}>
          {item.name}
        </h4>
        <p className="mb-2 text-[10px] text-slate-500">{item.vendor} · {item.location}</p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500">{item.hbm}</span>
          </div>
          <span className="text-sm font-bold text-emerald-600">¥{item.pricePerHour}/h</span>
        </div>
      </div>
    </button>
  )
}

// ─── Package Block ──────────────────────────────────────────────────────────────
function PackageBlock({ item, size, onClick }: { item: typeof PACKAGES[0]; size: 'md' | 'lg'; onClick: () => void }) {
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const { execute: executeSubscribe } = useAction(
    async () => {
      // 正在订阅套餐（需接入支付系统）
      return true
    },
    { onSuccess: () => setSuccessMsg(`订阅成功！`), onError: (e) => console.error(e) }
  )

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] active:scale-[0.98]"
      style={{ gridColumn: 'span 2' }}
    >
      <div className="relative overflow-hidden" style={{ height: '80px' }}>
        <img src={item.thumbnail} alt={item.name} className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent" />
        {item.badge && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold" style={{ backgroundColor: item.badgeColor, color: '#010409' }}>
            <Zap className="h-3 w-3" />{item.badge}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h4 className="mb-1 text-sm font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, monospace' }}>{item.name}</h4>
        <p className="mb-2 text-[10px] text-slate-400">{item.tokens} · {item.models}</p>

        <div className="mb-2 flex flex-wrap gap-1">
          {item.features.slice(0, 2).map((f) => (
            <span key={f} className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] text-slate-400">{f}</span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[rgba(255,255,255,0.04)] pt-2.5">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-emerald-600">¥{item.price}</span>
            <span className="text-[10px] text-slate-500">/月</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); executeSubscribe() }}
            className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            立即订阅
          </button>
        </div>
      </div>
      <ActionToast loading={false} error={null} success={successMsg ?? undefined} onClose={() => setSuccessMsg(null)} />
    </button>
  )
}

// ─── My Device Block ───────────────────────────────────────────────────────────
function MyDeviceBlock() {
  const pct = MY_DEVICE.usagePercent
  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-br from-[#0a1628] to-[#1a2744] p-4"
      style={{ gridColumn: 'span 2', gridRow: 'span 1' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#14D1A0]/20">
            <Database className="h-4 w-4 text-[#14D1A0]" />
          </div>
          <span className="text-sm font-bold text-white" style={{ fontFamily: 'Space Grotesk, monospace' }}>我的算力</span>
        </div>
        <span className="rounded-full bg-[#2B59C3]/20 px-2.5 py-1 text-[10px] font-bold text-[#2B59C3]">
          {MY_DEVICE.currentPlan}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-[10px] text-slate-400">
          <span>已用 {(MY_DEVICE.usedTokens / 10000).toFixed(0)}万 / {MY_DEVICE.totalTokens / 10000}万 tokens</span>
          <span style={{ color: pct > 80 ? '#FF6B6B' : '#14D1A0' }}>{pct}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#0a1628]/50">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: pct > 80 ? '#FF6B6B' : '#14D1A0' }}
          />
        </div>
        {pct > 80 && (
          <div className="mt-1 flex items-center gap-1 text-[9px] text-red-400">
            <AlertTriangle className="h-3 w-3" />用量即将达上限，建议升级套餐
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0a1628]/50 p-2.5 text-center">
          <p className="text-sm font-bold text-white" style={{ fontFamily: 'monospace' }}>{MY_DEVICE.daysLeft}</p>
          <p className="text-[9px] text-slate-400">剩余天数</p>
        </div>
        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0a1628]/50 p-2.5 text-center">
          <p className="text-sm font-bold text-white" style={{ fontFamily: 'monospace' }}>{MY_DEVICE.activeAgents}</p>
          <p className="text-[9px] text-slate-400">在线Agent</p>
        </div>
        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0a1628]/50 p-2.5 text-center">
          <p className="text-xs font-bold text-white" style={{ fontFamily: 'monospace' }}>{MY_DEVICE.nextBilling}</p>
          <p className="text-[9px] text-slate-400">下次账单日</p>
        </div>
      </div>
    </div>
  )
}

// ─── Promo Block ────────────────────────────────────────────────────────────────
function PromoBlock({ onCtaClick }: { onCtaClick: () => void }) {
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const { execute } = useAction(
    async () => {
      // 正在认证「学生/初创特惠」资格（需上传资质证明）
      return true
    },
    { onSuccess: () => { setSuccessMsg(`认证申请已提交！`); onCtaClick() }, onError: (e) => console.error(e) }
  )

  return (
    <button
      onClick={() => execute()}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 p-4 transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] active:scale-[0.98]"
      style={{ gridColumn: 'span 2', gridRow: 'span 1' }}
    >
      <div className="absolute right-3 top-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: PROMO.color + '22' }}>
          <Zap className="h-6 w-6" style={{ color: PROMO.color }} />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="mb-1 text-sm font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, monospace' }}>{PROMO.title}</h4>
        <p className="line-clamp-2 text-xs text-slate-400">{PROMO.desc}</p>
      </div>
      <div className="mt-3 flex items-center gap-1 text-sm font-bold" style={{ color: PROMO.color }}>
        <span>{PROMO.cta}</span>
        <ChevronRight className="h-4 w-4" />
      </div>
      <ActionToast loading={false} error={null} success={successMsg ?? undefined} onClose={() => setSuccessMsg(null)} />
    </button>
  )
}

// ─── Main HardwareModule ────────────────────────────────────────────────────────
export default function HardwareModule() {
  const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null)

  const getBlockContent = (block: Block) => {
    switch (block.type) {
      case 'stats':
        return <StatsBlock key={block.id} />
      case 'featured':
        return (
          <FeaturedBlock
            key={block.id}
            item={GPU_CLUSTERS[0]}
            onClick={() => setSelectedItem(GPU_CLUSTERS[0] as unknown as Record<string, unknown>)}
          />
        )
      case 'gpu': {
        const idx = parseInt(block.id.split('-')[1])
        const gpu = GPU_CLUSTERS[idx % GPU_CLUSTERS.length]
        return (
          <GPUBlock
            key={block.id}
            item={gpu}
            size={block.size as 'md' | 'sm'}
            onClick={() => setSelectedItem(gpu as unknown as Record<string, unknown>)}
          />
        )
      }
      case 'package': {
        const idx = parseInt(block.id.split('-')[1])
        const pkg = PACKAGES[idx % PACKAGES.length]
        return (
          <PackageBlock
            key={block.id}
            item={pkg}
            size={block.size as 'md' | 'lg'}
            onClick={() => setSelectedItem(pkg as unknown as Record<string, unknown>)}
          />
        )
      }
      case 'my_device':
        return <MyDeviceBlock key={block.id} />
      case 'promo':
        return <PromoBlock key={block.id} onCtaClick={() => {}} />
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
            <Server className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, monospace' }}>硬件生态</h1>
            <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>GPU集群 · 算力商店 · 订阅管理</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-sm font-bold tabular-nums text-slate-900" style={{ fontFamily: 'monospace' }}>3,847</p>
            <p className="text-[10px] text-slate-500">活跃节点</p>
          </div>
          <div className="h-5 w-px bg-[rgba(255,255,255,0.08)]" />
          <div className="text-center">
            <p className="text-sm font-bold tabular-nums text-blue-600" style={{ fontFamily: 'monospace' }}>1,204</p>
            <p className="text-[10px] text-slate-500">GPU集群</p>
          </div>
          <div className="h-5 w-px bg-[rgba(255,255,255,0.08)]" />
          <div className="text-center">
            <p className="text-sm font-bold tabular-nums text-amber-500" style={{ fontFamily: 'monospace' }}>99.97%</p>
            <p className="text-[10px] text-slate-500">可用率</p>
          </div>
        </div>
      </div>

      {/* Grid: 4列，硬件仪表盘版型 */}
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
