import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const PlatformChart: React.FC<{ data: Record<string, number> }> = ({ data }) => {
  const labels = Object.keys(data)
  const values = Object.values(data)

  return (
    <div className="card p-4 h-full">
      <h3 className="font-semibold mb-3 text-sm md:text-base">Platform Breakdown</h3>
      <div className="h-64 md:h-80">
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: 'Skills',
                data: values,
                backgroundColor: '#22d3ee',
                borderRadius: 4,
                borderSkipped: false,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
              legend: { 
                display: false 
              } 
            },
            scales: { 
              y: { 
                beginAtZero: true,
                grid: {
                  color: 'rgba(148, 163, 184, 0.1)'
                },
                ticks: {
                  font: {
                    size: 12
                  }
                }
              },
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  font: {
                    size: 12
                  }
                }
              }
            },
          }}
        />
      </div>
    </div>
  )
}

export default PlatformChart
