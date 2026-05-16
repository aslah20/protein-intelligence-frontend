import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/protein-wiki'

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.session?.user) {
      const userEmail = data.session.user.email
      const adminEmail = 'proteinanalysisfyp@gmail.com'
      
      const requestUrl = new URL(request.url)
      // Redirect admin to admin dashboard, others to protein wiki
      requestUrl.pathname = userEmail === adminEmail ? '/admin/dashboard' : next
      return NextResponse.redirect(requestUrl)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
}
