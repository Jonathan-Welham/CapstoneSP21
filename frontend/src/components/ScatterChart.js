import React from 'react';
import {Scatter} from 'react-chartjs-2';

// const groupBy = (array, key) =>
//   array.reduce((objectsByKeyValue, obj) => {
//     const value = obj[key];
//     objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
//     return objectsByKeyValue;
//   }, {});

const groupByKey = (list, key) => list.reduce((hash, obj) => ({...hash, [obj[key]]:( hash[obj[key]] || [] ).concat(obj)}), {})

// const map = arr.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

// Get all item names
// const itemNames = items.map((item) => {
//   return item.name;
// });



const generateDataSets = data => {
  // data is a list of objects
  console.log(`Data to Parse: ${data}`);
  console.table(data);

  const groupByApp = groupByKey(data, "app");

  let apps = data.reduce((hash, obj) => ({...hash, [obj.app]:( hash[obj.app] || [] ).concat(obj)}), {});

  console.log('groupByApp: ', groupByApp);

  let dataset = [];
  for (const app in apps) {
    console.log(`Parsing data for app: ${app}`);
    let label = app;
    // let executionTimes = [];
    // groupByApp[app].forEach((test) => { executionTimes.push(test.execution_time) });
    let executionTimes = apps[app].map((test) => { return test.execution_time });
    console.log(`Execution times of all tests for app: ${app}, ${executionTimes}`);
    let map = executionTimes.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    // list of lists, 0 = time, 1 = occurance count
    // let c = [...map.entries()];
    let data = [...map.entries()].map((pair) => { 
      return { x: pair[1], y: pair[0] }; 
    });

    // data: c.map((pair) => { 
    //   return { x: pair[1], y: pair[0] }; 
    // })
    // console.log(`Execution times of all tests for app: ${app}, ${c}`);
    dataset.push({
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

  console.log(dataset);
  console.table(dataset);
  return dataset;
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
            this.setState({"data": this.props.data});
            console.log(`Props passed to ScatterChart, accessed in componentDidUpdate: ${JSON.stringify(this.props)}`);
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