'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAllProjects, createProject } from '@/clientAPI/projects/index'
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import Loader from '@/components/loader/loader'

interface Project {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState({ name: '', description: '' })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getAllProjects()
        setProjects(fetchedProjects as Project[])
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (isLoading) {
    return <Loader />
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProject(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const createdProject = await createProject(newProject)
      setProjects(prev => [...prev, createdProject as Project])
      setNewProject({ name: '', description: '' })
      setIsModalOpen(false)
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const handleProjectClick = (projectId: number) => {
    router.push(`/projects/${projectId}`)
  }

  return (
    <div className='container mx-auto px-4 py-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-4xl font-bold text-blue-500'>Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className='text-white px-6 py-3 rounded-lg dark:bg-blue-600 bg-blue-600 hover:bg-blue-700 transition duration-300 shadow-lg'
        >
          Create New Project
        </button>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm z-50'>
          <div className='p-8 rounded-xl shadow-2xl max-w-md w-full mx-4'>
            <h2 className='text-2xl font-semibold mb-6 text-blue-400'>
              Create New Project
            </h2>
            <form onSubmit={handleCreateProject} className='space-y-6'>
              <div className='space-y-2'>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-300'
                >
                  Project Name
                </label>
                <input
                  id='name'
                  type='text'
                  name='name'
                  value={newProject.name}
                  onChange={handleInputChange}
                  className='w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300'
                  required
                />
              </div>
              <div className='space-y-2'>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-gray-300'
                >
                  Project Description
                </label>
                <input
                  id='description'
                  type='text'
                  name='description'
                  value={newProject.description}
                  onChange={handleInputChange}
                  className='w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300'
                  required
                />
              </div>
              <div className='flex justify-end space-x-4 pt-4'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='px-6 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition duration-300'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg'
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className='rounded-xl shadow-xl p-8'>
        <div className='overflow-hidden rounded-lg border border-gray-700'>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent border-gray-700'>
                <TableHead className='text-gray-800 dark:text-gray-300'>Name</TableHead>
                <TableHead className='text-gray-800 dark:text-gray-300'>Created</TableHead>
                <TableHead className='text-gray-800 dark:text-gray-300'>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map(project => (
                <TableRow
                  key={project.id}
                  className='cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors border-gray-700'
                  onClick={() => handleProjectClick(project.id)}
                >
                  <TableCell className='font-medium text-gray-900 dark:text-gray-200'>
                    {project.name}
                  </TableCell>
                  <TableCell className='text-gray-800 dark:text-gray-300'>
                    {new Date(project.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className='text-gray-800 dark:text-gray-300'>
                    {new Date(project.updatedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
