import React from 'react'
import { useState, useEffect } from 'react'
import { Box, Grid, Paper } from '@material-ui/core'
// import { CustomTable } from "./CustomTable"
import MaterialTable from 'material-table'
import axios from 'axios';
// import axios from 'axios'


const Right = ({ tests }) => {

    console.log("Right: ")
    // const data = tests.tests;
    // console.log(data);

    // const tsts = tests;

    const [data, setData] = useState([])
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

    useEffect(() =>{
        axios.get('/api/get-dashboard-info')
        .then(res => {
          console.log(res);
          const tests = res.data.tests
        //   const apps = res.data.apps
          setData(tests)
        //   this.setState({
        //     "allApplications": apps,
        //     "tests": tests
        //   });
        })
    },[])


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
                        {/* {props.hello} */}
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
                        data={data}
                        columns={columns}
                    />
                    {/* <CustomTable data={data}/> */}
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
};


const rightStyle = {
    height: "100%",
    backgroundColor: "teal",
    flex: '6',
}

export default Right;