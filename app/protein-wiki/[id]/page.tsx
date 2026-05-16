'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Loader,
  ArrowLeft,
  ExternalLink,
  Share2,
} from 'lucide-react'

export default function ContentDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClient()

  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('published_content')
        .select('*')
        .eq('id', id)
        .single()

      if (!error) setContent(data)
      setLoading(false)
    }

    fetchContent()
  }, [id])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied!')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background via-blue-50/20 to-background flex items-center justify-center">
        <Loader className="w-6 h-6 animate-spin text-accent" />
      </main>
    )
  }

  if (!content) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-foreground/60">Content not found</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-background via-blue-50/20 to-background">

      {/* HEADER */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"
            >
              ProteinAI
            </Link>

            <span className="text-foreground/60 text-sm">
              Protein Wiki
            </span>
          </div>

          {/* RIGHT */}
          <button
            onClick={() => router.push('/protein-wiki')}
            className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="mx-auto max-w-5xl px-4 py-12">

        {/* BREADCRUMB */}
        <div className="text-sm text-foreground/50 mb-4">
          <Link href="/protein-wiki" className="hover:text-accent">
            Wiki
          </Link>
          <span className="mx-2">/</span>
          <span>{content.title}</span>
        </div>

        {/* HERO TITLE */}
        <h1 className="text-4xl font-bold leading-tight mb-6 text-balance">
          {content.title}
        </h1>

        {/* META INFO */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div className="text-sm text-foreground/60">
            <span className="font-medium text-foreground">
              {content.author_name}
            </span>
            <span className="mx-2">•</span>
            <span>{new Date(content.created_at).toLocaleDateString()}</span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg bg-foreground/10 hover:bg-foreground/20 text-sm flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>

            {content.file_url && (
              <a
                href={content.file_url}
                target="_blank"
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm flex items-center gap-2"
              >
                Open File
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* CONTENT CARD */}
        <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-8">

          {/* CONTENT TEXT */}
          <p className="text-foreground/80 leading-relaxed whitespace-pre-line text-lg">
            {content.description}
          </p>
        </div>

      </div>
    </main>
  )
}