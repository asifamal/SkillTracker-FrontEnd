import React from 'react'
import { useMemo, useState } from 'react'
import SkillCard, { type Skill } from '../components/SkillCard'

const DEMO_SKILLS: Skill[] = [
  { id: 1, name: 'React', resource_type: 'course', platform: 'Udemy', progress: 70, difficulty: 3, total_hours: 18, tags: ['frontend', 'web'] },
  { id: 2, name: 'Python', resource_type: 'book', platform: 'Book', progress: 40, difficulty: 2, total_hours: 12, tags: ['backend'] },
  { id: 3, name: 'SQL', resource_type: 'article', platform: 'Blog', progress: 20, difficulty: 2, total_hours: 7, tags: ['data'] },
  { id: 4, name: 'TypeScript', resource_type: 'video', platform: 'YouTube', progress: 55, difficulty: 3, total_hours: 10, tags: ['frontend'] },
]

const SkillsList: React.FC = () => {
  const [skills] = useState<Skill[]>(DEMO_SKILLS)
  const [progressFilter, setProgressFilter] = useState<string>('all')
  const [tagFilter, setTagFilter] = useState<string>('')

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      const meetsProgress =
        progressFilter === 'all' ||
        (progressFilter === 'started' && s.progress > 0 && s.progress < 30) ||
        (progressFilter === 'in_progress' && s.progress >= 30 && s.progress < 100) ||
        (progressFilter === 'completed' && s.progress === 100)
      const meetsTag = !tagFilter || s.tags?.some((t) => t.toLowerCase().includes(tagFilter.toLowerCase()))
      return meetsProgress && meetsTag
    })
  }, [skills, progressFilter, tagFilter])

  return (
    <div className="space-y-4">
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
        <div className="w-full md:w-64">
          <input className="input" placeholder="Filter by tag" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} />
        </div>
      </div>

      <div className="grid-cards">
        {filtered.map((s) => (
          <SkillCard key={s.id} skill={s} />
        ))}
      </div>
    </div>
  )
}

export default SkillsList
