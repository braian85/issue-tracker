'use client'

import IssueTrackerLogo from '@/components/logo/issueTrackerLogo'
import { useState } from 'react'

export default function MainPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [issues, setIssues] = useState([
    {
      uiSection: 'Header',
      description: 'Add logo',
      type: 'Enhancement',
      priority: 'Medium',
      status: 'In Progress',
    },
    {
      uiSection: 'Footer',
      description: 'Fix broken links',
      type: 'Bug',
      priority: 'High',
      status: 'Open',
    },
    {
      uiSection: 'Dashboard',
      description: 'Implement dark mode',
      type: 'Feature',
      priority: 'Low',
      status: 'Planned',
    },
  ])

  return (
    <div className='flex h-screen bg-[#202020]'>
      {/* Sidebar */}
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

      {/* Main content */}
      <main className='flex-1 p-8 bg-[#181818] text-[#EFE3E3]'>
        <h1 className='text-2xl font-bold mb-6'>Issues Dashboard</h1>
        <div className='bg-[#333030] shadow-md rounded-lg overflow-hidden'>
          <table className='min-w-full divide-y divide-[#3F3F3F]'>
            <thead className='bg-[#202020]'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-[#9D9D9D] uppercase tracking-wider'>
                  UI Section
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-[#9D9D9D] uppercase tracking-wider'>
                  Description
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-[#9D9D9D] uppercase tracking-wider'>
                  Type
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-[#9D9D9D] uppercase tracking-wider'>
                  Priority
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-[#9D9D9D] uppercase tracking-wider'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='bg-[#181818] divide-y divide-[#3F3F3F]'>
              {issues.map((issue, index) => (
                <tr key={index}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {issue.uiSection}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {issue.description}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>{issue.type}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {issue.priority}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {issue.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
