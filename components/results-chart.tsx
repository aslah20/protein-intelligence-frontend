"use client"

interface ResultsChartProps {
  type: string
  data: any[]
}

export default function ResultsChart({ type, data }: ResultsChartProps) {
  if (type === "binding") {
    return (
      <div className="space-y-3">
        {data.map((site, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>
                {site.residue} @ Position {site.position}
              </span>
              <span className="font-semibold text-accent">{(site.likelihood * 100).toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-background/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                style={{ width: `${site.likelihood * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === "localization") {
    return (
      <div className="space-y-3">
        {data.map((comp, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>{comp.name}</span>
              <span className="font-semibold text-accent">{(comp.probability * 100).toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-background/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${comp.probability * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return <div className="text-sm text-foreground/60">Visualization loading...</div>
}
