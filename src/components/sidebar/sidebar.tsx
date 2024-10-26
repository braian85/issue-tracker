import IssueTrackerLogo from '@/components/logo/issueTrackerLogo'
import { signOut } from 'next-auth/react'

export default function Sidebar() {
  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <aside className='w-64 bg-[#333030] shadow-md h-screen overflow-y-auto flex flex-col'>
      <div className='p-4 flex-shrink-0'>
        <IssueTrackerLogo />
      </div>
      <nav className='mt-8 flex-grow'>
        <a
          href='/dashboard'
          className='block py-2 px-4 text-[#EFE3E3] hover:bg-[#3F3F3F]'
        >
          Dashboard
        </a>
        <a
          href='/projects'
          className='block py-2 px-4 text-[#EFE3E3] hover:bg-[#3F3F3F]'
        >
          Projects
        </a>
        <a
          href='/settings'
          className='block py-2 px-4 text-[#EFE3E3] hover:bg-[#3F3F3F]'
        >
          Settings
        </a>
      </nav>
      <div className='p-4'>
        <button
          onClick={handleLogout}
          className='w-full py-2 px-4 text-[#EFE3E3] bg-[#3F3F3F] hover:bg-[#4F4F4F] rounded'
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
