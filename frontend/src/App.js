
import { Component } from 'react'
import "./App.css"
import Left from "./components/Left"
import Right from "./components/Right"
import { Box } from '@material-ui/core'
import axios from 'axios'

class App extends Component{

  constructor(props){
    super(props);

    this.state = {
        "allApplications": [],
        "applicationUnderTest": "",
        "testType": "",
        "totalExecutionTime": "",
        "tests": []
    };
    this.getResults = this.getResults.bind(this);
  }


  // GET test results for clicked suite
  getResults(e){
    e.preventDefault();

    console.log(e.target.innerHTML);

    const temp = e.target.innerHTML;

    axios.get('/api/query-tests?apply_filters=true&app=' + temp)
    .then(res => {
      const data = res.data;
      console.log(data);
      this.setState({ 'tests': data.query_results });
    })

    // this.setState(() => {
    //   return {
    //     'applicationUnderTest': "Selenium",
    //     'tests': [
    //       {
    //         'testId': 44,
    //         'testType': "test Suite n",
    //         'test': "Should be able to Login and break everything",
    //         'executionTime': 500,
    //         'result': "fail"
    //       }
    //     ]
    //   }
    // });

  }

  componentDidMount(){
    // Once everything gets rendered this function gets called.

    // This function should call all tests for display on the table

    axios.get('/api/get-apps')
    .then(res => {
      const apps = res.data;
      console.log(res);
      this.setState({
        "allApplications": apps,
      });
    })

    
  }


render(){
  return (
    <div style={entityStyle}>
      <Box className="left-box">
        <Left apps={this.state.allApplications} getResults={this.getResults}/>
      </Box>
      <Box height={1} display="flex">
        <Right tests={this.state}/>
      </Box>
    </div>
  )}
}

const entityStyle = {
  height: "100%",
  //backgroundColor: 'black'
}


export default App;