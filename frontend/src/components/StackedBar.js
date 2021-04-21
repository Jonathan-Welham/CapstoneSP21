import React from 'react'
import { Bar } from 'react-chartjs-2'

/**
 * Helper function to compile arrays into a single object for use in a Bar component as a property (prop)
 * @param apps Array of strings (app names) 
 * @param passing Array of integers (number of passing tests for each app) 
 * @param failing Array of integers (number of failing tests for each app) 
 * @returns Object with attributes required to populate a Bar chart
 */
const compileData = (apps, passing, failing) => {
  return {
    labels: apps,
    datasets: [
      {
        label: "# Failing",
        data: failing,
        backgroundColor: 'rgb(255, 99, 132)'
      },
      {
        label: '# Passing',
        data: passing,
        backgroundColor: 'rgb(75, 192, 192)'
      }
    ]
  };
};

/**
 * Processes array of objects passed to the StackedBar component as a property (prop)
 * to calculate the number of passed an failed tests for each app
 * @param data Array of objects with attributes pertaining to a single test 
 * @returns Object with attributes required to populate a Bar chart
 */
const processData = (data) => {
  // Step #1: Take the array of objects and create a single object which uses app names as keys whose value is all tests performed on said app

  /*
  Approach: The Reduce Method
    The reduce() method executes a callback function on each element of an array, which takes the following arguments:
      accumulator
      currentValue
      initialValue
    The callback function's returned value is assigned to the accumulator, 
    whose value is remembered across each iteration throughout the array, 
    and ultimately becomes the final, single resulting value
    The current element being processed in the array is assigned to the currentValue
    The initialValue is a value to use as the first argument to the first call of the callback
    Syntax: array.reduce(callback(accumulator, currentValue), initialValue)
    Apply the reduce function to the array "data", 
    in the callback the paramter "hash" will denote the accumulator,
    whose datatype will be an object (as defined by the inital value -> {}), 
    and "obj" will denote the current element in the array
    For each element: 
      Check if the app name has been selected as a key in hash, 
      if so set the value to the current value of the pair in hash which should be a list of objects,
      if not create a key value pair with the app name as the key and set its value to an empty array,
      then concatenate the current object to this key's list of objects
      Return a merged object containg hash and this key value pair
    The end result will be a single objects with unique app names as keys, and their pertaining list of test objects as their values
  */

  let apps = data.reduce((hash, obj) => ({...hash, [obj.app]:( hash[obj.app] || [] ).concat(obj)}), {});

  // Step #2 Gather labels for x-axis

  /*
  Approach: The Object.keys() Method 
    The Object.keys() method returns an array of a given object's own enumerable property names
    The stacked bar chart will use app names across the x-axis, 
    app names can be gathered by calling the Object.keys() method on the apps object that was just created, 
    as it uses app names as keys
   */
  const appNames = Object.keys(apps);

  // Step #3: Discern the count of passing and failing tests for each app (y level of each app's bar)

  /*
  Approach: Object Iteration
    For each app iterate through its related array of test objects, 
    and for each object retrieve its tests status
    Compose these statuses as an array of strings (Possible values: "Pass", "pass", "Fail", "fail")
    From this array, calculate the count of occurances of each possible status
    Append these counts to their relative arrays for organization as a dataset to be composed as a bar chart
  */

  // Create arrays to hold the number of passing and failing test results for each app,
  // they will be used in the datasets needed to populate the stacked bar chart
  let passing = [];
  let failing = [];

  // Compute how many occurences of each status exist for each test by app
  for (const app in apps) {
    // For this app, retrieve the status for each test performed
    let testStatuses = apps[app].map((test) => { return test.test_status });

    // Calculate how many occurances of each status there are for this app's tests
    let map = testStatuses.reduce((occurances, status) => occurances.set(status, (occurances.get(status) || 0) + 1), new Map());

    // Map will be reinterpreted as a list of lists where the zeroth elem. represents status, 
    // and the first element represents the count of occurances
    // Then the data used for plotting will be gathered in the arrays passing and failing

    // These values are preset in case an app has tests with no pass/fail statuses
    let passCount = 0;
    let failCount = 0;

    [...map.entries()].map((pair) => { 
      // Status casing is not consistent in database
      if (pair[0] === "Pass" || pair[0] === "pass") {
          passCount += pair[1];
      } else if (pair[0] === "Fail" || pair[0] === "fail") {
          failCount += pair[1];
      }
    });

    passing.push(passCount);
    failing.push(failCount);
  }

  return compileData(appNames, passing, failing);
};

// Object to serve as the options prop of the Bar component
const options = {
  scales: {
    yAxes: [
      {
        stacked: true,
        ticks: {
          beginAtZero: true,
          stepSize: 1
        }
      }
    ],
    xAxes: [
      {
        stacked: true
      }
    ]
  }
};

class StackedBar extends React.Component {
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
      this.setState({"stackedBarData": processData(this.props.data)});
    }
  }

  render() {
    return (
      <>
        <div className='header'>
          <h1 className='title'>Total: Pass/Fail</h1>
        </div>
        <Bar data={this.state.stackedBarData} options={options}/>
      </>
    );
  }
}

export default StackedBar;