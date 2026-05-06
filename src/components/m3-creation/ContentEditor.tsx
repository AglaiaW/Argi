'use client'

import { useState } from 'react'
import {
  FileText,
  Image,
  Mail,
  Video,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  Eye,
  ChevronRight,
  Sparkles,
  BarChart2,
} from 'lucide-react'
import type { DraftContent, DraftContent as DraftType } from './mockData'
import { MOCK_DRAFTS } from './mockData'

const TYPE_ICONS: Record<DraftType['type'], React.ReactNode> = {
  article: <FileText className="h-4 w-4" />,
  social: <Image className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  video_script: <Video className="h-4 w-4" />,
  product_description: <Package className="h-4 w-4" />,
}

const TYPE_LABELS: Record<DraftType['type'], string> = {
  article: '文章',
  social: '社媒',
  email: '邮件',
  video_script: '视频脚本',
  product_description: '产品描述',
}

const STATUS_CONFIG: Record<DraftType['status'], { label: string; icon: React.ReactNode; className: string }> = {
  draft: { label: '草稿', icon: <Clock className="h-3 w-3" />, className: 'bg-slate-700/60 text-slate-400' },
  reviewing: { label: '审核中', icon: <AlertCircle className="h-3 w-3" />, className: 'bg-amber-900/50 text-amber-400' },
  approved: { label: '已通过', icon: <CheckCircle className="h-3 w-3" />, className: 'bg-emerald-900/50 text-emerald-400' },
  published: { label: '已发布', icon: <Send className="h-3 w-3" />, className: 'bg-azure-900/50 text-azure-400' },
}

interface ContentEditorProps {
  drafts?: DraftContent[]
  onPublish?: (id: string) => void
  onPreview?: (id: string) => void
}

export default function ContentEditor({ drafts = MOCK_DRAFTS, onPublish, onPreview }: ContentEditorProps) {
  const [selected, setSelected] = useState<DraftContent | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | DraftType['type']>('all')
  const [search, setSearch] = useState('')

  const filtered = drafts.filter((d) => {
    const matchesTab = activeTab === 'all' || d.type === activeTab
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    return matchesTab && matchesSearch
  })

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,23,42,0.85)] p-5 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#14D1A0]" />
          <h2 className="text-base font-semibold text-white" style={{ fontFamily: 'monospace' }}>
            内容编辑器
          </h2>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-[rgba(255,255,255,0.05)] p-1">
          {(['all', 'article', 'social', 'email', 'video_script', 'product_description'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                activeTab === tab
                  ? 'bg-[#14D1A0]/20 text-[#14D1A0]'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={{ fontFamily: 'monospace' }}
            >
              {tab === 'all' ? '全部' : TYPE_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="搜索标题或标签..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-[#14D1A0]/50"
          style={{ fontFamily: 'monospace' }}
        />
      </div>

      {/* Content Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-3">
          {filtered.map((draft) => {
            const status = STATUS_CONFIG[draft.status]
            return (
              <div
                key={draft.id}
                onClick={() => setSelected(draft)}
                className={`group cursor-pointer rounded-xl border p-4 transition ${
                  selected?.id === draft.id
                    ? 'border-[#14D1A0]/60 bg-[#14D1A0]/5'
                    : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.16)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  {draft.thumbnail ? (
                    <div className="h-14 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                      <img src={draft.thumbnail} alt={draft.title} className="h-full w-full object-cover opacity-80" />
                    </div>
                  ) : (
                    <div className="flex h-14 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.05)]">
                      {TYPE_ICONS[draft.type]}
                    </div>
                  )}

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${status.className}`}>
                        {status.icon}
                        {status.label}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-[10px] text-slate-400">
                        {TYPE_ICONS[draft.type]}
                        {TYPE_LABELS[draft.type]}
                      </span>
                    </div>
                    <p className="mt-1.5 truncate text-sm font-medium text-white" style={{ fontFamily: 'monospace' }}>
                      {draft.title}
                    </p>
                    <div className="mt-1.5 flex items-center gap-3 text-[10px] text-slate-500">
                      <span>{draft.wordCount.toLocaleString()} 字</span>
                      <span>{formatDate(draft.updatedAt)}</span>
                      <span className="inline-flex items-center gap-0.5">
                        <BarChart2 className="h-3 w-3" />
                        {draft.performanceScore}
                      </span>
                    </div>
                  </div>

                  {/* Score Badge */}
                  <div className="flex flex-col items-end gap-1">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${
                      draft.performanceScore >= 90 ? 'bg-emerald-900/50 text-emerald-400' :
                      draft.performanceScore >= 80 ? 'bg-[#2B59C3]/20 text-[#2B59C3]' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {draft.performanceScore}
                    </div>
                    <ChevronRight className="h-3 w-3 text-slate-600 opacity-0 transition group-hover:opacity-100" />
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {draft.tags.map((tag) => (
                    <span key={tag} className="rounded bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-[10px] text-slate-400">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions (shown when selected) */}
                {selected?.id === draft.id && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onPreview?.(draft.id) }}
                      className="flex items-center gap-1.5 rounded-lg bg-[rgba(43,89,195,0.25)] px-3 py-1.5 text-xs font-medium text-[#2B59C3] hover:bg-[rgba(43,89,195,0.35)]"
                      style={{ fontFamily: 'monospace' }}
                    >
                      <Eye className="h-3 w-3" /> 预览
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onPublish?.(draft.id) }}
                      className="flex items-center gap-1.5 rounded-lg bg-[#14D1A0]/20 px-3 py-1.5 text-xs font-medium text-[#14D1A0] hover:bg-[#14D1A0]/30"
                      style={{ fontFamily: 'monospace' }}
                    >
                      <Send className="h-3 w-3" /> 发布
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation() }}
                      className="flex items-center gap-1.5 rounded-lg bg-[rgba(255,255,255,0.06)] px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-[rgba(255,255,255,0.1)] hover:text-white"
                      style={{ fontFamily: 'monospace' }}
                    >
                      <Sparkles className="h-3 w-3" /> AI 优化
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-between rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-4 py-3">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-lg font-bold tabular-nums text-white" style={{ fontFamily: 'monospace' }}>
              {drafts.length}
            </p>
            <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>总内容</p>
          </div>
          <div className="h-8 w-px bg-[rgba(255,255,255,0.08)]" />
          <div className="text-center">
            <p className="text-lg font-bold tabular-nums text-[#14D1A0]" style={{ fontFamily: 'monospace' }}>
              {drafts.filter((d) => d.status === 'draft').length}
            </p>
            <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>草稿</p>
          </div>
          <div className="h-8 w-px bg-[rgba(255,255,255,0.08)]" />
          <div className="text-center">
            <p className="text-lg font-bold tabular-nums text-amber-400" style={{ fontFamily: 'monospace' }}>
              {drafts.filter((d) => d.status === 'reviewing').length}
            </p>
            <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>待审</p>
          </div>
          <div className="h-8 w-px bg-[rgba(255,255,255,0.08)]" />
          <div className="text-center">
            <p className="text-lg font-bold tabular-nums text-white" style={{ fontFamily: 'monospace' }}>
              {drafts.filter((d) => d.status === 'published').length}
            </p>
            <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>已发布</p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 rounded-xl bg-[#14D1A0]/20 px-4 py-2 text-xs font-semibold text-[#14D1A0] hover:bg-[#14D1A0]/30"
          style={{ fontFamily: 'monospace' }}
        >
          <Sparkles className="h-4 w-4" /> 新建内容
        </button>
      </div>
    </div>
  )
}
