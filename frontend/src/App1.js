// import { ReactComponent } from '*.svg';
import React, {Component} from 'react'
// import TestResultsDisplay from "./TestResultsDisplay";
// We may move this functions
const TestResultsDisplay = (props) =>(
    <div className = "TestResultsDisplay">
        {props.testId}
        {props.condition}
        {props.empId}
        {props.date}
        {props.time}
        {props.email}
    </div>
);

class App extends Component{
        // _SUDO BELOW_
        // props === env Keys
        // connect to db
        // grab data
        // Encase above in while(true), running asynchronously
        // this.state = results;
        // I think we want to move this contstructor to TestResultsDisplay.jsx
    constructor(props){
        super(props);
        this.state = {
            results: [
                // testObject: parseResult(); Instead of below
                {   
                    testId: "this",
                    condition: "Pass" ,
                    empId: "-",
                    date: "02-23-21",
                    time: "11:48am",
                    email: "example@cig.insurance.com"
            
                }
            ]
        };
    }
    
    render(){
        return(
            <div>
                {/* Not sure if we need a nav or it will be something else
                    React is a SINGLE PAGE application
                */}
                {/* <nav /> */}
                {/* Make filters change state affect results*/}
                {/* <Filter /> */}
                {/* I think we need to wrap below in a container */}
                <TestResultsDisplay 
                    // Call component
                    // Loop through results 
                    testId={this.state.results[0].testId}
                    condition={this.state.results[0].condition}
                    empId={this.state.results[0].empId}
                    date={this.state.results[0].date}
                    time={this.state.results[0].time}
                    email={this.state.results[0].email}
                />
            </div>
        );
    }
}
export default App;