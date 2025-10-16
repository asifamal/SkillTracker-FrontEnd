import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const ProgressChart: React.FC<{ data: Record<string, number> }> = ({ data }) => {
  const labels = Object.keys(data)
  const values = Object.values(data)
  const colors = ['#6366f1', '#22d3ee', '#34d399', '#f59e0b', '#ef4444']

  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-3">Progress Breakdown</h3>
      <Pie
        data={{
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: labels.map((_, i) => colors[i % colors.length]),
            },
          ],
        }}
      />
    </div>
  )
}

export default ProgressChart
