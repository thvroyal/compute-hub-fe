import { DefaultSession } from 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      name: string
      /** The user's postal address. */
      address: string
    } & DefaultSession['user']
    accessToken?: string
    refreshToken?: string
  }

  interface JWT {
    accessToken: string
  }

  interface User {
    access: {
      token: string
      expires: string
    }
    refresh: {
      token: string
      expires: string
    }
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    accessToken?: string
    refreshToken?: string
  }
}
