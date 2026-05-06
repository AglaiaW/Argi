'use client'

import { useState } from 'react'
import {
  FileText,
  MessageSquare,
  Calendar,
  Briefcase,
  Send,
  X,
  Plus,
  Image,
  Tag,
  Clock,
} from 'lucide-react'

type CreateType = 'article' | 'discussion' | 'event' | 'talent-demand' | null

export default function SectCreate() {
  const [createType, setCreateType] = useState<CreateType>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const CREATE_OPTIONS = [
    {
      id: 'article' as CreateType,
      label: '发布文章',
      description: '分享运营经验、行业洞察或教程攻略',
      icon: <FileText className="h-6 w-6" />,
      color: '#14D1A0',
      bg: 'bg-[#14D1A0]/10',
    },
    {
      id: 'discussion' as CreateType,
      label: '发起讨论',
      description: '提出问题或发起话题，与社区成员交流',
      icon: <MessageSquare className="h-6 w-6" />,
      color: '#6366f1',
      bg: 'bg-[#6366f1]/10',
    },
    {
      id: 'event' as CreateType,
      label: '组织活动',
      description: '发起线上直播、线下聚会或工作坊',
      icon: <Calendar className="h-6 w-6" />,
      color: '#f59e0b',
      bg: 'bg-[#f59e0b]/10',
    },
    {
      id: 'talent-demand' as CreateType,
      label: '发布需求',
      description: '发布运营人才或服务商需求，精准对接',
      icon: <Briefcase className="h-6 w-6" />,
      color: '#ec4899',
      bg: 'bg-[#ec4899]/10',
    },
  ]

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 py-20">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#14D1A0]/20">
          <Send className="h-10 w-10 text-[#14D1A0]" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'monospace' }}>
            发布成功！
          </h3>
          <p className="mt-2 text-sm text-slate-400" style={{ fontFamily: 'monospace' }}>
            您的内容已提交，社区管理员将在24小时内审核
          </p>
        </div>
        <button
          onClick={() => {
            setSubmitted(false)
            setCreateType(null)
            setTitle('')
            setContent('')
            setTags([])
          }}
          className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] px-6 py-2.5 text-sm text-slate-300 hover:bg-[rgba(255,255,255,0.1)]"
          style={{ fontFamily: 'monospace' }}
        >
          继续发布
        </button>
      </div>
    )
  }

  if (!createType) {
    return (
      <div className="flex h-full flex-col gap-6">
        <div>
          <h2 className="text-base font-bold text-white" style={{ fontFamily: 'monospace' }}>
            发起内容
          </h2>
          <p className="mt-1 text-xs text-slate-500" style={{ fontFamily: 'monospace' }}>
            选择要创建的内容类型，为社区贡献价值
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CREATE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setCreateType(opt.id)}
              className="flex items-start gap-4 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5 text-left transition hover:border-[rgba(255,255,255,0.16)] hover:bg-[rgba(255,255,255,0.06)]"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${opt.bg}`}>
                <div style={{ color: opt.color }}>{opt.icon}</div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white" style={{ fontFamily: 'monospace' }}>
                  {opt.label}
                </h3>
                <p className="mt-1 text-xs text-slate-500" style={{ fontFamily: 'monospace' }}>
                  {opt.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Community Guidelines */}
        <div className="mt-auto rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4">
          <h4 className="text-xs font-bold text-slate-400" style={{ fontFamily: 'monospace' }}>
            社区公约
          </h4>
          <ul className="mt-2 space-y-1">
            {[
              '尊重他人，友善交流，禁止人身攻击',
              '内容真实，禁止虚假宣传和误导信息',
              '保护隐私，不泄露他人个人信息',
              '鼓励原创，禁止抄袭和未经授权转载',
            ].map((rule, i) => (
              <li key={i} className="flex items-center gap-2 text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>
                <span className="h-1 w-1 rounded-full bg-[#14D1A0]" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  // Content creation form
  const getTypeConfig = () => CREATE_OPTIONS.find((o) => o.id === createType)!

  return (
    <div className="flex h-full flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateType(null)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-slate-400 hover:border-[rgba(255,255,255,0.16)] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white" style={{ fontFamily: 'monospace' }}>
              {getTypeConfig().label}
            </h2>
            <p className="text-[10px] text-slate-500" style={{ fontFamily: 'monospace' }}>
              完善以下信息即可发布
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${getTypeConfig().bg}`}
          style={{ color: getTypeConfig().color, fontFamily: 'monospace' }}
        >
          {getTypeConfig().icon}
          {getTypeConfig().label}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400" style={{ fontFamily: 'monospace' }}>
            标题 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入一个吸引人的标题..."
            className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-[#14D1A0]/50 focus:outline-none"
            style={{ fontFamily: 'monospace' }}
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium text-slate-400" style={{ fontFamily: 'monospace' }}>
            内容 <span className="text-red-400">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="详细描述您想分享的内容..."
            className="h-48 w-full resize-none rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-[#14D1A0]/50 focus:outline-none"
            style={{ fontFamily: 'monospace' }}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400" style={{ fontFamily: 'monospace' }}>
            标签
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] px-2.5 py-1 text-xs text-slate-300"
                style={{ fontFamily: 'monospace' }}
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
                <button onClick={() => handleRemoveTag(tag)} className="ml-0.5 text-slate-500 hover:text-white">
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="添加标签..."
                className="w-24 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-2.5 py-1 text-xs text-white placeholder-slate-600 focus:border-[#14D1A0]/50 focus:outline-none"
                style={{ fontFamily: 'monospace' }}
              />
              <button
                onClick={handleAddTag}
                className="flex h-6 w-6 items-center justify-center rounded-lg border border-dashed border-[rgba(255,255,255,0.12)] text-slate-500 hover:border-[#14D1A0]/50 hover:text-[#14D1A0]"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Platform specific fields */}
        {createType === 'event' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400" style={{ fontFamily: 'monospace' }}>
                活动日期
              </label>
              <input
                type="date"
                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-2.5 text-sm text-white focus:border-[#14D1A0]/50 focus:outline-none"
                style={{ fontFamily: 'monospace', colorScheme: 'dark' }}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400" style={{ fontFamily: 'monospace' }}>
                活动时长
              </label>
              <input
                type="text"
                placeholder="如：2小时"
                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-[#14D1A0]/50 focus:outline-none"
                style={{ fontFamily: 'monospace' }}
              />
            </div>
          </div>
        )}

        {createType === 'talent-demand' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400" style={{ fontFamily: 'monospace' }}>
                预算范围
              </label>
              <input
                type="text"
                placeholder="如：¥5000-10000"
                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-[#14D1A0]/50 focus:outline-none"
                style={{ fontFamily: 'monospace' }}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400" style={{ fontFamily: 'monospace' }}>
                交付周期
              </label>
              <input
                type="text"
                placeholder="如：2周内"
                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-[#14D1A0]/50 focus:outline-none"
                style={{ fontFamily: 'monospace' }}
              />
            </div>
          </div>
        )}

        {/* Attachment hint */}
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-[rgba(255,255,255,0.08)] p-3">
          <button className="flex items-center gap-2 text-xs text-slate-500 hover:text-white" style={{ fontFamily: 'monospace' }}>
            <Image className="h-4 w-4" />
            添加图片
          </button>
          <div className="h-4 w-px bg-[rgba(255,255,255,0.08)]" />
          <span className="text-[10px] text-slate-600" style={{ fontFamily: 'monospace' }}>
            支持 JPG/PNG，最大 5MB
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.06)] pt-4">
        <div className="flex items-center gap-2 text-[10px] text-slate-600" style={{ fontFamily: 'monospace' }}>
          <Clock className="h-3 w-3" />
          内容将经过审核后展示
        </div>
        <button
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim()}
          className="flex items-center gap-2 rounded-xl bg-[#14D1A0] px-6 py-2.5 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-40"
          style={{ fontFamily: 'monospace' }}
        >
          <Send className="h-4 w-4" />
          提交发布
        </button>
      </div>
    </div>
  )
}
