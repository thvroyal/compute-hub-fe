import { login } from 'helpers/apis'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { setCookie } from 'nookies'

const nextAuthOptions: (req: any, res: any) => NextAuthOptions = (
  _req,
  res
) => {
  return {
    providers: [
      CredentialsProvider({
        name: 'Credentials',

        credentials: {
          email: { label: 'Email', type: 'text', placeholder: 'jsmith' },
          password: { label: 'Password', type: 'password' }
        },
        async authorize(credentials) {
          // Add logic here to look up the user from the credentials supplied
          if (!credentials) {
            return null
          }
          const { data, error } = await login({
            email: credentials.email,
            password: credentials.password
          })

          if (!error) {
            const user = { ...data?.user, ...data?.tokens }
            setCookie({ res }, 'accessToken', data?.tokens.access.token, {
              maxAge: 30 * 60 * 60,
              path: '/',
              httpOnly: true
            })
            return user
          } else {
            return null
          }
        }
      })
    ],

    callbacks: {
      async jwt({ token, user }) {
        // Persist the OAuth access_token to the token right after signin
        if (user.access) {
          token.accessToken = user.access.token
          token.refreshToken = user.refresh.token
        }
        return token
      },
      async session({ session, token }) {
        // Send properties to the client, like an access_token from a provider.
        if (token) {
          session.accessToken = token.accessToken
          session.refreshToken = token.refreshToken
        }
        return session
      }
    },

    pages: {
      signIn: '/login',
      error: '/login'
    },

    session: {
      strategy: 'jwt'
    },

    events: {
      signOut: async () => {
        console.log('signing out')
      }
    },

    secret: process.env.NEXTAUTH_SECRET
  }
}

export default (req: any, res: any) => {
  return NextAuth(req, res, nextAuthOptions(req, res))
}
