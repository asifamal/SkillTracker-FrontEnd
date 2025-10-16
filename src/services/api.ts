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

const STATUS_LABELS: Record<number, string> = { 1: 'Started', 2: 'In Progress', 3: 'Completed' }

export const fetchDashboard = () =>
  withFallback(
    async () => {
      const res = await api.get('dashboard/')
      const d = res.data || {}
      const statusList: Array<{ status: number; count: number }> = d.progress_breakdown || []
      const progress_breakdown: Record<string, number> = {}
      let total_skills = 0
      for (const item of statusList) {
        const label = STATUS_LABELS[item.status] || String(item.status)
        progress_breakdown[label] = (progress_breakdown[label] || 0) + (item.count || 0)
        total_skills += item.count || 0
      }
      const platform_breakdown: Record<string, number> = {}
      for (const p of d.platform_breakdown || []) {
        if (p && p.platform != null) platform_breakdown[p.platform] = p.count || 0
      }
      const top_skills_by_hours = (d.top_skills || []).map((t: any) => ({ name: t.skill_name, hours: t.times }))
      return {
        total_skills,
        total_hours: d.total_hours || 0,
        progress_breakdown,
        top_skills_by_hours,
        platform_breakdown,
      }
    },
    {
      total_skills: 3,
      total_hours: 42,
      progress_breakdown: { Started: 2, 'In Progress': 5, Completed: 3 },
      top_skills_by_hours: [
        { name: 'React', hours: 18 },
        { name: 'Python', hours: 12 },
        { name: 'SQL', hours: 7 },
      ],
      platform_breakdown: { YouTube: 20, Coursera: 10, Udemy: 12 },
    }
  )

// Fetch SkillGoal list from Django (SkillGoalListView)
export const fetchSkillGoals = async (): Promise<any[]> => {
  const res = await api.get('list_skills/')
  if (res.data && res.data.status === 1 && Array.isArray(res.data.data)) {
    return res.data.data
  }
  return []
}

// Fetch single SkillGoal detail from Django (SkillGoalDetailView)
export const fetchSkillGoalDetail = async (id: string | number): Promise<any | null> => {
  const res = await api.get(`skill_detail/${id}/`)
  if (res.data && res.data.status === 1 && res.data.data) {
    return res.data.data
  }
  return null
}

export const fetchSkills = (params?: Record<string, string | number>) =>
  withFallback(
    async () => (await api.get('skills/', { params })).data,
    []
  )

// Django SkillGoalCreateView expects: skill_name, resource_type (number), platform, status, hours_spent, notes, difficulty_rating
export const createSkill = (payload: {
  skill_name: string
  resource_type: number
  platform: string
  status?: number
  hours_spent?: number
  notes?: string
  difficulty_rating?: number
}) => api.post('skill_create/', payload)

// SkillGoalUpdateProgressView (PATCH /skills/update_skill/<id>/)
export const updateProgress = (id: string | number, payload: Partial<{ status: number; hours_spent: number; notes: string; difficulty_rating: number }>) =>
  api.patch(`update_skill/${id}/`, payload)

// SkillGoalDeleteView (DELETE /skills/delete_skill/<id>/)
export const deleteSkill = (id: string | number) => api.delete(`delete_skill/${id}/`)

// Timeline endpoints
export type TimelineParams = { skill?: string | number; from?: string; to?: string }
export const fetchTimeline = async (params?: TimelineParams) => {
  const res = await api.get('timeline/', { params })
  if (res.data && res.data.status === 1) return res.data.data as any[]
  return []
}
export const createActivity = (payload: { skill_id: number; date: string; title: string; hours?: number; notes?: string }) =>
  api.post('timeline/', payload)

export const addSession = (id: string | number, payload: any) =>
  api.post(`skills/${id}/sessions/add/`, payload)

export const fetchTags = () =>
  withFallback(async () => (await api.get('tags/')).data, ['frontend', 'backend'])

export const fetchSkillsByTag = (tag: string) =>
  withFallback(async () => (await api.get(`tags/${encodeURIComponent(tag)}/skills/`)).data, [])
