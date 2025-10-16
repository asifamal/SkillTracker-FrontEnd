import React, { useEffect, useMemo, useState } from 'react'
import { fetchTimeline } from '../services/api'

type Activity = {
  id: number
  date: string // YYYY-MM-DD
  title: string
  hours: number
  notes?: string
  skill_id?: number
  skill_name?: string
}

const groupByDate = (items: Activity[]) => {
  const map: Record<string, Activity[]> = {}
  for (const a of items) {
    map[a.date] = map[a.date] || []
    map[a.date].push(a)
  }
  return Object.entries(map).sort((a, b) => (a[0] < b[0] ? 1 : -1))
}

const Timeline: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')

  useEffect(() => {
    let mounted = true
    fetchTimeline()
      .then((rows) => mounted && setActivities(rows as Activity[]))
      .catch((e) => setError(String(e)))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      if (fromDate && a.date < fromDate) return false
      if (toDate && a.date > toDate) return false
      return true
    })
  }, [activities, fromDate, toDate])

  const groups = groupByDate(filtered)

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold">Learning Timeline</h2>
          <p className="text-sm text-slate-500">Recent activity grouped by day</p>
        </div>
        <div className="flex items-center gap-2">
          <div>
            <label className="label">From</label>
            <input type="date" className="input" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div>
            <label className="label">To</label>
            <input type="date" className="input" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card p-4">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-6">
            {groups.map(([date, acts]) => (
              <div key={date} className="relative pl-10">
                <div className="absolute left-0 w-8 h-8 rounded-full bg-indigo-600 text-white grid place-items-center text-xs font-semibold">
                  {new Date(date).getDate()}
                </div>
                <div className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {new Date(date).toLocaleDateString()}
                </div>
                <div className="space-y-3">
                  {acts.map((a) => (
                    <div key={a.id} className="card p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{a.title}{a.skill_name ? ` • ${a.skill_name}` : ''}</div>
                        <div className="text-xs text-slate-500">{a.hours} hrs</div>
                      </div>
                      {a.notes ? <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">{a.notes}</div> : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {groups.length === 0 && <div className="card p-4 text-sm text-slate-500">No activities found</div>}
          </div>
        </div>
      )}
    </div>
  )
}

export default Timeline
