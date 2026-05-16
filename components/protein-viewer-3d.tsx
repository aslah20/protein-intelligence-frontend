"use client"

import { useEffect, useRef } from "react"

export default function ProteinViewer3D() {
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

    const drawProtein = () => {
      ctx.fillStyle = "rgba(255, 255, 255, 0)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw helix structure
      const helixRadius = 30
      const points = 40

      ctx.strokeStyle = "rgba(59, 130, 246, 0.9)"
      ctx.lineWidth = 2
      ctx.beginPath()

      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 8 + time * 0.02
        const y = (i / points) * 80 - 40
        const x = Math.cos(angle) * helixRadius

        const screenX = centerX + x
        const screenY = centerY + y

        if (i === 0) ctx.moveTo(screenX, screenY)
        else ctx.lineTo(screenX, screenY)
      }
      ctx.stroke()

      ctx.strokeStyle = "rgba(168, 85, 247, 0.7)"
      ctx.beginPath()
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 8 + Math.PI + time * 0.02
        const y = (i / points) * 80 - 40
        const x = Math.cos(angle) * helixRadius

        const screenX = centerX + x
        const screenY = centerY + y

        if (i === 0) ctx.moveTo(screenX, screenY)
        else ctx.lineTo(screenX, screenY)
      }
      ctx.stroke()

      time++
      animationFrameId = requestAnimationFrame(drawProtein)
    }

    drawProtein()

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
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-lg"
      style={{ filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.2))" }}
    />
  )
}
