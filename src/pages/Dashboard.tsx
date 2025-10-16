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
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div className="rounded-2xl p-4 md:p-6 bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">Welcome back</h1>
            <p className="text-white/80 mt-1 text-sm md:text-base">Track your learning progress and insights</p>
          </div>
          <div className="text-right">
            <div className="text-xs md:text-sm uppercase tracking-wide text-white/70">Top Skill</div>
            <div className="text-base md:text-lg font-semibold truncate">{data.top_skills_by_hours?.[0]?.name ?? '—'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <div className="card p-3 md:p-4 flex items-center gap-3">
          <div className="p-2 md:p-3 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            <FiBookOpen size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs md:text-sm text-slate-500">Total Skills</div>
            <div className="text-lg md:text-2xl font-semibold mt-0.5">{data.total_skills ?? 0}</div>
          </div>
        </div>
        <div className="card p-3 md:p-4 flex items-center gap-3">
          <div className="p-2 md:p-3 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            <FiClock size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs md:text-sm text-slate-500">Total Hours</div>
            <div className="text-lg md:text-2xl font-semibold mt-0.5">{data.total_hours ?? 0}</div>
          </div>
        </div>
        <div className="card p-3 md:p-4 flex items-center gap-3 sm:col-span-2 lg:col-span-1">
          <div className="p-2 md:p-3 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
            <FiTrendingUp size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs md:text-sm text-slate-500">Top Skill</div>
            <div className="text-lg md:text-2xl font-semibold mt-0.5 truncate">{data.top_skills_by_hours?.[0]?.name ?? '—'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="min-h-[300px]">
          <ProgressChart data={data.progress_breakdown || {}} />
        </div>
        <div className="min-h-[300px]">
          <PlatformChart data={data.platform_breakdown || {}} />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3 text-sm md:text-base">Top Skills by Hours</h3>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {(data.top_skills_by_hours || []).map((s: any) => (
            <div key={s.name} className="flex items-center justify-between py-2">
              <span className="font-medium text-sm md:text-base truncate pr-2">{s.name}</span>
              <span className="text-slate-500 text-sm md:text-base flex-shrink-0">{s.hours} hrs</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
