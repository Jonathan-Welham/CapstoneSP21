import React, { Component } from 'react'
import { Box, Grid, Paper } from '@material-ui/core'
import MaterialTable from 'material-table'
import StackedBar from './StackedBar'
import axios from 'axios';
import LineGraph from './LineGraph';
import ScatterChart from './ScatterChart'


// const columns = [
//     { title: "app_name", field: "app"},
//     { title: "entry_date", field: "entry_date"},
//     { title: "execution_time", field: "execution_time"},
//     { title: "test", field: "test"},
//     { title: "test_id", field: "test_id"},
//     { title: "test_status", field: "test_status"},
//     { title: "test_type", field: "test_type"},
//     { title: "times_run", field: "times_run"},
// ]


class Right extends Component {


    constructor(props){
        console.log("Right: Constructor")
        super(props);
        // this.localData = this.props.tests.tests;
        // console.log(this.localData)    

        this.state = {
            "allApplications": [],
            "tests": [],
            "chosenApp": '',
            "testFrequencies": {}
        }    
    }

    componentDidMount(){
        console.log("Right: componentDidMount")
        this.setState(
        {   "tests": this.props.tests.tests, 
            "allApplications": this.props.tests.allApplications,
            "chosenApp": this.props.tests.chosenApp,
            "testFrequencies": this.props.testFrequencies
        });
    }

    componentDidUpdate(prevProps, prevState){
        console.log("Right: componentDidUpdate")
        console.log(Date.parse(new Date()));

        // if(this.localData === undefined){
        //     return console.log("You're clicking too quickly, slow down")
        // }

        // if(this.localData.length === 0){
        //     /*
        //         BE AWARE: If there are no tests for an app this conditional will result with a very heavy infinite loop
        //     */
        //     this.localData = this.props.tests.tests;
        //     this.forceUpdate();
        // }

        console.log(prevProps.tests.chosenApp)
        console.log(this.props.tests.chosenApp)
        console.log(prevState.chosenApp)
        console.log(this.state.chosenApp)

        if(prevProps.tests.chosenApp !== this.props.tests.chosenApp){
            console.log("Right: inside update conditional ")
            console.log("else")
            axios.get('/api/query-tests?apply_filters=true&app=' + this.props.tests.chosenApp)
            .then(res => {
                // const temp = res.data;
                // console.log(temp);
                const data = res.data.query_results;
                // console.log(data);
                // this.localData = data;
                // this.forceUpdate();
                this.setState({"tests": data, "chosenApp": this.props.tests.chosenApp});
            });

            axios.get('/api/get-test-frequencies?app=' + this.props.tests.chosenApp).then(res => {
                let data = {}
                data["data"] = res.data.counts;
                data["labels"] = res.data.dates;
                this.setState({"testFrequencies": data});
            });
            
        }
    }

    render(){
        console.log("Right: render")
        console.log(Date.parse(new Date()));
        // console.log(this.localData)
        // console.log(this.props.tests)
        const tests = this.state.tests;

        return(
            <Box className="right-box" display='flex' style={rightStyle} border={1}>
                <Grid 
                    container 
                    direction="row"
                    spacing={2}
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs={4}>
                        {/* Graph 1 */}
                        <Paper>
                            <StackedBar/>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        {/* Graph 2 */}
                        <Paper>
                            <LineGraph
                                data={this.state["testFrequencies"]}
                                title={"graph"}
                                color="#70CAD1"
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        {/* Graph 3 */}
                        <Paper>
                            <ScatterChart data={this.state["tests"]}/>
                        </Paper>
                    </Grid>
                    <Grid item xs={8}>
                        {/* Data Table */}
                        {/* {tests.length > 0 
                            ?   <MaterialTable
                                    title="Test Data"
                                    data={tests}
                                    columns={columns}
                                />
                            :   <MaterialTable
                                    title="Test Data"
                                    data={this.props.tests.tests}
                                    columns={columns}
                                />
                        } */}
                        <MaterialTable
                            title="Test Data"
                            data={tests}
                            columns={[
                                { title: "app_name", field: "app"},
                                { title: "entry_date", field: "entry_date"},
                                { title: "execution_time", field: "execution_time"},
                                { title: "test", field: "test"},
                                { title: "test_id", field: "test_id"},
                                { title: "test_status", field: "test_status"},
                                { title: "test_type", field: "test_type"},
                                { title: "times_run", field: "times_run"},
                            ]}
                        />
                        
                    </Grid>
                    <Grid item xs={4}>
                        {/* Graph 4 */}
                        <Paper>
                            Graph 4
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        );
    }
    
}


const rightStyle = {
    height: "100%",
    //backgroundColor: "teal",
    flex: '6',
}

export default Right;