"use client"

import { useEffect, useRef } from "react"

export default function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    let animationFrameId: number
    let time = 0

    const drawProteinNetwork = () => {
      ctx.fillStyle = "rgba(255, 255, 255, 0)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) / 3

      // Draw rotating nodes
      const nodeCount = 7
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2 + time * 0.002
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8)
        gradient.addColorStop(0, "rgba(59, 130, 246, 0.9)")
        gradient.addColorStop(1, "rgba(59, 130, 246, 0.3)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fill()

        // Draw connection lines
        const nextAngle = ((i + 1) / nodeCount) * Math.PI * 2 + time * 0.002
        const nextX = centerX + Math.cos(nextAngle) * radius
        const nextY = centerY + Math.sin(nextAngle) * radius

        const lineGradient = ctx.createLinearGradient(x, y, nextX, nextY)
        lineGradient.addColorStop(0, "rgba(59, 130, 246, 0.5)")
        lineGradient.addColorStop(0.5, "rgba(59, 130, 246, 0.7)")
        lineGradient.addColorStop(1, "rgba(59, 130, 246, 0.5)")
        ctx.strokeStyle = lineGradient
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(nextX, nextY)
        ctx.stroke()
      }

      // Draw central node
      const centralGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 15)
      centralGradient.addColorStop(0, "rgba(59, 130, 246, 1)")
      centralGradient.addColorStop(1, "rgba(59, 130, 246, 0.4)")
      ctx.fillStyle = centralGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2)
      ctx.fill()

      // Draw outer ring with rotation
      const ringRotation = time * 0.0005
      ctx.strokeStyle = "rgba(59, 130, 246, 0.4)"
      ctx.lineWidth = 2
      for (let r = 0; r < 3; r++) {
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(ringRotation + (r * Math.PI * 2) / 3)
        ctx.beginPath()
        ctx.arc(0, 0, radius + 30 + r * 20, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      }

      time++
      animationFrameId = requestAnimationFrame(drawProteinNetwork)
    }

    drawProteinNetwork()

    // Handle window resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-full h-full glow-pulse">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.2))" }}
        />
      </div>
    </div>
  )
}
