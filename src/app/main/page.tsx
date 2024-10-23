'use client'

import IssueTrackerLogo from '@/components/logo/issueTrackerLogo'
import { useState, useEffect } from 'react'

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
      status: 'In Progress',
    },
    {
      uiSection: 'Dashboard',
      description: 'Implement dark mode',
      type: 'Feature',
      priority: 'Low',
      status: 'Planned',
    },
  ])

  const [newIssue, setNewIssue] = useState({
    uiSection: '',
    description: '',
    type: '',
    priority: '',
    status: '',
  })

  const [isFormValid, setIsFormValid] = useState(false)

  useEffect(() => {
    setIsFormValid(Object.values(newIssue).every(value => value !== ''))
  }, [newIssue])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setNewIssue(prev => ({ ...prev, [name]: value }))
  }

  const handleAddIssue = () => {
    if (isFormValid) {
      setIssues(prev => [...prev, newIssue])
      setNewIssue({
        uiSection: '',
        description: '',
        type: '',
        priority: '',
        status: '',
      })
    }
  }

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
              <tr>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <input
                    type='text'
                    name='uiSection'
                    value={newIssue.uiSection}
                    onChange={handleInputChange}
                    className='bg-[#202020] text-[#EFE3E3] px-2 py-1 w-full'
                    placeholder='UI Section'
                  />
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <input
                    type='text'
                    name='description'
                    value={newIssue.description}
                    onChange={handleInputChange}
                    className='bg-[#202020] text-[#EFE3E3] px-2 py-1 w-full'
                    placeholder='Description'
                  />
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <select
                    name='type'
                    value={newIssue.type}
                    onChange={handleInputChange}
                    className='bg-[#202020] text-[#EFE3E3] px-2 py-1 w-full'
                  >
                    <option value=''>Select Type</option>
                    <option value='Enhancement'>Enhancement</option>
                    <option value='Bug'>Bug</option>
                    <option value='Feature'>Feature</option>
                  </select>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <select
                    name='priority'
                    value={newIssue.priority}
                    onChange={handleInputChange}
                    className='bg-[#202020] text-[#EFE3E3] px-2 py-1 w-full'
                  >
                    <option value=''>Select Priority</option>
                    <option value='Medium'>Medium</option>
                    <option value='High'>High</option>
                    <option value='Low'>Low</option>
                  </select>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <select
                    name='status'
                    value={newIssue.status}
                    onChange={handleInputChange}
                    className='bg-[#202020] text-[#EFE3E3] px-2 py-1 w-full'
                  >
                    <option value=''>Select Status</option>
                    <option value='Planned'>Planned</option>
                    <option value='In Progress'>In Progress</option>
                    <option value='Completed'>Completed</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button
          onClick={handleAddIssue}
          disabled={!isFormValid}
          className={`mt-4 px-4 py-2 rounded ${
            isFormValid
              ? 'bg-[#B52C2C] text-[#EFE3E3] hover:bg-[#9D2424]'
              : 'bg-[#666666] text-[#9D9D9D] cursor-not-allowed'
          }`}
        >
          Add Issue
        </button>
      </main>
    </div>
  )
}
