'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function MainPage() {
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
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <aside className='w-64 bg-white shadow-md'>
        <div className='p-4'>
          <Image src='/logo.svg' alt='Logo' width={150} height={50} />
        </div>
        <nav className='mt-8'>
          <a
            href='#'
            className='block py-2 px-4 text-gray-700 hover:bg-gray-200'
          >
            Dashboard
          </a>
          <a
            href='#'
            className='block py-2 px-4 text-gray-700 hover:bg-gray-200'
          >
            Issues
          </a>
          <a
            href='#'
            className='block py-2 px-4 text-gray-700 hover:bg-gray-200'
          >
            Projects
          </a>
          <a
            href='#'
            className='block py-2 px-4 text-gray-700 hover:bg-gray-200'
          >
            Settings
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className='flex-1 p-8'>
        <h1 className='text-2xl font-bold mb-6'>Issues Dashboard</h1>
        <div className='bg-white shadow-md rounded-lg overflow-hidden'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  UI Section
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Description
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Type
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Priority
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
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
