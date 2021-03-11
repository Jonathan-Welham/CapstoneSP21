import React, { Component } from 'react'
import { Box, Grid, Paper } from '@material-ui/core'
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead } from '@material-ui/core'
// import { TableFooter, TablePagination } from '@material-ui/core'
// import { IconButton, FirstPageIcon, KeyboardArrowLeft, KeyboardArrowRight, LastPageIcon } from '@material-ui/icons'


class Right extends Component{


    render(){


        return (

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
                                        <TableCell>testId </TableCell>
                                        <TableCell align="right">applicationUnderTest</TableCell>
                                        <TableCell align="right">testType</TableCell>
                                        <TableCell align="right">test </TableCell>
                                        <TableCell align="right">executionTime </TableCell>  
                                        <TableCell align="right">result </TableCell>  
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.props.tests.tests.map((test) => (
                                        <TableRow key={test.app_id}>
                                            <TableCell component="th" scope="test">
                                                {test.app_id}
                                            </TableCell>
                                            <TableCell align="right">{this.props.tests.applicationUnderTest}</TableCell>
                                            <TableCell align="right">{test.testType}</TableCell>
                                            <TableCell align="right">{test.test} </TableCell>
                                            <TableCell align="right">{test.executionTime} </TableCell>                                
                                            <TableCell align="right">{test.result} </TableCell>                                             
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
    backgroundColor: "teal",
    flex: '6',
}

export default Right
