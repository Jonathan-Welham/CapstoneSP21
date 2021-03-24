import React, { Component } from 'react'
import { Box, Grid, Paper } from '@material-ui/core'
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead } from '@material-ui/core'
// import { TableFooter, TablePagination } from '@material-ui/core'
// import { IconButton, FirstPageIcon, KeyboardArrowLeft, KeyboardArrowRight, LastPageIcon } from '@material-ui/icons'


class Right extends Component{

    
    render(){

        return (

            <Box className="right-box" display='flex' style={rightStyle}>
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
                            Hello
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
                        <TableContainer component={Paper} >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell> app_id </TableCell>
                                        <TableCell align="right">entry_date</TableCell>
                                        <TableCell align="right">execution_time</TableCell>
                                        <TableCell align="right">test</TableCell>
                                        <TableCell align="right">test_id</TableCell>
                                        <TableCell align="right">test_status </TableCell>  
                                        <TableCell align="right"> test_type_id </TableCell>
                                        <TableCell align="right"> times_run </TableCell>  
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.props.tests.tests.map((test) => (
                                        <TableRow key={test.app_id}>
                                            <TableCell component="th" scope="test">
                                                {test.app_id}
                                            </TableCell>
                                            {/* <TableCell align="right">{this.props.tests.applicationUnderTest}</TableCell> */}
                                            <TableCell align="right">{test.entry_date}</TableCell>
                                            <TableCell align="right">{test.execution_time}</TableCell>
                                            <TableCell align="right">{test.test}</TableCell>
                                            <TableCell align="right">{test.test_id} </TableCell>
                                            <TableCell align="right">{test.test_status} </TableCell>                                
                                            <TableCell align="right">{test.test_type_id} </TableCell> 
                                            <TableCell align="right">{test.times_run} </TableCell>                                              
                                        </TableRow>
                                    ))}                                    
                                </TableBody>
                            </Table>
                        </TableContainer>
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
    }
}


const rightStyle = {
    height: "100%",
    //backgroundColor: "teal",
    flex: '6',
}

export default Right
