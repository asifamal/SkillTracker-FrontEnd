import React from 'react'
import { useEffect, useState } from 'react'
import { fetchDashboard } from '../services/api'
import Loader from '../components/Loader'
import ProgressChart from '../components/Charts/ProgressChart'
import PlatformChart from '../components/Charts/PlatformChart'

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    fetchDashboard()
      .then((d) => mounted && setData(d))
      .catch((e) => setError(String(e)))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <Loader />
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-sm text-slate-500">Total Skills</div>
          <div className="text-3xl font-semibold mt-1">{data.total_skills ?? 0}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-slate-500">Total Hours</div>
          <div className="text-3xl font-semibold mt-1">{data.total_hours ?? 0}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-slate-500">Top Skill</div>
          <div className="mt-1 font-semibold">{data.top_skills_by_hours?.[0]?.name ?? '—'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProgressChart data={data.progress_breakdown || {}} />
        <PlatformChart data={data.platform_breakdown || {}} />
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">Top Skills by Hours</h3>
        <ul className="space-y-2">
          {(data.top_skills_by_hours || []).map((s: any) => (
            <li key={s.name} className="flex items-center justify-between">
              <span>{s.name}</span>
              <span className="text-slate-500">{s.hours} hrs</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Dashboard
