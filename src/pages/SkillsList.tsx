import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import SkillCard, { type Skill } from '../components/SkillCard'
import { fetchSkillGoals, deleteSkill } from '../services/api'
import Loader from '../components/Loader'
import toast, { Toaster } from 'react-hot-toast'

type UISkill = Skill & { status?: number }

const RESOURCE_LABELS: Record<number, string> = { 1: 'Video', 2: 'Course', 3: 'Article' }

const mapBackendToSkill = (g: any): UISkill => ({
  id: g.id,
  name: g.skill_name,
  resource_type:
    typeof g.resource_type === 'number'
      ? (RESOURCE_LABELS[g.resource_type] || String(g.resource_type))
      : g.resource_type || '—',
  platform: g.platform || '—',
  progress: 0, // percent not provided by backend
  difficulty: g.difficulty_rating ?? 1,
  total_hours: g.hours_spent ?? 0,
  status: g.status,
})

const SkillsList: React.FC = () => {
  const [skills, setSkills] = useState<UISkill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [progressFilter, setProgressFilter] = useState<string>('all')

  useEffect(() => {
    let mounted = true
    fetchSkillGoals()
      .then((rows) => mounted && setSkills(rows.map(mapBackendToSkill)))
      .catch((e) => setError(String(e)))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      if (progressFilter === 'all') return true
      if (progressFilter === 'started') return s.status === 1
      if (progressFilter === 'in_progress') return s.status === 2
      if (progressFilter === 'completed') return s.status === 3
      return true
    })
  }, [skills, progressFilter])

  const confirmDelete = (id: number) => {
    const tId = toast.custom((_) => (
      <div className="card p-3 flex items-center gap-3">
        <div className="text-sm">Delete this skill?</div>
        <div className="ml-auto flex gap-2">
          <button
            className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 text-sm"
            onClick={() => toast.dismiss(tId)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded bg-red-600 text-white text-sm"
            onClick={async () => {
              toast.dismiss(tId)
              const loadingId = toast.loading('Deleting...')
              try {
                await deleteSkill(id)
                setSkills((prev) => prev.filter((s) => s.id !== id))
                toast.success('Deleted')
              } catch (e) {
                toast.error('Failed to delete')
              } finally {
                toast.dismiss(loadingId)
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ))
  }

  if (loading) return <Loader />
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-4">
      <Toaster />
      <div className="card p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="label">Progress</label>
          <select className="input" value={progressFilter} onChange={(e) => setProgressFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="started">Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid-cards">
        {filtered.map((s) => (
          <div key={s.id} className="relative group">
            <button
              onClick={() => confirmDelete(s.id)}
              className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition text-xs px-2 py-1 rounded bg-red-600 text-white"
            >
              Delete
            </button>
            <SkillCard skill={s} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkillsList
