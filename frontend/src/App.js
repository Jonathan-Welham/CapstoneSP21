
import { Component } from 'react'
import "./App.css"
import Left from "./components/Left"
import Right from "./components/Right"
import { Box } from '@material-ui/core'
import axios from 'axios'

class App extends Component{

  /*
    We treat constructor as a default constructor.
    Constructor only gets called once per component mount
  */
  constructor(props){
    console.log("App: Constructor");
    super(props);
    this.state = {
        "allApplications": [],
        "tests": [],
        'chosenApp': ''
    };
    this.getResults = this.getResults.bind(this);
  }

  /** 
   * Helper function to set the new data from the clicked even
   * @param e Event (Object)
   * @returns New state which re-renders child components and new data from desired click event 
  */
  getResults(e){
    console.log("App: getResults");
    console.log(e.currentTarget.value)
    const temp = e.currentTarget.value;
    this.setState({ 'chosenApp': temp });
  }

  /**
   *  Once everything gets rendered this function gets called.
   *  This function should call a GET route from the backend to return all test data.
   *  The approach: 
   *    1. GET the data from the backend
   *    2. set the state to the returned data
   *    NOTE: setState will cause a re-render 
   */
  componentDidMount(){
    console.log("App: componentDidMount");
    axios.get('/api/get-dashboard-info')
    .then(res => {
      const tests = res.data.tests
      const apps = res.data.apps
      this.setState({
        "allApplications": apps,
        "tests": tests,
        "testFrequencies": { 
          "data": res.data.test_frequencies.counts,
          "labels": res.data.test_frequencies.dates
        }
      });
    })
  }


render(){
  console.log("App: Render");

  const tests = this.state;
  const t = this.state.tests;
  const apps = this.state.allApplications;
  
  return (
    <div style={entityStyle}>
      <Box height={1} display="flex" border={1}>
        <Left className="left-layout" apps={apps} getResults={this.getResults}/> 
        
        {/* Conditional rendering below says if our requested data is empty then we render a different component */}
        {t.length > 0 
          ? <Right tests={tests} testFrequencies={this.state.testFrequencies}/>
          : <h1>Loading data</h1>
        }
        
      </Box>
    </div>
  )}
}

// Below is JSX style; like CSS except we initialize inside the file that uses it
const entityStyle = {
  height: "100%",
  backgroundColor: 'black'
}


export default App;