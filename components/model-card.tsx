"use client"

import { ExternalLink } from "lucide-react"

interface ModelCardProps {
  model: {
    id: number
    name: string
    fullName: string
    tasks: string[]
    description: string
    strengths: string[]
    color: string
    paper: string
  }
}

export default function ModelCard({ model }: ModelCardProps) {
  return (
    <div className="group relative">
      <div
        className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-lg"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(${model.color === "from-blue-500 to-cyan-500" ? "59, 130, 246, 0.2" : model.color === "from-purple-500 to-pink-500" ? "168, 85, 247, 0.2" : model.color === "from-orange-500 to-red-500" ? "249, 115, 22, 0.2" : "234, 179, 8, 0.2"})`,
        }}
      />
      <div className="relative p-8 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm group-hover:border-accent/50 transition-all">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${model.color} p-2.5 mb-4 text-white`}>
          <div className="text-2xl font-bold">Σ</div>
        </div>

        <h3 className="text-lg font-bold mb-1">{model.name}</h3>
        <p className="text-xs text-foreground/60 mb-4 font-mono">{model.fullName}</p>

        <p className="text-sm text-foreground/70 mb-4">{model.description}</p>

        <div className="mb-4">
          <p className="text-xs font-semibold text-foreground/60 mb-2 uppercase tracking-wider">Key Tasks</p>
          <div className="space-y-1">
            {model.tasks.map((task) => (
              <p key={task} className="text-xs text-foreground/60 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                {task}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-4 p-3 rounded-lg bg-background/50 border border-border/30">
          <p className="text-xs font-semibold text-foreground/60 mb-2 uppercase tracking-wider">Strengths</p>
          <ul className="space-y-1">
            {model.strengths.map((strength) => (
              <li key={strength} className="text-xs text-foreground/70 flex items-center gap-2">
                <span className="text-accent">✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <a
          href={model.paper}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-medium text-accent hover:text-accent/80 transition"
        >
          Read Paper
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
