import axios from 'axios'

export const API_BASE_URL = 'http://localhost:8000/skills/'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Mock helpers in case backend is down
const withFallback = async <T>(fn: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await fn()
  } catch (err) {
    console.warn('API fallback engaged:', err)
    return fallback
  }
}

export const fetchDashboard = () =>
  withFallback(
    async () => (await api.get('dashboard/')).data,
    {
      total_skills: 3,
      total_hours: 42,
      progress_breakdown: { started: 2, in_progress: 5, completed: 3 },
      top_skills_by_hours: [
        { name: 'React', hours: 18 },
        { name: 'Python', hours: 12 },
        { name: 'SQL', hours: 7 },
      ],
      platform_breakdown: { YouTube: 20, Coursera: 10, Udemy: 12 },
    }
  )

export const fetchSkills = (params?: Record<string, string | number>) =>
  withFallback(
    async () => (await api.get('skills/', { params })).data,
    [
      {
        id: 1,
        name: 'React',
        resource_type: 'course',
        platform: 'Udemy',
        progress: 70,
        difficulty: 3,
        total_hours: 18,
        tags: ['frontend', 'web'],
      },
      {
        id: 2,
        name: 'Python',
        resource_type: 'book',
        platform: 'Book',
        progress: 40,
        difficulty: 2,
        total_hours: 12,
        tags: ['backend'],
      },
    ]
  )

// Django SkillGoalCreateView expects: skill_name, resource_type, platform, status, hours_spent, notes, difficulty_rating
export const createSkill = (payload: {
  skill_name: string
  resource_type: string
  platform: string
  status?: number
  hours_spent?: number
  notes?: string
  difficulty_rating?: number
}) => api.post('skill_create/', payload)

export const updateProgress = (id: string | number, payload: any) =>
  api.post(`skills/${id}/update_progress/`, payload)
export const addSession = (id: string | number, payload: any) =>
  api.post(`skills/${id}/sessions/add/`, payload)

export const fetchTags = () =>
  withFallback(async () => (await api.get('tags/')).data, ['frontend', 'backend'])

export const fetchSkillsByTag = (tag: string) =>
  withFallback(async () => (await api.get(`tags/${encodeURIComponent(tag)}/skills/`)).data, [])
