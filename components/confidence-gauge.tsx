"use client"

interface ConfidenceGaugeProps {
  value: number // 0-1
}

export default function ConfidenceGauge({ value }: ConfidenceGaugeProps) {
  const percentage = value * 100
  const color = percentage > 80 ? "text-green-400" : percentage > 60 ? "text-yellow-400" : "text-red-400"

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-16 h-16 rounded-full border-4 border-border/50 flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, var(--color-accent) 0deg, var(--color-accent) ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`,
          }}
        />
        <div className="absolute inset-1 rounded-full bg-background" />
        <span className={`font-bold text-lg ${color}`}>{percentage.toFixed(0)}%</span>
      </div>
      <span className="text-xs text-foreground/60 font-medium">Confidence</span>
    </div>
  )
}
