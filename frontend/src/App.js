
import { Component } from 'react'
import "./App.css"
import Left from "./components/Left"
import Right from "./components/Right"
import { Box } from '@material-ui/core'
import axios from 'axios'

class App extends Component{

  constructor(){
    super();

    console.log("App: Constructor");
    this.state = {
        "allApplications": [],
        "applicationUnderTest": "",
        "testType": "",
        "totalExecutionTime": "",
        "tests": []
    };
    
    this.getResults = this.getResults.bind(this);
  }

  getInitialData(){
    axios.get('/api/get-dashboard-info')
    .then(res => {
      // console.log(res);
      const apps = res.data.apps;
      const tests = res.data.tests
      this.setState({
        "allApplications": apps,
        "tests": tests
      });
    })
  }

  // GET test results for clicked suite
  getResults(e){
    console.log("App: getResults");
    e.preventDefault();

    // console.log(e.target.innerHTML);

    const temp = e.target.innerHTML;

    axios.get('/api/query-tests?apply_filters=true&app=' + temp)
    .then(res => {
      const data = res.data;
      // console.log(data);
      this.setState({ 'tests': data.query_results });
    })

  }

  componentDidMount(){
    // Once everything gets rendered this function gets called.

    // This function should call all tests for display on the table
    console.log("App: componentDidMount");
    this.getInitialData();

    
    // axios.get('/api/get-dashboard-info')
    // .then(res => {
    //   // console.log(res);
    //   const apps = res.data.apps;
    //   const tests = res.data.tests
    //   this.setState({
    //     "allApplications": apps,
    //     "tests": tests
    //   });
    // })
  }

render(){
  console.log("App: Render");
  // console.log(this.state);
  return (
    <div style={entityStyle}>
      <Box height={1} display="flex" border={1}>
        <Left apps={this.state.allApplications} getResults={this.getResults}/>
        <Right tests={this.state}/>
      </Box>
    </div>
  )}
}

const entityStyle = {
  height: "100%",
  backgroundColor: 'black'
}


export default App;