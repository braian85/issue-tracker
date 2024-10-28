import axios from 'axios'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log('está en signIn')
      console.log({ user, account })
      if (account && account.provider === 'google') {
        try {
          // Aquí es donde guardamos el usuario en el backend
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
      // Persist the OAuth access_token to the token right after signin
      console.log('está en jwt')
      console.log({ token, account })
      if (account && 'access_token' in account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      console.log('está en session')
      console.log({ session, token })
      // Send properties to the client, like an access_token from a provider.
      if ('accessToken' in token) {
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
