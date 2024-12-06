'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  getProjectIssues,
  createIssue,
  updateIssue,
  deleteIssue
} from '@/clientAPI/projects/index'

interface Issue {
  id: number
  uiSection: string
  description: string
  type: string
  priority: string
  status: string
}

export default function IssuesPage() {
  const { projectId } = useParams()
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
        const fetchedIssues = await getProjectIssues(Number(projectId))
        setIssues(fetchedIssues)
      } catch (error) {
        console.error('Failed to fetch issues:', error)
      }
    }

    fetchIssues()
  }, [projectId])

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

  const handleRowClick = () => {
    setIsAddingIssue(true)
  }

  const handleBlur = async () => {
    if (isFormValid) {
      try {
        const createdIssue = await createIssue(Number(projectId), newIssue)
        setIssues(prev => [...prev, createdIssue])
        setNewIssue({
          uiSection: '',
          description: '',
          type: '',
          priority: '',
          status: '',
        })
        setIsAddingIssue(false)
      } catch (error) {
        console.error('Failed to create issue:', error)
      }
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

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedIssues.map(issueId => deleteIssue(Number(projectId), issueId)))
      setIssues(prev => prev.filter(issue => !selectedIssues.includes(issue.id)))
      setSelectedIssues([])
    } catch (error) {
      console.error('Failed to delete issues:', error)
    }
  }

  const handleEditIssue = (issue: Issue) => {
    setEditingIssue(issue.id)
  }

  const handleUpdateIssue = async () => {
    if (editingIssue) {
      try {
        const updatedIssue = issues.find(issue => issue.id === editingIssue)
        if (updatedIssue) {
          await updateIssue(Number(projectId), editingIssue, updatedIssue)
          setIssues(prev =>
            prev.map(issue =>
              issue.id === editingIssue ? updatedIssue : issue
            )
          )
        }
        setEditingIssue(null)
      } catch (error) {
        console.error('Failed to update issue:', error)
      }
    }
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

  return (
    <div className='flex flex-col h-full bg-background'>
      <main className='flex-1 p-8 bg-background text-foreground overflow-auto'>
        <h1 className='text-2xl font-bold mb-6'>Issues</h1>
        <div className='bg-card shadow-md rounded-lg overflow-hidden'>
          <table className='min-w-full divide-y divide-border text-sm'>
            <thead className='bg-muted'>
              <tr>
                <th className='px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  <input
                    type='checkbox'
                    onChange={handleSelectAll}
                    checked={
                      issues.length > 0 &&
                      selectedIssues.length === issues.length
                    }
                    className='form-checkbox h-4 w-4 text-primary'
                  />
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  UI Section
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Description
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Type
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Priority
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='bg-background divide-y divide-border'>
              {issues.map(issue => (
                <tr key={issue.id} className='hover:bg-gray-100 dark:hover:bg-gray-700'>
                  <td className='px-4 py-2 whitespace-nowrap'>
                    <input
                      type='checkbox'
                      checked={selectedIssues.includes(issue.id)}
                      onChange={() => handleCheckboxChange(issue.id)}
                      className='form-checkbox h-4 w-4 text-primary'
                    />
                  </td>
                  <td className='px-4 py-2 whitespace-nowrap'>
                    {editingIssue === issue.id ? (
                      <input
                        type='text'
                        name='uiSection'
                        value={issue.uiSection}
                        onChange={e => handleInputChange(e, issue.id)}
                        className='bg-input text-foreground px-2 py-1 w-full rounded-md text-sm'
                      />
                    ) : (
                      issue.uiSection
                    )}
                  </td>
                  <td className='px-4 py-2 whitespace-nowrap'>
                    {editingIssue === issue.id ? (
                      <input
                        type='text'
                        name='description'
                        value={issue.description}
                        onChange={e => handleInputChange(e, issue.id)}
                        className='bg-input text-foreground px-2 py-1 w-full rounded-md text-sm'
                      />
                    ) : (
                      issue.description
                    )}
                  </td>
                  <td className='px-4 py-2 whitespace-nowrap'>
                    {editingIssue === issue.id ? (
                      <select
                        name='type'
                        value={issue.type}
                        onChange={e => handleInputChange(e, issue.id)}
                        className='bg-input text-foreground px-2 py-1 w-full rounded-md text-sm'
                      >
                        <option value='Enhancement'>Enhancement</option>
                        <option value='Bug'>Bug</option>
                        <option value='Feature'>Feature</option>
                      </select>
                    ) : (
                      issue.type
                    )}
                  </td>
                  <td className='px-4 py-2 whitespace-nowrap'>
                    {editingIssue === issue.id ? (
                      <select
                        name='priority'
                        value={issue.priority}
                        onChange={e => handleInputChange(e, issue.id)}
                        className='bg-input text-foreground px-2 py-1 w-full rounded-md text-sm'
                      >
                        <option value='Low'>Low</option>
                        <option value='Medium'>Medium</option>
                        <option value='High'>High</option>
                      </select>
                    ) : (
                      issue.priority
                    )}
                  </td>
                  <td className='px-4 py-2 whitespace-nowrap'>
                    {editingIssue === issue.id ? (
                      <select
                        name='status'
                        value={issue.status}
                        onChange={e => handleInputChange(e, issue.id)}
                        className='bg-input text-foreground px-2 py-1 w-full rounded-md text-sm'
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
                  <td className='px-4 py-2 whitespace-nowrap'></td>
                  <td className='px-4 py-2 whitespace-nowrap'>
                    <input
                      type='text'
                      name='uiSection'
                      value={newIssue.uiSection}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className='bg-input text-foreground px-2 py-1 w-full rounded-md text-sm'
                      placeholder='UI Section'
                    />
                  </td>
                  <td className='px-4 py-2 whitespace-nowrap'>
                    <input
                      type='text'
                      name='description'
                      value={newIssue.description}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className='bg-input text-foreground px-2 py-1 w-full rounded-md text-sm'
                      placeholder='Description'
                    />
                  </td>
                  <td className='px-4 py-2 whitespace-nowrap'>
                    <select
                      name='type'
                      value={newIssue.type}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className='bg-input text-foreground px-2 py-1 w-full rounded-md text-sm'
                    >
                      <option value=''>Select Type</option>
                      <option value='Enhancement'>Enhancement</option>
                      <option value='Bug'>Bug</option>
                      <option value='Feature'>Feature</option>
                    </select>
                  </td>
                  <td className='px-4 py-2 whitespace-nowrap'>
                    <select
                      name='priority'
                      value={newIssue.priority}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className='bg-input text-foreground px-2 py-1 w-full rounded-md text-sm'
                    >
                      <option value=''>Select Priority</option>
                      <option value='Low'>Low</option>
                      <option value='Medium'>Medium</option>
                      <option value='High'>High</option>
                    </select>
                  </td>
                  <td className='px-4 py-2 whitespace-nowrap'>
                    <select
                      name='status'
                      value={newIssue.status}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className='bg-input text-foreground px-2 py-1 w-full rounded-md text-sm'
                    >
                      <option value=''>Select Status</option>
                      <option value='Planned'>Planned</option>
                      <option value='In Progress'>In Progress</option>
                      <option value='Completed'>Completed</option>
                    </select>
                  </td>
                </tr>
              )}
              {!isAddingIssue && (
                <tr onClick={handleRowClick} className='bg-blue-500'>
                  <td colSpan={6} className='px-4 py-2 whitespace-nowrap text-center text-white text-sm'>
                    Add Issue
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className='mt-4 flex space-x-2'>
          {editingIssue && (
            <button
              onClick={handleUpdateIssue}
              className='px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90'
            >
              Update Issue
            </button>
          )}
          {selectedIssues.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className='px-4 py-2 rounded bg-destructive text-destructive-foreground hover:bg-destructive/90'
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
              className='px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90'
            >
              Edit Selected
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
