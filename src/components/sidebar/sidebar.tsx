import IssueTrackerLogo from '@/components/logo/issueTrackerLogo'

export default function Sidebar() {
  return (
    <aside className='w-64 bg-[#333030] shadow-md'>
      <div className='p-4'>
        <IssueTrackerLogo />
      </div>
      <nav className='mt-8'>
        <a
          href='#'
          className='block py-2 px-4 text-[#EFE3E3] hover:bg-[#3F3F3F]'
        >
          Dashboard
        </a>
        <a
          href='#'
          className='block py-2 px-4 text-[#EFE3E3] hover:bg-[#3F3F3F]'
        >
          Issues
        </a>
        <a
          href='#'
          className='block py-2 px-4 text-[#EFE3E3] hover:bg-[#3F3F3F]'
        >
          Projects
        </a>
        <a
          href='#'
          className='block py-2 px-4 text-[#EFE3E3] hover:bg-[#3F3F3F]'
        >
          Settings
        </a>
      </nav>
    </aside>
  )
}
