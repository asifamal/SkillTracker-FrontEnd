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
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-semibold">Learning Timeline</h2>
          <p className="text-xs md:text-sm text-slate-500">Recent activity grouped by day</p>
        </div>
        <div className="flex items-center gap-2">
          <div>
            <label className="label text-xs">From</label>
            <input type="date" className="input text-xs" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div>
            <label className="label text-xs">To</label>
            <input type="date" className="input text-xs" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card p-4 text-sm">Loading...</div>
      ) : error ? (
        <div className="text-red-600 text-sm">{error}</div>
      ) : (
        <div className="relative">
          <div className="absolute left-2 md:left-4 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-4 md:space-y-6">
            {groups.map(([date, acts]) => (
              <div key={date} className="relative pl-6 md:pl-10">
                <div className="absolute left-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-indigo-600 text-white grid place-items-center text-xs font-semibold">
                  {new Date(date).getDate()}
                </div>
                <div className="mb-2 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {new Date(date).toLocaleDateString()}
                </div>
                <div className="space-y-2 md:space-y-3">
                  {acts.map((a) => (
                    <div key={a.id} className="card p-3 md:p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-medium text-sm md:text-base truncate flex-1">
                          {a.title}{a.skill_name ? ` • ${a.skill_name}` : ''}
                        </div>
                        <div className="text-xs text-slate-500 flex-shrink-0">{a.hours} hrs</div>
                      </div>
                      {a.notes ? <div className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">{a.notes}</div> : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {groups.length === 0 && <div className="card p-4 text-xs md:text-sm text-slate-500">No activities found</div>}
          </div>
        </div>
      )}
    </div>
  )
}

export default Timeline
