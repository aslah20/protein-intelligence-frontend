'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  LogOut,
  User,
  Loader,
  FileUp,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { Chatbot } from "@/components/chatbot"

type ContentType = 'dataset' | 'article' | 'resource'
type CategoryFilter = 'all' | 'articles' | 'datasets' | 'resources'

interface Publication {
  id: string
  title: string
  author_name: string
  content_type: string
  published_at: string
  description: string
  file_url?: string
}

export default function ProteinWikiPage() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [publications, setPublications] = useState<Publication[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [contentType, setContentType] = useState<ContentType>('article')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submittedBy, setSubmittedBy] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all')

  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (err) {
        console.error('Error getting session:', err)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription?.unsubscribe()
  }, [supabase])

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        console.log('[v0] Fetching published content...')
        const { data, error: fetchError } = await supabase
          .from('published_content')
          .select('*')
          .order('created_at', { ascending: false })

        if (fetchError) {
          console.error('[v0] Error fetching publications:', fetchError)
          console.log('[v0] No publications available')
          setPublications([])
          return
        }

        if (data && data.length > 0) {
          console.log('[v0] Publications fetched:', data.length)
          setPublications(data.map(item => ({
            ...item,
            published_at: item.created_at
          })) as Publication[])
        } else {
          console.log('[v0] No publications found')
          setPublications([])
        }
      } catch (err) {
        console.error('[v0] Error fetching publications:', err)
        setPublications([])
      }
    }

    fetchPublications()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('published_content_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'published_content',
        },
        (payload) => {
          // Refetch publications when changes occur
          console.log('[v0] Real-time update received:', payload.eventType)
          fetchPublications()
        }
      )
      .subscribe((status) => {
        console.log('[v0] Subscription status:', status)
      })

    return () => {
      channel.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setTitle('')
      setDescription('')
      setSelectedFile(null)
      setShowSuccess(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      setError('You must be logged in to submit')
      return
    }

    if (!title || !description || !submittedBy) {
      setError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      let fileUrl = null
      let fileName = null

      // Upload file if provided (works for both dataset and article)
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()
        fileName = `${user.id}-${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('research-submissions')
          .upload(`submissions/${fileName}`, selectedFile)

        if (uploadError) throw uploadError

        // Get file URL
        const {
          data: { publicUrl },
        } = supabase.storage.from('research-submissions').getPublicUrl(`submissions/${fileName}`)
        fileUrl = publicUrl
      }

      // Create submission in database
      const { error: submitError } = await supabase.from('research_submissions').insert({
        user_id: user.id,
        title,
        description,
        content_type: contentType,
        file_url: fileUrl,
        file_name: fileName,
        author_name: submittedBy,
        author_email: user.email || '',
        status: 'pending',
      })

      if (submitError) throw submitError

      setShowSuccess(true)
      setTitle('')
      setDescription('')
      setSubmittedBy('')
      setSelectedFile(null)
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contentTypes = [
    { value: 'dataset' as ContentType, label: 'Dataset', icon: Database },
    { value: 'article' as ContentType, label: 'Article', icon: FileText },
  ]

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
      <Chatbot />
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"
            >
              ProteinAI
            </Link>
            <span className="text-foreground/60 text-sm">Protein Wiki</span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
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
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition"
                title="Login with Google to submit articles"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Login
              </Link>
            )}
            <Link href="/" className="text-sm text-foreground/70 hover:text-foreground transition">
              ← Back
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {!user ? (
          // Non-logged-in view: Show articles/documents
          <div>
            <div className="mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-2">Protein Research Wiki</h1>
              <p className="text-foreground/60">
                Explore curated research articles, datasets, and papers from the community. Login to contribute.
              </p>
            </div>

            {/* Category + Search Row */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* Categories (LEFT) */}
            <div className="flex flex-wrap gap-3">
              {(['all', 'articles', 'datasets', 'resources'] as const).map((category) => {
                const isSelected = selectedCategory === category
                const categoryLabel = {
                  all: 'All',
                  articles: 'Articles',
                  datasets: 'Datasets',
                  resources: 'Resources'
                }[category]

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      isSelected
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-background border border-border/50 text-foreground hover:border-accent/50'
                    }`}
                  >
                    {categoryLabel}
                  </button>
                )
              })}
            </div>

            {/* Search (RIGHT) */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-4 py-2 pl-10 rounded-lg bg-background border border-border/50 text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 transition"
              />

              <svg
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>

            </div>


            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publications.length > 0 ? (
                publications
                .filter((pub) => {
                  // CATEGORY FILTER
                  const categoryMatch =
                    selectedCategory === 'all' ||
                    (selectedCategory === 'articles' && pub.content_type === 'article') ||
                    (selectedCategory === 'datasets' && pub.content_type === 'dataset') ||
                    (selectedCategory === 'resources' && pub.content_type === 'resource')
                
                  // SEARCH FILTER (PARTIAL MATCH)
                  const searchMatch =
                    pub.title.toLowerCase().includes(searchQuery.toLowerCase())
                
                  return categoryMatch && searchMatch
                })
                  .map((pub) => {
                  const Icon =
                    contentTypes.find((ct) => ct.value === pub.content_type)?.icon || FileText
                    return (
                      <Link
                        key={pub.id}
                        href={`/protein-wiki/${pub.id}`}
                        className="block"
                      >
                        <div className="group relative rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 hover:border-accent/50 hover:bg-card/60 transition h-[260px] flex flex-col justify-between cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg bg-accent/20">
                          <Icon className="w-6 h-6 text-accent" />
                        </div>
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-accent/20 text-accent rounded-full">
                          {pub.content_type}
                        </span>
                      </div>

                      <h3 className="font-bold text-lg mb-2 text-balance">{pub.title}</h3>
                      <p className="text-sm text-foreground/60 mb-4 line-clamp-2">
                        {pub.description.split('\n')[0]}
                      </p>

                      <div className="flex items-center justify-between text-xs text-foreground/50 mb-4">
                        <span>{pub.author_name}</span>
                        <span>{new Date(pub.published_at).toLocaleDateString()}</span>
                      </div>

                      {pub.file_url && (
                        <div className="inline-flex items-center gap-2 text-accent text-sm font-medium">
                          View Resource
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      )}
                      </div>
                    </Link>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-foreground/60 mb-4">No published content yet</p>
                </div>
              )}
            </div>

            <div className="mt-12 p-8 rounded-xl border border-accent/30 bg-accent/10 text-center">
              <h2 className="text-xl font-semibold mb-2">Want to Contribute?</h2>
              <p className="text-foreground/60 mb-4">
                Share your research, datasets, or articles with the protein research community
              </p>
              <Link
                href="/auth/login"
                className="inline-block px-6 py-2 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition"
              >
                Login to Submit
              </Link>
            </div>
          </div>
        ) : (
          // Logged-in view: Show submission form
          <div>
            <div className="mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-2">Submit to Protein Wiki</h1>
              <p className="text-foreground/60">
                Share your research content with the community. All submissions require admin review and approval.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Submission Form */}
              <div className="lg:col-span-2 space-y-6">
                {showSuccess && (
                  <div className="p-4 rounded-lg bg-green-100 border border-green-300 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Submission Sent!</p>
                      <p className="text-sm text-green-800 mt-1">
                        Your content has been submitted for admin review. You'll be notified once it's approved.
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-4 rounded-lg bg-red-100 border border-red-300 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900">Error</p>
                      <p className="text-sm text-red-800 mt-1">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Content Type */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                      <label className="block text-sm font-semibold mb-4">What do you want to submit?</label>
                      <div className="grid grid-cols-2 gap-4">
                        {contentTypes.map((ct) => {
                          const Icon = ct.icon
                          return (
                            <button
                              key={ct.value}
                              type="button"
                              onClick={() => {
                                setContentType(ct.value)
                                setSelectedFile(null)
                              }}
                              className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-3 ${contentType === ct.value
                                  ? 'border-accent bg-accent/20 shadow-lg shadow-accent/20'
                                  : 'border-border/50 bg-background/30 hover:border-accent/50'
                                }`}
                            >
                              <Icon className="w-6 h-6" />
                              <span className="text-sm font-medium text-center">{ct.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                      <label className="block text-sm font-semibold mb-2">Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter content title"
                        className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border/50 text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 transition"
                        required
                      />
                    </div>
                  </div>

                  {/* Submitted By */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                      <label className="block text-sm font-semibold mb-2">Submitted By</label>
                      <input
                        type="text"
                        value={submittedBy}
                        onChange={(e) => setSubmittedBy(e.target.value)}
                        placeholder="Your name or organization"
                        className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border/50 text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 transition"
                        required
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                      <label className="block text-sm font-semibold mb-2">Content</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Write your article content here. You can write as much as you want..."
                        rows={12}
                        className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 transition resize-none"
                        required
                      />
                    </div>
                  </div>

                  {/* File Upload - Optional for both */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                      <label className="block text-sm font-semibold mb-4">Attach File (Optional)</label>
                      <label className="block border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-accent/50 hover:bg-accent/10 transition cursor-pointer">
                        <Upload className="w-8 h-8 text-foreground/50 mx-auto mb-2" />
                        <p className="font-medium">
                          {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-foreground/50 mt-1">
                          PDF, CSV, XLSX, TXT, or other document formats
                        </p>
                        <input type="file" onChange={handleFileChange} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      'Submit for Review'
                    )}
                  </button>
                </form>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                {/* Guidelines */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-accent" />
                      Submission Guidelines
                    </h3>
                    <ul className="space-y-3 text-sm text-foreground/70">
                      <li className="flex gap-2">
                        <span className="text-accent font-bold">•</span>
                        <span>Content must be original or properly attributed</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent font-bold">•</span>
                        <span>Include comprehensive descriptions</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent font-bold">•</span>
                        <span>All submissions require admin approval</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent font-bold">•</span>
                        <span>Review typically takes 2-5 business days</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Review Process */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-accent" />
                      Review Process
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                          1
                        </div>
                        <div>
                          <p className="font-medium text-sm">Submit Content</p>
                          <p className="text-xs text-foreground/60">Your file and details are sent</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                          2
                        </div>
                        <div>
                          <p className="font-medium text-sm">Admin Review</p>
                          <p className="text-xs text-foreground/60">Team verifies quality and relevance</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                          3
                        </div>
                        <div>
                          <p className="font-medium text-sm">Publish or Feedback</p>
                          <p className="text-xs text-foreground/60">Content goes live or revisions needed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Support */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-accent" />
                      Questions?
                    </h3>
                    <p className="text-sm text-foreground/70 mb-4">
                      Contact our admin team for support or to check submission status
                    </p>
                    <a
                      href="mailto:proteinanalysisfyp@gmail.com"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition text-sm font-medium"
                    >
                      Email Support
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
