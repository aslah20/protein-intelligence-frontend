"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  Upload,
  FileText,
  BookOpen,
  Database,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  ExternalLink,
} from "lucide-react"

type ContentType = "dataset" | "article" | "essay" | "paper" | "other"

interface Publication {
  id: number
  title: string
  author: string
  type: ContentType
  date: string
  description: string
  fileUrl: string
}

export default function ResearchersPortalPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [contentType, setContentType] = useState<ContentType>("dataset")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [authorEmail, setAuthorEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock published content (approved by admin)
  const [publications] = useState<Publication[]>([
    {
      id: 1,
      title: "Comprehensive Protein Binding Dataset",
      author: "Dr. Sarah Johnson",
      type: "dataset",
      date: "2025-01-15",
      description: "A curated dataset of 10,000 protein-ligand binding interactions with validated annotations.",
      fileUrl: "#",
    },
    {
      id: 2,
      title: "Novel Approaches to PTM Prediction",
      author: "Prof. Michael Chen",
      type: "paper",
      date: "2025-01-10",
      description: "Research paper exploring machine learning methods for post-translational modification prediction.",
      fileUrl: "#",
    },
    {
      id: 3,
      title: "Understanding Protein Stability",
      author: "Dr. Emily Rodriguez",
      type: "article",
      date: "2025-01-05",
      description: "An in-depth article discussing factors affecting protein stability and prediction methods.",
      fileUrl: "#",
    },
  ])

  const contentTypes = [
    { value: "dataset" as ContentType, label: "Dataset", icon: Database },
    { value: "article" as ContentType, label: "Article", icon: FileText },
    { value: "essay" as ContentType, label: "Essay", icon: BookOpen },
    { value: "paper" as ContentType, label: "Research Paper", icon: FileText },
    { value: "other" as ContentType, label: "Other", icon: Upload },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedFile || !title || !authorName || !description || !authorEmail) {
      setError("Please fill in all required fields and select a file")
      return
    }

    setIsSubmitting(true)

    try {
      const emailSubject = `[ProteinAI Portal] New ${contentType} Submission: ${title}`
      const emailBody = `New Research Submission for Review

Content Type: ${contentType.toUpperCase()}
Title: ${title}
Author: ${authorName}
Author Email: ${authorEmail}

Description:
${description}

File to attach: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)

---
Please review and approve this submission for publication on the Researcher's Portal.`

      const mailtoLink = `mailto:proteinanalysisfyp@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`

      window.location.href = mailtoLink

      setShowSuccess(true)

      // Reset form
      setSelectedFile(null)
      setTitle("")
      setDescription("")
      setAuthorName("")
      setAuthorEmail("")
      setContentType("dataset")

      // Hide success message after 10 seconds
      setTimeout(() => setShowSuccess(false), 10000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during submission")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTypeColor = (type: ContentType) => {
    const colors = {
      dataset: "bg-blue-500/20 text-blue-600 border-blue-500/30",
      article: "bg-green-500/20 text-green-600 border-green-500/30",
      essay: "bg-purple-500/20 text-purple-600 border-purple-500/30",
      paper: "bg-orange-500/20 text-orange-600 border-orange-500/30",
      other: "bg-gray-500/20 text-gray-600 border-gray-500/30",
    }
    return colors[type] || colors.other
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-background via-blue-50/20 to-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
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
        {/* Title Section */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Upload className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Researcher's Portal</h1>
          </div>
          <p className="text-foreground/60 max-w-3xl mx-auto">
            Share your protein research with the community. Upload datasets, articles, essays, or research papers. All
            submissions are reviewed by our admin team before publication.
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-8 p-4 rounded-lg bg-green-500/20 border border-green-500/50 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-green-600">Submission Initiated!</p>
              <p className="text-sm text-foreground/70 mt-1">
                Your email client should have opened with the submission details. Please{" "}
                <strong>attach your file</strong> to the email and send it to{" "}
                <strong>proteinanalysisfyp@gmail.com</strong> for review.
              </p>
              <p className="text-sm text-foreground/70 mt-2">
                If your email client didn't open, please manually send your submission to{" "}
                <a href="mailto:proteinanalysisfyp@gmail.com" className="text-accent hover:underline">
                  proteinanalysisfyp@gmail.com
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-500/20 border border-red-500/50 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-600">Submission Error</p>
              <p className="text-sm text-foreground/70 mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Submission Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Form */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-8 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                <h2 className="text-xl font-semibold mb-6">Submit Your Research</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Content Type Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Content Type *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {contentTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setContentType(type.value)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            contentType === type.value
                              ? "border-accent bg-accent/20"
                              : "border-border/50 bg-background/30 hover:border-accent/50"
                          }`}
                        >
                          <type.icon className="w-5 h-5 mx-auto mb-2" />
                          <p className="text-xs font-medium">{type.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-2">
                      Title *
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a descriptive title"
                      className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent transition"
                      required
                    />
                  </div>

                  {/* Author Name */}
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium mb-2">
                      Author Name *
                    </label>
                    <input
                      id="author"
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Your name or organization"
                      className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent transition"
                      required
                    />
                  </div>

                  {/* Author Email */}
                  <div>
                    <label htmlFor="authorEmail" className="block text-sm font-medium mb-2">
                      Your Email *
                    </label>
                    <input
                      id="authorEmail"
                      type="email"
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent transition"
                      required
                    />
                    <p className="text-xs text-foreground/50 mt-1">We'll notify you when your submission is reviewed</p>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide a brief description of your submission"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent transition resize-none"
                      required
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload File *</label>
                    <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-accent/50 hover:bg-accent/10 transition cursor-pointer">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.csv,.json,.fasta,.fa,.txt,.doc,.docx,.xlsx,.xls"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-10 h-10 text-foreground/50 mx-auto mb-3" />
                        {selectedFile ? (
                          <div>
                            <p className="text-sm font-medium text-accent">{selectedFile.name}</p>
                            <p className="text-xs text-foreground/50 mt-1">
                              {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                            <p className="text-xs text-foreground/50">
                              PDF, CSV, JSON, FASTA, TXT, DOC, XLSX (Max 50MB)
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Important Note */}
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-start gap-3">
                      <ExternalLink className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-700">How Submission Works</p>
                        <p className="text-xs text-foreground/70 mt-1">
                          When you click submit, your default email client will open with the submission details
                          pre-filled. You'll need to <strong>attach your file</strong> to the email before sending it to
                          our admin team.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      "Submit for Review"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Published Content */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-8 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                <h2 className="text-xl font-semibold mb-6">Published Research</h2>

                <div className="space-y-4">
                  {publications.map((pub) => (
                    <div
                      key={pub.id}
                      className="p-5 rounded-lg bg-background/50 border border-border/50 hover:border-accent/50 transition-all group/item"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold group-hover/item:text-accent transition">{pub.title}</h3>
                          <p className="text-sm text-foreground/60 mt-1">by {pub.author}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(pub.type)}`}>
                          {pub.type}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/70 mb-3">{pub.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-foreground/50">{pub.date}</p>
                        <a href={pub.fileUrl} className="text-xs text-accent hover:underline font-medium">
                          View Details →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info Sidebar */}
          <div className="space-y-6">
            {/* Review Process */}
            <div className="p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Review Process</h3>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    1
                  </div>
                  <span className="text-foreground/70">Fill out the submission form</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    2
                  </div>
                  <span className="text-foreground/70">Attach file and send email</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    3
                  </div>
                  <span className="text-foreground/70">Admin reviews your submission</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    4
                  </div>
                  <span className="text-foreground/70">Get notified of approval</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    5
                  </div>
                  <span className="text-foreground/70">Content published on portal</span>
                </li>
              </ul>
            </div>

            {/* Contact Admin */}
            <div className="p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Contact Admin</h3>
              </div>
              <p className="text-sm text-foreground/70 mb-3">Have questions about your submission?</p>
              <a
                href="mailto:proteinanalysisfyp@gmail.com"
                className="text-sm text-accent hover:underline font-medium break-all"
              >
                proteinanalysisfyp@gmail.com
              </a>
            </div>

            {/* Guidelines */}
            <div className="p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                Submission Guidelines
              </h3>
              <ul className="space-y-2 text-xs text-foreground/70">
                <li>• Content must be protein-related</li>
                <li>• Original work or properly cited</li>
                <li>• Clear and descriptive titles</li>
                <li>• Professional language and formatting</li>
                <li>• File size under 50MB</li>
                <li>• Review time: 3-5 business days</li>
              </ul>
            </div>

            {/* Accepted Formats */}
            <div className="p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
              <h3 className="font-semibold mb-3">Accepted File Formats</h3>
              <div className="flex flex-wrap gap-2">
                {["PDF", "CSV", "JSON", "FASTA", "TXT", "DOC", "DOCX", "XLSX"].map((format) => (
                  <span key={format} className="px-2 py-1 rounded bg-accent/10 text-accent text-xs font-medium">
                    .{format.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
              <h3 className="font-semibold mb-4">Why Contribute?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/70">Share knowledge with researchers worldwide</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/70">Contribute to scientific advancement</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/70">Build your professional profile</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/70">Get feedback from the community</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
