"use client"

import { useState } from "react"
import Link from "next/link"
import { Upload, Zap, FileUp, Download, FileText } from "lucide-react"

interface SequenceResult {
  name: string
  sequence: string
  result: string
  confidence: number
  details: Record<string, string>
}

export default function AnalysisPage() {
  const [fastaSequence, setFastaSequence] = useState("")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [selectedTask, setSelectedTask] = useState<number | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<SequenceResult[]>([])
  const [showResults, setShowResults] = useState(false)

  const tasks = [
    { id: 1, name: "Protein–Ligand Binding Prediction" },
    { id: 2, name: "Protein Localization Prediction"},
    { id: 3, name: "Post Translational Modification" },
    { id: 4, name: "Protein Stability Prediction"},
    { id: 5, name: "Glycosylation Type & Site"},
    // { id: 6, name: "Subcellular Localization", model: "BERT" },
    { id: 7, name: "Immunogenicity Prediction" },
  ]

  const handleTaskSelect = (id: number) => {
    setSelectedTask(selectedTask === id ? null : id)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCsvFile(file)
      setFastaSequence("")
    }
  }

  const handleAnalyze = async () => {

    if ((!fastaSequence.trim() && !csvFile) || selectedTask === null) {
      alert("Please enter sequence or upload CSV and select a task")
      return
    }

    setIsAnalyzing(true)

    try {

      let sequences: string[] = []

      // -------- SINGLE INPUT --------
      if (fastaSequence.trim()) {
        const cleanSequence = fastaSequence
          .replace(/^>.*\n?/, "")
          .replace(/\s/g, "")
          .trim()

        sequences = [cleanSequence]
      }

      // -------- CSV INPUT --------
      if (csvFile) {
        const text = await csvFile.text()

        sequences = text
          .split("\n")
          .map(line => line.trim())
          .filter(line => line.length > 0)
      }

      // -------- SELECT API --------
      let endpoint = ""

      if (selectedTask === 1) {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/predict/binding/`
      } else if (selectedTask === 2) {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/predict/localization/`
      } else if (selectedTask === 7) {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/predict/immunogenicity/`
      } else if (selectedTask === 4) {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/predict/stability/`
      } else if (selectedTask === 3) {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/predict/ptm/`
      } else if (selectedTask === 5) {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/predict/glycosylation/`     
      } else {
        alert("This task is not implemented yet")
        setIsAnalyzing(false)
        return
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sequences })
      })

      const data = await response.json()

      console.log("BACKEND RESPONSE:", data)

      // -------- FORMAT RESULTS --------
      const formattedResults = data.results.map((item: any, index: number) => {

        let formattedPrediction = ""
        let details: Record<string, string> = {}
        let confidence = 0

        // 🔥 TASK 1: BINDING
        if (selectedTask === 1) {

          formattedPrediction = item.binding ? "Binding" : "Non-Binding"

          details = {
            "Binding": item.binding ? "YES" : "NO",
            "Binding Sites": `${item.binding_sites_count} positions`,
            "Positions": item.binding_positions?.join(", ") || "None",
            "Binding Ratio": (item.binding_ratio * 100).toFixed(2) + "%"
          }

          confidence = 0 // not used
        }

        // 🔥 TASK 2: LOCALIZATION
        else if (selectedTask === 2) {

          formattedPrediction = item.prediction

          details = {
            "Predicted Localization": item.prediction,
            "Confidence Score": (item.confidence * 100).toFixed(2) + "%"
          }

          confidence = item.confidence
        }

        // 🔥 TASK 7: IMMUNOGENICITY
        else if (selectedTask === 7) {

          formattedPrediction =
            item.prediction === 1 ? "Immunogenic" : "Non-Immunogenic"

          details = {
            "Prediction": formattedPrediction
          }

          confidence = item.confidence ?? 0
        }


        // 🔥 TASK 3: PTM
        else if (selectedTask === 3) {

          formattedPrediction = item.ptm ? "PTM Present" : "No PTM"

          details = {
            "PTM": item.ptm ? "YES" : "NO",
            "PTM Sites": `${item.ptm_sites_count} positions`,
            "Positions": item.ptm_positions?.join(", ") || "None",
            "PTM Ratio": (item.ptm_ratio * 100).toFixed(2) + "%"
          }

          confidence = 0
        }

        // 🔥 TASK 4: STABILITY
        else if (selectedTask === 4) {

          formattedPrediction = item.prediction.toFixed(4)

          details = {
            "Stability Score": formattedPrediction
          }

          confidence = 0 // not needed
        }

        // 🔥 TASK 5: GLYCOSYLATION
        else if (selectedTask === 5) {

          formattedPrediction =
            item.glyco ? "Glycosylated" : "No Glycosylation"

          details = {
            "Glycosylation": item.glyco ? "YES" : "NO",
            "Sites Count": `${item.glyco_sites_count}`,
            "Positions":
              item.glyco_positions
                ?.map((p:any) => `${p.position} (${p.type})`)
                .join(", ")
              || "None"
          }

          confidence = 0
        }

        return {
          name: `Protein_${index + 1}`,
          sequence: item.sequence.slice(0, 50),
          result: formattedPrediction,
          confidence: confidence,
          details: details
        }
      })

      setResults(formattedResults)
      setShowResults(true)

    } catch (error) {
      console.error("Backend error:", error)
      alert("Failed to connect to backend")
    }

    setIsAnalyzing(false)
  }

  const handleExport = (format: "csv" | "json") => {
    if (results.length === 0) return

    let content = ""
    let filename = ""

    if (format === "csv") {

      // 🔥 TASK 1: BINDING
      if (selectedTask === 1) {
        const headers = [
          "Sequence",
          "Binding",
          "Binding Sites Count",
          "Positions",
          "Binding Ratio (%)"
        ]

        content = headers.join(",") + "\n"

        content += results
          .map((r) => [
            r.sequence,
            r.details["Binding"],
            r.details["Binding Sites"],
            `"${r.details["Positions"]}"`, // wrap for commas
            r.details["Binding Ratio"]
          ].join(","))
          .join("\n")
      }

      // 🔥 TASK 2: LOCALIZATION
      else if (selectedTask === 2) {
        const headers = ["Sequence", "Localization", "Confidence (%)"]

        content = headers.join(",") + "\n"

        content += results
          .map((r) => [
            r.sequence,
            r.result,
            (r.confidence * 100).toFixed(2)
          ].join(","))
          .join("\n")
      }

      // 🔥 TASK 3: PTM
      else if (selectedTask === 3) {

        const headers = [
          "Sequence",
          "PTM",
          "PTM Sites Count",
          "Positions",
          "PTM Ratio (%)"
        ]

        content = headers.join(",") + "\n"

        content += results
          .map((r) => [
            r.sequence,
            r.details["PTM"],
            r.details["PTM Sites"],
            `"${r.details["Positions"]}"`,
            r.details["PTM Ratio"]
          ].join(","))
          .join("\n")
      }

      // 🔥 TASK 4: STABILITY
      else if (selectedTask === 4) {
        const headers = ["Sequence", "Stability Score"]

        content = headers.join(",") + "\n"

        content += results
          .map((r) => [
            r.sequence,
            r.result
          ].join(","))
          .join("\n")
      }

      // 🔥 TASK 5: GLYCOSYLATION
      else if (selectedTask === 5) {

        const headers = [
          "Sequence",
          "Glycosylation",
          "Sites Count",
          "Positions"
        ]

        content = headers.join(",") + "\n"

        content += results
          .map((r) => [
            r.sequence,
            r.details["Glycosylation"],
            r.details["Sites Count"],
            `"${r.details["Positions"]}"`
          ].join(","))
          .join("\n")
      }

      // 🔥 TASK 7: IMMUNOGENICITY
      else if (selectedTask === 7) {
        const headers = ["Sequence", "Prediction"]

        content = headers.join(",") + "\n"

        content += results
          .map((r) => [
            r.sequence,
            r.result
          ].join(","))
          .join("\n")
      }

      filename = "analysis_results.csv"
      if (selectedTask === 1)
        filename = "binding_results.csv"
      else if (selectedTask === 2)
        filename = "localization_results.csv"
      else if (selectedTask === 3)
        filename = "ptm_results.csv"
      else if (selectedTask === 4)
        filename = "stability_results.csv"
      else if (selectedTask === 5)
        filename = "glycosylation_results.csv"
      else if (selectedTask === 7)
        filename = "immunogenicity_results.csv"
    } else {
      content = JSON.stringify(results, null, 2)
      filename = "analysis_results.json"
    }

    const blob = new Blob([content], {
      type: format === "csv" ? "text/csv" : "application/json"
    })

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-background via-blue-50/20 to-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"
          >
            ProteinAI
          </Link>
          <Link href="/" className="text-sm text-foreground/70 hover:text-foreground transition">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Protein Analysis Portal</h1>
          <p className="text-foreground/60">
            Submit protein sequences and select an analysis task to generate AI-powered predictions
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sequence Input Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-8 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <FileUp className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">Input Protein Sequence</h2>
                </div>

                <div className="space-y-4">
                  {/* FASTA Text Area */}
                  <div>
                    <label className="block text-sm font-medium mb-2">FASTA Sequence</label>
                    <textarea
                      value={fastaSequence}
                      onChange={(e) => {
                        setFastaSequence(e.target.value)
                        setCsvFile(null)
                      }}
                      placeholder={`>Protein_Name\nMETVARALVLVLCLAESGNSRVYQVESARLQEQDELVGEEFGAALJUSEFARKLLELGKVQEVSGDPRSKLSPLSKAVDWESFEFHAANEQQZHLAGGKLLPKDGTLYRALFHGRPYADAWVQQELLPYEQVQEFGKLXQFKSGHLEVGR`}
                      className="w-full h-48 p-4 rounded-lg bg-background/50 border border-border/50 text-foreground text-sm font-mono resize-none focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 transition"
                    />
                    <p className="text-xs text-foreground/50 mt-2">
                      Enter protein sequence in FASTA format or paste directly
                    </p>
                  </div>

                  {/* Or Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/30" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-background text-foreground/50">or upload file</span>
                    </div>
                  </div>

                  {/* File Upload Options */}
                  <div className="space-y-2">
                    {/* FASTA Upload */}
                    <label className="block border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-accent/50 hover:bg-accent/10 transition cursor-pointer group/upload">
                      <Upload className="w-8 h-8 text-foreground/50 group-hover/upload:text-accent mx-auto mb-2" />
                      <p className="text-sm font-medium mb-1">Upload FASTA file</p>
                      <p className="text-xs text-foreground/50">(.fasta, .fa, .txt)</p>
                      <input
                        type="file"
                        accept=".fasta,.fa,.txt"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFastaSequence("")
                            setCsvFile(null)
                            // Handle FASTA file
                          }
                        }}
                      />
                    </label>

                    {/* CSV Upload */}
                    <label className="block border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-accent/50 hover:bg-accent/10 transition cursor-pointer group/upload">
                      <FileText className="w-8 h-8 text-foreground/50 group-hover/upload:text-accent mx-auto mb-2" />
                      <p className="text-sm font-medium mb-1">Upload CSV file with multiple sequences</p>
                      <p className="text-xs text-foreground/50">(.csv) - One protein sequence per row</p>
                      <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>

                  {/* File Info */}
                  {csvFile && (
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                      <p className="text-xs text-accent font-medium">
                        ✓ CSV file loaded: {csvFile.name}
                      </p>
                    </div>
                  )}

                  {fastaSequence.trim() && (
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                      <p className="text-xs text-accent font-medium">
                        ✓ Sequence detected: {fastaSequence.replace(/[^A-Z]/g, "").length} amino acids
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Analysis Task */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-8 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Select Analysis Task</h2>
                </div>

                <p className="text-sm text-foreground/60 mb-4">Select one task to analyze</p>

                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleTaskSelect(task.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedTask === task.id
                          ? "border-accent bg-accent/20"
                          : "border-border/50 bg-background/30 hover:border-accent/50"
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{task.name}</p>
                          {/*<p className="text-xs text-foreground/60 mt-1">Model: {task.model}</p>*/}
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${selectedTask === task.id ? "bg-accent border-accent" : "border-border/50"
                            }`}
                        >
                          {selectedTask === task.id && (
                            <div className="w-2 h-2 bg-accent-foreground rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Task Info */}
                {selectedTask && (
                  <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <p className="text-sm text-primary font-medium">
                      ✓ {tasks.find((t) => t.id === selectedTask)?.name} selected
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Run Analysis Button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!fastaSequence.trim() && !csvFile) || selectedTask === null}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Analyzing...
                </span>
              ) : (
                "Run Analysis"
              )}
            </button>

            {/* Results Section */}
            {showResults && results.length > 0 && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-8 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Analysis Results</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExport("csv")}
                        className="px-4 py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition text-sm font-medium flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Export CSV
                      </button>
                      <button
                        onClick={() => handleExport("json")}
                        className="px-4 py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition text-sm font-medium flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Export JSON
                      </button>
                    </div>
                  </div>

                  {/* Results Scroll Container */}
                  <div className="max-h-96 overflow-y-auto space-y-4 pr-4">
                    {results.map((result, index) => (
                      <div key={index} className="p-5 rounded-lg border border-accent/30 bg-accent/5 hover:bg-accent/10 transition">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-foreground">{result.name}</p>
                            <p className="text-xs text-foreground/50 mt-1 font-mono">
                              {result.sequence.substring(0, 50)}...
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                              {result.result}
                            </div>
                            {selectedTask == 2 && (
                              <p className="text-xs text-foreground/60 mt-2">
                                Confidence: {(result.confidence * 100).toFixed(1)}%
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(result.details).map(([key, value]) => (
                            <div key={key} className="p-2 rounded bg-background/30">
                              <p className="text-foreground/60">{key}</p>
                              <p className="font-medium text-foreground">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Info Sidebar */}
          <div className="space-y-6">
            {/* Quick Guide */}
            <div className="p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
              <h3 className="font-semibold mb-4">Quick Guide</h3>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-xs">
                    1
                  </span>
                  <span className="text-foreground/70">Paste your protein sequence in FASTA format</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-xs">
                    2
                  </span>
                  <span className="text-foreground/70">Select the analysis tasks</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-xs">
                    3
                  </span>
                  <span className="text-foreground/70">Click "Run Analysis" to start processing</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-xs">
                    4
                  </span>
                  <span className="text-foreground/70">View interactive results </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-xs">
                    5
                  </span>
                  <span className="text-foreground/70">Export the results</span>
                </li>
              </ol>
            </div>

            {/* About Models 
            <div className="p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
              <h3 className="font-semibold mb-3">Model Architectures</h3>
              <div className="space-y-2 text-xs">
                <p className="text-foreground/70">All tasks leverage state-of-the-art transformer models:</p>
                <ul className="space-y-1 text-foreground/60 ml-2">
                  <li>
                    • <span className="font-mono">BERT</span> - Bidirectional encoding
                  </li>
                  <li>
                    • <span className="font-mono">RoBERTa</span> - Robustly optimized
                  </li>
                  <li>
                    • <span className="font-mono">ELECTRA</span> - Efficiently learned
                  </li>
                  <li>
                    • <span className="font-mono">T5</span> - Text-to-text framework
                  </li>
                </ul>
              </div>
            </div>

            
            <div className="p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
              <h3 className="font-semibold mb-3">Example Proteins</h3>
              <div className="space-y-2 text-xs">
                <button className="w-full p-2 rounded text-left hover:bg-accent/10 transition text-foreground/70 hover:text-foreground">
                  Load: Insulin (51 AA)
                </button>
                <button className="w-full p-2 rounded text-left hover:bg-accent/10 transition text-foreground/70 hover:text-foreground">
                  Load: Lysozyme (130 AA)
                </button>
                <button className="w-full p-2 rounded text-left hover:bg-accent/10 transition text-foreground/70 hover:text-foreground">
                  Load: Hemoglobin (146 AA)
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </main>
  )
}
