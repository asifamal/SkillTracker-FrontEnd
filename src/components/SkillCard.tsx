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
  category?: string
}

const SkillCard: React.FC<{ skill: Skill }> = ({ skill }) => {
  return (
    <Link to={`/skills/${skill.id}`} className="card p-3 md:p-4 block hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm md:text-base truncate flex-1">{skill.name}</h3>
        <div className="flex flex-col gap-1 items-end flex-shrink-0">
          <span className="text-xs rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 whitespace-nowrap">{skill.resource_type}</span>
          {skill.category && (
            <span className="text-xs rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 whitespace-nowrap">
              {skill.category}
            </span>
          )}
        </div>
      </div>
      <div className="mt-2 md:mt-3 text-xs md:text-sm text-slate-600 dark:text-slate-300 truncate">{skill.platform}</div>
      <div className="mt-2 md:mt-3">
        <div className="flex items-center justify-between text-xs md:text-sm">
          <span>Progress</span>
          <span>{skill.progress}%</span>
        </div>
        <div className="w-full h-1.5 md:h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-1">
          <div className="h-1.5 md:h-2 bg-indigo-600 rounded-full" style={{ width: `${skill.progress}%` }} />
        </div>
      </div>
      <div className="mt-2 md:mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>Difficulty: {skill.difficulty}/5</span>
        <span>Total: {skill.total_hours} hrs</span>
      </div>
    </Link>
  )
}

export default SkillCard
