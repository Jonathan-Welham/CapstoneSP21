import React from 'react'
import { Bar } from 'react-chartjs-2'



// console.log(this.props.data);

const StackedBar = (props) => {
  console.log(props.t);

  const arr = []

  props.t.allApplications.map((app => (
    arr.push(app.app)
  )));

  for(var i = 0; i < arr.length; i++){
    console.log(arr[i])
  }


  const data = {
    // labels: ['1', '2', '3', '4', '5', '6'],
    labels: arr,
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
  return(  
    <>
      <h2 className='title'>Total: Pass/Fail</h2>
      <Bar data={data} options={options} />

    </>
  );
}

export default StackedBar