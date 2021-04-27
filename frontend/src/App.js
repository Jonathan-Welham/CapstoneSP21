
import { Component } from 'react'
import "./App.css"
import Left from "./components/Left"
import Right from "./components/Right"
import { Box } from '@material-ui/core'
import axios from 'axios'

class App extends Component{

  constructor(props){
    super(props);

    console.log("App: Constructor");
    this.state = {
        "allApplications": [],
        "tests": [],
        'chosenApp': ''
    };
    this.getResults = this.getResults.bind(this);
  }

  // GET test results for clicked suite
  getResults(e){
    console.log("App: getResults");
    console.log(e.currentTarget.value)
    const temp = e.currentTarget.value;
    this.setState({ 'chosenApp': temp });
  }

  comp(a, b){
    return new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime();
}

  // Once everything gets rendered this function gets called.
  // This function should call all tests for display on the table
  componentDidMount(){
    console.log("App: componentDidMount");

    axios.get('/api/get-dashboard-info')
    .then(res => {
      const tests = res.data.tests.sort(this.comp).reverse();
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
        {t.length > 0 
          ? <Right tests={tests} testFrequencies={this.state.testFrequencies}/>
          : <h1>Loading data</h1>
        }
        </Box>
    </div>
  )}
}

const entityStyle = {
  height: "100%",
  backgroundColor: 'black'
}


export default App;