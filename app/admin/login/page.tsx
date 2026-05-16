'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      // Check if user is admin
      if (!data.user) throw new Error('Login failed')

      // Verify admin status
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (adminError || !adminData) {
        // Logout if not admin
        await supabase.auth.signOut()
        throw new Error('You do not have admin access')
      }

      router.push('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-blue-50/20 to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-8">
          <div className="flex justify-center mb-6">
            <div className="p-3 rounded-lg bg-red-500/20">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Admin Portal</h1>
          <p className="text-center text-foreground/60 mb-8">Restricted access only</p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 border border-red-300 text-red-900 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border/50 text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border/50 text-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
