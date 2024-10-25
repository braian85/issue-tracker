import React from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

const Navbar: React.FC = () => {
  const { data: session } = useSession()

  return (
    <nav className='bg-[#202020] text-white p-4'>
      <div className='container mx-auto flex justify-end items-center'>
        <div className='flex items-center'>
          {session?.user?.name && (
            <span className='mr-4'>Welcome, {session.user.name}</span>
          )}
          {session?.user?.image && (
            <div className='w-10 h-10 rounded-full overflow-hidden'>
              <Image
                src={session.user.image}
                alt='Profile Picture'
                width={40}
                height={40}
                className='object-cover'
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
