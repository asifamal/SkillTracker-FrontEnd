import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const PlatformChart: React.FC<{ data: Record<string, number> }> = ({ data }) => {
  const labels = Object.keys(data)
  const values = Object.values(data)

  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-3">Platform Breakdown</h3>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: 'Hours',
              data: values,
              backgroundColor: '#22d3ee',
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } },
        }}
      />
    </div>
  )
}

export default PlatformChart
