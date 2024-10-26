'use client'

import { useState, useEffect } from 'react'
import { getAllIssues } from '@/clientAPI/issues/index'

interface Issue {
  id: number
  uiSection: string
  description: string
  type: string
  priority: string
  status: string
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])

  const [newIssue, setNewIssue] = useState({
    uiSection: '',
    description: '',
    type: '',
    priority: '',
    status: '',
  })

  const [isFormValid, setIsFormValid] = useState(false)
  const [selectedIssues, setSelectedIssues] = useState<number[]>([])
  const [editingIssue, setEditingIssue] = useState<number | null>(null)
  const [isAddingIssue, setIsAddingIssue] = useState(false)

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const fetchedIssues = await getAllIssues()
        setIssues(fetchedIssues)
      } catch (error) {
        console.error('Failed to fetch issues:', error)
        // Handle error (e.g., show error message to user)
      }
    }

    fetchIssues()
  }, [])

  useEffect(() => {
    setIsFormValid(Object.values(newIssue).every(value => value !== ''))
  }, [newIssue])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    issueId?: number
  ) => {
    const { name, value } = e.target
    if (issueId !== undefined) {
      setIssues(prev =>
        prev.map(issue =>
          issue.id === issueId ? { ...issue, [name]: value } : issue
        )
      )
    } else {
      setNewIssue(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleAddIssue = () => {
    if (isFormValid) {
      const newId =
        issues.length > 0 ? Math.max(...issues.map(i => i.id)) + 1 : 1
      setIssues(prev => [...prev, { ...newIssue, id: newId }])
      setNewIssue({
        uiSection: '',
        description: '',
        type: '',
        priority: '',
        status: '',
      })
      setIsAddingIssue(false)
    }
  }

  const handleCheckboxChange = (id: number) => {
    setSelectedIssues(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIssues(issues.map(issue => issue.id))
    } else {
      setSelectedIssues([])
    }
  }

  const handleDeleteSelected = () => {
    setIssues(prev => prev.filter(issue => !selectedIssues.includes(issue.id)))
    setSelectedIssues([])
  }

  const handleEditIssue = (issue: Issue) => {
    setEditingIssue(issue.id)
  }

  const handleUpdateIssue = () => {
    setEditingIssue(null)
  }

  const handleCancelAddIssue = () => {
    setIsAddingIssue(false)
    setNewIssue({
      uiSection: '',
      description: '',
      type: '',
      priority: '',
      status: '',
    })
  }

  console.log('issues: ', issues)

  return (
    <div className='flex flex-col h-full bg-[#202020]'>
      {/* Main content */}
      <main className='flex-1 p-8 bg-[#181818] text-[#EFE3E3] overflow-auto'>
        <h1 className='text-2xl font-bold mb-6'>Issues Dashboard</h1>
        <div className='bg-[#333030] shadow-md rounded-lg overflow-hidden'>
          <table className='min-w-full divide-y divide-[#3F3F3F]'>
            <thead className='bg-[#202020]'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-[#9D9D9D] uppercase tracking-wider'>
                  <input
                    type='checkbox'
                    onChange={handleSelectAll}
                    checked={
                      issues.length > 0 &&
                      selectedIssues.length === issues.length
                    }
                    className='form-checkbox h-5 w-5 text-[#B52C2C]'
                  />
                </th>
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
              {issues.map(issue => (
                <tr key={issue.id}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <input
                      type='checkbox'
                      checked={selectedIssues.includes(issue.id)}
                      onChange={() => handleCheckboxChange(issue.id)}
                      className='form-checkbox h-5 w-5 text-[#B52C2C]'
                    />
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {editingIssue === issue.id ? (
                      <input
                        type='text'
                        name='uiSection'
                        value={issue.uiSection}
                        onChange={e => handleInputChange(e, issue.id)}
                        className='bg-[#202020] text-[#EFE3E3] px-2 py-1 w-full'
                      />
                    ) : (
                      issue.uiSection
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {editingIssue === issue.id ? (
                      <input
                        type='text'
                        name='description'
                        value={issue.description}
                        onChange={e => handleInputChange(e, issue.id)}
                        className='bg-[#202020] text-[#EFE3E3] px-2 py-1 w-full'
                      />
                    ) : (
                      issue.description
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {editingIssue === issue.id ? (
                      <select
                        name='type'
                        value={issue.type}
                        onChange={e => handleInputChange(e, issue.id)}
                        className='bg-[#202020] text-[#EFE3E3] px-2 py-1 w-full'
                      >
                        <option value='Enhancement'>Enhancement</option>
                        <option value='Bug'>Bug</option>
                        <option value='Feature'>Feature</option>
                      </select>
                    ) : (
                      issue.type
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {editingIssue === issue.id ? (
                      <select
                        name='priority'
                        value={issue.priority}
                        onChange={e => handleInputChange(e, issue.id)}
                        className='bg-[#202020] text-[#EFE3E3] px-2 py-1 w-full'
                      >
                        <option value='Low'>Low</option>
                        <option value='Medium'>Medium</option>
                        <option value='High'>High</option>
                      </select>
                    ) : (
                      issue.priority
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {editingIssue === issue.id ? (
                      <select
                        name='status'
                        value={issue.status}
                        onChange={e => handleInputChange(e, issue.id)}
                        className='bg-[#202020] text-[#EFE3E3] px-2 py-1 w-full'
                      >
                        <option value='Planned'>Planned</option>
                        <option value='In Progress'>In Progress</option>
                        <option value='Completed'>Completed</option>
                      </select>
                    ) : (
                      issue.status
                    )}
                  </td>
                </tr>
              ))}
              {isAddingIssue && (
                <tr>
                  <td className='px-6 py-4 whitespace-nowrap'></td>
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
                      <option value='Low'>Low</option>
                      <option value='Medium'>Medium</option>
                      <option value='High'>High</option>
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
              )}
            </tbody>
          </table>
        </div>
        <div className='mt-4 flex space-x-2'>
          {!isAddingIssue && selectedIssues.length !== 1 && (
            <button
              onClick={() => setIsAddingIssue(true)}
              className='px-4 py-2 rounded bg-[#B52C2C] text-[#EFE3E3] hover:bg-[#9D2424]'
            >
              Add Issue
            </button>
          )}
          {isAddingIssue && (
            <>
              <button
                onClick={handleAddIssue}
                disabled={!isFormValid}
                className={`px-4 py-2 rounded ${
                  isFormValid
                    ? 'bg-[#B52C2C] text-[#EFE3E3] hover:bg-[#9D2424]'
                    : 'bg-[#666666] text-[#9D9D9D] cursor-not-allowed'
                }`}
              >
                Accept
              </button>
              <button
                onClick={handleCancelAddIssue}
                className='px-4 py-2 rounded bg-[#B52C2C] text-[#EFE3E3] hover:bg-[#9D2424]'
              >
                Cancel
              </button>
            </>
          )}
          {editingIssue && (
            <button
              onClick={handleUpdateIssue}
              className='px-4 py-2 rounded bg-[#B52C2C] text-[#EFE3E3] hover:bg-[#9D2424]'
            >
              Update Issue
            </button>
          )}
          {selectedIssues.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className='px-4 py-2 rounded bg-[#B52C2C] text-[#EFE3E3] hover:bg-[#9D2424]'
            >
              Delete Selected
            </button>
          )}
          {selectedIssues.length === 1 && !editingIssue && (
            <button
              onClick={() => {
                const issue = issues.find(i => i.id === selectedIssues[0])
                if (issue) handleEditIssue(issue)
              }}
              className='px-4 py-2 rounded bg-[#B52C2C] text-[#EFE3E3] hover:bg-[#9D2424]'
            >
              Edit Selected
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
