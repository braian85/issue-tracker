'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import {
  getProjectIssues,
  createIssue,
  updateIssue,
  deleteIssue,
} from '@/clientAPI/projects/index'
import { FaCheck, FaTimes } from 'react-icons/fa'

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
  const firstInputRef = useRef<HTMLInputElement>(null)
  const editingRef = useRef<HTMLTableRowElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isTabbing, setIsTabbing] = useState(false)
  const [highlightCompleted, setHighlightCompleted] = useState(false)

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editingRef.current &&
        !editingRef.current.contains(event.target as Node)
      ) {
        handleUpdateIssue()
        setIsAddingIssue(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editingIssue, issues])

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
    setTimeout(() => {
      firstInputRef.current?.focus()
    }, 0)
  }

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!isTabbing && !editingRef.current?.contains(e.relatedTarget as Node)) {
      if (isFormValid) {
        try {
          const createdIssue = await createIssue(Number(projectId), newIssue)
          setIssues(prev => [...prev, createdIssue])
        } catch (error) {
          console.error('Failed to create issue:', error)
        }
      }
      resetNewIssue()
    }
  }

  console.log('new issue', newIssue)

  const resetNewIssue = () => {
    setNewIssue({
      uiSection: '',
      description: '',
      type: '',
      priority: '',
      status: '',
    })
    setIsAddingIssue(false)
  }

  const handleDragStart = (
    event: React.DragEvent<HTMLTableRowElement>,
    issueId: number
  ) => {
    event.dataTransfer.setData('text/plain', issueId.toString())
  }

  const handleDrop = (
    event: React.DragEvent<HTMLTableRowElement>,
    targetIssueId: number
  ) => {
    event.preventDefault()
    const draggedIssueId = Number(event.dataTransfer.getData('text/plain'))
    if (draggedIssueId !== targetIssueId) {
      const draggedIssueIndex = issues.findIndex(
        issue => issue.id === draggedIssueId
      )
      const targetIssueIndex = issues.findIndex(
        issue => issue.id === targetIssueId
      )
      const updatedIssues = [...issues]
      const [draggedIssue] = updatedIssues.splice(draggedIssueIndex, 1)
      updatedIssues.splice(targetIssueIndex, 0, draggedIssue)
      setIssues(updatedIssues)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLTableRowElement>) => {
    event.preventDefault()
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

  const handleSaveIssue = async () => {
    if (isFormValid) {
      try {
        const createdIssue = await createIssue(Number(projectId), newIssue)
        setIssues(prev => [...prev, createdIssue])
        resetNewIssue()
      } catch (error) {
        console.error('Failed to create issue:', error)
      }
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      setIsTabbing(true)
      const formElements = Array.from(
        editingRef.current?.querySelectorAll('input, select') || []
      )
      const index = formElements.indexOf(e.target as Element)
      if (e.shiftKey) {
        if (index > 0) {
          (formElements[index - 1] as HTMLElement).focus()
        } else if (index === 0) {
          (formElements[formElements.length - 1] as HTMLElement).focus()
        }
      } else {
        if (index > -1 && index < formElements.length - 1) {
          (formElements[index + 1] as HTMLElement).focus()
        } else if (index === formElements.length - 1) {
          (formElements[0] as HTMLElement).focus()
        }
      }
      setIsTabbing(false)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleSaveIssue()
    }
  }

  const handleCancelEdit = () => {
    resetNewIssue()
  }

  const editableCellClass = 'bg-blue-100'

  const handleToggleHighlight = () => {
    setHighlightCompleted(prev => !prev)
  }

  return (
    <div className='flex flex-col h-full bg-background'>
      <main className='flex-1 p-8 bg-background text-foreground overflow-auto'>
        <h1 className='text-2xl font-bold mb-6'>Issues</h1>
        <div className='mb-4'>
          <label className='flex items-center'>
            <input
              type='checkbox'
              checked={highlightCompleted}
              onChange={handleToggleHighlight}
              className='mr-2'
            />
            Highlight Completed Issues
          </label>
        </div>
        <div className='bg-card shadow-md rounded-lg overflow-hidden'>
          <table className='min-w-full divide-y divide-border text-sm'>
            <thead className='bg-muted'>
              <tr>
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
                <th className='px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-background divide-y divide-border'>
              {issues.map(issue => (
                <tr
                  key={issue.id}
                  draggable
                  onDragStart={e => handleDragStart(e, issue.id)}
                  onDrop={e => handleDrop(e, issue.id)}
                  onDragOver={handleDragOver}
                  className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    editingIssue === issue.id ? 'bg-yellow-100' : ''
                  } ${
                    highlightCompleted && issue.status === 'Completed' ? 'bg-green-900 bg-opacity-20 dark:bg-green-800 dark:bg-opacity-40' : ''
                  }`}
                >
                  <td className='px-4 py-2 whitespace-nowrap w-1/5'>
                    {issue.uiSection}
                  </td>
                  <td className='px-4 py-2 whitespace-nowrap w-1/5'>
                    {issue.description}
                  </td>
                  <td className='px-4 py-2 whitespace-nowrap w-1/5'>
                    {issue.type}
                  </td>
                  <td className='px-4 py-2 whitespace-nowrap w-1/5'>
                    {issue.priority}
                  </td>
                  <td className='px-4 py-2 whitespace-nowrap w-1/5'>
                    {issue.status}
                  </td>
                  <td
                    className={`px-4 py-2 whitespace-nowrap w-1/5 flex space-x-2 ${
                      editingIssue === issue.id ? 'bg-yellow-100' : ''
                    }`}
                  >
                    {editingIssue === issue.id ? (
                      <>
                        <button
                          onClick={handleCancelEdit}
                          className='px-2 py-1 rounded bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        >
                          <FaTimes />
                        </button>
                        <button
                          onClick={handleUpdateIssue}
                          className='px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90'
                        >
                          <FaCheck />
                        </button>
                        <span className='text-yellow-600 font-semibold'>
                          Editando...
                        </span>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
              {isAddingIssue && (
                <tr ref={editingRef} className={`${editableCellClass} dark:bg-gray-800`}>
                  <td
                    className={`px-4 py-2 whitespace-nowrap w-1/5 ${editableCellClass} dark:bg-gray-800`}
                  >
                    <input
                      ref={firstInputRef}
                      type='text'
                      name='uiSection'
                      value={newIssue.uiSection}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      className='text-foreground px-2 py-1 w-full rounded-md text-sm focus:outline-none bg-white dark:bg-gray-900 dark:text-white'
                      placeholder='UI Section'
                    />
                  </td>
                  <td
                    className={`px-4 py-2 whitespace-nowrap w-1/5 ${editableCellClass} dark:bg-gray-800`}
                  >
                    <input
                      type='text'
                      name='description'
                      value={newIssue.description}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      className='text-foreground px-2 py-1 w-full rounded-md text-sm focus:outline-none bg-white dark:bg-gray-900 dark:text-white'
                      placeholder='Description'
                    />
                  </td>
                  <td
                    className={`px-4 py-2 whitespace-nowrap w-1/5 ${editableCellClass} dark:bg-gray-800`}
                  >
                    <select
                      name='type'
                      value={newIssue.type}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      className='text-foreground px-2 py-1 w-full rounded-md text-sm focus:outline-none bg-white dark:bg-gray-900 dark:text-white'
                    >
                      <option value=''>Select Type</option>
                      <option value='Enhancement'>Enhancement</option>
                      <option value='Bug'>Bug</option>
                      <option value='Feature'>Feature</option>
                    </select>
                  </td>
                  <td
                    className={`px-4 py-2 whitespace-nowrap w-1/5 ${editableCellClass} dark:bg-gray-800`}
                  >
                    <select
                      name='priority'
                      value={newIssue.priority}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      className='text-foreground px-2 py-1 w-full rounded-md text-sm focus:outline-none bg-white dark:bg-gray-900 dark:text-white'
                    >
                      <option value=''>Select Priority</option>
                      <option value='Low'>Low</option>
                      <option value='Medium'>Medium</option>
                      <option value='High'>High</option>
                    </select>
                  </td>
                  <td
                    className={`px-4 py-2 whitespace-nowrap w-1/5 ${editableCellClass} dark:bg-gray-800`}
                  >
                    <select
                      name='status'
                      value={newIssue.status}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      className='text-foreground px-2 py-1 w-full rounded-md text-sm focus:outline-none bg-white dark:bg-gray-900 dark:text-white'
                    >
                      <option value=''>Select Status</option>
                      <option value='Planned'>Planned</option>
                      <option value='In Progress'>In Progress</option>
                      <option value='Completed'>Completed</option>
                    </select>
                  </td>
                  <td
                    className={`px-4 py-2 whitespace-nowrap w-1/5 ${editableCellClass} dark:bg-gray-800`}
                  >
                    {isFormValid ? (
                      <>
                        <button
                          onClick={handleCancelAddIssue}
                          className='px-2 py-1 rounded bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        >
                          <FaTimes />
                        </button>
                        <button
                          onClick={handleSaveIssue}
                          className='px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90'
                        >
                          OK
                        </button>
                        <span className='text-green-600 font-semibold'>
                          Fields complete
                        </span>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleCancelAddIssue}
                          className='px-2 py-1 rounded bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        >
                          <FaTimes />
                        </button>
                        <span className='text-yellow-600 font-semibold'>
                          Editing...
                        </span>
                      </>
                    )}
                  </td>
                </tr>
              )}
              {!isAddingIssue && (
                <tr
                  onClick={handleRowClick}
                  className='bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400'
                >
                  <td
                    colSpan={6}
                    className='px-4 py-2 whitespace-nowrap text-center text-white text-sm'
                  >
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
