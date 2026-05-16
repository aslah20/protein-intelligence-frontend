"use client"

import { useState } from "react"
import Link from "next/link"
import { Download, Share2, FileJson, FileText } from "lucide-react"
import ProteinViewer3D from "@/components/protein-viewer-3d"
import ResultsChart from "@/components/results-chart"
import ConfidenceGauge from "@/components/confidence-gauge"

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState("binding")
  const [showDetails, setShowDetails] = useState(true)

  const mockResults = {
    sequence: {
      name: "Protein_Analysis_001",
      length: 256,
      uploadedAt: new Date().toLocaleDateString(),
    },
    confidence: 0.892,
    results: {
      binding: {
        title: "Protein–Ligand Binding Prediction",
        model: "ELECTRA",
        confidence: 0.912,
        bindingSites: [
          { position: 45, likelihood: 0.95, residue: "ARG" },
          { position: 78, likelihood: 0.87, residue: "LYS" },
          { position: 156, likelihood: 0.82, residue: "ASP" },
        ],
        affinity: "High",
        description: "Model predicts 3 primary binding sites with high confidence",
      },
      localization: {
        title: "Protein Localization Prediction",
        model: "BERT",
        confidence: 0.856,
        compartments: [
          { name: "Cytoplasm", probability: 0.65 },
          { name: "Mitochondria", probability: 0.25 },
          { name: "Nucleus", probability: 0.1 },
        ],
        primary: "Cytoplasm",
        description: "Prediction indicates cytoplasmic localization",
      },
      ptm: {
        title: "Post-Translational Modification",
        model: "RoBERTa",
        confidence: 0.834,
        modifications: [
          { type: "Phosphorylation", count: 5, sites: [23, 45, 89, 156, 198] },
          { type: "Acetylation", count: 3, sites: [12, 67, 201] },
          { type: "Ubiquitination", count: 2, sites: [110, 220] },
        ],
        description: "Multiple PTM sites identified across the protein",
      },
      stability: {
        title: "Protein Stability Prediction",
        model: "T5",
        confidence: 0.878,
        stability: "Moderate",
        score: 0.68,
        factors: [
          { factor: "Hydrophobic Content", rating: "High" },
          { factor: "Disulfide Bonds", rating: "Moderate" },
          { factor: "Structural Integrity", rating: "High" },
        ],
        description: "Protein shows moderate thermal stability",
      },
      glycosylation: {
        title: "Glycosylation Type & Site",
        model: "ELECTRA",
        confidence: 0.801,
        nSites: [
          { position: 34, motif: "N-X-S/T", confidence: 0.92 },
          { position: 127, motif: "N-X-S/T", confidence: 0.88 },
        ],
        oSites: [{ position: 89, motif: "S/T", confidence: 0.78 }],
        description: "2 N-glycosylation and 1 O-glycosylation sites predicted",
      },
      subcellular: {
        title: "Subcellular Localization",
        model: "BERT",
        confidence: 0.867,
        location: "Cytoplasm",
        signals: [
          { signal: "No Signal Peptide", detected: true },
          { signal: "Transmembrane Domain", detected: false },
          { signal: "Nuclear Localization", detected: false },
        ],
        description: "Cytoplasmic protein with no membrane-targeting signals",
      },
      immunogenicity: {
        title: "Immunogenicity Prediction",
        model: "RoBERTa",
        confidence: 0.723,
        epitopes: [
          { position: 12, length: 9, score: 0.89, sequence: "MVGTAVLVL" },
          { position: 45, length: 9, score: 0.76, sequence: "RKLSPLSKA" },
          { position: 103, length: 9, score: 0.68, sequence: "FEKHGPYAD" },
        ],
        risk: "Moderate",
        description: "3 predicted B-cell epitopes with varying immunogenicity",
      },
    },
  }

  const tabs = [
    { id: "binding", label: "Ligand Binding", icon: "🧬" },
    { id: "localization", label: "Localization", icon: "📍" },
    { id: "ptm", label: "PTM", icon: "✨" },
    { id: "stability", label: "Stability", icon: "🛡️" },
    { id: "glycosylation", label: "Glycosylation", icon: "🔗" },
    { id: "subcellular", label: "Subcellular", icon: "🎯" },
    { id: "immunogenicity", label: "Immunogenicity", icon: "⚠️" },
  ]

  const currentResult = mockResults.results[activeTab as keyof typeof mockResults.results]

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-background via-blue-950/20 to-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
          >
            ProteinAI
          </Link>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg border border-border/50 hover:bg-background/50 transition text-sm flex items-center gap-2">
              <Download className="w-4 h-4" />
              PDF Report
            </button>
            <button className="px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition text-sm font-medium">
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Sequence Info & Confidence */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Left: Main Results */}
          <div className="lg:col-span-2 space-y-8">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                <p className="text-xs text-foreground/60 mb-2 uppercase tracking-wider">Protein Sequence</p>
                <p className="text-lg font-bold">{mockResults.sequence.name}</p>
                <p className="text-xs text-foreground/60 mt-2">{mockResults.sequence.length} amino acids</p>
              </div>
              <div className="p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                <p className="text-xs text-foreground/60 mb-2 uppercase tracking-wider">Analysis Date</p>
                <p className="text-lg font-bold">{mockResults.sequence.uploadedAt}</p>
                <p className="text-xs text-foreground/60 mt-2">7 tasks completed</p>
              </div>
            </div>

            {/* Overall Confidence */}
            <div className="p-8 rounded-xl border border-accent/30 bg-gradient-to-br from-accent/20 to-primary/10 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Overall Prediction Confidence</h2>
                <span className="text-3xl font-bold text-accent">{(mockResults.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-background/50 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000"
                  style={{ width: `${mockResults.confidence * 100}%` }}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 border-b border-border/30">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 rounded-lg whitespace-nowrap text-sm font-medium transition-all border border-transparent ${
                    activeTab === tab.id
                      ? "bg-accent/20 border-accent/50 text-accent"
                      : "text-foreground/60 hover:text-foreground/90"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Active Result */}
            <div className="space-y-6">
              {/* Result Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{currentResult.title}</h2>
                  <p className="text-sm text-foreground/60">
                    Model: <span className="font-mono font-semibold text-accent">{currentResult.model}</span>
                  </p>
                </div>
                <ConfidenceGauge value={currentResult.confidence} />
              </div>

              {/* Visualization */}
              <div className="p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                {activeTab === "binding" && (
                  <div className="space-y-4">
                    <ResultsChart type="binding" data={currentResult.bindingSites} />
                    <div className="p-4 rounded-lg bg-background/50 border border-border/30">
                      <p className="text-sm text-foreground/80">{currentResult.description}</p>
                      <p className="text-xs text-foreground/60 mt-2">
                        Predicted Affinity: <span className="font-semibold text-accent">{currentResult.affinity}</span>
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "localization" && (
                  <div className="space-y-4">
                    <ResultsChart type="localization" data={currentResult.compartments} />
                    <div className="p-4 rounded-lg bg-background/50 border border-border/30">
                      <p className="text-sm text-foreground/80">{currentResult.description}</p>
                      <p className="text-xs text-foreground/60 mt-2">
                        Primary Location: <span className="font-semibold text-accent">{currentResult.primary}</span>
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "ptm" && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      {currentResult.modifications.map((mod, idx) => (
                        <div key={idx} className="p-4 rounded-lg border border-border/30 bg-background/30">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold">{mod.type}</p>
                            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                              {mod.count} sites
                            </span>
                          </div>
                          <p className="text-xs text-foreground/60">Positions: {mod.sites.join(", ")}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 rounded-lg bg-background/50 border border-border/30">
                      <p className="text-sm text-foreground/80">{currentResult.description}</p>
                    </div>
                  </div>
                )}

                {activeTab === "stability" && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border border-border/30 bg-background/30">
                        <p className="text-xs text-foreground/60 mb-2">Stability Score</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold">{(currentResult.score * 100).toFixed(0)}</span>
                          <span className="text-foreground/60">/100</span>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg border border-border/30 bg-background/30">
                        <p className="text-xs text-foreground/60 mb-2">Classification</p>
                        <p className="text-2xl font-bold text-accent">{currentResult.stability}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {currentResult.factors.map((f, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30"
                        >
                          <p className="text-sm">{f.factor}</p>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              f.rating === "High"
                                ? "bg-green-500/20 text-green-400"
                                : f.rating === "Moderate"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {f.rating}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "glycosylation" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-sm">N-Glycosylation Sites</h4>
                      <div className="space-y-2">
                        {currentResult.nSites.map((site, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-background/50 border border-border/30">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-sm">{site.motif}</span>
                              <span className="text-xs text-foreground/60">Position {site.position}</span>
                            </div>
                            <div className="mt-2 h-1 bg-background rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-500" style={{ width: `${site.confidence * 100}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-sm">O-Glycosylation Sites</h4>
                      <div className="space-y-2">
                        {currentResult.oSites.map((site, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-background/50 border border-border/30">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-sm">{site.motif}</span>
                              <span className="text-xs text-foreground/60">Position {site.position}</span>
                            </div>
                            <div className="mt-2 h-1 bg-background rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500" style={{ width: `${site.confidence * 100}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "subcellular" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-background/50 border border-border/30">
                      <p className="text-xs text-foreground/60 mb-1">Primary Location</p>
                      <p className="text-xl font-bold text-accent">{currentResult.location}</p>
                    </div>
                    <div className="space-y-2">
                      {currentResult.signals.map((signal, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30"
                        >
                          <p className="text-sm">{signal.signal}</p>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              signal.detected ? "bg-green-500/20 text-green-400" : "bg-foreground/10 text-foreground/60"
                            }`}
                          >
                            {signal.detected ? "Detected" : "Not Detected"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "immunogenicity" && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border border-border/30 bg-background/30">
                        <p className="text-xs text-foreground/60 mb-2">Epitope Count</p>
                        <p className="text-3xl font-bold">{currentResult.epitopes.length}</p>
                      </div>
                      <div className="p-4 rounded-lg border border-border/30 bg-background/30">
                        <p className="text-xs text-foreground/60 mb-2">Immunogenicity Risk</p>
                        <p
                          className={`text-xl font-bold ${currentResult.risk === "High" ? "text-red-400" : currentResult.risk === "Moderate" ? "text-yellow-400" : "text-green-400"}`}
                        >
                          {currentResult.risk}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {currentResult.epitopes.map((epitope, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-background/50 border border-border/30">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-xs text-foreground/60 mb-1">Position {epitope.position}</p>
                              <p className="font-mono text-sm">{epitope.sequence}</p>
                            </div>
                            <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-semibold">
                              {(epitope.score * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-1 bg-background rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500" style={{ width: `${epitope.score * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Export Options */}
              <div className="p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                <h3 className="font-semibold mb-4">Export Options</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <button className="p-3 rounded-lg border border-border/50 hover:bg-background/50 transition text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    PDF Report
                  </button>
                  <button className="p-3 rounded-lg border border-border/50 hover:bg-background/50 transition text-sm font-medium flex items-center gap-2">
                    <FileJson className="w-4 h-4" />
                    JSON Data
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* 3D Protein Viewer */}
            <div className="p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
              <h3 className="font-semibold mb-4">3D Protein Structure</h3>
              <div className="h-64 rounded-lg bg-background/50 border border-border/30 flex items-center justify-center">
                <ProteinViewer3D />
              </div>
              <p className="text-xs text-foreground/60 mt-3">Interactive 3D visualization of protein structure</p>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-border/50 bg-card/40 backdrop-blur-sm">
                <p className="text-xs text-foreground/60 mb-2 uppercase tracking-wider">Total Predictions</p>
                <p className="text-2xl font-bold">7</p>
              </div>
              <div className="p-4 rounded-lg border border-border/50 bg-card/40 backdrop-blur-sm">
                <p className="text-xs text-foreground/60 mb-2 uppercase tracking-wider">Analysis Time</p>
                <p className="text-2xl font-bold">2.3s</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button className="w-full p-3 rounded-lg bg-accent/20 border border-accent/30 text-accent hover:bg-accent/30 transition text-sm font-medium flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Share Results
              </button>
              <Link
                href="/analysis"
                className="block p-3 rounded-lg border border-border/50 hover:bg-background/50 transition text-sm font-medium text-center"
              >
                New Analysis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
