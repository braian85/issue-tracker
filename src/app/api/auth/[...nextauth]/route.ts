import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'
import { createHmac } from 'crypto'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
          process.env.NEXT_PUBLIC_SHARED_SECRET!
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
        token.id = profile.sub
        token.name = profile.name
        token.email = profile.email
        token.picture = profile.picture
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
