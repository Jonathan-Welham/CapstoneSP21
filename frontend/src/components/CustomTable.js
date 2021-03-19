import React from 'react'
import Paper from '@material-ui/core/Paper'
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead } from '@material-ui/core'
// import { TableFooter, TablePagination } from '@material-ui/core'
// import { IconButton, FirstPageIcon, KeyboardArrowLeft, KeyboardArrowRight, LastPageIcon } from '@material-ui/icons'

export const CustomTable = (props) => {
    const data = props.data;
    return(
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell> app_name </TableCell>
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
                    {data.map((test) => (
                        <TableRow key={test.app}>
                            <TableCell component="th" scope="test">
                                {test.app}
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
    )
};