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
      const payload = {
        skill_name: form.name,
        resource_type: RESOURCE_TYPE_MAP[form.resource_type] ?? 1,
        platform: form.platform,
        status: 1,
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
    <div className="p-4 md:p-0">
      <Toaster />
      <div className="max-w-3xl mx-auto">
        <div className="mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold">Add Skill</h2>
          <p className="text-sm text-slate-500">Create a new learning goal</p>
        </div>
        <form onSubmit={onSubmit} className="card p-4 md:p-5 space-y-4 md:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="sm:col-span-2">
              <label className="label text-sm">Name</label>
              <input className="input text-sm" value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </div>
            <div>
              <label className="label text-sm">Resource Type</label>
              <select className="input text-sm" value={form.resource_type} onChange={(e) => set('resource_type', e.target.value)}>
                {['video', 'course', 'article'].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label text-sm">Platform</label>
              <input className="input text-sm" value={form.platform} onChange={(e) => set('platform', e.target.value)} placeholder="e.g., YouTube, Udemy" />
            </div>
            <div>
              <label className="label text-sm">Difficulty (1-5)</label>
              <input type="number" min={1} max={5} className="input text-sm" value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)} />
            </div>
            <div>
              <label className="label text-sm">Estimated Hours</label>
              <input type="number" min={0} className="input text-sm" value={form.estimated_hours} onChange={(e) => set('estimated_hours', e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-end pt-2">
            <button className="btn-primary w-full sm:w-auto text-sm md:text-base" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddSkill
