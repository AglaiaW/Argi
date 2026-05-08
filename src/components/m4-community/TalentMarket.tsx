'use client'

import { useState } from 'react'
import {
  Briefcase,
  Search,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  BadgeCheck,
  Zap,
  Filter,
  X,
} from 'lucide-react'
import type { TalentProfile } from './mockData'

const AVAILABILITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  available: { label: '可合作', color: '#14D1A0', bg: 'bg-[#14D1A0]/20' },
  busy: { label: '忙碌', color: '#f59e0b', bg: 'bg-[#f59e0b]/20' },
  unavailable: { label: '暂不接单', color: '#64748b', bg: 'bg-[#64748b]/20' },
}

const BADGE_COLORS: Record<string, { color: string; bg: string }> = {
  'TOP服务商': { color: '#14D1A0', bg: 'bg-[#14D1A0]/20' },
  '极速响应': { color: '#6366f1', bg: 'bg-[#6366f1]/20' },
  '年度精选': { color: '#f59e0b', bg: 'bg-[#f59e0b]/20' },
  '内容专家': { color: '#ec4899', bg: 'bg-[#ec4899]/20' },
  '爆款制造机': { color: '#f97316', bg: 'bg-[#f97316]/20' },
  '增长黑客': { color: '#2B59C3', bg: 'bg-[#2B59C3]/20' },
  '数据达人': { color: '#8b5cf6', bg: 'bg-[#8b5cf6]/20' },
  '设计大牛': { color: '#14D1A0', bg: 'bg-[#14D1A0]/20' },
  '投放专家': { color: '#f59e0b', bg: 'bg-[#f59e0b]/20' },
  'ROI优化师': { color: '#ec4899', bg: 'bg-[#ec4899]/20' },
  '直播大牛': { color: '#f97316', bg: 'bg-[#f97316]/20' },
  '数据专家': { color: '#2B59C3', bg: 'bg-[#2B59C3]/20' },
  'AI专家': { color: '#8b5cf6', bg: 'bg-[#8b5cf6]/20' },
  '效率提升专家': { color: '#14D1A0', bg: 'bg-[#14D1A0]/20' },
}

interface TalentMarketProps {
  talents: TalentProfile[]
}

export default function TalentMarket({ talents }: TalentMarketProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAvailability, setFilterAvailability] = useState<string>('all')
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null)

  const filtered = talents.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesAvail = filterAvailability === 'all' || t.availability === filterAvailability
    return matchesSearch && matchesAvail
  })

  const availableCount = talents.filter((t) => t.availability === 'available').length

  const formatNumber = (n: number) => n.toLocaleString()

  if (selectedTalent) {
    const availCfg = AVAILABILITY_CONFIG[selectedTalent.availability]

    return (
      <div className="flex h-full flex-col gap-5">
        {/* Back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedTalent(null)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-400 hover:border-[rgba(255,255,255,0.16)] hover:text-slate-900"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </button>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${availCfg.bg}`} style={{ color: availCfg.color, fontFamily: 'monospace' }}>
              {availCfg.label}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Profile header */}
          <div className="flex items-start gap-4">
            <img
              src={selectedTalent.avatar}
              alt={selectedTalent.name}
              className="h-16 w-16 rounded-2xl object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'monospace' }}>
                  {selectedTalent.name}
                </h2>
                <BadgeCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-sm text-slate-400" style={{ fontFamily: 'monospace' }}>
                {selectedTalent.title}
              </p>
              <p className="text-xs text-slate-500" style={{ fontFamily: 'monospace' }}>
                {selectedTalent.company} · {selectedTalent.location}
              </p>
            </div>
          </div>

          {/* Rating & Stats */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-100 p-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-400" />
                <p className="text-lg font-bold text-slate-900 tabular-nums" style={{ fontFamily: 'monospace' }}>
                  {selectedTalent.rating}
                </p>
              </div>
              <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>评分</p>
            </div>
            <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-100 p-3">
              <p className="text-lg font-bold text-slate-900 tabular-nums" style={{ fontFamily: 'monospace' }}>
                {selectedTalent.completedProjects}
              </p>
              <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>完成项目</p>
            </div>
            <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-100 p-3">
              <p className="text-lg font-bold text-emerald-600 tabular-nums" style={{ fontFamily: 'monospace' }}>
                {selectedTalent.responseRate}%
              </p>
              <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>响应率</p>
            </div>
          </div>

          {/* Skills */}
          <div className="mt-5">
            <h3 className="mb-2 text-xs font-bold text-slate-400" style={{ fontFamily: 'monospace' }}>
              擅长领域
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedTalent.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[rgba(255,255,255,0.1)] bg-slate-100 px-3 py-1 text-xs text-slate-300"
                  style={{ fontFamily: 'monospace' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-100 p-4">
            <h3 className="mb-2 text-xs font-bold text-slate-400" style={{ fontFamily: 'monospace' }}>
              个人简介
            </h3>
            <p className="text-sm leading-relaxed text-slate-700" style={{ fontFamily: 'monospace' }}>
              {selectedTalent.bio}
            </p>
          </div>

          {/* Badges */}
          <div className="mt-4">
            <h3 className="mb-2 text-xs font-bold text-slate-400" style={{ fontFamily: 'monospace' }}>
              荣誉勋章
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedTalent.badges.map((badge) => {
                const cfg = BADGE_COLORS[badge] || { color: '#64748b', bg: 'bg-[#64748b]/20' }
                return (
                  <span
                    key={badge}
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${cfg.bg}`}
                    style={{ color: cfg.color, fontFamily: 'monospace' }}
                  >
                    <Zap className="h-3 w-3" />
                    {badge}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Meta */}
          <div className="mt-4 flex items-center gap-4 text-[10px] text-slate-600" style={{ fontFamily: 'monospace' }}>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              加入于 {selectedTalent.joinedAt}
            </span>
            {selectedTalent.hourlyRate && (
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                ¥{selectedTalent.hourlyRate}/小时
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="mt-6 flex items-center justify-between border-t border-[rgba(255,255,255,0.06)] pt-5">
            <div>
              {selectedTalent.availability === 'available' ? (
                <p className="text-xs text-emerald-600" style={{ fontFamily: 'monospace' }}>
                  可立即咨询
                </p>
              ) : (
                <p className="text-xs text-slate-500" style={{ fontFamily: 'monospace' }}>
                  当前不可接单
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-900">
                <BadgeCheck className="h-4 w-4" />
                查看主页
              </button>
              <button
                onClick={() => alert(`正在发起与「${selectedTalent.name}」的咨询对话（需接入消息API）`)}
                className="flex items-center gap-2 rounded-xl bg-[#14D1A0] px-5 py-2.5 text-sm font-bold text-black hover:bg-[#14D1A0]/90 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={selectedTalent.availability !== 'available'}
              >
                <MessageSquare className="h-4 w-4" />
                立即咨询
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Search & Filter */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索人才姓名、职位或技能..."
          className="w-full rounded-xl border border-slate-200 bg-slate-100 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-600 focus:border-[#14D1A0]/50 focus:outline-none"
          style={{ fontFamily: 'monospace' }}
        />
      </div>

      {/* Availability Filter */}
      <div className="flex items-center gap-2">
        {[
          { id: 'all', label: '全部', count: talents.length },
          { id: 'available', label: '可合作', count: availableCount },
          { id: 'busy', label: '忙碌', count: talents.filter((t) => t.availability === 'busy').length },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterAvailability(f.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium transition ${
              filterAvailability === f.id
                ? 'bg-[#14D1A0]/20 text-emerald-600'
                : 'bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
            style={{ fontFamily: 'monospace' }}
          >
            {f.label}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
              filterAvailability === f.id
                ? 'bg-[#14D1A0]/30 text-emerald-600'
                : 'bg-[rgba(255,255,255,0.08)] text-slate-500'
            }`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-slate-500" />
          <span className="text-xs text-slate-400" style={{ fontFamily: 'monospace' }}>
            共找到 <span className="font-bold text-slate-900">{filtered.length}</span> 位人才
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#14D1A0]" />
          <span className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>
            {availableCount} 位可立即合作
          </span>
        </div>
      </div>

      {/* Talent list */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {filtered.map((talent) => {
            const availCfg = AVAILABILITY_CONFIG[talent.availability]

            return (
              <button
                key={talent.id}
                onClick={() => setSelectedTalent(talent)}
                className="w-full text-left rounded-2xl border border-slate-200 bg-slate-100 p-4 transition hover:border-[rgba(255,255,255,0.12)] hover:bg-slate-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <img
                      src={talent.avatar}
                      alt={talent.name}
                      className="h-12 w-12 shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-medium text-slate-900 truncate" style={{ fontFamily: 'monospace' }}>
                          {talent.name}
                        </h3>
                        <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${availCfg.bg}`} style={{ color: availCfg.color, fontFamily: 'monospace' }}>
                          {availCfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate" style={{ fontFamily: 'monospace' }}>
                        {talent.title} · {talent.company}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>
                          <MapPin className="h-3 w-3" />
                          {talent.location}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>
                          <Star className="h-3 w-3 text-amber-400" />
                          {talent.rating}
                        </span>
                        <span className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>
                          {talent.completedProjects}项目
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {talent.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] text-slate-400" style={{ fontFamily: 'monospace' }}>
                            {skill}
                          </span>
                        ))}
                        {talent.skills.length > 3 && (
                          <span className="text-[10px] text-slate-600" style={{ fontFamily: 'monospace' }}>
                            +{talent.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                    {talent.hourlyRate && (
                      <p className="text-[10px] text-emerald-600" style={{ fontFamily: 'monospace' }}>
                        ¥{talent.hourlyRate}/h
                      </p>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Briefcase className="h-12 w-12 text-slate-700" />
            <p className="mt-3 text-sm text-slate-500" style={{ fontFamily: 'monospace' }}>
              未找到匹配的人才
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
