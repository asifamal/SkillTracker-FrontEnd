import React from 'react'
import { Link } from 'react-router-dom'

export type Skill = {
  id: number
  name: string
  resource_type: string
  platform: string
  progress: number
  difficulty: number
  total_hours: number
}

const SkillCard: React.FC<{ skill: Skill }> = ({ skill }) => {
  return (
    <Link to={`/skills/${skill.id}`} className="card p-4 block">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold">{skill.name}</h3>
        <span className="text-xs rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5">{skill.resource_type}</span>
      </div>
      <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{skill.platform}</div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-sm">
          <span>Progress</span>
          <span>{skill.progress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-1">
          <div className="h-2 bg-indigo-600 rounded-full" style={{ width: `${skill.progress}%` }} />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>Difficulty: {skill.difficulty}/5</span>
        <span>Total: {skill.total_hours} hrs</span>
      </div>
    </Link>
  )
}

export default SkillCard
