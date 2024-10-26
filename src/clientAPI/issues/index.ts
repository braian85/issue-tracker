import axios from 'axios'
import { getSession } from 'next-auth/react'
import { Session } from 'next-auth'

export const getAllIssues = async () => {
  try {
    const session = (await getSession()) as Session & { token: string }

    console.log('Session:', session)

    if (!session) {
      throw new Error('No active session found')
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues`,
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }
    )

    return response.data
  } catch (error) {
    console.error('Error fetching issues:', error)
    throw error
  }
}
