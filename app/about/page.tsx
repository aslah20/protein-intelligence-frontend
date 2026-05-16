"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, Github as GitHub, Linkedin, Mail } from "lucide-react"
import ModelCard from "@/components/model-card"
import CrossArchitectureFlow from "@/components/cross-architecture-flow"
import { Chatbot } from "@/components/chatbot"

export default function AboutPage() {
  {/*const models = [
    {
      id: 1,
      name: "BERT",
      fullName: "Bidirectional Encoder Representations from Transformers",
      tasks: ["Protein Localization", "Subcellular Localization"],
      description:
        "Pre-trained bidirectional transformer model that captures contextual information from both directions in protein sequences.",
      strengths: ["Contextual understanding", "Transfer learning", "Multi-task capability"],
      color: "from-blue-500 to-cyan-500",
      paper: "https://arxiv.org/abs/1810.04805",
    },
    {
      id: 2,
      name: "RoBERTa",
      fullName: "Robustly Optimized BERT Pretraining Approach",
      tasks: ["PTM Prediction", "Immunogenicity Prediction"],
      description:
        "Improved BERT model with optimized pretraining approach, achieving better performance across various NLP and sequence analysis tasks.",
      strengths: ["Improved robustness", "Better generalization", "Enhanced accuracy"],
      color: "from-purple-500 to-pink-500",
      paper: "https://arxiv.org/abs/1907.11692",
    },
    {
      id: 3,
      name: "ELECTRA",
      fullName: "Efficiently Learning an Encoder that Classifies Token Replacements Accurately",
      tasks: ["Ligand Binding Prediction", "Glycosylation Sites"],
      description:
        "Novel pre-training approach using discriminative tasks instead of masked language modeling for more efficient learning.",
      strengths: ["Efficient training", "Better performance", "Lower computational cost"],
      color: "from-orange-500 to-red-500",
      paper: "https://arxiv.org/abs/2003.10555",
    },
    {
      id: 4,
      name: "T5",
      fullName: "Text-to-Text Transfer Transformer",
      tasks: ["Protein Stability Prediction"],
      description:
        "Unified framework treating all NLP tasks as text-to-text problems, enabling flexible and powerful sequence-to-sequence modeling.",
      strengths: ["Versatile framework", "Multi-task learning", "Sequence-to-sequence"],
      color: "from-yellow-500 to-orange-500",
      paper: "https://arxiv.org/abs/1910.10683",
    },
  ]*/}

  const tasks = [
    {
      number: "01",
      name: "Protein–Ligand Binding Prediction",
      description:
        "Predict binding sites and binding affinity between proteins and small molecule ligands. Uses ESM architecture to identify key residues involved in molecular recognition.",
      applications: ["Drug discovery", "Lead optimization", "Molecular docking"],
    },
    {
      number: "02",
      name: "Protein Localization Prediction",
      description:
        "Determine subcellular compartment localization using ProtBERT-based classification. Helps understand protein function and cellular organization.",
      applications: ["Cell biology", "Function annotation", "Disease research"],
    },
    {
      number: "03",
      name: "Post-Translational Modification",
      description:
        "Identify PTM sites including phosphorylation, acetylation, and ubiquitination using ESM. Essential for understanding protein regulation.",
      applications: ["Proteomics", "Signal transduction", "Biomarker discovery"],
    },
    {
      number: "04",
      name: "Protein Stability Prediction",
      description:
        "Predict thermal stability and structural integrity using ESM architecture. Important for protein engineering and therapeutics development.",
      applications: ["Protein engineering", "Vaccine design", "Biopharmaceutics"],
    },
    {
      number: "05",
      name: "Glycosylation Type & Site",
      description:
        "Predict N- and O-linked glycosylation sites using ProtBERT. Critical for protein modification and pharmaceutical development.",
      applications: ["Glycoprotein analysis", "Drug modification", "Quality control"],
    },
    {
      number: "06",
      name: "Immunogenicity Prediction",
      description:
        "Predict whether a given protein is immunogenic or non-immunogenic using a binary classification approach. Leverages the ProtBERT architecture to learn protein sequence representations and identify patterns associated with immune response activation.",
      applications: ["Vaccine candidate screening", "Biotherapeutic safety assessment", "Immunogenic risk prediction"],
    },
  ]

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-background via-blue-950/20 to-background">
      <Chatbot />
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
          >
            ProteinAI
          </Link>
          <Link href="/" className="text-sm text-foreground/70 hover:text-foreground transition">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse opacity-30" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
              About{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text">
                Multi-Task
              </span>{" "}
              Protein Analysis
            </h1>
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              Leveraging state-of-the-art transformer architectures for comprehensive protein analysis and drug
              discovery. Our platform combines multiple cutting-edge models to provide unprecedented insights into
              protein structure, function, and interactions.
            </p>
          </div>
        </div>
      </section>

      {/* Core Models Section */}
      {/*<section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4">Foundation Models</h2>
            <p className="text-foreground/60 text-lg">Four powerful transformer architectures working in concert</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {models.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </div>
      </section>*/}

      {/* Cross-Architecture Learning */}
      {/*<section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Cross-Architecture Learning Pipeline</h2>
            <p className="text-foreground/60">How different models collaborate for superior predictions</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur-3xl" />
            <div className="relative p-12 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm">
              <CrossArchitectureFlow />
            </div>
          </div>
        </div>
      </section>*/}

      {/* Analysis Tasks */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-secondary/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4">Six Analysis Tasks</h2>
            <p className="text-foreground/60">Comprehensive protein characterization across multiple domains</p>
          </div>

          <div className="space-y-6">
            {tasks.map((task, idx) => (
              <div key={task.number} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-8 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm group-hover:border-accent/50 transition-colors">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-white">
                        {task.number}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{task.name}</h3>
                      <p className="text-foreground/70 mb-4">{task.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {task.applications.map((app) => (
                          <span
                            key={app}
                            className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium"
                          >
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4">Technology Stack</h2>
            <p className="text-foreground/60">Built on modern, scalable infrastructure</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Frontend</h3>
              <ul className="space-y-2 text-foreground/70 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  TypeScript + Next.js 
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  React + Tailwind CSS
                </li>
                {/*<li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  React + Tailwind CSS
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  Canvas 3D Rendering
                </li>*/}
              </ul>
            </div>

            <div className="p-8 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Backend & Database</h3>
              <ul className="space-y-2 text-foreground/70 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  Python + FastAPI
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  Supabase (PostgreSQL, Auth, RLS)
                </li>
                {/*<li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  S
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  GPU Acceleration
                </li>*/}
              </ul>
            </div>

            <div className="p-8 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">DL Architecture</h3>
              <ul className="space-y-2 text-foreground/70 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  ProtBERT
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  ESM
                </li>
                {/*<li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  Real-time Processing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  Secure Data Handling
                </li>*/}
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* References */}
      {/*
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-secondary/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4">Research & References</h2>
            <p className="text-foreground/60">Built on peer-reviewed scientific research</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="https://arxiv.org/abs/1810.04805"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm hover:border-accent/50 transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold">BERT: Pre-training of Deep Bidirectional Transformers</h3>
                <ArrowRight className="w-5 h-5 text-foreground/50 group-hover:text-accent transition" />
              </div>
              <p className="text-sm text-foreground/60">Devlin et al., 2018</p>
            </a>

            <a
              href="https://arxiv.org/abs/1907.11692"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm hover:border-accent/50 transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold">RoBERTa: A Robustly Optimized BERT Pretraining Approach</h3>
                <ArrowRight className="w-5 h-5 text-foreground/50 group-hover:text-accent transition" />
              </div>
              <p className="text-sm text-foreground/60">Liu et al., 2019</p>
            </a>

            <a
              href="https://arxiv.org/abs/2003.10555"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm hover:border-accent/50 transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold">
                  ELECTRA: Pre-training Text Encoders as Discriminators Rather Than Generators
                </h3>
                <ArrowRight className="w-5 h-5 text-foreground/50 group-hover:text-accent transition" />
              </div>
              <p className="text-sm text-foreground/60">Clark et al., 2020</p>
            </a>

            <a
              href="https://arxiv.org/abs/1910.10683"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm hover:border-accent/50 transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold">
                  Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer
                </h3>
                <ArrowRight className="w-5 h-5 text-foreground/50 group-hover:text-accent transition" />
              </div>
              <p className="text-sm text-foreground/60">Raffel et al., 2019</p>
            </a>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-primary/30 rounded-2xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-12 rounded-2xl bg-gradient-to-br from-card/80 to-secondary/50 backdrop-blur-xl border border-accent/30 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Explore Protein Science?</h2>
              <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
                Start using our AI-powered analysis platform for cutting-edge protein research
              </p>
              <Link
                href="/analysis"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
              >
                Launch Analysis Portal
                <ArrowRight className="w-5 h-5" />
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
              <p className="text-sm text-foreground/60">Advancing drug discovery through AI-powered protein analysis</p>
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
                  <Link href="/contact" className="hover:text-foreground transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <a href="#" className="hover:text-foreground transition flex items-center gap-2">
                    <BookOpen className="w-3 h-3" /> Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition flex items-center gap-2">
                    <GitHub className="w-3 h-3" /> GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <a href="#" className="hover:text-foreground transition flex items-center gap-2">
                    <Linkedin className="w-3 h-3" /> LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Email
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
