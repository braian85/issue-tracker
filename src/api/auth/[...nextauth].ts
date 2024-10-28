import axios from 'axios'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account && account.provider === 'google') {
        try {
          const response = await axios.post(
            `${process.env.BACKEND_URL}/api/users`,
            {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            },
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
              },
            }
          )

          if (response.status !== 200) {
            return false
          }
        } catch (error) {
          console.error('Error saving user to backend:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, account }) {
      // Initial sign in
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at! * 1000 // Convert to milliseconds
      }

      // Return previous token if the access token has not expired
      if (Date.now() < token.expiresAt) {
        return token
      }

      // Access token has expired, refresh it
      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    },
  },
}

async function refreshAccessToken(token) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      })

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
    }
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
