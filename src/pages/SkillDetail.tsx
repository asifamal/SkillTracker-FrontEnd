import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { addSession, fetchSkills, updateProgress } from '../services/api'
import Loader from '../components/Loader'
import toast, { Toaster } from 'react-hot-toast'
import type { Skill } from '../components/SkillCard'

const SkillDetail: React.FC = () => {
  const { id } = useParams()
  const [skill, setSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [progress, setProgress] = useState<number>(0)
  const [session, setSession] = useState({ date: '', duration_hours: 1, notes: '' })

  useEffect(() => {
    let mounted = true
    fetchSkills()
      .then((list) => {
        const found = list.find((s: any) => String(s.id) === String(id)) || null
        if (mounted) {
          setSkill(found)
          setProgress(found?.progress ?? 0)
        }
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
      await updateProgress(id!, { progress: Number(progress) })
      toast.success('Progress updated')
      setSkill((s) => (s ? { ...s, progress: Number(progress) } : s))
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update')
    }
  }

  const onAddSession = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addSession(id!, {
        date: session.date,
        duration_hours: Number(session.duration_hours),
        notes: session.notes,
      })
      toast.success('Session added')
      setSession({ date: '', duration_hours: 1, notes: '' })
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add session')
    }
  }

  if (loading) return <Loader />
  if (error) return <div className="text-red-600">{error}</div>
  if (!skill) return <div className="text-slate-500">Skill not found</div>

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="card p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{skill.name}</h2>
            <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {skill.resource_type} • {skill.platform} • Difficulty {skill.difficulty}/5
            </div>
          </div>
          <div className="text-sm text-slate-500">Total {skill.total_hours} hrs</div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{skill.progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-1">
            <div className="h-2 bg-indigo-600 rounded-full" style={{ width: `${skill.progress}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <form onSubmit={onUpdateProgress} className="card p-4 space-y-3">
          <h3 className="font-semibold">Update Progress</h3>
          <input type="number" min={0} max={100} className="input" value={progress} onChange={(e) => setProgress(Number(e.target.value))} />
          <button className="btn-primary">Save</button>
        </form>

        <form onSubmit={onAddSession} className="card p-4 space-y-3">
          <h3 className="font-semibold">Add Learning Session</h3>
          <input type="date" className="input" value={session.date} onChange={(e) => setSession({ ...session, date: e.target.value })} />
          <input
            type="number"
            min={0}
            className="input"
            value={session.duration_hours}
            onChange={(e) => setSession({ ...session, duration_hours: Number(e.target.value) })}
            placeholder="Hours"
          />
          <textarea className="input" rows={4} placeholder="Notes" value={session.notes} onChange={(e) => setSession({ ...session, notes: e.target.value })} />
          <button className="btn-primary">Add Session</button>
        </form>
      </div>
    </div>
  )
}

export default SkillDetail
