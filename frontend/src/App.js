// import { useState, useEffect, Component } from 'react'
// import { Grid } from '@material-ui/core'
// import PropTypes from 'prop-types'
// import { sizing } from '@material-ui/system';

// import Body from "./components/Body"
// import Header from "./components/Header"
// import Table from "./components/Table"
import { Component } from 'react'
import "./App.css"
import Left from "./components/Left"
import Right from "./components/Right"
import { Box } from '@material-ui/core'

class App extends Component{

  // Constructor will only work in classes
  // Class App extends React.Component{}
  constructor(props){
    super(props);

    this.state = {
        "allApplications": [],
        "applicationUnderTest": "applicationUnderTest",
        "testType": "testType",
        "totalExecutionTime": "",
        "tests": []
    };

  }

  componentDidMount(){
    // Once everything gets rendered this function gets called.
    // This function should call all tests for display on the table

      console.log("componentDidMount");

      // TODO: Implement default GET * tests query

      return this.setState({
        "applicationUnderTest": "Policy Center",
        "testType": "Selenium",
        "executionTime": 300,
        "tests": [
            {
              "testId": 1,
              "testType": "Selenium",
              "test": "should be able to log in",
              "executionTime": 150,
              "result": "pass"
            },
            {
              "testId": 2,
              "testType": "Travis",
              "test": "should be able to create a policy",
              "executionTime": 50,
              "result": "pass"
            }, 
            {
              "testId": 3,
              "testType": "Jenkins",
              "test": "should be able to create an account",
              "executionTime": 100,
              "result": "fail"
            }
        ]
    })

    // const [tests, setTests] = useState([])

    // useEffect(() => {
    //   const getTests = async () =>{
    //     const testsFromServer = await fetchTests()
    //     setTests(testsFromServer)
    //   }
    //   getTests()
    // }, [])


    // // Fetch tests
    // const fetchTests = async () =>{
    //   const res = await fetch('http://localhost:3000/tests')
    //   const data = await res.json()

    //   return data
    // }

    
  }

  bake(){
    console.log("hello");
  }


render(){
  return (
    // <div className="container">
    //   <Header />
    //   {/* Will have to pass tests into body */}
    //   <Body tests={tests}/>
    
    
    <div style={entityStyle}>
      <Box height={1} display="flex" border={1}>
        <Left tests = {this.state} updateResults={() => this.bake()}/>
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