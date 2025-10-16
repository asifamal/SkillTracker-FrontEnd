import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const ProgressChart: React.FC<{ data: Record<string, number> }> = ({ data }) => {
  const labels = Object.keys(data)
  const values = Object.values(data)
  const colors = ['#6366f1', '#22d3ee', '#34d399', '#f59e0b', '#ef4444']

  return (
    <div className="card p-4 h-full">
      <h3 className="font-semibold mb-3 text-sm md:text-base">Progress Breakdown</h3>
      <div className="h-64 md:h-80">
        <Pie
          data={{
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: labels.map((_, i) => colors[i % colors.length]),
                borderWidth: 0,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 15,
                  usePointStyle: true,
                  font: {
                    size: 12
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  )
}

export default ProgressChart
