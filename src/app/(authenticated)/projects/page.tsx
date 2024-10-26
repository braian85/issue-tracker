'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  getAllProjects,
  createProject,
} from '@/clientAPI/projects/index'

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
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getAllProjects()
        setProjects(fetchedProjects as Project[])
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      }
    }

    fetchProjects()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    <div className='p-8 text-gray-300 min-h-screen relative'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-red-500'>Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className='bg-red-600 text-gray-200 px-4 py-2 rounded hover:bg-red-700 transition duration-300'
        >
          New Project
        </button>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-gray-800 p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-4 text-red-400'>Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <input
                type='text'
                name='name'
                value={newProject.name}
                onChange={handleInputChange}
                placeholder='Project Name'
                className='w-full p-2 mb-4 bg-gray-900 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-300'
                required
              />
              <input
                type='text'
                name='description'
                value={newProject.description}
                onChange={handleInputChange}
                placeholder='Project Description'
                className='w-full p-2 mb-4 bg-gray-900 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-300'
                required
              />
              <div className='flex justify-end'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='mr-2 bg-gray-600 text-gray-200 px-4 py-2 rounded hover:bg-gray-700 transition duration-300'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='bg-red-600 text-gray-200 px-4 py-2 rounded hover:bg-red-700 transition duration-300'
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className='bg-gray-800 p-6 rounded-lg shadow-md'>
        <h2 className='text-xl font-semibold mb-4 text-red-400'>Existing Projects</h2>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='bg-gray-700'>
                <th className='border border-gray-600 p-2 text-left text-red-400'>Name</th>
                <th className='border border-gray-600 p-2 text-left text-red-400'>Created</th>
                <th className='border border-gray-600 p-2 text-left text-red-400'>Updated</th>
              </tr>
            </thead>
            <tbody> 
              {projects.map(project => (
                <tr 
                  key={project.id} 
                  className='hover:bg-gray-700 cursor-pointer transition duration-150'
                  onClick={() => handleProjectClick(project.id)}
                >
                  <td className='border border-gray-600 p-2 text-gray-300'>{project.name}</td>
                  <td className='border border-gray-600 p-2 text-gray-300'>{new Date(project.createdAt).toLocaleString()}</td>
                  <td className='border border-gray-600 p-2 text-gray-300'>{new Date(project.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
