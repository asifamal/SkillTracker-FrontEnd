import React from 'react'
import { useEffect, useState } from 'react'
import { fetchDashboard } from '../services/api'
import Loader from '../components/Loader'
import ProgressChart from '../components/Charts/ProgressChart'
import PlatformChart from '../components/Charts/PlatformChart'
import { FiBookOpen, FiClock, FiTrendingUp } from 'react-icons/fi'

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
      {/* Hero */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Welcome back</h1>
            <p className="text-white/80 mt-1">Track your learning progress and insights</p>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-sm uppercase tracking-wide text-white/70">Top Skill</div>
            <div className="text-lg font-semibold">{data.top_skills_by_hours?.[0]?.name ?? '—'}</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            <FiBookOpen />
          </div>
          <div>
            <div className="text-sm text-slate-500">Total Skills</div>
            <div className="text-2xl font-semibold mt-0.5">{data.total_skills ?? 0}</div>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            <FiClock />
          </div>
          <div>
            <div className="text-sm text-slate-500">Total Hours</div>
            <div className="text-2xl font-semibold mt-0.5">{data.total_hours ?? 0}</div>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
            <FiTrendingUp />
          </div>
          <div>
            <div className="text-sm text-slate-500">Top Skill</div>
            <div className="text-2xl font-semibold mt-0.5 truncate max-w-[12rem]">{data.top_skills_by_hours?.[0]?.name ?? '—'}</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProgressChart data={data.progress_breakdown || {}} />
        <PlatformChart data={data.platform_breakdown || {}} />
      </div>

      {/* Top Skills List */}
      <div className="card p-4">
        <h3 className="font-semibold mb-3">Top Skills by Hours</h3>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {(data.top_skills_by_hours || []).map((s: any) => (
            <div key={s.name} className="flex items-center justify-between py-2">
              <span className="font-medium">{s.name}</span>
              <span className="text-slate-500">{s.hours} hrs</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
