import IssueTrackerLogo from '@/components/logo/issueTrackerLogo'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Sidebar() {
  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <aside className='w-64 bg-white dark:bg-background border-r-2 border-gray-300 dark:border-gray-700 shadow-lg h-screen overflow-y-auto flex flex-col'>
      <div className='p-4 flex-shrink-0'>
        <IssueTrackerLogo />
      </div>
      <nav className='mt-8 flex-grow'>
        <Link href='/dashboard' className='block py-2 px-4 text-black dark:text-white hover:bg-blue-300 dark:hover:bg-gray-800'>
          Dashboard
        </Link>
        <Link href='/projects' className='block py-2 px-4 text-black dark:text-white hover:bg-blue-300 dark:hover:bg-gray-800'>
          Projects
        </Link>
        <Link href='/settings' className='block py-2 px-4 text-black dark:text-white hover:bg-blue-300 dark:hover:bg-gray-800'>
          Settings
        </Link>
      </nav>
      <div className='p-4'>
        <button
          onClick={handleLogout}
          className='w-full py-2 px-4 text-white bg-blue-600 dark:bg-blue-800 hover:bg-blue-700 dark:hover:bg-blue-900 rounded'
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
