"use client"

import { useEffect, useRef } from "react"

export default function CrossArchitectureFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    let time = 0
    let animationFrameId: number

    const drawFlow = () => {
      ctx.fillStyle = "rgba(255, 255, 255, 0)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerY = canvas.height / 2
      const itemWidth = canvas.width / 5
      const positions = [
        { x: itemWidth * 0.5, label: "Input Sequence" },
        { x: itemWidth * 1.5, label: "BERT" },
        { x: itemWidth * 2.5, label: "RoBERTa" },
        { x: itemWidth * 3.5, label: "ELECTRA" },
        { x: itemWidth * 4.5, label: "Results" },
      ]

      // Draw flowing connections
      for (let i = 0; i < positions.length - 1; i++) {
        const from = positions[i]
        const to = positions[i + 1]

        // Base line
        ctx.strokeStyle = "rgba(59, 130, 246, 0.3)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(from.x, centerY)
        ctx.lineTo(to.x, centerY)
        ctx.stroke()

        const flowProgress = (time / 100 + i * 0.2) % 1
        const flowX = from.x + (to.x - from.x) * flowProgress

        ctx.fillStyle = "rgba(59, 130, 246, 0.9)"
        ctx.beginPath()
        ctx.arc(flowX, centerY, 6, 0, Math.PI * 2)
        ctx.fill()

        // Glow
        const gradient = ctx.createRadialGradient(flowX, centerY, 0, flowX, centerY, 15)
        gradient.addColorStop(0, "rgba(59, 130, 246, 0.4)")
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)")
        ctx.fillStyle = gradient
        ctx.fillRect(flowX - 15, centerY - 15, 30, 30)
      }

      // Draw nodes
      positions.forEach((pos, idx) => {
        const gradient = ctx.createRadialGradient(pos.x, centerY, 0, pos.x, centerY, 12)
        const colors = [
          "rgba(107, 114, 128, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(59, 130, 246, 0.8)",
        ]
        gradient.addColorStop(0, colors[idx % colors.length])
        gradient.addColorStop(1, "rgba(59, 130, 246, 0.2)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(pos.x, centerY, 12, 0, Math.PI * 2)
        ctx.fill()

        // Border
        ctx.strokeStyle = "rgba(59, 130, 246, 0.6)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(pos.x, centerY, 12, 0, Math.PI * 2)
        ctx.stroke()
      })

      time++
      animationFrameId = requestAnimationFrame(drawFlow)
    }

    drawFlow()

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
    <div className="w-full space-y-6">
      <canvas
        ref={canvasRef}
        className="w-full h-32"
        style={{ filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.1))" }}
      />
      <div className="grid grid-cols-5 gap-4 text-center text-xs">
        <div className="font-semibold text-foreground/70">Input</div>
        <div className="font-semibold text-blue-600">BERT</div>
        <div className="font-semibold text-purple-600">RoBERTa</div>
        <div className="font-semibold text-orange-600">ELECTRA</div>
        <div className="font-semibold text-accent">Output</div>
      </div>
    </div>
  )
}
