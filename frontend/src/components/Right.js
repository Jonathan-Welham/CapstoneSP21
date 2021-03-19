import { React, Component } from 'react'
import { Box, Grid, Paper } from '@material-ui/core'
import { CustomTable } from "./CustomTable"
import axios from 'axios'


class Right extends Component {
    state = {
        'tests': [],
        'chosenApp': ''
    }

    getInitialData(){
        axios.get('/api/get-dashboard-info')
        .then(res => {
          console.log(res);
          const tests = res.data.tests
          this.setState({
            "tests": tests
          });
        })
      }

    componentDidMount() {
        console.log("Right: ComponentDidMount")
        // console.log("Right: state")
        // console.log(this.state)
        // this.handleUpdateTests();
        this.getInitialData();
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("Right: ComponentDidUpdate")


        console.log("prevProps")
        console.log(prevProps)
        console.log("prevState")
        console.log(prevState)
        console.log("this.state")
        console.log(this.state)

      
        // this.state.chosenApp = this.props.chosenApp;

        if (prevProps !== this.state) {
            console.log("Right: prevState !== this.state")
            this.handleUpdateTests();
        }
    }

    handleUpdateTests = () => {
        console.log("Right: handleUpdateTests")
        if(this.props === ''){
            return;
        } else{
            axios.get('/api/query-tests?apply_filters=true&app=' + this.props)
            .then(res => {
                const data = res.data;
                // console.log(data);
                this.setState({ 'tests': data.query_results });
            });
        }

    }


    render(){
        console.log("Right: Render")
        // console.log(this.state)
        // console.log(this.props)


        const data = this.state.tests;
        console.log(data);

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
    }
}


const rightStyle = {
    height: "100%",
    backgroundColor: "teal",
    flex: '6',
}

export default Right;