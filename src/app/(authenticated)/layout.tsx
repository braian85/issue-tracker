'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from '@/components/sidebar/sidebar'
import Providers from '@/components/Providers'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <AuthContent>{children}</AuthContent>
    </Providers>
  )
}

function AuthContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (!session) {
    return null
  }

  return (
    <div className='flex h-screen bg-[#202020]'>
      <Sidebar />
      <main className='flex-1 p-8 bg-[#181818] text-[#EFE3E3]'>{children}</main>
    </div>
  )
}
