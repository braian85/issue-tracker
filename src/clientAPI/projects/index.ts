import axios from 'axios'
import { getSession, signIn } from 'next-auth/react'
import { Session } from 'next-auth'

interface Project {
  id: number
  name: string
  description: string
}

interface Issue {
  id: number
  uiSection: string
  description: string
  type: string
  priority: string
  status: string
  projectId: number
}

const API_BASE_URL =
  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api` || 'http://localhost:3003/api'

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/projects`,
})

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async config => {
    const session = (await getSession()) as Session & { token: string }
    if (session?.token) {
      config.headers['Authorization'] = `Bearer ${session.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Add a response interceptor after the request interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Trigger NextAuth's sign in flow which will refresh the token
        await signIn('google', { redirect: false })
        
        // Get the new session with fresh token
        const newSession = (await getSession()) as Session & { token: string }
        
        // Update the request header with new token
        originalRequest.headers['Authorization'] = `Bearer ${newSession.token}`
        
        // Retry the original request
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/auth/signin'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const response = await axiosInstance.get<Project[]>('')
    return response.data
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw error
  }
}

export const createProject = async (
  project: Omit<Project, 'id'>
): Promise<Project> => {
  try {
    const response = await axiosInstance.post<Project>('', project)
    return response.data
  } catch (error) {
    console.error('Error creating project:', error)
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

export const createIssue = async (
  projectId: number,
  issue: Omit<Issue, 'id' | 'projectId'>
): Promise<Issue> => {
  try {
    const response = await axiosInstance.post<Issue>(
      `/${projectId}/issues`,
      issue
    )
    return response.data
  } catch (error) {
    console.error('Error creating issue:', error)
    throw error
  }
}

export const getProjectIssues = async (projectId: number): Promise<Issue[]> => {
  try {
    const response = await axiosInstance.get<Issue[]>(`/${projectId}/issues`)
    return response.data
  } catch (error) {
    console.error('Error fetching project issues:', error)
    throw error
  }
}

export const getIssueById = async (
  projectId: number,
  issueId: number
): Promise<Issue> => {
  try {
    const response = await axiosInstance.get<Issue>(
      `/${projectId}/issues/${issueId}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching issue:', error)
    throw error
  }
}

export const updateIssue = async (
  projectId: number,
  issueId: number,
  updatedIssue: Partial<Issue>
): Promise<Issue> => {
  try {
    const response = await axiosInstance.put<Issue>(
      `/${projectId}/issues/${issueId}`,
      updatedIssue
    )
    return response.data
  } catch (error) {
    console.error('Error updating issue:', error)
    throw error
  }
}

export const deleteIssue = async (
  projectId: number,
  issueId: number
): Promise<void> => {
  try {
    await axiosInstance.delete(`/${projectId}/issues/${issueId}`)
  } catch (error) {
    console.error('Error deleting issue:', error)
    throw error
  }
}
