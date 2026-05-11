'use client'

import { useState } from 'react'
import {
  BookOpen,
  Search,
  Eye,
  ThumbsUp,
  MessageCircle,
  Pin,
  Star,
  Clock,
  ChevronRight,
  Filter,
} from 'lucide-react'
import type { KnowledgeArticle } from './mockData'

const CATEGORY_COLORS: Record<string, string> = {
  '入门指南': '#14D1A0',
  '进阶技巧': '#6366f1',
  '市场对接': '#f59e0b',
  '合规运营': '#ef4444',
  '私域运营': '#ec4899',
  '数据运营': '#2B59C3',
  '大促专题': '#f97316',
  '内容运营': '#8b5cf6',
}

interface KnowledgeBaseProps {
  articles: KnowledgeArticle[]
}

export default function KnowledgeBase({ articles }: KnowledgeBaseProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('全部')
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null)

  const categories = ['全部', ...Array.from(new Set(articles.map((a) => a.category)))]

  const filtered = articles.filter((a) => {
    const matchesSearch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = activeCategory === '全部' || a.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const pinned = filtered.filter((a) => a.isPinned)
  const regular = filtered.filter((a) => !a.isPinned)

  const formatNumber = (n: number) => {
    if (n >= 10000) return (n / 10000).toFixed(1) + '万'
    return n.toLocaleString()
  }

  if (selectedArticle) {
    return (
      <div className="flex h-full flex-col gap-5">
        {/* Article Detail View */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0a1628]/60 text-slate-400 hover:border-[rgba(255,255,255,0.16)] hover:text-white"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{
                  color: CATEGORY_COLORS[selectedArticle.category] || '#14D1A0',
                  background: `${CATEGORY_COLORS[selectedArticle.category] || '#14D1A0'}20`,
                  fontFamily: 'monospace',
                }}
              >
                {selectedArticle.category}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatNumber(selectedArticle.views)}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {formatNumber(selectedArticle.likes)}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              {selectedArticle.comments}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'monospace' }}>
            {selectedArticle.title}
          </h2>

          <div className="mt-4 flex items-center gap-3">
            <img
              src={selectedArticle.authorAvatar}
              alt={selectedArticle.author}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div>
              <p className="text-xs font-medium text-slate-900" style={{ fontFamily: 'monospace' }}>
                {selectedArticle.author}
              </p>
              <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>
                {selectedArticle.updatedAt.slice(0, 10)} · {selectedArticle.readTime}分钟阅读
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {selectedArticle.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[rgba(255,255,255,0.1)] bg-[#0a1628]/60 px-2.5 py-1 text-[10px] text-slate-400"
                style={{ fontFamily: 'monospace' }}
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628]/60 p-6">
            <p className="text-sm leading-relaxed text-slate-700" style={{ fontFamily: 'monospace' }}>
              {selectedArticle.content}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-5">
      {/* Search & Filter */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索文章标题或标签..."
            className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628]/60 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-600 focus:border-[#14D1A0]/50 focus:outline-none"
            style={{ fontFamily: 'monospace' }}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="h-3 w-3 shrink-0 text-slate-500" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-medium transition ${
                activeCategory === cat
                  ? 'bg-[#14D1A0]/20 text-emerald-600'
                  : 'bg-[#0a1628]/60 text-slate-500 hover:text-white'
              }`}
              style={{ fontFamily: 'monospace' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Article List */}
      <div className="flex-1 overflow-y-auto">
        {pinned.length > 0 && (
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-2">
              <Pin className="h-3 w-3 text-emerald-600" />
              <span className="text-[10px] font-bold text-emerald-600" style={{ fontFamily: 'monospace' }}>
                置顶文章
              </span>
            </div>
            <div className="space-y-2">
              {pinned.map((article) => (
                <ArticleCard key={article.id} article={article} formatNumber={formatNumber} onClick={() => setSelectedArticle(article)} categoryColors={CATEGORY_COLORS} />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {regular.map((article) => (
            <ArticleCard key={article.id} article={article} formatNumber={formatNumber} onClick={() => setSelectedArticle(article)} categoryColors={CATEGORY_COLORS} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <BookOpen className="h-12 w-12 text-slate-700" />
            <p className="mt-3 text-sm text-slate-500" style={{ fontFamily: 'monospace' }}>
              未找到相关文章
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function ArticleCard({
  article,
  formatNumber,
  onClick,
  categoryColors,
}: {
  article: KnowledgeArticle
  formatNumber: (n: number) => string
  onClick: () => void
  categoryColors: Record<string, string>
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0a1628]/60 p-4 transition hover:border-[rgba(255,255,255,0.12)] hover:bg-[#0a1628]/60"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {article.isPinned && <Pin className="h-3 w-3 shrink-0 text-emerald-600" />}
            {article.isFeatured && <Star className="h-3 w-3 shrink-0 text-amber-400" />}
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{
                color: categoryColors[article.category] || '#14D1A0',
                background: `${categoryColors[article.category] || '#14D1A0'}20`,
                fontFamily: 'monospace',
              }}
            >
              {article.category}
            </span>
          </div>
          <h3 className="text-sm font-medium text-slate-900 leading-snug" style={{ fontFamily: 'monospace' }}>
            {article.title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {article.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-3 text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatNumber(article.views)}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {formatNumber(article.likes)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-600" style={{ fontFamily: 'monospace' }}>
            <Clock className="h-3 w-3" />
            {article.readTime}分钟
          </div>
        </div>
      </div>
    </button>
  )
}
