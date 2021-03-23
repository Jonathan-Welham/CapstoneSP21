import React, { Component } from 'react'
import { Box, Grid, Paper } from '@material-ui/core'
import MaterialTable from 'material-table'
import axios from 'axios';

const columns = [
    { title: "app_name", field: "app"},
    { title: "entry_date", field: "entry_date"},
    { title: "execution_time", field: "execution_time"},
    { title: "test", field: "test"},
    { title: "test_id", field: "test_id"},
    { title: "test_status", field: "test_status"},
    { title: "test_type", field: "test_type"},
    { title: "times_run", field: "times_run"},
]


class Right extends Component {


    constructor(props){
        console.log("Right: Constructor")
        super(props);
        this.localData = this.props.tests.tests;        
    }

    componentDidMount(){
        console.log("Right: componentDidMount")
    }

    componentDidUpdate(prevProps){
        console.log("Right: componentDidUpdate")

        if(this.localData === undefined){
            return console.log("You're clicking too quickly, slow down")
        }

        if(this.localData.length === 0){
            /*
                BE AWARE: If there are no tests for an app this conditional will result with a very heavy infinite loop
            */
            this.localData = this.props.tests.tests;
            this.forceUpdate();
        }

        if(prevProps.tests.chosenApp !== this.props.tests.chosenApp){
            console.log("Right: inside update conditional ")
            if(this.props.tests.chosenApp === ''){
                console.log("return")
                return;
            } else {
                console.log("else")
                axios.get('/api/query-tests?apply_filters=true&app=' + this.props.tests.chosenApp)
                .then(res => {
                    const data = res.data.query_results;
                    // console.log(data);
                    this.localData = data;
                    this.forceUpdate();
                });
            }
            
        }

    }

    render(){
        console.log("Right: render")
        console.log(this.localData)
        return(
            <Box display='flex' style={rightStyle} border={1}>
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
                            Graph 1
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
                        <MaterialTable
                            title="Test Data"
                            data={this.localData}
                            columns={columns}
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
    backgroundColor: "teal",
    flex: '6',
}

export default Right;