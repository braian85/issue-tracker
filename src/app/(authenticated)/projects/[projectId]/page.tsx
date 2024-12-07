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
import { Switch } from '@/components/ui/switch'
import { Selector } from '@/components/selector/selector'

interface Issue {
  id: number
  uiSection: string
  description: string
  type: string
  priority: string
  status: string
}

const ToggleIcon: React.FC<{ isActive: boolean; onToggle: () => void }> = ({
  isActive,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      className='p-2 rounded-full bg-accent text-accent-foreground'
    >
      {isActive ? <FaCheck size={20} /> : <FaTimes size={20} />}
    </button>
  )
}

export default function IssuesPage() {
  const { projectId } = useParams()
  const [issues, setIssues] = useState<Issue[]>([])
  const [newIssue, setNewIssue] = useState({
    uiSection: '',
    description: '',
    type: 'Enhancement',
    priority: 'Low',
    status: 'Planned',
  })
  const [isFormValid, setIsFormValid] = useState(false)
  const [selectedIssues, setSelectedIssues] = useState<number[]>([])
  const [editingIssue, setEditingIssue] = useState<number | null>(null)
  const [isAddingIssue, setIsAddingIssue] = useState(false)
  const firstInputRef = useRef<HTMLInputElement>(null)
  const editingRef = useRef<HTMLTableRowElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isTabbing, setIsTabbing] = useState(false)
  const [highlightCompleted, setHighlightCompleted] = useState(() => {
    const savedHighlight = localStorage.getItem('highlightCompleted')
    return savedHighlight ? JSON.parse(savedHighlight) : false
  })
  const [highlightInProgress, setHighlightInProgress] = useState(() => {
    const savedHighlight = localStorage.getItem('highlightInProgress')
    return savedHighlight ? JSON.parse(savedHighlight) : false
  })
  const [highlightPlanned, setHighlightPlanned] = useState(() => {
    const savedHighlight = localStorage.getItem('highlightPlanned')
    return savedHighlight ? JSON.parse(savedHighlight) : false
  })
  const [sortCompletedToTop, setSortCompletedToTop] = useState(() => {
    const savedSort = localStorage.getItem('sortCompletedToTop')
    return savedSort ? JSON.parse(savedSort) : false
  })
  const [editingCell, setEditingCell] = useState<{ id: number; field: string } | null>(null)

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
    setIsFormValid(
      newIssue.uiSection.trim() !== '' && newIssue.description.trim() !== ''
    )
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

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    issueId?: number
  ) => {
    const { name, value } = e.target
    if (issueId !== undefined) {
      setIssues(prev => {
        const updatedIssues = prev.map(issue =>
          issue.id === issueId ? { ...issue, [name]: value } : issue
        )
        const updatedIssue = updatedIssues.find(issue => issue.id === issueId)
        if (updatedIssue) {
          updateIssue(Number(projectId), issueId, updatedIssue)
            .then(() => console.log('Issue updated successfully'))
            .catch(error => console.error('Failed to update issue:', error))
        }
        return updatedIssues
      })
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

  const handleBlur = async (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      type: 'Enhancement',
      priority: 'Low',
      status: 'Planned',
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
      type: 'Enhancement',
      priority: 'Low',
      status: 'Planned',
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
          ;(formElements[index - 1] as HTMLElement).focus()
        } else if (index === 0) {
          ;(formElements[formElements.length - 1] as HTMLElement).focus()
        }
      } else {
        if (index > -1 && index < formElements.length - 1) {
          ;(formElements[index + 1] as HTMLElement).focus()
        } else if (index === formElements.length - 1) {
          ;(formElements[0] as HTMLElement).focus()
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

  const handleToggleHighlightCompleted = () => {
    setHighlightCompleted(prev => {
      const newValue = !prev
      localStorage.setItem('highlightCompleted', JSON.stringify(newValue))
      return newValue
    })
  }

  const handleToggleHighlightInProgress = () => {
    setHighlightInProgress(prev => {
      const newValue = !prev
      localStorage.setItem('highlightInProgress', JSON.stringify(newValue))
      return newValue
    })
  }

  const handleToggleHighlightPlanned = () => {
    setHighlightPlanned(prev => {
      const newValue = !prev
      localStorage.setItem('highlightPlanned', JSON.stringify(newValue))
      return newValue
    })
  }

  const handleToggleSortCompletedToTop = () => {
    setSortCompletedToTop(prev => {
      const newValue = !prev
      localStorage.setItem('sortCompletedToTop', JSON.stringify(newValue))
      return newValue
    })
  }

  const handleCellClick = (issueId: number, field: string) => {
    setEditingCell({ id: issueId, field })
  }

  const handleCellBlur = async (issueId: number) => {
    const updatedIssue = issues.find(issue => issue.id === issueId)
    if (updatedIssue) {
      try {
        await updateIssue(Number(projectId), issueId, updatedIssue)
        console.log('Issue updated successfully')
      } catch (error) {
        console.error('Failed to update issue:', error)
      }
    }
    setEditingCell(null)
  }

  const handleCellChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    issueId: number
  ) => {
    const { name, value } = e.target
    setIssues(prev =>
      prev.map(issue =>
        issue.id === issueId ? { ...issue, [name]: value } : issue
      )
    )
  }

  const sortedIssues = sortCompletedToTop
    ? [...issues].sort((a, b) => (a.status === 'Completed' ? -1 : 1))
    : issues

  return (
    <div className='flex flex-col h-full bg-background'>
      <main className='flex-1 p-4 bg-background text-foreground overflow-auto'>
        <h1 className='text-2xl font-bold mb-6'>Issues</h1>
        <div className='mb-4 flex flex-row space-x-4'>
          <div>
            <h2 className='text-lg font-semibold mb-2'>Highlight Options</h2>
            <label className='flex items-center'>
              <Switch
                checked={highlightCompleted}
                onCheckedChange={handleToggleHighlightCompleted}
                className={`mr-1 transition-colors duration-200 ease-in-out rounded-full ${
                  highlightCompleted
                    ? 'bg-blue-500 dark:bg-blue-700'
                    : 'bg-gray-200 dark:bg-gray-500'
                }`}
                style={{ transform: 'scale(0.8)' }}
              />
              <span className='text-sm text-foreground dark:text-white'>
                Highlight Completed Issues
              </span>
            </label>
            <label className='flex items-center mt-2'>
              <Switch
                checked={highlightInProgress}
                onCheckedChange={handleToggleHighlightInProgress}
                className={`mr-1 transition-colors duration-200 ease-in-out rounded-full ${
                  highlightInProgress
                    ? 'bg-blue-500 dark:bg-blue-700'
                    : 'bg-gray-200 dark:bg-gray-500'
                }`}
                style={{ transform: 'scale(0.8)' }}
              />
              <span className='text-sm text-foreground dark:text-white'>
                Highlight In Progress Issues
              </span>
            </label>
            <label className='flex items-center mt-2'>
              <Switch
                checked={highlightPlanned}
                onCheckedChange={handleToggleHighlightPlanned}
                className={`mr-1 transition-colors duration-200 ease-in-out rounded-full ${
                  highlightPlanned
                    ? 'bg-blue-500 dark:bg-blue-700'
                    : 'bg-gray-200 dark:bg-gray-500'
                }`}
                style={{ transform: 'scale(0.8)' }}
              />
              <span className='text-sm text-foreground dark:text-white'>
                Highlight Planned Issues
              </span>
            </label>
          </div>
          <div>
            <h2 className='text-lg font-semibold mb-2'>Sort Options</h2>
            <label className='flex items-center'>
              <Switch
                checked={sortCompletedToTop}
                onCheckedChange={handleToggleSortCompletedToTop}
                className={`mr-1 transition-colors duration-200 ease-in-out rounded-full ${
                  sortCompletedToTop
                    ? 'bg-blue-500 dark:bg-blue-700'
                    : 'bg-gray-200 dark:bg-gray-500'
                }`}
                style={{ transform: 'scale(0.8)' }}
              />
              <span className='text-sm text-foreground dark:text-white'>
                Sort Completed to Top
              </span>
            </label>
          </div>
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
            <tbody className='bg-background divide-y divide-border dark:divide-gray-500'>
              {sortedIssues.map(issue => {
                let rowHighlightClass = ''
                if (highlightCompleted && issue.status === 'Completed') {
                  rowHighlightClass = 'bg-green-200 dark:bg-green-900'
                } else if (highlightInProgress && issue.status === 'In Progress') {
                  rowHighlightClass = 'bg-blue-200 dark:bg-blue-900'
                } else if (highlightPlanned && issue.status === 'Planned') {
                  rowHighlightClass = 'bg-yellow-200 dark:bg-yellow-900'
                }

                return (
                  <tr
                    key={issue.id}
                    draggable
                    onDragStart={e => handleDragStart(e, issue.id)}
                    onDrop={e => handleDrop(e, issue.id)}
                    onDragOver={handleDragOver}
                    className={`hover:bg-gray-100 dark:hover:bg-gray-700 h-10 ${rowHighlightClass}`}
                  >
                    <td
                      className={`px-4 py-2 whitespace-nowrap w-1/5 ${
                        editingCell?.id === issue.id && editingCell.field === 'uiSection'
                          ? 'bg-blue-200 dark:bg-blue-800'
                          : ''
                      }`}
                      onClick={() => handleCellClick(issue.id, 'uiSection')}
                    >
                      {editingCell?.id === issue.id && editingCell.field === 'uiSection' ? (
                        <input
                          type='text'
                          name='uiSection'
                          value={issue.uiSection}
                          onChange={e => handleCellChange(e, issue.id)}
                          onBlur={() => handleCellBlur(issue.id)}
                          onFocus={e => e.target.select()}
                          className='text-foreground px-2 py-1 w-full h-full text-sm focus:outline-none bg-transparent'
                          autoFocus
                        />
                      ) : (
                        issue.uiSection
                      )}
                    </td>
                    <td
                      className={`px-4 py-2 whitespace-nowrap w-1/5 ${
                        editingCell?.id === issue.id && editingCell.field === 'description'
                          ? 'bg-blue-200 dark:bg-blue-800'
                          : ''
                      }`}
                      onClick={() => handleCellClick(issue.id, 'description')}
                    >
                      {editingCell?.id === issue.id && editingCell.field === 'description' ? (
                        <input
                          type='text'
                          name='description'
                          value={issue.description}
                          onChange={e => handleCellChange(e, issue.id)}
                          onBlur={() => handleCellBlur(issue.id)}
                          onFocus={e => e.target.select()}
                          className='text-foreground px-2 py-1 w-full h-full text-sm focus:outline-none bg-transparent'
                          autoFocus
                        />
                      ) : (
                        issue.description
                      )}
                    </td>
                    <td className='px-4 py-2 whitespace-nowrap w-1/5'>
                      <Selector
                        statuses={['Enhancement', 'Bug', 'Feature']}
                        initialStatus={issue.type}
                        onChange={status =>
                          handleInputChange(
                            { target: { name: 'type', value: status } },
                            issue.id
                          )
                        }
                      />
                    </td>
                    <td className='px-4 py-2 whitespace-nowrap w-1/5'>
                      <Selector
                        statuses={['Low', 'Medium', 'High']}
                        initialStatus={issue.priority}
                        onChange={status =>
                          handleInputChange(
                            { target: { name: 'priority', value: status } },
                            issue.id
                          )
                        }
                      />
                    </td>
                    <td className='px-4 py-2 whitespace-nowrap w-1/5'>
                      <Selector
                        statuses={['Planned', 'In Progress', 'Completed']}
                        initialStatus={issue.status}
                        onChange={status =>
                          handleInputChange(
                            { target: { name: 'status', value: status } },
                            issue.id
                          )
                        }
                      />
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
                )
              })}
              {isAddingIssue && (
                <tr
                  ref={editingRef}
                  className={`${editableCellClass} dark:bg-gray-800`}
                >
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
                    <Selector
                      statuses={['Enhancement', 'Bug', 'Feature']}
                      initialStatus={newIssue.type}
                      onChange={status =>
                        handleInputChange({
                          target: { name: 'type', value: status },
                        })
                      }
                    />
                  </td>
                  <td
                    className={`px-4 py-2 whitespace-nowrap w-1/5 ${editableCellClass} dark:bg-gray-800`}
                  >
                    <Selector
                      statuses={['Low', 'Medium', 'High']}
                      initialStatus={newIssue.priority}
                      onChange={status =>
                        handleInputChange({
                          target: { name: 'priority', value: status },
                        })
                      }
                    />
                  </td>
                  <td
                    className={`px-4 py-2 whitespace-nowrap w-1/5 ${editableCellClass} dark:bg-gray-800`}
                  >
                    <Selector
                      statuses={['Planned', 'In Progress', 'Completed']}
                      initialStatus={newIssue.status}
                      onChange={status =>
                        handleInputChange({
                          target: { name: 'status', value: status },
                        })
                      }
                    />
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
                  className='bg-blue-400 hover:bg-blue-500 dark:bg-blue-800 dark:hover:bg-blue-700'
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
