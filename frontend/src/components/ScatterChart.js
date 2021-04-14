import React from 'react';
import {Scatter} from 'react-chartjs-2';

const generateDataSets = data => {
  // The parameter data is an array of objects, each containing all information pertaining to an individual test
  
  // Gather data by app name - create an object which uses app names as keys whose value is all tests performed on said app
  let apps = data.reduce((hash, obj) => ({...hash, [obj.app]:( hash[obj.app] || [] ).concat(obj)}), {});

  // Create an array to hold an object containing all data needed for a dataset of a scatter chart
  let datasets = [];

  // Create a dataset for each app identified in the object 'apps'
  for (const app in apps) {
    // For this app, retrieve the execution time for each test performed
    let executionTimes = apps[app].map((test) => { return test.execution_time });

    // The plott will visualize how many tests ended after a period of time
    // The x-axis will tell the number of tests, while the y-axis tells the execution time

    // Calculate how many occurances of each execution time there are for this app's tests
    let map = executionTimes.reduce((occurances, time) => occurances.set(time, (occurances.get(time) || 0) + 1), new Map());
    
    // Map will be reinterpreted as a list of lists where the zeroth elem. represents exec. time, 
    // and the first element represents the count of occurances
    // Then the data used for plotting will be computed, determining the x and y values for each point on the scatter plot
    let data = [...map.entries()].map((pair) => { 
      return { x: pair[1], y: pair[0] }; 
    });

    // Collect all data computed as an object and append it to the datasets array
    datasets.push({
      label: app,
      fill: false,
      backgroundColor: 'rgba(75,192,192,0.4)',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 5,
      pointHoverRadius: 10,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: data
    });
  }

  return datasets;
};

class ScatterChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = { "data": [] };
  }

  componentDidMount() {
    this.setState({ "data": this.props.data });
  }

  componentDidUpdate(prevProps, prevState){
    if (prevProps.data !== this.props.data) {
      console.log(`New props passed to ScatterChart, accessed in componentDidUpdate: ${JSON.stringify(this.props)}`);
      this.setState({"data": this.props.data});
      let scatterData = {
        datasets: generateDataSets(this.props.data)
      };
      this.setState({"scatterData": scatterData});
    }
  }

  render() {
    return (
      <>
        <div className='header'>
          <h1 className='title'>Execution Times</h1>
        </div>
        <Scatter data={this.state.scatterData} options={{
          maintainAspectRatio: true,
          scales: {
            yAxes: [{
              stacked: true,
              scaleLabel: {
                display: true,
                labelString: 'Time (s)'
              },
              ticks: {
                beginAtZero: true
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: '# of Tests'
              },
              ticks: {
                min: 1,
                stepSize: 1
              }
            }]
          }
        }}/>
      </>
    );
  }
}

export default ScatterChart;