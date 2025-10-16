import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSkill } from '../services/api'
import toast, { Toaster } from 'react-hot-toast'

const RESOURCE_TYPE_MAP: Record<string, number> = {
  video: 1,
  course: 2,
  article: 3,
}

const AddSkill: React.FC = () => {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    resource_type: 'course',
    platform: '',
    difficulty: 3,
    estimated_hours: 0,
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (!form.name.trim()) {
        toast.error('Name is required')
        return
      }
      // Map to Django SkillGoalCreateView fields
      const payload = {
        skill_name: form.name,
        resource_type: RESOURCE_TYPE_MAP[form.resource_type] ?? 1,
        platform: form.platform,
        status: 1, // default new
        hours_spent: Number(form.estimated_hours) || 0,
        notes: '',
        difficulty_rating: Number(form.difficulty) || 1,
      }
      const res = await createSkill(payload)
      const ok = (res as any)?.data?.status === 1
      if (ok) {
        toast.success('Skill created')
        navigate('/skills')
      } else {
        toast.error('Failed to create')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create')
    } finally {
      setSubmitting(false)
    }
  }

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }))

  return (
    <div>
      <Toaster />
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Add Skill</h2>
          <p className="text-sm text-slate-500">Create a new learning goal</p>
        </div>
        <form onSubmit={onSubmit} className="card p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Name</label>
              <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </div>
            <div>
              <label className="label">Resource Type</label>
              <select className="input" value={form.resource_type} onChange={(e) => set('resource_type', e.target.value)}>
                {['video', 'course', 'article'].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Platform</label>
              <input className="input" value={form.platform} onChange={(e) => set('platform', e.target.value)} />
            </div>
            <div>
              <label className="label">Difficulty (1-5)</label>
              <input type="number" min={1} max={5} className="input" value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)} />
            </div>
            <div>
              <label className="label">Estimated Hours</label>
              <input type="number" min={0} className="input" value={form.estimated_hours} onChange={(e) => set('estimated_hours', e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-end pt-2">
            <button className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddSkill
