"use client"

import Link from "next/link"
import { ChevronRight, Beaker, Brain, Zap, Shield, Microscope, Database, GitBranch } from "lucide-react"
import ProteinTaskCard from "@/components/protein-task-card"
import { Chatbot } from "@/components/chatbot"

export default function Home() {
  const tasks = [
    {
      id: 1,
      name: "Protein–Ligand Binding",
      description: "Predict binding sites and affinity",
      icon: Beaker,
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: 2,
      name: "Protein Localization",
      description: "Identify cellular compartments",
      icon: Microscope,
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: 3,
      name: "PTM Prediction",
      description: "Post-translational modifications",
      icon: Zap,
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: 4,
      name: "Protein Stability",
      description: "Resilience and stress analysis",
      icon: Shield,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 5,
      name: "Glycosylation Sites",
      description: "N/O site prediction and mapping",
      icon: GitBranch,
      color: "from-pink-500 to-red-500",
    },
    {
      id: 6,
      name: "Immunogenicity",
      description: "Immunogenic or Non-Immunogenic",
      icon: Brain,
      color: "from-orange-500 to-yellow-500",
    },
  ]

  return (
    <main className="w-full overflow-hidden bg-gradient-to-b from-background via-blue-950/20 to-background">
      <Chatbot />
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            ProteinAI
          </div>
          <div className="flex gap-8 items-center">
            <a href="#how-it-works" className="text-sm text-foreground/70 hover:text-foreground transition">
              How It Works
            </a>
            <a href="#tasks" className="text-sm text-foreground/70 hover:text-foreground transition">
              Tasks
            </a>
            <Link href="/protein-wiki" className="text-sm text-foreground/70 hover:text-foreground transition">
              Protein Wiki
            </Link>
            <Link
              href="/analysis"
              className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition"
            >
              Run Analysis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <div className="flex-1 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/50 text-accent text-xs font-semibold uppercase tracking-wider">
              AI-Powered Biotech Research
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Multi-Task{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text">
                Protein Analysis{" "}
              </span>
              <span className="text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                Platform
              </span>
            </h1>
            <p className="text-lg text-foreground/70 max-w-xl leading-relaxed text-pretty">
              Accelerate drug discovery with AI-powered protein analysis. Leverage six advanced models for
              comprehensive molecular insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/analysis"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
              >
                Run Protein Analysis
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 rounded-lg border border-foreground/30 text-foreground hover:bg-foreground/10 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right side - 3D Animation */}
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-secondary/10 to-transparent"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">Three simple steps to unlock protein insights</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Input Sequence", desc: "Submit protein sequences or upload files", icon: "📝" },
              { step: 2, title: "Run Analysis", desc: "Select analysis types across 6 AI models", icon: "⚙️" },
              { step: 3, title: "Discover", desc: "View interactive results and export reports", icon: "🔬" },
            ].map((item) => (
              <div key={item.step} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm group-hover:border-accent/50 transition-colors">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="text-sm font-semibold text-accent mb-2">Step {item.step}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-foreground/70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tasks Showcase */}
      <section id="tasks" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Six Advanced Analysis Tasks</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              Comprehensive protein characterization with cutting-edge AI models
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <ProteinTaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-primary/30 rounded-2xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-12 rounded-2xl bg-gradient-to-br from-card/80 to-secondary/50 backdrop-blur-xl border border-accent/30 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Accelerate Discovery?</h2>
              <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
                Start analyzing proteins with AI-powered insights today
              </p>
              <Link
                href="/analysis"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
              >
                Launch Analysis Portal
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-background/50 backdrop-blur-sm py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">ProteinAI</h4>
              <p className="text-sm text-foreground/60">AI-powered protein intelligence for drug discovery</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <Link href="/analysis" className="hover:text-foreground transition">
                    Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-foreground transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/protein-wiki" className="hover:text-foreground transition">
                    Protein Wiki
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Research
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/30 pt-8 text-center text-sm text-foreground/50">
            <p>© 2026 Cross-Architecture Protein Intelligence. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
