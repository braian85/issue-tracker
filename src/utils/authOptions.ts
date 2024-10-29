import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { createHmac } from 'crypto'
import { JWT } from 'next-auth/jwt'
import { Session } from 'next-auth'

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken as string,
      }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const timestamp = Date.now()
        const payload = JSON.stringify({
          name: user.name,
          email: user.email,
          image: user.image,
          username: user.email?.split('@')[0] || '', // Generate a username from email
          password: '', // We'll leave this empty for Google sign-ins
          roleId: 1, // Assuming 1 is the default role ID
          timestamp,
        })

        const hmac = createHmac(
          'sha256',
          process.env.NEXT_SHARED_SECRET!
        )
        hmac.update(payload)
        const signature = hmac.digest('hex')

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Auth-Timestamp': timestamp.toString(),
              'X-Auth-Signature': signature,
            },
            body: payload,
          }
        )

        if (!response.ok) {
          console.error('Failed to save user:', await response.text())
          return false
        }

        return true
      } catch (error) {
        console.error('Error saving user:', error)
        return false
      }
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = (account.expires_at || 0) * 1000
        token.id_token = account.id_token
        token.id = profile.sub
        token.name = profile.name
        token.email = profile.email
        token.image = profile.image
      }

      // Return previous token if the access token has not expired yet
      if (token.expiresAt && Date.now() < (token.expiresAt as number)) {
        return token
      }

      // Access token has expired, try to refresh it
      return refreshAccessToken(token)
    },
    async session({
      session,
      token,
    }: {
      session: Session & { token?: string }
      token: JWT
    }) {
      if (session.user) {
        console.log('token:', token)
        // session.user.id = token.id as string
        session.token = token.id_token as string
      }
      return session
    },
  },
}
