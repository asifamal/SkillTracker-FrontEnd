import React from 'react'
import { useEffect, useState } from 'react'
import { fetchSkillsByTag, fetchTags } from '../services/api'
import Loader from '../components/Loader'
import SkillCard, { type Skill } from '../components/SkillCard'

const Tags: React.FC = () => {
  const [tags, setTags] = useState<string[]>([])
  const [active, setActive] = useState<string>('')
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let mounted = true
    Promise.all([fetchTags(), fetchSkillsByTag('')])
      .then(([t]) => {
        if (!mounted) return
        setTags(t)
        setActive(t[0] || '')
      })
      .finally(() => setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!active) return
    let mounted = true
    setLoading(true)
    fetchSkillsByTag(active)
      .then((s) => mounted && setSkills(s))
      .finally(() => setLoading(false))
    return () => {
      mounted = false
    }
  }, [active])

  if (loading) return <Loader />

  return (
    <div className="space-y-4">
      <div className="card p-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`px-3 py-1 rounded-full border text-sm ${active === t ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 dark:border-slate-700'}`}
          >
            #{t}
          </button>
        ))}
      </div>
      <div className="grid-cards">
        {skills.map((s) => (
          <SkillCard key={s.id} skill={s} />
        ))}
      </div>
    </div>
  )
}

export default Tags
