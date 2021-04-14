import React, { Component } from 'react'
import { Box, Grid, Paper } from '@material-ui/core'
import MaterialTable from 'material-table'
import StackedBar from './StackedBar'
import axios from 'axios';
import LineGraph from './LineGraph';


class Right extends Component {
    constructor(props){
        console.log("Right: Constructor")
        super(props);  

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
        if(prevProps.tests.chosenApp !== this.props.tests.chosenApp){
            console.log("Right: inside update conditional ")
            console.log("else")
            axios.get('/api/query-tests?apply_filters=true&app=' + this.props.tests.chosenApp)
            .then(res => {
                const data = res.data.query_results;
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
                            <StackedBar t={this.state}/>
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
                            Graph3
                        </Paper>
                    </Grid>
                    <Grid item xs={8}>
                        {/* Data Table */}
                        <MaterialTable
                            title="Test Data"
                            data={tests}
                            columns={[
                                { title: "App", field: "app"},
                                { title: "Entry Date", field: "entry_date"},
                                { title: "Execution Time", field: "execution_time"},
                                { title: "Test", field: "test"},
                                { title: "Test Id", field: "test_id"},
                                { title: "Status", field: "test_status"},
                                { title: "Type", field: "test_type"},
                                { title: "Times Run", field: "times_run"},
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
    // height: "5%",
    //backgroundColor: "teal",
    flex: '6',
}
export default Right;