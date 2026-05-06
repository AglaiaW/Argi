'use client'

import { useEffect, useRef, useState } from 'react'

export interface RadarChartDataPoint {
  label: string
  value: number // 0–100
}

export interface RadarChartProps {
  data: RadarChartDataPoint[]
  size?: number
  className?: string
}

export default function RadarChart({ data, size = 280, className = '' }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const cx = size / 2
  const cy = size / 2
  const maxRadius = (size / 2) * 0.78
  const numAxes = data.length
  const angleStep = (2 * Math.PI) / numAxes
  const startAngle = -Math.PI / 2

  function valueToRadius(value: number) {
    return (value / 100) * maxRadius
  }

  function getPoint(index: number, value: number) {
    const angle = startAngle + index * angleStep
    const r = valueToRadius(value)
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, size, size)

    // Draw grid rings
    const gridLevels = [25, 50, 75, 100]
    gridLevels.forEach((level) => {
      const r = (level / 100) * maxRadius
      ctx.beginPath()
      for (let i = 0; i <= numAxes; i++) {
        const angle = startAngle + i * angleStep
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.strokeStyle = 'rgba(255,255,255,0.07)'
      ctx.lineWidth = 1
      ctx.stroke()
    })

    // Draw axis lines
    for (let i = 0; i < numAxes; i++) {
      const angle = startAngle + i * angleStep
      const outerX = cx + maxRadius * Math.cos(angle)
      const outerY = cy + maxRadius * Math.sin(angle)
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(outerX, outerY)
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw data polygon (fill)
    const totalValue = data.reduce((sum, d) => sum + d.value, 0)
    const avgValue = totalValue / data.length
    const isHighAvg = avgValue >= 60

    ctx.beginPath()
    data.forEach((d, i) => {
      const pt = getPoint(i, d.value)
      if (i === 0) ctx.moveTo(pt.x, pt.y)
      else ctx.lineTo(pt.x, pt.y)
    })
    ctx.closePath()

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius)
    if (isHighAvg) {
      gradient.addColorStop(0, 'rgba(16,185,129,0.45)')
      gradient.addColorStop(1, 'rgba(16,185,129,0.08)')
    } else {
      gradient.addColorStop(0, 'rgba(59,130,246,0.4)')
      gradient.addColorStop(1, 'rgba(59,130,246,0.05)')
    }
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw data polygon (stroke)
    ctx.beginPath()
    data.forEach((d, i) => {
      const pt = getPoint(i, d.value)
      if (i === 0) ctx.moveTo(pt.x, pt.y)
      else ctx.lineTo(pt.x, pt.y)
    })
    ctx.closePath()
    ctx.strokeStyle = isHighAvg ? 'rgba(16,185,129,0.9)' : 'rgba(59,130,246,0.85)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw data points
    data.forEach((d, i) => {
      const pt = getPoint(i, d.value)
      const isHovered = hoveredIndex === i
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, isHovered ? 6 : 4, 0, 2 * Math.PI)
      ctx.fillStyle = isHovered
        ? (isHighAvg ? '#10b981' : '#3b82f6')
        : (isHighAvg ? 'rgba(16,185,129,0.8)' : 'rgba(59,130,246,0.75)')
      ctx.fill()
      if (isHovered) {
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })

    // Draw labels
    ctx.font = '11px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    data.forEach((d, i) => {
      const angle = startAngle + i * angleStep
      const labelRadius = maxRadius + 22
      const lx = cx + labelRadius * Math.cos(angle)
      const ly = cy + labelRadius * Math.sin(angle)
      ctx.fillStyle = hoveredIndex === i ? '#ffffff' : 'rgba(255,255,255,0.65)'
      ctx.font = `${hoveredIndex === i ? 'bold' : 'normal'} 11px system-ui, sans-serif`
      ctx.fillText(d.label, lx, ly)
    })
  }, [data, size, hoveredIndex])

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        onMouseMove={(e) => {
          const rect = canvasRef.current?.getBoundingClientRect()
          if (!rect) return
          const mx = e.clientX - rect.left
          const my = e.clientY - rect.top
          // Find closest point
          let closest: number | null = null
          let minDist = 20
          data.forEach((d, i) => {
            const pt = getPoint(i, d.value)
            const dist = Math.hypot(pt.x - mx, pt.y - my)
            if (dist < minDist) {
              minDist = dist
              closest = i
            }
          })
          setHoveredIndex(closest)
        }}
        onMouseLeave={() => setHoveredIndex(null)}
      />
      {hoveredIndex !== null && (
        <div
          className="absolute pointer-events-none left-1/2 -translate-x-1/2 bg-slate-800/95 border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl"
          style={{ bottom: '-2.5rem' }}
        >
          <span className="font-semibold">{data[hoveredIndex].label}:</span>{' '}
          {data[hoveredIndex].value}%
        </div>
      )}
    </div>
  )
}
