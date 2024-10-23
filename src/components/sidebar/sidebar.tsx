import IssueTrackerLogo from '@/components/logo/issueTrackerLogo'

export default function Sidebar() {
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
          href='/issues'
          className='block py-2 px-4 text-[#EFE3E3] hover:bg-[#3F3F3F]'
        >
          Issues
        </a>
        <a
          href='/settings'
          className='block py-2 px-4 text-[#EFE3E3] hover:bg-[#3F3F3F]'
        >
          Settings
        </a>
      </nav>
    </aside>
  )
}
