'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from '@/components/sidebar/sidebar'
import Navbar from '@/components/navbar'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/') {
      router.push('/login')
    }
  }, [status, router, pathname])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session && pathname !== '/') {
    return null
  }

  return (
    <div className='flex h-screen bg-background'>
      <Sidebar />
      <div className='flex flex-col flex-1 h-full'>
        <Navbar />
        <main className='flex-1 p-4 bg-background text-foreground overflow-y-hidden'>
          {children}
        </main>
      </div>
    </div>
  )
}
