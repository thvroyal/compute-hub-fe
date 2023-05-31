import { NextRequest, NextResponse } from 'next/server'
import { AUTH_PAGES } from 'utils/constants'
import { verifyJwtToken } from './libs/auth'

const isAuthPages = (url: string) =>
  AUTH_PAGES.some((page) => page.startsWith(url))

export async function middleware(request: NextRequest) {
  const { url, nextUrl, cookies } = request
  const { value: token } = cookies.get('accessToken') ?? { value: null }

  const hasVerifiedToken =
    token && (await verifyJwtToken(token).catch((error) => console.log(error)))
  const isAuthPageRequested = isAuthPages(nextUrl.pathname)

  if (isAuthPageRequested) {
    if (!hasVerifiedToken) {
      const response = NextResponse.next()
      response.cookies.delete('accessToken')
      response.cookies.delete('refreshToken')
      return response
    }

    const response = NextResponse.redirect(new URL(`/`, url))
    return response
  }

  if (!hasVerifiedToken) {
    const searchParams = new URLSearchParams(nextUrl.searchParams)
    searchParams.set('next', nextUrl.pathname)

    const response = NextResponse.redirect(
      new URL(`/login?${searchParams}`, url)
    )
    response.cookies.delete('accessToken')
    response.cookies.delete('refreshToken')

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/explore',
    '/projects/:path*',
    '/users/:username*'
  ]
}
