import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Sun, Moon } from 'lucide-react'

const Navbar: React.FC = () => {
  const { data: session } = useSession()
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('isDarkMode')
    return savedMode ? JSON.parse(savedMode) : false
  })

  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode))
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <nav className='bg-background text-foreground p-4 shadow-md'>
      <div className='container mx-auto flex justify-between items-center'>
        <div className='flex items-center'>
          {/* Other left-side elements can go here if needed */}
        </div>
        <div className='flex items-center'>
          {session?.user?.name && (
            <span className='mr-4 text-lg font-medium'>
              Welcome, {session.user.name}
            </span>
          )}
          {session?.user?.image && (
            <div className='w-10 h-10 rounded-full overflow-hidden mr-4'>
              <Image
                src={session.user.image}
                alt='Profile Picture'
                width={40}
                height={40}
                className='object-cover'
              />
            </div>
          )}
          <button
            onClick={toggleDarkMode}
            className='p-2 rounded-full bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent transition-colors'
            aria-label='Toggle Dark Mode'
          >
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
