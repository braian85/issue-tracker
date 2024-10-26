import axios from 'axios'
import { getSession } from 'next-auth/react'

interface Project {
  id: number
  name: string
  description: string
  users: string[]
}

interface NewProject {
  name: string
  description: string
}

const API_BASE_URL = 'http://localhost:3003/api/projects'

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
})

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async config => {
    const session = await getSession()
    if (session?.token) {
      config.headers['Authorization'] = `Bearer ${session.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const response = await axiosInstance.get<Project[]>('')
    console.log('projects: ', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw error
  }
}

export const createProject = async (
  newProject: NewProject
): Promise<Project> => {
  try {
    const response = await axiosInstance.post<Project>('', newProject)
    return response.data
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}

export const assignUserToProject = async (
  projectId: number,
  userEmail: string
): Promise<void> => {
  try {
    await axiosInstance.post(`/${projectId}/assign`, { userEmail })
  } catch (error) {
    console.error('Error assigning user to project:', error)
    throw error
  }
}

export const getProjectById = async (projectId: number): Promise<Project> => {
  try {
    const response = await axiosInstance.get<Project>(`/${projectId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching project:', error)
    throw error
  }
}

export const updateProject = async (
  projectId: number,
  updatedProject: Partial<Project>
): Promise<Project> => {
  try {
    const response = await axiosInstance.put<Project>(
      `/${projectId}`,
      updatedProject
    )
    return response.data
  } catch (error) {
    console.error('Error updating project:', error)
    throw error
  }
}

export const deleteProject = async (projectId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/${projectId}`)
  } catch (error) {
    console.error('Error deleting project:', error)
    throw error
  }
}
