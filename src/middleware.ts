import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  async function middleware(req) {
    const url = req.nextUrl.clone()
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage =
      req.nextUrl.pathname.startsWith('/login') ||
      req.nextUrl.pathname.startsWith('/register')

    if (isAuthPage) {
      if (isAuth) {
        url.pathname = '/explore'
        return NextResponse.redirect(url.toString())
      }

      return null
    }

    if (!isAuth) {
      let next = req.nextUrl.pathname
      if (req.nextUrl.search) {
        next += req.nextUrl.search
      }
      url.pathname = `/login`
      url.search = `?next=${encodeURIComponent(next)}`
      return NextResponse.redirect(url.toString())
    }
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true
      }
    },
    secret: process.env.NEXTAUTH_SECRET
  }
)

export const config = {
  matcher: [
    '/login',
    '/register',
    '/explore',
    '/projects/:path*',
    '/users/:username*'
  ]
}
