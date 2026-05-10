'use client'
import { useState, useCallback } from 'react'

interface UseActionOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  onFinally?: () => void
}

interface UseActionResult {
  loading: boolean
  error: Error | null
  execute: (...args: unknown[]) => Promise<T | null>
}

export function useAction<T = void>(
  action: (...args: unknown[]) => Promise<T> | T,
  options?: UseActionOptions<T>
): UseActionResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setLoading(true)
      setError(null)
      try {
        const result = await action(...args)
        options?.onSuccess?.(result as T)
        return result as T
      } catch (e) {
        const err = e instanceof Error ? e : new Error(String(e))
        setError(err)
        options?.onError?.(err)
        return null
      } finally {
        setLoading(false)
        options?.onFinally?.()
      }
    },
    [action, options]
  )

  return { loading, error, execute }
}

// Toast通知组件（替代alert）
interface ActionToastProps {
  loading?: boolean
  error?: Error | null
  success?: string
  onClose?: () => void
}

export function ActionToast({ loading, error, success, onClose }: ActionToastProps) {
  if (!loading && !error && !success) return null
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#0a1628]/95 px-5 py-3 shadow-2xl backdrop-blur-md">
      {loading && (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#14D1A0] border-t-transparent" />
          <span className="text-sm text-slate-300">处理中...</span>
        </>
      )}
      {error && (
        <>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20">
            <span className="text-xs text-red-400">✕</span>
          </div>
          <span className="text-sm text-red-400">{error.message}</span>
          <button onClick={onClose} className="ml-2 text-xs text-slate-400 hover:text-white">关闭</button>
        </>
      )}
      {success && !loading && !error && (
        <>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#14D1A0]/20">
            <span className="text-xs text-[#14D1A0]">✓</span>
          </div>
          <span className="text-sm text-[#14D1A0]">{success}</span>
          <button onClick={onClose} className="ml-2 text-xs text-slate-400 hover:text-white">关闭</button>
        </>
      )}
    </div>
  )
}
