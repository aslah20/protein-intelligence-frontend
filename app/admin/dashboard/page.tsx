'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Check,
  X,
  LogOut,
  Loader,
  FileText,
  Calendar,
  User,
  FileUp,
  AlertCircle,
  Upload,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface Submission {
  id: string
  user_id: string
  title: string
  description: string
  content_type: string
  author_name: string
  author_email: string
  file_url?: string
  file_name: string
  created_at: string
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string
}

interface PublishedContent {
  id: string
  title: string
  description: string
  content_type: string
  author_name: string
  author_email: string
  file_url?: string
  file_name: string
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState<string | null>(null)
  const [rejecting, setRejecting] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')
  const [error, setError] = useState<string | null>(null)
  const [publishedContent, setPublishedContent] = useState<PublishedContent[]>([])
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showUploadResource, setShowUploadResource] = useState(false)
  const [resourceTitle, setResourceTitle] = useState('')
  const [resourceDescription, setResourceDescription] = useState('')
  const [resourceFile, setResourceFile] = useState<File | null>(null)
  const [uploadingResource, setUploadingResource] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push('/admin/login')
          return
        }

        // Verify admin status
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .single()

        if (adminError || !adminData) {
          await supabase.auth.signOut()
          router.push('/admin/login')
          return
        }

        setUser(session.user)
        await fetchSubmissions()
        await fetchPublishedContent()
      } catch (err) {
        console.error('Auth check failed:', err)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAdminAuth()
  }, [supabase, router])

  const fetchSubmissions = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('research_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setSubmissions((data || []) as Submission[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions')
    }
  }

  const fetchPublishedContent = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('published_content')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setPublishedContent((data || []) as PublishedContent[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch published content')
    }
  }

  const handleDeletePublished = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this published content? This action cannot be undone.')) {
      return
    }

    setDeleting(contentId)
    try {
      const { error: deleteError } = await supabase
        .from('published_content')
        .delete()
        .eq('id', contentId)

      if (deleteError) throw deleteError

      await fetchPublishedContent()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete content')
    } finally {
      setDeleting(null)
    }
  }

  const handleApprove = async (submission: Submission) => {
    setApproving(submission.id)
    try {
      console.log('[v0] Starting approval for submission:', submission.id)

      // Update submission status
      const { error: updateError } = await supabase
        .from('research_submissions')
        .update({
          status: 'approved',
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', submission.id)

      if (updateError) {
        console.error('[v0] Update error:', updateError)
        throw updateError
      }

      console.log('[v0] Submission status updated to approved')

      // Create published content
      // console.log('[v0] Inserting into published_content...')
      // const { data: publishData, error: publishError } = await supabase.from('published_content').insert({
      //   submission_id: submission.id,
      //   user_id: submission.user_id,
      //   title: submission.title,
      //   description: submission.description,
      //   content_type: submission.content_type,
      //   file_url: submission.file_url,
      //   file_name: submission.file_name,
      //   author_name: submission.author_name,
      //   author_email: submission.author_email,
      // })

      // if (publishError) {
      //   console.error('[v0] Publish error:', publishError)
      //   throw publishError
      // }
      const { data: publishData, error: publishError } = await supabase
        .from('published_content')
        .insert({
          submission_id: submission.id,
          user_id: submission.user_id,
          title: submission.title,
          description: submission.description,
          content_type: submission.content_type,
          file_url: submission.file_url,
          file_name: submission.file_name,
          author_name: submission.author_name,
          author_email: submission.author_email,
        })

      if (publishError) {
        console.error('[v0] Publish error:', publishError)
        throw publishError
      } else {
        console.log('[v0] Published content created:', publishData)
      }

      console.log('[v0] Published content created:', publishData)

      // Send approval email
      try {
        console.log("APPROVAL EMAIL DEBUG:", submission.author_email)
        console.log('[v0] Sending approval email...')
        const emailResponse = await fetch('/api/send-approval-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: submission.author_email,
            userName: submission.author_name,
            contentTitle: submission.title,
            contentType: submission.content_type,
          }),
        })

        if (!emailResponse.ok) {
          const emailError = await emailResponse.text()
          console.error('[v0] Email API error:', emailResponse.status, emailError)
        } else {
          console.log('[v0] Approval email sent successfully')
        }
      } catch (emailErr) {
        console.error('[v0] Failed to call email API:', emailErr)
      }

      // Refresh both lists
      console.log('[v0] Refreshing submissions and published content...')
      await fetchSubmissions()
      await fetchPublishedContent()
      console.log('[v0] Approval completed successfully')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Approval failed'
      console.error('[v0] Approval error:', errorMsg)
      setError(errorMsg)
    } finally {
      setApproving(null)
    }
  }

  const handleReject = async () => {
    if (!selectedSubmission || !rejectReason.trim()) {
      setError('Please provide a rejection reason')
      return
    }

    setRejecting(selectedSubmission.id)
    try {
      const { error: updateError } = await supabase
        .from('research_submissions')
        .update({
          status: 'rejected',
          rejection_reason: rejectReason,
        })
        .eq('id', selectedSubmission.id)

      if (updateError) throw updateError

      // Send rejection email
      try {
        console.log("EMAIL DEBUG:", selectedSubmission.author_email)
        const emailResponse = await fetch('/api/send-rejection-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: selectedSubmission.author_email,
            userName: selectedSubmission.author_name,
            contentTitle: selectedSubmission.title,
            contentType: selectedSubmission.content_type,
            reason: rejectReason,
          }),
        })

        if (!emailResponse.ok) {
          const emailError = await emailResponse.text()
          console.error('[v0] Rejection email API error:', emailResponse.status, emailError)
        } else {
          console.log('[v0] Rejection email sent successfully')
        }
      } catch (emailErr) {
        console.error('[v0] Failed to call rejection email API:', emailErr)
      }

      await fetchSubmissions()
      setShowRejectModal(false)
      setRejectReason('')
      setSelectedSubmission(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rejection failed')
    } finally {
      setRejecting(null)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/protein-wiki')
    } catch (err) {
      setError('Logout failed')
    }
  }

  const handleUploadResource = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!resourceTitle || !resourceDescription) {
      setError('Please fill in title and description')
      return
    }

    setUploadingResource(true)
    try {
      let fileUrl = null
      let fileName = null

      // Upload file if provided
      if (resourceFile) {
        const fileExt = resourceFile.name.split('.').pop()
        fileName = `resource-${user?.id}-${Date.now()}.${fileExt}`
        
        console.log('[v0] Uploading file:', fileName)
        const { error: uploadError } = await supabase.storage
          .from('research-submissions')
          .upload(`submissions/${fileName}`, resourceFile)

        if (uploadError) {
          console.error('[v0] File upload error:', uploadError)
          throw uploadError
        }

        const { data: { publicUrl } } = supabase.storage
          .from('research-submissions')
          .getPublicUrl(`submissions/${fileName}`)
        
        fileUrl = publicUrl
        console.log('[v0] File uploaded:', fileUrl)
      }

      console.log('[v0] Creating resource in published_content')
      console.log('[v0] Admin user ID:', user?.id)
      
      // Insert directly into published_content (no review needed)
      // Note: submission_id is null for admin-uploaded resources
      const insertPayload = {
        submission_id: null,
        user_id: user?.id || '',
        title: resourceTitle,
        description: resourceDescription,
        content_type: 'resource',
        file_url: fileUrl,
        file_name: fileName,
        author_name: 'Admin',
        author_email: user?.email || '',
      }
      
      console.log('[v0] Insert payload:', insertPayload)
      
      const { error: publishError } = await supabase.from('published_content').insert(insertPayload)

      if (publishError) {
        console.error('[v0] Insert error:', publishError)
        throw publishError
      }

      console.log('[v0] Resource created successfully')
      // Reset form
      setResourceTitle('')
      setResourceDescription('')
      setResourceFile(null)
      setShowUploadResource(false)
      
      // Refresh published content
      await fetchPublishedContent()
      console.log('[v0] Resource upload completed successfully')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to upload resource'
      console.error('[v0] Upload error:', errorMsg, err)
      setError(errorMsg)
    } finally {
      setUploadingResource(false)
    }
  }

  const filteredSubmissions = submissions.filter((sub) => (filter === 'all' ? true : sub.status === filter))

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background via-blue-50/20 to-background flex items-center justify-center">
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>

          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="font-medium text-foreground">{user?.email}</p>
              <p className="text-xs text-foreground/60">Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Title with Upload Resources Button */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Research Submissions</h2>
            <p className="text-foreground/60">Review and manage community submissions</p>
          </div>
          <button
            onClick={() => setShowUploadResource(true)}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2 text-sm font-medium whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            Upload Resources
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 border border-red-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-8">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === status
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-foreground/10 text-foreground hover:bg-foreground/20'
                }`}
            >
              {status === 'all'
                ? `All (${submissions.length})`
                : `${status.charAt(0).toUpperCase() + status.slice(1)} (${submissions.filter((s) => s.status === status).length})`}
            </button>
          ))}
        </div>

        {/* Submissions Grid */}
        <div className="space-y-4">
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 hover:border-accent/50 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-1">{submission.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-foreground/60 flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {submission.author_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(submission.created_at).toLocaleDateString()}
                      </span>
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-accent/20 text-accent rounded-full">
                        {submission.content_type}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${submission.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : submission.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </div>
                </div>

                <p className="text-foreground/70 mb-4">{submission.description}</p>

                <div className="mb-4 text-sm text-foreground/60">
                  <p>
                    <span className="font-medium">Author Email:</span> {submission.author_email}
                  </p>
                  {submission.file_name && (
                    <p className="mt-2 flex items-center gap-2">
                      <FileUp className="w-4 h-4" />
                      <span className="font-medium">File:</span> {submission.file_name}
                    </p>
                  )}
                </div>

                {submission.rejection_reason && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm font-medium text-red-900 mb-1">Rejection Reason:</p>
                    <p className="text-sm text-red-800">{submission.rejection_reason}</p>
                  </div>
                )}

                {submission.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(submission)}
                      disabled={approving === submission.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      {approving === submission.id ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSubmission(submission)
                        setShowRejectModal(true)
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm font-medium"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>

                    {submission.file_url && (
                      <a
                        href={submission.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium"
                      >
                        <FileText className="w-4 h-4" />
                        View File
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/60">No {filter === 'all' ? 'submissions' : `${filter} submissions`} found</p>
            </div>
          )}
        </div>

        {/* Published Content Section */}
        <div className="mt-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Published Content</h2>
            <p className="text-foreground/60">Manage content that is publicly available on the wiki</p>
          </div>

          <div className="space-y-4">
            {publishedContent.length > 0 ? (
              publishedContent.map((content) => (
                <div
                  key={content.id}
                  className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 hover:border-accent/50 transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1">{content.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-foreground/60 flex-wrap">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {content.author_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(content.created_at).toLocaleDateString()}
                        </span>
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                          Published
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-foreground/70 mb-4">{content.description}</p>

                  <div className="mb-4 text-sm text-foreground/60">
                    <p>
                      <span className="font-medium">Author Email:</span> {content.author_email}
                    </p>
                    {content.file_name && (
                      <p className="mt-2 flex items-center gap-2">
                        <FileUp className="w-4 h-4" />
                        <span className="font-medium">File:</span> {content.file_name}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeletePublished(content.id)}
                      disabled={deleting === content.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      {deleting === content.id ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      Delete
                    </button>

                    {content.file_url && (
                      <a
                        href={content.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium"
                      >
                        <FileText className="w-4 h-4" />
                        View File
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-foreground/60">No published content yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Resources Modal */}
      {showUploadResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-xl border border-border/50 p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Upload Research Resource</h2>

            <form onSubmit={handleUploadResource} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Resource Title *</label>
                <input
                  type="text"
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  placeholder="e.g., Protein Dataset v2.0"
                  className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border/50 text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description *</label>
                <textarea
                  value={resourceDescription}
                  onChange={(e) => setResourceDescription(e.target.value)}
                  placeholder="Describe what this resource is and how to use it..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border/50 text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 transition resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">File (Optional)</label>
                <label className="block border-2 border-dashed border-border/50 rounded-lg p-4 text-center hover:border-accent/50 hover:bg-accent/10 transition cursor-pointer">
                  <Upload className="w-6 h-6 text-foreground/50 mx-auto mb-2" />
                  <p className="font-medium text-sm">
                    {resourceFile ? resourceFile.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-foreground/50 mt-1">PDF, CSV, ZIP, or other formats</p>
                  <input
                    type="file"
                    onChange={(e) => setResourceFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={uploadingResource}
                  className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  {uploadingResource ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadResource(false)
                    setResourceTitle('')
                    setResourceDescription('')
                    setResourceFile(null)
                    setError(null)
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-foreground/10 text-foreground hover:bg-foreground/20 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-xl border border-border/50 p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Reject Submission</h2>
            <p className="text-foreground/60 mb-6">
              <span className="font-medium">{selectedSubmission.title}</span>
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Provide a reason for rejection..."
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border/50 text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 transition resize-none mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={handleReject}
                disabled={rejecting === selectedSubmission.id || !rejectReason.trim()}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {rejecting === selectedSubmission.id ? 'Rejecting...' : 'Confirm Reject'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectReason('')
                  setSelectedSubmission(null)
                }}
                className="flex-1 py-2 rounded-lg text-foreground/70 hover:text-foreground transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
