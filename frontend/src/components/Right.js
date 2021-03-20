import React from 'react'
import { Box, Grid, Paper } from '@material-ui/core'
import { CustomTable } from "./CustomTable"
// import axios from 'axios'


const Right = ({ tests }) => {

    console.log("Right: ")
    const data = tests.tests;
    console.log(data);

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
                    <CustomTable data={data}/>
                </Grid>
                <Grid item xs={4}>
                    {/* Graph 4 */}
                    <Paper>
                        Graph 4
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
};


const rightStyle = {
    height: "100%",
    backgroundColor: "teal",
    flex: '6',
}

export default Right;