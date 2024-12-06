import IssueTrackerLogo from '@/components/logo/issueTrackerLogo'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Sidebar() {
  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <aside className='w-64 bg-background shadow-md h-screen overflow-y-auto flex flex-col'>
      <div className='p-4 flex-shrink-0'>
        <IssueTrackerLogo />
      </div>
      <nav className='mt-8 flex-grow'>
        <Link
          href='/dashboard'
          className='block py-2 px-4 text-foreground border border-transparent hover:border hover:border-violet-700 transition-all duration-500'
        >
          Dashboard
        </Link>
        <Link
          href='/projects'
          className='block py-2 px-4 text-foreground border border-transparent hover:border hover:border-violet-700 transition-all duration-500'
        >
          Projects
        </Link>
        <Link
          href='/settings'
          className='block py-2 px-4 text-foreground border border-transparent hover:border hover:border-violet-700 transition-all duration-500'
        >
          Settings
        </Link>
      </nav>
      <div className='p-4'>
        <button
          onClick={handleLogout}
          className='w-full py-2 px-4 text-foreground bg-background hover:bg-accent rounded'
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
