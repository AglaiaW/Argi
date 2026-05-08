'use client'

import { useState } from 'react'
import {
  MessageSquare,
  Eye,
  ThumbsUp,
  Clock,
  Pin,
  CheckCircle,
  TrendingUp,
  Flame,
  Filter,
  Search,
  ChevronRight,
  MoreHorizontal,
  Bookmark,
} from 'lucide-react'
import type { DiscussionPost } from './mockData'

const ROLE_COLORS: Record<string, string> = {
  '运营新人': '#6366f1',
  '私域操盘手': '#14D1A0',
  '品牌方': '#f59e0b',
  '运营老兵': '#ec4899',
  '社区志愿者': '#ef4444',
  '营销策划': '#8b5cf6',
  '直播运营': '#f97316',
  '观望者': '#64748b',
}

interface DiscussionZoneProps {
  discussions: DiscussionPost[]
}

export default function DiscussionZone({ discussions }: DiscussionZoneProps) {
  const [filter, setFilter] = useState<'all' | 'trending' | 'unsolved' | 'mine'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPost, setSelectedPost] = useState<DiscussionPost | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replyCount, setReplyCount] = useState(0)

  const filtered = discussions.filter((d) => {
    const matchesSearch =
      !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    if (!matchesSearch) return false
    if (filter === 'trending') return d.trending
    if (filter === 'unsolved') return !d.isSolved
    if (filter === 'mine') return d.authorRole === '运营新人' // placeholder - should filter by current user id
    return true
  })

  const pinned = filtered.filter((d) => d.isPinned)
  const regular = filtered.filter((d) => !d.isPinned)

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date('2026-05-06T12:00:00Z')
    const diffMs = now.getTime() - date.getTime()
    const diffH = Math.floor(diffMs / 3600000)
    const diffD = Math.floor(diffMs / 86400000)
    if (diffH < 1) return '刚刚'
    if (diffH < 24) return `${diffH}小时前`
    if (diffD < 30) return `${diffD}天前`
    return dateStr.slice(0, 10)
  }

  const formatNumber = (n: number) => {
    if (n >= 10000) return (n / 10000).toFixed(1) + '万'
    return n.toLocaleString()
  }

  if (selectedPost) {
    return (
      <div className="flex h-full flex-col gap-5">
        {/* Post Detail View */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-400 hover:border-[rgba(255,255,255,0.16)] hover:text-slate-900"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </button>
          <div className="flex-1">
            {selectedPost.isSolved && (
              <span className="flex items-center gap-1 rounded-full bg-[#14D1A0]/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600" style={{ fontFamily: 'monospace' }}>
                <CheckCircle className="h-3 w-3" />
                已解决
              </span>
            )}
          </div>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-400 hover:border-[rgba(255,255,255,0.16)] hover:text-slate-900">
            <Bookmark className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Post header */}
          <div className="flex items-start gap-3">
            <img
              src={selectedPost.authorAvatar}
              alt={selectedPost.author}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900" style={{ fontFamily: 'monospace' }}>
                  {selectedPost.author}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    color: ROLE_COLORS[selectedPost.authorRole] || '#64748b',
                    background: `${ROLE_COLORS[selectedPost.authorRole] || '#64748b'}20`,
                    fontFamily: 'monospace',
                  }}
                >
                  {selectedPost.authorRole}
                </span>
              </div>
              <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>
                {formatTime(selectedPost.createdAt)}
              </p>
            </div>
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900" style={{ fontFamily: 'monospace' }}>
            {selectedPost.title}
          </h2>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {selectedPost.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[rgba(255,255,255,0.1)] bg-slate-100 px-2.5 py-1 text-[10px] text-slate-400"
                style={{ fontFamily: 'monospace' }}
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-100 p-5">
            <p className="text-sm leading-relaxed text-slate-700" style={{ fontFamily: 'monospace' }}>
              {selectedPost.content}
            </p>
          </div>

          {/* Stats */}
          <div className="mt-5 flex items-center gap-6 border-t border-[rgba(255,255,255,0.06)] pt-4">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-xs text-slate-500" style={{ fontFamily: 'monospace' }}>
                <Eye className="h-4 w-4" />
                {formatNumber(selectedPost.views)}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500" style={{ fontFamily: 'monospace' }}>
                <ThumbsUp className="h-4 w-4" />
                {formatNumber(selectedPost.likes)}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500" style={{ fontFamily: 'monospace' }}>
                <MessageSquare className="h-4 w-4" />
                {selectedPost.replies} 回复
              </span>
            </div>
          </div>

          {/* Reply */}
          <div className="mt-5 flex items-center gap-3">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="写下你的回复..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-600 focus:border-[#14D1A0]/50 focus:outline-none"
              style={{ fontFamily: 'monospace' }}
            />
            <button
              onClick={() => {
                if (!replyText.trim()) return
                setReplyCount((c) => c + 1)
                setReplyText('')
                alert('回复已发送（需接入真实评论API）')
              }}
              className="rounded-xl bg-[#14D1A0] px-4 py-2.5 text-sm font-bold text-black hover:bg-[#14D1A0]/90"
            >
              回复 {replyCount > 0 ? `(${replyCount})` : ''}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索讨论话题..."
          className="w-full rounded-xl border border-slate-200 bg-slate-100 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-600 focus:border-[#14D1A0]/50 focus:outline-none"
          style={{ fontFamily: 'monospace' }}
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all' as const, label: '全部' },
          { id: 'trending' as const, label: '热议', icon: <Flame className="h-3 w-3" /> },
          { id: 'unsolved' as const, label: '待解决', icon: <MessageSquare className="h-3 w-3" /> },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1 text-[10px] font-medium transition ${
              filter === f.id
                ? 'bg-[#14D1A0]/20 text-emerald-600'
                : 'bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
            style={{ fontFamily: 'monospace' }}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      {/* Discussion List */}
      <div className="flex-1 overflow-y-auto">
        {pinned.length > 0 && (
          <div className="mb-3">
            <div className="mb-2 flex items-center gap-2">
              <Pin className="h-3 w-3 text-emerald-600" />
              <span className="text-[10px] font-bold text-emerald-600" style={{ fontFamily: 'monospace' }}>
                置顶
              </span>
            </div>
            <div className="space-y-2">
              {pinned.map((post) => (
                <DiscussionCard
                  key={post.id}
                  post={post}
                  formatTime={formatTime}
                  formatNumber={formatNumber}
                  onClick={() => setSelectedPost(post)}
                  roleColors={ROLE_COLORS}
                />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {regular.map((post) => (
            <DiscussionCard
              key={post.id}
              post={post}
              formatTime={formatTime}
              formatNumber={formatNumber}
              onClick={() => setSelectedPost(post)}
              roleColors={ROLE_COLORS}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <MessageSquare className="h-12 w-12 text-slate-700" />
            <p className="mt-3 text-sm text-slate-500" style={{ fontFamily: 'monospace' }}>
              暂无相关讨论
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function DiscussionCard({
  post,
  formatTime,
  formatNumber,
  onClick,
  roleColors,
}: {
  post: DiscussionPost
  formatTime: (s: string) => string
  formatNumber: (n: number) => string
  onClick: () => void
  roleColors: Record<string, string>
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl border border-slate-200 bg-slate-100 p-4 transition hover:border-[rgba(255,255,255,0.12)] hover:bg-slate-100"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <img
            src={post.authorAvatar}
            alt={post.author}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {post.isPinned && <Pin className="h-3 w-3 shrink-0 text-emerald-600" />}
              {post.trending && <TrendingUp className="h-3 w-3 shrink-0 text-orange-400" />}
              {post.isSolved && <CheckCircle className="h-3 w-3 shrink-0 text-emerald-600" />}
              <span className="text-xs font-medium text-slate-900 truncate" style={{ fontFamily: 'monospace' }}>
                {post.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{
                  color: roleColors[post.authorRole] || '#64748b',
                  background: `${roleColors[post.authorRole] || '#64748b'}20`,
                  fontFamily: 'monospace',
                }}
              >
                {post.authorRole}
              </span>
              <span className="text-[10px] text-slate-600" style={{ fontFamily: 'monospace' }}>
                {post.author}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-2 text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {formatNumber(post.likes)}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {post.replies}
            </span>
          </div>
          <span className="text-[10px] text-slate-600" style={{ fontFamily: 'monospace' }}>
            {formatTime(post.lastActivity)}
          </span>
        </div>
      </div>
    </button>
  )
}
