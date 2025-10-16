import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchSkillGoalDetail, updateProgress } from '../services/api'
import Loader from '../components/Loader'
import toast, { Toaster } from 'react-hot-toast'
import type { Skill } from '../components/SkillCard'

const RESOURCE_LABELS: Record<number, string> = { 1: 'Video', 2: 'Course', 3: 'Article' }
const STATUS_LABELS: Record<number, string> = { 1: 'Started', 2: 'In Progress', 3: 'Completed' }

const mapBackendToSkill = (g: any): Skill => ({
  id: g.id,
  name: g.skill_name,
  resource_type: typeof g.resource_type === 'number' ? (RESOURCE_LABELS[g.resource_type] || String(g.resource_type)) : g.resource_type || '—',
  platform: g.platform || '—',
  progress: 0,
  difficulty: g.difficulty_rating ?? 1,
  total_hours: g.hours_spent ?? 0,
})

const SkillDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [skill, setSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [status, setStatus] = useState<number>(1)
  const [hoursSpent, setHoursSpent] = useState<number>(0)
  const [notes, setNotes] = useState<string>('')
  const [difficulty, setDifficulty] = useState<number>(1)

  useEffect(() => {
    let mounted = true
    if (!id) return
    fetchSkillGoalDetail(id)
      .then((data) => {
        if (!mounted || !data) return
        const mapped = mapBackendToSkill(data)
        setSkill(mapped)
        setStatus(data.status ?? 1)
        setHoursSpent(data.hours_spent ?? 0)
        setNotes(data.notes ?? '')
        setDifficulty(data.difficulty_rating ?? 1)
      })
      .catch((e) => setError(String(e)))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [id])

  const onUpdateProgress = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProgress(id!, {
        status: Number(status),
        hours_spent: Number(hoursSpent),
        notes,
        difficulty_rating: Number(difficulty),
      })
      toast.success('Updated')
      navigate('/skills')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update')
    }
  }

  if (loading) return <Loader />
  if (error) return <div className="text-red-600">{error}</div>
  if (!skill) return <div className="text-slate-500">Skill not found</div>

  return (
    <div className="space-y-6">
      <Toaster />

      {/* Header Card */}
      <div className="card p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{skill.name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                {skill.resource_type}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60">
                {skill.platform}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                {STATUS_LABELS[status] || '—'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <div className="text-xs text-slate-500">Hours</div>
              <div className="text-lg font-semibold">{skill.total_hours}</div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <div className="text-xs text-slate-500">Difficulty</div>
              <div className="text-lg font-semibold">{skill.difficulty}/5</div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 col-span-2 md:col-span-1">
              <div className="text-xs text-slate-500">ID</div>
              <div className="text-lg font-semibold">{skill.id}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <form onSubmit={onUpdateProgress} className="card p-5 lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold">Update Skill</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Status</label>
              <select className="input" value={status} onChange={(e) => setStatus(Number(e.target.value))}>
                <option value={1}>Started</option>
                <option value={2}>In Progress</option>
                <option value={3}>Completed</option>
              </select>
            </div>
            <div>
              <label className="label">Hours Spent</label>
              <input type="number" min={0} className="input" value={hoursSpent} onChange={(e) => setHoursSpent(Number(e.target.value))} />
            </div>
            <div>
              <label className="label">Difficulty (1-5)</label>
              <input type="number" min={1} max={5} className="input" value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))} />
            </div>
            <div className="md:col-span-2">
              <label className="label">Notes</label>
              <textarea className="input" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
          <div className="pt-2">
            <button className="btn-primary">Save Changes</button>
          </div>
        </form>

        <div className="card p-5 space-y-3">
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center justify-between py-1">
              <span>Current Status</span>
              <span className="font-medium">{STATUS_LABELS[status] || '—'}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Hours Spent</span>
              <span className="font-medium">{hoursSpent}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Difficulty</span>
              <span className="font-medium">{difficulty}/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillDetail
