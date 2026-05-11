'use client'
import { useState } from 'react'
import { X, Lock, User, ArrowRight, Shield } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onAuthRequired?: () => void
}

interface LoginModalProps {
  onClose: () => void
  onLogin?: (email: string, password: string) => Promise<void>
}

export function LoginRequiredModal({ onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    if (!email || !password) {
      setError('请输入邮箱和密码')
      return
    }
    setLoading(true)
    setError(null)
    try {
      if (onLogin) {
        await onLogin(email, password)
      } else {
        // Mock login - 2s delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        alert(`登录成功（Mock模式）：${email}`)
      }
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : '登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-[420px] overflow-hidden rounded-3xl border border-[rgba(255,255,255,0.1)] bg-[#0a1628] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14D1A0]/10">
              <Lock className="h-5 w-5 text-[#14D1A0]" />
            </div>
            <div>
              <h3 className="font-bold text-white">登录后方可操作</h3>
              <p className="text-xs text-slate-400">Argi 蔚蓝 OPC 平台</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-[#1a2744] hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-6">
          {/* Mock login notice */}
          <div className="flex items-start gap-3 rounded-xl border border-[#14D1A0]/20 bg-[#14D1A0]/5 p-3">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#14D1A0]" />
            <p className="text-xs text-slate-400">
              当前为 <span className="text-[#14D1A0] font-medium">Mock 登录模式</span>，输入任意邮箱密码即可体验完整功能。真实场景需接入 OAuth/SSO。
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">邮箱</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#0a1628]/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-[#14D1A0]/50 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">密码</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#0a1628]/60 py-2.5 px-4 text-sm text-white placeholder-slate-500 outline-none focus:border-[#14D1A0]/50 transition-colors"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14D1A0] py-3 text-sm font-bold text-[#0a1628] hover:bg-[#11b88a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0a1628]/30 border-t-[#0a1628]" />
                登录中...
              </>
            ) : (
              <>
                登录 / 注册
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button className="text-xs text-slate-500 hover:text-slate-300 transition-colors">忘记密码</button>
            <span className="text-slate-600">|</span>
            <button className="text-xs text-slate-500 hover:text-slate-300 transition-colors">注册新账号</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Auth Context (simplified mock) ─────────────────────────────────────────
const MOCK_USER = {
  id: 'user-001',
  name: '演示用户',
  email: 'demo@argi.ai',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  role: 'creator' as const,
}

interface AuthContextValue {
  user: typeof MOCK_USER | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

let authState: { user: typeof MOCK_USER | null } = { user: null }

export function useAuth(): AuthContextValue {
  return {
    user: authState.user,
    isAuthenticated: authState.user !== null,
    login: async (email: string, _password: string) => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      authState.user = { ...MOCK_USER, email }
    },
    logout: () => {
      authState.user = null
    },
  }
}

// ─── AuthGuard ───────────────────────────────────────────────────────────────
export function AuthGuard({ children, fallback, onAuthRequired }: AuthGuardProps) {
  const [showModal, setShowModal] = useState(false)
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <>
      <div onClick={() => {
        setShowModal(true)
        onAuthRequired?.()
      }}>
        {children}
      </div>
      {showModal && (
        <LoginRequiredModal onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
