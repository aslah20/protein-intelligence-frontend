"use client"

import type { LucideIcon } from "lucide-react"

interface TaskCardProps {
  task: {
    id: number
    name: string
    description: string
    icon: LucideIcon
    color: string
  }
}

export default function ProteinTaskCard({ task }: TaskCardProps) {
  const Icon = task.icon

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative p-6 rounded-lg border border-border/50 bg-card/40 backdrop-blur-sm group-hover:border-accent/50 transition-all duration-300 cursor-pointer">
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${task.color} p-2.5 mb-4 text-white group-hover:scale-110 transition-transform`}
        >
          <Icon className="w-full h-full" />
        </div>
        <h3 className="font-semibold text-foreground mb-2 text-sm">{task.name}</h3>
        <p className="text-xs text-foreground/60 leading-relaxed">{task.description}</p>
        <div className="mt-4 pt-4 border-t border-border/30 text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
          Learn more →
        </div>
      </div>
    </div>
  )
}
