import { Component, React } from 'react'
import { Box, Button } from '@material-ui/core'
// import { height } from '@material-ui/system'

class Left extends Component {

    constructor(props){
        super(props);
        this.state = {
            tests: []
        };
    }


    // getSuiteOne() {
    //     // GET suiteOne specific results
    //     this.props.updateResult;
    // }

    componentDidMount(){
        this.setState(this.props.tests);
    }


    // onclick => API Call depending on suite returns newData => this.setState(newData)

    render(){
        return (
            <Box display='flex' style={leftStyle} border={1}>
                <Button>All</Button>
                <Button onClick={() => this.updateResult}>Suite 1</Button>
                <Button>Suite 2</Button>
                <Button>Suite 3</Button>
                <Button>Suite 4</Button>
                <Button>Suite 5</Button>
            </Box>

        )
    }
}

const leftStyle = {
    backgroundColor: "royalblue",
    // alignItems: "stretch",
    flex: '1',
    flexDirection: 'column',
    justifyContent: "center",
    // justifyContent: "space-around",
}

export default Left
