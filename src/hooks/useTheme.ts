/**
 * Unified Theme System for Argi OPC Platform
 * Provides consistent dark/light theme tokens across all modules.
 *
 * Usage:
 *   import { useTheme, THEME_TOKENS } from '@/hooks/useTheme'
 *   const { theme, toggleTheme, colors } = useTheme()
 */

import { useState, useEffect, useCallback, useMemo } from 'react'

export type Theme = 'dark' | 'light'

export interface ThemeColors {
  bg: string
  bgSecondary: string
  bgTertiary: string
  text: string
  textSecondary: string
  textMuted: string
  card: string
  cardHover: string
  border: string
  accent: string
  accentHover: string
}

export const THEME_TOKENS: Record<Theme, ThemeColors> = {
  dark: {
    bg: '#0A1628',
    bgSecondary: '#0f172a',
    bgTertiary: '#1e293b',
    text: '#E2E8F0',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    card: '#0f172a',
    cardHover: '#1e293b',
    border: '#1e293b',
    accent: '#14D1A0',
    accentHover: '#10b88a',
  },
  light: {
    bg: '#FFFFFF',
    bgSecondary: '#F8FAFC',
    bgTertiary: '#F1F5F9',
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    card: '#FFFFFF',
    cardHover: '#F8FAFC',
    border: '#E2E8F0',
    accent: '#14D1A0',
    accentHover: '#10b88a',
  },
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) {
      setTheme(stored)
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light')
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      return next
    })
  }, [])

  const colors = useMemo(() => THEME_TOKENS[theme], [theme])

  return { theme, setTheme, toggleTheme, colors }
}
