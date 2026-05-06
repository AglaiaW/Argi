'use client'

import { useState } from 'react'
import {
  RefreshCw,
  Check,
  Clock,
  AlertTriangle,
  Link2,
  MessageSquare,
  Video,
  Image,
  Globe,
  Mail,
  Briefcase,
  ChevronRight,
  Users,
  Shield,
  Zap,
} from 'lucide-react'
import type { PlatformConnection, ScheduledPost } from './mockData'
import { MOCK_PLATFORMS, MOCK_SCHEDULED } from './mockData'

const PLATFORM_ICONS: Record<PlatformConnection['platform'], React.ReactNode> = {
  wechat: <MessageSquare className="h-4 w-4" />,
  douyin: <Video className="h-4 w-4" />,
  xiaohongshu: <Image className="h-4 w-4" />,
  weibo: <Globe className="h-4 w-4" />,
  bilibili: <Video className="h-4 w-4" />,
  zhihu: <MessageSquare className="h-4 w-4" />,
  wework: <Briefcase className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
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

const STATUS_CONFIG: Record<PlatformConnection['status'], { label: string; icon: React.ReactNode; className: string; dot: string }> = {
  connected: { label: '已连接', icon: <Check className="h-3 w-3" />, className: 'bg-emerald-900/40 text-emerald-400', dot: 'bg-emerald-400' },
  disconnected: { label: '未连接', icon: <Link2 className="h-3 w-3" />, className: 'bg-slate-800 text-slate-400', dot: 'bg-slate-500' },
  error: { label: '异常', icon: <AlertTriangle className="h-3 w-3" />, className: 'bg-rose-900/40 text-rose-400', dot: 'bg-rose-400' },
  pending: { label: '待授权', icon: <Clock className="h-3 w-3" />, className: 'bg-amber-900/40 text-amber-400', dot: 'bg-amber-400' },
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  return `${Math.floor(hours / 24)}天前`
}

function formatScheduled(iso: string) {
  return new Date(iso).toLocaleDateString('zh-CN', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

interface PlatformSyncProps {
  platforms?: PlatformConnection[]
  scheduled?: ScheduledPost[]
}

export default function PlatformSync({ platforms = MOCK_PLATFORMS, scheduled = MOCK_SCHEDULED }: PlatformSyncProps) {
  const [syncing, setSyncing] = useState(false)
  const [syncPlatformId, setSyncPlatformId] = useState<string | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformConnection | null>(null)

  const connectedCount = platforms.filter((p) => p.status === 'connected').length
  const scheduledCount = scheduled.filter((s) => s.status === 'scheduled').length

  async function handleSync(platform: PlatformConnection) {
    if (platform.status !== 'connected' || syncing) return
    setSyncing(true)
    setSyncPlatformId(platform.id)
    await new Promise((r) => setTimeout(r, 2000))
    setSyncing(false)
    setSyncPlatformId(null)
  }

  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,23,42,0.85)] p-5 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-[#14D1A0]" />
          <h2 className="text-base font-semibold text-white" style={{ fontFamily: 'monospace' }}>
            平台同步
          </h2>
        </div>
        <button
          onClick={() => setSyncing(true)}
          disabled={syncing}
          className="flex items-center gap-1.5 rounded-lg bg-[rgba(255,255,255,0.06)] px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-[rgba(255,255,255,0.1)] hover:text-white disabled:opacity-50"
          style={{ fontFamily: 'monospace' }}
        >
          <RefreshCw className={`h-3 w-3 ${syncing ? 'animate-spin' : ''}`} />
          同步全部
        </button>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left: Platform List */}
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500" style={{ fontFamily: 'monospace' }}>
              已连接 {connectedCount}/{platforms.length} 个平台
            </span>
          </div>

          {platforms.map((platform) => {
            const status = STATUS_CONFIG[platform.status]
            const isSyncingThis = syncPlatformId === platform.id
            return (
              <div
                key={platform.id}
                onClick={() => setSelectedPlatform(platform)}
                className={`group flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                  selectedPlatform?.id === platform.id
                    ? 'border-[#14D1A0]/60 bg-[#14D1A0]/5'
                    : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.16)]'
                }`}
              >
                {/* Platform Icon */}
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.06)] ${PLATFORM_COLORS[platform.platform]}`}>
                  {PLATFORM_ICONS[platform.platform]}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate" style={{ fontFamily: 'monospace' }}>
                      {platform.accountName}
                    </p>
                    {platform.verified && (
                      <Shield className="h-3 w-3 flex-shrink-0 text-[#2B59C3]" />
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] ${status.className}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                    {platform.status === 'connected' && platform.followers !== undefined && (
                      <span className="flex items-center gap-0.5 text-[10px] text-slate-500">
                        <Users className="h-3 w-3" />
                        {platform.followers.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  {platform.syncEnabled && (
                    <span className="rounded bg-emerald-900/30 px-1.5 py-0.5 text-[10px] text-emerald-400">
                      同步
                    </span>
                  )}
                  {platform.autoPublish && (
                    <span className="rounded bg-[#2B59C3]/30 px-1.5 py-0.5 text-[10px] text-[#2B59C3]">
                      自动
                    </span>
                  )}

                  {/* Sync Button */}
                  {platform.status === 'connected' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSync(platform) }}
                      disabled={syncing}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-[rgba(255,255,255,0.06)] hover:text-white disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isSyncingThis ? 'animate-spin text-[#14D1A0]' : ''}`} />
                    </button>
                  )}

                  <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                </div>
              </div>
            )
          })}
        </div>

        {/* Right: Scheduled Posts & Details */}
        <div className="w-72 flex-shrink-0 overflow-y-auto">
          {/* Scheduled Count */}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-slate-500" style={{ fontFamily: 'monospace' }}>
              待发布 ({scheduledCount})
            </span>
            <span className="rounded bg-[rgba(255,255,255,0.05)] px-2 py-0.5 text-[10px] text-slate-400">
              {scheduled.filter((s) => s.status === 'published').length} 已发布
            </span>
          </div>

          {/* Scheduled List */}
          <div className="space-y-2">
            {scheduled.map((post) => (
              <div
                key={post.id}
                className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-3"
              >
                <div className="flex items-center gap-2">
                  <div className={`flex h-6 w-6 items-center justify-center rounded ${PLATFORM_COLORS[post.platform]}`}>
                    {PLATFORM_ICONS[post.platform as PlatformConnection['platform']]}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {PLATFORM_NAMES[post.platform]}
                  </span>
                  <span className={`ml-auto rounded px-1.5 py-0.5 text-[10px] ${
                    post.status === 'scheduled'
                      ? 'bg-amber-900/40 text-amber-400'
                      : post.status === 'published'
                      ? 'bg-emerald-900/40 text-emerald-400'
                      : 'bg-rose-900/40 text-rose-400'
                  }`}>
                    {post.status === 'scheduled' ? '待发' : post.status === 'published' ? '已发' : '失败'}
                  </span>
                </div>
                <p className="mt-1.5 truncate text-xs text-white" style={{ fontFamily: 'monospace' }}>
                  {post.title}
                </p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    {formatScheduled(post.scheduledFor)}
                  </span>
                  {post.status === 'published' && post.views !== undefined && (
                    <span className="text-[10px] text-slate-500">
                      👁 {post.views.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Platform Details */}
          {selectedPlatform && (
            <div className="mt-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
              <h3 className="text-xs font-semibold text-white" style={{ fontFamily: 'monospace' }}>
                {selectedPlatform.accountName}
              </h3>
              <p className="mt-0.5 text-[10px] text-slate-500">{PLATFORM_NAMES[selectedPlatform.platform]}</p>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">状态</span>
                  <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] ${STATUS_CONFIG[selectedPlatform.status].className}`}>
                    {STATUS_CONFIG[selectedPlatform.status].icon}
                    {STATUS_CONFIG[selectedPlatform.status].label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">账号ID</span>
                  <span className="text-[10px] text-slate-400">{selectedPlatform.accountId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">自动发布</span>
                  <span className={`text-[10px] ${selectedPlatform.autoPublish ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {selectedPlatform.autoPublish ? '已开启' : '未开启'}
                  </span>
                </div>
                {selectedPlatform.lastSyncedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">上次同步</span>
                    <span className="text-[10px] text-slate-400">{timeAgo(selectedPlatform.lastSyncedAt)}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-1.5">
                <button className="flex items-center justify-center gap-1.5 rounded-lg bg-[#14D1A0]/20 px-3 py-2 text-xs font-medium text-[#14D1A0] hover:bg-[#14D1A0]/30">
                  <Zap className="h-3 w-3" /> 配置自动发布
                </button>
                <button className="flex items-center justify-center gap-1.5 rounded-lg bg-[rgba(255,255,255,0.06)] px-3 py-2 text-xs font-medium text-slate-400 hover:bg-[rgba(255,255,255,0.1)] hover:text-white">
                  <Link2 className="h-3 w-3" /> 重新授权
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
