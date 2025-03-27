"use client"

import { useEffect, useRef } from "react"

interface PlaceholderImageProps {
  width: number
  height: number
  text?: string
  className?: string
}

export default function PlaceholderImage({
  width,
  height,
  text = "AI Interview",
  className = "",
}: PlaceholderImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = width
    canvas.height = height

    // Draw background
    ctx.fillStyle = "#f3f4f6" // Light gray background
    ctx.fillRect(0, 0, width, height)

    // Draw border
    ctx.strokeStyle = "#d1d5db"
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, width, height)

    // Draw text
    ctx.fillStyle = "#6b7280"
    ctx.font = `${Math.max(16, Math.floor(width / 20))}px sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(text, width / 2, height / 2)

    // Draw dimensions text
    ctx.font = "12px sans-serif"
    ctx.fillText(`${width}×${height}`, width / 2, height / 2 + 30)
  }, [width, height, text])

  return <canvas ref={canvasRef} width={width} height={height} className={className} />
}

