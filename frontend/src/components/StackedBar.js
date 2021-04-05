import React from 'react'
import { Bar } from 'react-chartjs-2'

const data = {
  labels: ['1', '2', '3', '4', '5', '6'],
//   labels: this.props.props.allapplications,
  datasets: [
    {
      label: '# Failing',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: 'rgb(255, 99, 132)',
    },
    {
      label: '# Passing',
      data: [3, 10, 13, 15, 22, 30],
      backgroundColor: 'rgb(75, 192, 192)',
    },
  ],
}

const options = {
  scales: {
    yAxes: [
      {
        stacked: true,
        ticks: {
          beginAtZero: true,
        },
      },
    ],
    xAxes: [
      {
        stacked: true,
      },
    ],
  },
}

const StackedBar = () => (
    <>
        <div className='header'>
        <h1 className='title'>Total: Pass/Fail</h1>
        </div>
        <Bar data={data} options={options} />
    </>
)

export default StackedBar