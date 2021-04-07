import React, { Component } from 'react'
import { Box, Grid, Paper } from '@material-ui/core'
import MaterialTable from 'material-table'
import StackedBar from './StackedBar'
import axios from 'axios';
class Right extends Component {
    constructor(props){
        console.log("Right: Constructor")
        super(props);
        this.state = {
            "allApplications": [],
            "tests": [],
            "chosenApp": '',
        }    
    }
    componentDidMount(){
        console.log("Right: componentDidMount")
        this.setState(
        {   "tests": this.props.tests.tests, 
            "allApplications": this.props.tests.allApplications,
            "chosenApp": this.props.tests.chosenApp,
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
        }
    }
    render(){
        console.log("Right: render")
        const tests = this.state.tests;
        console.log(this.state)
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
                            Graph2
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
                                { title: "App", field: "app"},
                                { title: "Entry Date", field: "entry_date"},
                                { title: "Execution Time", field: "execution_time"},
                                { title: "Test", field: "test"},
                                { title: "Test Id", field: "test_id"},
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