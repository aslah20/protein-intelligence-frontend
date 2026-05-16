'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader,
  LogOut,
  User,
  FileText,
  Upload,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface ArticleFormData {
  title: string
  content: string
  description: string
}

export default function SubmitArticlePage() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    description: '',
  })

  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session?.user) {
          // Redirect to login if not authenticated
          router.push('/auth/login')
          return
        }

        setUser(session.user)
      } catch (err) {
        console.error('Error getting session:', err)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push('/auth/login')
      } else {
        setUser(session.user)
      }
    })

    return () => subscription?.unsubscribe()
  }, [supabase, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      setError('You must be logged in to submit an article')
      return
    }

    if (!formData.title || !formData.content || !formData.description) {
      setError('Please fill in all required fields (title, content, and description)')
      return
    }

    setIsSubmitting(true)

    try {
      // Insert article submission into research_submissions table
      const { error: submitError } = await supabase.from('research_submissions').insert({
        user_id: user.id,
        title: formData.title,
        content: formData.content,
        description: formData.description,
        content_type: 'article',
        author_name: user.user_metadata?.full_name || user.email || 'Unknown',
        author_email: user.email || '',
        status: 'pending',
      })

      if (submitError) throw submitError

      setShowSuccess(true)
      setFormData({
        title: '',
        content: '',
        description: '',
      })
      setTimeout(() => {
        setShowSuccess(false)
        router.push('/protein-wiki')
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
      console.error('Submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push('/protein-wiki')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-gradient-to-b from-background via-blue-50/20 to-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader className="w-6 h-6 animate-spin text-accent" />
          <span className="text-foreground/70">Loading...</span>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-background via-blue-50/20 to-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/protein-wiki"
              className="p-2 hover:bg-foreground/5 rounded-lg transition"
              title="Back to Protein Wiki"
            >
              <ArrowLeft className="w-5 h-5 text-foreground/60" />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Submit Article</h1>
              <p className="text-xs text-foreground/60">Write and submit your research article</p>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <User className="w-4 h-4 text-accent" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground">{user.user_metadata?.full_name || 'User'}</p>
                <p className="text-xs text-foreground/60">{user.email}</p>
              </div>
              <button onClick={handleLogout} className="ml-2 p-1 hover:bg-background rounded transition" title="Logout">
                <LogOut className="w-4 h-4 text-foreground/60 hover:text-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 rounded-lg bg-green-100 border border-green-300 flex items-start gap-3 animate-in fade-in slide-in-from-top">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Article Submitted!</p>
                <p className="text-sm text-green-800 mt-1">
                  Your article has been submitted for admin review. You&apos;ll be notified once it&apos;s approved. Redirecting...
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 border border-red-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-800 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                <label htmlFor="title" className="block text-sm font-semibold mb-2">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Novel Approaches to Protein Folding"
                  className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border/50 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 transition"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                <label htmlFor="description" className="block text-sm font-semibold mb-2">
                  Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide a brief summary of your article (2-3 sentences)"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border/50 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 transition resize-none"
                  required
                />
              </div>
            </div>

            {/* Content */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                <label htmlFor="content" className="block text-sm font-semibold mb-2">
                  Article Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your full article here... Include detailed explanations, findings, and conclusions related to protein research."
                  rows={12}
                  className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border/50 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 transition resize-none font-mono text-sm"
                  required
                />
                <p className="text-xs text-foreground/50 mt-2">
                  Markdown formatting is supported (use **bold**, *italic*, # headings, etc.)
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Submit for Review
                  </>
                )}
              </button>
              <Link
                href="/protein-wiki"
                className="px-6 py-3 rounded-lg border border-border/50 text-foreground hover:bg-foreground/5 transition font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-12 p-6 rounded-xl border border-accent/30 bg-accent/10">
            <h3 className="font-semibold text-foreground mb-2">Review Process</h3>
            <ul className="text-sm text-foreground/70 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">1.</span>
                <span>Submit your article using this form</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">2.</span>
                <span>Admin team reviews your submission for quality and relevance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">3.</span>
                <span>Once approved, your article will be published to the Protein Wiki</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">4.</span>
                <span>You&apos;ll receive an email notification when your article is published</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
