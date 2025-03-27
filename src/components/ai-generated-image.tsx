"use client"

import { useEffect, useRef } from "react"

interface AIGeneratedImageProps {
  width: number
  height: number
  className?: string
  theme?: "light" | "dark"
}

export default function AIGeneratedImage({ width, height, className = "", theme = "light" }: AIGeneratedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = width
    canvas.height = height

    // Colors based on theme
    const colors =
      theme === "light"
        ? {
            bg: ["#f0f9ff", "#e0f2fe", "#bae6fd", "#7dd3fc"],
            accent: ["#3b82f6", "#2563eb", "#1d4ed8"],
            dots: "#0284c7",
          }
        : {
            bg: ["#0f172a", "#1e293b", "#334155", "#475569"],
            accent: ["#3b82f6", "#2563eb", "#1d4ed8"],
            dots: "#38bdf8",
          }

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, colors.bg[0])
    gradient.addColorStop(0.3, colors.bg[1])
    gradient.addColorStop(0.6, colors.bg[2])
    gradient.addColorStop(1, colors.bg[3])
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Draw abstract shapes
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const radius = Math.random() * 100 + 50

      const shapeGradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      shapeGradient.addColorStop(0, colors.accent[0] + "33") // 20% opacity
      shapeGradient.addColorStop(0.5, colors.accent[1] + "22") // 13% opacity
      shapeGradient.addColorStop(1, colors.accent[2] + "00") // 0% opacity

      ctx.fillStyle = shapeGradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw grid of dots
    ctx.fillStyle = colors.dots + "66" // 40% opacity
    const spacing = 20
    for (let x = spacing; x < width; x += spacing) {
      for (let y = spacing; y < height; y += spacing) {
        if (Math.random() > 0.7) {
          // Only draw some dots
          const size = Math.random() * 3 + 1
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // Draw some lines
    ctx.strokeStyle = colors.accent[0] + "44" // 27% opacity
    ctx.lineWidth = 2
    for (let i = 0; i < 8; i++) {
      const x1 = Math.random() * width
      const y1 = Math.random() * height
      const x2 = Math.random() * width
      const y2 = Math.random() * height

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    // Draw "AI Interview" text
    ctx.fillStyle = theme === "light" ? "#1e40af" : "#60a5fa"
    ctx.font = "bold 32px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("AI Interview", width / 2, height / 2)

    // Draw subtitle
    ctx.fillStyle = theme === "light" ? "#334155" : "#e2e8f0"
    ctx.font = "18px sans-serif"
    ctx.fillText("Powered by Artificial Intelligence", width / 2, height / 2 + 40)
  }, [width, height, theme])

  return <canvas ref={canvasRef} width={width} height={height} className={className} />
}

