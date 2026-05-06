'use client'

import { useState } from 'react'
import {
  Gift,
  TrendingUp,
  Users,
  Star,
  Check,
  Tag,
  Zap,
  Crown,
  BookOpen,
  FileText,
  Wrench,
  Shield,
} from 'lucide-react'
import type { ValuePack } from './mockData'
import { MOCK_VALUE_PACKS } from './mockData'

const CATEGORY_ICONS: Record<ValuePack['category'], React.ReactNode> = {
  course: <BookOpen className="h-4 w-4" />,
  template: <FileText className="h-4 w-4" />,
  ebook: <FileText className="h-4 w-4" />,
  service: <Wrench className="h-4 w-4" />,
  software: <Zap className="h-4 w-4" />,
  membership: <Crown className="h-4 w-4" />,
}

const CATEGORY_LABELS: Record<ValuePack['category'], string> = {
  course: '课程',
  template: '模板',
  ebook: '电子书',
  service: '服务',
  software: '软件',
  membership: '会员',
}

interface ValuePackagingProps {
  packs?: ValuePack[]
  onEdit?: (id: string) => void
  onDuplicate?: (id: string) => void
}

export default function ValuePackaging({ packs = MOCK_VALUE_PACKS, onEdit, onDuplicate }: ValuePackagingProps) {
  const [selected, setSelected] = useState<ValuePack | null>(null)
  const [activeCategory, setActiveCategory] = useState<ValuePack['category'] | 'all'>('all')
  const [sortBy, setSortBy] = useState<'conversionRate' | 'enrolled' | 'price' | 'rating'>('conversionRate')

  const filtered = packs
    .filter((p) => activeCategory === 'all' || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'conversionRate') return b.conversionRate - a.conversionRate
      if (sortBy === 'enrolled') return b.enrolled - a.enrolled
      if (sortBy === 'rating') return b.rating - a.rating
      return b.price - a.price
    })

  const totalEnrolled = packs.reduce((s, p) => s + p.enrolled, 0)
  const avgConversion = packs.reduce((s, p) => s + p.conversionRate, 0) / packs.length
  const avgRating = packs.reduce((s, p) => s + p.rating, 0) / packs.length

  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,23,42,0.85)] p-5 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-[#14D1A0]" />
          <h2 className="text-base font-semibold text-white" style={{ fontFamily: 'monospace' }}>
            价值包装
          </h2>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500" style={{ fontFamily: 'monospace' }}>排序：</span>
          {(['conversionRate', 'enrolled', 'rating'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`rounded-md px-2 py-1 text-[10px] font-medium transition ${
                sortBy === s
                  ? 'bg-[#14D1A0]/20 text-[#14D1A0]'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={{ fontFamily: 'monospace' }}
            >
              {s === 'conversionRate' ? '转化率' : s === 'enrolled' ? '销量' : '评分'}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
            activeCategory === 'all'
              ? 'bg-[#14D1A0]/20 text-[#14D1A0]'
              : 'bg-[rgba(255,255,255,0.05)] text-slate-400 hover:text-white'
          }`}
          style={{ fontFamily: 'monospace' }}
        >
          <Tag className="h-3 w-3" /> 全部
        </button>
        {(Object.keys(CATEGORY_LABELS) as ValuePack['category'][]).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
              activeCategory === cat
                ? 'bg-[#14D1A0]/20 text-[#14D1A0]'
                : 'bg-[rgba(255,255,255,0.05)] text-slate-400 hover:text-white'
            }`}
            style={{ fontFamily: 'monospace' }}
          >
            {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Pack Cards */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-3">
          {filtered.map((pack) => (
            <div
              key={pack.id}
              onClick={() => setSelected(pack)}
              className={`group cursor-pointer rounded-xl border p-4 transition ${
                selected?.id === pack.id
                  ? 'border-[#14D1A0]/60 bg-[#14D1A0]/5'
                  : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.16)]'
              }`}
            >
              <div className="flex gap-3">
                {/* Thumbnail */}
                {pack.thumbnail ? (
                  <div className="h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                    <img src={pack.thumbnail} alt={pack.name} className="h-full w-full object-cover opacity-80" />
                  </div>
                ) : (
                  <div className="flex h-20 w-32 flex-shrink-0 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.05)]">
                    {CATEGORY_ICONS[pack.category]}
                  </div>
                )}

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1 rounded bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-[10px] text-slate-400`}>
                          {CATEGORY_ICONS[pack.category]}
                          {CATEGORY_LABELS[pack.category]}
                        </span>
                        {pack.originalPrice && (
                          <span className="rounded bg-rose-900/40 px-1 py-0.5 text-[10px] text-rose-400">
                            -{Math.round((1 - pack.price / pack.originalPrice) * 100)}%
                          </span>
                        )}
                      </div>
                      <p className="mt-1 truncate text-sm font-semibold text-white" style={{ fontFamily: 'monospace' }}>
                        {pack.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-400" style={{ fontFamily: 'monospace' }}>
                        {pack.tagline}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#14D1A0]" style={{ fontFamily: 'monospace' }}>
                        {pack.price === 0 ? '免费' : `¥${pack.price.toLocaleString()}`}
                      </p>
                      {pack.originalPrice && (
                        <p className="text-[10px] text-slate-500 line-through" style={{ fontFamily: 'monospace' }}>
                          ¥{pack.originalPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-slate-500" />
                      <span className="text-[10px] tabular-nums text-slate-400" style={{ fontFamily: 'monospace' }}>
                        {pack.enrolled.toLocaleString()} 人
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-slate-500" />
                      <span className="text-[10px] tabular-nums text-emerald-400" style={{ fontFamily: 'monospace' }}>
                        {pack.conversionRate.toFixed(1)}% 转化
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-400" />
                      <span className="text-[10px] tabular-nums text-slate-400" style={{ fontFamily: 'monospace' }}>
                        {pack.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Info */}
              {selected?.id === pack.id && (
                <div className="mt-4 border-t border-[rgba(255,255,255,0.06)] pt-4">
                  <p className="text-xs text-slate-400" style={{ fontFamily: 'monospace' }}>
                    {pack.description}
                  </p>

                  {/* Features */}
                  <div className="mt-3 grid grid-cols-2 gap-1.5">
                    {pack.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-[#14D1A0]" />
                        <span className="text-[10px] text-slate-400">{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Target Audience */}
                  <div className="mt-3 flex items-center gap-2">
                    <Shield className="h-3 w-3 text-slate-500" />
                    <span className="text-[10px] text-slate-500">目标用户：</span>
                    <span className="text-[10px] text-slate-400">{pack.targetAudience}</span>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit?.(pack.id) }}
                      className="flex items-center gap-1.5 rounded-lg bg-[rgba(43,89,195,0.25)] px-3 py-1.5 text-xs font-medium text-[#2B59C3] hover:bg-[rgba(43,89,195,0.35)]"
                      style={{ fontFamily: 'monospace' }}
                    >
                      编辑
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDuplicate?.(pack.id) }}
                      className="flex items-center gap-1.5 rounded-lg bg-[rgba(255,255,255,0.06)] px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-[rgba(255,255,255,0.1)] hover:text-white"
                      style={{ fontFamily: 'monospace' }}
                    >
                      复制
                    </button>
                    <button
                      className="flex items-center gap-1.5 rounded-lg bg-[#14D1A0]/20 px-3 py-1.5 text-xs font-medium text-[#14D1A0] hover:bg-[#14D1A0]/30"
                      style={{ fontFamily: 'monospace' }}
                    >
                      <Zap className="h-3 w-3" /> 上架
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Bar */}
      <div className="flex items-center justify-between rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-4 py-3">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-lg font-bold tabular-nums text-white" style={{ fontFamily: 'monospace' }}>
              {packs.length}
            </p>
            <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>产品包</p>
          </div>
          <div className="h-8 w-px bg-[rgba(255,255,255,0.08)]" />
          <div className="text-center">
            <p className="text-lg font-bold tabular-nums text-[#14D1A0]" style={{ fontFamily: 'monospace' }}>
              {totalEnrolled.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>总用户</p>
          </div>
          <div className="h-8 w-px bg-[rgba(255,255,255,0.08)]" />
          <div className="text-center">
            <p className="text-lg font-bold tabular-nums text-emerald-400" style={{ fontFamily: 'monospace' }}>
              {avgConversion.toFixed(1)}%
            </p>
            <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>平均转化</p>
          </div>
          <div className="h-8 w-px bg-[rgba(255,255,255,0.08)]" />
          <div className="text-center">
            <p className="text-lg font-bold tabular-nums text-amber-400" style={{ fontFamily: 'monospace' }}>
              {avgRating.toFixed(1)}
            </p>
            <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>平均评分</p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 rounded-xl bg-[#14D1A0]/20 px-4 py-2 text-xs font-semibold text-[#14D1A0] hover:bg-[#14D1A0]/30"
          style={{ fontFamily: 'monospace' }}
        >
          <Gift className="h-4 w-4" /> 新建产品包
        </button>
      </div>
    </div>
  )
}
