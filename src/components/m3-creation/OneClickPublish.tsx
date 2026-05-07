'use client'

import { useState } from 'react'
import {
  Rocket,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Globe,
  RefreshCw,
  Zap,
  AlertCircle,
} from 'lucide-react'
import type { PublishResult, PlatformConnection, ScheduledPost } from './mockData'
import { MOCK_PUBLISH_HISTORY, MOCK_PLATFORMS, MOCK_SCHEDULED } from './mockData'

const PLATFORM_COLORS: Record<PlatformConnection['platform'], string> = {
  wechat: 'text-green-400',
  douyin: 'text-pink-400',
  xiaohongshu: 'text-red-400',
  weibo: 'text-orange-400',
  bilibili: 'text-purple-400',
  zhihu: 'text-blue-400',
  wework: 'text-blue-400',
  email: 'text-slate-400',
}

const PLATFORM_NAMES: Record<PlatformConnection['platform'], string> = {
  wechat: '微信',
  douyin: '抖音',
  xiaohongshu: '小红书',
  weibo: '微博',
  bilibili: 'B站',
  zhihu: '知乎',
  wework: '企业微信',
  email: '邮件',
}

interface PublishLog {
  id: string
  platform: PlatformConnection['platform']
  title: string
  status: 'success' | 'failed'
  timestamp: string
  url?: string
  views?: number
  likes?: number
  comments?: number
}

const MOCK_PUBLISH_LOGS: PublishLog[] = [
  {
    id: 'log-001',
    platform: 'wechat',
    title: '【今日特惠】限时秒杀活动火热进行中',
    status: 'success',
    timestamp: '2026-05-06T08:00:00Z',
    url: 'https://mp.weixin.qq.com/s/xl_demo_001',
    views: 12400,
    likes: 876,
    comments: 42,
  },
  {
    id: 'log-002',
    platform: 'douyin',
    title: '#新品发布# 智能手表深度测评来啦 🎉',
    status: 'success',
    timestamp: '2026-05-05T14:30:00Z',
    url: 'https://www.douyin.com/video/7382916540',
    views: 345000,
    likes: 21500,
    comments: 1830,
  },
  {
    id: 'log-003',
    platform: 'xiaohongshu',
    title: '超实用的团队协作技巧｜效率翻倍💡',
    status: 'failed',
    timestamp: '2026-05-04T16:00:00Z',
    views: 0,
    likes: 0,
    comments: 0,
  },
  {
    id: 'log-004',
    platform: 'wechat',
    title: '端午节福利预告｜你准备好了吗？🌿',
    status: 'success',
    timestamp: '2026-05-03T10:00:00Z',
    views: 8900,
    likes: 520,
    comments: 28,
  },
  {
    id: 'log-005',
    platform: 'email',
    title: '客户案例｜零售品牌月销提升 300%',
    status: 'success',
    timestamp: '2026-05-02T09:00:00Z',
    views: 45200,
    likes: 0,
    comments: 0,
  },
]

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('zh-CN', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

interface OneClickPublishProps {
  history?: PublishResult[]
  platforms?: PlatformConnection[]
  scheduled?: ScheduledPost[]
}

export default function OneClickPublish({
  history = MOCK_PUBLISH_HISTORY,
  platforms = MOCK_PLATFORMS,
  scheduled = MOCK_SCHEDULED,
}: OneClickPublishProps) {
  const [publishing, setPublishing] = useState(false)
  const [publishStep, setPublishStep] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending')

  const connectedPlatforms = platforms.filter((p) => p.status === 'connected' && p.autoPublish)
  const pendingScheduled = scheduled.filter((s) => s.status === 'scheduled')
  const successCount = history.filter((h) => h.status === 'success').length
  const totalViews = history.reduce((s, h) => s + (h.views ?? 0), 0)

  async function handlePublish() {
    if (publishing) return
    setPublishing(true)

    const steps = connectedPlatforms.map((p) => p.platform)
    for (const platform of steps) {
      setPublishStep(platform)
      await new Promise((r) => setTimeout(r, 800))
    }

    setPublishing(false)
    setPublishStep(null)
  }

  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-[rgba(15,23,42,0.85)] p-5 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-emerald-600" />
          <h2 className="text-base font-semibold text-slate-900" style={{ fontFamily: 'monospace' }}>
            一键发布
          </h2>
        </div>

        {/* Publish Button */}
        <button
          onClick={handlePublish}
          disabled={publishing || connectedPlatforms.length === 0}
          className="flex items-center gap-2 rounded-xl bg-[#14D1A0] px-5 py-2.5 text-sm font-semibold text-[#010409] transition hover:bg-[#14D1A0]/90 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ fontFamily: 'monospace' }}
        >
          {publishing ? (
            <>
              <RefreshCw className={`h-4 w-4 animate-spin`} />
              {publishStep ? `发布到 ${PLATFORM_NAMES[publishStep as PlatformConnection['platform']]}...` : '准备中...'}
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              立即发布
            </>
          )}
        </button>
      </div>

      {/* Publishing Progress */}
      {publishing && (
        <div className="rounded-xl border border-[#14D1A0]/30 bg-[#14D1A0]/5 p-4">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-4 w-4 animate-spin text-emerald-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-600" style={{ fontFamily: 'monospace' }}>
                正在同步发布到 {connectedPlatforms.length} 个平台...
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {connectedPlatforms.map((p) => (
                  <span
                    key={p.id}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${
                      publishStep === p.platform
                        ? 'bg-[#14D1A0]/30 text-emerald-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                    style={{ fontFamily: 'monospace' }}
                  >
                    {publishStep === p.platform && <RefreshCw className="h-3 w-3 animate-spin" />}
                    {PLATFORM_NAMES[p.platform]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-slate-100 p-3 text-center">
          <p className="text-xl font-bold tabular-nums text-slate-900" style={{ fontFamily: 'monospace' }}>
            {connectedPlatforms.length}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>已连接</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-100 p-3 text-center">
          <p className="text-xl font-bold tabular-nums text-amber-400" style={{ fontFamily: 'monospace' }}>
            {pendingScheduled.length}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>待发布</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-100 p-3 text-center">
          <p className="text-xl font-bold tabular-nums text-emerald-400" style={{ fontFamily: 'monospace' }}>
            {successCount}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>成功发布</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-100 p-3 text-center">
          <p className="text-xl font-bold tabular-nums text-blue-600" style={{ fontFamily: 'monospace' }}>
            {totalViews >= 1000 ? `${(totalViews / 1000).toFixed(0)}k` : totalViews}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>总曝光</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition ${
            activeTab === 'pending'
              ? 'bg-[#14D1A0]/20 text-emerald-600'
              : 'text-slate-400 hover:text-slate-900'
          }`}
          style={{ fontFamily: 'monospace' }}
        >
          待发布 ({pendingScheduled.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition ${
            activeTab === 'history'
              ? 'bg-[#14D1A0]/20 text-emerald-600'
              : 'text-slate-400 hover:text-slate-900'
          }`}
          style={{ fontFamily: 'monospace' }}
        >
          发布历史
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'pending' ? (
          <div className="space-y-2">
            {pendingScheduled.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="h-8 w-8 text-slate-600" />
                <p className="mt-2 text-sm text-slate-500" style={{ fontFamily: 'monospace' }}>
                  暂无待发布内容
                </p>
              </div>
            ) : (
              pendingScheduled.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-100 p-3.5"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${PLATFORM_COLORS[post.platform]}`}>
                    {PLATFORM_NAMES[post.platform]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-900" style={{ fontFamily: 'monospace' }}>
                      {post.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-500">
                      <span>{PLATFORM_NAMES[post.platform]}</span>
                      <span>·</span>
                      <Clock className="h-3 w-3" />
                      <span>{formatDateTime(post.scheduledFor)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded bg-amber-900/40 px-2 py-0.5 text-[10px] text-amber-400">
                      待发布
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {MOCK_PUBLISH_LOGS.map((log) => (
              <div
                key={log.id}
                className="rounded-xl border border-slate-200 bg-slate-100 p-3.5"
              >
                <div className="flex items-start gap-3">
                  {/* Status Icon */}
                  <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
                    log.status === 'success' ? 'bg-emerald-900/40' : 'bg-rose-900/40'
                  }`}>
                    {log.status === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] ${PLATFORM_COLORS[log.platform]}`}>
                        {PLATFORM_NAMES[log.platform]}
                      </span>
                      <span className="text-[10px] text-slate-500">{formatDateTime(log.timestamp)}</span>
                      {log.status === 'failed' && (
                        <span className="ml-auto rounded bg-rose-900/40 px-1.5 py-0.5 text-[10px] text-rose-400">
                          发布失败
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-sm text-slate-900" style={{ fontFamily: 'monospace' }}>
                      {log.title}
                    </p>

                    {/* Stats */}
                    {log.status === 'success' && (
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Eye className="h-3 w-3" />
                          {log.views !== undefined && log.views > 0
                            ? log.views.toLocaleString()
                            : '—'}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Heart className="h-3 w-3" />
                          {log.likes !== undefined && log.likes > 0
                            ? log.likes.toLocaleString()
                            : '—'}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <MessageCircle className="h-3 w-3" />
                          {log.comments !== undefined && log.comments > 0
                            ? log.comments.toLocaleString()
                            : '—'}
                        </div>
                        {log.url && (
                          <a
                            href={log.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto flex items-center gap-1 text-[10px] text-blue-600 hover:underline"
                          >
                            <Globe className="h-3 w-3" />
                            查看
                          </a>
                        )}
                      </div>
                    )}

                    {/* Error */}
                    {log.status === 'failed' && (
                      <div className="mt-2 flex items-center gap-2 rounded-lg bg-rose-900/20 p-2">
                        <AlertCircle className="h-3 w-3 flex-shrink-0 text-rose-400" />
                        <p className="text-[10px] text-rose-400">
                          内容违规审核未通过，请修改后重试
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
